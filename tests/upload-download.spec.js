import { test, expect } from '@playwright/test';
const ExcelJS = require('exceljs');
const path = require('path');
const fs = require('fs');

async function writeExcelTest(searchText, replacedText, change, filePath) {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(filePath);
  const worksheet = workbook.getWorksheet('Sheet1');

  const output = await readExcel(worksheet, searchText);

  const cell = worksheet.getCell(output.row, output.column + change.colChange);
  cell.value = replacedText;
  await workbook.xlsx.writeFile(filePath);
}

async function readExcel(worksheet, searchText) {
  let output = {
    row: -1,
    column: -1,
  };

  worksheet.eachRow((row, rowNumber) => {
    row.eachCell((cell, columnNumber) => {
      if (cell.value === searchText) {
        output.row = rowNumber;
        output.column = columnNumber;
      }
    });
  });
  return output;
}

test('Upload download excel validation', async ({ page }) => {
  const textSearch = 'Mango';
  const updateValue = '350';

  // ✅ Determine the correct download directory
  const downloadDir = process.env.CI
    ? '/tmp/downloads' // GitHub Actions uses /tmp
    : path.join(process.env.HOME, 'downloads'); // Local uses ~/downloads

  // Create directory if it doesn't exist
  if (!fs.existsSync(downloadDir)) {
    fs.mkdirSync(downloadDir, { recursive: true });
  }

  const filePath = path.join(downloadDir, 'download.xlsx');

  await page.goto(
    'https://rahulshettyacademy.com/upload-download-test/index.html',
  );

  const downloadPromise = page.waitForEvent('download');
  await page.getByRole('button', { name: 'Download' }).click();
  const dl = await downloadPromise;

  // ✅ Save the downloaded file
  await dl.saveAs(filePath);

  await writeExcelTest(
    textSearch,
    updateValue,
    { rowChange: 0, colChange: 2 },
    filePath,
  );

  await page.locator('#fileinput').setInputFiles(filePath);

  const desiredRow = await page
    .getByRole('row')
    .filter({ has: page.getByText(textSearch) });
  await expect(desiredRow.locator('#cell-4-undefined')).toContainText(
    updateValue,
  );
});
