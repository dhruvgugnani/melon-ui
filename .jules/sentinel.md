## 2024-07-15 - [XSS] JSON-LD dangerouslySetInnerHTML Vulnerability
**Vulnerability:** XSS possible via unsanitized JSON.stringify() in dangerouslySetInnerHTML for application/ld+json tags.
**Learning:** Next.js uses dangerouslySetInnerHTML to output JSON-LD, but JSON.stringify() does not escape '<' characters. If user-generated content contains '</script><script>', it can bypass the script tag and execute arbitrary JS.
**Prevention:** Always append .replace(/</g, '\\u003c') to JSON.stringify() outputs in dangerouslySetInnerHTML to safely encode the '<' character as unicode.

## 2024-07-31 - [Command Injection] Unsafe execa usage in CLI
**Vulnerability:** Command injection possible via unsanitized dependencies passed to execa with shell: true.
**Learning:** When using execa to run commands (e.g. installing dependencies), if shell: true is enabled and arguments are concatenated into a string, any malicious payload in the dependencies from the registry could execute arbitrary shell commands.
**Prevention:** Never use shell: true when executing commands with external data. Pass the command and arguments as a separate array to execa so arguments are properly escaped by the OS.
