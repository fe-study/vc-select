(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["vcSelect"] = factory();
	else
		root["vcSelect"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmory imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmory exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		Object.defineProperty(exports, name, {
/******/ 			configurable: false,
/******/ 			enumerable: true,
/******/ 			get: getter
/******/ 		});
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 14);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */,
/* 1 */,
/* 2 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
	}),
	getHeadElement = memoize(function () {
		return document.head || document.getElementsByTagName("head")[0];
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [];

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the bottom of <head>.
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
}

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var head = getHeadElement();
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			head.insertBefore(styleElement, head.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			head.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		head.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	styleElement.type = "text/css";
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	linkElement.rel = "stylesheet";
	insertStyleElement(options, linkElement);
	return linkElement;
}

function addStyle(obj, options) {
	var styleElement, update, remove;

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ },
/* 3 */
/***/ function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function() {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		var result = [];
		for(var i = 0; i < this.length; i++) {
			var item = this[i];
			if(item[2]) {
				result.push("@media " + item[2] + "{" + item[1] + "}");
			} else {
				result.push(item[1]);
			}
		}
		return result.join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(6)
module.exports = __webpack_require__(12)

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function" ? module.exports.options : module.exports).template = __webpack_require__(10)
if (false) {
(function () {
var hotAPI = require("vue-hot-reload-api")
hotAPI.install(require("vue"))
if (!hotAPI.compatible) return
var id = "-!babel!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=script&index=0!./Select.vue"
hotAPI.createRecord(id, module.exports)
module.hot.accept(["-!babel!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=script&index=0!./Select.vue","-!vue-html-loader!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=template&index=0!./Select.vue"], function () {
var newOptions = require("-!babel!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=script&index=0!./Select.vue")
if (newOptions && newOptions.__esModule) newOptions = newOptions.default
var newTemplate = require("-!vue-html-loader!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=template&index=0!./Select.vue")
hotAPI.update(id, newOptions, newTemplate)
})
})()
}

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(7);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/.0.21.0@css-loader/index.js!./../../node_modules/.7.1.7@vue-loader/lib/style-rewriter.js?id=_v-5d198ad9&file=Option.vue!./../../node_modules/.2.2.3@less-loader/index.js!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=style&index=0!./Option.vue", function() {
			var newContent = require("!!./../../node_modules/.0.21.0@css-loader/index.js!./../../node_modules/.7.1.7@vue-loader/lib/style-rewriter.js?id=_v-5d198ad9&file=Option.vue!./../../node_modules/.2.2.3@less-loader/index.js!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=style&index=0!./Option.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(8);
if(typeof content === 'string') content = [[module.i, content, '']];
// add the styles to the DOM
var update = __webpack_require__(2)(content, {});
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!./../../node_modules/.0.21.0@css-loader/index.js!./../../node_modules/.7.1.7@vue-loader/lib/style-rewriter.js?id=_v-aef2c840&file=Select.vue!./../../node_modules/.2.2.3@less-loader/index.js!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=style&index=0!./Select.vue", function() {
			var newContent = require("!!./../../node_modules/.0.21.0@css-loader/index.js!./../../node_modules/.7.1.7@vue-loader/lib/style-rewriter.js?id=_v-aef2c840&file=Select.vue!./../../node_modules/.2.2.3@less-loader/index.js!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=style&index=0!./Select.vue");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".vc-option-component {\n  position: relative;\n}\n.vc-option-component a span.check-mark {\n  position: absolute;\n  display: inline-block;\n  right: 15px;\n  margin-top: 5px;\n}\n", ""]);

// exports


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(3)();
// imports


// module
exports.push([module.i, ".vc-select-component label.label-item {\n  position: relative;\n  top: 7px;\n  vertical-align: top;\n  display: inline-block;\n}\n.vc-select-component .bs-searchbox {\n  padding: 4px 8px;\n  position: relative;\n}\n.vc-select-component .bs-searchbox input {\n  height: 34px;\n  width: 100%;\n}\n.vc-select-component .bs-searchbox .clear-search-text {\n  visibility: hidden;\n  position: absolute;\n  right: 15px;\n  top: 50%;\n  -webkit-transform: translateY(-50%);\n  transform: translateY(-50%);\n  opacity: .3;\n}\n.vc-select-component .bs-searchbox:hover .clear-search-text {\n  visibility: visible;\n}\n.vc-select-component .btn-group .notify {\n  z-index: 9999;\n  position: absolute;\n  top: 42px;\n  width: 99%;\n  margin: 0 auto;\n  min-height: 26px;\n  padding: 3px 5px;\n  background: #f5f5f5;\n  border: 1px solid #e3e3e3;\n  border-radius: 3px 3px 0 0;\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n  pointer-events: none;\n  opacity: .9;\n}\n.vc-select-component .btn-group button.multiselect {\n  /* override multiselect button height */\n  padding: 2px 6px;\n  min-height: 34px;\n  width: 100%;\n  overflow: hidden;\n  margin: 0;\n  color: #666;\n  white-space: normal;\n  -webkit-transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);\n  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);\n}\n.vc-select-component .btn-group button.multiselect.text-to-left {\n  text-align: left;\n}\n.vc-select-component .btn-group button.multiselect:hover {\n  background-color: #fff;\n  border: 1px solid #A79F9F;\n}\n.vc-select-component .btn-group button.multiselect:active {\n  background-color: #fff;\n  border: 1px solid #ccc;\n  box-shadow: none;\n}\n.vc-select-component .btn-group button.multiselect:focus {\n  background-color: #fff;\n  border: 1px solid #ccc;\n}\n.vc-select-component .btn-group button.multiselect a.vc-selected-item {\n  display: inline-block;\n  text-align: left;\n  line-height: 16px;\n  color: inherit;\n  font-size: 12px;\n  position: relative;\n  cursor: pointer;\n  padding: 0 5px 1px;\n  margin-right: 5px;\n  margin-bottom: 2px;\n  background-color: #f3f3f3;\n}\n.vc-select-component .btn-group button.multiselect a.vc-selected-item:hover {\n  text-decoration: none;\n}\n.vc-select-component .btn-group button.multiselect a.vc-selected-item span {\n  width: 5px;\n  height: 5px;\n  color: #999;\n  font-weight: 700;\n  padding: 3px 2px 3px 1px;\n}\n.vc-select-component .btn-group button.multiselect a.vc-selected-item span:hover {\n  color: #404040;\n}\n.vc-select-component .btn-group button.multiselect .btn-content {\n  white-space: nowrap;\n}\n.vc-select-component .btn-group .dropdown-menu {\n  min-width: 100%;\n  overflow: auto;\n  width: auto;\n}\n.vc-select-component .btn-group .dropdown-menu > li {\n  cursor: pointer;\n}\n.vc-select-component .btn-group .dropdown-menu > li.disabled {\n  opacity: .6;\n  cursor: not-allowed;\n}\n.vc-select-component .btn-group .dropdown-menu > li > a:hover {\n  background-color: #1E90FF;\n  color: #fff;\n}\n.vc-select-component .btn-group .dropdown-menu .no-content-tips {\n  text-align: center;\n  padding: 10px;\n}\n", ""]);

// exports


/***/ },
/* 9 */
/***/ function(module, exports) {

module.exports = "<li @mousedown.stop.prevent=\"handleClick\" v-show=\"show\" class=\"vc-option-component\" :class=\"{ 'disabled': d }\">\n        <a>\n            <span v-el:label><slot>{{ label }}</slot></span>\n            <span class=\"glyphicon glyphicon-ok check-mark\" v-show=\"checked\"></span>\n        </a>\n    </li>";

/***/ },
/* 10 */
/***/ function(module, exports) {

module.exports = "<div class=\"vc-select-component form-group\">\n        <label class=\"label-item\" v-if=\"label\">{{ label }}</label>\n        <div class=\"btn-group\" :class=\"{ 'open': show }\" :style=\"{ 'width': optionalWidth }\">\n            <button v-el:btn type=\"button\" :class=\"{ 'text-to-left': !showPlaceholder && tags }\" class=\"btn btn-default multiselect dropdown-toggle btn-multipe\"\n                @click=\"toggleDropdown\"\n                @mousedown.stop\n                @blur=\"show = (searchable ? show : false)\"\n                :disabled=\"disabled\"\n                :readonly=\"readonly\"\n                :title=\"selectedItems || placeholder\"\n            >\n                <a class=\"vc-selected-item\" v-for=\"option in selectedOptions\" v-show=\"tags\" @mousedown.stop>\n                    {{ option.label }}\n                    <span @mousedown=\"select(option.value)\" v-show=\"includes(option.value)\">&times;</span>\n                </a>\n                <span class=\"btn-placeholder\" v-show=\"showPlaceholder\">{{ placeholder }}</span>\n                <span class=\"caret\" v-show=\"showPlaceholder\"></span>\n                <span class=\"btn-content\" v-show=\"!tags\">{{ selectedItems }}</span>\n            </button>\n            <div class=\"notify\" v-show=\"showNotify\" transition=\"fadein\">最多选取{{ limit }}项!</div>\n            <ul class=\"dropdown-menu\" :style=\"{ 'max-height': optionalHeight }\" @mousedown.stop> <!-- make scrollbar draggable -->\n                <li v-if=\"optionsLen && searchable\" class=\"bs-searchbox\">\n                    <input type=\"text\" @mousedown.stop v-model=\"searchText\" placeholder=\"搜索\" class=\"form-control\" autocomplete=\"off\" />\n                    <span @mousedown.stop=\"searchText = ''\" class=\"clear-search-text glyphicon glyphicon-remove-circle\" aria-hidden=\"true\"></span>\n                </li>\n                <li v-if=\"optionsLen && showSelectAllOption\">\n                    <a @mousedown.stop.prevent=\"select(selectAllOptionValue)\">\n                        {{ selectAllOptionLabel }} \n                        <span class=\"glyphicon glyphicon-ok check-mark\" v-show=\"includes(selectAllOptionValue)\"></span>\n                    </a>\n                </li>\n                <!-- default vc-option slot -->\n                <slot>\n                <template v-for=\"($index, option) in filteredOptions\">\n                <li @mousedown.stop.prevent=\"select(option.value, option.disabled)\" :class=\"{ 'disabled': option.disabled }\">\n                    <a>\n                        {{ option.label }}\n                        <span class=\"glyphicon glyphicon-ok check-mark\" v-show=\"includes(option.value)\"></span>\n                    </a>\n                </li>\n                </template>\n                </slot>\n                <slot v-if=\"!optionsLen\" name=\"noContent\"><div class=\"no-content-tips\">暂无{{ label }}</div></slot>\n            </ul>\n        </div>\n    </div>";

/***/ },
/* 11 */
/***/ function(module, exports) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
// <template>
//     <li @mousedown.stop.prevent="handleClick" v-show="show" class="vc-option-component" :class="{ 'disabled': d }">
//         <a>
//             <span v-el:label><slot>{{ label }}</slot></span>
//             <span class="glyphicon glyphicon-ok check-mark" v-show="checked"></span>
//         </a>
//     </li>
// </template>

