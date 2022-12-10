import request from 'request';
import cheerio from 'cheerio';

export function searchGoogle(query: string): Promise<{ url: string; buffer: Buffer }[]> {
    return new Promise((resolve, reject) => {
        request(`https://www.google.com/search?q=${query}`, (error, response, html) => {
            if (error) {
                reject(error);
                return;
            }

            const $ = cheerio.load(html);
            const imageUrls = $('img')
                .map((i, el) => $(el).attr('src'))
                .get();

            const images = [];
            imageUrls.forEach(imageUrl => {
                if (imageUrl.startsWith('https:')) {
                    request(imageUrl, (error, response, body) => {
                        if (error) {
                            reject(error);
                            return;
                        }

                        images.push({ url: imageUrl, buffer: body });
                        if (images.length === imageUrls.length) {
                            resolve(images);
                        }
                    });
                }
            });
        });
    });
}