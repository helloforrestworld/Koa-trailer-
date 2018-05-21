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
             <v-card-media :src="addBase(item, 'poster')" height="200px">
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
    </v-content>
  </div>
</template>
<script>
import axios from 'axios'
import {mapMutations, mapGetters} from 'vuex'
import {baseUrlMixin, handleContent} from '../../common/js/mixin.js'
import NoResult from '../../base/no-result/no-result.vue'

export default {
  name: "home",
  mixins: [baseUrlMixin, handleContent],
  created() {
    // 推荐页数据
    this.fetchMovies(this.$route)
  },
  data() {
    return {
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
    fetchMovies(route) { // 获取电影数据
      let url = `/api/v0/movies/?`
      const year = route.query.year
      const type = route.query.type
      if (year) {
        url += `year=${year}`
      }
      if (type) {
        url += `type=${type}`
      }
      this.changeSearching(true)
      axios.get(url).then(res => {
        this.changeSearching(false)
        if (res.data.success) {
          console.log(res)
          this.refreshList(res.data.movies)
        } else {
          this.refreshList([])
        }
      })
    },
    checkDeatil(item) { // 查看详情
      this.$router.push(`/detail/${item._id}`)
    },
    ...mapMutations({
      'tabVideo': 'tabVideo',
      'refreshList': 'refreshRecommandList',
      'changeSearching': 'changeSearching'
    })
  },
  watch: {
    $route(newRoute) { // 切换分类
      this.fetchMovies(newRoute)
    }
  },
  computed: {
    ...mapGetters(['recommandList', 'searching'])
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
</style>