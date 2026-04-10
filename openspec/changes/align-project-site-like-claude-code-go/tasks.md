## 1. Lock deployment mode to Project Site

- [x] 1.1 Set `docs/.vitepress/config.ts` base to `/ohmyopenAI-tutorial-hub/`
- [x] 1.2 Ensure head assets and logo paths use `/ohmyopenAI-tutorial-hub/` prefix
- [x] 1.3 Scan docs for broken root-domain assumptions and normalize links to project-site behavior

## 2. Align language entry behavior with reference style

- [x] 2.1 Design `/zh/` and `/en/` entry mapping for existing content structure
- [x] 2.2 Implement navigation/locales updates to expose `/zh/` and `/en/` clearly
- [x] 2.3 Verify both language entry paths are reachable in preview

## 3. Fix repository hygiene for build output

- [x] 3.1 Keep `docs/.vitepress/dist/` and `docs/.vitepress/cache/` in `.gitignore`
- [x] 3.2 Remove `docs/.vitepress/dist` from git index tracking (`git rm -r --cached` once)
- [x] 3.3 Verify `git status` is clean from dist hash-noise

## 4. Validate and deploy

- [x] 4.1 Run `npm run docs:build` and ensure success
- [x] 4.2 Run `npm run docs:preview` smoke test for key paths
- [x] 4.3 Push to current repository and wait for Pages deployment
- [x] 4.4 Verify production URLs under `https://strings77wzq.github.io/ohmyopenAI-tutorial-hub/...`
