 # Upgrade to the Latest Next.js

You are an autonomous coding agent. Your task is to upgrade this project to the **latest stable Next.js release** (currently the 16.x line) with the smallest safe set of changes, leaving the project building, type-checking, linting, and passing tests.

Follow the phases in order. Do not skip verification gates. Never batch unrelated refactors into the upgrade.

---

## 0. Ground Rules

1. **Verify, don't trust this file.** Next.js moves fast. Before changing anything, fetch the current official docs and treat them as the source of truth over anything written here:
   - Upgrade index: https://nextjs.org/docs/app/guides/upgrading
   - Codemods: https://nextjs.org/docs/app/guides/upgrading/codemods
   - Version guides: `.../upgrading/version-14`, `version-15`, `version-16` (and any newer one that exists)
   - Release notes: https://github.com/vercel/next.js/releases
2. **Upgrade incrementally across major versions.** If the project is on 12 or 13, go 13 → 14 → 15 → 16, building and testing at each hop. Do not jump straight from 13 to 16.
3. **Prefer official codemods** over hand edits for anything a codemod covers.
4. **Don't change behavior** beyond what the upgrade requires. Don't rewrite pages-router code to app-router unless explicitly asked (see Phase 9).
5. **Stop and ask** if a change requires a product decision (e.g. caching strategy, removing a feature, swapping a library).

---

## 1. Discovery (read-only)

Collect and record the following in a scratch note (`UPGRADE_NOTES.md`, deleted at the end):

- [ ] Package manager and lockfile (`npm`, `pnpm`, `yarn`, `bun`)
- [ ] Current versions: `next`, `react`, `react-dom`, `typescript`, `@types/react`, `@types/react-dom`, `eslint`, `eslint-config-next`
- [ ] Node version in use (`node -v`, `.nvmrc`, `.node-version`, `engines`, CI config, Dockerfile, hosting settings)
- [ ] Router in use: `pages/`, `app/`, or both; `src/` directory or not
- [ ] Config file: `next.config.js` / `.mjs` / `.ts`
- [ ] Middleware: `middleware.ts|js` present?
- [ ] Custom webpack config, Babel config (`.babelrc`, `babel.config.js`), custom server (`server.js`)
- [ ] Use of: `next/image`, `next/legacy/image`, `next/font`, `next/script`, `next/link`, `next/head`, AMP, `getInitialProps`, `serverRuntimeConfig` / `publicRuntimeConfig`
- [ ] Use of caching APIs: `fetch` cache options, `unstable_cache`, `revalidateTag`, `revalidatePath`, `export const dynamic|revalidate|fetchCache|runtime`
- [ ] Third-party libs with Next/React peer deps (auth, CMS, UI kits, i18n, analytics, CSS-in-JS)
- [ ] Scripts available: `build`, `dev`, `lint`, `test`, `typecheck`, e2e
- [ ] Deployment target (Vercel, Docker/self-hosted, static export, other)

### Baseline gate
Before any change, run and record results:

```bash
<pm> install
<pm> run lint        # if present
<pm> run typecheck   # or: npx tsc --noEmit
<pm> run test        # if present
<pm> run build
```

If the baseline is already failing, **report it and do not "fix" unrelated failures** unless needed. Note which failures pre-exist so you can distinguish them later.

---

## 2. Environment Prerequisites

Next.js 16 requires (confirm in the current docs):

- **Node.js 20.9+** (Node 18 is no longer supported)
- **TypeScript 5.1+** (if using TypeScript)
- **React 19.2** (bundled via the App Router canary channel; install `react@latest react-dom@latest`)
- Modern browser targets (Chrome/Edge/Firefox 111+, Safari 16.4+)

Actions:
- [ ] Bump Node in `.nvmrc`, `.node-version`, `package.json#engines`, CI workflows, Dockerfile base image, and hosting config
- [ ] Bump `typescript`, `@types/react`, `@types/react-dom`

---

## 3. Run the Official Upgrade Codemod

From a clean git state:

```bash
npx @next/codemod@canary upgrade latest
```

This updates `next`, `react`, `react-dom` and applies relevant codemods interactively. If it fails or you prefer manual control:

