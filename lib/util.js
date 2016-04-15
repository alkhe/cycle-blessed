"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var isObject = exports.isObject = function isObject(a) {
  return a === Object(a);
};
var singleton = exports.singleton = function singleton(a) {
  return Array.isArray(a) ? a : [a];
};