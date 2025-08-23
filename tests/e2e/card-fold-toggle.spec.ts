import { test, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

test.describe('Card Fold Toggle', () => {
  test('can fold and unfold cards with extra data', async ({ page }) => {
    await setupClerkTestingToken({ page });

    // Navigate to home page
    await page.goto('/');

    // Wait for authentication
    await expect(page.locator('text=New Activity')).toBeVisible();

    // Click New Activity button
    await page.click('text=New Activity');

    // Wait for activity page to load
    await expect(page.locator('button[aria-label="Create card"]')).toBeVisible();

    // Create a new card
    await page.click('button[aria-label="Create card"]');

    // Wait for modal to be visible
    await expect(page.locator('input[placeholder*="What\'s on your mind"]')).toBeVisible();

    // Fill in card title and create
    await page.fill('input[placeholder*="What\'s on your mind"]', 'Test Card with Extra Data');
    await page.press('input[placeholder*="What\'s on your mind"]', 'Enter');

    // Wait for modal to close and card to appear
    await expect(page.locator('text=Test Card with Extra Data')).toBeVisible();

    // Add extra data using the plus button
    await page.click('button[aria-label="Add extra data"]');

    // Wait for extra data input to appear
    await expect(page.locator('input[placeholder="Add extra data..."]')).toBeVisible();

    // Add some text data
    await page.fill('input[placeholder="Add extra data..."]', 'First extra data item');
    await page.press('input[placeholder="Add extra data..."]', 'Enter');

    // Add another extra data item
    await page.click('button[aria-label="Add extra data"]');
    await expect(page.locator('input[placeholder="Add extra data..."]')).toBeVisible();
    await page.fill('input[placeholder="Add extra data..."]', 'Second extra data item');
    await page.press('input[placeholder="Add extra data..."]', 'Enter');

    // Verify both extra data items are hidden (folded by default)
    await expect(page.locator('text=First extra data item')).not.toBeVisible();
    await expect(page.locator('text=Second extra data item')).not.toBeVisible();

    // Verify chevron right icon is visible (indicating folded state)
    await expect(page.locator('[data-testid="chevron-right"]')).toBeVisible();

    // Click on the card title area to unfold it
    await page.click('text=Test Card with Extra Data');

    // Verify extra data items are now visible (unfolded)
    await expect(page.locator('text=First extra data item')).toBeVisible();
    await expect(page.locator('text=Second extra data item')).toBeVisible();

    // Verify chevron down icon is visible (indicating unfolded state)
    await expect(page.locator('[data-testid="chevron-down"]')).toBeVisible();

    // Click on the card title area again to fold it
    await page.click('text=Test Card with Extra Data');

    // Verify extra data items are hidden again (folded)
    await expect(page.locator('text=First extra data item')).not.toBeVisible();
    await expect(page.locator('text=Second extra data item')).not.toBeVisible();

    // Verify chevron right icon is visible again (indicating folded state)
    await expect(page.locator('[data-testid="chevron-right"]')).toBeVisible();
  });

  test('cards without extra data do not show fold indicators', async ({ page }) => {
    await setupClerkTestingToken({ page });

    // Navigate to home page and create activity
    await page.goto('/');
    await expect(page.locator('text=New Activity')).toBeVisible();
    await page.click('text=New Activity');
    await expect(page.locator('button[aria-label="Create card"]')).toBeVisible();

    // Create a new card without extra data
    await page.click('button[aria-label="Create card"]');
    await expect(page.locator('input[placeholder*="What\'s on your mind"]')).toBeVisible();
    await page.fill('input[placeholder*="What\'s on your mind"]', 'Card without extra data');
    await page.press('input[placeholder*="What\'s on your mind"]', 'Enter');
    await expect(page.locator('text=Card without extra data')).toBeVisible();

    // Verify no chevron icons are visible
    await expect(page.locator('[data-testid="chevron-down"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="chevron-right"]')).not.toBeVisible();

    // Verify clicking the card doesn't cause any visual changes (no fold behavior)
    await page.click('text=Card without extra data');
    await expect(page.locator('[data-testid="chevron-down"]')).not.toBeVisible();
    await expect(page.locator('[data-testid="chevron-right"]')).not.toBeVisible();
  });

  test('fold state does NOT persist across page reloads (browser-only)', async ({ page }) => {
    await setupClerkTestingToken({ page });

    // Navigate to home page and create activity
    await page.goto('/');
    await expect(page.locator('text=New Activity')).toBeVisible();
    await page.click('text=New Activity');
    await expect(page.locator('button[aria-label="Create card"]')).toBeVisible();

    // Create a card with extra data
    await page.click('button[aria-label="Create card"]');
    await expect(page.locator('input[placeholder*="What\'s on your mind"]')).toBeVisible();
    await page.fill('input[placeholder*="What\'s on your mind"]', 'Browser Only Test Card');
    await page.press('input[placeholder*="What\'s on your mind"]', 'Enter');
    await expect(page.locator('text=Browser Only Test Card')).toBeVisible();

    // Add extra data
    await page.click('button[aria-label="Add extra data"]');
    await expect(page.locator('input[placeholder="Add extra data..."]')).toBeVisible();
    await page.fill('input[placeholder="Add extra data..."]', 'Browser only extra data');
    await page.press('input[placeholder="Add extra data..."]', 'Enter');

    // Extra data is folded by default (not visible)
    await expect(page.locator('text=Browser only extra data')).not.toBeVisible();
    await expect(page.locator('[data-testid="chevron-right"]')).toBeVisible();

    // Unfold the card to see extra data
    await page.click('text=Browser Only Test Card');
    await expect(page.locator('text=Browser only extra data')).toBeVisible();
    await expect(page.locator('[data-testid="chevron-down"]')).toBeVisible();

    // Fold the card again
    await page.click('text=Browser Only Test Card');
    await expect(page.locator('text=Browser only extra data')).not.toBeVisible();
    await expect(page.locator('[data-testid="chevron-right"]')).toBeVisible();

    // Reload the page
    await page.reload();
    await expect(page.locator('text=Browser Only Test Card')).toBeVisible();

    // Verify the card is back to FOLDED after reload (default state, no persistence)
    await expect(page.locator('text=Browser only extra data')).not.toBeVisible();
    await expect(page.locator('[data-testid="chevron-right"]')).toBeVisible();
  });

  test('fold toggle works during reorder mode', async ({ page }) => {
    await setupClerkTestingToken({ page });

    // Navigate to home page and create activity
    await page.goto('/');
    await expect(page.locator('text=New Activity')).toBeVisible();
    await page.click('text=New Activity');
    await expect(page.locator('button[aria-label="Create card"]')).toBeVisible();

    // Create two cards (needed for reorder mode to be available)
    await page.click('button[aria-label="Create card"]');
    await expect(page.locator('input[placeholder*="What\'s on your mind"]')).toBeVisible();
    await page.fill('input[placeholder*="What\'s on your mind"]', 'Reorder Mode Test Card');
    await page.press('input[placeholder*="What\'s on your mind"]', 'Enter');
    await expect(page.locator('text=Reorder Mode Test Card')).toBeVisible();

    // Add extra data to the first card
    await page.click('button[aria-label="Add extra data"]');
    await expect(page.locator('input[placeholder="Add extra data..."]')).toBeVisible();
    await page.fill('input[placeholder="Add extra data..."]', 'Extra data in reorder mode');
    await page.press('input[placeholder="Add extra data..."]', 'Enter');

    // Extra data is folded by default (not visible)
    await expect(page.locator('text=Extra data in reorder mode')).not.toBeVisible();
    await expect(page.locator('[data-testid="chevron-right"]')).toBeVisible();

    // Create a second card to enable reorder mode
    await page.click('button[aria-label="Create card"]');
    await expect(page.locator('input[placeholder*="What\'s on your mind"]')).toBeVisible();
    await page.fill('input[placeholder*="What\'s on your mind"]', 'Second Card');
    await page.press('input[placeholder*="What\'s on your mind"]', 'Enter');
    await expect(page.locator('text=Second Card')).toBeVisible();

    // Enter reorder mode
    await page.click('[aria-label="Activity menu"]');
    await page.click('text=Reorder Cards');
    await expect(page.locator('text=Done')).toBeVisible();

    // Verify fold toggle does NOT work during reorder mode (clicking should not change fold state)
    await page.click('text=Reorder Mode Test Card');

    // Extra data should remain not visible (no fold change occurred, stays folded)
    await expect(page.locator('text=Extra data in reorder mode')).not.toBeVisible();
    await expect(page.locator('[data-testid="chevron-right"]')).toBeVisible();

    // Exit reorder mode
    await page.click('text=Done');

    // Now verify fold toggle works again after exiting reorder mode
    // Card should still be folded, so clicking should unfold it
    await page.click('text=Reorder Mode Test Card');
    await expect(page.locator('text=Extra data in reorder mode')).toBeVisible();
    await expect(page.locator('[data-testid="chevron-down"]')).toBeVisible();
  });
});