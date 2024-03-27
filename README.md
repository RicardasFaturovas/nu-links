This is a [Plasmo extension](https://docs.plasmo.com/) project bootstrapped with [`plasmo init`](https://www.npmjs.com/package/plasmo).

## Getting Started

Node 16 or above is required

```bash
npm install
```

To run development server

```bash
npm run dev
```

Open your browser and load the appropriate development build. For example, if you are developing for the chrome browser, using manifest v3, use: `build/chrome-mv3-dev`.

You can start editing the popup by modifying `popup.tsx`. It should auto-update as you make changes. To add an options page, simply add a `options.tsx` file to the root of the project, with a react component default exported. Likewise to add a content page, add a `content.ts` file to the root of the project, importing some module and do some logic, then reload the extension on your browser.

For further guidance, [visit our Documentation](https://docs.plasmo.com/)

## Making production build

This should create a production bundle for your extension, ready to be zipped and published to the stores.

Run the following:

```bash

npm run build
```

Bundled extension will be found under `build/chrome-mv3-prod`

For firefox use:

```bash
npm run build-firefox
```

Bundled extension will be found under `build/firefox-mv2-prod`
