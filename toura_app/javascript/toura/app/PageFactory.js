dojo.provide('toura.app.PageFactory');

dojo.require('toura.app.Config');

dojo.require('toura.Page');
dojo.require('toura.pageControllers.favorites.Favorites');

dojo.declare('toura.app.PageFactory', null, {
  constructor : function(device) {
    this.device = device;
  },

  pages : {
  },

  createPage : function(obj) {
    /*
     * createPage receives an object that it will use to create a page. It
     * looks at the object for a pageController property, and uses that
     * pageController property to determine how to set up the page controller
     * for the page. The process for determining this is a bit convoluted for
     * the time being, in order to support some legacy systems. Here's how it
     * works:
     *
     * First, we determine the name of the controller we're going to use:
     *
     *    1. If the object does not have a pageController property, then the
     *    controllerName is set to 'default'
     *
     *    2. If the object has a pageController property and the property's
     *    value is an object, then it is assumed the object has a 'phone' and
     *    a 'tablet' property; the controllerName is set to the value that
     *    corresponds with the device type.
     *
     * Next, we check the PageFactory's 'pages' object to determine whether the
     * specified controllerName should receive special handling.
     *
     *    1. If there is an entry in the pages object that corresponds with the
     *    controllerName, we expect that entry to point to a function. We call
     *    that function, passing it the object that was passed to createPage,
     *    and return its result. In this case, the createPage method is
     *    complete.
     *
     *    2. If there is not an entry in the pages object that corresponds with
     *    the controllerName, the createPage method uses toura.Page.
     *
     * Once we have determined the proper page controller to use, we create an
     * instance of that controller, passing it the data it will need in order
     * to create the page. We return the controller instance, and createPage is
     * complete.
     */

    if (!obj) { throw new Error('toura.app.PageFactory::createPage requires an object'); }

    var controllerName = obj.pageController || 'default',
        config;

    // allow setting different page controllers per device
    if (obj.pageController && dojo.isObject(obj.pageController)) {
      controllerName = obj.pageController[this.device.type] || 'default';
    } else {
      controllerName = obj.pageController || 'default';
    }

    // handle special cases like search, favorites, feed item, debug
    // TODO: this can go away once those pages are converted to configurables
    if (this.pages[controllerName]) {
      return this.pages[controllerName].call(this, obj);
    }

    config = toura.templates && toura.templates[controllerName];

    if (!config) {
      console.error('toura.app.PageFactory: The controller "' + controllerName + '" does not exist. Did you require it in PageFactory?');
      throw('toura.app.PageFactory: The controller "' + controllerName + '" does not exist. Did you require it in PageFactory?');
    }

    toura.log('Creating ' + controllerName);

    return new toura.Page({
      baseObj : obj,
      device : this.device,
      templateConfig : config,
      templateName : controllerName
    });
  }
});

dojo.subscribe('/app/ready', function() {
  toura.app.PageFactory = new toura.app.PageFactory(toura.app.Config.get('device'));
});
