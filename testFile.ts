import { getChromeCookie, getFirefoxCookie } from './src';

(async () => {
  // const cookie = await getChromeCookie('https://github.com', 'tz');
  const cookie = await getFirefoxCookie('https://github.com', 'user_session');

  console.log(`Cookie: ${cookie}`);
})();
