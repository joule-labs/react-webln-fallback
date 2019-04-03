# React WebLN Fallback Demo

This is a little demo based off of the [WebLN demos](https://webln.dev/) that shows off how React WebLN Fallback works.

## Development

1. Run `yarn` to get dependencies
2. Go up to the parent directory
3. Run `yarn build` to build the `react-webln-fallback` component
4. Run `yarn link` to provide a link for `react-webln-fallback`
5. Return to this directory
6. Run `yarn dev

Changes to the library will be reflected in the demo as you make changes.

## Building / Publishing

1. Publish the latest version of `react-webln-fallback`
2. Run `yarn add react-webln-fallback@[new-version-here]` to upgrade to the latest version
3. Run `yarn unlink react-webln-fallback` to make sure you're using the npm package and not the local one
4. Run `yarn publish` to update the gh-pages branch, or `yarn build` to just make a build without pushing
