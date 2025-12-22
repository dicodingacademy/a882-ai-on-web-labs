import Camera from "./utils/camera";

export default class AppPresenter {
  #view;
  #camera;
  #appUI;

  constructor({ view, appUI }) {
    this.#view = view;
    this.#appUI = appUI;
  }

  async start() {
    try {
      this.#camera = this.#initializeCamera();
      await this.#camera.init();
      this.#view.bindCameraEvents(this.#camera);
    } catch (error) {
      this.#view.showError(error.message);
      console.error(error);
    }
  }

  #initializeCamera() {
    const context = this.#appUI;

    return new Camera(context);
  }
}
