<template>
  <div class="modal-wrap" v-if="isShow">
    <div class="modal-inner">
      <div class="tit">
        <slot name="tit"></slot>
      </div>
      <img :src="img" />
      <div class="tips">
        <slot name="tip1"></slot>
        <slot name="tip2"></slot>
        <slot name="tip3"></slot>
      </div>
      <div class="buttonIcon" @click="closeModal">我知道了</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "modal",
  props: {
    isShow: null,
    img:null,
   
  },
  data() {
    return {
     
    };
  },
  watch: {},
  mounted() {},
  methods: {
    closeModal(){
        this.$emit("modalEvent",false); 
    },
  }
};
</script>
<style  lang="scss" scoped>
  @import "../style/common/common.scss";
</style>