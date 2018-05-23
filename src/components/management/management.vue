<template>
  <div class="management">
    <div class="alert-container">
      <v-alert
        :value="alert.toggle"
        :type="alert.type"
        transition="slide-y-transition"
        :icon="alert.icon"
        @click="alertHide"
        ref="alert"
      >
        {{alert.text}}
      </v-alert>
    </div>
    <div class="loading-container" v-if="searching">
      <v-progress-circular :width="3" :size="50" indeterminate color="green"></v-progress-circular>
    </div>
    <no-result v-show="!manageList.length && !searching" :title="noResultText"></no-result>
    <v-layout row wrap>
      <v-flex
        xs12
        sm12
        md12
        lg12
      >
        <v-toolbar color="green" :dark="false">
          <v-btn icon @click="backHome">
            <v-icon>home</v-icon>
          </v-btn>
          <v-toolbar-title>后台管理</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-layout row align-center style="max-width: 650px">
            <v-text-field
              ref="searchField"
              :append-icon-cb="getSearchMovies"
              @keypress.enter="getSearchMovies"
              placeholder="Search..."
              single-line
              append-icon="search"
              color="white"
              hide-details
              v-model="searchValue"
            ></v-text-field>
          </v-layout>
          <v-btn dark class="mb-2 mr-2 add-file" @click="newItem" style="font-weight:bold">添加</v-btn>
        </v-toolbar>
      </v-flex>
    </v-layout>
    
    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title>
          <span class="headline">{{ editTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md>
            <v-layout wrap>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.title" label="标题"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.video" label="视频地址(http)"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.poster" label="海报地址(http)"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.year" label="上映年份"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.rate" label="评分"></v-text-field>
              </v-flex>
              <v-flex xs12 sm6 md4>
                <v-text-field v-model="editedItem.summary" label="简介"></v-text-field>
              </v-flex>
              <v-flex lg12 xs12 sm12 md12>
                <v-select
                  :items="people"
                  v-model="editedItem.movieTypes"
                  label="分类"
                  item-text="name"
                  item-value="name"
                  multiple
                  chips
                  max-height="auto"
                  autocomplete
                >
                  <template slot="selection" slot-scope="data">
                    <v-chip
                      :selected="data.selected"
                      :key="JSON.stringify(data.item)"
                      close
                      class="chip--select-multi"
                      @input="data.parent.selectItem(data.item)"
                    >
                      <v-avatar>
                        <img>
                      </v-avatar>
                      {{ data.item.name }}
                    </v-chip>
                  </template>
                  <template slot="item" slot-scope="data">
                    <template v-if="typeof data.item !== 'object'">
                      <v-list-tile-content v-text="data.item"></v-list-tile-content>
                    </template>
                    <template v-else>
                      <v-list-tile-avatar>
                        <img :src="data.item.avatar">
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="data.item.name"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="data.item.group"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </template>
                  </template>
                </v-select>
              </v-flex>
              <v-flex>
                <v-switch
                  :label="`同步到七牛云: ${editedItem.uptoQiniu.toString()}`"
                  v-model="editedItem.uptoQiniu"
                  color="green"
                >
                </v-switch>
              </v-flex>
            </v-layout>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="green darken-1" flat @click.native="close">Cancel</v-btn>
          <v-btn color="green darken-1" flat @click.native="save">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table
      :headers="headers"
      :items="manageList"
      :disable-initial-sort="true"
      hide-actions
      class="data-table"
      v-if="manageList.length&&!searching"
    >
      <template slot="items" slot-scope="props">
        <td>
          <v-card>
            <v-card-media v-lazy:background-image="addBase(props.item, 'poster')" height="200">
            </v-card-media>
          </v-card>
        </td>
        <td class="text-xs-left">{{ props.item.title }}</td>
        <td class="text-xs-left">{{ parseFloat(props.item.rate) }}</td>
        <td class="text-xs-left">{{ formateDate(props.item.meta.updatedAt) }}</td>
        <td class="text-xs-left">{{ formateDate(props.item.meta.createdAt) }}</td>
        <td class="text-xs-left">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="deleteItem(props.item)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
    </v-data-table>
    <v-container fluid class="loadmore-container" >
      <v-progress-circular :width="3" :size="30" indeterminate color="amber" v-show="manageList.length && !searching && hasMore"></v-progress-circular>
      <p class="text" v-show="manageList.length && !searching">{{loadMoreText}}</p>
    </v-container>
  </div>
</template>

<script>
import {baseUrlMixin} from '../../common/js/mixin.js'
import NoResult from '../../base/no-result/no-result.vue'

const LENGTH = 10 // 每次请求10条数据
const LOADHEIGHT = 40 // 加载更多容器高度

export default {
  name: 'management',
  mixins: [baseUrlMixin],
  data() {
    return {
      manageList: [],
      dialog: false,
      searching: true,
      searchValue: '',
      start: 0,
      loadMoreText: '加载中',
      hasMore: true,
      
      noResultText: '找不到你要的内容',
      
      headers: [
        {
          text: '海报',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: '名字', value: 'title' },
        { text: '评分', value: 'rate' },
        { text: '修改时间', value: 'meta.updatedAt' },
        { text: '添加时间', value: 'meta.createdAt' },
        { text: '操作', value: 'name', sortable: false }
      ],
      editedIndex: -1,
      editedItem: {
        "title": "",
        "rate": 0,
        "video": "",
        "cover": "",
        "poster": "",
        "summary": "简介",
        "year": 2018,
        "tags": ["新添加的"],
        "movieTypes": [],
        "uptoQiniu": true,
        "pubdate": [{
            "date": "2018-04-13T00:00:00.000Z",
            "country": "中国大陆"
        }]
      },
      defaultItem: {
        "title": "",
        "rate": 0,
        "video": "",
        "cover": "",
        "poster": "",
        "summary": "简介",
        "year": 2018,
        "tags": ["新添加的"],
        "movieTypes": [],
        "uptoQiniu": true,
        "pubdate": [{
            "date": "2018-04-13T00:00:00.000Z",
            "country": "中国大陆"
        }]
      },
      movieTypes: [],
      people: [
       { header: '类别' },
       { name: '恐怖', group: '类别'},
       { name: '惊悚', group: '类别'},
       { name: '喜剧', group: '类别'},
       { name: '爱情', group: '类别'},
       { name: '剧情', group: '类别'},
       { name: '动画', group: '类别'},
       { name: '冒险', group: '类别'},
       { name: '家庭', group: '类别'},
       { name: '其他', group: '类别'},
       { divider: true },
       { header: '私人专用' },
       { name: '给老陈的美剧', group: '私人专用'},
      ],
      alert: {
       toggle: false,
       type: 'warning',
       icon: 'check_circle'
      }
    }
  },
  computed: {
    editTitle () {
      return this.editedIndex === -1 ? '添加电影' : '编辑电影'
    }
  },
  beforeRouteEnter(to, from ,next) {
    // 未登录
    let cookies = {}
    document.cookie.split(';').map((item) => {
      if (!item) return
      cookies[[item.split('=')[0].trim()]] = item.split('=')[1].trim()
    })
    if (!cookies['koa:sess'] || !cookies['koa:sess.sig']) {
      next(vm => {
        vm.$router.replace('/login')
      })
      return
    }
    next()
  },
  components: {
    NoResult
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
    searchValue(val) {
      if (val === '') {
        this.$router.push('/management')
        this.fetchMovies(true, false)
      }
    }
  },
  
  created () {
    this.fetchMovies(true, false) // 获取基础数据
    
    window.addEventListener('scroll', (e) => { // 下滚加载更多
      if (!this.hasMore) return
      if (window.pageYOffset + LOADHEIGHT> document.body.clientHeight - window.innerHeight) {
        clearTimeout(this.loadTimer)
        this.loadTimer = setTimeout(() => { // 节流
          this.start += LENGTH
          this.fetchMovies(false, !!this.$route.query.search)
        }, 100)
      }
    }, false)
  },

  methods: {
    fetchMovies(isInit, isSearch) { // 获取数据方法封装
      let baseUrl = isSearch ? `/api/v0/movies/search/?search=${this.searchValue}&` : `/admin/movie/list/?` 
      
      if (isInit) {
        baseUrl += `start=0&end=10`
        this.initData(baseUrl)
      } else {
        this.loadMore(baseUrl)
      }
    },
    initData(baseUrl) { // 加载基础数据
      this.start = 0
      this.hasMore = true
      this.loadMoreText = '加载中'
      
      clearTimeout(this.searchTimer) // 修复搜素后不能聚焦
      this.searchTimer = setTimeout(() => {
        this.$refs.searchField.$el.firstElementChild.firstElementChild.focus()
      }, 20)
      
      this.searching = true
      this.noResultText = '找不到你想要的内容'
      this.$http.get(baseUrl).then(res => {
        this.searching = false
        if (res.data.success) {
          this.manageList = res.data.movies
          if (res.data.total === this.manageList.length) {
            this.hasMore = false
            this.loadMoreText = '-----到底怎么了-----'
          }
        }
      })
    },
    loadMore(baseUrl) { // 加载更多
      this.noResultText = '换个搜索词试试'
      this.$http.get(`${baseUrl}start=${this.start}&end=${this.start + LENGTH}`)
      .then(res => {
        if (res.data.success) {
          this.manageList = this.manageList.concat(res.data.movies)
          if (this.manageList.length === res.data.total) {
            this.hasMore = false
            this.loadMoreText = '-----到底怎么了-----'
          }
        } else {
          this.hasMore = false
          this.loadMoreText = '-----到底怎么了-----'
        }
      })
    },
    getSearchMovies() { // 搜索 第一批数据
      if (this.searchValue.trim() === '') return
      this.$router.push(`/management/?search=${this.searchValue}`)
      this.manageList = []
      this.fetchMovies(true, true)
    },
    backHome() { // 回到首页
      this.$router.push('/')
    },
    alertShow (type, text) { // 弹窗
      this.$refs.alert.$el.style.zIndex = '999'
      this.alert = {
        toggle: true,
        type: type === 'success' ? 'warning' : 'error',
        icon: type === 'success' ? 'check_circle': 'new_releases',
        text: text
      }
      clearTimeout(this.alerTimer)
      this.alerTimer = setTimeout(() => {
        this.alertHide()
      } ,2000)
    },
    alertHide() {
      this.$refs.alert.$el.style.zIndex  = ''
      this.alert.toggle = false
    },
    formateDate(date) {
      let newDate = new Date(date)
      let year = newDate.getFullYear()
      let month = this.addZero(newDate.getMonth() + 1)
      let theDate = this.addZero(newDate.getDate())
      let hour  = this.addZero(newDate.getHours())
      let min = this.addZero(newDate.getMinutes())
      let sec = this.addZero(newDate.getSeconds())
      let ret = year + '/' + month + '/' + theDate + ' | | ' + hour+ ':' + min + ':' + sec
      return ret
    },
    addZero(d) {
      d = d.toString()
      return d.length < 2 ? '0' + d : d
    },
    newItem() {
      this.dialog = true
      this.editedIndex = -1
      this.editedItem = this.defaultItem
      this.editedItem.doubanId = 'new' + Date.now()
    },
    editItem (item) {
      this.editedItem._id = item._id
      this.editedItem.doubanId = 'new' + Date.now()
      for (let key in this.editedItem) {
        this.editedItem[key] = item[key]
      }
      this.dialog = true
      this.editedIndex = 0
    },
    deleteItem (item) {
      let confirm =  window.confirm('确定要删除' + item.title + '吗')
      if (confirm) {
        this.searching = true
        this.$http.delete(`admin/movies/?id=${item._id}`).then(res => {
          this.searching = false
          if (res.data.success) {
            this.manageList = res.data.data
            this.alertShow('success', '删除成功')
          } else {
            this.alertShow('error', '删除失败')
          }
        })
      }
    },
    close () {
      this.dialog = false
    },
    save () {
      this.editedItem.cover = this.editedItem.poster
      this.editedItem.pubdate[0].date = new Date(new Date().setYear(this.editedItem.year))
      this.searching = true
      this.$http.post('/admin/upload', {
        movie: this.editedItem
      }).then(res => {
        this.searching = false
        if (res.data.success) {
          this.manageList = res.data.data
          this.alertShow('success', this.editedIndex === -1 ? '添加成功' : '修改成功')
        } else {
          this.alertShow('error', this.editedIndex === -1 ? '添加失败' : '修改失败')
        }
      })
      this.close()
    }
  }
}
</script>


<style media="screen">
.management .data-table thead{
  background: rgb(42, 47, 39);
}
.management .data-table .text-xs-left{
  font-size: 18px !important;
}
.management .data-table .card__media__content{
  width: 200px !important;
}
.management .data-table .card__media {
  background-position: 0 center  !important;
  background-size: 100%;
}

.management .loading-container{
  position: fixed;
  left: 50%;
  top: 44%;
  transform: translateX(-100%);
  z-index: 1000;
}

.management .alert-container .alert{
  z-index: 1000;
  position: fixed;
  width: 100%;
  height: 50px;
  left: 0;
  top: -4px;
}
.management .loadmore-container{
  text-align: center;
  background-color: #303030;
}
.management .loadmore-container .text {
  color: rgb(100, 101, 105);
}
</style>