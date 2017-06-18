<template>
	<div class="ratings" ref="ratingsWrapper">
		<div class="rating-content">
			<div class="overview">
				<div class="overview-left">
					<h1 class="score">{{seller.score}}</h1>
					<div class="title">综合评分</div>
					<div class="rank">高于周边商家{{seller.rankRate}}%</div>
				</div>
				<div class="overview-right">
					<div class="score-wrapper">
						<span class="title">服务评分</span>
						<div class="star-wrapper">
							<v-star :size="36" :score="seller.serviceScore"></v-star>
						</div>
						<span class="score">{{seller.serviceScore}}</span>
					</div>
					<div class="score-wrapper">
						<span class="title">商品评分</span>
						<div class="star-wrapper">
							<v-star :size="36" :score="seller.foodScore"></v-star>
							
						</div>
						<span class="score">{{seller.foodScore}}</span>
					</div>
					<div class="delivery-wrapper">
						<span class="title">送达时间</span>
						<span class="delivery">{{seller.deliveryTime}}分钟</span>
					</div>
				</div>
			</div>
			<v-split></v-split>
			<v-ratingselect :selectType="selectType" :onlyContent="onlyContent" :ratings="ratings" @select="_selectType" @toggleContent="_onlyContent"></v-ratingselect>
			<div class="rating-wrapper">
				<ul v-show="ratings && ratings.length">
					<li v-show="needShow(rating.rateType,rating.text)" v-for="(rating,key) in ratings" class="rating-item">
						<div class="avatar">
							<img :src="rating.avatar" width="28" height="28">
						</div>
						<div class="content">
							<h1 class="name">{{rating.username}}</h1>
							<div class="star-wrapper">
								<v-star :size="24" :score="rating.score" class="star"></v-star>
								<span v-show="rating.deliveryTime" class="delivery">{{rating.deliveryTime}}分钟送达</span>
							</div>
							<div class="text">{{rating.text}}</div>
							<div  v-show="rating.recommend && rating.recommend.length" class="recommend-wrapper">
								<span class="icon-thumb_up"></span>
								<span v-for="(item,key) in rating.recommend" class="recommend-item">{{item}}</span>
							</div>
							<div class="time">{{rating.rateTime | formatDate}}</div>
						</div>
					</li>
				</ul>
				<div v-show="!ratings || !ratings.length" class="no-rating">暂无评价</div>
			</div>
		</div>
 
	</div>
</template>
<script>
import {formatDate} from '../../common/js/date.js'
import BScroll from 'better-scroll'
import Star from '../star/Star.vue'
import Split from '../split/Split.vue'
import Ratingselect from '../ratingselect/Ratingselect.vue'

const ALL = 2;
const POSITIVE = 1;
const NEGATIVE = 0;
const err_OK = 0;
export default{
	props:{
		seller:{
			type: Object
		}
	},
	data(){
		return{
			selectType: ALL,
			onlyContent: false,
			ratings: []
		}
	},
	methods:{
		_selectType(type){
			this.selectType = type;
			this.$nextTick(()=>{
				this.scroll.refresh();
			});
		},
		_onlyContent(onlyContent){
			this.onlyContent = onlyContent;
			this.$nextTick(()=>{
				this.scroll.refresh();
			});
		},
		needShow(type, text){
			if(this.onlyContent && !text){
				return false;
			}
			if(this.selectType===ALL){
				return true;
			}else{
				return this.selectType === type;
			}
		}
	},
	created(){
		this.$http.get('/api/ratings').then((res)=>{
			let response = res.data;
			if(response.errno === err_OK){
				this.ratings = response.data;
				this.$nextTick(()=>{
					this.scroll = new BScroll(this.$refs.ratingsWrapper,{
						click: true
					});
				});
			}
		},(res)=>{
			console.log(res.status);
		});
	},
	filters:{
		formatDate(time){
			let date = new Date(time);
			return formatDate(date,'yyyy-MM-dd hh:mm');
		}
	},
	components:{
		'v-star': Star,
		'v-split': Split,
		'v-ratingselect': Ratingselect
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
@import "../../common/stylus/base.styl"

.ratings
	position: absolute
	top: 174px
	left: 0
	bottom: 0
	overflow: hidden
	.overview
		display: flex
		padding: 18px 0
		.overview-left
			flex: 0 0 137px
			width:137px
			padding: 6px 0
			border-right: 1px solid rgba(7,17,27,0.1)
			text-align: center /* iphone5显示有问题解决 */
			/* @media only screen and (max-width:320px) 
				flex: 0 0 120px
				width: 120px */
			.score
				margin-bottom: 6px
				font-size: 24px
				line-height: 28px
				color: rgb(255,153,0)
			.title
				margin-bottom: 8px
				font-size: 12px
				line-height:12px
				color: rgb(7,17,27)
				
			.rank
				font-size: 10px
				line-height:10px
				color: rgb(147,153,159)
		.overview-right
			flex: 1
			padding: 6px 0 6px 24px
			/* @media only screen and (max-width:320px)
				padding-left: 6px */
			.score-wrapper
				font-size: 0
				margin-bottom: 8px
				.title
					display: inline-block
					vertical-align: top
					line-height: 18px
					font-size: 12px
					color: rgb(7,17,27)
				.star-wrapper
					display: inline-block
					vertical-align: top
					margin: 0 12px
				.score
					display: inline-block
					vertical-align: top
					line-height: 18px

					font-size: 12px
					color: rgb(255,153,0)
			.delivery-wrapper
				font-size: 0
				.title
					margin-right: 12px
					line-height: 18px
					font-size: 12px
					color: rgb(7,17,27)
				.delivery
					font-size: 12px
					color: rgb(147,153,159)
	.rating-wrapper
		padding: 0 18px
		.rating-item
			display: flex
			padding: 18px 0
			border-1px(rgba(7,17,27,0.1))
			&:last-child
				border-none()
			.avatar
				flex: 0 0 28px
				width: 28px
				margin-right: 12px
				img
					border-radius: 28px
			.content
				flex: 1
				position: relative
				.name
					margin-bottom: 4px
					line-height: 12px
					font-size: 10px
					color: rgb(7,17,27)
				.star-wrapper
					margin-bottom: 6px
					font-size: 0
					.star
						display: inline-block
						vertical-align: top
						margin-right: 6px
					.delivery
						display: inline-block
						vertical-align: top
						line-height: 12px
						font-size: 10px
						color: rgb(147,153,159)
				.text
					margin-bottom: 8px
					font-size: 12px
					line-height: 18px
					color: rgb(7,17,27)
				.recommend-wrapper
					font-size: 0
					.icon-thumb_up
						margin-right:8px
						display: inline-block
						vertical-align: top
						font-size: 12px
						line-height: 16px
						color: rgb(0,160,220)
					.recommend-item
						display: inline-block
						vertical-align: top
						margin: 0 8px 4px 0
						padding: 0 6px
						font-size: 9px
						line-height: 16px
						color: rgb(147,153,159)
						border: 1px solid rgba(7,17,27,0.1)
						border-radius: 1px
						background: #fff
				.time
					position: absolute
					top: 0
					right: 0
					line-height: 12px
					font-size: 10px
					color: rgb(147,153,159)
							


</style>
