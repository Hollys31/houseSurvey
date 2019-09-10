<template>
  <!-- 资料审核 -->
  <div class="auditing">
    <Step currStep="3" />
    <div class="info-wrap clearfix">
      <div class="tit mainColor">资料审核</div>
      <div class="item clearfix">
        <div class="l">户 主</div>
        <div class="r">{{checkData.headName}}</div>
      </div>
      <div class="item clearfix">
        <div class="l">身份证号</div>
        <div class="r">{{checkData.idCardNo}}</div>
      </div>
      <div class="item clearfix">
        <div class="l">房屋地址</div>
        <div
          class="r"
        >{{checkData.province}}{{checkData.city}}{{checkData.distrinct}}{{checkData.town}}{{checkData.village}}{{checkData.addrInfo}}</div>
      </div>
      <div class="label">身份图集</div>
      <div class="imgs clearfix">
        <div class="img-wrap" @click="preViewImages(checkData.idCardFront)">
          <div class="tip">
            <span>仅用于身份认证</span>
          </div>
          <img :src="URL_BASE+''+checkData.idCardFront" />
        </div>
        <div class="img-wrap" @click="preViewImages(checkData.idCardBack)">
          <div class="tip">
            <span>仅用于身份认证</span>
          </div>
          <img :src="URL_BASE+''+checkData.idCardBack" />
        </div>
      </div>
      <!--  户口本 -->
      <div class="label">户口本图集</div>
      <div class="imgs clearfix">
        <div
          class="img-wrap"
          v-for="(item,index) in checkData.residenceImages"
          v-bind:key="index"
          @click="preViewImages(item)"
        >
          <!-- item.imgPath -->
          <div class="tip">
            <span>仅用于身份认证</span>
          </div>
          <img :src="URL_BASE+''+item" />
        </div>
      </div>
    </div>

    <div class="charge clearfix">
      <router-link tag="a" class="mainColor toindex" to="auditList">返回首页</router-link>
      <router-link tag="a" :to="{name:'add',params:{type:'addHouse'}}" class="addHouse mainBg">新增房屋</router-link>
    </div>
    <!-- 图片预览 -->
    <div class="modal-wrap preview" v-if="previewSrc">
      <span class="icon iconfont icon-close" @click="closeModal"></span>
      <img :src="previewSrc" />
    </div>
  </div>
</template> 
<script>
import Step from "@/components/step";
export default {
  name: "auditing",
  components: { Step },
  computed: {
    checkData() {
      switch (this.$route.params.type) {
        case "add":  //已注册过的用户，直接户主登录进去
          return this.$store.state.userInfo;
          break;
        case "audit": //从审计列表进入
          return this.$store.state.houseInfo;
          break;
        case "login":  //已注册过的用户，直接户主登录进去
          let userInfo = this.$store.state.userInfo;
          let residenceImages = [];
          let ImageList = userInfo.registeredResidenceImageList;
          ImageList.map(function(item) {
            residenceImages.push(item.imgPath);
          });
          userInfo.residenceImages = residenceImages;
          return userInfo;
          break;
        default:
          return this.$store.state.houseInfo;
          break;
      }
    }
  },
  created() {},
  data() {
    return {
      URL_BASE: this.$store.state.URL_BASE,
      noFirst: true,
      previewSrc: ""
    };
  },
  methods: {
    preViewImages: function(url) {
      //图片预览
      this.previewSrc = this.URL_BASE + "" + url;
    },
    closeModal: function() {
      this.previewSrc = "";
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/views/auditing.scss";
</style>