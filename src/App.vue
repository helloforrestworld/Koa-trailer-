<template>
  <v-app
    id="inspire"
    class="app"
    dark
  >
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <v-list dense>
        <v-list-tile v-for="item in items" :key="item.text" @click="">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-subheader class="mt-3 grey--text text--darken-1">SUBSCRIPTIONS</v-subheader>
        <v-list>
          <v-list-tile v-for="item in items2" :key="item.text" avatar @click="">
            <v-list-tile-avatar>
              <img :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`" alt="">
            </v-list-tile-avatar>
            <v-list-tile-title v-text="item.text"></v-list-tile-title>
          </v-list-tile>
        </v-list>
        <v-list-tile class="mt-3" @click="">
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Browse Channels</v-list-tile-title>
        </v-list-tile>
        <v-list-tile @click="">
          <v-list-tile-action>
            <v-icon color="grey darken-1">settings</v-icon>
          </v-list-tile-action>
          <v-list-tile-title class="grey--text text--darken-1">Manage Subscriptions</v-list-tile-title>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <v-toolbar
      color="red"
      dense
      fixed
      clipped-left
      app
    >
      <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-icon class="mx-3">fab fa-youtube</v-icon>
      <v-toolbar-title class="mr-5 align-center">
        <span class="title">看个片啥的</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout row align-center style="max-width: 650px">
        <v-text-field
          :append-icon-cb="() => {}"
          placeholder="Search..."
          single-line
          append-icon="search"
          color="white"
          hide-details
        ></v-text-field>
      </v-layout>
    </v-toolbar>
    <v-content class="content">
      <v-container fluid fill-height>
        <v-layout space-around row wrap>
          <v-flex v-for="(item, index) in recommandList" class="mt-5 mr-3">
           <v-card class="card">
             <v-card-media :src="item.poster" height="200px">
             </v-card-media>
             <v-card-title primary-title>
               <div>
                 <h3 class="headline mb-0">{{item.title}}</h3>
                 <p class="date">{{formateDate(item.pubdate)}}</p>
                 <div class="summary">{{elisSummary(item.summary)}}</div>
               </div>
             </v-card-title>
             <v-card-actions>
               <v-btn flat color="orange" @click="addTrailer(item)">播放预告片</v-btn>
               <v-btn flat color="orange">详情</v-btn>
             </v-card-actions>
           </v-card>
         </v-flex>
        </v-layout>
      </v-container>
    </v-content>
    
    <div class="text-xs-center bottom-session" v-bind:class="{open: sheet}">
      <v-bottom-sheet v-model="sheet">
        <v-btn slot="activator" color="purple" dark>播放器</v-btn>
        <div id="dplayer" ref="dplayer" class="normal"></div>
      </v-bottom-sheet>
  </div>
  </v-app>
</template>

<script>
  import axios from 'axios'
  import 'DPlayer/dist/DPlayer.min.css';
  import DPlayer from 'DPlayer';

  export default {
    created() {
      // 数据
      axios.get('https://www.easy-mock.com/mock/5aa7ebafdee46352178289fb/example/movie').then(data => {
        this.recommandList = data.data.data.m.movies
      })
      
      // 七牛资源base地址
      this.baseUrl = 'http://qiniumovie.hasakei66.com/'
    },
    mounted() {
      // 播放器
      this.$nextTick(() => {
        const dplayerWrapper = this.$refs.dplayer
        const options = {
          container: dplayerWrapper,
          screenshot: true,
          video: {
              url: 'http://qiniumovie.hasakei66.com/rdEKNjhA9BbGjzJqmNOZE.mp4',
              pic: 'http://qiniumovie.hasakei66.com/O8bl3yuHVFXbiG0WPlgdA.png',
              thumbnails: 'http://qiniumovie.hasakei66.com/xIGNuPHBRYKL52KEUF_le.png?'
          }
        }
        this.dp = new DPlayer(options);
        
        // 全屏 后 高度取消限制
        this.dp.on('fullscreen', () => {
          this.$refs.dplayer.style.height = '100%'
        })
        this.dp.on('fullscreen_cancel', () => {
          this.$refs.dplayer.style.height = ''
        })
      })
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
      addTrailer(item) { // 切换预告片
        this.sheet = true
        const url = this.baseUrl + item.videoKey
        const pic = this.baseUrl + item.coverKey
        const thumbnails = this.baseUrl + item.posterKey
        
        this.dp.switchVideo(
          { url, pic, thumbnails }
        )
      }
    },
    components: {
    },
    data: () => ({
      recommandList: [], // 首屏数据
      sheet: false, // 播放器弹窗
      drawer: true, // 默认打开左侧导航
      items: [
        { icon: 'trending_up', text: '悬疑' },
        { icon: 'subscriptions', text: '惊悚' },
        { icon: 'history', text: '搞笑' },
        { icon: 'featured_play_list', text: '动作' },
        { icon: 'watch_later', text: '剧情' }
      ],
      items2: [
        { picture: 28, text: 'Joseph' },
        { picture: 38, text: 'Apple' },
        { picture: 48, text: 'Xbox Ahoy' },
        { picture: 58, text: 'Nokia' },
        { picture: 78, text: 'MKBHD' }
      ]
    })
  }
</script>

<style media="screen">
 .app .content .card .summary{
   max-width: 300px;
   overflow: hidden;
 }
 .app #dplayer{
   height: 300px;
 }

 .app .bottom-session .dialog__container .btn {
  position: fixed;
  z-index: 999;
  right: 4px;
  top: 42px;
  background-color: rgba(30, 107, 117, 0.6) !important;
  
  height:80px !important;
  width: 50px !important;
  min-width: 50px !important;
 }
.app .content--wrap .card {
  height: 470px !important;
}
</style>
