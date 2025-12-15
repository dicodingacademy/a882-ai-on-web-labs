import Camera from './utils/camera.js';

export default class AppPresenter {
  #view;
  #model;
  #camera;
  #appUI;

  constructor({ view, model, appUI }) {
    this.#view = view;
    this.#model = model;
    this.#appUI = appUI;
  }

  async start() {
    try {
      const { model, metadata } = await this.#model.loadModel();
      this.#initializeCamera(model, metadata);
      this.#populateCameraSelect();
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

    this.#camera = new Camera(context);
    this.#view.bindCameraEvents(this.#camera);
  }

  async #populateCameraSelect() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      return;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();
    const videoDevices = devices.filter((device) => device.kind === 'videoinput');

    this.#view.populateCameraSelect(videoDevices);
  }
}
