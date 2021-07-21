import { getChromeCookie, getFirefoxCookies } from './src';

(async () => {
  // const cookie = await getChromeCookie('https://github.com', 'tz');
  const cookie = await getFirefoxCookies('https://github.com', 'user_session');

  console.log(`Cookie: ${cookie}`);
})();
