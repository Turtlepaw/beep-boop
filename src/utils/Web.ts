import * as puppeteer from "puppeteer";
import { promisify } from "util";
const wait = promisify(setTimeout);

/**
 * Captures a screenshot of the website.
 */
export async function getScreenshot(
  browser: puppeteer.Browser,
  page: string | puppeteer.Page,
  delay = 0,
  delayCallback: () => unknown
) {
  if (!browser)
    browser = await puppeteer.launch({
      executablePath: "/usr/bin/chromium-browser",
    });
  if (page == typeof String && !page.toString().startsWith("http"))
    "http://" + page;
  if (typeof page == "string") {
    const pageURL = page;
    page = await browser.newPage();
    await page.goto(pageURL);
  }

  if (delay > 0) await wait(delay);
  await delayCallback();
  const buffer = await page.screenshot({
    omitBackground: true,
    encoding: "binary",
  });

  if (typeof buffer == "string")
    throw new Error("Screenshot failed: page.screenshot() returned a string");

  return {
    buffer,
    page: typeof page == "string" ? page : page.url(),
  };
}

export function ResolveURL(url: string) {
  if (!(url.startsWith("https://") || url.startsWith("http://")))
    url = "http://" + url;
  return url;
}
