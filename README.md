# hoodie-app-tracker

> Default Hoodie app

[![Build Status](https://travis-ci.org/hoodiehq/hoodie-app-tracker.svg?branch=master)](https://travis-ci.org/hoodiehq/hoodie-app-tracker)
[![Dependency Status](https://david-dm.org/hoodiehq/hoodie-app-tracker.svg)](https://david-dm.org/hoodiehq/hoodie-app-tracker)
[![devDependency Status](https://david-dm.org/hoodiehq/hoodie-app-tracker/dev-status.svg)](https://david-dm.org/hoodiehq/hoodie-app-tracker#info=devDependencies)

Tracker is a simple Hoodie app, meant to be a starting point to play and build
with Hoodie.

Find the repository on [GitHub](https://github.com/hoodiehq/hoodie-app-tracker).

## Offline

In most situations this app will run when your device is offline. The app does this by using the [Service Worker](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) standard. Most [web browsers support](https://caniuse.com/#feat=serviceworkers) Service Worker but Safari and iOS devices currently do not. Where Service Worker is not supported, the app won't work offline. Please see the start-service-worker.js and sw.j for details of how this is configured.

## Installable web app

The app behaves like a native app on some devices by using the [manifest.json](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/manifest.json) file. This functionality is currently fully supported by the Chrome and Opera browsers with some features [supported by other browsers](https://caniuse.com/#feat=web-app-manifest). The manifest provides information for the web app to behave like a native app. For instance, on mobile devices by allowing users to install an icon on the homepage and provides a splash/loading page when opening.

## Requirements

Tracker needs `node >=4`. To see which version you have installed, run
```
node -v
```

## Setup

```
git clone https://github.com/hoodiehq/hoodie-app-tracker.git
cd hoodie-app-tracker
npm install --production
```

Start server with
```
npm start
```

### Optional: Setup email for password reset

If you want to use the password reset feature, you must configure an email account to send out notification, like a Google Mail account. Edit the `.hoodierc` file, the options are passed to [nodemailer.createTransport()](https://github.com/nodemailer/nodemailer-smtp-transport#usage)

```
cp .hoodierc-example .hoodierc
```

## Deployment

You can find a detailed instruction [here](deployment.md).

## Contribute

`hoodie-app-tracker` is work in progress. The goal is to have a simple application with very clear and easy to understand HTML / CSS / JS code which ideally uses no 3rd party code at all, besides the Hoodie client.

If you want to contribute to the frontend assets, you can simply open the project folder and edit the files in the [public/](public/) folder.

## Tests

Install devDependencies by running `npm install` without `--production`
```
npm install
```

Then run tests with
```
npm test
```

The tests are written using the [Cypress](https://www.cypress.io/) library. This allows interactive testing viewing the tests within a browser. This is really useful as it allows you to see the tests running. The tests can be stopped, rewound and easily debugged. To run the tests interactively:

```
npm run cypress:open
```  

## Need help or want to help?

It’s best to join our [chat](http://hood.ie/chat/).

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)
