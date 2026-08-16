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

async function testHyperCoreReactor(page) {
  const reactor = page.getByRole("button", { name: "Hold to ignite reactor" });
  await reactor.waitFor({ state: "visible" });
  await reactor.focus();

  await page.keyboard.down("Enter");
  await page.waitForTimeout(2250);
  await page.keyboard.up("Enter");
  await page.getByRole("heading", { name: "REACTOR ONLINE" }).waitFor({
    state: "visible",
  });

  await page.getByRole("button", { name: "Initiate Shutdown" }).click();
  await reactor.waitFor({ state: "visible" });
  await reactor.focus();
  await page.keyboard.down(" ");
  await page.waitForTimeout(250);
  await page.keyboard.up(" ");
  await page.waitForTimeout(400);
  assert(
    await page.getByText("Hold to Ignite", { exact: true }).isVisible(),
    "Hyper Core Reactor did not cancel a short keyboard charge",
  );
}

async function testAuraMorphTerminal(page) {
  const activate = page.getByRole("button", { name: "Expand Terminal" });
  await activate.waitFor({ state: "visible" });
  await activate.press("Enter");

  const close = page.getByRole("button", { name: "Close Terminal" });
  await close.waitFor({ state: "visible" });
  assert(await close.evaluate((element) => element === document.activeElement),
    "Aura Morph Terminal did not move focus to its close control");
  const finalLine = page.getByText("UPLINK READY.", { exact: true });
  await finalLine.waitFor({ state: "attached" });
  await page.waitForTimeout(2200);
  const finalLineOpacity = Number(await finalLine.locator("..").evaluate(
    (element) => getComputedStyle(element).opacity,
  ));
  assert(finalLineOpacity > 0.9, "Aura Morph Terminal typewriter did not reveal its final line");

  const terminal = close.locator('xpath=ancestor::div[contains(@class, "max-w-2xl")][1]');
  const box = await terminal.boundingBox();
  assert(box, "Aura Morph Terminal has no measurable interaction area");
  await page.mouse.move(box.x + box.width * 0.2, box.y + box.height * 0.2);
  await page.waitForTimeout(350);
  const firstTransform = await terminal.evaluate((element) => getComputedStyle(element).transform);
  await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.8);
  await page.waitForTimeout(350);
  const secondTransform = await terminal.evaluate((element) => getComputedStyle(element).transform);
  assert(firstTransform !== secondTransform,
    "Aura Morph Terminal parallax did not respond to pointer movement");

  await close.click();
  await activate.waitFor({ state: "visible" });
  assert(await activate.evaluate((element) => element === document.activeElement),
    "Aura Morph Terminal did not restore focus after closing");
}

async function testAstralMorphNode(page) {
  await page.setViewportSize({ width: 320, height: 900 });
  const node = page.getByRole("group", { name: "Astral morph node visualization" });
  await node.waitFor({ state: "visible" });
  const compactBox = await node.boundingBox();
  assert(compactBox && compactBox.width <= 320,
    "Astral Morph Node overflowed a 320px viewport");

  await node.focus();
  await page.getByText("SYSTEM_ACTIVE", { exact: true }).waitFor({ state: "visible" });
  const scene = node.locator(":scope > div").filter({ hasText: "SYSTEM_ACTIVE" }).first();
  const box = await node.boundingBox();
  assert(box, "Astral Morph Node has no measurable interaction area");
  await page.mouse.move(box.x + box.width * 0.25, box.y + box.height * 0.25);
  await page.waitForTimeout(350);
  const firstTransform = await scene.evaluate((element) => getComputedStyle(element).transform);
  await page.mouse.move(box.x + box.width * 0.75, box.y + box.height * 0.75);
  await page.waitForTimeout(350);
  const secondTransform = await scene.evaluate((element) => getComputedStyle(element).transform);
  assert(firstTransform !== secondTransform,
    "Astral Morph Node depth did not respond to pointer movement");
  await page.setViewportSize({ width: 1440, height: 1000 });
}

async function testKineticTimeline(page) {
  await page.setViewportSize({ width: 320, height: 900 });
  const timeline = page.getByRole("group", { name: "Kinetic timeline" });
  await timeline.waitFor({ state: "visible" });
  const timelineBox = await timeline.boundingBox();
  const firstCard = page.getByRole("heading", { name: "System Initialization" })
    .locator('xpath=ancestor::div[contains(@class, "rounded-2xl")][1]');
  const cardBox = await firstCard.boundingBox();
  assert(timelineBox && cardBox && cardBox.x + cardBox.width <= 320,
    "Kinetic Timeline card overflowed a 320px viewport");

  const line = timeline.locator(":scope > div").first().locator("svg path").last();
  const initialPath = await line.getAttribute("d");
  await timeline.focus();
  await page.waitForTimeout(350);
  const focusedPath = await line.getAttribute("d");
  assert(initialPath !== focusedPath,
    "Kinetic Timeline line did not respond to keyboard focus");

  assert(timelineBox, "Kinetic Timeline has no measurable interaction area");
  await page.mouse.move(timelineBox.x + 120, timelineBox.y + timelineBox.height * 0.25);
  await page.waitForTimeout(350);
  const firstPointerPath = await line.getAttribute("d");
  await page.mouse.move(timelineBox.x + 70, timelineBox.y + timelineBox.height * 0.75);
  await page.waitForTimeout(350);
  const secondPointerPath = await line.getAttribute("d");
  assert(firstPointerPath !== secondPointerPath,
    "Kinetic Timeline line did not bend toward pointer movement");
  await page.setViewportSize({ width: 1440, height: 1000 });
}

