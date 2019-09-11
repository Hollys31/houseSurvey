<template>
  <div class="edit">
    <div class="tips">
      <div>农房登记发证平台提醒您：</div>
      <div class="text">{{info.approveRemark||'请仔细核对信息'}}</div>
    </div>
    <div class="form-wrap">
      <div class="item clearfix">
        <div class="l" :class="{'active':!info.headName}">户主</div>
        <div class="r">
          <input disabled="disabled" placeholder="请重新输入户主姓名" v-model="info.headName" />
        </div>
      </div>
      <div class="item clearfix">
        <div class="l" :class="{'active':!info.idCardNo}">身份证号</div>
        <div class="r">
          <input disabled="disabled" placeholder="请重新输入身份证号" v-model="info.idCardNo" />
        </div>
      </div>
      <div class="item clearfix">
        <div class="l" :class="{'active':!info.headPhone}">手机号</div>
        <div class="r">
          <input disabled="disabled" placeholder="请重新输入手机号" v-model="info.headPhone" />
        </div>
      </div>
      <div class="item">
        <div class="l">房屋地址</div>
        <div class="r">
          <input
            class="input"
            @click="showModal('addresShow')"
            readonly
            name="addrInfo"
            v-model="showAddress"
            placeholder="请选择地址"
          />
        </div>
      </div>
      <div class="item">
        <div class="l">竣工时间</div>
        <div class="r">
          <input
            type="text"
            readonly
            v-model="completeTime"
            placeholder="请选择时间"
            @click="showModal('dateShow')"
          />
        </div>
      </div>

      <div class="label" :class="{'active':!(idCardFront&&idCardBack)}">身份证图集</div>
      <div class="form-upload clearfix">
        <!-- 身份证正面 -->
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
          <img class="img" :src="URL_BASE+''+idCardFront" @click="preViewImages(idCardFront)"/>
          <span class="icon iconfont icon-close" @click="deleteImg('idCardFront')"></span>
        </div>
        <!-- 身份证反面 -->
        <div class="upload-box" v-if="!idCardBack" @click="toUploadPhoto('idCardBack')">
          <input
            class="fileInp"
            type="file"
            ref="idCardBack"
            accept="image/*"
            capture="camera"
            @change="getFileUrl('idCardBack',arguments[0].target.files[0])"
          />
          <span class="icon iconfont icon-camera1"></span> 上传身份证反面
        </div>
        <div class="img-wrap" v-if="idCardBack">
          <img class="img" :src="URL_BASE+''+idCardBack" @click="preViewImages(idCardBack)"/>
          <span class="icon iconfont icon-close" @click="deleteImg('idCardBack')"></span>
        </div>
      </div>
      <div class="label" :class="{'active':(resid&&resid.length<2)}">户口本图集</div>
      <div class="form-upload clearfix">
        <div class="img-wrap" v-for="(item,index) in resid" v-bind:key="index">
          <img class="img" :src="URL_BASE+''+item"  @click="preViewImages(item)"/>
          <span class="icon iconfont icon-close" @click="deleteImg('resid',index)"></span>
        </div>
        <div class="upload-box" @click="toUploadPhoto('resid')">
          <input
            class="fileInp"
            type="file"
            ref="resid"
            accept="image/*"
            capture="camera"
            @change="getFileUrl('resid',arguments[0].target.files[0])"
          />
          <span class="icon iconfont icon-camera1"></span> 上传户口本照片
        </div>
      </div>
      <div class="buttonIcon mainBg" @click="editHouseToChecking">完成</div>
    </div>
    <!-- 图片预览 -->
    <Preview :previewSrc="previewSrc" @previewEvent="previewEvent"></Preview>
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
    <!-- 选择地址 -->
    <LocalAddress :isShow="addresShow" @addressEvent="addressEvent" />
  </div>
</template>
<script>
import LocalAddress from "@/components/localAddress";
import Preview from "@/components/previewImg";
import form from "@/lib/form.js";
import minify from "@/lib/compressFile.js";
import util from "@/lib/util.js";
import API from "@/lib/api.js";
export default {
  name: "edit",
  components: { LocalAddress, Preview },
  computed: {},
  watch: {},
  created() {
    if (this.$store.state.houseInfo) {
      this.getUnitAddress();
      this.columns = util.getYear(30);
    }
  },
  data() {
    return {
      URL_BASE: this.$store.state.URL_BASE,
      info: this.$store.state.houseInfo,
      pickerYear: "",
      inputShow: true,
      addresShow: false,
      showAddress: "", //显示完整地址
      address: {}, //地址参数
      idCardFront: "",
      idCardBack: "",
      resid: [], //户口本照片
      canClick: true,
      dateShow: false, //时间选择器的显示
      columns: [],
      noEmpty: false,
      previewSrc:''
    };
  },
  methods: {
    preViewImages: function(url) {
      //图片预览
      this.previewSrc = this.URL_BASE + "" + url;
    },
      previewEvent: function() {
      /*  关闭图片预览 */
      this.previewSrc ="";
    },
    addressEvent() {
      //地址选择
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
    },
    getUnitAddress: function() {
      //获取原始数据
      const houseInfo = this.$store.state.houseInfo;
      const showAddress =
        houseInfo.province +
        houseInfo.city +
        houseInfo.distrinct +
        houseInfo.town +
        houseInfo.village +
        houseInfo.addrInfo;
      this.completeTime = houseInfo.completeTime;
      this.showAddress = showAddress || "";
      this.idCardFront = houseInfo.idCardFront;
      this.idCardBack = houseInfo.idCardBack;
      this.resid = houseInfo.residenceImages;
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
    toUploadPhoto: function(type) {
      //拍照上传
      const ele = this.$refs[type].click();
    },
    getFileUrl(type, file) {
      minify.blobToBase64(type, file, this);
    },
    deleteImg(type, ind) {
      //删除照片
      if (ind || ind == 0) {
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
    editHouseToChecking: function() {
      //编辑房屋
      let obj = {
        openid: "11",
        idCardFront: this.idCardFront,
        idCardBack: this.idCardBack,
        residenceImages: this.resid,
        showAddress: this.showAddress,
        completeTime: this.completeTime
      };
      let errCount = 0;
      errCount = form.validParams(obj);
      obj = Object.assign(this.info, obj, this.address);
      if (errCount == 0) {
        this.$store.commit("SWITCH_LOADING", true);
        API.updateInfo(obj).then(res => {
          if (res.status == 200) {
            this.$store.commit("SWITCH_LOADING", false);
            this.$store.commit("getUserInfo", res.data);
            this.$router.push({ name: "auditing", params: { type: "add" } });
          }
        });
      } else {
        this.noEmpty = true;
      }
    }
  }
};
</script>
<style lang="scss" scoped>
@import "../../style/views/edit.scss";
</style>