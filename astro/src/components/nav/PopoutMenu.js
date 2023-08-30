export default class PopoutMenu {
  #outState = ['opacity-0', 'scale-[.25]'];
  #inState = ['opacity-100', 'scale-100'];

  #medMenuClicked = false;

  #menuElem;
  #menuId;
  constructor(menuId) {
    this.#menuId = menuId;
    this.#menuElem = document.getElementById(`${this.#menuId}-menu`);

    document.getElementById(`${this.#menuId}-button`).addEventListener('click', event => {
      // handle mobile clicked
      this.#medMenuClicked = !this.#medMenuClicked;
      this.#toggleMenuClicked();
    });
  }

  #toggleMenuClicked() {
    if (this.#medMenuClicked) {
      this.#menuElem.classList.remove(...this.#outState);
      this.#menuElem.classList.add(...this.#inState);
    } else {
      this.#menuElem.classList.remove(...this.#inState);
      this.#menuElem.classList.add(...this.#outState);
    }
  }
}