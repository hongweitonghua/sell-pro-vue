<template>
	<div class="shopcart">
		<div class="content" @click="toggleList">
			<div class="content-left">
				<div class="logo-wrapper">
					<div class="logo"  :class="{'highlight':totalCount>0}">
						<span class="icon-shopping_cart"></span>
					</div>
					<div v-show="totalCount>0" class="count">{{totalCount}}</div>
				</div>
				<div class="price" :class="{'highlight':totalCount>0}">￥{{totalPrice}}</div>
				<div class="desc">另需￥{{deliveryPrice}}配送费</div>
			</div>
			<div class="content-right" @click.stop.prevent="pay">
				<span class="pay" :class="payClass">{{payText}}</span>
			</div>
		</div>
		<div class="ball-container">
			<div v-for="(ball,key) in balls">
				<!-- 用了两种方式的动画,css和js钩子 -->
				<transition name="drop" @beforeEnter="beforeEnter" @enter="enter" @afterEnter="afterEnter">
					<div v-show="ball.show" class="ball">
						<div class="inner inner-hook"></div>
					</div>
				</transition>
			</div>
			<!-- <transition-group name="trop" @beforeEnter="beforeEnter" @enter="enter" @afterEnter="afterEnter">
				<div  v-for="(ball,key) in balls" v-show="ball.show" class="ball"  :key="key">
					<div class="inner inner-hook"></div>
				</div>
			</transition-group> -->
		</div>
		<transition name="fold">
			<div class="shopcart-list" v-show="listShow">
				<div class="list-header">
					<h3 class="title">购物车</h3>
					<span class="empty" @click="empty">清空</span>
				</div>
				<div class="list-content"  ref="listContent">
					<ul>
						<li v-for="(food,key) in selectFoods"  class="food border-1px">
							<span class="name">{{food.name}}</span>
							<span class="price">￥{{food.price*food.count}}</span>
							<div class="cartcontrol-wrapper">
								<v-cartcontrol :food="food" @cart_add="drop"></v-cartcontrol>
							</div>
						</li>
					</ul>
				</div>
			</div>
		</transition>
		<transition name="fade">
			<div class="list-mask" v-show="listShow" @click="hideList"></div>
		</transition>
	</div>

