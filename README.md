# hoodie-app-tracker

> Default Hoodie app

[![Build Status](https://travis-ci.org/hoodiehq/hoodie-app-tracker.svg?branch=master)](https://travis-ci.org/hoodiehq/hoodie-app-tracker)
[![Dependency Status](https://david-dm.org/hoodiehq/hoodie-app-tracker.svg)](https://david-dm.org/hoodiehq/hoodie-app-tracker)
[![devDependency Status](https://david-dm.org/hoodiehq/hoodie-app-tracker/dev-status.svg)](https://david-dm.org/hoodiehq/hoodie-app-tracker#info=devDependencies)

Tracker is a simple Hoodie app, meant to be a starting point to play and build
with Hoodie.

## Setup

```
git clone git@github.com:hoodiehq/hoodie-app-tracker.git
cd hoodie-app-tracker
npm install --production
cp .hoodierc-example .hoodierc
```

If you want to use the password reset feature, you must configure an email account
to send out notification, like a Google Mail account. Edit the `.hoodierc` file,
the options are passed to [nodemailer.createTransport()](https://github.com/nodemailer/nodemailer-smtp-transport#usage)

```
npm start
```

# Deployment

You can find a detailed instruction [here](deployment.md).

## Contribute

`hoodie-app-tracker` is work in progress. The goal is to have a simple
application with very clear and easy to understand HTML / CSS / JS code which
ideally uses no 3rd party code at all, besides the Hoodie client.

If you want to contribute to the frontend assets, you can simply open
[www/index.html](www/index.html) directly in your browser and edit the files in
the [www/](www/) folder.

## Tests

Install devDependencies by running `npm install` without `--production`

```
npm install
```

Then run tests with

```
npm test
```

## What’s next?

- help us make `hoodie-app-tracker` a great experience! We want to keep it
  intentionally simple, so people can play / extend it. To make it as accessible
  (hackable) as possible, we want to keep the HTML / CSS / JS code to a minimum
  and not use 3rd party libraries at all if possible.
- on Hoodie itself, we prepared great starter issues: [starter issues](http://go.hood.ie/hoodie-starter-issues).
- We have harder ones, too, if you feel adventurous :) Remove the "starter" label
  from the filter
- Next up we want to make CouchDB optional, to make it even simpler to get started
  with the new Hoodie

## Need help or want to help?

It’s best to join our [chat](http://hood.ie/chat/).

## License

[Apache 2.0](http://www.apache.org/licenses/LICENSE-2.0)
