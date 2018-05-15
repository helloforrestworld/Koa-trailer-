import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    playingItem: {} // 当前播放的视频
  },
  mutations: {
    tabVideo(state, data) { // 切换视频
      state.playingItem = data
    }
  },
  actions: {
    
  },
  getters: {
    playingItem(state) {
      return state.playingItem
    }
  }
})

export default store