'use strict';

var currentSize = null;
var globalStateLibrary = {};

function PseudoMediaQueryList (mediaQuery) {
	var callbacks = [];
	var self = this;

	this.addListener = function (callback) {
		callbacks.push(callback);
	};

	this.removeListener = function (callback) {
		var index = callbacks.indexOf(callback);
		if (!!~index) {
			callbacks.splice(index,1);
		}
	};

	this.matches = (currentSize === mediaQuery);

	this.media = mediaQuery;

	this._runCallbacks = function () {
		callbacks.forEach(function (fn) {
			fn(self);
		});
	};
}

module.exports = function (mediaQuery) {

	if (currentSize === null) {
		currentSize = mediaQuery;
	}

	if (!globalStateLibrary[mediaQuery]) {
		var mql = new PseudoMediaQueryList(mediaQuery);
		globalStateLibrary[mediaQuery] = mql;
		return mql;
	} else {
		return globalStateLibrary[mediaQuery];
	}
};

module.exports.controller = {
	listStates: function () {
		return Object.keys(globalStateLibrary);
	},

	currentState: function () {
		return currentSize;
	},

	setState: function (state) {

		currentSize = state;

		for (var i in globalStateLibrary) {
			if (globalStateLibrary.hasOwnProperty(i)) {
				var item = globalStateLibrary[i];
				var oldMatchesValue = item.matches;
				item.matches = (item.media === state);

				// Run callback only if the state changes.
				if (item.matches !== oldMatchesValue) {
					item._runCallbacks();
				}
			}
		}
	}
};