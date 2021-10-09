---
layout: default
title: Fetching Cookies
nav_order: 3
description: Getting and listing cookies
permalink: /fetching-cookies
---

# Get Cookie

`getCookie` can be used to try and find a cookie based on the domain and cookie name.
If a cookie is not found, the result will be `undefined`.

```js
import { getCookie, Browser } from 'cookie-thief';

const cookie = await getCookie({
  browser: Browser.Chrome, // or Browser.Firefox
  domain: '.reddit.com',
  cookieName: 'loid',
});

/*
{
  name: 'loid',
  value: 'the decrypted cookie value here',
  domain: '.reddit.com',
  path: '/',
}
*/
```

# List Cookies

`listCookies` can be used to list all cookies for a browser.
If no cookies are found you will get `[]`.

```js
import { listCookies, Browser } from 'cookie-thief';

const cookies = await listCookies({
  browser: Browser.Chrome, // or Browser.Firefox
})

/*
[
  {
    name: 'loid',
    value: 'the decrypted cookie value here',
    domain: '.reddit.com',
    path: '/',
  }
]
*/
```
