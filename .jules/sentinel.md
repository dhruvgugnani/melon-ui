## 2024-07-15 - [XSS] JSON-LD dangerouslySetInnerHTML Vulnerability
**Vulnerability:** XSS possible via unsanitized JSON.stringify() in dangerouslySetInnerHTML for application/ld+json tags.
**Learning:** Next.js uses dangerouslySetInnerHTML to output JSON-LD, but JSON.stringify() does not escape '<' characters. If user-generated content contains '</script><script>', it can bypass the script tag and execute arbitrary JS.
**Prevention:** Always append .replace(/</g, '\\u003c') to JSON.stringify() outputs in dangerouslySetInnerHTML to safely encode the '<' character as unicode.

## 2026-07-28 - [Command Injection] execa shell: true Vulnerability
**Vulnerability:** Command injection possible via manipulated metadata during CLI dependency installation.
**Learning:** Using `shell: true` with `execa` while passing an unsanitized concatenated string (e.g., from a remote registry's dependency list) allows an attacker to inject arbitrary shell commands.
**Prevention:** Never use `shell: true` when executing commands with external inputs. Always pass commands and arguments as an explicit array to `execa`.
