<template>
  <div class="step clearfix">
    <div v-for="(item,index) in 4" v-bind:key="index">
      <div class="circle " :class="{'active':currStep>=item}">
        <span class="icon iconfont icon-step"></span>
        <span class="num">{{item}}</span>
      </div>
      <div v-if="item!=4" class="line"></div>
    </div>
  </div>
</template>
<script>
export default {
  name: "step",
  props: {
    currStep:null
  },
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {}
};
</script>
<style  lang="scss" scoped>
@import "../style/common/common.scss";
</style>