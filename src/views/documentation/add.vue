<template>
  <div class="add">
    <Step currStep="2" />
    <div class="form-wrap" ref="form" :class="{active:noEmpty}">
      <img class="identify" src="../../assets/identify.png" />
      <div class="tit mainColor">填写资料</div>
      <div class="label" :class="{'active':!showAddress}">请填写房屋地址</div>
      <div class="form-input clearfix">
        <input
          class="input"
          @click="showModal('addresShow')"
          readonly
          name="addrInfo"
          v-model="showAddress"
          placeholder="请选择地址"
        />
        <span class="icon iconfont icon-img" @click="showModal('residShow')"></span>
      </div>
      <div class="label" :class="{'active':!completeTime}">请选择房屋竣工时间</div>
      <div class="form-input clearfix">
        <input
          type="text"
          readonly
          v-model="completeTime"
          placeholder="请选择时间"
          @click="showModal('dateShow')"
        />
      </div>
      <div v-if="showUploadImg">
        <div class="label" :class="{'active':!(idCardFront&&idCardBack)}">请上传身份证照片</div>
        <div class="form-upload clearfix">
          <div class="upload-box" v-if="!idCardFront" @click="toUploadPhoto('idCardFront')">
            <input
              class="fileInp"
              type="file"
              ref="idCardFront"
              accept="image/*"
              capture="camera"
              @change="getFileUrl('idCardFront',arguments[0].target.files[0])"
            />
            <span class="icon iconfont icon-camera1"></span> 上传身份证正面
          </div>
          <div class="img-wrap" v-if="idCardFront">
            <img class="img" :src="URL_BASE+''+idCardFront" @click="preViewImages(idCardFront)" />
            <span class="icon iconfont icon-close" @click="deleteImg('idCardFront')"></span>
          </div>
          <div class="upload-box" v-if="!idCardBack" @click="toUploadPhoto('idCardBack')">
            <input
              class="fileInp"
              type="file"
              ref="idCardBack"
              accept="image/*"
              capture="camera"
              @change="getFileUrl('idCardBack',arguments[0].target.files[0])"
            />
            <span class="icon iconfont icon-camera1"></span>
            上传身份证反面
          </div>
          <div class="img-wrap" v-if="idCardBack">
            <span class="icon iconfont icon-close" @click="deleteImg('idCardBack')"></span>
            <img class="img" :src="URL_BASE+''+idCardBack" @click="preViewImages(idCardBack)" />
          </div>
        </div>
        <div class="label" :class="{'active':!(ownerRsid&&resid.length)}">请上传户口本照片</div>
        <div class="form-upload clearfix">
          <!-- 户主照片 -->
          <div class="upload-box" v-if="!ownerRsid" @click="toUploadPhoto('ownerRsid')">
            <input
              class="fileInp"
              type="file"
              ref="ownerRsid"
              accept="image/*"
              capture="camera"
              @change="getFileUrl('ownerRsid',arguments[0].target.files[0])"
            />
            <span class="icon iconfont icon-camera1"></span>上传户主户口本照片
          </div>
          <div class="img-wrap" v-if="ownerRsid">
            <img class="img" :src="URL_BASE+''+ownerRsid" @click="preViewImages(ownerRsid)" />
            <span class="icon iconfont icon-close" @click="deleteImg('ownerRsid')"></span>
          </div>
          <!-- 户口成员 -->

          <div class="img-wrap" v-for="(item, index) in resid " v-bind:key="index">
            <img class="img" :src="URL_BASE+''+item" @click="preViewImages(item)" />
            <span class="icon iconfont icon-close" @click="deleteImg('resid',index)"></span>
          </div>

          <div class="upload-box" data-type="resid" @click="toUploadPhoto('resid')">
            <span class="icon iconfont icon-camera1"></span> 上传户口本照片
            <input
              class="fileInp"
              type="file"
              ref="resid"
              accept="image/*"
              capture="camera"
              @change="getFileUrl('resid',arguments[0].target.files[0])"
            />
          </div>
        </div>
      </div>
      <div class="buttonIcon mainBg" @click="submitToChecking">提交审核</div>
    </div>
    <!-- 图片预览 -->
    <Preview :previewSrc="previewSrc" @previewEvent="previewEvent"></Preview>
    <!-- 地址选择 -->
    <LocalAddress :isShow="addresShow" @addressEvent="addressEvent" />
    <!--  时间选择 -->
    <van-picker
      class="yearPicker"
      show-toolbar
      @cancel="onCancel"
      @confirm="onConfirm"
      v-if="dateShow"
      :columns="columns"
      @change="onChange"
    />
    <!-- 拍照示意图模态框  bind:modalEvent="inputStateEvent" -->
    <Modal :isShow="residShow" :img="imgResid" @modalEvent="closeModal('residShow')">
      <div slot="tit">房屋地址</div>
      <div slot="tip1">1.找到户主首页</div>
      <div slot="tip2">2. 选择户主地址一栏</div>
      <div slot="tip3">3. 填写户主页所在地址</div>
    </Modal>
  </div>
