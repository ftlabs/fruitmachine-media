/* jshint node: true, browser: true */

/**
 * Media Helper rewrite.
 *
 * This is a rewrite of media helper to enforce propogation of events from parent to children.
 * Ensure that teardown of one state is fired before setup of another.
 *
 * Usage: Register what events you would like to subscribe to.
 * These events will also get fired on all the children so if you
 * reregister on a perchild basis they will get fired twice on the
 * item and all of it's children.
 *
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All rights reserved]
 */

'use strict';

/**
 * Locals
 */

var mm = window.matchMedia;
var async = require('async');

/**
 * Exports
 */

module.exports = function(module) {
	var setImmediateId = 0;
	var setupCallbacks = [];
	var teardownCallbacks = [];

	module.on('initialize', function(options) {
		this._media = {};

		var media = this.media;
		var states = expandStates(this.states || {});
		var state;
		var name;

		for (var query in media) {
			if (media.hasOwnProperty(query)) {
				name = media[query];
				state = states[name] || {};
				this._media[name] = {
					query: query,
					setup: state.setup,
					teardown: state.teardown
				};
			}
		}
	});

	module.on('setup', function() {
		var state;
		var matcher;

		for (var name in this._media) {
			if (this._media.hasOwnProperty(name)) {
				state = this._media[name];
				matcher = state.matcher = mm(state.query);
				matcher.addListener(state.cb = callback(name));

				// Call setup on the current media state.
				if (matcher.matches) setup(name, function () {});
			}
		}
	});

	module.on('before teardown', function() {
		var state;
		var matcher;

		for (var name in this._media) {
			if (this._media.hasOwnProperty(name)) {
				state = this._media[name];
				matcher = state.matcher;
				matcher.removeListener(state.cb);
				if (matcher.matches) teardown(name, { fromDOM: false }, function () {});
			}
		}
	});

	function callback(name) {
		return function(data) {

			var state = module._media[name];

			// Either setup or teardown
			if (data.matches) {
				setupCallbacks.push(name);
			} else {
				teardownCallbacks.push(name);
			}

			if (!setImmediateId) {
				setImmediateId = setImmediate(function() {
					setImmediateId = 0;

					// Run teardown callbacks (if any)
					var tearDownCallbacksLength = teardownCallbacks.length;
					async.map(teardownCallbacks, teardown, function (err, results) {
						teardownCallbacks.slice(tearDownCallbacksLength);

						// Fire an event to allow third
						// parties to hook into this change.
						module.fireStatic('statechange');

						// Run Setup callbacks if any.
						var setupCallbacksLength = setupCallbacks.length;
						async.map(setupCallbacks, setup, function (err, results) {
							setupCallbacks.slice(setupCallbacksLength);
							module.fireStatic('statechangecomplete');
						});
					});
				});
			}

			// Update the matches state
			state.matches = data.matches;
		};
	}



	function setup(name, callback) {
		module.el.classList.add(name);
		run('setup', { on: name }, callback);
	}

	function teardown(name, options, callback) {
		var fromDOM = (!options || options.fromDOM !== false);
		if (fromDOM) {
			module.el.classList.remove(name);
		}
		if (typeof options === "function") callback = options;
		run('teardown', { on: name, fromDOM: fromDOM }, callback);
	}

	function run(method, options, callback) {
		var fn = module._media[options.on][method];
		if (fn) fn.call(module, options, callback);
		else callback();
	}
};

// This allows multiple breakpoints to trigger one function.
function expandStates(states) {
	var expanded = {};
	var contents;

	for (var names in states) {
		if (states.hasOwnProperty(names)) {
			contents = states[names];
			if (~names.indexOf(' ')) {
				names.split(' ').forEach(copy);
			} else {
				expanded[names] = contents;
			}
		}
	}

	function copy(name) {
		expanded[name] = contents;
	}

	return expanded;
}