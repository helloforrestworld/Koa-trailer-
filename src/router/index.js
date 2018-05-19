import Vue from 'vue';
import Router from 'vue-router'

import Home from '../components/home/home.vue'
import Management from '../components/management/management.vue'
import HomeContent from '../components/home-content/home-content.vue'
import MovieDetail from '../components/movie-detail/movie-detail.vue'
import Login from '../components/login/login.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          component: HomeContent
        },
        {
          path: 'detail/:id?',
          component: MovieDetail
        }
      ]
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/management',
      component: Management
    }
  ]
})
