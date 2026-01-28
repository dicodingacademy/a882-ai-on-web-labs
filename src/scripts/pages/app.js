import HomePage from './home/home-page.js';

class App {
  #content = null;

  constructor({ content }) {
    this.#content = content;
  }

  async renderPage() {
    const page = new HomePage();
    this.#content.innerHTML = await page.render();
    await page.afterRender();
  }
}

export default App;
