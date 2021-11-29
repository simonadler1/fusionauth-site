'use strict';

var FusionAuth = FusionAuth || {};

FusionAuth.MainNav = function() {
  Prime.Utils.bindAll(this);
  this.nav = Prime.Document.queryById('main-nav');
  this.ul = this.nav.queryFirst('ul');
  this.button = Prime.Document.queryById('main-nav-mobile-button').addEventListener('click', this._handleMobileButtonClick);
  this.logo = Prime.Document.queryById('main-nav-logo');
  this.logoSrc = this.logo.getAttribute('src');
  this.open = false;
};

FusionAuth.MainNav.constructor = FusionAuth.MainNav;
FusionAuth.MainNav.prototype = {
  _handleMobileButtonClick: function(event) {
    Prime.Utils.stopEvent(event);

    if (this.open) {
      this.nav.removeClass('bg-white');
      this.logo.setAttribute('src', this.logoSrc);
      this.button.queryFirst('i').removeClass('fa-times').removeClass('text-gray-900').addClass('fa-bars');
      this.ul.addClass('hidden').removeClass('bg-white');
    } else {
      this.nav.addClass('bg-white');
      this.logo.setAttribute('src', '/assets/img/logo-gray.svg');
      this.button.queryFirst('i').removeClass('fa-bars').addClass('fa-times').addClass('text-gray-900');
      this.ul.addClass('bg-white').removeClass('hidden');
    }

    this.open = !this.open;
  }
}

Prime.Document.onReady(function() {
  new FusionAuth.MainNav();
});
