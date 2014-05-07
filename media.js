/* jshint node: true, browser: true */

/**
 * Media Helper.
 *
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All rights reserved]
 */

'use strict';

/**
 * Locals
 */

var mm = window.matchMedia;
var Promise = require('es6-promise').Promise;

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
				if (matcher.matches) setup(name);
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
				if (matcher.matches) teardown(name, { fromDOM: false });
			}
		}
	});

	function callback(name) {
		return function(data) {

			var state = module._media[name];

			// NOTE:WP:Don't do anything if the
			// matches state has not changed.
			// This is to work around a strange bug,
			// whereby sometimes the callback fires
			// twice.
			//
			// I'm not sure if this a browser
			// bug, or a bug we have caused.
			if (state.matches === data.matches) return;

			// Either setup or teardown
			if (data.matches) {
				setupCallbacks.push(name);
			} else {
				teardownCallbacks.push(name);
			}

			if (!setImmediateId) {
				setImmediateId = setImmediate(function() {
					setImmediateId = 0;

					Promise.all(teardownCallbacks.map(function (currentItem) {
						teardown (currentItem);
					})).then(function () {

						// Fire an event to allow third
						// parties to hook into this change.
						module.fireStatic('statechange');

						// Run Setup callbacks if any.
						Promise.all(setupCallbacks.map(function (currentItem) {
							setup (currentItem);
						})).then(function () {
							module.fireStatic('statechangecomplete');
						}).catch(function (e) {
							console.error("Error in module setup", e);
						});
					}).catch(function (e) {
						console.error("Error in module teardown", e);
					});
				});
			}

			// Update the matches state
			state.matches = data.matches;
		};
	}



	function setup(name) {
		setupCallbacks.splice(setupCallbacks.indexOf(name), 1);
		module.el.classList.add(name);
		return run('setup', { on: name }, callback);
	}

	function teardown(name, options) {
		teardownCallbacks.splice(teardownCallbacks.indexOf(name), 1);
		var fromDOM = (!options || options.fromDOM !== false);
		if (fromDOM) {
			module.el.classList.remove(name);
		}
		if (typeof options === "function") callback = options;
		return run('teardown', { on: name, fromDOM: fromDOM });
	}

	function run(method, options) {
		var fn = module._media[options.on][method];
		if (fn) return fn.call(module, options, function () { debugger; });
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