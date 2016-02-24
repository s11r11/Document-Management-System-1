(function() {
  'use strict';

  var mdDialog,
    mdToast,
    Utils;

  describe('Utils tests', function() {

    beforeEach(function() {
      module('docKip');
    });

    beforeEach(inject(function($injector) {
      Utils = $injector.get('Utils');
      mdDialog = $injector.get('$mdDialog');
      mdToast = $injector.get('$mdToast');
       }));

    it('should assert that Utils.toast is both defined and a function', function() {
      expect(Utils.toast).toBeDefined();
      expect(typeof Utils.toast).toBe('function');
    });


    it('should assert that mdToast is both defined and a function', function() {
      expect(mdToast.show).toBeDefined();
      expect(typeof mdToast.show).toBe('function');
    });

    it('should assert that mdToast is called', function() {
      spyOn(mdToast, 'show');
      Utils.toast('checkpoint04');
      expect(mdToast.show).toHaveBeenCalled();
    });

    it('should assert that dialog is both defined and a function', function() {
      expect(Utils.dialog).toBeDefined();
      expect(typeof Utils.dialog).toBe('function');
    });

    it('should assert that mdDialog is both defined and a function', function() {
      expect(mdDialog.show).toBeDefined();
      expect(typeof mdDialog.show).toBe('function');
      mdDialog.show = sinon.stub().returns(mdDialog);
      mdDialog.then = sinon.stub();
      var cb = sinon.spy();

      Utils.dialog('Andela', 'Awesome', {
        _event: 'event'
      }, cb);

      expect(mdDialog.show.called).toBe(true);
      expect(typeof mdDialog.show.args[0][0]).toBe('object');
      expect(mdDialog.then.called).toBe(true);
      expect(mdDialog.then.args[0].length).toBe(2);
      mdDialog.then.args[0][0]();
      mdDialog.then.args[0][1]();
      expect(typeof mdDialog.then.args[0][0]).toBe('function');
      expect(typeof mdDialog.then.args[0][1]).toBe('function');
      expect(cb.called).toBe(true);
    });

  });
})();