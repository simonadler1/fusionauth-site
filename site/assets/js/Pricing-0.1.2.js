---
---
/*
 * Copyright (c) 2020, Inversoft Inc., All Rights Reserved
 */
"use strict";

var FusionAuth = FusionAuth || {};
FusionAuth.Account = FusionAuth.Account || {};
FusionAuth.siteURL = '{% if jekyll.environment == "development" %}https://site-local.fusionauth.io{% else %}https://fusionauth.io{% endif %}';
FusionAuth.accountURL = '{% if jekyll.environment == "development" %}https://account-local.fusionauth.io{% else %}https://account.fusionauth.io{% endif %}';

FusionAuth.Account.PriceCalculator = function() {
  Prime.Utils.bindAll(this);

  // Find the slider and bail early because this isn't the pricing page
  this.monthlyActiveUserSlider = Prime.Document.queryFirst('#monthly-active-users input[type=range]');
  if (this.monthlyActiveUserSlider === null) {
    return;
  }

  this.monthlyActiveUserSliderMin = this.monthlyActiveUserSlider.getAttribute('min');
  this.monthlyActiveUserSliderMax = this.monthlyActiveUserSlider.getAttribute('max');
  this.monthlyActiveUserSlider.addEventListener('input', this._handleSliderChange)
      .addEventListener('mouseup', this._handleSliderChange);
  this.monthlyActiveUserSliderLabel = Prime.Document.queryById('monthly-active-users-value');

  // Fetch the pricing model
  this.priceModel = null;
  new Prime.Ajax.Request(FusionAuth.accountURL + '/ajax/edition/price-model', 'GET')
      .withSuccessHandler(this._handlePriceModelResponse)
      .withErrorHandler(this._handlePriceModelResponse)
      .go();

  // Save off the original href's and text for the pricing buttons
  Prime.Document.query('.main-pricing-section a.pricing').each(function(e) {
    e.setAttribute('href-orig', e.getAttribute('href'));
    e.setAttribute('html-orig', e.getHTML());
  });
};

FusionAuth.Account.PriceCalculator.constructor = FusionAuth.Account.PriceCalculator;
FusionAuth.Account.hostingTypes = ['self-hosted', 'basic-cloud', 'business-cloud', 'ha-cloud'];
FusionAuth.Account.editions = ['Community', 'Starter', 'Essentials', 'Enterprise'];

FusionAuth.Account.PriceCalculator.prototype = {
  _calculateHostingPrice: function(type) {
    var price = 0;

    if (type === 'basic-cloud') {
      price = this.priceModel.ec2['medium'];
    } else if (type === 'business-cloud') {
      price = this.priceModel.ec2['medium'] + this.priceModel.rds['medium'];
    } else if (type === 'ha-cloud') {
      price = (2 * this.priceModel.ec2['medium']) + this.priceModel.elb.base + this.priceModel.rds['medium'];
    }

    return price;
  },

  _calculateEditionPrice: function(plan) {
    if (plan === 'Community') {
      return 0;
    }

    var editionPrice = 0;
    var mau = this.monthlyActiveUserSlider.getValue();
    var planTiers = Object.values(this.priceModel.edition.tierPricing[plan]);

    planTiers.forEach(function(tier) {
      var adjustment = tier.minimumUserCount === 0 ? 0 : 1;
      if (mau > tier.minimumUserCount) {
        // MAU is past this tier so add ppu times total users in tier
        if (mau > tier.maximumUserCount && tier.maximumUserCount !== -1) {
          editionPrice += tier.pricePerUnit * (tier.maximumUserCount - tier.minimumUserCount + adjustment);
        }
        // MAU is inside this tier so add ppu for users in this tier
        if (mau <= tier.maximumUserCount || tier.maximumUserCount === -1) {
          editionPrice += tier.pricePerUnit * (mau - tier.minimumUserCount + 1);
        }
      }
    });

    return editionPrice / this.priceModel.edition.usersPerUnit;
  },

  _handlePriceModelResponse: function(xhr) {
    if (xhr.status === 200) {
      this.priceModel = JSON.parse(xhr.responseText);
    } else {
      console.log('AJAX request for prices failed!');
    }

    this._handleSliderChange();
  },

  _handleSliderChange: function() {
    var mau = this.monthlyActiveUserSlider.getValue();
    var mauText = new Intl.NumberFormat('en').format(mau);
    this.monthlyActiveUserSliderLabel.setTextContent(mauText);

    var width = this.monthlyActiveUserSlider.getWidth();
    var ratio = (mau - this.monthlyActiveUserSliderMin) / (this.monthlyActiveUserSliderMax - this.monthlyActiveUserSliderMin);
    var left = (ratio * (width - 30)) - 49;
    this.monthlyActiveUserSliderLabel.setLeft(left);
    this._updatePrices();
    this._updateButtons();
  },

  _updateButtons: function() {
    var mau = this.monthlyActiveUserSlider.getValue();
    if (parseInt(mau) === 1000000) {
      Prime.Document.query('.main-pricing-section a.pricing').each(function(e) {
        e.setAttribute('href', '/contact');
        e.setHTML('Contact sales');
      });
    } else {
      Prime.Document.query('.main-pricing-section a.pricing').each(function(e) {
        e.setAttribute('href', e.getAttribute('href-orig'));
        e.setHTML(e.getAttribute('html-orig'));
      });
    }
  },

  _updatePrices: function() {
    for (var hIndex in FusionAuth.Account.hostingTypes) {
      for (var eIndex in FusionAuth.Account.editions) {
        var hostingType = FusionAuth.Account.hostingTypes[hIndex];
        var edition = FusionAuth.Account.editions[eIndex];
        var hostingPrice = this._calculateHostingPrice(hostingType);
        var editionPrice = this._calculateEditionPrice(edition);
        var price = hostingPrice + editionPrice;
        price = Math.floor(price / 5) * 5;
        var text = price === 0 ? 'FREE' : new Intl.NumberFormat('en').format(price);

        var name = hostingType + "-" + edition.toLowerCase();
        var amount = Prime.Document.queryById(name);
        if (amount !== null) {
          amount.setHTML(text);
        }
      }
    }
  }
}

Prime.Document.onReady(function() {
  new FusionAuth.Account.PriceCalculator();
});