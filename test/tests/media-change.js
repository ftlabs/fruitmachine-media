/* global helpers, buster, sandbox, Promise, fruitmachine */

'use strict';

var assert = buster.assertions.assert;
var refute = buster.assertions.refute;
var Promise = window.Promise;

/**
 * Due to the limitations of my polyfill not working out whether two
 * media queries overlap the tests should only cover the situation
 * where the two are mutually exclusive and cover the entire phase
 * space of sizes. As we do in the webapp.
 */

buster.testCase('Media Changes', {
	setUp: function() {
		helpers.createView.call(this);

		this.view
			.render()
			.inject(sandbox)
			.setup();

		buster.log('View has been setup');

		buster.log('Current State:', window.matchMedia.controller.currentState());
	},

	"Simple go big then small again slowly.": function(done) {
		var states = window.matchMedia.controller.listStates();

		// Change back and forth quickly.
		window.matchMedia.controller.setState(states[0]);
		setTimeout(function () {
			window.matchMedia.controller.setState(states[1]);
			setTimeout(function () {
				done();
			}, 150);
		}, 50);
	},

	"Simple go big then small again quickly.": function(done) {
		var states = window.matchMedia.controller.listStates();

		// Change back and forth quickly.
		window.matchMedia.controller.setState(states[0]);
		setTimeout(function () {
			window.matchMedia.controller.setState(states[1]);
			setTimeout(function () {
				done();
			}, 200);
		}, 10);
	},

	tearDown: function() {
		helpers.destroyView.call(this);
	}

});