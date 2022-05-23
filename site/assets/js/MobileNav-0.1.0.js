/*
 * Copyright (c) 2022, Inversoft Inc., All Rights Reserved
 */
'use strict';

class FusionAuthMobileNav {
  constructor() {
    document.querySelectorAll('[data-widget-button="nav"]')
            .forEach(a => a.addEventListener('click', this._handleClick.bind(this)));
  }

  hide(nav) {
    nav.classList.replace('translate-y-0', 'translate-y-[-100vh]');
    document.body.classList.remove('overflow-hidden');
  }

  show(nav) {
    nav.classList.replace('translate-y-[-100vh]', 'translate-y-0');
    document.body.classList.add('overflow-hidden');
  }

  _handleClick(event) {
    event.stopPropagation();
    event.preventDefault();
    const nav = event.currentTarget.closest('[data-widget="nav"]').querySelector('nav');
    if (nav.classList.contains('translate-y-0')) {
      this.hide(nav);
    } else {
      this.show(nav);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new FusionAuthMobileNav());
