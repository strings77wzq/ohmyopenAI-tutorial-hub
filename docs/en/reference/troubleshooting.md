# Troubleshooting

## Site Build Fails

1. Check if sidebar links correspond to existing files
2. Run `npm run docs:build` to see specific errors

## Page 404

- Check if links in `docs/.vitepress/config.ts` are correct
- Check markdown file paths and naming

## Language Switch Issues

- Check `locales` configuration
- Check if corresponding pages under `/en/` exist

## Command Has No Response

Ensure executing in project root and OpenSpec is initialized (`openspec init`).

## Spec and Code Out of Sync

After each change, run `verify` + sync specification documents.