# premovie

> 预告片网站

## Build Setup

``` bash
# install dependencies
npm install

# before start
确保本地安装mongodb并且服务已经开启
make sure you have installed mongodb and the service is running

默认使用七牛云存储静态资源和CDN加速
如果没有的朋友可以去注册一个, 实名认证大概半小时，然后可以获取一定量的免费空间和流量
认证后新建backet

然后修改server/config/index.js下面的内容
填上你七牛云的相关信息

然后到src/common/js/mixin.js下
修改addBase方法下的默认链接为你空间的默认外链

然后就可以启动了，有问题可以邮箱私信我

# server with hot reload at localhost:3333
npm start
// 第一次启动后就可以注释server/index.js下的爬虫脚本了

# build
make sure install parcel in gobal
npm run build

# test after build
npm run exec
```

## 测试
### 前台页面
[前台页面][1]
### 后台管理页面
[后台管理][2]

管理员账号：admin@qq.com
密码: 123456

**添加电影注意**
视频和海报地址需要是http/https协议的,不支持ed2k

例如:

海报地址：
https://img1.doubanio.com/view/photo/l_ratio_poster/public/p2519994468.webp
视频地址:
http://vt1.doubanio.com/201805241616/ca24dfd1d36cc84406e361b2c8a90d23/view/movie/M/402300311.mp4

![此处输入图片的描述][3]


## 截图
### 首页
![此处输入图片的描述][4]
### 详情
![此处输入图片的描述][5]
### 登录
![此处输入图片的描述][6]
### 后台管理
![此处输入图片的描述][7]

## 目录结构
## 准备工作
## 知识点
## 总结

  [1]: http://premovie.hasakei66.com/
  [2]: http://premovie.hasakei66.com/management
  [3]: https://ws1.sinaimg.cn/large/e8323205gy1frmi81dy3fj20qe0ftq3n.jpg
  [4]: https://ws1.sinaimg.cn/large/e8323205gy1frmj7tnjjmj213v0jn13t.jpg
  [5]: https://ws1.sinaimg.cn/large/e8323205gy1frmj82b4amj213t0joaht.jpg
  [6]: https://ws1.sinaimg.cn/large/e8323205gy1frmj7wcfp8j21400jnq3k.jpg
  [7]: https://ws1.sinaimg.cn/large/e8323205gy1frmj804qquj213w0jngpy.jpg
  