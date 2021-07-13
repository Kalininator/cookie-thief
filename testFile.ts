import { getCookie } from './src';

(async () => {
  const cookie = await getCookie('https://app.tray.io', 'prod_tray_lid');

  console.log(`Cookie: ${cookie}`);
})();
