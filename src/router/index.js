import Vue from 'vue';
import Router from 'vue-router'

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
