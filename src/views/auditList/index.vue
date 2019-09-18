 <template>
  <div class="auditList">
    <div class="info-wrap">
      <div class="user-info">
        <img class="headimg fl" src="../../assets/headImg.png" />
        <div class="text fl">
          Hi~，欢迎,
          <br />感谢您使用农房确权信息录入系统~
          <span @click="openModal('modalShow')" class="icon iconfont icon-contact"></span>
        </div>
      </div>
    </div>
    <div class="audit-list">
      <div class="item" v-for="(item, index) in houseList" v-bind:key="index">
        <div class="tit clearfix" v-on:click="tonextPage(item)">
          <span class="icon fl house iconfont icon-house"></span>
          {{item.houseNo}}
          <span class="more fr icon iconfont icon-more"></span>
        </div>
        <div class="info">
          <div class="row">
            <span>户 名：</span>
            {{item.headName}}
          </div>
          <div class="row">
            <span>身份证号：</span>
            {{item.idCardNo}}
          </div>
          <div class="row">
            <span>房屋地址：</span>
            {{item.province}}{{item.city}}{{item.distrinct}}{{item.town}}{{item.village}}{{item.addrInfo}}
          </div>
          <img
            v-if="item.approveStatus=='UD'||item.approveStatus=='DL'"
            class="state-img"
            src="../../assets/state1.png"
          />
          <img v-if="item.approveStatus=='RJ'" class="state-img" src="../../assets/state2.png" />
        </div>
      </div>
    </div>
    <router-link tag="a" :to="{name:'add',params:{type:'addHouse'}}" class="addIcon buttonIcon mainBg">新增房屋信息</router-link>
    <div class="modal-wrap" :class="modalShow ? 'show':'hide'">
      <div class="modal-inner">
        <div class="tit">联系客服</div>
        <div class="tel">{{phoneNumber}}</div>
        <div class="charge">
          <span class="mainColor" @click="closeModal">取消</span>
          <a href="tel:07972022886" class="call mainBg">拨打</a>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import API from "@/lib/api.js";
export default {
  name: "Home",
  components: {},
  computed: {},
  created() {
    this.$store.commit('SWITCH_LOADING', true)
    this.getHouseList();
  },
  data() {
    return {
      currPage: 1,
      houseList: [],
      modalShow: false,
      phoneNumber: "07972022886" //客服电话
    };
  },
  methods: {
    getHouseList: function() {
      //获取房屋列表
      const _this = this;
      let info = this.$store.state.userInfo;
      API.houselist({
        token: info.token,
        headName: info.headName,
        idCardNo: info.idCardNo,
        headPhone: info.headPhone,
        pageNum: _this.currPage,
        pageSize: 20
      }).then(res => {
        if (res.data.list && res.data.list.length > 0) {
          const list = _this.houseList.concat(res.data.list);
          this.houseList = list;
          this.$store.commit('SWITCH_LOADING', false)
        }
      });
    },
    openModal: function() {
      //客服
        this.modalShow=true;
    },
    closeModal: function() {
      //取消
      this.modalShow= false
    },
    tonextPage: function(params) {
      this.$store.commit("getHouseInfo", params);
      if (params.approveStatus == "UD" || params.approveStatus == "DL") {
        //已提交
        this.$router.push({'name':'auditing',params:{type:'audit'}}); 
      }
      if (params.approveStatus == "RJ") {
        //审核驳回
        this.$router.push({'name':'edit'});
      }
    }
  }
};
</script>   
<style lang="scss" scoped>
@import "../../style/views/index.scss";
</style>