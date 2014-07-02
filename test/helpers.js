window.helpers = {};

window.matchMedia = require('./match-media-helper');
/**
 * Templates
 */

window.templates = helpers.templates = {
	'apple': Hogan.compile('{{{1}}}'),
	'layout': Hogan.compile('{{{1}}}{{{2}}}{{{3}}}'),
	'list': Hogan.compile('{{#children}}{{{child}}}{{/children}}'),
	'orange': Hogan.compile('{{text}}'),
	'pear': Hogan.compile('{{text}}')
};

/**
 * Module Definitions
 */

helpers.Views = {};

window.Layout = helpers.Views.Layout = fruitmachine.define({
	name: 'layout',
	template: templates.layout,

	initialize: function() {},
	setup: function() {},
	teardown: function() {},
	destroy: function() {}
});

window.Apple = helpers.Views.Apple = fruitmachine.define({
	name: 'apple',
	template: templates.apple,
	helpers: [
		require('../coverage/media')
	],

	initialize: function() {},
	setup: function() {},
	teardown: function() {},
	destroy: function() {}
});

window.List = helpers.Views.List = fruitmachine.define({
	name: 'list',
	template: templates.list,

	initialize: function() {},
	setup: function() {},
	teardown: function() {},
	destroy: function() {}
});

window.Orange = helpers.Views.Orange = fruitmachine.define({
	name: 'orange',
	template: templates.orange,

	initialize: function() {},
	setup: function() {},
	teardown: function() {},
	destroy: function() {}
});

window.Pear = helpers.Views.Pear = fruitmachine.define({
	name: 'pear',
	template: templates.pear,

	initialize: function() {},
	setup: function() {},
	teardown: function() {},
	destroy: function() {}
});

/**
 * Create View
 */

window.helpers.createView = function() {
	var layout = new Layout();
	var apple = new Apple({ slot: 1 });
	var orange = new Orange({ slot: 2 });
	var pear = new Pear({ slot: 3 });

	layout
		.add(apple)
		.add(orange)
		.add(pear);

	return this.view = layout;
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

window.sandbox = helpers.createSandbox();