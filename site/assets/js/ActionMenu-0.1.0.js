/*
 * Copyright (c) 2022, Inversoft Inc., All Rights Reserved
 */
'use strict';

class FusionAuthActionMenu {
  constructor() {
    document.addEventListener('click', this._handleClick.bind(this));
    document.addEventListener('keydown', this._handleKeyDown.bind(this));
    document.addEventListener('mousemove', this._handleMouseMove.bind(this));
  }

  closeAllMenus(ignore) {
    document.querySelectorAll('div[data-widget="action-menu"] ul:not(.hidden)')
            .forEach(e => {
              if (e !== ignore) {
                e.classList.add('hidden');
                e.closest('[data-widget="action-menu"]')
                 .querySelector('button i')
                 .classList.replace('-rotate-180', 'rotate-0');
              }
            });
  }

  _clearMenuItemBackgrounds(menuItems) {
    menuItems.querySelectorAll('li')
             .forEach(e => {
               e.classList.replace('bg-gray-100', 'bg-white');
               e.classList.replace('border-gray-400', 'border-transparent');
             });
  }

  _determineBackground(li) {
    const hoverBg = Array.from(li.classList.values()).find(clz => clz.startsWith('hover:bg'));
    return hoverBg ? hoverBg.substring(6) : null;
  }

  _elements(element) {
    const actionMenu = element.closest('[data-widget="action-menu"]');
    if (actionMenu === null) {
      return null;
    }

    return {
      actionMenu: actionMenu,
      button: actionMenu.querySelector('button'),
      icon: actionMenu.querySelector('button i'),
      menuItems: actionMenu.querySelector('ul')
    };
  }

  _handleClick(event) {
    var elements = this._elements(event.target);
    if (elements === null) {
      this.closeAllMenus();
    } else {
      this.closeAllMenus(elements.menuItems);

      const button = event.target.closest('button');
      const buttonClick = button !== null;
      if (buttonClick) {
        if (button.disabled) {
          return;
        }

        if (elements.menuItems.classList.contains('hidden')) {
          elements.icon.classList.replace('rotate-0', '-rotate-180');
        } else {
          elements.icon.classList.replace('-rotate-180', 'rotate-0');
        }
        elements.menuItems.classList.toggle('hidden');
      }
    }
  }

  _handleKeyDown(event) {
    if (event.key === 'Escape') {
      this.closeAllMenus();
      return;
    }

    var elements = this._elements(event.target);
    if (elements === null) {
      return;
    }

    if (event.key === 'Tab') {
      this.closeAllMenus();
    } else if (event.key === 'ArrowDown') {
      event.stopPropagation();
      event.preventDefault();
      if (elements.menuItems.classList.contains('hidden')) {
        elements.menuItems.classList.toggle('hidden');
      } else {
        this._highlightSiblingMenuItem(elements, true);
      }
    } else if (event.key === 'ArrowUp') {
      event.stopPropagation();
      event.preventDefault();
      if (elements.menuItems.classList.contains('hidden')) {
        elements.menuItems.classList.toggle('hidden');
      } else {
        this._highlightSiblingMenuItem(elements, false);
      }
    } else if (event.key === 'Enter') {
      event.stopPropagation();
      event.preventDefault();
      if (elements.menuItems.classList.contains('hidden')) {
        elements.menuItems.classList.toggle('hidden');
      } else {
        const selected = this._locateSelected(elements);
        if (selected !== null) {
          var clickable = selected.querySelector('a');
          if (clickable !== null) {
            clickable.click();
            return;
          }

          clickable = selected.querySelector('form');
          if (clickable !== null) {
            clickable.submit();
          }
        }
      }
    }
  }

  _handleMouseMove(event) {
    const elements = this._elements(event.target);
    if (elements === null) {
      return;
    }

    this._clearMenuItemBackgrounds(elements.menuItems);
  }

  _highlightSiblingMenuItem(elements, next) {
    var selected = this._locateSelected(elements);
    this._unselectMenuItems(elements);
    if (selected) {
      selected = next ? selected.nextElementSibling : selected.previousElementSibling;
    }

    if (!selected) {
      selected = next ? elements.menuItems.firstElementChild : elements.menuItems.lastElementChild;
    }

    selected.classList.add(this._determineBackground(selected));
  }

  _locateSelected(elements) {
    const selected = Array.from(elements.menuItems.querySelectorAll('li'))
                          .find(li => {
                            const bg = this._determineBackground(li);
                            return li.classList.contains(bg);
                          });
    return selected ? selected : null; // Fix undefined
  }

  _unselectMenuItems(elements) {
    elements.menuItems.querySelectorAll('li').forEach(li => {
      const bg = this._determineBackground(li);
      li.classList.remove(bg);
    })
  }
}

document.addEventListener('DOMContentLoaded', () => new FusionAuthActionMenu());