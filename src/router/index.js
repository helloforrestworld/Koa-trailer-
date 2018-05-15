import Vue from 'vue';
import Router from 'vue-router'
import Home from '../components/home/home.vue'
import MovieDetail from '../components/movie-detail/movie-detail.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home
    },
    {
      path: '/detail/:id?',
      component: MovieDetail
    }
  ]
})
