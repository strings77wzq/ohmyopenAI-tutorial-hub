# Contributing

Thank you for improving Agent Engineering Hub. Contributions can include documentation, examples, translations, troubleshooting notes, and quality tooling.

## Local development

```bash
git clone https://github.com/strings77wzq/ohmyopenAI-tutorial-hub.git
cd ohmyopenAI-tutorial-hub
npm install
npm run docs:dev
```

Before submitting:

```bash
npm run docs:build
npm run docs:check-links
```

If you change an example project, run that example's tests as well.

## Page template

New tutorial pages should include:

| Section | Requirement |
| --- | --- |
| Goal | What the reader can do after the chapter |
| Concept | Key vocabulary and problem context |
| Steps | Executable commands, config, or workflow |
| Practice | A self-checkable task |
| Troubleshooting | Common failures and diagnosis |
| Next step | Links to follow-up chapters or examples |

## Link rules

- Official navigation and sidebars must point to real pages.
- English pages should prefer `/en/` links.
- Chinese pages should prefer Chinese routes.
- Shared fallback pages are acceptable only when the page exists.
- Run `npm run docs:check-links` after adding pages.

## Pull request checklist

- [ ] Documentation build passes.
- [ ] Internal link audit passes.
- [ ] New tutorials include goal, concept, steps, practice, troubleshooting, and next step.
- [ ] Chinese and English navigation has no broken first-party links.
- [ ] Example pages explain run commands and quality checks.
- [ ] Visual changes were reviewed on desktop and mobile.

## Report an issue

Include:

- Page URL.
- Error or 404 observed.
- Reproduction steps.
- Expected behavior.
- Key command output if a command failed.

## License

This project is released under the MIT license. Contributions are accepted under the same license.
