/* jshint node: true, browser: true */

/**
 * Media Helper
 *
 * @codingstandard ftlabs-jsv2
 * @copyright The Financial Times Limited [All rights reserved]
 */

'use strict';

/**
 * Locals
 */

var mm = window.matchMedia;
var has = Object.prototype.hasOwnProperty;

/**
 * Exports
 */

module.exports = function(module) {

	module.on('initialize', function(options) {
		this._media = {};

		var override = options.media;
		var proto = this.media;
		var media = override || proto;
		var states = expandStates(this.states || {});
		var state;
		var name;

		for (var query in media) {
			if (has.call(media, query)) {
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
			if (has.call(this._media, name)) {
				state = this._media[name];
				matcher = state.matcher = mm(state.query);
				matcher.addListener(state.cb = callback(name));
				if (matcher.matches) setup(name);
			}
		}
	});

	module.on('before teardown', function() {
		var state;
		var matcher;

		for (var name in this._media) {
			if (has.call(this._media, name)) {
				state = this._media[name];
				matcher = state.matcher;
				matcher.removeListener(state.cb);
				if (matcher.matches) teardown(name, { fromDOM: false });
			}
		}
	});

	function expandStates(states) {
		var expanded = {};
		var contents;

		for (var names in states) {
			if (has.call(states, names)) {
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
			if (data.matches) setup(name);
			else teardown(name);

			// Fire an event to allow third
			// parties to hook into this change.
			module.fireStatic('statechange');

			// Update the matches state
			state.matches = data.matches;
		};
	}

	function setup(name) {
		module.el.classList.add(name);
		run('setup', { on: name });
	}

	function teardown(name, options) {
		var fromDOM = (!options || options.fromDOM !== false);
		if (fromDOM) {
			module.el.classList.remove(name);
		}
		run('teardown', { on: name, fromDOM: fromDOM });
	}

	function run(method, options) {
		var fn = module._media[options.on][method];
		if (fn) fn.call(module, options);
	}
};
