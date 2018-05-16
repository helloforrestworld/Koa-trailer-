<template>
  <div class="movie-detail">
    <v-content class="content">
      <v-container fluid fill-height>
        <v-layout space-around row wrap>
          <v-flex xs10>
            <div class="detail-player" ref="detailPlayer"></div>
          </v-flex>
          <v-flex xs2>
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
              <v-tab-item>
                <v-card flat>
                  <v-card-text>{{ text }}</v-card-text>
                </v-card>
              </v-tab-item>
              <v-tab-item>
                <v-card flat>
                  <v-card-text>{{ text }}</v-card-text>
                </v-card>
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
import {baseUrlMixin} from '../../common/js/mixin'

export default {
  name: "movie-detail",
  mixins: [baseUrlMixin],
  data() {
    return {
      movieDatail: {},
      active: '0',
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.'
    }
  },
  created() {
    // 电影详情
    const id = this.$route.params.id
    axios.get('/api/v0/movies/' + id).then(res => {
      if (res.status === 200) {
        this.movieDatail = res.data.data
        this.tabVideo(this.movieDatail.movie)
      }
    })
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
    tabVideo(item) {
      const url = this.addBase(item.videoKey)
      const pic = this.addBase(item.coverKey)
      const thumbnails = this.addBase(item.posterKey)
      this.dp.switchVideo(
        { url, pic, thumbnails }
      )
    }
  }
}
</script>
<style>
 .movie-detail .content .flex.xs10, .movie-detail .content .flex.xs2 {
   height: 100% !important;
 }
 .movie-detail .content .flex.xs2{
   background: rgba(79, 73, 68,0.6);
 }
 .movie-detail .content .flex.xs2 .tab-title .tabs__item{
   color: white !important;
 }
 .movie-detail .detail-player{
   height: 100%;
 }
</style>