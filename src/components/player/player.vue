<template>
  <div class="player">
    <div class="text-xs-center bottom-session" v-bind:class="{open: sheet}">
      <v-bottom-sheet v-model="sheet">
        <v-btn slot="activator" color="purple" dark ref="btnShowPlayer">播放器</v-btn>
        <div id="dplayer" ref="dplayer" class="normal"></div>
      </v-bottom-sheet>
    </div>
  </div>
</template>
<script>
import DPlayer from 'dplayer'
import {mapGetters} from 'vuex'
import {baseUrlMixin} from '../../common/js/mixin.js'

export default {
  name: "player",
  mixins:[baseUrlMixin],
  data() {
    return {
      sheet: false
    }
  },
  created() {
  },
  mounted() {
    // 播放器初始化
    this.$nextTick(() => {
      const dplayerWrapper = this.$refs.dplayer
      const options = {
        container: dplayerWrapper,
        screenshot: true,
        video: {
            url: '',
            pic: '',
            thumbnails: ''
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
      
      // 播放器显示按钮
      this.toggleBtn(this.$route)
    })
  },
  computed: {
    ...mapGetters([
      'playingItem'
    ])
  },
  watch: {
    playingItem(newData) { // 预告片数据变化
      this.sheet = true
      const url = this.addBase(newData, 'video')
      const pic = this.addBase(newData, 'cover')
      const thumbnails = this.addBase(newData, 'poster')
      this.dp.switchVideo(
        { url, pic, thumbnails }
      )
    },
    $route(newRoute) {
      this.toggleBtn(newRoute)
    }
  },
  methods: {
    toggleBtn(route) { // 播放器按钮只在首页显示
      const btnShowPlayer = this.$refs.btnShowPlayer
      if (route.path !== '/') {
        btnShowPlayer.$el.style.display = 'none'
      } else {
        btnShowPlayer.$el.style.display = ''
      }
    }
  }
}
</script>
<style>
  #dplayer{
    height: 300px;
  }

  .player .bottom-session .dialog__container .btn {
   position: fixed;
   z-index: 999;
   right: 4px;
   top: 42px;
   background-color: rgb(122, 123, 130, 0.6) !important;
   
   height:80px !important;
   width: 50px !important;
   min-width: 50px !important;
  }
  .player .content--wrap .card {
   height: 470px !important;
  }
</style>