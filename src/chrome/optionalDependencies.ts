/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable global-require */

let keytar: any;
export function getKeytar(): any {
  if (keytar) return keytar;
  keytar = require('keytar');
  return keytar;
}

let dpapi: any;
export function getDpapi(): any {
  if (dpapi) return dpapi;
  dpapi = require('win-dpapi');
  return dpapi;
}
