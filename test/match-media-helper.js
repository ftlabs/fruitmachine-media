'use strict';

var currentSize = null;
var globalStateLibrary = [];

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
			item();
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
		globalStateLibrary.forEach(function (item) {
			item.matches = (item.media === state);
			item._runCallbacks();
		});
	}
};