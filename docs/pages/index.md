---
layout: default
title: Getting Started
nav_order: 1
description: Getting started
permalink: /
---

# Cookie Thief

![npm](https://img.shields.io/npm/v/cookie-thief)
![npm](https://img.shields.io/npm/dw/cookie-thief)
![npm bundle size](https://img.shields.io/bundlephobia/min/cookie-thief)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/cookie-thief)
[![codecov](https://codecov.io/gh/Kalininator/cookie-thief/branch/master/graph/badge.svg?token=H0F1TIE0CY)](https://codecov.io/gh/Kalininator/cookie-thief)

A node.js library for extracting cookies from a browser installed on your system. 
Inspired by [chrome-cookies-secure](https://github.com/bertrandom/chrome-cookies-secure).

## Installation

```bash
npm install cookie-thief
```

```bash
yarn add cookie-thief
```


## Usage

```javascript
const { getCookie, listCookies, Browser } = require('cookie-thief')

// Get a cookie from chrome browser for domain .github.com, searching for cookie named 'dotcom_user'
const cookie = await getCookie({
  browser: Browser.Chrome,
  domain: '.github.com',
  cookieName: 'dotcom_user',
});
console.log(cookie);
// Will be a Cookie if cookie is successfully found
// Will be undefined if not found
//{
//  name: 'cookie name here',
//  value: 'decrypted cookie content here',
//  host: 'hostname of cookie here',
//  path: 'path of cookie here'
//}

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
