# Dev Utilities

<p align="center">
  Powerful tools for developers. <a href="https://aminechraibi.github.io/dev-utilities">Try it!</a>
</p>

<p align="center">
  <a href="https://ko-fi.com/P5P21ZQGK2" target="_blank">
    <img height="36" style="border:0px;height:36px;" src="https://storage.ko-fi.com/cdn/kofi6.png?v=6" border="0" alt="Buy Me a Coffee at ko-fi.com" />
  </a>
</p>

A free and open-source collection of online tools for developers and IT professionals — 60+ utilities, great UX, no ads.

## Deployment

**GitHub Pages (automatic):** Every push to `main` deploys to [aminechraibi.github.io/dev-utilities](https://aminechraibi.github.io/dev-utilities).

**Run locally:**

```sh
pnpm install
pnpm dev
```

**Build for production:**

```sh
pnpm build
```

## Contribute

### Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) with these extensions:

- [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (disable Vetur)
- [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [i18n Ally](https://marketplace.visualstudio.com/items?itemName=lokalise.i18n-ally)

VSCode settings:

```json
{
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "i18n-ally.localesPaths": ["locales", "src/tools/*/locales"],
  "i18n-ally.keystyle": "nested"
}
```

### Project Setup

```sh
pnpm install
```

### Compile and Hot-Reload for Development

```sh
pnpm dev
```

### Type-Check, Compile and Minify for Production

```sh
pnpm build
```

### Run Unit Tests

```sh
pnpm test
```

### Lint

```sh
pnpm lint
```

## Contributors

[![contributors](https://contrib.rocks/image?repo=aminechraibi/dev-utilities)](https://github.com/aminechraibi/dev-utilities/graphs/contributors)

## Support

If you find this useful, consider supporting:

<a href="https://ko-fi.com/P5P21ZQGK2" target="_blank">
  <img height="72" style="border:0px;height:72px;" src="https://storage.ko-fi.com/cdn/kofi6.png?v=6" border="0" alt="Buy Me a Coffee at ko-fi.com" />
</a>

## Attribution

This project is a modified fork of [IT Tools](https://github.com/CorentinTh/it-tools) by [Corentin Thomasset](https://github.com/CorentinTh), originally licensed under the GNU GPLv3. See [NOTICE](NOTICE) for a full list of changes.

## License

[GNU GPLv3](LICENSE)
