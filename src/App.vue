<template>
  <div id="app">
    <v-header :seller="seller"></v-header>
    <div class="tab border-1px">
      <div class="tab-items">
        <router-link  to="/goods">商品</router-link>
      </div>
      <div class="tab-items">
         <router-link  to="/ratings">评价</router-link>
      </div>
      <div class="tab-items">
        <router-link  to="/seller">商店</router-link>
      </div>
    </div>
    <div class="content">
      <keep-alive>
        <router-view :seller="seller"></router-view>
      </keep-alive>
    </div>
  </div>
</template>

<script>
import {urlParse} from './common/js/util.js'
import Header from './components/header/Header.vue'

const err_OK = 0;

export default{
  data(){
    return { //商家默认有id
      seller:{
        id:(()=>{
          //从地址栏中的url中通过urlParam函数解析，得到id
          let queryParam = urlParse();
          console.log(queryParam);
          return queryParam.id;
        })()
      }
    }
  },
  created(){
    this.$http.get('./api/seller?id='+this.seller.id).then((res)=>{
      var resData  = res.data;
      if(resData.errno  === err_OK){
        // this.seller =  resData.data; 
        //防止把id覆盖掉，使用es6的一个语法:扩展了对象的属性，在原来的基础上添加response.data的值，不会覆盖掉原来的id属性
        this.seller = Object.assign({},this.seller,resData.data);
        console.log(this.seller.id);
      }
    },(res)=>{
      alert(res.status);
    });
  },
  components: {
    'v-header': Header
  }
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
@import "./common/stylus/mixin.styl"
@import "./common/stylus/base.styl"
#app
  .tab
    display: flex
    width: 100%
    height: 40px
    line-height: 40px
    border-1px(rgba(7,17,27,0.2))
    .tab-items
      flex: 1
      text-align: center
      font-size: 14px
      & > a
        display: block
        width: 100%
        color: rgb(77, 85, 93)
        &.router-link-active
          color: rgb(240, 20, 20)
</style>
