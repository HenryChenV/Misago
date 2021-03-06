(function (Misago) {
  'use strict';

  function persistent(el, isInit, context) {
    context.retain = true;
  }

  var alert = {
    classes: {
      'info': 'alert-info',
      'success': 'alert-success',
      'warning': 'alert-warning',
      'error': 'alert-danger'
    },
    view: function(ctrl, _) {
      var config = {
        config: persistent,
        class: _.alert.isVisible ? 'in' : 'out'
      };

      return m('.alerts', config,
        m('p.alert', {class: this.classes[_.alert.type]},
          _.alert.message
        )
      );
    }
  };

  Misago.addService('component:alert', function(_) {
    _.component('alert', alert);
  },
  {
    after: 'components'
  });
}(Misago.prototype));
