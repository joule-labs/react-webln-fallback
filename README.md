# React WebLN Fallback

This is a React component and standalone library that provides fallback behavior for Lightning apps that use [WebLN](https://webln.dev/), allowing for a consistent API while still handling users that don't have WebLN clients in their browsers.

## Demo Example

Check out the demo here: https://demo.com

## Available Styles

React WebLN Fallback comes in 5 styles:

* [Ant Design](https://ant.design/) ([`antd`](https://www.npmjs.com/package/antd))
* [Material UI](https://material-ui.com/) ([`@material-ui/core`](https://www.npmjs.com/package/@material-ui/core))
* [Semantic UI](https://react.semantic-ui.com/) ([`semantic-ui-react`](https://www.npmjs.com/package/semantic-ui-react))
* Default (No module, just our own custom markup and CSS)
* Custom (No styles or markup, you write the components yourself)

You can preview all of these styles in the [demo](https://demo.com).

Using a style component does **not** include the styles for the associated library, the expectation is that you have included the styles somewhere in your project. Please refer to the associated library for instructions on including its styling.

If you're using the "Default" style, you can either include the CSS bundled, or write your own to style the markup. If you're using the "Custom" style, you'll need to provide your own components to render for each supported method.

## Installation & usage (React)

Include the component and you're good to go:

```ts
import { ReactWebLNFallback } from 'react-webln-fallback/styles/[style]`;
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

If you're not using React and / or don't have a build system setup, you can use the standalone version of `react-webln-fallback`. Simply include the script for the style you want, call init with an element to mount to, and you're good to go.

```html
<!-- This is just an example, please use the demo tool to generate the correct markup -->
<script src="https://unpkg.com/library/react-webln-fallback.[style].min.js"></script>
<script>
  document.addEventListener("DOMContentLoaded", function() { 
    const el = document.getElementById('react-webln-fallback');
    ReactWebLNFallback.init(el);
  });
</script>
<div id="react-webln-fallback"></div>
```

The standalone version uses [Preact](https://preactjs.com) instead of React to keep the bundle size down.

When using the "Default" style, you'll also want to include the corresponding stylesheet unless you want to write your own:

```html
<link rel="stylesheet" src="" >
```

The custom style is not available for the standalone version.

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