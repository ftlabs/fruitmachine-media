'use strict';

var currentSize = null;
var globalStateLibrary = {};

function PseudoMediaQueryList (mediaQuery) {
	var callbacks = [];

	this.addListener = function (callback) {
		callbacks.push(callback);
		console.log('callback added for ', mediaQuery);
	};

	this.removeListener = function (callback) {
		var index = callbacks.indexOf(callback);
		if (!!~index) {
			callbacks.splice(index,1);
			console.log('removed callback for', mediaQuery);
		}
	};

	this.matches = (currentSize === mediaQuery);

	this.media = mediaQuery;

	this._runCallbacks = function () {
		callbacks.forEach(function (item) {
			item(this);
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

	setState: function (state) {

		console.log('Resizing the window to match', state, 'the old state was', currentSize);

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