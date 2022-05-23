/*
 * Copyright (c) 2022, Inversoft Inc., All Rights Reserved
 */
'use strict';

class FusionAuthSubMenu {
  constructor() {
    document.addEventListener('click', this._handleClick.bind(this));
  }

  _handleClick(event) {
    const subMenuButton = event.target.closest('[data-widget="sub-menu-button"]');
    if (subMenuButton !== null) {
      event.stopPropagation();
      event.preventDefault();

      const subMenu = subMenuButton.closest('[data-widget="sub-menu"]')
      const caret = subMenu.querySelector('i.fa-caret-right');
      caret.classList.toggle('rotate-90');
      const nav = subMenu.querySelector('ul');
      nav.classList.toggle('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new FusionAuthSubMenu());