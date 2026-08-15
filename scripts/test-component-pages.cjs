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

async function testHoloDropSurface(page) {
  const title = page.getByText("HOLO LENS", { exact: true });
  await title.waitFor({ state: "visible" });
  const titleColor = await title.evaluate((element) => getComputedStyle(element).color);
  const colorChannels = titleColor.match(/[\d.]+/g)?.slice(0, 3).map(Number) || [];
  const isBright = titleColor.startsWith("oklab(")
    ? colorChannels[0] > 0.75
    : colorChannels.length === 3 &&
      colorChannels.reduce((sum, channel) => sum + channel, 0) > 600;
  assert(
    isBright,
    `Holo Drop Surface title has insufficient contrast: ${titleColor}`,
  );

  const surface = title.locator(
    'xpath=ancestor::div[contains(concat(" ", normalize-space(@class), " "), " group ")][1]',
  );
  const coordinates = surface.getByText(/^X:\d+ Y:\d+$/);
  const box = await surface.boundingBox();
  assert(box, "Holo Drop Surface has no measurable interaction area");

  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.2);
  await page.waitForTimeout(350);
  const firstCoordinates = await coordinates.textContent();

  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.8);
  await page.waitForTimeout(350);
  const secondCoordinates = await coordinates.textContent();

  assert(
    firstCoordinates !== secondCoordinates,
    "Holo Drop Surface coordinates did not respond to pointer movement",
  );
}

async function testTactileZipperCard(page) {
  const title = page.getByText("SECURE", { exact: true });
  await title.waitFor({ state: "visible" });

  const card = title.locator(
    'xpath=ancestor::div[contains(@class, "perspective-")][1]',
  );
  const leftFlap = card.locator('div[class*="border-l"]').first();
  const zipper = card.getByRole("button");
  assert(
    (await zipper.getAttribute("aria-label")) === "Unlock secure payload",
    "Tactile Zipper Card did not expose an accessible unlock control",
  );

  await zipper.focus();
  await zipper.press("Enter");
  assert(
    (await zipper.getAttribute("aria-pressed")) === "true",
    "Tactile Zipper Card keyboard control did not unlock",
  );

  await zipper.press("Enter");
  assert(
    (await zipper.getAttribute("aria-pressed")) === "false",
    "Tactile Zipper Card keyboard control did not relock",
  );

  const initialClipPath = await leftFlap.evaluate(
    (element) => getComputedStyle(element).clipPath,
  );
  const cardBox = await card.boundingBox();
  const zipperBox = await zipper.boundingBox();
  assert(cardBox && zipperBox, "Tactile Zipper Card drag targets are not measurable");

  await page.mouse.move(
    zipperBox.x + zipperBox.width / 2,
    zipperBox.y + zipperBox.height / 2,
  );
  await page.mouse.down();
  await page.mouse.move(
    zipperBox.x + zipperBox.width / 2,
    cardBox.y + cardBox.height - 10,
    { steps: 12 },
  );
  await page.mouse.up();
  await page.waitForTimeout(400);

  const finalClipPath = await leftFlap.evaluate(
    (element) => getComputedStyle(element).clipPath,
  );
  assert(
    initialClipPath !== finalClipPath,
    "Tactile Zipper Card flaps did not respond to dragging",
  );
  assert(
    (await zipper.getAttribute("aria-pressed")) === "true",
    "Tactile Zipper Card did not reach its unlocked state after dragging",
  );
}

async function testDimensionalDataPad(page) {
  const title = page.getByRole("heading", { name: "QUANTUM.CORE", exact: true });
  await title.waitFor({ state: "visible" });

  const surface = title.locator('xpath=ancestor::div[@tabindex="0"][1]');
  const dataPad = surface.locator(":scope > div").filter({ has: title }).first();
  const initialTransform = await dataPad.evaluate(
    (element) => getComputedStyle(element).transform,
  );

  await surface.focus();
  await page.waitForTimeout(450);
  const focusedTransform = await dataPad.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  assert(
    initialTransform !== focusedTransform,
    "Dimensional Data Pad did not expand for keyboard focus",
  );

  const box = await surface.boundingBox();
  assert(box, "Dimensional Data Pad has no measurable interaction area");
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.2);
  await page.waitForTimeout(350);
  const firstPointerTransform = await dataPad.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.8);
  await page.waitForTimeout(350);
  const secondPointerTransform = await dataPad.evaluate(
    (element) => getComputedStyle(element).transform,
  );
  assert(
    firstPointerTransform !== secondPointerTransform,
    "Dimensional Data Pad parallax did not respond to pointer movement",
  );
}

const componentChecks = {
  "dimensional-data-pad": testDimensionalDataPad,
  "holo-drop-surface": testHoloDropSurface,
  "magnetic-card": testMagneticCard,
  "tactile-zipper-card": testTactileZipperCard,
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
  const themeToggle = page.getByLabel("Toggle Local Preview Theme");
  await themeToggle.click();
  assert(
    (await previewPanel.getAttribute("class"))?.includes("light"),
    `${slug}: preview theme toggle did not update the panel`,
  );
  await themeToggle.click();
  assert(
    !(await previewPanel.getAttribute("class"))?.includes("light"),
    `${slug}: preview theme toggle did not restore dark mode`,
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
