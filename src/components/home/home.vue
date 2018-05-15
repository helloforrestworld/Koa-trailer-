<template>
  <div class="home">
    <v-content class="content">
      <v-container fluid fill-height>
        <v-layout space-around row wrap>
          <v-flex v-for="(item, index) in recommandList" class="mt-5 mr-3" @click="checkDeatil(item)">
           <v-card class="card">
             <v-card-media :src="addBase(item.posterKey)" height="200px">
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
import {mapMutations} from 'vuex'
import {baseUrlMixin} from '../../common/js/mixin.js'

export default {
  name: "home",
  mixins: [baseUrlMixin],
  created() {
    // 推荐页数据
    axios.get('/api/v0/movies').then(res => {
      this.recommandList = res.data.movies
    })
  },
  data() {
    return {
      recommandList: [] // 首屏数据
    }
  },
  methods: {
    elisSummary(sum) { // 概要截断
      return sum.length > 100 ? sum.slice(0, 100) + '...' : sum
    },
    formateDate(pubdates) { // 格式化发行日期 2017-1-1(美国)/2017-3-1(中国)
      let ret = ''
      pubdates.forEach((pubdate, index) => {
        let now = new Date(pubdate.date)
        ret += now.getFullYear() + '-' + now.getMonth() + '-' + now.getDate()
        if (pubdate.country) {
          ret += `(${pubdate.country})`
          if (!(index === pubdates.length - 1)) ret += '/'
        }
      })
      return ret
    },
    addTrailer(item) { // 播放预告片
      this.tabVideo(item)
    },
    checkDeatil(item) { // 查看详情
      this.$router.push(`/detail/${item._id}`)
    },
    ...mapMutations([
      'tabVideo'
    ])
  }
}
</script>
<style>
  .home .content .card .summary{
    max-width: 300px;
    overflow: hidden;
  }
  .home .content .card {
    height: 460px !important;
  }
</style>