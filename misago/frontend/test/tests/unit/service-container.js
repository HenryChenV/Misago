(function () {
  'use strict';

  var container = null;
  var orgServices = Misago.prototype._services;

  QUnit.module("Service Container", {
    beforeEach: function() {
      Misago.prototype._services = [];
      container = new Misago();
    },
    afterEach: function() {
      Misago.prototype._services = orgServices;
    }
  });

  QUnit.test("addService", function(assert) {
    assert.expect(2);

    var MockServiceFactory = function() {
      return null;
    };

    Misago.prototype.addService('test', MockServiceFactory);

    assert.equal(Misago.prototype._services.length, 1,
      "addService() registered single service in container");
    assert.equal(Misago.prototype._services[0].item, MockServiceFactory,
      "addService() registered MockServiceFactory service in container");
  });

  QUnit.test("_initServices", function(assert) {
    assert.expect(1);

    var MockServiceFactory = function(_) {
      assert.ok(
        _, 'MockServiceFactory was called with container as argument.');
    };

    container._initServices([{key: 'test', item: MockServiceFactory}]);
  });

  QUnit.test("factories return values handling", function(assert) {
    assert.expect(1);

    var MockServiceFactory = function() {
      return 'ok!';
    };

    container._initServices([{key: 'test', item: MockServiceFactory}]);
    assert.equal(container.test, 'ok!',
      "MockServiceFactory return value was set on container.");
  });

  QUnit.test("factories returning nothing", function(assert) {
    assert.expect(1);

    var MockServiceFactory = function() {
      'not returning anything';
    };

    container._initServices([{key: 'test', item: MockServiceFactory}]);
    assert.equal(container.test, undefined,
      "MockServiceFactory return value wasn't set on container.");
  });

  QUnit.test("_destroyServices", function(assert) {
    assert.expect(2);

    var MockService = {
      factory: function(_) {
        assert.ok(
          _, "MockService's factory was called with container as argument.");
      },

      destroy: function(_) {
        assert.ok(
          _, "MockService's destroy was called with container as argument.");
      }
    };

    var services = [{key: 'test', item: MockService}];

    container._initServices(services);
    container._destroyServices(services);
  });

  QUnit.test("initialize and destroy order", function(assert) {
    assert.expect(2);

    var initializationOrder = [];
    var destructionOrder = [];

    var services = [
      {
        key: 'test_1',
        item: {
          factory: function() {
            initializationOrder.push(1);
          },

          destroy: function() {
            destructionOrder.push(1);
          }
        }
      },
      {
        key: 'test_2',
        item: {
          factory: function() {
            initializationOrder.push(2);
          },

          destroy: function() {
            destructionOrder.push(2);
          }
        }
      }
    ];

    container._initServices(services);
    container._destroyServices(services);

    assert.deepEqual(initializationOrder, [1, 2],
      'services were initialized in right order.');
    assert.deepEqual(destructionOrder, [2, 1],
      'services were destroyed in right order.');
  });

  QUnit.test("initialization data storage", function(assert) {
    assert.expect();

    container.init({api: 'test-api/'});

    assert.equal(container.setup.api, 'test-api/',
      'container stored initialization data');
  });
}());