```bash
<pm> add next@latest react@latest react-dom@latest
<pm> add -D @types/react@latest @types/react-dom@latest eslint-config-next@latest
```

Then run individual codemods as needed (see the codemod docs for the current list):

```bash
npx @next/codemod@latest next-async-request-api .     # async params/searchParams/cookies/headers
npx @next/codemod@latest middleware-to-proxy .        # middleware.ts -> proxy.ts
npx @next/codemod@latest remove-unstable-prefix .     # unstable_cacheLife / unstable_cacheTag -> stable
npx @next/codemod@latest remove-experimental-ppr .    # experimental PPR flag removal
npx @next/codemod@latest app-dir-runtime-config-experimental-edge .
npx @next/codemod@latest new-link .                   # drop legacy <a> children in <Link>
npx @next/codemod@latest next-image-to-legacy-image . # only if you must stay on legacy image
```

**Review every diff the codemods produce.** Codemods are heuristic; they leave `/* @next-codemod-error */` comments where they cannot safely transform code. Resolve each one by hand and remove the comment.

Commit: `chore: run next codemods`.

---

## 4. Known Breaking Changes Checklist

Work through each item. Skip any that don't apply, but explicitly confirm that it doesn't apply by searching the codebase.

### 4.1 Async Request APIs (fully enforced in 16)
Synchronous access is no longer allowed for:
- `cookies()`, `headers()`, `draftMode()` from `next/headers`
- `params` and `searchParams` in `page`, `layout`, `route`, `default`, `opengraph-image`, `twitter-image`, `icon`, `apple-icon`, and `generateMetadata`
- `params` in `generateImageMetadata` and `generateSitemaps`

```tsx
// Before
export default function Page({ params, searchParams }) {
  const { slug } = params
}

// After
export default async function Page({ params, searchParams }: {
  params: Promise<{ slug: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  const { slug } = await params
  const sp = await searchParams
}
```

In client components, unwrap with `React.use(params)`. Optionally run `npx next typegen` and use the generated `PageProps<'/route'>`, `LayoutProps<'/route'>`, and `RouteContext<'/route'>` helpers.

### 4.2 `middleware` renamed to `proxy`
- [ ] Rename `middleware.ts` → `proxy.ts` and the exported function `middleware` → `proxy`
- [ ] `proxy` runs on the **Node.js runtime**; the `edge` runtime is not supported there. If you truly need edge, keep `middleware.ts` (deprecated) and note it
- [ ] Rename related config flags (e.g. `skipMiddlewareUrlNormalize` → `skipProxyUrlNormalize`)
- [ ] Keep `config.matcher` as is

### 4.3 Turbopack is the default bundler
- `next dev` and `next build` use Turbopack by default.
- [ ] If the project has a **custom `webpack` config** in `next.config.*`, the build will fail by default. Choose one:
  - Migrate to Turbopack equivalents (`turbopack.rules`, `turbopack.resolveAlias`, etc.), **preferred** use this option
  - Temporarily opt out with `next dev --webpack` / `next build --webpack` and note it as follow-up debt
- [ ] Move `experimental.turbopack` → top-level `turbopack` in config
- [ ] Sass imports with `~` prefix (webpack-style) are not supported: remove the `~`
- [ ] Turbopack filesystem caching is optional: `experimental.turbopackFileSystemCacheForDev` (consider enabling for large repos)
- [ ] `next dev` now writes to `.next/dev`; update `.gitignore`/tooling if it references `.next` internals

### 4.4 Babel
- If a `.babelrc` / `babel.config.js` exists, Turbopack will use Babel for those files automatically (slower). Prefer removing it and relying on SWC.
- For React Compiler: `reactCompiler: true` is now a stable top-level option (requires `babel-plugin-react-compiler` installed). Only enable if the project wants it. It's not required for the upgrade.

### 4.5 Linting
- [ ] `next lint` is **removed**. `next build` no longer runs lint.
- [ ] Update scripts to call ESLint (or Biome) directly: `"lint": "eslint ."`
- [ ] Migrate to ESLint flat config (`eslint.config.mjs`) using `eslint-config-next` (current version exports flat config)
- [ ] Remove `eslint` key from `next.config.*` (no longer supported)
- [ ] Optional: `npx @next/codemod@canary next-lint-to-eslint-cli .`

