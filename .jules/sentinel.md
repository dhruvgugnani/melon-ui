## 2024-07-15 - [XSS] JSON-LD dangerouslySetInnerHTML Vulnerability
**Vulnerability:** XSS possible via unsanitized JSON.stringify() in dangerouslySetInnerHTML for application/ld+json tags.
**Learning:** Next.js uses dangerouslySetInnerHTML to output JSON-LD, but JSON.stringify() does not escape '<' characters. If user-generated content contains '</script><script>', it can bypass the script tag and execute arbitrary JS.
**Prevention:** Always append .replace(/</g, '\\u003c') to JSON.stringify() outputs in dangerouslySetInnerHTML to safely encode the '<' character as unicode.

## 2024-07-23 - [Command Injection] Shell Command Injection via execa
**Vulnerability:** Command injection risk when using `shell: true` with `execa` alongside dynamically constructed command strings (e.g. from a remote registry fetching dependencies).
**Learning:** Using `shell: true` allows the underlying shell to evaluate special characters and operators (like `;`, `&&`, or `|`) in arguments, leading to arbitrary command execution if an attacker manipulates the registry payload. Passing command strings directly by `split(" ")` does not safely encode shell meta-characters.
**Prevention:** Never use `shell: true` when executing external commands that incorporate external/dynamic inputs. Always pass the base command and arguments as separate items in an array to `execa` (or `spawn`), e.g., `execa('npm', ['install', ...deps])`, which bypasses the shell entirely and passes arguments directly to the executable.
