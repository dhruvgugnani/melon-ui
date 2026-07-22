## 2024-07-15 - [XSS] JSON-LD dangerouslySetInnerHTML Vulnerability
**Vulnerability:** XSS possible via unsanitized JSON.stringify() in dangerouslySetInnerHTML for application/ld+json tags.
**Learning:** Next.js uses dangerouslySetInnerHTML to output JSON-LD, but JSON.stringify() does not escape '<' characters. If user-generated content contains '</script><script>', it can bypass the script tag and execute arbitrary JS.
**Prevention:** Always append .replace(/</g, '\\u003c') to JSON.stringify() outputs in dangerouslySetInnerHTML to safely encode the '<' character as unicode.

## 2024-05-24 - [CRITICAL] Command Injection via `execa` with `shell: true`
**Vulnerability:** The CLI tool was executing installation commands (e.g., `npm install <dependencies>`) using `execa` with the `shell: true` option. The dependencies list was fetched dynamically from a remote registry (`https://melonui.dev/api/registry`). By using `shell: true` and concatenating strings, an attacker controlling the registry response could inject arbitrary shell commands via the `dependencies` array.
**Learning:** Using `shell: true` when running shell commands is extremely dangerous, especially if any part of the command string includes external or dynamic data (even if it's from an ostensibly "trusted" registry, as registries can be compromised).
**Prevention:** Never use `shell: true` unless absolutely necessary (which is very rare). Instead, pass the executable and an array of arguments explicitly to tools like `execa` or `spawn`, which properly escapes arguments and prevents shell metacharacters from being interpreted as command separators.