// <style>
// .vc-option-component {
//     position: relative;
// }
// .vc-option-component a span.check-mark {
//   position: absolute;
//   display: inline-block;
//   right: 15px;
//   margin-top: 5px;
// }
// </style>

// <script>
exports.default = {
    name: 'vc-option',
    props: {
        value: String,
        label: String,
        disabled: Boolean // 貌似传入'' 也会被js给转为false,就不设置default: false了
    },
    data: function data() {
        return {};
    },
    ready: function ready() {
        if (!this.$parent.options) {
            this.$parent.options = [];
        }
        // 取slot,组合成option注入父组件
        var slotLabel = this._slotContents.default.textContent;
        this.$parent.options.push({
            'value': this.value,
            'label': slotLabel || this.label,
            'disabled': this.d
        });
    },

    computed: {
        // 除非传入 `:disabled="false"`，否则只要有 `disabled` 字样就是true
        // enum: [disabled, :disabled="true", :disabled="false"]
        d: function d() {
            if (this.disabled === false) {
                return false;
            }
            return true;
        },
        show: function show() {
            var _this = this;

            if (!this.$parent.filteredOptions) {
                return;
            }
            return this.$parent.filteredOptions.some(function (item) {
                return String(item['value']) === String(_this.value);
            });
        },
        checked: function checked() {
            return this.$parent.includes(this.value);
        }
    },
    methods: {
        handleClick: function handleClick() {
            if (this.d) return;
            var parent = this.$parent;
            if (parent.multiple && parent.value != void 0) {
                var v = void 0;
                if (!Array.isArray(parent.value)) {
                    v = parent.value.split(',');
                    v = v.filter(function (item) {
                        return item !== '';
                    });
                    var index = v.indexOf(this.value);
                    v[~index ? '$remove' : 'push'](this.value);
                    parent.value = v.join(',');
                } else {
                    var _index = parent.value.indexOf(this.value);
                    parent.value[~_index ? '$remove' : 'push'](this.value);
                }
            } else {
                parent.value = [this.value];
                parent.show = false;
            }
            this.$parent.onSelect && this.$parent.onSelect();
        }
    }
};
// </script>

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _Option = __webpack_require__(13);

