import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

(async () => {
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    const dir = 'C:/Users/ASUS/.gemini/antigravity/brain/25e46262-16e6-40e5-aede-19ffb6c9b723';
    const outDir = 'c:/Users/ASUS/OneDrive/Desktop/universe-portfolio/universe/public/assets/certificates';

    // Ensure output directory exists
    if (!fs.existsSync(outDir)) {
        fs.mkdirSync(outDir, { recursive: true });
    }

    const jobs = [
        {
            file: 'media__1783231310012.png',
            outName: 'gssoc-2026.jpg',
            rotate: 0,
            crop: { sx: 0.05, sy: 0.17, sw: 0.90, sh: 0.70 } // Crop LinkedIn top and bottom headers
        },
        {
            file: 'media__1783231321459.png',
            outName: 'parul-tech-expo-2026.jpg',
            rotate: 0,
            crop: { sx: 0.10, sy: 0.05, sw: 0.81, sh: 0.90 } // Crop wood margins around Parul Mech Expo cert
        },
        {
            file: 'media__1783231327327.png',
            outName: 'electrosphere-2k26.jpg',
            rotate: 90, // Rotate 90 deg clockwise to align landscape
            crop: { sx: 0.04, sy: 0.05, sw: 0.92, sh: 0.90 } // Crop wood table borders
        },
        {
            file: 'media__1783231332762.png',
            outName: 'hackx-2026.jpg',
            rotate: 90, // Rotate 90 deg clockwise to align landscape
            crop: { sx: 0.04, sy: 0.05, sw: 0.92, sh: 0.90 } // Crop wood table borders
        }
    ];

    console.log("Executing canvas processing...");
    for (const job of jobs) {
        const filePath = path.join(dir, job.file);
        if (!fs.existsSync(filePath)) {
            console.log(`Error: file ${filePath} does not exist.`);
            continue;
        }

        const dataUrl = `data:image/png;base64,${fs.readFileSync(filePath).toString('base64')}`;

        console.log(`Processing: ${job.file} -> ${job.outName}`);
        const buffer = await page.evaluate(async ({ url, rotate, crop }) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => {
                    try {
                        const canvas = document.createElement('canvas');
                        const ctx = canvas.getContext('2d');

                        let origW = img.width;
                        let origH = img.height;

                        // Compute canvas size after rotation
                        if (rotate === 90 || rotate === 270) {
                            canvas.width = origH;
                            canvas.height = origW;
                        } else {
                            canvas.width = origW;
                            canvas.height = origH;
                        }

                        // Draw image with rotation
                        if (rotate === 90) {
                            ctx.translate(canvas.width, 0);
                            ctx.rotate(90 * Math.PI / 180);
                            ctx.drawImage(img, 0, 0);
                        } else if (rotate === 180) {
                            ctx.translate(canvas.width, canvas.height);
                            ctx.rotate(180 * Math.PI / 180);
                            ctx.drawImage(img, 0, 0);
                        } else if (rotate === 270) {
                            ctx.translate(0, canvas.height);
                            ctx.rotate(270 * Math.PI / 180);
                            ctx.drawImage(img, 0, 0);
                        } else {
                            ctx.drawImage(img, 0, 0);
                        }

                        // Now crop from this rotated image
                        const cropCanvas = document.createElement('canvas');
                        const cropCtx = cropCanvas.getContext('2d');

                        const sx = Math.floor(canvas.width * crop.sx);
                        const sy = Math.floor(canvas.height * crop.sy);
                        const sw = Math.floor(canvas.width * crop.sw);
                        const sh = Math.floor(canvas.height * crop.sh);

                        cropCanvas.width = sw;
                        cropCanvas.height = sh;
                        cropCtx.drawImage(canvas, sx, sy, sw, sh, 0, 0, sw, sh);

                        // Convert to dataurl and return
                        const data = cropCanvas.toDataURL('image/jpeg', 0.95);
                        resolve(data);
                    } catch (e) {
                        reject(e.toString());
                    }
                };
                img.onerror = () => reject("Image loading error");
                img.src = url;
            });
        }, { url: dataUrl, rotate: job.rotate, crop: job.crop });

        // Extract base64 and save
        const base64Data = buffer.replace(/^data:image\/jpeg;base64,/, "");
        const outPath = path.join(outDir, job.outName);
        fs.writeFileSync(outPath, Buffer.from(base64Data, 'base64'));
        console.log(`Saved: ${outPath}`);
    }

    await browser.close();
    console.log("Image processing complete.");
})();
