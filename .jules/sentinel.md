## 2024-07-15 - [XSS] JSON-LD dangerouslySetInnerHTML Vulnerability
**Vulnerability:** XSS possible via unsanitized JSON.stringify() in dangerouslySetInnerHTML for application/ld+json tags.
**Learning:** Next.js uses dangerouslySetInnerHTML to output JSON-LD, but JSON.stringify() does not escape '<' characters. If user-generated content contains '</script><script>', it can bypass the script tag and execute arbitrary JS.
**Prevention:** Always append .replace(/</g, '\\u003c') to JSON.stringify() outputs in dangerouslySetInnerHTML to safely encode the '<' character as unicode.

## 2024-07-23 - [Command Injection] Unsafe execa shell usage in CLI
**Vulnerability:** Command injection was possible in `cli/src/commands/add.ts` and `cli/src/commands/init.ts` via unsanitized component dependency data when using `execa` with `shell: true`.
**Learning:** Returning a pre-formatted command string and splitting it for `execa` while using `shell: true` allows maliciously crafted component dependencies from the remote registry to execute arbitrary code on the user's machine.
**Prevention:** Never use `shell: true` with `execa` when incorporating remote or unvalidated data. Pass the command and its arguments as an explicit array (e.g., `await execa('npm', ['install', ...deps])`) to prevent shell evaluation.
