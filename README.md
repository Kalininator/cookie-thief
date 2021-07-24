# Cookie Thief
![npm](https://img.shields.io/npm/v/cookie-thief)
![npm](https://img.shields.io/npm/dw/cookie-thief)
![npm bundle size](https://img.shields.io/bundlephobia/min/cookie-thief)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/cookie-thief)

A node.js library for extracting cookies from a browser installed on your system. 
Inspired by [chrome-cookies-secure](https://github.com/bertrandom/chrome-cookies-secure).

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
const { getChromeCookie } = require('cookie-thief')

// Get a cookie from chrome browser for domain .github.com, searching for cookie named 'dotcom_user'
const cookie = await getChromeCookie('https://github.com', 'dotcom_user');
console.log(cookie);
// Will be a string if cookie is successfully found
// Will be undefined if not found
```

### Firefox

```javascript
const { getFirefoxCookies } = require('cookie-thief')

// Get a cookie from chrome browser for domain .github.com, searching for cookie named 'dotcom_user'
const cookie = await getFirefoxCookies('https://github.com', 'dotcom_user');
console.log(cookie);
// Will be a string if cookie is successfully found
// Will be undefined if not found
```

## Limitations

### macOS
On macOS, this package requires keychain access to access the Google Chrome encryption key. You will get a dialogue popup requesting access.

### Chrome profiles
Currently only using the `Default` chrome profile. Looking to make this configurable in the future.

## License
This software is free to use under the MIT license. See the [LICENSE file](https://github.com/kalininator/cookie-thief/blob/master/LICENSE.md) for license text and copyright information.
