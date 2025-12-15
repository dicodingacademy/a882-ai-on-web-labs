import '../styles/styles.css';

import App from './app';

const app = new App({
  content: document.querySelector('#main-content'),
});

window.addEventListener('DOMContentLoaded', async () => {
  await app.renderPage();
});
