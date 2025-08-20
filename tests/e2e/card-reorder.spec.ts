import { test, expect } from '@playwright/test';
import { readFileSync } from 'fs';

const { PRODUCTION_USER_EMAIL, PRODUCTION_USER_PASSWORD } = (() => {
  try {
    const envData = readFileSync('.env.local', 'utf-8');
    return Object.fromEntries(
      envData.split('\n')
        .filter(line => line.includes('='))
        .map(line => {
          const [key, ...valueParts] = line.split('=');
          return [key, valueParts.join('=')];
        })
    );
  } catch {
    return {};
  }
})();

test('Card reordering with long press', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Login
  await page.click('text=Sign in');
  await page.fill('input[name="identifier"]', PRODUCTION_USER_EMAIL || 'test@example.com');
  await page.click('button:has-text("Continue")');
  await page.fill('input[name="password"]', PRODUCTION_USER_PASSWORD || 'password');
  await page.click('button:has-text("Continue")');

  // Wait for login to complete
  await expect(page.locator('text=New Activity')).toBeVisible();

  // Create a new activity
  await page.click('text=New Activity');
  await expect(page.locator('input[placeholder*="activity name"]')).toBeVisible();

  // Add some cards to test reordering
  const fab = page.locator('[data-testid="floating-action-button"]').or(page.locator('button:has([data-testid="floating-action-button"])'));

  // Create first card
  await fab.click();
  await page.fill('input[placeholder*="mind"]', 'First Card');
  await page.keyboard.press('Enter');

  // Create second card
  await fab.click();
  await page.fill('input[placeholder*="mind"]', 'Second Card');
  await page.keyboard.press('Enter');

  // Create third card
  await fab.click();
  await page.fill('input[placeholder*="mind"]', 'Third Card');
  await page.keyboard.press('Enter');

  // Wait for cards to be visible
  await expect(page.locator('text=First Card')).toBeVisible();
  await expect(page.locator('text=Second Card')).toBeVisible();
  await expect(page.locator('text=Third Card')).toBeVisible();

  // Get initial order
  const cards = page.locator('[data-testid="card-component"]').or(page.locator('h3:has-text("Card")'));
  const initialOrder = await cards.allTextContents();

  // Simulate long press on the first card (500ms+ touch)
  const firstCard = page.locator('text=First Card').locator('..');

  // Touch start
  await firstCard.dispatchEvent('touchstart', {
    touches: [{ clientX: 100, clientY: 100 }]
  });

  // Wait for long press timeout (500ms+)
  await page.waitForTimeout(600);

  // Touch end to complete long press
  await firstCard.dispatchEvent('touchend');

  // Verify selection mode is active
  await expect(page.locator('text=Selection mode')).toBeVisible();

  // Verify the first card is selected (should have visual feedback)
  await expect(firstCard).toHaveClass(/ring-2.*ring-blue-500/);

  // Click on a drop zone to move the card
  const dropZones = page.locator('[data-testid="drop-zone"]').or(page.locator('div:has-text("Drop here")'));
  await dropZones.last().click(); // Move to end

  // Verify selection mode is deactivated
  await expect(page.locator('text=Selection mode')).not.toBeVisible();

  // Verify the card order has changed
  const newOrder = await cards.allTextContents();
  expect(newOrder).not.toEqual(initialOrder);
  expect(newOrder).toContain('First Card');
});

test('Card selection cancellation', async ({ page }) => {
  await page.goto('http://localhost:5173');

  // Login and create activity (simplified for this test)
  await page.click('text=Sign in');
  await page.fill('input[name="identifier"]', PRODUCTION_USER_EMAIL || 'test@example.com');
  await page.click('button:has-text("Continue")');
  await page.fill('input[name="password"]', PRODUCTION_USER_PASSWORD || 'password');
  await page.click('button:has-text("Continue")');

  await expect(page.locator('text=New Activity')).toBeVisible();
  await page.click('text=New Activity');

  // Create a card
  const fab = page.locator('[data-testid="floating-action-button"]').or(page.locator('button:has([data-testid="floating-action-button"])'));
  await fab.click();
  await page.fill('input[placeholder*="mind"]', 'Test Card');
  await page.keyboard.press('Enter');

  await expect(page.locator('text=Test Card')).toBeVisible();

  const card = page.locator('text=Test Card').locator('..');

  // Start long press but cancel by moving
  await card.dispatchEvent('touchstart', {
    touches: [{ clientX: 100, clientY: 100 }]
  });

  // Move finger (should cancel selection)
  await card.dispatchEvent('touchmove', {
    touches: [{ clientX: 120, clientY: 100 }] // Move 20px horizontally
  });

  await card.dispatchEvent('touchend');

  // Wait a bit
  await page.waitForTimeout(200);

  // Verify selection mode was not activated
  await expect(page.locator('text=Selection mode')).not.toBeVisible();
  await expect(card).not.toHaveClass(/ring-2.*ring-blue-500/);
});