---
layout: default
title: Browser profiles
nav_order: 4
description: Specifying browser profiles
permalink: /browser-profiles
---

# Browser profiles

## Choosing browser profiles

If you are utilising multiple browser profiles, you can specify which one to use in the function options.

```js
import { getCookie, listCookies, Browser } from 'cookie-thief';

await getCookie({
  browser: Browser.Chrome,
  cookieName: 'foo',
  domain: '.github.com',
  options: {
    profile: 'SomeProfile',
  },
});

await listCookies({
  browser: Browser.Firefox,
  options: {
    profile: 'SomeProfile',
  },
});
```

## Listing browser profiles

If you want to programmatically list browser  profiles, you can with `listProfiles`.

```js
import { listProfiles, Browser } from 'cookie-thief';

const profiles: string[] = await listProfiles(Browser.Chrome);
```

## Default browser profiles

If you do not specify a profile, a default profile name will be used.

* Firefox: `default-release`
* Chrome: `Default`
