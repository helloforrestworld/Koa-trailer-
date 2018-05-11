const base = 'https://movie.douban.com/subject/'

// const baseArr = [
//   { doubanId: 27160683,
//    title: '忍者蝙蝠侠',
//    rate: 7.1,
//    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2506695706.jpg' 
//   },
//   { doubanId: 26905703,
//    title: '人工智能：灭绝危机',
//    rate: 4,
//    poster: 'https://img3.doubanio.com/view/photo/l_ratio_poster/public/p2473817886.jpg' 
//   }
// ]

const doubanId = 27160683

const puppeteer = require('puppeteer')

const {resolve} = require('path')

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

;(async () => {
      console.log('Start visit the target page')
      const browser = await puppeteer.launch({
        executablePath: resolve(__dirname, './chromium/chrome.exe'),
        headless: false,
        args: ['--no-sandbox'],
        dumpio: false
      })
      const page = await browser.newPage();
      await page.goto(base + doubanId, {
        waitUntil: 'networkidle2' // 页面空闲时，也就是加载完毕
      });
      
      await sleep(2000)
      
      let result, video
      try {
        result = await page.evaluate(() => { // 获取数据
          // 在页面上执行的脚本
          // 豆瓣上有jquery 可以直接用
          let $ = window.$
          let it = $('.related-pic-bd')
          
          if (it && it.length > 0) {
            let link = it.find('a').attr('href')
            let cover = it.find('img').attr('src')
            
            return {
              link,
              cover
            }
          }
        })
      } catch(err) {
        console.log(err)
      }
      
      // 调转到预告片页面
      if (result.link) {
        await page.goto(result.link, {
          waitUntil: 'networkidle2'
        })
        
        await sleep(1000)
        
        try {
          video = await page.evaluate(() => {
            let $ = window.$
            let src = $('source').attr('src')
            return src
          })
        } catch(err) {
          console.log(err)
        }
      }
      
      const data = {
        video,
        cover: result.cover,
        doubanId
      }
      
      
      browser.close()
      
      process.send(data)
      process.exit(0)
})()