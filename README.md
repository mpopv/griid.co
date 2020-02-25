![A screenshot of griid.co](https://i.imgur.com/I0Df5hf.png)

# griid.co

[![Netlify Status](https://api.netlify.com/api/v1/badges/fe6936ec-824d-48b2-865d-83b0d0f7da73/deploy-status)](https://app.netlify.com/sites/griid/deploys) ![Lighthouse score: 96/100](https://lighthouse-badge.appspot.com/?score=96) ![MIT License](https://img.shields.io/apm/l/atomic-design-ui.svg?)

Griid is the fastest way to browse images in image-heavy subreddits on Reddit.

## Install

To install this project and build locally, you will need [Node.js 12+](https://nodejs.org/en/) and [Yarn](https://classic.yarnpkg.com/en/).

```sh
yarn install # Install dependencies
yarn build # Build app
cd dist && npx serve # Serve app from a local http server
# App will be available at localhost:5000
```

## Build Process

This project [Snowpack](https://www.snowpack.dev/) instead of a bundler like Webpack. Source .js files are processed with Babel to compile JSX, but otherwise remain untranspiled, and are imported as ES modules in the browser. ES modules are supported by [all modern browsers](https://caniuse.com/#feat=es6-module), but not by older browsers like Internet Explorer.

## Why isn't an image loading?

Probably one of two reasons:

1. Reddit frequently returns random 502/503 errors. To mitigate these, Griid will automatically retry failed requests to its API. This should make the experience seamless most of the time, but occasionally Reddit will return 5xx errors repeatedly. If no images are loading for a subreddit, that's probably what's happening.

2. Griid attempts to load up to 12 images posted to reddit at once. Because these are hotlinked from all kinds of places on the web, there are lots of potential issues loading them - for example, you might get 500 or 403 errors from third-party site operators who can't or don't want to tolerate getting DDOSed by reddit popularity. This happens frequently, so posts whose image requests fail are automatically hidden.

Posts that aren't links to a file of a format supported by your browser's `<img/>` element will be automatically hidden.