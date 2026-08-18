## 2024-05-24 - [Command Injection and Path Traversal in CLI Component Installation]
**Vulnerability:**
1. The `getInstallCommand` in `cli/src/utils/package-manager.ts` returned a single concatenated string, and `cli/src/commands/add.ts` + `init.ts` passed it to `execa` with `{ shell: true }`. This allowed command injection if a malicious dependency name was retrieved from the registry.
2. In `cli/src/commands/add.ts`, `targetPath` for downloaded component files was created using `path.join(componentsDir, file.name)` without verifying the resulting path. This allowed an arbitrary file write (path traversal) vulnerability if the registry returned a malicious `file.name` like `../../../package.json`.

**Learning:**
The CLI downloads code directly from a remote API. If the registry endpoint is compromised or spoofed, it can send back malicious JSON payloads resulting in remote code execution or file overwrite on the developer's machine due to unsafe `execa` usage and unsafe file paths.

**Prevention:**
Always separate commands and arguments when using `execa` or child processes, never use `shell: true` with untrusted input, and place dependency specs after an option separator. Normalize output paths, verify containment with `path.relative`, and reject existing symlink path segments before saving files from external sources.

## 2024-06-05 - [XSS Vulnerability in Component Showcase]
**Vulnerability:** The `ComponentShowcase` rendered unescaped `codeSnippet` and `dynamicUsageCode` content via `dangerouslySetInnerHTML`, opening up potential Cross-Site Scripting (XSS) attacks.
**Learning:** Bypassing standard React escaping with `dangerouslySetInnerHTML` poses a high risk if the data comes from unsanitized props.
**Prevention:** Always sanitize dynamically highlighted or generated HTML using `isomorphic-dompurify` in Next.js/SSR environments before injecting it into the DOM.
