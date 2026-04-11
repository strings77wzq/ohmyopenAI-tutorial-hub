# Commands

This page collects the commands used across the tutorial. Run commands from the project root unless a chapter says otherwise.

## Documentation site

```bash
npm install
npm run docs:dev
npm run docs:build
npm run docs:check-links
```

Use `docs:dev` while writing, `docs:build` before publishing, and `docs:check-links` before submitting a documentation change.

## OpenSpec workflow

```bash
openspec new change "my-change"
openspec status --change "my-change"
openspec instructions apply --change "my-change"
```

OpenSpec changes keep proposals, design notes, specs, and implementation tasks in one reviewable place.

## Example projects

```bash
cd examples/ecommerce-mini-nodejs
npm install
npm test
```

```bash
cd examples/ecommerce-mini-python
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
pytest
```

## Quality checklist

- Build the docs before publishing.
- Run the internal link audit.
- Run tests for changed example projects.
- Check navigation in both Chinese and English.
- Record any deferred content or translation gap in the related OpenSpec change.

Next: [FAQ](/en/reference/faq) or [Troubleshooting](/en/reference/troubleshooting).
