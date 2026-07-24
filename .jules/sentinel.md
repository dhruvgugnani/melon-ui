## 2024-07-15 - [XSS] JSON-LD dangerouslySetInnerHTML Vulnerability
**Vulnerability:** XSS possible via unsanitized JSON.stringify() in dangerouslySetInnerHTML for application/ld+json tags.
**Learning:** Next.js uses dangerouslySetInnerHTML to output JSON-LD, but JSON.stringify() does not escape '<' characters. If user-generated content contains '</script><script>', it can bypass the script tag and execute arbitrary JS.
**Prevention:** Always append .replace(/</g, '\\u003c') to JSON.stringify() outputs in dangerouslySetInnerHTML to safely encode the '<' character as unicode.

## 2024-07-21 - [Command Injection] Unsafe execa shell execution from remote registry
**Vulnerability:** Command injection was possible because `execa` was being called with `{ shell: true }` when installing component dependencies returned from an untrusted remote registry API (`registry.json`). Malicious or manipulated metadata containing shell metacharacters (e.g. `; rm -rf /`) in dependencies arrays would be executed.
**Learning:** Even if the input originates from a first-party API, any remotely-fetched data used as CLI arguments must be treated as untrusted to prevent injection in compromised environments or MITM attacks.
**Prevention:** Never use `shell: true` with `execa` for dynamically fetched CLI arguments. Instead, parse commands into explicit arrays (`{ cmd: "npm", args: ["install", "package"] }`) and pass them without shell evaluation.
