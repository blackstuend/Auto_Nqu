const puppeteer = require('puppeteer');


async function Auto_write(account, password, delay) {
    delay || delay == 2000
    const browser = await puppeteer.launch({
        headless: false
    });
    const page = await browser.newPage();
    await page.goto('http://select.nqu.edu.tw/kmkuas/index_sky.html');
    const menu = (await page.frames())[2];  //get frame memu
    const main = (await page.frames())[3];  //get frame main
    // await page.waitFor(delay)  
    await main.evaluate((account, password) => {  //模擬登入
        let input = document.querySelectorAll('.textone')
        console.log(account, password)
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
    console.log(class_length)
    await main.evaluate(function () { //模擬選取第三堂課
            var all_tr = document.querySelectorAll('table')[3].querySelectorAll('tr')
            console.log(all_tr[2].querySelectorAll('td')[6].innerText)
            all_tr[16].click();
    })
    await page.waitFor(delay)
    await main.evaluate(function () { //模擬填寫教學評量畫面
        var table = document.querySelectorAll('table')[4];
        var all_tr = table.querySelectorAll('tr')
        // console.log(all_tr)
        for (let i = 3; i < all_tr.length - 1; i++) {
            all_tr[i].querySelectorAll('input')[0].click()
        }
        console.log(document.querySelector('center').querySelectorAll('input')[1])
    })
}

Auto_write('110510533', 'lion850724', 2000)