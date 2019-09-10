<template>
  <div class="modal-wrap" v-if="isShow">
    <div class="modal-inner">
      <div class="tit">房屋地址</div>
      <div class="address">
        <span
          :class="{active:currLevel==1}"
          @click="updateAddress(1,'province')"
        >{{params.province}}</span>
        <span :class="{active:currLevel==2}" @click="updateAddress(2,'city')">{{params.city}}</span>
        <span
          :class="{active:currLevel==3}"
          @click="updateAddress(3,'distrinct')"
        >{{params.distrinct}}</span>
        <span :class="{active:currLevel==4}" @click="updateAddress(4,'town')">{{params.town}}</span>
        <span :class="{active:currLevel==5}" @click="updateAddress(5,'village')">{{params.village}}</span>
        <span data-level="6" v-if="currLevel==5||currLevel==6" :class="{active:currLevel==6}">组/号</span>
      </div>
      <div class="info clearfix">
        <!-- 省 -->
        <div scroll-y class="province section" :class="currLevel==1?'show':'hide'">
          <div
            v-for="(item,index) in provinceList"
            v-bind:key="index"
            @click="getNextAddress(item,'province','city','2')"
          >{{item}}</div>
        </div>
        <!-- 市 -->
        <div scroll-y class="city section" :class="currLevel==2?'show':'hide'">
          <div
            v-for="(item,index) in cityList"
            v-bind:key="index"
            @click="getNextAddress(item,'city','distrinct','3')"
          >{{item}}</div>
        </div>
        <!-- 县 -->
        <div scroll-y class="distrinct section" :class="currLevel==3?'show':'hide'">
          <div
            @click="getNextAddress(item,'distrinct','town','4')"
            v-for="(item,index) in distrinctList"
            v-bind:key="index"
          >{{item}}</div>
        </div>
        <!-- 镇 -->
        <div scroll-y class="town section" :class="currLevel==4?'show':'hide'">
          <div
            @click="getNextAddress(item,'town','village','5')"
            v-for="(item,index) in townList"
            v-bind:key="index"
          >{{item}}</div>
        </div>
        <!-- 村 -->
        <div scroll-y class="village section" :class="currLevel==5?'show':'hide'">
          <div
            v-for="(item,index) in villageList"
            v-bind:key="index"
            @click="getAddressDetail(item,'village')"
          >{{item}}</div>
        </div>
        <!-- 组 号 -->
        <div class="addrInfo" v-if="currLevel==6">
          <form>
            <div class="label" ref="group">组</div>
            <input
              name="group"
              v-model="params.group"
              placeholder="请输入组名"
              @focus="focusEvent('group')"
              @blur="blurEvent('group')"
            />
            <div class="label" ref="num">号</div>
            <input
              name="num"
              v-model="params.num"
              placeholder="请输入号"
              @focus="focusEvent('num')"
              @blur="blurEvent('num')"
            />
            <button class="buttonIcon" @click="formSubmit">完成</button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from "@/lib/api.js";
import form from "@/lib/form.js";
export default {
  name: "localAddress",
  props: {
    isShow: null
  },
  data() {
    return {
      currLevel: 1,
      provinceList: [],
      cityList: [],
      distrinctList: [],
      townList: [],
      villageList: [],
      groupEmpty: false,
      numEmpty: false,
      currAddressName: "",
      params: {
        province: "",
        city: "",
        distrinct: "",
        town: "",
        village: "",
        group: "",
        num: "",
        addrInfo: ""
      }
    };
  },
  watch: {},
  mounted() {
    this.getAddress("province", 1);
  },
  methods: {
    formSubmit: function(e) {
      e.preventDefault();
      //完成 并关闭模态框
      this.params.addrInfo = this.params.group + "组" + this.params.num + "号";
      const errCount = form.validInpParams(this, {
        group: this.params.group,
        num: this.params.num
      });
      if (errCount == 0) {
        this.$emit("addressEvent", this.params);
      }
    },
    focusEvent: function(val) {
      //输入框聚焦
      form.focusEvent(this, val);
    },
    blurEvent: function(val) {
      //输入框失去焦点
      form.blurEvent(this, val, "params");
    },
    getAddress: function(name, level, parentName, type) {
      //获取地址请求
      const _this = this;
      if (!parentName) parentName = "";
      API.address({
        parentName: parentName,
        level: level
      }).then(res => {
        let address = "";
        let currAddress = "";
        if (type) {
          const currAddressName = _this.currAddressName;
          address = _this.params[currAddressName];
          currAddress = address;
        } else {
          currAddress = address || res.data.children[0];
        }
        const list = name + "List";
        _this.params[name] = currAddress;
        _this[list] = res.data.children;
      });
    },
    getNextAddress: function(val, currName, nextname, nextlevel) {
      //获取下一级地址信息
      this.getAddress(nextname, nextlevel, val);
      this.params[currName] = val;
      this.currLevel = parseInt(nextlevel);
    },
    getAddressDetail: function(val) {
      //获取 组 号 的详细信息
      this.params.village = val;
      this.currLevel = 6;
    },
    updateAddress: function(level, name) {
      const _this = this;
      _this.currLevel = level;
      _this.currAddressName = name;
      switch (level) {
        case 1:
          _this.getAddress("province", 1, "", "tab");
          _this.params.city = "";
          _this.params.distrinct = "";
          _this.params.town = "";
          _this.params.village = "";
          _this.params.addrInfo = "";
          break;
        case 2:
          _this.getAddress("city", 2, _this.params.province, "tab");
          _this.params.distrinct = "";
          _this.params.town = "";
          _this.params.village = "";
          _this.params.addrInfo = "";
          break;
        case 3:
          _this.getAddress("distrinct", 3, _this.params.city, "tab");
          _this.params.town = "";
          _this.params.village = "";
          _this.params.addrInfo = "";
          break;
        case 4:
          _this.getAddress("town", 4, _this.params.distrinct, "tab");
          _this.params.village = "";
          _this.params.addrInfo = "";
          break;
        default:
          _this.getAddress("distrinct", 5, _this.params.town, "tab");
          _this.params.addrInfo = "";
      }
    }
  }
};
</script>
<style  lang="scss" scoped>
@import "../style/components/address.scss";
</style>