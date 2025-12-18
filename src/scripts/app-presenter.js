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
      // TODO: Panggil loadModel dari AppModel dan simpan hasilnya ke dalam context
      this.#initializeCamera();
      this.#view.populateCameraSelect();
    } catch (error) {
      // TODO: Tangani error dan tampilkan pesan error di UI
      console.error(error);
    }
  }

  #initializeCamera() {
    const context = this.#appUI;

    // TODO: Tambahkan model, label, dan imageSize ke dalam context setelah dipanggil pada method start()

    this.#camera = new Camera(context);
    this.#view.bindCameraEvents(this.#camera);
  }
}
