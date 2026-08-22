## 2024-05-24 - [DOMPurify for SSR XSS Prevention]
**Vulnerability:** Found `dangerouslySetInnerHTML` rendering unsanitized syntax-highlighted code in `ComponentShowcase.tsx`.
**Learning:** In Next.js SSR environments, standard DOMPurify fails because the `window` object is not available. This codebase uses a custom syntax highlighter whose output was previously trusted but still presented an XSS risk if user input (e.g. dynamic usages) could be passed to it.
**Prevention:** Use `isomorphic-dompurify` in the Next.js `apps/web` workspace when sanitizing content for `dangerouslySetInnerHTML` to prevent SSR errors and ensure robust XSS protection.
