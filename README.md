# React WebLN Fallback

This is a set of React components and standalone libraries that provides fallback behavior for Lightning apps that use [WebLN](https://webln.dev/), allowing for developers to use a consistent API while still handling users that don't have WebLN clients in their browsers with a first-class user experience.

## Demo Example

Check out the demo here: https://react.webln.dev/

## Styles

React WebLN Fallback comes in 4 styles:

* [`react-webln-fallback-bootstrap`](https://www.npmjs.com/package/react-webln-fallback-bootstrap) - using [Bootstrap](https://getbootstrap.com/) and [`react-bootstrap`](https://www.npmjs.com/package/react-bootstrap)
* [`react-webln-fallback-antd`](https://www.npmjs.com/package/react-webln-fallback-antd) - using [Ant Design](https://ant.design/)
* [`react-webln-fallback-material-ui`](https://www.npmjs.com/package/react-webln-fallback-material-ui) - using [Material UI](https://material-ui.com/)
* [`react-webln-fallback-semantic-ui`](https://www.npmjs.com/package/react-webln-fallback-semantic-ui) - using [Semantic UI](https://react.semantic-ui.com/)

You can preview all of these styles in the [demo](https://react.webln.dev/).

Using a style component does **not** include the styles for the associated library, the expectation is that you have included the styles somewhere in your project. Please refer to the associated library for instructions on including its styling.

If you the available styles aren't to your liking, you can create your own using any of the above as an example. The [`react-webln-fallback-core`](https://www.npmjs.com/package/react-webln-fallback-core) package provides most of the utilities you'll need.

## Installation & usage (React)

Include the component towards the top of your root component and you're good to go:

```ts
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
| i18next          | `i18next.i18n`                          | Your own `i18next` instance. If you don't want to pass this, you can pass the other i18next* props instead. |
| i18nextLng       | `i18next.Language`                      | [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes) language code. Defaults to [i18next-browser-langaugedetector](https://www.npmjs.com/package/i18next-browser-languagedetector) |
| i18nextResource  | `i18next.Resource`                      | A set of language resources to draw from instead of our own. Resource will be merged with our own so that languages or keys you leave out are still covered. |
| overrideWebLN    | boolean                                 | Forcefully user-provided WebLN client. Not recommended in production, mainly for demoing & testing.                                                                                              |

## Installation & usage (Standalone)

If you're not using React and / or don't have a build system setup, you can use the standalone versions of each style. Simply include the script for the style you want, call init with an element to mount to, and you're good to go.

```html
<script src="https://unpkg.com/react-webln-fallback-[style]/umd/react-webln-fallback.min.js"></script>

<script>
  document.addEventListener("DOMContentLoaded", function() { 
    const el = document.getElementById('react-webln-fallback');
    ReactWebLNFallback.init(el);
  });
</script>
<div id="react-webln-fallback"></div>
```

The standalone version uses [Preact](https://preactjs.com) instead of React to keep the bundle size down. If you want to use React instead, or already have (P)React in your code, you should use the node module instead of the UMD script.


## Localization

React WebLN Fallback supports multiple languages, but requires a little configuration on your end to support them. You can pass the `lng` prop to manually specify a language instead of having the component automatically detect,and optionally you can also pass a `translations` dict to specify what strings to render, keyed by the lng key.

Languages are keyed by [ISO-639-1](https://en.wikipedia.org/wiki/List_of_ISO_639-1_codes), and the translation keys for each language can be found by looking at [one of ours as an example](en.json). Any keys you leave out in this will use our default.

Example:
```tsx
const translations = {
  en: {
    send: {
      help: 'Need help? Check out our guide at https://mycustomurl.com/',
      // ...
    },
    // ...
  },
  fr: {
    // ...
  },
  // ...
}

<ReactWebLN lng="en" translations={translations} />
```

## Development

Fill me out.