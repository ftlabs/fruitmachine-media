/* global helpers, buster, sandbox, Promise */

'use strict';

var assert = buster.assertions.assert;
var refute = buster.assertions.refute;
var Promise = window.Promise;

buster.testCase('View#destroy()', {
	setUp: function() {
		helpers.createView.call(this);
	},

	"Should recurse.": function(done) {

		this.view
			.render()
			.inject(sandbox)
			.setup();

		assert.equals(true, true);

		var promise = new Promise(function (resolve, reject) {
			setTimeout(function () {
				resolve();
			}, 200);
		});

		// Returning a promise.all does not work.
		Promise.all([promise]).then(function () {
			done();
		});

		buster.log(window.matchMedia.controller.listStates());

		window.matchMedia.controller.setState(window.matchMedia.controller.listStates()[0]);
	},

	tearDown: function() {
		helpers.destroyView.call(this);
	}

});