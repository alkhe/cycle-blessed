"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

Object.defineProperty(exports, "__esModule", {
	value: true
});
var id = exports.id = function id(i) {
	return function (s) {
		return s.filter(function (_ref) {
			var _ref2 = _slicedToArray(_ref, 1);

			var el = _ref2[0];
			return el.options.id === i;
		});
	};
};

var view = exports.view = function view() {
	for (var _len = arguments.length, v = Array(_len), _key = 0; _key < _len; _key++) {
		v[_key] = arguments[_key];
	}

	return function (s) {
		return s.pluck.apply(s, v);
	};
};

var key = exports.key = function key(k) {
	return function (s) {
		return s.filter(function (_ref3) {
			var _ref4 = _slicedToArray(_ref3, 3);

			var ek = _ref4[2];
			return ek.full === k;
		});
	};
};

var toggle = exports.toggle = function toggle(s) {
	return s.scan(function (a) {
		return !a;
	});
};

var idempotent = exports.idempotent = function idempotent(i) {
	return function (s) {
		return s.map(function () {
			return i;
		});
	};
};