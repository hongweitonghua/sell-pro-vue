<template>
	<div class="seller" ref="sellerWrapper">
		<div class="seller-content">
			<div class="overview">
				<h1 class="title">{{seller.name}}</h1>
				<div class="desc border-1px">
					<v-star :size="36" :score="seller.score" class="star"></v-star>
					<div class="text">({{seller.ratingCount}})</div>
					<div class="text">月售{{seller.sellCount}}单</div>
				</div>
				<ul class="remark">
					<li class="block">
						<h2 class="title">起送价</h2>
						<div class="content">
							<span class="stress">{{seller.minPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2 class="title">商家配送</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryPrice}}</span>元
						</div>
					</li>
					<li class="block">
						<h2 class="title">平均配送时间</h2>
						<div class="content">
							<span class="stress">{{seller.deliveryTime}}</span>分钟
						</div>
					</li>
				</ul>
				<div class="favorite" @click="toggleFavorite($event)">
					<span class="icon icon-favorite" :class="{'active':favorite}"></span>
					<div class="text">{{favoriteText}}</div>
				</div>
			</div>
			<v-split></v-split>
			<div class="bulletin">
				<h1 class="title">公告与活动</h1>
				<div class="content-wrapper border-1px">
					<p class="content">{{seller.bulletin}}</p>
				</div>
				<ul v-if="seller.supports" class="supports">
					<li v-for="(support,key) in seller.supports" class="support-item">
						<span class="icon" :class="classMap[support.type]"></span>
						<span class="text">{{support.description}}</span>
					</li>
				</ul>
			</div>
			<v-split></v-split>
			<div class="pics">
				<h1 class="title">商家实景</h1>
				<div class="pic-wrapper" ref="picWrapper">
					<ul class="pic-list" ref="picList">
						<li v-for="pic in seller.pics" class="pic-item">
							<img :src="pic" width="120" height="90">
						</li>
					</ul>
				</div>
			</div>
			<div class="infos">
				<h1 class="title border-1px">商家信息</h1>
				<ul>
					<li v-for="(info,key) in seller.infos" class="info-item border-1px">{{info}}</li>
				</ul>
			</div>
		</div>
	</div>
