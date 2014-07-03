/*global Hogan, fruitmachine, sandbox, buster*/

'use strict';

var assert = buster.assertions.assert;
var refute = buster.assertions.refute;
var Promise = require('es6-promise').Promise;

window.helpers = {};

window.matchMedia = require('./match-media-helper');

window.mediaHelper = require('../coverage/media');

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

var lastState = null;

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

// Define Apple which has the asserts, the other
//  fruit are just decoration and don't really do anything.
window.Apple = window.helpers.Views.Apple = fruitmachine.define({
	name: 'apple',
	template: window.templates.apple,
	helpers: [
		window.mediaHelper
	],
	media: media,
	initialize: function() {},
	setup: function() {},

	states: {
		small: {
			setup: function () {
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						if (lastState) assert.equals(lastState , 'large teardown');
						lastState = 'small setup';
					}, 30);
				});
				return p;
			},

			teardown: function (options) {
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						assert.equals(lastState , 'small setup');
						lastState = 'small teardown';
					}, 30);
				});
				return p;
			}
		},
		large: {
			setup: function () {
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						if (lastState) assert.equals(lastState , 'small teardown');
						lastState = 'large setup';
					}, 30);
				});
				return p;
			},

			teardown: function (options) {
				var p = new Promise(function (resolve) {
					setTimeout(function () {
						assert.equals(lastState , 'large setup');
						lastState = 'large teardown';
					}, 30);
				});
				return p;
			}
		}
	},
	teardown: function() {},
	destroy: function() {
		lastState = null;
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

window.Orange = window.helpers.Views.Orange = fruitmachine.define({
	name: 'orange',
	template: window.templates.orange,

	initialize: function() {},
	setup: function() {},
	teardown: function() {},
	destroy: function() {}
});

window.Pear = window.helpers.Views.Pear = fruitmachine.define({
	name: 'pear',
	template: window.templates.pear,

	initialize: function() {},
	setup: function() {},
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