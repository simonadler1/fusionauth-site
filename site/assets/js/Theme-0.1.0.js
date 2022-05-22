/*
 * Copyright (c) 2022, Inversoft Inc., All Rights Reserved
 */
'use strict';

class FusionAuthTheme {
  constructor() {
    if (localStorage.getItem('theme') === null) {
      localStorage.setItem('theme', 'system');
    }

    document.querySelectorAll('#theme-control a').forEach(a => a.addEventListener('click', this._handleClick.bind(this)));
    this._update();
  }

  _handleClick(event) {
    event.stopPropagation();
    event.preventDefault();

    const href = event.currentTarget.getAttribute('href');
    if (href === '#dark') {
      localStorage.setItem('theme', 'dark');
    } else if (href === '#light') {
      localStorage.setItem('theme', 'light');
    } else {
      localStorage.setItem('theme', 'system');
    }

    event.target.closest('ul').classList.add('hidden');
    this._update();
  }

  _update() {
    var theme = localStorage.getItem('theme');
    var dark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    document.querySelectorAll(`#theme-control ul a`).forEach(a => {
      a.classList.remove('text-indigo-300');
      a.classList.remove('text-indigo-500');
    });

    document.querySelectorAll(`#theme-control ul a i`).forEach(i => {
      i.classList.remove('text-indigo-300');
      i.classList.remove('text-indigo-500');
      i.classList.add('text-gray-400');
    });

    const color = dark ? 'text-indigo-300' : 'text-indigo-500';
    const a = document.querySelector(`#theme-control [href="#${theme}"]`);
    if (a !== null) {
      a.classList.add(color);

      const i = a.querySelector('i');
      i.classList.remove('text-gray-400');
      i.classList.add(color);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => new FusionAuthTheme());