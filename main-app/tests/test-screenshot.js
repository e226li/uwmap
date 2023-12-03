// Adapted from https://github.com/addyosmani/puppeteer-webperf/
// Source license is Apache License 2.0 (permissive)

const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox']});
    const page = await browser.newPage();

    await page.tracing.start({ screenshots: true, path: 'trace.json' });
    await page.goto('http://localhost:3000', { timeout: 60000 });
    await page.tracing.stop();

    // Extract data from the trace
    const tracing = JSON.parse(fs.readFileSync('./trace.json', 'utf8'));
    const traceScreenshots = tracing.traceEvents.filter(x => (
        x.cat === 'disabled-by-default-devtools.screenshot' &&
        x.name === 'Screenshot' &&
        typeof x.args !== 'undefined' &&
        typeof x.args.snapshot !== 'undefined'
    ));

    let screenshotNum = 0;
    traceScreenshots.forEach(function(snap, index) {
        fs.writeFile(`artifacts/screenshot-main-${index}.png`, snap.args.snapshot, 'base64', function(err) {
            if (err) {
                console.log('writeFile error', err);
            }
        });
        screenshotNum++;
    });
    await page.screenshot({path: `artifacts/screenshot-main-${screenshotNum}.png`})
    screenshotNum++;
    await new Promise(r => setTimeout(r, 5000));
    await page.screenshot({path: `artifacts/screenshot-main-${screenshotNum}.png`})

    await page.goto('http://localhost:3000/about', { timeout: 60000 });
    await page.screenshot({path: `artifacts/screenshot-about.png`})

    await browser.close();
})();