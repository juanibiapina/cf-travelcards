import { test, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

test('Card drag-and-drop reordering', async ({ page }) => {
  await setupClerkTestingToken({ page });
  await page.goto('/');

  // Wait for authentication
  await expect(page.locator('text=New Activity')).toBeVisible();

  // Create a new activity
  await page.click('text=New Activity');
  await expect(page.locator('button[aria-label="Create card"]')).toBeVisible();

  // Create three cards for testing
  const cardTitles = ['First Card', 'Second Card', 'Third Card'];

  for (const title of cardTitles) {
    await page.click('button[aria-label="Create card"]');
    await expect(page.locator('input[placeholder*="What\'s on your mind"]')).toBeVisible();
    await page.fill('input[placeholder*="What\'s on your mind"]', title);
    await page.keyboard.press('Enter');
    await expect(page.locator(`text=${title}`)).toBeVisible();
  }

  // Get initial card order
  const initialCardOrder = await page.locator('h3').allTextContents();
  expect(initialCardOrder).toEqual(['First Card', 'Second Card', 'Third Card']);

  // Enter reorder mode
  await page.click('[aria-label="Activity menu"]');
  await page.click('text=Reorder Cards');
  await expect(page.locator('text=Done')).toBeVisible();

  // Perform drag-and-drop: Move first card to third position
  const firstCard = page.locator('[data-card-id]').filter({ hasText: 'First Card' });
  const thirdCard = page.locator('[data-card-id]').filter({ hasText: 'Third Card' });

  // Use Playwright's drag-and-drop method to drag first card to third card position
  await firstCard.dragTo(thirdCard);

  // Exit reorder mode
  await page.click('text=Done');
  await expect(page.locator('text=Done')).not.toBeVisible();

  // Verify the card order has changed
  const newCardOrder = await page.locator('h3').allTextContents();
  expect(newCardOrder).toEqual(['Second Card', 'Third Card', 'First Card']);
});

test('Card drag-and-drop to end position', async ({ page }) => {
  await setupClerkTestingToken({ page });
  await page.goto('/');

  await expect(page.locator('text=New Activity')).toBeVisible();
  await page.click('text=New Activity');
  await expect(page.locator('button[aria-label="Create card"]')).toBeVisible();

  // Create two cards
  const cardTitles = ['Alpha Card', 'Beta Card'];

  for (const title of cardTitles) {
    await page.click('button[aria-label="Create card"]');
    await expect(page.locator('input[placeholder*="What\'s on your mind"]')).toBeVisible();
    await page.fill('input[placeholder*="What\'s on your mind"]', title);
    await page.keyboard.press('Enter');
    await expect(page.locator(`text=${title}`)).toBeVisible();
  }

  // Enter reorder mode
  await page.click('[aria-label="Activity menu"]');
  await page.click('text=Reorder Cards');
  await expect(page.locator('text=Done')).toBeVisible();

  // Move first card to the end (drag to second card to move it after)
  const firstCard = page.locator('[data-card-id]').filter({ hasText: 'Alpha Card' });
  const secondCard = page.locator('[data-card-id]').filter({ hasText: 'Beta Card' });

  await firstCard.dragTo(secondCard);

  // Exit reorder mode
  await page.click('text=Done');

  // Verify the order changed: Alpha moved to end
  const finalOrder = await page.locator('h3').allTextContents();
  expect(finalOrder).toEqual(['Beta Card', 'Alpha Card']);
});