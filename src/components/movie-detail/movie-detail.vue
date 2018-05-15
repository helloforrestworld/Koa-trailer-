<template>
  <div class="movie-detail">
    <v-content class="content">
      <v-container fluid fill-height>
        <v-layout space-around row wrap>
          哈哈哈
        </v-layout>
      </v-container>
    </v-content>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  name: "movie-detail",
  data() {
    return {
      movieDatail: {}
    }
  },
  created() {
    // 电影详情
    const id = this.$route.params.id
    axios.get('/api/v0/movies/' + id).then(res => {
      this.movieDatail = res.data.data
    })
  }
}
</script>
<style>
</style>