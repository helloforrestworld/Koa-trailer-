<template>
  <div class="home">
    <div class="loading-container" v-show="searching">
      <v-progress-circular :width="3" :size="50" indeterminate color="amber"></v-progress-circular>
    </div>
    <no-result v-show="!recommandList.length" title="找不到你想要的"></no-result>
    <v-content class="content">
      <v-container fluid fill-height>
        <v-layout space-around row wrap v-show="recommandList.length&&!searching">
          <v-flex v-for="(item, index) in recommandList" class="mt-5 mr-3" @click="checkDeatil(item)">
           <v-card class="card">
             <v-card-media  v-lazy:background-image="addBase(item, 'poster')" height="200px">
             </v-card-media>
             <v-card-title primary-title>
               <div>
                 <h3 class="headline mb-0">{{item.title}}</h3>
                 <p class="date">{{formateDate(item.pubdate)}}</p>
                 <div class="summary">{{elisSummary(item.summary)}}</div>
               </div>
             </v-card-title>
             <v-card-actions>
               <v-btn flat color="orange" @click.stop="addTrailer(item)">播放预告片</v-btn>
               <v-btn flat color="orange">详情</v-btn>
             </v-card-actions>
           </v-card>
         </v-flex>
         <v-flex v-for="(item, index) in moreList" class="mt-5 mr-3" @click="checkDeatil(item)">
            <v-card class="card">
              <v-card-media v-lazy:background-image="addBase(item, 'poster')"  height="200px">
              </v-card-media>
              <v-card-title primary-title>
                <div>
                  <h3 class="headline mb-0">{{item.title}}</h3>
                  <p class="date">{{formateDate(item.pubdate)}}</p>
                  <div class="summary">{{elisSummary(item.summary)}}</div>
                </div>
              </v-card-title>
              <v-card-actions>
                <v-btn flat color="orange" @click.stop="addTrailer(item)">播放预告片</v-btn>
                <v-btn flat color="orange">详情</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
      <v-container fluid class="loadmore-container" >
        <v-progress-circular :width="3" :size="30" indeterminate color="amber" v-show="loadMoreShow && !searching"></v-progress-circular>
        <p class="text" v-show="recommandList.length && !searching">{{loadMoreText}}</p>
      </v-container>
    </v-content>
  </div>
</template>
<script>
import {mapMutations, mapGetters} from 'vuex'
import {baseUrlMixin, handleContent} from '../../common/js/mixin.js'
import NoResult from '../../base/no-result/no-result.vue'

const LENGTH = 10 // 每次请求10条数据
const LOADHEIGHT = 40 // 加载更多容器高度

export default {
  name: "home",
  mixins: [baseUrlMixin, handleContent],
  created() {
    this.fetchMovies(true) // 获取基础数据
    
    window.addEventListener('scroll', (e) => { // 下滚加载更多
      if (!this.hasMore) return
      if (window.pageYOffset + LOADHEIGHT> document.body.clientHeight - window.innerHeight) {
        clearTimeout(this.loadTimer)
        this.loadTimer = setTimeout(() => {
          this.start += LENGTH
          this.loadMoreText = '加载中'
          this.fetchMovies(false)
        }, 100)
      }
    }, false)
    
  },
  data() {
    return {
      recommandList: [],
      moreList: [],
      hasMore: true,
      start: 0,
      loadMoreText: '加载中'
    }
  },
  components: {
    NoResult
  },
  methods: {
    elisSummary(sum) { // 概要截断
      if (!sum) return '..没有简介'
      return sum.length > 100 ? sum.slice(0, 100) + '...' : sum
    },
    addTrailer(item) { // 播放预告片
      this.tabVideo(item)
    },
    fetchMovies(isInit) { // 获取电影数据
      const route = this.$route 
      const {year, type, search} = route.query
      let baseUrl = search ? `/api/v0/movies/search/?` : `/api/v0/movies/?`
      
      for (let key in route.query) {
        baseUrl += `${key}=${route.query[key]}&`
      }
      baseUrl = baseUrl.substring(0, baseUrl.length - 1)
      
      if (isInit) {
        baseUrl += `${baseUrl[baseUrl.length - 1] === '/' ? '?' : '&'}start=0&end=10`
        this.initData(baseUrl)
      } else {
        this.loadMore(baseUrl)
      }
    },
    initData(baseUrl) { // 基础数据
      this.$http.get(baseUrl)
        .then(res => {
          this.changeSearchStatus(false)
          if (res.data.success) {
            this.recommandList = res.data.movies
            if (res.data.movies.length === res.data.total) {
              this.loadMoreText = '-----到底怎么了-----'
              this.hasMore = false
            }
          } else {
            this.recommandList = []
          }
        })
    },
    loadMore(baseUrl) { // 加载更多
      this.$http.get(baseUrl, {
        params: {
          start: this.start,
          end: this.start + LENGTH
        }
      }).then(res => {
        if (res.data.success) {
          if (res.data.total === this.moreList.length + this.recommandList.length) {
            this.loadMoreText = '-----到底怎么了-----'
            this.hasMore = false
          }
          this.moreList = this.moreList.concat(res.data.movies)
        }
      })
    },
    checkDeatil(item) { // 查看详情
      this.$router.push(`/detail/${item._id}`)
    },
    ...mapMutations(['tabVideo', 'changeSearchStatus'])
  },
  watch: {
    $route(newRoute) { // 切换分类 或者 搜索
      // 初始化
      this.changeSearchStatus(true)
      this.moreList = []
      this.hasMore = true
      this.loadMoreText = '加载中'
      this.start = 0
      
      this.fetchMovies(true)
    }
  },
  computed: {
    loadMoreShow() {
      return this.recommandList.length && this.hasMore
    },
    ...mapGetters(['searching'])
  }
}
</script>
<style>
  .home .content .card .summary{
    max-width: 300px;
    min-height: 105px;
    overflow: hidden;
  }
  .home .content .card {
    height: 460px !important;
  }
  .home .loading-container{
    position: fixed;
    left: 50%;
    top: 44%;
    transform: translateX(-32px);
    z-index: 1000;
  }
  .home .loadmore-container{
    text-align: center;
    background-color: #303030;
  }
  .home .loadmore-container .text {
    color: rgb(100, 101, 105);
  }
  .home .card__media {
    background-position: 0 center  !important;
    background-size: 100%;
  }
</style>