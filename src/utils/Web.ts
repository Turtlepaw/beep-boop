import * as puppeteer from "puppeteer";

/**
 * Captures a screenshot of the website.
 */
export async function getScreenshot(browser: puppeteer.Browser, page: string | puppeteer.Page): Promise<Buffer> {
    if (!browser) browser = await puppeteer.launch();
    if (page == typeof String && (!page.toString().startsWith("http"))) "http://" + page;
    if (typeof page == "string") {
        const pageURL = page;
        page = await browser.newPage();
        await page.goto(pageURL);
    }
    const buffer = await page.screenshot({
        omitBackground: true,
        encoding: 'binary'
    });
    if (typeof buffer == "string") throw new Error("Screenshot failed: page.screenshot() returned a string");
    return buffer;
}

export function ResolveURL(url: string) {
    if (!(url.startsWith("https://") || url.startsWith("http://"))) url = "http://" + url;
    return url;
}