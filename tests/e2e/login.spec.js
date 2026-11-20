const { test, expect } = require('@playwright/test');
test('connexion via navigateur', async ({ page }) => {
  await page.goto('/login.html');
  await page.getByRole('button', { name: 'Se connecter' }).click();
  await expect(page.getByRole('status')).toHaveText('connexion reussie');
});
