import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
    const dir = 'C:/Users/ASUS/.gemini/antigravity/brain/25e46262-16e6-40e5-aede-19ffb6c9b723';
    const files = [
        'media__1783231153898.png',
        'media__1783231310012.png',
        'media__1783231321459.png',
        'media__1783231327327.png',
        'media__1783231332762.png',
        'media__1783231584777.png'
    ];

    let htmlContent = `
    <html>
      <head>
        <style>
          body { background: #111; color: white; font-family: sans-serif; display: flex; flex-wrap: wrap; gap: 20px; padding: 20px; }
          .card { border: 1px solid #444; padding: 10px; background: #222; border-radius: 8px; display: flex; flex-direction: column; align-items: center; }
          img { max-width: 450px; border: 1px solid #666; }
          span { margin-top: 10px; font-size: 14px; font-family: monospace; }
        </style>
      </head>
      <body>
  `;

    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.existsSync(filePath)) {
            const base64 = fs.readFileSync(filePath).toString('base64');
            htmlContent += `
        <div class="card">
          <img src="data:image/png;base64,${base64}" />
          <span>${file}</span>
        </div>
      `;
        }
    }

    htmlContent += `
      </body>
    </html>
  `;

    fs.writeFileSync('thumbnails.html', htmlContent);

    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    await page.setViewportSize({ width: 2500, height: 1800 });
    await page.setContent(htmlContent);
    await page.screenshot({ path: 'thumbnails-screenshot.png', fullPage: true });
    await browser.close();
    console.log("Screenshot generated as thumbnails-screenshot.png");
})();
