## 1. Root-base configuration update

- [x] 1.1 Update `docs/.vitepress/config.ts` base from `/ohmyopenAI-tutorial-hub/` to `/`
- [x] 1.2 Update config asset paths to root-based paths (`/favicon.svg`, `/custom.css`, `/logo.svg`)
- [x] 1.3 Update homepage hero image paths in `docs/index.md` and `docs/en/index.md` to `/logo.svg`

## 2. Repository/link alignment

- [x] 2.1 Update GitHub social link target to new User Site repository URL
- [x] 2.2 Update `editLink.pattern` to match new repository name
- [x] 2.3 Run grep scan to ensure no remaining `/ohmyopenAI-tutorial-hub/` hardcoded prefixes in docs config/content

## 3. Build and route verification

- [x] 3.1 Run `npm run docs:build` and verify successful build
- [x] 3.2 Verify generated links for `/guide/quickstart` and `/guide/openspec/commands` are root-domain compatible
- [x] 3.3 Run smoke check on key pages in local preview

## 4. User Site migration operations

- [ ] 4.1 Create or prepare repository `strings77wzq.github.io` (blocked: repository not found from current environment)
- [ ] 4.2 Push migrated docs code to `strings77wzq.github.io` repository default branch (blocked by 4.1)
- [ ] 4.3 Enable GitHub Pages via Actions in new repository (blocked by 4.1)
- [ ] 4.4 Confirm root-domain pages are reachable at `https://strings77wzq.github.io/guide/quickstart` and `https://strings77wzq.github.io/guide/openspec/commands`

## 5. Cutover and fallback

- [x] 5.1 Add migration notice in old repository README pointing to new root-domain site
- [x] 5.2 Keep rollback plan: if root-domain deployment fails, temporarily restore old project-site URL notice until fixed
