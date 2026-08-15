const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { chromium } = require("playwright");

const slugs = process.argv.slice(2);
const baseUrl = process.env.COMPONENT_TEST_BASE_URL || "http://127.0.0.1:3000";
const artifactDirectory = path.join(os.tmpdir(), "melonui-component-tests");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function testMagneticCard(page) {
  const title = page.getByText("HYPER", { exact: true });
  await title.waitFor({ state: "visible" });

  const card = title.locator(
    'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " group ")][1]',
  );
  const tiltingSurface = card.locator(":scope > div").first();
  const box = await card.boundingBox();
  assert(box, "Magnetic Card has no measurable interaction area");

  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.2);
  await page.waitForTimeout(350);
  const firstTransform = await tiltingSurface.evaluate(
    (element) => getComputedStyle(element).transform,
  );

  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.8);
  await page.waitForTimeout(350);
  const secondTransform = await tiltingSurface.evaluate(
    (element) => getComputedStyle(element).transform,
  );

  assert(
    firstTransform !== secondTransform,
    "Magnetic Card tilt did not respond to pointer movement",
  );
}

const componentChecks = {
  "magnetic-card": testMagneticCard,
};

async function testComponent(page, slug) {
  const consoleErrors = [];
  const pageErrors = [];
  const onConsole = (message) => {
    if (message.type() === "error") {
      consoleErrors.push(message.text());
    }
  };
  const onPageError = (error) => pageErrors.push(error.message);

  page.on("console", onConsole);
  page.on("pageerror", onPageError);

  const response = await page.goto(`${baseUrl}/components/${slug}`, {
    waitUntil: "networkidle",
  });
  assert(response && response.ok(), `${slug}: page returned ${response?.status()}`);

  await page.locator("h1").waitFor({ state: "visible" });
  await page.getByRole("tab", { name: "Installation & AI" }).click();
  await page
    .getByText(`npx @melonui-dev/cli add ${slug}`, { exact: false })
    .first()
    .waitFor({ state: "visible" });

  await page.getByRole("tab", { name: "Preview", exact: true }).click();
  const previewPanel = page.getByRole("tabpanel").first();
  await previewPanel.waitFor({ state: "visible" });
  await page.getByLabel("Toggle Local Preview Theme").click();
  assert(
    (await previewPanel.getAttribute("class"))?.includes("light"),
    `${slug}: preview theme toggle did not update the panel`,
  );

  if (componentChecks[slug]) {
    await componentChecks[slug](page);
  }

  await page.screenshot({
    path: path.join(artifactDirectory, `${slug}.png`),
    fullPage: true,
  });

  page.off("console", onConsole);
  page.off("pageerror", onPageError);

  assert(pageErrors.length === 0, `${slug}: page errors: ${pageErrors.join(" | ")}`);
  assert(
    consoleErrors.length === 0,
    `${slug}: console errors: ${consoleErrors.join(" | ")}`,
  );

  console.log(`[component] ${slug}: route, toolbar, interaction, and console checks passed`);
}

async function main() {
  if (slugs.length === 0) {
    throw new Error("Pass at least one component slug to test");
  }

  fs.mkdirSync(artifactDirectory, { recursive: true });
  const browser = await chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    for (const slug of slugs) {
      await testComponent(page, slug);
    }
  } finally {
    await browser.close();
  }

  console.log(`[component] screenshots: ${artifactDirectory}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
