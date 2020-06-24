require('events').EventEmitter.defaultMaxListeners = 10000;
const express = require("express");
const puppeteer = require('puppeteer');
const cors = require("cors");
const bodyParser = require('body-parser')
const app = express()
let scrap = null;

async function search_logo(keywords, res) {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto('https://www.brandroot.com/names?keyword='+keywords, {waitUntil: "networkidle2"})
    const searching = async() => {
        scrap = await page.evaluate(() => document.querySelector('div.brands-list').innerHTML)
        if(scrap) 
            res.send(scrap)
        else 
            return searching(0)
      }
    await searching()
}

app.use(bodyParser.json())
app.use(cors())
app.use('/logo/:id', (req, res) => {
    search_logo(req.params.id, res)
    if(scrap) {
        // res.send(scrap)        
    }
    // res.send('hi there')
    // console.log(req, res)
});

app.listen(process.env.PORT || 5000, () => {
    console.log('listening to port', 5000)
})