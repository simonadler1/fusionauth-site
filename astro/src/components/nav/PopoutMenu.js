export default class PopoutMenu {
  #outState = ['ease-out', 'duration-100', 'opacity-0', 'scale-95'];
  #inState = ['ease-in', 'duration-75', 'opacity-100', 'scale-100'];

  #mouseOverMedButton = false;
  #mouseOverMedMenu = false;
  #medMenuVisible = false;
  #medMenuClicked = false;

  #menuElem;
  #menuId;
  constructor(menuId) {
    this.#menuId = menuId;
    this.#menuElem = document.getElementById(`${this.#menuId}-menu`);

    document.getElementById(`${this.#menuId}-button`).addEventListener('mouseout', event => {
        this.#mouseOverMedButton = false;
        if (!this.#medMenuClicked) {
          this.#toggleMedMenu();
        }
      });

      document.getElementById(`${this.#menuId}-menu`).addEventListener('mouseout', event => {
        this.#mouseOverMedMenu = false;
        if (!this.#medMenuClicked) {
          this.#toggleMedMenu();
        }
      });

      document.getElementById(`${this.#menuId}-button`).addEventListener('mouseover', event => {
        this.#mouseOverMedButton = true;
        if (!this.#medMenuClicked) {
          this.#toggleMedMenu();
        }
      });

      document.getElementById(`${this.#menuId}-menu`).addEventListener('mouseover', event => {
        this.#mouseOverMedMenu = true;
        if (!this.#medMenuClicked) {
          this.#toggleMedMenu();
        }
      });

      document.getElementById(`${this.#menuId}-button`).addEventListener('click', event => {
        // handle mobile clicked
        this.#medMenuClicked = !this.#medMenuClicked;
        this.#toggleMedMenu();
      });
  }

  #toggleMedMenu() {
    if (this.#medMenuClicked) {
      if (!this.#medMenuVisible) {
        this.#medMenuVisible = true;
        this.#menuElem.classList.remove(...this.#outState);
        this.#menuElem.classList.add(...this.#inState);
      }
    }
    if ((this.#mouseOverMedButton || this.#mouseOverMedMenu) && !this.#medMenuVisible) {
      this.#medMenuVisible = true;
      this.#menuElem.classList.remove(...this.#outState);
      this.#menuElem.classList.add(...this.#inState);
    } else if (!this.#medMenuClicked) {
      setTimeout(() => {
        if (!this.#mouseOverMedMenu && !this.#mouseOverMedMenu) {
          this.#medMenuVisible = false;
          this.#menuElem.classList.remove(...this.#inState);
          this.#menuElem.classList.add(...this.#outState);
        }
      }, 500);
    }
  }
}