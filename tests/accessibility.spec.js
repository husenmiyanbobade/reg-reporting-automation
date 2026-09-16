const { test, expect } = require('@playwright/test');
const AxeBuilder = require('@axe-core/playwright').default;

const BASE_URL = `file://${__dirname.replace(/\\/g, '/')}/../mock-app`;

test('reports page has no accessibility violations', async ({ page }) => {
  await page.goto(`${BASE_URL}/reports.html`);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  console.log(`Found ${results.violations.length} violation(s)`);
  results.violations.forEach(v => {
    console.log(`- [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} element(s))`);
  });

  expect(results.violations).toEqual([]);
});

test('workflow page has no accessibility violations', async ({ page }) => {
  await page.goto(`${BASE_URL}/workflow.html`);

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();

  console.log(`Found ${results.violations.length} violation(s)`);
  results.violations.forEach(v => {
    console.log(`- [${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} element(s))`);
  });

  expect(results.violations).toEqual([]);
});