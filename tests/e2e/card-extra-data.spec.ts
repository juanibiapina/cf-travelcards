import { test, expect } from '@playwright/test';
import { setupClerkTestingToken } from '@clerk/testing/playwright';

test.describe('Card Extra Data', () => {
  test('can add and display extra data items including clickable URLs', async ({ page }) => {
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
    await page.fill('input[placeholder*="What\'s on your mind"]', 'Test Card');
    await page.press('input[placeholder*="What\'s on your mind"]', 'Enter');

    // Wait for modal to close and card to appear
    await expect(page.locator('text=Test Card')).toBeVisible();

    // Click on the plus button to show extra data input
    await page.click('button[aria-label="Add extra data"]');

    // Wait for extra data input to appear
    await expect(page.locator('input[placeholder="Add extra data..."]')).toBeVisible();

    // Add some text data
    await page.fill('input[placeholder="Add extra data..."]', 'This is some extra information');
    await page.press('input[placeholder="Add extra data..."]', 'Enter');

    // Extra data is folded by default, so click card to unfold and see the data
    await page.click('text=Test Card');

    // Wait for the chevron to show unfolded state
    await expect(page.locator('[data-testid="chevron-down"]')).toBeVisible();

    // Wait for unfold animation and verify the extra data appears as a sub-item
    await expect(page.locator('text=This is some extra information')).toBeVisible({ timeout: 10000 });
    // Check for bullet point
    await expect(page.locator('span:has-text("•")')).toBeVisible();

    // Click on the plus button again to add a URL
    await page.click('button[aria-label="Add extra data"]');
    await expect(page.locator('input[placeholder="Add extra data..."]')).toBeVisible();

    // Add a URL
    await page.fill('input[placeholder="Add extra data..."]', 'https://example.com');
    await page.press('input[placeholder="Add extra data..."]', 'Enter');

    // Card should remain unfolded after adding more extra data, so URL should be visible
    const urlLink = page.locator('a[href="https://example.com"]');
    await expect(urlLink).toBeVisible({ timeout: 10000 });
    await expect(urlLink).toHaveAttribute('target', '_blank');
    await expect(urlLink).toHaveAttribute('rel', 'noopener noreferrer');

    // Verify both extra data items are shown as sub-items
    await expect(page.locator('text=This is some extra information')).toBeVisible();
    await expect(page.locator('a[href="https://example.com"]')).toBeVisible();

    // Check that we have two bullet points (one for each extra data item)
    await expect(page.locator('span:has-text("•")')).toHaveCount(2);
  });

  test('extra data input closes when clicking outside', async ({ page }) => {
    await setupClerkTestingToken({ page });

    // Navigate to home page
    await page.goto('/');

    // Wait for authentication and create activity
    await expect(page.locator('text=New Activity')).toBeVisible();
    await page.click('text=New Activity');
    await expect(page.locator('button[aria-label="Create card"]')).toBeVisible();

    // Create a new card
    await page.click('button[aria-label="Create card"]');
    await expect(page.locator('input[placeholder*="What\'s on your mind"]')).toBeVisible();
    await page.fill('input[placeholder*="What\'s on your mind"]', 'Test Card for Closing');
    await page.press('input[placeholder*="What\'s on your mind"]', 'Enter');
    await expect(page.locator('text=Test Card for Closing')).toBeVisible();

    // Click on the plus button to show extra data input
    await page.click('button[aria-label="Add extra data"]');
    await expect(page.locator('input[placeholder="Add extra data..."]')).toBeVisible();

    // Click outside the card (on the background)
    await page.click('body', { position: { x: 50, y: 50 } });

    // Verify the input is no longer visible
    await expect(page.locator('input[placeholder="Add extra data..."]')).not.toBeVisible();
  });

  test('does not show extra data input during reorder mode', async ({ page }) => {
    await setupClerkTestingToken({ page });

    // Navigate to home page and create activity
    await page.goto('/');
    await expect(page.locator('text=New Activity')).toBeVisible();
    await page.click('text=New Activity');
    await expect(page.locator('button[aria-label="Create card"]')).toBeVisible();

    // Create two cards for reordering test
    await page.click('button[aria-label="Create card"]');
    await expect(page.locator('input[placeholder*="What\'s on your mind"]')).toBeVisible();
    await page.fill('input[placeholder*="What\'s on your mind"]', 'First Card');
    await page.press('input[placeholder*="What\'s on your mind"]', 'Enter');
    await expect(page.locator('text=First Card')).toBeVisible();

    await page.click('button[aria-label="Create card"]');
    await expect(page.locator('input[placeholder*="What\'s on your mind"]')).toBeVisible();
    await page.fill('input[placeholder*="What\'s on your mind"]', 'Second Card');
    await page.press('input[placeholder*="What\'s on your mind"]', 'Enter');
    await expect(page.locator('text=Second Card')).toBeVisible();

    // Enter reorder mode via hamburger menu
    await page.click('[aria-label="Activity menu"]');
    await page.click('text=Reorder Cards');

    // Wait for reorder mode to be active
    await expect(page.locator('text=Done')).toBeVisible();

    // Verify the plus button is disabled during reorder mode
    await expect(page.locator('button[aria-label="Add extra data"]').first()).toBeDisabled();

    // Verify extra data input does not appear during reorder mode
    await expect(page.locator('input[placeholder="Add extra data..."]')).not.toBeVisible();

    // Exit reorder mode
    await page.click('text=Done');
  });
});