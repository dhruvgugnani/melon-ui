## 2024-07-15 - [XSS] JSON-LD dangerouslySetInnerHTML Vulnerability
**Vulnerability:** XSS possible via unsanitized JSON.stringify() in dangerouslySetInnerHTML for application/ld+json tags.
**Learning:** Next.js uses dangerouslySetInnerHTML to output JSON-LD, but JSON.stringify() does not escape '<' characters. If user-generated content contains '</script><script>', it can bypass the script tag and execute arbitrary JS.
**Prevention:** Always append .replace(/</g, '\\u003c') to JSON.stringify() outputs in dangerouslySetInnerHTML to safely encode the '<' character as unicode.

## 2024-07-25 - [Command Injection] CLI execa Dependency Installation Risk
**Vulnerability:** Command injection possible via unsanitized dependencies passed to `execa` with `shell: true` during component installation.
**Learning:** `execa` was being called with `shell: true` and a command string built by joining dependency strings fetched from the remote registry. If a compromised or manipulated registry returned malicious strings in the `dependencies` array (e.g., `["clsx;", "rm", "-rf", "/"]`), `execa` would execute them as shell commands.
**Prevention:** Never use `shell: true` when executing commands with external inputs via `execa`. Always pass the base command and arguments as a strictly separated array (e.g., `execa('npm', ['install', ...deps])`) to prevent the shell from parsing malicious metacharacters.
