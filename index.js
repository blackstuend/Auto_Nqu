const puppeteer = require('puppeteer');


async function Auto_write(account, password, delay,option) { //option 0~5
    delay || delay == 2000
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('http://select.nqu.edu.tw/kmkuas/index_sky.html');
    const menu = (await page.frames())[2];  //get frame memu
    const main = (await page.frames())[3];  //get frame main
    await main.evaluate((account, password) => {  //模擬登入
        let input = document.querySelectorAll('.textone')
        input[0].value = account
        input[1].value = password
        let login = document.querySelectorAll('.button')[1];
        login.click()
    }, account, password)
    await page.waitFor(delay)
    await menu.evaluate(function () {  //模擬按下教學評量
        let choose = document.querySelectorAll('.ob_td')[34].querySelector('div')
        choose.click();
    })
    await page.waitFor(delay)
    var class_length = await main.evaluate(function () { //取得有幾堂課 class_length -2 = 最多堂課 從2開始
        var all_tr = document.querySelectorAll('table')[3].querySelectorAll('tr')
        return all_tr.length
    })
    for (i = 1; i < class_length - 1; i++) {
            check_filled = await main.evaluate(function (i) { //模擬選取第三堂課
            var all_tr = document.querySelectorAll('table')[3].querySelectorAll('tr')
            if (all_tr[i].querySelectorAll('td')[6].innerText == '未完成') {
                all_tr[i].click();
                console.log(i);
                return true
            }
            else {
                return false
            }
        }, i)
        if (!check_filled)
            continue
        await page.waitFor(delay)
        await main.evaluate(function (option) { //模擬填寫教學評量畫面
            var table = document.querySelectorAll('table')[4];
            var all_tr = table.querySelectorAll('tr')
            for (let j = 3; j < all_tr.length - 1; j++) {
                if(option == 'random')
                option = Math.floor(Math.random()*5)
                all_tr[j].querySelectorAll('input')[option].click()
            }
            document.querySelector('center').querySelectorAll('input')[1].click()
        },option)
        try{
        page.on('dialog', dialog => {
            dialog.dismiss();
          });
        }
        catch(e){
            
        }
        await page.waitFor(delay)
    }
    console.log('完成')
    browser.close()
}
var account = process.argv[2]
var password = process.argv[3]
var option = process.argv[4]
Auto_write(account,password,2000,option)