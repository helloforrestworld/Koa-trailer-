<template>
  <div class="toolbar">
    <v-navigation-drawer
      v-model="drawer"
      fixed
      clipped
      app
    >
      <v-list dense>
        <v-list-tile v-for="item in types" :key="item.text" @click="filterMovie({type: item.text})">
          <v-list-tile-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>
              {{ item.text }}
            </v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-subheader class="mt-3 grey--text text--darken-1">年份</v-subheader>
        <v-list>
          <v-list-tile v-for="item in years" :key="item.year" avatar @click="filterMovie({year: item.year})">
            <v-list-tile-avatar>
              <img :src="`https://randomuser.me/api/portraits/men/${item.picture}.jpg`" alt="">
            </v-list-tile-avatar>
            <v-list-tile-title v-text="item.year + '上映'"></v-list-tile-title>
          </v-list-tile>
        </v-list>
        <v-list-tile class="mt-3" @click="">
          <v-list-tile-action>
            <v-icon color="grey darken-1">add_circle_outline</v-icon>
          </v-list-tile-action>
          <v-list-tile-title 
            class="grey--text text--darken-1"
            @click="filterMovie({type: '给老陈的美剧'})"
          >给老陈的美剧</v-list-tile-title>
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
      <v-icon class="mx-3"></v-icon>
      <v-toolbar-title class="mr-5 align-center head-title" @click="filterMovie()">
        <span class="title">看个片啥的</span>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <v-layout row align-center style="max-width: 650px">
        <v-text-field
          ref="searchField"
          :append-icon-cb="getSearchMovies"
          @keypress.enter="getSearchMovies"
          placeholder="Search..."
          single-line
          append-icon="search"
          color="white"
          v-model="searchValue"
          hide-details
        ></v-text-field>
      </v-layout>
      <v-icon class="mx-3 user" @click="goLogin">fas fa-user</v-icon>
    </v-toolbar>
  </div>
</template>
<script>
import axios from 'axios'
import {mapMutations} from 'vuex'

export default {
  name: "toolbar",
  data() {
    return {
      drawer: true, // 默认打开左侧导航
      types: [
        { icon: 'fab fa-drupal', text: '恐怖' },
        { icon: 'fas fa-eye', text: '惊悚' },
        { icon: 'far fa-smile', text: '喜剧' },
        { icon: 'fab fa-gratipay', text: '爱情' },
        { icon: 'watch_later', text: '剧情' },
        { icon: 'fab fa-fort-awesome-alt', text: '动画' },
        { icon: 'fas fa-car', text: '冒险' },
        { icon: 'fas fa-home', text: '家庭' }
      ],
      years: [
        { picture: 30, year: 2017 },
        { picture: 44, year: 2018 }
      ],
      searchValue: ''
    }
  },
  created() {
    // 聚焦搜索框
    this.searchTimer = setTimeout(() => {
      this.$refs.searchField && this.$refs.searchField.$el.firstElementChild.firstElementChild.focus()
    }, 1000)
  },
  mounted() {
    this.$nextTick(() => {
      if (this.$route.path !== '/') { // 左边导航收起
        this.drawer = false
      } else {
        this.drawer = true
      }
    })
  },
  methods: {
    filterMovie(opt) { // 切换分类
      let path = `/?`
      for (let key in opt) {
        path += `${key}=${opt[key]}&`
      }
      path = path.substring(0, path.length - 1)
      
      this.$router.push(path)
    },
    getSearchMovies() { // 搜索
      if (this.searchValue.trim() === '') return
      this.changeSearchStatus(true)
      
      let query = this.$route.query
      delete query.search
      delete query.ignore
      this.$router.push({path: `/?search=${this.searchValue}`, query})
    },
    goLogin() { // 跳转登录
      this.$router.push('/login')
    },
    ...mapMutations(['changeSearchStatus'])
  },
  watch: {
    $route(newRoute) {
      if (newRoute.path !== '/') { // 左边导航收起
        this.drawer = false
      } else {
        this.drawer = true
      }
    },
    searchValue(val) {
      if (val === '') { // 退格搜索词
        if (this.$route.query.search) {
          let query = this.$route.query
          let str = ''
          delete query.search
          
          this.$router.push({path: `/?ignore=ignore`, query})
          console.log(this.$route)
        }
      }
    }
  }
}
</script>
<style>
.head-title .title{
  cursor: pointer;
}
.user{
  cursor: pointer;
}
</style>