## 2024-07-15 - [XSS] JSON-LD dangerouslySetInnerHTML Vulnerability
**Vulnerability:** XSS possible via unsanitized JSON.stringify() in dangerouslySetInnerHTML for application/ld+json tags.
**Learning:** Next.js uses dangerouslySetInnerHTML to output JSON-LD, but JSON.stringify() does not escape '<' characters. If user-generated content contains '</script><script>', it can bypass the script tag and execute arbitrary JS.
**Prevention:** Always append .replace(/</g, '\\u003c') to JSON.stringify() outputs in dangerouslySetInnerHTML to safely encode the '<' character as unicode.

## 2024-08-20 - [CRITICAL] Command Injection via `execa` with `shell: true`
**Vulnerability:** Command injection possible when executing dynamic installation commands (like dependency arrays from a remote registry API) via `execa` with `shell: true`.
**Learning:** `execa` with `shell: true` passes the command directly to the system shell (e.g. `sh -c`), making it vulnerable to standard shell metacharacter injection (like `;`, `|`, `&&`) if the arguments aren't strictly sanitized. Even if the array is split correctly, `shell: true` negates the safety of the explicit arguments array pattern.
**Prevention:** Never use `shell: true` with `execa` or similar subprocess execution commands when dealing with external or remote inputs. Always pass commands and arguments explicitly as an array.
