var assert = buster.assertions.assert;
var refute = buster.assertions.refute;

buster.testCase('View#destroy()', {
  setUp: function() {
    helpers.createView.call(this);
  },

  "Should recurse.": function() {

    this.view
      .render()
      .inject(sandbox)
      .setup();

    assert.equals(true, true);
  },

  tearDown: function() {
    helpers.destroyView.call(this);
  }
});