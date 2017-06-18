<template>
	<div class="header">
		<div class="content-wrapper">
			<div class="avatar">
				<img width="64" height="64" :src="seller.avatar">
			</div>
			<div class="content">
				<div class="title">
					<span class="brand"></span>
					<span class="name" v-text="seller.name"></span>
				</div>
				<div class="description">
					{{seller.description}} / {{seller.deliveryTime}}分钟到达
				</div>
				<div  v-if="seller.supports" class="support">
					<span class="icon" :class="classMap[seller.supports[0].type]"></span>
					<span class="text">{{seller.supports[0].description}}</span>
				</div>
			</div>
			<div v-if="seller.supports" class="support-count" @click="showDetail">
				<span class="count">{{seller.supports.length}}个</span>
				<i class="icon-keyboard_arrow_right"></i>
			</div>
		</div>
		<div class="bulletin-wrapper" @click="showDetail">
			<span class="bulletin-title"></span><span class="bulletin-text">{{seller.bulletin}}</span>
			<i class="icon-keyboard_arrow_right"></i>
		</div>
		<div class="background">
			<img :src="seller.avatar" width="100%" height="100%">
		</div>
		<transition name="fade">
			<div v-show="detailShow" class="detail">
				<div class="detail-wrapper clearfix">
					<div class="detail-main">
						<div class="name">{{seller.name}}</div>
						<div class="star-wrapper">
							<star :size="48" :score="seller.score"></star>
						</div>
						<div class="title">
							<div class="line"></div>
							<div class="text">优惠信息</div>
							<div class="line"></div>
						</div>
						<ul v-if="seller.supports" class="support">
							<li v-for="(val,key) in seller.supports"  class="support-item">
								<span class="icon" :class="classMap[val.type]"></span>
								<span class="text">{{val.description}}</span>
							</li>
						</ul>
						<div class="title">
							<div class="line"></div>
							<div class="text">商家公告</div>
							<div class="line"></div>
						</div>
						<div class="bulletin">
							<p class="content">{{seller.bulletin}}</p>
						</div>
					</div>
				</div>
				<div class="detail-close" @click="hideDetail">
					<i class="icon-close"></i>
				</div>
			</div>
		</transition>
	</div>
</template>

<script>
import star from '../star/Star.vue'
export default{
	props:{
		seller:{
			type: Object
		}
	},
	data(){
		return {
			detailShow: false
		}
	},
	methods:{
		showDetail(){
			this.detailShow = true;
		},
		hideDetail(){
			this.detailShow = false;
		}
	},
	mounted(){
		this.classMap = ['decrease','discount','special','invoice','guarantee'];
	},
	components:{
		star
	}
}
</script>

<style  lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
@import "../../common/stylus/base.styl"
	.header
		position: relative
		color: rgb(255,255,255)
		background: rgba(7, 17, 27, 0.5)
		overflow: hidden /*去除blur效果使图片超出的阴影*/
		.content-wrapper
			position: relative
			padding:24px 12px 18px 24px
			font-size: 0 /*消除并排的间距问题*/
			
			.avatar
				display: inline-block
				vertical-align: top
				img
					border-radius: 2px
			.content
				display: inline-block
				margin-left: 16px
				.title
					margin: 2px  0 8px	0
					.brand
						display: inline-block
						vertical-align: top
						width: 30px
						height: 18px
						bg-image('brand')
						background-size: 30px 18px
						background-repeat: no-repeat
					.name
						margin-left: 6px
						font-size: 16px
						line-height: 18px
						font-weight: bold
				.description
					margin-bottom: 10px
					font-size: 12px
					line-height: 12px
				.support
					.icon
						display: inline-block
						margin-right: 4px
						vertical-align: top
						width: 12px
						height: 12px
						background-size: 12px 12px
						background-repeat: no-repeat
						&.decrease
							bg-image('decrease_1')
						&.discount
							bg-image('discount_1')
						&.guarantee
							bg-image('guarantee_1')
						&.invoice
							bg-image('invoice_1')
						&.special
							bg-image('special_1')
					.text
						font-size: 10px
						line-height: 12px
			.support-count
				position: absolute;
				right: 12px
				bottom: 14px
				padding: 0 8px
				height: 24px
				line-height: 24px
				border-radius: 14px
				background: rgba(0,0,0,0.2)
				text-align: center
				.count
					vertical-align: top
					font-size: 10px
				.icon-keyboard_arrow_right
					line-height: 24px
					margin-left: 2px
					font-size: 10px
		.bulletin-wrapper
			position: relative
			padding: 0 22px 0 12px
			height: 28px
			line-height: 28px 
			background: rgba(7,17,27,0.2)
			overflow: hidden;
			text-overflow: ellipsis
			white-space: nowrap
			.bulletin-title	
				display: inline-block
				vertical-align: middle
				width: 22px
				height: 12px
				bg-image('bulletin')
				background-size: 22px 12px
				background-repeat: no-repeat
			.bulletin-text
				margin: 0 4px
				font-size: 10px
			.icon-keyboard_arrow_right	
				position: absolute
				right: 12px
				top: 10px 		
				font-size: 10px
		.background
			position: absolute 
			top: 0
			left: 0
			width: 100%
			height: 100%
			z-index: -1
			filter: blur(10px) /*模糊效果*/
		.detail
			position: fixed
			z-index: 100
			top: 0
			left: 0
			width: 100%
			height: 100%
			overflow: auto
			backdrop-filter: blur(10px) /* 背景模糊效果，只能ios生效 */
			opacity:1
			background: rgba(7,17,27,0.8)
			&.fade-enter-active, &.fade-leave-active{
				transition: all .5s
			}
			&.fade-enter, &.fade-leave-active
				opacity:0
				background: rgba(7,17,27,0)
				
			.detail-wrapper
				min-height: 100%
				width: 100%
				.detail-main
					margin-top: 64px
					padding-bottom: 64px /*font-size+底部距离*/
					.name
						line-height: 16px
						text-align: center
						font-size: 700
					.star-wrapper
						margin-top: 18px
						padding: 2px 0
						text-align: center
					.title
						display: flex
						width: 80%
						margin: 30px auto 24px auto
						.line
							flex: 1
							position: relative
							top: -6px
							/* border-bottom: 1px solid rgba(255,255,255,0.2) */
							border-1px(rgba(255,255,255,0.2))
						.text
							margin:0 12px 
							font-weight: 700
							font-size: 14px
					.support
						width: 80%
						margin: 0 auto
						.support-item
							padding: 0 12px
							margin-bottom: 12px
							font-size: 0
							&:last-child
								margin-bottom: 0
							.icon
								display: inline-block
								width: 16px
								height: 16px
								vertical-align: top
								margin-right: 6px
								background-size: 16px 16px
								background-repeat: no-repeat
								&.decrease
									bg-image('decrease_2')
								&.discount
									bg-image('discount_2')
								&.guarantee
									bg-image('guarantee_2')
								&.invoice
									bg-image('invoice_2')
								&.special
									bg-image('special_2')
							.text
								margin-left: 6px
								font-size: 12px
								line-height: 16px
					.bulletin
						width: 80%
						margin: 0 auto
						.content
							padding: 0 12px
							line-height: 24px
							font-size: 12px
			.detail-close
				position: relative
				width: 32px
				height: 32px
				margin: -64px auto 0 auto
				clear: both
				.icon-close
					font-size: 32px
		
		


</style>
