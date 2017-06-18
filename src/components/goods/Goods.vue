<template>
	<div class="goods">
		<div class="menu-wrapper" ref="menuWrapper">
			<ul>
				<li v-for="(item,key) in goods" class="menu-item border-1px" :class="{'active':key===currentIndex}" @click="selectMenu(key,$event)">
					<span class="text border-1px">
						<span v-show="item.type>=0" class="icon" :class="classMap[item.type]"></span>{{item.name}}
					</span>
				</li>
			</ul>
		</div>
		<div class="food-wrapper" ref="foodWrapper">
			<ul>
				<li v-for="(item,key) in goods" class="food-list food-list-hook">
					<h1 class="title">{{item.name}}</h1>
					<ul>
						<li v-for="(food,key) in item.foods" class="food-item border-1px" @click="selectFood(food,$event)">
							<div class="foodimg">
								<img :src="food.icon">
							</div>
							<div class="content">
								<h2 class="name">{{food.name}}</h2>
								<p class="desc">{{food.description}}</p>
								<div class="extra">
									<span class="sellCount">月售{{food.sellCount}}份</span><span>好评率{{food.rating}}%</span>
								</div>
								<div class="price">
									<span class="newPrice">￥{{food.price}}</span><span v-show="food.oldPrice" class="oldPrice">￥{{food.oldPrice}}</span>
								</div>
							</div>
							<div class="cartcontrol-wrapper">
								<v-cartcontrol :food="food" @cart_add="_drop"></v-cartcontrol>
							</div>
						</li>
					</ul>
				</li>
			</ul> 
		</div>
		<v-shopcart :deliveryPrice="seller.deliveryPrice" :minPrice="seller.minPrice" :selectFoods="selectFoods" ref="vShopcart"></v-shopcart>
		<v-food :food="selectedFood" ref="foodDetail" @cart_add="_drop"></v-food>
	</div>
</template>
<script>
import BScroll from 'better-scroll'
import Shopcart from '../shopcart/Shopcart.vue'
import Cartcontrol from '../cartcontrol/Cartcontrol.vue'
import Food from '../food/Food.vue'

const ERR_OK = 0;

export default{
	props:{
		seller:{
			type: Object
		}
	},
	data(){
		return {
			goods: [],
			listHeight: [],
			scrollY: 0,
			selectedFood: {}
		}
	},
	methods:{
		selectMenu(index,event){
			if(!event._constructed){
				return;
			}
			let el = this.foodList[index];
			this.foodScroll.scrollToElement(el,300); //动画300ms
		},
		selectFood(food,event){
			if(!event._constructed){
				return;
			}
			this.selectedFood = food;
			this.$refs.foodDetail.show();
		},
		_initBScroll(){
			this.menuScroll = new BScroll(this.$refs.menuWrapper,{
				click: true
			});

			this.foodScroll = new BScroll(this.$refs.foodWrapper,{
				click: true,
				probeType: 3
			});

			this.foodScroll.on('scroll',(pos)=>{
				this.scrollY = Math.abs(Math.round(pos.y));
			})
		},
		_calculateHeight(){
			this.foodList = this.$refs.foodWrapper.getElementsByClassName('food-list-hook');
			let height = 0;
			this.listHeight.push(height);
			for(let i = 0; i < this.foodList.length; i++){
				let item = this.foodList[i];
				height += item.clientHeight;
				this.listHeight.push(height);
			}
		},
		_drop(target){//调用子组件shopcart的drop方法
			//体验优化，//让动画效果异步执行,提高性能
			this.$nextTick(()=>{
				this.$refs.vShopcart.drop(target);
			});
		}
	},
	computed:{
		currentIndex(){
			for(let i = 0; i < this.listHeight.length; i++){
				let height1 = this.listHeight[i];
				let height2 = this.listHeight[i+1];
				if(!height2 || (this.scrollY >= height1 && this.scrollY < height2)){
					return i;
				}
			}
			return 0;
		},
		//在cartcontrol组件中，讲food对象传递进去，进行修改food的count，这里使用计算属性 ，随时改变selectFoods数组，而selectFoods数组又会影响shopcart.vue购物车内的数量
		selectFoods(){
			let foods = [];
			this.goods.forEach((good)=>{
				good.foods.forEach((food)=>{
					if(food.count){
						foods.push(food);
					}
				})
			});
			return foods;
		}
	},
	created(){
		this.classMap = ['decrease','discount','special','invoice','guarantee'];

		this.$http.get('./api/goods').then((res)=>{
	      	let resData = res.data;
	      	if(resData.errno === ERR_OK){
	      		this.goods = resData.data;
	      		
	      	}
	      	//this.$nextTick是在下次DOM更新循环结束时调用延迟回调函数。
	      	this.$nextTick(()=>{
	      		this._initBScroll();
	      		this._calculateHeight();
	      	});
    	},(res)=>{
      		alert(res.status);
    	});

		/*Event.$on('cart.add',(target)=>{
				this._drop(target);
		});*/
	},
	components:{
		'v-shopcart': Shopcart,
		'v-cartcontrol': Cartcontrol,
		'v-food': Food
	}
}
</script>
<style lang="stylus" rel="stylesheet/stylus">
@import "../../common/stylus/mixin.styl"
@import "../../common/stylus/base.styl"
.goods
	display: flex
	position: absolute
	top: 174px
	bottom: 46px
	width: 100%
	overflow: hidden
	.menu-wrapper
		flex: 0 0 80px
		width: 80px
		background: #f3f5f7
		.menu-item
			display: table
			padding: 0 12px
			height: 54px
			line-height: 14px
			&.active
				position: relative
				z-index: 100
				margin-top: -1px /*盖住上面1px的边框*/
				background: #fff
				font-weight: 700
				.text
					border-none()
			.text
				display: table-cell
				width: 56px
				vertical-align: middle
				border-1px(rgba(7,17,27,0.1))
				/*color: rgb(240,20,20) */
				font-size: 12px
				.icon
					display: inline-block
					margin-right: 4px
					vertical-align: top
					width: 12px
					height: 12px
					background-size: 12px 12px
					background-repeat: no-repeat
					&.decrease
						bg-image('decrease_3')
					&.discount
						bg-image('discount_3')
					&.guarantee
						bg-image('guarantee_3')
					&.invoice
						bg-image('invoice_3')
					&.special
						bg-image('special_3')
	.food-wrapper
		flex: 1
		.title
			padding-left: 14px
			height: 26px
			line-height: 26px
			font-size: 12px
			color: rgb(147, 153, 159)
			background: #f3f5f7
			border-left: 2px solid #d9dde1
		.food-item
			display: flex
			position: relative
			margin: 18px 18px 0 18px
			padding-bottom: 18px
			border-1px(rgba(7,17,27,0.1))
			&.last-child
				border-none()
				margin-bottom: 0
			.foodimg
				flex: 0 0 57px
				width: 57px
				margin-right: 10px
				img
					width: 57px
					hieght: 57px
			.content
				flex: 1	
				color: rgb(147,153,159)		
				.name
					margin: 2px 0 8px 0
					font-size: 14px
					color: rgb(7,17,27)
					line-height: 14px
				.desc, .extra
					font-size: 10px
					line-height: 10px
				.desc
					margin-bottom: 8px	
				.extra
					.sellCount
						margin-right: 12px
				.price
					margin-top: 5px
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

			.cartcontrol-wrapper
				position: absolute
				right: 0
				bottom: 9px
				

</style>
