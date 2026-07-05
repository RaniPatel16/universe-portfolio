import { chromium } from 'playwright';
import fs from 'fs';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const files = [
        'media__1783230005388.jpg',
        'media__1783230081492.jpg',
        'media__1783230090401.jpg',
        'media__1783230098542.jpg',
        'media__1783230106851.jpg'
    ];

    console.log("Analyzing image dimensions...");
    for (const file of files) {
        const filePath = `C:/Users/ASUS/.gemini/antigravity/brain/25e46262-16e6-40e5-aede-19ffb6c9b723/${file}`;
        if (!fs.existsSync(filePath)) {
            console.log(`${file} does not exist.`);
            continue;
        }

        // Load local file content as data URL
        const fileBuffer = fs.readFileSync(filePath);
        const base64 = fileBuffer.toString('base64');
        const dataUrl = `data:image/jpeg;base64,${base64}`;

        const dimensions = await page.evaluate((url) => {
            return new Promise((resolve) => {
                const img = new Image();
                img.onload = () => {
                    resolve({ width: img.width, height: img.height });
                };
                img.src = url;
            });
        }, dataUrl);

        console.log(`FILE: ${file} | WIDTH: ${dimensions.width} | HEIGHT: ${dimensions.height}`);
    }

    await browser.close();
})();