</template>
<script>
import BScroll from 'better-scroll'
import {saveToLocal,loadFromLocal} from '../../common/js/store.js'
import Star from '../star/Star.vue'
import Split from '../split/Split.vue'
export default{
	props:{
		seller: {
			type: Object
		}
	},
	data(){
		return{
			favorite: (()=>{
				return loadFromLocal(this.seller.id,'favorite',false);
			})()
		}
	},
	computed:{
		favoriteText(){
			return this.favorite? '已收藏': '收藏';
		}
	},
	created() {
      this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee'];
    },
    watch:{
    	'seller'(){
    		this.$nextTick(()=>{
    			this._initScroll();
    			this._initPicScroll();
    		});
    	}
    },
	mounted(){
		this.$nextTick(()=>{
    		this._initScroll();
    		this._initPicScroll();
    	});
		//方法一：当直接访问seller页面时，当此时seller还没有绑定过来，可以使用watch监听seller的变化，然后进行初始化。
		//但是当路由切换时，是把整个seller的dom删除，访问时，再把别的路由显示的dom删除，渲染seller的dom。这个动作不会触发watch，所以只写watch来初始化scroll也不行。要在mounted页面基本渲染完再初始化dom。先执行mounted，在执行watch。注意要加上else this.sscroll.refresh();
		//方法二：以后讲述。
		

		//问题2：
		/*商品实景的图片横向滚动问题：外层pic-wrapper和ul.pic-list一样宽度，而better-scroll原理就是里层高度大于外层高度或者宽度时，才会滚动。所以这里要手动设置ul的宽度*/

	},
	methods:{
		_initScroll(){
			if(!this.scroll){
				this.scroll = new BScroll(this.$refs.sellerWrapper,{
					click: true
				});
			}else{
				this.scroll.refresh();
			}
		},
		_initPicScroll(){
			if(this.seller.pics){
				let liWidth = 120;
				let margin= 6;
				let width = (liWidth+margin)*this.seller.pics.length-margin;
				this.$refs.picList.style.width = width + 'px';
				this.$nextTick(()=>{
					if(!this.picScroll){
						this.picScroll = new BScroll(this.$refs.picWrapper,{
							scrollX: true,
							eventPassthrough: 'vertical' //忽略垂直方法滚动
						});
					}else{
						this.picScroll.refresh();
					}
				});
			}
		},
		toggleFavorite(event){
			if(!event._constructed){
				return;
			}
			this.favorite = !this.favorite;
			saveToLocal(this.seller.id, 'favorite', this.favorite);
		}
	},
	components:{
		'v-star': Star,
		'v-split': Split
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
@import "../../common/stylus/base.styl"
.seller
	position: absolute
	left: 0
	top: 174px
	bottom: 0
	width: 100%
	overflow: hidden
	.seller-content
		.overview
			position: relative
			padding: 18px
			border-bottom: 1px solid rgba(7,17,27,0.2)
			.title
				margin-bottom: 8px
				font-size: 14px
				color: rgb(7,17,27)
				line-height: 14px
			.desc
				padding-bottom: 18px
				font-size: 0
				border-1px(rgba(7,17,27,0.1))
				.star
					display: inline-block
					vertical-align: top
					margin-right: 8px
				.text
					display: inline-block
					vertical-align: top
					margin-right: 12px
					line-height: 18px
					font-size: 10px
					color: rgb(77,85,93)
			.remark
				padding: 18px 0 0 0
				display: flex
				.block
					flex: 1
					text-align: center
					border-right: 1px solid rgba(7,17,27,0.1)
					&:last-child
						border-right: none
					.title
						margin-bottom: 4px
						font-size: 10px
						line-height: 10px
						color: rgb(147,163,159)
					.content
						font-size: 10px
						line-height: 24px
						color: rgb(7,17,27)
						.stress
							font-size: 24px
			.favorite
				position: absolute
				top: 18px
				right: 11px
				text-align: center
				width: 50px
				.icon-favorite
					display: block
					margin-bottom: 4px
					line-height: 24px
					font-size: 24px
					color: #d4d6d9
					&.active
						color:rgb(240,20,20)
				.text
					line-height: 10px
					font-size: 10px
					color: rgb(77,85,93)

		.bulletin
			padding: 18px 18px 0 18px
			border-bottom: 1px solid rgba(7,17,27,0.2)
			.title
				margin-bottom: 8px
				font-size: 14px
				color: rgb(7,17,27)
				line-height: 14px
			.content-wrapper
				padding: 0 12px 16px 12px
				border-1px(rgba(7,17,27,0.1))
				font-size: 12px
				color: rgb(240,20,20)
				line-height: 24px
			.supports
				.support-item
					padding: 16px 12px
					border-1px(rgba(7,17,27,0.1))
					font-size: 0
					.icon
						display: inline-block
						vertical-align: top
						margin-right: 6px
						width: 16px
						height: 16px
						background-size: 16px 16px
						background-repeat: no-repeat
						&.decrease
							bg-image('decrease_4')
						&.discount
							bg-image('discount_4')
						&.guarantee
							bg-image('guarantee_4')
						&.invoice
							bg-image('invoice_4')
						&.special
							bg-image('special_4')
					.text
						line-height: 16px
						font-size: 12px
						color: rgb(7,17,27)
		.pics
			padding: 18px
			border-bottom: 1px solid rgba(7,17,27,0.2)
			.title
				margin-bottom: 12px
				font-size: 14px
				color: rgb(7,17,27)
				line-height: 14px
			.pic-wrapper
				width: 100%
				overflow: hidden
				white-space: nowrap
				.pic-list
					font-size: 0
					.pic-item
						display: inline-block
						vertical-align: top
						margin-right: 6px
						widh: 120px
						height: 90px
						&:last-child
							margin-right: 0
		.infos
			padding: 18px 18px 0 18px
			.title
				padding-bottom: 12px
				font-size: 14px
				color: rgb(7,17,27)
				line-height: 14px
				border-1px(rgba(7,17,27,0.1))
			.info-item
				padding: 16px 12px
				line-height: 16px
				font-size: 12px
				color: rgb(7,17,27)
				border-1px(rgba(7,17,27,0.1))
				&:last-child
					border-none()
</style>
