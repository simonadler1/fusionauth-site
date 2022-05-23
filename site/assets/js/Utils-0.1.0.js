/*
 * Copyright (c) 2022, Inversoft Inc., All Rights Reserved
 */

'use strict';

class FusionAuthUtils {
  static findClass(element, prefix, modifier = '', checkDark = true) {
    if (checkDark && document.documentElement.classList.contains('dark')) {
      const clz = Array.from(element.classList.values()).find(clz => clz.startsWith('dark:' + modifier + prefix));
      return clz ? clz.substring(5 + modifier.length) : null;
    }

    const clz = Array.from(element.classList.values()).find(clz => clz.startsWith(modifier + prefix));
    return clz ? clz.substring(modifier.length) : null;
  }
}