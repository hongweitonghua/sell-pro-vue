<template>
	<div class="ratingselect">
		<div class="rating-type">
			<span @click="select(all,$event)" class="block all" :class="{'active':selectType===all}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span @click="select(positive,$event)" class="block positive" :class="{'active':selectType===positive}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span @click="select(negative,$event)" class="block negative" :class="{'active':selectType===negative}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div class="switch" :class="{'on':onlyContent}" @click="toggleContent($event)">
			<div class="icon-check_circle"></div>
			<div class="text">只看有内容的评价</div>
		</div>
	</div>
</template>
<script>
const POSITIVE = 0;
const NEGATIVE = 1;
const ALL = 2;

export default{
	props:{
		ratings:{ //要显示的评论数组
			type: Array,
			default(){
				return [];
			}
		},
		selectType:{ //选择的类型，比如ALL，POSITIVE，NEGATIVE
			type: Number,
			default: ALL
		},
		onlyContent:{ //是否只查看有内容的评价
			type: Boolean,
			default: false
		},
		desc:{ //selectType的文字描述
			type: Object,
			default(){
				return{
					all: '全部',
					positive: '满意',
					negative: '不满意'
				}
			}
		}
	},
	data(){
		return{
			positive: POSITIVE,
			negative: NEGATIVE,
			all: ALL
		}
	},
	computed:{
		positives(){
			return this.ratings.filter((rating)=>{
				return rating.rateType === POSITIVE;
			});
		},
		negatives(){
			return this.ratings.filter((rating)=>{
				return rating.rateType === NEGATIVE;
			});
		}
	},
	methods:{
		select(type,event){
			if(!event._constructed){
				return;
			}
			console.log(type);
			this.$emit('select',type);
		},
		toggleContent(event){
			if(!event._constructed){
				return;
			}
			this.$emit('toggleContent',!this.onlyContent);
		}
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
@import "../../common/stylus/base.styl"

.ratingselect
	.rating-type
		padding: 18px 0
		margin: 0 18px /* 考虑到下面border-bottom的长度 */
		border-1px(rgba(7,17,27,0.1))
		.block
			display: inline-block
			padding: 8px 12px
			margin-right: 8px
			line-height: 16px
			border-radius: 1px
			font-size: 12px
			color: rgb(77,85,93)
			&.active
				color: #fff
			.count
				margin-left: 2px
				line-height: 16px
				font-size: 10px
		.all,.positive
			background: rgba(0,160,220,0.2)
			&.active
				background: rgb(0,160,220)
		.negative
			background: rgba(77,85,93,0.2)
			&.active
				background: rgb(77,85,93)
			
	.switch
		padding: 12px 18px
		line-height: 24px
		color: rgb(147,153,159)
		border-1px(rgba(7,17,27,0.1))
		font-size: 0
		&.on
			.icon-check_circle
				color: #00c850
		.icon-check_circle
			display: inline-block
			vertical-align: top
			margin-right: 4px
			font-size: 24px
		.text
			display: inline-block
			vertical-align: top
			font-size: 12px

</style>
