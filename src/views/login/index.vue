<template>
  <div class="login">
    <Step currStep="1" />
    <div class="form-wrap">
      <div class="tit mainColor">登录户主</div>
      <form>
        <img class="identify" src="../../assets/identify.png" />
        <div class="label" ref="headName">请填写户主名称</div>
        <div class="form-input clearfix">
          <input
            maxlength="8"
            name="headName"
            v-model="headName"
            @focus="focusEvent('headName')"
            @blur="blurEvent('headName')"
          />
          <span class="icon iconfont icon-img" @click="showModal('residShow')"></span>
        </div>
        <div class="label" ref="idCardNo">请填写身份证号</div>
        <div class="form-input clearfix">
          <input
            maxlength="18"
            type="text"
            name="idCardNo"
            v-model="idCardNo"
            @focus="focusEvent('idCardNo')"
            @blur="blurEvent('idCardNo')"
          />
          <span class="icon iconfont icon-img" @click="showModal('idShow')"></span>
        </div>
        <div class="label" ref="headPhone">请填写户主手机号</div>
        <div class="form-input clearfix">
          <input
            maxlength="11"
            type="number"
            name="headPhone"
            v-model="headPhone"
            @focus="focusEvent('headPhone')"
            @blur="blurEvent('headPhone')"
          />
        </div>
        <button class="buttonIcon mainBg" type="submit" @click="formSubmit">下一步</button>
      </form>
    </div>
    <Modal :isShow="idShow" :img="imgID" @modalEvent="closeModal('idShow')">
      <div slot="tit">身份证信息</div>
      <div slot="tip1">1.找到身份证正面</div>
      <div slot="tip2">2.找到公民身份证号码一栏</div>
      <div slot="tip3">3.填写身份证号码</div>
    </Modal>
    <Modal :isShow="residShow" :img="imgResid" @modalEvent="closeModal('residShow')">
      <div slot="tit">户主信息</div>
      <div slot="tip1">1. 找到户主页</div>
      <div slot="tip2">2. 选择户主姓名一栏</div>
      <div slot="tip3">3. 填写户主姓名</div>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/modal";
import Step from "@/components/step";
import form from "@/lib/form.js";
import HTTP from "@/lib/http.js";
import API from "@/lib/api.js";
export default {
  name: "login",
  components: { Modal, Step },
  computed: {},
  created() {},
  data() {
    return {
      imgID: "../../img/idCard.png",
      imgResid: "../../img/ownerErr.png",
      idShow: false,
      residShow: false,
      headPhone: "",
      headName: "",
      idCardNo: ""
    };
  },
  watch: {
    idCardNo: function() {
      this.idCardNo=this.idCardNo.replace(/[\W]/g,'');
    }
  },
  methods: {
    showModal: function(type) {
      this[type] = true;
    },
    closeModal: function(type) {
      this[type] = false;
    },
    focusEvent: function(val) {
      //输入框聚焦
      form.focusEvent(this, val);
    },
    blurEvent: function(val) {
      //输入框失去焦点
      form.blurEvent(this, val);
    },
    formSubmit: function(e) {
      //户主登录
      const _this = this;
      e.preventDefault();
      let params = {
        headPhone: this.headPhone,
        headName: this.headName,
        idCardNo: this.idCardNo
      };
      const errCount = form.validInpParams(this, params);
      if (errCount == 0) {
        params.type = "applet";
        API.login(params).then(res => {
          if (res.status == 999008) {
            //未注册
            this.$store.commit("getUserInfo", _this.params);
            this.$router.push({ name: "add" });
          }
          if (res.status == 200) {
            this.$store.commit("getUserInfo", res.data);
            this.$router.push({ name: "auditing", params: { type: "login" } });
          }
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/views/login.scss";
</style>