### 4.6 Removed or changed config
- [ ] `serverRuntimeConfig` / `publicRuntimeConfig` removed → use environment variables (`process.env`, `NEXT_PUBLIC_*`)
- [ ] `experimental.dynamicIO` → `cacheComponents` (top-level)
- [ ] `experimental.ppr` and `experimental_ppr` route option removed → use `cacheComponents` + `"use cache"`
- [ ] `devIndicators`: `appIsrStatus`, `buildActivity`, `buildActivityPosition` removed
- [ ] AMP support removed (`amp` config, `useAmp`, `export const config = { amp }`)
- [ ] `unstable_rootParams` and other `unstable_*` APIs: check for stable replacements
- [ ] `next/legacy/image` and `images.domains` are deprecated → use `next/image` and `images.remotePatterns`

### 4.7 `next/image` changes
- [ ] `images.minimumCacheTTL` default is now 4 hours (14400s)
- [ ] `images.imageSizes` default drops `16`
- [ ] `images.qualities` default is `[75]`; any other `quality` prop value must be listed explicitly
- [ ] Local `src` with query strings requires `images.localPatterns`
- [ ] `images.dangerouslyAllowLocalIP` is `false` by default (needed for private-network image hosts)
- [ ] `images.maximumRedirects` default is 3

### 4.8 Caching APIs
- [ ] `revalidateTag(tag)` now requires a second `cacheLife` profile argument for stale-while-revalidate behavior (e.g. `revalidateTag('posts', 'max')`). The single-argument form is deprecated
- [ ] For read-your-writes in Server Actions use the new `updateTag(tag)`; use `refresh()` to refresh uncached data
- [ ] `unstable_cacheLife` / `unstable_cacheTag` → `cacheLife` / `cacheTag` (stable)
- [ ] Review use of `fetch` caching and route segment config (`dynamic`, `revalidate`, `fetchCache`). If `cacheComponents` is enabled these are replaced by `"use cache"`. **Do not enable `cacheComponents` as part of the upgrade unless requested.**

### 4.9 Routing
- [ ] **Parallel routes**: every `@slot` now requires an explicit `default.js` (return `null` or call `notFound()`)
- [ ] Layout deduplication and incremental prefetching are automatic; no code change expected, but test navigation
- [ ] `next/link` no longer needs `<a>` children (older projects)
- [ ] `scroll-behavior: smooth` is no longer overridden on navigation; add `data-scroll-behavior="smooth"` to `<html>` if you rely on it

### 4.10 Other
- [ ] `runtime = 'edge'` in route segments: still supported but check per-route; `proxy` is Node-only
- [ ] `next/font`: no breaking changes expected; remove any legacy `@next/font` package
- [ ] `images`, `next-sitemap`, `next-auth`, `next-intl`, `@next/mdx`, analytics libs: upgrade to versions that declare support for the new Next/React versions
- [ ] React 19 changes: `ref` is a regular prop for function components (`forwardRef` optional), `useFormState` → `useActionState`, `ReactDOM.render` / `hydrate` removed, string refs and legacy context gone, `propTypes` ignored

Commit after each logical group: `chore: async request APIs`, `chore: rename middleware to proxy`, etc.

---

## 5. Dependencies

- [ ] Run `<pm> outdated` and list packages with Next/React peer-dependency conflicts
- [ ] Upgrade only what is required for compatibility. Pin versions you change
- [ ] Resolve peer-dependency warnings; use `overrides` / `resolutions` **only as a last resort** and document why
- [ ] Remove packages made obsolete (e.g. `@next/font`, `@types/node` mismatches with the Node version, `next-transpile-modules` → `transpilePackages`)
- [ ] Regenerate the lockfile cleanly (delete `node_modules` + lockfile only if installs are inconsistent)

---

## 6. Configuration Cleanup

- [ ] Convert `next.config.js` to `next.config.ts` if desired (supported). Optional, so don't force it
- [ ] Remove options that are now defaults or deprecated (check build warnings)
- [ ] Ensure `tsconfig.json` was auto-updated by Next (it may adjust `jsx` to `react-jsx` and add `.next/dev/types/**/*.ts` to `include`)
- [ ] Confirm `next-env.d.ts` is regenerated and committed per project convention