var _Option2 = _interopRequireDefault(_Option);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// <template>
//     <div class="vc-select-component form-group">
//         <label class="label-item" v-if="label">{{ label }}</label>
//         <div class="btn-group" :class="{ 'open': show }" :style="{ 'width': optionalWidth }">
//             <button v-el:btn type="button" :class="{ 'text-to-left': !showPlaceholder && tags }" class="btn btn-default multiselect dropdown-toggle btn-multipe"
//                 @click="toggleDropdown"
//                 @mousedown.stop
//                 @blur="show = (searchable ? show : false)"
//                 :disabled="disabled"
//                 :readonly="readonly"
//                 :title="selectedItems || placeholder"
//             >
//                 <a class="vc-selected-item" v-for="option in selectedOptions" v-show="tags" @mousedown.stop>
//                     {{ option.label }}
//                     <span @mousedown="select(option.value)" v-show="includes(option.value)">&times;</span>
//                 </a>
//                 <span class="btn-placeholder" v-show="showPlaceholder">{{ placeholder }}</span>
//                 <span class="caret" v-show="showPlaceholder"></span>
//                 <span class="btn-content" v-show="!tags">{{ selectedItems }}</span>
//             </button>
//             <div class="notify" v-show="showNotify" transition="fadein">最多选取{{ limit }}项!</div>
//             <ul class="dropdown-menu" :style="{ 'max-height': optionalHeight }" @mousedown.stop> <!-- make scrollbar draggable -->
//                 <li v-if="optionsLen && searchable" class="bs-searchbox">
//                     <input type="text" @mousedown.stop v-model="searchText" placeholder="搜索" class="form-control" autocomplete="off" />
//                     <span @mousedown.stop="searchText = ''" class="clear-search-text glyphicon glyphicon-remove-circle" aria-hidden="true"></span>
//                 </li>
//                 <li v-if="optionsLen && showSelectAllOption">
//                     <a @mousedown.stop.prevent="select(selectAllOptionValue)">
//                         {{ selectAllOptionLabel }} 
//                         <span class="glyphicon glyphicon-ok check-mark" v-show="includes(selectAllOptionValue)"></span>
//                     </a>
//                 </li>
//                 <!-- default vc-option slot -->
//                 <slot>
//                 <template v-for="($index, option) in filteredOptions">
//                 <li @mousedown.stop.prevent="select(option.value, option.disabled)" :class="{ 'disabled': option.disabled }">
//                     <a>
//                         {{ option.label }}
//                         <span class="glyphicon glyphicon-ok check-mark" v-show="includes(option.value)"></span>
//                     </a>
//                 </li>
//                 </template>
//                 </slot>
//                 <slot v-if="!optionsLen" name="noContent"><div class="no-content-tips">暂无{{ label }}</div></slot>
//             </ul>
//         </div>
//     </div>
// </template>

