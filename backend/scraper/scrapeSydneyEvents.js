import puppeteer from "puppeteer";

export async function scrapeSydneyEvents() {
  const browser = await puppeteer.launch();
  try {
    const page = await browser.newPage();
    await page.goto("https://www.eventbrite.com.au/d/australia--sydney/events/", {
      waitUntil: "networkidle2",
    });

  
    await autoScroll(page);

  const events = await page.evaluate(() => {
  const cards = document.querySelectorAll("section.discover-vertical-event-card");
  const data = [];

  cards.forEach(card => {
    
    const image = card.querySelector("img.event-card-image")?.src || "";

   
    const titleAnchor = card.querySelector("section.event-card-details a.event-card-link");
    const title = titleAnchor?.querySelector("h3")?.innerText.trim() || "";
    const link = titleAnchor?.href || "";

    
    const paragraphs = card.querySelectorAll("section.event-card-details p");
    const date = paragraphs[1]?.innerText.trim() || "";
    const location = paragraphs[2]?.innerText.trim() || "";

    
    const price = card.querySelector("div[class*='priceWrapper'] p")?.innerText.trim() || "";

    if (title && link) {
      data.push({ title, date, location, price, link, image });
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
