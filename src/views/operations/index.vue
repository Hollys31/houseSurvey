<template>
  <div class="operation">
    <div class="video-wrap">
      <video
        v-if="isPlay"
        src="http://wxsnsdy.tc.qq.com/105/20210/snsdyvideodownload?filekey=30280201010421301f0201690402534804102ca905ce620b1241b726bc41dcff44e00204012882540400&bizid=1023&hy=SH&fileparam=302c020101042530230204136ffd93020457e3c4ff02024ef202031e8d7f02030f42400204045a320a0201000400"
        controls="controls"
      ></video>
      <img v-if="!isPlay" @click="playVideo" src="../../assets/cover.png" />
    </div>
    <div class="waring">
      <div class="tit">农房登记发证平台提醒您：</div>
      <div class="p">请认真填写相关资料，资料准确直接影响到房屋下证是否正常。</div>
      <div class="p">需要填写户主姓名、户主身份证号码，上传有效的户主身份证（正反）照片，扫描户口本所有成员页面</div>
      <div class="contact">
        <div class="tit">如有疑问</div>
        <span>联系电话</span>
        xxx xxxxxx
      </div>
    </div>
    <div class="buttonIcon mainBg" @click="confirmKnown">确认知晓</div>
  </div>
</template>
<script>
export default {
  name: "add",
  components: {},
  computed: {},
  created() {},
  data() {
    return {
      isPlay: false
    };
  },
  methods: {
    confirmKnown: function() {
     this.$router.push('login')
    },
    playVideo: function(e) {
      //播放视频
     
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/views/operations.scss";
</style>