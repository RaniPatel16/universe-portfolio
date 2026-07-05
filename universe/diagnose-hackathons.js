import { chromium } from 'playwright';

(async () => {
    console.log("Launching playwright...");
    const browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();

    page.on('console', msg => {
        console.log(`CRITICAL-LOG [${msg.type().toUpperCase()}]: ${msg.text()}`);
    });

    page.on('pageerror', err => {
        console.error('CRITICAL-PAGE-ERROR:', err.stack || err.message);
    });

    console.log("Loading page on port 5174...");
    try {
        await page.goto('http://localhost:5174/', { timeout: 60000 });

        // Wait for the Enter Universe button
        console.log("Waiting for Enter Universe button to appear...");
        const enterBtn = page.locator('button:has-text("Enter Universe")');
        await enterBtn.waitFor({ state: 'visible', timeout: 50000 });

        console.log("Clicking Enter Universe...");
        await enterBtn.click();

        // Wait for Start Journey button
        console.log("Waiting for Start Journey button...");
        const startBtn = page.locator('button:has-text("Start Journey")');
        await startBtn.waitFor({ state: 'visible', timeout: 30000 });

        console.log("Clicking Start Journey...");
        await startBtn.click();

        await new Promise(r => setTimeout(r, 3000));

        // Click Hackathon Arena
        console.log("Targeting HACKATHON ARENA in HUD...");
        const sectorBtn = page.locator('button:has-text("HACKATHON ARENA")').first();
        await sectorBtn.waitFor({ state: 'visible', timeout: 20000 });
        await sectorBtn.click();

        console.log("Warping... Waiting 12 seconds...");
        // Long wait to allow warp camera animation to finish and scans to start
        await new Promise(r => setTimeout(r, 12000));

        // Wait for the scanning list to render. Scanning is done when hackathonsScanned is true.
        console.log("Waiting for scan to complete and list to appear...");
        const sihBtn = page.locator('button:has-text("Smart India Hackathon")').first();
        await sihBtn.waitFor({ state: 'visible', timeout: 20000 });

        console.log("Taking screenshot of scanned overview before click...");
        await page.screenshot({ path: 'diagnose-hack-overview.png' });

        console.log("Clicking Smart India Hackathon booth...");
        await sihBtn.click();

        console.log("Waiting 3 seconds for photo frames and details...");
        await new Promise(r => setTimeout(r, 3000));

        console.log("Taking screenshot of focused hackathon booth details...");
        await page.screenshot({ path: 'diagnose-hack-details.png' });

        // Click a photo in gallery
        console.log("Locating and clicking mission photo in gallery...");
        const photoFrame = page.locator('img[alt="Winning Trophy Distribution"]').first();
        await photoFrame.waitFor({ state: 'visible', timeout: 10000 });
        await photoFrame.click();

        console.log("Waiting 2 seconds for photo focus zoom...");
        await new Promise(r => setTimeout(r, 2000));

        console.log("Taking screenshot of zoomed photo frame visual...");
        await page.screenshot({ path: 'diagnose-hack-photo-zoom.png' });

        // Click next photo in gallery carousel
        console.log("Clicking NEXT FRAME button...");
        const nextBtn = page.locator('button:has-text("NEXT FRAME")').first();
        await nextBtn.waitFor({ state: 'visible', timeout: 10000 });
        await nextBtn.click();

        console.log("Waiting 2 seconds for next photo transition...");
        await new Promise(r => setTimeout(r, 2000));

        console.log("Taking screenshot of next photo zoom...");
        await page.screenshot({ path: 'diagnose-hack-next-photo.png' });

    } catch (error) {
        console.error("Diagnostic execution failed:", error);
    } finally {
        try {
            console.log("Taking screenshot of final state...");
            await page.screenshot({ path: 'diagnose-hack-final.png' });
        } catch (e) {
            console.error("Failed to take screenshot in finally:", e);
        }
        await browser.close();
        console.log("Done.");
    }
})();
