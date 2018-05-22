import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    playingItem: {}, // 首页当前播放的视频
    searching: true, // 首页搜索状态
  },
  mutations: {
    tabVideo(state, data) { // 首页切换视频
      state.playingItem = data
    },
    changeSearchStatus(state, status) { // 改变首页搜索状态
      state.searching = status
    }
  },
  actions: {
  },
  getters: {
    playingItem(state) {
      return state.playingItem
    },
    searching(state) {
      return state.searching
    }
  }
})

export default store