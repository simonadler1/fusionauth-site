'use strict';

//noinspection JSUnusedAssignment
var FusionAuth = FusionAuth || {};

FusionAuth.FixedHeader = function() {
  Prime.Utils.bindAll(this);
  this.header = Prime.Document.queryById('scroll-header');
  Prime.Window.addEventListener('scroll', this._handleOnScroll);
};

FusionAuth.FixedHeader.constructor = FusionAuth.FixedHeader;
FusionAuth.FixedHeader.prototype = {
  hide: function() {
    this.header.removeClass('bg-white').removeClass('shadow');
  },

  show: function() {
    this.header.addClass('bg-white').addClass('shadow');
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
