import puppeteer from "puppeteer-core";
import chromium from "chrome-aws-lambda";

export async function scrapeSydneyEvents() {
  let browser = null;
  try {
    const executablePath = await chromium.executablePath;

     browser = await puppeteer.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless,
    });
    const page = await browser.newPage();
    await page.goto("https://www.eventbrite.com.au/d/australia--sydney/events/", {
      waitUntil: "networkidle2",
    });

    // Scroll to trigger lazy loading
    await autoScroll(page);

    const events = await page.evaluate(() => {
  const containers = document.querySelectorAll("div.Stack_root__1ksk7");
  let data = [];

  containers.forEach((container) => {
    const linkElement = container.querySelector("a.event-card-link");
    const title = linkElement?.querySelector("h3")?.innerText.trim();
    const link = linkElement?.href;

    const paragraphs = container.querySelectorAll("p");
    const date = paragraphs[1]?.innerText.trim() || "";
    const location = paragraphs[2]?.innerText.trim() || "";

    if (title && link) {
      data.push({ title, date, location, link });
    }
  });

  return data;
});

    await browser.close();
    return events;
  } catch (error) {
    console.error("Error scraping events:", error);
  }
}

async function autoScroll(page) {
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let totalHeight = 0;
      const distance = 300;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;

        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 200);
    });
  });
}
