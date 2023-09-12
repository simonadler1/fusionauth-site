'use strict';

class PopoutMenu {
  #toggleMap = {};

  #outState = ['lg:ease-out', 'lg:duration-100', 'lg:opacity-0', 'lg:scale-95'];
  #inState = ['lg:ease-in', 'lg:duration-75', 'lg:opacity-100', 'lg:scale-100'];

  constructor() {
    document.addEventListener('click', () => this.#handleClick(event));
  }

  #handleClick(event) {
    const button = event.target.closest('[data-widget="popout-button"]');
    if (!button || !button.dataset.element) {
      return;
    }

    const id = button.dataset.element;
    const element = document.getElementById(id);
    this.#toggleMenuClicked(id, element);
  }

  #toggleMenuClicked(id, elem) {
    console.log('toggling', id, elem, this.#toggleMap);
    if (!Object.keys(this.#toggleMap).includes(id)) {
      this.#toggleMap[id] = false;
    }

    if (!this.#toggleMap[id]) {
      elem.classList.remove(...this.#outState);
      elem.classList.add(...this.#inState);
    } else {
      elem.classList.remove(...this.#inState);
      elem.classList.add(...this.#outState);
    }
    this.#toggleMap[id] = !this.#toggleMap[id];
  }
}

document.addEventListener('DOMContentLoaded', () => new PopoutMenu());

//export default class PopoutMenu {
//  #outState = ['ease-out', 'duration-100', 'opacity-0', 'scale-95'];
//  #inState = ['ease-in', 'duration-75', 'opacity-100', 'scale-100'];
//
//  #mouseOverMedButton = false;
//  #mouseOverMedMenu = false;
//  #medMenuVisible = false;
//  #medMenuClicked = false;
//
//  #menuElem;
//  #menuId;
//  constructor(menuId) {
//    this.#menuId = menuId;
//    this.#menuElem = document.getElementById(`${this.#menuId}-menu`);
//
//    document.getElementById(`${this.#menuId}-button`).addEventListener('mouseout', event => {
//        this.#mouseOverMedButton = false;
//        if (!this.#medMenuClicked) {
//          this.#toggleMedMenu();
//        }
//      });
//
//      document.getElementById(`${this.#menuId}-menu`).addEventListener('mouseout', event => {
//        this.#mouseOverMedMenu = false;
//        if (!this.#medMenuClicked) {
//          this.#toggleMedMenu();
//        }
//      });
//
//      document.getElementById(`${this.#menuId}-button`).addEventListener('mouseover', event => {
//        this.#mouseOverMedButton = true;
//        if (!this.#medMenuClicked) {
//          this.#toggleMedMenu();
//        }
//      });
//
//      document.getElementById(`${this.#menuId}-menu`).addEventListener('mouseover', event => {
//        this.#mouseOverMedMenu = true;
//        if (!this.#medMenuClicked) {
//          this.#toggleMedMenu();
//        }
//      });
//
//      document.getElementById(`${this.#menuId}-button`).addEventListener('click', event => {
//        // handle mobile clicked
//        this.#medMenuClicked = !this.#medMenuClicked;
//        this.#toggleMedMenu();
//      });
//  }
//
//  #toggleMedMenu() {
//    if (this.#medMenuClicked) {
//      if (!this.#medMenuVisible) {
//        this.#medMenuVisible = true;
//        this.#menuElem.classList.remove(...this.#outState);
//        this.#menuElem.classList.add(...this.#inState);
//      }
//    }
//    if ((this.#mouseOverMedButton || this.#mouseOverMedMenu) && !this.#medMenuVisible) {
//      this.#medMenuVisible = true;
//      this.#menuElem.classList.remove(...this.#outState);
//      this.#menuElem.classList.add(...this.#inState);
//    } else if (!this.#medMenuClicked) {
//      setTimeout(() => {
//        if (!this.#mouseOverMedMenu && !this.#mouseOverMedMenu) {
//          this.#medMenuVisible = false;
//          this.#menuElem.classList.remove(...this.#inState);
//          this.#menuElem.classList.add(...this.#outState);
//        }
//      }, 500);
//    }
//  }
//}
