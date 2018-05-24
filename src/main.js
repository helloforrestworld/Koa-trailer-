import "babel-polyfill"
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import VueAxios from 'vue-axios'
import Vuetify from 'vuetify'
import VueLazyLoad from 'vue-lazyload'
import 'dplayer/dist/DPlayer.min.css'
import 'vuetify/dist/vuetify.min.css'
// import 'DPlayer/dist/DPlayer.min.css'


Vue.config.productionTip = false
Vue.use(Vuetify)
Vue.use(VueAxios, axios)

Vue.use(VueLazyLoad, {
  loading: require('./common/image/no-result@3x.png'),
  preLoad: 1.3
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
