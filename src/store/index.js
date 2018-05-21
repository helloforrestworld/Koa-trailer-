import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    playingItem: {}, // 首页当前播放的视频
    recommandList: [], // 首页数据
    searching: true // 首页搜索状态
  },
  mutations: {
    tabVideo(state, data) { // 首页切换视频
      state.playingItem = data
    },
    refreshRecommandList(state, data) { // 首页数据改变
      state.recommandList = data
    },
    changeSearching(state, searching) { // 改变首页搜索状态
      state.searching = searching
    }
  },
  actions: {
    
  },
  getters: {
    playingItem(state) {
      return state.playingItem
    },
    recommandList(state) {
      return state.recommandList
    },
    searching(state) {
      return state.searching
    }
  }
})

export default store