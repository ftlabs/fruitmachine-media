/*global Hogan, fruitmachine, sandbox, buster*/

'use strict';

var assert = buster.assertions.assert;
var refute = buster.assertions.refute;

require('es6-promise').polyfill();
require('setimmediate');
if ('function' !== typeof setImmediate) { // PhantomJS has issues with setImmediate polyfill
	setImmediate = setTimeout
	clearImmediate = clearTimeout
}

buster.testRunner.timeout = 1000;

window.helpers = {};

window.matchMedia = require('./match-media-helper');

window.mediaHelper = require('../coverage/media');

var noOfAssertions = 0;
var assertionCallbacks = [];
function assertionHappened() {
	noOfAssertions++;
	assertionCallbacks.forEach(function (fn) {
		fn(noOfAssertions);
	});
}

window.helpers.registerAssertionCallback = function (fn) {
	assertionCallbacks.push(fn);
};

/**
 * Templates
 */
window.templates = window.helpers.templates = {
	'apple': Hogan.compile('{{{1}}}'),
	'layout': Hogan.compile('{{{1}}}{{{2}}}{{{3}}}'),
	'list': Hogan.compile('{{#children}}{{{child}}}{{/children}}'),
	'orange': Hogan.compile('{{text}}'),
	'pear': Hogan.compile('{{text}}')
};
/**
 * Fake Breakpoints
 */
var boundaryWidth = 720;
var boundaryHeight = 620;
var breakpoints = {
   'query-small': '(max-width:' + (boundaryWidth-1) + 'px), (max-height:' + (boundaryHeight-1) + 'px)',
   'query-large': '(min-width:' + boundaryWidth + 'px) and (min-height:' + boundaryHeight + 'px)',
   'query-large-portrait': '(min-width:' + boundaryWidth + 'px) and (min-height:' + boundaryHeight + 'px) and (orientation:portrait)',
   'query-large-landscape': '(min-width:' + boundaryWidth + 'px) and (min-height:' + boundaryHeight + 'px) and (orientation:landscape)'
};

var media = {};
media[breakpoints['query-small']] = 'small';
media[breakpoints['query-large']] = 'large';

/**
 * Module Definitions
 */

window.helpers.Views = {};

window.Layout = window.helpers.Views.Layout = fruitmachine.define({
	name: 'layout',
	template: window.templates.layout,

	initialize: function() {},
	setup: function() {},
	teardown: function() {},
	destroy: function() {}
});

// Fruit with media state change functions.
window.Apple = window.helpers.Views.Apple = fruitmachine.define({
	name: 'apple',
	template: window.templates.apple,
	helpers: [
		window.mediaHelper
	],
	media: media,
	initialize: function() {
		this.on('media-helper-error', function (e) {
			assert.equals('This is an error!!' , e.message);
		});
	},
	setup: function() {},

	states: {
		small: {
			setup: function () {
				var p = new Promise(function () {

					// this is just thrown
					// errors thrown asynchronously get caught by the window
					throw Error('This is an error!!');
				});
				return p;
			},

			teardown: function () {}
		},
		large: {
			setup: function () {},
			teardown: function () {}
		}
	},
	teardown: function() {},
	destroy: function() {
		this.lastState = null;
	}
});

window.List = window.helpers.Views.List = fruitmachine.define({
	name: 'list',
	template: window.templates.list,

	initialize: function() {},
	setup: function() {},
	teardown: function() {},
	destroy: function() {}
});

// Fruit with media state change functions.
window.Orange = window.helpers.Views.Orange = fruitmachine.define({
	name: 'orange',
	template: window.templates.orange,
	helpers: [
		window.mediaHelper
	],
	media: media,
	initialize: function() {},
	setup: function() {},

	states: {
		small: {
			setup: function () {
				var self = this;
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						if (self.lastState) {
							assert.equals(self.lastState , 'large teardown');
							assertionHappened();
						}
						self.lastState = 'small setup';
						resolve();
					}, 30);
				});
				return p;
			},

			teardown: function (options) {
				var self = this;
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						assert.equals(self.lastState , 'small setup');
						assertionHappened();
						self.lastState = 'small teardown';
						resolve();
					}, 30);
				});
				return p;
			}
		},
		large: {
			setup: function () {
				var self = this;
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						if (self.lastState) {
							assert.equals(self.lastState , 'small teardown');
							assertionHappened();
						}
						self.lastState = 'large setup';
						resolve();
					}, 30);
				});
				return p;
			},

			teardown: function (options) {
				var self = this;
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						assert.equals(self.lastState , 'large setup');
						assertionHappened();
						self.lastState = 'large teardown';
						resolve();
					}, 30);
				});
				return p;
			}
		}
	},
	teardown: function() {},
	destroy: function() {
		this.lastState = null;
	}
});

window.Pear = window.helpers.Views.Pear = fruitmachine.define({
	name: 'pear',
	template: window.templates.pear,
	helpers: [
		window.mediaHelper
	],
	media: media,
	initialize: function() {},
	setup: function() {},

	states: {
		small: {
			setup: function () {
				var self = this;
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						if (self.lastState) {
							assert.equals(self.lastState , 'large teardown');
							assertionHappened();
						}
						self.lastState = 'small setup';
						resolve();
					}, 30);
				});
				return p;
			},

			teardown: function () {
				var self = this;
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						assert.equals(self.lastState , 'small setup');
						assertionHappened();
						self.lastState = 'small teardown';
						resolve();
					}, 30);
				});
				return p;
			}
		},
		large: {
			setup: function () {
				var self = this;
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						if (self.lastState) {
							assert.equals(self.lastState , 'small teardown');
							assertionHappened();
						}
						self.lastState = 'large setup';
						resolve();
					}, 30);
				});
				return p;
			},

			teardown: function (options) {
				var self = this;
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						assert.equals(self.lastState , 'large setup');
						assertionHappened();
						self.lastState = 'large teardown';
						resolve();
					}, 30);
				});
				return p;
			}
		}
	},
	teardown: function() {},
	destroy: function() {}
});

/**
 * Create View
 */

window.helpers.createView = function() {
	var layout = new window.Layout();
	var apple = new window.Apple({ slot: 1 });
	var orange = new window.Orange({ slot: 2 });
	var pear = new window.Pear({ slot: 3 });

	layout
		.add(apple)
		.add(orange)
		.add(pear);

	return (this.view = layout);
};

/**
 * Destroy View
 */

window.helpers.destroyView = function() {
	this.view.destroy();
	this.view = null;
};

/**
 * Sandbox
 */

window.helpers.createSandbox = function() {
	var el = document.createElement('div');
	return document.body.appendChild(el);
};

window.helpers.emptySandbox = function() {
	sandbox.innerHTML = '';
};

window.sandbox = window.helpers.createSandbox();
