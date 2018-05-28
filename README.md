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
```
    .
├── server                                      // 后端服务器
|   ├── config                                  // 七牛用户配置
|   ├── crawler                                 // 爬虫脚本
|       └── trailer-list                        // 基础电影信息爬虫
|       └── video                               // 视频和海报爬虫
|   ├── database                                // 数据库相关
|       └── schema                              // schema配置
|       └── init                                // 数据库初始化
|   ├── lib                                     // 工具库
|       └── decorator                           // 装饰后端路由
|       └── util                                // 普通工具方法
|   ├── middlewares                             // 中间件
|       └── parcel                              // 集成parcel
|       └── common                              // 普通中间件
|       └── router                              // 路由中间件
|   ├── routes                                  // 后端路由配置
|       └── movie                               // 请求电影相关api
|       └── user                                // 后台管理相关api
|   ├── service                                 // 后端服务
|       └── movie                               // 电影api相关服务
|       └── user                                // 登录服务
|   ├── tasks                                   // 进程管理
|       └── api                                 // 请求详细数据
|       └── movie                               // 基础数据爬虫进程
|       └── qiniu                               // 上传静态资源进程
|       └── trailer                             // 视频海报爬虫进程
├── src                                         // 前端项目核心文件
│   ├── base                                    // 公共组件
|       └── no-result                           // 无结果组件
│   ├── common                                  // 公共静态资源
|       └── image                               // 公共图片
|       └── js                                  // 公共js
|           └── mixin                           // mixin
│   ├── components                              // 业务组件
|       └── home                                // 首页
|       └── home-content                        // 首页主内容
|       └── login                               // 登录页
|       └── management                          // 后台管理页
|       └── movie-detail                        // 电影详情页
|       └── player                              // 首页播放器
|       └── toolbar                             // 头部和左侧导航
|   ├── router                                  // 前端路由
|   ├── store                                   // vuex
|       └── index                               // store入口
│   ├── App.vue                                 // 组件入口
│   ├── main.js                                 // 前端入口文件
├── index.html                                  // 模板html文件
├── start.js                                    // 项目入口文件
.

```
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
  