const puppeteer = require("puppeteer");

const Server = require("./server");

module.exports = async ({ outfile }) => {
  const port = 4251;
  const server = new Server({ port });

  const [browser] = await Promise.all([
    puppeteer.launch({ headless: true }),
    server.start(),
  ]);

  const page = await browser.newPage();

  await page.goto(`http://localhost:${port}`);

  await page.emulateMedia("print");

  await page.pdf({
    pageRanges: "1",
    path: outfile,
    format: "letter",
    scale: 0.72,
    margin: {
      top: "0.28in",
      bottom: "0.28in",
      left: "0.38in",
      right: "0.38in",
    },
  });

  await Promise.all([browser.close(), server.stop()]);

  return outfile;
};
