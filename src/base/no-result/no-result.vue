<template>
  <div class="no-result">
    <img class="no-result-bg" src="./no-result@3x.png" alt="">
    <p class="no-result-text">{{title}}</p>
  </div>
</template>
<script>
export default {
  name: 'no-result',
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  }
};
</script>
<style>
.no-result{
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translateX(-85px);
  z-index: 2000;
  text-align: center;
}
.no-result .no-result-bg{
  display: inline-block;
  width: 80px;
  height: 80px;
}
.no-result .no-result-text{
  margin-top: 30px;
  font-size: 24px;
  max-width: 170px;
  color: rgba(255, 255, 255, 0.3);
  text-align: center;
}
</style>