// <style lang="less">
// @height: 34px;
// .vc-select-component {

//     label.label-item {
//         position: relative;
//         top: 7px;
//         vertical-align: top;
//         display: inline-block;
//     }
//     .bs-searchbox {
//         padding: 4px 8px;
//         position: relative;

//         // 保证清除按钮的居中
//         input {
//             height: @height;
//             width: 100%; // 撑开宽度
//         }

//         .clear-search-text {
//             visibility: hidden;
//             position: absolute;
//             right: 15px;
//             top: 50%;
//             -webkit-transform: translateY(-50%);
//             transform: translateY(-50%);
//             opacity: .3;
//         }

//         &:hover .clear-search-text {
//             visibility: visible;
//         }
//     }

//     .btn-group {
//         .notify {
//             z-index: 9999;
//             position: absolute;
//             top: 42px;
//             width: 99%;
//             margin: 0 auto;
//             min-height: 26px;
//             padding: 3px 5px;
//             background: #f5f5f5;
//             border: 1px solid #e3e3e3;
//             border-radius: 3px 3px 0 0;
//             box-shadow: inset 0 1px 1px rgba(0,0,0,.05);
//             pointer-events: none;
//             opacity: .9;
//         }
//         button.multiselect { /* override multiselect button height */
//             padding: 2px 6px;
//             min-height: @height;
//             width: 100%;
//             overflow: hidden;
//             margin: 0;
//             color: #666;
//             white-space: normal;
//             -webkit-transition: all .3s cubic-bezier(.645,.045,.355,1);
//             transition: all .3s cubic-bezier(.645,.045,.355,1);

//             &.text-to-left {
//                 text-align: left;
//             }

