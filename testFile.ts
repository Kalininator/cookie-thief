import { getChromeCookie } from './src';

(async () => {
  const cookie = await getChromeCookie('https://github.com', 'tz');

  console.log(`Cookie: ${cookie}`);
})();
