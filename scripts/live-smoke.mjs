import { chromium } from "playwright";

const FRONTEND = process.env.FRONTEND_URL || "https://developer-assessment-platform-front.vercel.app";
const BACKEND = process.env.BACKEND_URL || "https://developer-assessment-platform.onrender.com";

const checks = [];
const fail = (name, error) => {
  checks.push({ name, ok: false, error: error instanceof Error ? error.message : String(error) });
  console.error(`FAIL: ${name}: ${checks.at(-1).error}`);
};
const pass = (name) => {
  checks.push({ name, ok: true });
  console.log(`PASS: ${name}`);
};

async function apiCheck(name, url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
    pass(name);
  } catch (error) {
    fail(name, error);
  }
}

async function assertPageClean(page, name) {
  const body = await page.locator("body").innerText();
  const bad = ["Failed to fetch", "Request failed with status", "Application error", "Internal Server Error"];
  const hit = bad.find((text) => body.includes(text));
  if (hit) throw new Error(`Page shows error text: ${hit}`);
  pass(name);
}

async function loginWithDemoButton(page, role, expectedPath) {
  await page.goto(`${FRONTEND}/login`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.getByRole("button", { name: role, exact: true }).click();
  await Promise.all([
    page.waitForURL((url) => url.pathname.startsWith(expectedPath), { timeout: 120_000 }),
    page.getByRole("button", { name: "Sign in", exact: true }).click(),
  ]);
  await assertPageClean(page, `${role} login and redirect`);
}

async function logout(page) {
  const desktopLogout = page.getByRole("button", { name: /Logout/i });
  if (await desktopLogout.count()) {
    await desktopLogout.first().click();
    await page.waitForURL((url) => url.pathname === "/", { timeout: 30_000 });
  } else {
    await page.goto(FRONTEND, { waitUntil: "networkidle" });
    await page.evaluate(() => localStorage.clear());
  }
}

console.log(`Live smoke test\nFrontend: ${FRONTEND}\nBackend: ${BACKEND}\n`);

await apiCheck("Backend health endpoint", `${BACKEND}/health`);

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
const page = await context.newPage();
page.setDefaultTimeout(45_000);

try {
  await page.goto(FRONTEND, { waitUntil: "networkidle", timeout: 120_000 });
  await page.getByRole("heading", { name: /Assess developer skills/i }).waitFor();
  await assertPageClean(page, "Landing page");

  const beforeDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  await page.getByRole("button", { name: "Toggle theme" }).click();
  const afterDark = await page.evaluate(() => document.documentElement.classList.contains("dark"));
  if (beforeDark === afterDark) throw new Error("Theme class did not change");
  pass("Theme toggle");

  await page.goto(`${FRONTEND}/register`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.getByRole("heading", { name: /Create candidate account/i }).waitFor();
  await assertPageClean(page, "Registration page");

  await page.goto(`${FRONTEND}/assessments`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.getByRole("heading", { name: "Assessments", exact: true }).waitFor();
  await assertPageClean(page, "Assessment catalog");

  const detailLinks = page.getByRole("link", { name: "View assessment" });
  if (await detailLinks.count()) {
    await detailLinks.first().click();
    await page.waitForURL(/\/assessments\//, { timeout: 30_000 });
    await assertPageClean(page, "Assessment detail");
  } else {
    pass("Assessment detail skipped because catalog is empty");
  }

  await loginWithDemoButton(page, "Candidate", "/dashboard");
  await page.goto(`${FRONTEND}/attempts`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.getByRole("heading", { name: "My attempts", exact: true }).waitFor();
  await assertPageClean(page, "Candidate attempts page");
  await page.goto(`${FRONTEND}/profile`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.getByRole("heading", { name: "Profile", exact: true }).waitFor();
  await assertPageClean(page, "Candidate profile page");
  await logout(page);

  await loginWithDemoButton(page, "Reviewer", "/reviewer");
  await page.getByRole("heading", { name: /Assessments & reviews/i }).waitFor();
  await assertPageClean(page, "Reviewer workspace");
  await page.goto(`${FRONTEND}/reviewer/assessments/new`, { waitUntil: "networkidle", timeout: 120_000 });
  await page.getByRole("heading", { name: "Create assessment", exact: true }).waitFor();
  await assertPageClean(page, "Reviewer create assessment page");
  await logout(page);

  await loginWithDemoButton(page, "Admin", "/admin");
  await page.getByRole("heading", { name: /Platform overview/i }).waitFor();
  await assertPageClean(page, "Admin console");
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
for (const check of checks) {
  console.log(`${check.ok ? "✓" : "✗"} ${check.name}${check.error ? `: ${check.error}` : ""}`);
}
const failed = checks.filter((item) => !item.ok);
if (failed.length) process.exit(1);
console.log(`\nAll ${checks.length} live smoke checks passed.`);
