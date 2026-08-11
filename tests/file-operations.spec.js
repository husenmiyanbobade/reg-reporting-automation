const {test, expect, chromium} = require('@playwright/test');
const path = require('path');

const BASE_URL = 'file://' + __dirname.replace(/\\/g, '/') + '/../mock-app';

test('Upload Regulatory filling CSV file', async () => {
    
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(`${BASE_URL}/file-operations.html`);

    // Build File path to our Sample CSV file
    const filePath = path.join(__dirname, '..', 'test-data', 'sample-filing.csv');

    // set the file input value to the file path
    await page.getByTestId('filing-upload-input').setInputFiles(filePath);

    // verify that file name is displayed in the UI
    await expect(page.getByTestId('file-name-display')).toContainText('sample-filing.csv')
    
    // click Upload button
    await page.getByTestId('upload-btn').click();

    // Verify Success message is displayed
    await expect(page.getByTestId('upload-status')).toContainText('uploaded successfully');

    await browser.close();

});

test('Download generated report and verify file name', async () => {
    const browser = await chromium.launch();
    const page = await browser.newPage();

    await page.goto(`${BASE_URL}/file-operations.html`);

    // Start waiting for the download before clicking the download button
    const downloadPromise = page.waitForEvent('download');

    // click Download button
    await page.getByTestId('download-btn').click();

    // wait for Download to complete
    const download = await downloadPromise;

    // verify that the downloaded file name is as expected
    expect(download.suggestedFilename()).toBe('EMIR_Q1_2024_Summary.csv');

    // Save the downloaded file to a specific path (optional)
    const savePath = path .join(__dirname, '..', 'test-data', 'downloaded-report.csv');
    await download.saveAs(savePath);

    console.log('downloaded file saved at : ', savePath);

    await browser.close();

});