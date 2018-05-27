const url = 'https://movie.douban.com/explore#!type=movie&tag=%E7%83%AD%E9%97%A8&sort=time&page_limit=20&page_start=0'
const puppeteer = require('puppeteer')

const {resolve} = require('path')

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
      console.log('Start visit the target page')
      const browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        dumpio: false
      })
      const page = await browser.newPage();
      await page.goto(url, {
        waitUntil: 'networkidle2' // 页面空闲时，也就是加载完毕
      });
      
      // 确定页面加载完毕
      await sleep(3000)
      
      await page.waitForSelector('.more') // 等待.more元素加载完成比(加载更多按钮)

      for (let i = 0; i < 1; i++) { // 加载两页
        await sleep(3000)
        await page.click('.more')
      }
      let result
      try {
        result = await page.evaluate(() => { // 获取数据
          // 在页面上执行的脚本
          // 豆瓣上有jquery 可以直接用
          let $ = window.$
          let items = $('.list-wp a')
          let links = []
          
          if (items.length >= 1) { // 不为空
            items.each((index, item) => {
              var it = $(item)
              var doubanId = it.find('div').data('id')
              var trimindex = it.find('p').text().trim().indexOf('\n')
              var title = it.find('p').text().trim().slice(0, trimindex)
              var rate = Number(it.find('strong').text().trim())
              var src = it.find('img').attr('src')
              var poster = src ? src.replace('s_ratio', 'l_ratio') : '' // 拿到大图
              
              links.push({
                doubanId,
                title,
                rate,
                poster
              })
            })
          }
          return links
        })
      } catch(err) {
        console.log(err)
      }
      
      browser.close()
      
      process.send({result})
      process.exit(0)
})()