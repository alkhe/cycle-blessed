'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.element = exports.box = exports.factory = exports.h = exports.makeScreenDriver = exports.makeTermDriver = undefined;

var _blessed = require('blessed');

var _blessed2 = _interopRequireDefault(_blessed);

var _rx = require('rx');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var makeTermDriver = function makeTermDriver(screen) {
	var root = h('element', { clickable: true, children: [] });
	screen.append(root);
	return function (vt$) {
		return vt$.forEach(function (vt) {
			root.children = [];
			root.append(vt);
			screen.render();
		});
	};
};

var makeScreenDriver = function makeScreenDriver(screen) {
	return function (command$) {
		command$.map(function (c) {
			return c(screen);
		});
		return {
			on: function on(event) {
				return _rx.Observable.create(function (o) {
					screen.on(event, function (x) {
						return o.onNext(x);
					});
					return function () {};
				});
			},
			event: function event(_event) {
				return _rx.Observable.create(function (o) {
					screen.children[0].on(_event, function (x) {
						return o.onNext(x);
					});
					return function () {};
				});
			}
		};
	};
};

var h = function h(name, options, content) {
	return _blessed2.default[name](_extends({}, options, { content: content }));
};

var factory = function factory(name) {
	return function () {
		for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
			args[_key] = arguments[_key];
		}

		return h.apply(undefined, [name].concat(args));
	};
};

var box = factory('box');
var element = factory('element');

exports.makeTermDriver = makeTermDriver;
exports.makeScreenDriver = makeScreenDriver;
exports.h = h;
exports.factory = factory;
exports.box = box;
exports.element = element;