---

## 7. Verification Gates

Run all of these. Fix failures that the upgrade caused; report the rest.

```bash
<pm> install
<pm> run lint
<pm> run typecheck        # or: npx tsc --noEmit
<pm> run test
<pm> run build
<pm> run start            # smoke test the production build
```

Then verify at runtime (use the dev server and, if available, e2e tests or Playwright):

- [ ] Home page and one page per route type (static, dynamic `[param]`, catch-all, route handler)
- [ ] Authentication flow (login/logout, protected routes, proxy/middleware redirects)
- [ ] Forms and Server Actions
- [ ] Images (local and remote), fonts, and metadata/OG images
- [ ] API routes / route handlers, including `cookies()`/`headers()` usage
- [ ] Client-side navigation, prefetching, scroll behavior, back/forward
- [ ] i18n / rewrites / redirects / headers from `next.config.*`
- [ ] Console: no hydration errors, no deprecation warnings you introduced

Compare the build output (route table, bundle sizes) against the baseline; flag large regressions.

---

## 8. Common Failure Modes and Fixes

| Symptom | Likely cause | Fix |
|---|---|---|
| `Route used params.x. params should be awaited` | Sync params/searchParams access | Make function `async`, `await params`; or `use(params)` in client components |
| `cookies()`/`headers()` return a Promise errors | Sync usage | `await cookies()` / `await headers()` |
| Build fails: "webpack config found with Turbopack" | Custom `webpack` in config | Migrate to `turbopack` config or build with `--webpack` temporarily |
| `next lint` not found | Command removed | Use `eslint .` directly |
| Missing `default.js` for parallel route slot | New requirement | Add `default.tsx` returning `null` |
| Image 400 on a `quality` value | `images.qualities` restriction | Add the value to `images.qualities` |
| Image 400 on a local path with `?query` | `localPatterns` needed | Configure `images.localPatterns` |
| Image blocked for private IP host | `dangerouslyAllowLocalIP` off | Enable only for trusted internal setups |
| Peer dep conflicts with React 19 | Library not yet compatible | Upgrade the library; if none, pin and track as debt |
| `middleware` deprecation warning | Rename not applied | Rename file and export to `proxy` |
| Type errors on `PageProps` | Types now async/generated | Run `npx next typegen`, use the generated helpers |
| Hydration mismatch after upgrade | React 19 stricter checks or extension noise | Fix real mismatches; ignore browser-extension artifacts |

---

## 9. Out of Scope (do NOT do unless explicitly asked)

- Migrating `pages/` → `app/` (the pages router is still supported; migrate incrementally in a separate effort)
- Enabling `cacheComponents` / Partial Prerendering
- Enabling React Compiler
- Large refactors, renaming files unrelated to the upgrade, formatting-only changes
- Changing hosting/deployment platforms

If the user wants these, treat each as its own task after the upgrade is merged.

---

## 10. Final Deliverables

1. All verification gates passing, or a clear list of pre-existing failures.
2. A short **upgrade report** (in the PR description) containing:
   - Versions: before → after (`next`, `react`, `react-dom`, `typescript`, Node)
   - Codemods run and notable manual fixes
   - Breaking-change items that applied vs. did not apply
   - Deprecated-but-still-working items left behind (e.g. `--webpack`, legacy `middleware`, `next/legacy/image`) with follow-up recommendations
   - Any behavior changes the team should manually QA
3. Delete scratch files (`UPGRADE_NOTES.md`).

---

## Quick Command Reference

```bash
# One-shot official upgrade
npx @next/codemod@canary upgrade latest

# Manual dependency bump
npm i next@latest react@latest react-dom@latest
npm i -D @types/react@latest @types/react-dom@latest eslint-config-next@latest typescript@latest

# Common codemods
npx @next/codemod@latest next-async-request-api .
npx @next/codemod@latest middleware-to-proxy .
npx @next/codemod@latest remove-unstable-prefix .

# Generate route-aware types
npx next typegen

# Fallbacks
next dev --webpack
next build --webpack
```
