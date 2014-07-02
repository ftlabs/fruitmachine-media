'use strict';

var globalStateLibrary = {};

module.exports = function (mediaQuery) {
	var callbacks = [];
	var query = mediaQuery;

	// make the callback available to the rest of the module so that the controller can do stuff.
	if (!globalStateLibrary[query]) {
		globalStateLibrary[query] = callbacks;
	} else {
		globalStateLibrary[query] = globalStateLibrary[query].concat(callbacks);
	}

	return {
		addListener: function (callback) {
			callbacks.push(callback);
			console.log('callback added for ', query);
		},

		removeListener: function (callback) {
			var index = callbacks.indexOf(callback);
			if (!!~index) {
				callbacks.splice(index,1);
				console.log('removed callback for', query);
			}
		}
	};
};

module.exports.controller = {
	listStates: function () {
		return Object.keys(globalStateLibrary);
	},

	setState: function (state) {
		globalStateLibrary[state]();
	}
};