(function () {
  'use strict';

  window.resetTestPromise = function() {
    if (window._deferred) {
      window._deferred.reject();
    }

    var deferred = m.deferred();

    window._deferred = deferred;
    window._promise = deferred.promise;
    window.setTimeout(function() {
      deferred.resolve();
    }, 50);
  };
  resetTestPromise();

  var queueAction = function(action) {
    window._promise.then(function() {
      window._promise = action();
    });
  };

  var getElement = function(selector) {
    var deferred = m.deferred();

    var _getElement = function() {
      window.setTimeout(function() {
        var $element = $('#qunit-fixture ' + selector);
        if ($element.length >= 1) {
          deferred.resolve($element);
        } else {
          _getElement();
        }
      }, 50);
    };

    _getElement();

    return deferred.promise;
  };

  window.click = function(selector) {
    queueAction(function() {
      var deferred = m.deferred();
      getElement(selector).then(function(element) {
        window.setTimeout(function() {
          element.trigger('click');
          window.setTimeout(function() {
            deferred.resolve();
          }, 50);
        }, 50);
      });
      return deferred.promise;
    });
  };

  window.fillIn = function(selector, value) {
    queueAction(function() {
      var deferred = m.deferred();
      getElement(selector).then(function(element) {
        window.setTimeout(function() {
          element.trigger('click');
          element.focus();
          element.trigger('keyDown');
          element.val(value || '');
          element.trigger('keyUp');
          element.trigger('input');
          element.trigger('change');
          window.setTimeout(function() {
            deferred.resolve();
          }, 50);
        }, 50);
      });
      return deferred.promise;
    });
  };

  window.then = function(callback, timeout) {
    queueAction(function() {
      var deferred = m.deferred();
      window.setTimeout(function() {
        callback();
        deferred.resolve();
      }, timeout || 80);
      return deferred.promise;
    });
  };

  window.waitForElement = function(selector) {
    queueAction(function() {
      var deferred = m.deferred();
      getElement(selector).then(function() {
        window.setTimeout(function() {
          deferred.resolve();
        }, 50);
      });
      return deferred.promise;
    });
  };

  window.waitForElementRemoval = function(selector) {
    queueAction(function() {
      var deferred = m.deferred();
      var _testElement = function() {
        window.setTimeout(function() {
          if (!$(selector).length) {
            deferred.resolve();
          } else {
            _testElement();
          }
        }, 50);
      };
      _testElement();
      return deferred.promise;
    });
  };

  window.onElement = function(selector, callback) {
    queueAction(function() {
      var deferred = m.deferred();
      getElement(selector).then(function(element) {
        window.setTimeout(function() {
          callback(element);
          deferred.resolve();
        }, 50);
      });
      return deferred.promise;
    });
  };
}());