async function testMorphingBentoMatrix(page) {
  await page.setViewportSize({ width: 320, height: 900 });
  const neuralCell = page.getByRole("group", { name: "Neural Link matrix cell" });
  const quantumCell = page.getByRole("group", { name: "Quantum Flux matrix cell" });
  await neuralCell.waitFor({ state: "visible" });
  const matrix = neuralCell.locator('xpath=ancestor::div[contains(@class, "rounded-3xl")][1]');
  const matrixBox = await matrix.boundingBox();
  assert(matrixBox && matrixBox.x + matrixBox.width <= 320,
    "Morphing Bento Matrix overflowed a 320px viewport");

  const initialNeuralBox = await neuralCell.boundingBox();
  const initialQuantumBox = await quantumCell.boundingBox();
  await neuralCell.focus();
  await page.getByText("Establishing high-bandwidth connection", { exact: false })
    .waitFor({ state: "visible" });
  await page.waitForTimeout(450);
  const expandedNeuralBox = await neuralCell.boundingBox();
  const contractedQuantumBox = await quantumCell.boundingBox();
  assert(initialNeuralBox && initialQuantumBox && expandedNeuralBox && contractedQuantumBox &&
    expandedNeuralBox.width > initialNeuralBox.width &&
    contractedQuantumBox.width < initialQuantumBox.width,
  "Morphing Bento Matrix cells did not resize for keyboard focus");

  assert(matrixBox, "Morphing Bento Matrix has no measurable interaction area");
  await page.mouse.move(matrixBox.x + matrixBox.width * 0.2, matrixBox.y + matrixBox.height * 0.2);
  await page.waitForTimeout(350);
  const firstTransform = await matrix.evaluate((element) => getComputedStyle(element).transform);
  await page.mouse.move(matrixBox.x + matrixBox.width * 0.8, matrixBox.y + matrixBox.height * 0.8);
  await page.waitForTimeout(350);
  const secondTransform = await matrix.evaluate((element) => getComputedStyle(element).transform);
  assert(firstTransform !== secondTransform,
    "Morphing Bento Matrix parallax did not respond to pointer movement");
  await page.setViewportSize({ width: 1440, height: 1000 });
}

async function testPrecisionSlider(page) {
  await page.setViewportSize({ width: 320, height: 900 });
  const slider = page.getByRole("slider", { name: "FREQUENCY" });
  await slider.waitFor({ state: "visible" });

  const compactBox = await slider.boundingBox();
  assert(
    compactBox && compactBox.x + compactBox.width <= 320,
    "Precision Slider overflowed a 320px viewport",
  );
  assert(
    (await slider.getAttribute("aria-valuenow")) === "50",
    "Precision Slider did not expose its initial value",
  );

  await slider.focus();
  await slider.press("ArrowRight");
  assert(
    (await slider.getAttribute("aria-valuenow")) === "51",
    "Precision Slider did not respond to ArrowRight",
  );
  await slider.press("Shift+ArrowRight");
  assert(
    (await slider.getAttribute("aria-valuenow")) === "51.1",
    "Precision Slider fine-tune keyboard step did not use one-tenth sensitivity",
  );
  await slider.press("Home");
  assert(
    (await slider.getAttribute("aria-valuenow")) === "0",
    "Precision Slider Home key did not select the minimum",
  );

  const box = await slider.boundingBox();
  assert(box, "Precision Slider has no measurable interaction area");
  await page.mouse.click(box.x + box.width * 0.75, box.y + box.height / 2);
  const pointerValue = Number(await slider.getAttribute("aria-valuenow"));
  assert(
    pointerValue >= 74 && pointerValue <= 76,
    `Precision Slider pointer input selected ${pointerValue} instead of approximately 75`,
  );
  await page.setViewportSize({ width: 1440, height: 1000 });
}

const componentChecks = {
  "astral-morph-node": testAstralMorphNode,
  "aura-morph-terminal": testAuraMorphTerminal,
  "dimensional-data-pad": testDimensionalDataPad,
  "holo-drop-surface": testHoloDropSurface,
  "hyper-core-reactor": testHyperCoreReactor,
  "kinetic-timeline": testKineticTimeline,
  "morphing-bento-matrix": testMorphingBentoMatrix,
  "magnetic-card": testMagneticCard,
  "precision-slider": testPrecisionSlider,
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

  await page.reload({ waitUntil: "networkidle" });
  await page.locator("h1").waitFor({ state: "visible" });

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
