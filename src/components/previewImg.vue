<template>
  <div class="modal-wrap preview" v-if="previewSrc">
    <span class="icon iconfont icon-close" @click="closeModal"></span>
    <img :src="previewSrc" />
  </div>
</template>
<script>
export default {
  name: "preview",
  props: {
    previewSrc: ""
  },
  data() {
    return {};
  },
  watch: {},
  mounted() {},
  methods: {
    closeModal() {
      this.$emit("previewEvent", false);
    }
  }
};
</script>
<style  lang="scss" scoped>
@import "../style/common/common.scss";
</style>