//             &:hover {
//                 background-color: #fff;
//                 border: 1px solid #A79F9F;
//             }
//             &:active {
//                 background-color: #fff;
//                 border: 1px solid #ccc;
//                 -webkit-box-shadow: none;
//                 box-shadow: none;
//             }
//             &:focus {
//                 background-color: #fff;
//                 border: 1px solid #ccc;
//             }

//             a.vc-selected-item {
//                 display: inline-block;
//                 text-align: left;
//                 line-height: 16px;
//                 color: inherit;
//                 font-size: 12px;
//                 position: relative;
//                 cursor: pointer;
//                 padding: 0 5px 1px;
//                 margin-right: 5px;
//                 margin-bottom: 2px;
//                 background-color: #f3f3f3;

//                 &:hover {
//                     text-decoration: none;
//                 }

//                 @size: 5px;
//                 span {
//                     width: @size;
//                     height: @size;
//                     color: #999;
//                     font-weight: 700;
//                     padding: 3px 2px 3px 1px;

//                     &:hover {
//                         color: #404040;
//                     }
//                 }
//             }
//             .btn-content {
//                 white-space: nowrap;
//             }
//         }
//         .dropdown-menu {
//             min-width: 100%; // override bootstrap 160px
//             // max-height: 400px;
//             overflow: auto;
//             width: auto;

//             & > li {
//                 cursor: pointer;
//             }

//             & > li.disabled {
//                 opacity: .6;
//                 cursor: not-allowed;
//             }

//             // hack for hover
//             & > li > a:hover {
//                 background-color: #1E90FF;
//                 color: #fff;
//             }

//             .no-content-tips {
//                 text-align: center;
//                 padding: 10px;
//             }
//         } // .dropdown-menu
//     } // .btn-group
// } // component
// </style>

// <script>
// polyfill
Number.isInteger = Number.isInteger || function (val) {
    var value = +val;
    return typeof value === "number" && isFinite(value) && Math.floor(value) === value;
};

var COMPONENT_NS = 'SELECT';