</template>
<script>
import Modal from "@/components/modal";
import Step from "@/components/step";
import LocalAddress from "@/components/localAddress";
import Preview from "@/components/previewImg";
import form from "@/lib/form.js";
import minify from "@/lib/compressFile.js";
import util from "@/lib/util.js";
import API from "@/lib/api.js";
export default {
  name: "add",
  components: { Modal, LocalAddress, Step, Preview },
  computed: {},
  created() {
    console.log(this.$store.state.userInfo);
    if (this.$route.params.type && this.$route.params.type == "addHouse") {
      //添加房屋
      this.showUploadImg = false;
      this.getInitUserInfo(); //初始化数据
    }
    this.columns = util.getYear(30);
  },
  data() {
    return {
      URL_BASE: this.$store.state.URL_BASE,
      dateShow: false,
      residShow: false,
      addresShow: false,
      imgResid: "/img/addressErr.png", //提示是否显示
      idCardEmpty: false,
      address: {}, //地址  作为参数
      showAddress: "", //地址  显示于页面
      completeTime: null,
      pickerYear: null,
      idCardFront: "",
      idCardBack: "",
      ownerRsid: "", //户主户口本照片
      resid: [], //户口本照片
      residenceImages: [], //户口本所有照片
      showUploadImg: true,
      columns: [],
      noEmpty: false,
      previewSrc: ""
    };
  },
  methods: {
    preViewImages: function(url) {
      //图片预览
      this.previewSrc = this.URL_BASE + "" + url;
    },
    previewEvent: function() {
      /*  关闭图片预览 */
      this.previewSrc = "";
    },
    getInitUserInfo() {
      const info = this.$store.state;
    },
    onChange(picker, value, index) {
      //时间选择
      this.pickerYear = value;
    },
    onConfirm() {
      //确定选择时间
      this.completeTime = this.pickerYear || this.columns[0];
      this.closeModal("dateShow");
    },
    onCancel() {
      //取消时间选择
      this.closeModal("dateShow");
    },
    showModal(type) {
      //显示模态框
      this[type] = true;
      if (type !== "dateShow") {
        this.closeModal("dateShow");
      }
    },
    closeModal(type) {
      //关闭模态框
      this[type] = false;
    },
    toUploadPhoto(type) {
      //拍照上传
      this.$refs[type].click();
    },
    getFileUrl(type, file) {
      //获取拍摄照片
      minify.blobToBase64(type, file, this);
    },
    deleteImg(type, ind) {
      //删除照片
      if (ind) {
        let residImages = [];
        let currResidImages = this.resid;
        currResidImages.map(function(item, index) {
          if (index != ind) {
            residImages.push(item);
          }
        });
        this[type] = residImages;
      } else {
        this[type] = "";
      }
    },
    submitToChecking(e) {
      e.preventDefault();
      let errCount = 0;
      let obj = {};
      if (this.$route.params.type == "addHouse") {
        //再次添加房屋
        obj = {
          completeTime: this.completeTime
        };
        errCount = form.validParams({
          showAddress: this.showAddress,
          completeTime: this.completeTime
        });
      } else {
        //首次添加
        let allResid = [this.ownerRsid];
        allResid = allResid.concat(this.resid);
        obj = {
          completeTime: this.completeTime,
          idCardFront: this.idCardFront,
          idCardBack: this.idCardBack,
          residenceImages: allResid
        };
        errCount = form.validParams(obj);
      }
      if (errCount == 0) {
        obj = Object.assign(this.$store.state.userInfo, obj, this.address);
        this.$store.commit("SWITCH_LOADING", true);
        API.addInfo(obj).then(res => {
          if (res.status == 200) {
            this.$store.commit("getUserInfo", res.data);
            this.$router.push({ name: "auditing", params: { type: "add" } });
            this.$store.commit("SWITCH_LOADING", false);
          }
        });
      } else {
        this.noEmpty = true;
      }
    },
    addressEvent() {
      //选择房屋地址
      let params = arguments[0];
      let showAddress =
        params.province +
        "" +
        params.city +
        "" +
        params.distrinct +
        "" +
        params.town +
        "" +
        params.village +
        "" +
        params.group +
        "组" +
        params.num +
        "号";
      this.address = params;
      this.showAddress = showAddress;
      this.addresShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/views/add.scss";
</style>
