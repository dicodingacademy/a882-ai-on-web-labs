import '../styles/styles.css';
import App from './pages/app.js';

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.bundle.js')
      .then((registration) => {
        console.log('Service Worker registered: ', registration);
      })
      .catch((error) => {
        console.error('Service Worker registration failed: ', error);
      });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  const app = new App({
    content: document.querySelector('#main-content'),
  });

  await app.renderPage();

  /**
   * @review
   * event listener hashchange juga sebetulnya di sini belum begitu berguna,
   * karena aplikasi masih dalam 1 halaman.
   *
   * Selain itu, mekanisme render halaman pun belum ada sistem route, masih hardcoded me-render homepage.
   *
   * Aku vote untuk dihapus saja.
   */
  window.addEventListener('hashchange', async () => {
    /**
     * @review
     * Method beforeLeave() sepertinya tidak didefinisikan di dalam class app,
     * sehingga invocation akan gagal.
     *
     * Reproduce error:
     * 1. jalankan dev-server,
     * 2. visit http://localhost:8080,
     * 3. terdapat error overlay yag menunjukkan invocation function gagal.
     */
    await app.beforeLeave();
    await app.renderPage();
  });
});