var Select = {
    name: 'vc-select',
    props: {
        // 组件名称，也是DOM的name属性,默认随机生成
        name: {
            type: String,
            default: 'vc-select-' + Date.now()
        },
        // 项目说明文案
        label: String,
        // 对外暴露的值
        value: {
            twoWay: true,
            type: [Array, String, Number] // 内部会记录下初始化类型快照，用于反同步，只区分Array, 非Array
        },
        // 是否是标签式列出所选项
        tags: {
            type: Boolean,
            default: false
        },
        // 占位提示
        placeholder: {
            type: String,
            default: '没有选择'
        },
        // 是否不可用
        disabled: {
            type: Boolean,
            default: false
        },
        // 是否只读
        readonly: {
            type: Boolean,
            default: false
        },
        // 选项: Array是目标类型，Object也支持转换，但是Array必须为Array<Object{ value, label, disabled }>
        options: {
            type: [Array, Object]
        },
        // 用于区分下拉选择的值的同步模式(是点选就同步还是下拉关闭才同步)
        lazy: {
            type: Boolean,
            default: false
        },
        // 是否可多选
        multiple: {
            type: Boolean,
            default: false
        },
        // 是否可搜索
        searchable: {
            type: Boolean,
            default: false
        },
        // 最多选择多少项
        limit: {
            type: Number,
            default: 1024
        },
        // 选择后自动关闭下拉，仅作用在单选
        closeOnSelect: {
            type: Boolean,
            default: false
        },
        // 选择按钮宽度，不包括label部分 
        width: {
            type: [Number, String],
            default: '150'
        },
        // 下拉列表高度
        height: {
            type: [Number, String],
            default: '400'
        },
        // 是否显示'全部'选项
        showSelectAllOption: {
            type: Boolean,
            default: false
        },
        // 全部选项的文案
        selectAllOptionLabel: {
            type: String,
            default: '全部'
        },
        // ‘全部'选项的值
        // 重要! 传给后端的key值，有默认值，可配置来避免冲突，初始化传入会自动全选
        selectAllOptionValue: {
            type: String,
            default: '__all__'
        },
        // 是真正全部选项被选中还是语义上选中前后端约定的key，默认是全部选中
        selectAllBehavior: {
            type: String,
            default: 'allChecked' // ['allChecked', 'semantic'] 全选行为上可以是真正全部选项选中或语义上的选中'全部'这一项
        },
        // 选择了其他又选择了全部选项，则清空其他，只显示全部, 即全部与其他选项互斥,使得行为更清晰
        mutual: {
            type: Boolean,
            default: true
        },
        // 要对外派发的数据
        dispatchArgs: {
            type: Array
        },
        onShow: Function,
        onHide: Function,
        onSelect: Function
    },
    created: function created() {
        // 注册到全局，便于操作
        var pool = this.$root['vc-select-pool'];
        if (!pool) {
            this.$root['vc-select-pool'] = [];
        }
        this.$root['vc-select-pool'].push(this);
    },
    ready: function ready() {
        var _this = this;

        // watch immediate已经确保了转换和类型确定
        if (!Array.isArray(this.vm)) {
            console.warn('[vc-select warn]: vm should be Array but now: ' + _typeof(this.vm));
            return;
        }
        // 再做一些转换，防止意外
        if (!this.multiple && this.vm.length > 1) {
            this.vm = this.vm.slice(0, 1);
        } else if (this.multiple && this.vm.length > this.limit) {
            this.vm = this.vm.slice(0, this.limit);
        }
        this.reWriteValue();

        // 绑定点击空白处下拉选择框消失事件, 20160508改为监听mousedown(同时修改了模板), 让mousedown传递出去，
        // 因为mousedown先于click触发，这样就不能同时打开多个下拉菜单了,
        // 而click事件还能响应，来触发toggleDropdown方法，弹出下拉菜单! 反之不可...
        document.addEventListener('mousedown', function () {
            _this.$emit('closeSelectList');
        }, false);
    },
    data: function data() {
        return {
            uuid: 'vc-select-' + Date.now(),
            show: false, // 是否显示下拉
            type: '__NOTINIT__', // value的初始化时候的类型
            vm: [], // 内部使用的vm, 不然容易在twoWay模式下改变外部变量, 仅在内部vm变化时手动通过原始value变量来同步外界
            currentItem: '', // 当前点击的是哪一项
            searchText: null,
            selectedOptions: [], // 已经选择过的options
            showNotify: false
        };
    },

    computed: {
        cOptions: function cOptions() {
            var val = this.options;
            if (!val) {
                return;
            }

            // 目标结构:
            // [{
            //   label: '北京',
            //   value: '111'
            // }, {
            //   label: '上海',
            //   value: '222'
            // }]
            // Array: with vilid structure, return it to use
            if (val && val instanceof Array && val.length > 0 && "label" in val[0] && "value" in val[0]) {
                return val;
            }
            // Object: transform it
            var arr = [];
            if (val !== null && (typeof val === 'undefined' ? 'undefined' : _typeof(val)) === 'object') {
                var keys = Object.keys(val);
                for (var i = 0, len = keys.length; i < len; i++) {
                    var obj = {};
                    obj['value'] = keys[i];
                    obj['label'] = val[keys[i]];
                    arr.push(obj);
                }
                return arr;
            }

            // Other: return it for debug
            console.warn('[vc-select warn]: maybe invalid options! => ', val);
            return val;
        },
        filteredOptions: function filteredOptions() {
            var s = this.searchText;
            var o = this.cOptions;
            if (!s) {
                return o;
            }
            return o.filter(function (item) {
                return item['label'].indexOf(s) >= 0;
            });
        },
        optionalWidth: function optionalWidth() {
            if (this.width == null || this.width === '') {
                return null;
            }
            if (Number.isInteger(+this.width)) {
                return this.width + 'px';
            }
            return this.width;
        },
        optionalHeight: function optionalHeight() {
            if (this.height == null || this.height === '') {
                return null;
            }
            if (Number.isInteger(+this.height)) {
                return this.height + 'px';
            }
            return this.height;
        },
        optionsAllArr: function optionsAllArr() {
            var arr = [];
            for (var i = 0; i < this.optionsLen; i++) {
                arr.push(this.cOptions[i]['value']);
            }
            return arr;
        },
        optionsLen: function optionsLen() {
            return this.cOptions && Object.keys(this.cOptions).length;
        },
        enabledOptionsLength: function enabledOptionsLength() {
            var count = 0;
            this.cOptions.forEach(function (item) {
                if (!item.disabled) {
                    count++;
                }
            });
            return count;
        },
        selectedItems: function selectedItems() {
            var _this2 = this;

            // 关键点! 每次选择vm都可能被改写为字符串,所以每次都需要检查类型，保证是数组
            if (!Array.isArray(this.vm)) {
                this.vm = [this.vm];
            }
            if (this.vm.length === 0) return;

            // patch for selectAll 1
            if (this.showSelectAllOption && this.vm.indexOf(this.selectAllOptionValue) >= 0) {
                if (this.selectAllBehavior === 'semantic') {
                    return this.selectAllOptionLabel;
                } else {
                    if (this.currentItem === this.selectAllOptionValue) {
                        this.vm = [];
                        this.vm.push(this.selectAllOptionValue);
                        this.vm = this.cOptionsAllArr;
                    }
                }
            }
            if (this.vm.length < 4) {
                var foundItems = [];
                for (var i = 0; i < this.optionsLen; i++) {
                    this.vm.forEach(function (item, index) {
                        if (item == _this2.cOptions[i].value) {
                            foundItems.push(_this2.cOptions[i].label);
                        }
                    });
                }
                // 最终结果的显示
                if (foundItems.length < 4) {
                    return foundItems.join(', ');
                }
            } else {
                return '已选' + this.vm.length + '项';
            }
        },
        showPlaceholder: function showPlaceholder() {
            return Array.isArray(this.vm) && this.vm.length === 0;
        }
    },
    watch: {
        value: {
            immediate: true,
            deep: true,
            handler: function handler(value) {
                var _this3 = this;

                // 0720: fix noData init crash...
                if (value == null) {
                    return;
                }

                if (value === '') {
                    this.vm = [];
                    return;
                }

                if (this.type === '__NOTINIT__' && Array.isArray(value)) {
                    this.type = 'Array';
                }

                if (this.type === '__NOTINIT__' && !Array.isArray(value)) {
                    // 不区分是字符串还是数字(很多时候其实是数字，但是初始化给了字符串比如ls里取的)
                    this.type = 'noArray';
                }

                // 强制vm为数组
                this.vm = this.type === 'Array' ? value.slice(0) : [value];
                if (this.type === 'noArray' && typeof value === 'string' && typeof value === 'string' && this.value.indexOf(',') >= 0) {
                    this.vm = value.replace(/\s/, '').split(',');
                }
                // 对付初始化值就是全部的等待异步获取的options完毕的情况
                var vv = this.type === 'Array' ? value[0] : value;
                // if (this.showSelectAllOption && (vv === this.selectAllOptionValue) ) {
                // bug fix 0907, remove showSelectAllOption
                if (vv === this.selectAllOptionValue) {

                    this.currentItem = this.selectAllOptionValue;

                    this.select(vv);
                    this.$watch('options', function (val) {
                        _this3.select(vv);
                        _this3.reWriteValue();
                    });
                }

                if (Array.isArray(this.vm) && this.vm.length > 1 && !this.multiple) {
                    console.warn('pass ' + this.vm.length + ' values while multiple is false!');
                }
            }
        },
        vm: {
            deep: true,
            immediate: true,
            handler: function handler(vm) {
                var _this4 = this;

                if (!Array.isArray(vm)) {
                    console.warn('[vc-select warn]: should be Array');
                    return;
                }

                if (vm.length === 0) {
                    this.selectedOptions = [];
                    return;
                }
                if (vm.length > this.limit) {
                    this.showNotify = true;
                    this.vm = this.vm.slice(0, this.limit);
                    this.reWriteValue();
                    setTimeout(function () {
                        _this4.showNotify = false;
                    }, 1000);
                }
                if (!this.cOptions) return;
                this.selectedOptions = this.cOptions.filter(function (item, index) {
                    if (vm && !Array.isArray(vm)) {
                        vm = vm.split(',');
                    }
                    return vm.some(function (option) {
                        return option == item.value;
                    });
                });
            }
        },
        show: function show(val) {
            this.searchText = '';
            var msg = {
                action: val ? 'show' : 'hide',
                data: this
            };
            if (val) {
                this.$dispatch(COMPONENT_NS, msg, name);
                this.onShow && this.onShow();
            } else {
                // core: 回写value
                if (this.lazy) {
                    this.reWriteValue();
                }
                this.$dispatch(COMPONENT_NS, msg, name);
                this.onHide && this.onHide();
            }
        }
    },
    methods: {
        includes: function includes(val) {
            if (Array.isArray(this.vm)) {
                return this.vm.some(function (item, index) {
                    return String(item) === String(val); // 非严格类型匹配,替换模板中使用原生indexOf
                });
            }
        },

        /*
         * 每次vm有变化的时候需要reWrite value
         */
        reWriteValue: function reWriteValue() {
            if (this.type === 'Array') {
                this.value = this.vm.slice(0);
            } else {
                if (this.vm.length === 1) {
                    this.value = this.vm.slice(0)[0];
                } else if (this.vm.length > 1) {
                    this.value = this.vm.slice(0).join(',');
                } else {
                    // 0809: fix vm = [] bug, not trigger to reWrite value
                    this.value = '';
                }
            }
            // this.$parent.value = this.value.slice(0)
        },

        // 在立即同步模式下，最后会调用reWriteValue方法将vm同步至value
        select: function select(v, disabled) {
            if (disabled) return;
            this.currentItem = v;
            // patch for selectAll 2, 正好选了'全部'这一项
            // if (this.showSelectAllOption && (v === this.selectAllOptionValue) && this.mutual) {
            // bug fix 0907, remove showSelectAllOption
            if (v === this.selectAllOptionValue && this.mutual) {
                if (!this.multiple) {
                    this.$emit('closeSelectList');
                }

                if (this.selectAllBehavior === 'semantic') {
                    this.vm = [this.selectAllOptionValue];
                } else {
                    // allChecked
                    // if (this.vm.length < this.optionsLen) { // 如果不在全部选择状态下则全选
                    if (this.vm.length < this.enabledOptionsLength) {
                        // 如果不在全部选择状态下则全选
                        this.vm = [];
                        for (var i = 0; i < this.optionsLen; i++) {
                            if (!this.cOptions[i].disabled) {
                                this.vm.push(this.cOptions[i].value);
                            }
                        }
                    } else {
                        // toggle到全不选
                        this.vm = [];
                    }
                }
            } else {
                // patch for selectAll 3, 选了全部，这时又选了其他，则清除'全选'这一项
                if (this.mutual && this.vm.indexOf(this.selectAllOptionValue) >= 0 && this.selectAllBehavior === 'semantic') {
                    this.vm = [];
                }

                // if (this.vm.indexOf(v) === -1) {
                if (!this.includes(v)) {
                    if (this.multiple) {
                        this.vm.push(v);
                    } else {
                        this.vm = [v];
                    }
                } else {
                    if (this.multiple) {
                        this.vm.$remove(v);
                    }
                }

                // 使得closeOnSelect配置只作用于单选,为了更好体验
                if (this.closeOnSelect && !this.multiple) {
                    this.toggleDropdown();
                }
            }

            var msg = {
                action: 'onSelect',
                data: this.dispatchArgs
            };
            this.$dispatch(COMPONENT_NS, msg, this.name);
            this.onSelect && this.onSelect();

            // core: 回写value
            if (this.showSelectAllOption && this.selectAllBehavior === 'semantic') {
                if (!this.lazy) {
                    console.warn('[vc-select warn]: `semantic` 模式下必须选择 `lazy` 模式来同步value');
                    return;
                }
            }
            if (!this.lazy || !this.show) {
                // `tags`模式下直接删除要同步vm, update 1215
                this.reWriteValue();
            }
        },
        toggleDropdown: function toggleDropdown() {
            var _this5 = this;

            // toggle本组件
            this.show = !this.show;
            var root = this.$root || [];
            // 并且关闭其他组件
            root['vc-select-pool'].forEach(function (item) {
                if (item.uuid !== _this5.uuid) {
                    item.show = false;
                }
            });
        }
    },
    events: {
        closeSelectList: function closeSelectList() {
            this.show = false;
        }
    }
};

