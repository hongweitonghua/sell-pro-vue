var express = require('express'); //导入express

var config = require('./config/index'); //导入index.js(里面有很多配置)

var port = process.env.PORT || config.build.port; //初始化端口,端口在index.js配置

var app = express(); //实例化express

var router = express.Router(); //初始化路由

router.get('/',function (req,res,next) {
  req.url = '/index.html'; //这里访问的是发布dist/index.html
  next();
});

app.use(router);

var appData = require('./data.json'); //读取模拟的数据文件
var seller = appData.seller;
var goods = appData.goods;
var ratings = appData.ratings;

var apiRoutes = express.Router();

apiRoutes.get('/seller', function (req, res) {
  res.json({
    errno: 0,
    data: seller
  });
});

apiRoutes.get('/goods', function (req, res) {
  res.json({
    errno: 0,
    data: goods
  });
});

apiRoutes.get('/ratings', function (req, res) {
  res.json({
    errno: 0,
    data: ratings
  });
});

app.use('/api', apiRoutes);

app.use(express.static('./dist')); //使用./dist作为web目录,所以能够找到.dist/index.html

module.exports = app.listen(port, function (err) { //启动监听
  if (err) {
    console.log(err);
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
});