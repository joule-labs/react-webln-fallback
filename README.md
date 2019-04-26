# React WebLN Fallback

This is a set of React components and standalone libraries that provides fallback behavior for Lightning apps that use [WebLN](https://webln.dev/), allowing for developers to use a consistent API while still handling users that don't have WebLN clients in their browsers with a first-class user experience.

## Demo Example

Check out the demo here: https://react-fallback.webln.dev/

## Styles

React WebLN Fallback comes in 4 styles:

* [`react-webln-fallback-antd`](https://www.npmjs.com/package/react-webln-fallback-antd) - using [Ant Design](https://ant.design/)
* [`react-webln-fallback-bootstrap`](https://www.npmjs.com/package/react-webln-fallback-bootstrap) - using [Bootstrap](https://getbootstrap.com/) and [`react-bootstrap`](https://www.npmjs.com/package/react-bootstrap)
* [`react-webln-fallback-material-ui`](https://www.npmjs.com/package/react-webln-fallback-material-ui) - using [Material UI](https://material-ui.com/)
* [`react-webln-fallback-semantic-ui`](https://www.npmjs.com/package/react-webln-fallback-semantic-ui) - using [Semantic UI](https://react.semantic-ui.com/)

You can preview all of these styles in the [demo](https://react-fallback.webln.dev/).

Using a style component does **not** include the styles for the associated library, the expectation is that you have included the styles somewhere in your project. Please refer to the associated library for instructions on including its styling.

If you the available styles aren't to your liking, you can create your own using any of the above as an example. The [`react-webln-fallback-core`](https://www.npmjs.com/package/react-webln-fallback-core) package provides most of the utilities you'll need.

## Installation & usage (React)

Include the component towards the top of your root component and you're good to go:

```tsx
import { ReactWebLNFallback } from 'react-webln-fallback-[style]`;

ReactDOM.render(
  <>
    <App />
    <ReactWebLNFallback />
  </>
);
```

The component also takes in the following props (all optional):

| Prop             | Type                                    | Description                                                                                                                                                                                      |
|------------------|-----------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| supportedMethods | Array<WebLNMethod>                      | An array of the WebLN methods that the component will support. Defaults to all methods in the WebLNMethod enum.                                                                                  |
| methodComponents | { [key: WebLNMethod]: React.Component } | An object keyed by WebLN method to component. Each component receives the WebLN method parameters as its arguments. See our components for example.                                              |
| i18nextLng       | `i18next.Language`                      | [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code. Defaults to using [i18next-browser-langaugedetector](https://www.npmjs.com/package/i18next-browser-languagedetector) for language auto-detection |
| overrideWebLN    | boolean                                 | Forcefully user-provided WebLN client. Not recommended in production, mainly for demoing & testing.                                                                                              |

## Installation & usage (Standalone UMD)

If you're not using React and / or don't have a build system setup, you can use the standalone versions of each style. Simply include the script for the style you want, call init with an element to mount to, and you're good to go.

```html
<!-- It's recommended to add SRI integrity attributes for security -->
<script src="https://unpkg.com/react-webln-fallback-[style]/umd/react-webln-fallback.min.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", function() { 
    const el = document.getElementById('react-webln-fallback');
    ReactWebLNFallback.init(el);
  });
</script>
<div id="react-webln-fallback"></div>
```

The standalone version bundles React with it to allow for use even with non-React applications. If you are already using React and don't want it bundled twice, you should use the node module (instructions above) instead of the UMD script.


## Localization

React WebLN Fallback supports the following languages:

* English

If you'd like to add support for your language, simply add a `[lang].json` file to `packages/react-webln-fallback-core/src/i18n/` and add the following code to `index.ts` in that folder:

```diff
 import en from './en.json';
+import fr from './fr.json';

 const resources = {
   en: { translation: en },
+  fr: { translation: fr },
 };
```

## Development

### Requirements

* Node 8+
* Yarn 1+ (many commands use this, so npm will not be enough)

### Development

* Run `yarn link-packages` in the root directory to install dependencies and link all of the packages together (core to each of the styles, each of the styles to the demo).
* Go into the sub-package folder you want to work on and run `yarn dev`
* Go into the demo folder and run `yarn dev`
* (Optional) if working on core, you'll need to be running yarn dev in its package folder and one of the style package folders to actually test it.

### Building

Simply run `yarn build` in the root directory to build production versions of each package


### Publishing

Go to each of the directories in `packages/`, bump version numbers, and run `yarn publish`