## 2024-05-24 - [Command Injection and Path Traversal in CLI Component Installation]
**Vulnerability:**
1. The `getInstallCommand` in `cli/src/utils/package-manager.ts` returned a single concatenated string, and `cli/src/commands/add.ts` + `init.ts` passed it to `execa` with `{ shell: true }`. This allowed command injection if a malicious dependency name was retrieved from the registry.
2. In `cli/src/commands/add.ts`, `targetPath` for downloaded component files was created using `path.join(componentsDir, file.name)` without verifying the resulting path. This allowed an arbitrary file write (path traversal) vulnerability if the registry returned a malicious `file.name` like `../../../package.json`.

**Learning:**
The CLI downloads code directly from a remote API. If the registry endpoint is compromised or spoofed, it can send back malicious JSON payloads resulting in remote code execution or file overwrite on the developer's machine due to unsafe `execa` usage and unsafe file paths.

**Prevention:**
Always separate commands and arguments when using `execa` or child processes, never use `shell: true` with untrusted input, and place dependency specs after an option separator. Normalize output paths, verify containment with `path.relative`, and reject existing symlink path segments before saving files from external sources.

## 2024-05-24 - Cross-Site Scripting (XSS) in React via dangerouslySetInnerHTML
**Vulnerability:** Code snippet strings generated dynamically in `ComponentShowcase.tsx` were being directly injected into the DOM using React's `dangerouslySetInnerHTML` without proper sanitization.
**Learning:** Even internal toolings or showcase components that render seemingly safe output from functions like `highlightSyntax` can be vulnerable to XSS if the input data (`dynamicUsageCode`, `codeSnippet`) becomes maliciously manipulated or unsanitized at its source. In Next.js/React environments, using the standard `dompurify` package can lead to Server-Side Rendering (SSR) issues because `window` is not defined.
**Prevention:** Always sanitize any dynamically generated HTML before passing it to `dangerouslySetInnerHTML`. In Next.js workspaces, use `isomorphic-dompurify` (`DOMPurify.sanitize(...)`) to prevent SSR errors while ensuring XSS protection.
