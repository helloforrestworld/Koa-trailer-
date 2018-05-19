<template>
  <div class="home">
    <toolbar></toolbar>
    <router-view></router-view>
    <player ref="videoPlayer"></player>
  </div>
</template>

<script>
  import ToolBar from '../toolbar/toolbar.vue'
  import Player from '../player/player.vue'
  
  export default {
    components: {
      toolbar: ToolBar,
      player: Player
    }
  }
</script>

<style media="screen">
</style>