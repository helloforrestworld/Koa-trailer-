<template>
  <div class="movie-detail">
    <v-content class="content">
      <v-container fluid fill-height>
        <v-layout space-around row wrap>
          <v-flex xs10>
            <div class="detail-player" ref="detailPlayer"></div>
          </v-flex>
          <v-flex xs2>
            <div class="loading-container" v-show="!movieDatail.meta">
              <v-progress-circular :width="3" :size="30" indeterminate color="green"></v-progress-circular>
            </div>
            <router-link class="back" :to="{ path: '/'}">回到首页</router-link>
            <v-tabs
              v-model="active"
              color="green"
              dark
              slider-color="white"
            >
              <v-tab ripple class="tab-title">
                电影详情
              </v-tab>
              <v-tab ripple class="tab-title">
                相关电影
              </v-tab>
              <v-tab-item class="moviedesc">
                <dl v-if="movieDatail.meta">
                  <dt>
                    <h2>{{movieDatail.title}}</h2>
                  </dt>
                  <dd>
                    <span class="dd-title">豆瓣评分：</span>
                    <span class="rate">{{movieDatail.rate}}</span>分
                  </dd>
                  <dd>
                    <span class="dd-title">上映日期：</span>{{formateDate(movieDatail.pubdate)}}
                  </dd>
                  <dd>
                    <span class="dd-title">标签：</span>{{tags(movieDatail.tags)}}
                  </dd>
                  <dd>
                    <span class="dd-title">分类：</span>{{tags(movieDatail.movieTypes)}}
                  </dd>
                  <dd>
                    <p class="summary">
                      <span class="dd-title">概要：</span>{{movieDatail.summary}}
                    </p>
                  </dd>
                </dl>
              </v-tab-item>
              <v-tab-item>
                <v-list two-line v-if="relativeMovies.length">
                  <template v-for="(item, index) in relativeMovies">
                    <v-list-tile avatar @click="tabRelative(item)">
                      <v-list-tile-avatar>
                        <img :src="addBase(item, 'poster')">
                      </v-list-tile-avatar>
                      <v-list-tile-content>
                        <v-list-tile-title v-html="item.title"></v-list-tile-title>
                        <v-list-tile-sub-title v-html="item.summary"></v-list-tile-sub-title>
                      </v-list-tile-content>
                    </v-list-tile>
                  </template>
                </v-list>
              </v-tab-item>
            </v-tabs>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>
<script>
import axios from 'axios'
import DPlayer from 'DPlayer'
import {baseUrlMixin, handleContent} from '../../common/js/mixin'

export default {
  name: "movie-detail",
  mixins: [baseUrlMixin, handleContent],
  data() {
    return {
      movieDatail: {},
      relativeMovies: [],
      active: '0',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  created() {
    this.initData(this.$route.params.id)
  },
  mounted() {
    // 播放器初始化
    this.$nextTick(() => {
      const dplayerWrapper = this.$refs.detailPlayer
      const options = {
        container: dplayerWrapper,
        screenshot: true,
        video: {
            url: '',
            pic: '',
            thumbnails: ''
        }
      }
      this.dp = new DPlayer(options)
    })
  },
  methods: {
    initData(id) { // 根据id请求数据
      axios.get('/api/v0/movies/detail/' + id).then(res => {
        if (res.status === 200) {
          this.movieDatail = res.data.data.movie
          this.relativeMovies = res.data.data.relativeMovies
          this.tabVideo(this.movieDatail)
        }
      })
    },
    tabVideo(item) { // 切换视频源
      const url = this.addBase(item, 'video')
      const pic = this.addBase(item, 'cover')
      const thumbnails = this.addBase(item, 'poster')
      this.dp.switchVideo(
        { url, pic, thumbnails }
      )
    },
    tabRelative(item) { // 跳转相关电影
      this.$router.push(`/detail/${item._id}`)
    },
    tags(args) { // 格式化tags、movieTypes数据
      let ret = ``
      for (let i = 0; i < args.length; i++) {
        ret += `${i !== 0 ? '/' : ''}${args[i]}` 
      }
      return ret
    }
  },
  watch: {
    $route(newRoute) {
      this.initData(newRoute.params.id)
    }
  }
}
</script>
<style>
 .movie-detail .content .flex.xs10, .movie-detail .content .flex.xs2 {
   position: relative;
   height: 100% !important;
 }
 .movie-detail .content .flex.xs2{
   background: rgba(79, 73, 68,0.6);
   position: relative;
 }
 .movie-detail .content .flex.xs2 .back{
   text-decoration: none;
   position: absolute;
   right: 10px;
   top: 14px;
   z-index: 99;
   color:white;
   font-weight: bold;
 }
 .movie-detail .content .flex.xs2 .tab-title .tabs__item{
   color: white !important;
 }
 .movie-detail .content .flex.xs2 .moviedesc {
   padding: 6px 4px 0px 12px;
 }
 .movie-detail .content .flex.xs2 .moviedesc .rate{
   display: inline-block;
   padding: 0px 4px;
   background-color: green;
   border-radius: 4px;
   margin-right: 4px;
 }
 .movie-detail .content .flex.xs2 .moviedesc .dd-title{
   color: rgb(245, 187, 181);
 }
 .movie-detail .content .flex.xs2 .moviedesc .summary {
   padding-top: 10px;
 }
 .movie-detail .detail-player{
   height: 100%;
 }
 .movie-detail .content .flex.xs2  .loading-container {
   position: absolute;
   left: 50%;
   top: 50%;
   transform: translateX(-50%);
   z-index: 1000;
 }
</style>