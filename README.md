# Cookie Thief
![npm](https://img.shields.io/npm/v/cookie-thief)

A node.js library for extracting cookies from a browser installed on your system. 
Inspired by [chrome-cookies-secure](https://github.com/bertrandom/chrome-cookies-secure).

## Compatibility

Currently supports only Google Chrome, on MacOS, Linux, and Windows.

In the future will hopefully expand to support other browsers.

## Installation
```bash
npm install cookie-thief
```
```bash
yarn add cookie-thief
```

## Usage

```javascript
const { getChromeCookie } = require('cookie-thief')

// Get a cookie from chrome browser for domain .github.com, searching for cookie named 'dotcom_user'
const cookie = await getChromeCookie('https://github.com', 'dotcom_user');
console.log(cookie);
// Will be a string if cookie is successfully found
// Will be undefined if not found
```
