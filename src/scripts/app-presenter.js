import Camera from "./utils/camera";

export default class AppPresenter {
  #view;
  #camera;
  #model;
  #appUI;

  constructor({ view, model, appUI }) {
    this.#view = view;
    this.#model = model;
    this.#appUI = appUI;
  }

  async start() {
    try {
     const { model, metadata } = await this.#model.loadModel();
     this.#camera = this.#initializeCamera(model, metadata);
     await this.#camera.init();
     this.#view.bindCameraEvents(this.#camera);
    } catch (error) {
      this.#view.showError(error.message);
      console.error(error);
    }
  }

  #initializeCamera(model, metadata) {
    const context = this.#appUI;
    context.model = model;
    context.labels = metadata.labels;
    context.imageSize = metadata.imageSize;

    return new Camera(context);
  }
}
