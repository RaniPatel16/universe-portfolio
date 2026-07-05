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

    console.log("Loading page...");
    try {
        await page.goto('http://localhost:5173/', { timeout: 30000 });

        // Enter
        const enterBtn = page.locator('button:has-text("Enter Universe")');
        await enterBtn.waitFor({ state: 'visible', timeout: 20000 });
        await enterBtn.click();

        // Start
        const startBtn = page.locator('button:has-text("Start Journey")');
        await startBtn.waitFor({ state: 'visible', timeout: 20000 });
        await startBtn.click();

        await new Promise(r => setTimeout(r, 2000));

        // Click Knowledge Core
        console.log("Targeting KNOWLEDGE CORE in HUD...");
        const sectorBtn = page.locator('button:has-text("KNOWLEDGE CORE")').first();
        await sectorBtn.waitFor({ state: 'visible', timeout: 20000 });
        await sectorBtn.click();

        console.log("Warping... Waiting 15 seconds to observe console logs...");
        await new Promise(r => setTimeout(r, 15000));

    } catch (error) {
        console.error("Diagnostic execution failed:", error);
    } finally {
        await browser.close();
        console.log("Done.");
    }
})();
