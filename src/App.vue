<template>
  <v-app
    id="inspire"
    class="app"
    dark
  >
    <toolbar></toolbar>
    <router-view></router-view>
    <player ref="videoPlayer"></player>
  </v-app>
</template>

<script>
  import ToolBar from './components/toolbar/toolbar.vue'
  import Player from './components/player/player.vue'
  
  export default {
    components: {
      toolbar: ToolBar,
      player: Player
    }
  }
</script>

<style media="screen">
</style>
