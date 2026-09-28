import { chromium } from "playwright";

const FRONTEND = process.env.FRONTEND_URL || "https://developer-assessment-platform-front.vercel.app";
const BACKEND = process.env.BACKEND_URL || "https://developer-assessment-platform.onrender.com";

const checks = [];
const pass = (name) => { checks.push({ name, ok: true }); console.log(`PASS: ${name}`); };
const fail = (name, error) => {
  const message = error instanceof Error ? error.message : String(error);
  checks.push({ name, ok: false, error: message });
  console.error(`FAIL: ${name}: ${message}`);
};

async function assertPageClean(page, name) {
  const body = await page.locator("body").innerText();
  const bad = ["Failed to fetch", "Request failed with status", "Application error", "Internal Server Error"];
  const hit = bad.find((text) => body.includes(text));
  if (hit) throw new Error(`Page shows error text: ${hit}`);
  pass(name);
}

async function loginWithDemoButton(page, role, expectedPath) {
  await page.goto(`${FRONTEND}/login`, { waitUntil: "networkidle", timeout: 120_000 });
  await Promise.all([
    page.waitForURL((url) => url.pathname.startsWith(expectedPath), { timeout: 120_000 }),
    page.getByRole("button", { name: new RegExp(role, "i") }).click(),
  ]);
  await assertPageClean(page, `${role} demo login and redirect`);
}

async function logout(page) {
  const button = page.getByRole("button", { name: /Logout/i }).first();
  if (await button.count()) {
    await Promise.all([
      page.waitForURL((url) => url.pathname === "/", { timeout: 30_000 }),
      button.click(),
    ]);
  }
}

console.log(`Live smoke test\nFrontend: ${FRONTEND}\nBackend: ${BACKEND}\n`);
const health = await fetch(`${BACKEND}/health`);
health.ok ? pass("Backend health endpoint") : fail("Backend health endpoint", new Error(String(health.status)));

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.setDefaultTimeout(45_000);

try {
  for (const [path, heading] of [
    ["/", /Assess developer skills/i],
    ["/about", /practical workflow/i],
    ["/features", /assessment lifecycle/i],
    ["/pricing", /Pricing is defined/i],
    ["/faq", /Frequently asked questions/i],
    ["/register", /Create candidate account/i],
    ["/assessments", /^Assessments$/i],
  ]) {
    await page.goto(`${FRONTEND}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
    await page.getByRole("heading", { name: heading }).first().waitFor();
    await assertPageClean(page, `Public page ${path}`);
  }

  await page.goto(FRONTEND, { waitUntil: "networkidle" });
  const beforeDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await page.getByRole("button", { name: "Toggle theme" }).click();
  const afterDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  if (beforeDark === afterDark) throw new Error("Theme class did not change");
  pass("Theme toggle");

  await loginWithDemoButton(page, "Candidate", "/dashboard");
  for (const [path, heading] of [
    ["/dashboard", /Welcome/i],
    ["/attempts", /My attempts/i],
    ["/dashboard/profile", /Profile & settings/i],
    ["/dashboard/payments", /Payment history/i],
    ["/payment/cancel", /Payment cancelled/i],
  ]) {
    await page.goto(`${FRONTEND}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
    await page.getByRole("heading", { name: heading }).first().waitFor();
    await assertPageClean(page, `Candidate page ${path}`);
  }
  await logout(page);

  await loginWithDemoButton(page, "Reviewer", "/reviewer");
  for (const [path, heading] of [
    ["/reviewer", /Assessments & reviews/i],
    ["/reviewer/assessments", /My assessments/i],
    ["/reviewer/assessments/new", /Create assessment/i],
    ["/reviewer/analytics", /Review performance/i],
    ["/reviewer/profile", /Reviewer profile/i],
  ]) {
    await page.goto(`${FRONTEND}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
    await page.getByRole("heading", { name: heading }).first().waitFor();
    await assertPageClean(page, `Reviewer page ${path}`);
  }
  await logout(page);

  await loginWithDemoButton(page, "Admin", "/admin");
  for (const [path, heading] of [
    ["/admin", /Platform overview/i],
    ["/admin/users", /User management/i],
    ["/admin/audit", /Audit logs/i],
  ]) {
    await page.goto(`${FRONTEND}${path}`, { waitUntil: "networkidle", timeout: 120_000 });
    await page.getByRole("heading", { name: heading }).first().waitFor();
    await assertPageClean(page, `Admin page ${path}`);
  }
  await logout(page);

  const mobile = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobilePage = await mobile.newPage();
  await mobilePage.goto(FRONTEND, { waitUntil: "networkidle", timeout: 120_000 });
  await mobilePage.getByRole("button", { name: "Open menu" }).click();
  await mobilePage.getByRole("link", { name: "Assessments", exact: true }).last().waitFor();
  pass("Mobile navigation");
  await mobile.close();
} catch (error) {
  fail("Browser E2E suite", error);
} finally {
  await browser.close();
}

console.log("\nSummary");
for (const check of checks) console.log(`${check.ok ? "✓" : "✗"} ${check.name}${check.error ? `: ${check.error}` : ""}`);
const failed = checks.filter((item) => !item.ok);
if (failed.length) process.exit(1);
console.log(`\nAll ${checks.length} live smoke checks passed.`);
