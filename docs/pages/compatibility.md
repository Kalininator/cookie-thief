---
layout: default
title: Compatibility
nav_order: 2
description: Compatible browsers and operation systems
permalink: /compatibility
---

## Compatibility

### Supported Browsers

* Google Chrome
* Firefox

### Supported Operating Systems

* MacOS
* Linux
* Windows

## Limitations

### MacOS

On macOS, this package requires keychain access to access the Google Chrome encryption key.
You will get a dialogue popup requesting access.
Due to this popup, you cannot use this library completely headlessly to fetch cookies unless you run it once and click `Always Allow`.

### Windows

On windows, you will need some things installed before installing this package,
as `npm install` needs to compile `win-dpapi`.  
A list of prerequisites and install instructions can be found [here](https://github.com/Microsoft/nodejs-guidelines/blob/master/windows-environment.md#compiling-native-addon-modules)
