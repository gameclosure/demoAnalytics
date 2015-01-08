/**
 * Demo for GameClosure DevKit Analytics Modules
 */

import ui.TextView as TextView;
import src.views.LogView as LogView;
import src.views.ToggleView as ToggleView;
import src.views.ButtonView as ButtonView;
import src.views.Overlay as Overlay;
import device;

import amplitude;
import flurry;
import mixpanel;


exports = Class(GC.Application, function () {

  this.initUI = function () {

    this.platformList = [ {name: 'amplitude'} ];
    this.platformList = [
      'amplitude',
      'flurry',
      'mixpanel'
    ];
    this.platforms = {};

    var buttonPadding = 25;

    this.view.style.backgroundColor = 'white';

    this.header = new TextView({
      superview: this.view,
      text: "Analytics Demo",
      color: "black",
      x: 0,
      y: 25,
      width: this.view.style.width,
      height: 100
    });

    // create checkboxes for every platform
    var toggleHeight = 44;
    var toggleWidth = (this.view.style.width - (buttonPadding * 3)) / 2;
    var toggle = void 0;
    for (var i = 0; i < this.platformList.length; i++) {
      // TODO: disable checkboxes for platforms that did not initialize
      var toggle = new ToggleView({
        superview: this.view,
        x: buttonPadding + ((i%2) * (buttonPadding + toggleWidth)),
        y: 200 + (100 * Math.floor(i/2)),
        width: toggleWidth,
        height: toggleHeight,
        text: this.platformList[i],
        onChange: bind(this, function (platform, checked) {
          this.platforms[platform] = checked;
        }, this.platformList[i])
      });
      this.platforms[this.platformList[i]] = toggle.isChecked();
    }

    var buttonWidth = (this.view.style.width - (buttonPadding * 5)) / 3;
    var buttonY = toggle.style.y + 100;

    // set userid  button
    this.useridButton = new ButtonView({
      superview: this.view,
      x: buttonPadding,
      y: buttonY,
      width: buttonWidth,
      height: 50,
      title: "Set User ID",
      onClick: bind(this, this.setUserId)
    });

    // track event button
    this.trackEventButton = new ButtonView({
      superview: this.view,
      x: buttonPadding + buttonPadding + buttonWidth,
      y: buttonY,
      width: buttonWidth,
      height: 50,
      title: "Track Event",
      onClick: bind(this, this.trackEvent)
    });

    // track purchase button
    this.trackPurchaseButton = new ButtonView({
      superview: this.view,
      x: (buttonPadding * 3) + (buttonWidth * 2),
      y: buttonY,
      width: buttonWidth,
      height: 50,
      title: "Track Purchase",
      onClick: bind(this, this.trackPurchase)
    });

    var logViewY = this.trackPurchaseButton.style.y +
      this.trackPurchaseButton.style.height +
      250;
    this.logView = new LogView({
      superview: this.view,
      x: 0,
      y: logViewY,
      width: this.view.style.width,
      height: this.view.style.height - logViewY
    });

  };


  this.setUserId = function () {
    var userId = 'test_user_id';

    var activePlatforms = this.getActivePlatforms();
    this.log("Setting userId for " + activePlatforms.join(', '));

    // amplitude
    this.platforms.amplitude && amplitude.setUserId(userId);

    // flurry
    this.platforms.flurry && flurry.setUserId(userId);

    // mixpanel
    this.platforms.mixpanel && mixpanel.setUserId(userId);
  };

  this.trackEvent = function () {
    var eventName = 'testevent';
    var eventData = {
      'event_data1': 1,
      'event_data2': 'yay'
    };

    var activePlatforms = this.getActivePlatforms();
    this.log("Event sent to " + activePlatforms.join(', '));

    // amplitude
    this.platforms.amplitude && amplitude.trackEvent(eventName, eventData);

    // flurry
    this.platforms.flurry && flurry.trackEvent(eventName, eventData);

    // mixpanel
    this.platforms.mixpanel && mixpanel.trackEvent(eventName, eventData);
  };

  this.trackPurchase = function () {
    var item = 'testpurchase';
    var price = 1.99;
    var quantity = 1;

    var activePlatforms = this.getActivePlatforms();
    this.log("Purchase sent to " + activePlatforms.join(', '));

    // amplitude
    this.platforms.amplitude && amplitude.trackRevenue(item, price, quantity);

    // event payload for analytics with no special purchase tracking
    var eventPayload = {
      item: item,
      price: price,
      quantity: 1
    };

    // flurry
    this.platforms.flurry && flurry.trackEvent('purchase', eventPayload);

    // mixpanel
    this.platforms.mixpanel && mixpanel.trackEvent('purchase', eventPayload);
  };

  this.getActivePlatforms = function () {
    var activePlatforms = [];
    for (var i = 0; i < this.platformList.length; i++) {
      if (this.platforms[this.platformList[i]]) {
        activePlatforms.push(this.platformList[i]);
      }
    };
    return activePlatforms;
  };

  this.log = function (text) {
    logger.log(text);
    this.logView.log(text);
  };

});
