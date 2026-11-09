// Smoke test for bin/run.mjs: npm run smoke
export default async ({ page, args, out }) => {
  const url = args[0] ?? 'https://example.com';
  await page.goto(url);
  const shot = out('smoke.png');
  await page.screenshot({ path: shot });
  return { url, title: await page.title(), screenshot: shot };
};
