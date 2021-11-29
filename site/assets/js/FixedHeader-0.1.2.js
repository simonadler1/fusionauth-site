'use strict';

//noinspection JSUnusedAssignment
var FusionAuth = FusionAuth || {};

FusionAuth.FixedHeader = function() {
  Prime.Utils.bindAll(this);
  this.header = Prime.Document.queryById('main-nav');
  if (this.header !== null) {
    this.white = this.header.getDataSet().white === 'true';
    this.logo = Prime.Document.queryById('header-logo');
    Prime.Window.addEventListener('scroll', this._handleOnScroll);
  }

  this._handleOnScroll();
};

FusionAuth.FixedHeader.constructor = FusionAuth.FixedHeader;
FusionAuth.FixedHeader.prototype = {
  hide: function() {
    this.header.removeClass('bg-white').removeClass('shadow');
    if (this.white) {
      this.logo.setAttribute('src', '/assets/img/logo-white.svg');
      this.header.removeClass('text-gray-900').addClass('text-white');
    }
  },

  show: function() {
    this.header.addClass('bg-white').addClass('shadow');
    if (this.white) {
      this.logo.setAttribute('src', '/assets/img/logo-gray.svg');
      this.header.removeClass('text-white').addClass('text-gray-900');
    }
  },

  _handleOnScroll: function() {
    if (window.pageYOffset > 50) {
      this.show();
    } else {
      this.hide();
    }
  },
};


Prime.Document.onReady(function() {
  new FusionAuth.FixedHeader();
});
