<template>
	<div class="cartcontrol">
		<transition name="move">
			<div v-show="food.count>0" class="cart-decrease icon icon-remove_circle_outline" @click.stop.prevent="decreaseCart($event)" ></div>
		</transition>
		<div v-show="food.count>0" class="cart-count" >{{food.count}}</div>
		<div class="cart-add icon icon-add_circle" @click.stop.prevent="addCart($event)"></div>
	</div>
</template>
<script>
import Vue from 'vue'
	export default{
		props:{
			food:{
				type: Object
			}
		},
		methods:{
			addCart(event){
				if(!event._constructed){
					return;
				}
				if(!this.food.count){
					Vue.set(this.food,'count',1);
				}else{
					this.food.count++;
				}
				console.log(event.target);
				this.$emit('cart_add',event.target);
			},
			decreaseCart(event){
				if(!event._constructed){
					return;
				}
				if(this.food.count){
					this.food.count--;
				}

			}
		}
	}
</script>
<style lang="stylus" rel="stylesheet/stylus">
.cartcontrol
	font-szie: 0
	.cart-add,.cart-decrease
		display: inline-block
		font-size: 24px
		padding: 6px
		color: rgb(0,160,220)
		vertical-align: top
	.cart-decrease
		&.move-enter-active,&.move-leave-active
			transition: all 0.5s linear 
		&.move-enter,&.move-leave-active
			opacity: 0
			transform: translate3d(24px,0,0) 
			/* transform: translateX(30px) */
	.cart-count
		display: inline-block
		width: 12px
		padding-top:6px
		font-size: 10px
		line-height: 24px
		text-align: center
		color: rgb(147, 153, 159)
</style>