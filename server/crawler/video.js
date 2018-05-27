const base = 'https://movie.douban.com/subject/'

const puppeteer = require('puppeteer')

const {resolve} = require('path')

const sleep = time => new Promise(resolve => {
  setTimeout(resolve, time)
})

process.on('message', async (movies) => { // 接受movies开始爬虫
      console.log('Start visit the target page')
      const browser = await puppeteer.launch({
        executablePath: resolve(__dirname, './chromium/chrome.exe'),
        args: ['--no-sandbox'],
        dumpio: false
      })
      const page = await browser.newPage();
      
      for (let i = 0; i < movies.length; i++) { // 循环每个movie
        let doubanId = movies[i].doubanId
        await page.goto(base + doubanId, {
          waitUntil: 'networkidle2' // 页面空闲时，也就是加载完毕
        });
        
        await sleep(1000)
        
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
        if (i === movies.length - 1) {
          data.finish = true
        }
        process.send(data)
      }
      browser.close()
      process.exit(0)
})