</template>
<script>
import Cartcontrol from "../cartcontrol/Cartcontrol.vue"
import BScroll from 'better-scroll'
export default{
	props:{
		deliveryPrice:{
			type: Number,
			default:0
		},
		minPrice:{
			type: Number,
			default:0
		},
		selectFoods:{
			type: Array,
			default(){
				return [];
			}
		}
	},
	data(){
		return { //存储小球的状态
	        balls: [
	          {show: false},
	          {show: false},
	          {show: false},
	          {show: false},
	          {show: false}
	        ],
	        dropBalls: [],
	        isFold: true
		}
	},
	computed:{
		totalPrice(){
			let total = 0;
			for(let i=0;i<this.selectFoods.length;i++){
				let item = this.selectFoods[i];
				total += item.price * item.count;
			}
			return total;
		},

		totalCount(){
			let num = 0;
			for(let i=0;i<this.selectFoods.length;i++){
				num+=this.selectFoods[i].count;
			}
			return num;
		},
		payText(){
			if(this.totalPrice===0){
				return `￥${this.minPrice}起送`;
			}else if(this.totalPrice<this.minPrice){
				return `还差￥${this.minPrice-this.totalPrice}起送`;
			}else{
				return '去结算';
			}
		},
		payClass(){
			if(this.totalPrice===0){
				return '';
			}else if(this.totalPrice<this.minPrice){
				return 'not-enough';
			}else{
				return 'enough';
			}
		},
		listShow(){
			if(this.totalCount===0){
				this.isFold = true;
				return false;
			}
			let show = !this.isFold;
			if(show){
				this.$nextTick(()=>{
					if(!this.listScroll){
						this.listScroll = new BScroll(this.$refs.listContent,{
							click: true
						});
					}else{
						this.listScroll.refresh();
					}
					
				});
			}
			return show;
		}
	},
	methods:{

		drop(el) { 
	      //触发一次事件就会将所有小球进行遍历
	        for (let i = 0; i < this.balls.length; i++) {
	          let ball = this.balls[i];
	          if (!ball.show) { //将false的小球放到dropBalls
	            ball.show = true;
	            ball.el = el; //设置小球的el属性为一个dom对象
	            this.dropBalls.push(ball); 
	            return;
	          }
	        }
	    },

		beforeEnter(el) { //这个方法的执行是因为这是一个vue的监听事件
    		let count = this.balls.length;
	        while (count--) {
	          let ball = this.balls[count];
	          if (ball.show) {
	            let rect = ball.el.getBoundingClientRect(); //获取小球的相对于视口的位移(小球高度)
	            let x = rect.left - 32;
	            let y = -(window.innerHeight - rect.top - 22); //负数,因为是从左上角往下的的方向
	            el.style.display = ''; //清空display
	            el.style.webkitTransform = `translate3d(0,${y}px,0)`; 
	            el.style.transform = `translate3d(0,${y}px,0)`;
	            //处理内层动画
	            let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
	            inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
	            inner.style.transform = `translate3d(${x}px,0,0)`;
	            console.log(x);
	            console.log(y);
	          }
	        }

  		},
  		enter(el,done){
  			 /* eslint-disable no-unused-vars */
	        let rf = el.offsetHeight; //手动触发重绘html
	       // this.$nextTick(() => { //让动画效果异步执行,提高性能
	          el.style.webkitTransform = 'translate3d(0,0,0)';
	          el.style.transform = 'translate3d(0,0,0)';
	          //处理内层动画
	          let inner = el.getElementsByClassName('inner-hook')[0]; //使用inner-hook类来单纯被js操作
	          inner.style.webkitTransform = 'translate3d(0,0,0)';
	          inner.style.transform = 'translate3d(0,0,0)';
	          el.addEventListener('transitionend', done); //Vue为了知道过渡的完成，必须设置相应的事件监听器。
	       // });
  		},
  		afterEnter(el){
  			let ball = this.dropBalls.shift(); //完成一次动画就删除一个dropBalls的小球
	        if (ball) {
	          ball.show = false;
	          el.style.display = 'none'; //隐藏小球
	        }
  		},
  		toggleList(){
			if(!this.totalCount){
				return;
			}
			this.isFold = !this.isFold;
		},
		hideList(){
			this.isFold = true;
		},
  		empty(){
  			this.selectFoods.forEach((food)=>{
  				food.count=0;
  			});
  		},
  		pay(){
  			if(this.totalPrice<this.minPrice){
  				return;
  			}else{
  				this.isFold = true;
  				window.alert(`支付${this.totalPrice}元`);
  			}
  		}
	},
	components:{
		"v-cartcontrol": Cartcontrol
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
@import "../../common/stylus/base.styl"
.shopcart
	position: fixed
	bottom: 0
	left:  0
	width: 100%
	height: 48px
	z-index: 50
	/*background: rgba(0,0,0,0.2)*/
	background: #141d27
	.content
		display: flex
		height: 100%
		font-size: 0
		.content-left
			flex: 1
			display: inline-block
			background: #141d27
			.logo-wrapper
				position: relative
				display: inline-block
				top: -10px
				margin: 0 12px
				padding: 6px
				width:56px
				height: 56px
				box-sizing: border-box
				border-radius: 50%
				background: #141d27
				.logo
					width: 100%
					height: 100%
					border-radius: 50%
					text-align: center
					line-height: 66px
					background: rgb(43,52,60)
					.icon-shopping_cart
						font-size: 24px
						color: rgb(128,133,138)
					&.highlight
						background: rgb(0,160,220)
						.icon-shopping_cart
							color: #fff
				.count
					position: absolute
					top: 0
					right: 0
					width: 24px
					height: 16px
					border-radius: 16px
					line-height: 16px
					text-align: center
					font-size: 9px
					color: #fff
					background: rgb(240,20,20)
					box-shadow: 0px 4px 8px 0px rgba(0,0,0,0.4)
			.price
				display: inline-block
				vertical-align: top
				font-size: 16px
				line-height: 48px
				font-weight: 700
				color: rgb(128,133,138)
				&.highlight
					color: #fff
			.desc
				display: inline-block
				vertical-align: top
				margin: 12px 0 0 12px
				padding-left: 12px
				font-size: 14px
				line-height: 24px
				border-left: 1px solid rgba(255,255,255,0.1)
				color: rgb(128,133,138)
		.content-right
			flex: 0 0 105px
			display: inline-block
			width: 105px
			background: rgb(43,52,60)
			.pay
				display: inline-block
				height: 100%
				width: 100%
				font-size: 14px
				line-height: 48px
				text-align: center
				font-weight: 700
				color: rgb(147,150,152)
				&.not-enough
					backgound: #2b333b
				&.enough
					background:  #00b43c
					color: #fff
	.ball-container
		& .ball
			position: fixed
			left: 32px
			bottom: 22px
			z-index: 200
			transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41)
			.inner
				width: 16px
				height: 16px
				border-radius: 50%
				 background: rgb(0,160,220) 
				transition: all 0.4s linear
	.shopcart-list
		position: absolute
		left: 0
		top: 0
		z-index: -1
		width: 100%
		transform: translate3d(0,-100%,0) /* 自定义高度 */ /* 这是"入" */
		&.fold-enter-active, &.fold-leave-active /* shopcart-list的渐入渐出动画,这是"渐" */
			transition: all 0.4s linear
		&.fold-enter, &.fold-leave-active /* 这是"出" */
			transform: translate3d(0,0,0)  
		
		.list-header
			height: 40px
			line-height: 40px
			padding: 0 18px
			background: #f3f5f7
			font-weight: 200
			border-bottom: 1px solid rgba(7,17,27,0.6)
			.title
				float: left
				color: rgb(7,17,27)
				font-size:  14px
			.empty
				float: right
				color: rgb(0,160,220)
				font-size: 12px
		.list-content
			padding: 0 18px
			max-height: 217px
			background: #fff
			overflow: hidden
			& .food
				position: relative
				height: 48px
				padding: 12px 0
				box-sizing: border-box
				border-1px(rgba(7,17,27,0.6))
				.name
					font-size: 14px
					line-height: 24px
					color: rgb(7,17,27)
				.price
					position: absolute
					right: 90px
					bottom: 12px
					line-height: 24px
					font-size: 14px
					font-weight: 700
					color: rgb(240,20,20)
				.cartcontrol-wrapper
					position: absolute
					right: 0
					bottom: 6px
	.list-mask
		position: fixed
		top: 0
		left: 0
		z-index: -2
		width: 100%
		height: 100%
		background: rgba(7,17,27,0.6)
		&.fade-enter-active,&.fade-leave-active
			transition: all 0.4s linear
		&.fade-enter,&.fade-leave-active
			opacity: 0

</style>