Select.vcOption = _Option2.default;

exports.default = Select;
// </script>

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

__webpack_require__(5)
module.exports = __webpack_require__(11)

if (module.exports.__esModule) module.exports = module.exports.default
;(typeof module.exports === "function" ? module.exports.options : module.exports).template = __webpack_require__(9)
if (false) {
(function () {
var hotAPI = require("vue-hot-reload-api")
hotAPI.install(require("vue"))
if (!hotAPI.compatible) return
var id = "-!babel!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=script&index=0!./Option.vue"
hotAPI.createRecord(id, module.exports)
module.hot.accept(["-!babel!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=script&index=0!./Option.vue","-!vue-html-loader!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=template&index=0!./Option.vue"], function () {
var newOptions = require("-!babel!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=script&index=0!./Option.vue")
if (newOptions && newOptions.__esModule) newOptions = newOptions.default
var newTemplate = require("-!vue-html-loader!./../../node_modules/.7.1.7@vue-loader/lib/selector.js?type=template&index=0!./Option.vue")
hotAPI.update(id, newOptions, newTemplate)
})
})()
}

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

"use strict";
'use strict';

var _Select = __webpack_require__(4);

var _Select2 = _interopRequireDefault(_Select);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = _Select2.default;

/***/ }
/******/ ])
});
;
//# sourceMappingURL=build.js.map