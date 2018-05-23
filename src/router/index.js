import Vue from 'vue';
import Router from 'vue-router'

// import Home from '../components/home/home.vue'
// import Management from '../components/management/management.vue'
// import HomeContent from '../components/home-content/home-content.vue'
// import MovieDetail from '../components/movie-detail/movie-detail.vue'
// import Login from '../components/login/login.vue'

// const Home = import('../components/home/home.vue')
// const Management = import('../components/management/management.vue')
// const HomeContent = import('../components/home-content/home-content.vue')
// const MovieDetail = import('../components/movie-detail/movie-detail.vue')
// const Login = import('../components/login/login.vue')

const Home = (resolve) => {
  import('../components/home/home.vue').then((module) => {
    resolve(module);
  });
};
const Management = (resolve) => {
  import('../components/management/management.vue').then((module) => {
    resolve(module);
  });
};
const HomeContent = (resolve) => {
  import('../components/home-content/home-content.vue').then((module) => {
    resolve(module);
  });
};
const MovieDetail = (resolve) => {
  import('../components/movie-detail/movie-detail.vue').then((module) => {
    resolve(module);
  });
};
const Login = (resolve) => {
  import('../components/login/login.vue').then((module) => {
    resolve(module);
  });
};

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
