import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        URL_BASE: "http://192.168.2.74:9999/api",//图片前缀
        userInfo:{ },
        houseInfo:{},
        loading: false, // loading的状态
    },
    
    mutations:{
        getUserInfo(state,value){//保存用户提交的房屋资料信息
            const currState=state.userInfo;
            state.userInfo=Object.assign(currState, value);
        },
        getHouseInfo(state,value){//保存当前查看房屋信息
            state.houseInfo=value;
        },
        SWITCH_LOADING(state,isLoading){
            state.loading=isLoading
        }
    },
    actions:{
        
    }
})
