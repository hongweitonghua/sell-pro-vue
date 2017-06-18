import Vue from 'vue'
import Router from 'vue-router'
import Goods from '@/components/goods/Goods.vue'
import Seller from '@/components/seller/Seller.vue'
import Ratings from '@/components/ratings/Ratings.vue'

Vue.use(Router)

export default new Router({
  mode: 'history',
  //http://192.168.1.9:8080/?id=12345%2F#/goods
  //url总是不正常
  routes: [
  	{
  		path: '/goods',
  		component: Goods
  	},
  	{
  		path: '/seller',
  		component: Seller
  	},
  	{
  		path: '/ratings',
  		component: Ratings
  	},
    {
      path: '/',
      name: 'goods',
      component: Goods
    }/*,
     {
      path: '*',
      component: Goods
    }*/
  ]
})
