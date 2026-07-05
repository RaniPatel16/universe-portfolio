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

        // Click Knowledge Core
        console.log("Targeting KNOWLEDGE CORE in HUD...");
        const sectorBtn = page.locator('button:has-text("KNOWLEDGE CORE")').first();
        await sectorBtn.waitFor({ state: 'visible', timeout: 20000 });
        await sectorBtn.click();

        console.log("Warping... Waiting 12 seconds...");
        // Long wait to allow warp camera animation to finish and scans to start
        await new Promise(r => setTimeout(r, 12000));

        // Wait for the decryption overview page. The scanning is done when certificatesScanned is true.
        console.log("Waiting for scan to complete and list to appear...");
        const gssocCertBtn = page.locator('button:has-text("GirlScript Summer of")').first();
        await gssocCertBtn.waitFor({ state: 'visible', timeout: 20000 });

        console.log("Taking screenshot of scanned overview before click...");
        await page.screenshot({ path: 'diagnose-screenshot-scanned.png' });

        console.log("Clicking GirlScript Summer of Code certificate...");
        await gssocCertBtn.click();

        console.log("Waiting 3 seconds for image load...");
        await new Promise(r => setTimeout(r, 3000));

        console.log("Taking screenshot of focused certificate visual...");
        await page.screenshot({ path: 'diagnose-screenshot-visual.png' });

        // Let's click "FULL PREVIEW" button
        console.log("Clicking FULL PREVIEW...");
        const previewBtn = page.locator('button:has-text("FULL PREVIEW")').first();
        await previewBtn.waitFor({ state: 'visible', timeout: 10000 });
        await previewBtn.click();

        console.log("Waiting 3 seconds for modal overlay...");
        await new Promise(r => setTimeout(r, 3000));

        console.log("Taking screenshot of modal overlay...");
        await page.screenshot({ path: 'diagnose-screenshot-modal.png' });

        console.log("Closing modal by pressing Escape...");
        await page.keyboard.press('Escape');

        console.log("Waiting 2 seconds for modal close animation...");
        await new Promise(r => setTimeout(r, 2000));

        console.log("Taking screenshot of closed modal state...");
        await page.screenshot({ path: 'diagnose-screenshot-closed.png' });

    } catch (error) {
        console.error("Diagnostic execution failed:", error);
    } finally {
        try {
            console.log("Taking screenshot of final state...");
            await page.screenshot({ path: 'diagnose-screenshot-5174.png' });
        } catch (e) {
            console.error("Failed to take screenshot in finally:", e);
        }
        await browser.close();
        console.log("Done.");
    }
})();
