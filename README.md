
# sell-pro 基本介绍
'造轮子'：主要也是为了学习vue而做，有问题或者任何不足的地方欢迎提出。

 ###### 本项目使用vue+webpack搭建，仿照饿了么外卖平台写的页面，包括 商品、评论、商家 三大主页面及其子页面。主要功能及主要技术下面介绍。
项目开发流程图:
![项目开发流程-饿了么](https://github.com/hongweitonghua/sell-pro-vue/blob/master/screenshots/%E9%A1%B9%E7%9B%AE%E5%BC%80%E5%8F%91%E6%B5%81%E7%A8%8B-%E9%A5%BF%E4%BA%86%E4%B9%88.png "项目开发流程-饿了么")

主要技术列表：

- vue-resource做后端数据交互(ajax)
- vue-router做前端路由,实现单页应用
- 列表滚动-第三方js库better-scrolll
- 最大程度组件化
- 组件间通信
- vue的$nextTick使用
- html5的localstorage做收藏商家功能
- 图标字体的使用(Icon font就是将一套图标集以字体文件的形式封装，并通过CSS 3的@font-face作为Web Font调用)
- 移动端1像素边框问题技术处理
- css sticky footer布局技术
- flex弹性布局技术[阮一峰](http://www.ruanyifeng.com/blog/2015/07/flex-grammar.html)
- table布局实现水平垂直居中

# sell-pro 使用

> sell project

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```
