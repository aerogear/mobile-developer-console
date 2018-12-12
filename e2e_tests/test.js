const puppeteer = require('puppeteer');
const assert = require('assert');

const headless = process.env.HEADLESS !== 'false';

let browser;
let page;

const initTest = context => {
  context.timeout(0);

  before('initialize puppeteer', async function() {
    browser = await puppeteer.launch({
      ignoreHTTPSErrors: true,
      headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    page = await browser.newPage();
  });
  
  after('close browser', async function() {
    await browser.close();
  });
};

const login = async () => {
  await page.goto(`https://${process.env.MDC_URL}`);
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type=submit]')
  ]);
  await page.type('#inputUsername', 'developer');
  await page.type('#inputPassword', 'developer');
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type=submit]')
  ]);
  if (await page.$('input[name=approve]')) {
    await Promise.all([
      page.waitForNavigation(),
      await page.click('input[name=approve]')
    ]);
  }
};

describe('login', function() {
  initTest(this);

  it('should log in', async function() {
    await login();
  });
});

describe('create app', function() {
  initTest(this);

  before('login', async function() {
    await login();
  });

  it('should create app', async function() {
    const appName = `test${Date.now()}`;

    await page.click('.toolbar-pf button');

    await page.type('#name', appName);
    await page.click('.modal-footer .btn-primary');

    await page.waitForFunction(
      text => [...document.querySelectorAll('.card-pf h1')].find(e => e.innerText === text),
      {},
      appName
    );

    const error = await page.$('.pficon-error-circle-o');
    assert.strictEqual(error, null, 'there should be no error when creating app');
  });
});
