'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.button = exports.textarea = exports.form = exports.layout = exports.text = exports.element = exports.box = exports.factory = exports.h = exports.makeScreenDriver = exports.makeTermDriver = undefined;

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _rx = require('rx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeTermDriver = function makeTermDriver(screen) {
	var root = h('element', { keyable: true, clickable: true, children: [] });
	screen.append(root);

	return function (vt$) {
		vt$.forEach(function (vt) {
			// TODO implement diffing
			// blessed only performs simple diffing
			// problem visible in `example/input.js`
			// don't use blessed textarea for now;
			// implement custom inputs as in `example/writer.js`
			root.children = [];
			root.append(vt);
			screen.render();
		});

		// cached listeners for each event
		var rootListeners = {},
		    globalListeners = {};

		return {
			on: function on(event) {
				return rootListeners[event] ? rootListeners[event] : rootListeners[event] = _rx.Observable.create(function (o) {
					return void root.on(event, function () {
						for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
							args[_key] = arguments[_key];
						}

						return o.onNext(args);
					});
				});
			},
			onGlobal: function onGlobal(event) {
				return globalListeners[event] ? globalListeners[event] : globalListeners[event] = _rx.Observable.create(function (o) {
					return void screen.on(event, function () {
						for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
							args[_key2] = arguments[_key2];
						}

						return o.onNext(args);
					});
				});
			}
		};
	};
};

var makeScreenDriver = function makeScreenDriver(screen) {
	return function (command$) {
		return command$.map(function (c) {
			return c(screen);
		});
	};
};

// turns non-arrays into singleton arrays
// turns strings into text nodes
// TODO support nested arrays
var fixChildren = function fixChildren(children) {
	return (Array.isArray(children) ? children : [children]).map(function (child) {
		return child === Object(child) ? child : text({ content: String(child) });
	});
};

var h = function h(name) {
	var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
	var children = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	return _blessed2.default[name](_extends({}, options, {
		children: (options.children || []).concat(fixChildren(children))
	}));
};

var factory = function factory(name) {
	return function () {
		for (var _len3 = arguments.length, args = Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
			args[_key3] = arguments[_key3];
		}

		return h.apply(undefined, [name].concat(args));
	};
};

var _map = ['box', 'element', 'text', 'layout', 'form', 'textarea', 'button'].map(factory);

var _map2 = _slicedToArray(_map, 7);

var box = _map2[0];
var element = _map2[1];
var text = _map2[2];
var layout = _map2[3];
var form = _map2[4];
var textarea = _map2[5];
var button = _map2[6];
exports.makeTermDriver = makeTermDriver;
exports.makeScreenDriver = makeScreenDriver;
exports.h = h;
exports.factory = factory;
exports.box = box;
exports.element = element;
exports.text = text;
exports.layout = layout;
exports.form = form;
exports.textarea = textarea;
exports.button = button;