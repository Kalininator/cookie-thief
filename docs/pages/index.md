---
layout: default
title: Getting Started
nav_order: 1
description: Getting started
permalink: /
---

# Cookie Thief
{: .no_toc}

1. TOC
{:toc}

## Compatibility

Currently supports only Google Chrome and Firefox on MacOS, Linux, and Windows.

In the future will hopefully expand to support other browsers.

## Installation

```bash
npm install cookie-thief
```

```bash
yarn add cookie-thief
```


## Usage

### Google Chrome

```javascript
const { getCookie, listCookies, Browser } = require('cookie-thief')

// Get a cookie from chrome browser for domain .github.com, searching for cookie named 'dotcom_user'
const cookie = await getCookie({
  browser: Browser.Chrome,
  url: 'https://github.com',
  cookieName: 'dotcom_user',
  options: {
    profile: 'Default',
  },
});
console.log(cookie);
// Will be a string if cookie is successfully found
// Will be undefined if not found

const cookies = await listCookies({
  browser: Browser.Chrome,
});
console.log(cookies);
// Array of cookies
//[
//  {
//    name: 'cookie name here',
//    value: 'decrypted cookie content here',
//    host: 'hostname of cookie here',
//    path: 'path of cookie here'
//  }
//]

```

### Firefox

```javascript
const { getCookie, Browser } = require('cookie-thief')

// Get a cookie from chrome browser for domain .github.com, searching for cookie named 'dotcom_user'
const cookie = await getCookie({
  browser: Browser.Firefox,
  url: 'https://github.com',
  cookieName: 'dotcom_user',
  options: {
    profile: 'default-release',
  },
});
console.log(cookie);
// Will be a string if cookie is successfully found
// Will be undefined if not found

const cookies = await listCookies({
  browser: Browser.Firefox,
});
console.log(cookies);
// Array of cookies
//[
//  {
//    name: 'cookie name here',
//    value: 'decrypted cookie content here',
//    host: 'hostname of cookie here',
//    path: 'path of cookie here'
//  }
//]
```

## Limitations

### macOS
On macOS, this package requires keychain access to access the Google Chrome encryption key. You will get a dialogue popup requesting access.
