## Context

The `ohmyopenAI-tutorial-hub` repository is configured to build its documentation using VitePress. The CI/CD pipeline (`.github/workflows/deploy.yml`) is correctly configured to run `npm run docs:build`. However, GitHub Pages is still falling back to its legacy Jekyll rendering engine for the deployed site because the user has not switched the repository settings from "Deploy from a branch" to "GitHub Actions", OR because the built output on the branch lacks the instruction to bypass Jekyll. 

When GitHub Pages detects what it thinks is a Jekyll site (or simply processes Markdown files directly on a branch), it will override VitePress generated files and serve broken content because VitePress uses a different structure and requires its own assets.

## Goals / Non-Goals

**Goals:**
- Ensure that the VitePress build output is explicitly marked to bypass Jekyll.
- Guarantee that any deployment method (Actions or branch-based) serves the VitePress `dist` folder natively.

**Non-Goals:**
- Do not modify the VitePress theme or content itself.
- Do not interact with the repository's GitHub Actions settings directly (as this requires manual user intervention via the GitHub UI).

## Decisions

- **Decision 1: Add a `.nojekyll` file**
  GitHub Pages requires a `.nojekyll` file at the root of the published directory to disable the Jekyll build process.
  Since VitePress handles the `public` directory by copying its contents to the root of the `dist` folder upon build, adding an empty `.nojekyll` file into `docs/public` ensures that it ends up in `docs/.vitepress/dist/.nojekyll`. This guarantees GitHub Pages will serve the HTML as-is.

## Risks / Trade-offs

- **Risk:** The user's GitHub Pages settings might still be pointing to the wrong source (e.g., `main` branch `/docs` folder) instead of using the GitHub Actions artifact.
  **Mitigation:** The primary fix for the UI is the GitHub Pages settings UI switch (from `Deploy from a branch` to `GitHub Actions`), which the user must perform manually. Providing the `.nojekyll` file adds a layer of robustness if they somehow deploy the `dist` folder to a `gh-pages` branch, but the fundamental fix still requires their manual settings change. I will add a `.nojekyll` file to be safe, but also explicitly instruct the user on the required manual setting change in the task.