<template>
	<transition name="move">
		<div class="food" v-show="showFlag" ref="foodDetailWrapper">
			<div class="food-content">
				<div class="image-header">
					<img :src="food.image">
					<span class="icon-arrow_lift" @click.stop="hide"></span>
				</div>
				<div class="content">
					<div class="title">{{food.name}}</div>
					<div class="desc">
						<span class="sellCount">月售{{food.sellCount}}份</span><span class="rating">好评率{{food.rating}}</span>
					</div>
					<div class="price">
						<span class="newPrice">￥{{food.price}}</span><span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
					</div>
					<div class="cartcontrol-wrapper">
						<v-cartcontrol :food="food" v-show="food.count>0"  @cart_add="addFood"></v-cartcontrol>
					</div>
					<transition name="fade">
						<div class="buy" v-show="!food.count || food.count===0" @click.stop.prevent="addFirst($event)">加入购物车</div>
					</transition>
				</div>
				<v-split v-show="food.info"></v-split>
				<div class="info" v-show="food.info">
					<h1 class="title">商品介绍</h1>
					<div class="text">{{food.info}}</div>
				</div>
				<v-split></v-split>
				<div class="rating">
					<h1 class="title">商品评价</h1>
					<v-ratingselect :selectType="selectType" :onlyContent="onlyContent" :desc="desc" :ratings="food.ratings" @select="_selectRating" @toggleContent="_toggleContent"></v-ratingselect>
					<div class="rating-wrapper">
						<ul v-show="food.ratings && food.ratings.length">
							<li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,key) in food.ratings" class="rating-item">
								<div class="user">
									<span class="username">{{rating.username}}</span>
									<img class="avatar" width="12" height="12" :src="rating.avatar"></img>
								</div>
								<div class="time">{{rating.rateTime | formatDate}}</div>
								<p class="text">
									<span :class="{'icon-thumb_up':rating.rateType===0,'icon-thumb_down':rating.rateType===1}"></span>{{rating.text}}
								</p>
							</li>
						</ul>
						<div class="no-rating" v-show="!food.ratings || food.ratings.length===0">暂无评价</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>
<script>
import Vue from 'vue'
import BScroll from 'better-scroll'
import {formatDate} from '../../common/js/date.js'
import Cartcontrol from '../cartcontrol/Cartcontrol.vue'
import Split from '../split/Split.vue'
import Ratingselect from '../ratingselect/Ratingselect.vue'

const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default{
	props:{
		food:{
			type: Object
		}
	},
	data(){
		return {
			showFlag: false,
			selectType: ALL,
			onlyContent: false,
			desc:{
				all: '全部',
				positive: '推荐',
				negative: '吐槽'
			}
		}
	},
	methods:{
		show(){
			this.showFlag = true;
			this.$nextTick(()=>{
				if(!this.scroll){
					this.scroll = new BScroll(this.$refs.foodDetailWrapper,{
						click: true
					});
				}else{
					this.scroll.refresh();
				}
			});
		},
		hide(){
			this.showFlag = false;
		},
		addFirst(event){
			console.log('addFirst');
			if(!event._constructed){
				return;
			}
			this.$emit('cart_add',event.target);
			Vue.set(this.food,'count',1);
		},
		addFood(target){
			this.$emit('cart_add',target);
		},
		needShow(type, text){
			if(this.onlyContent && !text){
				return false;
			}
			if(this.selectType === ALL){
				return true;
			}else{
				return type===this.selectType;
			}
		},
		_selectRating(type){
			this.selectType = type;
			this.$nextTick(()=>{
				this.scroll.refresh();
			});
		},
		_toggleContent(onlyContent){
			this.onlyContent = onlyContent;
			this.$nextTick(()=>{
				this.scroll.refresh();
			});
		}
	},
	filters:{
		formatDate(time){
			let date = new Date(time);
			return formatDate(date,'yyyy-MM-dd hh:mm');
		}
	},
	components:{
		'v-cartcontrol': Cartcontrol,
		'v-split': Split,
		'v-ratingselect': Ratingselect

	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
@import "../../common/stylus/base.styl"

.food
	position: fixed
	top: 0
	left: 0
	bottom: 48px
	z-index: 40
	width: 100%
	background: #fff
	&.move-enter-active,&.move-leave-active
		transition: all .4s linear
	&.move-enter,&.move-leave-active
		transform: translate3d(100%,0,0)
	.food-content
		.image-header
			position: relative
			top: 0
			width: 100%
			height: 0
			padding-top: 100%
			img
				position: absolute
				left: 0
				top: 0
				width: 100%
				height: 100%
			.icon-arrow_lift
				position: absolute
				top: 10px
				left: 0
				display: block
				padding: 10px
				font-size: 20px
				color: #fff
		.content
			position: relative
			padding: 18px
			.title
				margin-bottom: 8px
				font-size: 14px
				font-weight: 700
				color: rgb(7,17,27)
				line-height: 14px
			.desc
				margin-bottom: 18px
				.sellCount,.rating
					font-size: 10px
					color: rgb(147,153,159)
					line-height: 10px
				.sellCount
					margin-right: 12px
			.price
				.newPrice, .oldPrice
					font-weight: 700
					line-height: 24px
				.newPrice
					font-size: 14px
					color: rgb(240,20,20)
				.oldPrice
					text-decoration: line-through
					margin-left: 8px
					font-size: 10px
					color: rgb(147,153,159)
			.cartcontrol-wrapper
				position: absolute
				right: 12px
				bottom: 12px
			.buy
				position: absolute
				right: 18px
				bottom: 18px
				padding: 0 12px
				height: 24px
				line-height: 24px
				box-sizing: border-box
				background: rgb(0,160,220)
				color: #fff
				font-size: 10px
				border-radius: 12px
				&.fade-enter-active,&.fade-leave-active
					transition: all .4s linear
				&.fade-enter,&.fade-leave-active
					opacity: 0
		.info
			padding: 18px
			.title
				line-height: 14px
				margin-bottom: 6px
				font-size: 14px
				color: rgb(7,17,27)
			.text
				padding: 0 8px
				font-size: 12px
				color: rgb(77,85,93)
				line-height: 24px
		.rating
			padding-top: 18px
			.title
				line-height: 14px
				margin-left: 18px
				font-size: 14px
				color: rgb(7,17,27)
			.rating-wrapper
				padding: 0 18px
				.rating-item
					position: relative
					padding: 16px 0
					border-1px(rgba(7,17,27,0.1))
					.user
						position: absolute
						top: 16px
						right: 0
						line-height: 12px
						font-size: 0
						.username
							margin-right: 6px
							vertical-align: top
							font-size: 10px
							color: rgb(147,153,159)
						.avatar
							vertical-align: top
							border-radius: 12px
					.time
						margin-bottom: 6px
						line-height: 12px
						font-size: 10px
						color: rgb(147,153,159)
					.text
						line-height: 16px
						font-size: 12px
						color: rgb(7,17,27)
						.icon-thumb_up, .icon-thumb_down
							margin-right: 4px
							line-height: 16px
							font-size: 12px
						.icon-thumb_up
							color: rgb(0,160,220)
						.icon-thumb_down
							color: rgb(147,153,159)
				.no-rating
					padding: 16px 0
					font-size: 12px
					color: rgb(147,153,159)


</style>