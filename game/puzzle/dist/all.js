/*!
 * jQuery JavaScript Library v1.7.1
 * http://jquery.com/
 *
 * Copyright 2011, John Resig
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 * Copyright 2011, The Dojo Foundation
 * Released under the MIT, BSD, and GPL Licenses.
 *
 * Date: Mon Nov 21 21:11:03 2011 -0500
 */
(function(window, undefined) {

	// Use the correct document accordingly with window argument (sandbox)
	var document = window.document, navigator = window.navigator, location = window.location;
	var jQuery = (function() {

		// Define a local copy of jQuery
		var jQuery = function(selector, context) {
			// The jQuery object is actually just the init constructor 'enhanced'
			return new jQuery.fn.init(selector, context, rootjQuery);
		},

		// Map over jQuery in case of overwrite
		_jQuery = window.jQuery,

		// Map over the $ in case of overwrite
		_$ = window.$,

		// A central reference to the root jQuery(document)
		rootjQuery,

		// A simple way to check for HTML strings or ID strings
		// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
		quickExpr = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/,

		// Check if a string has a non-whitespace character in it
		rnotwhite = /\S/,

		// Used for trimming whitespace
		trimLeft = /^\s+/, trimRight = /\s+$/,

		// Match a standalone tag
		rsingleTag = /^<(\w+)\s*\/?>(?:<\/\1>)?$/,

		// JSON RegExp
		rvalidchars = /^[\],:{}\s]*$/, rvalidescape = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, rvalidtokens = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, rvalidbraces = /(?:^|:|,)(?:\s*\[)+/g,

		// Useragent RegExp
		rwebkit = /(webkit)[ \/]([\w.]+)/, ropera = /(opera)(?:.*version)?[ \/]([\w.]+)/, rmsie = /(msie) ([\w.]+)/, rmozilla = /(mozilla)(?:.*? rv:([\w.]+))?/,

		// Matches dashed string for camelizing
		rdashAlpha = /-([a-z]|[0-9])/ig, rmsPrefix = /^-ms-/,

		// Used by jQuery.camelCase as callback to replace()
		fcamelCase = function(all, letter) {
			return (letter + "" ).toUpperCase();
		},

		// Keep a UserAgent string for use with jQuery.browser
		userAgent = navigator.userAgent,

		// For matching the engine and version of the browser
		browserMatch,

		// The deferred used on DOM ready
		readyList,

		// The ready event handler
		DOMContentLoaded,

		// Save a reference to some core methods
		toString = Object.prototype.toString, hasOwn = Object.prototype.hasOwnProperty, push = Array.prototype.push, slice = Array.prototype.slice, trim = String.prototype.trim, indexOf = Array.prototype.indexOf,

		// [[Class]] -> type pairs
		class2type = {};

		jQuery.fn = jQuery.prototype = {
			constructor : jQuery,
			init : function(selector, context, rootjQuery) {
				var match, elem, ret, doc;

				// Handle $(""), $(null), or $(undefined)
				if (!selector) {
					return this;
				}

				// Handle $(DOMElement)
				if (selector.nodeType) {
					this.context = this[0] = selector;
					this.length = 1;
					return this;
				}

				// The body element only exists once, optimize finding it
				if (selector === "body" && !context && document.body) {
					this.context = document;
					this[0] = document.body;
					this.selector = selector;
					this.length = 1;
					return this;
				}

				// Handle HTML strings
				if ( typeof selector === "string") {
					// Are we dealing with HTML string or an ID?
					if (selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
						// Assume that strings that start and end with <> are HTML and skip the regex check
						match = [null, selector, null];

					} else {
						match = quickExpr.exec(selector);
					}

					// Verify a match, and that no context was specified for #id
					if (match && (match[1] || !context)) {

						// HANDLE: $(html) -> $(array)
						if (match[1]) {
							context = context instanceof jQuery ? context[0] : context;
							doc = ( context ? context.ownerDocument || context : document );

							// If a single string is passed in and it's a single tag
							// just do a createElement and skip the rest
							ret = rsingleTag.exec(selector);

							if (ret) {
								if (jQuery.isPlainObject(context)) {
									selector = [document.createElement(ret[1])];
									jQuery.fn.attr.call(selector, context, true);

								} else {
									selector = [doc.createElement(ret[1])];
								}

							} else {
								ret = jQuery.buildFragment([match[1]], [doc]);
								selector = (ret.cacheable ? jQuery.clone(ret.fragment) : ret.fragment ).childNodes;
							}

							return jQuery.merge(this, selector);

							// HANDLE: $("#id")
						} else {
							elem = document.getElementById(match[2]);

							// Check parentNode to catch when Blackberry 4.6 returns
							// nodes that are no longer in the document #6963
							if (elem && elem.parentNode) {
								// Handle the case where IE and Opera return items
								// by name instead of ID
								if (elem.id !== match[2]) {
									return rootjQuery.find(selector);
								}

								// Otherwise, we inject the element directly into the jQuery object
								this.length = 1;
								this[0] = elem;
							}

							this.context = document;
							this.selector = selector;
							return this;
						}

						// HANDLE: $(expr, $(...))
					} else if (!context || context.jquery) {
						return (context || rootjQuery ).find(selector);

						// HANDLE: $(expr, context)
						// (which is just equivalent to: $(context).find(expr)
					} else {
						return this.constructor(context).find(selector);
					}

					// HANDLE: $(function)
					// Shortcut for document ready
				} else if (jQuery.isFunction(selector)) {
					return rootjQuery.ready(selector);
				}

				if (selector.selector !== undefined) {
					this.selector = selector.selector;
					this.context = selector.context;
				}

				return jQuery.makeArray(selector, this);
			},

			// Start with an empty selector
			selector : "",

			// The current version of jQuery being used
			jquery : "1.7.1",

			// The default length of a jQuery object is 0
			length : 0,

			// The number of elements contained in the matched element set
			size : function() {
				return this.length;
			},

			toArray : function() {
				return slice.call(this, 0);
			},

			// Get the Nth element in the matched element set OR
			// Get the whole matched element set as a clean array
			get : function(num) {
				return num == null ?

				// Return a 'clean' array
				this.toArray() :

				// Return just the object
				(num < 0 ? this[this.length + num] : this[num] );
			},

			// Take an array of elements and push it onto the stack
			// (returning the new matched element set)
			pushStack : function(elems, name, selector) {
				// Build a new jQuery matched element set
				var ret = this.constructor();

				if (jQuery.isArray(elems)) {
					push.apply(ret, elems);

				} else {
					jQuery.merge(ret, elems);
				}

				// Add the old object onto the stack (as a reference)
				ret.prevObject = this;

				ret.context = this.context;

				if (name === "find") {
					ret.selector = this.selector + (this.selector ? " " : "" ) + selector;
				} else if (name) {
					ret.selector = this.selector + "." + name + "(" + selector + ")";
				}

				// Return the newly-formed element set
				return ret;
			},

			// Execute a callback for every element in the matched set.
			// (You can seed the arguments with an array of args, but this is
			// only used internally.)
			each : function(callback, args) {
				return jQuery.each(this, callback, args);
			},

			ready : function(fn) {
				// Attach the listeners
				jQuery.bindReady();

				// Add the callback
				readyList.add(fn);

				return this;
			},

			eq : function(i) {
				i = +i;
				return i === -1 ? this.slice(i) : this.slice(i, i + 1);
			},

			first : function() {
				return this.eq(0);
			},

			last : function() {
				return this.eq(-1);
			},

			slice : function() {
				return this.pushStack(slice.apply(this, arguments), "slice", slice.call(arguments).join(","));
			},

			map : function(callback) {
				return this.pushStack(jQuery.map(this, function(elem, i) {
					return callback.call(elem, i, elem);
				}));
			},

			end : function() {
				return this.prevObject || this.constructor(null);
			},

			// For internal use only.
			// Behaves like an Array's method, not like a jQuery method.
			push : push,
			sort : [].sort,
			splice : [].splice
		};

		// Give the init function the jQuery prototype for later instantiation
		jQuery.fn.init.prototype = jQuery.fn;

		jQuery.extend = jQuery.fn.extend = function() {
			var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;

			// Handle a deep copy situation
			if ( typeof target === "boolean") {
				deep = target;
				target = arguments[1] || {};
				// skip the boolean and the target
				i = 2;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && !jQuery.isFunction(target)) {
				target = {};
			}

			// extend jQuery itself if only one argument is passed
			if (length === i) {
				target = this; --i;
			}

			for (; i < length; i++) {
				// Only deal with non-null/undefined values
				if (( options = arguments[i]) != null) {
					// Extend the base object
					for (name in options ) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (jQuery.isPlainObject(copy) || ( copyIsArray = jQuery.isArray(copy)) )) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && jQuery.isArray(src) ? src : [];

							} else {
								clone = src && jQuery.isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = jQuery.extend(deep, clone, copy);

							// Don't bring in undefined values
						} else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		};

		jQuery.extend({
			noConflict : function(deep) {
				if (window.$ === jQuery) {
					window.$ = _$;
				}

				if (deep && window.jQuery === jQuery) {
					window.jQuery = _jQuery;
				}

				return jQuery;
			},

			// Is the DOM ready to be used? Set to true once it occurs.
			isReady : false,

			// A counter to track how many items to wait for before
			// the ready event fires. See #6781
			readyWait : 1,

			// Hold (or release) the ready event
			holdReady : function(hold) {
				if (hold) {
					jQuery.readyWait++;
				} else {
					jQuery.ready(true);
				}
			},

			// Handle when the DOM is ready
			ready : function(wait) {
				// Either a released hold or an DOMready/load event and not yet ready
				if ((wait === true && !--jQuery.readyWait) || (wait !== true && !jQuery.isReady)) {
					// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
					if (!document.body) {
						return setTimeout(jQuery.ready, 1);
					}

					// Remember that the DOM is ready
					jQuery.isReady = true;

					// If a normal DOM Ready event fired, decrement, and wait if need be
					if (wait !== true && --jQuery.readyWait > 0) {
						return;
					}

					// If there are functions bound, to execute
					readyList.fireWith(document, [jQuery]);

					// Trigger any bound ready events
					if (jQuery.fn.trigger) {
						jQuery(document).trigger("ready").off("ready");
					}
				}
			},

			bindReady : function() {
				if (readyList) {
					return;
				}

				readyList = jQuery.Callbacks("once memory");

				// Catch cases where $(document).ready() is called after the
				// browser event has already occurred.
				if (document.readyState === "complete") {
					// Handle it asynchronously to allow scripts the opportunity to delay ready
					return setTimeout(jQuery.ready, 1);
				}

				// Mozilla, Opera and webkit nightlies currently support this event
				if (document.addEventListener) {
					// Use the handy event callback
					document.addEventListener("DOMContentLoaded", DOMContentLoaded, false);

					// A fallback to window.onload, that will always work
					window.addEventListener("load", jQuery.ready, false);

					// If IE event model is used
				} else if (document.attachEvent) {
					// ensure firing before onload,
					// maybe late but safe also for iframes
					document.attachEvent("onreadystatechange", DOMContentLoaded);

					// A fallback to window.onload, that will always work
					window.attachEvent("onload", jQuery.ready);

					// If IE and not a frame
					// continually check to see if the document is ready
					var toplevel = false;

					try {
						toplevel = window.frameElement == null;
					} catch(e) {
					}

					if (document.documentElement.doScroll && toplevel) {
						doScrollCheck();
					}
				}
			},

			// See test/unit/core.js for details concerning isFunction.
			// Since version 1.3, DOM methods and functions like alert
			// aren't supported. They return false on IE (#2968).
			isFunction : function(obj) {
				return jQuery.type(obj) === "function";
			},

			isArray : Array.isArray ||
			function(obj) {
				return jQuery.type(obj) === "array";
			},

			// A crude way of determining if an object is a window
			isWindow : function(obj) {
				return obj && typeof obj === "object" && "setInterval" in obj;
			},

			isNumeric : function(obj) {
				return !isNaN(parseFloat(obj)) && isFinite(obj);
			},

			type : function(obj) {
				return obj == null ? String(obj) : class2type[ toString.call(obj)] || "object";
			},

			isPlainObject : function(obj) {
				// Must be an Object.
				// Because of IE, we also have to check the presence of the constructor property.
				// Make sure that DOM nodes and window objects don't pass through, as well
				if (!obj || jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
					return false;
				}

				try {
					// Not own constructor property must be Object
					if (obj.constructor && !hasOwn.call(obj, "constructor") && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
						return false;
					}
				} catch ( e ) {
					// IE8,9 Will throw exceptions on certain host objects #9897
					return false;
				}

				// Own properties are enumerated firstly, so to speed up,
				// if last one is own, then all properties are own.

				var key;
				for (key in obj ) {
				}

				return key === undefined || hasOwn.call(obj, key);
			},

			isEmptyObject : function(obj) {
				for (var name in obj ) {
					return false;
				}
				return true;
			},

			error : function(msg) {
				throw new Error(msg);
			},

			parseJSON : function(data) {
				if ( typeof data !== "string" || !data) {
					return null;
				}

				// Make sure leading/trailing whitespace is removed (IE can't handle it)
				data = jQuery.trim(data);

				// Attempt to parse using the native JSON parser first
				if (window.JSON && window.JSON.parse) {
					return window.JSON.parse(data);
				}

				// Make sure the incoming data is actual JSON
				// Logic borrowed from http://json.org/json2.js
				if (rvalidchars.test(data.replace(rvalidescape, "@").replace(rvalidtokens, "]").replace(rvalidbraces, ""))) {

					return (new Function("return " + data) )();

				}
				jQuery.error("Invalid JSON: " + data);
			},

			// Cross-browser xml parsing
			parseXML : function(data) {
				var xml, tmp;
				try {
					if (window.DOMParser) {// Standard
						tmp = new DOMParser();
						xml = tmp.parseFromString(data, "text/xml");
					} else {// IE
						xml = new ActiveXObject("Microsoft.XMLDOM");
						xml.async = "false";
						xml.loadXML(data);
					}
				} catch( e ) {
					xml = undefined;
				}
				if (!xml || !xml.documentElement || xml.getElementsByTagName("parsererror").length) {
					jQuery.error("Invalid XML: " + data);
				}
				return xml;
			},

			noop : function() {
			},

			// Evaluates a script in a global context
			// Workarounds based on findings by Jim Driscoll
			// http://weblogs.java.net/blog/driscoll/archive/2009/09/08/eval-javascript-global-context
			globalEval : function(data) {
				if (data && rnotwhite.test(data)) {
					// We use execScript on Internet Explorer
					// We use an anonymous function so that context is window
					// rather than jQuery in Firefox
					(window.execScript ||
					function(data) {
						window["eval"].call(window, data);
					} )(data);
				}
			},

			// Convert dashed to camelCase; used by the css and data modules
			// Microsoft forgot to hump their vendor prefix (#9572)
			camelCase : function(string) {
				return string.replace(rmsPrefix, "ms-").replace(rdashAlpha, fcamelCase);
			},

			nodeName : function(elem, name) {
				return elem.nodeName && elem.nodeName.toUpperCase() === name.toUpperCase();
			},

			// args is for internal usage only
			each : function(object, callback, args) {
				var name, i = 0, length = object.length, isObj = length === undefined || jQuery.isFunction(object);

				if (args) {
					if (isObj) {
						for (name in object ) {
							if (callback.apply(object[name], args) === false) {
								break;
							}
						}
					} else {
						for (; i < length; ) {
							if (callback.apply(object[i++], args) === false) {
								break;
							}
						}
					}

					// A special, fast, case for the most common use of each
				} else {
					if (isObj) {
						for (name in object ) {
							if (callback.call(object[name], name, object[name]) === false) {
								break;
							}
						}
					} else {
						for (; i < length; ) {
							if (callback.call(object[i], i, object[i++]) === false) {
								break;
							}
						}
					}
				}

				return object;
			},

			// Use native String.trim function wherever possible
			trim : trim ? function(text) {
				return text == null ? "" : trim.call(text);
			} :

			// Otherwise use our own trimming functionality
			function(text) {
				return text == null ? "" : text.toString().replace(trimLeft, "").replace(trimRight, "");
			},

			// results is for internal usage only
			makeArray : function(array, results) {
				var ret = results || [];

				if (array != null) {
					// The window, strings (and functions) also have 'length'
					// Tweaked logic slightly to handle Blackberry 4.7 RegExp issues #6930
					var type = jQuery.type(array);

					if (array.length == null || type === "string" || type === "function" || type === "regexp" || jQuery.isWindow(array)) {
						push.call(ret, array);
					} else {
						jQuery.merge(ret, array);
					}
				}

				return ret;
			},

			inArray : function(elem, array, i) {
				var len;

				if (array) {
					if (indexOf) {
						return indexOf.call(array, elem, i);
					}

					len = array.length;
					i = i ? i < 0 ? Math.max(0, len + i) : i : 0;

					for (; i < len; i++) {
						// Skip accessing in sparse arrays
						if ( i in array && array[i] === elem) {
							return i;
						}
					}
				}

				return -1;
			},

			merge : function(first, second) {
				var i = first.length, j = 0;

				if ( typeof second.length === "number") {
					for (var l = second.length; j < l; j++) {
						first[i++] = second[j];
					}

				} else {
					while (second[j] !== undefined) {
						first[i++] = second[j++];
					}
				}

				first.length = i;

				return first;
			},

			grep : function(elems, callback, inv) {
				var ret = [], retVal;
				inv = !!inv;

				// Go through the array, only saving the items
				// that pass the validator function
				for (var i = 0, length = elems.length; i < length; i++) {
					retVal = !!callback(elems[i], i);
					if (inv !== retVal) {
						ret.push(elems[i]);
					}
				}

				return ret;
			},

			// arg is for internal usage only
			map : function(elems, callback, arg) {
				var value, key, ret = [], i = 0, length = elems.length,
				// jquery objects are treated as arrays
				isArray = elems instanceof jQuery || length !== undefined && typeof length === "number" && ((length > 0 && elems[0] && elems[length - 1] ) || length === 0 || jQuery.isArray(elems) );

				// Go through the array, translating each of the items to their
				if (isArray) {
					for (; i < length; i++) {
						value = callback(elems[i], i, arg);

						if (value != null) {
							ret[ret.length] = value;
						}
					}

					// Go through every key on the object,
				} else {
					for (key in elems ) {
						value = callback(elems[key], key, arg);

						if (value != null) {
							ret[ret.length] = value;
						}
					}
				}

				// Flatten any nested arrays
				return ret.concat.apply([], ret);
			},

			// A global GUID counter for objects
			guid : 1,

			// Bind a function to a context, optionally partially applying any
			// arguments.
			proxy : function(fn, context) {
				if ( typeof context === "string") {
					var tmp = fn[context];
					context = fn;
					fn = tmp;
				}

				// Quick check to determine if target is callable, in the spec
				// this throws a TypeError, but we will just return undefined.
				if (!jQuery.isFunction(fn)) {
					return undefined;
				}

				// Simulated bind
				var args = slice.call(arguments, 2), proxy = function() {
					return fn.apply(context, args.concat(slice.call(arguments)));
				};

				// Set the guid of unique handler to the same of original handler, so it can be removed
				proxy.guid = fn.guid = fn.guid || proxy.guid || jQuery.guid++;

				return proxy;
			},

			// Mutifunctional method to get and set values to a collection
			// The value/s can optionally be executed if it's a function
			access : function(elems, key, value, exec, fn, pass) {
				var length = elems.length;

				// Setting many attributes
				if ( typeof key === "object") {
					for (var k in key ) {
						jQuery.access(elems, k, key[k], exec, fn, value);
					}
					return elems;
				}

				// Setting one attribute
				if (value !== undefined) {
					// Optionally, function values get executed if exec is true
					exec = !pass && exec && jQuery.isFunction(value);

					for (var i = 0; i < length; i++) {
						fn(elems[i], key, exec ? value.call(elems[i], i, fn(elems[i], key)) : value, pass);
					}

					return elems;
				}

				// Getting an attribute
				return length ? fn(elems[0], key) : undefined;
			},

			now : function() {
				return (new Date() ).getTime();
			},

			// Use of jQuery.browser is frowned upon.
			// More details: http://docs.jquery.com/Utilities/jQuery.browser
			uaMatch : function(ua) {
				ua = ua.toLowerCase();

				var match = rwebkit.exec(ua) || ropera.exec(ua) || rmsie.exec(ua) || ua.indexOf("compatible") < 0 && rmozilla.exec(ua) || [];

				return {
					browser : match[1] || "",
					version : match[2] || "0"
				};
			},

			sub : function() {
				function jQuerySub(selector, context) {
					return new jQuerySub.fn.init(selector, context);
				}


				jQuery.extend(true, jQuerySub, this);
				jQuerySub.superclass = this;
				jQuerySub.fn = jQuerySub.prototype = this();
				jQuerySub.fn.constructor = jQuerySub;
				jQuerySub.sub = this.sub;
				jQuerySub.fn.init = function init(selector, context) {
					if (context && context instanceof jQuery && !( context instanceof jQuerySub)) {
						context = jQuerySub(context);
					}

					return jQuery.fn.init.call(this, selector, context, rootjQuerySub);
				};
				jQuerySub.fn.init.prototype = jQuerySub.fn;
				var rootjQuerySub = jQuerySub(document);
				return jQuerySub;
			},

			browser : {}
		});

		// Populate the class2type map
		jQuery.each("Boolean Number String Function Array Date RegExp Object".split(" "), function(i, name) {
			class2type["[object " + name + "]"] = name.toLowerCase();
		});

		browserMatch = jQuery.uaMatch(userAgent);
		if (browserMatch.browser) {
			jQuery.browser[browserMatch.browser] = true;
			jQuery.browser.version = browserMatch.version;
		}

		// Deprecated, use jQuery.browser.webkit instead
		if (jQuery.browser.webkit) {
			jQuery.browser.safari = true;
		}

		// IE doesn't match non-breaking spaces with \s
		if (rnotwhite.test("\xA0")) {
			trimLeft = /^[\s\xA0]+/;
			trimRight = /[\s\xA0]+$/;
		}

		// All jQuery objects should point back to these
		rootjQuery = jQuery(document);

		// Cleanup functions for the document ready method
		if (document.addEventListener) {
			DOMContentLoaded = function() {
				document.removeEventListener("DOMContentLoaded", DOMContentLoaded, false);
				jQuery.ready();
			};

		} else if (document.attachEvent) {
			DOMContentLoaded = function() {
				// Make sure body exists, at least, in case IE gets a little overzealous (ticket #5443).
				if (document.readyState === "complete") {
					document.detachEvent("onreadystatechange", DOMContentLoaded);
					jQuery.ready();
				}
			};
		}

		// The DOM ready check for Internet Explorer
		function doScrollCheck() {
			if (jQuery.isReady) {
				return;
			}

			try {
				// If IE is used, use the trick by Diego Perini
				// http://javascript.nwbox.com/IEContentLoaded/
				document.documentElement.doScroll("left");
			} catch(e) {
				setTimeout(doScrollCheck, 1);
				return;
			}

			// and execute any waiting functions
			jQuery.ready();
		}

		return jQuery;

	})();

	// String to Object flags format cache
	var flagsCache = {};

	// Convert String-formatted flags into Object-formatted ones and store in cache
	function createFlags(flags) {
		var object = flagsCache[flags] = {}, i, length;
		flags = flags.split(/\s+/);
		for ( i = 0, length = flags.length; i < length; i++) {
			object[flags[i]] = true;
		}
		return object;
	}

	/*
	 * Create a callback list using the following parameters:
	 *
	 *	flags:	an optional list of space-separated flags that will change how
	 *			the callback list behaves
	 *
	 * By default a callback list will act like an event callback list and can be
	 * "fired" multiple times.
	 *
	 * Possible flags:
	 *
	 *	once:			will ensure the callback list can only be fired once (like a Deferred)
	 *
	 *	memory:			will keep track of previous values and will call any callback added
	 *					after the list has been fired right away with the latest "memorized"
	 *					values (like a Deferred)
	 *
	 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
	 *
	 *	stopOnFalse:	interrupt callings when a callback returns false
	 *
	 */
	jQuery.Callbacks = function(flags) {

		// Convert flags from String-formatted to Object-formatted
		// (we check in cache first)
		flags = flags ? (flagsCache[flags] || createFlags(flags) ) : {};

		var// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = [],
		// Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Add one or several callbacks to the list
		add = function(args) {
			var i, length, elem, type, actual;
			for ( i = 0, length = args.length; i < length; i++) {
				elem = args[i];
				type = jQuery.type(elem);
				if (type === "array") {
					// Inspect recursively
					add(elem);
				} else if (type === "function") {
					// Add if not in unique mode and callback is not in
					if (!flags.unique || !self.has(elem)) {
						list.push(elem);
					}
				}
			}
		},
		// Fire callbacks
		fire = function(context, args) {
			args = args || [];
			memory = !flags.memory || [context, args];
			firing = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			for (; list && firingIndex < firingLength; firingIndex++) {
				if (list[firingIndex].apply(context, args) === false && flags.stopOnFalse) {
					memory = true;
					// Mark as halted
					break;
				}
			}
			firing = false;
			if (list) {
				if (!flags.once) {
					if (stack && stack.length) {
						memory = stack.shift();
						self.fireWith(memory[0], memory[1]);
					}
				} else if (memory === true) {
					self.disable();
				} else {
					list = [];
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add : function() {
				if (list) {
					var length = list.length;
					add(arguments);
					// Do we need to add the callbacks to the
					// current firing batch?
					if (firing) {
						firingLength = list.length;
						// With memory, if we're not firing then
						// we should call right away, unless previous
						// firing was halted (stopOnFalse)
					} else if (memory && memory !== true) {
						firingStart = length;
						fire(memory[0], memory[1]);
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove : function() {
				if (list) {
					var args = arguments, argIndex = 0, argLength = args.length;
					for (; argIndex < argLength; argIndex++) {
						for (var i = 0; i < list.length; i++) {
							if (args[argIndex] === list[i]) {
								// Handle firingIndex and firingLength
								if (firing) {
									if (i <= firingLength) {
										firingLength--;
										if (i <= firingIndex) {
											firingIndex--;
										}
									}
								}
								// Remove the element
								list.splice(i--, 1);
								// If we have some unicity property then
								// we only need to do this once
								if (flags.unique) {
									break;
								}
							}
						}
					}
				}
				return this;
			},
			// Control if a given callback is in the list
			has : function(fn) {
				if (list) {
					var i = 0, length = list.length;
					for (; i < length; i++) {
						if (fn === list[i]) {
							return true;
						}
					}
				}
				return false;
			},
			// Remove all callbacks from the list
			empty : function() {
				list = [];
				return this;
			},
			// Have the list do nothing anymore
			disable : function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled : function() {
				return !list;
			},
			// Lock the list in its current state
			lock : function() {
				stack = undefined;
				if (!memory || memory === true) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked : function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith : function(context, args) {
				if (stack) {
					if (firing) {
						if (!flags.once) {
							stack.push([context, args]);
						}
					} else if (!(flags.once && memory )) {
						fire(context, args);
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire : function() {
				self.fireWith(this, arguments);
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired : function() {
				return !!memory;
			}
		};

		return self;
	};

	var// Static reference to slice
	sliceDeferred = [].slice;

	jQuery.extend({

		Deferred : function(func) {
			var doneList = jQuery.Callbacks("once memory"), failList = jQuery.Callbacks("once memory"), progressList = jQuery.Callbacks("memory"), state = "pending", lists = {
				resolve : doneList,
				reject : failList,
				notify : progressList
			}, promise = {
				done : doneList.add,
				fail : failList.add,
				progress : progressList.add,

				state : function() {
					return state;
				},

				// Deprecated
				isResolved : doneList.fired,
				isRejected : failList.fired,

				then : function(doneCallbacks, failCallbacks, progressCallbacks) {
					deferred.done(doneCallbacks).fail(failCallbacks).progress(progressCallbacks);
					return this;
				},
				always : function() {
					deferred.done.apply(deferred, arguments).fail.apply(deferred, arguments);
					return this;
				},
				pipe : function(fnDone, fnFail, fnProgress) {
					return jQuery.Deferred(function(newDefer) {
						jQuery.each({
							done : [fnDone, "resolve"],
							fail : [fnFail, "reject"],
							progress : [fnProgress, "notify"]
						}, function(handler, data) {
							var fn = data[0], action = data[1], returned;
							if (jQuery.isFunction(fn)) {
								deferred[ handler ](function() {
									returned = fn.apply(this, arguments);
									if (returned && jQuery.isFunction(returned.promise)) {
										returned.promise().then(newDefer.resolve, newDefer.reject, newDefer.notify);
									} else {
										newDefer[ action + "With" ](this === deferred ? newDefer : this, [returned]);
									}
								});
							} else {
								deferred[ handler ](newDefer[action]);
							}
						});
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise : function(obj) {
					if (obj == null) {
						obj = promise;
					} else {
						for (var key in promise ) {
							obj[key] = promise[key];
						}
					}
					return obj;
				}
			}, deferred = promise.promise({}), key;

			for (key in lists ) {
				deferred[key] = lists[key].fire;
				deferred[key + "With"] = lists[key].fireWith;
			}

			// Handle state
			deferred.done(function() {
				state = "resolved";
			}, failList.disable, progressList.lock).fail(function() {
				state = "rejected";
			}, doneList.disable, progressList.lock);

			// Call given func if any
			if (func) {
				func.call(deferred, deferred);
			}

			// All done!
			return deferred;
		},

		// Deferred helper
		when : function(firstParam) {
			var args = sliceDeferred.call(arguments, 0), i = 0, length = args.length, pValues = new Array(length), count = length, pCount = length, deferred = length <= 1 && firstParam && jQuery.isFunction(firstParam.promise) ? firstParam : jQuery.Deferred(), promise = deferred.promise();
			function resolveFunc(i) {
				return function(value) {
					args[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
					if (!(--count )) {
						deferred.resolveWith(deferred, args);
					}
				};
			}

			function progressFunc(i) {
				return function(value) {
					pValues[i] = arguments.length > 1 ? sliceDeferred.call(arguments, 0) : value;
					deferred.notifyWith(promise, pValues);
				};
			}

			if (length > 1) {
				for (; i < length; i++) {
					if (args[i] && args[i].promise && jQuery.isFunction(args[i].promise)) {
						args[i].promise().then(resolveFunc(i), deferred.reject, progressFunc(i));
					} else {--count;
					}
				}
				if (!count) {
					deferred.resolveWith(deferred, args);
				}
			} else if (deferred !== firstParam) {
				deferred.resolveWith(deferred, length ? [firstParam] : []);
			}
			return promise;
		}
	});

	jQuery.support = (function() {

		var support, all, a, select, opt, input, marginDiv, fragment, tds, events, eventName, i, isSupported, div = document.createElement("div"), documentElement = document.documentElement;

		// Preliminary tests
		div.setAttribute("className", "t");
		div.innerHTML = "   <link/><table></table><a href='/a' style='top:1px;float:left;opacity:.55;'>a</a><input type='checkbox'/>";

		all = div.getElementsByTagName("*");
		a = div.getElementsByTagName( "a" )[0];

		// Can't get basic test support
		if (!all || !all.length || !a) {
			return {};
		}

		// First batch of supports tests
		select = document.createElement("select");
		opt = select.appendChild(document.createElement("option"));
		input = div.getElementsByTagName( "input" )[0];

		support = {
			// IE strips leading whitespace when .innerHTML is used
			leadingWhitespace : (div.firstChild.nodeType === 3 ),

			// Make sure that tbody elements aren't automatically inserted
			// IE will insert them into empty tables
			tbody : !div.getElementsByTagName("tbody").length,

			// Make sure that link elements get serialized correctly by innerHTML
			// This requires a wrapper element in IE
			htmlSerialize : !!div.getElementsByTagName("link").length,

			// Get the style information from getAttribute
			// (IE uses .cssText instead)
			style : /top/.test(a.getAttribute("style")),

			// Make sure that URLs aren't manipulated
			// (IE normalizes it by default)
			hrefNormalized : (a.getAttribute("href") === "/a" ),

			// Make sure that element opacity exists
			// (IE uses filter instead)
			// Use a regex to work around a WebKit issue. See #5145
			opacity : /^0.55/.test(a.style.opacity),

			// Verify style float existence
			// (IE uses styleFloat instead of cssFloat)
			cssFloat : !!a.style.cssFloat,

			// Make sure that if no value is specified for a checkbox
			// that it defaults to "on".
			// (WebKit defaults to "" instead)
			checkOn : (input.value === "on" ),

			// Make sure that a selected-by-default option has a working selected property.
			// (WebKit defaults to false instead of true, IE too, if it's in an optgroup)
			optSelected : opt.selected,

			// Test setAttribute on camelCase class. If it works, we need attrFixes when doing get/setAttribute (ie6/7)
			getSetAttribute : div.className !== "t",

			// Tests for enctype support on a form(#6743)
			enctype : !!document.createElement("form").enctype,

			// Makes sure cloning an html5 element does not cause problems
			// Where outerHTML is undefined, this still works
			html5Clone : document.createElement("nav").cloneNode(true).outerHTML !== "<:nav></:nav>",

			// Will be defined later
			submitBubbles : true,
			changeBubbles : true,
			focusinBubbles : false,
			deleteExpando : true,
			noCloneEvent : true,
			inlineBlockNeedsLayout : false,
			shrinkWrapBlocks : false,
			reliableMarginRight : true
		};

		// Make sure checked status is properly cloned
		input.checked = true;
		support.noCloneChecked = input.cloneNode(true).checked;

		// Make sure that the options inside disabled selects aren't marked as disabled
		// (WebKit marks them as disabled)
		select.disabled = true;
		support.optDisabled = !opt.disabled;

		// Test to see if it's possible to delete an expando from an element
		// Fails in Internet Explorer
		try {
			delete div.test;
		} catch( e ) {
			support.deleteExpando = false;
		}

		if (!div.addEventListener && div.attachEvent && div.fireEvent) {
			div.attachEvent("onclick", function() {
				// Cloning a node shouldn't copy over any
				// bound event handlers (IE does this)
				support.noCloneEvent = false;
			});
			div.cloneNode(true).fireEvent("onclick");
		}

		// Check if a radio maintains its value
		// after being appended to the DOM
		input = document.createElement("input");
		input.value = "t";
		input.setAttribute("type", "radio");
		support.radioValue = input.value === "t";

		input.setAttribute("checked", "checked");
		div.appendChild(input);
		fragment = document.createDocumentFragment();
		fragment.appendChild(div.lastChild);

		// WebKit doesn't clone checked state correctly in fragments
		support.checkClone = fragment.cloneNode(true).cloneNode(true).lastChild.checked;

		// Check if a disconnected checkbox will retain its checked
		// value of true after appended to the DOM (IE6/7)
		support.appendChecked = input.checked;

		fragment.removeChild(input);
		fragment.appendChild(div);

		div.innerHTML = "";

		// Check if div with explicit width and no margin-right incorrectly
		// gets computed margin-right based on width of container. For more
		// info see bug #3333
		// Fails in WebKit before Feb 2011 nightlies
		// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
		if (window.getComputedStyle) {
			marginDiv = document.createElement("div");
			marginDiv.style.width = "0";
			marginDiv.style.marginRight = "0";
			div.style.width = "2px";
			div.appendChild(marginDiv);
			support.reliableMarginRight = (parseInt((window.getComputedStyle(marginDiv, null) || {
				marginRight : 0
			} ).marginRight, 10) || 0 ) === 0;
		}

		// Technique from Juriy Zaytsev
		// http://perfectionkills.com/detecting-event-support-without-browser-sniffing/
		// We only care about the case where non-standard event systems
		// are used, namely in IE. Short-circuiting here helps us to
		// avoid an eval call (in setAttribute) which can cause CSP
		// to go haywire. See: https://developer.mozilla.org/en/Security/CSP
		if (div.attachEvent) {
			for (i in {
				submit : 1,
				change : 1,
				focusin : 1
			}) {
				eventName = "on" + i;
				isSupported = ( eventName in div );
				if (!isSupported) {
					div.setAttribute(eventName, "return;");
					isSupported = ( typeof div[eventName] === "function" );
				}
				support[i + "Bubbles"] = isSupported;
			}
		}

		fragment.removeChild(div);

		// Null elements to avoid leaks in IE
		fragment = select = opt = marginDiv = div = input = null;

		// Run tests that need a body at doc ready
		jQuery(function() {
			var container, outer, inner, table, td, offsetSupport, conMarginTop, ptlm, vb, style, html, body = document.getElementsByTagName("body")[0];

			if (!body) {
				// Return for frameset docs that don't have a body
				return;
			}

			conMarginTop = 1;
			ptlm = "position:absolute;top:0;left:0;width:1px;height:1px;margin:0;";
			vb = "visibility:hidden;border:0;";
			style = "style='" + ptlm + "border:5px solid #000;padding:0;'";
			html = "<div " + style + "><div></div></div>" + "<table " + style + " cellpadding='0' cellspacing='0'>" + "<tr><td></td></tr></table>";

			container = document.createElement("div");
			container.style.cssText = vb + "width:0;height:0;position:static;top:0;margin-top:" + conMarginTop + "px";
			body.insertBefore(container, body.firstChild);

			// Construct the test element
			div = document.createElement("div");
			container.appendChild(div);

			// Check if table cells still have offsetWidth/Height when they are set
			// to display:none and there are still other visible table cells in a
			// table row; if so, offsetWidth/Height are not reliable for use when
			// determining if an element has been hidden directly using
			// display:none (it is still safe to use offsets if a parent element is
			// hidden; don safety goggles and see bug #4512 for more information).
			// (only IE 8 fails this test)
			div.innerHTML = "<table><tr><td style='padding:0;border:0;display:none'></td><td>t</td></tr></table>";
			tds = div.getElementsByTagName("td");
			isSupported = (tds[0].offsetHeight === 0 );

			tds[0].style.display = "";
			tds[1].style.display = "none";

			// Check if empty table cells still have offsetWidth/Height
			// (IE <= 8 fail this test)
			support.reliableHiddenOffsets = isSupported && (tds[0].offsetHeight === 0 );

			// Figure out if the W3C box model works as expected
			div.innerHTML = "";
			div.style.width = div.style.paddingLeft = "1px";
			jQuery.boxModel = support.boxModel = div.offsetWidth === 2;

			if ( typeof div.style.zoom !== "undefined") {
				// Check if natively block-level elements act like inline-block
				// elements when setting their display to 'inline' and giving
				// them layout
				// (IE < 8 does this)
				div.style.display = "inline";
				div.style.zoom = 1;
				support.inlineBlockNeedsLayout = (div.offsetWidth === 2 );

				// Check if elements with layout shrink-wrap their children
				// (IE 6 does this)
				div.style.display = "";
				div.innerHTML = "<div style='width:4px;'></div>";
				support.shrinkWrapBlocks = (div.offsetWidth !== 2 );
			}

			div.style.cssText = ptlm + vb;
			div.innerHTML = html;

			outer = div.firstChild;
			inner = outer.firstChild;
			td = outer.nextSibling.firstChild.firstChild;

			offsetSupport = {
				doesNotAddBorder : (inner.offsetTop !== 5 ),
				doesAddBorderForTableAndCells : (td.offsetTop === 5 )
			};

			inner.style.position = "fixed";
			inner.style.top = "20px";

			// safari subtracts parent border width here which is 5px
			offsetSupport.fixedPosition = (inner.offsetTop === 20 || inner.offsetTop === 15 );
			inner.style.position = inner.style.top = "";

			outer.style.overflow = "hidden";
			outer.style.position = "relative";

			offsetSupport.subtractsBorderForOverflowNotVisible = (inner.offsetTop === -5 );
			offsetSupport.doesNotIncludeMarginInBodyOffset = (body.offsetTop !== conMarginTop );

			body.removeChild(container);
			div = container = null;

			jQuery.extend(support, offsetSupport);
		});

		return support;
	})();

	var rbrace = /^(?:\{.*\}|\[.*\])$/, rmultiDash = /([A-Z])/g;

	jQuery.extend({
		cache : {},

		// Please use with caution
		uuid : 0,

		// Unique for each copy of jQuery on the page
		// Non-digits removed to match rinlinejQuery
		expando : "jQuery" + (jQuery.fn.jquery + Math.random() ).replace(/\D/g, ""),

		// The following elements throw uncatchable exceptions if you
		// attempt to add expando properties to them.
		noData : {
			"embed" : true,
			// Ban all objects except for Flash (which handle expandos)
			"object" : "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
			"applet" : true
		},

		hasData : function(elem) {
			elem = elem.nodeType ? jQuery.cache[elem[jQuery.expando]] : elem[jQuery.expando];
			return !!elem && !isEmptyDataObject(elem);
		},

		data : function(elem, name, data, pvt /* Internal Use Only */ ) {
			if (!jQuery.acceptData(elem)) {
				return;
			}

			var privateCache, thisCache, ret, internalKey = jQuery.expando, getByName = typeof name === "string",

			// We have to handle DOM nodes and JS objects differently because IE6-7
			// can't GC object references properly across the DOM-JS boundary
			isNode = elem.nodeType,

			// Only DOM nodes need the global jQuery cache; JS object data is
			// attached directly to the object so GC can occur automatically
			cache = isNode ? jQuery.cache : elem,

			// Only defining an ID for JS objects if its cache already exists allows
			// the code to shortcut on the same path as a DOM node with no cache
			id = isNode ? elem[internalKey] : elem[internalKey] && internalKey, isEvents = name === "events";

			// Avoid doing any more work than we need to when trying to get data on an
			// object that has no data at all
			if ((!id || !cache[id] || (!isEvents && !pvt && !cache[id].data)) && getByName && data === undefined) {
				return;
			}

			if (!id) {
				// Only DOM nodes need a new unique ID for each element since their data
				// ends up in the global cache
				if (isNode) {
					elem[internalKey] = id = ++jQuery.uuid;
				} else {
					id = internalKey;
				}
			}

			if (!cache[id]) {
				cache[id] = {};

				// Avoids exposing jQuery metadata on plain JS objects when the object
				// is serialized using JSON.stringify
				if (!isNode) {
					cache[id].toJSON = jQuery.noop;
				}
			}

			// An object can be passed to jQuery.data instead of a key/value pair; this gets
			// shallow copied over onto the existing cache
			if ( typeof name === "object" || typeof name === "function") {
				if (pvt) {
					cache[id] = jQuery.extend(cache[id], name);
				} else {
					cache[id].data = jQuery.extend(cache[id].data, name);
				}
			}

			privateCache = thisCache = cache[id];

			// jQuery data() is stored in a separate object inside the object's internal data
			// cache in order to avoid key collisions between internal data and user-defined
			// data.
			if (!pvt) {
				if (!thisCache.data) {
					thisCache.data = {};
				}

				thisCache = thisCache.data;
			}

			if (data !== undefined) {
				thisCache[ jQuery.camelCase(name)] = data;
			}

			// Users should not attempt to inspect the internal events object using jQuery.data,
			// it is undocumented and subject to change. But does anyone listen? No.
			if (isEvents && !thisCache[name]) {
				return privateCache.events;
			}

			// Check for both converted-to-camel and non-converted data property names
			// If a data property was specified
			if (getByName) {

				// First Try to find as-is property data
				ret = thisCache[name];

				// Test for null|undefined property data
				if (ret == null) {

					// Try to find the camelCased property
					ret = thisCache[ jQuery.camelCase(name)];
				}
			} else {
				ret = thisCache;
			}

			return ret;
		},

		removeData : function(elem, name, pvt /* Internal Use Only */ ) {
			if (!jQuery.acceptData(elem)) {
				return;
			}

			var thisCache, i, l,

			// Reference to internal data cache key
			internalKey = jQuery.expando, isNode = elem.nodeType,

			// See jQuery.data for more information
			cache = isNode ? jQuery.cache : elem,

			// See jQuery.data for more information
			id = isNode ? elem[internalKey] : internalKey;

			// If there is already no cache entry for this object, there is no
			// purpose in continuing
			if (!cache[id]) {
				return;
			}

			if (name) {

				thisCache = pvt ? cache[id] : cache[id].data;

				if (thisCache) {

					// Support array or space separated string names for data keys
					if (!jQuery.isArray(name)) {

						// try the string as a key before any manipulation
						if ( name in thisCache) {
							name = [name];
						} else {

							// split the camel cased version by spaces unless a key with the spaces exists
							name = jQuery.camelCase(name);
							if ( name in thisCache) {
								name = [name];
							} else {
								name = name.split(" ");
							}
						}
					}

					for ( i = 0, l = name.length; i < l; i++) {
						delete thisCache[name[i]];
					}

					// If there is no data left in the cache, we want to continue
					// and let the cache object itself get destroyed
					if (!( pvt ? isEmptyDataObject : jQuery.isEmptyObject )(thisCache)) {
						return;
					}
				}
			}

			// See jQuery.data for more information
			if (!pvt) {
				delete cache[id].data;

				// Don't destroy the parent cache unless the internal data object
				// had been the only thing left in it
				if (!isEmptyDataObject(cache[id])) {
					return;
				}
			}

			// Browsers that fail expando deletion also refuse to delete expandos on
			// the window, but it will allow it on all other JS objects; other browsers
			// don't care
			// Ensure that `cache` is not a window object #10080
			if (jQuery.support.deleteExpando || !cache.setInterval) {
				delete cache[id];
			} else {
				cache[id] = null;
			}

			// We destroyed the cache and need to eliminate the expando on the node to avoid
			// false lookups in the cache for entries that no longer exist
			if (isNode) {
				// IE does not allow us to delete expando properties from nodes,
				// nor does it have a removeAttribute function on Document nodes;
				// we must handle all of these cases
				if (jQuery.support.deleteExpando) {
					delete elem[internalKey];
				} else if (elem.removeAttribute) {
					elem.removeAttribute(internalKey);
				} else {
					elem[internalKey] = null;
				}
			}
		},

		// For internal use only.
		_data : function(elem, name, data) {
			return jQuery.data(elem, name, data, true);
		},

		// A method for determining if a DOM node can handle the data expando
		acceptData : function(elem) {
			if (elem.nodeName) {
				var match = jQuery.noData[ elem.nodeName.toLowerCase()];

				if (match) {
					return !(match === true || elem.getAttribute("classid") !== match);
				}
			}

			return true;
		}
	});

	jQuery.fn.extend({
		data : function(key, value) {
			var parts, attr, name, data = null;

			if ( typeof key === "undefined") {
				if (this.length) {
					data = jQuery.data(this[0]);

					if (this[0].nodeType === 1 && !jQuery._data(this[0], "parsedAttrs")) {
						attr = this[0].attributes;
						for (var i = 0, l = attr.length; i < l; i++) {
							name = attr[i].name;

							if (name.indexOf("data-") === 0) {
								name = jQuery.camelCase(name.substring(5));

								dataAttr(this[0], name, data[name]);
							}
						}
						jQuery._data(this[0], "parsedAttrs", true);
					}
				}

				return data;

			} else if ( typeof key === "object") {
				return this.each(function() {
					jQuery.data(this, key);
				});
			}

			parts = key.split(".");
			parts[1] = parts[1] ? "." + parts[1] : "";

			if (value === undefined) {
				data = this.triggerHandler("getData" + parts[1] + "!", [parts[0]]);

				// Try to fetch any internally stored data first
				if (data === undefined && this.length) {
					data = jQuery.data(this[0], key);
					data = dataAttr(this[0], key, data);
				}

				return data === undefined && parts[1] ? this.data(parts[0]) : data;

			} else {
				return this.each(function() {
					var self = jQuery(this), args = [parts[0], value];

					self.triggerHandler("setData" + parts[1] + "!", args);
					jQuery.data(this, key, value);
					self.triggerHandler("changeData" + parts[1] + "!", args);
				});
			}
		},

		removeData : function(key) {
			return this.each(function() {
				jQuery.removeData(this, key);
			});
		}
	});

	function dataAttr(elem, key, data) {
		// If nothing was found internally, try to fetch any
		// data from the HTML5 data-* attribute
		if (data === undefined && elem.nodeType === 1) {

			var name = "data-" + key.replace(rmultiDash, "-$1").toLowerCase();

			data = elem.getAttribute(name);

			if ( typeof data === "string") {
				try {
					data = data === "true" ? true : data === "false" ? false : data === "null" ? null : jQuery.isNumeric(data) ? parseFloat(data) : rbrace.test(data) ? jQuery.parseJSON(data) : data;
				} catch( e ) {
				}

				// Make sure we set the data so it isn't changed later
				jQuery.data(elem, key, data);

			} else {
				data = undefined;
			}
		}

		return data;
	}

	// checks a cache object for emptiness
	function isEmptyDataObject(obj) {
		for (var name in obj ) {

			// if the public data object is empty, the private is still empty
			if (name === "data" && jQuery.isEmptyObject(obj[name])) {
				continue;
			}
			if (name !== "toJSON") {
				return false;
			}
		}

		return true;
	}

	function handleQueueMarkDefer(elem, type, src) {
		var deferDataKey = type + "defer", queueDataKey = type + "queue", markDataKey = type + "mark", defer = jQuery._data(elem, deferDataKey);
		if (defer && (src === "queue" || !jQuery._data(elem, queueDataKey) ) && (src === "mark" || !jQuery._data(elem, markDataKey) )) {
			// Give room for hard-coded callbacks to fire first
			// and eventually mark/queue something else on the element
			setTimeout(function() {
				if (!jQuery._data(elem, queueDataKey) && !jQuery._data(elem, markDataKey)) {
					jQuery.removeData(elem, deferDataKey, true);
					defer.fire();
				}
			}, 0);
		}
	}


	jQuery.extend({

		_mark : function(elem, type) {
			if (elem) {
				type = (type || "fx" ) + "mark";
				jQuery._data(elem, type, (jQuery._data(elem, type) || 0) + 1);
			}
		},

		_unmark : function(force, elem, type) {
			if (force !== true) {
				type = elem;
				elem = force;
				force = false;
			}
			if (elem) {
				type = type || "fx";
				var key = type + "mark", count = force ? 0 : ((jQuery._data(elem, key) || 1) - 1 );
				if (count) {
					jQuery._data(elem, key, count);
				} else {
					jQuery.removeData(elem, key, true);
					handleQueueMarkDefer(elem, type, "mark");
				}
			}
		},

		queue : function(elem, type, data) {
			var q;
			if (elem) {
				type = (type || "fx" ) + "queue";
				q = jQuery._data(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!q || jQuery.isArray(data)) {
						q = jQuery._data(elem, type, jQuery.makeArray(data));
					} else {
						q.push(data);
					}
				}
				return q || [];
			}
		},

		dequeue : function(elem, type) {
			type = type || "fx";

			var queue = jQuery.queue(elem, type), fn = queue.shift(), hooks = {};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === "inprogress") {
				fn = queue.shift();
			}

			if (fn) {
				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === "fx") {
					queue.unshift("inprogress");
				}

				jQuery._data(elem, type + ".run", hooks);
				fn.call(elem, function() {
					jQuery.dequeue(elem, type);
				}, hooks);
			}

			if (!queue.length) {
				jQuery.removeData(elem, type + "queue " + type + ".run", true);
				handleQueueMarkDefer(elem, type, "queue");
			}
		}
	});

	jQuery.fn.extend({
		queue : function(type, data) {
			if ( typeof type !== "string") {
				data = type;
				type = "fx";
			}

			if (data === undefined) {
				return jQuery.queue(this[0], type);
			}
			return this.each(function() {
				var queue = jQuery.queue(this, type, data);

				if (type === "fx" && queue[0] !== "inprogress") {
					jQuery.dequeue(this, type);
				}
			});
		},
		dequeue : function(type) {
			return this.each(function() {
				jQuery.dequeue(this, type);
			});
		},
		// Based off of the plugin by Clint Helfers, with permission.
		// http://blindsignals.com/index.php/2009/07/jquery-delay/
		delay : function(time, type) {
			time = jQuery.fx ? jQuery.fx.speeds[time] || time : time;
			type = type || "fx";

			return this.queue(type, function(next, hooks) {
				var timeout = setTimeout(next, time);
				hooks.stop = function() {
					clearTimeout(timeout);
				};
			});
		},
		clearQueue : function(type) {
			return this.queue(type || "fx", []);
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise : function(type, object) {
			if ( typeof type !== "string") {
				object = type;
				type = undefined;
			}
			type = type || "fx";
			var defer = jQuery.Deferred(), elements = this, i = elements.length, count = 1, deferDataKey = type + "defer", queueDataKey = type + "queue", markDataKey = type + "mark", tmp;
			function resolve() {
				if (!(--count )) {
					defer.resolveWith(elements, [elements]);
				}
			}

			while (i--) {
				if (( tmp = jQuery.data(elements[i], deferDataKey, undefined, true) || (jQuery.data(elements[i], queueDataKey, undefined, true) || jQuery.data(elements[i], markDataKey, undefined, true) ) && jQuery.data(elements[i], deferDataKey, jQuery.Callbacks("once memory"), true) )) {
					count++;
					tmp.add(resolve);
				}
			}
			resolve();
			return defer.promise();
		}
	});

	var rclass = /[\n\t\r]/g, rspace = /\s+/, rreturn = /\r/g, rtype = /^(?:button|input)$/i, rfocusable = /^(?:button|input|object|select|textarea)$/i, rclickable = /^a(?:rea)?$/i, rboolean = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, getSetAttribute = jQuery.support.getSetAttribute, nodeHook, boolHook, fixSpecified;

	jQuery.fn.extend({
		attr : function(name, value) {
			return jQuery.access(this, name, value, true, jQuery.attr);
		},

		removeAttr : function(name) {
			return this.each(function() {
				jQuery.removeAttr(this, name);
			});
		},

		prop : function(name, value) {
			return jQuery.access(this, name, value, true, jQuery.prop);
		},

		removeProp : function(name) {
			name = jQuery.propFix[name] || name;
			return this.each(function() {
				// try/catch handles cases where IE balks (such as removing a property on window)
				try {
					this[name] = undefined;
					delete this[name];
				} catch( e ) {
				}
			});
		},

		addClass : function(value) {
			var classNames, i, l, elem, setClass, c, cl;

			if (jQuery.isFunction(value)) {
				return this.each(function(j) {
					jQuery(this).addClass(value.call(this, j, this.className));
				});
			}

			if (value && typeof value === "string") {
				classNames = value.split(rspace);

				for ( i = 0, l = this.length; i < l; i++) {
					elem = this[i];

					if (elem.nodeType === 1) {
						if (!elem.className && classNames.length === 1) {
							elem.className = value;

						} else {
							setClass = " " + elem.className + " ";

							for ( c = 0, cl = classNames.length; c < cl; c++) {
								if (!~setClass.indexOf(" " + classNames[c] + " ")) {
									setClass += classNames[c] + " ";
								}
							}
							elem.className = jQuery.trim(setClass);
						}
					}
				}
			}

			return this;
		},

		removeClass : function(value) {
			var classNames, i, l, elem, className, c, cl;

			if (jQuery.isFunction(value)) {
				return this.each(function(j) {
					jQuery(this).removeClass(value.call(this, j, this.className));
				});
			}

			if ((value && typeof value === "string") || value === undefined) {
				classNames = (value || "" ).split(rspace);

				for ( i = 0, l = this.length; i < l; i++) {
					elem = this[i];

					if (elem.nodeType === 1 && elem.className) {
						if (value) {
							className = (" " + elem.className + " ").replace(rclass, " ");
							for ( c = 0, cl = classNames.length; c < cl; c++) {
								className = className.replace(" " + classNames[c] + " ", " ");
							}
							elem.className = jQuery.trim(className);

						} else {
							elem.className = "";
						}
					}
				}
			}

			return this;
		},

		toggleClass : function(value, stateVal) {
			var type = typeof value, isBool = typeof stateVal === "boolean";

			if (jQuery.isFunction(value)) {
				return this.each(function(i) {
					jQuery(this).toggleClass(value.call(this, i, this.className, stateVal), stateVal);
				});
			}

			return this.each(function() {
				if (type === "string") {
					// toggle individual class names
					var className, i = 0, self = jQuery(this), state = stateVal, classNames = value.split(rspace);

					while (( className = classNames[i++])) {
						// check each className given, space seperated list
						state = isBool ? state : !self.hasClass(className);
						self[ state ? "addClass" : "removeClass" ](className);
					}

				} else if (type === "undefined" || type === "boolean") {
					if (this.className) {
						// store className if set
						jQuery._data(this, "__className__", this.className);
					}

					// toggle whole className
					this.className = this.className || value === false ? "" : jQuery._data(this, "__className__") || "";
				}
			});
		},

		hasClass : function(selector) {
			var className = " " + selector + " ", i = 0, l = this.length;
			for (; i < l; i++) {
				if (this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf(className) > -1) {
					return true;
				}
			}

			return false;
		},

		val : function(value) {
			var hooks, ret, isFunction, elem = this[0];

			if (!arguments.length) {
				if (elem) {
					hooks = jQuery.valHooks[ elem.nodeName.toLowerCase()] || jQuery.valHooks[elem.type];

					if (hooks && "get" in hooks && ( ret = hooks.get(elem, "value")) !== undefined) {
						return ret;
					}

					ret = elem.value;

					return typeof ret === "string" ?
					// handle most common string cases
					ret.replace(rreturn, "") :
					// handle cases where value is null/undef or number
					ret == null ? "" : ret;
				}

				return;
			}

			isFunction = jQuery.isFunction(value);

			return this.each(function(i) {
				var self = jQuery(this), val;

				if (this.nodeType !== 1) {
					return;
				}

				if (isFunction) {
					val = value.call(this, i, self.val());
				} else {
					val = value;
				}

				// Treat null/undefined as ""; convert numbers to string
				if (val == null) {
					val = "";
				} else if ( typeof val === "number") {
					val += "";
				} else if (jQuery.isArray(val)) {
					val = jQuery.map(val, function(value) {
						return value == null ? "" : value + "";
					});
				}

				hooks = jQuery.valHooks[ this.nodeName.toLowerCase()] || jQuery.valHooks[this.type];

				// If set returns undefined, fall back to normal setting
				if (!hooks || !("set" in hooks) || hooks.set(this, val, "value") === undefined) {
					this.value = val;
				}
			});
		}
	});

	jQuery.extend({
		valHooks : {
			option : {
				get : function(elem) {
					// attributes.value is undefined in Blackberry 4.7 but
					// uses .value. See #6932
					var val = elem.attributes.value;
					return !val || val.specified ? elem.value : elem.text;
				}
			},
			select : {
				get : function(elem) {
					var value, i, max, option, index = elem.selectedIndex, values = [], options = elem.options, one = elem.type === "select-one";

					// Nothing was selected
					if (index < 0) {
						return null;
					}

					// Loop through all the selected options
					i = one ? index : 0;
					max = one ? index + 1 : options.length;
					for (; i < max; i++) {
						option = options[i];

						// Don't return options that are disabled or in a disabled optgroup
						if (option.selected && (jQuery.support.optDisabled ? !option.disabled : option.getAttribute("disabled") === null) && (!option.parentNode.disabled || !jQuery.nodeName(option.parentNode, "optgroup"))) {

							// Get the specific value for the option
							value = jQuery(option).val();

							// We don't need an array for one selects
							if (one) {
								return value;
							}

							// Multi-Selects return an array
							values.push(value);
						}
					}

					// Fixes Bug #2551 -- select.val() broken in IE after form.reset()
					if (one && !values.length && options.length) {
						return jQuery(options[index]).val();
					}

					return values;
				},

				set : function(elem, value) {
					var values = jQuery.makeArray(value);

					jQuery(elem).find("option").each(function() {
						this.selected = jQuery.inArray(jQuery(this).val(), values) >= 0;
					});

					if (!values.length) {
						elem.selectedIndex = -1;
					}
					return values;
				}
			}
		},

		attrFn : {
			val : true,
			css : true,
			html : true,
			text : true,
			data : true,
			width : true,
			height : true,
			offset : true
		},

		attr : function(elem, name, value, pass) {
			var ret, hooks, notxml, nType = elem.nodeType;

			// don't get/set attributes on text, comment and attribute nodes
			if (!elem || nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			if (pass && name in jQuery.attrFn) {
				return jQuery( elem )[ name ](value);
			}

			// Fallback to prop when attributes are not supported
			if ( typeof elem.getAttribute === "undefined") {
				return jQuery.prop(elem, name, value);
			}

			notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

			// All attributes are lowercase
			// Grab necessary hook if one is defined
			if (notxml) {
				name = name.toLowerCase();
				hooks = jQuery.attrHooks[name] || (rboolean.test(name) ? boolHook : nodeHook );
			}

			if (value !== undefined) {

				if (value === null) {
					jQuery.removeAttr(elem, name);
					return;

				} else if (hooks && "set" in hooks && notxml && ( ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;

				} else {
					elem.setAttribute(name, "" + value);
					return value;
				}

			} else if (hooks && "get" in hooks && notxml && ( ret = hooks.get(elem, name)) !== null) {
				return ret;

			} else {

				ret = elem.getAttribute(name);

				// Non-existent attributes return null, we normalize to undefined
				return ret === null ? undefined : ret;
			}
		},

		removeAttr : function(elem, value) {
			var propName, attrNames, name, l, i = 0;

			if (value && elem.nodeType === 1) {
				attrNames = value.toLowerCase().split(rspace);
				l = attrNames.length;

				for (; i < l; i++) {
					name = attrNames[i];

					if (name) {
						propName = jQuery.propFix[name] || name;

						// See #9699 for explanation of this approach (setting first, then removal)
						jQuery.attr(elem, name, "");
						elem.removeAttribute( getSetAttribute ? name : propName);

						// Set corresponding property to false for boolean attributes
						if (rboolean.test(name) && propName in elem) {
							elem[propName] = false;
						}
					}
				}
			}
		},

		attrHooks : {
			type : {
				set : function(elem, value) {
					// We can't allow the type property to be changed (since it causes problems in IE)
					if (rtype.test(elem.nodeName) && elem.parentNode) {
						jQuery.error("type property can't be changed");
					} else if (!jQuery.support.radioValue && value === "radio" && jQuery.nodeName(elem, "input")) {
						// Setting the type on a radio button after the value resets the value in IE6-9
						// Reset value to it's default in case type is set after value
						// This is for element creation
						var val = elem.value;
						elem.setAttribute("type", value);
						if (val) {
							elem.value = val;
						}
						return value;
					}
				}
			},
			// Use the value property for back compat
			// Use the nodeHook for button elements in IE6/7 (#1954)
			value : {
				get : function(elem, name) {
					if (nodeHook && jQuery.nodeName(elem, "button")) {
						return nodeHook.get(elem, name);
					}
					return name in elem ? elem.value : null;
				},
				set : function(elem, value, name) {
					if (nodeHook && jQuery.nodeName(elem, "button")) {
						return nodeHook.set(elem, value, name);
					}
					// Does not return so that setAttribute is also used
					elem.value = value;
				}
			}
		},

		propFix : {
			tabindex : "tabIndex",
			readonly : "readOnly",
			"for" : "htmlFor",
			"class" : "className",
			maxlength : "maxLength",
			cellspacing : "cellSpacing",
			cellpadding : "cellPadding",
			rowspan : "rowSpan",
			colspan : "colSpan",
			usemap : "useMap",
			frameborder : "frameBorder",
			contenteditable : "contentEditable"
		},

		prop : function(elem, name, value) {
			var ret, hooks, notxml, nType = elem.nodeType;

			// don't get/set properties on text, comment and attribute nodes
			if (!elem || nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			notxml = nType !== 1 || !jQuery.isXMLDoc(elem);

			if (notxml) {
				// Fix name and attach hooks
				name = jQuery.propFix[name] || name;
				hooks = jQuery.propHooks[name];
			}

			if (value !== undefined) {
				if (hooks && "set" in hooks && ( ret = hooks.set(elem, value, name)) !== undefined) {
					return ret;

				} else {
					return (elem[name] = value );
				}

			} else {
				if (hooks && "get" in hooks && ( ret = hooks.get(elem, name)) !== null) {
					return ret;

				} else {
					return elem[name];
				}
			}
		},

		propHooks : {
			tabIndex : {
				get : function(elem) {
					// elem.tabIndex doesn't always return the correct value when it hasn't been explicitly set
					// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
					var attributeNode = elem.getAttributeNode("tabindex");

					return attributeNode && attributeNode.specified ? parseInt(attributeNode.value, 10) : rfocusable.test(elem.nodeName) || rclickable.test(elem.nodeName) && elem.href ? 0 : undefined;
				}
			}
		}
	});

	// Add the tabIndex propHook to attrHooks for back-compat (different case is intentional)
	jQuery.attrHooks.tabindex = jQuery.propHooks.tabIndex;

	// Hook for boolean attributes
	boolHook = {
		get : function(elem, name) {
			// Align boolean attributes with corresponding properties
			// Fall back to attribute presence where some booleans are not supported
			var attrNode, property = jQuery.prop(elem, name);
			return property === true || typeof property !== "boolean" && ( attrNode = elem.getAttributeNode(name) ) && attrNode.nodeValue !== false ? name.toLowerCase() : undefined;
		},
		set : function(elem, value, name) {
			var propName;
			if (value === false) {
				// Remove boolean attributes when set to false
				jQuery.removeAttr(elem, name);
			} else {
				// value is true since we know at this point it's type boolean and not false
				// Set boolean attributes to the same name and set the DOM property
				propName = jQuery.propFix[name] || name;
				if ( propName in elem) {
					// Only set the IDL specifically if it already exists on the element
					elem[propName] = true;
				}

				elem.setAttribute(name, name.toLowerCase());
			}
			return name;
		}
	};

	// IE6/7 do not support getting/setting some attributes with get/setAttribute
	if (!getSetAttribute) {

		fixSpecified = {
			name : true,
			id : true
		};

		// Use this for any attribute in IE6/7
		// This fixes almost every IE6/7 issue
		nodeHook = jQuery.valHooks.button = {
			get : function(elem, name) {
				var ret;
				ret = elem.getAttributeNode(name);
				return ret && (fixSpecified[name] ? ret.nodeValue !== "" : ret.specified ) ? ret.nodeValue : undefined;
			},
			set : function(elem, value, name) {
				// Set the existing or create a new attribute node
				var ret = elem.getAttributeNode(name);
				if (!ret) {
					ret = document.createAttribute(name);
					elem.setAttributeNode(ret);
				}
				return (ret.nodeValue = value + "" );
			}
		};

		// Apply the nodeHook to tabindex
		jQuery.attrHooks.tabindex.set = nodeHook.set;

		// Set width and height to auto instead of 0 on empty string( Bug #8150 )
		// This is for removals
		jQuery.each(["width", "height"], function(i, name) {
			jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
				set : function(elem, value) {
					if (value === "") {
						elem.setAttribute(name, "auto");
						return value;
					}
				}
			});
		});

		// Set contenteditable to false on removals(#10429)
		// Setting to empty string throws an error as an invalid value
		jQuery.attrHooks.contenteditable = {
			get : nodeHook.get,
			set : function(elem, value, name) {
				if (value === "") {
					value = "false";
				}
				nodeHook.set(elem, value, name);
			}
		};
	}

	// Some attributes require a special call on IE
	if (!jQuery.support.hrefNormalized) {
		jQuery.each(["href", "src", "width", "height"], function(i, name) {
			jQuery.attrHooks[name] = jQuery.extend(jQuery.attrHooks[name], {
				get : function(elem) {
					var ret = elem.getAttribute(name, 2);
					return ret === null ? undefined : ret;
				}
			});
		});
	}

	if (!jQuery.support.style) {
		jQuery.attrHooks.style = {
			get : function(elem) {
				// Return undefined in the case of empty string
				// Normalize to lowercase since IE uppercases css property names
				return elem.style.cssText.toLowerCase() || undefined;
			},
			set : function(elem, value) {
				return (elem.style.cssText = "" + value );
			}
		};
	}

	// Safari mis-reports the default selected property of an option
	// Accessing the parent's selectedIndex property fixes it
	if (!jQuery.support.optSelected) {
		jQuery.propHooks.selected = jQuery.extend(jQuery.propHooks.selected, {
			get : function(elem) {
				var parent = elem.parentNode;

				if (parent) {
					parent.selectedIndex

					// Make sure that it also works with optgroups, see #5701
					if (parent.parentNode) {
						parent.parentNode.selectedIndex
					}
				}
				return null;
			}
		});
	}

	// IE6/7 call enctype encoding
	if (!jQuery.support.enctype) {
		jQuery.propFix.enctype = "encoding";
	}

	// Radios and checkboxes getter/setter
	if (!jQuery.support.checkOn) {
		jQuery.each(["radio", "checkbox"], function() {
			jQuery.valHooks[this] = {
				get : function(elem) {
					// Handle the case where in Webkit "" is returned instead of "on" if a value isn't specified
					return elem.getAttribute("value") === null ? "on" : elem.value;
				}
			};
		});
	}
	jQuery.each(["radio", "checkbox"], function() {
		jQuery.valHooks[this] = jQuery.extend(jQuery.valHooks[this], {
			set : function(elem, value) {
				if (jQuery.isArray(value)) {
					return (elem.checked = jQuery.inArray(jQuery(elem).val(), value) >= 0 );
				}
			}
		});
	});

	var rformElems = /^(?:textarea|input|select)$/i, rtypenamespace = /^([^\.]*)?(?:\.(.+))?$/, rhoverHack = /\bhover(\.\S+)?\b/, rkeyEvent = /^key/, rmouseEvent = /^(?:mouse|contextmenu)|click/, rfocusMorph = /^(?:focusinfocus|focusoutblur)$/, rquickIs = /^(\w*)(?:#([\w\-]+))?(?:\.([\w\-]+))?$/, quickParse = function(selector) {
		var quick = rquickIs.exec(selector);
		if (quick) {
			//   0  1    2   3
			// [ _, tag, id, class ]
			quick[1] = (quick[1] || "" ).toLowerCase();
			quick[3] = quick[3] && new RegExp("(?:^|\\s)" + quick[3] + "(?:\\s|$)");
		}
		return quick;
	}, quickIs = function(elem, m) {
		var attrs = elem.attributes || {};
		return ((!m[1] || elem.nodeName.toLowerCase() === m[1]) && (!m[2] || (attrs.id || {}).value === m[2]) && (!m[3] || m[3].test((attrs["class"] || {}).value))
		);
	}, hoverHack = function(events) {
		return jQuery.event.special.hover ? events : events.replace(rhoverHack, "mouseenter$1 mouseleave$1");
	};

	/*
	 * Helper functions for managing events -- not part of the public interface.
	 * Props to Dean Edwards' addEvent library for many of the ideas.
	 */
	jQuery.event = {

		add : function(elem, types, handler, data, selector) {

			var elemData, eventHandle, events, t, tns, type, namespaces, handleObj, handleObjIn, quick, handlers, special;

			// Don't attach events to noData or text/comment nodes (allow plain objects tho)
			if (elem.nodeType === 3 || elem.nodeType === 8 || !types || !handler || !( elemData = jQuery._data(elem))) {
				return;
			}

			// Caller can pass in an object of custom data in lieu of the handler
			if (handler.handler) {
				handleObjIn = handler;
				handler = handleObjIn.handler;
			}

			// Make sure that the handler has a unique ID, used to find/remove it later
			if (!handler.guid) {
				handler.guid = jQuery.guid++;
			}

			// Init the element's event structure and main handler, if this is the first
			events = elemData.events;
			if (!events) {
				elemData.events = events = {};
			}
			eventHandle = elemData.handle;
			if (!eventHandle) {
				elemData.handle = eventHandle = function(e) {
					// Discard the second event of a jQuery.event.trigger() and
					// when an event is called after a page has unloaded
					return typeof jQuery !== "undefined" && (!e || jQuery.event.triggered !== e.type) ? jQuery.event.dispatch.apply(eventHandle.elem, arguments) : undefined;
				};
				// Add elem as a property of the handle fn to prevent a memory leak with IE non-native events
				eventHandle.elem = elem;
			}

			// Handle multiple events separated by a space
			// jQuery(...).bind("mouseover mouseout", fn);
			types = jQuery.trim(hoverHack(types)).split(" ");
			for ( t = 0; t < types.length; t++) {

				tns = rtypenamespace.exec(types[t]) || [];
				type = tns[1];
				namespaces = (tns[2] || "" ).split(".").sort();

				// If event changes its type, use the special event handlers for the changed type
				special = jQuery.event.special[type] || {};

				// If selector defined, determine special event api type, otherwise given type
				type = ( selector ? special.delegateType : special.bindType ) || type;

				// Update special based on newly reset type
				special = jQuery.event.special[type] || {};

				// handleObj is passed to all event handlers
				handleObj = jQuery.extend({
					type : type,
					origType : tns[1],
					data : data,
					handler : handler,
					guid : handler.guid,
					selector : selector,
					quick : quickParse(selector),
					namespace : namespaces.join(".")
				}, handleObjIn);

				// Init the event handler queue if we're the first
				handlers = events[type];
				if (!handlers) {
					handlers = events[type] = [];
					handlers.delegateCount = 0;

					// Only use addEventListener/attachEvent if the special events handler returns false
					if (!special.setup || special.setup.call(elem, data, namespaces, eventHandle) === false) {
						// Bind the global event handler to the element
						if (elem.addEventListener) {
							elem.addEventListener(type, eventHandle, false);

						} else if (elem.attachEvent) {
							elem.attachEvent("on" + type, eventHandle);
						}
					}
				}

				if (special.add) {
					special.add.call(elem, handleObj);

					if (!handleObj.handler.guid) {
						handleObj.handler.guid = handler.guid;
					}
				}

				// Add to the element's handler list, delegates in front
				if (selector) {
					handlers.splice(handlers.delegateCount++, 0, handleObj);
				} else {
					handlers.push(handleObj);
				}

				// Keep track of which events have ever been used, for event optimization
				jQuery.event.global[type] = true;
			}

			// Nullify elem to prevent memory leaks in IE
			elem = null;
		},

		global : {},

		// Detach an event or set of events from an element
		remove : function(elem, types, handler, selector, mappedTypes) {

			var elemData = jQuery.hasData(elem) && jQuery._data(elem), t, tns, type, origType, namespaces, origCount, j, events, special, handle, eventType, handleObj;

			if (!elemData || !( events = elemData.events)) {
				return;
			}

			// Once for each type.namespace in types; type may be omitted
			types = jQuery.trim(hoverHack(types || "")).split(" ");
			for ( t = 0; t < types.length; t++) {
				tns = rtypenamespace.exec(types[t]) || [];
				type = origType = tns[1];
				namespaces = tns[2];

				// Unbind all events (on this namespace, if provided) for the element
				if (!type) {
					for (type in events ) {
						jQuery.event.remove(elem, type + types[t], handler, selector, true);
					}
					continue;
				}

				special = jQuery.event.special[type] || {};
				type = ( selector ? special.delegateType : special.bindType ) || type;
				eventType = events[type] || [];
				origCount = eventType.length;
				namespaces = namespaces ? new RegExp("(^|\\.)" + namespaces.split(".").sort().join("\\.(?:.*\\.)?") + "(\\.|$)") : null;

				// Remove matching events
				for ( j = 0; j < eventType.length; j++) {
					handleObj = eventType[j];

					if ((mappedTypes || origType === handleObj.origType ) && (!handler || handler.guid === handleObj.guid ) && (!namespaces || namespaces.test(handleObj.namespace) ) && (!selector || selector === handleObj.selector || selector === "**" && handleObj.selector )) {
						eventType.splice(j--, 1);

						if (handleObj.selector) {
							eventType.delegateCount--;
						}
						if (special.remove) {
							special.remove.call(elem, handleObj);
						}
					}
				}

				// Remove generic event handler if we removed something and no more handlers exist
				// (avoids potential for endless recursion during removal of special event handlers)
				if (eventType.length === 0 && origCount !== eventType.length) {
					if (!special.teardown || special.teardown.call(elem, namespaces) === false) {
						jQuery.removeEvent(elem, type, elemData.handle);
					}
					delete events[type];
				}
			}

			// Remove the expando if it's no longer used
			if (jQuery.isEmptyObject(events)) {
				handle = elemData.handle;
				if (handle) {
					handle.elem = null;
				}

				// removeData also checks for emptiness and clears the expando if empty
				// so use it instead of delete
				jQuery.removeData(elem, ["events", "handle"], true);
			}
		},

		// Events that are safe to short-circuit if no handlers are attached.
		// Native DOM events should not be added, they may have inline handlers.
		customEvent : {
			"getData" : true,
			"setData" : true,
			"changeData" : true
		},

		trigger : function(event, data, elem, onlyHandlers) {
			// Don't do events on text and comment nodes
			if (elem && (elem.nodeType === 3 || elem.nodeType === 8)) {
				return;
			}

			// Event object or event type
			var type = event.type || event, namespaces = [], cache, exclusive, i, cur, old, ontype, special, handle, eventPath, bubbleType;

			// focus/blur morphs to focusin/out; ensure we're not firing them right now
			if (rfocusMorph.test(type + jQuery.event.triggered)) {
				return;
			}

			if (type.indexOf("!") >= 0) {
				// Exclusive events trigger only for the exact event (no namespaces)
				type = type.slice(0, -1);
				exclusive = true;
			}

			if (type.indexOf(".") >= 0) {
				// Namespaced trigger; create a regexp to match event type in handle()
				namespaces = type.split(".");
				type = namespaces.shift();
				namespaces.sort();
			}

			if ((!elem || jQuery.event.customEvent[type]) && !jQuery.event.global[type]) {
				// No jQuery handlers for this event type, and it can't have inline handlers
				return;
			}

			// Caller can pass in an Event, Object, or just an event type string
			event = typeof event === "object" ?
			// jQuery.Event object
			event[jQuery.expando] ? event :
			// Object literal
			new jQuery.Event(type, event) :
			// Just the event type (string)
			new jQuery.Event(type);

			event.type = type;
			event.isTrigger = true;
			event.exclusive = exclusive;
			event.namespace = namespaces.join(".");
			event.namespace_re = event.namespace ? new RegExp("(^|\\.)" + namespaces.join("\\.(?:.*\\.)?") + "(\\.|$)") : null;
			ontype = type.indexOf(":") < 0 ? "on" + type : "";

			// Handle a global trigger
			if (!elem) {

				// TODO: Stop taunting the data cache; remove global events and always attach to document
				cache = jQuery.cache;
				for (i in cache ) {
					if (cache[i].events && cache[ i ].events[type]) {
						jQuery.event.trigger(event, data, cache[i].handle.elem, true);
					}
				}
				return;
			}

			// Clean up the event in case it is being reused
			event.result = undefined;
			if (!event.target) {
				event.target = elem;
			}

			// Clone any incoming data and prepend the event, creating the handler arg list
			data = data != null ? jQuery.makeArray(data) : [];
			data.unshift(event);

			// Allow special events to draw outside the lines
			special = jQuery.event.special[type] || {};
			if (special.trigger && special.trigger.apply(elem, data) === false) {
				return;
			}

			// Determine event propagation path in advance, per W3C events spec (#9951)
			// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
			eventPath = [[elem, special.bindType || type]];
			if (!onlyHandlers && !special.noBubble && !jQuery.isWindow(elem)) {

				bubbleType = special.delegateType || type;
				cur = rfocusMorph.test(bubbleType + type) ? elem : elem.parentNode;
				old = null;
				for (; cur; cur = cur.parentNode) {
					eventPath.push([cur, bubbleType]);
					old = cur;
				}

				// Only add window if we got to document (e.g., not plain obj or detached DOM)
				if (old && old === elem.ownerDocument) {
					eventPath.push([old.defaultView || old.parentWindow || window, bubbleType]);
				}
			}

			// Fire handlers on the event path
			for ( i = 0; i < eventPath.length && !event.isPropagationStopped(); i++) {

				cur = eventPath[i][0];
				event.type = eventPath[i][1];

				handle = ( jQuery._data( cur, "events" ) || {} )[event.type] && jQuery._data(cur, "handle");
				if (handle) {
					handle.apply(cur, data);
				}
				// Note that this is a bare JS function and not a jQuery handler
				handle = ontype && cur[ontype];
				if (handle && jQuery.acceptData(cur) && handle.apply(cur, data) === false) {
					event.preventDefault();
				}
			}
			event.type = type;

			// If nobody prevented the default action, do it now
			if (!onlyHandlers && !event.isDefaultPrevented()) {

				if ((!special._default || special._default.apply(elem.ownerDocument, data) === false) && !(type === "click" && jQuery.nodeName(elem, "a")) && jQuery.acceptData(elem)) {

					// Call a native DOM method on the target with the same name name as the event.
					// Can't use an .isFunction() check here because IE6/7 fails that test.
					// Don't do default actions on window, that's where global variables be (#6170)
					// IE<9 dies on focus/blur to hidden element (#1486)
					if (ontype && elem[type] && ((type !== "focus" && type !== "blur") || event.target.offsetWidth !== 0) && !jQuery.isWindow(elem)) {

						// Don't re-trigger an onFOO event when we call its FOO() method
						old = elem[ontype];

						if (old) {
							elem[ontype] = null;
						}

						// Prevent re-triggering of the same event, since we already bubbled it above
						jQuery.event.triggered = type;
						elem[ type ]();
						jQuery.event.triggered = undefined;

						if (old) {
							elem[ontype] = old;
						}
					}
				}
			}

			return event.result;
		},

		dispatch : function(event) {

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix(event || window.event);

			var handlers = ((jQuery._data( this, "events" ) || {} )[event.type] || []), delegateCount = handlers.delegateCount, args = [].slice.call(arguments, 0), run_all = !event.exclusive && !event.namespace, handlerQueue = [], i, j, cur, jqcur, ret, selMatch, matched, matches, handleObj, sel, related;

			// Use the fix-ed jQuery.Event rather than the (read-only) native event
			args[0] = event;
			event.delegateTarget = this;

			// Determine handlers that should run if there are delegated events
			// Avoid disabled elements in IE (#6911) and non-left-click bubbling in Firefox (#3861)
			if (delegateCount && !event.target.disabled && !(event.button && event.type === "click")) {

				// Pregenerate a single jQuery object for reuse with .is()
				jqcur = jQuery(this);
				jqcur.context = this.ownerDocument || this;

				for ( cur = event.target; cur != this; cur = cur.parentNode || this) {
					selMatch = {};
					matches = [];
					jqcur[0] = cur;
					for ( i = 0; i < delegateCount; i++) {
						handleObj = handlers[i];
						sel = handleObj.selector;

						if (selMatch[sel] === undefined) {
							selMatch[sel] = (handleObj.quick ? quickIs(cur, handleObj.quick) : jqcur.is(sel)
							);
						}
						if (selMatch[sel]) {
							matches.push(handleObj);
						}
					}
					if (matches.length) {
						handlerQueue.push({
							elem : cur,
							matches : matches
						});
					}
				}
			}

			// Add the remaining (directly-bound) handlers
			if (handlers.length > delegateCount) {
				handlerQueue.push({
					elem : this,
					matches : handlers.slice(delegateCount)
				});
			}

			// Run delegates first; they may want to stop propagation beneath us
			for ( i = 0; i < handlerQueue.length && !event.isPropagationStopped(); i++) {
				matched = handlerQueue[i];
				event.currentTarget = matched.elem;

				for ( j = 0; j < matched.matches.length && !event.isImmediatePropagationStopped(); j++) {
					handleObj = matched.matches[j];

					// Triggered event must either 1) be non-exclusive and have no namespace, or
					// 2) have namespace(s) a subset or equal to those in the bound event (both can have no namespace).
					if (run_all || (!event.namespace && !handleObj.namespace) || event.namespace_re && event.namespace_re.test(handleObj.namespace)) {

						event.data = handleObj.data;
						event.handleObj = handleObj;

						ret = ((jQuery.event.special[handleObj.origType] || {}).handle || handleObj.handler ).apply(matched.elem, args);

						if (ret !== undefined) {
							event.result = ret;
							if (ret === false) {
								event.preventDefault();
								event.stopPropagation();
							}
						}
					}
				}
			}

			return event.result;
		},

		// Includes some event props shared by KeyEvent and MouseEvent
		// *** attrChange attrName relatedNode srcElement  are not normalized, non-W3C, deprecated, will be removed in 1.8 ***
		props : "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

		fixHooks : {},

		keyHooks : {
			props : "char charCode key keyCode".split(" "),
			filter : function(event, original) {

				// Add which for key events
				if (event.which == null) {
					event.which = original.charCode != null ? original.charCode : original.keyCode;
				}

				return event;
			}
		},

		mouseHooks : {
			props : "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
			filter : function(event, original) {
				var eventDoc, doc, body, button = original.button, fromElement = original.fromElement;

				// Calculate pageX/Y if missing and clientX/Y available
				if (event.pageX == null && original.clientX != null) {
					eventDoc = event.target.ownerDocument || document;
					doc = eventDoc.documentElement;
					body = eventDoc.body;

					event.pageX = original.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - (doc && doc.clientLeft || body && body.clientLeft || 0 );
					event.pageY = original.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0 ) - (doc && doc.clientTop || body && body.clientTop || 0 );
				}

				// Add relatedTarget, if necessary
				if (!event.relatedTarget && fromElement) {
					event.relatedTarget = fromElement === event.target ? original.toElement : fromElement;
				}

				// Add which for click: 1 === left; 2 === middle; 3 === right
				// Note: button is not normalized, so don't use it
				if (!event.which && button !== undefined) {
					event.which = (button & 1 ? 1 : (button & 2 ? 3 : (button & 4 ? 2 : 0 ) ) );
				}

				return event;
			}
		},

		fix : function(event) {
			if (event[jQuery.expando]) {
				return event;
			}

			// Create a writable copy of the event object and normalize some properties
			var i, prop, originalEvent = event, fixHook = jQuery.event.fixHooks[event.type] || {}, copy = fixHook.props ? this.props.concat(fixHook.props) : this.props;

			event = jQuery.Event(originalEvent);

			for ( i = copy.length; i; ) {
				prop = copy[--i];
				event[prop] = originalEvent[prop];
			}

			// Fix target property, if necessary (#1925, IE 6/7/8 & Safari2)
			if (!event.target) {
				event.target = originalEvent.srcElement || document;
			}

			// Target should not be a text node (#504, Safari)
			if (event.target.nodeType === 3) {
				event.target = event.target.parentNode;
			}

			// For mouse/key events; add metaKey if it's not there (#3368, IE6/7/8)
			if (event.metaKey === undefined) {
				event.metaKey = event.ctrlKey;
			}

			return fixHook.filter ? fixHook.filter(event, originalEvent) : event;
		},

		special : {
			ready : {
				// Make sure the ready event is setup
				setup : jQuery.bindReady
			},

			load : {
				// Prevent triggered image.load events from bubbling to window.load
				noBubble : true
			},

			focus : {
				delegateType : "focusin"
			},
			blur : {
				delegateType : "focusout"
			},

			beforeunload : {
				setup : function(data, namespaces, eventHandle) {
					// We only want to do this special case on windows
					if (jQuery.isWindow(this)) {
						this.onbeforeunload = eventHandle;
					}
				},

				teardown : function(namespaces, eventHandle) {
					if (this.onbeforeunload === eventHandle) {
						this.onbeforeunload = null;
					}
				}
			}
		},

		simulate : function(type, elem, event, bubble) {
			// Piggyback on a donor event to simulate a different one.
			// Fake originalEvent to avoid donor's stopPropagation, but if the
			// simulated event prevents default then we do the same on the donor.
			var e = jQuery.extend(new jQuery.Event(), event, {
				type : type,
				isSimulated : true,
				originalEvent : {}
			});
			if (bubble) {
				jQuery.event.trigger(e, null, elem);
			} else {
				jQuery.event.dispatch.call(elem, e);
			}
			if (e.isDefaultPrevented()) {
				event.preventDefault();
			}
		}
	};

	// Some plugins are using, but it's undocumented/deprecated and will be removed.
	// The 1.7 special event interface should provide all the hooks needed now.
	jQuery.event.handle = jQuery.event.dispatch;

	jQuery.removeEvent = document.removeEventListener ? function(elem, type, handle) {
		if (elem.removeEventListener) {
			elem.removeEventListener(type, handle, false);
		}
	} : function(elem, type, handle) {
		if (elem.detachEvent) {
			elem.detachEvent("on" + type, handle);
		}
	};

	jQuery.Event = function(src, props) {
		// Allow instantiation without the 'new' keyword
		if (!(this instanceof jQuery.Event)) {
			return new jQuery.Event(src, props);
		}

		// Event object
		if (src && src.type) {
			this.originalEvent = src;
			this.type = src.type;

			// Events bubbling up the document may have been marked as prevented
			// by a handler lower down the tree; reflect the correct value.
			this.isDefaultPrevented = (src.defaultPrevented || src.returnValue === false || src.getPreventDefault && src.getPreventDefault() ) ? returnTrue : returnFalse;

			// Event type
		} else {
			this.type = src;
		}

		// Put explicitly provided properties onto the event object
		if (props) {
			jQuery.extend(this, props);
		}

		// Create a timestamp if incoming event doesn't have one
		this.timeStamp = src && src.timeStamp || jQuery.now();

		// Mark it as fixed
		this[jQuery.expando] = true;
	};

	function returnFalse() {
		return false;
	}

	function returnTrue() {
		return true;
	}

	// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
	// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
	jQuery.Event.prototype = {
		preventDefault : function() {
			this.isDefaultPrevented = returnTrue;

			var e = this.originalEvent;
			if (!e) {
				return;
			}

			// if preventDefault exists run it on the original event
			if (e.preventDefault) {
				e.preventDefault();

				// otherwise set the returnValue property of the original event to false (IE)
			} else {
				e.returnValue = false;
			}
		},
		stopPropagation : function() {
			this.isPropagationStopped = returnTrue;

			var e = this.originalEvent;
			if (!e) {
				return;
			}
			// if stopPropagation exists run it on the original event
			if (e.stopPropagation) {
				e.stopPropagation();
			}
			// otherwise set the cancelBubble property of the original event to true (IE)
			e.cancelBubble = true;
		},
		stopImmediatePropagation : function() {
			this.isImmediatePropagationStopped = returnTrue;
			this.stopPropagation();
		},
		isDefaultPrevented : returnFalse,
		isPropagationStopped : returnFalse,
		isImmediatePropagationStopped : returnFalse
	};

	// Create mouseenter/leave events using mouseover/out and event-time checks
	jQuery.each({
		mouseenter : "mouseover",
		mouseleave : "mouseout"
	}, function(orig, fix) {
		jQuery.event.special[orig] = {
			delegateType : fix,
			bindType : fix,

			handle : function(event) {
				var target = this, related = event.relatedTarget, handleObj = event.handleObj, selector = handleObj.selector, ret;

				// For mousenter/leave call the handler if related is outside the target.
				// NB: No relatedTarget if the mouse left/entered the browser window
				if (!related || (related !== target && !jQuery.contains(target, related))) {
					event.type = handleObj.origType;
					ret = handleObj.handler.apply(this, arguments);
					event.type = fix;
				}
				return ret;
			}
		};
	});

	// IE submit delegation
	if (!jQuery.support.submitBubbles) {

		jQuery.event.special.submit = {
			setup : function() {
				// Only need this for delegated form submit events
				if (jQuery.nodeName(this, "form")) {
					return false;
				}

				// Lazy-add a submit handler when a descendant form may potentially be submitted
				jQuery.event.add(this, "click._submit keypress._submit", function(e) {
					// Node name check avoids a VML-related crash in IE (#9807)
					var elem = e.target, form = jQuery.nodeName(elem, "input") || jQuery.nodeName(elem, "button") ? elem.form : undefined;
					if (form && !form._submit_attached) {
						jQuery.event.add(form, "submit._submit", function(event) {
							// If form was submitted by the user, bubble the event up the tree
							if (this.parentNode && !event.isTrigger) {
								jQuery.event.simulate("submit", this.parentNode, event, true);
							}
						});
						form._submit_attached = true;
					}
				});
				// return undefined since we don't need an event listener
			},

			teardown : function() {
				// Only need this for delegated form submit events
				if (jQuery.nodeName(this, "form")) {
					return false;
				}

				// Remove delegated handlers; cleanData eventually reaps submit handlers attached above
				jQuery.event.remove(this, "._submit");
			}
		};
	}

	// IE change delegation and checkbox/radio fix
	if (!jQuery.support.changeBubbles) {

		jQuery.event.special.change = {

			setup : function() {

				if (rformElems.test(this.nodeName)) {
					// IE doesn't fire change on a check/radio until blur; trigger it on click
					// after a propertychange. Eat the blur-change in special.change.handle.
					// This still fires onchange a second time for check/radio after blur.
					if (this.type === "checkbox" || this.type === "radio") {
						jQuery.event.add(this, "propertychange._change", function(event) {
							if (event.originalEvent.propertyName === "checked") {
								this._just_changed = true;
							}
						});
						jQuery.event.add(this, "click._change", function(event) {
							if (this._just_changed && !event.isTrigger) {
								this._just_changed = false;
								jQuery.event.simulate("change", this, event, true);
							}
						});
					}
					return false;
				}
				// Delegated event; lazy-add a change handler on descendant inputs
				jQuery.event.add(this, "beforeactivate._change", function(e) {
					var elem = e.target;

					if (rformElems.test(elem.nodeName) && !elem._change_attached) {
						jQuery.event.add(elem, "change._change", function(event) {
							if (this.parentNode && !event.isSimulated && !event.isTrigger) {
								jQuery.event.simulate("change", this.parentNode, event, true);
							}
						});
						elem._change_attached = true;
					}
				});
			},

			handle : function(event) {
				var elem = event.target;

				// Swallow native change events from checkbox/radio, we already triggered them above
				if (this !== elem || event.isSimulated || event.isTrigger || (elem.type !== "radio" && elem.type !== "checkbox")) {
					return event.handleObj.handler.apply(this, arguments);
				}
			},

			teardown : function() {
				jQuery.event.remove(this, "._change");

				return rformElems.test(this.nodeName);
			}
		};
	}

	// Create "bubbling" focus and blur events
	if (!jQuery.support.focusinBubbles) {
		jQuery.each({
			focus : "focusin",
			blur : "focusout"
		}, function(orig, fix) {

			// Attach a single capturing handler while someone wants focusin/focusout
			var attaches = 0, handler = function(event) {
				jQuery.event.simulate(fix, event.target, jQuery.event.fix(event), true);
			};

			jQuery.event.special[fix] = {
				setup : function() {
					if (attaches++ === 0) {
						document.addEventListener(orig, handler, true);
					}
				},
				teardown : function() {
					if (--attaches === 0) {
						document.removeEventListener(orig, handler, true);
					}
				}
			};
		});
	}

	jQuery.fn.extend({

		on : function(types, selector, data, fn, /*INTERNAL*/one) {
			var origFn, type;

			// Types can be a map of types/handlers
			if ( typeof types === "object") {
				// ( types-Object, selector, data )
				if ( typeof selector !== "string") {
					// ( types-Object, data )
					data = selector;
					selector = undefined;
				}
				for (type in types ) {
					this.on(type, selector, data, types[type], one);
				}
				return this;
			}

			if (data == null && fn == null) {
				// ( types, fn )
				fn = selector;
				data = selector = undefined;
			} else if (fn == null) {
				if ( typeof selector === "string") {
					// ( types, selector, fn )
					fn = data;
					data = undefined;
				} else {
					// ( types, data, fn )
					fn = data;
					data = selector;
					selector = undefined;
				}
			}
			if (fn === false) {
				fn = returnFalse;
			} else if (!fn) {
				return this;
			}

			if (one === 1) {
				origFn = fn;
				fn = function(event) {
					// Can use an empty set, since event contains the info
					jQuery().off(event);
					return origFn.apply(this, arguments);
				};
				// Use same guid so caller can remove using origFn
				fn.guid = origFn.guid || (origFn.guid = jQuery.guid++ );
			}
			return this.each(function() {
				jQuery.event.add(this, types, fn, data, selector);
			});
		},
		one : function(types, selector, data, fn) {
			return this.on.call(this, types, selector, data, fn, 1);
		},
		off : function(types, selector, fn) {
			if (types && types.preventDefault && types.handleObj) {
				// ( event )  dispatched jQuery.Event
				var handleObj = types.handleObj;
				jQuery(types.delegateTarget).off(handleObj.namespace ? handleObj.type + "." + handleObj.namespace : handleObj.type, handleObj.selector, handleObj.handler);
				return this;
			}
			if ( typeof types === "object") {
				// ( types-object [, selector] )
				for (var type in types ) {
					this.off(type, selector, types[type]);
				}
				return this;
			}
			if (selector === false || typeof selector === "function") {
				// ( types [, fn] )
				fn = selector;
				selector = undefined;
			}
			if (fn === false) {
				fn = returnFalse;
			}
			return this.each(function() {
				jQuery.event.remove(this, types, fn, selector);
			});
		},

		bind : function(types, data, fn) {
			return this.on(types, null, data, fn);
		},
		unbind : function(types, fn) {
			return this.off(types, null, fn);
		},

		live : function(types, data, fn) {
			jQuery(this.context).on(types, this.selector, data, fn);
			return this;
		},
		die : function(types, fn) {
			jQuery(this.context).off(types, this.selector || "**", fn);
			return this;
		},

		delegate : function(selector, types, data, fn) {
			return this.on(types, selector, data, fn);
		},
		undelegate : function(selector, types, fn) {
			// ( namespace ) or ( selector, types [, fn] )
			return arguments.length == 1 ? this.off(selector, "**") : this.off(types, selector, fn);
		},

		trigger : function(type, data) {
			return this.each(function() {
				jQuery.event.trigger(type, data, this);
			});
		},
		triggerHandler : function(type, data) {
			if (this[0]) {
				return jQuery.event.trigger(type, data, this[0], true);
			}
		},

		toggle : function(fn) {
			// Save reference to arguments for access in closure
			var args = arguments, guid = fn.guid || jQuery.guid++, i = 0, toggler = function(event) {
				// Figure out which function to execute
				var lastToggle = (jQuery._data(this, "lastToggle" + fn.guid) || 0 ) % i;
				jQuery._data(this, "lastToggle" + fn.guid, lastToggle + 1);

				// Make sure that clicks stop
				event.preventDefault();

				// and execute the function
				return args[lastToggle].apply(this, arguments) || false;
			};

			// link all the functions, so any of them can unbind this click handler
			toggler.guid = guid;
			while (i < args.length) {
				args[i++].guid = guid;
			}

			return this.click(toggler);
		},

		hover : function(fnOver, fnOut) {
			return this.mouseenter(fnOver).mouseleave(fnOut || fnOver);
		}
	});

	jQuery.each(("blur focus focusin focusout load resize scroll unload click dblclick " + "mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " + "change select submit keydown keypress keyup error contextmenu").split(" "), function(i, name) {

		// Handle event binding
		jQuery.fn[name] = function(data, fn) {
			if (fn == null) {
				fn = data;
				data = null;
			}

			return arguments.length > 0 ? this.on(name, null, data, fn) : this.trigger(name);
		};

		if (jQuery.attrFn) {
			jQuery.attrFn[name] = true;
		}

		if (rkeyEvent.test(name)) {
			jQuery.event.fixHooks[name] = jQuery.event.keyHooks;
		}

		if (rmouseEvent.test(name)) {
			jQuery.event.fixHooks[name] = jQuery.event.mouseHooks;
		}
	});

	/*!
	 * Sizzle CSS Selector Engine
	 *  Copyright 2011, The Dojo Foundation
	 *  Released under the MIT, BSD, and GPL Licenses.
	 *  More information: http://sizzlejs.com/
	 */
	(function() {

		var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^\[\]]*\]|['"][^'"]*['"]|[^\[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?((?:.|\r|\n)*)/g, expando = "sizcache" + (Math.random() + '').replace('.', ''), done = 0, toString = Object.prototype.toString, hasDuplicate = false, baseHasDuplicate = true, rBackslash = /\\/g, rReturn = /\r\n/g, rNonWord = /\W/;

		// Here we check if the JavaScript engine is using some sort of
		// optimization where it does not always call our comparision
		// function. If that is the case, discard the hasDuplicate value.
		//   Thus far that includes Google Chrome.
		[0, 0].sort(function() {
			baseHasDuplicate = false;
			return 0;
		});

		var Sizzle = function(selector, context, results, seed) {
			results = results || [];
			context = context || document;

			var origContext = context;

			if (context.nodeType !== 1 && context.nodeType !== 9) {
				return [];
			}

			if (!selector || typeof selector !== "string") {
				return results;
			}

			var m, set, checkSet, extra, ret, cur, pop, i, prune = true, contextXML = Sizzle.isXML(context), parts = [], soFar = selector;

			// Reset the position of the chunker regexp (start from head)
			do {
				chunker.exec("");
				m = chunker.exec(soFar);

				if (m) {
					soFar = m[3];

					parts.push(m[1]);

					if (m[2]) {
						extra = m[3];
						break;
					}
				}
			} while ( m );

			if (parts.length > 1 && origPOS.exec(selector)) {

				if (parts.length === 2 && Expr.relative[parts[0]]) {
					set = posProcess(parts[0] + parts[1], context, seed);

				} else {
					set = Expr.relative[parts[0]] ? [context] : Sizzle(parts.shift(), context);

					while (parts.length) {
						selector = parts.shift();

						if (Expr.relative[selector]) {
							selector += parts.shift();
						}

						set = posProcess(selector, set, seed);
					}
				}

			} else {
				// Take a shortcut and set the context if the root selector is an ID
				// (but not if it'll be faster if the inner selector is an ID)
				if (!seed && parts.length > 1 && context.nodeType === 9 && !contextXML && Expr.match.ID.test(parts[0]) && !Expr.match.ID.test(parts[parts.length - 1])) {

					ret = Sizzle.find(parts.shift(), context, contextXML);
					context = ret.expr ? Sizzle.filter( ret.expr, ret.set )[0] : ret.set[0];
				}

				if (context) {
					ret = seed ? {
						expr : parts.pop(),
						set : makeArray(seed)
					} : Sizzle.find(parts.pop(), parts.length === 1 && (parts[0] === "~" || parts[0] === "+") && context.parentNode ? context.parentNode : context, contextXML);

					set = ret.expr ? Sizzle.filter(ret.expr, ret.set) : ret.set;

					if (parts.length > 0) {
						checkSet = makeArray(set);

					} else {
						prune = false;
					}

					while (parts.length) {
						cur = parts.pop();
						pop = cur;

						if (!Expr.relative[cur]) {
							cur = "";
						} else {
							pop = parts.pop();
						}

						if (pop == null) {
							pop = context;
						}

						Expr.relative[ cur ](checkSet, pop, contextXML);
					}

				} else {
					checkSet = parts = [];
				}
			}

			if (!checkSet) {
				checkSet = set;
			}

			if (!checkSet) {
				Sizzle.error(cur || selector);
			}

			if (toString.call(checkSet) === "[object Array]") {
				if (!prune) {
					results.push.apply(results, checkSet);

				} else if (context && context.nodeType === 1) {
					for ( i = 0; checkSet[i] != null; i++) {
						if (checkSet[i] && (checkSet[i] === true || checkSet[i].nodeType === 1 && Sizzle.contains(context, checkSet[i]))) {
							results.push(set[i]);
						}
					}

				} else {
					for ( i = 0; checkSet[i] != null; i++) {
						if (checkSet[i] && checkSet[i].nodeType === 1) {
							results.push(set[i]);
						}
					}
				}

			} else {
				makeArray(checkSet, results);
			}

			if (extra) {
				Sizzle(extra, origContext, results, seed);
				Sizzle.uniqueSort(results);
			}

			return results;
		};

		Sizzle.uniqueSort = function(results) {
			if (sortOrder) {
				hasDuplicate = baseHasDuplicate;
				results.sort(sortOrder);

				if (hasDuplicate) {
					for (var i = 1; i < results.length; i++) {
						if (results[i] === results[i - 1]) {
							results.splice(i--, 1);
						}
					}
				}
			}

			return results;
		};

		Sizzle.matches = function(expr, set) {
			return Sizzle(expr, null, null, set);
		};

		Sizzle.matchesSelector = function(node, expr) {
			return Sizzle(expr, null, null, [node]).length > 0;
		};

		Sizzle.find = function(expr, context, isXML) {
			var set, i, len, match, type, left;

			if (!expr) {
				return [];
			}

			for ( i = 0, len = Expr.order.length; i < len; i++) {
				type = Expr.order[i];

				if (( match = Expr.leftMatch[type].exec(expr))) {
					left = match[1];
					match.splice(1, 1);

					if (left.substr(left.length - 1) !== "\\") {
						match[1] = (match[1] || "").replace(rBackslash, "");
						set = Expr.find[ type ](match, context, isXML);

						if (set != null) {
							expr = expr.replace(Expr.match[type], "");
							break;
						}
					}
				}
			}

			if (!set) {
				set = typeof context.getElementsByTagName !== "undefined" ? context.getElementsByTagName("*") : [];
			}

			return {
				set : set,
				expr : expr
			};
		};

		Sizzle.filter = function(expr, set, inplace, not) {
			var match, anyFound, type, found, item, filter, left, i, pass, old = expr, result = [], curLoop = set, isXMLFilter = set && set[0] && Sizzle.isXML(set[0]);

			while (expr && set.length) {
				for (type in Expr.filter ) {
					if (( match = Expr.leftMatch[type].exec(expr)) != null && match[2]) {
						filter = Expr.filter[type];
						left = match[1];

						anyFound = false;

						match.splice(1, 1);

						if (left.substr(left.length - 1) === "\\") {
							continue;
						}

						if (curLoop === result) {
							result = [];
						}

						if (Expr.preFilter[type]) {
							match = Expr.preFilter[ type ](match, curLoop, inplace, result, not, isXMLFilter);

							if (!match) {
								anyFound = found = true;

							} else if (match === true) {
								continue;
							}
						}

						if (match) {
							for ( i = 0; ( item = curLoop[i]) != null; i++) {
								if (item) {
									found = filter(item, match, i, curLoop);
									pass = not ^ found;

									if (inplace && found != null) {
										if (pass) {
											anyFound = true;

										} else {
											curLoop[i] = false;
										}

									} else if (pass) {
										result.push(item);
										anyFound = true;
									}
								}
							}
						}

						if (found !== undefined) {
							if (!inplace) {
								curLoop = result;
							}

							expr = expr.replace(Expr.match[type], "");

							if (!anyFound) {
								return [];
							}

							break;
						}
					}
				}

				// Improper expression
				if (expr === old) {
					if (anyFound == null) {
						Sizzle.error(expr);

					} else {
						break;
					}
				}

				old = expr;
			}

			return curLoop;
		};

		Sizzle.error = function(msg) {
			throw new Error("Syntax error, unrecognized expression: " + msg);
		};

		/**
		 * Utility function for retreiving the text value of an array of DOM nodes
		 * @param {Array|Element} elem
		 */
		var getText = Sizzle.getText = function(elem) {
			var i, node, nodeType = elem.nodeType, ret = "";

			if (nodeType) {
				if (nodeType === 1 || nodeType === 9) {
					// Use textContent || innerText for elements
					if ( typeof elem.textContent === 'string') {
						return elem.textContent;
					} else if ( typeof elem.innerText === 'string') {
						// Replace IE's carriage returns
						return elem.innerText.replace(rReturn, '');
					} else {
						// Traverse it's children
						for ( elem = elem.firstChild; elem; elem = elem.nextSibling) {
							ret += getText(elem);
						}
					}
				} else if (nodeType === 3 || nodeType === 4) {
					return elem.nodeValue;
				}
			} else {

				// If no nodeType, this is expected to be an array
				for ( i = 0; ( node = elem[i]); i++) {
					// Do not traverse comment nodes
					if (node.nodeType !== 8) {
						ret += getText(node);
					}
				}
			}
			return ret;
		};

		var Expr = Sizzle.selectors = {
			order : ["ID", "NAME", "TAG"],

			match : {
				ID : /#((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
				CLASS : /\.((?:[\w\u00c0-\uFFFF\-]|\\.)+)/,
				NAME : /\[name=['"]*((?:[\w\u00c0-\uFFFF\-]|\\.)+)['"]*\]/,
				ATTR : /\[\s*((?:[\w\u00c0-\uFFFF\-]|\\.)+)\s*(?:(\S?=)\s*(?:(['"])(.*?)\3|(#?(?:[\w\u00c0-\uFFFF\-]|\\.)*)|)|)\s*\]/,
				TAG : /^((?:[\w\u00c0-\uFFFF\*\-]|\\.)+)/,
				CHILD : /:(only|nth|last|first)-child(?:\(\s*(even|odd|(?:[+\-]?\d+|(?:[+\-]?\d*)?n\s*(?:[+\-]\s*\d+)?))\s*\))?/,
				POS : /:(nth|eq|gt|lt|first|last|even|odd)(?:\((\d*)\))?(?=[^\-]|$)/,
				PSEUDO : /:((?:[\w\u00c0-\uFFFF\-]|\\.)+)(?:\((['"]?)((?:\([^\)]+\)|[^\(\)]*)+)\2\))?/
			},

			leftMatch : {},

			attrMap : {
				"class" : "className",
				"for" : "htmlFor"
			},

			attrHandle : {
				href : function(elem) {
					return elem.getAttribute("href");
				},
				type : function(elem) {
					return elem.getAttribute("type");
				}
			},

			relative : {
				"+" : function(checkSet, part) {
					var isPartStr = typeof part === "string", isTag = isPartStr && !rNonWord.test(part), isPartStrNotTag = isPartStr && !isTag;

					if (isTag) {
						part = part.toLowerCase();
					}

					for (var i = 0, l = checkSet.length, elem; i < l; i++) {
						if (( elem = checkSet[i])) {
							while (( elem = elem.previousSibling) && elem.nodeType !== 1) {
							}

							checkSet[i] = isPartStrNotTag || elem && elem.nodeName.toLowerCase() === part ? elem || false : elem === part;
						}
					}

					if (isPartStrNotTag) {
						Sizzle.filter(part, checkSet, true);
					}
				},

				">" : function(checkSet, part) {
					var elem, isPartStr = typeof part === "string", i = 0, l = checkSet.length;

					if (isPartStr && !rNonWord.test(part)) {
						part = part.toLowerCase();

						for (; i < l; i++) {
							elem = checkSet[i];

							if (elem) {
								var parent = elem.parentNode;
								checkSet[i] = parent.nodeName.toLowerCase() === part ? parent : false;
							}
						}

					} else {
						for (; i < l; i++) {
							elem = checkSet[i];

							if (elem) {
								checkSet[i] = isPartStr ? elem.parentNode : elem.parentNode === part;
							}
						}

						if (isPartStr) {
							Sizzle.filter(part, checkSet, true);
						}
					}
				},

				"" : function(checkSet, part, isXML) {
					var nodeCheck, doneName = done++, checkFn = dirCheck;

					if ( typeof part === "string" && !rNonWord.test(part)) {
						part = part.toLowerCase();
						nodeCheck = part;
						checkFn = dirNodeCheck;
					}

					checkFn("parentNode", part, doneName, checkSet, nodeCheck, isXML);
				},

				"~" : function(checkSet, part, isXML) {
					var nodeCheck, doneName = done++, checkFn = dirCheck;

					if ( typeof part === "string" && !rNonWord.test(part)) {
						part = part.toLowerCase();
						nodeCheck = part;
						checkFn = dirNodeCheck;
					}

					checkFn("previousSibling", part, doneName, checkSet, nodeCheck, isXML);
				}
			},

			find : {
				ID : function(match, context, isXML) {
					if ( typeof context.getElementById !== "undefined" && !isXML) {
						var m = context.getElementById(match[1]);
						// Check parentNode to catch when Blackberry 4.6 returns
						// nodes that are no longer in the document #6963
						return m && m.parentNode ? [m] : [];
					}
				},

				NAME : function(match, context) {
					if ( typeof context.getElementsByName !== "undefined") {
						var ret = [], results = context.getElementsByName(match[1]);

						for (var i = 0, l = results.length; i < l; i++) {
							if (results[i].getAttribute("name") === match[1]) {
								ret.push(results[i]);
							}
						}

						return ret.length === 0 ? null : ret;
					}
				},

				TAG : function(match, context) {
					if ( typeof context.getElementsByTagName !== "undefined") {
						return context.getElementsByTagName(match[1]);
					}
				}
			},
			preFilter : {
				CLASS : function(match, curLoop, inplace, result, not, isXML) {
					match = " " + match[1].replace(rBackslash, "") + " ";

					if (isXML) {
						return match;
					}

					for (var i = 0, elem; ( elem = curLoop[i]) != null; i++) {
						if (elem) {
							if (not ^ (elem.className && (" " + elem.className + " ").replace(/[\t\n\r]/g, " ").indexOf(match) >= 0)) {
								if (!inplace) {
									result.push(elem);
								}

							} else if (inplace) {
								curLoop[i] = false;
							}
						}
					}

					return false;
				},

				ID : function(match) {
					return match[1].replace(rBackslash, "");
				},

				TAG : function(match, curLoop) {
					return match[1].replace(rBackslash, "").toLowerCase();
				},

				CHILD : function(match) {
					if (match[1] === "nth") {
						if (!match[2]) {
							Sizzle.error(match[0]);
						}

						match[2] = match[2].replace(/^\+|\s*/g, '');

						// parse equations like 'even', 'odd', '5', '2n', '3n+2', '4n-1', '-n+6'
						var test = /(-?)(\d*)(?:n([+\-]?\d*))?/.exec(match[2] === "even" && "2n" || match[2] === "odd" && "2n+1" || !/\D/.test(match[2]) && "0n+" + match[2] || match[2]);

						// calculate the numbers (first)n+(last) including if they are negative
						match[2] = (test[1] + (test[2] || 1)) - 0;
						match[3] = test[3] - 0;
					} else if (match[2]) {
						Sizzle.error(match[0]);
					}

					// TODO: Move to normal caching system
					match[0] = done++;

					return match;
				},

				ATTR : function(match, curLoop, inplace, result, not, isXML) {
					var name = match[1] = match[1].replace(rBackslash, "");

					if (!isXML && Expr.attrMap[name]) {
						match[1] = Expr.attrMap[name];
					}

					// Handle if an un-quoted value was used
					match[4] = (match[4] || match[5] || "" ).replace(rBackslash, "");

					if (match[2] === "~=") {
						match[4] = " " + match[4] + " ";
					}

					return match;
				},

				PSEUDO : function(match, curLoop, inplace, result, not) {
					if (match[1] === "not") {
						// If we're dealing with a complex expression, or a simple one
						if ((chunker.exec(match[3]) || "" ).length > 1 || /^\w/.test(match[3])) {
							match[3] = Sizzle(match[3], null, null, curLoop);

						} else {
							var ret = Sizzle.filter(match[3], curLoop, inplace, true ^ not);

							if (!inplace) {
								result.push.apply(result, ret);
							}

							return false;
						}

					} else if (Expr.match.POS.test(match[0]) || Expr.match.CHILD.test(match[0])) {
						return true;
					}

					return match;
				},

				POS : function(match) {
					match.unshift(true);

					return match;
				}
			},

			filters : {
				enabled : function(elem) {
					return elem.disabled === false && elem.type !== "hidden";
				},

				disabled : function(elem) {
					return elem.disabled === true;
				},

				checked : function(elem) {
					return elem.checked === true;
				},

				selected : function(elem) {
					// Accessing this property makes selected-by-default
					// options in Safari work properly
					if (elem.parentNode) {
						elem.parentNode.selectedIndex
					}

					return elem.selected === true;
				},

				parent : function(elem) {
					return !!elem.firstChild;
				},

				empty : function(elem) {
					return !elem.firstChild;
				},

				has : function(elem, i, match) {
					return !!Sizzle(match[3], elem).length;
				},

				header : function(elem) {
					return (/h\d/i).test(elem.nodeName);
				},

				text : function(elem) {
					var attr = elem.getAttribute("type"), type = elem.type;
					// IE6 and 7 will map elem.type to 'text' for new HTML5 types (search, etc)
					// use getAttribute instead to test this case
					return elem.nodeName.toLowerCase() === "input" && "text" === type && (attr === type || attr === null );
				},

				radio : function(elem) {
					return elem.nodeName.toLowerCase() === "input" && "radio" === elem.type;
				},

				checkbox : function(elem) {
					return elem.nodeName.toLowerCase() === "input" && "checkbox" === elem.type;
				},

				file : function(elem) {
					return elem.nodeName.toLowerCase() === "input" && "file" === elem.type;
				},

				password : function(elem) {
					return elem.nodeName.toLowerCase() === "input" && "password" === elem.type;
				},

				submit : function(elem) {
					var name = elem.nodeName.toLowerCase();
					return (name === "input" || name === "button") && "submit" === elem.type;
				},

				image : function(elem) {
					return elem.nodeName.toLowerCase() === "input" && "image" === elem.type;
				},

				reset : function(elem) {
					var name = elem.nodeName.toLowerCase();
					return (name === "input" || name === "button") && "reset" === elem.type;
				},

				button : function(elem) {
					var name = elem.nodeName.toLowerCase();
					return name === "input" && "button" === elem.type || name === "button";
				},

				input : function(elem) {
					return (/input|select|textarea|button/i).test(elem.nodeName);
				},

				focus : function(elem) {
					return elem === elem.ownerDocument.activeElement;
				}
			},
			setFilters : {
				first : function(elem, i) {
					return i === 0;
				},

				last : function(elem, i, match, array) {
					return i === array.length - 1;
				},

				even : function(elem, i) {
					return i % 2 === 0;
				},

				odd : function(elem, i) {
					return i % 2 === 1;
				},

				lt : function(elem, i, match) {
					return i < match[3] - 0;
				},

				gt : function(elem, i, match) {
					return i > match[3] - 0;
				},

				nth : function(elem, i, match) {
					return match[3] - 0 === i;
				},

				eq : function(elem, i, match) {
					return match[3] - 0 === i;
				}
			},
			filter : {
				PSEUDO : function(elem, match, i, array) {
					var name = match[1], filter = Expr.filters[name];

					if (filter) {
						return filter(elem, i, match, array);

					} else if (name === "contains") {
						return (elem.textContent || elem.innerText || getText([elem]) || "").indexOf(match[3]) >= 0;

					} else if (name === "not") {
						var not = match[3];

						for (var j = 0, l = not.length; j < l; j++) {
							if (not[j] === elem) {
								return false;
							}
						}

						return true;

					} else {
						Sizzle.error(name);
					}
				},

				CHILD : function(elem, match) {
					var first, last, doneName, parent, cache, count, diff, type = match[1], node = elem;

					switch ( type ) {
						case "only":
						case "first":
							while (( node = node.previousSibling)) {
								if (node.nodeType === 1) {
									return false;
								}
							}

							if (type === "first") {
								return true;
							}

							node = elem;

						case "last":
							while (( node = node.nextSibling)) {
								if (node.nodeType === 1) {
									return false;
								}
							}

							return true;

						case "nth":
							first = match[2];
							last = match[3];

							if (first === 1 && last === 0) {
								return true;
							}

							doneName = match[0];
							parent = elem.parentNode;

							if (parent && (parent[expando] !== doneName || !elem.nodeIndex)) {
								count = 0;

								for ( node = parent.firstChild; node; node = node.nextSibling) {
									if (node.nodeType === 1) {
										node.nodeIndex = ++count;
									}
								}

								parent[expando] = doneName;
							}

							diff = elem.nodeIndex - last;

							if (first === 0) {
								return diff === 0;

							} else {
								return (diff % first === 0 && diff / first >= 0 );
							}
					}
				},

				ID : function(elem, match) {
					return elem.nodeType === 1 && elem.getAttribute("id") === match;
				},

				TAG : function(elem, match) {
					return (match === "*" && elem.nodeType === 1) || !!elem.nodeName && elem.nodeName.toLowerCase() === match;
				},

				CLASS : function(elem, match) {
					return (" " + (elem.className || elem.getAttribute("class")) + " ").indexOf(match) > -1;
				},

				ATTR : function(elem, match) {
					var name = match[1], result = Sizzle.attr ? Sizzle.attr(elem, name) : Expr.attrHandle[name] ? Expr.attrHandle[ name ](elem) : elem[name] != null ? elem[name] : elem.getAttribute(name), value = result + "", type = match[2], check = match[4];

					return result == null ? type === "!=" : !type && Sizzle.attr ? result != null : type === "=" ? value === check : type === "*=" ? value.indexOf(check) >= 0 : type === "~=" ? (" " + value + " ").indexOf(check) >= 0 : !check ? value && result !== false : type === "!=" ? value !== check : type === "^=" ? value.indexOf(check) === 0 : type === "$=" ? value.substr(value.length - check.length) === check : type === "|=" ? value === check || value.substr(0, check.length + 1) === check + "-" : false;
				},

				POS : function(elem, match, i, array) {
					var name = match[2], filter = Expr.setFilters[name];

					if (filter) {
						return filter(elem, i, match, array);
					}
				}
			}
		};

		var origPOS = Expr.match.POS, fescape = function(all, num) {
			return "\\" + (num - 0 + 1);
		};

		for (var type in Expr.match ) {
			Expr.match[type] = new RegExp(Expr.match[type].source + (/(?![^\[]*\])(?![^\(]*\))/.source));
			Expr.leftMatch[type] = new RegExp(/(^(?:.|\r|\n)*?)/.source + Expr.match[type].source.replace(/\\(\d+)/g, fescape));
		}

		var makeArray = function(array, results) {
			array = Array.prototype.slice.call(array, 0);

			if (results) {
				results.push.apply(results, array);
				return results;
			}

			return array;
		};

		// Perform a simple check to determine if the browser is capable of
		// converting a NodeList to an array using builtin methods.
		// Also verifies that the returned array holds DOM nodes
		// (which is not the case in the Blackberry browser)
		try {
			Array.prototype.slice.call( document.documentElement.childNodes, 0 )[0].nodeType

			// Provide a fallback method if it does not work
		} catch( e ) {
			makeArray = function(array, results) {
				var i = 0, ret = results || [];

				if (toString.call(array) === "[object Array]") {
					Array.prototype.push.apply(ret, array);

				} else {
					if ( typeof array.length === "number") {
						for (var l = array.length; i < l; i++) {
							ret.push(array[i]);
						}

					} else {
						for (; array[i]; i++) {
							ret.push(array[i]);
						}
					}
				}

				return ret;
			};
		}

		var sortOrder, siblingCheck;

		if (document.documentElement.compareDocumentPosition) {
			sortOrder = function(a, b) {
				if (a === b) {
					hasDuplicate = true;
					return 0;
				}

				if (!a.compareDocumentPosition || !b.compareDocumentPosition) {
					return a.compareDocumentPosition ? -1 : 1;
				}

				return a.compareDocumentPosition(b) & 4 ? -1 : 1;
			};

		} else {
			sortOrder = function(a, b) {
				// The nodes are identical, we can exit early
				if (a === b) {
					hasDuplicate = true;
					return 0;

					// Fallback to using sourceIndex (in IE) if it's available on both nodes
				} else if (a.sourceIndex && b.sourceIndex) {
					return a.sourceIndex - b.sourceIndex;
				}

				var al, bl, ap = [], bp = [], aup = a.parentNode, bup = b.parentNode, cur = aup;

				// If the nodes are siblings (or identical) we can do a quick check
				if (aup === bup) {
					return siblingCheck(a, b);

					// If no parents were found then the nodes are disconnected
				} else if (!aup) {
					return -1;

				} else if (!bup) {
					return 1;
				}

				// Otherwise they're somewhere else in the tree so we need
				// to build up a full list of the parentNodes for comparison
				while (cur) {
					ap.unshift(cur);
					cur = cur.parentNode;
				}

				cur = bup;

				while (cur) {
					bp.unshift(cur);
					cur = cur.parentNode;
				}

				al = ap.length;
				bl = bp.length;

				// Start walking down the tree looking for a discrepancy
				for (var i = 0; i < al && i < bl; i++) {
					if (ap[i] !== bp[i]) {
						return siblingCheck(ap[i], bp[i]);
					}
				}

				// We ended someplace up the tree so do a sibling check
				return i === al ? siblingCheck(a, bp[i], -1) : siblingCheck(ap[i], b, 1);
			};

			siblingCheck = function(a, b, ret) {
				if (a === b) {
					return ret;
				}

				var cur = a.nextSibling;

				while (cur) {
					if (cur === b) {
						return -1;
					}

					cur = cur.nextSibling;
				}

				return 1;
			};
		}

		// Check to see if the browser returns elements by name when
		// querying by getElementById (and provide a workaround)
		(function() {
			// We're going to inject a fake input element with a specified name
			var form = document.createElement("div"), id = "script" + (new Date()).getTime(), root = document.documentElement;

			form.innerHTML = "<a name='" + id + "'/>";

			// Inject it into the root element, check its status, and remove it quickly
			root.insertBefore(form, root.firstChild);

			// The workaround has to do additional checks after a getElementById
			// Which slows things down for other browsers (hence the branching)
			if (document.getElementById(id)) {
				Expr.find.ID = function(match, context, isXML) {
					if ( typeof context.getElementById !== "undefined" && !isXML) {
						var m = context.getElementById(match[1]);

						return m ? m.id === match[1] || typeof m.getAttributeNode !== "undefined" && m.getAttributeNode("id").nodeValue === match[1] ? [m] : undefined : [];
					}
				};

				Expr.filter.ID = function(elem, match) {
					var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");

					return elem.nodeType === 1 && node && node.nodeValue === match;
				};
			}

			root.removeChild(form);

			// release memory in IE
			root = form = null;
		})();

		(function() {
			// Check to see if the browser returns only elements
			// when doing getElementsByTagName("*")

			// Create a fake element
			var div = document.createElement("div");
			div.appendChild(document.createComment(""));

			// Make sure no comments are found
			if (div.getElementsByTagName("*").length > 0) {
				Expr.find.TAG = function(match, context) {
					var results = context.getElementsByTagName(match[1]);

					// Filter out possible comments
					if (match[1] === "*") {
						var tmp = [];

						for (var i = 0; results[i]; i++) {
							if (results[i].nodeType === 1) {
								tmp.push(results[i]);
							}
						}

						results = tmp;
					}

					return results;
				};
			}

			// Check to see if an attribute returns normalized href attributes
			div.innerHTML = "<a href='#'></a>";

			if (div.firstChild && typeof div.firstChild.getAttribute !== "undefined" && div.firstChild.getAttribute("href") !== "#") {

				Expr.attrHandle.href = function(elem) {
					return elem.getAttribute("href", 2);
				};
			}

			// release memory in IE
			div = null;
		})();

		if (document.querySelectorAll) {
			(function() {
				var oldSizzle = Sizzle, div = document.createElement("div"), id = "__sizzle__";

				div.innerHTML = "<p class='TEST'></p>";

				// Safari can't handle uppercase or unicode characters when
				// in quirks mode.
				if (div.querySelectorAll && div.querySelectorAll(".TEST").length === 0) {
					return;
				}

				Sizzle = function(query, context, extra, seed) {
					context = context || document;

					// Only use querySelectorAll on non-XML documents
					// (ID selectors don't work in non-HTML documents)
					if (!seed && !Sizzle.isXML(context)) {
						// See if we find a selector to speed up
						var match = /^(\w+$)|^\.([\w\-]+$)|^#([\w\-]+$)/.exec(query);

						if (match && (context.nodeType === 1 || context.nodeType === 9)) {
							// Speed-up: Sizzle("TAG")
							if (match[1]) {
								return makeArray(context.getElementsByTagName(query), extra);

								// Speed-up: Sizzle(".CLASS")
							} else if (match[2] && Expr.find.CLASS && context.getElementsByClassName) {
								return makeArray(context.getElementsByClassName(match[2]), extra);
							}
						}

						if (context.nodeType === 9) {
							// Speed-up: Sizzle("body")
							// The body element only exists once, optimize finding it
							if (query === "body" && context.body) {
								return makeArray([context.body], extra);

								// Speed-up: Sizzle("#ID")
							} else if (match && match[3]) {
								var elem = context.getElementById(match[3]);

								// Check parentNode to catch when Blackberry 4.6 returns
								// nodes that are no longer in the document #6963
								if (elem && elem.parentNode) {
									// Handle the case where IE and Opera return items
									// by name instead of ID
									if (elem.id === match[3]) {
										return makeArray([elem], extra);
									}

								} else {
									return makeArray([], extra);
								}
							}

							try {
								return makeArray(context.querySelectorAll(query), extra);
							} catch(qsaError) {
							}

							// qSA works strangely on Element-rooted queries
							// We can work around this by specifying an extra ID on the root
							// and working up from there (Thanks to Andrew Dupont for the technique)
							// IE 8 doesn't work on object elements
						} else if (context.nodeType === 1 && context.nodeName.toLowerCase() !== "object") {
							var oldContext = context, old = context.getAttribute("id"), nid = old || id, hasParent = context.parentNode, relativeHierarchySelector = /^\s*[+~]/.test(query);

							if (!old) {
								context.setAttribute("id", nid);
							} else {
								nid = nid.replace(/'/g, "\\$&");
							}
							if (relativeHierarchySelector && hasParent) {
								context = context.parentNode;
							}

							try {
								if (!relativeHierarchySelector || hasParent) {
									return makeArray(context.querySelectorAll("[id='" + nid + "'] " + query), extra);
								}

							} catch(pseudoError) {
							} finally {
								if (!old) {
									oldContext.removeAttribute("id");
								}
							}
						}
					}

					return oldSizzle(query, context, extra, seed);
				};

				for (var prop in oldSizzle ) {
					Sizzle[prop] = oldSizzle[prop];
				}

				// release memory in IE
				div = null;
			})();
		}

		(function() {
			var html = document.documentElement, matches = html.matchesSelector || html.mozMatchesSelector || html.webkitMatchesSelector || html.msMatchesSelector;

			if (matches) {
				// Check to see if it's possible to do matchesSelector
				// on a disconnected node (IE 9 fails this)
				var disconnectedMatch = !matches.call(document.createElement("div"), "div"), pseudoWorks = false;

				try {
					// This should fail with an exception
					// Gecko does not error, returns false instead
					matches.call(document.documentElement, "[test!='']:sizzle");

				} catch( pseudoError ) {
					pseudoWorks = true;
				}

				Sizzle.matchesSelector = function(node, expr) {
					// Make sure that attribute selectors are quoted
					expr = expr.replace(/\=\s*([^'"\]]*)\s*\]/g, "='$1']");

					if (!Sizzle.isXML(node)) {
						try {
							if (pseudoWorks || !Expr.match.PSEUDO.test(expr) && !/!=/.test(expr)) {
								var ret = matches.call(node, expr);

								// IE 9's matchesSelector returns false on disconnected nodes
								if (ret || !disconnectedMatch ||
								// As well, disconnected nodes are said to be in a document
								// fragment in IE 9, so check for that
								node.document && node.document.nodeType !== 11) {
									return ret;
								}
							}
						} catch(e) {
						}
					}

					return Sizzle(expr, null, null, [node]).length > 0;
				};
			}
		})();

		(function() {
			var div = document.createElement("div");

			div.innerHTML = "<div class='test e'></div><div class='test'></div>";

			// Opera can't find a second classname (in 9.6)
			// Also, make sure that getElementsByClassName actually exists
			if (!div.getElementsByClassName || div.getElementsByClassName("e").length === 0) {
				return;
			}

			// Safari caches class attributes, doesn't catch changes (in 3.2)
			div.lastChild.className = "e";

			if (div.getElementsByClassName("e").length === 1) {
				return;
			}

			Expr.order.splice(1, 0, "CLASS");
			Expr.find.CLASS = function(match, context, isXML) {
				if ( typeof context.getElementsByClassName !== "undefined" && !isXML) {
					return context.getElementsByClassName(match[1]);
				}
			};

			// release memory in IE
			div = null;
		})();

		function dirNodeCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
			for (var i = 0, l = checkSet.length; i < l; i++) {
				var elem = checkSet[i];

				if (elem) {
					var match = false;

					elem = elem[dir];

					while (elem) {
						if (elem[expando] === doneName) {
							match = checkSet[elem.sizset];
							break;
						}

						if (elem.nodeType === 1 && !isXML) {
							elem[expando] = doneName;
							elem.sizset = i;
						}

						if (elem.nodeName.toLowerCase() === cur) {
							match = elem;
							break;
						}

						elem = elem[dir];
					}

					checkSet[i] = match;
				}
			}
		}

		function dirCheck(dir, cur, doneName, checkSet, nodeCheck, isXML) {
			for (var i = 0, l = checkSet.length; i < l; i++) {
				var elem = checkSet[i];

				if (elem) {
					var match = false;

					elem = elem[dir];

					while (elem) {
						if (elem[expando] === doneName) {
							match = checkSet[elem.sizset];
							break;
						}

						if (elem.nodeType === 1) {
							if (!isXML) {
								elem[expando] = doneName;
								elem.sizset = i;
							}

							if ( typeof cur !== "string") {
								if (elem === cur) {
									match = true;
									break;
								}

							} else if (Sizzle.filter(cur, [elem]).length > 0) {
								match = elem;
								break;
							}
						}

						elem = elem[dir];
					}

					checkSet[i] = match;
				}
			}
		}

		if (document.documentElement.contains) {
			Sizzle.contains = function(a, b) {
				return a !== b && (a.contains ? a.contains(b) : true);
			};

		} else if (document.documentElement.compareDocumentPosition) {
			Sizzle.contains = function(a, b) {
				return !!(a.compareDocumentPosition(b) & 16);
			};

		} else {
			Sizzle.contains = function() {
				return false;
			};
		}

		Sizzle.isXML = function(elem) {
			// documentElement is verified for cases where it doesn't yet exist
			// (such as loading iframes in IE - #4833)
			var documentElement = ( elem ? elem.ownerDocument || elem : 0).documentElement;

			return documentElement ? documentElement.nodeName !== "HTML" : false;
		};

		var posProcess = function(selector, context, seed) {
			var match, tmpSet = [], later = "", root = context.nodeType ? [context] : context;

			// Position selectors must be done after the filter
			// And so must :not(positional) so we move all PSEUDOs to the end
			while (( match = Expr.match.PSEUDO.exec(selector))) {
				later += match[0];
				selector = selector.replace(Expr.match.PSEUDO, "");
			}

			selector = Expr.relative[selector] ? selector + "*" : selector;

			for (var i = 0, l = root.length; i < l; i++) {
				Sizzle(selector, root[i], tmpSet, seed);
			}

			return Sizzle.filter(later, tmpSet);
		};

		// EXPOSE
		// Override sizzle attribute retrieval
		Sizzle.attr = jQuery.attr;
		Sizzle.selectors.attrMap = {};
		jQuery.find = Sizzle;
		jQuery.expr = Sizzle.selectors;
		jQuery.expr[":"] = jQuery.expr.filters;
		jQuery.unique = Sizzle.uniqueSort;
		jQuery.text = Sizzle.getText;
		jQuery.isXMLDoc = Sizzle.isXML;
		jQuery.contains = Sizzle.contains;

	})();

	var runtil = /Until$/, rparentsprev = /^(?:parents|prevUntil|prevAll)/,
	// Note: This RegExp should be improved, or likely pulled from Sizzle
	rmultiselector = /,/, isSimple = /^.[^:#\[\.,]*$/, slice = Array.prototype.slice, POS = jQuery.expr.match.POS,
	// methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children : true,
		contents : true,
		next : true,
		prev : true
	};

	jQuery.fn.extend({
		find : function(selector) {
			var self = this, i, l;

			if ( typeof selector !== "string") {
				return jQuery(selector).filter(function() {
					for ( i = 0, l = self.length; i < l; i++) {
						if (jQuery.contains(self[i], this)) {
							return true;
						}
					}
				});
			}

			var ret = this.pushStack("", "find", selector), length, n, r;

			for ( i = 0, l = this.length; i < l; i++) {
				length = ret.length;
				jQuery.find(selector, this[i], ret);

				if (i > 0) {
					// Make sure that the results are unique
					for ( n = length; n < ret.length; n++) {
						for ( r = 0; r < length; r++) {
							if (ret[r] === ret[n]) {
								ret.splice(n--, 1);
								break;
							}
						}
					}
				}
			}

			return ret;
		},

		has : function(target) {
			var targets = jQuery(target);
			return this.filter(function() {
				for (var i = 0, l = targets.length; i < l; i++) {
					if (jQuery.contains(this, targets[i])) {
						return true;
					}
				}
			});
		},

		not : function(selector) {
			return this.pushStack(winnow(this, selector, false), "not", selector);
		},

		filter : function(selector) {
			return this.pushStack(winnow(this, selector, true), "filter", selector);
		},

		is : function(selector) {
			return !!selector && ( typeof selector === "string" ?
			// If this is a positional selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			POS.test(selector) ? jQuery(selector, this.context).index(this[0]) >= 0 : jQuery.filter(selector, this).length > 0 : this.filter(selector).length > 0 );
		},

		closest : function(selectors, context) {
			var ret = [], i, l, cur = this[0];

			// Array (deprecated as of jQuery 1.7)
			if (jQuery.isArray(selectors)) {
				var level = 1;

				while (cur && cur.ownerDocument && cur !== context) {
					for ( i = 0; i < selectors.length; i++) {

						if (jQuery(cur).is(selectors[i])) {
							ret.push({
								selector : selectors[i],
								elem : cur,
								level : level
							});
						}
					}

					cur = cur.parentNode;
					level++;
				}

				return ret;
			}

			// String
			var pos = POS.test(selectors) || typeof selectors !== "string" ? jQuery(selectors, context || this.context) : 0;

			for ( i = 0, l = this.length; i < l; i++) {
				cur = this[i];

				while (cur) {
					if ( pos ? pos.index(cur) > -1 : jQuery.find.matchesSelector(cur, selectors)) {
						ret.push(cur);
						break;

					} else {
						cur = cur.parentNode;
						if (!cur || !cur.ownerDocument || cur === context || cur.nodeType === 11) {
							break;
						}
					}
				}
			}

			ret = ret.length > 1 ? jQuery.unique(ret) : ret;

			return this.pushStack(ret, "closest", selectors);
		},

		// Determine the position of an element within
		// the matched set of elements
		index : function(elem) {

			// No argument, return index in parent
			if (!elem) {
				return (this[0] && this[0].parentNode ) ? this.prevAll().length : -1;
			}

			// index in selector
			if ( typeof elem === "string") {
				return jQuery.inArray(this[0], jQuery(elem));
			}

			// Locate the position of the desired element
			return jQuery.inArray(
			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[0] : elem, this);
		},

		add : function(selector, context) {
			var set = typeof selector === "string" ? jQuery(selector, context) : jQuery.makeArray(selector && selector.nodeType ? [selector] : selector), all = jQuery.merge(this.get(), set);

			return this.pushStack(isDisconnected(set[0]) || isDisconnected(all[0]) ? all : jQuery.unique(all));
		},

		andSelf : function() {
			return this.add(this.prevObject);
		}
	});

	// A painfully simple check to see if an element is disconnected
	// from a document (should be improved, where feasible).
	function isDisconnected(node) {
		return !node || !node.parentNode || node.parentNode.nodeType === 11;
	}


	jQuery.each({
		parent : function(elem) {
			var parent = elem.parentNode;
			return parent && parent.nodeType !== 11 ? parent : null;
		},
		parents : function(elem) {
			return jQuery.dir(elem, "parentNode");
		},
		parentsUntil : function(elem, i, until) {
			return jQuery.dir(elem, "parentNode", until);
		},
		next : function(elem) {
			return jQuery.nth(elem, 2, "nextSibling");
		},
		prev : function(elem) {
			return jQuery.nth(elem, 2, "previousSibling");
		},
		nextAll : function(elem) {
			return jQuery.dir(elem, "nextSibling");
		},
		prevAll : function(elem) {
			return jQuery.dir(elem, "previousSibling");
		},
		nextUntil : function(elem, i, until) {
			return jQuery.dir(elem, "nextSibling", until);
		},
		prevUntil : function(elem, i, until) {
			return jQuery.dir(elem, "previousSibling", until);
		},
		siblings : function(elem) {
			return jQuery.sibling(elem.parentNode.firstChild, elem);
		},
		children : function(elem) {
			return jQuery.sibling(elem.firstChild);
		},
		contents : function(elem) {
			return jQuery.nodeName(elem, "iframe") ? elem.contentDocument || elem.contentWindow.document : jQuery.makeArray(elem.childNodes);
		}
	}, function(name, fn) {
		jQuery.fn[name] = function(until, selector) {
			var ret = jQuery.map(this, fn, until);

			if (!runtil.test(name)) {
				selector = until;
			}

			if (selector && typeof selector === "string") {
				ret = jQuery.filter(selector, ret);
			}

			ret = this.length > 1 && !guaranteedUnique[name] ? jQuery.unique(ret) : ret;

			if ((this.length > 1 || rmultiselector.test(selector)) && rparentsprev.test(name)) {
				ret = ret.reverse();
			}

			return this.pushStack(ret, name, slice.call(arguments).join(","));
		};
	});

	jQuery.extend({
		filter : function(expr, elems, not) {
			if (not) {
				expr = ":not(" + expr + ")";
			}

			return elems.length === 1 ? jQuery.find.matchesSelector(elems[0], expr) ? [elems[0]] : [] : jQuery.find.matches(expr, elems);
		},

		dir : function(elem, dir, until) {
			var matched = [], cur = elem[dir];

			while (cur && cur.nodeType !== 9 && (until === undefined || cur.nodeType !== 1 || !jQuery(cur).is(until))) {
				if (cur.nodeType === 1) {
					matched.push(cur);
				}
				cur = cur[dir];
			}
			return matched;
		},

		nth : function(cur, result, dir, elem) {
			result = result || 1;
			var num = 0;

			for (; cur; cur = cur[dir]) {
				if (cur.nodeType === 1 && ++num === result) {
					break;
				}
			}

			return cur;
		},

		sibling : function(n, elem) {
			var r = [];

			for (; n; n = n.nextSibling) {
				if (n.nodeType === 1 && n !== elem) {
					r.push(n);
				}
			}

			return r;
		}
	});

	// Implement the identical functionality for filter and not
	function winnow(elements, qualifier, keep) {

		// Can't pass null or undefined to indexOf in Firefox 4
		// Set to 0 to skip string check
		qualifier = qualifier || 0;

		if (jQuery.isFunction(qualifier)) {
			return jQuery.grep(elements, function(elem, i) {
				var retVal = !!qualifier.call(elem, i, elem);
				return retVal === keep;
			});

		} else if (qualifier.nodeType) {
			return jQuery.grep(elements, function(elem, i) {
				return (elem === qualifier ) === keep;
			});

		} else if ( typeof qualifier === "string") {
			var filtered = jQuery.grep(elements, function(elem) {
				return elem.nodeType === 1;
			});

			if (isSimple.test(qualifier)) {
				return jQuery.filter(qualifier, filtered, !keep);
			} else {
				qualifier = jQuery.filter(qualifier, filtered);
			}
		}

		return jQuery.grep(elements, function(elem, i) {
			return (jQuery.inArray(elem, qualifier) >= 0 ) === keep;
		});
	}

	function createSafeFragment(document) {
		var list = nodeNames.split("|"), safeFrag = document.createDocumentFragment();

		if (safeFrag.createElement) {
			while (list.length) {
				safeFrag.createElement(list.pop());
			}
		}
		return safeFrag;
	}

	var nodeNames = "abbr|article|aside|audio|canvas|datalist|details|figcaption|figure|footer|" + "header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", rinlinejQuery = / jQuery\d+="(?:\d+|null)"/g, rleadingWhitespace = /^\s+/, rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig, rtagName = /<([\w:]+)/, rtbody = /<tbody/i, rhtml = /<|&#?\w+;/, rnoInnerhtml = /<(?:script|style)/i, rnocache = /<(?:script|object|embed|option|style)/i, rnoshimcache = new RegExp("<(?:" + nodeNames + ")", "i"),
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i, rscriptType = /\/(java|ecma)script/i, rcleanScript = /^\s*<!(?:\[CDATA\[|\-\-)/, wrapMap = {
		option : [1, "<select multiple='multiple'>", "</select>"],
		legend : [1, "<fieldset>", "</fieldset>"],
		thead : [1, "<table>", "</table>"],
		tr : [2, "<table><tbody>", "</tbody></table>"],
		td : [3, "<table><tbody><tr>", "</tr></tbody></table>"],
		col : [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"],
		area : [1, "<map>", "</map>"],
		_default : [0, "", ""]
	}, safeFragment = createSafeFragment(document);

	wrapMap.optgroup = wrapMap.option;
	wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	wrapMap.th = wrapMap.td;

	// IE can't serialize <link> and <script> tags normally
	if (!jQuery.support.htmlSerialize) {
		wrapMap._default = [1, "div<div>", "</div>"];
	}

	jQuery.fn.extend({
		text : function(text) {
			if (jQuery.isFunction(text)) {
				return this.each(function(i) {
					var self = jQuery(this);

					self.text(text.call(this, i, self.text()));
				});
			}

			if ( typeof text !== "object" && text !== undefined) {
				return this.empty().append((this[0] && this[0].ownerDocument || document).createTextNode(text));
			}

			return jQuery.text(this);
		},

		wrapAll : function(html) {
			if (jQuery.isFunction(html)) {
				return this.each(function(i) {
					jQuery(this).wrapAll(html.call(this, i));
				});
			}

			if (this[0]) {
				// The elements to wrap the target around
				var wrap = jQuery(html, this[0].ownerDocument).eq(0).clone(true);

				if (this[0].parentNode) {
					wrap.insertBefore(this[0]);
				}

				wrap.map(function() {
					var elem = this;

					while (elem.firstChild && elem.firstChild.nodeType === 1) {
						elem = elem.firstChild;
					}

					return elem;
				}).append(this);
			}

			return this;
		},

		wrapInner : function(html) {
			if (jQuery.isFunction(html)) {
				return this.each(function(i) {
					jQuery(this).wrapInner(html.call(this, i));
				});
			}

			return this.each(function() {
				var self = jQuery(this), contents = self.contents();

				if (contents.length) {
					contents.wrapAll(html);

				} else {
					self.append(html);
				}
			});
		},

		wrap : function(html) {
			var isFunction = jQuery.isFunction(html);

			return this.each(function(i) {
				jQuery(this).wrapAll( isFunction ? html.call(this, i) : html);
			});
		},

		unwrap : function() {
			return this.parent().each(function() {
				if (!jQuery.nodeName(this, "body")) {
					jQuery(this).replaceWith(this.childNodes);
				}
			}).end();
		},

		append : function() {
			return this.domManip(arguments, true, function(elem) {
				if (this.nodeType === 1) {
					this.appendChild(elem);
				}
			});
		},

		prepend : function() {
			return this.domManip(arguments, true, function(elem) {
				if (this.nodeType === 1) {
					this.insertBefore(elem, this.firstChild);
				}
			});
		},

		before : function() {
			if (this[0] && this[0].parentNode) {
				return this.domManip(arguments, false, function(elem) {
					this.parentNode.insertBefore(elem, this);
				});
			} else if (arguments.length) {
				var set = jQuery.clean(arguments);
				set.push.apply(set, this.toArray());
				return this.pushStack(set, "before", arguments);
			}
		},

		after : function() {
			if (this[0] && this[0].parentNode) {
				return this.domManip(arguments, false, function(elem) {
					this.parentNode.insertBefore(elem, this.nextSibling);
				});
			} else if (arguments.length) {
				var set = this.pushStack(this, "after", arguments);
				set.push.apply(set, jQuery.clean(arguments));
				return set;
			}
		},

		// keepData is for internal use only--do not document
		remove : function(selector, keepData) {
			for (var i = 0, elem; ( elem = this[i]) != null; i++) {
				if (!selector || jQuery.filter(selector, [elem]).length) {
					if (!keepData && elem.nodeType === 1) {
						jQuery.cleanData(elem.getElementsByTagName("*"));
						jQuery.cleanData([elem]);
					}

					if (elem.parentNode) {
						elem.parentNode.removeChild(elem);
					}
				}
			}

			return this;
		},

		empty : function() {
			for (var i = 0, elem; ( elem = this[i]) != null; i++) {
				// Remove element nodes and prevent memory leaks
				if (elem.nodeType === 1) {
					jQuery.cleanData(elem.getElementsByTagName("*"));
				}

				// Remove any remaining nodes
				while (elem.firstChild) {
					elem.removeChild(elem.firstChild);
				}
			}

			return this;
		},

		clone : function(dataAndEvents, deepDataAndEvents) {
			dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
			deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

			return this.map(function() {
				return jQuery.clone(this, dataAndEvents, deepDataAndEvents);
			});
		},

		html : function(value) {
			if (value === undefined) {
				return this[0] && this[0].nodeType === 1 ? this[0].innerHTML.replace(rinlinejQuery, "") : null;

				// See if we can take a shortcut and just use innerHTML
			} else if ( typeof value === "string" && !rnoInnerhtml.test(value) && (jQuery.support.leadingWhitespace || !rleadingWhitespace.test(value)) && !wrapMap[ (rtagName.exec( value ) || ["", ""])[1].toLowerCase()]) {

				value = value.replace(rxhtmlTag, "<$1></$2>");

				try {
					for (var i = 0, l = this.length; i < l; i++) {
						// Remove element nodes and prevent memory leaks
						if (this[i].nodeType === 1) {
							jQuery.cleanData(this[i].getElementsByTagName("*"));
							this[i].innerHTML = value;
						}
					}

					// If using innerHTML throws an exception, use the fallback method
				} catch(e) {
					this.empty().append(value);
				}

			} else if (jQuery.isFunction(value)) {
				this.each(function(i) {
					var self = jQuery(this);

					self.html(value.call(this, i, self.html()));
				});

			} else {
				this.empty().append(value);
			}

			return this;
		},

		replaceWith : function(value) {
			if (this[0] && this[0].parentNode) {
				// Make sure that the elements are removed from the DOM before they are inserted
				// this can help fix replacing a parent with child elements
				if (jQuery.isFunction(value)) {
					return this.each(function(i) {
						var self = jQuery(this), old = self.html();
						self.replaceWith(value.call(this, i, old));
					});
				}

				if ( typeof value !== "string") {
					value = jQuery(value).detach();
				}

				return this.each(function() {
					var next = this.nextSibling, parent = this.parentNode;

					jQuery(this).remove();

					if (next) {
						jQuery(next).before(value);
					} else {
						jQuery(parent).append(value);
					}
				});
			} else {
				return this.length ? this.pushStack(jQuery(jQuery.isFunction(value) ? value() : value), "replaceWith", value) : this;
			}
		},

		detach : function(selector) {
			return this.remove(selector, true);
		},

		domManip : function(args, table, callback) {
			var results, first, fragment, parent, value = args[0], scripts = [];

			// We can't cloneNode fragments that contain checked, in WebKit
			if (!jQuery.support.checkClone && arguments.length === 3 && typeof value === "string" && rchecked.test(value)) {
				return this.each(function() {
					jQuery(this).domManip(args, table, callback, true);
				});
			}

			if (jQuery.isFunction(value)) {
				return this.each(function(i) {
					var self = jQuery(this);
					args[0] = value.call(this, i, table ? self.html() : undefined);
					self.domManip(args, table, callback);
				});
			}

			if (this[0]) {
				parent = value && value.parentNode;

				// If we're in a fragment, just use that instead of building a new one
				if (jQuery.support.parentNode && parent && parent.nodeType === 11 && parent.childNodes.length === this.length) {
					results = {
						fragment : parent
					};

				} else {
					results = jQuery.buildFragment(args, this, scripts);
				}

				fragment = results.fragment;

				if (fragment.childNodes.length === 1) {
					first = fragment = fragment.firstChild;
				} else {
					first = fragment.firstChild;
				}

				if (first) {
					table = table && jQuery.nodeName(first, "tr");

					for (var i = 0, l = this.length, lastIndex = l - 1; i < l; i++) {
						callback.call( table ? root(this[i], first) : this[i],
						// Make sure that we do not leak memory by inadvertently discarding
						// the original fragment (which might have attached data) instead of
						// using it; in addition, use the original fragment object for the last
						// item instead of first because it can end up being emptied incorrectly
						// in certain situations (Bug #8070).
						// Fragments from the fragment cache must always be cloned and never used
						// in place.
						results.cacheable || (l > 1 && i < lastIndex ) ? jQuery.clone(fragment, true, true) : fragment);
					}
				}

				if (scripts.length) {
					jQuery.each(scripts, evalScript);
				}
			}

			return this;
		}
	});

	function root(elem, cur) {
		return jQuery.nodeName(elem, "table") ? (elem.getElementsByTagName("tbody")[0] || elem.appendChild(elem.ownerDocument.createElement("tbody"))) : elem;
	}

	function cloneCopyEvent(src, dest) {

		if (dest.nodeType !== 1 || !jQuery.hasData(src)) {
			return;
		}

		var type, i, l, oldData = jQuery._data(src), curData = jQuery._data(dest, oldData), events = oldData.events;

		if (events) {
			delete curData.handle;
			curData.events = {};

			for (type in events ) {
				for ( i = 0, l = events[type].length; i < l; i++) {
					jQuery.event.add(dest, type + (events[ type ][i].namespace ? "." : "" ) + events[ type ][i].namespace, events[ type ][i], events[ type ][i].data);
				}
			}
		}

		// make the cloned public data object a copy from the original
		if (curData.data) {
			curData.data = jQuery.extend({}, curData.data);
		}
	}

	function cloneFixAttributes(src, dest) {
		var nodeName;

		// We do not need to do anything for non-Elements
		if (dest.nodeType !== 1) {
			return;
		}

		// clearAttributes removes the attributes, which we don't want,
		// but also removes the attachEvent events, which we *do* want
		if (dest.clearAttributes) {
			dest.clearAttributes();
		}

		// mergeAttributes, in contrast, only merges back on the
		// original attributes, not the events
		if (dest.mergeAttributes) {
			dest.mergeAttributes(src);
		}

		nodeName = dest.nodeName.toLowerCase();

		// IE6-8 fail to clone children inside object elements that use
		// the proprietary classid attribute value (rather than the type
		// attribute) to identify the type of content to display
		if (nodeName === "object") {
			dest.outerHTML = src.outerHTML;

		} else if (nodeName === "input" && (src.type === "checkbox" || src.type === "radio")) {
			// IE6-8 fails to persist the checked state of a cloned checkbox
			// or radio button. Worse, IE6-7 fail to give the cloned element
			// a checked appearance if the defaultChecked value isn't also set
			if (src.checked) {
				dest.defaultChecked = dest.checked = src.checked;
			}

			// IE6-7 get confused and end up setting the value of a cloned
			// checkbox/radio button to an empty string instead of "on"
			if (dest.value !== src.value) {
				dest.value = src.value;
			}

			// IE6-8 fails to return the selected option to the default selected
			// state when cloning options
		} else if (nodeName === "option") {
			dest.selected = src.defaultSelected;

			// IE6-8 fails to set the defaultValue to the correct value when
			// cloning other types of input fields
		} else if (nodeName === "input" || nodeName === "textarea") {
			dest.defaultValue = src.defaultValue;
		}

		// Event data gets referenced instead of copied if the expando
		// gets copied too
		dest.removeAttribute(jQuery.expando);
	}


	jQuery.buildFragment = function(args, nodes, scripts) {
		var fragment, cacheable, cacheresults, doc, first = args[0];

		// nodes may contain either an explicit document object,
		// a jQuery collection or context object.
		// If nodes[0] contains a valid object to assign to doc
		if (nodes && nodes[0]) {
			doc = nodes[0].ownerDocument || nodes[0];
		}

		// Ensure that an attr object doesn't incorrectly stand in as a document object
		// Chrome and Firefox seem to allow this to occur and will throw exception
		// Fixes #8950
		if (!doc.createDocumentFragment) {
			doc = document;
		}

		// Only cache "small" (1/2 KB) HTML strings that are associated with the main document
		// Cloning options loses the selected state, so don't cache them
		// IE 6 doesn't like it when you put <object> or <embed> elements in a fragment
		// Also, WebKit does not clone 'checked' attributes on cloneNode, so don't cache
		// Lastly, IE6,7,8 will not correctly reuse cached fragments that were created from unknown elems #10501
		if (args.length === 1 && typeof first === "string" && first.length < 512 && doc === document && first.charAt(0) === "<" && !rnocache.test(first) && (jQuery.support.checkClone || !rchecked.test(first)) && (jQuery.support.html5Clone || !rnoshimcache.test(first))) {

			cacheable = true;

			cacheresults = jQuery.fragments[first];
			if (cacheresults && cacheresults !== 1) {
				fragment = cacheresults;
			}
		}

		if (!fragment) {
			fragment = doc.createDocumentFragment();
			jQuery.clean(args, doc, fragment, scripts);
		}

		if (cacheable) {
			jQuery.fragments[first] = cacheresults ? fragment : 1;
		}

		return {
			fragment : fragment,
			cacheable : cacheable
		};
	};

	jQuery.fragments = {};

	jQuery.each({
		appendTo : "append",
		prependTo : "prepend",
		insertBefore : "before",
		insertAfter : "after",
		replaceAll : "replaceWith"
	}, function(name, original) {
		jQuery.fn[name] = function(selector) {
			var ret = [], insert = jQuery(selector), parent = this.length === 1 && this[0].parentNode;

			if (parent && parent.nodeType === 11 && parent.childNodes.length === 1 && insert.length === 1) {
				insert[ original ](this[0]);
				return this;

			} else {
				for (var i = 0, l = insert.length; i < l; i++) {
					var elems = (i > 0 ? this.clone(true) : this ).get();
					jQuery( insert[i] )[ original ](elems);
					ret = ret.concat(elems);
				}

				return this.pushStack(ret, name, insert.selector);
			}
		};
	});

	function getAll(elem) {
		if ( typeof elem.getElementsByTagName !== "undefined") {
			return elem.getElementsByTagName("*");

		} else if ( typeof elem.querySelectorAll !== "undefined") {
			return elem.querySelectorAll("*");

		} else {
			return [];
		}
	}

	// Used in clean, fixes the defaultChecked property
	function fixDefaultChecked(elem) {
		if (elem.type === "checkbox" || elem.type === "radio") {
			elem.defaultChecked = elem.checked;
		}
	}

	// Finds all inputs and passes them to fixDefaultChecked
	function findInputs(elem) {
		var nodeName = (elem.nodeName || "" ).toLowerCase();
		if (nodeName === "input") {
			fixDefaultChecked(elem);
			// Skip scripts, get other children
		} else if (nodeName !== "script" && typeof elem.getElementsByTagName !== "undefined") {
			jQuery.grep(elem.getElementsByTagName("input"), fixDefaultChecked);
		}
	}

	// Derived From: http://www.iecss.com/shimprove/javascript/shimprove.1-0-1.js
	function shimCloneNode(elem) {
		var div = document.createElement("div");
		safeFragment.appendChild(div);

		div.innerHTML = elem.outerHTML;
		return div.firstChild;
	}


	jQuery.extend({
		clone : function(elem, dataAndEvents, deepDataAndEvents) {
			var srcElements, destElements, i,
			// IE<=8 does not properly clone detached, unknown element nodes
			clone = jQuery.support.html5Clone || !rnoshimcache.test("<" + elem.nodeName) ? elem.cloneNode(true) : shimCloneNode(elem);

			if ((!jQuery.support.noCloneEvent || !jQuery.support.noCloneChecked) && (elem.nodeType === 1 || elem.nodeType === 11) && !jQuery.isXMLDoc(elem)) {
				// IE copies events bound via attachEvent when using cloneNode.
				// Calling detachEvent on the clone will also remove the events
				// from the original. In order to get around this, we use some
				// proprietary methods to clear the events. Thanks to MooTools
				// guys for this hotness.

				cloneFixAttributes(elem, clone);

				// Using Sizzle here is crazy slow, so we use getElementsByTagName instead
				srcElements = getAll(elem);
				destElements = getAll(clone);

				// Weird iteration because IE will replace the length property
				// with an element if you are cloning the body and one of the
				// elements on the page has a name or id of "length"
				for ( i = 0; srcElements[i]; ++i) {
					// Ensure that the destination node is not null; Fixes #9587
					if (destElements[i]) {
						cloneFixAttributes(srcElements[i], destElements[i]);
					}
				}
			}

			// Copy the events from the original to the clone
			if (dataAndEvents) {
				cloneCopyEvent(elem, clone);

				if (deepDataAndEvents) {
					srcElements = getAll(elem);
					destElements = getAll(clone);

					for ( i = 0; srcElements[i]; ++i) {
						cloneCopyEvent(srcElements[i], destElements[i]);
					}
				}
			}

			srcElements = destElements = null;

			// Return the cloned set
			return clone;
		},

		clean : function(elems, context, fragment, scripts) {
			var checkScriptType;

			context = context || document;

			// !context.createElement fails in IE with an error but returns typeof 'object'
			if ( typeof context.createElement === "undefined") {
				context = context.ownerDocument || context[0] && context[0].ownerDocument || document;
			}

			var ret = [], j;

			for (var i = 0, elem; ( elem = elems[i]) != null; i++) {
				if ( typeof elem === "number") {
					elem += "";
				}

				if (!elem) {
					continue;
				}

				// Convert html string into DOM nodes
				if ( typeof elem === "string") {
					if (!rhtml.test(elem)) {
						elem = context.createTextNode(elem);
					} else {
						// Fix "XHTML"-style tags in all browsers
						elem = elem.replace(rxhtmlTag, "<$1></$2>");

						// Trim whitespace, otherwise indexOf won't work as expected
						var tag = ( rtagName.exec( elem ) || ["", ""] )[1].toLowerCase(), wrap = wrapMap[tag] || wrapMap._default, depth = wrap[0], div = context.createElement("div");

						// Append wrapper element to unknown element safe doc fragment
						if (context === document) {
							// Use the fragment we've already created for this document
							safeFragment.appendChild(div);
						} else {
							// Use a fragment created with the owner document
							createSafeFragment(context).appendChild(div);
						}

						// Go to html and back, then peel off extra wrappers
						div.innerHTML = wrap[1] + elem + wrap[2];

						// Move to the right depth
						while (depth--) {
							div = div.lastChild;
						}

						// Remove IE's autoinserted <tbody> from table fragments
						if (!jQuery.support.tbody) {

							// String was a <table>, *may* have spurious <tbody>
							var hasBody = rtbody.test(elem), tbody = tag === "table" && !hasBody ? div.firstChild && div.firstChild.childNodes :

							// String was a bare <thead> or <tfoot>
							wrap[1] === "<table>" && !hasBody ? div.childNodes : [];

							for ( j = tbody.length - 1; j >= 0; --j) {
								if (jQuery.nodeName(tbody[j], "tbody") && !tbody[j].childNodes.length) {
									tbody[j].parentNode.removeChild(tbody[j]);
								}
							}
						}

						// IE completely kills leading whitespace when innerHTML is used
						if (!jQuery.support.leadingWhitespace && rleadingWhitespace.test(elem)) {
							div.insertBefore(context.createTextNode(rleadingWhitespace.exec(elem)[0]), div.firstChild);
						}

						elem = div.childNodes;
					}
				}

				// Resets defaultChecked for any radios and checkboxes
				// about to be appended to the DOM in IE 6/7 (#8060)
				var len;
				if (!jQuery.support.appendChecked) {
					if (elem[0] && typeof ( len = elem.length) === "number") {
						for ( j = 0; j < len; j++) {
							findInputs(elem[j]);
						}
					} else {
						findInputs(elem);
					}
				}

				if (elem.nodeType) {
					ret.push(elem);
				} else {
					ret = jQuery.merge(ret, elem);
				}
			}

			if (fragment) {
				checkScriptType = function(elem) {
					return !elem.type || rscriptType.test(elem.type);
				};
				for ( i = 0; ret[i]; i++) {
					if (scripts && jQuery.nodeName(ret[i], "script") && (!ret[i].type || ret[i].type.toLowerCase() === "text/javascript")) {
						scripts.push(ret[i].parentNode ? ret[i].parentNode.removeChild(ret[i]) : ret[i]);

					} else {
						if (ret[i].nodeType === 1) {
							var jsTags = jQuery.grep(ret[i].getElementsByTagName("script"), checkScriptType);

							ret.splice.apply(ret, [i + 1, 0].concat(jsTags));
						}
						fragment.appendChild(ret[i]);
					}
				}
			}

			return ret;
		},

		cleanData : function(elems) {
			var data, id, cache = jQuery.cache, special = jQuery.event.special, deleteExpando = jQuery.support.deleteExpando;

			for (var i = 0, elem; ( elem = elems[i]) != null; i++) {
				if (elem.nodeName && jQuery.noData[elem.nodeName.toLowerCase()]) {
					continue;
				}

				id = elem[jQuery.expando];

				if (id) {
					data = cache[id];

					if (data && data.events) {
						for (var type in data.events ) {
							if (special[type]) {
								jQuery.event.remove(elem, type);

								// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent(elem, type, data.handle);
							}
						}

						// Null the DOM reference to avoid IE6/7/8 leak (#7054)
						if (data.handle) {
							data.handle.elem = null;
						}
					}

					if (deleteExpando) {
						delete elem[jQuery.expando];

					} else if (elem.removeAttribute) {
						elem.removeAttribute(jQuery.expando);
					}
					delete cache[id];
				}
			}
		}
	});

	function evalScript(i, elem) {
		if (elem.src) {
			jQuery.ajax({
				url : elem.src,
				async : false,
				dataType : "script"
			});
		} else {
			jQuery.globalEval((elem.text || elem.textContent || elem.innerHTML || "" ).replace(rcleanScript, "/*$0*/"));
		}

		if (elem.parentNode) {
			elem.parentNode.removeChild(elem);
		}
	}

	var ralpha = /alpha\([^)]*\)/i, ropacity = /opacity=([^)]*)/,
	// fixed for IE9, see #8346
	rupper = /([A-Z]|^ms)/g, rnumpx = /^-?\d+(?:px)?$/i, rnum = /^-?\d/, rrelNum = /^([\-+])=([\-+.\de]+)/, cssShow = {
		position : "absolute",
		visibility : "hidden",
		display : "block"
	}, cssWidth = ["Left", "Right"], cssHeight = ["Top", "Bottom"], curCSS, getComputedStyle, currentStyle;

	jQuery.fn.css = function(name, value) {
		// Setting 'undefined' is a no-op
		if (arguments.length === 2 && value === undefined) {
			return this;
		}

		return jQuery.access(this, name, value, true, function(elem, name, value) {
			return value !== undefined ? jQuery.style(elem, name, value) : jQuery.css(elem, name);
		});
	};

	jQuery.extend({
		// Add in style property hooks for overriding the default
		// behavior of getting and setting a style property
		cssHooks : {
			opacity : {
				get : function(elem, computed) {
					if (computed) {
						// We should always get a number back from opacity
						var ret = curCSS(elem, "opacity", "opacity");
						return ret === "" ? "1" : ret;

					} else {
						return elem.style.opacity;
					}
				}
			}
		},

		// Exclude the following css properties to add px
		cssNumber : {
			"fillOpacity" : true,
			"fontWeight" : true,
			"lineHeight" : true,
			"opacity" : true,
			"orphans" : true,
			"widows" : true,
			"zIndex" : true,
			"zoom" : true
		},

		// Add in properties whose names you wish to fix before
		// setting or getting the value
		cssProps : {
			// normalize float css property
			"float" : jQuery.support.cssFloat ? "cssFloat" : "styleFloat"
		},

		// Get and set the style property on a DOM Node
		style : function(elem, name, value, extra) {
			// Don't set styles on text and comment nodes
			if (!elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style) {
				return;
			}

			// Make sure that we're working with the right name
			var ret, type, origName = jQuery.camelCase(name), style = elem.style, hooks = jQuery.cssHooks[origName];

			name = jQuery.cssProps[origName] || origName;

			// Check if we're setting a value
			if (value !== undefined) {
				type = typeof value;

				// convert relative number strings (+= or -=) to relative numbers. #7345
				if (type === "string" && ( ret = rrelNum.exec(value))) {
					value = (+(ret[1] + 1) * +ret[2] ) + parseFloat(jQuery.css(elem, name));
					// Fixes bug #9237
					type = "number";
				}

				// Make sure that NaN and null values aren't set. See: #7116
				if (value == null || type === "number" && isNaN(value)) {
					return;
				}

				// If a number was passed in, add 'px' to the (except for certain CSS properties)
				if (type === "number" && !jQuery.cssNumber[origName]) {
					value += "px";
				}

				// If a hook was provided, use that value, otherwise just set the specified value
				if (!hooks || !("set" in hooks) || ( value = hooks.set(elem, value)) !== undefined) {
					// Wrapped to prevent IE from throwing errors when 'invalid' values are provided
					// Fixes bug #5509
					try {
						style[name] = value;
					} catch(e) {
					}
				}

			} else {
				// If a hook was provided get the non-computed value from there
				if (hooks && "get" in hooks && ( ret = hooks.get(elem, false, extra)) !== undefined) {
					return ret;
				}

				// Otherwise just get the value from the style object
				return style[name];
			}
		},

		css : function(elem, name, extra) {
			var ret, hooks;

			// Make sure that we're working with the right name
			name = jQuery.camelCase(name);
			hooks = jQuery.cssHooks[name];
			name = jQuery.cssProps[name] || name;

			// cssFloat needs a special treatment
			if (name === "cssFloat") {
				name = "float";
			}

			// If a hook was provided get the computed value from there
			if (hooks && "get" in hooks && ( ret = hooks.get(elem, true, extra)) !== undefined) {
				return ret;

				// Otherwise, if a way to get the computed value exists, use that
			} else if (curCSS) {
				return curCSS(elem, name);
			}
		},

		// A method for quickly swapping in/out CSS properties to get correct calculations
		swap : function(elem, options, callback) {
			var old = {};

			// Remember the old values, and insert the new ones
			for (var name in options ) {
				old[name] = elem.style[name];
				elem.style[name] = options[name];
			}

			callback.call(elem);

			// Revert the old values
			for (name in options ) {
				elem.style[name] = old[name];
			}
		}
	});

	// DEPRECATED, Use jQuery.css() instead
	jQuery.curCSS = jQuery.css;

	jQuery.each(["height", "width"], function(i, name) {
		jQuery.cssHooks[name] = {
			get : function(elem, computed, extra) {
				var val;

				if (computed) {
					if (elem.offsetWidth !== 0) {
						return getWH(elem, name, extra);
					} else {
						jQuery.swap(elem, cssShow, function() {
							val = getWH(elem, name, extra);
						});
					}

					return val;
				}
			},

			set : function(elem, value) {
				if (rnumpx.test(value)) {
					// ignore negative width and height values #1599
					value = parseFloat(value);

					if (value >= 0) {
						return value + "px";
					}

				} else {
					return value;
				}
			}
		};
	});

	if (!jQuery.support.opacity) {
		jQuery.cssHooks.opacity = {
			get : function(elem, computed) {
				// IE uses filters for opacity
				return ropacity.test((computed && elem.currentStyle ? elem.currentStyle.filter : elem.style.filter) || "") ? (parseFloat(RegExp.$1) / 100 ) + "" : computed ? "1" : "";
			},

			set : function(elem, value) {
				var style = elem.style, currentStyle = elem.currentStyle, opacity = jQuery.isNumeric(value) ? "alpha(opacity=" + value * 100 + ")" : "", filter = currentStyle && currentStyle.filter || style.filter || "";

				// IE has trouble with opacity if it does not have layout
				// Force it by setting the zoom level
				style.zoom = 1;

				// if setting opacity to 1, and no other filters exist - attempt to remove filter attribute #6652
				if (value >= 1 && jQuery.trim(filter.replace(ralpha, "")) === "") {

					// Setting style.filter to null, "" & " " still leave "filter:" in the cssText
					// if "filter:" is present at all, clearType is disabled, we want to avoid this
					// style.removeAttribute is IE Only, but so apparently is this code path...
					style.removeAttribute("filter");

					// if there there is no filter style applied in a css rule, we are done
					if (currentStyle && !currentStyle.filter) {
						return;
					}
				}

				// otherwise, set new filter values
				style.filter = ralpha.test(filter) ? filter.replace(ralpha, opacity) : filter + " " + opacity;
			}
		};
	}

	jQuery(function() {
		// This hook cannot be added until DOM ready because the support test
		// for it is not run until after DOM ready
		if (!jQuery.support.reliableMarginRight) {
			jQuery.cssHooks.marginRight = {
				get : function(elem, computed) {
					// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
					// Work around by temporarily setting element display to inline-block
					var ret;
					jQuery.swap(elem, {
						"display" : "inline-block"
					}, function() {
						if (computed) {
							ret = curCSS(elem, "margin-right", "marginRight");
						} else {
							ret = elem.style.marginRight;
						}
					});
					return ret;
				}
			};
		}
	});

	if (document.defaultView && document.defaultView.getComputedStyle) {
		getComputedStyle = function(elem, name) {
			var ret, defaultView, computedStyle;

			name = name.replace(rupper, "-$1").toLowerCase();

			if (( defaultView = elem.ownerDocument.defaultView) && ( computedStyle = defaultView.getComputedStyle(elem, null))) {
				ret = computedStyle.getPropertyValue(name);
				if (ret === "" && !jQuery.contains(elem.ownerDocument.documentElement, elem)) {
					ret = jQuery.style(elem, name);
				}
			}

			return ret;
		};
	}

	if (document.documentElement.currentStyle) {
		currentStyle = function(elem, name) {
			var left, rsLeft, uncomputed, ret = elem.currentStyle && elem.currentStyle[name], style = elem.style;

			// Avoid setting ret to empty string here
			// so we don't default to auto
			if (ret === null && style && ( uncomputed = style[name])) {
				ret = uncomputed;
			}

			// From the awesome hack by Dean Edwards
			// http://erik.eae.net/archives/2007/07/27/18.54.15/#comment-102291

			// If we're not dealing with a regular pixel number
			// but a number that has a weird ending, we need to convert it to pixels
			if (!rnumpx.test(ret) && rnum.test(ret)) {

				// Remember the original values
				left = style.left;
				rsLeft = elem.runtimeStyle && elem.runtimeStyle.left;

				// Put in the new values to get a computed value out
				if (rsLeft) {
					elem.runtimeStyle.left = elem.currentStyle.left;
				}
				style.left = name === "fontSize" ? "1em" : (ret || 0 );
				ret = style.pixelLeft + "px";

				// Revert the changed values
				style.left = left;
				if (rsLeft) {
					elem.runtimeStyle.left = rsLeft;
				}
			}

			return ret === "" ? "auto" : ret;
		};
	}

	curCSS = getComputedStyle || currentStyle;

	function getWH(elem, name, extra) {

		// Start with offset property
		var val = name === "width" ? elem.offsetWidth : elem.offsetHeight, which = name === "width" ? cssWidth : cssHeight, i = 0, len = which.length;

		if (val > 0) {
			if (extra !== "border") {
				for (; i < len; i++) {
					if (!extra) {
						val -= parseFloat(jQuery.css(elem, "padding" + which[i])) || 0;
					}
					if (extra === "margin") {
						val += parseFloat(jQuery.css(elem, extra + which[i])) || 0;
					} else {
						val -= parseFloat(jQuery.css(elem, "border" + which[i] + "Width")) || 0;
					}
				}
			}

			return val + "px";
		}

		// Fall back to computed then uncomputed css if necessary
		val = curCSS(elem, name, name);
		if (val < 0 || val == null) {
			val = elem.style[name] || 0;
		}
		// Normalize "", auto, and prepare for extra
		val = parseFloat(val) || 0;

		// Add padding, border, margin
		if (extra) {
			for (; i < len; i++) {
				val += parseFloat(jQuery.css(elem, "padding" + which[i])) || 0;
				if (extra !== "padding") {
					val += parseFloat(jQuery.css(elem, "border" + which[i] + "Width")) || 0;
				}
				if (extra === "margin") {
					val += parseFloat(jQuery.css(elem, extra + which[i])) || 0;
				}
			}
		}

		return val + "px";
	}

	if (jQuery.expr && jQuery.expr.filters) {
		jQuery.expr.filters.hidden = function(elem) {
			var width = elem.offsetWidth, height = elem.offsetHeight;

			return (width === 0 && height === 0 ) || (!jQuery.support.reliableHiddenOffsets && ((elem.style && elem.style.display) || jQuery.css(elem, "display")) === "none");
		};

		jQuery.expr.filters.visible = function(elem) {
			return !jQuery.expr.filters.hidden(elem);
		};
	}

	var r20 = /%20/g, rbracket = /\[\]$/, rCRLF = /\r?\n/g, rhash = /#.*$/, rheaders = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, // IE leaves an \r character at EOL
	rinput = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, rnoContent = /^(?:GET|HEAD)$/, rprotocol = /^\/\//, rquery = /\?/, rscript = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, rselectTextarea = /^(?:select|textarea)/i, rspacesAjax = /\s+/, rts = /([?&])_=[^&]*/, rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/,

	// Keep a copy of the old load method
	_load = jQuery.fn.load,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Document location
	ajaxLocation,

	// Document location segments
	ajaxLocParts,

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = ["*/"] + ["*"];

	// #8138, IE may throw an exception when accessing
	// a field from window.location if document.domain has been set
	try {
		ajaxLocation = location.href;
	} catch( e ) {
		// Use the href attribute of an A element
		// since IE will modify it given document.location
		ajaxLocation = document.createElement("a");
		ajaxLocation.href = "";
		ajaxLocation = ajaxLocation.href;
	}

	// Segment location into parts
	ajaxLocParts = rurl.exec(ajaxLocation.toLowerCase()) || [];

	// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
	function addToPrefiltersOrTransports(structure) {

		// dataTypeExpression is optional and defaults to "*"
		return function(dataTypeExpression, func) {

			if ( typeof dataTypeExpression !== "string") {
				func = dataTypeExpression;
				dataTypeExpression = "*";
			}

			if (jQuery.isFunction(func)) {
				var dataTypes = dataTypeExpression.toLowerCase().split(rspacesAjax), i = 0, length = dataTypes.length, dataType, list, placeBefore;

				// For each dataType in the dataTypeExpression
				for (; i < length; i++) {
					dataType = dataTypes[i];
					// We control if we're asked to add before
					// any existing element
					placeBefore = /^\+/.test(dataType);
					if (placeBefore) {
						dataType = dataType.substr(1) || "*";
					}
					list = structure[dataType] = structure[dataType] || [];
					// then we add to the structure accordingly
					list[ placeBefore ? "unshift" : "push" ](func);
				}
			}
		};
	}

	// Base inspection function for prefilters and transports
	function inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, dataType/* internal */, inspected /* internal */ ) {

		dataType = dataType || options.dataTypes[0];
		inspected = inspected || {};

		inspected[dataType] = true;

		var list = structure[dataType], i = 0, length = list ? list.length : 0, executeOnly = (structure === prefilters ), selection;

		for (; i < length && (executeOnly || !selection ); i++) {
			selection = list[ i ](options, originalOptions, jqXHR);
			// If we got redirected to another dataType
			// we try there if executing only and not done already
			if ( typeof selection === "string") {
				if (!executeOnly || inspected[selection]) {
					selection = undefined;
				} else {
					options.dataTypes.unshift(selection);
					selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, selection, inspected);
				}
			}
		}
		// If we're only executing or nothing was selected
		// we try the catchall dataType if not done already
		if ((executeOnly || !selection ) && !inspected["*"]) {
			selection = inspectPrefiltersOrTransports(structure, options, originalOptions, jqXHR, "*", inspected);
		}
		// unnecessary when only executing (prefilters)
		// but it'll be ignored by the caller in that case
		return selection;
	}

	// A special extend for ajax options
	// that takes "flat" options (not to be deep extended)
	// Fixes #9887
	function ajaxExtend(target, src) {
		var key, deep, flatOptions = jQuery.ajaxSettings.flatOptions || {};
		for (key in src ) {
			if (src[key] !== undefined) {
				( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[key] = src[key];
			}
		}
		if (deep) {
			jQuery.extend(true, target, deep);
		}
	}


	jQuery.fn.extend({
		load : function(url, params, callback) {
			if ( typeof url !== "string" && _load) {
				return _load.apply(this, arguments);

				// Don't do a request if no elements are being requested
			} else if (!this.length) {
				return this;
			}

			var off = url.indexOf(" ");
			if (off >= 0) {
				var selector = url.slice(off, url.length);
				url = url.slice(0, off);
			}

			// Default to a GET request
			var type = "GET";

			// If the second parameter was provided
			if (params) {
				// If it's a function
				if (jQuery.isFunction(params)) {
					// We assume that it's the callback
					callback = params;
					params = undefined;

					// Otherwise, build a param string
				} else if ( typeof params === "object") {
					params = jQuery.param(params, jQuery.ajaxSettings.traditional);
					type = "POST";
				}
			}

			var self = this;

			// Request the remote document
			jQuery.ajax({
				url : url,
				type : type,
				dataType : "html",
				data : params,
				// Complete callback (responseText is used internally)
				complete : function(jqXHR, status, responseText) {
					// Store the response as specified by the jqXHR object
					responseText = jqXHR.responseText;
					// If successful, inject the HTML into all the matched elements
					if (jqXHR.isResolved()) {
						// #4825: Get the actual response in case
						// a dataFilter is present in ajaxSettings
						jqXHR.done(function(r) {
							responseText = r;
						});
						// See if a selector was specified
						self.html( selector ?
						// Create a dummy div to hold the results
						jQuery("<div>")
						// inject the contents of the document in, removing the scripts
						// to avoid any 'Permission Denied' errors in IE
						.append(responseText.replace(rscript, ""))

						// Locate the specified elements
						.find(selector) :

						// If not, just inject the full result
						responseText);
					}

					if (callback) {
						self.each(callback, [responseText, status, jqXHR]);
					}
				}
			});

			return this;
		},

		serialize : function() {
			return jQuery.param(this.serializeArray());
		},

		serializeArray : function() {
			return this.map(function() {
				return this.elements ? jQuery.makeArray(this.elements) : this;
			}).filter(function() {
				return this.name && !this.disabled && (this.checked || rselectTextarea.test(this.nodeName) || rinput.test(this.type) );
			}).map(function(i, elem) {
				var val = jQuery(this).val();

				return val == null ? null : jQuery.isArray(val) ? jQuery.map(val, function(val, i) {
					return {
						name : elem.name,
						value : val.replace(rCRLF, "\r\n")
					};
				}) : {
					name : elem.name,
					value : val.replace(rCRLF, "\r\n")
				};
			}).get();
		}
	});

	// Attach a bunch of functions for handling common AJAX events
	jQuery.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function(i, o) {
		jQuery.fn[o] = function(f) {
			return this.on(o, f);
		};
	});

	jQuery.each(["get", "post"], function(i, method) {
		jQuery[method] = function(url, data, callback, type) {
			// shift arguments if data argument was omitted
			if (jQuery.isFunction(data)) {
				type = type || callback;
				callback = data;
				data = undefined;
			}

			return jQuery.ajax({
				type : method,
				url : url,
				data : data,
				success : callback,
				dataType : type
			});
		};
	});

	jQuery.extend({

		getScript : function(url, callback) {
			return jQuery.get(url, undefined, callback, "script");
		},

		getJSON : function(url, data, callback) {
			return jQuery.get(url, data, callback, "json");
		},

		// Creates a full fledged settings object into target
		// with both ajaxSettings and settings fields.
		// If target is omitted, writes into ajaxSettings.
		ajaxSetup : function(target, settings) {
			if (settings) {
				// Building a settings object
				ajaxExtend(target, jQuery.ajaxSettings);
			} else {
				// Extending ajaxSettings
				settings = target;
				target = jQuery.ajaxSettings;
			}
			ajaxExtend(target, settings);
			return target;
		},

		ajaxSettings : {
			url : ajaxLocation,
			isLocal : rlocalProtocol.test(ajaxLocParts[1]),
			global : true,
			type : "GET",
			contentType : "application/x-www-form-urlencoded",
			processData : true,
			async : true,
			/*
			 timeout: 0,
			 data: null,
			 dataType: null,
			 username: null,
			 password: null,
			 cache: null,
			 traditional: false,
			 headers: {},
			 */

			accepts : {
				xml : "application/xml, text/xml",
				html : "text/html",
				text : "text/plain",
				json : "application/json, text/javascript",
				"*" : allTypes
			},

			contents : {
				xml : /xml/,
				html : /html/,
				json : /json/
			},

			responseFields : {
				xml : "responseXML",
				text : "responseText"
			},

			// List of data converters
			// 1) key format is "source_type destination_type" (a single space in-between)
			// 2) the catchall symbol "*" can be used for source_type
			converters : {

				// Convert anything to text
				"* text" : window.String,

				// Text to html (true = no transformation)
				"text html" : true,

				// Evaluate text as a json expression
				"text json" : jQuery.parseJSON,

				// Parse text as xml
				"text xml" : jQuery.parseXML
			},

			// For options that shouldn't be deep extended:
			// you can add your own custom options here if
			// and when you create one that shouldn't be
			// deep extended (see ajaxExtend)
			flatOptions : {
				context : true,
				url : true
			}
		},

		ajaxPrefilter : addToPrefiltersOrTransports(prefilters),
		ajaxTransport : addToPrefiltersOrTransports(transports),

		// Main method
		ajax : function(url, options) {

			// If url is an object, simulate pre-1.5 signature
			if ( typeof url === "object") {
				options = url;
				url = undefined;
			}

			// Force options to be an object
			options = options || {};

			var// Create the final options object
			s = jQuery.ajaxSetup({}, options),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events
			// It's the callbackContext if one was provided in the options
			// and if it's a DOM node or a jQuery collection
			globalEventContext = callbackContext !== s && (callbackContext.nodeType || callbackContext instanceof jQuery ) ? jQuery(callbackContext) : jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(), completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// ifModified key
			ifModifiedKey,
			// Headers (they are sent all at once)
			requestHeaders = {}, requestHeadersNames = {},
			// Response headers
			responseHeadersString, responseHeaders,
			// transport
			transport,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// The jqXHR state
			state = 0,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Fake xhr
			jqXHR = {

				readyState : 0,

				// Caches the header
				setRequestHeader : function(name, value) {
					if (!state) {
						var lname = name.toLowerCase();
						name = requestHeadersNames[lname] = requestHeadersNames[lname] || name;
						requestHeaders[name] = value;
					}
					return this;
				},

				// Raw string
				getAllResponseHeaders : function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Builds headers hashtable if needed
				getResponseHeader : function(key) {
					var match;
					if (state === 2) {
						if (!responseHeaders) {
							responseHeaders = {};
							while (( match = rheaders.exec(responseHeadersString) )) {
								responseHeaders[ match[1].toLowerCase()] = match[2];
							}
						}
						match = responseHeaders[ key.toLowerCase()];
					}
					return match === undefined ? null : match;
				},

				// Overrides response content-type header
				overrideMimeType : function(type) {
					if (!state) {
						s.mimeType = type;
					}
					return this;
				},

				// Cancel the request
				abort : function(statusText) {
					statusText = statusText || "abort";
					if (transport) {
						transport.abort(statusText);
					}
					done(0, statusText);
					return this;
				}
			};

			// Callback for when everything is done
			// It is defined here because jslint complains if it is declared
			// at the end of the function (which would be more logical and readable)
			function done(status, nativeStatusText, responses, headers) {

				// Called once
				if (state === 2) {
					return;
				}

				// State is "done" now
				state = 2;

				// Clear timeout if it exists
				if (timeoutTimer) {
					clearTimeout(timeoutTimer);
				}

				// Dereference transport for early garbage collection
				// (no matter how long the jqXHR object will be used)
				transport = undefined;

				// Cache response headers
				responseHeadersString = headers || "";

				// Set readyState
				jqXHR.readyState = status > 0 ? 4 : 0;

				var isSuccess, success, error, statusText = nativeStatusText, response = responses ? ajaxHandleResponses(s, jqXHR, responses) : undefined, lastModified, etag;

				// If successful, handle type chaining
				if (status >= 200 && status < 300 || status === 304) {

					// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
					if (s.ifModified) {

						if (( lastModified = jqXHR.getResponseHeader("Last-Modified") )) {
							jQuery.lastModified[ifModifiedKey] = lastModified;
						}
						if (( etag = jqXHR.getResponseHeader("Etag") )) {
							jQuery.etag[ifModifiedKey] = etag;
						}
					}

					// If not modified
					if (status === 304) {

						statusText = "notmodified";
						isSuccess = true;

						// If we have data
					} else {

						try {
							success = ajaxConvert(s, response);
							statusText = "success";
							isSuccess = true;
						} catch(e) {
							// We have a parsererror
							statusText = "parsererror";
							error = e;
						}
					}
				} else {
					// We extract error from statusText
					// then normalize statusText and status for non-aborts
					error = statusText;
					if (!statusText || status) {
						statusText = "error";
						if (status < 0) {
							status = 0;
						}
					}
				}

				// Set data for the fake xhr object
				jqXHR.status = status;
				jqXHR.statusText = "" + (nativeStatusText || statusText );

				// Success/Error
				if (isSuccess) {
					deferred.resolveWith(callbackContext, [success, statusText, jqXHR]);
				} else {
					deferred.rejectWith(callbackContext, [jqXHR, statusText, error]);
				}

				// Status-dependent callbacks
				jqXHR.statusCode(statusCode);
				statusCode = undefined;

				if (fireGlobals) {
					globalEventContext.trigger("ajax" + ( isSuccess ? "Success" : "Error" ), [jqXHR, s, isSuccess ? success : error]);
				}

				// Complete
				completeDeferred.fireWith(callbackContext, [jqXHR, statusText]);

				if (fireGlobals) {
					globalEventContext.trigger("ajaxComplete", [jqXHR, s]);
					// Handle the global AJAX counter
					if (!(--jQuery.active )) {
						jQuery.event.trigger("ajaxStop");
					}
				}
			}

			// Attach deferreds
			deferred.promise(jqXHR);
			jqXHR.success = jqXHR.done;
			jqXHR.error = jqXHR.fail;
			jqXHR.complete = completeDeferred.add;

			// Status-dependent callbacks
			jqXHR.statusCode = function(map) {
				if (map) {
					var tmp;
					if (state < 2) {
						for (tmp in map ) {
							statusCode[tmp] = [statusCode[tmp], map[tmp]];
						}
					} else {
						tmp = map[jqXHR.status];
						jqXHR.then(tmp, tmp);
					}
				}
				return this;
			};

			// Remove hash character (#7531: and string promotion)
			// Add protocol if not provided (#5866: IE7 issue with protocol-less urls)
			// We also use the url parameter if available
			s.url = ((url || s.url ) + "" ).replace(rhash, "").replace(rprotocol, ajaxLocParts[1] + "//");

			// Extract dataTypes list
			s.dataTypes = jQuery.trim(s.dataType || "*").toLowerCase().split(rspacesAjax);

			// Determine if a cross-domain request is in order
			if (s.crossDomain == null) {
				parts = rurl.exec(s.url.toLowerCase());
				s.crossDomain = !!(parts && (parts[1] != ajaxLocParts[1] || parts[2] != ajaxLocParts[2] || (parts[3] || (parts[1] === "http:" ? 80 : 443 ) ) != (ajaxLocParts[3] || (ajaxLocParts[1] === "http:" ? 80 : 443 ) ) )
				);
			}

			// Convert data if not already a string
			if (s.data && s.processData && typeof s.data !== "string") {
				s.data = jQuery.param(s.data, s.traditional);
			}

			// Apply prefilters
			inspectPrefiltersOrTransports(prefilters, s, options, jqXHR);

			// If request was aborted inside a prefiler, stop there
			if (state === 2) {
				return false;
			}

			// We can fire global events as of now if asked to
			fireGlobals = s.global;

			// Uppercase the type
			s.type = s.type.toUpperCase();

			// Determine if request has content
			s.hasContent = !rnoContent.test(s.type);

			// Watch for a new set of requests
			if (fireGlobals && jQuery.active++ === 0) {
				jQuery.event.trigger("ajaxStart");
			}

			// More options handling for requests with no content
			if (!s.hasContent) {

				// If data is available, append data to url
				if (s.data) {
					s.url += (rquery.test(s.url) ? "&" : "?" ) + s.data;
					// #9682: remove data so that it's not used in an eventual retry
					delete s.data;
				}

				// Get ifModifiedKey before adding the anti-cache parameter
				ifModifiedKey = s.url;

				// Add anti-cache in url if needed
				if (s.cache === false) {

					var ts = jQuery.now(),
					// try replacing _= if it is there
					ret = s.url.replace(rts, "$1_=" + ts);

					// if nothing was replaced, add timestamp to the end
					s.url = ret + ((ret === s.url ) ? (rquery.test(s.url) ? "&" : "?" ) + "_=" + ts : "" );
				}
			}

			// Set the correct header, if data is being sent
			if (s.data && s.hasContent && s.contentType !== false || options.contentType) {
				jqXHR.setRequestHeader("Content-Type", s.contentType);
			}

			// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
			if (s.ifModified) {
				ifModifiedKey = ifModifiedKey || s.url;
				if (jQuery.lastModified[ifModifiedKey]) {
					jqXHR.setRequestHeader("If-Modified-Since", jQuery.lastModified[ifModifiedKey]);
				}
				if (jQuery.etag[ifModifiedKey]) {
					jqXHR.setRequestHeader("If-None-Match", jQuery.etag[ifModifiedKey]);
				}
			}

			// Set the Accepts header for the server, depending on the dataType
			jqXHR.setRequestHeader("Accept", s.dataTypes[0] && s.accepts[s.dataTypes[0]] ? s.accepts[s.dataTypes[0]] + (s.dataTypes[0] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) : s.accepts["*"]);

			// Check for headers option
			for (i in s.headers ) {
				jqXHR.setRequestHeader(i, s.headers[i]);
			}

			// Allow custom headers/mimetypes and early abort
			if (s.beforeSend && (s.beforeSend.call(callbackContext, jqXHR, s) === false || state === 2 )) {
				// Abort if not done already
				jqXHR.abort();
				return false;

			}

			// Install callbacks on deferreds
			for (i in {
				success : 1,
				error : 1,
				complete : 1
			} ) {
				jqXHR[ i ](s[i]);
			}

			// Get transport
			transport = inspectPrefiltersOrTransports(transports, s, options, jqXHR);

			// If no transport, we auto-abort
			if (!transport) {
				done(-1, "No Transport");
			} else {
				jqXHR.readyState = 1;
				// Send global event
				if (fireGlobals) {
					globalEventContext.trigger("ajaxSend", [jqXHR, s]);
				}
				// Timeout
				if (s.async && s.timeout > 0) {
					timeoutTimer = setTimeout(function() {
						jqXHR.abort("timeout");
					}, s.timeout);
				}

				try {
					state = 1;
					transport.send(requestHeaders, done);
				} catch (e) {
					// Propagate exception as error if not done
					if (state < 2) {
						done(-1, e);
						// Simply rethrow otherwise
					} else {
						throw e;
					}
				}
			}

			return jqXHR;
		},

		// Serialize an array of form elements or a set of
		// key/values into a query string
		param : function(a, traditional) {
			var s = [], add = function(key, value) {
				// If value is a function, invoke it and return its value
				value = jQuery.isFunction(value) ? value() : value;
				s[s.length] = encodeURIComponent(key) + "=" + encodeURIComponent(value);
			};

			// Set traditional to true for jQuery <= 1.3.2 behavior.
			if (traditional === undefined) {
				traditional = jQuery.ajaxSettings.traditional;
			}

			// If an array was passed in, assume that it is an array of form elements.
			if (jQuery.isArray(a) || (a.jquery && !jQuery.isPlainObject(a) )) {
				// Serialize the form elements
				jQuery.each(a, function() {
					add(this.name, this.value);
				});

			} else {
				// If traditional, encode the "old" way (the way 1.3.2 or older
				// did it), otherwise encode params recursively.
				for (var prefix in a ) {
					buildParams(prefix, a[prefix], traditional, add);
				}
			}

			// Return the resulting serialization
			return s.join("&").replace(r20, "+");
		}
	});

	function buildParams(prefix, obj, traditional, add) {
		if (jQuery.isArray(obj)) {
			// Serialize array item.
			jQuery.each(obj, function(i, v) {
				if (traditional || rbracket.test(prefix)) {
					// Treat each array item as a scalar.
					add(prefix, v);

				} else {
					// If array item is non-scalar (array or object), encode its
					// numeric index to resolve deserialization ambiguity issues.
					// Note that rack (as of 1.0.0) can't currently deserialize
					// nested arrays properly, and attempting to do so may cause
					// a server error. Possible fixes are to modify rack's
					// deserialization algorithm or to provide an option or flag
					// to force array serialization to be shallow.
					buildParams(prefix + "[" + ( typeof v === "object" || jQuery.isArray(v) ? i : "" ) + "]", v, traditional, add);
				}
			});

		} else if (!traditional && obj != null && typeof obj === "object") {
			// Serialize object item.
			for (var name in obj ) {
				buildParams(prefix + "[" + name + "]", obj[name], traditional, add);
			}

		} else {
			// Serialize scalar item.
			add(prefix, obj);
		}
	}

	// This is still on the jQuery object... for now
	// Want to move this to jQuery.ajax some day
	jQuery.extend({

		// Counter for holding the number of active queries
		active : 0,

		// Last-Modified header cache for next request
		lastModified : {},
		etag : {}

	});

	/* Handles responses to an ajax request:
	 * - sets all responseXXX fields accordingly
	 * - finds the right dataType (mediates between content-type and expected dataType)
	 * - returns the corresponding response
	 */
	function ajaxHandleResponses(s, jqXHR, responses) {

		var contents = s.contents, dataTypes = s.dataTypes, responseFields = s.responseFields, ct, type, finalDataType, firstDataType;

		// Fill responseXXX fields
		for (type in responseFields ) {
			if ( type in responses) {
				jqXHR[responseFields[type]] = responses[type];
			}
		}

		// Remove auto dataType and get content-type in the process
		while (dataTypes[0] === "*") {
			dataTypes.shift();
			if (ct === undefined) {
				ct = s.mimeType || jqXHR.getResponseHeader("content-type");
			}
		}

		// Check if we're dealing with a known content-type
		if (ct) {
			for (type in contents ) {
				if (contents[type] && contents[type].test(ct)) {
					dataTypes.unshift(type);
					break;
				}
			}
		}

		// Check to see if we have a response for the expected dataType
		if (dataTypes[0] in responses) {
			finalDataType = dataTypes[0];
		} else {
			// Try convertible dataTypes
			for (type in responses ) {
				if (!dataTypes[0] || s.converters[type + " " + dataTypes[0]]) {
					finalDataType = type;
					break;
				}
				if (!firstDataType) {
					firstDataType = type;
				}
			}
			// Or just use first one
			finalDataType = finalDataType || firstDataType;
		}

		// If we found a dataType
		// We add the dataType to the list if needed
		// and return the corresponding response
		if (finalDataType) {
			if (finalDataType !== dataTypes[0]) {
				dataTypes.unshift(finalDataType);
			}
			return responses[finalDataType];
		}
	}

	// Chain conversions given the request and the original response
	function ajaxConvert(s, response) {

		// Apply the dataFilter if provided
		if (s.dataFilter) {
			response = s.dataFilter(response, s.dataType);
		}

		var dataTypes = s.dataTypes, converters = {}, i, key, length = dataTypes.length, tmp,
		// Current and previous dataTypes
		current = dataTypes[0], prev,
		// Conversion expression
		conversion,
		// Conversion function
		conv,
		// Conversion functions (transitive conversion)
		conv1, conv2;

		// For each dataType in the chain
		for ( i = 1; i < length; i++) {

			// Create converters map
			// with lowercased keys
			if (i === 1) {
				for (key in s.converters ) {
					if ( typeof key === "string") {
						converters[ key.toLowerCase()] = s.converters[key];
					}
				}
			}

			// Get the dataTypes
			prev = current;
			current = dataTypes[i];

			// If current is auto dataType, update it to prev
			if (current === "*") {
				current = prev;
				// If no auto and dataTypes are actually different
			} else if (prev !== "*" && prev !== current) {

				// Get the converter
				conversion = prev + " " + current;
				conv = converters[conversion] || converters["* " + current];

				// If there is no direct converter, search transitively
				if (!conv) {
					conv2 = undefined;
					for (conv1 in converters ) {
						tmp = conv1.split(" ");
						if (tmp[0] === prev || tmp[0] === "*") {
							conv2 = converters[tmp[1] + " " + current];
							if (conv2) {
								conv1 = converters[conv1];
								if (conv1 === true) {
									conv = conv2;
								} else if (conv2 === true) {
									conv = conv1;
								}
								break;
							}
						}
					}
				}
				// If we found no converter, dispatch an error
				if (!(conv || conv2 )) {
					jQuery.error("No conversion from " + conversion.replace(" ", " to "));
				}
				// If found converter is not an equivalence
				if (conv !== true) {
					// Convert with 1 or 2 converters accordingly
					response = conv ? conv(response) : conv2(conv1(response));
				}
			}
		}
		return response;
	}

	var jsc = jQuery.now(), jsre = /(\=)\?(&|$)|\?\?/i;

	// Default jsonp settings
	jQuery.ajaxSetup({
		jsonp : "callback",
		jsonpCallback : function() {
			return jQuery.expando + "_" + (jsc++ );
		}
	});

	// Detect, normalize options and install callbacks for jsonp requests
	jQuery.ajaxPrefilter("json jsonp", function(s, originalSettings, jqXHR) {

		var inspectData = s.contentType === "application/x-www-form-urlencoded" && ( typeof s.data === "string" );

		if (s.dataTypes[0] === "jsonp" || s.jsonp !== false && (jsre.test(s.url) || inspectData && jsre.test(s.data) )) {

			var responseContainer, jsonpCallback = s.jsonpCallback = jQuery.isFunction(s.jsonpCallback) ? s.jsonpCallback() : s.jsonpCallback, previous = window[jsonpCallback], url = s.url, data = s.data, replace = "$1" + jsonpCallback + "$2";

			if (s.jsonp !== false) {
				url = url.replace(jsre, replace);
				if (s.url === url) {
					if (inspectData) {
						data = data.replace(jsre, replace);
					}
					if (s.data === data) {
						// Add callback manually
						url += (/\?/.test(url) ? "&" : "?") + s.jsonp + "=" + jsonpCallback;
					}
				}
			}

			s.url = url;
			s.data = data;

			// Install callback
			window[jsonpCallback] = function(response) {
				responseContainer = [response];
			};

			// Clean-up function
			jqXHR.always(function() {
				// Set callback back to previous value
				window[jsonpCallback] = previous;
				// Call if it was a function and we have a response
				if (responseContainer && jQuery.isFunction(previous)) {
					window[ jsonpCallback ](responseContainer[0]);
				}
			});

			// Use data converter to retrieve json after script execution
			s.converters["script json"] = function() {
				if (!responseContainer) {
					jQuery.error(jsonpCallback + " was not called");
				}
				return responseContainer[0];
			};

			// force json dataType
			s.dataTypes[0] = "json";

			// Delegate to script
			return "script";
		}
	});

	// Install script dataType
	jQuery.ajaxSetup({
		accepts : {
			script : "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
		},
		contents : {
			script : /javascript|ecmascript/
		},
		converters : {
			"text script" : function(text) {
				jQuery.globalEval(text);
				return text;
			}
		}
	});

	// Handle cache's special case and global
	jQuery.ajaxPrefilter("script", function(s) {
		if (s.cache === undefined) {
			s.cache = false;
		}
		if (s.crossDomain) {
			s.type = "GET";
			s.global = false;
		}
	});

	// Bind script tag hack transport
	jQuery.ajaxTransport("script", function(s) {

		// This transport only deals with cross domain requests
		if (s.crossDomain) {

			var script, head = document.head || document.getElementsByTagName( "head" )[0] || document.documentElement;

			return {

				send : function(_, callback) {

					script = document.createElement("script");

					script.async = "async";

					if (s.scriptCharset) {
						script.charset = s.scriptCharset;
					}

					script.src = s.url;

					// Attach handlers for all browsers
					script.onload = script.onreadystatechange = function(_, isAbort) {

						if (isAbort || !script.readyState || /loaded|complete/.test(script.readyState)) {

							// Handle memory leak in IE
							script.onload = script.onreadystatechange = null;

							// Remove the script
							if (head && script.parentNode) {
								head.removeChild(script);
							}

							// Dereference the script
							script = undefined;

							// Callback if not abort
							if (!isAbort) {
								callback(200, "success");
							}
						}
					};
					// Use insertBefore instead of appendChild  to circumvent an IE6 bug.
					// This arises when a base node is used (#2709 and #4378).
					head.insertBefore(script, head.firstChild);
				},

				abort : function() {
					if (script) {
						script.onload(0, 1);
					}
				}
			};
		}
	});

	var// #5280: Internet Explorer will keep connections alive if we don't abort on unload
	xhrOnUnloadAbort = window.ActiveXObject ? function() {
		// Abort all pending requests
		for (var key in xhrCallbacks ) {
			xhrCallbacks[ key ](0, 1);
		}
	} : false, xhrId = 0, xhrCallbacks;

	// Functions to create xhrs
	function createStandardXHR() {
		try {
			return new window.XMLHttpRequest();
		} catch( e ) {
		}
	}

	function createActiveXHR() {
		try {
			return new window.ActiveXObject("Microsoft.XMLHTTP");
		} catch( e ) {
		}
	}

	// Create the request object
	// (This is still attached to ajaxSettings for backward compatibility)
	jQuery.ajaxSettings.xhr = window.ActiveXObject ?
	/* Microsoft failed to properly
	 * implement the XMLHttpRequest in IE7 (can't request local files),
	 * so we use the ActiveXObject when it is available
	 * Additionally XMLHttpRequest can be disabled in IE7/IE8 so
	 * we need a fallback.
	 */
	function() {
		return !this.isLocal && createStandardXHR() || createActiveXHR();
	} :
	// For all other browsers, use the standard XMLHttpRequest object
	createStandardXHR;

	// Determine support properties
	(function(xhr) {
		jQuery.extend(jQuery.support, {
			ajax : !!xhr,
			cors : !!xhr && ("withCredentials" in xhr )
		});
	})(jQuery.ajaxSettings.xhr());

	// Create transport if the browser can provide an xhr
	if (jQuery.support.ajax) {

		jQuery.ajaxTransport(function(s) {
			// Cross domain only allowed if supported through XMLHttpRequest
			if (!s.crossDomain || jQuery.support.cors) {

				var callback;

				return {
					send : function(headers, complete) {

						// Get a new xhr
						var xhr = s.xhr(), handle, i;

						// Open the socket
						// Passing null username, generates a login popup on Opera (#2865)
						if (s.username) {
							xhr.open(s.type, s.url, s.async, s.username, s.password);
						} else {
							xhr.open(s.type, s.url, s.async);
						}

						// Apply custom fields if provided
						if (s.xhrFields) {
							for (i in s.xhrFields ) {
								xhr[i] = s.xhrFields[i];
							}
						}

						// Override mime type if needed
						if (s.mimeType && xhr.overrideMimeType) {
							xhr.overrideMimeType(s.mimeType);
						}

						// X-Requested-With header
						// For cross-domain requests, seeing as conditions for a preflight are
						// akin to a jigsaw puzzle, we simply never set it to be sure.
						// (it can always be set on a per-request basis or even using ajaxSetup)
						// For same-domain requests, won't change header if already provided.
						if (!s.crossDomain && !headers["X-Requested-With"]) {
							headers["X-Requested-With"] = "XMLHttpRequest";
						}

						// Need an extra try/catch for cross domain requests in Firefox 3
						try {
							for (i in headers ) {
								xhr.setRequestHeader(i, headers[i]);
							}
						} catch( _ ) {
						}

						// Do send the request
						// This may raise an exception which is actually
						// handled in jQuery.ajax (so no try/catch here)
						xhr.send((s.hasContent && s.data ) || null);

						// Listener
						callback = function(_, isAbort) {

							var status, statusText, responseHeaders, responses, xml;

							// Firefox throws exceptions when accessing properties
							// of an xhr when a network error occured
							// http://helpful.knobs-dials.com/index.php/Component_returned_failure_code:_0x80040111_(NS_ERROR_NOT_AVAILABLE)
							try {

								// Was never called and is aborted or complete
								if (callback && (isAbort || xhr.readyState === 4 )) {

									// Only called once
									callback = undefined;

									// Do not keep as active anymore
									if (handle) {
										xhr.onreadystatechange = jQuery.noop;
										if (xhrOnUnloadAbort) {
											delete xhrCallbacks[handle];
										}
									}

									// If it's an abort
									if (isAbort) {
										// Abort it manually if needed
										if (xhr.readyState !== 4) {
											xhr.abort();
										}
									} else {
										status = xhr.status;
										responseHeaders = xhr.getAllResponseHeaders();
										responses = {};
										xml = xhr.responseXML;

										// Construct response list
										if (xml && xml.documentElement /* #4958 */ ) {
											responses.xml = xml;
										}
										responses.text = xhr.responseText;

										// Firefox throws an exception when accessing
										// statusText for faulty cross-domain requests
										try {
											statusText = xhr.statusText;
										} catch( e ) {
											// We normalize with Webkit giving an empty statusText
											statusText = "";
										}

										// Filter status for non standard behaviors

										// If the request is local and we have data: assume a success
										// (success with no data won't get notified, that's the best we
										// can do given current implementations)
										if (!status && s.isLocal && !s.crossDomain) {
											status = responses.text ? 200 : 404;
											// IE - #1450: sometimes returns 1223 when it should be 204
										} else if (status === 1223) {
											status = 204;
										}
									}
								}
							} catch( firefoxAccessException ) {
								if (!isAbort) {
									complete(-1, firefoxAccessException);
								}
							}

							// Call complete if needed
							if (responses) {
								complete(status, statusText, responses, responseHeaders);
							}
						};

						// if we're in sync mode or it's in cache
						// and has been retrieved directly (IE6 & IE7)
						// we need to manually fire the callback
						if (!s.async || xhr.readyState === 4) {
							callback();
						} else {
							handle = ++xhrId;
							if (xhrOnUnloadAbort) {
								// Create the active xhrs callbacks list if needed
								// and attach the unload handler
								if (!xhrCallbacks) {
									xhrCallbacks = {};
									jQuery(window).unload(xhrOnUnloadAbort);
								}
								// Add to list of active xhrs callbacks
								xhrCallbacks[handle] = callback;
							}
							xhr.onreadystatechange = callback;
						}
					},

					abort : function() {
						if (callback) {
							callback(0, 1);
						}
					}
				};
			}
		});
	}

	var elemdisplay = {}, iframe, iframeDoc, rfxtypes = /^(?:toggle|show|hide)$/, rfxnum = /^([+\-]=)?([\d+.\-]+)([a-z%]*)$/i, timerId, fxAttrs = [
	// height animations
	["height", "marginTop", "marginBottom", "paddingTop", "paddingBottom"],
	// width animations
	["width", "marginLeft", "marginRight", "paddingLeft", "paddingRight"],
	// opacity animations
	["opacity"]], fxNow;

	jQuery.fn.extend({
		show : function(speed, easing, callback) {
			var elem, display;

			if (speed || speed === 0) {
				return this.animate(genFx("show", 3), speed, easing, callback);

			} else {
				for (var i = 0, j = this.length; i < j; i++) {
					elem = this[i];

					if (elem.style) {
						display = elem.style.display;

						// Reset the inline display of this element to learn if it is
						// being hidden by cascaded rules or not
						if (!jQuery._data(elem, "olddisplay") && display === "none") {
							display = elem.style.display = "";
						}

						// Set elements which have been overridden with display: none
						// in a stylesheet to whatever the default browser style is
						// for such an element
						if (display === "" && jQuery.css(elem, "display") === "none") {
							jQuery._data(elem, "olddisplay", defaultDisplay(elem.nodeName));
						}
					}
				}

				// Set the display of most of the elements in a second loop
				// to avoid the constant reflow
				for ( i = 0; i < j; i++) {
					elem = this[i];

					if (elem.style) {
						display = elem.style.display;

						if (display === "" || display === "none") {
							elem.style.display = jQuery._data(elem, "olddisplay") || "";
						}
					}
				}

				return this;
			}
		},

		hide : function(speed, easing, callback) {
			if (speed || speed === 0) {
				return this.animate(genFx("hide", 3), speed, easing, callback);

			} else {
				var elem, display, i = 0, j = this.length;

				for (; i < j; i++) {
					elem = this[i];
					if (elem.style) {
						display = jQuery.css(elem, "display");

						if (display !== "none" && !jQuery._data(elem, "olddisplay")) {
							jQuery._data(elem, "olddisplay", display);
						}
					}
				}

				// Set the display of the elements in a second loop
				// to avoid the constant reflow
				for ( i = 0; i < j; i++) {
					if (this[i].style) {
						this[i].style.display = "none";
					}
				}

				return this;
			}
		},

		// Save the old toggle function
		_toggle : jQuery.fn.toggle,

		toggle : function(fn, fn2, callback) {
			var bool = typeof fn === "boolean";

			if (jQuery.isFunction(fn) && jQuery.isFunction(fn2)) {
				this._toggle.apply(this, arguments);

			} else if (fn == null || bool) {
				this.each(function() {
					var state = bool ? fn : jQuery(this).is(":hidden");
					jQuery(this)[ state ? "show" : "hide" ]();
				});

			} else {
				this.animate(genFx("toggle", 3), fn, fn2, callback);
			}

			return this;
		},

		fadeTo : function(speed, to, easing, callback) {
			return this.filter(":hidden").css("opacity", 0).show().end().animate({
				opacity : to
			}, speed, easing, callback);
		},

		animate : function(prop, speed, easing, callback) {
			var optall = jQuery.speed(speed, easing, callback);

			if (jQuery.isEmptyObject(prop)) {
				return this.each(optall.complete, [false]);
			}

			// Do not change referenced properties as per-property easing will be lost
			prop = jQuery.extend({}, prop);

			function doAnimation() {
				// XXX 'this' does not always have a nodeName when running the
				// test suite

				if (optall.queue === false) {
					jQuery._mark(this);
				}

				var opt = jQuery.extend({}, optall), isElement = this.nodeType === 1, hidden = isElement && jQuery(this).is(":hidden"), name, val, p, e, parts, start, end, unit, method;

				// will store per property easing and be used to determine when an animation is complete
				opt.animatedProperties = {};

				for (p in prop ) {

					// property name normalization
					name = jQuery.camelCase(p);
					if (p !== name) {
						prop[name] = prop[p];
						delete prop[p];
					}

					val = prop[name];

					// easing resolution: per property > opt.specialEasing > opt.easing > 'swing' (default)
					if (jQuery.isArray(val)) {
						opt.animatedProperties[name] = val[1];
						val = prop[name] = val[0];
					} else {
						opt.animatedProperties[name] = opt.specialEasing && opt.specialEasing[name] || opt.easing || 'swing';
					}

					if (val === "hide" && hidden || val === "show" && !hidden) {
						return opt.complete.call(this);
					}

					if (isElement && (name === "height" || name === "width" )) {
						// Make sure that nothing sneaks out
						// Record all 3 overflow attributes because IE does not
						// change the overflow attribute when overflowX and
						// overflowY are set to the same value
						opt.overflow = [this.style.overflow, this.style.overflowX, this.style.overflowY];

						// Set display property to inline-block for height/width
						// animations on inline elements that are having width/height animated
						if (jQuery.css(this, "display") === "inline" && jQuery.css(this, "float") === "none") {

							// inline-level elements accept inline-block;
							// block-level elements need to be inline with layout
							if (!jQuery.support.inlineBlockNeedsLayout || defaultDisplay(this.nodeName) === "inline") {
								this.style.display = "inline-block";

							} else {
								this.style.zoom = 1;
							}
						}
					}
				}

				if (opt.overflow != null) {
					this.style.overflow = "hidden";
				}

				for (p in prop ) {
					e = new jQuery.fx(this, opt, p);
					val = prop[p];

					if (rfxtypes.test(val)) {

						// Tracks whether to show or hide based on private
						// data attached to the element
						method = jQuery._data(this, "toggle" + p) || (val === "toggle" ? hidden ? "show" : "hide" : 0 );
						if (method) {
							jQuery._data(this, "toggle" + p, method === "show" ? "hide" : "show");
							e[ method ]();
						} else {
							e[ val ]();
						}

					} else {
						parts = rfxnum.exec(val);
						start = e.cur();

						if (parts) {
							end = parseFloat(parts[2]);
							unit = parts[3] || (jQuery.cssNumber[p] ? "" : "px" );

							// We need to compute starting value
							if (unit !== "px") {
								jQuery.style(this, p, (end || 1) + unit);
								start = ((end || 1) / e.cur() ) * start;
								jQuery.style(this, p, start + unit);
							}

							// If a +=/-= token was provided, we're doing a relative animation
							if (parts[1]) {
								end = ((parts[1] === "-=" ? -1 : 1) * end ) + start;
							}

							e.custom(start, end, unit);

						} else {
							e.custom(start, val, "");
						}
					}
				}

				// For JS strict compliance
				return true;
			}

			return optall.queue === false ? this.each(doAnimation) : this.queue(optall.queue, doAnimation);
		},

		stop : function(type, clearQueue, gotoEnd) {
			if ( typeof type !== "string") {
				gotoEnd = clearQueue;
				clearQueue = type;
				type = undefined;
			}
			if (clearQueue && type !== false) {
				this.queue(type || "fx", []);
			}

			return this.each(function() {
				var index, hadTimers = false, timers = jQuery.timers, data = jQuery._data(this);

				// clear marker counters if we know they won't be
				if (!gotoEnd) {
					jQuery._unmark(true, this);
				}

				function stopQueue(elem, data, index) {
					var hooks = data[index];
					jQuery.removeData(elem, index, true);
					hooks.stop(gotoEnd);
				}

				if (type == null) {
					for (index in data ) {
						if (data[index] && data[index].stop && index.indexOf(".run") === index.length - 4) {
							stopQueue(this, data, index);
						}
					}
				} else if (data[ index = type + ".run"] && data[index].stop) {
					stopQueue(this, data, index);
				}

				for ( index = timers.length; index--; ) {
					if (timers[index].elem === this && (type == null || timers[index].queue === type)) {
						if (gotoEnd) {

							// force the next step to be the last
							timers[ index ](true);
						} else {
							timers[index].saveState();
						}
						hadTimers = true;
						timers.splice(index, 1);
					}
				}

				// start the next in the queue if the last step wasn't forced
				// timers currently will call their complete callbacks, which will dequeue
				// but only if they were gotoEnd
				if (!(gotoEnd && hadTimers )) {
					jQuery.dequeue(this, type);
				}
			});
		}
	});

	// Animations created synchronously will run synchronously
	function createFxNow() {
		setTimeout(clearFxNow, 0);
		return ( fxNow = jQuery.now() );
	}

	function clearFxNow() {
		fxNow = undefined;
	}

	// Generate parameters to create a standard animation
	function genFx(type, num) {
		var obj = {};

		jQuery.each(fxAttrs.concat.apply([], fxAttrs.slice(0, num)), function() {
			obj[this] = type;
		});

		return obj;
	}

	// Generate shortcuts for custom animations
	jQuery.each({
		slideDown : genFx("show", 1),
		slideUp : genFx("hide", 1),
		slideToggle : genFx("toggle", 1),
		fadeIn : {
			opacity : "show"
		},
		fadeOut : {
			opacity : "hide"
		},
		fadeToggle : {
			opacity : "toggle"
		}
	}, function(name, props) {
		jQuery.fn[name] = function(speed, easing, callback) {
			return this.animate(props, speed, easing, callback);
		};
	});

	jQuery.extend({
		speed : function(speed, easing, fn) {
			var opt = speed && typeof speed === "object" ? jQuery.extend({}, speed) : {
				complete : fn || !fn && easing || jQuery.isFunction(speed) && speed,
				duration : speed,
				easing : fn && easing || easing && !jQuery.isFunction(easing) && easing
			};

			opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration : opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[opt.duration] : jQuery.fx.speeds._default;

			// normalize opt.queue - true/undefined/null -> "fx"
			if (opt.queue == null || opt.queue === true) {
				opt.queue = "fx";
			}

			// Queueing
			opt.old = opt.complete;

			opt.complete = function(noUnmark) {
				if (jQuery.isFunction(opt.old)) {
					opt.old.call(this);
				}

				if (opt.queue) {
					jQuery.dequeue(this, opt.queue);
				} else if (noUnmark !== false) {
					jQuery._unmark(this);
				}
			};

			return opt;
		},

		easing : {
			linear : function(p, n, firstNum, diff) {
				return firstNum + diff * p;
			},
			swing : function(p, n, firstNum, diff) {
				return ((-Math.cos(p * Math.PI) / 2 ) + 0.5 ) * diff + firstNum;
			}
		},

		timers : [],

		fx : function(elem, options, prop) {
			this.options = options;
			this.elem = elem;
			this.prop = prop;

			options.orig = options.orig || {};
		}
	});

	jQuery.fx.prototype = {
		// Simple function for setting a style value
		update : function() {
			if (this.options.step) {
				this.options.step.call(this.elem, this.now, this);
			}

			(jQuery.fx.step[this.prop] || jQuery.fx.step._default )(this);
		},

		// Get the current size
		cur : function() {
			if (this.elem[this.prop] != null && (!this.elem.style || this.elem.style[this.prop] == null)) {
				return this.elem[this.prop];
			}

			var parsed, r = jQuery.css(this.elem, this.prop);
			// Empty strings, null, undefined and "auto" are converted to 0,
			// complex values such as "rotate(1rad)" are returned as is,
			// simple values such as "10px" are parsed to Float.
			return isNaN( parsed = parseFloat(r)) ? !r || r === "auto" ? 0 : r : parsed;
		},

		// Start an animation from one number to another
		custom : function(from, to, unit) {
			var self = this, fx = jQuery.fx;

			this.startTime = fxNow || createFxNow();
			this.end = to;
			this.now = this.start = from;
			this.pos = this.state = 0;
			this.unit = unit || this.unit || (jQuery.cssNumber[this.prop] ? "" : "px" );

			function t(gotoEnd) {
				return self.step(gotoEnd);
			}


			t.queue = this.options.queue;
			t.elem = this.elem;
			t.saveState = function() {
				if (self.options.hide && jQuery._data(self.elem, "fxshow" + self.prop) === undefined) {
					jQuery._data(self.elem, "fxshow" + self.prop, self.start);
				}
			};

			if (t() && jQuery.timers.push(t) && !timerId) {
				timerId = setInterval(fx.tick, fx.interval);
			}
		},

		// Simple 'show' function
		show : function() {
			var dataShow = jQuery._data(this.elem, "fxshow" + this.prop);

			// Remember where we started, so that we can go back to it later
			this.options.orig[this.prop] = dataShow || jQuery.style(this.elem, this.prop);
			this.options.show = true;

			// Begin the animation
			// Make sure that we start at a small width/height to avoid any flash of content
			if (dataShow !== undefined) {
				// This show is picking up where a previous hide or show left off
				this.custom(this.cur(), dataShow);
			} else {
				this.custom(this.prop === "width" || this.prop === "height" ? 1 : 0, this.cur());
			}

			// Start by showing the element
			jQuery(this.elem).show();
		},

		// Simple 'hide' function
		hide : function() {
			// Remember where we started, so that we can go back to it later
			this.options.orig[this.prop] = jQuery._data(this.elem, "fxshow" + this.prop) || jQuery.style(this.elem, this.prop);
			this.options.hide = true;

			// Begin the animation
			this.custom(this.cur(), 0);
		},

		// Each step of an animation
		step : function(gotoEnd) {
			var p, n, complete, t = fxNow || createFxNow(), done = true, elem = this.elem, options = this.options;

			if (gotoEnd || t >= options.duration + this.startTime) {
				this.now = this.end;
				this.pos = this.state = 1;
				this.update();

				options.animatedProperties[this.prop] = true;

				for (p in options.animatedProperties ) {
					if (options.animatedProperties[p] !== true) {
						done = false;
					}
				}

				if (done) {
					// Reset the overflow
					if (options.overflow != null && !jQuery.support.shrinkWrapBlocks) {

						jQuery.each(["", "X", "Y"], function(index, value) {
							elem.style["overflow" + value] = options.overflow[index];
						});
					}

					// Hide the element if the "hide" operation was done
					if (options.hide) {
						jQuery(elem).hide();
					}

					// Reset the properties, if the item has been hidden or shown
					if (options.hide || options.show) {
						for (p in options.animatedProperties ) {
							jQuery.style(elem, p, options.orig[p]);
							jQuery.removeData(elem, "fxshow" + p, true);
							// Toggle data is no longer needed
							jQuery.removeData(elem, "toggle" + p, true);
						}
					}

					// Execute the complete function
					// in the event that the complete function throws an exception
					// we must ensure it won't be called twice. #5684

					complete = options.complete;
					if (complete) {

						options.complete = false;
						complete.call(elem);
					}
				}

				return false;

			} else {
				// classical easing cannot be used with an Infinity duration
				if (options.duration == Infinity) {
					this.now = t;
				} else {
					n = t - this.startTime;
					this.state = n / options.duration;

					// Perform the easing function, defaults to swing
					this.pos = jQuery.easing[ options.animatedProperties[this.prop] ](this.state, n, 0, 1, options.duration);
					this.now = this.start + ((this.end - this.start) * this.pos );
				}
				// Perform the next step of the animation
				this.update();
			}

			return true;
		}
	};

	jQuery.extend(jQuery.fx, {
		tick : function() {
			var timer, timers = jQuery.timers, i = 0;

			for (; i < timers.length; i++) {
				timer = timers[i];
				// Checks the timer has not already been removed
				if (!timer() && timers[i] === timer) {
					timers.splice(i--, 1);
				}
			}

			if (!timers.length) {
				jQuery.fx.stop();
			}
		},

		interval : 13,

		stop : function() {
			clearInterval(timerId);
			timerId = null;
		},

		speeds : {
			slow : 600,
			fast : 200,
			// Default speed
			_default : 400
		},

		step : {
			opacity : function(fx) {
				jQuery.style(fx.elem, "opacity", fx.now);
			},

			_default : function(fx) {
				if (fx.elem.style && fx.elem.style[fx.prop] != null) {
					fx.elem.style[fx.prop] = fx.now + fx.unit;
				} else {
					fx.elem[fx.prop] = fx.now;
				}
			}
		}
	});

	// Adds width/height step functions
	// Do not set anything below 0
	jQuery.each(["width", "height"], function(i, prop) {
		jQuery.fx.step[prop] = function(fx) {
			jQuery.style(fx.elem, prop, Math.max(0, fx.now) + fx.unit);
		};
	});

	if (jQuery.expr && jQuery.expr.filters) {
		jQuery.expr.filters.animated = function(elem) {
			return jQuery.grep(jQuery.timers, function(fn) {
				return elem === fn.elem;
			}).length;
		};
	}

	// Try to restore the default display value of an element
	function defaultDisplay(nodeName) {

		if (!elemdisplay[nodeName]) {

			var body = document.body, elem = jQuery("<" + nodeName + ">").appendTo(body), display = elem.css("display");
			elem.remove();

			// If the simple way fails,
			// get element's real default display by attaching it to a temp iframe
			if (display === "none" || display === "") {
				// No iframe to use yet, so create it
				if (!iframe) {
					iframe = document.createElement("iframe");
					iframe.frameBorder = iframe.width = iframe.height = 0;
				}

				body.appendChild(iframe);

				// Create a cacheable copy of the iframe document on first call.
				// IE and Opera will allow us to reuse the iframeDoc without re-writing the fake HTML
				// document to it; WebKit & Firefox won't allow reusing the iframe document.
				if (!iframeDoc || !iframe.createElement) {
					iframeDoc = (iframe.contentWindow || iframe.contentDocument ).document;
					iframeDoc.write((document.compatMode === "CSS1Compat" ? "<!doctype html>" : "" ) + "<html><body>");
					iframeDoc.close();
				}

				elem = iframeDoc.createElement(nodeName);

				iframeDoc.body.appendChild(elem);

				display = jQuery.css(elem, "display");
				body.removeChild(iframe);
			}

			// Store the correct default display
			elemdisplay[nodeName] = display;
		}

		return elemdisplay[nodeName];
	}

	var rtable = /^t(?:able|d|h)$/i, rroot = /^(?:body|html)$/i;

	if ("getBoundingClientRect" in document.documentElement) {
		jQuery.fn.offset = function(options) {
			var elem = this[0], box;

			if (options) {
				return this.each(function(i) {
					jQuery.offset.setOffset(this, options, i);
				});
			}

			if (!elem || !elem.ownerDocument) {
				return null;
			}

			if (elem === elem.ownerDocument.body) {
				return jQuery.offset.bodyOffset(elem);
			}

			try {
				box = elem.getBoundingClientRect();
			} catch(e) {
			}

			var doc = elem.ownerDocument, docElem = doc.documentElement;

			// Make sure we're not dealing with a disconnected DOM node
			if (!box || !jQuery.contains(docElem, elem)) {
				return box ? {
					top : box.top,
					left : box.left
				} : {
					top : 0,
					left : 0
				};
			}

			var body = doc.body, win = getWindow(doc), clientTop = docElem.clientTop || body.clientTop || 0, clientLeft = docElem.clientLeft || body.clientLeft || 0, scrollTop = win.pageYOffset || jQuery.support.boxModel && docElem.scrollTop || body.scrollTop, scrollLeft = win.pageXOffset || jQuery.support.boxModel && docElem.scrollLeft || body.scrollLeft, top = box.top + scrollTop - clientTop, left = box.left + scrollLeft - clientLeft;

			return {
				top : top,
				left : left
			};
		};

	} else {
		jQuery.fn.offset = function(options) {
			var elem = this[0];

			if (options) {
				return this.each(function(i) {
					jQuery.offset.setOffset(this, options, i);
				});
			}

			if (!elem || !elem.ownerDocument) {
				return null;
			}

			if (elem === elem.ownerDocument.body) {
				return jQuery.offset.bodyOffset(elem);
			}

			var computedStyle, offsetParent = elem.offsetParent, prevOffsetParent = elem, doc = elem.ownerDocument, docElem = doc.documentElement, body = doc.body, defaultView = doc.defaultView, prevComputedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle, top = elem.offsetTop, left = elem.offsetLeft;

			while (( elem = elem.parentNode) && elem !== body && elem !== docElem) {
				if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
					break;
				}

				computedStyle = defaultView ? defaultView.getComputedStyle(elem, null) : elem.currentStyle;
				top -= elem.scrollTop;
				left -= elem.scrollLeft;

				if (elem === offsetParent) {
					top += elem.offsetTop;
					left += elem.offsetLeft;

					if (jQuery.support.doesNotAddBorder && !(jQuery.support.doesAddBorderForTableAndCells && rtable.test(elem.nodeName))) {
						top += parseFloat(computedStyle.borderTopWidth) || 0;
						left += parseFloat(computedStyle.borderLeftWidth) || 0;
					}

					prevOffsetParent = offsetParent;
					offsetParent = elem.offsetParent;
				}

				if (jQuery.support.subtractsBorderForOverflowNotVisible && computedStyle.overflow !== "visible") {
					top += parseFloat(computedStyle.borderTopWidth) || 0;
					left += parseFloat(computedStyle.borderLeftWidth) || 0;
				}

				prevComputedStyle = computedStyle;
			}

			if (prevComputedStyle.position === "relative" || prevComputedStyle.position === "static") {
				top += body.offsetTop;
				left += body.offsetLeft;
			}

			if (jQuery.support.fixedPosition && prevComputedStyle.position === "fixed") {
				top += Math.max(docElem.scrollTop, body.scrollTop);
				left += Math.max(docElem.scrollLeft, body.scrollLeft);
			}

			return {
				top : top,
				left : left
			};
		};
	}

	jQuery.offset = {

		bodyOffset : function(body) {
			var top = body.offsetTop, left = body.offsetLeft;

			if (jQuery.support.doesNotIncludeMarginInBodyOffset) {
				top += parseFloat(jQuery.css(body, "marginTop")) || 0;
				left += parseFloat(jQuery.css(body, "marginLeft")) || 0;
			}

			return {
				top : top,
				left : left
			};
		},

		setOffset : function(elem, options, i) {
			var position = jQuery.css(elem, "position");

			// set position first, in-case top/left are set even on static elem
			if (position === "static") {
				elem.style.position = "relative";
			}

			var curElem = jQuery(elem), curOffset = curElem.offset(), curCSSTop = jQuery.css(elem, "top"), curCSSLeft = jQuery.css(elem, "left"), calculatePosition = (position === "absolute" || position === "fixed" ) && jQuery.inArray("auto", [curCSSTop, curCSSLeft]) > -1, props = {}, curPosition = {}, curTop, curLeft;

			// need to be able to calculate position if either top or left is auto and position is either absolute or fixed
			if (calculatePosition) {
				curPosition = curElem.position();
				curTop = curPosition.top;
				curLeft = curPosition.left;
			} else {
				curTop = parseFloat(curCSSTop) || 0;
				curLeft = parseFloat(curCSSLeft) || 0;
			}

			if (jQuery.isFunction(options)) {
				options = options.call(elem, i, curOffset);
			}

			if (options.top != null) {
				props.top = (options.top - curOffset.top ) + curTop;
			}
			if (options.left != null) {
				props.left = (options.left - curOffset.left ) + curLeft;
			}

			if ("using" in options) {
				options.using.call(elem, props);
			} else {
				curElem.css(props);
			}
		}
	};

	jQuery.fn.extend({

		position : function() {
			if (!this[0]) {
				return null;
			}

			var elem = this[0],

			// Get *real* offsetParent
			offsetParent = this.offsetParent(),

			// Get correct offsets
			offset = this.offset(), parentOffset = rroot.test(offsetParent[0].nodeName) ? {
				top : 0,
				left : 0
			} : offsetParent.offset();

			// Subtract element margins
			// note: when an element has margin: auto the offsetLeft and marginLeft
			// are the same in Safari causing offset.left to incorrectly be 0
			offset.top -= parseFloat(jQuery.css(elem, "marginTop")) || 0;
			offset.left -= parseFloat(jQuery.css(elem, "marginLeft")) || 0;

			// Add offsetParent borders
			parentOffset.top += parseFloat(jQuery.css(offsetParent[0], "borderTopWidth")) || 0;
			parentOffset.left += parseFloat(jQuery.css(offsetParent[0], "borderLeftWidth")) || 0;

			// Subtract the two offsets
			return {
				top : offset.top - parentOffset.top,
				left : offset.left - parentOffset.left
			};
		},

		offsetParent : function() {
			return this.map(function() {
				var offsetParent = this.offsetParent || document.body;
				while (offsetParent && (!rroot.test(offsetParent.nodeName) && jQuery.css(offsetParent, "position") === "static")) {
					offsetParent = offsetParent.offsetParent;
				}
				return offsetParent;
			});
		}
	});

	// Create scrollLeft and scrollTop methods
	jQuery.each(["Left", "Top"], function(i, name) {
		var method = "scroll" + name;

		jQuery.fn[method] = function(val) {
			var elem, win;

			if (val === undefined) {
				elem = this[0];

				if (!elem) {
					return null;
				}

				win = getWindow(elem);

				// Return the scroll offset
				return win ? ("pageXOffset" in win) ? win[ i ? "pageYOffset" : "pageXOffset"] : jQuery.support.boxModel && win.document.documentElement[method] || win.document.body[method] : elem[method];
			}

			// Set the scroll offset
			return this.each(function() {
				win = getWindow(this);

				if (win) {
					win.scrollTo(!i ? val : jQuery(win).scrollLeft(), i ? val : jQuery(win).scrollTop());

				} else {
					this[method] = val;
				}
			});
		};
	});

	function getWindow(elem) {
		return jQuery.isWindow(elem) ? elem : elem.nodeType === 9 ? elem.defaultView || elem.parentWindow : false;
	}

	// Create width, height, innerHeight, innerWidth, outerHeight and outerWidth methods
	jQuery.each(["Height", "Width"], function(i, name) {

		var type = name.toLowerCase();

		// innerHeight and innerWidth
		jQuery.fn["inner" + name] = function() {
			var elem = this[0];
			return elem ? elem.style ? parseFloat(jQuery.css(elem, type, "padding")) : this[ type ]() : null;
		};

		// outerHeight and outerWidth
		jQuery.fn["outer" + name] = function(margin) {
			var elem = this[0];
			return elem ? elem.style ? parseFloat(jQuery.css(elem, type, margin ? "margin" : "border")) : this[ type ]() : null;
		};

		jQuery.fn[type] = function(size) {
			// Get window width or height
			var elem = this[0];
			if (!elem) {
				return size == null ? null : this;
			}

			if (jQuery.isFunction(size)) {
				return this.each(function(i) {
					var self = jQuery(this);
					self[ type ](size.call(this, i, self[ type ]()));
				});
			}

			if (jQuery.isWindow(elem)) {
				// Everyone else use document.documentElement or document.body depending on Quirks vs Standards mode
				// 3rd condition allows Nokia support, as it supports the docElem prop but not CSS1Compat
				var docElemProp = elem.document.documentElement["client" + name], body = elem.document.body;
				return elem.document.compatMode === "CSS1Compat" && docElemProp || body && body["client" + name] || docElemProp;

				// Get document width or height
			} else if (elem.nodeType === 9) {
				// Either scroll[Width/Height] or offset[Width/Height], whichever is greater
				return Math.max(elem.documentElement["client" + name], elem.body["scroll" + name], elem.documentElement["scroll" + name], elem.body["offset" + name], elem.documentElement["offset" + name]);

				// Get or set width or height on the element
			} else if (size === undefined) {
				var orig = jQuery.css(elem, type), ret = parseFloat(orig);

				return jQuery.isNumeric(ret) ? ret : orig;

				// Set the width or height on the element (default to pixels if value is unitless)
			} else {
				return this.css(type, typeof size === "string" ? size : size + "px");
			}
		};

	});

	// Expose jQuery to the global object
	window.jQuery = window.$ = jQuery;

	// Expose jQuery as an AMD module, but only for AMD loaders that
	// understand the issues with loading multiple versions of jQuery
	// in a page that all might call define(). The loader will indicate
	// they have special allowances for multiple jQuery versions by
	// specifying define.amd.jQuery = true. Register as a named module,
	// since jQuery can be concatenated with other files that may use define,
	// but not use a proper concatenation script that understands anonymous
	// AMD modules. A named AMD is safest and most robust way to register.
	// Lowercase jquery is used because AMD module names are derived from
	// file names, and jQuery is normally delivered in a lowercase file name.
	// Do this after creating the global so that if an AMD module wants to call
	// noConflict to hide this version of jQuery, it will work.
	if ( typeof define === "function" && define.amd && define.amd.jQuery) {
		define("jquery", [], function() {
			return jQuery;
		});
	}

})(window);
/*!
 * jQuery UI @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI
 */
(function($, undefined) {

	// prevent duplicate loading
	// this is only a problem because we proxy existing functions
	// and we don't want to double proxy them
	$.ui = $.ui || {};
	if ($.ui.version) {
		return;
	}

	$.extend($.ui, {
		version : "@VERSION",

		keyCode : {
			ALT : 18,
			BACKSPACE : 8,
			CAPS_LOCK : 20,
			COMMA : 188,
			COMMAND : 91,
			COMMAND_LEFT : 91, // COMMAND
			COMMAND_RIGHT : 93,
			CONTROL : 17,
			DELETE : 46,
			DOWN : 40,
			END : 35,
			ENTER : 13,
			ESCAPE : 27,
			HOME : 36,
			INSERT : 45,
			LEFT : 37,
			MENU : 93, // COMMAND_RIGHT
			NUMPAD_ADD : 107,
			NUMPAD_DECIMAL : 110,
			NUMPAD_DIVIDE : 111,
			NUMPAD_ENTER : 108,
			NUMPAD_MULTIPLY : 106,
			NUMPAD_SUBTRACT : 109,
			PAGE_DOWN : 34,
			PAGE_UP : 33,
			PERIOD : 190,
			RIGHT : 39,
			SHIFT : 16,
			SPACE : 32,
			TAB : 9,
			UP : 38,
			WINDOWS : 91 // COMMAND
		}
	});

	// plugins
	$.fn.extend({
		propAttr : $.fn.prop || $.fn.attr,

		_focus : $.fn.focus,
		focus : function(delay, fn) {
			return typeof delay === "number" ? this.each(function() {
				var elem = this;
				setTimeout(function() {
					$(elem).focus();
					if (fn) {
						fn.call(elem);
					}
				}, delay);
			}) : this._focus.apply(this, arguments);
		},

		scrollParent : function() {
			var scrollParent;
			if (($.browser.msie && (/(static|relative)/).test(this.css('position'))) || (/absolute/).test(this.css('position'))) {
				scrollParent = this.parents().filter(function() {
					return (/(relative|absolute|fixed)/).test($.curCSS(this, 'position', 1)) && (/(auto|scroll)/).test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1));
				}).eq(0);
			} else {
				scrollParent = this.parents().filter(function() {
					return (/(auto|scroll)/).test($.curCSS(this, 'overflow', 1) + $.curCSS(this, 'overflow-y', 1) + $.curCSS(this, 'overflow-x', 1));
				}).eq(0);
			}

			return (/fixed/).test(this.css('position')) || !scrollParent.length ? $(document) : scrollParent;
		},

		zIndex : function(zIndex) {
			if (zIndex !== undefined) {
				return this.css("zIndex", zIndex);
			}

			if (this.length) {
				var elem = $(this[0]), position, value;
				while (elem.length && elem[0] !== document) {
					// Ignore z-index if position is set to a value where z-index is ignored by the browser
					// This makes behavior of this function consistent across browsers
					// WebKit always returns auto if the element is positioned
					position = elem.css("position");
					if (position === "absolute" || position === "relative" || position === "fixed") {
						// IE returns 0 when zIndex is not specified
						// other browsers return a string
						// we ignore the case of nested elements with an explicit value of 0
						// <div style="z-index: -10;"><div style="z-index: 0;"></div></div>
						value = parseInt(elem.css("zIndex"), 10);
						if (!isNaN(value) && value !== 0) {
							return value;
						}
					}
					elem = elem.parent();
				}
			}

			return 0;
		},

		disableSelection : function() {
			return this.bind(($.support.selectstart ? "selectstart" : "mousedown" ) + ".ui-disableSelection", function(event) {
				event.preventDefault();
			});
		},

		enableSelection : function() {
			return this.unbind(".ui-disableSelection");
		}
	});

	$.each(["Width", "Height"], function(i, name) {
		var side = name === "Width" ? ["Left", "Right"] : ["Top", "Bottom"], type = name.toLowerCase(), orig = {
			innerWidth : $.fn.innerWidth,
			innerHeight : $.fn.innerHeight,
			outerWidth : $.fn.outerWidth,
			outerHeight : $.fn.outerHeight
		};

		function reduce(elem, size, border, margin) {
			$.each(side, function() {
				size -= parseFloat($.curCSS(elem, "padding" + this, true)) || 0;
				if (border) {
					size -= parseFloat($.curCSS(elem, "border" + this + "Width", true)) || 0;
				}
				if (margin) {
					size -= parseFloat($.curCSS(elem, "margin" + this, true)) || 0;
				}
			});
			return size;
		}

		$.fn["inner" + name] = function(size) {
			if (size === undefined) {
				return orig["inner" + name].call(this);
			}

			return this.each(function() {
				$(this).css(type, reduce(this, size) + "px");
			});
		};

		$.fn["outer" + name] = function(size, margin) {
			if ( typeof size !== "number") {
				return orig["outer" + name].call(this, size);
			}

			return this.each(function() {
				$(this).css(type, reduce(this, size, true, margin) + "px");
			});
		};
	});

	// selectors
	function focusable(element, isTabIndexNotNaN) {
		var nodeName = element.nodeName.toLowerCase();
		if ("area" === nodeName) {
			var map = element.parentNode, mapName = map.name, img;
			if (!element.href || !mapName || map.nodeName.toLowerCase() !== "map") {
				return false;
			}
			img = $( "img[usemap=#" + mapName + "]" )[0];
			return !!img && visible(img);
		}
		return (/input|select|textarea|button|object/.test(nodeName) ? !element.disabled : "a" == nodeName ? element.href || isTabIndexNotNaN : isTabIndexNotNaN)
		// the element and all of its ancestors must be visible
		&& visible(element);
	}

	function visible(element) {
		return !$(element).parents().andSelf().filter(function() {
			return $.curCSS(this, "visibility") === "hidden" || $.expr.filters.hidden(this);
		}).length;
	}


	$.extend($.expr[":"], {
		data : function(elem, i, match) {
			return !!$.data(elem, match[3]);
		},

		focusable : function(element) {
			return focusable(element, !isNaN($.attr(element, "tabindex")));
		},

		tabbable : function(element) {
			var tabIndex = $.attr(element, "tabindex"), isTabIndexNaN = isNaN(tabIndex);
			return (isTabIndexNaN || tabIndex >= 0 ) && focusable(element, !isTabIndexNaN);
		}
	});

	// support
	$(function() {
		var body = document.body, div = body.appendChild( div = document.createElement("div"));

		$.extend(div.style, {
			minHeight : "100px",
			height : "auto",
			padding : 0,
			borderWidth : 0
		});

		$.support.minHeight = div.offsetHeight === 100;
		$.support.selectstart = "onselectstart" in div;

		// set display to none to avoid a layout bug in IE
		// http://dev.jquery.com/ticket/4014
		body.removeChild(div).style.display = "none";
	});

	// deprecated
	$.extend($.ui, {
		// $.ui.plugin is deprecated.  Use the proxy pattern instead.
		plugin : {
			add : function(module, option, set) {
				var proto = $.ui[module].prototype;
				for (var i in set ) {
					proto.plugins[i] = proto.plugins[i] || [];
					proto.plugins[i].push([option, set[i]]);
				}
			},
			call : function(instance, name, args) {
				var set = instance.plugins[name];
				if (!set || !instance.element[0].parentNode) {
					return;
				}

				for (var i = 0; i < set.length; i++) {
					if (instance.options[set[ i ][0]]) {
						set[ i ][1].apply(instance.element, args);
					}
				}
			}
		},

		// will be deprecated when we switch to jQuery 1.4 - use jQuery.contains()
		contains : function(a, b) {
			return document.compareDocumentPosition ? a.compareDocumentPosition(b) & 16 : a !== b && a.contains(b);
		},

		// only used by resizable
		hasScroll : function(el, a) {

			//If overflow is hidden, the element might have extra content, but the user wants to hide it
			if ($(el).css("overflow") === "hidden") {
				return false;
			}

			var scroll = (a && a === "left" ) ? "scrollLeft" : "scrollTop", has = false;

			if (el[scroll] > 0) {
				return true;
			}

			// TODO: determine which cases actually cause this to happen
			// if the element doesn't have the scroll set, see if it's possible to
			// set the scroll
			el[scroll] = 1;
			has = (el[scroll] > 0 );
			el[scroll] = 0;
			return has;
		},

		// these are odd functions, fix the API or move into individual plugins
		isOverAxis : function(x, reference, size) {
			//Determines when x coordinate is over "b" element axis
			return (x > reference ) && (x < (reference + size ) );
		},
		isOver : function(y, x, top, left, height, width) {
			//Determines when x, y coordinates is over "b" element
			return $.ui.isOverAxis(y, top, height) && $.ui.isOverAxis(x, left, width);
		}
	});

})(jQuery);
/*!
 * jQuery UI Widget @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Widget
 */
(function($, undefined) {

	// jQuery 1.4+
	if ($.cleanData) {
		var _cleanData = $.cleanData;
		$.cleanData = function(elems) {
			for (var i = 0, elem; ( elem = elems[i]) != null; i++) {
				try {
					$(elem).triggerHandler("remove");
					// http://bugs.jquery.com/ticket/8235
				} catch( e ) {
				}
			}
			_cleanData(elems);
		};
	} else {
		var _remove = $.fn.remove;
		$.fn.remove = function(selector, keepData) {
			return this.each(function() {
				if (!keepData) {
					if (!selector || $.filter(selector, [this]).length) {
						$("*", this).add([this]).each(function() {
							try {
								$(this).triggerHandler("remove");
								// http://bugs.jquery.com/ticket/8235
							} catch( e ) {
							}
						});
					}
				}
				return _remove.call($(this), selector, keepData);
			});
		};
	}

	$.widget = function(name, base, prototype) {
		var namespace = name.split( "." )[0], fullName;
		name = name.split( "." )[1];
		fullName = namespace + "-" + name;

		if (!prototype) {
			prototype = base;
			base = $.Widget;
		}

		// create selector for plugin
		$.expr[ ":" ][fullName] = function(elem) {
			return !!$.data(elem, name);
		};

		$[namespace] = $[namespace] || {};
		$[ namespace ][name] = function(options, element) {
			// allow instantiation without initializing for simple inheritance
			if (arguments.length) {
				this._createWidget(options, element);
			}
		};

		var basePrototype = new base();
		// we need to make the options hash a property directly on the new instance
		// otherwise we'll modify the options hash on the prototype that we're
		// inheriting from
		//	$.each( basePrototype, function( key, val ) {
		//		if ( $.isPlainObject(val) ) {
		//			basePrototype[ key ] = $.extend( {}, val );
		//		}
		//	});
		basePrototype.options = $.extend(true, {}, basePrototype.options);
		$[ namespace ][name].prototype = $.extend(true, basePrototype, {
			namespace : namespace,
			widgetName : name,
			widgetEventPrefix : $[ namespace ][name].prototype.widgetEventPrefix || name,
			widgetBaseClass : fullName
		}, prototype);

		$.widget.bridge(name, $[ namespace ][name]);
	};

	$.widget.bridge = function(name, object) {
		$.fn[name] = function(options) {
			var isMethodCall = typeof options === "string", args = Array.prototype.slice.call(arguments, 1), returnValue = this;

			// allow multiple hashes to be passed on init
			options = !isMethodCall && args.length ? $.extend.apply(null, [true, options].concat(args)) : options;

			// prevent calls to internal methods
			if (isMethodCall && options.charAt(0) === "_") {
				return returnValue;
			}

			if (isMethodCall) {
				this.each(function() {
					var instance = $.data(this, name), methodValue = instance && $.isFunction(instance[options]) ? instance[options].apply(instance, args) : instance;
					// TODO: add this back in 1.9 and use $.error() (see #5972)
					//				if ( !instance ) {
					//					throw "cannot call methods on " + name + " prior to initialization; " +
					//						"attempted to call method '" + options + "'";
					//				}
					//				if ( !$.isFunction( instance[options] ) ) {
					//					throw "no such method '" + options + "' for " + name + " widget instance";
					//				}
					//				var methodValue = instance[ options ].apply( instance, args );
					if (methodValue !== instance && methodValue !== undefined) {
						returnValue = methodValue;
						return false;
					}
				});
			} else {
				this.each(function() {
					var instance = $.data(this, name);
					if (instance) {
						instance.option(options || {})._init();
					} else {
						$.data(this, name, new object(options, this));
					}
				});
			}

			return returnValue;
		};
	};

	$.Widget = function(options, element) {
		// allow instantiation without initializing for simple inheritance
		if (arguments.length) {
			this._createWidget(options, element);
		}
	};

	$.Widget.prototype = {
		widgetName : "widget",
		widgetEventPrefix : "",
		options : {
			disabled : false
		},
		_createWidget : function(options, element) {
			// $.widget.bridge stores the plugin instance, but we do it anyway
			// so that it's stored even before the _create function runs
			$.data(element, this.widgetName, this);
			this.element = $(element);
			this.options = $.extend(true, {}, this.options, this._getCreateOptions(), options);

			var self = this;
			this.element.bind("remove." + this.widgetName, function() {
				self.destroy();
			});

			this._create();
			this._trigger("create");
			this._init();
		},
		_getCreateOptions : function() {
			return $.metadata && $.metadata.get( this.element[0] )[this.widgetName];
		},
		_create : function() {
		},
		_init : function() {
		},

		destroy : function() {
			this.element.unbind("." + this.widgetName).removeData(this.widgetName);
			this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled " + "ui-state-disabled");
		},

		widget : function() {
			return this.element;
		},

		option : function(key, value) {
			var options = key;

			if (arguments.length === 0) {
				// don't return a reference to the internal hash
				return $.extend({}, this.options);
			}

			if ( typeof key === "string") {
				if (value === undefined) {
					return this.options[key];
				}
				options = {};
				options[key] = value;
			}

			this._setOptions(options);

			return this;
		},
		_setOptions : function(options) {
			var self = this;
			$.each(options, function(key, value) {
				self._setOption(key, value);
			});

			return this;
		},
		_setOption : function(key, value) {
			this.options[key] = value;

			if (key === "disabled") {
				this.widget()
				[ value ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled" + " " + "ui-state-disabled").attr("aria-disabled", value);
			}

			return this;
		},

		enable : function() {
			return this._setOption("disabled", false);
		},
		disable : function() {
			return this._setOption("disabled", true);
		},

		_trigger : function(type, event, data) {
			var prop, orig, callback = this.options[type];

			data = data || {};
			event = $.Event(event);
			event.type = (type === this.widgetEventPrefix ? type : this.widgetEventPrefix + type ).toLowerCase();
			// the original event may come from any element
			// so we need to reset the target on the new event
			event.target = this.element[0];

			// copy original event properties over to the new event
			orig = event.originalEvent;
			if (orig) {
				for (prop in orig ) {
					if (!( prop in event )) {
						event[prop] = orig[prop];
					}
				}
			}

			this.element.trigger(event, data);

			return !($.isFunction(callback) && callback.call(this.element[0], event, data) === false || event.isDefaultPrevented() );
		}
	};

})(jQuery);
/*!
 * jQuery UI Mouse @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Mouse
 *
 * Depends:
 *	jquery.ui.widget.js
 */
(function($, undefined) {

	var mouseHandled = false;
	$(document).mouseup(function(e) {
		mouseHandled = false;
	});

	$.widget("ui.mouse", {
		options : {
			cancel : ':input,option',
			distance : 1,
			delay : 0
		},
		_mouseInit : function() {
			var self = this;

			this.element.bind('mousedown.' + this.widgetName, function(event) {
				return self._mouseDown(event);
			}).bind('click.' + this.widgetName, function(event) {
				if (true === $.data(event.target, self.widgetName + '.preventClickEvent')) {
					$.removeData(event.target, self.widgetName + '.preventClickEvent');
					event.stopImmediatePropagation();
					return false;
				}
			});

			this.started = false;
		},

		// TODO: make sure destroying one instance of mouse doesn't mess with
		// other instances of mouse
		_mouseDestroy : function() {
			this.element.unbind('.' + this.widgetName);
		},

		_mouseDown : function(event) {
			// don't let more than one widget handle mouseStart
			if (mouseHandled) {
				return
			};

			// we may have missed mouseup (out of window)
			(this._mouseStarted && this._mouseUp(event));

			this._mouseDownEvent = event;

			var self = this, btnIsLeft = (event.which == 1),
			// event.target.nodeName works around a bug in IE 8 with
			// disabled inputs (#7620)
			elIsCancel = ( typeof this.options.cancel == "string" && event.target.nodeName ? $(event.target).closest(this.options.cancel).length : false);
			if (!btnIsLeft || elIsCancel || !this._mouseCapture(event)) {
				return true;
			}

			this.mouseDelayMet = !this.options.delay;
			if (!this.mouseDelayMet) {
				this._mouseDelayTimer = setTimeout(function() {
					self.mouseDelayMet = true;
				}, this.options.delay);
			}

			if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
				this._mouseStarted = (this._mouseStart(event) !== false);
				if (!this._mouseStarted) {
					event.preventDefault();
					return true;
				}
			}

			// Click event may never have fired (Gecko & Opera)
			if (true === $.data(event.target, this.widgetName + '.preventClickEvent')) {
				$.removeData(event.target, this.widgetName + '.preventClickEvent');
			}

			// these delegates are required to keep context
			this._mouseMoveDelegate = function(event) {
				return self._mouseMove(event);
			};
			this._mouseUpDelegate = function(event) {
				return self._mouseUp(event);
			};
			$(document).bind('mousemove.' + this.widgetName, this._mouseMoveDelegate).bind('mouseup.' + this.widgetName, this._mouseUpDelegate);

			event.preventDefault();

			mouseHandled = true;
			return true;
		},

		_mouseMove : function(event) {
			// IE mouseup check - mouseup happened when mouse was out of window
			if ($.browser.msie && !(document.documentMode >= 9) && !event.button) {
				return this._mouseUp(event);
			}

			if (this._mouseStarted) {
				this._mouseDrag(event);
				return event.preventDefault();
			}

			if (this._mouseDistanceMet(event) && this._mouseDelayMet(event)) {
				this._mouseStarted = (this._mouseStart(this._mouseDownEvent, event) !== false); (this._mouseStarted ? this._mouseDrag(event) : this._mouseUp(event));
			}

			return !this._mouseStarted;
		},

		_mouseUp : function(event) {
			$(document).unbind('mousemove.' + this.widgetName, this._mouseMoveDelegate).unbind('mouseup.' + this.widgetName, this._mouseUpDelegate);

			if (this._mouseStarted) {
				this._mouseStarted = false;

				if (event.target == this._mouseDownEvent.target) {
					$.data(event.target, this.widgetName + '.preventClickEvent', true);
				}

				this._mouseStop(event);
			}

			return false;
		},

		_mouseDistanceMet : function(event) {
			return (Math.max(Math.abs(this._mouseDownEvent.pageX - event.pageX), Math.abs(this._mouseDownEvent.pageY - event.pageY)) >= this.options.distance
			);
		},

		_mouseDelayMet : function(event) {
			return this.mouseDelayMet;
		},

		// These are placeholder methods, to be overriden by extending plugin
		_mouseStart : function(event) {
		},
		_mouseDrag : function(event) {
		},
		_mouseStop : function(event) {
		},
		_mouseCapture : function(event) {
			return true;
		}
	});

})(jQuery);
/*
 * jQuery UI Draggable @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Draggables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.mouse.js
 *	jquery.ui.widget.js
 */
(function($, undefined) {

	$.widget("ui.draggable", $.ui.mouse, {
		widgetEventPrefix : "drag",
		options : {
			addClasses : true,
			appendTo : "parent",
			axis : false,
			connectToSortable : false,
			containment : false,
			cursor : "auto",
			cursorAt : false,
			grid : false,
			handle : false,
			helper : "original",
			iframeFix : false,
			opacity : false,
			refreshPositions : false,
			revert : false,
			revertDuration : 500,
			scope : "default",
			scroll : true,
			scrollSensitivity : 20,
			scrollSpeed : 20,
			snap : false,
			snapMode : "both",
			snapTolerance : 20,
			stack : false,
			zIndex : false,
			beforeStart : function(event) {
			}
		},
		_create : function() {

			if (this.options.helper == 'original' && !(/^(?:r|a|f)/).test(this.element.css("position")))
				this.element[0].style.position = 'relative';
			(this.options.addClasses && this.element.addClass("ui-draggable")); (this.options.disabled && this.element.addClass("ui-draggable-disabled"));

			this._mouseInit();

		},

		destroy : function() {
			if (!this.element.data('draggable'))
				return;
			this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable" + " ui-draggable-dragging" + " ui-draggable-disabled");
			this._mouseDestroy();

			return this;
		},

		_mouseCapture : function(event) {

			var o = this.options;

			// among others, prevent a drag on a resizable-handle
			if (this.helper || o.disabled || $(event.target).is('.ui-resizable-handle'))
				return false;

			//Quit if we're not on a valid handle
			this.handle = this._getHandle(event);
			if (!this.handle)
				return false;

			if (o.iframeFix) {
				$(o.iframeFix === true ? "iframe" : o.iframeFix).each(function() {
					$('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({
						width : this.offsetWidth + "px",
						height : this.offsetHeight + "px",
						position : "absolute",
						opacity : "0.001",
						zIndex : 1000
					}).css($(this).offset()).appendTo("body");
				});
			}

			return true;

		},

		_mouseStart : function(event) {

			var o = this.options;
			this.options.beforeStart(event);

			//Create and append the visible helper
			this.helper = this._createHelper(event);

			//Cache the helper size
			this._cacheHelperProportions();

			//If ddmanager is used for droppables, set the global draggable
			if ($.ui.ddmanager)
				$.ui.ddmanager.current = this;

			/*
			* - Position generation -
			* This block generates everything position related - it's the core of draggables.
			*/

			//Cache the margins of the original element
			this._cacheMargins();

			//Store the helper's css position
			this.cssPosition = this.helper.css("position");
			this.scrollParent = this.helper.scrollParent();

			//The element's absolute position on the page minus margins
			this.offset = this.positionAbs = this.element.offset();
			this.offset = {
				top : this.offset.top - this.margins.top,
				left : this.offset.left - this.margins.left
			};

			$.extend(this.offset, {
				click : {//Where the click happened, relative to the element
					left : event.pageX - this.offset.left,
					top : event.pageY - this.offset.top
				},
				parent : this._getParentOffset(),
				relative : this._getRelativeOffset() //This is a relative to absolute position minus the actual position calculation - only used for relative positioned helper
			});

			//Generate the original position
			this.originalPosition = this.position = this._generatePosition(event);
			this.originalPageX = event.pageX;
			this.originalPageY = event.pageY;

			//Adjust the mouse offset relative to the helper if 'cursorAt' is supplied
			(o.cursorAt && this._adjustOffsetFromHelper(o.cursorAt));

			//Set a containment if given in the options
			if (o.containment)
				this._setContainment();

			//Trigger event + callbacks
			if (this._trigger("start", event) === false) {
				this._clear();
				return false;
			}

			//Recache the helper size
			this._cacheHelperProportions();

			//Prepare the droppable offsets
			if ($.ui.ddmanager && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(this, event);

			this.helper.addClass("ui-draggable-dragging");
			this._mouseDrag(event, true);
			//Execute the drag once - this causes the helper not to be visible before getting its correct position

			//If the ddmanager is used for droppables, inform the manager that dragging has started (see #5003)
			if ($.ui.ddmanager)
				$.ui.ddmanager.dragStart(this, event);

			return true;
		},

		_mouseDrag : function(event, noPropagation) {

			//Compute the helpers position
			this.position = this._generatePosition(event);
			this.positionAbs = this._convertPositionTo("absolute");

			//Call plugins and callbacks and use the resulting position if something is returned
			if (!noPropagation) {
				var ui = this._uiHash();
				if (this._trigger('drag', event, ui) === false) {
					this._mouseUp({});
					return false;
				}
				this.position = ui.position;
			}

			if (!this.options.axis || this.options.axis != "y")
				this.helper[0].style.left = this.position.left + 'px';
			if (!this.options.axis || this.options.axis != "x")
				this.helper[0].style.top = this.position.top + 'px';
			if ($.ui.ddmanager)
				$.ui.ddmanager.drag(this, event);

			return false;
		},

		_mouseStop : function(event) {

			//If we are using droppables, inform the manager about the drop
			var dropped = false;
			if ($.ui.ddmanager && !this.options.dropBehaviour)
				dropped = $.ui.ddmanager.drop(this, event);

			//if a drop comes from outside (a sortable)
			if (this.dropped) {
				dropped = this.dropped;
				this.dropped = false;
			}

			//if the original element is removed, don't bother to continue if helper is set to "original"
			if ((!this.element[0] || !this.element[0].parentNode) && this.options.helper == "original")
				return false;

			if ((this.options.revert == "invalid" && !dropped) || (this.options.revert == "valid" && dropped) || this.options.revert === true || ($.isFunction(this.options.revert) && this.options.revert.call(this.element, dropped))) {
				var self = this;
				$(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function() {
					if (self._trigger("stop", event) !== false) {
						self._clear();
					}
				});
			} else {
				if (this._trigger("stop", event) !== false) {
					this._clear();
				}
			}

			return false;
		},

		_mouseUp : function(event) {
			if (this.options.iframeFix === true) {
				$("div.ui-draggable-iframeFix").each(function() {
					this.parentNode.removeChild(this);
				});
				//Remove frame helpers
			}

			//If the ddmanager is used for droppables, inform the manager that dragging has stopped (see #5003)
			if ($.ui.ddmanager)
				$.ui.ddmanager.dragStop(this, event);

			return $.ui.mouse.prototype._mouseUp.call(this, event);
		},

		cancel : function() {

			if (this.helper.is(".ui-draggable-dragging")) {
				this._mouseUp({});
			} else {
				this._clear();
			}

			return this;

		},

		_getHandle : function(event) {

			var handle = !this.options.handle || !$(this.options.handle, this.element).length ? true : false;
			$(this.options.handle, this.element).find("*").andSelf().each(function() {
				if (this == event.target)
					handle = true;
			});

			return handle;

		},

		_createHelper : function(event) {

			var o = this.options;
			var helper = $.isFunction(o.helper) ? $(o.helper.apply(this.element[0], [event])) : (o.helper == 'clone' ? this.element.clone().removeAttr('id') : this.element);

			if (!helper.parents('body').length)
				helper.appendTo((o.appendTo == 'parent' ? this.element[0].parentNode : o.appendTo));

			if (helper[0] != this.element[0] && !(/(fixed|absolute)/).test(helper.css("position")))
				helper.css("position", "absolute");

			return helper;

		},

		_adjustOffsetFromHelper : function(obj) {
			if ( typeof obj == 'string') {
				obj = obj.split(' ');
			}
			if ($.isArray(obj)) {
				obj = {
					left : +obj[0],
					top : +obj[1] || 0
				};
			}
			if ('left' in obj) {
				this.offset.click.left = obj.left + this.margins.left;
			}
			if ('right' in obj) {
				this.offset.click.left = this.helperProportions.width - obj.right + this.margins.left;
			}
			if ('top' in obj) {
				this.offset.click.top = obj.top + this.margins.top;
			}
			if ('bottom' in obj) {
				this.offset.click.top = this.helperProportions.height - obj.bottom + this.margins.top;
			}
		},

		_getParentOffset : function() {

			//Get the offsetParent and cache its position
			this.offsetParent = this.helper.offsetParent();
			var po = this.offsetParent.offset();

			// This is a special case where we need to modify a offset calculated on start, since the following happened:
			// 1. The position of the helper is absolute, so it's position is calculated based on the next positioned parent
			// 2. The actual offset parent is a child of the scroll parent, and the scroll parent isn't the document, which means that
			//    the scroll is included in the initial calculation of the offset of the parent, and never recalculated upon drag
			if (this.cssPosition == 'absolute' && this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) {
				po.left += this.scrollParent.scrollLeft();
				po.top += this.scrollParent.scrollTop();
			}

			if ((this.offsetParent[0] == document.body)//This needs to be actually done for all browsers, since pageX/pageY includes this information
				|| (this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == 'html' && $.browser.msie))//Ugly IE fix
				po = {
					top : 0,
					left : 0
				};

			return {
				top : po.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0),
				left : po.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)
			};

		},

		_getRelativeOffset : function() {

			if (this.cssPosition == "relative") {
				var p = this.element.position();
				return {
					top : p.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(),
					left : p.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()
				};
			} else {
				return {
					top : 0,
					left : 0
				};
			}

		},

		_cacheMargins : function() {
			this.margins = {
				left : (parseInt(this.element.css("marginLeft"), 10) || 0),
				top : (parseInt(this.element.css("marginTop"), 10) || 0),
				right : (parseInt(this.element.css("marginRight"), 10) || 0),
				bottom : (parseInt(this.element.css("marginBottom"), 10) || 0)
			};
		},

		_cacheHelperProportions : function() {
			this.helperProportions = {
				width : this.helper.outerWidth(),
				height : this.helper.outerHeight()
			};
		},

		_setContainment : function() {

			var o = this.options;
			if (o.containment == 'parent')
				o.containment = this.helper[0].parentNode;
			if (o.containment == 'document' || o.containment == 'window')
				this.containment = [o.containment == 'document' ? 0 : $(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, o.containment == 'document' ? 0 : $(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, (o.containment == 'document' ? 0 : $(window).scrollLeft()) + $(o.containment == 'document' ? document : window).width() - this.helperProportions.width - this.margins.left, (o.containment == 'document' ? 0 : $(window).scrollTop()) + ($(o.containment == 'document' ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];

			if (!(/^(document|window|parent)$/).test(o.containment) && o.containment.constructor != Array) {
				var c = $(o.containment);
				var ce = c[0];
				if (!ce)
					return;
				var co = c.offset();
				var over = ($(ce).css("overflow") != 'hidden');

				this.containment = [(parseInt($(ce).css("borderLeftWidth"), 10) || 0) + (parseInt($(ce).css("paddingLeft"), 10) || 0), (parseInt($(ce).css("borderTopWidth"), 10) || 0) + (parseInt($(ce).css("paddingTop"), 10) || 0), ( over ? Math.max(ce.scrollWidth, ce.offsetWidth) : ce.offsetWidth) - (parseInt($(ce).css("borderLeftWidth"), 10) || 0) - (parseInt($(ce).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, ( over ? Math.max(ce.scrollHeight, ce.offsetHeight) : ce.offsetHeight) - (parseInt($(ce).css("borderTopWidth"), 10) || 0) - (parseInt($(ce).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom];
				this.relative_container = c;

			} else if (o.containment.constructor == Array) {
				this.containment = o.containment;
			}

		},

		_convertPositionTo : function(d, pos) {

			if (!pos)
				pos = this.position;
			var mod = d == "absolute" ? 1 : -1;
			var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);

			return {
				top : (pos.top// The absolute mouse position
				+ this.offset.relative.top * mod// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.top * mod// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ) * mod)
				),
				left : (pos.left// The absolute mouse position
				+ this.offset.relative.left * mod// Only for relative positioned nodes: Relative offset from element to offset parent
				+ this.offset.parent.left * mod// The offsetParent's offset without borders (offset + border)
				- ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ) * mod)
				)
			};

		},

		_generatePosition : function(event) {

			var o = this.options, scroll = this.cssPosition == 'absolute' && !(this.scrollParent[0] != document && $.ui.contains(this.scrollParent[0], this.offsetParent[0])) ? this.offsetParent : this.scrollParent, scrollIsRootNode = (/(html|body)/i).test(scroll[0].tagName);
			var pageX = event.pageX;
			var pageY = event.pageY;

			/*
			 * - Position constraining -
			 * Constrain the position to a mix of grid, containment.
			 */

			if (this.originalPosition) {//If we are not dragging yet, we won't check for options
				var containment;
				if (this.containment) {
					if (this.relative_container) {
						var co = this.relative_container.offset();
						containment = [this.containment[0] + co.left, this.containment[1] + co.top, this.containment[2] + co.left, this.containment[3] + co.top];
					} else {
						containment = this.containment;
					}

					if (event.pageX - this.offset.click.left < containment[0])
						pageX = containment[0] + this.offset.click.left;
					if (event.pageY - this.offset.click.top < containment[1])
						pageY = containment[1] + this.offset.click.top;
					if (event.pageX - this.offset.click.left > containment[2])
						pageX = containment[2] + this.offset.click.left;
					if (event.pageY - this.offset.click.top > containment[3])
						pageY = containment[3] + this.offset.click.top;
				}

				if (o.grid) {
					//Check for grid elements set to 0 to prevent divide by 0 error causing invalid argument errors in IE (see ticket #6950)
					var top = o.grid[1] ? this.originalPageY + Math.round((pageY - this.originalPageY) / o.grid[1]) * o.grid[1] : this.originalPageY;
					pageY = containment ? (!(top - this.offset.click.top < containment[1] || top - this.offset.click.top > containment[3]) ? top : (!(top - this.offset.click.top < containment[1]) ? top - o.grid[1] : top + o.grid[1])) : top;

					var left = o.grid[0] ? this.originalPageX + Math.round((pageX - this.originalPageX) / o.grid[0]) * o.grid[0] : this.originalPageX;
					pageX = containment ? (!(left - this.offset.click.left < containment[0] || left - this.offset.click.left > containment[2]) ? left : (!(left - this.offset.click.left < containment[0]) ? left - o.grid[0] : left + o.grid[0])) : left;
				}

			}

			return {
				top : (pageY// The absolute mouse position
				- this.offset.click.top// Click offset (relative to the element)
				- this.offset.relative.top// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.top// The offsetParent's offset without borders (offset +  border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollTop() : ( scrollIsRootNode ? 0 : scroll.scrollTop() ) ))
				),
				left : (pageX// The absolute mouse position
				- this.offset.click.left// Click offset (relative to the element)
				- this.offset.relative.left// Only for relative positioned nodes: Relative offset from element to offset parent
				- this.offset.parent.left// The offsetParent's offset without borders (offset +  border)
				+ ($.browser.safari && $.browser.version < 526 && this.cssPosition == 'fixed' ? 0 : (this.cssPosition == 'fixed' ? -this.scrollParent.scrollLeft() : scrollIsRootNode ? 0 : scroll.scrollLeft() ))
				)
			};

		},

		_clear : function() {
			this.helper.removeClass("ui-draggable-dragging");
			if (this.helper[0] != this.element[0] && !this.cancelHelperRemoval)
				this.helper.remove();
			//if($.ui.ddmanager) $.ui.ddmanager.current = null;
			this.helper = null;
			this.cancelHelperRemoval = false;
		},

		// From now on bulk stuff - mainly helpers

		_trigger : function(type, event, ui) {
			ui = ui || this._uiHash();
			$.ui.plugin.call(this, type, [event, ui]);
			if (type == "drag")
				this.positionAbs = this._convertPositionTo("absolute");
			//The absolute position has to be recalculated after plugins
			return $.Widget.prototype._trigger.call(this, type, event, ui);
		},

		plugins : {},

		_uiHash : function(event) {
			return {
				helper : this.helper,
				position : this.position,
				originalPosition : this.originalPosition,
				offset : this.positionAbs
			};
		}
	});

	$.extend($.ui.draggable, {
		version : "@VERSION"
	});

	$.ui.plugin.add("draggable", "connectToSortable", {
		start : function(event, ui) {

			var inst = $(this).data("draggable"), o = inst.options, uiSortable = $.extend({}, ui, {
				item : inst.element
			});
			inst.sortables = [];
			$(o.connectToSortable).each(function() {
				var sortable = $.data(this, 'sortable');
				if (sortable && !sortable.options.disabled) {
					inst.sortables.push({
						instance : sortable,
						shouldRevert : sortable.options.revert
					});
					sortable.refreshPositions();
					// Call the sortable's refreshPositions at drag start to refresh the containerCache since the sortable container cache is used in drag and needs to be up to date (this will ensure it's initialised as well as being kept in step with any changes that might have happened on the page).
					sortable._trigger("activate", event, uiSortable);
				}
			});

		},
		stop : function(event, ui) {

			//If we are still over the sortable, we fake the stop event of the sortable, but also remove helper
			var inst = $(this).data("draggable"), uiSortable = $.extend({}, ui, {
				item : inst.element
			});

			$.each(inst.sortables, function() {
				if (this.instance.isOver) {

					this.instance.isOver = 0;

					inst.cancelHelperRemoval = true;
					//Don't remove the helper in the draggable instance
					this.instance.cancelHelperRemoval = false;
					//Remove it in the sortable instance (so sortable plugins like revert still work)

					//The sortable revert is supported, and we have to set a temporary dropped variable on the draggable to support revert: 'valid/invalid'
					if (this.shouldRevert)
						this.instance.options.revert = true;

					//Trigger the stop of the sortable
					this.instance._mouseStop(event);

					this.instance.options.helper = this.instance.options._helper;

					//If the helper has been the original item, restore properties in the sortable
					if (inst.options.helper == 'original')
						this.instance.currentItem.css({
							top : 'auto',
							left : 'auto'
						});

				} else {
					this.instance.cancelHelperRemoval = false;
					//Remove the helper in the sortable instance
					this.instance._trigger("deactivate", event, uiSortable);
				}

			});

		},
		drag : function(event, ui) {

			var inst = $(this).data("draggable"), self = this;

			var checkPos = function(o) {
				var dyClick = this.offset.click.top, dxClick = this.offset.click.left;
				var helperTop = this.positionAbs.top, helperLeft = this.positionAbs.left;
				var itemHeight = o.height, itemWidth = o.width;
				var itemTop = o.top, itemLeft = o.left;

				return $.ui.isOver(helperTop + dyClick, helperLeft + dxClick, itemTop, itemLeft, itemHeight, itemWidth);
			};

			$.each(inst.sortables, function(i) {

				//Copy over some variables to allow calling the sortable's native _intersectsWith
				this.instance.positionAbs = inst.positionAbs;
				this.instance.helperProportions = inst.helperProportions;
				this.instance.offset.click = inst.offset.click;

				if (this.instance._intersectsWith(this.instance.containerCache)) {

					//If it intersects, we use a little isOver variable and set it once, so our move-in stuff gets fired only once
					if (!this.instance.isOver) {

						this.instance.isOver = 1;
						//Now we fake the start of dragging for the sortable instance,
						//by cloning the list group item, appending it to the sortable and using it as inst.currentItem
						//We can then fire the start event of the sortable with our passed browser event, and our own helper (so it doesn't create a new one)
						this.instance.currentItem = $(self).clone().removeAttr('id').appendTo(this.instance.element).data("sortable-item", true);
						this.instance.options._helper = this.instance.options.helper;
						//Store helper option to later restore it
						this.instance.options.helper = function() {
							return ui.helper[0];
						};

						event.target = this.instance.currentItem[0];
						this.instance._mouseCapture(event, true);
						this.instance._mouseStart(event, true, true);

						//Because the browser event is way off the new appended portlet, we modify a couple of variables to reflect the changes
						this.instance.offset.click.top = inst.offset.click.top;
						this.instance.offset.click.left = inst.offset.click.left;
						this.instance.offset.parent.left -= inst.offset.parent.left - this.instance.offset.parent.left;
						this.instance.offset.parent.top -= inst.offset.parent.top - this.instance.offset.parent.top;

						inst._trigger("toSortable", event);
						inst.dropped = this.instance.element;
						//draggable revert needs that
						//hack so receive/update callbacks work (mostly)
						inst.currentItem = inst.element;
						this.instance.fromOutside = inst;

					}

					//Provided we did all the previous steps, we can fire the drag event of the sortable on every draggable drag, when it intersects with the sortable
					if (this.instance.currentItem)
						this.instance._mouseDrag(event);

				} else {

					//If it doesn't intersect with the sortable, and it intersected before,
					//we fake the drag stop of the sortable, but make sure it doesn't remove the helper by using cancelHelperRemoval
					if (this.instance.isOver) {

						this.instance.isOver = 0;
						this.instance.cancelHelperRemoval = true;

						//Prevent reverting on this forced stop
						this.instance.options.revert = false;

						// The out event needs to be triggered independently
						this.instance._trigger('out', event, this.instance._uiHash(this.instance));

						this.instance._mouseStop(event, true);
						this.instance.options.helper = this.instance.options._helper;

						//Now we remove our currentItem, the list group clone again, and the placeholder, and animate the helper back to it's original size
						this.instance.currentItem.remove();
						if (this.instance.placeholder)
							this.instance.placeholder.remove();

						inst._trigger("fromSortable", event);
						inst.dropped = false;
						//draggable revert needs that
					}

				};

			});

		}
	});

	$.ui.plugin.add("draggable", "cursor", {
		start : function(event, ui) {
			var t = $('body'), o = $(this).data('draggable').options;
			if (t.css("cursor"))
				o._cursor = t.css("cursor");
			t.css("cursor", o.cursor);
		},
		stop : function(event, ui) {
			var o = $(this).data('draggable').options;
			if (o._cursor)
				$('body').css("cursor", o._cursor);
		}
	});

	$.ui.plugin.add("draggable", "opacity", {
		start : function(event, ui) {
			var t = $(ui.helper), o = $(this).data('draggable').options;
			if (t.css("opacity"))
				o._opacity = t.css("opacity");
			t.css('opacity', o.opacity);
		},
		stop : function(event, ui) {
			var o = $(this).data('draggable').options;
			if (o._opacity)
				$(ui.helper).css('opacity', o._opacity);
		}
	});

	$.ui.plugin.add("draggable", "scroll", {
		start : function(event, ui) {
			var i = $(this).data("draggable");
			if (i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML')
				i.overflowOffset = i.scrollParent.offset();
		},
		drag : function(event, ui) {

			var i = $(this).data("draggable"), o = i.options, scrolled = false;

			if (i.scrollParent[0] != document && i.scrollParent[0].tagName != 'HTML') {

				if (!o.axis || o.axis != 'x') {
					if ((i.overflowOffset.top + i.scrollParent[0].offsetHeight) - event.pageY < o.scrollSensitivity)
						i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop + o.scrollSpeed;
					else if (event.pageY - i.overflowOffset.top < o.scrollSensitivity)
						i.scrollParent[0].scrollTop = scrolled = i.scrollParent[0].scrollTop - o.scrollSpeed;
				}

				if (!o.axis || o.axis != 'y') {
					if ((i.overflowOffset.left + i.scrollParent[0].offsetWidth) - event.pageX < o.scrollSensitivity)
						i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft + o.scrollSpeed;
					else if (event.pageX - i.overflowOffset.left < o.scrollSensitivity)
						i.scrollParent[0].scrollLeft = scrolled = i.scrollParent[0].scrollLeft - o.scrollSpeed;
				}

			} else {

				if (!o.axis || o.axis != 'x') {
					if (event.pageY - $(document).scrollTop() < o.scrollSensitivity)
						scrolled = $(document).scrollTop($(document).scrollTop() - o.scrollSpeed);
					else if ($(window).height() - (event.pageY - $(document).scrollTop()) < o.scrollSensitivity)
						scrolled = $(document).scrollTop($(document).scrollTop() + o.scrollSpeed);
				}

				if (!o.axis || o.axis != 'y') {
					if (event.pageX - $(document).scrollLeft() < o.scrollSensitivity)
						scrolled = $(document).scrollLeft($(document).scrollLeft() - o.scrollSpeed);
					else if ($(window).width() - (event.pageX - $(document).scrollLeft()) < o.scrollSensitivity)
						scrolled = $(document).scrollLeft($(document).scrollLeft() + o.scrollSpeed);
				}

			}

			if (scrolled !== false && $.ui.ddmanager && !o.dropBehaviour)
				$.ui.ddmanager.prepareOffsets(i, event);

		}
	});

	$.ui.plugin.add("draggable", "snap", {
		start : function(event, ui) {

			var i = $(this).data("draggable"), o = i.options;
			i.snapElements = [];

			$(o.snap.constructor != String ? (o.snap.items || ':data(draggable)' ) : o.snap).each(function() {
				var $t = $(this);
				var $o = $t.offset();
				if (this != i.element[0])
					i.snapElements.push({
						item : this,
						width : $t.outerWidth(),
						height : $t.outerHeight(),
						top : $o.top,
						left : $o.left
					});
			});

		},
		drag : function(event, ui) {

			var inst = $(this).data("draggable"), o = inst.options;
			var d = o.snapTolerance;

			var x1 = ui.offset.left, x2 = x1 + inst.helperProportions.width, y1 = ui.offset.top, y2 = y1 + inst.helperProportions.height;

			for (var i = inst.snapElements.length - 1; i >= 0; i--) {

				var l = inst.snapElements[i].left, r = l + inst.snapElements[i].width, t = inst.snapElements[i].top, b = t + inst.snapElements[i].height;

				//Yes, I know, this is insane ;)
				if (!((l - d < x1 && x1 < r + d && t - d < y1 && y1 < b + d) || (l - d < x1 && x1 < r + d && t - d < y2 && y2 < b + d) || (l - d < x2 && x2 < r + d && t - d < y1 && y1 < b + d) || (l - d < x2 && x2 < r + d && t - d < y2 && y2 < b + d))) {
					if (inst.snapElements[i].snapping)
						(inst.options.snap.release && inst.options.snap.release.call(inst.element, event, $.extend(inst._uiHash(), {
							snapItem : inst.snapElements[i].item
						})));
					inst.snapElements[i].snapping = false;
					continue;
				}

				if (o.snapMode != 'inner') {
					var ts = Math.abs(t - y2) <= d;
					var bs = Math.abs(b - y1) <= d;
					var ls = Math.abs(l - x2) <= d;
					var rs = Math.abs(r - x1) <= d;
					if (ts)
						ui.position.top = inst._convertPositionTo("relative", {
							top : t - inst.helperProportions.height,
							left : 0
						}).top - inst.margins.top;
					if (bs)
						ui.position.top = inst._convertPositionTo("relative", {
							top : b,
							left : 0
						}).top - inst.margins.top;
					if (ls)
						ui.position.left = inst._convertPositionTo("relative", {
							top : 0,
							left : l - inst.helperProportions.width
						}).left - inst.margins.left;
					if (rs)
						ui.position.left = inst._convertPositionTo("relative", {
							top : 0,
							left : r
						}).left - inst.margins.left;
				}

				var first = (ts || bs || ls || rs);

				if (o.snapMode != 'outer') {
					var ts = Math.abs(t - y1) <= d;
					var bs = Math.abs(b - y2) <= d;
					var ls = Math.abs(l - x1) <= d;
					var rs = Math.abs(r - x2) <= d;
					if (ts)
						ui.position.top = inst._convertPositionTo("relative", {
							top : t,
							left : 0
						}).top - inst.margins.top;
					if (bs)
						ui.position.top = inst._convertPositionTo("relative", {
							top : b - inst.helperProportions.height,
							left : 0
						}).top - inst.margins.top;
					if (ls)
						ui.position.left = inst._convertPositionTo("relative", {
							top : 0,
							left : l
						}).left - inst.margins.left;
					if (rs)
						ui.position.left = inst._convertPositionTo("relative", {
							top : 0,
							left : r - inst.helperProportions.width
						}).left - inst.margins.left;
				}

				if (!inst.snapElements[i].snapping && (ts || bs || ls || rs || first))
					(inst.options.snap.snap && inst.options.snap.snap.call(inst.element, event, $.extend(inst._uiHash(), {
						snapItem : inst.snapElements[i].item
					})));
				inst.snapElements[i].snapping = (ts || bs || ls || rs || first);

			};

		}
	});

	$.ui.plugin.add("draggable", "stack", {
		start : function(event, ui) {

			var o = $(this).data("draggable").options;

			var group = $.makeArray($(o.stack)).sort(function(a, b) {
				return (parseInt($(a).css("zIndex"), 10) || 0) - (parseInt($(b).css("zIndex"), 10) || 0);
			});
			if (!group.length) {
				return;
			}

			var min = parseInt(group[0].style.zIndex) || 0;
			$(group).each(function(i) {
				this.style.zIndex = min + i;
			});

			this[0].style.zIndex = min + group.length;

		}
	});

	$.ui.plugin.add("draggable", "zIndex", {
		start : function(event, ui) {
			var t = $(ui.helper), o = $(this).data("draggable").options;
			if (t.css("zIndex"))
				o._zIndex = t.css("zIndex");
			t.css('zIndex', o.zIndex);
		},
		stop : function(event, ui) {
			var o = $(this).data("draggable").options;
			if (o._zIndex)
				$(ui.helper).css('zIndex', o._zIndex);
		}
	});

})(jQuery);
/*
 * jQuery UI Droppable @VERSION
 *
 * Copyright 2011, AUTHORS.txt (http://jqueryui.com/about)
 * Dual licensed under the MIT or GPL Version 2 licenses.
 * http://jquery.org/license
 *
 * http://docs.jquery.com/UI/Droppables
 *
 * Depends:
 *	jquery.ui.core.js
 *	jquery.ui.widget.js
 *	jquery.ui.mouse.js
 *	jquery.ui.draggable.js
 */
(function($, undefined) {

	$.widget("ui.droppable", {
		widgetEventPrefix : "drop",
		options : {
			accept : '*',
			activeClass : false,
			addClasses : true,
			greedy : false,
			hoverClass : false,
			scope : 'default',
			tolerance : 'intersect'
		},
		_create : function() {

			var o = this.options, accept = o.accept;
			this.isover = 0;
			this.isout = 1;

			this.accept = $.isFunction(accept) ? accept : function(d) {
				return d.is(accept);
			};

			//Store the droppable's proportions
			this.proportions = {
				width : this.element[0].offsetWidth,
				height : this.element[0].offsetHeight
			};

			// Add the reference and positions to the manager
			$.ui.ddmanager.droppables[o.scope] = $.ui.ddmanager.droppables[o.scope] || [];
			$.ui.ddmanager.droppables[o.scope].push(this); (o.addClasses && this.element.addClass("ui-droppable"));

		},

		destroy : function() {
			var drop = $.ui.ddmanager.droppables[this.options.scope];
			for (var i = 0; i < drop.length; i++)
				if (drop[i] == this)
					drop.splice(i, 1);

			this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable");

			return this;
		},

		_setOption : function(key, value) {

			if (key == 'accept') {
				this.accept = $.isFunction(value) ? value : function(d) {
					return d.is(value);
				};
			}
			$.Widget.prototype._setOption.apply(this, arguments);
		},

		_activate : function(event) {
			var draggable = $.ui.ddmanager.current;
			if (this.options.activeClass)
				this.element.addClass(this.options.activeClass);
			(draggable && this._trigger('activate', event, this.ui(draggable)));
		},

		_deactivate : function(event) {
			var draggable = $.ui.ddmanager.current;
			if (this.options.activeClass)
				this.element.removeClass(this.options.activeClass);
			(draggable && this._trigger('deactivate', event, this.ui(draggable)));
		},

		_over : function(event) {

			var draggable = $.ui.ddmanager.current;
			if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0])
				return;
			// Bail if draggable and droppable are same element

			if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
				if (this.options.hoverClass)
					this.element.addClass(this.options.hoverClass);
				this._trigger('over', event, this.ui(draggable));
			}

		},

		_out : function(event) {

			var draggable = $.ui.ddmanager.current;
			if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0])
				return;
			// Bail if draggable and droppable are same element

			if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
				if (this.options.hoverClass)
					this.element.removeClass(this.options.hoverClass);
				this._trigger('out', event, this.ui(draggable));
			}

		},

		_drop : function(event, custom) {

			var draggable = custom || $.ui.ddmanager.current;
			if (!draggable || (draggable.currentItem || draggable.element)[0] == this.element[0])
				return false;
			// Bail if draggable and droppable are same element

			var childrenIntersection = false;
			this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function() {
				var inst = $.data(this, 'droppable');
				if (inst.options.greedy && !inst.options.disabled && inst.options.scope == draggable.options.scope && inst.accept.call(inst.element[0], (draggable.currentItem || draggable.element)) && $.ui.intersect(draggable, $.extend(inst, {
					offset : inst.element.offset()
				}), inst.options.tolerance)) {
					childrenIntersection = true;
					return false;
				}
			});
			if (childrenIntersection)
				return false;

			if (this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
				if (this.options.activeClass)
					this.element.removeClass(this.options.activeClass);
				if (this.options.hoverClass)
					this.element.removeClass(this.options.hoverClass);
				this._trigger('drop', event, this.ui(draggable));
				return this.element;
			}

			return false;

		},

		ui : function(c) {
			return {
				draggable : (c.currentItem || c.element),
				helper : c.helper,
				position : c.position,
				offset : c.positionAbs
			};
		}
	});

	$.extend($.ui.droppable, {
		version : "@VERSION"
	});

	$.ui.intersect = function(draggable, droppable, toleranceMode) {

		if (!droppable.offset)
			return false;

		var x1 = (draggable.positionAbs || draggable.position.absolute).left, x2 = x1 + draggable.helperProportions.width, y1 = (draggable.positionAbs || draggable.position.absolute).top, y2 = y1 + draggable.helperProportions.height;
		var l = droppable.offset.left, r = l + droppable.proportions.width, t = droppable.offset.top, b = t + droppable.proportions.height;

		switch (toleranceMode) {
			case 'fit':
				return (l <= x1 && x2 <= r && t <= y1 && y2 <= b);
				break;
			case 'intersect':
				return (l < x1 + (draggable.helperProportions.width / 2)// Right Half
				&& x2 - (draggable.helperProportions.width / 2) < r// Left Half
				&& t < y1 + (draggable.helperProportions.height / 2)// Bottom Half
				&& y2 - (draggable.helperProportions.height / 2) < b );
				// Top Half
				break;
			case 'pointer':
				var draggableLeft = ((draggable.positionAbs || draggable.position.absolute).left + (draggable.clickOffset || draggable.offset.click).left), draggableTop = ((draggable.positionAbs || draggable.position.absolute).top + (draggable.clickOffset || draggable.offset.click).top), isOver = $.ui.isOver(draggableTop, draggableLeft, t, l, droppable.proportions.height, droppable.proportions.width);
				return isOver;
				break;
			case 'touch':
				return ((y1 >= t && y1 <= b) || // Top edge touching
				(y2 >= t && y2 <= b) || // Bottom edge touching
				(y1 < t && y2 > b)	// Surrounded vertically
				) && ((x1 >= l && x1 <= r) || // Left edge touching
				(x2 >= l && x2 <= r) || // Right edge touching
				(x1 < l && x2 > r)	// Surrounded horizontally
				);
				break;
			default:
				return false;
				break;
		}

	};

	/*
	 This manager tracks offsets of draggables and droppables
	 */
	$.ui.ddmanager = {
		current : null,
		droppables : {
			'default' : []
		},
		prepareOffsets : function(t, event) {

			var m = $.ui.ddmanager.droppables[t.options.scope] || [];
			var type = event ? event.type : null;
			// workaround for #2317
			var list = (t.currentItem || t.element).find(":data(droppable)").andSelf(); droppablesLoop:
			for (var i = 0; i < m.length; i++) {

				if (m[i].options.disabled || (t && !m[i].accept.call(m[i].element[0], (t.currentItem || t.element))))
					continue;
				//No disabled and non-accepted
				for (var j = 0; j < list.length; j++) {
					if (list[j] == m[i].element[0]) {
						m[i].proportions.height = 0;
						continue droppablesLoop;
					}
				};//Filter out elements in the current dragged item
				m[i].visible = m[i].element.css("display") != "none";
				if (!m[i].visible)
					continue;
				//If the element is not visible, continue

				if (type == "mousedown")
					m[i]._activate.call(m[i], event);
				//Activate the droppable if used directly from draggables

				m[i].offset = m[i].element.offset();
				m[i].proportions = {
					width : m[i].element[0].offsetWidth,
					height : m[i].element[0].offsetHeight
				};

			}

		},
		drop : function(draggable, event) {

			var dropped = false;
			$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

				if (!this.options)
					return;
				if (!this.options.disabled && this.visible && $.ui.intersect(draggable, this, this.options.tolerance))
					dropped = this._drop.call(this, event) || dropped;

				if (!this.options.disabled && this.visible && this.accept.call(this.element[0], (draggable.currentItem || draggable.element))) {
					this.isout = 1;
					this.isover = 0;
					this._deactivate.call(this, event);
				}

			});
			return dropped;

		},
		dragStart : function(draggable, event) {
			//Listen for scrolling so that if the dragging causes scrolling the position of the droppables can be recalculated (see #5003)
			draggable.element.parents(":not(body,html)").bind("scroll.droppable", function() {
				if (!draggable.options.refreshPositions)
					$.ui.ddmanager.prepareOffsets(draggable, event);
			});
		},
		drag : function(draggable, event) {

			//If you have a highly dynamic page, you might try this option. It renders positions every time you move the mouse.
			if (draggable.options.refreshPositions)
				$.ui.ddmanager.prepareOffsets(draggable, event);

			//Run through all droppables and check their positions based on specific tolerance options
			$.each($.ui.ddmanager.droppables[draggable.options.scope] || [], function() {

				if (this.options.disabled || this.greedyChild || !this.visible)
					return;
				var intersects = $.ui.intersect(draggable, this, this.options.tolerance);

				var c = !intersects && this.isover == 1 ? 'isout' : (intersects && this.isover == 0 ? 'isover' : null);
				if (!c)
					return;

				var parentInstance;
				if (this.options.greedy) {
					var parent = this.element.parents(':data(droppable):eq(0)');
					if (parent.length) {
						parentInstance = $.data(parent[0], 'droppable');
						parentInstance.greedyChild = (c == 'isover' ? 1 : 0);
					}
				}

				// we just moved into a greedy child
				if (parentInstance && c == 'isover') {
					parentInstance['isover'] = 0;
					parentInstance['isout'] = 1;
					parentInstance._out.call(parentInstance, event);
				}

				this[c] = 1;
				this[c == 'isout' ? 'isover' : 'isout'] = 0;
				this[c == "isover" ? "_over" : "_out"].call(this, event);

				// we just moved out of a greedy child
				if (parentInstance && c == 'isout') {
					parentInstance['isout'] = 0;
					parentInstance['isover'] = 1;
					parentInstance._over.call(parentInstance, event);
				}
			});

		},
		dragStop : function(draggable, event) {
			draggable.element.parents(":not(body,html)").unbind("scroll.droppable");
			//Call prepareOffsets one final time since IE does not fire return scroll events when overflow was caused by drag (see #5003)
			if (!draggable.options.refreshPositions)
				$.ui.ddmanager.prepareOffsets(draggable, event);
		}
	};

})(jQuery);
/*
 * jQuery JSON Plugin
 * version: 2.1 (2009-08-14)
 *
 * This document is licensed as free software under the terms of the
 * MIT License: http://www.opensource.org/licenses/mit-license.php
 *
 * Brantley Harris wrote this plugin. It is based somewhat on the JSON.org
 * website's http://www.json.org/json2.js, which proclaims:
 * "NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.", a sentiment that
 * I uphold.
 *
 * It is also influenced heavily by MochiKit's serializeJSON, which is
 * copyrighted 2005 by Bob Ippolito.
 */

(function($) {
	/** jQuery.toJSON( json-serializble )
	 Converts the given argument into a JSON respresentation.

	 If an object has a "toJSON" function, that will be used to get the representation.
	 Non-integer/string keys are skipped in the object, as are keys that point to a function.

	 json-serializble:
	 The *thing* to be converted.
	 **/
	$.toJSON = function(o) {
		if ( typeof (JSON) == 'object' && JSON.stringify)
			return JSON.stringify(o);

		var type = typeof (o);

		if (o === null)
			return "null";

		if (type == "undefined")
			return undefined;

		if (type == "number" || type == "boolean")
			return o + "";

		if (type == "string")
			return $.quoteString(o);

		if (type == 'object') {
			if ( typeof o.toJSON == "function")
				return $.toJSON(o.toJSON());

			if (o.constructor === Date) {
				var month = o.getUTCMonth() + 1;
				if (month < 10)
					month = '0' + month;

				var day = o.getUTCDate();
				if (day < 10)
					day = '0' + day;

				var year = o.getUTCFullYear();

				var hours = o.getUTCHours();
				if (hours < 10)
					hours = '0' + hours;

				var minutes = o.getUTCMinutes();
				if (minutes < 10)
					minutes = '0' + minutes;

				var seconds = o.getUTCSeconds();
				if (seconds < 10)
					seconds = '0' + seconds;

				var milli = o.getUTCMilliseconds();
				if (milli < 100)
					milli = '0' + milli;
				if (milli < 10)
					milli = '0' + milli;

				return '"' + year + '-' + month + '-' + day + 'T' + hours + ':' + minutes + ':' + seconds + '.' + milli + 'Z"';
			}

			if (o.constructor === Array) {
				var ret = [];
				for (var i = 0; i < o.length; i++)
					ret.push($.toJSON(o[i]) || "null");

				return "[" + ret.join(",") + "]";
			}

			var pairs = [];
			for (var k in o) {
				var name;
				var type = typeof k;

				if (type == "number")
					name = '"' + k + '"';
				else if (type == "string")
					name = $.quoteString(k);
				else
					continue;
				//skip non-string or number keys

				if ( typeof o[k] == "function")
					continue;
				//skip pairs where the value is a function.

				var val = $.toJSON(o[k]);

				pairs.push(name + ":" + val);
			}

			return "{" + pairs.join(", ") + "}";
		}
	};

	/** jQuery.evalJSON(src)
	 Evaluates a given piece of json source.
	 **/
	$.evalJSON = function(src) {
		if ( typeof (JSON) == 'object' && JSON.parse)
			return JSON.parse(src);
		return eval("(" + src + ")");
	};

	/** jQuery.secureEvalJSON(src)
	 Evals JSON in a way that is *more* secure.
	 **/
	$.secureEvalJSON = function(src) {
		if ( typeof (JSON) == 'object' && JSON.parse)
			return JSON.parse(src);

		var filtered = src;
		filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
		filtered = filtered.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
		filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

		if (/^[\],:{}\s]*$/.test(filtered))
			return eval("(" + src + ")");
		else
			throw new SyntaxError("Error parsing JSON, source is not valid.");
	};

	/** jQuery.quoteString(string)
	 Returns a string-repr of a string, escaping quotes intelligently.
	 Mostly a support function for toJSON.

	 Examples:
	 >>> jQuery.quoteString("apple")
	 "apple"

	 >>> jQuery.quoteString('"Where are we going?", she asked.')
	 "\"Where are we going?\", she asked."
	 **/
	$.quoteString = function(string) {
		if (string.match(_escapeable)) {
			return '"' + string.replace(_escapeable, function(a) {
				var c = _meta[a];
				if ( typeof c === 'string')
					return c;
				c = a.charCodeAt();
				return '\\u00' + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
			}) + '"';
		}
		return '"' + string + '"';
	};

	var _escapeable = /["\\\x00-\x1f\x7f-\x9f]/g;

	var _meta = {
		'\b' : '\\b',
		'\t' : '\\t',
		'\n' : '\\n',
		'\f' : '\\f',
		'\r' : '\\r',
		'"' : '\\"',
		'\\' : '\\\\'
	};
})(jQuery);
/*jslint browser: true */ /*global jQuery: true */

/**
 * jQuery Cookie plugin
 *
 * Copyright (c) 2010 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 *
 */

// TODO JsDoc

/**
 * Create a cookie with the given key and value and other optional parameters.
 *
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Set the value of a cookie.
 * @example $.cookie('the_cookie', 'the_value', { expires: 7, path: '/', domain: 'jquery.com', secure: true });
 * @desc Create a cookie with all available options.
 * @example $.cookie('the_cookie', 'the_value');
 * @desc Create a session cookie.
 * @example $.cookie('the_cookie', null);
 * @desc Delete a cookie by passing null as value. Keep in mind that you have to use the same path and domain
 *       used when the cookie was set.
 *
 * @param String key The key of the cookie.
 * @param String value The value of the cookie.
 * @param Object options An object literal containing key/value pairs to provide optional cookie attributes.
 * @option Number|Date expires Either an integer specifying the expiration date from now on in days or a Date object.
 *                             If a negative value is specified (e.g. a date in the past), the cookie will be deleted.
 *                             If set to null or omitted, the cookie will be a session cookie and will not be retained
 *                             when the the browser exits.
 * @option String path The value of the path atribute of the cookie (default: path of page that created the cookie).
 * @option String domain The value of the domain attribute of the cookie (default: domain of page that created the cookie).
 * @option Boolean secure If true, the secure attribute of the cookie will be set and the cookie transmission will
 *                        require a secure protocol (like HTTPS).
 * @type undefined
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */

/**
 * Get the value of a cookie with the given key.
 *
 * @example $.cookie('the_cookie');
 * @desc Get the value of a cookie.
 *
 * @param String key The key of the cookie.
 * @return The value of the cookie.
 * @type String
 *
 * @name $.cookie
 * @cat Plugins/Cookie
 * @author Klaus Hartl/klaus.hartl@stilbuero.de
 */
jQuery.cookie = function(key, value, options) {

	// key and at least value given, set cookie...
	if (arguments.length > 1 && String(value) !== "[object Object]") {
		options = jQuery.extend({}, options);

		if (value === null || value === undefined) {
			options.expires = -1;
		}

		if ( typeof options.expires === 'number') {
			var days = options.expires, t = options.expires = new Date();
			t.setDate(t.getDate() + days);
		}

		value = String(value);

		return (document.cookie = [encodeURIComponent(key), '=', options.raw ? value : encodeURIComponent(value), options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
		options.path ? '; path=' + options.path : '', options.domain ? '; domain=' + options.domain : '', options.secure ? '; secure' : ''].join(''));
	}

	// key and possibly options given, get cookie...
	options = value || {};
	var result, decode = options.raw ? function(s) {
		return s;
	} : decodeURIComponent;
	return ( result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie)) ? decode(result[1]) : null;
};
/*
 * getStyleObject Plugin for jQuery JavaScript Library
 * From: http://upshots.org/?p=112
 *
 * Copyright: Unknown, see source link
 * Plugin version by Dakota Schneider (http://hackthetruth.org)
 */

(function($) {
	$.fn.getStyleObject = function() {
		var dom = this.get(0);
		var style;
		var returns = {};
		if (window.getComputedStyle) {
			var camelize = function(a, b) {
				return b.toUpperCase();
			};
			style = window.getComputedStyle(dom, null);
			for (var i = 0; i < style.length; i++) {
				var prop = style[i];
				var camel = prop.replace(/\-([a-z])/g, camelize);
				var val = style.getPropertyValue(prop);
				returns[camel] = val;
			}
			return returns;
		}
		if (dom.currentStyle) {
			style = dom.currentStyle;
			for (var prop in style) {
				returns[prop] = style[prop];
			}
			return returns;
		}
		return this.css();
	};
})(jQuery);
(function() {
	$.fn.silentCss = $.fn.css;
	$.fn.css = function() {
		var result = $.fn.silentCss.apply(this, arguments);
		if (arguments.length >= 2) {
			$(this).trigger('stylechange', arguments[0], arguments[1]);
		}
		return result;
	};
})();
function is_array(input) {
	return typeof (input) == 'object' && ( input instanceof Array);
}

(function() {
	var initializing = false, fnTest = /xyz/.test(function() { xyz;
	}) ? /\b_super\b/ : /.*/;

	/**
	 * This class is abstracted and should not be used by developers
	 * @class Base class for all JOO objects.
	 */
	this.Class = function() {
	};

	/**
	 * Extends the current class with new methods & fields
	 * @param {Object} prop additional methods & fields to be included in new class
	 * @static
	 * @returns {Class} new class
	 */
	Class.extend = function(prop) {
		if ( typeof updateTracker != 'undefined')
			updateTracker(1);
		var _super = this.prototype;

		// Instantiate a base class (but only create the instance,
		// don't run the init constructor)
		initializing = true;
		var prototype = new this();
		initializing = false;
		prototype.currentClass = this;
		prototype.ancestors = Array();
		if (this.prototype.ancestors) {
			for (var i in this.prototype.ancestors) {
				prototype.ancestors.push(this.prototype.ancestors[i]);
			}
		}
		prototype.ancestors.push(this);
		// Copy the properties over onto the new prototype
		for (var name in prop) {
			// Check if we're overwriting an existing function
			prototype[name] = typeof prop[name] == "function" && typeof _super[name] == "function" && fnTest.test(prop[name]) ? (function(name, fn) {
				return function() {
					var tmp = this._super;

					// Add a new ._super() method that is the same method
					// but on the super-class
					this._super = _super[name];

					// The method only need to be bound temporarily, so we
					// remove it when we're done executing
					var ret = fn.apply(this, arguments);
					this._super = tmp;

					return ret;
				};
			})(name, prop[name]) : prop[name];
		}

		/**
		 * Implements the current class with a set of interfaces
		 * @param {InterfaceImplementor...} interfaces a set of interfaces to be implemented
		 * @static
		 * @returns {Class} current class
		 */
		Class.implement = function() {
			for(var i=0;i<arguments.length;i++) {
				var impl = new arguments[i]();
				impl.implement(Class);
	    	}
	    	return Class;
		};

		function Class() {
			// All construction is actually done in the init method
			if (!initializing && this.init) {
				this.init.apply(this, arguments);
				if ( typeof updateTracker != 'undefined')
					updateTracker(this.tracker || 5, true);
			}
		}

		// Populate our constructed prototype object
		Class.prototype = prototype;

		// Enforce the constructor to be what we expect
		Class.constructor = Class;

		// And make this class extendable
		Class.extend = arguments.callee;

		return Class;
	};
})();
SystemProperty = Class.extend(
/** @lends SystemProperty# */
{

	/**
	 * Initialize properties.
	 * @class A class to store system-wide properties
	 * @augments Class
	 * @constructs
	 */
	init : function() {
		this.properties = Array();
	},

	/**
	 * Retrieve the value of a property.
	 * @param {String} property the name of the property to retrieve
	 * @param {Object} defaultValue the default value, used if the property is not found
	 * @returns {mixed} the property value, or the default value or undefined
	 */
	get : function(property, defaultValue) {
		var cookieValue = undefined;
		if ( typeof $ != 'undefined' && typeof $.fn.cookie != 'undefined')
			cookieValue = $.cookie(property);
		if (cookieValue != undefined) {
			return cookieValue;
		} else if (this.properties[property] != undefined) {
			return this.properties[property];
		} else {
			return defaultValue;
		}
	},

	/**
	 * Store the value of a property.
	 * @param {String} property the name of the property to store
	 * @param {Object} value the new value
	 * @param {Boolean} persistent should the property be stored in cookie for future use
	 */
	set : function(property, value, persistent) {
		if (!persistent) {
			this.properties[property] = value;
		} else {
			$.cookie(property, value, {
				expires : 1
			});
		}
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent("SystemPropertyChanged", property);
	},

	toString : function() {
		return "SystemProperty";
	}
});

ResourceManager = Class.extend(
/** @lends ResourceManager# */
{
	/**
	 * Initialize resource locators.
	 * @class Manage resource using the underlying resource locator
	 * @augments Class
	 * @constructs
	 */
	init : function() {
		this.resourceLocator = new JQueryResourceLocator();
		this.caches = {};
	},

	/**
	 * Change the current resource locator.
	 * @param {ResourceLocator} locator the resource locator to be used
	 */
	setResourceLocator : function(locator) {
		this.resourceLocator = locator;
	},

	/**
	 * Get the current resource locator.
	 * @returns {ResourceLocator} the current resource locator
	 */
	getResourceLocator : function(locator) {
		return this.resourceLocator;
	},

	/**
	 * Ask the underlying resource locator for a specific resource
	 * @param {String} type used as a namespace to distinct different resources with the same name
	 * @param {String} name the name of the resource
	 * @param {ResourceLocator} resourceLocator Optional. The resource locator to be used in the current request
	 * @param {Boolean} cache Optional. Should the resource be cached for further use
	 * @returns {Resource} the located resource
	 */
	requestForResource : function(type, name, resourceLocator, cache) {
		if (type != undefined)
			name = type + "-" + name;

		if (cache && this.caches[name]) {
			//			console.log('cache hit: '+name);
			return this.caches[name];
		}

		var rl = resourceLocator || this.resourceLocator;
		var res = rl.locateResource(name);
		if (cache)
			this.caches[name] = res;
		return res;
	},

	/**
	 * Ask the underlying resource locator for a custom resource
	 * @param {String} customSelector the selector used to retrieve the resource, depending on underlying the resource locator
	 * @param {Resource} resourceLocator Optional. The resource locator to be used in the current request
	 * @returns {Resource} the located resource
	 */
	requestForCustomResource : function(customSelector, resourceLocator) {
		if (resourceLocator != undefined) {
			return resourceLocator.locateResource(customSelector);
		}
		return this.resourceLocator.locateCustomResource(customSelector);
	},

	toString : function() {
		return "ResourceManager";
	}
});

/**
 * @class Locate resource
 * @augments Class
 */
ResourceLocator = Class.extend(
/** @lends ResourceLocator# */
{

	/**
	 * Locate a resource based on its ID.
	 * By default, this function do nothing
	 * @param {String} resourceID the resource ID
	 */
	locateResource : function(resourceID) {

	}
});

/**
 * Create a new XuiResourceLocator
 * @class A simple resource locator which using xui.js library
 * @augments ResourceLocator
 */
XuiResourceLocator = ResourceLocator.extend(
/** @lends XuiResourceLocator# */
{
	locateResource : function(id) {
		if (JOOUtils.isTag(id))
			return x$(id);
		//		if (x$('#'+id).length > 0)	{
		return x$('#' + id);
		//		}
		//		return undefined;
	},

	/**
	 * Locate a resource using a custom selector
	 * @param {String} custom the custom selector
	 * @returns {Resource} the located resource
	 */
	locateCustomResource : function(custom) {
		//		if (x$(custom).length > 0)	{
		return x$(custom);
		//		}
		//		return undefined;
	}
});

/**
 * Create a new JQueryResourceLocator
 * @class JQuery Resource Locator.
 * @augments ResourceLocator
 */
JQueryResourceLocator = ResourceLocator.extend(
/** @lends JQueryResourceLocator# */
{
	locateResource : function(id) {
		if (JOOUtils.isTag(id))
			return $(id);
		//		if ($('#'+id).length > 0)	{
		return $('#' + id);
		//		}
		//		return undefined;
	},

	/**
	 * Locate resource based on the custom selector
	 * @param {String} custom the custom selector
	 * @returns {Resource} the located resource
	 */
	locateCustomResource : function(custom) {
		//		if ($(custom).length > 0)	{
		return $(custom);
		//		}
		//		return undefined;
	}
});

//JQuery Horizontal alignment plugin
//(function ($) { $.fn.vAlign = function() { return this.each(function(i){ var h = $(this).height(); var oh = $(this).outerHeight(); var mt = (h + (oh - h)) / 2; $(this).css("margin-top", "-" + mt + "px"); $(this).css("top", "50%"); $(this).css("position", "absolute"); }); }; })(jQuery); (function ($) { $.fn.hAlign = function() { return this.each(function(i){ var w = $(this).width(); var ow = $(this).outerWidth(); var ml = (w + (ow - w)) / 2; $(this).css("margin-left", "-" + ml + "px"); $(this).css("left", "50%"); $(this).css("position", "absolute"); }); }; })(jQuery);

ObjectManager = Class.extend(
/** @lends ObjectManager# */
{
	/**
	 * Initialize fields
	 * @class Manage a set of objects.
	 * @augments Class
	 * @constructs
	 */
	init : function() {
		this.objects = new Array();
		this.context = null;
		this.mainObjects = new Array();
	},

	/**
	 * Register an object to be managed by this
	 * @param {Object} obj the object to register
	 */
	register : function(obj) {
		this.objects.push(obj);
	},

	/**
	 * Register a context
	 * @param {Object} obj the context to register
	 */
	registerContext : function(obj) {
		this.context = obj;
	},

	/**
	 * Register main object.
	 * Main object is the one visualizing the idea, a main object usually is a collection of main image
	 * and other thing support for the display
	 * @param {Object} obj the main object
	 */
	registerMainObjects : function(obj) {
		this.mainObjects.push(obj);
	},

	/**
	 * Retrieve main objects.
	 * @returns {mixed} the main objects
	 */
	getMainObjects : function() {
		return this.mainObjects;
	},

	/**
	 * Remove object from the list.
	 * @param {Object} obj the object to be removed
	 */
	remove : function(obj) {
		/*
		 * remove from display
		 */
		var i = this.findIndex(obj.id);
		if (i != -1) {
			this.objects.splice(i, 1);
		}
		/*
		 * remove from mainObjects array
		 */
		for (var j = 0; j < this.mainObjects.length; j++) {
			if (obj.id == this.mainObjects[j].id) {
				this.mainObjects.splice(j, 1);
			}
		}
	},

	/**
	 * Find an object using its ID.
	 * @param {mixed} objId the id of the object to be found
	 * @returns {mixed} the object or undefined
	 */
	find : function(objId) {
		var i = this.findIndex(objId);
		if (i == -1)
			return undefined;
		return this.objects[i];
	},

	/**
	 * Find the index of the object having specific ID
	 * @param {Object} objId the id of the object to be found
	 * @returns {mixed} the index of the object or -1
	 */
	findIndex : function(objId) {
		for (var i = 0; i < this.objects.length; i++) {
			if (objId == this.objects[i].id) {
				return i;
			}
		}
		return -1;
	}
});

Application = Class.extend(
/** @lends Application# */
{
	/**
	 * Initialize fields
	 * @class This class is the entrypoint of JOO applications.
	 * @singleton
	 * @augments Class
	 * @constructs
	 * @see SingletonFactory#getInstance
	 */
	init : function() {
		if (Application.singleton == undefined) {
			throw "Singleton class, can not be directly created !";
			return undefined;
		}
		this.systemProperties = new SystemProperty();
		this.resourceManager = new ResourceManager();
	},

	/**
	 * Access the application's resource manager
	 * @returns {ResourceManager} the application's resource manager
	 */
	getResourceManager : function() {
		return this.resourceManager;
	},

	/**
	 * Change the application's resource manager
	 * @param {ResourceManager} rm the resource manager to be used
	 */
	setResourceManager : function(rm) {
		this.resourceManager = rm;
	},

	/**
	 * Get the system properties array
	 * @returns {SystemProperty} the system properties
	 */
	getSystemProperties : function() {
		return this.systemProperties;
	},

	/**
	 * Change the bootstrap of the application
	 * @returns {Bootstrap} bootstrap the bootstrap of the application
	 */
	setBootstrap : function(bootstrap) {
		this.bootstrap = bootstrap;
	},

	/**
	 * Start the application. This should be called only once
	 */
	begin : function() {
		this.bootstrap.run();
	},

	/**
	 * Get the application's object manager
	 * @returns {ObjectManager} the application's object manager
	 */
	getObjectManager : function() {
		if (this.objMgr == undefined)
			this.objMgr = new ObjectManager();
		return this.objMgr;
	}
});

/**
 * @class Access object in a singleton way
 */
SingletonFactory = function() {
};

/**
 * Get singleton instance of a class.
 * @methodOf SingletonFactory
 * @param {String} classname the className
 * @returns the instance
 */
SingletonFactory.getInstance = function(classname) {
	if (classname.instance == undefined) {
		classname.singleton = 0;
		classname.instance = new classname();
		classname.singleton = undefined;
	}
	return classname.instance;
};

/**
 * @class Base class of all "interfaces"
 */
InterfaceImplementor = Class.extend(
/** @lends InterfaceImplementor# */
{
	init : function() {

	},

	/**
	 * Implement a class. Subclass should modify the <code>prototype</code>
	 * of the class to add new features. See source code of subclass for
	 * more details
	 * @param {Class} obj the class to be implemented
	 */
	implement : function(obj) {

	}
});

/**
 * @class Used to wrap class using interface
 * Wrapper allows developers to implement an interface for a class at runtime.
 */
Wrapper =
/** @lends Wrapper */
{
	/**
	 * Wrap a class with specific interface.
	 * @param {Class} obj the class to be wrapped
	 * @param {InterfaceImplementor} i the interface to be implemented
	 */
	wrap : function(obj, i) {
		obj.currentClass.implement(i);
	}
};

/**
 * @class This interface make instances of a class cloneable
 * @interface
 */
CloneableInterface = InterfaceImplementor.extend({

	implement : function(obj) {
		/**
		 * Clone the current object.
		 * @methodOf CloneableInterface#
		 * @name clone
		 * @returns {Object} the clone object
		 */
		obj.prototype.clone = obj.prototype.clone ||
		function() {
			var json = JSON.stringify(this);
			return JSON.parse(json);
		};
	}
});
JOOKeyBindings = Class.extend({

	start : function() {
		this.keyMappings = [];
		this.currentKeys = [];
		$(document).bind('keydown', {
			_self : this
		}, this._keydown);
		$(document).bind('keyup', {
			_self : this
		}, this._keyup);
	},

	bindKeyCommand : function(key, command) {
		this.keyMappings.push({
			command : command,
			parsedKey : this._parseKey(key),
			key : key
		});
	},

	_parseKey : function(key) {
		var keys = key.split('+');
		var isCtrl = false, isShift = false, isAlt = false;
		var normalKeys = [];
		for (var i = 0, l = keys.length; i < l; i++) {
			if (keys[i].toLowerCase() == 'ctrl') {
				isCtrl = true;
			} else if (keys[i].toLowerCase() == 'shift') {
				isShift = true;
			} else if (keys[i].toLowerCase() == 'alt') {
				isAlt = true;
			} else {
				normalKeys.push(this._toKeyCode(keys[i]));
			}
		}
		return {
			isCtrl : isCtrl,
			isShift : isShift,
			isAlt : isAlt,
			normalKeys : normalKeys
		};
	},

	_keydown : function(e) {
		var _self = e.data ? e.data._self || this : this;
		if (_self.currentKeys.indexOf(e.keyCode) == -1) {
			_self.currentKeys.push(e.keyCode);
		}
		for (var i = 0, l = _self.keyMappings.length; i < l; i++) {
			if (_self._checkKey(_self.keyMappings[i].parsedKey, e)) {
				_self.keyMappings[i].command.execute(e);
				_self.currentKeys = [];
				return;
			}
		}
	},

	_keyup : function(e) {
		var _self = e.data ? e.data._self || this : this;
		var index = _self.currentKeys.indexOf(e.keyCode);
		if (index != -1) {
			_self.currentKeys.splice(index, 1);
		}
	},

	_toKeyCode : function(key) {
		var r = key.match(/{(.*)}/);
		if (r && r.length >= 2)
			return parseInt(r[1]);
		return key.toUpperCase().charCodeAt(0);
	},

	_imply : function(a, b) {
		return a ? b : true;
	},

	_checkKey : function(key, e) {
		var pass = this._imply(key.isCtrl, e.ctrlKey) && this._imply(key.isShift, e.shiftKey) && this._imply(key.isAlt, e.altKey);
		if (!pass)
			return false;
		for (var i = 0, l = key.normalKeys.length; i < l; i++) {
			if (this.currentKeys.indexOf(key.normalKeys[i]) == -1) {
				return false;
			}
		}
		return true;
	},

	stop : function() {
		$(document).removeEventListener('keyup', this._keyup);
		$(document).removeEventListener('keydown', this._keydown);
	}
});
/**
 * An interface for all ajax-based portlets or plugins
 * Provide the following methods:
 *  - onAjax(controller, action, params, type, callback)
 */
AjaxInterface = InterfaceImplementor.extend({

	implement : function(obj) {
		obj.prototype.onAjax = obj.prototype.onAjax ||
		function(url, params, type, callbacks, options) {
			options = options || {};
			if (type == undefined)
				type = 'GET';
			var success = callbacks.onSuccess;
			var fail = callbacks.onFailure;
			var error = callbacks.onError;
			var accessDenied = callbacks.onAccessDenied;

			var memcacheKey = 'ajax.' + url;
			for (var k in params) {
				var v = params[k];
				memcacheKey += '.' + k + '.' + v;
			}

			//var root = SingletonFactory.getInstance(Application).getSystemProperties().get('host.root');
			//var url = root+'/'+controller+'/'+action;
			//try to get from mem cached
			if (type == 'GET' && options.cache == true) {
				var memcache = SingletonFactory.getInstance(Memcached);
				var value = memcache.retrieve(memcacheKey);
				if (value != undefined) {
					var now = new Date();
					var cacheTimestamp = value.timestamp;
					if ((now.getTime() - cacheTimestamp) < options.cacheTime) {
						var subject = SingletonFactory.getInstance(Subject);
						subject.notifyEvent('AjaxQueryFetched', {
							result : value.ret,
							url : url
						});
						AjaxHandler.handleResponse(value.ret, success, fail, url);
						return;
					} else {
						memcache.clear(memcacheKey);
					}
				}
			}

			var args = arguments;
			var _self = this;

			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('AjaxBegan', {
				key : memcacheKey,
				args : args,
				target : _self
			});
			var _options = {
				dataType : 'json',
				url : url,
				type : type,
				data : params,
				success : function(ret) {
					subject.notifyEvent('AjaxFinished', {
						key : memcacheKey,
						args : args,
						target : _self,
						error : false
					});
					if (ret != null) {
						if (type == 'GET' && cache == true) {
							//cache the result
							var memcache = SingletonFactory.getInstance(Memcached);
							var now = new Date();
							memcache.store(memcacheKey, {
								'ret' : ret,
								'timestamp' : now.getTime()
							});
						}
						subject.notifyEvent('AjaxQueryFetched', {
							result : ret,
							url : url
						});
						AjaxHandler.handleResponse(ret, success, fail, url);
					}
				},
				error : function(ret, statusText, errorCode) {
					if (error)
						error(ret, statusText, errorCode);
					subject.notifyEvent('AjaxError', {
						ret : ret,
						statusText : statusText,
						errorCode : errorCode,
						key : memcacheKey,
						target : _self,
						args : args
					});
					subject.notifyEvent('AjaxFinished', {
						key : memcacheKey,
						args : args,
						target : _self,
						error : true
					});
				},
				statusCode : {
					403 : function() {
						//console.log('access denied at '+url);
						if (accessDenied != undefined)
							accessDenied.call(undefined);
					}
				}
			};
			for (var i in options) {
				_options[i] = options[i];
			}
			$.ajax(_options);
		};
	}
});

AjaxHandler = {

	handleResponse : function(ret, success, fail, url) {
		var result = ret.result;
		if (result.status) {
			if (success != undefined) {
				try {
					success.call(undefined, result.data);
				} catch (err) {
					log(err + " - " + url);
				}
			}
		} else if (result == 'internal-error') {
			var subject = SingletonFactory.getInstance(Subject);
			subject.notifyEvent('NotifyError', ret.message);
		} else {
			if (fail != undefined) {
				try {
					fail.call(undefined, ret.message, ret.detail);
				} catch (err) {
					log(err);
				}
			}
		}
	}
};
/**
 * @class An interface enabling UI Components to be rendered
 * using composition
 * @interface
 */
CompositionRenderInterface = InterfaceImplementor.extend({

	implement : function(obj) {
		var _self = this;

		/**
		 * Render the UI Component.
		 * @methodOf CompositionRenderInterface#
		 * @name renderUIComposition
		 */
		obj.prototype.renderUIComposition = obj.prototype.renderUIComposition ||
		function() {
			var model = this.config.model || {};
			var composition = $(JOOUtils.tmpl(this.className + "View", model));
			_self.processElement(this, this, composition[0], model);
		};

		obj.prototype.bindModelView = obj.prototype.bindModelView ||
		function(ui, model, path, boundProperty) {
			var method = ExpressionUtils.getMutatorMethod(ui, boundProperty);
			method.call(ui, ExpressionUtils.express(model, path), {
				path : path,
				bindingPath : path
			});

			//constraint model to view
			model.addEventListener('change', function(e) {
				if (this._currentTarget == ui)
					return;
				if (path.indexOf(e.path) != -1 || e.path.indexOf(path) != -1) {
					var _currentTarget = ui._currentTarget;
					ui._currentTarget = this;
					if (e.type == 'setter') {
						var method = ExpressionUtils.getMutatorMethod(ui, boundProperty);
						method.call(ui, ExpressionUtils.express(model, path), {
							path : e.path,
							bindingPath : path
						});
					} else {
						var fn = 'partialModelChange' + boundProperty[0].toUpperCase() + boundProperty.substr(1);
						if ( typeof ui[fn] == 'function') {
							ui[fn].call(ui, model, e);
						}
						if ( typeof ui['partialModelChange'] == 'function') {
							ui.partialModelChange(model, e, boundProperty);
						}
					}
					ui._currentTarget = _currentTarget;
				}
			});

			//constraint view to model
			ui.addEventListener('change', function(e) {
				if (this._currentTarget == model)
					return;
				var _currentTarget = model._currentTarget;
				model._currentTarget = this;
				var method = ExpressionUtils.getAccessorMethod(ui, boundProperty);
				var val = method.call(ui);
				ExpressionUtils.expressSetter(model, path, val);
				model._currentTarget = _currentTarget;
			});
		};
	},

	processElement : function(root, obj, composition, model) {
		var $composition = $(composition);
		var currentObject = undefined;
		var children = Array();
		var config = {};
		var tagName = undefined;
		if (composition.nodeType == 3) {//text node
			currentObject = new DisplayObject({
				domObject : $composition
			});
			tagName = "text";
		} else {
			tagName = composition.tagName.toLowerCase();
			children = $composition.contents();
			currentObject = obj;
			config = JOOUtils.getAttributes(composition);
		}

		var handlers = {};
		var bindings = [];

		var isAddTab = false;
		var isAddItem = false;
		var tabTitle = undefined;

		var ns = 'joo.ui.composition';
		if (config['config-id']) {
			var dataStore = SingletonFactory.getInstance(DataStore);
			if (!dataStore.getStore(ns)) {
				dataStore.registerStore(ns, 'Dom', {
					id : 'UICompositionConfig'
				});
			}
			var cfg = dataStore.fetch(ns, config['config-id']) || {};
			for (var i in config) {
				cfg[i] = config[i];
			}
			config = cfg;
		}

		for (var i in config) {
			if (i.indexOf('handler:') != -1) {
				var event = i.substr(8);
				var fn = config[i];
				handlers[event] = new Function(fn);
				delete config[i];
			} else if ( typeof config[i] == 'string' && config[i].indexOf('#{') == 0) {
				var expression = config[i].substr(2, config[i].length - 3);
				config[i] = ExpressionUtils.express(model, expression);
				bindings.push({
					expression : expression,
					boundProperty : i
				});
			} else if ( typeof config[i] == 'string' && config[i].indexOf('${') == 0) {
				var expression = config[i].substr(2, config[i].length - 3);
				config[i] = ExpressionUtils.express(root, expression);
				//				bindings = expression;
			} else if (i == 'command' && typeof config[i] == 'string') {
				var fn = new Function(config[i]);
				config[i] = function() {
					fn.apply(root, arguments);
				};
			}
		}

		switch(tagName) {
			case "joo:composition":
				for (var i in config) {
					var mutator = ExpressionUtils.getMutatorMethod(currentObject, i);
					mutator.call(currentObject, config[i]);
				}
				break;
			case "joo:var":
				var varName = $composition.attr('name');
				currentObject = obj[varName];
				for (var i in config) {
					var mutator = ExpressionUtils.getMutatorMethod(currentObject, i);
					if (mutator)
						mutator.call(currentObject, config[i]);
				}
				break;
			case "joo:addtab":
				isAddTab = true;
				tabTitle = config.title;
				break;
			case "joo:additem":
				isAddItem = true;
				break;
			default:
				if (tagName.indexOf("joo:") == 0) {
					if (config.custom && typeof config.custom != 'object') {
						config.custom = eval('(' + config.custom + ')');
					}
					var className = ClassMapping[tagName.split(':')[1]];
					if (className) {
						currentObject = new window[className](config);
					} else {
						throw "Undefined UI Tag: " + tagName;
					}
				} else {
					if (tagName != "text") {
						currentObject = new CustomDisplayObject({
							html : $composition
						});
					}
				}
		}

		for (var i in handlers) {
			(function(i) {
				if (i.indexOf('touch') != -1) {//in some platforms such as iOS, binding touch events won't take effect
					//if elements not existed in DOM
					currentObject.addEventListener('stageUpdated', function() {
						currentObject.addEventListener(i, function(event) {
							try {
								handlers[i].apply(root, arguments);
							} catch (err) {
								log(err);
							}
						});
					});
				} else {
					currentObject.addEventListener(i, function(event) {
						try {
							handlers[i].apply(root, arguments);
						} catch (err) {
							log(err);
						}
					});
				}
			})(i);
		}

		for (var i = 0, l = bindings.length; i < l; i++) {
			/*
			 currentObject.dataBindings = bindings;
			 currentObject.addEventListener('change', function() {
			 root.dispatchEvent('bindingchanged', currentObject);
			 });
			 */
			root.bindModelView(currentObject, model, bindings[i].expression, bindings[i].boundProperty);
		}

		var varName = $composition.attr('varName');
		if (varName) {
			root[varName] = currentObject;
		}

		for (var i = 0; i < children.length; i++) {
			var child = this.processElement(root, currentObject, children[i], model);
			if (isAddTab) {
				currentObject.addTab(tabTitle, child);
			} else if (isAddItem) {
				currentObject.addItem(child);
			} else {
				if (currentObject != child)
					currentObject.addChild(child);
			}
		}
		return currentObject;
	}
});
ThemeManager = Class.extend({

	init : function() {
		if (ThemeManager.instance == undefined) {
			throw "ThemeManager is singleton and cannot be initiated";
		}
		this.lookAndFeel = "joo";
		this.style = "";
		this.uiprefix = "joo";
	},

	setLookAndFeel : function(lookAndFeel) {
		this.lookAndFeel = lookAndFeel;
	},

	setStylesheet : function(style) {
		this.style = style;
	},

	setUIPrefix : function(prefix) {
		this.uiprefix = prefix;
	}
});

JOOFont = Class.extend({
	init : function() {
		this.fontFamily = 'arial, sans-serif';
		this.fontSize = "12px";
		this.bold = false;
		this.italic = false;
		this.underline = false;
		this.color = "black";
	},

	setFont : function(fontFamily, fontSize, bold, italic, underline, color) {
		this.fontFamily = fontFamily;
		this.fontSize = fontSize;
		this.bold = bold;
		this.italic = italic;
		this.underline = underline;
		this.color = color;
	},

	setFontFamily : function(fontFamily) {
		this.fontFamily = fontFamily;
	},

	getFontFamily : function() {
		return this.fontFamily;
	},

	setFontSize : function(fontSize) {
		this.fontSize = fontSize;
	},

	getFontSize : function() {
		return this.fontSize;
	},

	setBold : function(bold) {
		this.bold = bold;
	},

	getBold : function() {
		return this.bold;
	},

	setItalic : function(italic) {
		this.italic = italic;
	},

	getItalic : function() {
		return this.italic;
	},

	setColor : function(color) {
		this.color = color;
	},

	getUnderline : function() {
		return this.underline;
	},
	setUnderline : function(underline) {
		this.underline = underline;
	},

	getColor : function() {
		return this.color;
	}
});

EventDispatcher = Class.extend(
/**
 * @lends EventDispatcher#
 */
{

	/**
	 * Create a new EventDispatcher.
	 * @class Base class for all event dispatchers (such as DisplayObject)
	 * @constructs
	 * @augments Class
	 */
	init : function() {
		this.listeners = {};
	},

	addEventListenerWithNamespace : function(eventType, eventNamespace, handler) {
		eventNamespace = eventNamespace || "__global__";
		if (this.listeners[eventType] == undefined) {
			this.listeners[eventType] = {};
		}
		var listener = this.listeners[eventType];
		if (!listener[eventNamespace]) {
			listener[eventNamespace] = Array();
		}
		listener[eventNamespace].push(handler);
	},

	/**
	 * Add a new listener for a specific event.
	 * @param {String} event the event to be handled.
	 * @param {Function} handler the event handler. If you want to remove it
	 * at a later time, it must not be an anonymous function
	 */
	addEventListener : function(event, handler) {
		var strSplited = event.split(' ');
		for (var i = 0, l = strSplited.length; i < l; i++) {
			var evt = strSplited[i].trim();
			if (evt && evt != '') {
				var ssed = evt.split('.');
				this.addEventListenerWithNamespace(ssed[0], ssed[1], handler);
			}
		}
	},

	dispatchEventWithNamespace : function(event, namespace, args) {
		var handlers = this.listeners[event][namespace];
		if (!handlers)
			return;
		for (var i = 0, l = handlers.length; i < l; i++) {
			handlers[i].apply(this, args);
		}
	},

	/**
	 * Dispatch a event.
	 * @param {String} event the event to be dispatched.
	 */
	dispatchEvent : function(event, eventData) {
		if (!this.disabled) {
			var strSplited = event.split('.');
			var eventType = strSplited[0];
			var eventNamespace = strSplited[1];

			if (this.listeners && this.listeners[eventType] != undefined) {
				var args = Array();
				for (var i = 1, l = arguments.length; i < l; i++) {
					args.push(arguments[i]);
				}

				if (eventNamespace) {
					this.dispatchEventWithNamespace(eventType, '__global__', args);
					this.dispatchEventWithNamespace(eventType, eventNamespace, args);
				} else {
					var handlerNamespace = this.listeners[eventType];
					for (var i in handlerNamespace) {
						this.dispatchEventWithNamespace(eventType, i, args);
					}
				}
			}
			return true;
		}
		return false;
	},

	/**
	 * Remove a handler for a specific event.
	 * @param {String} event the event of handler to be removed
	 * @param {Function} handler the handler to be removed
	 */
	removeEventListener : function(event, handler) {
		if (!event) {
			this.listeners = {};
			return;
		}
		var strSplited = event.split('.');
		var eventType = strSplited[0];
		var eventNamespace = strSplited[1];

		if (this.listeners[eventType] == undefined) {
			return;
		}

		if (handler == undefined) {
			if (eventNamespace) {
				this.listeners[eventType][eventNamespace] = undefined;
			} else {
				this.listeners[eventType] = undefined;
			}
			return;
		}

		var index = -1;
		if (eventNamespace) {
			index = this.listeners[eventType][eventNamespace].indexOf(handler);
			if (index != -1)
				this.listeners[eventType][eventNamespace].splice(index, 1);
		} else {
			for (var i in this.listeners[eventType]) {
				index = this.listeners[eventType][i].indexOf(handler);
				if (index != -1) {
					this.listeners[eventType][i].splice(index, 1);
					break;
				}
			}
		}
	},

	disable : function(disabled) {
		this.disabled = disabled;
	},

	toString : function() {
		return "EventDispatcher";
	},

	setupBase : function(config) {

	}
});

DisplayObject = EventDispatcher.extend(
/**
 * @lends DisplayObject#
 */
{
	/**
	 * Create a new DisplayObject
	 * @constructs
	 * @class
	 * <p>Base class for all JOO UI components</p>
	 * <p>It supports the following configuration parameters:</p>
	 * <ul>
	 * 	<li><code>tooltip</code> The tooltip of the object</li>
	 * 	<li><code>absolute</code> Whether position remains intact or not</li>
	 * 	<li><code>x</code> X of component. The <code>absolute</code> parameter must be false</li>
	 * 	<li><code>y</code> Y of component. The <code>absolute</code> parameter must be false</li>
	 * 	<li><code>width</code> Width of component</li>
	 * 	<li><code>height</code> Height of component</li>
	 * 	<li><code>custom</code> Custom styles of component</li>
	 * </ul>
	 * @augments EventDispatcher
	 */
	init : function(config) {
		this._super();
		this.domEventBound = {};
		this.inheritedCSSClasses = true;
		this.classes = Array();
		if (config == undefined)
			config = {};
		this.config = config;
		this.setupBase(config);
		this.setupDisplay(config);
		this.setupDomObject(config);

		//		var objMgr = SingletonFactory.getInstance(Application).getObjectManager();
		//		objMgr.register(this);
	},

	/**
	 * Update the stage of current component.
	 * This method is not intended to be used by developers.
	 * It is called automatically from JOO when an object is added to a stage
	 * directly or indirectly.
	 * @private
	 * @param {Stage} stage new Stage of current component
	 */
	updateStage : function(stage) {
		if (stage != this.stage) {
			this.stage = stage;
			this.dispatchEvent("stageUpdated");
		}
	},

	/**
	 * Make this component sketched by another one
	 * @param {DisplayObject} parent the component that this component anchors to
	 */
	anchorTo : function(parent) {
		this.setLocation(0, 0);
		this.setStyle('width', parent.getWidth());
		this.setStyle('height', parent.getHeight());
	},

	addEventListenerWithNamespace : function(event, namespace, handler) {
		if (this.domEventBound[event] != true) {
			this.access().bind(event, {
				_self : this,
				event : event
			}, this.bindEvent);
			this.domEventBound[event] = true;
		}
		this._super(event, namespace, handler);
	},

	dispatchEvent : function(event, eventData) {
		if (!InteractionControlHelper.getInteractionAbility(event))
			return;
		if (!eventData)
			eventData = {};
		if ( typeof eventData['stopPropagation'] == 'undefined') {
			eventData.stopPropagation = function() {
				this.isBubbleStop = true;
			};
			eventData.isPropagationStopped = function() {
				return this.isBubbleStop;
			};
		}
		var eventType = event.split('.')[0];

		var skipped = ['stageUpdated'];
		//stageUpdated is internal event and should not be propagated
		var result = this._super.apply(this, arguments);
		if (result) {
			if (this._parent && !eventData.isPropagationStopped() && skipped.indexOf(eventType) == -1) {
				this._parent.dispatchEvent.apply(this._parent, arguments);
			}
		}
	},

	bindEvent : function(e) {
		var event = e.data.event;
		var args = Array();
		args.push(event);
		for (var i = 0; i < arguments.length; i++) {
			args.push(arguments[i]);
		}
		var _self = e.data._self;
		_self['dispatchEvent'].apply(_self, args);
	},

	_appendBaseClass : function(className) {
		this.classes.push('joo-' + className.toLowerCase());
	},

	/**
	 * Initialize variables
	 * @private
	 * @param {object} config configuration parameters
	 */
	setupBase : function(config) {
		this._appendBaseClass(this.className);
		for (var i = this.ancestors.length - 1; i >= 0; i--) {
			if (this.ancestors[i].prototype.className) {
				this._appendBaseClass(this.ancestors[i].prototype.className);
			}
		}
		this.id = this.id || config.id || generateId(this.className.toLowerCase());
		this._parent = undefined;
		this._super(config);
	},

	setupDisplay : function(config) {
		this.scaleX = this.scaleY = 1;
		this.rotation = 0;
		this.rotationCenter = {
			x : 0.5,
			y : 0.5
		};
		this.roundDeltaX = 0;
		this.roundDeltaY = 0;
		this.roundDeltaW = 0;
		this.roundDeltaH = 0;
	},

	/**
	 * Initialize UI
	 * @private
	 * @param {object} config configuration parameters
	 */
	setupDomObject : function(config) {
		this.domObject = config.domObject || JOOUtils.accessCustom(this.toHtml());
		if (!config.domObject)
			this.setAttribute('id', this.id);
		//		var c = this.inheritedCSSClasses? this.classes.length : 1;
		//		for(var i=0; i<c; i++) {
		//			this.access().addClass('joo-'+this.classes[i].toLowerCase());
		//		}
		if (!this.inheritedCSSClasses) {
			this.access().addClass(this.classes[0]);
		} else {
			this.classes.push('joo-ui');
			this.setAttribute('class', this.classes.join(' '));
		}
		this.classes = undefined;
		//		this.access().addClass('joo-ui');	//for base styles, e.g: all DisplayObject has 'position: absolute'

		if (config.tooltip)
			this.setTooltip(config.tooltip);

		//		if (!config.absolute) {
		if (config.x != undefined)
			this.setX(config.x);
		if (config.y != undefined)
			this.setY(config.y);
		//			var x = config.x || 0;
		//			var y = config.y || 0;
		//			this.setLocation(x, y);
		//		}
		if (config['background-color'] != undefined)
			this.setStyle('background-color', config['background-color']);

		if (config.extclasses) {
			this.setExtclasses(config.extclasses);
		}

		if (config.extstyles) {
			this.setExtstyles(config.extstyles);
		}

		if (config.width != undefined)
			this.setWidth(config.width);
		if (config.height != undefined)
			this.setHeight(config.height);

		if (config.custom != undefined) {
			for (var i in config.custom) {
				this.setStyle(i, config.custom[i]);
			}
		}
	},

	setExtstyles : function(styles) {
		this.extstyles = styles;
		this.access().attr('style', this.access().attr('style') + ';' + styles);
	},

	getExtstyles : function() {
		return this.extstyles;
	},

	setExtclasses : function(cls) {
		if (this.extclasses)
			this.access().removeClass(this.extclasses);
		this.extclasses = cls;
		this.access().addClass(cls);
	},

	getExtclasses : function() {
		return this.extclasses;
	},

	getTooltip : function() {
		return this.getAttribute('title');
	},

	setTooltip : function(tooltip) {
		this.setAttribute('title', tooltip);
	},

	/**
	 * Change width of component
	 * @param {String|Number} w new width of component
	 */
	setWidth : function(w) {
		if (!isNaN(w) && w != '') {
			w = parseFloat(w);
			w += this.roundDeltaW;
			this.roundDeltaW = w - Math.floor(w);
			w = Math.floor(w);
		}
		this.setStyle('width', w);
	},

	/**
	 * Change height of component
	 * @param {String|Number} h new height of component
	 */
	setHeight : function(h) {
		if (!isNaN(h) && h != '') {
			h = parseFloat(h);
			h += this.roundDeltaH;
			this.roundDeltaH = h - Math.floor(h);
			h = Math.floor(h);
		}
		this.setStyle('height', h);
	},

	/**
	 * Get current width of component (without border, outline & margin)
	 * @returns {String|Number} width of component
	 */
	getWidth : function() {
		return this.access().width();
	},

	/**
	 * Get current height of component (without border, outline & margin)
	 * @returns {String|Number} height of component
	 */
	getHeight : function() {
		return this.access().height();
	},

	/**
	 * Get the current location of component
	 * @returns {Object} location of component
	 */
	getLocation : function() {
		return {
			x : this.getX(),
			y : this.getY()
		};
	},

	/**
	 * Change the location of component
	 * @param {String|Number} x new x coordinate
	 * @param {String|Number} y new y coordinate
	 */
	setLocation : function(x, y) {
		this.setX(x);
		this.setY(y);
	},

	/**
	 * Get the current x position of component
	 * @returns {String|Number} current x position
	 */
	getX : function() {
		var left = this.getStyle("left");
		if (left.length > 2)
			left = parseFloat(left.substr(0, left.length - 2));
		if (isNaN(left))
			return this.access().position().left;
		return left;
	},

	/**
	 * Change the x position of component
	 * @param {Number} the current x position
	 */
	setX : function(x) {
		x = parseFloat(x);
		if (isNaN(x))
			return;
		x += this.roundDeltaX;
		this.roundDeltaX = x - Math.floor(x);
		this.setStyle('left', Math.floor(x) + 'px');
	},

	/**
	 * Get the current y position of component
	 * @returns {String|Number} current y position
	 */
	getY : function() {
		var top = parseFloat(this.getStyle('top'));
		if (top.length > 2)
			top = parseFloat(top.substr(0, top.length - 2));
		if (isNaN(top))
			return this.access().position().top;
		return top;
	},

	/**
	 * Change the y position of component
	 * @param {Number} the current y position
	 */
	setY : function(y) {
		y = parseFloat(y);
		if (isNaN(y))
			return;
		y += this.roundDeltaY;
		this.roundDeltaY = y - Math.floor(y);
		this.setStyle('top', Math.floor(y) + 'px');
	},

	/**
	 * Get current rotation angle
	 * @returns {Number} current rotation (in degree)
	 */
	getRotation : function() {
		return this.rotation;
	},

	/**
	 * Change the rotation angle
	 * @param {Number} r the new rotation angle in degree
	 */
	setRotation : function(r) {
		this.rotation = r;
		this.setCSS3Style('transform', 'rotate(' + r + 'deg)');
	},

	/**
	 * Change DOM attribute
	 * @param {String} attrName the attribute name
	 * @param {String} value the attribute value
	 */
	setAttribute : function(attrName, value) {
		this.access().attr(attrName, value);
	},

	/**
	 * Get value of a DOM attribute
	 * @param attrName the attribute name
	 * @returns {String} the attribute value
	 */
	getAttribute : function(attrName) {
		return this.access().attr(attrName);
	},

	/**
	 * Get all DOM attributes mapped by name
	 * @returns {Object} the attributes map
	 */
	getAttributes : function() {
		return JOOUtils.getAttributes(this.access()[0]);
	},

	/**
	 * Remove a DOM attribute
	 * @param {String} name the attribute name
	 */
	removeAttribute : function(name) {
		this.access().removeAttr(name);
	},

	/**
	 * Whether a DOM attribute exists
	 * @param {String} name the attribute name
	 * @returns {Boolean} <code>true</code> if the attribute exists, otherwise returns <code>false</code>
	 */
	hasAttribute : function(name) {
		return this.access().attr(name) != undefined;
	},

	/**
	 * Change a style
	 * @param {String} k the style name
	 * @param {String} v the style value
	 * @param {Boolean} silent whether event is omitted or dispatched
	 */
	setStyle : function(k, v, silent) {
		if (this.dead)
			return;
		if (silent)
			this.access().silentCss(k, v);
		else
			this.access().css(k, v);
	},

	/**
	 * Get value of a style
	 * @param {String} k the style name
	 * @returns {String} the style value
	 */
	getStyle : function(k) {
		return this.access().css(k);
	},

	/**
	 * Get the computed value of a style
	 * @param {String} k the style name
	 * @returns {String} the style computed value
	 */
	getComputedStyle : function(k) {
		var s = this.access().getStyleObject()[k];
		if (s == undefined)
			return this.getStyle(k);
		return s;
	},

	/**
	 * Change a CSS3 style.
	 * It works by adding CSS3-prefixes to the style name
	 * @param {String} k the style name
	 * @param {String} v the style value
	 */
	setCSS3Style : function(k, v) {
		this.setStyle(k, v);
		this.setStyle('-ms-' + k, v);
		this.setStyle('-webkit-' + k, v);
		this.setStyle('-moz-' + k, v);
		this.setStyle('-o-' + k, v);
	},

	getScale : function() {
		return {
			scaleX : this.scaleX,
			scaleY : this.scaleY
		};
	},

	setScaleX : function(x, time) {
		if (time == undefined)
			time = 0;
		this.scaleX = x;
		this.access().effect('scale', {
			percent : x * 100,
			direction : 'horizontal'
		}, time);
	},

	setScaleY : function(y, time) {
		if (time == undefined)
			time = 0;
		this.scaleY = y;
		this.access().effect('scale', {
			percent : y * 100,
			direction : 'vertical'
		}, time);
	},

	setScale : function(s, time) {
		if (time == undefined)
			time = 0;
		this.access().effect('scale', {
			percent : s * 100,
			direction : 'both'
		}, time);
	},

	getId : function() {
		return this.id;
	},

	/**
	 * Get the corresponding Resource object.
	 * @returns {Resource} the Resource object
	 */
	access : function() {
		return this.domObject;
	},

	/**
	 * Specify HTML content of current component.
	 * Subclass can override this method to specify its own content
	 * @returns {String}
	 */
	toHtml : function() {
		return "";
	},

	applyFont : function(font) {
		if (font.fontFamily) {
			this.setStyle("font-family", font.fontFamily);
		}

		if (font.fontSize) {
			this.setStyle('font-size', font.fontSize);
		}

		if (font.bold) {
			this.setStyle("font-weight", "bold");
		}

		if (font.italic || font.underline) {
			var font_style = "";
			if (font.italic) {
				font_style += "italic ";
			}
			if (font.underline) {
				font_style += "underline";
			}
			this.setStyle("font-style", font_style);
		}
		if (font.color) {
			this.setStyle("color", font.color);
		}
	},

	/**
	 * Dispose the current component.
	 * <p>It is not intended to be used by developers, as this method
	 * does not remove the current component from its parent's <code>children</code> array.
	 * Developers should use the <code>selfRemove</code> method instead.</p>
	 * @private
	 */
	dispose : function(skipRemove) {
		if (this.dead)
			return;
		this.dispatchEvent('dispose');

		if (!skipRemove) {
			this.access().remove();
		}
		//		var objMgr = SingletonFactory.getInstance(Application).getObjectManager();
		//		objMgr.remove(this);
		this.listeners = undefined;
		this.config = undefined;
		this.dead = true;

		//if (this.domEventBound != undefined) {
		//for(var i in this.domEventBound) {
		//this.access().unbind(i, this.bindEvent);
		//}
		//this.access().unbind();
		this.domEventBound = undefined;
		//}
		this._parent = undefined;
		this.domObject = undefined;
		this.stage = undefined;
	},

	/**
	 * Dispose the current component and remove reference from its parent.
	 * This method can be called by developers.
	 * <p>Note that developers must also remove any extra references before
	 * disposing a component to prevent memory leaks</p>
	 */
	selfRemove : function() {
		if (this._parent != undefined)
			this._parent.removeChild(this);
		else
			this.dispose();
	},

	/**
	 * Enable/Disable current component.
	 * Disabled component itself can still dispatch events but all of its
	 * event listeners are disabled
	 * @param {Boolean} disabled whether disable or enable the component
	 */
	disable : function(disabled) {
		//TODO check if the disabled flag is actually changed
		this._super(disabled);
		if (disabled) {
			this.access().addClass('disabled');
			this.setAttribute('disabled', 'disabled');
		} else {
			this.dispatchEvent('stageUpdated');
			this.access().removeClass('disabled');
			this.removeAttribute('disabled');
		}
	},

	toString : function() {
		return this.className;
	}
});

/**
 * This class is abstract and should be subclassed.
 * @class Base class for containers. A container is a component
 * which contains other components.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>layout</code> The layout of current component. See <code>setLayout</code> method</li>
 * </ul>
 * @augments DisplayObject
 */
DisplayObjectContainer = DisplayObject.extend(
/**
 * @lends DisplayObjectContainer#
 */
{
	updateStage : function(stage) {
		this._super(stage);
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].updateStage(this.stage);
		}
	},

	setupBase : function(config) {
		this.children = new Array();
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		if (config.layout == undefined)
			config.layout = 'block';
		this.setLayout(config.layout);
	},

	disable : function(disabled) {
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].disable(disabled);
		}
		this._super(disabled);
	},

	changeTransformOrigin : function(option) {
		if (this.transformOrigin == option)
			return;
		var pos = this.transformedOffset();
		var selfPos = this.virtualNontransformedOffset();
		var deltaX = pos.x - selfPos.x;
		var deltaY = pos.y - selfPos.y;

		switch (option) {
			case 'topLeft': {
				this.setStyle('-webkit-transform-origin', '0 0');
				this.setStyle('-moz-transform-origin', '0 0');
				this.setLocation(this.getX() + deltaX, this.getY() + deltaY);
				break;
			}
			case 'center': {
				this.setStyle('-webkit-transform-origin', "50% 50%");
				this.setStyle('-moz-transform-origin', "50% 50%");
				this.setLocation(this.getX() - deltaX, this.getY() - deltaY);
				break;
			}
			default:
				return;
		}
		this.transformOrigin = option;
	},

	getRotationCenterPoint : function() {
		var selfPos = this.offset();
		var width = parseFloat(this.getWidth());
		var height = parseFloat(this.getWidth());
		return getPositionFromRotatedCoordinate({
			x : width * this.rotationCenter.x,
			y : height * this.rotationCenter.y
		}, 0, selfPos);
	},

	/**
	 * Offset (top-left coordinate) relative to the document 'as if' the object is not transformed
	 * @private
	 */
	virtualNontransformedOffset : function() {
		var width = parseFloat(this.getWidth());
		var height = parseFloat(this.getHeight());
		return getPositionFromRotatedCoordinate({
			x : -width * this.rotationCenter.x,
			y : -height * this.rotationCenter.y
		}, 0, this.getRotationCenterPoint());
	},

	/**
	 * Offset (top-left coordinate) relative to the document assuming the object is transformed
	 * @private
	 */
	transformedOffset : function() {
		var width = parseFloat(this.getWidth());
		var height = parseFloat(this.getHeight());
		return getPositionFromRotatedCoordinate({
			x : -width * this.rotationCenter.x,
			y : -height * this.rotationCenter.y
		}, this.getRotation() * Math.PI / 180, this.getRotationCenterPoint());
	},

	/**
	 * Same as virtualNontransformedOffset
	 * @private
	 */
	offset : function() {
		var x = 0, y = 0;
		var obj = document.getElementById(this.getId());
		if (obj) {
			x = obj.offsetLeft;
			y = obj.offsetTop;
			var body = document.getElementsByTagName('body')[0];
			while (obj.offsetParent && obj != body) {
				x += obj.offsetParent.offsetLeft;
				y += obj.offsetParent.offsetTop;
				obj = obj.offsetParent;
			}
		}
		return {
			x : x,
			y : y
		};
	},

	/**
	 * Add a component before a Resource object.
	 * @param {DisplayObject} obj the component to be added
	 * @param {Resource} positionObj the Resource object
	 */
	addChildBeforePosition : function(obj, positionObj) {
		this._prepareAddChild(obj);
		obj.access().insertBefore(positionObj);
		obj.updateStage(this.stage);
	},

	/**
	 * Add a component at the end of current container.
	 * @param {DisplayObject} obj the component to be added
	 */
	addChild : function(obj) {
		this._prepareAddChild(obj);
		obj.access().appendTo(this.access());
		obj.updateStage(this.stage);
	},

	_prepareAddChild : function(obj) {
		this.children.push(obj);
		if (obj._parent != undefined)
			obj._parent.detachChild(obj);
		obj._parent = this;
	},

	/**
	 * Remove a child component.
	 * @param {DisplayObject} object the component to be removed
	 */
	removeChild : function(object) {
		for (var i = 0; i < this.children.length; i++) {
			var obj = this.children[i];
			if (obj.getId() == object.getId()) {
				this.children.splice(i, 1);
				object.dispose();
			}
		}
	},

	/**
	 * Remove a child component at specific index.
	 * @param {Number} index the index of the component to be removed
	 */
	removeChildAt : function(index) {
		var object = this.children[index];
		this.children.splice(index, 1);
		object.dispose();
	},

	removeAllChildren : function() {
		for (var i = this.children.length - 1; i >= 0; i--) {
			this.children[i].dispose();
		}
		this.children = Array();
	},

	/**
	 * Detach (but not dispose) a child component.
	 * The component will be detached from DOM, but retains
	 * its content, listeners, etc.
	 * @param {DisplayObject} object the object to be detached
	 */
	detachChild : function(object) {
		for (var i = 0; i < this.children.length; i++) {
			var obj = this.children[i];
			if (obj.getId() == object.getId()) {
				this.children.splice(i, 1);
				obj.access().detach();
				obj._parent = undefined;
			}
		}
	},

	/**
	 * Get all children of the container.
	 * @returns {Array} an array of this container's children
	 */
	getChildren : function() {
		return this.children;
	},

	/**
	 * Get a child component with specific id.
	 * @param {Number} id the id of the child component
	 * @returns {DisplayObject} the child component with specified id
	 */
	getChildById : function(id) {
		for (var i in this.children) {
			if (this.children[i].getId() == id)
				return this.children[i];
		}
		return undefined;
	},

	/**
	 * Change the layout of this container.
	 * <p>Supported layouts are:</p>
	 * <ul>
	 * 	<li><code>absolute</code>: All children have absolute position</li>
	 * 	<li><code>flow</code>: All children have relative position</li>
	 * 	<li><code>vertical</code>: All children have block display</li>
	 * </ul>
	 * @param {String} layout new layout
	 */
	setLayout : function(layout) {
		if (this.layout != undefined)
			this.access().removeClass('joo-layout-' + this.layout);
		this.access().addClass('joo-layout-' + layout);
		this.layout = layout;
	},

	getLayout : function() {
		return this.layout;
	},

	dispose : function(skipRemove) {
		if (this.dead)
			return;
		for (var i = 0; i < this.children.length; i++) {
			this.children[i].dispose(true);
		}
		this.children = undefined;
		this._super(skipRemove);
	}
});

/**
 * @class A component with custom HTML.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>html</code> Custom HTML</li>
 * </ul>
 * @augments DisplayObjectContainer
 */
CustomDisplayObject = DisplayObjectContainer.extend({

	setupDomObject : function(config) {
		this.domObject = JOOUtils.accessCustom(config.html);
	}
});

/**
 * @class A component into which can be painted.
 * @augments DisplayObject
 */
Graphic = DisplayObject.extend(
/** @lends Graphic# */
{

	setupDomObject : function(config) {
		this._super(config);
		this.setHtml(config.html);
	},

	getHtml : function() {
		return this.access().html();
	},

	setHtml : function(html) {
		this.repaint(html);
	},

	/**
	 * Clear & repaint the component.
	 * @param {String} html content to be repainted
	 */
	repaint : function(html) {
		this.access().html(html);
	},

	/**
	 * Paint (append) specific content to the component.
	 * @param {String} html content to be painted
	 */
	paint : function(html) {
		this.access().append(html);
	},

	/**
	 * Clear the current content.
	 */
	clear : function() {
		this.access().html("");
	},

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * Create a new Sketch
 * @class A concrete subclass of DisplayObjectContainer.
 * It is a counterpart of <code>HTML DIV</code> element
 * @augments DisplayObjectContainer
 */
Sketch = DisplayObjectContainer.extend(
/** @lends Sketch# */
{
	setupDomObject : function(config) {
		this._super(config);
	},

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * Create a new Panel
 * @class A panel, which has a <code>inline-block</code> display
 * @augments Sketch
 */
Panel = Sketch.extend({

});

ContextableInterface = InterfaceImplementor.extend({

	implement : function(obj) {
		obj.prototype.setupContextMenu = obj.prototype.setupContextMenu ||
		function() {
			if (!this.contextMenu) {
				this.contextMenu = new JOOContextMenu();
			}
		};

		obj.prototype.getContextMenu = obj.prototype.getContextMenu ||
		function() {
			return this.contextMenu;
		};

		obj.prototype.contextMenuHandler = obj.prototype.contextMenuHandler ||
		function(e) {
			e.preventDefault();
			this.getContextMenu().show(e.clientX + 2, e.clientY + 2);
			this.dispatchEvent("showContextMenu", e);
		};

		obj.prototype.attachContextMenu = obj.prototype.attachContextMenu ||
		function(useCapturePhase) {
			this.addChild(this.contextMenu);
			this.contextMenu.hide();
			this.addEventListener('contextmenu', function(e) {
				this.contextMenuHandler(e);
				e.stopPropagation();
			}, useCapturePhase);
			this.getContextMenu().addEventListener('click', function(e) {
				e.stopPropagation();
			}, useCapturePhase);
		};
	}
});

/**
 * @class Abstract base class for other UI controls. All UIComponent subclasses
 * is equipped with a {@link JOOContextMenu}
 * @augments DisplayObjectContainer
 */
UIComponent = DisplayObjectContainer.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.setupContextMenu();
	},

	removeAllChildren : function() {
		for (var i = this.children.length - 1; i >= 0; i--) {
			if (this.children[i] != this.getContextMenu()) {
				this.children[i].dispose();
			}
		}
		this.children = [this.getContextMenu()];
	},

	toHtml : function() {
		return "<div></div>";
	}
}).implement(ContextableInterface);

UIRenderInterface = InterfaceImplementor.extend({

	implement : function(obj) {
		obj.prototype.render = obj.prototype.render ||
		function() {
			JOOUtils.tmpl('UI-' + obj.className, obj.config);
		};
	}
});

/**
 * @class The Stage is a special UI component, which hosts, manages selection
 * and renders other UI components
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>allowMultiSelect</code> whether multi-selection is allowed</li>
 * </ul>
 * @augments UIComponent
 */
Stage = UIComponent.extend(
/** @lends Stage# */
{
	setupBase : function(config) {
		this.stage = this;
		this.id = config.id;
		this.allowMultiSelect = config.allowMultiSelect || true;
		this.selectedObjects = Array();
		this._super(config);
	},

	/**
	 * Get a list of current selected objects.
	 * @returns {Array} current selected objects
	 */
	getSelectedObjects : function() {
		return this.selectedObjects;
	},

	/**
	 * Delete all selected objects.
	 */
	deleteSelectedObjects : function() {
		for (var i = 0; i < this.selectedObjects.length; i++) {
			this.selectedObjects[i].stageDeselect();
			this.selectedObjects[i].selfRemove();
		}
		this.selectedObjects = Array();
		this.dispatchEvent('selectedChange');
	},

	/**
	 * Deselect specific selected object.
	 * <p>Usually developers should use the {@link SelectableInterface}
	 * rather than calling this method directly
	 * </p>
	 * @param {SelectableInterface} obj the object to be deselected.
	 * It <b>should</b> be a selected object.
	 */
	removeSelectedObject : function(obj) {
		if ( typeof obj['stageDeselect'] == 'undefined')
			throw 'Object ' + obj + ' is not deselectable';
		var index = this.selectedObjects.indexOf(obj);
		if (index != -1) {
			obj.selected = false;
			obj.stageDeselect();
			this.selectedObjects.splice(index, 1);
			this.dispatchEvent('selectedChange');
			/*
			 var subject = SingletonFactory.getInstance(Subject);
			 subject.notifyEvent('ObjectDeselected', obj);*/
		}
	},

	/**
	 * Deselect all objects, which is previously selected under this Stage.
	 */
	deselectAllObjects : function() {
		for (var i = 0; i < this.selectedObjects.length; i++) {
			this.selectedObjects[i].stageDeselect();
		}
		this.selectedObjects = Array();
		this.dispatchEvent('selectedChange');

		/*		var subject = SingletonFactory.getInstance(Subject);
		 subject.notifyEvent('AllObjectDeselected');*/
	},

	/**
	 * Add a component to the list of selected objects.
	 * It will call the <code>stageSelect</code> method
	 * of the component automatically.
	 * <p>
	 * If either <code>isMultiSelect</code> or <code>allowMultiSelect</code>
	 * is <code>false</code>, previously selected objects will be deselected.
	 * </p>
	 * @param {SelectableInterface} obj the object to selected
	 * @param {Boolean} isMultiSelect whether this selection is a multi-selection
	 */
	addSelectedObject : function(obj, isMultiSelect) {
		if ( typeof obj['stageSelect'] == 'undefined')
			throw 'Object ' + obj + ' is not selectable';
		if (this.selectedObjects.indexOf(obj) != -1)
			return;

		if (isMultiSelect == undefined)
			isMultiSelect = false;
		if (!this.allowMultiSelect || !isMultiSelect) {
			this.deselectAllObjects();
		}
		obj.selected = true;
		obj.stageSelect();
		this.selectedObjects.push(obj);
		this.dispatchEvent('selectedChange');

		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ObjectSelected', obj);
	},

	setupDomObject : function(config) {
		this.domObject = JOOUtils.access(this.id);
		this.access().addClass('joo-' + this.className.toLowerCase());
		this.access().addClass('joo-uicomponent');

		if (config.layout == undefined)
			config.layout = 'block';
		this.setLayout(config.layout);
		this.setupContextMenu();
	}
});

/**
 * Create a new Canvas
 * @class A counterpart of <code>HTML5 Canvas</code>
 * @augments DisplayObject
 */
Canvas = DisplayObject.extend({

	setupBase : function(config) {
		this.context = undefined;
		this._super(config);
	},

	getContext : function() {
		if (this.context == undefined) {
			this.context = new CanvasContext(this, "2d");
		}
		return this.context;
	},

	setWidth : function(width) {
		this.setAttribute('width', width);
	},

	setHeight : function(height) {
		this.setAttribute('height', height);
	},

	getWidth : function() {
		return this.getAttribute('width');
	},

	getHeight : function() {
		return this.getAttribute('height');
	},

	toHtml : function() {
		return "<canvas>Sorry, your browser does not support canvas</canvas>";
	}
});

/*
 * CanvasContext
 */
CanvasContext = Class.extend({

	init : function(canvas, dimension) {
		if (canvas.access().length == 0) {
			throw Error("From CanvasContext constructor: cannot init canvas context");
		}
		this.canvas = canvas;
		if (dimension == undefined) {
			dimension = "2d";
		}
		this.dimension = dimension;
		this.context = document.getElementById(canvas.getId()).getContext(dimension);
	},

	setTextAlign : function(align) {
		this.context.textAlign = align;
	},

	/*
	 * get&set fillStyle
	 */
	setFillStyle : function(color) {
		this.context.fillStyle = color;
	},

	getFillStyle : function() {
		return this.context.fillStyle;
	},

	/*
	 * get&set strokeStyle
	 */
	setStrokeStyle : function(color) {
		this.context.strokeStyle = color;
	},

	getStrokeStyle : function() {
		return this.context.strokeStyle;
	},

	/*
	 * get&set globalAlpha
	 */
	setGlobalAlpha : function(alpha) {
		this.context.globalAlpha = alpha;
	},

	getGlobalAlpha : function() {
		return this.context.globalAlpha;
	},
	/*
	 * get&set lineWidth
	 */
	setLineWidth : function(w) {
		this.context.lineWidth = w;
	},

	getLineWidth : function() {
		return this.context.lineWidth;
	},

	/*
	 * get&set lineCap
	 */
	setLineCap : function(cap) {
		this.context.lineCap = cap;
	},

	getLineCap : function() {
		return this.context.lineCap;
	},

	/*
	 * get&set lineJoin
	 */
	setLineJoin : function(j) {
		this.context.lineJoin = j;
	},

	getLineJoin : function() {
		return this.context.lineJoin;
	},

	/*
	 * get&set shadowOffsetX
	 */
	setShadowOffsetX : function(x) {
		this.context.shadowOffsetX = x;
	},

	getShadowOffsetX : function() {
		return this.context.shadowOffsetX;
	},

	/*
	 * get&set shadowOffsetY
	 */
	setShadowOffsetY : function(y) {
		this.context.shadowOffsetY = y;
	},

	getShadowOffsetY : function() {
		return this.context.shadowOffsetY;
	},

	/*
	 * get&set shadowBlur
	 */
	setShadowBlur : function(blur) {
		this.context.shadowBlur = blur;
	},

	getShadowBlur : function() {
		return this.context.shadowBlur;
	},

	/*
	 * get&set shadowColor
	 */
	setShadowColor : function(color) {
		this.context.shadowColor = color;
	},

	getShadowColor : function() {
		return this.context.shadowColor;
	},

	/*
	 * get&set globalCompositeOperation
	 */
	setGlobalCompositeOperation : function(v) {
		this.context.globalCompositeOperation = v;
	},

	getGlobalCompositeOperation : function() {
		return this.context.globalCompositeOperation;
	},

	clearRect : function(x, y, width, height) {
		this.context.clearRect(x, y, width, height);
	},

	fillRect : function(x, y, w, h) {
		this.context.fillRect(x, y, w, h);
	},

	strokeRect : function(x, y, w, h) {
		this.context.strokeRect(x, y, w, h);
	},

	beginPath : function() {
		this.context.beginPath();
	},

	closePath : function() {
		this.context.closePath();
	},

	stroke : function() {
		this.context.stroke();
	},

	fill : function() {
		this.context.fill();
	},

	getImageData : function(x, y, width, height) {
		return this.context.getImageData(x, y, width, height);
	},

	moveTo : function(x, y) {
		this.context.moveTo(x, y);
	},

	lineTo : function(x, y) {
		this.context.lineTo(x, y);
	},

	arc : function(x, y, radius, startAngle, endAngle, anticlockwise) {
		this.context.arc(x, y, radius, startAngle, endAngle, anticlockwise);
	},

	quadraticCurveTo : function(cp1x, cp1y, x, y) {
		this.context.quadraticCurveTo(cp1x, cp1y, x, y);
	},

	bezierCurveTo : function(cp1x, cp1y, cp2x, cp2y, x, y) {
		this.context.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, x, y);
	},

	drawRoundedRect : function(x, y, width, height, radius) {
		var ctx = this.context;
		ctx.beginPath();
		ctx.moveTo(x, y + radius);
		ctx.lineTo(x, y + height - radius);
		ctx.quadraticCurveTo(x, y + height, x + radius, y + height);
		ctx.lineTo(x + width - radius, y + height);
		ctx.quadraticCurveTo(x + width, y + height, x + width, y + height - radius);
		ctx.lineTo(x + width, y + radius);
		ctx.quadraticCurveTo(x + width, y, x + width - radius, y);
		ctx.lineTo(x + radius, y);
		ctx.quadraticCurveTo(x, y, x, y + radius);
		ctx.stroke();
		ctx.closePath();
	},

	drawCircle : function(x, y, radius) {
		var ctx = this.context;
		ctx.beginPath();
		ctx.arc(x, y, radius, 0, Math.PI * 2, true);
		if (ctx.fillStyle != undefined) {
			ctx.fill();
		}
		if (ctx.strokeStyle != undefined) {
			ctx.stroke();
		}
		ctx.closePath();
	},

	drawImage : function() {
		var ctx = this.context;
		ctx.drawImage.apply(ctx, arguments);
	},

	createLinearGradient : function(x1, y1, x2, y2) {
		return this.context.createLinearGradient(x1, y1, x2, y2);
	},

	createRadialGradient : function(x1, y1, r1, x2, y2, r2) {
		return this.context.createRadialGradient(x1, y1, r1, x2, y2, r2);
	},

	createPattern : function(image, type) {
		return this.context.createPattern(image, type);
	},

	save : function() {
		this.context.save();
	},

	restore : function() {
		this.context.restore();
	},

	rotate : function(angle) {
		this.context.rotate(angle);
	},

	scale : function(x, y) {
		this.context.scale(x, y);
	},

	transform : function(m11, m12, m21, m22, dx, dy) {
		this.context.transform(m11, m12, m21, m22, dx, dy);
	},

	setTransform : function(m11, m12, m21, m22, dx, dy) {
		this.context.setTransform(m11, m12, m21, m22, dx, dy);
	},

	clip : function() {
		this.context.clip();
	},

	setFont : function(font) {
		var fstr = "";
		if (font.getBold()) {
			fstr += "bold ";
		}
		if (font.getItalic()) {
			fstr += "italic ";
		}
		this.context.fillStyle = font.getColor();
		fstr += font.getFontSize() + " ";
		fstr += font.getFontFamily();
		this.context.font = fstr;
	},

	getFont : function() {
		var font = new Font();
		fstr = this.context.font;
		if (fstr.indexOf("bold") != -1 || fstr.indexOf("Bold") != -1) {
			font.setBold(true);
		}
		if (fstr.indexOf("italic") != -1 || fstr.indexOf("Italic") != -1) {
			font.setItalic(true);
		}
		var fontSize = fstr.match(/\b\d+(px|pt|em)/g);
		if (fontSize != null && fontSize.length > 0) {
			font.setFontSize(fontSize[0]);
		}
		var fontFamily = fstr.match(/\b\w+,\s?[a-zA-Z-]+\b/g);
		if (fontFamily != null && fontFamily.length > 0) {
			font.setFontFamily(fontFamily[0]);
		}
		return font;
	},

	getTextWidth : function(text) {
		return this.context.measureText(text).width;
	},

	getTextHeight : function(text) {
		//return this.context.measureText(text).width;
		throw "not yet implemented";
	},

	fillText : function(text, x, y, maxWidth) {
		if (maxWidth != undefined) {
			this.context.fillText(text, x, y, maxWidth);
		} else {
			this.context.fillText(text, x, y);
		}
	},

	strokeText : function(text, x, y, maxWidth) {
		if (maxWidth != undefined) {
			this.context.strokeText(text, x, y, maxWidth);
		} else {
			this.context.strokeText(text, x, y);
		}
	}
});

/**
 * @class A counterpart of <code>HTML HR</code> element
 * @augments DisplayObject
 */
Separator = DisplayObject.extend({

	toHtml : function() {
		return "<hr />";
	}
});
this.items = new Array();

/**
 * @class A menu item, which is attached with a command and
 * can be added to a {@link JOOMenu} or {@link JOOContextMenu}
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>command</code> A function which is called automatically when
 * 		the menu item is clicked
 * 	</li>
 * </ul>
 * @augments Sketch
 */
JOOMenuItem = Sketch.extend(
/** @lends JOOMenuItem# */
{

	setupDomObject : function(config) {
		this._super(config);
		if (config.lbl == undefined) {
			config.lbl = this.id;
		}
		this.setLbl(config.lbl);
		if (config.command != undefined) {
			//			if (typeof config.command == 'string') {
			//				config.command = new Function(config.command);
			//			}
			this.onclick = config.command;
		}
		this.addEventListener('click', this.onclick);
	},

	getLbl : function() {
		return this.access().html();
	},

	setLbl : function(lbl) {
		this._outputText(lbl);
	},

	_outputText : function(label) {
		this.access().html(label);
	},

	/**
	 * The default command, if no command is attached to this menu
	 * @param e
	 */
	onclick : function(e) {
	}
});

/**
 * @class A group of menu items or menus. Like its superclass {@link JOOMenuItem},
 * a menu can be attached with a command
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>icon</code> The icon of the menu</li>
 * </ul>
 * @augments JOOMenuItem
 */
JOOMenu = JOOMenuItem.extend(
/** @lends JOOMenu# */
{

	setupBase : function(config) {
		this.items = new Array();
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		this.menuHolder = new Sketch();
		this.addChild(this.menuHolder);
		this.menuHolder.access().hide();
		this.menuHolder.access().addClass('joo-menu-holder');
		this.isShown = false;
		this.access().removeClass('joo-joomenuitem');
	},

	_outputText : function(label) {
		if (this.config.icon != undefined)
			this.access().html('<a class="joo-menu-label"><img title="' + label + '" src="' + this.config.icon + '" /><span>' + label + '</span></a>');
		else
			this.access().html('<a class="joo-menu-label">' + label + '</a>');
	},

	/**
	 * Add a menu item or another menu to this menu
	 * @param {JOOMenuItem|JOOMenu} item the item to be added
	 */
	addItem : function(item) {
		this.items.push(item);
		this.menuHolder.addChild(item);
	},

	/**
	 * Get all menu items and submenus
	 * @returns {Array} an array of menu items & submenus
	 */
	getItems : function() {
		return this.items;
	},

	onclick : function(e) {
		e.stopPropagation();
		this.toggleMenuItems();
	},

	/**
	 * Toggle (show/hide) menu items
	 */
	toggleMenuItems : function() {
		if (this.isShown)
			this.hideMenuItems();
		else
			this.showMenuItems();
	},

	/**
	 * Show all menu items
	 */
	showMenuItems : function() {
		if (this.items.length > 0) {
			this.menuHolder.access().show();
			this.access().addClass('active');
			this.isShown = true;
			this.dispatchEvent('menuShown');
		}
	},

	/**
	 * Hide all menu items
	 */
	hideMenuItems : function() {
		this.menuHolder.access().hide();
		this.access().removeClass('active');
		this.isShown = false;
		this.dispatchEvent('menuHidden');
	}
});

/**
 * @class A set of menu, which is usually placed at the top of the application
 * @augments UIComponent
 */
JOOMenuBar = UIComponent.extend(
/** @lends JOOMenuBar# */
{
	setupBase : function(config) {
		this.items = new Array();
		this.activeMenus = 0;
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		$(window).bind('click', {
			_self : this
		}, this._hideAllMenus);
	},

	dispose : function(skipRemove) {
		$(window).unbind('click', this._hideAllMenus);
		this._super(skipRemove);
	},

	_hideAllMenus : function(e) {
		var _self = e.data ? e.data._self || this : this;
		_self.hideAllMenus();
	},

	/**
	 * Hide all menus and their menu items
	 */
	hideAllMenus : function() {
		for (var i = 0; i < this.items.length; i++) {
			this.items[i].hideMenuItems();
		}
	},

	/**
	 * Add a new menu to the bar
	 * @param {JOOMenu} item the menu to be added
	 */
	addItem : function(item) {
		this.items.push(item);
		this.addChild(item);
		var _self = this;
		item.addEventListener('menuShown', function() {
			_self.activeMenus++;
			_self.active = true;
		});
		item.addEventListener('menuHidden', function() {
			if (_self.activeMenus > 0)
				_self.activeMenus--;
			if (_self.activeMenus <= 0)
				_self.active = false;
		});
		item.addEventListener('mouseover', function() {
			if (_self.active) {
				_self.hideAllMenus();
				this.showMenuItems();
			}
		});
	},

	/**
	 * Get all menus of the bar
	 * @returns {Array} an array of menus this bar contains
	 */
	getItems : function() {
		return this.items;
	}
});

/**
 * @class A context (or popup) menu. It can be attached to any other components
 * @augments Sketch
 */
JOOContextMenu = Sketch.extend({

	setupBase : function(config) {
		this.items = new Array();
		this._super(config);
	},

	/**
	 * Add a menu item
	 * @param {JOOMenuItem} item a menu item to be added
	 */
	addItem : function(item) {
		this.items.push(item);
		var _self = this;
		item.addEventListener('click', function() {
			_self.hide();
		});
		this.addChild(item);
	},

	/**
	 * Get all menu items
	 * @returns {Array} an array of menu items of this context menu
	 */
	getItems : function() {
		return this.items;
	},

	/**
	 * Show the context menu at specific position
	 * @param {String|Number} x x position
	 * @param {String|Number} y y position
	 */
	show : function(x, y) {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ContextMenuShown', this);
		this.setLocation(x, y);
		this.access().show();
	},

	/**
	 * Hide the context menu
	 */
	hide : function() {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('ContextMenuHidden', this);
		this.access().hide();
	}
});

/**
 * @class A counterpart of <code>HTML IFRAME</code> element
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>src</code> The source of the iframe</li>
 * </ul>
 * @augments Sketch
 */
JOOIFrame = Sketch.extend(
/** @lends JOOIFrame# */
{
	setupBase : function(config) {
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		if (config.src)
			this.setSrc(config.src);
		this.setAttribute('name', this.getId());
	},

	/**
	 * Change source of the iframe
	 * @param {String} src new source (URL) of the iframe
	 */
	setSrc : function(src) {
		this.setAttribute('src', src);
	},

	/**
	 * Get the source of the iframe
	 * @returns {String} the source of the iframe
	 */
	getSrc : function() {
		return this.getAttribute('src');
	},

	toHtml : function() {
		return "<iframe></iframe>";
	}
});

/**
 * @class A counterpart of <code>HTML Form</code>
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>method</code> The method used when submitting the form</li>
 * 	<li><code>encType</code> The encoded type, the default type is <code>application/x-www-form-urlencoded</code></li>
 * </ul>
 * @augments Sketch
 */
JOOForm = Sketch.extend(
/** @lends JOOForm# */
{

	setupDomObject : function(config) {
		this._super(config);
		config.method = config.method || "post";
		config.encType = config.encType || "application/x-www-form-urlencoded";
		if (config.action)
			this.setAction(config.action);
		this.setMethod(config.method);
		this.setEncType(config.encType);
	},

	setAction : function(action) {
		this.setAttribute("action", action);
	},

	getAction : function() {
		return this.getAttribute("action");
	},

	setMethod : function(method) {
		this.setAttribute("method", method);
	},

	getMethod : function() {
		return this.getAttribute("method");
	},

	setEncType : function(encType) {
		this.setAttribute("enctype", encType);
	},

	getEncType : function() {
		return this.getAttribute("enctype");
	},

	/**
	 * Submit the form
	 */
	submit : function() {
		this.access().submit();
	},

	toHtml : function() {
		return "<form></form>";
	}
});

//ContainerWrapper = Class.extend({
//
//	wrap: function(container, obj) {
//		container.addChild(obj);
//		return container;
//	}
//});

InteractionControlHelper = {

	setDisableList : function(list) {
		this.list = list;
	},

	setInteractionAbility : function(enable) {
		this.disable = !enable;
	},

	getInteractionAbility : function(event) {
		if (!this.list)
			return !this.disable;
		return (!this.disable || !this.list[event]);
	}
};
/**
 * @class An interface which allows UI Component to be selectable.
 * @interface
 */
SelectableInterface = InterfaceImplementor.extend({

	implement : function(obj) {

		/**
		 * A protected method, define the behavior of the selection.
		 * By default, it does nothing. Subclass can override it to
		 * change the behavior.
		 */
		obj.prototype._select = obj.prototype._select ||
		function() {
		};

		/**
		 * A protected method, define the behavior of the de-selection.
		 * By default, it does nothing. Subclass can override it to
		 * change the behavior.
		 */
		obj.prototype._deselect = obj.prototype._deselect ||
		function() {
		};

		/**
		 * Select the component. Add the component to the stage's list of selection.
		 * @methodOf SelectableInterface#
		 * @name select
		 * @param {Boolean} isMultiSelect whether this is a multi-selection
		 */
		obj.prototype.select = obj.prototype.select ||
		function(isMultiSelect) {
			this.dispatchEvent('beforeSelected');
			if (this.blockSelect != true) {
				this.stage.addSelectedObject(this, isMultiSelect);
				this.dispatchEvent('afterSelected');
			}
		},

		/**
		 * Deselect the component. Remove the component from the stage's list of selection.
		 * @methodOf SelectableInterface#
		 * @name deselect
		 * @param {Boolean} isMultiSelect whether this is a multi-selection
		 */
		obj.prototype.deselect = obj.prototype.deselect ||
		function() {
			this.stage.removeSelectedObject(this);
		},

		/**
		 * This method is called internally by the Stage, before the
		 * component is actually selected.
		 * @methodOf SelectableInterface#
		 * @name stageSelect
		 */
		obj.prototype.stageSelect = obj.prototype.stageSelect ||
		function() {
			this.access().addClass('selected');
			this._select();
			this.dispatchEvent('selected');
		},

		/**
		 * This method is called internally by the Stage, before the
		 * component is actually deselected.
		 * @methodOf SelectableInterface#
		 * @name stageDeselect
		 */
		obj.prototype.stageDeselect = obj.prototype.stageDeselect ||
		function() {
			this.access().removeClass('selected');
			this._deselect();
			this.dispatchEvent('deselected');
		};
	}
});

/**
 * @class An interface which allows UI Component to be draggable.
 * @interface
 */
DraggableInterface = InterfaceImplementor.extend({

	implement : function(obj) {

		obj.prototype.onDrag = obj.prototype.onDrag ||
		function(e) {

		};

		obj.prototype.onDragStart = obj.prototype.onDragStart ||
		function(e) {

		};

		/**
		 * Make the component draggable. It position will be changed to absolute.
		 * @methodOf DraggableInterface#
		 * @name draggable
		 * @param {Object} param the parameters passed to the draggable engine
		 */
		obj.prototype.draggable = obj.prototype.draggable ||
		function(param) {
			this.access().draggable(param);
			this.setStyle('position', 'absolute');
		};

		/**
		 * A method called before the component is dragged. Override this method
		 * to change the behavior.
		 * @methodOf DraggableInterface#
		 * @name beforeStartDragging
		 * @param e the event
		 */
		obj.prototype.beforeStartDragging = obj.prototype.beforeStartDragging ||
		function(e) {
		};

		/**
		 * Enable dragging.
		 * @methodOf DraggableInterface#
		 * @name startDrag
		 * @param {Object} param the parameters passed to the draggable engine
		 */
		obj.prototype.startDrag = obj.prototype.startDrag ||
		function(param) {
			var _self = this;
			this.setStyle('position', 'absolute');
			this.access().draggable({
				drag : function(e) {
					_self.isDragging = true;
					_self.onDrag(e);
				},
				start : function(e) {
					_self.onDragStart(e);
				},
				beforeStart : function(e) {
					_self.beforeStartDragging(e);
				}
			});
			this.access().draggable(param || "enable");
		};

		/**
		 * Disable dragging.
		 * @methodOf DraggableInterface#
		 * @name stopDrag
		 */
		obj.prototype.stopDrag = obj.prototype.stopDrag ||
		function() {
			this.access().draggable("disable");
		};
	},
});

DraggableWrapper = {

	wrap : function(obj) {
		obj.currentClass.implement(DraggableInterface);
	}
};

/**
 * @class An interface which allows UI Component to be droppable
 * by another draggable component.
 * @interface
 */
DroppableInterface = InterfaceImplementor.extend({

	implement : function(obj) {

		/**
		 * Make the component droppable.
		 * @methodOf DroppableInterface#
		 * @name droppable
		 * @param {Object} param the parameters passed to the droppable engine
		 */
		obj.prototype.droppable = obj.prototype.droppable ||
		function(param) {
			this.access().droppable(param);
			this.setLayout('absolute');
		};
	}
});

DroppableWrapper = {
	wrap : function(obj) {
		obj.currentClass.implement(DroppableInterface);
	}
};

RotateIcon = Sketch.extend({

	setupBase : function(config) {
		this.container = config.container;
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		this.baseRotate = new Sketch();
		this.baseRotate.access().addClass("joo-base-rotate");
		this.alignRotate = new Sketch();
		this.alignRotate.access().addClass("joo-align-rotate");

		this.initialControlX = 50;
		this.initialControlY = 5.5;
		this.controlRotate = new Sketch();
		this.controlRotate.access().addClass("joo-control-rotate");
		this.controlRotate.setLocation(this.initialControlX, this.initialControlY);
		//		DraggableWrapper.wrap(this.controlRotate);
		//		this.controlRotate.draggable();

		var baseX = this.baseRotate.getX();
		var baseY = this.baseRotate.getY();
		var controlX = this.controlRotate.getX();
		var controlY = this.controlRotate.getY();
		if (controlX == 0)
			controlX = this.initialControlX;
		if (controlY == 0)
			controlY = this.initialControlY;
		var distance = MathUtil.getDistance({
			x : baseX + 9,
			y : baseY + 9
		}, {
			x : controlX + 4.5,
			y : controlY + 4.5
		});
		this.alignRotate.setWidth(distance);

		this.addChild(this.baseRotate);
		this.addChild(this.alignRotate);
		this.addChild(this.controlRotate);
		this.dragging = false;
	},

	registerEvent : function() {
		if (!this.dragging) {
			this.addEventListener('mousedown', function(e) {
				e.stopPropagation();
				this.container.changeTransformOrigin('center');
				$(window).bind("mousemove", {
					_self : this
				}, this.mouseMoveHandler);
				this.addEventListener("mousemove", this.mouseMoveHandler);
				this.dragging = true;
			});
		}
	},

	unregisterEvent : function() {
		if (this.dragging) {
			$(window).unbind("mousemove", this.mouseMoveHandler);
			this.removeEventListener("mousemove", this.mouseMoveHandler);
			this.dragging = false;
		}
	},

	updateArea : function(e) {
		this.newW = e.w || this.newW;
		this.newH = e.h || this.newH;

		var ctrlBtnOffset = -9;
		this.setLocation(this.newW / 2 + ctrlBtnOffset, this.newH / 2 + ctrlBtnOffset);
	},

	mouseMoveHandler : function(e) {
		var _self = this;
		if (e.data != undefined) {
			_self = e.data._self || this;
		}
		var baseX = _self.baseRotate.transformedOffset().x;
		var baseY = _self.baseRotate.transformedOffset().y;
		var controlX = e.pageX;
		var controlY = e.pageY;
		var angle = MathUtil.getAngle({
			x : baseX + 9,
			y : baseY + 9
		}, {
			x : controlX,
			y : controlY
		}, true);
		_self.dispatchEvent('areaChanged', {
			a : angle,
			base : {
				x : baseX + 9,
				y : baseY + 9
			}
		});
		//_self.controlRotate.setX(MathUtil.getDistance({x: baseX+9, y: baseY+9}, {x: controlX, y: controlY}));
	}
});

ResizeIcon = Sketch.extend({

	setupBase : function(config) {
		this.pos = config.pos;
		this.container = config.container;
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		this.access().addClass("unselectable");
		this.access().addClass("joo-move-icon");
		this.setStyle("cursor", this.pos + "-resize");
		this.dragging = false;
	},

	registerEvent : function() {
		this.addEventListener('mousedown', function(e) {
			e.stopPropagation();
			this.container.changeTransformOrigin('topLeft');
			$(window).bind("mousemove", {
				_self : this
			}, this.mouseMoveHandler);
			this.addEventListener("mousemove", this.mouseMoveHandler);
			this.dragging = true;
		});
	},

	unregisterEvent : function() {
		if (this.dragging) {
			$(window).unbind("mousemove", this.mouseMoveHandler);
			this.removeEventListener("mousemove", this.mouseMoveHandler);
			this.dragging = false;
		}
	},

	updateArea : function(e) {
		this.newW = e.w || this.newW;
		this.newH = e.h || this.newH;

		var ctrlBtnOffset = -4;
		switch(this.pos) {
			case 'n':
				this.setLocation(this.newW / 2 + ctrlBtnOffset, ctrlBtnOffset);
				break;
			case 'ne':
				this.setLocation(this.newW + ctrlBtnOffset, ctrlBtnOffset);
				break;
			case 'e':
				this.setLocation(this.newW + ctrlBtnOffset, this.newH / 2 + ctrlBtnOffset);
				break;
			case 'se':
				this.setLocation(this.newW + ctrlBtnOffset, this.newH + ctrlBtnOffset);
				break;
			case 's':
				this.setLocation(this.newW / 2 + ctrlBtnOffset, this.newH + ctrlBtnOffset);
				break;
			case 'sw':
				this.setLocation(ctrlBtnOffset, this.newH + ctrlBtnOffset);
				break;
			case 'w':
				this.setLocation(ctrlBtnOffset, this.newH / 2 + ctrlBtnOffset);
				break;
			case 'nw':
				this.setLocation(ctrlBtnOffset, ctrlBtnOffset);
				break;
			default:
		}
	},

	mouseMoveHandler : function(e) {
		var _self = this;
		if (e.data != undefined) {
			_self = e.data._self || this;
		}
		var method = 'mouseMoveHandler' + _self.pos.toUpperCase();
		if ( typeof _self[method] != 'undefined') {
			_self[method].call(_self, e);
			_self.dragging = true;
		}
	},

	mouseMoveHandlerN : function(e) {
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		var incx = pos.y * Math.sin(angle);
		var incy = pos.y * Math.cos(angle);
		this.newH = this.container.getHeight() - pos.y;
		this.dispatchEvent('areaChanged', {
			x : this.container.getX() - incx,
			y : this.container.getY() + incy,
			h : this.newH
		});
	},

	mouseMoveHandlerNW : function(e) {
		var pos = this.getContainerDeltaPosition(e);
		var baseOff = this.container._parent.offset();
		this.newW = this.container.getWidth() - pos.x;
		this.newH = this.container.getHeight() - pos.y;
		this.dispatchEvent('areaChanged', {
			x : e.pageX - baseOff.x,
			y : e.pageY - baseOff.y,
			h : this.newH,
			w : this.newW
		});
	},

	mouseMoveHandlerW : function(e) {
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		var incx = pos.x * Math.cos(angle);
		var incy = pos.x * Math.sin(angle);
		this.dispatchEvent('areaChanged', {
			x : this.container.getX() + incx,
			y : this.container.getY() + incy,
			w : this.container.getWidth() - pos.x
		});
	},

	mouseMoveHandlerSW : function(e) {
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		this.newW = -pos.x + this.container.getWidth();
		this.newH = pos.y;
		var incx = pos.x * Math.cos(angle);
		var incy = pos.x * Math.sin(angle);
		this.dispatchEvent('areaChanged', {
			x : this.container.getX() + incx,
			y : this.container.getY() + incy,
			w : this.newW,
			h : this.newH
		});
	},

	mouseMoveHandlerS : function(e) {
		var pos = this.getContainerDeltaPosition(e);
		this.newH = pos.y;
		this.dispatchEvent('areaChanged', {
			h : this.newH
		});
	},

	mouseMoveHandlerSE : function(e) {
		var pos = this.getContainerDeltaPosition(e);
		this.newW = pos.x;
		this.newH = pos.y;
		this.dispatchEvent('areaChanged', {
			w : this.newW,
			h : this.newH
		});
	},

	mouseMoveHandlerE : function(e) {
		var pos = this.getContainerDeltaPosition(e);
		this.newW = pos.x;
		this.dispatchEvent('areaChanged', {
			w : this.newW
		});
	},

	mouseMoveHandlerNE : function(e) {
		var pos = this.getContainerDeltaPosition(e);
		var angle = this.container.getRotation() * Math.PI / 180;
		this.newW = pos.x;
		this.newH = -pos.y + this.container.getHeight();
		var incx = pos.y * Math.sin(angle);
		var incy = pos.y * Math.cos(angle);

		this.dispatchEvent('areaChanged', {
			h : this.newH,
			w : this.newW,
			x : this.container.getX() - incx,
			y : this.container.getY() + incy
		});
	},

	getContainerDeltaPosition : function(e) {
		var selfPos = this.container.offset();
		return getPositionInRotatedcoordinate({
			x : e.pageX - selfPos.x,
			y : e.pageY - selfPos.y
		}, Math.PI * this.container.getRotation() / 180);
	},

	getContainerOffsetPosition : function(newW, newH) {
		var newCenterPoint = getPositionFromRotatedCoordinate({
			x : (newW - this.container.getWidth()) / 2,
			y : (newH - this.container.getHeight()) / 2
		}, Math.PI * this.container.getRotation() / 180, this.container.getRotationCenterPoint());
		var res = getPositionFromRotatedCoordinate({
			x : -newW / 2,
			y : -newH / 2
		}, Math.PI * this.container.getRotation() / 180, newCenterPoint);
		return res;
	}
});

ResizeIconSet = Class.extend({

	init : function(container, pos, config) {
		this.resizebtns = Array();
		this.container = config.container = container;
		for (var i = 0; i < pos.length; i++) {
			config.pos = pos[i];
			this.resizebtns.push(new ResizeIcon(config));
		}
	},

	addChild : function(icon) {
		icon.container = this.container;
		this.resizebtns.push(icon);
	},

	getButtons : function() {
		return this.resizebtns;
	},

	updateArea : function(e) {
		for (var i = 0; i < this.resizebtns.length; i++) {
			this.resizebtns[i].updateArea(e);
		}
	},

	registerEvent : function() {
		for (var i = 0; i < this.resizebtns.length; i++) {
			this.resizebtns[i].registerEvent();
		}
	},

	unregisterEvent : function() {
		for (var i = 0; i < this.resizebtns.length; i++) {
			this.resizebtns[i].unregisterEvent();
		}
	},

	show : function() {
		for (var i = 0; i < this.resizebtns.length; i++) {
			this.resizebtns[i].access().show();
		}
	},

	hide : function() {
		for (var i = 0; i < this.resizebtns.length; i++) {
			this.resizebtns[i].access().hide();
		}
	}
});

ResizableInterface = InterfaceImplementor.extend({

	implement : function(obj) {

		obj.prototype.updateArea = obj.prototype.updateArea ||
		function(e) {
			this.canvasW = this.canvasW || e.w;
			this.canvasH = this.canvasH || e.h;

			this.doUpdateArea(e);
			e.w = this.access().outerWidth();
			e.h = this.access().outerHeight();
			this.resizeset.updateArea(e);
		};

		obj.prototype.doUpdateArea = obj.prototype.doUpdateArea ||
		function(e) {
			if (e.a != undefined) {
				this.setRotation(e.a);
			} else {
				var deltaW = this.access().outerWidth() - this.getWidth();
				var deltaH = this.access().outerHeight() - this.getHeight();
				if (e.x) {
					this.setX(e.x);
				}
				if (e.y)
					this.setY(e.y);
				if (e.h)
					this.setHeight(e.h - deltaH);
				if (e.w)
					this.setWidth(e.w - deltaW);
			}
		};

		obj.prototype.showResizeControl = obj.prototype.showResizeControl ||
		function() {
			this.resizeset.show();
		}, obj.prototype.hideResizeControl = obj.prototype.hideResizeControl ||
		function() {
			this.resizeset.hide();
		}, obj.prototype.onDeleteHandler = obj.prototype.onDeleteHandler ||
		function(e) {
			this.dispose();
		};

		obj.prototype.onMouseUpHandler = obj.prototype.onMouseUpHandler ||
		function(e) {
		};

		obj.prototype.onMouseDownHandler = obj.prototype.onMouseDownHandler ||
		function(e) {
		};

		obj.prototype.beginEditable = obj.prototype.beginEditable ||
		function(defaultW, defaultH, resizeIcon, includeRotate) {
			this.rotationCenter = {
				x : 0.5,
				y : 0.5
			};
			if (resizeIcon == undefined)
				resizeIcon = ['n', 'nw', 'w', 'sw', 's', 'e', 'se', 'ne'];
			this.defaultW = defaultW || 150;
			this.defaultH = defaultH || 150;

			this.resizeset = new ResizeIconSet(this, resizeIcon, {
				minW : 0,
				minH : 0,
				maxW : Number.MAX_VALUE,
				maxH : Number.MAX_VALUE
			});
			if (includeRotate)
				this.resizeset.addChild(new RotateIcon());
			this.setStyle('position', 'absolute');

			this.access().addClass('joo-init-transform');
			this.access().addClass("joo-editable-component");

			var _self = this;

			$(document).bind("mouseup", function() {
				_self.dispatchEvent('resizeStop');
				_self.changeTransformOrigin('center');
				_self.onMouseUpHandler();
				_self.resizeset.unregisterEvent();
			});

			for (var i = 0; i < this.resizeset.getButtons().length; i++) {
				this.resizeset.getButtons()[i].addEventListener('mousedown', function(e) {
					_self.stopDrag();
					_self.onMouseDownHandler(e);
					_self.dispatchEvent('resizestart');
				});

				this.resizeset.getButtons()[i].addEventListener('mouseup', function(e) {
					_self.dispatchEvent('resizestop');
				});

				this.resizeset.getButtons()[i].addEventListener('stylechange', function(e) {
					e.stopPropagation();
				});

				this.resizeset.getButtons()[i].addEventListener('areaChanged', function(e) {
					if (e.w != undefined) {
						if (e.w > _self.maxW)
							e.w = _self.maxW;
						else if (e.w < _self.minW)
							e.w = _self.minW;
					}

					if (e.h != undefined) {
						if (e.h > _self.maxH)
							e.h = _self.maxH;
						else if (e.h < _self.minH)
							e.h = _self.minH;
					}

					if (e.x != undefined) {
						var minX = _self.access().offset().x + _self.getWidth() - _self.maxW;
						var maxX = _self.access().offset().x + _self.getWidth() - _self.minW;
						if (e.x < minX)
							e.x = minX;
						else if (e.x > maxX)
							e.x = maxX;
					}

					if (e.y != undefined) {
						var minY = _self.offset().y + _self.getHeight() - _self.maxH;
						var maxY = _self.offset().y + _self.getHeight() - _self.minH;
						if (e.y < minY)
							e.y = minY;
						else if (e.y > maxY)
							e.y = maxY;
					}
					_self.updateArea(e);
				});
			}
			this.resizeset.registerEvent();
			this.dispatchEvent('resizeStart');

			for (var i = 0; i < this.resizeset.getButtons().length; i++) {
				this.addChild(this.resizeset.getButtons()[i]);
			}
			this.updateArea({
				w : this.defaultW,
				h : this.defaultH
			});
		};
	}
});

EffectableInterface = InterfaceImplementor.extend({

	implement : function(obj) {
		obj.prototype.runEffect = obj.prototype.runEffect ||
		function(effect, options, speed) {
			this.access().effect(effect, options, speed);
		};
	}
});

ParentStylePropertiesMutator = Class.extend({

	setProperty : function(obj, name, value) {
		obj._parent.setStyle(name, value);
	}
});

StylePropertiesMutator = Class.extend({

	setProperty : function(obj, name, value) {
		obj.setStyle(name, value);
	}
});

StyleCSS3PropertiesMutator = Class.extend({

	setProperty : function(obj, name, value) {
		obj.setCSS3Style(name, value);
	}
});

AttrPropertiesMutator = Class.extend({

	setProperty : function(obj, name, value) {
		obj.setAttribute(name, value);
	}
});

EffectPropertiesMutator = Class.extend({

	setProperty : function(obj, name, value) {
		Wrapper.wrap(obj, EffectableInterface);
		obj._effect = value;
		obj.runEffect(value, {
			time : 1
		}, 500);
		setTimeout(function() {
			obj.access().show();
		}, 750);
	}
});

ToggleAttrPropertiesMutator = Class.extend({

	setProperty : function(obj, name, value) {
		if (value)
			obj.setAttribute(name, '');
		else
			obj.removeAttribute(name);
	}
});

ParentStylePropertiesAccessor = Class.extend({

	getProperty : function(obj, name) {
		return obj._parent.getComputedStyle(name);
	}
});

StylePropertiesAccessor = Class.extend({

	getProperty : function(obj, name) {
		return obj.getComputedStyle(name);
	}
});

StyleCSS3PropertiesAccessor = Class.extend({

	getProperty : function(obj, name) {
		return obj.getComputedStyle(name);
	}
});

AttrPropertiesAccessor = Class.extend({

	getProperty : function(obj, name) {
		return obj.getAttribute(name);
	}
});

EffectPropertiesAccessor = Class.extend({

	getProperty : function(obj, name) {
		return obj._effect;
	}
});

ToggleAttrPropertiesAccessor = Class.extend({

	getProperty : function(obj, name) {
		return obj.hasAttribute(name);
	}
});

Preset = Class.extend({

	init : function() {
		this.name = "Preset";
		this.changed = {};
		this.oldValue = {};
	},

	apply : function(obj) {
		for (var i in this.changed) {
			this.oldValue[i] = obj.getStyle(i);
			obj.setStyle(i, this.changed[i]);
			this.changed[i] = obj.getStyle(i);
		}
	},

	revert : function(obj) {
		for (var i in this.changed) {
			var style = obj.getStyle(i);
			if (style == this.changed[i]) {
				obj.setStyle(i, this.oldValue[i]);
			}
		}
	},

	getName : function() {
		return this.name;
	},

	toString : function() {
		return this.name;
	}
});

LinkButtonPreset = Preset.extend({

	init : function() {
		this._super();
		this.name = "LinkButton";
		this.changed = {
			'border' : 'none',
			'background-color' : 'transparent',
			'color' : '#069',
			'text-decoration' : 'underline',
			'background-image' : 'none'
		};
	}
});

MacButtonPreset = Preset.extend({

	init : function() {
		this._super();
		this.name = "MacButton";
		this.changed = {
			'border-radius' : '5px',
			'color' : 'black',
			'border-width' : '1px',
			'border-color' : '#ccc',
			'border-style' : 'solid',
			'background-color' : '#ccc',
			'background-image' : 'none'
		};
	}
});

TextHeaderPreset = Preset.extend({

	init : function() {
		this._super();
		this.name = "TextHeader";
		this.changed = {
			'font-size' : '20px',
			'font-weight' : 'bold'
		};
	}
});

TextSectionPreset = Preset.extend({

	init : function() {
		this._super();
		this.name = "TextSection";
		this.changed = {
			'font-size' : '16px',
			'font-weight' : 'bold',
			'color' : '#069'
		};
	}
});

PresetPropertiesMutator = Class.extend({

	setProperty : function(obj, k, v) {
		Wrapper.wrap(obj, PresetInterface);
		if (v == undefined || v == 'none') {
			obj.revertPreset();
		} else {
			var preset = new window[v + "Preset"]();
			obj.applyPreset(preset);
		}
	}
});

PresetPropertiesAccessor = Class.extend({

	getProperty : function(obj, k) {
		if (obj._preset != undefined)
			return obj._preset.name;
	}
});

PresetInterface = InterfaceImplementor.extend({

	implement : function(obj) {
		obj.prototype.applyPreset = obj.prototype.applyPreset ||
		function(preset) {
			this.revertPreset();
			this._preset = preset;
			this._preset.apply(this);
		};

		obj.prototype.revertPreset = obj.prototype.revertPreset ||
		function() {
			if (this._preset != undefined) {
				this._preset.revert(this);
				this._preset = undefined;
			}
		};
	}
});

PropertiesEncapsulationInterface = InterfaceImplementor.extend({

	implement : function(obj) {

		obj.prototype.getSupportedProperties = obj.prototype.getSupportedProperties ||
		function() {
			return this.supportedProperties;
		};

		obj.prototype.setProperty = obj.prototype.setProperty ||
		function(property, value) {
			var className = property.type.substr(0, 1).toUpperCase() + property.type.substr(1) + 'PropertiesMutator';
			if (window[className] != undefined)
				new window[className]().setProperty(this, property.name, value);
		};

		obj.prototype.getProperty = obj.prototype.getProperty ||
		function(property) {
			var className = property.type.substr(0, 1).toUpperCase() + property.type.substr(1) + 'PropertiesAccessor';
			if (window[className] != undefined)
				return new window[className]().getProperty(this, property.name);
		};
	}
});

MaskableInterface = InterfaceImplementor.extend({

	implement : function(obj) {

		obj.prototype.addMask = obj.prototype.addMask ||
		function(background, alpha) {
			background = background || "black";
			alpha = alpha || "0.2";
			var sketch = new Sketch({
				width : '100%',
				height : '100%',
				'background-color' : background
			});
			sketch.setStyle('opacity', alpha);
			sketch.setStyle('position', 'absolute');
			sketch.setStyle('z-index', '50');
			sketch.setLocation(0, 0);
			this.addChild(sketch);
		};
	}
});
/**
 * @class An editable textbox. This component allows user to change the text
 * by doubleclicking it, and when it losts user's focus, it also lost
 * the editing capabilities.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>readonly</code> Whether the component is readonly</li>
 * 	<li><code>blurEvent</code> The event when the component losts editing capabilities</li>
 * </ul>
 * @augments UIComponent
 */
JOOText = UIComponent.extend(
/** @lends JOOText# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.text = new Sketch();
		if (config.lbl)
			this.setLbl(config.lbl);

		if (!config.readonly) {
			this.addEventListener('dblclick', function() {
				this.enableEdit(true);
			});
			this.text.addEventListener('dblclick', function() {
				this._parent.enableEdit(true);
			});
			this.text.addEventListener('keyup', function() {
				var old = this._parent.config.lbl;
				this._parent.config.lbl = this.access().html();
				if (old != this._parent.config.lbl)
					this._parent.dispatchEvent('change');
			});
		}

		this.text.access().addClass("text");
		if (!config.readonly && config.blurEvent) {
			this.addEventListener(config.blurEvent, function() {
				this.enableEdit(false);
			});
		}
		this.addChild(this.text);

		this.text.addEventListener("stageUpdated", function() {
			var _div = document.getElementById(this.getId());
			_div.onfocus = function() {
				window.setTimeout(function() {
					var sel, range;
					if (window.getSelection && document.createRange) {
						range = document.createRange();
						range.selectNodeContents(_div);
						sel = window.getSelection();
						sel.removeAllRanges();
						sel.addRange(range);
					} else if (document.body.createTextRange) {
						range = document.body.createTextRange();
						range.moveToElementText(_div);
						range.select();
					}
				}, 1);
			};
		});
		//		this.attachContextMenu();
		//		var _self = this;
		//		this.getContextMenu().addItem(new JOOMenuItem({label: 'Edit text', command: function() {
		//			_self.enableEdit(true);
		//			_self.getContextMenu().hide();
		//		}}));
	},

	setLbl : function(lbl) {
		this.setValue(lbl);
	},

	getLbl : function() {
		return this.getValue();
	},

	setValue : function(lbl) {
		this.text.access().html(lbl);
	},

	/**
	 * Get the value of the text
	 * @returns {String} the text value
	 */
	getValue : function() {
		return this.text.access().html();
	},

	/**
	 * Enable/Disable editing
	 * @param {Boolean} b Whether the editing is enable
	 */
	enableEdit : function(b) {
		if (b)
			this.text.access().focus();
		this.text.access()[0].contentEditable = b;
	}
});

/**
 * @class A simple video player, counterpart of <code>HTML5 VIDEO</code>
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>src</code> The source of the video</li>
 * 	<li><code>controls</code> Whether the controls are visible</li>
 * </ul>
 * @augments UIComponent
 */
JOOVideo = UIComponent.extend(
/** @lends JOOVideo# */
{
	setupDomObject : function(config) {
		this._super(config);
		if (config.controls) {
			this.setControls(config.controls);
		}
		if (config.src) {
			this.setSrc(config.src);
		}
	},

	setControls : function(controls) {
		this.setAttribute('controls', controls);
	},

	getControls : function() {
		return this.getAttribute('controls');
	},

	setSrc : function(src) {
		this.setAttribute('src', src);
	},

	getSrc : function() {
		return this.getAttribute('src');
	},

	/**
	 * Play the video
	 */
	play : function() {
		if (!this._domObject) {
			this._domObject = document.getElementById(this.getId());
		}
		if (this._domObject) {
			this._domObject.play();
		}
	},

	stop : function() {
		if (!this._domObject) {
			this._domObject = document.getElementById(this.getId());
		}
		this._domObject.pause();
		this._domObject.currentTime = 0.0;
	},

	pause : function() {
		if (!this._domObject) {
			this._domObject = document.getElementById(this.getId());
		}
		this._domObject.pause();
		return this._domObject.currentTime;
	},

	toHtml : function() {
		return "<video></video>";
	},

	dispose : function(skipRemove) {
		try {
			this.stop();
			this._super(skipRemove);
		} catch (err) {
		}
	}
});

/**
 * @class A simple audio player, extending the {@link JOOVideo}.
 * @augments JOOVideo
 */
JOOAudio = JOOVideo.extend({

	toHtml : function() {
		return "<audio></audio>";
	}
});

/**
 * @class A counterpart of <code>HTML A</code> element.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>href</code> The URL the link goes to</li>
 * 	<li><code>lbl</code> The label of the link</li>
 * </ul>
 * @augments UIComponent
 */
JOOLink = UIComponent.extend({

	setupDomObject : function(config) {
		this._super(config);
		if (config.href)
			this.setAttribute('href', config.href);
		if (config.lbl)
			this.access().html(config.lbl);
	},

	toHtml : function() {
		return "<a></a>";
	}
});

/**
 * @class A counterpart of <code>HTML IMG</code> element.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>defaultSrc</code> The default source of the image,
 * 	if the provided source is broken</li>
 * 	<li><code>src</code> The source of the image</li>
 * </ul>
 * @augments UIComponent
 */
JOOImage = UIComponent.extend(
/** @lends JOOImage# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.defaultSrc = config.defaultSrc;
		config.src = config.src || this.defaultSrc;
		this.setSrc(config.src);
		if (this.defaultSrc) {
			this.addEventListener('error', function() {
				this.setSrc(this.defaultSrc);
			});
		}
	},

	toHtml : function() {
		return "<img />";
	},

	/**
	 * Get the source of the image
	 * @returns {String} the image source
	 */
	getSrc : function() {
		return this.getAttribute('src');
	},

	/**
	 * Change the source of the image
	 * @param {String} src the new image source
	 */
	setSrc : function(src) {
		this.setAttribute('src', src);
	}
});

/**
 * @class A base class for all components which accept user input
 * by any means.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>value</code> The value of the input</li>
 * 	<li><code>name</code> The name of the input</li>
 * </ul>
 * @augments UIComponent
 */
JOOInput = UIComponent.extend(
/** @lends JOOInput# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.access().val(config.value);
		if (config.name)
			this.setName(config.name);
		if (config.placeholder)
			this.setPlaceholder(config.placeholder);
	},

	setPlaceholder : function(placeholder) {
		this.setAttribute('placeholder', placeholder);
	},

	getPlaceholder : function() {
		return this.getAttribute('placeholder');
	},

	/**
	 * Change the value of the input
	 * @param {Object} value new value
	 */
	setValue : function(value) {
		var oldValue = this.access().val();
		if (oldValue != value) {
			this.access().val(value).change();
		}
	},

	/**
	 * Get the value of the input
	 * @returns {Object} the input value
	 */
	getValue : function() {
		return this.access().val();
	},

	setName : function(name) {
		this.setAttribute('name', name);
	},

	/**
	 * Get the name of the input
	 * @returns {String} the input name
	 */
	getName : function() {
		return this.getAttribute('name');
	},

	/**
	 * Focus the input
	 */
	focus : function() {
		this.access().focus();
	}
});

/**
 * @class An input which provides an area
 * for user to enter text. It is the counterpart
 * of <code>HTML TEXTAREA</code> element.
 */
JOOTextArea = JOOInput.extend(
/** @lends JOOTextArea# */
{

	toHtml : function() {
		return "<textarea></textarea>";
	},

	/**
	 * Alias of <code>getValue</code>
	 * @returns {String} the value of the textarea
	 */
	getText : function() {
		return this.getValue();
	}
});

/**
 * @class A counterpart of <code>HTML LABEL</code> element.
 * @augments UIComponent
 */
JOOLabel = UIComponent.extend(
/** @lends JOOLabel# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.setLbl(config.lbl);
	},

	setLbl : function(lbl) {
		this.access().html(lbl);
	},

	getLbl : function() {
		return this.access().html();
	},

	toHtml : function() {
		return "<label></label>";
	},

	/**
	 * Get the text of the label
	 * @returns {String} the label's text
	 */
	getText : function() {
		return this.getLbl();
	},

	/**
	 * Change the text of the label
	 * @param {String} txt the new text
	 */
	setText : function(txt) {
		this.setLbl(txt);
	}
});

/**
 * @class A counterpart of <code>HTML INPUT TEXT</code>
 * @augments JOOInput
 */
JOOTextInput = JOOInput.extend({

	toHtml : function() {
		return "<input type='text' />";
	}
});

/**
 * @class A counterpart of <code>HTML INPUT PASSWORD</code>
 * @augments JOOInput
 */
JOOPasswordInput = JOOInput.extend({

	toHtml : function() {
		return "<input type='password' />";
	}
});

/**
 * @class An input associated with a label.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>labelObject</code> the label object, if not specified a new label will be created using the same configuration parameters as this object</li>
 * 	<li><code>inputObject</code> the input object, if not specified a new text input will be created using the same configuration parameters as this object</li>
 * </ul>
 * @augments JOOInput
 */
JOOInputBox = JOOInput.extend(
/** @lends JOOInput# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.label = config.labelObject || new JOOLabel(config);
		this.input = config.inputObject || new JOOTextInput(config);
		this.addChild(this.label);
		this.addChild(this.input);
	},

	/**
	 * Get the value of the input
	 * @returns {Object} the input value
	 */
	getValue : function() {
		return this.input.getValue();
	},

	/**
	 * Change the value of the input
	 * @param value {Object} the new input value
	 */
	setValue : function(value) {
		this.input.setValue(value);
	},

	/**
	 * Get the text of the label
	 * @returns {String} the label's text
	 */
	getLabel : function() {
		return this.label.getValue();
	},

	/**
	 * Get the name of the input
	 * @returns the input's name
	 */
	getName : function() {
		return this.input.getName();
	},

	focus : function() {
		this.input.focus();
	}
});

JOOSelectOption = Graphic.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.repaint(config.label);
		this.setValue(config.value);
	},

	getValue : function() {
		return this.getAttribute("value");
	},

	setValue : function(value) {
		var old = this.getAttribute("value");
		if (old != value) {
			this.setAttribute("value", value);
			this.dispatchEvent('change');
		}
	},

	toHtml : function() {
		return "<option></option>";
	}
});

/**
 * @class A counterpart of <code>HTML SELECT</code> element.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>options</code> Initial options of this select box. It must be an <code>Array</code>
 * 		which each element is an object with <code>label</code> and <code>value</code> properties.
 * 	</li>
 * 	<li><code>selectedIndex</code> The initially selected index, defaults is 0</li>
 * 	<li><code>selectedValue</code> The initially selected value. Should not present if <code>selectedIndex</code> is already specified.</li>
 * </ul>
 * @augments JOOInput
 */
JOOInputSelect = JOOInput.extend({

	setupDomObject : function(config) {
		this._super(config);

		this.options = Array();
		var options = config.options || {};
		for (var i = 0; i < options.length; i++) {
			this.addOption(options[i]);
		}
		this.selectedIndex = config.selectedIndex || 0;
		if (config.selectedIndex == undefined && config.selectedValue != undefined) {
			this.selectedIndex = 0;
			for (var i = 0; i < this.options.length; i++) {
				if (this.options[i].value == config.selectedValue) {
					this.selectedIndex = i;
					break;
				}
			}
		}

		this.addEventListener("change", function(e) {
			if (e != undefined)
				this.selectedIndex = e.currentTarget.options.selectedIndex;
		});
		this.access().val(config.selectedValue);
	},

	/**
	 * Add an option to the select box.
	 * @param {Object} param new option, with <code>label</code> and <code>value</code> properties.
	 */
	addOption : function(param) {
		this.options.push(param);
		if (param.order != undefined) {
			for (var i = this.options.length - 2; i >= param.order; i--) {
				this.options[i] = this.options[i + 1];
			}
		}
		this.addChild(new JOOSelectOption(param));
	},

	/**
	 * Change the value of the select box
	 * @param {String} val new value of the select box.
	 */
	setValue : function(val) {
		this.access().val(val);
		this.selectedIndex = this.access().find("option:selected").index() - 1;
		this.dispatchEvent("change");
	},

	/**
	 * Change the value of the select box to an option by its index.
	 * @param {Number} idx the index of the option.
	 */
	setValueByIndex : function(idx) {
		this.selectedIndex = idx;
		this.access().find("option").eq(idx).attr("selected", "selected");
		this.dispatchEvent("change");
	},

	/**
	 * Get the value of the select box.
	 * @returns {String} the select box's value.
	 */
	getValue : function() {
		return this.access().val();
	},

	/**
	 * Refresh the select box.
	 */
	refresh : function() {
		this.access().html(this.toHtml());
		this.selectedIndex = this.access().find("option:selected").index() - 1;
	},

	toHtml : function() {
		return "<select></select>";
	}
});

/**
 * @class A counterpart of <code>HTML BUTTON</code> element.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>lbl</code> The label of the button.</li>
 * </ul>
 * @augments UIComponent
 */
JOOButton = UIComponent.extend(
/** @lends JOOButton# */
{

	setupDomObject : function(config) {
		this._super(config);
		if (config.lbl != undefined) {
			this.setLbl(config.lbl);
		}
		this.addEventListener('click', function(e) {
			this.onclick(e);
		});
		//		this.addEventListener('mousedown', function(e) {
		//			this.access().addClass('focus');
		//		});
	},

	setLbl : function(lbl) {
		this.access().html(lbl);
	},

	getLbl : function() {
		return this.access().html();
	},

	toHtml : function() {
		return "<a></a>";
	},

	/**
	 * Command attached to the button.
	 * @param e the event object
	 */
	onclick : function(e) {
	}
});

/**
 * @class A customized button, which excludes all styles
 * of its superclass and ancestors.
 * @augments JOOButton
 */
JOOCustomButton = JOOButton.extend({

	setupDomObject : function(config) {
		this.inheritedCSSClasses = false;
		this._super(config);
	}
});

/**
 * @class A button which can toggle up and down.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>state</code> The initial state of the button</p>
 * </ul>
 * @augments JOOCustomButton
 */
JOOToggleButton = JOOCustomButton.extend(
/** @lends 	JOOToggleButton# */
{
	setupBase : function(config) {
		this.state = config.state;
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		if (this.state)
			this.access().addClass('joo-toggle-down');
	},

	/**
	 * Change the state of the button.
	 * @param {Boolean} state the state of the button
	 */
	setState : function(state) {
		this.state = state;
		if (this.state) {
			this.access().addClass('joo-toggle-down');
			this.ontoggledown();
		} else {
			this.access().removeClass('joo-toggle-down');
			this.ontoggleup();
		}
	},

	/**
	 * Get the state of the button.
	 * @returns {Boolean} the state of the button
	 */
	getState : function() {
		return this.state;
	},

	onclick : function(e) {
		this.access().toggleClass("joo-toggle-down");
		if (this.state) {
			this.state = false;
			this.ontoggleup();
		} else {
			this.state = true;
			this.ontoggledown();
		}
		this.dispatchEvent('toggle');
	},

	ontoggledown : function() {
		this.dispatchEvent('toggleDown');
	},

	ontoggleup : function() {
		this.dispatchEvent('toggleUp');
	}
});

/**
 * @class An equivalent but different from <code>HTML INPUT CHECKBOX</code> element.
 * @augments JOOToggleButton
 */
JOOCheckbox = JOOToggleButton.extend(
/** @lends JOOCheckbox# */
{
	ontoggledown : function() {
		this.value = true;
		this.access().addClass('checked');
		this.dispatchEvent('change');
	},

	ontoggleup : function() {
		this.value = false;
		this.access().removeClass('checked');
		this.dispatchEvent('change');
	},

	/**
	 * Get the value of the checkbox.
	 * @returns {Boolean} the value. <code>true</code> if the checkbox is checked,
	 * <code>false</code> otherwise.
	 */
	getValue : function() {
		return this.value;
	},

	/**
	 * Change the value of the checkbox.
	 * @param {Boolean} value the value of the checkbox
	 */
	setValue : function(value) {
		if (value)
			this.ontoggledown();
		else
			this.ontoggleup();
	},

	toHtml : function() {
		return "<span></span> ";
	}
});

JOOCloseButton = JOOCustomButton.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.access().addClass("joo-custom-button");
	},

	toHtml : function() {
		return "<span></span>";
	}
});

/**
 * @class A sprite is a keyframe-based animation object which has a timeline. This is
 * base class of all animation classes.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>src</code> the background image source, should be a sprite image</li>
 * 	<li><code>framerate</code> the framerate of the sprite</li>
 * 	<li><code>loop</code> whether the animation should loop</li>
 * 	<li><code>horizontalFramesNo</code> the number of frames in horizontal dimension</li>
 * 	<li><code>verticalFramesNo</code> the number of frames in vertical dimension</li>
 * 	<li><code>spriteWidth</code> the width of the viewport of sprite</li>
 * 	<li><code>spriteHeight</code> the height of the viewport of sprite</li>
 * 	<li><code>speed</code> the relative speed of sprite, e.g 1.5, 2, etc</li>
 * </ul>
 * @augments UIComponent
 */
JOOSprite = UIComponent.extend(
/** @lends JOOSprite# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.framerate = config.framerate || 30;
		this.loop = config.loop || false;
		this.currentFrame = 0;
		this.horizontalFramesNo = config.horizontalFramesNo;
		this.verticalFramesNo = config.verticalFramesNo;
		this.spriteWidth = config.spriteWidth;
		this.spriteHeight = config.spriteHeight;
		this.speed = config.speed || 1;
		this.stopped = false;

		if (config.src)
			this.setSrc(config.src);
		this.setWidth(this.spriteWidth);
		this.setHeight(this.spriteHeight);
	},

	setSrc : function(src) {
		this.src = src;
		this.access().css('background-image', 'url(' + this.src + ')');
	},

	getSrc : function() {
		return this.src;
	},

	/**
	 * Play the sprite from <code>start</code> frame to <code>end</code> frame.
	 * @param {Number} start the start frame
	 * @param {Number} end the end frame
	 */
	play : function(start, end) {
		this.stopped = false;
		this.dispatchEvent("frameStart");
		this.startFrame = start || 0;
		this.endFrame = end;
		if (end == undefined) {
			this.endFrame = this.verticalFramesNo * this.horizontalFramesNo - 1;
		}
		this.currentFrame = this.startFrame;

		this.playFrame();
		this._playWithFramerate(this.framerate);
	},

	_playWithFramerate : function(framerate) {
		framerate *= this.speed;
		if (!this.stopped) {
			var _self = this;
			this.interval = setInterval(function() {
				_self.playFrame();
			}, parseFloat(1000 / framerate));
		}
	},

	/**
	 * Change the relative speed of the sprite.
	 * @param speed the relative speed of the sprite
	 */
	setSpeed : function(speed) {
		var tempFramerate = this.framerate * speed;
		clearInterval(this.interval);
		this._playWithFramerate(tempFramerate);
	},

	/**
	 * Pause the sprite.
	 */
	pause : function() {
		this.dispatchEvent("framePause");
		clearInterval(this.interval);
	},

	/**
	 * Resume the sprite.
	 */
	resume : function() {
		this.dispatchEvent("frameResume");
		this._playWithFramerate(this.interval);
	},

	/**
	 * Stop the sprite.
	 */
	stop : function() {
		this.dispatchEvent("frameStop");
		this.stopped = true;
	},

	playFrame : function() {
		var ended = false;
		if (this.currentFrame > this.endFrame) {
			if (this.loop) {
				this.currentFrame = this.startFrame;
			} else {
				ended = true;
			}
		}
		if (ended || this.stopped) {
			clearInterval(this.interval);
			this.stopped = true;
			this.dispatchEvent("frameEnded");
			return;
		}
		this.dispatchEvent("frameEnter");
		this.onFrame(this.currentFrame);
		this.dispatchEvent("frameExit");
		this.currentFrame++;
	},

	/**
	 * This method defines how animation works. Subclass can override it to
	 * change the behaviour. This implementation just change the
	 * <code>background-position</code> of the sprite.
	 * @param frame
	 */
	onFrame : function(frame) {
		var x = frame % this.horizontalFramesNo;
		var y = 0;
		if (this.currentFrame != 0)
			y = Math.floor(frame / this.horizontalFramesNo);
		var xPos = -y * this.spriteWidth + "px";
		var yPos = -x * this.spriteHeight + "px";
		this.access().css('background-position', xPos + ' ' + yPos);
	},

	toHtml : function() {
		return "<div></div>";
	},

	dispose : function(skipRemove) {
		this.stop();
		this._super(skipRemove);
	}
});

/**
 * @class A counterpart of <code>HTML INPUT FILE</code> element.
 * @augments JOOInput
 */
JOOFileInput = JOOInput.extend({

	setupDomObject : function(config) {
		this._super(config);
		if (config.multiple)
			this.setAttribute('multiple', config.multiple);
	},

	toHtml : function() {
		return "<input type='file' />";
	}
});

/**
 * @class A basic AJAX-style uploader.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>name</code> the name of the uploader</li>
 * 	<li><code>endpoint</code> the URL to which the uploader is connected</li>
 * </ul>
 * @augments UIComponent
 */
JOOBasicUploader = UIComponent.extend({

	setupDomObject : function(config) {
		this.endpoint = config.endpoint || "";
		this._super(config);
		this.fileInput = new JOOFileInput({
			name : config.name,
			multiple : config.multiple
		});

		var iframeId = this.getId() + "-iframe";
		var form = new CustomDisplayObject({
			html : "<form enctype='multipart/form-data' target='" + iframeId + "' action='" + this.endpoint + "' method='post'></form>"
		});
		form.addChild(this.fileInput);
		var _self = this;
		this.fileInput.addEventListener('change', function(e) {
			_self.dispatchEvent('inputchange', e);
			if (config.autosubmit)
				form.access().submit();
		});
		form.addEventListener('submit', function(e) {
			var frame = _self.access().find('iframe');
			$(frame).one('load', function() {
				var response = frame.contents().find('body').html();
				_self.dispatchEvent('submitSuccess', {
					endpoint : _self.endpoint,
					data : response
				});
			});
		});
		this.addChild(form);
	},

	toHtml : function() {
		var iframeId = this.getId() + "-iframe";
		return "<div><iframe class='joo-uploader-iframe' name='" + iframeId + "' id='" + iframeId + "'></iframe></div>";
	}
});

/**
 * @class A customized uploader, which features an overlay control.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>control</code> the control of the uploader</li>
 * </ul>
 * @augments JOOBasicUploader
 */
JOOAdvancedUploader = JOOBasicUploader.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.fileInput.access().addClass('joo-advanceduploader-input');
		if (config.control) {
			this.addChild(config.control);
		}
	},

	toHtml : function() {
		var iframeId = this.getId() + "-iframe";
		return "<div><iframe class='joo-uploader-iframe' name='" + iframeId + "' id='" + iframeId + "'></iframe></div>";
	}
});

/**
 * @class A <code>bold</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleBoldButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>italic</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleItalicButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>underline</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleUnderlineButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>horizontal flip</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleFlipHorizontalButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>vertical flip</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleFlipVerticalButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>left align</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleAlignLeftButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>centered align</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleAlignCenterButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A <code>right align</code> toggle button, used in editors.
 * @augments JOOToggleButton
 */
JOOToggleAlignRightButton = JOOToggleButton.extend({

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class A panel which holds multiple tabs.
 * @augments Panel
 */
JOOTabbedPane = Panel.extend(
/** @lends JOOTabbedPane# */
{

	setupBase : function(config) {
		this.tabs = Array();
		this._super(config);
	},

	setupDomObject : function(config) {
		this.header = new CustomDisplayObject({
			html : "<div class='joo-tab-header'></div>"
		});
		this.content = new CustomDisplayObject({
			html : "<div class='joo-tab-content'></div>"
		});
		this._super(config);
		this.addChild(this.header);
		this.addChild(this.content);
	},

	/**
	 * Add a tab to this panel.
	 * @param {String} title the title of the tab
	 * @param {DisplayObject} comp the tab component
	 * @param {String} icon an icon associated with the tab
	 * @param {String} tooltip a tooltip associated with the tab
	 */
	addTab : function(title, comp, icon, tooltip) {
		comp.access().addClass('joo-tab-item');
		if (!tooltip)
			tooltip = "";
		var header = new CustomDisplayObject({
			html : "<span title='" + tooltip + "'></span>"
		});
		if (icon != undefined)
			header.addChild(new JOOImage({
				src : icon,
				passClickEvent : true
			}));
		header.addChild(new JOOLabel({
			lbl : title,
			passClickEvent : true
		}));
		header.access().addClass('joo-tab-control');

		var _self = this;
		header.setAttribute('tabIndex', this.header.children.length);
		header.addEventListener('click', function(e) {
			_self.setTab(this.getAttribute('tabIndex'));
		});

		this.header.addChild(header);
		this.content.addChild(comp);
		this.tabs.push(comp);
		if (this.header.children.length == 1) {
			this.setTab(0);
		}
	},

	/**
	 * Change the active tab.
	 * @param {Number} index the index of the tab to be active
	 */
	setTab : function(index) {
		for (var i = 0; i < this.header.children.length; i++) {
			this.header.children[i].access().removeClass('active');
		}
		this.header.children[index].access().addClass('active');
		for (var i = 0; i < this.tabs.length; i++) {
			this.tabs[i].access().hide();
		}
		this.tabs[index].setStyle('display', 'block');
	},

	toHtml : function() {
		return "<div></div>";
	}
});

/**
 * @class An accordion, which has a header to toggle its content.
 * @augments UIComponent
 */
JOOAccordion = UIComponent.extend(
/** @lends JOOAccordion# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.header = new Sketch();
		this.header.access().addClass('joo-accordion-header');
		this.header.access().html(config.lbl);
		var _self = this;
		this.header.addEventListener('click', function() {
			_self.contentPane.access().slideToggle(config.toggleSpeed || 500);
			_self.header.access().toggleClass('collapsed');
		});
		this.contentPane = new Sketch();
		this.contentPane.access().addClass('joo-accordion-content');
		this.addChild(this.header);
		this.addChild(this.contentPane);
	},

	/**
	 * Get the content panel of the accordion.
	 * @returns {Sketch} the content panel
	 */
	getContentPane : function() {
		return this.contentPane;
	},

	/**
	 * Change the label of the accordion.
	 * @param {String} label the label of the accordion
	 */
	setAccordionLabel : function(label) {
		this.header.access().html(label);
	}
});

/**
 * @class A ruler which supports drag.
 * <p>It supports additional configuration parameters:</p>
 * <ul>
 * 	<li><code>width</code> the width of the ruler</li>
 * 	<li><code>height</code> the height of the ruler</li>
 * 	<li><code>initmin</code> the minimum value of the ruler</li>
 * 	<li><code>initmax</code> the maximum value of the ruler</li>
 * 	<li><code>interval</code> the interval number of the ruler</li>
 * 	<li><code>groupmode</code> could be "half" or "quarter"</li>
 * 	<li><code>value</code> the intial value of the ruler</li>
 * </ul>
 * @augments JOOInput
 */
JOORuler = JOOInput.extend(
/** @lends JOORuler# */
{
	setupDomObject : function(config) {
		this._super(config);
		this.width = parseFloat(config.width);
		this.height = parseFloat(config.height);
		this.initMin = parseFloat(config.initmin || 0);
		this.min = parseFloat(config.min || 0);
		this.initMax = parseFloat(config.initmax || this.width / 10);
		this.max = parseFloat(config.max || this.initMax);
		this.interval = parseFloat(config.interval || 1);
		this.groupMode = config.groupmode;
		this.value = parseFloat(config.value || this.initmin);
		this.autoExpand = this.autoExpand || true;
		this.baseValue = 0;

		this.canvas = new Canvas({
			width : this.width,
			height : this.height
		});
		this.addChild(this.canvas);
		this.addEventListener('stageUpdated', function() {
			this.initRuler();
			this.initRoller();
		});
	},

	initRoller : function() {
		this.backRoller = new JOOImage({
			absolute : true,
			height : 16,
			custom : {
				position : 'absolute',
				left : '-10px'
			},
			src : 'static/images/backward.png'
		});
		this.forwardRoller = new JOOImage({
			absolute : true,
			height : 16,
			custom : {
				position : 'absolute',
				right : '-10px'
			},
			src : 'static/images/forward.png'
		});

		var _self = this;
		this.backRoller.addEventListener('mousedown', function() {
			_self.startExpand();
		});
		this.backRoller.addEventListener('mouseup', function() {
			_self.stopExpand();
		});
		this.backRoller.addEventListener('mouseout', function() {
			_self.stopExpand();
		});

		this.forwardRoller.addEventListener('mousedown', function() {
			_self.startExpand(true);
		});
		this.forwardRoller.addEventListener('mouseup', function() {
			_self.stopExpand();
		});
		this.forwardRoller.addEventListener('mouseout', function() {
			_self.stopExpand();
		});

		this.addChild(this.backRoller);
		this.addChild(this.forwardRoller);
	},

	initRuler : function() {
		var context = this.canvas.getContext();
		context.beginPath();
		context.clearRect(0, 0, parseInt(this.canvas.getWidth()), parseInt(this.canvas.getHeight()));
		var len = this.initMax - this.initMin;

		if (this.groupMode == "quarter")
			this.group = this.interval * 4;
		else if (this.groupMode == "half")
			this.group = this.interval * 2;
		else
			this.group = this.interval * 1;

		var font = new JOOFont();
		context.setFont(font);
		this.deltaY = 9;
		this.deltaX = 5;
		context.moveTo(this.deltaX, this.deltaY);
		context.lineTo(this.getWidth() - this.deltaX, this.deltaY);

		var valueX = this.convertValueToX(this.deltaX);
		this.drawPointer(valueX, 0, this.deltaX, this.deltaY);

		var base = this.baseValue % this.group;
		var min = this.initMin - base;
		var max = this.initMax - base;
		for (var i = -base; i <= len; i += this.interval) {
			var x = i * (this.getWidth() - 2 * this.deltaX) / len + this.deltaX;
			context.moveTo(x, this.getHeight() / 10 + this.deltaY);
			var h = this.height / 2;

			if (i == -base || i == max - min || (i + base) % this.group == 0) {
				if (i == max - min)
					context.setTextAlign('right');
				else if (i == 0)
					context.setTextAlign('left');
				else
					context.setTextAlign('center');
				context.fillText(i + base + min, x, this.height / 2 + 15 + this.deltaY);
			}
			if ((i + base) % this.group == 0) {

			} else if (((i + base) / this.interval) % (this.group / this.interval) == 2) {
				h = h * 0.75;
			} else {
				h = h * 0.5;
			}
			context.lineTo(x, h + this.deltaY);
		}
		context.stroke();
	},

	/**
	 * Mark the ruler at a specific value.
	 * @param {Number} value the value to be marked
	 */
	mark : function(value) {
		var _self = this;
		var x = this.convertValueToX(this.deltaX, value);
		var sk = new Sketch({
			width : 10,
			height : 10,
			'background-color' : 'red',
			custom : {
				display : 'inline-block',
				position : 'absolute',
				cursor : 'pointer'
			}
		});
		sk.setLocation(x - 5, 5);
		this.addChild(sk);
		sk.addEventListener('click', function() {
			_self.setValue(value);
		});
	},

	convertValueToX : function(deltaX, value) {
		value = value || this.value;
		return (value - this.initMin) / (this.initMax - this.initMin) * (this.getWidth() - 2 * deltaX);
	},

	convertXToValue : function(x, deltaX) {
		var percent = x / (this.getWidth() - 2 * deltaX);
		if (percent < 0)
			percent = 0;
		else if (percent > 1)
			percent = 1;
		return Math.round(this.initMin + percent * (this.initMax - this.initMin));
	},

	expandLeft : function() {
		if (this.initMin > this.min) {
			this.baseValue--;
			this.initMin--;
			this.initMax--;
			this.initRuler();
			this.dispatchEvent('expanded');
		}
	},

	expandRight : function() {
		if (this.initMax < this.max) {
			this.baseValue++;
			this.initMin++;
			this.initMax++;
			this.initRuler();
			this.dispatchEvent('expanded');
		}
	},

	expand : function(inc, isRight) {
		if (isRight) {
			this.expandRight();
		} else {
			this.expandLeft();
		}
	},

	startExpand : function(isRight) {
		var _self = this;
		this.expandInterval = setInterval(function() {
			_self.expand(undefined, isRight);
			_self.setValue(_self.getValue());
		}, 25);
	},

	stopExpand : function(isRight) {
		clearInterval(this.expandInterval);
	},

	startTracking : function() {
		var _self = this;
		this.trackingInterval = setInterval(function() {
			var inc = _self.pointer.getX() - (_self.getWidth() - 2 * _self.deltaX);
			var v = _self.convertXToValue(_self.pointer.getX(), _self.deltaX);
			if (v >= _self.initMax - 1) {
				if (_self.autoExpand) {
					_self.expand(Math.round(inc / 2), true);
				}
			} else if (v <= _self.initMin) {
				if (_self.autoExpand) {
					_self.expand(Math.round(inc / 2));
				}
			}
		}, 25);
	},

	stopTracking : function() {
		clearInterval(this.trackingInterval);
		this.trackingInterval = undefined;
	},

	drawPointer : function(x, y, deltaX, deltaY) {
		if (this.pointer)
			return;
		var _self = this;

		var img = new UIComponent({
			width : deltaX * 2,
			height : deltaY * 2
		});
		img.access().addClass('joo-ruler-pointer');
		img.setLocation(x, y);
		img.addEventListener('dragstart', function() {
			_self.startTracking();
		});
		img.addEventListener('drag', function(e) {
			_self.dispatchEvent('pointerdrag', {
				"position" : this.getX()
			});
		});
		img.addEventListener('dragstop', function(e) {
			hidetip();
			_self.stopTracking();
			_self.setValue(_self.convertXToValue(this.getX(), deltaX));
		});

		Wrapper.wrap(img, DraggableInterface);
		img.draggable({
			axis : 'x',
			containment : 'parent'
		});
		img.startDrag();

		this.pointer = img;

		this.addChild(img);
	},

	getValue : function() {
		return this.value;
	},

	/**
	 * Change the value of the ruler. It also updates the ruler pointer's position.
	 * @param {Number} value the new value of the ruler
	 */
	setValue : function(value) {
		var oldValue = this.value;
		if (value < this.min)
			value = this.min;
		else if (value > this.max)
			value = this.max;
		this.value = value;
		if (this.pointer) {
			if (value < this.initMin || value > this.initMax) {
				this.pointer.access().hide();
			} else {
				this.pointer.access().show();
				this.pointer.setX(this.convertValueToX(5));
			}
		}
		if (this.value != oldValue) {
			this.dispatchEvent('change');
		}
	}
});

JOOToggleBar = Sketch.extend({

	setupBase : function(config) {
		this.items = {};
		this.multi = config.multi;
		this.value = undefined;
		this.defaultValue = config.defaultValue;
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		if (config.items) {
			for (var i in config.items) {
				this.addItem(config.items[i], i);
			}
		}
	},

	addItem : function(item, value) {
		this.addChild(item);
		this.items[value] = item;
		item.itemId = value;
		var _self = this;
		item.addEventListener('toggle', function() {
			if (this.state)
				_self.onStateDown(item);
			else
				_self.onStateUp(item);
		});
	},

	getValue : function() {
		return this.value;
	},

	setValue : function(value) {
		this.value = value;
		this.dispatchEvent('change');
	},

	onStateDown : function(item) {
		if (this.getValue() != item.itemId) {
			if (this.getValue() && this.items[this.getValue()])
				this.items[this.getValue()].setState(false);
			this.setValue(item.itemId);
		}
	},

	onStateUp : function(item) {
		this.setValue(this.defaultValue);
	}
});

/**
 * @class A component holding another components in a list view.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>readonly</code> Whether each item in the list is readonly</li>
 * </ul>
 * @augments UIComponent
 */
JOOList = UIComponent.extend(
/** @lends	JOOList# */
{
	setupBase : function(config) {
		this.items = Array();
		this.readonly = config.readonly;
		this.selectedItem = undefined;
		this._super(config);
	},

	/**
	 * Add an item to the list.
	 * @param {Object} obj the item to be added, must be an object with
	 * <code>label</code> and <code>value</code> properties
	 * @returns {JOOText} the newly added item
	 */
	addItem : function(obj) {
		var item = new Sketch();
		var text = new JOOText({
			lbl : obj.label,
			readonly : this.readonly,
			blurEvent : 'itemDeselected'
		});
		item.text = text;
		item.addChild(text);
		this.items.push(item);
		this.addChild(item);
		item.addEventListener('click', function() {
			this._parent.selectItem(this);
		});
		text.addEventListener('change', function() {
			this._parent.dispatchEvent('itemChanged');
		});
		item.value = obj.value;
		return item;
	},

	/**
	 * Get the current selected item.
	 * @returns {JOOText} the current selected item
	 */
	getSelectedItem : function() {
		return this.selectedItem;
	},

	/**
	 * Get the index of current selected item.
	 * @returns {Number} the index
	 */
	getSelectedIndex : function() {
		return this.indexOf(this.selectedItem);
	},

	/**
	 * Programmatically select an item.
	 * @param {JOOText} item the item to be selected
	 */
	selectItem : function(item) {
		if (item == this.selectedItem)
			return;
		if (this.selectedItem) {
			this.selectedItem.access().removeClass('selected');
			this.selectedItem.text.dispatchEvent('itemDeselected');
		}
		this.selectedItem = item;
		if (item) {
			this.selectedItem.access().addClass('selected');
		}
		this.dispatchEvent('change');
	},

	setupDomObject : function(config) {
		this._super(config);
		this.setLayout('vertical');
	},
});

/**
 * @class A desktop-style dialog. It has a title bar and a content pane.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>title</code> The title of the dialog</li>
 * </ul>
 * @augments UIComponent
 * @implements DraggableInterface
 */
JOODialog = UIComponent.extend(
/** @lends JOODialog# */
{
	setupDomObject : function(config) {
		this._super(config);

		this.titleBar = new Sketch();
		this.contentPane = new Sketch();
		this.titleBar.access().addClass('joo-dialog-title');
		this.contentPane.access().addClass('joo-dialog-content');

		this.addChild(this.titleBar);
		this.addChild(this.contentPane);

		var _self = this;
		this.closeBtn = new JOOCloseButton({
			absolute : true
		});
		this.closeBtn.onclick = function() {
			_self.dispatchEvent('closing');
			if (config.closemethod == 'do_nothing')
				return;
			if (!config.closemethod)
				config.closemethod = "close";
			_self[config.closemethod].apply(_self);
		};
		var label = new JOOLabel();
		this.titleBar.addChild(label);
		this.titleBar.addChild(this.closeBtn);

		if (config.title != undefined)
			this.setTitle(config.title);

		if (!config.stick) {
			this.draggable({
				handle : this.titleBar.access()
			});
			this.startDrag();
		}
		this.addEventListener('stageUpdated', function() {
			this.afterAdded();
		});
	},

	/**
	 * Make the dialog centered by the screen.
	 */
	center : function() {
		var w = ($(window).width() - this.access().outerWidth()) / 2;
		var h = ($(window).height() - this.access().outerHeight()) / 2;
		this.setLocation(w < 0 ? 0 : w, h < 0 ? 0 : h);
	},

	afterAdded : function() {
		var modal = this.config.modal || false;
		if (modal) {
			this.modalSketch = new Sketch();
			this.modalSketch.access().addClass('joo-modal-dialog');
			this.stage.addChild(this.modalSketch, this.access());
			this.modalSketch.setStyle('z-index', parseInt(this.getStyle('z-index') - 1));
			this.modalSketch.access().show();
		}
	},

	/**
	 * Change the title of the dialog.
	 * @param title the new title
	 */
	setTitle : function(title) {
		this.config.title = title;
		this.titleBar.getChildren()[0].setText(title);
	},

	/**
	 * Get the current title of the dialog.
	 * @returns {String} the current title
	 */
	getTitle : function() {
		return this.titleBar.getChildren()[0].getText();
	},

	/**
	 * Get the content pane of the dialog.
	 * @returns {Sketch} the content pane
	 */
	getContentPane : function() {
		return this.contentPane;
	},

	/**
	 * Close the dialog.
	 */
	close : function() {
		if (this.modalSketch != undefined)
			this.modalSketch.selfRemove();
		this.selfRemove();
	},

	/**
	 * Show the dialog.
	 */
	show : function() {
		this.access().show();
	},

	/**
	 * Hide the dialog.
	 */
	hide : function() {
		this.access().hide();
	},

	toHtml : function() {
		return "<div></div>";
	}
}).implement(DraggableInterface);

AboutApplicationDialog = JOODialog.extend({

	setupBase : function(config) {
		this.config.modal = config.modal = false;
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);

		var appinfo = SingletonFactory.getInstance(ApplicationInfo);
		this.setTitle("About " + appinfo.name);
		this.setWidth(500);

		var sketch1 = new Sketch();
		var img = new JOOImage({
			src : appinfo.logo,
			width : 100,
			height : 100
		});
		var panel1 = new Panel();
		panel1.addChild(img);

		var panel2 = new Panel();
		var header = new JOOLabel({
			lbl : appinfo.name
		});
		var version = new JOOLabel({
			lbl : "Version " + appinfo.version
		});
		var description = new JOOLabel({
			lbl : appinfo.description
		});
		var font = new JOOFont();

		font.setFontSize('15px');
		font.setBold(true);
		header.applyFont(font);

		font.setFontSize('13px');
		font.setBold(false);
		font.setItalic(true);
		version.applyFont(font);
		font.setItalic(false);
		description.applyFont(font);

		panel2.addChild(header);
		panel2.addChild(version);
		panel2.addChild(description);
		panel2.setLayout('vertical');
		panel2.setWidth(370);
		panel2.setX(20);

		var copyright = new JOOLabel({
			lbl : "Copyright © " + appinfo.copyright + " <a href='" + appinfo.authorsUrl + "' target='_blank'>" + appinfo.authors + "</a>. All Rights Reserved"
		});
		var panel3 = new Panel();
		panel3.setWidth(600);
		panel3.setHeight(50);
		panel3.setY(20);
		panel3.addChild(copyright);

		sketch1.addChild(panel1);
		sketch1.addChild(panel2);
		sketch1.addChild(panel3);

		this.getContentPane().addChild(sketch1);
	},

	close : function() {
		if (this.modalSketch != undefined)
			this.modalSketch.access().hide();
		this.access().hide();
	}
});

/**
 * @class A slider icon, used in JOOSlider.
 * @augments Sketch
 * @implements DraggableInterface
 */
SliderIcon = Sketch.extend({

	setupBase : function(config) {
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		this.setWidth(18);
		this.setHeight(18);

		this.draggable({
			containment : 'parent'
		});

		this.addEventListener("mousedown", function(e) {
			this.enable = true;
			$(window).bind("mousemove", {
				_self : this
			}, this.mouseMoveHandler);
			this.addEventListener("mousemove", this.mouseMoveHandler);
		});
		this.addEventListener("mouseup", function(e) {
			this.mouseUpHandler(e);
		});

		$(window).bind("mouseup", {
			_self : this
		}, this.mouseUpHandler);
	},

	dispose : function(skipRemove) {
		$(window).unbind("mouseup", this.mouseUpHandler);
		$(window).unbind("mousedown", this.mouseDownHandler);
		this._super(skipRemove);
	},

	mouseUpHandler : function(e) {
		var _self = e.data ? e.data._self || this : this;
		_self.enable = false;
		$(window).unbind("mousemove", _self.mouseMoveHandler);
		_self.removeEventListener("mousemove", _self.mouseMoveHandler);
	},

	mouseMoveHandler : function(e) {
		var _self = e.data ? e.data._self || this : this;
		if (_self.enable) {
			_self.dispatchEvent('slideChanged', {
				value : _self.getX(),
				ispos : "pos"
			});
		}
	}
}).implement(DraggableInterface);

/**
 * @class A slider, which has a draggable icon and a slide pane.
 * @augments JOOInput
 */
JOOSlider = JOOInput.extend(
/** @lends JOOSlider# */
{
	setupBase : function(config) {
		this._super(config);
	},

	setupDomObject : function(config) {
		config.width = config.width || 200;
		config.height = 5;
		this._super(config);

		this.sliderIcon = new SliderIcon();
		this.value = config.value || 0;
		this.min = config.min || 0;
		this.max = config.max || 100;

		this.addChild(this.sliderIcon);

		this.addEventListener('stageUpdated', function() {
			this.slideTo(this.value);
		});

		var _self = this;
		this.sliderIcon.addEventListener("slideChanged", function(e) {
			_self.slideTo(e.value, e.ispos);
		});

		this.sliderIcon.addEventListener("mouseover", function(e) {
			showtip(new Number(_self.getValue()).toFixed(2));
		});

		this.sliderIcon.addEventListener("drag", function(e) {
			showtip(new Number(_self.getValue()).toFixed(2));
		});

		this.sliderIcon.addEventListener("dragstop", function(e) {
			hidetip();
		});

		this.sliderIcon.addEventListener("mouseout", function(e) {
			hidetip();
		});
	},

	/**
	 * SLide the icon to a specific value.
	 * @param {String|Number} value the value of the slider.
	 * @param {Boolean} ispos whether the <code>value</code> is position or absolute value.
	 */
	slideTo : function(value, ispos) {
		var posX = undefined;
		if (ispos) {
			// position, not value anymore
			posX = value;
			value = ((parseFloat(posX)) / (this.getWidth() - 18)) * (this.max - this.min) + this.min;
			if (value < this.min) {
				value = this.min;
				posX = 9;
			}
		} else {
			var oldPos = this.sliderIcon.getX();

			if (value < this.min) {
				value = this.min;
			}
			if (value > this.max) {
				value = this.max;
			}
			posX = (value - this.min) / (this.max - this.min) * (this.getWidth() - 18);

			if (oldPos == posX)
				return;
		}

		this.sliderIcon.setX(posX);

		var rate = (value - this.min) / (this.max - this.min);
		var lWidth = rate * (this.getWidth() - 18);
		var rWidth = (1 - rate) * (this.getWidth() - 18);
		this.access().find('.active').css("width", lWidth + "px");
		this.access().find('.inactive').css("width", rWidth + "px");
		this.access().find("input").val(value);

		this.dispatchEvent('change');
	},

	/**
	 * Change the value of the slider.
	 * @param {Number} value the new value
	 */
	setValue : function(value) {
		this.slideTo(value);
	},

	/**
	 * Get the value of the slider.
	 * @returns {Number} the value of the slider
	 */
	getValue : function() {
		return this.access().find("input").val();
	},

	toHtml : function() {
		return "<div><input type='hidden'><div class='joo-slider-bg active'></div><div class='joo-slider-bg inactive'></div></div>";
	}
});

/**
 * @class A simple color picker. Wrapper of jQuery ColorPicker.
 * @augments JOOInput
 */
JOOColorPicker = JOOInput.extend(
/** @lends JOOColorPicker# */
{
	setupBase : function(config) {
		this._super(config);
	},

	setupDomObject : function(config) {
		config.width = 18;
		config.height = 18;

		this._super(config);

		if (!config.background) {
			config.background = "#FFF";
		}

		this.shown = false;
		var _cpicker = this;
		var c = config.background.substring(1, config.background.length);
		this.access().ColorPicker({
			flat : true,
			onChange : function() {
				var hex = arguments[1];
				_cpicker.colorPickerIcon.setStyle("background-color", hex);
				_cpicker.dispatchEvent('change');
			},
			color : c
		});
		this.colorPickerIcon = new Sketch(config);
		var colorPanel = this.access().find(".colorpicker");
		this.colorPanelId = colorPanel.attr("id");
		colorPanel.css("left", "22px");
		colorPanel.css("top", "-2px");

		var _self = this;
		this.colorPickerIcon.addEventListener("mouseover", function() {
			showtip(_self.getValue());
		});

		this.colorPickerIcon.addEventListener("mouseout", function() {
			hidetip();
		});

		this.colorPickerIcon.addEventListener("click", function(e) {
			if (_cpicker.shown) {
				$("#" + _cpicker.colorPanelId).hide();
				_cpicker.shown = false;
			} else {
				$("#" + _cpicker.colorPanelId).show();
				_cpicker.shown = true;
			}
		});
		this.addChild(this.colorPickerIcon);
		this.colorPickerIcon.access().addClass('joo-colorpicker-icon');
		this.colorPickerIcon.setStyle("background", config.background);
	},

	/**
	 * Change the value of the picker.
	 * @param {String} value the new value
	 */
	setValue : function(value) {
		this.colorPickerIcon.setStyle("background-color", value);
	},

	/**
	 * Get the value of the picker.
	 * @returns {String} the picker's value
	 */
	getValue : function() {
		return this.colorPickerIcon.getStyle("background-color");
	},

	toHtml : function() {
		return "<div></div>";
	}
});
ListItem = UIComponent.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.label = new JOOLabel({
			lbl : config.lbl
		});
		if (config.showLabel) {
			this.addChild(this.label);
		}
	},

	toHtml : function() {
		return "<li></li>";
	}
});
UnorderedList = UIComponent.extend({

	setupBase : function(config) {
		this._super(config);
		this.data = [];
		this.labelField = 'label';
		if (config.labelField && config.labelField != "") {
			this.labelField = config.labelField;
		}
	},
	emptyList : function() {
		while (this.children.length > 0) {
			this.removeChild(this.children[0]);
		}
		this.data = [];
	},
	clearView : function() {
		while (this.children.length > 0) {
			this.detachChild(this.children[0]);
		}
	},
	toHtml : function() {
		return '<ul></ul>';
	},
	addItem : function(ele) {
		if (this.data.indexOf(ele) == -1) {
			this.data.push(ele);
			var item = ele;
			if (!( ele instanceof ListItem)) {
				item = new ListItem({
					lbl : ( typeof ele == 'string') ? ele : ele[this.labelField]
				});
			}
			this.addChild(item);
			var _self = this;
			item.addEventListener('click', function() {
				_self.selectedItem = item;
				_self.dispatchEvent('select', ele);
			});
		}

	},
	removeItem : function(item) {
		var index = this.data.indexOf(item);
		if (index != -1) {
			if (item == this.selectedItem)
				this.selectedItem = null;
			this.removeChild(item);
			this.data.splice(index, 1);
		}
	},
	refresh : function() {
		this.clearView();
		for (var i = 0; i < this.data.length; i++) {
			this.addChild(this.data[i]);
		}
	},
	setChildIndex : function(child, index) {
		var currIndex = this.data.indexOf(child);
		if (currIndex != -1) {
			this.data.splice(currIndex, 1);
			this.data.splice(index, 0, child);
			this.refresh();
		}
	},

	getChildIndexByDomObject : function(domObject) {
		for (var i = 0, l = this.data.length; i < l; i++) {
			var child = this.data[i].access()[0];
			if (child == domObject) {
				return i;
			}
		}
		return undefined;
	},

	refreshByDisplay : function() {
		var arr = [];
		var data = this.data;
		var findListItem = function(id) {
			for (var i = 0, l = data.length; i < l; i++) {
				if (data[i].id == id) {
					return data[i];
				}
			}
			return undefined;
		}
		var lis = this.access().children('li');
		for (var i = 0, l = lis.length; i < l; i++) {
			var item = findListItem($(lis[i]).attr('id'));
			if (!item)
				continue;
			arr.push(item);
		};

		this.data = arr;
		this.refresh();
	}
});
OrderedList = UnorderedList.extend({
	toHtml : function() {
		return '<ol></ol>';
	}
});
JOORadioButtonGroup = UnorderedList.extend({
	setupDomObject : function(config) {
		this._super(config);
		this.name = config.name;
		this._value = null;
	},
	addItem : function(item) {
		var _item = item;
		if (!( item instanceof JOORadioButtonItem)) {
			_item = new JOORadioButtonItem({
				name : this.name,
				checked : false,
				lbl : item
			});
		}
		this._super(_item);
		var _self = this;
		_item.input.addEventListener('change', function(e) {
			_self.dispatchEvent('change', {
				item : _item,
				value : item.input ? (item.input.getValue ? item.input.getValue() : undefined) : undefined
			});
			e.stopPropagation();
		});
		return _item;
	},
	getItemByValue : function(value) {
		for (var i = 0, l = this.data.length; i < l; i++) {
			if (this.data[i].getValue() == value)
				return this.data[i];
		}
	},
	setChecked : function(item) {
		if (this.data.indexOf(item) == -1) {
			return;
		}
		item.input.setChecked(true);
		this.dispatchEvent('changeValue', {
			item : item,
			value : item.input ? (item.input.getValue ? item.input.getValue() : undefined) : undefined
		});
	},
	getChecked : function() {
		for (var i = 0; i < this.data.length; i++) {
			if (this.data[i].input.getChecked())
				return this.data[i];
		}
		return undefined;
	}
});
JOORadioButtonItem = ListItem.extend({
	setupDomObject : function(config) {
		config.showLabel = false;
		this._super(config);
		this.lbl = new JOOLabel({
			lbl : config.lbl
		});
		this.input = new JOORadioButton({
			name : config.name,
			value : config.value,
			checked : config.checked
		});

		this.addChild(this.input);
		this.addChild(this.lbl);
	},

	setValue : function(value) {
		this.input.config.value = value;
		return this;
	},

	getValue : function() {
		return this.input.config.value;
	}
});
JOORadioButton = JOOInput.extend({
	toHtml : function() {
		return '<input />';
	},
	setupDomObject : function(config) {
		this._super(config);
		this.setAttribute('type', 'radio');
		this.setChecked(config.checked);
	},
	setChecked : function(value) {
		this.access().prop('checked', value);
	},
	getChecked : function() {
		return this.access().prop('checked');
	}
});
JOOPropertyElement = JOOInput.extend({

	setupDomObject : function(config) {
		this._super(config);

		var label = new JOOLabel({
			lbl : config.lbl
		});
		var controlLabel = new Sketch();
		controlLabel.addChild(label);
		this.addChild(controlLabel);

		controlSketch = new Sketch();
		controlSketch.addChild(this.control);
		this.addChild(controlSketch);

		this.setLayout('flow');

		config.labelWidth = config.labelWidth || '40%';
		controlLabel.setWidth(config.labelWidth);
		config.controlWidth = config.controlWidth || '60%';
		controlSketch.setWidth(config.controlWidth);
		this.control.setWidth('100%');

		var _self = this;
		this.control.addEventListener('change', function(e) {
			if (e)
				e.stopPropagation();
			_self.dispatchEvent('change');
		});
	},

	setValue : function(value) {
		this.control.setValue(value);
	},

	getValue : function() {
		return this.control.getValue();
	}
});

JOOCheckboxProperty = JOOPropertyElement.extend({

	setupDomObject : function(config) {
		this.control = new JOOCheckbox();
		this._super(config);
		this.control.setWidth('');
	}
});

JOOColorProperty = JOOPropertyElement.extend({

	setupDomObject : function(config) {
		this.control = new JOOColorPicker();
		this._super(config);
		this.control.setWidth('');
	}
});

JOOFontChooserProperty = JOOPropertyElement.extend({

	setupDomObject : function(config) {
		this.control = new JOOFontSelector(config);
		this._super(config);
		this.control.setWidth('auto');
	}
});

JOOMediaProperty = JOOPropertyElement.extend({

	setupDomObject : function(config) {
		this.control = this.control || new JOOMediaValue(config);
		this._super(config);
	}
});

JOOMediaValue = JOOInput.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.link = new JOOLink();
		this.mediaBrowser = new JOOMediaBrowser(config);
		this.addChild(this.link);
		this.addChild(this.mediaBrowser);
		this.mediaBrowser.access().hide();
		this.setValue(config.value);

		var _self = this;
		this.link.addEventListener('click', function() {
			_self.mediaBrowser.fetch();
			_self.mediaBrowser.access().show();
		});
		this.link.addEventListener('mouseover', function() {
			showtip(_self.getValue());
		});
		this.link.addEventListener('mouseout', function() {
			hidetip();
		});
		this.mediaBrowser.close = function() {
			this.access().hide();
		};
		this.mediaBrowser.addEventListener('change', function() {
			_self.onchange(this.getValue());
		});
	},

	onchange : function(value) {
		this.mediaBrowser.close();
		this.setValue(value);
	},

	setValue : function(value) {
		this._super(value);
		if (value == undefined)
			value = "Unspecified";
		this.link.access().html(value);
		this.dispatchEvent('change');
	},

	toHtml : function() {
		return "<div></div>";
	}
});

JOOSelectProperty = JOOPropertyElement.extend({

	setupDomObject : function(config) {
		this.control = new JOOInputSelect(config);
		this._super(config);
		this.control.setWidth('auto');
	}
});

JOOToggleBarProperty = JOOPropertyElement.extend({

	setupDomObject : function(config) {
		this.control = new JOOToggleBar(config);
		this._super(config);
		this.control.setWidth('auto');
	}
});

JOOToggleProperty = JOOPropertyElement.extend({

	setupDomObject : function(config) {
		this.control = config.control;
		this._super(config);
		var _self = this;
		this.control.addEventListener('toggle', function() {
			_self.setValue(this.state ? config.on : config.off);
		});
		this.control.setWidth('');
	},

	setValue : function(value) {
		this.value = (value == this.config.on) ? this.config.on : this.config.off;
		this.dispatchEvent('change');
	},

	getValue : function() {
		return this.value;
	}
});

JOOSliderProperty = JOOPropertyElement.extend({

	setupDomObject : function(config) {
		this.control = new JOOSlider({
			min : config.min,
			max : config.max,
			value : config.value
		});
		this._super(config);
		this.control.setLocation(-8, 7);
	}
});

JOOTextAreaProperty = JOOPropertyElement.extend({

	setupDomObject : function(config) {
		this.control = new JOOTextArea();
		this._super(config);
	}
});

JOOTextProperty = JOOPropertyElement.extend({

	setupDomObject : function(config) {
		this.control = new JOOTextInput();
		this._super(config);
	}
});

JOOPropertiesDialog = JOODialog.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.setTitle('Properties');
		this.getContentPane().setLayout('vertical');
		this.supportedProperties = config.supportedProperties || this.supportedProperties || [];
		this.propertyMappings = config.propertyMappings || this.propertyMappings || {
			'colorpicker' : JOOColorProperty,
			'media' : JOOMediaProperty,
			'slider' : JOOSliderProperty,
			'select' : JOOSelectProperty,
			'text' : JOOTextProperty,
			'textarea' : JOOTextAreaProperty
		};

		this.generatePropertyElements();
		this.reloadList();
	},

	removeTarget : function(target) {
		if (target != undefined) {
			target.removeEventListener('stylechange', this.onTargetStyle);
			target._parent.removeEventListener('stylechange', this.onTargetStyle);
			target._parent.removeEventListener('dragstop', this.onTargetStyle);
		}
		if (this.target == target) {
			this.target = undefined;
			this.reloadList();
		}
	},

	setTarget : function(target) {
		if (this.target != undefined) {
			this.target.removeEventListener('stylechange', this.onTargetStyle);
			this.target._parent.removeEventListener('stylechange', this.onTargetStyle);
			this.target._parent.removeEventListener('dragstop', this.onTargetStyle);
		}
		if (this.target != target) {
			if (this.target) {
				currentTargetId = this.target.getId();
			}
			this.target = target;
			this.reloadList();
		}
	},

	onTargetStyle : function(e) {
		//generateEvent('ObjectStyleChanged', e);
	},

	updateList : function(e) {
		var supported = undefined;
		if (this.target)
			supported = this.target.getSupportedProperties();
		for (var i in this.props) {
			if (e.indexOf(this.props[i].options.property.name) == -1 || !this.target || !supported || (supported.indexOf(i) == -1 && supported != "all")) {

			} else {
				var orig = this.props[i].element.onchange;
				this.props[i].element.onchange = function() {
				};
				this.props[i].element.setValue(this.target.getProperty(this.props[i].options.property));
				this.props[i].element.onchange = orig;
			}
		}
	},

	reloadList : function() {
		var supported = undefined;

		if (this.target) {
			this.target._parent.addEventListener('stylechange', this.onTargetStyle);
			this.target.addEventListener('stylechange', this.onTargetStyle);
			this.target._parent.addEventListener('dragstop', this.onTargetStyle);
			supported = this.target.getSupportedProperties();
		}
		for (var i in this.props) {
			if (!this.target || !supported || (supported.indexOf(i) == -1 && supported != "all")) {
				if (this.props[i].options.autohide) {
					this.props[i].element.access().hide();
					this.props[i].element.setAttribute('hide', '');
				}
				this.props[i].element.disable(true);
			} else {
				var _self = this;
				this.props[i].element.access().removeAttr('hide');
				this.props[i].element.access().show();

				this.props[i].element.disable(false);
				this.props[i].element.targetProperty = this.props[i].options.property;
				this.props[i].element.setValue(this.target.getProperty(this.props[i].options.property));
				this.props[i].element.onchange = function() {
					_self.target.setProperty(this.targetProperty, this.getValue());
					_self.dispatchEvent('change');
				};
			}
		}

		for (var i = 0; i < this.accords.length; i++) {
			var len = this.accords[i].getContentPane().access().children(':not([hide])').length;
			if (len > 0)
				this.accords[i].access().show();
			else
				this.accords[i].access().hide();
		}
	},

	generatePropertyElements : function() {
		this.props = Array();
		this.accords = Array();

		var props = this.supportedProperties;
		this.tab = new JOOTabbedPane({
			width : '98%'
		});
		this.tab.access().addClass('properties-tab');
		for (var i = 0; i < props.length; i++) {
			var sketch = new Sketch();
			var cats = props[i].categories;
			for (var j = 0; j < cats.length; j++) {
				var accord = new JOOAccordion({
					lbl : cats[j].category
				});
				if (cats[j].options != undefined) {
					for (var k = 0; k < cats[j].options.length; k++) {
						var opt = cats[j].options[k];
						opt.config.lbl = opt.name;
						var element = new this.propertyMappings[opt.type](opt.config);
						element.onchange = function() {
						};
						element.addEventListener('change', function() {
							this.onchange();
						});
						accord.getContentPane().addChild(element);
						this.props[opt.id] = {
							element : element,
							options : opt
						};
					}
				}
				this.accords.push(accord);
				sketch.addChild(accord);
			}
			this.tab.addTab(props[i].section, sketch);
			this.tab.setTab(0);
		}
		this.getContentPane().addChild(this.tab);
	}
}).implement(DraggableInterface);
JOOResizableComponent = UIComponent.extend({

	getAbsoluteAngleArray : function(editPos) {
		var _self = this;
		var angle = _self.getRotation();
		if (!editPos)
			editPos = {
				x : 0,
				y : 0
			};
		var posArr = [];
		posArr.push(getPositionFromRotatedCoordinate({
			x : 0 + editPos.x,
			y : 0 + editPos.y
		}, angle * Math.PI / 180));
		posArr.push(getPositionFromRotatedCoordinate({
			x : _self.getWidth() + editPos.x,
			y : 0 + editPos.y
		}, angle * Math.PI / 180));
		posArr.push(getPositionFromRotatedCoordinate({
			x : _self.getWidth() + editPos.x,
			y : _self.getHeight() + editPos.y
		}, angle * Math.PI / 180));
		posArr.push(getPositionFromRotatedCoordinate({
			x : 0 + editPos.x,
			y : _self.getHeight() + editPos.y
		}, angle * Math.PI / 180));
		return posArr;
	},

	getEditCoefPos : function(editPos) {
		var root = {
			x : Number.MAX_VALUE,
			y : Number.MAX_VALUE
		};
		var posArr = this.getAbsoluteAngleArray(editPos);
		for (var i = 0; i < posArr.length; i++) {
			if (posArr[i].x < root.x)
				root.x = posArr[i].x;
			if (posArr[i].y < root.y)
				root.y = posArr[i].y;
		}
		return root;
	},

	offsetBoundary : function() {
		var center = this.getRotationCenterPoint();
		var boundaryRootPosRelative = this.getEditCoefPos({
			x : -parseFloat(this.access().width()) * this.rotationCenter.x,
			y : -parseFloat(this.access().height()) * this.rotationCenter.y
		});
		return {
			x : center.x + boundaryRootPosRelative.x,
			y : center.y + boundaryRootPosRelative.y
		};
	},

	fixingRotatedValue : function() {
		var pos1 = this.virtualNontransformedOffset();
		var pos2 = this.offsetBoundary();
		return {
			x : pos1.x - pos2.x,
			y : pos1.y - pos2.y
		};
	},

	beforeStartDragging : function(e) {
		var fixingValue = this.fixingRotatedValue();
		e.pageX -= fixingValue.x;
		e.pageY -= fixingValue.y;
	},

	setupDomObject : function(config) {
		this.wrappedObject = this.setupWrappedObject(config);

		this._super(config);
		this.beginEditable(undefined, undefined, undefined, true);

		this.addEventListener('dragstop', this.onDragStopHandler);
		this.addEventListener('click', this.onClick);
		this.addEventListener('drag', this.onDragHandler);
		this.addEventListener('mouseover', this.onMouseOverHandler);
		this.addEventListener('mouseout', this.onMouseOutHandler);

		this.hideResizeControl();

		//		this.startDrag();
		this.addEventListener('stageUpdated', function() {
			this.updateArea({
				w : this.getWidth(),
				h : this.getHeight()
			});
		});

		this.addChild(this.wrappedObject);
	},

	setupWrappedObject : function() {

	},

	getWrappedObject : function() {
		return this.wrappedObject;
	},

	onClick : function(e) {
		this.select(e.ctrlKey);
		e.stopPropagation();
	},

	_select : function() {
		this.startDrag();
		this.showResizeControl();
		this.access().addClass('joo-selected');
	},

	_deselect : function() {
		this.stopDrag();
		this.hideResizeControl();
		this.access().removeClass('joo-selected');
	},

	onDragHandler : function(e) {
	},

	onDragStopHandler : function(e) {
	},

	onMouseOverHandler : function(e) {
	},

	onMouseOutHandler : function(e) {
	},

	onMouseUpHandler : function(e) {
		this.startDrag();
	},

	onMouseDownHandler : function(e) {
		this.stopDrag();
	},

	setRotation : function(a) {
		this._super(a);
		//this.wrappedObject.setRotation(a);
	},

	setWidth : function(w) {
		//this._super(w);
		var deltaW = this.wrappedObject.access().outerWidth() - this.wrappedObject.getWidth();
		this.wrappedObject.setWidth(w - deltaW);
	},

	setHeight : function(h) {
		//this._super(h);
		var deltaH = this.wrappedObject.access().outerHeight() - this.wrappedObject.getHeight();
		this.wrappedObject.setHeight(h - deltaH);
	}
}).implement(ResizableInterface, DraggableInterface, SelectableInterface);

JOOResizableWrapper = JOOResizableComponent.extend({

	setupWrappedObject : function(config) {
		return this.config.object;
	},

	getCanvas : function() {
		return this.canvas;
	}
});

JOOAvatarIcon = JOOImage.extend({

	setupBase : function(config) {
		if (config.realObject) {
			this.realObject = config.realObject;
		} else if (config.getRealObject) {
			this.getRealObject = config.getRealObject;
		}
		this._super(config);
	},

	setupDomObject : function(config) {
		config.width = config.width || 32;
		config.height = config.height || 32;

		this._super(config);
		this.draggable({
			helper : 'clone',
			revert : 'invalid'
		});
		this.startDrag();

		if (!config.passMouseDownEvent) {
			this.addEventListener('mousedown', function(e) {
				e.stopPropagation();
			});
		}
	},

	getRealObject : function() {
		var className = this.realObject.className;
		if ( typeof className != 'string')
			return new className(this.realObject.config);
		return this.realObject;
	}
}).implement(DraggableInterface);

DroppablePanel = Panel.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.droppable();
	}
}).implement(DroppableInterface);

DragDropController = Class.extend({

	init : function() {
		if (DragDropController.instance != undefined)
			throw "DragDropController is singleton and cannot be initiated";
		this.className = "DragDropController";
		this.dragDropMappings = Array();
	},

	registerDragDrop : function(dragElem, dropElems) {
		for (var i = 0; i < dropElems.length; i++) {
			dropElems[i].possibleDroppers = dropElems[i].possibleDroppers || {};
			dropElems[i].possibleDroppers[dragElem.getId()] = dragElem;
			if (this.dragDropMappings.indexOf(dropElems[i]) == -1)
				this.dragDropMappings.push(dropElems[i]);
		}
	},

	updateDragDrop : function() {
		for (var i = 0; i < this.dragDropMappings.length; i++) {
			this.dragDropMappings[i].addEventListener('drop', function(e, ui) {
				var id = $(ui.draggable.context).attr('id');
				if (this.possibleDroppers[id] != undefined) {
					e.droppedObject = this.possibleDroppers[id];
					e.position = ui.position;
					this.dispatchEvent('objectDropped', e);
				}
			});
			this.dragDropMappings[i].addEventListener('objectDropped', function(e) {
				var realObject = e.droppedObject.getRealObject();
				realObject.setLocation(e.pageX - this.offset().x, e.pageY - this.offset().y);
				this.addChild(realObject);
			});
		}
	},

	clear : function() {
		for (var i = 0; i < this.dragDropMappings.length; i++) {
			this.dragDropMappings[i].possibleDroppers = undefined;
		}
	}
});

JOOImageWrapper = Panel.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.img = new JOOImage({
			src : config.src
		});
		this.addChild(this.img);
		this.setAttribute('src', this.img.getAttribute('src'));
	}
});

JOOSearchUI = Sketch.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.searchInput = new JOOTextInput({
			width : '100%',
			height : 20
		});
		this.searchSketch = new Sketch({
			height : 140
		});
		this.searchSketch.setStyle('overflow', 'auto');
		this.addChild(this.searchInput);
		this.addChild(this.searchSketch);

		this.setupServices();
	},

	setupServices : function() {
		if (this.config.searchServices) {
			var _self = this;
			for (var i in this.config.searchServices) {
				this.config.searchServices[i].addEventListener('success', function(ret) {
					_self.addSearchImages(this.name, ret);
				});
				this[this.config.searchServices[i].name] = new JOOAccordion({
					lbl : this.config.searchServices[i].name
				});
				this.searchSketch.addChild(this[this.config.searchServices[i].name]);
			}
			var _self = this;
			this.searchInput.addEventListener('keydown', function(e) {
				if (e.keyCode == 13) {
					e.stopPropagation();
					e.preventDefault();
					for (var i in _self.config.searchServices) {
						_self.config.searchServices[i].run({
							query : this.getValue()
						});
					}
				}
			});
		}
	},

	addSearchImages : function(name, ret) {
		this[name].getContentPane().removeAllChildren();
		if (ret.length > 0) {
			for (var i in ret) {
				var imgPanel = this._getImageWrapper(ret[i], 'joo-search-imgwrapper');
				this[name].getContentPane().addChild(imgPanel);
			}
		}
	},

	_getImageWrapper : function(retImg, cls) {
		var _self = this;
		var imgPanel = new JOOImageWrapper({
			extclasses : cls,
			src : retImg
		});
		imgPanel.addEventListener('click', function() {
			_self.value = this.getAttribute('src');
			_self.dispatchEvent('imageclick');
		});
		return imgPanel;
	}
});

JOOMediaBrowser = JOODialog.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.title = config.title || "Media Browser";
		this.browseService = config.browseService;
		this.uploadService = config.uploadService;
		this.searchServices = config.searchServices;
		this.autofetch = config.autofetch;
		this._generateUI();
	},

	_generateUI : function() {
		this.setTitle(this.title);
		if (this.browseService || this.searchServices) {
			var tab = new JOOTabbedPane({
				width : 300,
				height : 200
			});
			if (this.browseService) {
				this.browseSketch = new Sketch();
				this.browseSketch.access().addClass('joo-upload-browse');
				tab.addTab('Uploaded', this.browseSketch);
			}
			if (this.searchServices) {
				tab.addTab('Search', new JOOSearchUI({
					height : 160,
					services : config.searchServices
				}));
			}
			this.getContentPane().addChild(tab);
		}
		this.buttonsContainer = new Sketch();
		this.buttonsContainer.setLayout('flow');
		this.buttonsContainer.setStyle('text-align', 'center');
		if (this.uploadService) {
			this.uploader = new JOOAdvancedUploader({
				name : 'file',
				endpoint : this.uploadService.getEndPoint(),
				control : new JOOButton({
					lbl : 'Upload'
				})
			});
			this.buttonsContainer.addChild(this.uploader);
		}
		var _self = this;
		this.urlBtn = new JOOButton({
			lbl : 'Enter URL'
		});
		this.urlBtn.addEventListener('click', function() {
			_self.showUrlInput();
		});

		this.urlContainer = new Sketch();
		this.urlContainer.setLayout('flow');
		this.urlInput = new JOOTextInput({
			width : 200,
			height : 25,
			value : 'http://'
		});
		this.urlInput.addEventListener('keyup', function(e) {
			_self.urlKeyup(e);
		});
		this.uploader.addEventListener('change', function(e) {
			e.stopPropagation();
		});
		this.urlInput.addEventListener('change', function(e) {
			e.stopPropagation();
		});
		var urlClose = new JOOButton({
			lbl : 'Cancel'
		});
		urlClose.addEventListener('click', function() {
			_self.urlClose();
		});
		this.urlContainer.access().hide();
		this.urlContainer.access().addClass('joo-media-url-container');

		this.urlContainer.addChild(this.urlInput);
		this.urlContainer.addChild(urlClose);
		this.buttonsContainer.addChild(this.urlBtn);
		this.getContentPane().addChild(this.buttonsContainer);
		this.getContentPane().addChild(this.urlContainer);

		if (this.browseService) {
			this.browseService.addEventListener('success', function(ret) {
				_self.addBrowseImages(ret);
			});
		}

		if (this.uploadService) {
			this.uploader.addEventListener('submitSuccess', function(ret) {
				ret = $.parseJSON(ret.data);
				ret = _self.uploadService.parse(ret.result.data);
				_self.value = ret.url;
				_self.dispatchEvent('change');
				_self.browseService.run();
			});
		}

		if (this.autofetch) {
			this.addEventListener('stageUpdated', function() {
				this.fetch();
			});
		}
	},

	fetch : function() {
		this.browseService.run();
	},

	getValue : function() {
		return this.value;
	},

	setValue : function(value) {
		this.value = value;
	},

	addBrowseImages : function(ret) {
		while (this.browseSketch.children.length > 0) {
			this.browseSketch.removeChildAt(0);
		}
		if (ret.length > 0) {
			for (var i in ret) {
				var imgPanel = this._getImageWrapper(ret[i].url, 'joo-browse-imgwrapper');
				this.browseSketch.addChild(imgPanel);
			}
		}
	},

	_getImageWrapper : function(retImg, cls) {
		var _self = this;
		var imgPanel = new JOOImageWrapper({
			extclasses : cls,
			src : retImg
		});
		imgPanel.addEventListener('click', function() {
			_self.value = this.getAttribute('src');
			_self.dispatchEvent('change');
		});
		return imgPanel;
	},

	showUrlInput : function() {
		this.buttonsContainer.access().hide();
		this.urlContainer.access().show();
		this.urlInput.focus();
	},

	urlKeyup : function(e) {
		if (e.keyCode == 13) {
			this.value = this.urlInput.getValue();
			this.dispatchEvent('change');
		}
	},

	urlClose : function() {
		this.buttonsContainer.access().show();
		this.urlContainer.access().hide();
	}
});

JOOHtmlObject = DisplayObjectContainer.extend({

	setupDomObject : function(config) {
		this._super(config);
		if (config.classid)
			this.setAttribute("classid", config.classid);
	},

	getObject : function() {
		return window[this.id];
	},

	toHtml : function() {
		return "<object></object>";
	}
});

JOOFontSelector = JOOInput.extend({

	setupDomObject : function(config) {
		this._super(config);
		this.select = new JOOInputSelect({
			width : '100%'
		});
		this.addChild(this.select);

		var fonts = ['', 'cursive', 'monospace', 'serif', 'sans-serif', 'fantasy', 'default', 'Arial', 'Arial Black', 'Arial Narrow', 'Arial Rounded MT Bold', 'Bookman Old Style', 'Bradley Hand ITC', 'Century', 'Century Gothic', 'Comic Sans MS', 'Courier', 'Courier New', 'Georgia', 'Gentium', 'Impact', 'King', 'Lucida Console', 'Lalit', 'Modena', 'Monotype Corsiva', 'Papyrus', 'Tahoma', 'TeX', 'Times', 'Times New Roman', 'Trebuchet MS', 'Verdana', 'Verona'];

		for (var i = 0; i < fonts.length; i++) {
			this.select.addOption({
				label : fonts[i],
				value : fonts[i]
			});
		}
	},

	getValue : function() {
		return this.select.getValue();
	},

	setValue : function(value) {
		this.select.setValue(value);
	},

	toHtml : function() {
		return "<div></div>";
	}
});
/*JOOMovieClip = JOOSprite.extend({

 setupBase: function(config) {
 this._appendBaseClass('JOOMovieClip');
 this.skippedAnimation = ['position'];
 this._super(config);
 },

 setupDomObject: function(config) {
 this._super(config);
 this.generateData(config.data);
 },

 generateData: function(data) {
 this.data = data;
 this.objects = {};
 var objects = data.objects;
 for(var i in objects) {
 var obj = undefined;
 if (objects[i].obj != undefined)
 obj = objects[i].obj;
 else if (typeof objects[i].className == 'string')
 obj = new window[objects[i].className](objects[i].config);
 else
 obj = new objects[i].className(objects[i].config);
 for(var j in objects[i].attributes) {
 obj.setAttribute(j, objects[i].attributes[j]);
 }
 this.objects[objects[i].id] = obj;
 this.addChild(obj);
 }
 this.animation = data.animations;
 this.horizontalFramesNo = data.frames;
 this.verticalFramesNo = 1;
 },

 onReplay: function() {
 for(var i in this.objects) {
 this.removeChild(this.objects[i]);
 }
 this.generateData(this.data);
 },

 replay: function() {
 this.onReplay();
 this.played = false;
 this.play();
 },

 play: function() {
 this.oldFrame = 0;
 this.currentFrameIndex = 0;

 //let browser have sometime to initiate animation
 if (this.played) {
 this._super();
 return;
 }
 var _self = this;
 setTimeout(function() {
 _self.played = true;
 _self.play();
 }, 10);
 },

 onFrame: function(frame) {
 if (this.currentFrameIndex != 0 && frame == this.startFrame) {
 this.oldFrame = 0;
 this.currentFrameIndex = 0;
 this.onReplay();
 }
 if (this.currentFrameIndex < this.animation.length && frame == this.oldFrame) {
 console.log('hehe');
 //calculate the time needed to complete the current animation set
 var framesDiff = this.animation[this.currentFrameIndex].keyFrame - this.oldFrame;
 this.oldFrame = this.animation[this.currentFrameIndex].keyFrame;
 if (this.oldFrame == 0)
 this.oldFrame = 1;
 var timeDiff = parseFloat(framesDiff / this.framerate);
 for(var i in this.objects) {
 this.objects[i].access().stop(true, true);
 this.objects[i].animations = Array();
 this.objects[i].effects = Array();
 }
 //parse the current animation
 //TODO: Implement a way to allow moving this code segment to the constructor
 var animations = this.animation[this.currentFrameIndex].animations;
 for(var i=0; i<animations.length; i++) {
 if (animations[i].actions) {
 var actions = animations[i].actions.split(';');
 for(var j=0; j<actions.length; j++) {
 var actionArr = actions[j].split(':');
 if (actionArr.length == 2) {
 var key = actionArr[0].trim();
 var value = actionArr[1].trim();
 if (key.length > 0 && this.skippedAnimation.indexOf(key) == -1)
 this.objects[animations[i].object].animations[key] = value;
 }
 }
 }

 if (animations[i].effects) {
 var effects = animations[i].effects;
 for(var j=0; j<effects.length; j++) {
 var key = effects[j].name;
 var value = effects[j].option;
 if (key && key.length > 0) {
 this.objects[animations[i].object].effects[key] = value;
 }
 }
 }

 //calling scripts if any
 if (animations[i].script) {
 animations[i].script.call(this, frame);
 }
 }
 //run the animation
 for(var i in this.objects) {
 var animations = this.objects[i].animations;
 var keys = Array();
 for(var key in animations) {
 keys.push(key);
 }
 if (keys.length > 0) {
 if (timeDiff > 0) {

 this.objects[i].setCSS3Style('transition-duration', timeDiff+'s');
 this.objects[i].setCSS3Style('transition-property', keys.join(','));
 }
 for(var key in animations) {
 this.objects[i].setStyle(key, animations[key]);
 }
 } else {
 this.objects[i].setCSS3Style('transition-duration', '');
 }

 var effects = this.objects[i].effects;
 for(var j in effects) {
 if (typeof this.objects[i]['runEffect'] == 'undefined') {
 Wrapper.wrap(this.objects[i], EffectableInterface);
 }
 for(var name in effects) {
 this.objects[i].runEffect(name, effects[name], timeDiff * 1000);
 }
 break;
 }
 }
 this.currentFrameIndex++;
 }
 }
 });*/

JOOAnimationData = Class.extend({

	init : function(config) {
		this.object = config.object;
		this.start = config.start;
		this.end = config.end;
		this.duration = config.duration;
		this.delay = config.delay;
	}
});

/**
 * @class A movie clip is a sprite with custom animation, it also supports script.
 * <p>It supports additional configuration parameters</p>
 * <ul>
 * 	<li><code>data</code> The animation data</li>
 * </ul>
 * @augments JOOSprite
 */
JOOMovieClip = JOOSprite.extend({

	setupBase : function(config) {
		this.skippedAnimation = ['position'];
		this.scripts = {};
		this.intervals = Array();
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		this.generateData(config.data);
	},

	generateData : function(data) {
		this.animationsMeta = Array();
		this.data = data;
		this.objectDefs = {};
		this.objects = {};
		var objects = data.objects;
		for (var i in objects) {
			this.objectDefs[objects[i].name] = objects[i];
		}
		this.buildStage();
		this.buildAnimations();
		this.buildScript();
	},

	buildScript : function() {
		if (this.data.scripts) {
			for (var i in this.data.scripts) {
				this.scripts[i] = new Function(this.data.scripts[i]);
			}
		}
	},

	buildStage : function() {
		var stageDef = this.data.stage;
		this.animStage = new window[stageDef.className](stageDef.config);
		var children = stageDef.children;
		for (var i in children) {
			var obj = this.buildChildren(children[i]);
			this.animStage.addChild(obj);
		}
		this.addChild(this.animStage);
	},

	buildChildren : function(child) {
		var objDef = this.objectDefs[child.ref];
		if (objDef == undefined)
			throw child.ref + " is not undefined";
		var obj = undefined;
		obj = new window[objDef.className](objDef.config);
		// build attribute
		for (var i in objDef.attributes) {
			obj.setAttribute(i, objDef.attributes[i]);
		}
		obj.setStyle("display", "none");
		if (!obj.getStyle("position")) {
			obj.setStyle("position", "absolute");
		}
		if (objDef.type == "composition") {
			//obj.setLayout('absolute');
			for (var i in objDef.children) {
				var _child = this.buildChildren(objDef.children[i]);
				obj.addChild(_child);
			}
		}
		if (child.id) {
			this.objects[child.id] = obj;
		}
		if (obj.play) {
			obj.play();
		}
		this[objDef.varName] = obj;
		return obj;
	},

	buildAnimations : function() {
		//this.animations = this.data.animations;
		this.actions = {};
		for (var i in this.data.actions) {
			this.actions[this.data.actions[i].name] = this.data.actions[i];
		}
		this.animations = {};
		for (var i in this.data.animations) {
			var delay = this.data.animations[i].delay;
			this.animations[delay] = this.animations[delay] || new Array();
			this.animations[delay].push(this.data.animations[i]);
		}
		this.horizontalFramesNo = this.data.frames + 1;
		this.verticalFramesNo = 1;
	},

	_stripOldAnimationsMeta : function() {
		var frame = this.currentFrame;
		for (var i = this.animationsMeta.length - 1; i >= 0; i--) {
			if (frame - this.animationsMeta[i].delay >= this.animationsMeta[i].duration) {
				this.animationsMeta.splice(i, 1);
			}
		}
	},

	play : function() {
		this.played = true;
		this._super();
	},

	onFrame : function(frame) {
		var animations = this.animations[frame];
		if (animations) {
			for (var i in animations) {
				if (animations[i].script_ref)
					this.callScript(animations[i]);
				else
					this.playAnimation(animations[i], 0);
			}
		}
	},

	callScript : function(animation) {
		//var fn = window[animation.script_ref];
		var fn = this.scripts[animation.script_ref];
		if (!fn) {
			fn = window[animation.script_ref];
		}
		if (fn) {
			var args = animation.script_args;
			if (args == undefined || args == "")
				args = "[]";
			try {
				fn.apply(this, JSON.parse(args));
			} catch (e) {
				log(e);
			}
		}
	},

	playAnimation : function(animation, time) {
		if (time >= animation.loop && animation.loop != -1)
			return;
		var objRef = animation.object_ref.split('#');
		var obj = this.objects[objRef[0]];
		for (var i = 1; i < objRef.length; i++) {
			obj = obj.children[objRef[i]];
		}
		var actions = this.actions[animation.action_ref];
		//		obj.setCSS3Style('transition-timing-function', 'linear');
		this.animationsMeta.push(new JOOAnimationData({
			object : obj,
			delay : animation.delay,
			start : actions.start,
			end : actions.end,
			duration : actions.duration
		}));
		this.doPlayAnimation([obj, actions, time, animation]);
	},

	doPlayAnimation : function(args) {
		var _obj = args[0];
		var _actions = args[1];
		//		_obj.setCSS3Style('transition-property', '');
		//		_obj.setCSS3Style('transition-duration', '');
		var keys = this.setStyles(_obj, _actions.start);
		//		_obj.getStyle('-webkit-transform');
		//
		//		var duration = _actions.duration / this.framerate * 1000;
		//		_obj.setCSS3Style('transition-duration', duration+'ms');
		//		_obj.setCSS3Style('transition-property', keys.join(','));
		//
		//		this.setStyles(_obj, _actions.end);
	},

	setStyles : function(obj, actions) {
		var styles = actions.split(';');
		var keys = Array();
		for (var i in styles) {
			var kv = styles[i].split(':');
			if (kv.length < 2)
				continue;
			var k = kv[0].trim();
			var v = kv[1].trim();
			keys.push(k);
			obj.setStyle(k, v);
		}
		return keys;
	},

	dispose : function() {
		for (var i in this.intervals) {
			clearInterval(this.intervals[i]);
		}
		this._super();
	}
});

JOOSpriteAnimation = UIComponent.extend({

	setupBase : function(config) {
		this._super(config);
		this.sprite = new JOOSprite(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		this.addChild(this.sprite);
		var _self = this;
		setTimeout(function() {
			_self.sprite.play(config.startFrame, config.endFrame);
		}, 300);
	},

	toHtml : function() {
		return "<div></div>";
	}
});

JOOKeyframeAnimationEngine = Class.extend({

	init : function(config) {
		this.obj = config.obj;
		this.animation = config.animation;
	}
});
/**
 * @class Used for formalizing the observer design pattern,
 * especially in an event-based application
 * @interface
 */
ObserverInterface = InterfaceImplementor.extend({

	implement : function(obj) {
		/**
		 * Called when the observer is notified of an event by the {@link Subject}.
		 * The default implementation forward the request
		 * @methodOf ObserverInterface#
		 * @name notify
		 * @param {String} eventName the event name
		 * @param {Object} eventData the event data
		 * @returns {Boolean} whether the event is interested by this observer or not.
		 */
		obj.prototype.notify = obj.prototype.notify ||
		function(eventName, eventData) {
			var methodName = "on" + eventName;
			if ( typeof this[methodName] != 'undefined') {
				var method = this[methodName];
				method.call(this, eventData);
				return true;
			}
			return false;
		};

		/**
		 * Register this observer with the {@link Subject}.
		 * @methodOf ObserverInterface#
		 * @name registerObserver
		 */
		obj.prototype.registerObserver = obj.prototype.registerObserver ||
		function() {
			var subject = SingletonFactory.getInstance(Subject);
			subject.attachObserver(this);
		};

		/**
		 * Unregister this observer with the {@link Subject}.
		 * @methodOf ObserverInterface#
		 * @name unregisterObserver
		 */
		obj.prototype.unregisterObserver = obj.prototype.unregisterObserver ||
		function() {
			var subject = SingletonFactory.getInstance(Subject);
			subject.detachObserver(this);
		};
	}
});

Subject = Class.extend(
/** @lends Subject# */
{

	/**
	 * Initialize observers
	 * @class <code>Subject</code> is the central of Observer pattern. It maintains a list
	 * of observers, and notifies them automatically of new events. <code>Subject</code> is
	 * a <code>singleton</code> class.
	 * @augments Class
	 * @constructs
	 */
	init : function() {
		this.observers = Array();
	},

	/**
	 * Attach an observer
	 * @param {ObserverInterface} observer the observer to be attached
	 */
	attachObserver : function(observer) {
		this.observers.push(observer);
	},

	/**
	 * Detach an observer
	 * @param {ObserverInterface} observer the observer to be detached
	 */
	detachObserver : function(observer) {
		if (observer == undefined)
			return;
		var index = this.observers.indexOf(observer);
		if (index > 0) {
			this.observers.splice(index, 1);
		}
	},

	/**
	 * Notify an event to all observers
	 * @param {String} eventName the name of the event which should contains characters only
	 * @param {Object} eventData the data associated with the event
	 */
	notifyEvent : function(eventName, eventData) {
		var count = 0;
		for (var i = 0; i < this.observers.length; i++) {
			try {
				var result = this.observers[i].notify(eventName, eventData);
				if (result == true) {
					count++;
				}
			} catch (err) {
				log(err);
			}
		}
	},

	toString : function() {
		return "Subject";
	}
});
JOOService = EventDispatcher.extend({

	init : function(endpoint, method) {
		this._super();
		this.name = "DefaultService";
		this.endpoint = endpoint || "";
		this.method = method || "get";
	},

	run : function(params) {
		var _self = this;
		this.onAjax(this.endpoint, params, this.method, {
			onSuccess : function(ret) {
				ret = _self.parse(ret);
				_self.dispatchEvent('success', ret);
				JOOUtils.generateEvent('ServiceSuccess', this.name, ret);
			},
			onFailure : function(msg) {
				msg = _self.parseError(msg);
				_self.dispatchEvent('failure', msg);
				JOOUtils.generateEvent('ServiceFailure', this.name, msg);
			}
		});
	},

	parse : function(ret) {
		return ret;
	},

	parseError : function(msg) {
		return msg;
	},

	getEndPoint : function() {
		return this.endpoint;
	}
}).implement(AjaxInterface);

/**
 * @class A model which supports property change event.
 * @augments EventDispatcher
 */
JOOModel = EventDispatcher.extend({

	bindings : function(obj, path) {
		path = path || "";
		obj = obj || this;
		for (var i in obj) {
			this._bindings(obj, i, path);
		}
	},

	notifyChange : function(path, params) {
		this.dispatchEvent('change', {
			type : 'manual',
			path : path,
			params : params
		});
	},

	setPropertyAndBind : function(obj, i, value) {
		obj[i] = value;
		this._bindings(obj, i, obj.__path__);
	},

	_bindings : function(obj, i, path) {
		if (i == 'className' || i == 'ancestors' || i == 'listeners' || i == '_bindingName_')
			return;
		if ( obj instanceof JOOModel && obj != this)
			return;
		if (path == "") {
			path = i;
		} else {
			path += "['" + i + "']";
		}
		if ( typeof obj[i] != 'function') {
			if (obj[i] instanceof Object || obj[i] instanceof Array) {
				if (obj[i] instanceof Array) {
					this.bindForArray(obj[i], path);
				}
				this.bindings(obj[i], path);
				//recursively bind
			}
			this.bindForValue(obj, i, path);
		}
	},

	bindForArray : function(obj, path) {
		var _self = this;
		//	    var length = obj.length;
		//	    obj.__defineGetter__("length", function() {
		//			return length;
		//		});
		this.hookUp(obj, 'push', path, function(item) {
			_self._bindings(obj, obj.length - 1, path);
		});
		this.hookUp(obj, 'pop', path);
		this.hookUp(obj, 'splice', path, function() {
			for (var i = 2; i < arguments.length; i++) {
				_self._bindings(obj, obj.length - arguments.length - i, path);
			}
		});
	},

	hookUp : function(obj, fn, path, callback) {
		var _self = this;
		var orig = obj[fn];
		obj[fn] = function() {
			orig.apply(obj, arguments);
			callback.apply(undefined, arguments);
			_self.dispatchEvent('change', {
				type : 'function',
				functionName : fn,
				arguments : arguments,
				path : path
			});
		};
	},

	bindForValue : function(obj, i, path) {
		var _self = this;
		var prop = "_" + i;
		obj[prop] = obj[i];
		obj[i] = undefined;
		delete obj[i];

		obj.__path__ = path;

		if (obj['__lookupGetter__']) {
			if (!obj.__lookupGetter__(i)) {
				obj.__defineGetter__(i, function() {
					return obj[prop];
				});
			}
			if (!obj.__lookupSetter__(i)) {
				obj.__defineSetter__(i, function(val) {
					var oldValue = obj[prop];
					if (oldValue != val) {
						obj[prop] = val;
						_self.dispatchEvent('change', {
							type : 'setter',
							value : val,
							prop : i,
							path : path
						});
					}
				});
			}
		} else {
			Object.defineProperty(obj, i, {
				get : function() {
					return obj[prop];
				},

				set : function(val) {
					var oldValue = obj[prop];
					if (oldValue != val) {
						obj[prop] = val;
						_self.dispatchEvent('change', {
							type : 'setter',
							value : val,
							prop : i,
							path : path
						});
					}
				}
			});
		}
	}
});

/**
 * Create or extend model from ordinary object
 * @param {Object} obj the object
 * @param {JOOModel} model existing model
 * @returns the result model
 */
JOOModel.from = function(obj, model) {
	model = model || new JOOModel();
	for (var i in obj) {
		model[i] = obj[i];
	}
	model.bindings();
	return model;
};
PluginManager = Class.extend(
/** @lends PluginManager# */
{
	/**
	 * Initialize fields
	 * @class Manages all registered plugins
	 * @singleton
	 * @augments Class
	 * @implements ObserverInterface
	 * @constructs
	 */
	init : function() {
		if (PluginManager.singleton == undefined) {
			throw "Singleton class, can not be directly created !";
			return undefined;
		}
		var subject = SingletonFactory.getInstance(Subject);
		subject.attachObserver(this);
		this.plugins = Array();
	},

	/**
	 * Add plugin to the manager
	 * @param {PluginInterface} plugin the plugin to be added
	 * @param {Boolean} delay whether the plugin should not be loaded after added
	 */
	addPlugin : function(plugin, delay) {
		if (delay != true)
			plugin.onLoad();
		this.plugins.push(plugin);
	},

	/**
	 * Remove plugin at the specified index
	 * @param {Number} index the index of the plugin to be removed
	 */
	removePlugin : function(index) {
		var plugin = this.plugins[index];
		if (plugin != undefined) {
			plugin.onUnload();
			this.plugins.splice(index, 1);
		}
	},

	/**
	 * Get all plugins
	 * @returns {Array} the current maintained plugins
	 */
	getPlugins : function() {
		return this.plugins;
	},

	/**
	 * Remove every plugins managed by this manager
	 */
	removeAllPlugins : function() {
		for (var i = 0; i < this.plugins.length; i++) {
			var plugin = this.plugins[i];
			if (plugin.isLoaded()) {
				plugin.onUnload();
			}
		}
		this.plugins = Array();
	},

	/**
	 * Triggered by the Subject and in turn triggers all plugins that it manages
	 * @param {String} eventName the event name
	 * @param {Object} eventData the event data
	 */
	notify : function(eventName, eventData) {
		for (var i = 0; i < this.plugins.length; i++) {
			var plugin = this.plugins[i];
			if (plugin.isLoaded()) {
				var methodName = "on" + eventName;
				if ( typeof plugin[methodName] != 'undefined') {
					var method = plugin[methodName];
					method.call(plugin, eventData);
				}
			}
		}
	},

	toString : function() {
		return "PluginManager";
	}
}).implement(ObserverInterface);

/**
 * @class The plugin interface. Every plugins must implement this interface.
 * A plugin is a class which provides extra functions via "Event Hook". It
 * registers a list of hooks which is called automatically in the corresponding
 * events.
 * @augments ObserverInterface
 * @interface
 */
PluginInterface = InterfaceImplementor.extend({
	implement : function(obj) {

		obj.prototype.toString = obj.prototype.toString ||
		function() {
			return this.name;
		};

		/**
		 * Get the init parameters supplied by configuration.
		 * This is usually configured in a <code>layout.txt</code>
		 * @methodOf PluginInterface#
		 * @name getInitParameters
		 * @returns {Array} the init parameters supplied by configuration
		 */
		obj.prototype.getInitParameters = obj.prototype.getInitParameters ||
		function() {
			if (this.initParams == undefined)
				this.initParams = Array();
			return this.initParams;
		};

		/**
		 * Change the init parameters. This method is not intended to be used
		 * by developers.
		 * @methodOf PluginInterface#
		 * @name setInitParameters
		 * @param {Object} params the init parameters
		 */
		obj.prototype.setInitParameters = obj.prototype.setInitParameters ||
		function(params) {
			this.initParams = params;
		};

		/**
		 * Test if the plugin is loaded.
		 * @methodOf PluginInterface#
		 * @name isLoaded
		 * @param {Boolean} <code>true</code> if the plugin is successfully loaded
		 */
		obj.prototype.isLoaded = obj.prototype.isLoaded ||
		function() {
			if (this.loaded == undefined)
				this.loaded = false;
			return this.loaded;
		};

		/**
		 * Get the plugin name.
		 * @methodOf PluginInterface#
		 * @name getName
		 * @param {String} the name of the plugin
		 */
		obj.prototype.getName = obj.prototype.getName ||
		function() {
			return this.className;
		};

		/**
		 * Called automatically by {@link PluginManager} when the plugin is
		 * loaded . Change the status of the plugin and call the
		 * <code>onBegin</code> method. Developers should override the
		 * <code>onBegin</code> method instead.
		 * @methodOf PluginInterface#
		 * @name onLoad
		 */
		obj.prototype.onLoad = obj.prototype.onLoad ||
		function() {
			this.loaded = true;
			this.onBegin();
		};

		/**
		 * Called inside <code>onLoad</code> method. Developers can override this
		 * method to do some stuffs when the plugin is loaded.
		 * @methodOf PluginInterface#
		 * @name onBegin
		 */
		obj.prototype.onBegin = obj.prototype.onBegin ||
		function() {
		};

		/**
		 * Called inside <code>onUnload</code> method. Developers can override this
		 * method to release resources before the plugin is unloaded.
		 * @methodOf PluginInterface#
		 * @name onEnd
		 */
		obj.prototype.onEnd = obj.prototype.onEnd ||
		function() {
		};

		/**
		 * Called automatically by {@link PluginManager} when the plugin is
		 * no longer need. Change the status of the plugin and call the
		 * <code>onEnd</code> method. Developers should override the
		 * <code>onEnd</code> method instead.
		 * @methodOf PluginInterface#
		 * @name onUnload
		 */
		obj.prototype.onUnload = obj.prototype.onUnload ||
		function() {
			this.loaded = false;
			this.onEnd();
		};

		//super interfaces
		new ObserverInterface().implement(obj);
	}
});

/**
 * @class Interval timer interface. Used for circular behaviour.
 * @interface
 */
IntervalTimerInterface = InterfaceImplementor.extend({
	implement : function(obj) {

		/**
		 * Start the timer.
		 * @methodOf IntervalTimerInterface#
		 * @param {Number} interval the interval
		 * @param {Function} callback the callback function
		 * @name startInterval
		 */
		obj.prototype.startInterval = obj.prototype.startInterval ||
		function(interval, callback) {
			//stop previous interval timer if any
			if (this.intervalSetup == true) {
				this.stopInterval();
			}
			this.intervalSetup = true;
			var _this = this;
			this.currentIntervalID = setInterval(function() {
				callback.call(_this);
			}, interval);
		};

		/**
		 * Stop the timer.
		 * @methodOf IntervalTimerInterface#
		 * @name stopInterval
		 */
		obj.prototype.stopInterval = obj.prototype.stopInterval ||
		function() {
			if (this.currentIntervalID != undefined)
				clearInterval(this.currentIntervalID);
			else {
				//console.warn('bug! currentIntervalID not defined');
			}
		};
	}
});
Page = Class.extend(
/** @lends Page# */
{

	/**
	 * Initialize fields
	 * @class Page is a class for attaching portlets to appropriate position.
	 * Page manages the display, the {@link PluginManager} & the {@link PortletContainer}.
	 * @augments Class
	 * @constructs
	 */
	init : function() {
		if (Page.singleton == undefined) {
			throw "Page is Singleton !";
			return undefined;
		}
		this.portletContainer = SingletonFactory.getInstance(PortletContainer);
		this.pluginManager = SingletonFactory.getInstance(PluginManager);
		this.pagename = "";
		this.title = "";
		this.cache = {};
	},

	/**
	 * Adds & loads portlets to the page.
	 * It will also handle portlets lifecycle. Portlets which are no longer needed
	 * will be unloaded. Portlets which exists between multiple pages will be
	 * reloaded.
	 */
	attachPortlets : function() {
		/*
		 * check for consistency with layout in here
		 * + portlet existence
		 * + portlet position
		 * + portlet active (?)
		 */
		for (var item in this.layout ) {
			item = this.layout[item];
			if (item.active == undefined) {
				item.active = true;
			}
			if (item.params == undefined) {
				item.params = Array();
			}
			var existed = false;
			for (var i = 0; i < this.portletContainer.portlets.length; i++) {
				item.id = item.id || item.portlet;
				var portletMeta = this.portletContainer.portlets[i];
				if (item.id === portletMeta.id) {
					existed = true;
					portletMeta.portlet.setInitParameters(item.params);
					if (item.position === portletMeta.position) {
						if (item.active !== portletMeta.active) {
							portletMeta.active = item.active;
							// FIXME: portletMeta.portlet.active ~> something like this must be implemented
						}
					} else {
						portletMeta.position = item.position;
						this.portletContainer.movePortlet(portletMeta, item.position);
					}
					if (item.active == true) {
						//portlet need reload?
						try {
							portletMeta.portlet.onReloadPage();
						} catch (err) {
							log(err);
						}
					}
					break;
				}
			}
			if (!existed) {
				if (window[item.portlet] == undefined) {
					log('portlet ' + item.portlet + ' is undefined');
				} else {
					var portlet = new window[item.portlet]();
					portlet.setInitParameters(item.params);
					this.portletContainer.addPortlet(portlet, item);
				}
			}
		}
		var portletsToRemoved = Array();
		for (var i = 0; i < this.portletContainer.portlets.length; i++) {
			var portletMeta = this.portletContainer.portlets[i];
			var keep = false;
			for (var item in this.layout) {
				item = this.layout[item];
				if (item.id === portletMeta.id) {
					if (item.active == false) {
						this.portletContainer.deactivatePortlet(portletMeta);
					}
					keep = true;
					break;
				}
			}
			if (!keep) {
				portletsToRemoved.push(portletMeta);
			}
		}
		for (var i = 0; i < portletsToRemoved.length; i++) {
			var plt = portletsToRemoved[i];
			var indexOf = this.portletContainer.portlets.indexOf(plt);
			this.portletContainer.removePortlet(indexOf);
		}
	},

	/**
	 * Parse the layout for a specific page.
	 * @param {String} pagename the name of the page
	 * @returns {Object} the layout of the page
	 */
	generateData : function(pagename) {
		if (this.cache[pagename])
			return this.cache[pagename];
		var data = {};
		var tmp = {};

		if (pagename == undefined) {
			throw {
				"Exception" : "NotFound",
				"Message" : "Page name is undefined"
			};
			return undefined;
		}
		var app = SingletonFactory.getInstance(Application);
		var jsonObj = app.getResourceManager().requestForResource("portlets", pagename, undefined, true);
		if (jsonObj == undefined) {
			//console.error(pagename+' not exist!');
			throw {
				"Exception" : "NotFound",
				"Message" : 'Page name "' + pagename + '" not found!'
			};
			return undefined;
		}
		this.title = jsonObj.attr('title');

		var jsonText = jsonObj.html();
		tmp = eval("(" + jsonText + ")");
		data.parent = tmp.parent;
		data.plugins = tmp.plugins;
		data.layout = tmp.portlets;
		var i, j;
		var toAddPlugins = new Array();
		var toAddPortlets = new Array();
		while (data.parent != undefined) {
			jsonObj = app.getResourceManager().requestForResource("portlets", data.parent, undefined, true);
			if (jsonObj == undefined) {
				//console.error(data.parent+' not exist!');
				throw {
					"Exception" : "NotFound",
					"Message" : '(Parent)Page name "' + data.parent + '" not found!'
				};
				return undefined;
			}
			jsonText = jsonObj.html();
			toAddPlugins = new Array();
			toAddPortlets = new Array();
			tmp = eval("(" + jsonText + ")");
			for ( i = 0; i < tmp.plugins.length; i++) {
				var existed = false;
				for ( j = 0; j < data.plugins.length; j++) {
					if (tmp.plugins[i].plugin == data.plugins[j].plugin) {
						existed = true;
						break;
					}
				}
				if (!existed) {
					toAddPlugins.push(tmp.plugins[i]);
				}
			}
			for ( i = 0; i < tmp.portlets.length; i++) {
				var existed = false;
				for ( j = 0; j < data.layout.length; j++) {
					if (tmp.portlets[i].portlet == data.layout[j].portlet) {
						existed = true;
						break;
					}
				}
				if (!existed) {
					toAddPortlets.push(tmp.portlets[i]);
				}
			}
			for ( i = 0; i < toAddPlugins.length; i++) {
				data.plugins.push(toAddPlugins[i]);
			}
			for ( i = 0; i < toAddPortlets.length; i++) {
				data.layout.push(toAddPortlets[i]);
			}
			data.parent = tmp.parent;
		}
		/*
		 if(tmp.position != undefined){
		 data.template = app.getResourceManager().requestForResource("page",pagename).html();
		 data.position = tmp.position;
		 }
		 */
		this.cache[pagename] = data;
		return data;
	},

	/**
	 * Get the current request.
	 * @returns {Request} the current request
	 */
	getRequest : function() {
		return this.request;
	},

	/**
	 * Change the current request.
	 * This method <b>should not</b> be called by developers
	 * @param {Request} request the new request
	 */
	setRequest : function(request) {
		this.request = request;
	},

	/**
	 * Attach plugins to the page.
	 * Plugins are treated the same way as portlets.
	 */
	attachPlugins : function() {
		var oldPlugins = this.pluginManager.getPlugins();
		for (var i in oldPlugins) {
			var oldPlg = oldPlugins[i];
			oldPlg.keep = false;
		}

		for (var j in this.plugins) {
			var newPlg = this.plugins[j];
			//check if the plugin exists
			var existed = false;
			for (var i = 0; i < oldPlugins.length; i++) {
				existed = false;
				var oldPlg = oldPlugins[i];
				if (oldPlg.getName() == newPlg.plugin) {
					oldPlg.setInitParameters(newPlg.params);
					oldPlg.keep = true;
					existed = true;
					break;
				}
			}
			if (!existed) {
				if (window[newPlg.plugin] == undefined) {

				} else {
					var plugin = new window[newPlg.plugin];
					plugin.setInitParameters(newPlg.params);
					plugin.keep = true;
					this.pluginManager.addPlugin(plugin, eval(newPlg.delay));
				}
			}
		}

		//find plugins that need to be removed
		var pluginsToRemoved = Array();
		for (var i in oldPlugins) {
			var oldPlg = oldPlugins[i];
			if (oldPlg.keep != true) {
				//console.log('plugin removed: '+oldPlg.getName());
				pluginsToRemoved.push(oldPlg);
			}
		}

		//removed unused plugins
		for (var i = 0; i < pluginsToRemoved.length; i++) {
			var plg = pluginsToRemoved[i];
			var indexOf = this.pluginManager.getPlugins().indexOf(plg);
			this.pluginManager.removePlugin(indexOf);
		}

		JOOUtils.generateEvent('ReloadPlugin');
		//		//console.log('newplugin', this.pluginManager.getPlugins());
	},
	/*
	attachTemplate: function(){
	if(this.position != undefined){
	//console.log("attachTemplate");
	this.temp = new Array();
	for(var i in $("#"+this.position).children()){
	if(!isNaN(i)){
	var obj = $($("#"+this.position).children()[i]);
	obj.detach();
	this.temp.push(obj);
	}
	}
	//console.log("position:"+this.position);
	$("#"+this.position).html(this.template);
	}
	},

	wrapUpDisplay: function(){
	if(this.position != undefined){
	var tmp = new Array();
	for(var i in $("#"+this.position).children()){
	if(!isNaN(i)){
	var obj = $($("#"+this.position).children()[i]);
	obj.detach();
	tmp.push(obj);
	}
	}

	$("#"+this.position).html(tmp);
	}
	},
	*/

	/**
	 * Called when the page begins its routine.
	 * Parse the layout and attach plugins.
	 * @param {String} pagename the page name
	 */
	onBegin : function(pagename) {
		var data = this.generateData(pagename);
		if (data == undefined)
			return;
		this.pagename = pagename;
		this.layout = data.layout;
		this.plugins = data.plugins;
		this.attachPlugins();
		JOOUtils.generateEvent("PageBegan");
	},

	/**
	 * Execute the page, attach portlets.
	 */
	run : function() {
		/*
		 this.attachTemplate();
		 */
		this.attachPortlets();
		JOOUtils.generateEvent("AllPorletAdded");
		this.portletContainer.loadPortlets();
		JOOUtils.generateEvent("AllPorletLoaded");
		/*
		 this.wrapUpDisplay();
		 */
	},

	onEnd : function() {

	},

	dispose : function() {

	},

	toString : function() {
		return "Page";
	}
});
/**
 * @class A component used as a view of 1 portlet.
 * Further version will allow user to interact with
 * the portlet.
 * @augments Graphic
 */
PortletCanvas = Graphic.extend({

	setupBase : function(config) {
		this._appendBaseClass('PortletCanvas');
		this._super(config);
	},

	setupDomObject : function(config) {
		this._super(config);
		this.access().addClass('portlet');
		this.access().addClass('portlet-canvas');
	}
});

/**
 * @class An interface for all portlets.
 * A portlet is a pluggable UI components that is managed
 * and rendered by JOO framework. A portlet is independent
 * from the rest of the application.
 * @interface
 */
PortletInterface = InterfaceImplementor.extend({
	implement : function(obj) {

		obj.prototype.toString = obj.prototype.toString ||
		function() {
			return this.getName();
		};

		/**
		 * Get the name of the portlet. By default, it equals to the className of the
		 * portlet.
		 * @methodOf PortletInterface#
		 * @name getName
		 * @returns {String} The name of the portlet.
		 */
		obj.prototype.getName = obj.prototype.getName ||
		function() {
			return this.className;
		};

		/**
		 * Called automatically by JOO framework when the portlet is initialized.
		 * @methodOf PortletInterface#
		 * @name onBegin
		 */
		obj.prototype.onBegin = obj.prototype.onBegin ||
		function() {
		};

		/**
		 * Called automatically by JOO framework when the portlet is loaded into DOM.
		 * @methodOf PortletInterface#
		 * @name run
		 */
		obj.prototype.run = obj.prototype.run ||
		function() {
		};

		/**
		 * Called automatically by JOO framework when the portlet is reloaded.
		 * @methodOf PortletInterface#
		 * @name onReloadPage
		 */
		obj.prototype.onReloadPage = obj.prototype.onReloadPage ||
		function() {
		};

		/**
		 * Called automatically by JOO framework when the portlet is no longer needed.
		 * @methodOf PortletInterface#
		 * @name onEnd
		 */
		obj.prototype.onEnd = obj.prototype.onEnd ||
		function() {
		};

		/**
		 * Get the placeholder (container) of the portlet.
		 * @methodOf PortletInterface#
		 * @name getPortletPlaceholder
		 * @returns {PortletPlaceholder} the placeholder of the portlet
		 */
		obj.prototype.getPortletPlaceholder = obj.prototype.getPortletPlaceholder ||
		function() {
			return this.placeholder;
		};

		/**
		 * Change the placeholder (container) of the portlet.
		 * This method is not intended to be used by developers.
		 * @methodOf PortletInterface#
		 * @name setPortletPlaceholder
		 * @param {PortletPlaceholder} plhd the new placeholder of the portlet
		 */
		obj.prototype.setPortletPlaceholder = obj.prototype.setPortletPlaceholder ||
		function(plhd) {
			this.placeholder = plhd;
		};

		/**
		 * Get the page instance
		 * @methodOf PortletInterface#
		 * @name getPage
		 * @returns {Page} the page instance
		 */
		obj.prototype.getPage = obj.prototype.getPage ||
		function() {
			return SingletonFactory.getInstance(Page);
		};

		/**
		 * Get the init parameters of the portlet. These parameters are
		 * usually configured in a <code>layout.txt</code>
		 * @methodOf PortletInterface#
		 * @name getInitParameters
		 * @param {Page} the page instance
		 */
		obj.prototype.getInitParameters = obj.prototype.getInitParameters ||
		function() {
			if (this.initParams == undefined)
				this.initParams = Array();
			return this.initParams;
		};

		/**
		 * Change the init parameters. This method is not intended to be used
		 * by developers.
		 * @methodOf PortletInterface#
		 * @name setInitParameters
		 * @param {Object} params the init parameters
		 */
		obj.prototype.setInitParameters = obj.prototype.setInitParameters ||
		function(params) {
			this.initParams = params;
		};

		/**
		 * Get the current request
		 * @methodOf PortletInterface#
		 * @name getRequest
		 * @param {Request} the current request
		 */
		obj.prototype.getRequest = obj.prototype.getRequest ||
		function() {
			return this.getPage().getRequest();
		};

		obj.prototype.requestForMatchingEffectiveResource = obj.prototype.requestForMatchingEffectiveResource ||
		function(resourceName, condition) {
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#effective-area #" + this.getName() + "-" + resourceName + " " + condition);
		};

		/**
		 * Get the portlet resource. This resource resides in the portlet template
		 * and is not visible to users.
		 * @methodOf PortletInterface#
		 * @name getPortletResource
		 * @param resourceName the name (or ID) of the resource
		 * @returns {Resource} the portlet (means template) resource with matching name
		 */
		obj.prototype.getPortletResource = obj.prototype.getPortletResource ||
		function(resourceName) {
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#" + this.getName() + "-RootData #" + this.getName() + "-" + resourceName);
		};

		/**
		 * Get the portlet DOM resource. This resource resides in the portlet rendered
		 * content and is visible to users.
		 * @methodOf PortletInterface#
		 * @name getDomResource
		 * @param resourceName the name of the resource
		 * @returns {Resource} the DOM (means rendered) resource with matching name
		 */
		obj.prototype.getDomResource = obj.prototype.getDomResource ||
		function(resourceName) {
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			return rm.requestForCustomResource("#effective-area #" + this.getName() + "-" + resourceName);
		};

		/**
		 * Get the <code>HTML ID</code> of a resource by its name.
		 * @methodOf PortletInterface#
		 * @name getResourceID
		 * @param resourceName the name of the resource
		 * @returns {String} the ID of the resource with matching name
		 */
		obj.prototype.getResourceID = obj.prototype.getResourceID ||
		function(resourceName) {
			return this.getName() + "-" + resourceName;
		};

		/**
		 * Get a localized text.
		 * @methodOf PortletInterface#
		 * @name getLocalizedText
		 * @param resourceName the name of the text
		 * @returns {String} the localized text
		 */
		obj.prototype.getLocalizedText = obj.prototype.getLocalizedText ||
		function(resourceName) {
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			var res = rm.requestForResource(this.getName(), "Text" + resourceName);
			if (res == undefined)
				return undefined;
			return res.html();
		};

		/**
		 * Get a localized message. A message can be parameterized.
		 * @methodOf PortletInterface#
		 * @name getLocalizedMessage
		 * @param resourceName the name of the message
		 * @returns {String} the localized message
		 */
		obj.prototype.getLocalizedMessage = obj.prototype.getLocalizedMessage ||
		function(resourceName) {
			var app = SingletonFactory.getInstance(Application);
			var rm = app.getResourceManager();
			var res = rm.requestForResource(this.getName(), "Message" + resourceName);
			if (res == undefined)
				return undefined;
			var unresolved = res.html();

			var resolved = unresolved;
			//resolved string pattern
			for (var i = 1; i < arguments.length; i++) {
				resolved = resolved.replace("%" + i, arguments[i]);
			}
			return resolved;
		};
	}
});

/**
 * @class An interface for all components which need rendering.
 * The <code>RenderInterface</code> is commonly used in
 * user-defined <code>Portlet</code>. Note that a component can
 * have multiple extra views besides the main view. In this case,
 * developers should use <code>renderView</code> method.
 * @interface
 */
RenderInterface = InterfaceImplementor.extend({

	onModelChange : function() {

	},

	implement : function(obj) {
		/**
		 * Render the component using microtemplating mechanism.
		 * The component must supply the following:
		 * <p>
		 * 	<ul>
		 *  	<li>A <code>viewId</code> or implement <code>getName</code> method</li>
		 *  	<li>An optional <code>model</code> which is a Javascript object</li>
		 *  	<li>A template, which must exists in DOM before this method is called.
		 *  		The template should be a <code>script</code> element, with
		 *  		<i><code>text/html</code></i> <code>type</code> attributes.
		 *  		The <code>id</code> of the template is the <code>viewId</code>
		 *  		followed by "View".
		 *  		<br />For example, suppose the <code>viewId</code> of the component
		 *  		is MyComponent, then the <code>id</code> should be MyComponentView.
		 *  	</li>
		 *  </ul>
		 * </p>
		 * @name render
		 * @methodOf RenderInterface#
		 * @returns {String} the rendered content of the component
		 */
		obj.prototype.render = obj.prototype.render ||
		function() {
			this.viewId = this.viewId || this.getName() + "View";
			this.model = this.model || JOOModel.from({});
			//			if(this.viewId == undefined || this.model == undefined){
			//				throw "No viewId or model for rendering";
			//			}
			return JOOUtils.tmpl(this.viewId, this.model);
		};

		/**
		 * Render a specific view the component using microtemplating mechanism.
		 * The component must supply the following:
		 * <p>
		 * 	<ul>
		 *  	<li>A <code>viewId</code> or implement <code>getName</code> method</li>
		 *  	<li>A view template, which must exists in DOM before this method is called.
		 *  		The template should be a <code>script</code> element, with
		 *  		<i><code>text/html</code></i> <code>type</code> attributes.
		 *  		The <code>id</code> of the template is the <code>viewId</code>
		 *  		followed by "-" and the <code>view</code> parameters.
		 *  		<br />For example, suppose the <code>viewId</code> of the component
		 *  		is MyComponent, then calling <code>this.renderView("FirstView", {})</code>
		 *  		inside the component will render the template with <code>id</code>
		 *  		MyComponent-FirstView.
		 *  	</li>
		 *  </ul>
		 * </p>
		 * @methodOf RenderInterface#
		 * @name renderView
		 * @returns {String} the rendered view of the component
		 */
		obj.prototype.renderView = obj.prototype.renderView ||
		function(view, model) {
			return JOOUtils.tmpl((this.viewId || this.getName()) + "-" + view, model);
		};

		/**
		 * Display and bind the model to the view.
		 * @methodOf RenderInterface#
		 * @name displayAndBind
		 */
		obj.prototype.displayAndBind = obj.prototype.displayAndBind ||
		function() {
			var _self = this;
			if (this.model) {
				this.model.addEventListener('change', function() {
					_self.getPortletPlaceholder().paintCanvas(_self.render());
				});
			}
			this.getPortletPlaceholder().paintCanvas(this.render());
		};
	}
});

PortletPlaceholder = Class.extend(
/** @lends PortletPlaceholder# */
{

	/**
	 * @class A placeholder to store a single portlet.
	 * It acts as a bridge between Portlet and {@link PortletCanvas}
	 * @augments Class
	 * @param canvas the portlet canvas
	 * @constructs
	 */
	init : function(canvas) {
		this.canvas = canvas;
	},

	/**
	 * Add an object to the canvas
	 * @param {Object} object the object to be added
	 */
	addToCanvas : function(object) {
		this.canvas.addChild(object);
	},

	/**
	 * Clear everything and repaint the canvas
	 * @param {String} html the HTML data to be painted
	 */
	paintCanvas : function(html) {
		this.canvas.repaint(html);
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('HtmlUpdated');
	},

	/**
	 * Append to the canvas
	 * @param {String} html the HTML data to be appended
	 */
	drawToCanvas : function(html) {
		this.canvas.paint(html);
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('HtmlUpdated');
	},

	/**
	 * Access the underlying canvas
	 * @returns {PortletCanvas} the portlet canvas
	 */
	getCanvas : function() {
		return this.canvas;
	},

	toString : function() {
		return "PortletPlaceholder";
	}
});

PortletContainer = Class.extend(
/** @lends PortletContainer# */
{
	/**
	 * @class A container which maintains and controls multiple portlets
	 * @singleton
	 * @augments Class
	 * @constructs
	 */
	init : function() {
		if (PortletContainer.singleton == undefined) {
			throw "Singleton class";
			return undefined;
		}
		this.portlets = Array();
	},

	/**
	 * Add a portlet to this container and initialize it
	 * @param {PortletInterface} portlet the portlet to be added
	 * @param {Object} item portlet metadata
	 */
	addPortlet : function(portlet, item) {
		var portletMeta = {};
		for (var i in item) {
			portletMeta[i] = item[i];
		}
		portletMeta.portlet = portlet;
		if (portletMeta.order == undefined)
			portletMeta.order = '';
		portletMeta.loaded = false;
		this.portlets.push(portletMeta);
		try {
			portlet.onBegin();
		} catch (err) {
			log(err);
		}
	},

	/**
	 * Move the portlet to another position
	 * @param {Object} portletMeta the metadata associated with the portlet to be moved
	 * @param {String} newPosition the new position, which is the <code>id</code>
	 * of a DOM element
	 */
	movePortlet : function(portletMeta, newPosition) {
		var portletPosition = new Stage({
			id : newPosition
		});
		var portletCanvas = new Stage({
			id : portletMeta.portlet.getPortletPlaceholder().getCanvas().id
		});
		this.attachPortletHtml(portletPosition, portletCanvas, portletMeta);
	},

	/**
	 * Load all active portlets, execute them synchronously.
	 */
	loadPortlets : function() {
		for (var i = 0; i < this.portlets.length; i++) {
			var portletMeta = this.portlets[i];
			if (portletMeta.active == true && !portletMeta.loaded) {
				this.activatePortlet(portletMeta);
				portletMeta.loaded = true;
			}
		}
	},

	/**
	 * Get all portlets
	 * @returns {Array} All loaded portlets
	 */
	getPortlets : function() {
		return this.portlets;
	},

	/**
	 * Get portlet metadata using the portlet's name
	 * @param {String} name the portlet's name
	 */
	getPortletMetaByName : function(name) {
		return this.portlets.map(function(portlet) {
			if (portlet.portlet.getName() == name)
				return portlet;
		});
	},

	/**
	 * Get portlet metadata using the portlet's name
	 * @param {String} name the portlet's name
	 */
	getPortletMetaById : function(id) {
		for (var i = 0; i < portlets.length; i++) {
			if (portlet.id == id)
				return portlet;
		}
	},

	/**
	 * Remove portlet at the specified position
	 * @param {String} position the position of the portlet to be removed
	 */
	removePortlet : function(position) {
		var portletMeta = this.portlets[position];
		if (portletMeta != undefined) {
			this.portlets.splice(position, 1);
			portletMeta.portlet.onEnd();
			if (portletMeta.portlet.getPortletPlaceholder()) {
				//console.log("dispose canvas of portlet: "+portletMeta.portlet.getName());
				portletMeta.portlet.getPortletPlaceholder().getCanvas().dispose();
			}
		}
	},

	attachPortletHtml : function(portletPosition, portletCanvas, portletMeta) {
		var jPortletCanvas = portletPosition.access();
		var canvases = jPortletCanvas.find('.portlet.portlet-canvas');

		var found = false;
		for (var i = 0; i < canvases.length; i++) {
			var canvasI = canvases[i];
			if ($(canvasI).attr('order') > portletMeta.order) {
				portletPosition.addChildBeforePosition(portletCanvas, canvasI);
				found = true;
				break;
			}
		}

		if (found == false) {
			portletPosition.addChild(portletCanvas);
		}
		portletCanvas.setAttribute('order', portletMeta.order);
	},

	/**
	 * Activate a portlet.
	 * @param {Object} portletMeta the metadata of the portlet to be activated
	 */
	activatePortlet : function(portletMeta) {
		var portlet = portletMeta.portlet;
		if (portletMeta.loaded) {
			return;
		}
		var portletPosition = new Stage({
			id : portletMeta.position
		});
		var portletCanvas = new PortletCanvas(portlet.getName());
		this.attachPortletHtml(portletPosition, portletCanvas, portletMeta);
		portletCanvas.setAttribute('portlet', portlet.getName());
		var portletPlaceholder = new PortletPlaceholder(portletCanvas);
		portlet.setPortletPlaceholder(portletPlaceholder);
		portletMeta.loaded = true;
		try {
			portlet.run();
		} catch (err) {
			log(err);
		}
	},

	/**
	 * Deactivate a portlet.
	 * @param {Object} portletMeta the metadata of the portlet to be deactivated
	 */
	deactivatePortlet : function(portletMeta) {
		var portlet = portletMeta.portlet;
		if (!portletMeta.loaded) {
			return;
		}
		portletMeta.loaded = false;
		if (portlet.getPortletPlaceholder()) {
			portlet.getPortletPlaceholder().paintCanvas('');
		}
	},

	toString : function() {
		return "PortletContainer";
	}
});

/**
 * @class A simple portlet used for rendering
 * @augments Class
 * @implements PortletInterface
 * @implements RenderInterface
 */
RenderPortlet = Class.extend(
/** @lends RenderPortlet# */
{
	/**
	 * Render and display the portlet.
	 */
	run : function() {
		this.getPortletPlaceholder().paintCanvas(this.render());
	}
}).implement(PortletInterface, RenderInterface);
ErrorHandler = Class.extend({
	handle : function(err, event) {

	}
});

DefaultErrorHandler = ErrorHandler.extend({
	handle : function(err, event) {
		if ( typeof err == 'object') {
			if (err.Exception == 'RequestInterrupted') {
				return;
			}
			if (err.Exception != undefined) {
				alert("[" + err.Exception + "Exception] " + err.Message);
			} else {
				alert(err);
			}
			return;
		}
		alert("Error caught: " + err);
	}
});

Request = Class.extend(
/** @lends Request# */
{
	/**
	 * Create a new request.
	 * @param {String} name the name of the page
	 * @param {Object} type reserved
	 * @param {Object} params the parameters associated with the request
	 * @param {hideParams} a list of parameters that will not be displayed in
	 * the URL bar when the request is executed
	 * @class Represents a request
	 * @augments Class
	 * @constructs
	 */
	init : function(name, type, params, hideParams) {
		if (name != undefined)
			name = name.trim();
		this.name = name;
		this.type = type;
		if (params == undefined) {
			params = Array();
		}
		if (hideParams == undefined) {
			hideParams = Array();
		}
		this.params = params;
		this.hiddenParams = hideParams;
		this.setParams(params);
		this.demanded = true;
	},

	/**
	 * Check if the request is demanded by the application itself.
	 * @returns {Boolean} the demanding flag
	 */
	isDemanded : function() {
		return this.demanded;
	},

	/**
	 * Change the demanding flag of the current request.
	 * Demanded request will be automatically routed.
	 * @param {Boolean} b the demanding flag
	 */
	demand : function(b) {
		this.demanded = b;
	},

	/**
	 * Set the value of a specific parameter
	 * @param {String} key the parameter name
	 * @param {String} value the new value
	 */
	setParam : function(key, value) {
		this.params[key] = value;
	},

	/**
	 * Change all parameters to a new map
	 * @param {Object} params the new parameters map
	 */
	setParams : function(params) {
		this.params = params;
	},

	/**
	 * Get the value of a paramter of current request
	 * @param {String} key the parameter
	 * @param {String} defaultValue the default value, if the parameter is not defined
	 * @returns {String} the value of the parameter
	 */
	getParam : function(key, defaultValue) {
		if (this.params[key] == undefined) {
			return defaultValue;
		}
		return this.params[key];
	},

	/**
	 * Get all parameters.
	 * @returns {Object} the parameters map
	 */
	getParams : function() {
		return this.params;
	},

	/**
	 * Change the hash value of current location.
	 * @param {String} strToAdd the location after the hash symbol (#)
	 */
	addHash : function(strToAdd) {
		window.location.hash = strToAdd;
	},

	/**
	 * Change the name of the page represented by this request.
	 * @param {String} name the name of the page
	 */
	setName : function(name) {
		this.name = name;
	},

	/**
	 * Get the name of the page represented by this request
	 * @returns {String}
	 */
	getName : function() {
		return this.name;
	},

	getType : function() {
		return this.type;
	},

	toString : function() {
		return "Request";
	}
});

Request.setProactive = function(b, url) {
	if (url == undefined)
		url = window.location.hash;
	//console.log('set proactive to '+b+' for url: '+url);
	//	//console.warn('called by '+Request.setProactive.caller);
	if (Request.proactive == undefined)
		Request.proactive = {};
	Request.proactive[url] = b;
};

Request.getProactive = function(url) {
	if (url == undefined)
		url = window.location.hash;
	if (Request.proactive == undefined)
		Request.proactive = {};
	return Request.proactive[url];
};

RequestHandler = Class.extend(
/** @lends RequestHandler# */
{
	/**
	 * Initialize fields
	 * @class Default request handler
	 * @augments Class
	 * @constructs
	 */
	init : function() {
		this.currentPage = undefined;
		this.requestInterrupted = false;
		this.autoRouteDefault = true;
		this.systemProperties = SingletonFactory.getInstance(Application).getSystemProperties();
		this.errorHandler = new DefaultErrorHandler();
	},

	/**
	 * Change the error handler
	 * @param {ErrorHandler} errorHandler the new error handler
	 */
	setErrorHandler : function(errorHandler) {
		this.errorHandler = errorHandler;
	},

	/**
	 * Route (if needed) and handle a request
	 * @param {Request} request the request to be handled
	 */
	handleRequest : function(request) {
		//console.log('current page is '+this.currentPage);
		if (this.currentPage != undefined) {
			//console.log("Request Interrupted");
			this.requestInterrupted = true;
		} else {
			this.requestInterrupted = false;
		}
		this.routeRequest(request);
		this._handleRequest(request);
	},

	_handleRequest : function(request) {
		var name = request.getName();
		JOOUtils.generateEvent('RequestBeforeHandled', {
			to : name
		});
		var page = SingletonFactory.getInstance(Page);
		this.currentPage = page;
		page.setRequest(request);
		//console.log('current page begin: '+request.getName());
		try {
			page.onBegin(name);
		} catch (err) {
			log(err);
			/*
			 * display a message similar to 'this applet failed to load. click here to reload it'
			 */
			this.errorHandler.handle(err, 'onBegin');
		}

		//console.log('current page running: '+request.getName());

		try {
			page.run();
		} catch (err) {
			log(err);
			/*
			 * display a message box notify the error
			 */
			this.errorHandler.handle(err, 'run');
		}

		try {
			page.onEnd();
		} catch (err) {
			log(err);
			this.errorHandler.handle(err, 'onEnd');
		}

		//console.log('current page finished: '+request.getName());
		this.currentPage = undefined;

		JOOUtils.generateEvent('HtmlRendered');
		//		//console.log(currentPage);
		if (this.requestInterrupted == true) {
			throw {
				"Exception" : "RequestInterrupted"
			};
		}
	},

	/**
	 * Define setter and getter for the window location hash.
	 */
	prepareForRequest : function() {
		if (!("hash" in window.location)) {
			window.location.__defineGetter__("hash", function() {
				if (location.href.indexOf("#") == -1)
					return "";
				return location.href.substring(location.href.indexOf("#"));
			});
			window.location.__defineSetter__("hash", function(v) {
				if (location.href.indexOf("#") == -1)
					location.href += v;
				location.href = location.substring(0, location.href.indexOf("#")) + v;
			});
		}
	},

	/**
	 * Create a request based on the current URL
	 */
	assembleRequest : function() {
		var defaultPage = SingletonFactory.getInstance(Application).getSystemProperties().get('page.default', 'Home');
		if (window.location.hash == "") {
			var request = new Request(defaultPage, null, null, {
				'page' : ''
			});
			return request;
		} else {
			//console.log("hey!");
			var hash = window.location.hash;
			hash = hash.substring(1, hash.length);
			if (hash.charAt(0) == '!') {
				hash = hash.substring(1, hash.length);
			}
			var tmp = hash.split("/");
			var params = new Array();
			var pagename = "";
			var i = 0;

			while (i < tmp.length) {
				if (tmp[i] != "") {
					params[tmp[i]] = tmp[i + 1];
					if (tmp[i] == "page") {
						pagename = params[tmp[i]];
					}
					i = i + 2;
				} else {
					i = i + 1;
				}
			}

			var request = new Request(pagename, null, params);
			request.demand(false);
			return request;
		}
	},

	/**
	 * Modify the URL (i.e the window location) based on the request.
	 * @param {Request} request the request to be routed
	 */
	routeRequest : function(request) {
		//if this request neither proactive nor demanded, then there's no point routing it
		if (Request.getProactive() == false && request.isDemanded() == false)
			return;
		var str = "!";
		if ((request.getName() == undefined || request.getName() == "" ) && this.autoRouteDefault) {
			var pagename = this.systemProperties.get('page.default');
			//console.warn('page is undefined! Using default homepage ['+pagename+']');
			if (pagename == undefined) {
				//console.error('Default page is undefined! I give up for now!');
				throw {
					"Exception" : "NotFound",
					"Message" : "Both default page and parameter page is undefined"
				};
				return undefined;
			}
			request.setName(pagename);
			request.hiddenParams.page = '';
		}
		request.getParams()['page'] = request.getName();
		for (var key in request.getParams()) {
			if (request.hiddenParams.hasOwnProperty(key)) {
				continue;
			}
			if ( typeof request.getParams()[key] == 'function' || typeof request.getParams()[key] == 'object') {
				continue;
			}
			value = request.params[key];
			if (value != undefined)
				str += key + "/" + value + "/";
			else
				str += key + "/";
		}
		str = str.substring(0, str.length - 1);
		if (!("hash" in window.location)) {
			window.location.__defineGetter__("hash", function() {
				if (location.href.indexOf("#") == -1)
					return "";
				return location.href.substring(location.href.indexOf("#"));
			});
			window.location.__defineSetter__("hash", function(v) {
				if (location.href.indexOf("#") == -1)
					location.href += v;
				location.href = location.substring(0, location.href.indexOf("#")) + v;
			});
		}
		//mark the current request as Proactive, so it won't trigger another history event
		Request.setProactive(true, '#!' + str);
		window.location.hash = str;
	},

	toString : function() {
		return "RequestHandler";
	}
});
/**
 * Create a new Bootstrap
 * @class The pluggable bootstrap class.
 * Application flow is defined here. Developers can extends this class
 * to create custom bootstraps.
 * @augments Class
 * @implements ObserverInterface
 */
Bootstrap = Class.extend(
/** @lends Bootstrap# */
{
	/**
	 * Called when the application start running.
	 * Subclass can override this method to change the application flow
	 */
	run : function() {
		this.registerObserver();
		this.setupRequestHandler();
		this.executeRequest();
	},

	/**
	 * Route the request
	 * @param {Request} eventData the request to be routed
	 * @observer
	 */
	onRequestRoute : function(eventData) {
		this.requestHandler.routeRequest(eventData);
	},

	/**
	 * Assemble the request based on current URL
	 * @observer
	 */
	onNeedAssembleRequest : function() {
		this.executeRequest();
	},

	/**
	 * Initialize the request handler
	 */
	setupRequestHandler : function() {
		this.requestHandler = new RequestHandler();
	},

	/**
	 * Execute current request
	 */
	executeRequest : function() {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent('RequestBeforeExecuted');
		this.requestHandler.prepareForRequest();
		var request = this.requestHandler.assembleRequest();
		if (request != undefined) {
			this.requestHandler.handleRequest(request);
		}
	},

	toString : function() {
		return "Bootstrap";
	}
}).implement(ObserverInterface);
/**
 *
 */

utils_items = {};

/**
 * Generate an unique ID
 * @param {String} type the type used for generation
 * @returns an unique ID
 */
function generateId(type) {
	if (!isPropertySet(utils_items, type)) {
		setProperty(utils_items, type, 0);
	}
	setProperty(utils_items, type, getProperty(utils_items, type) + 1);
	return type + "-" + getProperty(utils_items, type);
}

function setProperty(obj, prop, val) {
	obj.prop = val;
}

function getProperty(obj, prop) {
	return obj.prop;
}

function isPropertySet(obj, prop) {
	if ( typeof obj.prop != 'undefined') {
		return true;
	}
	return false;
}

Array.max = function(array) {
	return Math.max.apply(Math, array);
};
Array.min = function(array) {
	return Math.min.apply(Math, array);
};

Array.nextBigger = function(array, val) {
	var result = Number.MAX_VALUE;
	for (var i = 0; i < array.length; i++) {
		if (array[i] > val && array[i] < result) {
			result = array[i];
		}
	}
	return result;
};

Array.nextLess = function(array, val) {
	var result = Number.MIN_VALUE;
	for (var i = 0; i < array.length; i++) {
		if (array[i] < val && array[i] > result) {
			result = array[i];
		}
	}
	return result;
};

if (!Array.prototype.indexOf) {
	Array.prototype.indexOf = function(val) {
		for (var i = 0; i < this.length; i++) {
			if (val == this[i]) {
				return i;
			}
		}
		return -1;
	};
}

function trimOff(txt, maxLen) {
	txt = txt.trim();
	if (txt.length > maxLen) {
		txt = txt.substr(0, maxLen);
		var lastIndexOf = txt.lastIndexOf(' ');
		if (lastIndexOf != -1)
			txt = txt.substr(0, lastIndexOf) + '...';
	}
	return txt;
}

function log(msg, omitStackTrace) {
	if (window["console"] != undefined) {
		console.error(msg);
		if (!omitStackTrace) {
			printStackTrace(msg);
		}
	}
}

function printStackTrace(e) {
	var callstack = [];
	var isCallstackPopulated = false;

	console.log('Stack trace: ');
	if (e.stack) {//Firefox
		var lines = e.stack.split('\n');
		for (var i = 0, len = lines.length; i < len; i++) {
			//	    	if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
			//	    		callstack.push(lines[i]);
			//	    	} else {
			//	    		var index = lines[i].indexOf(')');
			//	    		if (index != -1)
			//	    			lines[i] = lines[i].substr(index);
			callstack.push(lines[i]);
			//	    	}
		}
		//Remove call to printStackTrace()
		callstack.shift();
		isCallstackPopulated = true;
	} else if (window.opera && e.message) {//Opera
		var lines = e.message.split('\n');
		for (var i = 0, len = lines.length; i < len; i++) {
			if (lines[i].match(/^\s*[A-Za-z0-9\-_\$]+\(/)) {
				var entry = lines[i];
				//Append next line also since it has the file info
				if (lines[i + 1]) {
					entry += ' at ' + lines[i + 1];
					i++;
				}
				callstack.push(entry);
			}
		}
		//Remove call to printStackTrace()
		callstack.shift();
	}
	if (!isCallstackPopulated) {//IE and Safari
		var currentFunction = arguments.callee.caller;
		while (currentFunction) {
			isCallstackPopulated = true;
			var fn = currentFunction.toString();
			var fname = fn.substring(fn.indexOf('function') + 8, fn.indexOf('')) || 'anonymous';
			callstack.push(fname);
			currentFunction = currentFunction.caller;
		}
	}
	for (var i = 0; i < callstack.length; i++) {
		console.log(callstack[i]);
	}
}

MathUtil = {

	getDistance : function(s, d) {
		return Math.sqrt(Math.pow(d.y - s.y, 2) + Math.pow(d.x - s.x, 2));
	},

	getAngle : function(s, d, deg) {
		var dx = d.x - s.x;
		var dy = d.y - s.y;
		var atan = Math.atan2(dy, Math.abs(dx));
		if (dx < 0) {
			atan = Math.PI - atan;
		}
		if (deg == undefined)
			return atan;
		return atan * 180 / Math.PI;
	}
};

function getPositionInRotatedcoordinate(old, angle) {//angle in radian
	var a = Math.sqrt(Math.pow(old.x, 2) + Math.pow(old.y, 2));
	var originAngle = Math.atan2(old.y, old.x);
	return {
		x : a * Math.cos(angle - originAngle),
		y : -a * Math.sin(angle - originAngle)
	};
}

function getPositionFromRotatedCoordinate(pos, angle, coef) {// angle in radian
	if (!coef || !(coef.x && coef.y))
		coef = {
			x : 0,
			y : 0
		};
	var a = Math.sqrt(Math.pow(pos.x, 2) + Math.pow(pos.y, 2));
	var originAngle = Math.atan2(pos.y, pos.x);
	return {
		x : a * Math.cos(angle + originAngle) + coef.x,
		y : a * Math.sin(angle + originAngle) + coef.y
	};
}

ExpressionUtils = {

	express : function(obj, expression) {
		var s = expression ? "obj." + expression : "obj";
		try {
			return eval(s);
		} catch (err) {
			log("Expression failed: " + err);
		}
	},

	expressSetter : function(obj, expression, value) {
		if ( typeof value == 'string') {
			value = value.replace(/'/g, "\\'");
		}
		var s = "obj." + expression + " = '" + value + "'";
		try {
			eval(s);
		} catch (err) {
			log("Expression failed: " + err);
		}
	},

	getMutatorMethod : function(obj, prop) {
		var methodName = "set" + prop.substr(0, 1).toUpperCase() + prop.substr(1);
		return obj[methodName];
	},

	getAccessorMethod : function(obj, prop) {
		var methodName = "get" + prop.substr(0, 1).toUpperCase() + prop.substr(1);
		return obj[methodName];
	}
};

JOOUtils = {

	isTag : function(q) {
		var testTag = /<([\w:]+)/;
		return testTag.test(q);
	},

	getApplication : function() {
		return SingletonFactory.getInstance(Application);
	},

	getSystemProperty : function(x) {
		return SingletonFactory.getInstance(Application).getSystemProperties().get(x);
	},

	getResourceManager : function() {
		return SingletonFactory.getInstance(Application).getResourceManager();
	},

	access : function(name, type, resourceLocator, cached) {
		return SingletonFactory.getInstance(Application).getResourceManager().requestForResource(type, name, resourceLocator, cached);
	},

	accessCustom : function(custom, resourceLocator) {
		return SingletonFactory.getInstance(Application).getResourceManager().requestForCustomResource(custom, resourceLocator);
	},

	generateEvent : function(eventName, eventData) {
		var subject = SingletonFactory.getInstance(Subject);
		subject.notifyEvent(eventName, eventData);
	},

	getAttributes : function(element) {
		var attrs = {};
		var attributes = element.attributes;
		for (var i = 0; i < attributes.length; i++) {
			attrs[attributes[i].nodeName] = attributes[i].nodeValue;
		}
		return attrs;
	},

	requestFullScreen : function() {
		if (document.documentElement.requestFullScreen) {
			document.documentElement.requestFullScreen();
		} else if (document.documentElement.mozRequestFullScreen) {
			document.documentElement.mozRequestFullScreen();
		} else if (document.documentElement.webkitRequestFullScreen) {
			document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
		}
	},

	cancelFullScreen : function() {
		if (document.cancelFullScreen) {
			document.cancelFullScreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitCancelFullScreen) {
			document.webkitCancelFullScreen();
		}
	},

	readFileAsDataURL : function(file, callback) {
		var reader = new FileReader();
		reader.onload = callback;
		reader.readAsDataURL(file);
	},

	//micro template based on John Resg code
	tmpl : function(tmpl_id, data) {
		try {
			if ( typeof JOOUtils.tmpl.cache == 'undefined') {
				JOOUtils.tmpl.cache = new Array();
			}
			if (JOOUtils.tmpl.cache[tmpl_id] != null) {
				var fn = JOOUtils.tmpl.cache[tmpl_id];
				return fn(data);
			}
			str = document.getElementById(tmpl_id).innerHTML;
			str = str.replace(/\\/g, "@SPC@");
			str = str.replace(/'/g, "&apos;");
			fnStr = "var p=[],print=function(){p.push.apply(p,arguments);};" +

			// Introduce the data as local variables using with(){}
			"with(obj){p.push('" +

			// Convert the template into pure JavaScript
			str.replace(/[\r\t\n]/g, " ").split("<%").join("\t").replace(/((^|%>)[^\t]*)'/g, "$1\r").replace(/\t=(.*?)%>/g, "',$1,'").split("\t").join("');").split("%>").join("p.push('").split("\r").join("\\'") + "');}return p.join('');";
			fnStr = fnStr.replace(/@SPC@/g, "\\");
			var fn = new Function("obj", fnStr);
			JOOUtils.tmpl.cache[tmpl_id] = fn;
			return fn(data);
		} catch (e) {
			log(e + ":" + tmpl_id, 'rendering');
			return "";
		}
	}
};
Memcached = Class.extend(
/** @lends Memcached# */
{

	/**
	 * Initialize fields.
	 * @class A wrapper of the system properties.
	 * Used for accessing the memcached namespace
	 * @augments Class
	 * @constructs
	 */
	init : function() {
		this.properties = SingletonFactory.getInstance(Application).getSystemProperties();
	},

	/**
	 * Get the actual entry name for the the specified key
	 * @private
	 * @param {String} key the key
	 * @returns {String} the entry name
	 */
	getEntryName : function(key) {
		return 'memcached.' + key;
	},

	/**
	 * Store a value in the specified key.
	 * @param {String} key the key
	 * @param {Object} value the key's value
	 */
	store : function(key, value) {
		var entry = this.getEntryName(key);
		this.properties.set(entry, value);
	},

	/**
	 * Retrieve the value of the specified key.
	 * @param {String} the key
	 * @returns {Object} the value of the key
	 */
	retrieve : function(key) {
		var entry = this.getEntryName(key);
		return this.properties.get(entry);
	},

	/**
	 * Clear the content of the specified key.
	 * @param {key} the key
	 */
	clear : function(key) {
		var entry = this.getEntryName(key);
		this.properties.set(entry, undefined);
	},

	toString : function() {
		return "Memcached";
	}
});
DataStore = Class.extend({

	init : function() {
		this.stores = {};
	},

	registerStore : function(namespace, storeType, options) {
		options.type = storeType;
		options.data = options.data || undefined;
		options.lastAccess = options.lastAccess || undefined;
		this.initStoreType(storeType, options);
		this.stores[namespace] = options;
	},

	deregisterStore : function(namespace) {
		var store = this.getStore(namespace);
		if (store) {
			store.dispose();
			this.stores[namespace] = undefined;
		}
	},

	initStoreType : function(type, options) {
		var dataStoreType = 'DataStore' + type;
		if ( typeof window[dataStoreType] == 'undefined')
			throw new Error('Data Store is undefined: ' + dataStoreType);
		var dataStore = new window[dataStoreType](options);
		options.dataStore = dataStore;
	},

	getStore : function(namespace) {
		return this.stores[namespace];
	},

	fetch : function(namespace, key) {
		var store = this.stores[namespace];
		return store.dataStore.fetch(key);
	},

	store : function(namespace, key, value) {
		var store = this.stores[namespace];
		return store.dataStore.store(key, value);
	}
});

DataStoreDom = Class.extend({

	init : function(options) {
		this.options = options;
		this.data = eval('(' + JOOUtils.access(this.options.id).html() + ')');
	},

	fetch : function(key) {
		return ExpressionUtils.express(this.data, key);
	},

	store : function(key, value) {
		ExpressionUtils.expressSetter(this.data, key, value);
	},

	dispose : function() {
		this.data = undefined;
	}
});
/*!
 * iScroll v4.2.5 ~ Copyright (c) 2012 Matteo Spinelli, http://cubiq.org
 * Released under MIT license, http://cubiq.org/license
 */
(function(window, doc){
var m = Math,
    dummyStyle = doc.createElement('div').style,
    vendor = (function () {
        var vendors = 't,webkitT,MozT,msT,OT'.split(','),
            t,
            i = 0,
            l = vendors.length;

        for ( ; i < l; i++ ) {
            t = vendors[i] + 'ransform';
            if ( t in dummyStyle ) {
                return vendors[i].substr(0, vendors[i].length - 1);
            }
        }

        return false;
    })(),
    cssVendor = vendor ? '-' + vendor.toLowerCase() + '-' : '',

    // Style properties
    transform = prefixStyle('transform'),
    transitionProperty = prefixStyle('transitionProperty'),
    transitionDuration = prefixStyle('transitionDuration'),
    transformOrigin = prefixStyle('transformOrigin'),
    transitionTimingFunction = prefixStyle('transitionTimingFunction'),
    transitionDelay = prefixStyle('transitionDelay'),

    // Browser capabilities
    isAndroid = (/android/gi).test(navigator.appVersion),
    isIDevice = (/iphone|ipad/gi).test(navigator.appVersion),
    isTouchPad = (/hp-tablet/gi).test(navigator.appVersion),

    has3d = prefixStyle('perspective') in dummyStyle,
    hasTouch = 'ontouchstart' in window && !isTouchPad,
    hasTransform = vendor !== false,
    hasTransitionEnd = prefixStyle('transition') in dummyStyle,

    RESIZE_EV = 'onorientationchange' in window ? 'orientationchange' : 'resize',
    START_EV = hasTouch ? 'touchstart' : 'mousedown',
    MOVE_EV = hasTouch ? 'touchmove' : 'mousemove',
    END_EV = hasTouch ? 'touchend' : 'mouseup',
    CANCEL_EV = hasTouch ? 'touchcancel' : 'mouseup',
    TRNEND_EV = (function () {
        if ( vendor === false ) return false;

        var transitionEnd = {
                ''          : 'transitionend',
                'webkit'    : 'webkitTransitionEnd',
                'Moz'       : 'transitionend',
                'O'         : 'otransitionend',
                'ms'        : 'MSTransitionEnd'
            };

        return transitionEnd[vendor];
    })(),

    nextFrame = (function() {
        return window.requestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.oRequestAnimationFrame ||
            window.msRequestAnimationFrame ||
            function(callback) { return setTimeout(callback, 1); };
    })(),
    cancelFrame = (function () {
        return window.cancelRequestAnimationFrame ||
            window.webkitCancelAnimationFrame ||
            window.webkitCancelRequestAnimationFrame ||
            window.mozCancelRequestAnimationFrame ||
            window.oCancelRequestAnimationFrame ||
            window.msCancelRequestAnimationFrame ||
            clearTimeout;
    })(),

    // Helpers
    translateZ = has3d ? ' translateZ(0)' : '',

    // Constructor
    iScroll = function (el, options) {
        var that = this,
            i;

        that.wrapper = typeof el == 'object' ? el : doc.getElementById(el);
        that.wrapper.style.overflow = 'hidden';
        that.scroller = that.wrapper.children[0];

        // Default options
        that.options = {
            hScroll: true,
            vScroll: true,
            x: 0,
            y: 0,
            bounce: true,
            bounceLock: false,
            momentum: true,
            lockDirection: true,
            useTransform: true,
            useTransition: false,
            topOffset: 0,
            checkDOMChanges: false,     // Experimental
            handleClick: true,

            // Scrollbar
            hScrollbar: true,
            vScrollbar: true,
            fixedScrollbar: isAndroid,
            hideScrollbar: isIDevice,
            fadeScrollbar: isIDevice && has3d,
            scrollbarClass: '',

            // Zoom
            zoom: false,
            zoomMin: 1,
            zoomMax: 4,
            doubleTapZoom: 2,
            wheelAction: 'scroll',

            // Snap
            snap: false,
            snapThreshold: 1,

            // Events
            onRefresh: null,
            onBeforeScrollStart: function (e) { e.preventDefault(); },
            onScrollStart: null,
            onBeforeScrollMove: null,
            onScrollMove: null,
            onBeforeScrollEnd: null,
            onScrollEnd: null,
            onTouchEnd: null,
            onDestroy: null,
            onZoomStart: null,
            onZoom: null,
            onZoomEnd: null
        };

        // User defined options
        for (i in options) that.options[i] = options[i];
        
        // Set starting position
        that.x = that.options.x;
        that.y = that.options.y;

        // Normalize options
        that.options.useTransform = hasTransform && that.options.useTransform;
        that.options.hScrollbar = that.options.hScroll && that.options.hScrollbar;
        that.options.vScrollbar = that.options.vScroll && that.options.vScrollbar;
        that.options.zoom = that.options.useTransform && that.options.zoom;
        that.options.useTransition = hasTransitionEnd && that.options.useTransition;

        // Helpers FIX ANDROID BUG!
        // translate3d and scale doesn't work together!
        // Ignoring 3d ONLY WHEN YOU SET that.options.zoom
        if ( that.options.zoom && isAndroid ){
            translateZ = '';
        }
        
        // Set some default styles
        that.scroller.style[transitionProperty] = that.options.useTransform ? cssVendor + 'transform' : 'top left';
        that.scroller.style[transitionDuration] = '0';
        that.scroller.style[transformOrigin] = '0 0';
        if (that.options.useTransition) that.scroller.style[transitionTimingFunction] = 'cubic-bezier(0.33,0.66,0.66,1)';
        
        if (that.options.useTransform) that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px)' + translateZ;
        else that.scroller.style.cssText += ';position:absolute;top:' + that.y + 'px;left:' + that.x + 'px';

        if (that.options.useTransition) that.options.fixedScrollbar = true;

        that.refresh();

        that._bind(RESIZE_EV, window);
        that._bind(START_EV);
        if (!hasTouch) {
            if (that.options.wheelAction != 'none') {
                that._bind('DOMMouseScroll');
                that._bind('mousewheel');
            }
        }

        if (that.options.checkDOMChanges) that.checkDOMTime = setInterval(function () {
            that._checkDOMChanges();
        }, 500);
    };

// Prototype
iScroll.prototype = {
    enabled: true,
    x: 0,
    y: 0,
    steps: [],
    scale: 1,
    currPageX: 0, currPageY: 0,
    pagesX: [], pagesY: [],
    aniTime: null,
    wheelZoomCount: 0,
    
    handleEvent: function (e) {
        var that = this;
        switch(e.type) {
            case START_EV:
                if (!hasTouch && e.button !== 0) return;
                that._start(e);
                break;
            case MOVE_EV: that._move(e); break;
            case END_EV:
            case CANCEL_EV: that._end(e); break;
            case RESIZE_EV: that._resize(); break;
            case 'DOMMouseScroll': case 'mousewheel': that._wheel(e); break;
            case TRNEND_EV: that._transitionEnd(e); break;
        }
    },
    
    _checkDOMChanges: function () {
        if (this.moved || this.zoomed || this.animating ||
            (this.scrollerW == this.scroller.offsetWidth * this.scale && this.scrollerH == this.scroller.offsetHeight * this.scale)) return;

        this.refresh();
    },
    
    _scrollbar: function (dir) {
        var that = this,
            bar;

        if (!that[dir + 'Scrollbar']) {
            if (that[dir + 'ScrollbarWrapper']) {
                if (hasTransform) that[dir + 'ScrollbarIndicator'].style[transform] = '';
                that[dir + 'ScrollbarWrapper'].parentNode.removeChild(that[dir + 'ScrollbarWrapper']);
                that[dir + 'ScrollbarWrapper'] = null;
                that[dir + 'ScrollbarIndicator'] = null;
            }

            return;
        }

        if (!that[dir + 'ScrollbarWrapper']) {
            // Create the scrollbar wrapper
            bar = doc.createElement('div');

            if (that.options.scrollbarClass) bar.className = that.options.scrollbarClass + dir.toUpperCase();
            else bar.style.cssText = 'position:absolute;z-index:100;' + (dir == 'h' ? 'height:7px;bottom:1px;left:2px;right:' + (that.vScrollbar ? '7' : '2') + 'px' : 'width:7px;bottom:' + (that.hScrollbar ? '7' : '2') + 'px;top:2px;right:1px');

            bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:opacity;' + cssVendor + 'transition-duration:' + (that.options.fadeScrollbar ? '350ms' : '0') + ';overflow:hidden;opacity:' + (that.options.hideScrollbar ? '0' : '1');

            that.wrapper.appendChild(bar);
            that[dir + 'ScrollbarWrapper'] = bar;

            // Create the scrollbar indicator
            bar = doc.createElement('div');
            if (!that.options.scrollbarClass) {
                bar.style.cssText = 'position:absolute;z-index:100;background:rgba(0,0,0,0.5);border:1px solid rgba(255,255,255,0.9);' + cssVendor + 'background-clip:padding-box;' + cssVendor + 'box-sizing:border-box;' + (dir == 'h' ? 'height:100%' : 'width:100%') + ';' + cssVendor + 'border-radius:3px;border-radius:3px';
            }
            bar.style.cssText += ';pointer-events:none;' + cssVendor + 'transition-property:' + cssVendor + 'transform;' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1);' + cssVendor + 'transition-duration:0;' + cssVendor + 'transform: translate(0,0)' + translateZ;
            if (that.options.useTransition) bar.style.cssText += ';' + cssVendor + 'transition-timing-function:cubic-bezier(0.33,0.66,0.66,1)';

            that[dir + 'ScrollbarWrapper'].appendChild(bar);
            that[dir + 'ScrollbarIndicator'] = bar;
        }

        if (dir == 'h') {
            that.hScrollbarSize = that.hScrollbarWrapper.clientWidth;
            that.hScrollbarIndicatorSize = m.max(m.round(that.hScrollbarSize * that.hScrollbarSize / that.scrollerW), 8);
            that.hScrollbarIndicator.style.width = that.hScrollbarIndicatorSize + 'px';
            that.hScrollbarMaxScroll = that.hScrollbarSize - that.hScrollbarIndicatorSize;
            that.hScrollbarProp = that.hScrollbarMaxScroll / that.maxScrollX;
        } else {
            that.vScrollbarSize = that.vScrollbarWrapper.clientHeight;
            that.vScrollbarIndicatorSize = m.max(m.round(that.vScrollbarSize * that.vScrollbarSize / that.scrollerH), 8);
            that.vScrollbarIndicator.style.height = that.vScrollbarIndicatorSize + 'px';
            that.vScrollbarMaxScroll = that.vScrollbarSize - that.vScrollbarIndicatorSize;
            that.vScrollbarProp = that.vScrollbarMaxScroll / that.maxScrollY;
        }

        // Reset position
        that._scrollbarPos(dir, true);
    },
    
    _resize: function () {
        var that = this;
        setTimeout(function () { that.refresh(); }, isAndroid ? 200 : 0);
    },
    
    _pos: function (x, y) {
        if (this.zoomed) return;

        x = this.hScroll ? x : 0;
        y = this.vScroll ? y : 0;

        if (this.options.useTransform) {
            this.scroller.style[transform] = 'translate(' + x + 'px,' + y + 'px) scale(' + this.scale + ')' + translateZ;
        } else {
            x = m.round(x);
            y = m.round(y);
            this.scroller.style.left = x + 'px';
            this.scroller.style.top = y + 'px';
        }

        this.x = x;
        this.y = y;

        this._scrollbarPos('h');
        this._scrollbarPos('v');
    },

    _scrollbarPos: function (dir, hidden) {
        var that = this,
            pos = dir == 'h' ? that.x : that.y,
            size;

        if (!that[dir + 'Scrollbar']) return;

        pos = that[dir + 'ScrollbarProp'] * pos;

        if (pos < 0) {
            if (!that.options.fixedScrollbar) {
                size = that[dir + 'ScrollbarIndicatorSize'] + m.round(pos * 3);
                if (size < 8) size = 8;
                that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
            }
            pos = 0;
        } else if (pos > that[dir + 'ScrollbarMaxScroll']) {
            if (!that.options.fixedScrollbar) {
                size = that[dir + 'ScrollbarIndicatorSize'] - m.round((pos - that[dir + 'ScrollbarMaxScroll']) * 3);
                if (size < 8) size = 8;
                that[dir + 'ScrollbarIndicator'].style[dir == 'h' ? 'width' : 'height'] = size + 'px';
                pos = that[dir + 'ScrollbarMaxScroll'] + (that[dir + 'ScrollbarIndicatorSize'] - size);
            } else {
                pos = that[dir + 'ScrollbarMaxScroll'];
            }
        }

        that[dir + 'ScrollbarWrapper'].style[transitionDelay] = '0';
        that[dir + 'ScrollbarWrapper'].style.opacity = hidden && that.options.hideScrollbar ? '0' : '1';
        that[dir + 'ScrollbarIndicator'].style[transform] = 'translate(' + (dir == 'h' ? pos + 'px,0)' : '0,' + pos + 'px)') + translateZ;
    },
    
    _start: function (e) {
        var that = this,
            point = hasTouch ? e.touches[0] : e,
            matrix, x, y,
            c1, c2;

        if (!that.enabled) return;

        if (that.options.onBeforeScrollStart) that.options.onBeforeScrollStart.call(that, e);

        if (that.options.useTransition || that.options.zoom) that._transitionTime(0);

        that.moved = false;
        that.animating = false;
        that.zoomed = false;
        that.distX = 0;
        that.distY = 0;
        that.absDistX = 0;
        that.absDistY = 0;
        that.dirX = 0;
        that.dirY = 0;

        // Gesture start
        if (that.options.zoom && hasTouch && e.touches.length > 1) {
            c1 = m.abs(e.touches[0].pageX-e.touches[1].pageX);
            c2 = m.abs(e.touches[0].pageY-e.touches[1].pageY);
            that.touchesDistStart = m.sqrt(c1 * c1 + c2 * c2);

            that.originX = m.abs(e.touches[0].pageX + e.touches[1].pageX - that.wrapperOffsetLeft * 2) / 2 - that.x;
            that.originY = m.abs(e.touches[0].pageY + e.touches[1].pageY - that.wrapperOffsetTop * 2) / 2 - that.y;

            if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
        }

        if (that.options.momentum) {
            if (that.options.useTransform) {
                // Very lame general purpose alternative to CSSMatrix
                matrix = getComputedStyle(that.scroller, null)[transform].replace(/[^0-9\-.,]/g, '').split(',');
                x = +(matrix[12] || matrix[4]);
                y = +(matrix[13] || matrix[5]);
            } else {
                x = +getComputedStyle(that.scroller, null).left.replace(/[^0-9-]/g, '');
                y = +getComputedStyle(that.scroller, null).top.replace(/[^0-9-]/g, '');
            }
            
            if (x != that.x || y != that.y) {
                if (that.options.useTransition) that._unbind(TRNEND_EV);
                else cancelFrame(that.aniTime);
                that.steps = [];
                that._pos(x, y);
                if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);
            }
        }

        that.absStartX = that.x;    // Needed by snap threshold
        that.absStartY = that.y;

        that.startX = that.x;
        that.startY = that.y;
        that.pointX = point.pageX;
        that.pointY = point.pageY;

        that.startTime = e.timeStamp || Date.now();

        if (that.options.onScrollStart) that.options.onScrollStart.call(that, e);

        that._bind(MOVE_EV, window);
        that._bind(END_EV, window);
        that._bind(CANCEL_EV, window);
    },
    
    _move: function (e) {
        var that = this,
            point = hasTouch ? e.touches[0] : e,
            deltaX = point.pageX - that.pointX,
            deltaY = point.pageY - that.pointY,
            newX = that.x + deltaX,
            newY = that.y + deltaY,
            c1, c2, scale,
            timestamp = e.timeStamp || Date.now();

        if (that.options.onBeforeScrollMove) that.options.onBeforeScrollMove.call(that, e);

        // Zoom
        if (that.options.zoom && hasTouch && e.touches.length > 1) {
            c1 = m.abs(e.touches[0].pageX - e.touches[1].pageX);
            c2 = m.abs(e.touches[0].pageY - e.touches[1].pageY);
            that.touchesDist = m.sqrt(c1*c1+c2*c2);

            that.zoomed = true;

            scale = 1 / that.touchesDistStart * that.touchesDist * this.scale;

            if (scale < that.options.zoomMin) scale = 0.5 * that.options.zoomMin * Math.pow(2.0, scale / that.options.zoomMin);
            else if (scale > that.options.zoomMax) scale = 2.0 * that.options.zoomMax * Math.pow(0.5, that.options.zoomMax / scale);

            that.lastScale = scale / this.scale;

            newX = this.originX - this.originX * that.lastScale + this.x,
            newY = this.originY - this.originY * that.lastScale + this.y;

            this.scroller.style[transform] = 'translate(' + newX + 'px,' + newY + 'px) scale(' + scale + ')' + translateZ;

            if (that.options.onZoom) that.options.onZoom.call(that, e);
            return;
        }

        that.pointX = point.pageX;
        that.pointY = point.pageY;

        // Slow down if outside of the boundaries
        if (newX > 0 || newX < that.maxScrollX) {
            newX = that.options.bounce ? that.x + (deltaX / 2) : newX >= 0 || that.maxScrollX >= 0 ? 0 : that.maxScrollX;
        }
        if (newY > that.minScrollY || newY < that.maxScrollY) {
            newY = that.options.bounce ? that.y + (deltaY / 2) : newY >= that.minScrollY || that.maxScrollY >= 0 ? that.minScrollY : that.maxScrollY;
        }

        that.distX += deltaX;
        that.distY += deltaY;
        that.absDistX = m.abs(that.distX);
        that.absDistY = m.abs(that.distY);

        if (that.absDistX < 6 && that.absDistY < 6) {
            return;
        }

        // Lock direction
        if (that.options.lockDirection) {
            if (that.absDistX > that.absDistY + 5) {
                newY = that.y;
                deltaY = 0;
            } else if (that.absDistY > that.absDistX + 5) {
                newX = that.x;
                deltaX = 0;
            }
        }

        that.moved = true;
        that._pos(newX, newY);
        that.dirX = deltaX > 0 ? -1 : deltaX < 0 ? 1 : 0;
        that.dirY = deltaY > 0 ? -1 : deltaY < 0 ? 1 : 0;

        if (timestamp - that.startTime > 300) {
            that.startTime = timestamp;
            that.startX = that.x;
            that.startY = that.y;
        }
        
        if (that.options.onScrollMove) that.options.onScrollMove.call(that, e);
    },
    
    _end: function (e) {
        if (hasTouch && e.touches.length !== 0) return;

        var that = this,
            point = hasTouch ? e.changedTouches[0] : e,
            target, ev,
            momentumX = { dist:0, time:0 },
            momentumY = { dist:0, time:0 },
            duration = (e.timeStamp || Date.now()) - that.startTime,
            newPosX = that.x,
            newPosY = that.y,
            distX, distY,
            newDuration,
            snap,
            scale;

        that._unbind(MOVE_EV, window);
        that._unbind(END_EV, window);
        that._unbind(CANCEL_EV, window);

        if (that.options.onBeforeScrollEnd) that.options.onBeforeScrollEnd.call(that, e);

        if (that.zoomed) {
            scale = that.scale * that.lastScale;
            scale = Math.max(that.options.zoomMin, scale);
            scale = Math.min(that.options.zoomMax, scale);
            that.lastScale = scale / that.scale;
            that.scale = scale;

            that.x = that.originX - that.originX * that.lastScale + that.x;
            that.y = that.originY - that.originY * that.lastScale + that.y;
            
            that.scroller.style[transitionDuration] = '200ms';
            that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + that.scale + ')' + translateZ;
            
            that.zoomed = false;
            that.refresh();

            if (that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
            return;
        }

        if (!that.moved) {
            if (hasTouch) {
                if (that.doubleTapTimer && that.options.zoom) {
                    // Double tapped
                    clearTimeout(that.doubleTapTimer);
                    that.doubleTapTimer = null;
                    if (that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                    that.zoom(that.pointX, that.pointY, that.scale == 1 ? that.options.doubleTapZoom : 1);
                    if (that.options.onZoomEnd) {
                        setTimeout(function() {
                            that.options.onZoomEnd.call(that, e);
                        }, 200); // 200 is default zoom duration
                    }
                } else if (this.options.handleClick) {
                    that.doubleTapTimer = setTimeout(function () {
                        that.doubleTapTimer = null;

                        // Find the last touched element
                        target = point.target;
                        while (target.nodeType != 1) target = target.parentNode;

                        if (target.tagName != 'SELECT' && target.tagName != 'INPUT' && target.tagName != 'TEXTAREA') {
                            ev = doc.createEvent('MouseEvents');
                            ev.initMouseEvent('click', true, true, e.view, 1,
                                point.screenX, point.screenY, point.clientX, point.clientY,
                                e.ctrlKey, e.altKey, e.shiftKey, e.metaKey,
                                0, null);
                            ev._fake = true;
                            target.dispatchEvent(ev);
                        }
                    }, that.options.zoom ? 250 : 0);
                }
            }

            that._resetPos(400);

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        if (duration < 300 && that.options.momentum) {
            momentumX = newPosX ? that._momentum(newPosX - that.startX, duration, -that.x, that.scrollerW - that.wrapperW + that.x, that.options.bounce ? that.wrapperW : 0) : momentumX;
            momentumY = newPosY ? that._momentum(newPosY - that.startY, duration, -that.y, (that.maxScrollY < 0 ? that.scrollerH - that.wrapperH + that.y - that.minScrollY : 0), that.options.bounce ? that.wrapperH : 0) : momentumY;

            newPosX = that.x + momentumX.dist;
            newPosY = that.y + momentumY.dist;

            if ((that.x > 0 && newPosX > 0) || (that.x < that.maxScrollX && newPosX < that.maxScrollX)) momentumX = { dist:0, time:0 };
            if ((that.y > that.minScrollY && newPosY > that.minScrollY) || (that.y < that.maxScrollY && newPosY < that.maxScrollY)) momentumY = { dist:0, time:0 };
        }

        if (momentumX.dist || momentumY.dist) {
            newDuration = m.max(m.max(momentumX.time, momentumY.time), 10);

            // Do we need to snap?
            if (that.options.snap) {
                distX = newPosX - that.absStartX;
                distY = newPosY - that.absStartY;
                if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) { that.scrollTo(that.absStartX, that.absStartY, 200); }
                else {
                    snap = that._snap(newPosX, newPosY);
                    newPosX = snap.x;
                    newPosY = snap.y;
                    newDuration = m.max(snap.time, newDuration);
                }
            }

            that.scrollTo(m.round(newPosX), m.round(newPosY), newDuration);

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        // Do we need to snap?
        if (that.options.snap) {
            distX = newPosX - that.absStartX;
            distY = newPosY - that.absStartY;
            if (m.abs(distX) < that.options.snapThreshold && m.abs(distY) < that.options.snapThreshold) that.scrollTo(that.absStartX, that.absStartY, 200);
            else {
                snap = that._snap(that.x, that.y);
                if (snap.x != that.x || snap.y != that.y) that.scrollTo(snap.x, snap.y, snap.time);
            }

            if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
            return;
        }

        that._resetPos(200);
        if (that.options.onTouchEnd) that.options.onTouchEnd.call(that, e);
    },
    
    _resetPos: function (time) {
        var that = this,
            resetX = that.x >= 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x,
            resetY = that.y >= that.minScrollY || that.maxScrollY > 0 ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

        if (resetX == that.x && resetY == that.y) {
            if (that.moved) {
                that.moved = false;
                if (that.options.onScrollEnd) that.options.onScrollEnd.call(that);      // Execute custom code on scroll end
            }

            if (that.hScrollbar && that.options.hideScrollbar) {
                if (vendor == 'webkit') that.hScrollbarWrapper.style[transitionDelay] = '300ms';
                that.hScrollbarWrapper.style.opacity = '0';
            }
            if (that.vScrollbar && that.options.hideScrollbar) {
                if (vendor == 'webkit') that.vScrollbarWrapper.style[transitionDelay] = '300ms';
                that.vScrollbarWrapper.style.opacity = '0';
            }

            return;
        }

        that.scrollTo(resetX, resetY, time || 0);
    },

    _wheel: function (e) {
        var that = this,
            wheelDeltaX, wheelDeltaY,
            deltaX, deltaY,
            deltaScale;

        if ('wheelDeltaX' in e) {
            wheelDeltaX = e.wheelDeltaX / 12;
            wheelDeltaY = e.wheelDeltaY / 12;
        } else if('wheelDelta' in e) {
            wheelDeltaX = wheelDeltaY = e.wheelDelta / 12;
        } else if ('detail' in e) {
            wheelDeltaX = wheelDeltaY = -e.detail * 3;
        } else {
            return;
        }
        
        if (that.options.wheelAction == 'zoom') {
            deltaScale = that.scale * Math.pow(2, 1/3 * (wheelDeltaY ? wheelDeltaY / Math.abs(wheelDeltaY) : 0));
            if (deltaScale < that.options.zoomMin) deltaScale = that.options.zoomMin;
            if (deltaScale > that.options.zoomMax) deltaScale = that.options.zoomMax;
            
            if (deltaScale != that.scale) {
                if (!that.wheelZoomCount && that.options.onZoomStart) that.options.onZoomStart.call(that, e);
                that.wheelZoomCount++;
                
                that.zoom(e.pageX, e.pageY, deltaScale, 400);
                
                setTimeout(function() {
                    that.wheelZoomCount--;
                    if (!that.wheelZoomCount && that.options.onZoomEnd) that.options.onZoomEnd.call(that, e);
                }, 400);
            }
            
            return;
        }
        
        deltaX = that.x + wheelDeltaX;
        deltaY = that.y + wheelDeltaY;

        if (deltaX > 0) deltaX = 0;
        else if (deltaX < that.maxScrollX) deltaX = that.maxScrollX;

        if (deltaY > that.minScrollY) deltaY = that.minScrollY;
        else if (deltaY < that.maxScrollY) deltaY = that.maxScrollY;
    
        if (that.maxScrollY < 0) {
            that.scrollTo(deltaX, deltaY, 0);
        }
    },
    
    _transitionEnd: function (e) {
        var that = this;

        if (e.target != that.scroller) return;

        that._unbind(TRNEND_EV);
        
        that._startAni();
    },


    /**
    *
    * Utilities
    *
    */
    _startAni: function () {
        var that = this,
            startX = that.x, startY = that.y,
            startTime = Date.now(),
            step, easeOut,
            animate;

        if (that.animating) return;
        
        if (!that.steps.length) {
            that._resetPos(400);
            return;
        }
        
        step = that.steps.shift();
        
        if (step.x == startX && step.y == startY) step.time = 0;

        that.animating = true;
        that.moved = true;
        
        if (that.options.useTransition) {
            that._transitionTime(step.time);
            that._pos(step.x, step.y);
            that.animating = false;
            if (step.time) that._bind(TRNEND_EV);
            else that._resetPos(0);
            return;
        }

        animate = function () {
            var now = Date.now(),
                newX, newY;

            if (now >= startTime + step.time) {
                that._pos(step.x, step.y);
                that.animating = false;
                if (that.options.onAnimationEnd) that.options.onAnimationEnd.call(that);            // Execute custom code on animation end
                that._startAni();
                return;
            }

            now = (now - startTime) / step.time - 1;
            easeOut = m.sqrt(1 - now * now);
            newX = (step.x - startX) * easeOut + startX;
            newY = (step.y - startY) * easeOut + startY;
            that._pos(newX, newY);
            if (that.animating) that.aniTime = nextFrame(animate);
        };

        animate();
    },

    _transitionTime: function (time) {
        time += 'ms';
        this.scroller.style[transitionDuration] = time;
        if (this.hScrollbar) this.hScrollbarIndicator.style[transitionDuration] = time;
        if (this.vScrollbar) this.vScrollbarIndicator.style[transitionDuration] = time;
    },

    _momentum: function (dist, time, maxDistUpper, maxDistLower, size) {
        var deceleration = 0.0006,
            speed = m.abs(dist) / time,
            newDist = (speed * speed) / (2 * deceleration),
            newTime = 0, outsideDist = 0;

        // Proportinally reduce speed if we are outside of the boundaries
        if (dist > 0 && newDist > maxDistUpper) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistUpper = maxDistUpper + outsideDist;
            speed = speed * maxDistUpper / newDist;
            newDist = maxDistUpper;
        } else if (dist < 0 && newDist > maxDistLower) {
            outsideDist = size / (6 / (newDist / speed * deceleration));
            maxDistLower = maxDistLower + outsideDist;
            speed = speed * maxDistLower / newDist;
            newDist = maxDistLower;
        }

        newDist = newDist * (dist < 0 ? -1 : 1);
        newTime = speed / deceleration;

        return { dist: newDist, time: m.round(newTime) };
    },

    _offset: function (el) {
        var left = -el.offsetLeft,
            top = -el.offsetTop;
            
        while (el = el.offsetParent) {
            left -= el.offsetLeft;
            top -= el.offsetTop;
        }
        
        if (el != this.wrapper) {
            left *= this.scale;
            top *= this.scale;
        }

        return { left: left, top: top };
    },

    _snap: function (x, y) {
        var that = this,
            i, l,
            page, time,
            sizeX, sizeY;

        // Check page X
        page = that.pagesX.length - 1;
        for (i=0, l=that.pagesX.length; i<l; i++) {
            if (x >= that.pagesX[i]) {
                page = i;
                break;
            }
        }
        if (page == that.currPageX && page > 0 && that.dirX < 0) page--;
        x = that.pagesX[page];
        sizeX = m.abs(x - that.pagesX[that.currPageX]);
        sizeX = sizeX ? m.abs(that.x - x) / sizeX * 500 : 0;
        that.currPageX = page;

        // Check page Y
        page = that.pagesY.length-1;
        for (i=0; i<page; i++) {
            if (y >= that.pagesY[i]) {
                page = i;
                break;
            }
        }
        if (page == that.currPageY && page > 0 && that.dirY < 0) page--;
        y = that.pagesY[page];
        sizeY = m.abs(y - that.pagesY[that.currPageY]);
        sizeY = sizeY ? m.abs(that.y - y) / sizeY * 500 : 0;
        that.currPageY = page;

        // Snap with constant speed (proportional duration)
        time = m.round(m.max(sizeX, sizeY)) || 200;

        return { x: x, y: y, time: time };
    },

    _bind: function (type, el, bubble) {
        (el || this.scroller).addEventListener(type, this, !!bubble);
    },

    _unbind: function (type, el, bubble) {
        (el || this.scroller).removeEventListener(type, this, !!bubble);
    },


    /**
    *
    * Public methods
    *
    */
    destroy: function () {
        var that = this;

        that.scroller.style[transform] = '';

        // Remove the scrollbars
        that.hScrollbar = false;
        that.vScrollbar = false;
        that._scrollbar('h');
        that._scrollbar('v');

        // Remove the event listeners
        that._unbind(RESIZE_EV, window);
        that._unbind(START_EV);
        that._unbind(MOVE_EV, window);
        that._unbind(END_EV, window);
        that._unbind(CANCEL_EV, window);
        
        if (!that.options.hasTouch) {
            that._unbind('DOMMouseScroll');
            that._unbind('mousewheel');
        }
        
        if (that.options.useTransition) that._unbind(TRNEND_EV);
        
        if (that.options.checkDOMChanges) clearInterval(that.checkDOMTime);
        
        if (that.options.onDestroy) that.options.onDestroy.call(that);
    },

    refresh: function () {
        var that = this,
            offset,
            i, l,
            els,
            pos = 0,
            page = 0;

        if (that.scale < that.options.zoomMin) that.scale = that.options.zoomMin;
        that.wrapperW = that.wrapper.clientWidth || 1;
        that.wrapperH = that.wrapper.clientHeight || 1;

        that.minScrollY = -that.options.topOffset || 0;
        that.scrollerW = m.round(that.scroller.offsetWidth * that.scale);
        that.scrollerH = m.round((that.scroller.offsetHeight + that.minScrollY) * that.scale);
        that.maxScrollX = that.wrapperW - that.scrollerW;
        that.maxScrollY = that.wrapperH - that.scrollerH + that.minScrollY;
        that.dirX = 0;
        that.dirY = 0;

        if (that.options.onRefresh) that.options.onRefresh.call(that);

        that.hScroll = that.options.hScroll && that.maxScrollX < 0;
        that.vScroll = that.options.vScroll && (!that.options.bounceLock && !that.hScroll || that.scrollerH > that.wrapperH);

        that.hScrollbar = that.hScroll && that.options.hScrollbar;
        that.vScrollbar = that.vScroll && that.options.vScrollbar && that.scrollerH > that.wrapperH;

        offset = that._offset(that.wrapper);
        that.wrapperOffsetLeft = -offset.left;
        that.wrapperOffsetTop = -offset.top;

        // Prepare snap
        if (typeof that.options.snap == 'string') {
            that.pagesX = [];
            that.pagesY = [];
            els = that.scroller.querySelectorAll(that.options.snap);
            for (i=0, l=els.length; i<l; i++) {
                pos = that._offset(els[i]);
                pos.left += that.wrapperOffsetLeft;
                pos.top += that.wrapperOffsetTop;
                that.pagesX[i] = pos.left < that.maxScrollX ? that.maxScrollX : pos.left * that.scale;
                that.pagesY[i] = pos.top < that.maxScrollY ? that.maxScrollY : pos.top * that.scale;
            }
        } else if (that.options.snap) {
            that.pagesX = [];
            while (pos >= that.maxScrollX) {
                that.pagesX[page] = pos;
                pos = pos - that.wrapperW;
                page++;
            }
            if (that.maxScrollX%that.wrapperW) that.pagesX[that.pagesX.length] = that.maxScrollX - that.pagesX[that.pagesX.length-1] + that.pagesX[that.pagesX.length-1];

            pos = 0;
            page = 0;
            that.pagesY = [];
            while (pos >= that.maxScrollY) {
                that.pagesY[page] = pos;
                pos = pos - that.wrapperH;
                page++;
            }
            if (that.maxScrollY%that.wrapperH) that.pagesY[that.pagesY.length] = that.maxScrollY - that.pagesY[that.pagesY.length-1] + that.pagesY[that.pagesY.length-1];
        }

        // Prepare the scrollbars
        that._scrollbar('h');
        that._scrollbar('v');

        if (!that.zoomed) {
            that.scroller.style[transitionDuration] = '0';
            that._resetPos(400);
        }
    },

    scrollTo: function (x, y, time, relative) {
        var that = this,
            step = x,
            i, l;

        that.stop();

        if (!step.length) step = [{ x: x, y: y, time: time, relative: relative }];
        
        for (i=0, l=step.length; i<l; i++) {
            if (step[i].relative) { step[i].x = that.x - step[i].x; step[i].y = that.y - step[i].y; }
            that.steps.push({ x: step[i].x, y: step[i].y, time: step[i].time || 0 });
        }

        that._startAni();
    },

    scrollToElement: function (el, time) {
        var that = this, pos;
        el = el.nodeType ? el : that.scroller.querySelector(el);
        if (!el) return;

        pos = that._offset(el);
        pos.left += that.wrapperOffsetLeft;
        pos.top += that.wrapperOffsetTop;

        pos.left = pos.left > 0 ? 0 : pos.left < that.maxScrollX ? that.maxScrollX : pos.left;
        pos.top = pos.top > that.minScrollY ? that.minScrollY : pos.top < that.maxScrollY ? that.maxScrollY : pos.top;
        time = time === undefined ? m.max(m.abs(pos.left)*2, m.abs(pos.top)*2) : time;

        that.scrollTo(pos.left, pos.top, time);
    },

    scrollToPage: function (pageX, pageY, time) {
        var that = this, x, y;
        
        time = time === undefined ? 400 : time;

        if (that.options.onScrollStart) that.options.onScrollStart.call(that);

        if (that.options.snap) {
            pageX = pageX == 'next' ? that.currPageX+1 : pageX == 'prev' ? that.currPageX-1 : pageX;
            pageY = pageY == 'next' ? that.currPageY+1 : pageY == 'prev' ? that.currPageY-1 : pageY;

            pageX = pageX < 0 ? 0 : pageX > that.pagesX.length-1 ? that.pagesX.length-1 : pageX;
            pageY = pageY < 0 ? 0 : pageY > that.pagesY.length-1 ? that.pagesY.length-1 : pageY;

            that.currPageX = pageX;
            that.currPageY = pageY;
            x = that.pagesX[pageX];
            y = that.pagesY[pageY];
        } else {
            x = -that.wrapperW * pageX;
            y = -that.wrapperH * pageY;
            if (x < that.maxScrollX) x = that.maxScrollX;
            if (y < that.maxScrollY) y = that.maxScrollY;
        }

        that.scrollTo(x, y, time);
    },

    disable: function () {
        this.stop();
        this._resetPos(0);
        this.enabled = false;

        // If disabled after touchstart we make sure that there are no left over events
        this._unbind(MOVE_EV, window);
        this._unbind(END_EV, window);
        this._unbind(CANCEL_EV, window);
    },
    
    enable: function () {
        this.enabled = true;
    },
    
    stop: function () {
        if (this.options.useTransition) this._unbind(TRNEND_EV);
        else cancelFrame(this.aniTime);
        this.steps = [];
        this.moved = false;
        this.animating = false;
    },
    
    zoom: function (x, y, scale, time) {
        var that = this,
            relScale = scale / that.scale;

        if (!that.options.useTransform) return;

        that.zoomed = true;
        time = time === undefined ? 200 : time;
        x = x - that.wrapperOffsetLeft - that.x;
        y = y - that.wrapperOffsetTop - that.y;
        that.x = x - x * relScale + that.x;
        that.y = y - y * relScale + that.y;

        that.scale = scale;
        that.refresh();

        that.x = that.x > 0 ? 0 : that.x < that.maxScrollX ? that.maxScrollX : that.x;
        that.y = that.y > that.minScrollY ? that.minScrollY : that.y < that.maxScrollY ? that.maxScrollY : that.y;

        that.scroller.style[transitionDuration] = time + 'ms';
        that.scroller.style[transform] = 'translate(' + that.x + 'px,' + that.y + 'px) scale(' + scale + ')' + translateZ;
        that.zoomed = false;
    },
    
    isReady: function () {
        return !this.moved && !this.zoomed && !this.animating;
    }
};

function prefixStyle (style) {
    if ( vendor === '' ) return style;

    style = style.charAt(0).toUpperCase() + style.substr(1);
    return vendor + style;
}

dummyStyle = null;  // for the sake of it

if (typeof exports !== 'undefined') exports.iScroll = iScroll;
else window.iScroll = iScroll;

})(window, document);
gameData = [
    {
        id: 2,
        src: './static/images/data/2.jpg',
        startCX: 0,
    	startCY: 0       
    },
    {
        id: 3,
        src: './static/images/data/3.jpg'       
    },
    {
        id: 4,
        src: './static/images/data/4.jpg'       
    },
    {
        id: 5,
        src: './static/images/data/5.jpg'       
    },
    {
        id: 6,
        src: './static/images/data/6.jpg'       
    },
    {
        id: 8,
        src: './static/images/data/8.jpg'       
    },
    {
        id: 9,
        src: './static/images/data/9.jpg'       
    },
    {
        id: 10,
        src: './static/images/data/10.jpg'
    },
    {
        id: 11,
        src: './static/images/data/11.jpg'      
    }
];
Storage = {
    run: function(){
        this.dataOriginal = {
                Images: gameData,
                Sound: true,
                Vibrate: true,
                Round: 2,
                Score: []
            };
        if(localStorage['puzzleGame.gameData']==null){
            localStorage['puzzleGame.gameData']=JSON.stringify(this.dataOriginal);
        }
        this.gameData = JSON.parse(localStorage['puzzleGame.gameData']);
    },
    setLocal: function(){
        localStorage['puzzleGame.gameData']=JSON.stringify(this.gameData);
    },
    clearLocal: function(){
        localStorage.removeItem('puzzleGame.gameData');
    },
    add: function(data){
    	this.gameData.Images.push(data);
    	this.setLocal();
    },
    remove: function(idx){
    	console.log(idx);
    	console.log(this.gameData.Images);
    	this.gameData.Images.splice(idx,1);
    	//delete(this.gameData.Images[idx]);
    	this.setLocal();
    	console.log(this.gameData.Images);
    }
};
Storage.run();
TimeManager = {
        statusPause: false,
        statusEnd: false,
        statusPlay: false
};
Time = Sketch.extend({
    setupDomObject: function(config){
        this._super(config);
        this.registerObserver();
        this.access().text(extString.toTime(config.time));
        this.time = config.time;
    },
    getTime: function(){
        return this.time;
    },
    onTimeStart: function(){
        var _self = this;
        TimeManager.statusStop = false;
        TimeManager.statusPlay = true;
        TimeManager.statusPause = false;
        this.interval = setInterval(function(){
            console.log(1);
            _self.time++;
            _self.access().text(extString.toTime(_self.time));
        },1000);
    },
    onTimePause: function(){
        TimeManager.statusStop = false;
        TimeManager.statusPlay = false;
        TimeManager.statusPause = true;
        clearInterval(this.interval);
    },
    onTimeEnd: function(){
        TimeManager.statusStop = true;
        TimeManager.statusPlay = false;
        TimeManager.statusPause = false;
        this.time = 0;
        clearInterval(this.interval);
    },
    clear: function(){
        clearInterval(this.interval);
        this.unregisterObserver();
        console.log('TimeClear');
    }
}).implement(PortletInterface, RenderInterface, ObserverInterface);
extMath = {
    string: "abcdefghijklmnopqrstuvwxyz",
    randomMidded: function(min,max){
        return Math.floor(Math.random()*(max-min)+min);
    },
    fakeDic: function(config){
        var _self = this;
        var sum = 0;
        var tmp = [];
        $.each(config.dic, function(i,data){
            if(data.text.length<=config.column){
                tmp.push({
                    text: _self.randomString({width: config.column-data.text.length})+data.text,
                    textOriginal: data.text,
                    image: data.image,
                    audio: data.audio,
                    status: data.status
                });
                sum++;
            }
        });
        return {sum: sum, dic: tmp};
    },
    randomString: function(config){
        var _self = this;
        var tmp = '';
        var len = this.randomMidded(0,config.width);
        for(var i = 0; i< len; i++){
            tmp += _self.string[_self.randomMidded(0,25)];
        }
        return tmp;
    },
    dicForLang: function(config){
        var tmp = [];
        $.each(Storage.gameData.Dictory, function(i,data){
            tmp.push({
                text: data[config+'Text'],
                image: data.images,
                audio: data.audio,
                status: false
                });
        });
        return tmp;
    },
    average: function(config){
        var sum = 0;
        $.each(config,function(i,data){
            sum+=data;
        });
        return sum/config.length;
    },
    getLevel: function(level){
        var tmp = [];
        if(level==0){
            return GameLevel;
        }
        for(var i=(level-1)*6; i<level*6; i++){
            tmp.push(GameLevel[i]);
        }
        return tmp;
    },
    randomFlag: function(){
        if(this.randomMidded(0, 2)==1){
            return 1;
        }
        return -1;
    },
    check8Puzzle: function(arr){
    	var _flag = 0;
    	for(var i=0; i< arr.length-1; i++){
    		for(var j=i; j<arr.length; j++){
    			if(arr[i]>arr[j])	_flag++;
    		}
    	}
    	if((_flag%2)==0&&_flag!=0){
    		return true;
    	}
    	return false;
    },
    fakePlace8Puzzle: function(round){
    	var tmp = [];
    	var hints = [];
    	var _flag;
    	for(var i=1;i<(round*round);i++){
    		tmp.push(i);
    	}
    	while(tmp.length>0){
    		_flag = extMath.randomMidded(0,tmp.length);
    		hints.push(tmp[_flag]);
    		tmp.splice(_flag,1);
    	}
    	console.log(hints);
    	return hints;
    }
};

extString = {
        alpha: "abcdefghijklmnopqrstuvwxyz",
        getSymbol: function (symbol){
            var _self = this;
            var len = this.alpha.length;
            for(var i=0;i<len;i++){
                if(symbol==_self.alpha[i])   return i;
            }
            return false;
        },
        strrev: function strrev(str){
            return str.split('').reverse().join('');
        },
        randomChar: function(){
            return this.alpha[extMath.randomMidded(0,26)];
        },
        toJSON: function(config){
            var month = config.date.getUTCMonth() + 1;
            if (month < 10) month = '0' + month;

            var day = config.date.getUTCDate();
            if (day < 10) day = '0' + day;

            var year = config.date.getUTCFullYear();
            
            var hours = config.date.getUTCHours();
            if (hours < 10) hours = '0' + hours;
            
            var minutes = config.date.getUTCMinutes();
            if (minutes < 10) minutes = '0' + minutes;
            
            var seconds = config.date.getUTCSeconds();
            if (seconds < 10) seconds = '0' + seconds;
            
            var milli = config.date.getUTCMilliseconds();
            if (milli < 100) milli = '0' + milli;
            if (milli < 10) milli = '0' + milli;
            
            switch(config.type){
                case 'MM/DD/YY': {return month + '-' + day + '-' + year; } break;
                case 'DD/MM/YY': {return day + '-' + month + '-' + year; } break;
                case 'YY/MM/DD': {return year + '-' + month + '-' + day; } break;
                default: return year + '-' + month + '-' + day + ' / Time - ' + hours + ':' + minutes + ':' + seconds + '.' + milli; 
            }
        },
        toTime: function(config){
            var m=parseInt(config/60);
            var s=config%60;
            if(m<10)    m='0'+m;
            if(s<10)    s='0'+s;
            return m+':'+s;
        }
}
/**
 * KineticJS JavaScript Framework v4.3.3
 * http://www.kineticjs.com/
 * Copyright 2013, Eric Rowell
 * Licensed under the MIT or GPL Version 2 licenses.
 * Date: Feb 12 2013
 *
 * Copyright (C) 2011 - 2013 by Eric Rowell
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * @namespace
 */
var Kinetic = {}; (function() {
    Kinetic.version = '4.3.3';
    /**
     * @namespace
     */
    Kinetic.Filters = {};
    Kinetic.Plugins = {};
    Kinetic.Global = {
        stages: [],
        idCounter: 0,
        ids: {},
        names: {},
        //shapes hash.  rgb keys and shape values
        shapes: {},
        warn: function(str) {
            /*
             * IE9 on Windows7 64bit will throw a JS error
             * if we don't use window.console in the conditional
             */
            if(window.console && console.warn) {
                console.warn('Kinetic warning: ' + str);
            }
        },
        extend: function(c1, c2) {
            for(var key in c2.prototype) {
                if(!( key in c1.prototype)) {
                    c1.prototype[key] = c2.prototype[key];
                }
            }
        },
        _addId: function(node, id) {
            if(id !== undefined) {
                this.ids[id] = node;
            }
        },
        _removeId: function(id) {
            if(id !== undefined) {
                delete this.ids[id];
            }
        },
        _addName: function(node, name) {
            if(name !== undefined) {
                if(this.names[name] === undefined) {
                    this.names[name] = [];
                }
                this.names[name].push(node);
            }
        },
        _removeName: function(name, _id) {
            if(name !== undefined) {
                var nodes = this.names[name];
                if(nodes !== undefined) {
                    for(var n = 0; n < nodes.length; n++) {
                        var no = nodes[n];
                        if(no._id === _id) {
                            nodes.splice(n, 1);
                        }
                    }
                    if(nodes.length === 0) {
                        delete this.names[name];
                    }
                }
            }
        }
    };
})();

// Uses Node, AMD or browser globals to create a module.

// If you want something that will work in other stricter CommonJS environments,
// or if you need to create a circular dependency, see commonJsStrict.js

// Defines a module "returnExports" that depends another module called "b".
// Note that the name of the module is implied by the file name. It is best
// if the file name and the exported global have matching names.

// If the 'b' module also uses this type of boilerplate, then
// in the browser, it will create a global .b that is used below.

// If you do not want to support the browser global path, then you
// can remove the `root` use and the passing `this` as the first arg to
// the top function.

// if the module has no dependencies, the above pattern can be simplified to
( function(root, factory) {
    if( typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    }
    else if( typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    }
    else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function() {

    // Just return a value to define the module export.
    // This example returns an object, but the module
    // can return a function as the exported value.
    return Kinetic;
}));

(function() {
    /*
     * utilities that handle data type detection, conversion, and manipulation
     */
    Kinetic.Type = {
        /*
         * cherry-picked utilities from underscore.js
         */
        _isElement: function(obj) {
            return !!(obj && obj.nodeType == 1);
        },
        _isFunction: function(obj) {
            return !!(obj && obj.constructor && obj.call && obj.apply);
        },
        _isObject: function(obj) {
            return (!!obj && obj.constructor == Object);
        },
        _isArray: function(obj) {
            return Object.prototype.toString.call(obj) == '[object Array]';
        },
        _isNumber: function(obj) {
            return Object.prototype.toString.call(obj) == '[object Number]';
        },
        _isString: function(obj) {
            return Object.prototype.toString.call(obj) == '[object String]';
        },
        /*
         * other utils
         */
        _hasMethods: function(obj) {
            var names = [];
            for(var key in obj) {
                if(this._isFunction(obj[key]))
                    names.push(key);
            }
            return names.length > 0;
        },
        _isInDocument: function(el) {
            while( el = el.parentNode) {
                if(el == document) {
                    return true;
                }
            }
            return false;
        },
        /*
         * The argument can be:
         * - an integer (will be applied to both x and y)
         * - an array of one integer (will be applied to both x and y)
         * - an array of two integers (contains x and y)
         * - an array of four integers (contains x, y, width, and height)
         * - an object with x and y properties
         * - an array of one element which is an array of integers
         * - an array of one element of an object
         */
        _getXY: function(arg) {
            if(this._isNumber(arg)) {
                return {
                    x: arg,
                    y: arg
                };
            }
            else if(this._isArray(arg)) {
                // if arg is an array of one element
                if(arg.length === 1) {
                    var val = arg[0];
                    // if arg is an array of one element which is a number
                    if(this._isNumber(val)) {
                        return {
                            x: val,
                            y: val
                        };
                    }
                    // if arg is an array of one element which is an array
                    else if(this._isArray(val)) {
                        return {
                            x: val[0],
                            y: val[1]
                        };
                    }
                    // if arg is an array of one element which is an object
                    else if(this._isObject(val)) {
                        return val;
                    }
                }
                // if arg is an array of two or more elements
                else if(arg.length >= 2) {
                    return {
                        x: arg[0],
                        y: arg[1]
                    };
                }
            }
            // if arg is an object return the object
            else if(this._isObject(arg)) {
                return arg;
            }

            // default
            return null;
        },
        /*
         * The argument can be:
         * - an integer (will be applied to both width and height)
         * - an array of one integer (will be applied to both width and height)
         * - an array of two integers (contains width and height)
         * - an array of four integers (contains x, y, width, and height)
         * - an object with width and height properties
         * - an array of one element which is an array of integers
         * - an array of one element of an object
         */
        _getSize: function(arg) {
            if(this._isNumber(arg)) {
                return {
                    width: arg,
                    height: arg
                };
            }
            else if(this._isArray(arg)) {
                // if arg is an array of one element
                if(arg.length === 1) {
                    var val = arg[0];
                    // if arg is an array of one element which is a number
                    if(this._isNumber(val)) {
                        return {
                            width: val,
                            height: val
                        };
                    }
                    // if arg is an array of one element which is an array
                    else if(this._isArray(val)) {
                        /*
                         * if arg is an array of one element which is an
                         * array of four elements
                         */
                        if(val.length >= 4) {
                            return {
                                width: val[2],
                                height: val[3]
                            };
                        }
                        /*
                         * if arg is an array of one element which is an
                         * array of two elements
                         */
                        else if(val.length >= 2) {
                            return {
                                width: val[0],
                                height: val[1]
                            };
                        }
                    }
                    // if arg is an array of one element which is an object
                    else if(this._isObject(val)) {
                        return val;
                    }
                }
                // if arg is an array of four elements
                else if(arg.length >= 4) {
                    return {
                        width: arg[2],
                        height: arg[3]
                    };
                }
                // if arg is an array of two elements
                else if(arg.length >= 2) {
                    return {
                        width: arg[0],
                        height: arg[1]
                    };
                }
            }
            // if arg is an object return the object
            else if(this._isObject(arg)) {
                return arg;
            }

            // default
            return null;
        },
        /*
         * arg will be an array of numbers or
         *  an array of point arrays or
         *  an array of point objects
         */
        _getPoints: function(arg) {
            if(arg === undefined) {
                return [];
            }

            // an array of arrays
            if(this._isArray(arg[0])) {
                /*
                 * convert array of arrays into an array
                 * of objects containing x, y
                 */
                var arr = [];
                for(var n = 0; n < arg.length; n++) {
                    arr.push({
                        x: arg[n][0],
                        y: arg[n][1]
                    });
                }

                return arr;
            }
            // an array of objects
            if(this._isObject(arg[0])) {
                return arg;
            }
            // an array of integers
            else {
                /*
                 * convert array of numbers into an array
                 * of objects containing x, y
                 */
                var arr = [];
                for(var n = 0; n < arg.length; n += 2) {
                    arr.push({
                        x: arg[n],
                        y: arg[n + 1]
                    });
                }

                return arr;
            }
        },
        /*
         * arg can be an image object or image data
         */
        _getImage: function(arg, callback) {
            // if arg is null or undefined
            if(!arg) {
                callback(null);
            }

            // if arg is already an image object
            else if(this._isElement(arg)) {
                callback(arg);
            }

            // if arg is a string, then it's a data url
            else if(this._isString(arg)) {
                var imageObj = new Image();
                /** @ignore */
                imageObj.onload = function() {
                    callback(imageObj);
                }
                imageObj.src = arg;
            }

            //if arg is an object that contains the data property, it's an image object
            else if(arg.data) {
                var canvas = document.createElement('canvas');
                canvas.width = arg.width;
                canvas.height = arg.height;
                var context = canvas.getContext('2d');
                context.putImageData(arg, 0, 0);
                var dataUrl = canvas.toDataURL();
                var imageObj = new Image();
                /** @ignore */
                imageObj.onload = function() {
                    callback(imageObj);
                }
                imageObj.src = dataUrl;
            }
            else {
                callback(null);
            }
        },
        _rgbToHex: function(r, g, b) {
            return ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
        },
        _hexToRgb: function(hex) {
            var bigint = parseInt(hex, 16);
            return {
                r: (bigint >> 16) & 255,
                g: (bigint >> 8) & 255,
                b: bigint & 255
            };
        },
        _getRandomColorKey: function() {
            var r = Math.round(Math.random() * 255);
            var g = Math.round(Math.random() * 255);
            var b = Math.round(Math.random() * 255);
            return this._rgbToHex(r, g, b);
        },
        // o1 takes precedence over o2
        _merge: function(o1, o2) {
            var retObj = this._clone(o2);
            for(var key in o1) {
                if(this._isObject(o1[key])) {
                    retObj[key] = this._merge(o1[key], retObj[key]);
                }
                else {
                    retObj[key] = o1[key];
                }
            }
            return retObj;
        },
        // deep clone
        _clone: function(obj) {
            var retObj = {};
            for(var key in obj) {
                if(this._isObject(obj[key])) {
                    retObj[key] = this._clone(obj[key]);
                }
                else {
                    retObj[key] = obj[key];
                }
            }
            return retObj;
        },
        _degToRad: function(deg) {
            return deg * Math.PI / 180;
        },
        _radToDeg: function(rad) {
            return rad * 180 / Math.PI;
        }
    };
})();

(function() {    
    // calculate pixel ratio
    var canvas = document.createElement('canvas'), 
        context = canvas.getContext('2d'), 
        devicePixelRatio = window.devicePixelRatio || 1, backingStoreRatio = context.webkitBackingStorePixelRatio || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1, 
        _pixelRatio = devicePixelRatio / backingStoreRatio;
        
    /**
     * Canvas Renderer constructor
     * @constructor
     * @param {Number} width
     * @param {Number} height
     */
    Kinetic.Canvas = function(width, height, pixelRatio) {
        this.pixelRatio = pixelRatio || _pixelRatio;
        this.width = width;
        this.height = height;
        this.element = document.createElement('canvas');
        this.context = this.element.getContext('2d');
        this.setSize(width || 0, height || 0);
    };

    Kinetic.Canvas.prototype = {
        /**
         * clear canvas
         * @name clear
         * @methodOf Kinetic.Canvas.prototype
         */
        clear: function() {
            var context = this.getContext();
            var el = this.getElement();
            context.clearRect(0, 0, el.width, el.height);
        },
        /**
         * get canvas element
         * @name getElement
         * @methodOf Kinetic.Canvas.prototype
         */
        getElement: function() {
            return this.element;
        },
        /**
         * get canvas context
         * @name getContext
         * @methodOf Kinetic.Canvas.prototype
         */
        getContext: function() {
            return this.context;
        },
        /**
         * set width
         * @name setWidth
         * @methodOf Kinetic.Canvas.prototype
         * @param {Number} width
         */
        setWidth: function(width) {
            this.width = width;
            // take into account pixel ratio
            this.element.width = width * this.pixelRatio;
            this.element.style.width = width + 'px';
        },
        /**
         * set height
         * @name setHeight
         * @methodOf Kinetic.Canvas.prototype
         * @param {Number} height
         */
        setHeight: function(height) {
            this.height = height;
            // take into account pixel ratio
            this.element.height = height * this.pixelRatio;
            this.element.style.height = height + 'px';
        },
        /**
         * get width
         * @name getWidth
         * @methodOf Kinetic.Canvas.prototype
         */
        getWidth: function() {
            return this.width;
        },
        /**
         * get height
         * @name getHeight
         * @methodOf Kinetic.Canvas.prototype
         */
        getHeight: function() {
            return this.height;
        },
        /**
         * set size
         * @name setSize
         * @methodOf Kinetic.Canvas.prototype
         * @param {Number} width
         * @param {Number} height
         */
        setSize: function(width, height) {
            this.setWidth(width);
            this.setHeight(height);
        },
        /**
         * to data url
         * @name toDataURL
         * @methodOf Kinetic.Canvas.prototype
         * @param {String} mimeType
         * @param {Number} quality between 0 and 1 for jpg mime types
         */
        toDataURL: function(mimeType, quality) {
            try {
                // If this call fails (due to browser bug, like in Firefox 3.6),
                // then revert to previous no-parameter image/png behavior
                return this.element.toDataURL(mimeType, quality);
            }
            catch(e) {
                try {
                    return this.element.toDataURL();
                }
                catch(e) {
                    Kinetic.Global.warn('Unable to get data URL. ' + e.message)
                    return '';
                }
            }
        },
        /**
         * fill shape
         * @name fill
         * @methodOf Kinetic.Canvas.prototype
         * @param {Kinetic.Shape} shape
         */
        fill: function(shape) {
            if(shape.getFillEnabled()) {
                this._fill(shape);
            }
        },
        /**
         * stroke shape
         * @name stroke
         * @methodOf Kinetic.Canvas.prototype
         * @param {Kinetic.Shape} shape
         */
        stroke: function(shape) {
            if(shape.getStrokeEnabled()) {
                this._stroke(shape);
            }
        },
        /**
         * fill, stroke, and apply shadows
         *  will only be applied to either the fill or stroke.&nbsp; Fill
         *  is given priority over stroke.
         * @name fillStroke
         * @methodOf Kinetic.Canvas.prototype
         * @param {Kinetic.Shape} shape
         */
        fillStroke: function(shape) {
            var fillEnabled = shape.getFillEnabled();
            if(fillEnabled) {
                this._fill(shape);
            }

            if(shape.getStrokeEnabled()) {
                this._stroke(shape, shape.hasShadow() && shape.hasFill() && fillEnabled);
            }
        },
        /**
         * apply shadow
         * @name applyShadow
         * @methodOf Kinetic.Canvas.prototype
         * @param {Kinetic.Shape} shape
         * @param {Function} drawFunc
         */
        applyShadow: function(shape, drawFunc) {
            var context = this.context;
            context.save();
            this._applyShadow(shape);
            drawFunc();
            context.restore();
            drawFunc();
        },
        _applyLineCap: function(shape) {
            var lineCap = shape.getLineCap();
            if(lineCap) {
                this.context.lineCap = lineCap;
            }
        },
        _applyOpacity: function(shape) {
            var absOpacity = shape.getAbsoluteOpacity();
            if(absOpacity !== 1) {
                this.context.globalAlpha = absOpacity;
            }
        },
        _applyLineJoin: function(shape) {
            var lineJoin = shape.getLineJoin();
            if(lineJoin) {
                this.context.lineJoin = lineJoin;
            }
        },
        _applyAncestorTransforms: function(node) {
            var context = this.context;
            node._eachAncestorReverse(function(no) {
                var t = no.getTransform(), m = t.getMatrix();
                context.transform(m[0], m[1], m[2], m[3], m[4], m[5]);
            }, true);
        }
    };

    Kinetic.SceneCanvas = function(width, height, pixelRatio) {
        Kinetic.Canvas.call(this, width, height, pixelRatio);
    };

    Kinetic.SceneCanvas.prototype = {
        setWidth: function(width) {  
            var pixelRatio = this.pixelRatio;           
            Kinetic.Canvas.prototype.setWidth.call(this, width);
            this.context.scale(pixelRatio, pixelRatio);
        },
        setHeight: function(height) { 
            var pixelRatio = this.pixelRatio; 
            Kinetic.Canvas.prototype.setHeight.call(this, height);
            this.context.scale(pixelRatio, pixelRatio);
        },
        _fillColor: function(shape) {
            var context = this.context, fill = shape.getFill();
            context.fillStyle = fill;
            shape._fillFunc(context);
        },
        _fillPattern: function(shape) {
            var context = this.context, fillPatternImage = shape.getFillPatternImage(), fillPatternX = shape.getFillPatternX(), fillPatternY = shape.getFillPatternY(), fillPatternScale = shape.getFillPatternScale(), fillPatternRotation = shape.getFillPatternRotation(), fillPatternOffset = shape.getFillPatternOffset(), fillPatternRepeat = shape.getFillPatternRepeat();

            if(fillPatternX || fillPatternY) {
                context.translate(fillPatternX || 0, fillPatternY || 0);
            }
            if(fillPatternRotation) {
                context.rotate(fillPatternRotation);
            }
            if(fillPatternScale) {
                context.scale(fillPatternScale.x, fillPatternScale.y);
            }
            if(fillPatternOffset) {
                context.translate(-1 * fillPatternOffset.x, -1 * fillPatternOffset.y);
            }

            context.fillStyle = context.createPattern(fillPatternImage, fillPatternRepeat || 'repeat');
            context.fill();
        },
        _fillLinearGradient: function(shape) {
            var context = this.context, start = shape.getFillLinearGradientStartPoint(), end = shape.getFillLinearGradientEndPoint(), colorStops = shape.getFillLinearGradientColorStops(), grd = context.createLinearGradient(start.x, start.y, end.x, end.y);

            // build color stops
            for(var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            context.fillStyle = grd;
            context.fill();
        },
        _fillRadialGradient: function(shape) {
            var context = this.context, start = shape.getFillRadialGradientStartPoint(), end = shape.getFillRadialGradientEndPoint(), startRadius = shape.getFillRadialGradientStartRadius(), endRadius = shape.getFillRadialGradientEndRadius(), colorStops = shape.getFillRadialGradientColorStops(), grd = context.createRadialGradient(start.x, start.y, startRadius, end.x, end.y, endRadius);

            // build color stops
            for(var n = 0; n < colorStops.length; n += 2) {
                grd.addColorStop(colorStops[n], colorStops[n + 1]);
            }
            context.fillStyle = grd;
            context.fill();
        },
        _fill: function(shape, skipShadow) {
            var context = this.context, fill = shape.getFill(), fillPatternImage = shape.getFillPatternImage(), fillLinearGradientStartPoint = shape.getFillLinearGradientStartPoint(), fillRadialGradientStartPoint = shape.getFillRadialGradientStartPoint(), fillPriority = shape.getFillPriority();

            context.save();

            if(!skipShadow && shape.hasShadow()) {
                this._applyShadow(shape);
            }

            // priority fills
            if(fill && fillPriority === 'color') {
                this._fillColor(shape);
            }
            else if(fillPatternImage && fillPriority === 'pattern') {
                this._fillPattern(shape);
            }
            else if(fillLinearGradientStartPoint && fillPriority === 'linear-gradient') {
                this._fillLinearGradient(shape);
            }
            else if(fillRadialGradientStartPoint && fillPriority === 'radial-gradient') {
                this._fillRadialGradient(shape);
            }
            // now just try and fill with whatever is available
            else if(fill) {
                this._fillColor(shape);
            }
            else if(fillPatternImage) {
                this._fillPattern(shape);
            }
            else if(fillLinearGradientStartPoint) {
                this._fillLinearGradient(shape);
            }
            else if(fillRadialGradientStartPoint) {
                this._fillRadialGradient(shape);
            }
            context.restore();

            if(!skipShadow && shape.hasShadow()) {
                this._fill(shape, true);
            }
        },
        _stroke: function(shape, skipShadow) {
            var context = this.context, stroke = shape.getStroke(), strokeWidth = shape.getStrokeWidth(), dashArray = shape.getDashArray();
            if(stroke || strokeWidth) {
                context.save();
                this._applyLineCap(shape);
                if(dashArray && shape.getDashArrayEnabled()) {
                    if(context.setLineDash) {
                        context.setLineDash(dashArray);
                    }
                    else if('mozDash' in context) {
                        context.mozDash = dashArray;
                    }
                    else if('webkitLineDash' in context) {
                        context.webkitLineDash = dashArray;
                    }
                }
                if(!skipShadow && shape.hasShadow()) {
                    this._applyShadow(shape);
                }
                context.lineWidth = strokeWidth || 2;
                context.strokeStyle = stroke || 'black';
                shape._strokeFunc(context);
                context.restore();

                if(!skipShadow && shape.hasShadow()) {
                    this._stroke(shape, true);
                }
            }
        },
        _applyShadow: function(shape) {
            var context = this.context;
            if(shape.hasShadow() && shape.getShadowEnabled()) {
                var aa = shape.getAbsoluteOpacity();
                // defaults
                var color = shape.getShadowColor() || 'black';
                var blur = shape.getShadowBlur() || 5;
                var offset = shape.getShadowOffset() || {
                    x: 0,
                    y: 0
                };

                if(shape.getShadowOpacity()) {
                    context.globalAlpha = shape.getShadowOpacity() * aa;
                }
                context.shadowColor = color;
                context.shadowBlur = blur;
                context.shadowOffsetX = offset.x;
                context.shadowOffsetY = offset.y;
            }
        }
    };
    Kinetic.Global.extend(Kinetic.SceneCanvas, Kinetic.Canvas);

    Kinetic.HitCanvas = function(width, height, pixelRatio) {
        Kinetic.Canvas.call(this, width, height, pixelRatio);
    };

    Kinetic.HitCanvas.prototype = {
        _fill: function(shape) {
            var context = this.context;
            context.save();
            context.fillStyle = '#' + shape.colorKey;
            shape._fillFuncHit(context);
            context.restore();
        },
        _stroke: function(shape) {
            var context = this.context, stroke = shape.getStroke(), strokeWidth = shape.getStrokeWidth();
            if(stroke || strokeWidth) {
                this._applyLineCap(shape);
                context.save();
                context.lineWidth = strokeWidth || 2;
                context.strokeStyle = '#' + shape.colorKey;
                shape._strokeFuncHit(context);
                context.restore();
            }
        }
    };
    Kinetic.Global.extend(Kinetic.HitCanvas, Kinetic.Canvas);
})();

(function() {
    /*
     * The Tween class was ported from an Adobe Flash Tween library
     * to JavaScript by Xaric.  In the context of KineticJS, a Tween is
     * an animation of a single Node property.  A Transition is a set of
     * multiple tweens
     */
    Kinetic.Tween = function(obj, propFunc, func, begin, finish, duration) {
        this._listeners = [];
        this.addListener(this);
        this.obj = obj;
        this.propFunc = propFunc;
        this.begin = begin;
        this._pos = begin;
        this.setDuration(duration);
        this.isPlaying = false;
        this._change = 0;
        this.prevTime = 0;
        this.prevPos = 0;
        this.looping = false;
        this._time = 0;
        this._position = 0;
        this._startTime = 0;
        this._finish = 0;
        this.name = '';
        this.func = func;
        this.setFinish(finish);
    };
    /*
     * Tween methods
     */
    Kinetic.Tween.prototype = {
        setTime: function(t) {
            this.prevTime = this._time;
            if(t > this.getDuration()) {
                if(this.looping) {
                    this.rewind(t - this._duration);
                    this.update();
                    this.broadcastMessage('onLooped', {
                        target: this,
                        type: 'onLooped'
                    });
                }
                else {
                    this._time = this._duration;
                    this.update();
                    this.stop();
                    this.broadcastMessage('onFinished', {
                        target: this,
                        type: 'onFinished'
                    });
                }
            }
            else if(t < 0) {
                this.rewind();
                this.update();
            }
            else {
                this._time = t;
                this.update();
            }
        },
        getTime: function() {
            return this._time;
        },
        setDuration: function(d) {
            this._duration = (d === null || d <= 0) ? 100000 : d;
        },
        getDuration: function() {
            return this._duration;
        },
        setPosition: function(p) {
            this.prevPos = this._pos;
            this.propFunc(p);
            this._pos = p;
            this.broadcastMessage('onChanged', {
                target: this,
                type: 'onChanged'
            });
        },
        getPosition: function(t) {
            if(t === undefined) {
                t = this._time;
            }
            return this.func(t, this.begin, this._change, this._duration);
        },
        setFinish: function(f) {
            this._change = f - this.begin;
        },
        getFinish: function() {
            return this.begin + this._change;
        },
        start: function() {
            this.rewind();
            this.startEnterFrame();
            this.broadcastMessage('onStarted', {
                target: this,
                type: 'onStarted'
            });
        },
        rewind: function(t) {
            this.stop();
            this._time = (t === undefined) ? 0 : t;
            this.fixTime();
            this.update();
        },
        fforward: function() {
            this._time = this._duration;
            this.fixTime();
            this.update();
        },
        update: function() {
            this.setPosition(this.getPosition(this._time));
        },
        startEnterFrame: function() {
            this.stopEnterFrame();
            this.isPlaying = true;
            this.onEnterFrame();
        },
        onEnterFrame: function() {
            if(this.isPlaying) {
                this.nextFrame();
            }
        },
        nextFrame: function() {
            this.setTime((this.getTimer() - this._startTime) / 1000);
        },
        stop: function() {
            this.stopEnterFrame();
            this.broadcastMessage('onStopped', {
                target: this,
                type: 'onStopped'
            });
        },
        stopEnterFrame: function() {
            this.isPlaying = false;
        },
        continueTo: function(finish, duration) {
            this.begin = this._pos;
            this.setFinish(finish);
            if(this._duration !== undefined) {
                this.setDuration(duration);
            }
            this.start();
        },
        resume: function() {
            this.fixTime();
            this.startEnterFrame();
            this.broadcastMessage('onResumed', {
                target: this,
                type: 'onResumed'
            });
        },
        yoyo: function() {
            this.continueTo(this.begin, this._time);
        },
        addListener: function(o) {
            this.removeListener(o);
            return this._listeners.push(o);
        },
        removeListener: function(o) {
            var a = this._listeners;
            var i = a.length;
            while(i--) {
                if(a[i] == o) {
                    a.splice(i, 1);
                    return true;
                }
            }
            return false;
        },
        broadcastMessage: function() {
            var arr = [];
            for(var i = 0; i < arguments.length; i++) {
                arr.push(arguments[i]);
            }
            var e = arr.shift();
            var a = this._listeners;
            var l = a.length;
            for(var i = 0; i < l; i++) {
                if(a[i][e]) {
                    a[i][e].apply(a[i], arr);
                }
            }
        },
        fixTime: function() {
            this._startTime = this.getTimer() - this._time * 1000;
        },
        getTimer: function() {
            return new Date().getTime() - this._time;
        }
    };

    Kinetic.Tweens = {
        'back-ease-in': function(t, b, c, d, a, p) {
            var s = 1.70158;
            return c * (t /= d) * t * ((s + 1) * t - s) + b;
        },
        'back-ease-out': function(t, b, c, d, a, p) {
            var s = 1.70158;
            return c * (( t = t / d - 1) * t * ((s + 1) * t + s) + 1) + b;
        },
        'back-ease-in-out': function(t, b, c, d, a, p) {
            var s = 1.70158;
            if((t /= d / 2) < 1) {
                return c / 2 * (t * t * (((s *= (1.525)) + 1) * t - s)) + b;
            }
            return c / 2 * ((t -= 2) * t * (((s *= (1.525)) + 1) * t + s) + 2) + b;
        },
        'elastic-ease-in': function(t, b, c, d, a, p) {
            // added s = 0
            var s = 0;
            if(t === 0) {
                return b;
            }
            if((t /= d) == 1) {
                return b + c;
            }
            if(!p) {
                p = d * 0.3;
            }
            if(!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return -(a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
        },
        'elastic-ease-out': function(t, b, c, d, a, p) {
            // added s = 0
            var s = 0;
            if(t === 0) {
                return b;
            }
            if((t /= d) == 1) {
                return b + c;
            }
            if(!p) {
                p = d * 0.3;
            }
            if(!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            return (a * Math.pow(2, -10 * t) * Math.sin((t * d - s) * (2 * Math.PI) / p) + c + b);
        },
        'elastic-ease-in-out': function(t, b, c, d, a, p) {
            // added s = 0
            var s = 0;
            if(t === 0) {
                return b;
            }
            if((t /= d / 2) == 2) {
                return b + c;
            }
            if(!p) {
                p = d * (0.3 * 1.5);
            }
            if(!a || a < Math.abs(c)) {
                a = c;
                s = p / 4;
            }
            else {
                s = p / (2 * Math.PI) * Math.asin(c / a);
            }
            if(t < 1) {
                return -0.5 * (a * Math.pow(2, 10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p)) + b;
            }
            return a * Math.pow(2, -10 * (t -= 1)) * Math.sin((t * d - s) * (2 * Math.PI) / p) * 0.5 + c + b;
        },
        'bounce-ease-out': function(t, b, c, d) {
            if((t /= d) < (1 / 2.75)) {
                return c * (7.5625 * t * t) + b;
            }
            else if(t < (2 / 2.75)) {
                return c * (7.5625 * (t -= (1.5 / 2.75)) * t + 0.75) + b;
            }
            else if(t < (2.5 / 2.75)) {
                return c * (7.5625 * (t -= (2.25 / 2.75)) * t + 0.9375) + b;
            }
            else {
                return c * (7.5625 * (t -= (2.625 / 2.75)) * t + 0.984375) + b;
            }
        },
        'bounce-ease-in': function(t, b, c, d) {
            return c - Kinetic.Tweens['bounce-ease-out'](d - t, 0, c, d) + b;
        },
        'bounce-ease-in-out': function(t, b, c, d) {
            if(t < d / 2) {
                return Kinetic.Tweens['bounce-ease-in'](t * 2, 0, c, d) * 0.5 + b;
            }
            else {
                return Kinetic.Tweens['bounce-ease-out'](t * 2 - d, 0, c, d) * 0.5 + c * 0.5 + b;
            }
        },
        // duplicate
        /*
         strongEaseInOut: function(t, b, c, d) {
         return c * (t /= d) * t * t * t * t + b;
         },
         */
        'ease-in': function(t, b, c, d) {
            return c * (t /= d) * t + b;
        },
        'ease-out': function(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        },
        'ease-in-out': function(t, b, c, d) {
            if((t /= d / 2) < 1) {
                return c / 2 * t * t + b;
            }
            return -c / 2 * ((--t) * (t - 2) - 1) + b;
        },
        'strong-ease-in': function(t, b, c, d) {
            return c * (t /= d) * t * t * t * t + b;
        },
        'strong-ease-out': function(t, b, c, d) {
            return c * (( t = t / d - 1) * t * t * t * t + 1) + b;
        },
        'strong-ease-in-out': function(t, b, c, d) {
            if((t /= d / 2) < 1) {
                return c / 2 * t * t * t * t * t + b;
            }
            return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
        },
        'linear': function(t, b, c, d) {
            return c * t / d + b;
        }
    };
})();

(function() {
    /*
    * Last updated November 2011
    * By Simon Sarris
    * www.simonsarris.com
    * sarris@acm.org
    *
    * Free to use and distribute at will
    * So long as you are nice to people, etc
    */

    /*
    * The usage of this class was inspired by some of the work done by a forked
    * project, KineticJS-Ext by Wappworks, which is based on Simon's Transform
    * class.
    */

    /**
     * Transform constructor
     * @constructor
     */
    Kinetic.Transform = function() {
        this.m = [1, 0, 0, 1, 0, 0];
    }

    Kinetic.Transform.prototype = {
        /**
         * Apply translation
         * @param {Number} x
         * @param {Number} y
         */
        translate: function(x, y) {
            this.m[4] += this.m[0] * x + this.m[2] * y;
            this.m[5] += this.m[1] * x + this.m[3] * y;
        },
        /**
         * Apply scale
         * @param {Number} sx
         * @param {Number} sy
         */
        scale: function(sx, sy) {
            this.m[0] *= sx;
            this.m[1] *= sx;
            this.m[2] *= sy;
            this.m[3] *= sy;
        },
        /**
         * Apply rotation
         * @param {Number} rad  Angle in radians
         */
        rotate: function(rad) {
            var c = Math.cos(rad);
            var s = Math.sin(rad);
            var m11 = this.m[0] * c + this.m[2] * s;
            var m12 = this.m[1] * c + this.m[3] * s;
            var m21 = this.m[0] * -s + this.m[2] * c;
            var m22 = this.m[1] * -s + this.m[3] * c;
            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
        },
        /**
         * Returns the translation
         * @returns {Object} 2D point(x, y)
         */
        getTranslation: function() {
            return {
                x: this.m[4],
                y: this.m[5]
            };
        },
        /**
         * Transform multiplication
         * @param {Kinetic.Transform} matrix
         */
        multiply: function(matrix) {
            var m11 = this.m[0] * matrix.m[0] + this.m[2] * matrix.m[1];
            var m12 = this.m[1] * matrix.m[0] + this.m[3] * matrix.m[1];

            var m21 = this.m[0] * matrix.m[2] + this.m[2] * matrix.m[3];
            var m22 = this.m[1] * matrix.m[2] + this.m[3] * matrix.m[3];

            var dx = this.m[0] * matrix.m[4] + this.m[2] * matrix.m[5] + this.m[4];
            var dy = this.m[1] * matrix.m[4] + this.m[3] * matrix.m[5] + this.m[5];

            this.m[0] = m11;
            this.m[1] = m12;
            this.m[2] = m21;
            this.m[3] = m22;
            this.m[4] = dx;
            this.m[5] = dy;
        },
        /**
         * Invert the matrix
         */
        invert: function() {
            var d = 1 / (this.m[0] * this.m[3] - this.m[1] * this.m[2]);
            var m0 = this.m[3] * d;
            var m1 = -this.m[1] * d;
            var m2 = -this.m[2] * d;
            var m3 = this.m[0] * d;
            var m4 = d * (this.m[2] * this.m[5] - this.m[3] * this.m[4]);
            var m5 = d * (this.m[1] * this.m[4] - this.m[0] * this.m[5]);
            this.m[0] = m0;
            this.m[1] = m1;
            this.m[2] = m2;
            this.m[3] = m3;
            this.m[4] = m4;
            this.m[5] = m5;
        },
        /**
         * return matrix
         */
        getMatrix: function() {
            return this.m;
        }
    };
})();

(function() {
    /**
     * Collection constructor.  Collection extends
     *  Array.  This class is used in conjunction with get()
     * @constructor
     */
    Kinetic.Collection = function() {
        var args = [].slice.call(arguments), length = args.length, i = 0;

        this.length = length;
        for(; i < length; i++) {
            this[i] = args[i];
        }
        return this;
    }
    Kinetic.Collection.prototype = new Array();
    /**
     * apply a method to all nodes in the array
     * @name apply
     * @methodOf Kinetic.Collection.prototype
     * @param {String} method
     * @param val
     */
    Kinetic.Collection.prototype.apply = function(method) {
        args = [].slice.call(arguments);
        args.shift();
        for(var n = 0; n < this.length; n++) {
            if(Kinetic.Type._isFunction(this[n][method])) {
                this[n][method].apply(this[n], args);
            }
        }
    };
    /**
     * iterate through node array
     * @name each
     * @methodOf Kinetic.Collection.prototype
     * @param {Function} func
     */
    Kinetic.Collection.prototype.each = function(func) {
        for(var n = 0; n < this.length; n++) {
            func.call(this[n], n, this[n]);
        }
    };
})();

(function() {
    /**
     * Grayscale Filter
     * @function
     * @memberOf Kinetic.Filters
     * @param {Object} imageData
     * @param {Object} config
     */
    Kinetic.Filters.Grayscale = function(imageData, config) {
        var data = imageData.data;
        for(var i = 0; i < data.length; i += 4) {
            var brightness = 0.34 * data[i] + 0.5 * data[i + 1] + 0.16 * data[i + 2];
            // red
            data[i] = brightness;
            // green
            data[i + 1] = brightness;
            // blue
            data[i + 2] = brightness;
        }
    };
})();

(function() {
    /**
     * Brighten Filter
     * @function
     * @memberOf Kinetic.Filters
     * @param {Object} imageData
     * @param {Object} config
     * @param {Integer} config.val brightness number from -255 to 255.&nbsp; Positive values increase the brightness and negative values decrease the brightness, making the image darker
     */
    Kinetic.Filters.Brighten = function(imageData, config) {
        var brightness = config.val || 0;
        var data = imageData.data;
        for(var i = 0; i < data.length; i += 4) {
            // red
            data[i] += brightness;
            // green
            data[i + 1] += brightness;
            // blue
            data[i + 2] += brightness;
        }
    };
})();

(function() {
    /**
     * Invert Filter
     * @function
     * @memberOf Kinetic.Filters
     * @param {Object} imageData
     * @param {Object} config
     */
    Kinetic.Filters.Invert = function(imageData, config) {
        var data = imageData.data;
        for(var i = 0; i < data.length; i += 4) {
            // red
            data[i] = 255 - data[i];
            // green
            data[i + 1] = 255 - data[i + 1];
            // blue
            data[i + 2] = 255 - data[i + 2];
        }
    };
})();

(function() {
    /**
     * Node constructor. Nodes are entities that can be transformed, layered,
     * and have bound events. The stage, layers, groups, and shapes all extend Node.
     * @constructor
     * @param {Object} config
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Node = function(config) {
        this._nodeInit(config);
    };

    Kinetic.Node.prototype = {
        _nodeInit: function(config) {
            this._id = Kinetic.Global.idCounter++;

            this.defaultNodeAttrs = {
                visible: true,
                listening: true,
                name: undefined,
                opacity: 1,
                x: 0,
                y: 0,
                scale: {
                    x: 1,
                    y: 1
                },
                rotation: 0,
                offset: {
                    x: 0,
                    y: 0
                },
                draggable: false,
                dragOnTop: true
            };

            this.setDefaultAttrs(this.defaultNodeAttrs);
            this.eventListeners = {};
            this.setAttrs(config);
        },
        /**
         * bind events to the node. KineticJS supports mouseover, mousemove,
         *  mouseout, mouseenter, mouseleave, mousedown, mouseup, click, dblclick, touchstart, touchmove,
         *  touchend, tap, dbltap, dragstart, dragmove, and dragend events. Pass in a string
         *  of events delimmited by a space to bind multiple events at once
         *  such as 'mousedown mouseup mousemove'. Include a namespace to bind an
         *  event by name such as 'click.foobar'.
         * @name on
         * @methodOf Kinetic.Node.prototype
         * @param {String} typesStr e.g. 'click', 'mousedown touchstart', 'mousedown.foo touchstart.foo'
         * @param {Function} handler The handler function is passed an event object
         */
        on: function(typesStr, handler) {
            var types = typesStr.split(' ');
            /*
             * loop through types and attach event listeners to
             * each one.  eg. 'click mouseover.namespace mouseout'
             * will create three event bindings
             */
            var len = types.length;
            for(var n = 0; n < len; n++) {
                var type = types[n];
                var event = type;
                var parts = event.split('.');
                var baseEvent = parts[0];
                var name = parts.length > 1 ? parts[1] : '';

                if(!this.eventListeners[baseEvent]) {
                    this.eventListeners[baseEvent] = [];
                }

                this.eventListeners[baseEvent].push({
                    name: name,
                    handler: handler
                });
            }
        },
        /**
         * remove event bindings from the node. Pass in a string of
         *  event types delimmited by a space to remove multiple event
         *  bindings at once such as 'mousedown mouseup mousemove'.
         *  include a namespace to remove an event binding by name
         *  such as 'click.foobar'. If you only give a name like '.foobar',
         *  all events in that namespace will be removed.
         * @name off
         * @methodOf Kinetic.Node.prototype
         * @param {String} typesStr e.g. 'click', 'mousedown touchstart', '.foobar'
         */
        off: function(typesStr) {
            var types = typesStr.split(' ');
            var len = types.length;
            for(var n = 0; n < len; n++) {
                var type = types[n];
                //var event = (type.indexOf('touch') === -1) ? 'on' + type : type;
                var event = type;
                var parts = event.split('.');
                var baseEvent = parts[0];

                if(parts.length > 1) {
                    if(baseEvent) {
                        if(this.eventListeners[baseEvent]) {
                            this._off(baseEvent, parts[1]);
                        }
                    }
                    else {
                        for(var type in this.eventListeners) {
                            this._off(type, parts[1]);
                        }
                    }
                }
                else {
                    delete this.eventListeners[baseEvent];
                }
            }
        },
        /**
         * remove child from container, but don't destroy it
         * @name remove
         * @methodOf Kinetic.Node.prototype
         */
        remove: function() {
            var parent = this.getParent();
            if(parent && parent.children) {
                parent.children.splice(this.index, 1);
                parent._setChildrenIndices();
            }
            delete this.parent;
        },
        /**
         * remove and destroy node
         * @name destroy
         * @methodOf Kinetic.Node.prototype
         */
        destroy: function() {
            var parent = this.getParent(), stage = this.getStage(), dd = Kinetic.DD, go = Kinetic.Global;

            // destroy children
            while(this.children && this.children.length > 0) {
                this.children[0].destroy();
            }

            // remove from ids and names hashes
            go._removeId(this.getId());
            go._removeName(this.getName(), this._id);

            // stop DD
            if(dd && dd.node && dd.node._id === this._id) {
                node._endDrag();
            }

            // stop transition
            if(this.trans) {
                this.trans.stop();
            }

            this.remove();
        },
        /**
         * get attrs
         * @name getAttrs
         * @methodOf Kinetic.Node.prototype
         */
        getAttrs: function() {
            return this.attrs;
        },
        /**
         * set default attrs.  This method should only be used if
         *  you're creating a custom node
         * @name setDefaultAttrs
         * @methodOf Kinetic.Node.prototype
         * @param {Object} confic
         */
        setDefaultAttrs: function(config) {
            // create attrs object if undefined
            if(this.attrs === undefined) {
                this.attrs = {};
            }

            if(config) {
                for(var key in config) {
                    /*
                     * only set the attr if it's undefined in case
                     * a developer writes a custom class that extends
                     * a Kinetic Class such that their default property
                     * isn't overwritten by the Kinetic Class default
                     * property
                     */
                    if(this.attrs[key] === undefined) {
                        this.attrs[key] = config[key];
                    }
                }
            }
        },
        /**
         * set attrs
         * @name setAttrs
         * @methodOf Kinetic.Node.prototype
         * @param {Object} config object containing key value pairs
         */
        setAttrs: function(config) {
            if(config) {
                for(var key in config) {
                    var method = 'set' + key.charAt(0).toUpperCase() + key.slice(1);
                    // use setter if available
                    if(Kinetic.Type._isFunction(this[method])) {
                        this[method](config[key]);
                    }
                    // otherwise set directly
                    else {
                        this.setAttr(key, config[key]);
                    }
                }
            }
        },
        /**
         * determine if node is visible or not.  Node is visible only
         *  if it's visible and all of its ancestors are visible.  If an ancestor
         *  is invisible, this means that the node is also invisible
         * @name getVisible
         * @methodOf Kinetic.Node.prototype
         */
        getVisible: function() {
            var visible = this.attrs.visible, parent = this.getParent();
            if(visible && parent && !parent.getVisible()) {
                return false;
            }
            return visible;
        },
        /**
         * determine if node is listening or not.  Node is listening only
         *  if it's listening and all of its ancestors are listening.  If an ancestor
         *  is not listening, this means that the node is also not listening
         * @name getListening
         * @methodOf Kinetic.Node.prototype
         */
        getListening: function() {
            var listening = this.attrs.listening, parent = this.getParent();
            if(listening && parent && !parent.getListening()) {
                return false;
            }
            return listening;
        },
        /**
         * show node
         * @name show
         * @methodOf Kinetic.Node.prototype
         */
        show: function() {
            this.setVisible(true);
        },
        /**
         * hide node.  Hidden nodes are no longer detectable
         * @name hide
         * @methodOf Kinetic.Node.prototype
         */
        hide: function() {
            this.setVisible(false);
        },
        /**
         * get zIndex relative to the node's siblings who share the same parent
         * @name getZIndex
         * @methodOf Kinetic.Node.prototype
         */
        getZIndex: function() {
            return this.index;
        },
        /**
         * get absolute z-index which takes into account sibling
         *  and ancestor indices
         * @name getAbsoluteZIndex
         * @methodOf Kinetic.Node.prototype
         */
        getAbsoluteZIndex: function() {
            var level = this.getLevel();
            var stage = this.getStage();
            var that = this;
            var index = 0;
            function addChildren(children) {
                var nodes = [];
                var len = children.length;
                for(var n = 0; n < len; n++) {
                    var child = children[n];
                    index++;

                    if(child.nodeType !== 'Shape') {
                        nodes = nodes.concat(child.getChildren());
                    }

                    if(child._id === that._id) {
                        n = len;
                    }
                }

                if(nodes.length > 0 && nodes[0].getLevel() <= level) {
                    addChildren(nodes);
                }
            }
            if(that.nodeType !== 'Stage') {
                addChildren(that.getStage().getChildren());
            }

            return index;
        },
        /**
         * get node level in node tree.  Returns an integer.<br><br>
         *  e.g. Stage level will always be 0.  Layers will always be 1.  Groups and Shapes will always
         *  be >= 2
         * @name getLevel
         * @methodOf Kinetic.Node.prototype
         */
        getLevel: function() {
            var level = 0;
            var parent = this.parent;
            while(parent) {
                level++;
                parent = parent.parent;
            }
            return level;
        },
        /**
         * set node position relative to parent
         * @name setPosition
         * @methodOf Kinetic.Node.prototype
         * @param {Number} x
         * @param {Number} y
         */
        setPosition: function() {
            var pos = Kinetic.Type._getXY([].slice.call(arguments));
            this.setAttr('x', pos.x);
            this.setAttr('y', pos.y);
        },
        /**
         * get node position relative to parent
         * @name getPosition
         * @methodOf Kinetic.Node.prototype
         */
        getPosition: function() {
            var attrs = this.attrs;
            return {
                x: attrs.x,
                y: attrs.y
            };
        },
        /**
         * get absolute position relative to the top left corner of the stage container div
         * @name getAbsolutePosition
         * @methodOf Kinetic.Node.prototype
         */
        getAbsolutePosition: function() {
            var trans = this.getAbsoluteTransform();
            var o = this.getOffset();
            trans.translate(o.x, o.y);
            return trans.getTranslation();
        },
        /**
         * set absolute position
         * @name setAbsolutePosition
         * @methodOf Kinetic.Node.prototype
         * @param {Number} x
         * @param {Number} y
         */
        setAbsolutePosition: function() {
            var pos = Kinetic.Type._getXY([].slice.call(arguments));
            var trans = this._clearTransform();
            // don't clear translation
            this.attrs.x = trans.x;
            this.attrs.y = trans.y;
            delete trans.x;
            delete trans.y;

            // unravel transform
            var it = this.getAbsoluteTransform();

            it.invert();
            it.translate(pos.x, pos.y);
            pos = {
                x: this.attrs.x + it.getTranslation().x,
                y: this.attrs.y + it.getTranslation().y
            };

            this.setPosition(pos.x, pos.y);
            this._setTransform(trans);
        },
        /**
         * move node by an amount relative to its current position
         * @name move
         * @methodOf Kinetic.Node.prototype
         * @param {Number} x
         * @param {Number} y
         */
        move: function() {
            var pos = Kinetic.Type._getXY([].slice.call(arguments));
            var x = this.getX();
            var y = this.getY();

            if(pos.x !== undefined) {
                x += pos.x;
            }

            if(pos.y !== undefined) {
                y += pos.y;
            }

            this.setPosition(x, y);
        },
        _eachAncestorReverse: function(func, includeSelf) {
            var family = [], parent = this.getParent();

            // build family by traversing ancestors
            if(includeSelf) {
                family.unshift(this);
            }
            while(parent) {
                family.unshift(parent);
                parent = parent.parent;
            }

            var len = family.length;
            for(var n = 0; n < len; n++) {
                func(family[n]);
            }
        },
        /**
         * rotate node by an amount in radians relative to its current rotation
         * @name rotate
         * @methodOf Kinetic.Node.prototype
         * @param {Number} theta
         */
        rotate: function(theta) {
            this.setRotation(this.getRotation() + theta);
        },
        /**
         * rotate node by an amount in degrees relative to its current rotation
         * @name rotateDeg
         * @methodOf Kinetic.Node.prototype
         * @param {Number} deg
         */
        rotateDeg: function(deg) {
            this.setRotation(this.getRotation() + Kinetic.Type._degToRad(deg));
        },
        /**
         * move node to the top of its siblings
         * @name moveToTop
         * @methodOf Kinetic.Node.prototype
         */
        moveToTop: function() {
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.push(this);
            this.parent._setChildrenIndices();
            return true;
        },
        /**
         * move node up
         * @name moveUp
         * @methodOf Kinetic.Node.prototype
         */
        moveUp: function() {
            var index = this.index;
            var len = this.parent.getChildren().length;
            if(index < len - 1) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index + 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
        },
        /**
         * move node down
         * @name moveDown
         * @methodOf Kinetic.Node.prototype
         */
        moveDown: function() {
            var index = this.index;
            if(index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.splice(index - 1, 0, this);
                this.parent._setChildrenIndices();
                return true;
            }
        },
        /**
         * move node to the bottom of its siblings
         * @name moveToBottom
         * @methodOf Kinetic.Node.prototype
         */
        moveToBottom: function() {
            var index = this.index;
            if(index > 0) {
                this.parent.children.splice(index, 1);
                this.parent.children.unshift(this);
                this.parent._setChildrenIndices();
                return true;
            }
        },
        /**
         * set zIndex relative to siblings
         * @name setZIndex
         * @methodOf Kinetic.Node.prototype
         * @param {Integer} zIndex
         */
        setZIndex: function(zIndex) {
            var index = this.index;
            this.parent.children.splice(index, 1);
            this.parent.children.splice(zIndex, 0, this);
            this.parent._setChildrenIndices();
        },
        /**
         * get absolute opacity
         * @name getAbsoluteOpacity
         * @methodOf Kinetic.Node.prototype
         */
        getAbsoluteOpacity: function() {
            var absOpacity = this.getOpacity();
            if(this.getParent()) {
                absOpacity *= this.getParent().getAbsoluteOpacity();
            }
            return absOpacity;
        },
        /**
         * move node to another container
         * @name moveTo
         * @methodOf Kinetic.Node.prototype
         * @param {Container} newContainer
         */
        moveTo: function(newContainer) {
            Kinetic.Node.prototype.remove.call(this);
            newContainer.add(this);
        },
        /**
         * convert Node into an object for serialization.  Returns an object.
         * @name toObject
         * @methodOf Kinetic.Node.prototype
         */
        toObject: function() {
            var type = Kinetic.Type, obj = {}, attrs = this.attrs;

            obj.attrs = {};

            // serialize only attributes that are not function, image, DOM, or objects with methods
            for(var key in attrs) {
                var val = attrs[key];
                if(!type._isFunction(val) && !type._isElement(val) && !(type._isObject(val) && type._hasMethods(val))) {
                    obj.attrs[key] = val;
                }
            }

            obj.nodeType = this.nodeType;
            obj.shapeType = this.shapeType;

            return obj;
        },
        /**
         * convert Node into a JSON string.  Returns a JSON string.
         * @name toJSON
         * @methodOf Kinetic.Node.prototype
         */
        toJSON: function() {
            return JSON.stringify(this.toObject());
        },
        /**
         * get parent container
         * @name getParent
         * @methodOf Kinetic.Node.prototype
         */
        getParent: function() {
            return this.parent;
        },
        /**
         * get layer ancestor
         * @name getLayer
         * @methodOf Kinetic.Node.prototype
         */
        getLayer: function() {
            return this.getParent().getLayer();
        },
        /**
         * get stage ancestor
         * @name getStage
         * @methodOf Kinetic.Node.prototype
         */
        getStage: function() {
            if(this.getParent()) {
                return this.getParent().getStage();
            }
            else {
                return undefined;
            }
        },
        /**
         * simulate event with event bubbling
         * @name simulate
         * @methodOf Kinetic.Node.prototype
         * @param {String} eventType
         * @param {EventObject} evt event object
         */
        simulate: function(eventType, evt) {
            this._handleEvent(eventType, evt || {});
        },
        /**
         * synthetically fire an event. The event object will not bubble up the Node tree. You can also pass in custom properties
         * @name fire
         * @methodOf Kinetic.Node.prototype
         * @param {String} eventType
         * @param {Object} obj optional object which can be used to pass parameters
         */
        fire: function(eventType, obj) {
            this._executeHandlers(eventType, obj || {});
        },
        /**
         * get absolute transform of the node which takes into
         *  account its ancestor transforms
         * @name getAbsoluteTransform
         * @methodOf Kinetic.Node.prototype
         */
        getAbsoluteTransform: function() {
            // absolute transform
            var am = new Kinetic.Transform();

            this._eachAncestorReverse(function(node) {
                var m = node.getTransform();
                am.multiply(m);
            }, true);
            return am;
        },
        /**
         * get transform of the node
         * @name getTransform
         * @methodOf Kinetic.Node.prototype
         */
        getTransform: function() {
            var m = new Kinetic.Transform(), 
                attrs = this.attrs, 
                x = attrs.x, 
                y = attrs.y, 
                rotation = attrs.rotation, 
                scale = attrs.scale, 
                scaleX = scale.x, 
                scaleY = scale.y, 
                offset = attrs.offset, 
                offsetX = offset.x, 
                offsetY = offset.y;
                
            if(x !== 0 || y !== 0) {
                m.translate(x, y);
            }
            if(rotation !== 0) {
                m.rotate(rotation);
            }
            if(scaleX !== 1 || scaleY !== 1) {
                m.scale(scaleX, scaleY);
            }
            if(offsetX !== 0 || offsetY !== 0) {
                m.translate(-1 * offsetX, -1 * offsetY);
            }

            return m;
        },
        /**
         * clone node.  Returns a new Node instance with identical attributes
         * @name clone
         * @methodOf Kinetic.Node.prototype
         * @param {Object} attrs override attrs
         */
        clone: function(obj) {
            // instantiate new node
            var classType = this.shapeType || this.nodeType;
            var node = new Kinetic[classType](this.attrs);

            // copy over user listeners
            for(var key in this.eventListeners) {
                var allListeners = this.eventListeners[key];
                var len = allListeners.length;
                for(var n = 0; n < len; n++) {
                    var listener = allListeners[n];
                    /*
                     * don't include kinetic namespaced listeners because
                     *  these are generated by the constructors
                     */
                    if(listener.name.indexOf('kinetic') < 0) {
                        // if listeners array doesn't exist, then create it
                        if(!node.eventListeners[key]) {
                            node.eventListeners[key] = [];
                        }
                        node.eventListeners[key].push(listener);
                    }
                }
            }

            // apply attr overrides
            node.setAttrs(obj);
            return node;
        },
        /**
         * Creates a composite data URL. If MIME type is not
         * specified, then "image/png" will result. For "image/jpeg", specify a quality
         * level as quality (range 0.0 - 1.0)
         * @name toDataURL
         * @methodOf Kinetic.Node.prototype
         * @param {Object} config
         * @param {Function} config.callback function executed when the composite has completed
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         */
        toDataURL: function(config) {
            config = config || {};
            var mimeType = config.mimeType || null, quality = config.quality || null, canvas, context, x = config.x || 0, y = config.y || 0;

            //if width and height are defined, create new canvas to draw on, else reuse stage buffer canvas
            if(config.width && config.height) {
                canvas = new Kinetic.SceneCanvas(config.width, config.height, 1);
            }
            else {
                canvas = this.getStage().bufferCanvas;
                canvas.clear();
            }
            context = canvas.getContext();
            context.save();

            if(x || y) {
                context.translate(-1 * x, -1 * y);
            }
            this.drawScene(canvas);
            context.restore();

            return canvas.toDataURL(mimeType, quality);
        },
        /**
         * converts node into an image.  Since the toImage
         *  method is asynchronous, a callback is required.  toImage is most commonly used
         *  to cache complex drawings as an image so that they don't have to constantly be redrawn
         * @name toImage
         * @methodOf Kinetic.Node.prototype
         * @param {Object} config
         * @param {Function} config.callback function executed when the composite has completed
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         */
        toImage: function(config) {
            Kinetic.Type._getImage(this.toDataURL(config), function(img) {
                config.callback(img);
            });
        },
        /**
         * set size
         * @name setSize
         * @methodOf Kinetic.Node.prototype
         * @param {Number} width
         * @param {Number} height
         */
        setSize: function() {
            // set stage dimensions
            var size = Kinetic.Type._getSize(Array.prototype.slice.call(arguments));
            this.setWidth(size.width);
            this.setHeight(size.height);
        },
        /**
         * get size
         * @name getSize
         * @methodOf Kinetic.Node.prototype
         */
        getSize: function() {
            return {
                width: this.getWidth(),
                height: this.getHeight()
            };
        },
        /**
         * get width
         * @name getWidth
         * @methodOf Kinetic.Node.prototype
         */
        getWidth: function() {
            return this.attrs.width || 0;
        },
        /**
         * get height
         * @name getHeight
         * @methodOf Kinetic.Node.prototype
         */
        getHeight: function() {
            return this.attrs.height || 0;
        },
        _get: function(selector) {
            return this.nodeType === selector ? [this] : [];
        },
        _off: function(type, name) {
            for(var i = 0; i < this.eventListeners[type].length; i++) {
                if(this.eventListeners[type][i].name === name) {
                    this.eventListeners[type].splice(i, 1);
                    if(this.eventListeners[type].length === 0) {
                        delete this.eventListeners[type];
                        break;
                    }
                    i--;
                }
            }
        },
        _clearTransform: function() {
            var attrs = this.attrs, 
              scale = attrs.scale, 
              offset = attrs.offset,
              trans = {
                  x: attrs.x,
                  y: attrs.y,
                  rotation: attrs.rotation,
                  scale: {
                      x: scale.x,
                      y: scale.y
                  },
                  offset: {
                      x: offset.x,
                      y: offset.y
                  }
              };

            this.attrs.x = 0;
            this.attrs.y = 0;
            this.attrs.rotation = 0;
            this.attrs.scale = {
                x: 1,
                y: 1
            };
            this.attrs.offset = {
                x: 0,
                y: 0
            };

            return trans;
        },
        _setTransform: function(trans) {
            for(var key in trans) {
                this.attrs[key] = trans[key];
            }
        },
        _fireBeforeChangeEvent: function(attr, oldVal, newVal) {
            this._handleEvent('before' + attr.toUpperCase() + 'Change', {
                oldVal: oldVal,
                newVal: newVal
            });
        },
        _fireChangeEvent: function(attr, oldVal, newVal) {
            this._handleEvent(attr + 'Change', {
                oldVal: oldVal,
                newVal: newVal
            });
        },
        /**
         * set id
         * @name setId
         * @methodOf Kinetic.Node.prototype
         * @param {String} id
         */
        setId: function(id) {
            var oldId = this.getId(), stage = this.getStage(), go = Kinetic.Global;
            go._removeId(oldId);
            go._addId(this, id);
            this.setAttr('id', id);
        },
        /**
         * set name
         * @name setName
         * @methodOf Kinetic.Node.prototype
         * @param {String} name
         */
        setName: function(name) {
            var oldName = this.getName(), stage = this.getStage(), go = Kinetic.Global;
            go._removeName(oldName, this._id);
            go._addName(this, name);
            this.setAttr('name', name);
        },
        setAttr: function(key, val) {
            if(val !== undefined) {
                var oldVal = this.attrs[key];
                this._fireBeforeChangeEvent(key, oldVal, val);
                this.attrs[key] = val;
                this._fireChangeEvent(key, oldVal, val);
            }
        },
        _handleEvent: function(eventType, evt, compareShape) {
            if(evt && this.nodeType === 'Shape') {
                evt.shape = this;
            }
            var stage = this.getStage();
            var el = this.eventListeners;
            var okayToRun = true;

            if(eventType === 'mouseenter' && compareShape && this._id === compareShape._id) {
                okayToRun = false;
            }
            else if(eventType === 'mouseleave' && compareShape && this._id === compareShape._id) {
                okayToRun = false;
            }

            if(okayToRun) {
                if(el[eventType]) {
                    this.fire(eventType, evt);
                }

                // simulate event bubbling
                if(evt && !evt.cancelBubble && this.parent) {
                    if(compareShape && compareShape.parent) {
                        this._handleEvent.call(this.parent, eventType, evt, compareShape.parent);
                    }
                    else {
                        this._handleEvent.call(this.parent, eventType, evt);
                    }
                }
            }
        },
        _executeHandlers: function(eventType, evt) {
            var events = this.eventListeners[eventType];
            var len = events.length;
            for(var i = 0; i < len; i++) {
                events[i].handler.apply(this, [evt]);
            }
        }
    };

    // add getter and setter methods
    Kinetic.Node.addSetters = function(constructor, arr) {
        var len = arr.length;
        for(var n = 0; n < len; n++) {
            var attr = arr[n];
            this._addSetter(constructor, attr);
        }
    };
    Kinetic.Node.addPointSetters = function(constructor, arr) {
        var len = arr.length;
        for(var n = 0; n < len; n++) {
            var attr = arr[n];
            this._addPointSetter(constructor, attr);
        }
    };
    Kinetic.Node.addRotationSetters = function(constructor, arr) {
        var len = arr.length;
        for(var n = 0; n < len; n++) {
            var attr = arr[n];
            this._addRotationSetter(constructor, attr);
        }
    };
    Kinetic.Node.addGetters = function(constructor, arr) {
        var len = arr.length;
        for(var n = 0; n < len; n++) {
            var attr = arr[n];
            this._addGetter(constructor, attr);
        }
    };
    Kinetic.Node.addRotationGetters = function(constructor, arr) {
        var len = arr.length;
        for(var n = 0; n < len; n++) {
            var attr = arr[n];
            this._addRotationGetter(constructor, attr);
        }
    };
    Kinetic.Node.addGettersSetters = function(constructor, arr) {
        this.addSetters(constructor, arr);
        this.addGetters(constructor, arr);
    };
    Kinetic.Node.addPointGettersSetters = function(constructor, arr) {
        this.addPointSetters(constructor, arr);
        this.addGetters(constructor, arr);
    };
    Kinetic.Node.addRotationGettersSetters = function(constructor, arr) {
        this.addRotationSetters(constructor, arr);
        this.addRotationGetters(constructor, arr);
    };
    Kinetic.Node._addSetter = function(constructor, attr) {
        var that = this;
        var method = 'set' + attr.charAt(0).toUpperCase() + attr.slice(1);
        constructor.prototype[method] = function(val) {
            this.setAttr(attr, val);
        };
    };
    Kinetic.Node._addPointSetter = function(constructor, attr) {
        var that = this;
        var method = 'set' + attr.charAt(0).toUpperCase() + attr.slice(1);
        constructor.prototype[method] = function() {
            var pos = Kinetic.Type._getXY([].slice.call(arguments));
            if(pos && pos.x === undefined) {
                pos.x = this.attrs[attr].x;
            }
            if(pos && pos.y === undefined) {
                pos.y = this.attrs[attr].y;
            }
            this.setAttr(attr, pos);
        };
    };
    Kinetic.Node._addRotationSetter = function(constructor, attr) {
        var that = this;
        var method = 'set' + attr.charAt(0).toUpperCase() + attr.slice(1);
        // radians
        constructor.prototype[method] = function(val) {
            this.setAttr(attr, val);
        };
        // degrees
        constructor.prototype[method + 'Deg'] = function(deg) {
            this.setAttr(attr, Kinetic.Type._degToRad(deg));
        };
    };
    Kinetic.Node._addGetter = function(constructor, attr) {
        var that = this;
        var method = 'get' + attr.charAt(0).toUpperCase() + attr.slice(1);
        constructor.prototype[method] = function(arg) {
            return this.attrs[attr];
        };
    };
    Kinetic.Node._addRotationGetter = function(constructor, attr) {
        var that = this;
        var method = 'get' + attr.charAt(0).toUpperCase() + attr.slice(1);
        // radians
        constructor.prototype[method] = function() {
            return this.attrs[attr];
        };
        // degrees
        constructor.prototype[method + 'Deg'] = function() {
            return Kinetic.Type._radToDeg(this.attrs[attr])
        };
    };
    /**
     * create node with JSON string.  De-serializtion does not generate custom
     *  shape drawing functions, images, or event handlers (this would make the
     *  serialized object huge).  If your app uses custom shapes, images, and
     *  event handlers (it probably does), then you need to select the appropriate
     *  shapes after loading the stage and set these properties via on(), setDrawFunc(),
     *  and setImage() methods
     * @name create
     * @methodOf Kinetic.Node
     * @param {String} JSON string
     * @param {DomElement} [container] optional container dom element used only if you're
     *  creating a stage node
     */
    Kinetic.Node.create = function(json, container) {
        return this._createNode(JSON.parse(json), container);
    };
    Kinetic.Node._createNode = function(obj, container) {
        var type;

        // determine type
        if(obj.nodeType === 'Shape') {
            // add custom shape
            if(obj.shapeType === undefined) {
                type = 'Shape';
            }
            // add standard shape
            else {
                type = obj.shapeType;
            }
        }
        else {
            type = obj.nodeType;
        }

        // if container was passed in, add it to attrs
        if(container) {
            obj.attrs.container = container;
        }

        var no = new Kinetic[type](obj.attrs);
        if(obj.children) {
            var len = obj.children.length;
            for(var n = 0; n < len; n++) {
                no.add(this._createNode(obj.children[n]));
            }
        }

        return no;
    };
    // add getters setters
    Kinetic.Node.addGettersSetters(Kinetic.Node, ['x', 'y', 'opacity']);

    /**
     * set x position
     * @name setX
     * @methodOf Kinetic.Node.prototype
     * @param {Number} x
     */

    /**
     * set y position
     * @name setY
     * @methodOf Kinetic.Node.prototype
     * @param {Number} y
     */

    /**
     * set opacity.  Opacity values range from 0 to 1.
     *  A node with an opacity of 0 is fully transparent, and a node
     *  with an opacity of 1 is fully opaque
     * @name setOpacity
     * @methodOf Kinetic.Node.prototype
     * @param {Object} opacity
     */

    /**
     * get x position
     * @name getX
     * @methodOf Kinetic.Node.prototype
     */

    /**
     * get y position
     * @name getY
     * @methodOf Kinetic.Node.prototype
     */

    /**
     * get opacity.
     * @name getOpacity
     * @methodOf Kinetic.Node.prototype
     */

    Kinetic.Node.addGetters(Kinetic.Node, ['name', 'id']);

    /**
     * get name
     * @name getName
     * @methodOf Kinetic.Node.prototype
     */

    /**
     * get id
     * @name getId
     * @methodOf Kinetic.Node.prototype
     */

    Kinetic.Node.addRotationGettersSetters(Kinetic.Node, ['rotation']);

    /**
     * set rotation in radians
     * @name setRotation
     * @methodOf Kinetic.Node.prototype
     * @param {Number} theta
     */

    /**
     * set rotation in degrees
     * @name setRotationDeg
     * @methodOf Kinetic.Node.prototype
     * @param {Number} deg
     */

    /**
     * get rotation in degrees
     * @name getRotationDeg
     * @methodOf Kinetic.Node.prototype
     */

    /**
     * get rotation in radians
     * @name getRotation
     * @methodOf Kinetic.Node.prototype
     */

    Kinetic.Node.addPointGettersSetters(Kinetic.Node, ['scale', 'offset']);

    /**
     * set scale
     * @name setScale
     * @param {Number} x
     * @param {Number} y
     * @methodOf Kinetic.Node.prototype
     */

    /**
     * set offset.  A node's offset defines the position and rotation point
     * @name setOffset
     * @methodOf Kinetic.Node.prototype
     * @param {Number} x
     * @param {Number} y
     */

    /**
     * get scale
     * @name getScale
     * @methodOf Kinetic.Node.prototype
     */

    /**
     * get offset
     * @name getOffset
     * @methodOf Kinetic.Node.prototype
     */

    Kinetic.Node.addSetters(Kinetic.Node, ['width', 'height', 'listening', 'visible']);

    /**
     * set width
     * @name setWidth
     * @methodOf Kinetic.Node.prototype
     * @param {Number} width
     */

    /**
     * set height
     * @name setHeight
     * @methodOf Kinetic.Node.prototype
     * @param {Number} height
     */

    /**
     * listen or don't listen to events
     * @name setListening
     * @methodOf Kinetic.Node.prototype
     * @param {Boolean} listening
     */

    /**
     * set visible
     * @name setVisible
     * @methodOf Kinetic.Node.prototype
     * @param {Boolean} visible
     */

    // aliases
    /**
     * Alias of getListening()
     * @name isListening
     * @methodOf Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.isListening = Kinetic.Node.prototype.getListening;
    /**
     * Alias of getVisible()
     * @name isVisible
     * @methodOf Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.isVisible = Kinetic.Node.prototype.getVisible;

    // collection mappings
    var collectionMappings = ['on', 'off'];
    for(var n = 0; n < 2; n++) {
        // induce scope
        (function(i) {
            var method = collectionMappings[i];
            Kinetic.Collection.prototype[method] = function() {
                var args = [].slice.call(arguments);
                args.unshift(method);
                this.apply.apply(this, args);
            };
        })(n);
    }
})();

(function() {
    /**
     * Stage constructor.  A stage is used to contain multiple layers and handle
     * animations
     * @constructor
     * @param {Function} func function executed on each animation frame
     * @param {Kinetic.Node} [node] node to be redrawn.&nbsp; Can be a layer or the stage.  Not specifying a node will result in no redraw.
     */
    Kinetic.Animation = function(func, node) {
        this.func = func;
        this.node = node;
        this.id = Kinetic.Animation.animIdCounter++;
        this.frame = {
            time: 0,
            timeDiff: 0,
            lastTime: new Date().getTime()
        };
    };
    /*
     * Animation methods
     */
    Kinetic.Animation.prototype = {
        /**
         * determine if animation is running or not.  returns true or false
         * @name isRunning
         * @methodOf Kinetic.Animation.prototype
         */
        isRunning: function() {
            var a = Kinetic.Animation, animations = a.animations;
            for(var n = 0; n < animations.length; n++) {
                if(animations[n].id === this.id) {
                    return true;
                }
            }
            return false;
        },
        /**
         * start animation
         * @name start
         * @methodOf Kinetic.Animation.prototype
         */
        start: function() {
            this.stop();
            this.frame.timeDiff = 0;
            this.frame.lastTime = new Date().getTime();
            Kinetic.Animation._addAnimation(this);
        },
        /**
         * stop animation
         * @name stop
         * @methodOf Kinetic.Animation.prototype
         */
        stop: function() {
            Kinetic.Animation._removeAnimation(this);
        },
        _updateFrameObject: function(time) {
            this.frame.timeDiff = time - this.frame.lastTime;
            this.frame.lastTime = time;
            this.frame.time += this.frame.timeDiff;
            this.frame.frameRate = 1000 / this.frame.timeDiff;
        }
    };
    Kinetic.Animation.animations = [];
    Kinetic.Animation.animIdCounter = 0;
    Kinetic.Animation.animRunning = false;

    Kinetic.Animation.fixedRequestAnimFrame = function(callback) {
        window.setTimeout(callback, 1000 / 60);
    };

    Kinetic.Animation._addAnimation = function(anim) {
        this.animations.push(anim);
        this._handleAnimation();
    };
    Kinetic.Animation._removeAnimation = function(anim) {
        var id = anim.id, animations = this.animations, len = animations.length;
        for(var n = 0; n < len; n++) {
            if(animations[n].id === id) {
                this.animations.splice(n, 1);
                break;
            }
        }
    };

    Kinetic.Animation._runFrames = function() {
        var nodes = {}, animations = this.animations;
        /*
         * loop through all animations and execute animation
         *  function.  if the animation object has specified node,
         *  we can add the node to the nodes hash to eliminate
         *  drawing the same node multiple times.  The node property
         *  can be the stage itself or a layer
         */
        /*
         * WARNING: don't cache animations.length because it could change while
         * the for loop is running, causing a JS error
         */
        for(var n = 0; n < animations.length; n++) {
            var anim = animations[n], node = anim.node, func = anim.func;
            anim._updateFrameObject(new Date().getTime());
            if(node && node._id !== undefined) {
                nodes[node._id] = node;
            }
            // if animation object has a function, execute it
            if(func) {
                func(anim.frame);
            }
        }

        for(var key in nodes) {
            nodes[key].draw();
        }
    };
    Kinetic.Animation._animationLoop = function() {
        var that = this;
        if(this.animations.length > 0) {
            this._runFrames();
            Kinetic.Animation.requestAnimFrame(function() {
                that._animationLoop();
            });
        }
        else {
            this.animRunning = false;
        }
    };
    Kinetic.Animation._handleAnimation = function() {
        var that = this;
        if(!this.animRunning) {
            this.animRunning = true;
            that._animationLoop();
        }
    };
    RAF = (function() {
        return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || Kinetic.Animation.fixedRequestAnimFrame;
    })();

    Kinetic.Animation.requestAnimFrame = function(callback) {
        var raf = Kinetic.DD && Kinetic.DD.moving ? this.fixedRequestAnimFrame : RAF;
        raf(callback);
    };
    
    var moveTo = Kinetic.Node.prototype.moveTo;
    Kinetic.Node.prototype.moveTo = function(container) {
        moveTo.call(this, container);
    };

})();

(function() {
    Kinetic.DD = {
        anim: new Kinetic.Animation(),
        moving: false,
        offset: {
            x: 0,
            y: 0
        }
    };

    Kinetic.getNodeDragging = function() {
        return Kinetic.DD.node;
    };

    Kinetic.DD._setupDragLayerAndGetContainer = function(no) {
        var stage = no.getStage(), nodeType = no.nodeType, lastContainer, group;

        // re-construct node tree
        no._eachAncestorReverse(function(node) {
            if(node.nodeType === 'Layer') {
                stage.dragLayer.setAttrs(node.getAttrs());
                lastContainer = stage.dragLayer;
                stage.add(stage.dragLayer);
            }
            else if(node.nodeType === 'Group') {
                group = new Kinetic.Group(node.getAttrs());
                lastContainer.add(group);
                lastContainer = group;
            }
        });
        return lastContainer;
    };
    Kinetic.DD._initDragLayer = function(stage) {
        stage.dragLayer = new Kinetic.Layer();
        stage.dragLayer.getCanvas().getElement().className = 'kinetic-drag-and-drop-layer';
    };
    Kinetic.DD._drag = function(evt) {
        var dd = Kinetic.DD, node = dd.node;

        if(node) {
            var pos = node.getStage().getUserPosition();
            var dbf = node.attrs.dragBoundFunc;

            var newNodePos = {
                x: pos.x - dd.offset.x,
                y: pos.y - dd.offset.y
            };

            if(dbf !== undefined) {
                newNodePos = dbf.call(node, newNodePos, evt);
            }

            node.setAbsolutePosition(newNodePos);

            if(!dd.moving) {
                dd.moving = true;
                node.setListening(false);

                // execute dragstart events if defined
                node._handleEvent('dragstart', evt);
            }

            // execute ondragmove if defined
            node._handleEvent('dragmove', evt);
        }
    };
    Kinetic.DD._endDrag = function(evt) {
        var dd = Kinetic.DD, node = dd.node;

        if(node) {
            var nodeType = node.nodeType, stage = node.getStage();
            node.setListening(true);
            if(nodeType === 'Stage') {
                node.draw();
            }
            // else if group, shape, or layer
            else {
                if((nodeType === 'Group' || nodeType === 'Shape') && node.getDragOnTop() && dd.prevParent) {
                    node.moveTo(dd.prevParent);
                    node.getStage().dragLayer.remove();
                    dd.prevParent = null;
                }

                node.getLayer().draw();
            }
            
            delete dd.node;
            dd.anim.stop();

            // only fire dragend event if the drag and drop
            // operation actually started.  This can be detected by
            // checking dd.moving
            if(dd.moving) {
                dd.moving = false;
                node._handleEvent('dragend', evt);
            }
        }
    };
    Kinetic.Node.prototype._startDrag = function(evt) {
        var dd = Kinetic.DD, that = this, stage = this.getStage(), pos = stage.getUserPosition();

        if(pos) {
            var m = this.getTransform().getTranslation(), ap = this.getAbsolutePosition(), nodeType = this.nodeType, container;

            dd.node = this;
            dd.offset.x = pos.x - ap.x;
            dd.offset.y = pos.y - ap.y;

            // Stage and Layer node types
            if(nodeType === 'Stage' || nodeType === 'Layer') {
                dd.anim.node = this;
                dd.anim.start();
            }

            // Group or Shape node types
            else {
                if(this.getDragOnTop()) {
                    container = dd._setupDragLayerAndGetContainer(this);
                    dd.anim.node = stage.dragLayer;
                    dd.prevParent = this.getParent();
                    // WARNING: it's important to delay the moveTo operation,
                    // layer redraws, and anim.start() until after the method execution
                    // has completed or else there will be a flicker on mobile devices
                    // due to the time it takes to append the dd canvas to the DOM
                    setTimeout(function() {
                        if(dd.node) {
                            that.moveTo(container);
                            dd.prevParent.getLayer().draw();
                            stage.dragLayer.draw();
                            dd.anim.start();
                        }
                    }, 0);
                }
                else {
                    dd.anim.node = this.getLayer();
                    dd.anim.start();
                }
            }
        }
    };
    /**
     * set draggable
     * @name setDraggable
     * @methodOf Kinetic.Node.prototype
     * @param {String} draggable
     */
    Kinetic.Node.prototype.setDraggable = function(draggable) {
        this.setAttr('draggable', draggable);
        this._dragChange();
    };
    /**
     * get draggable
     * @name getDraggable
     * @methodOf Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.getDraggable = function() {
        return this.attrs.draggable;
    };
    /**
     * determine if node is currently in drag and drop mode
     * @name isDragging
     * @methodOf Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.isDragging = function() {
        var dd = Kinetic.DD;
        return dd.node && dd.node._id === this._id && dd.moving;
    };

    Kinetic.Node.prototype._listenDrag = function() {
        this._dragCleanup();
        var that = this;
        this.on('mousedown.kinetic touchstart.kinetic', function(evt) {
            if(!Kinetic.getNodeDragging()) {
                that._startDrag(evt);
            }
        });
    };

    Kinetic.Node.prototype._dragChange = function() {
        if(this.attrs.draggable) {
            this._listenDrag();
        }
        else {
            // remove event listeners
            this._dragCleanup();

            /*
             * force drag and drop to end
             * if this node is currently in
             * drag and drop mode
             */
            var stage = this.getStage();
            var dd = Kinetic.DD;
            if(stage && dd.node && dd.node._id === this._id) {
                dd._endDrag();
            }
        }
    };
    Kinetic.Node.prototype._dragCleanup = function() {
        this.off('mousedown.kinetic');
        this.off('touchstart.kinetic');
    };
    /**
     * get draggable.  Alias of getDraggable()
     * @name isDraggable
     * @methodOf Kinetic.Node.prototype
     */
    Kinetic.Node.prototype.isDraggable = Kinetic.Node.prototype.getDraggable;

    Kinetic.Node.addGettersSetters(Kinetic.Node, ['dragBoundFunc', 'dragOnTop']);

    /**
     * set drag bound function.  This is used to override the default
     *  drag and drop position
     * @name setDragBoundFunc
     * @methodOf Kinetic.Node.prototype
     * @param {Function} dragBoundFunc
     */

    /**
     * set flag which enables or disables automatically moving the draggable node to a
     *  temporary top layer to improve performance.  The default is true
     * @name setDragOnTop
     * @methodOf Kinetic.Node.prototype
     * @param {Boolean} dragOnTop
     */

    /**
     * get dragBoundFunc
     * @name getDragBoundFunc
     * @methodOf Kinetic.Node.prototype
     */

    /**
     * get flag which enables or disables automatically moving the draggable node to a
     *  temporary top layer to improve performance.
     * @name getDragOnTop
     * @methodOf Kinetic.Node.prototype
     */

    // listen for capturing phase so that the _endDrag method is
    // called before the stage mouseup event is triggered in order
    // to render the hit graph just in time to pick up the event
    var html = document.getElementsByTagName('html')[0];
    html.addEventListener('mouseup', Kinetic.DD._endDrag, true);
    html.addEventListener('touchend', Kinetic.DD._endDrag, true);
})();

(function() {
    /**
     * Transition constructor.  The transitionTo() Node method
     *  returns a reference to the transition object which you can use
     *  to stop, resume, or restart the transition
     * @constructor
     */
    Kinetic.Transition = function(node, config) {
        var that = this, obj = {};

        this.node = node;
        this.config = config;
        this.tweens = [];

        // add tween for each property
        function addTween(c, attrs, obj, rootObj) {
            for(var key in c) {
                if(key !== 'duration' && key !== 'easing' && key !== 'callback') {
                    // if val is an object then traverse
                    if(Kinetic.Type._isObject(c[key])) {
                        obj[key] = {};
                        addTween(c[key], attrs[key], obj[key], rootObj);
                    }
                    else {
                        that._add(that._getTween(attrs, key, c[key], obj, rootObj));
                    }
                }
            }
        }
        addTween(config, node.attrs, obj, obj);

        // map first tween event to transition event
        this.tweens[0].onStarted = function() {

        };
        this.tweens[0].onStopped = function() {
            node.transAnim.stop();
        };
        this.tweens[0].onResumed = function() {
            node.transAnim.start();
        };
        this.tweens[0].onLooped = function() {

        };
        this.tweens[0].onChanged = function() {

        };
        this.tweens[0].onFinished = function() {
            var newAttrs = {};
            // create new attr obj
            for(var key in config) {
                if(key !== 'duration' && key !== 'easing' && key !== 'callback') {
                    newAttrs[key] = config[key];
                }
            }
            node.transAnim.stop();
            node.setAttrs(newAttrs);
            if(config.callback) {
                config.callback();
            }
        };
    };
    /*
     * Transition methods
     */
    Kinetic.Transition.prototype = {
        /**
         * start transition
         * @name start
         * @methodOf Kinetic.Transition.prototype
         */
        start: function() {
            for(var n = 0; n < this.tweens.length; n++) {
                this.tweens[n].start();
            }
        },
        /**
         * stop transition
         * @name stop
         * @methodOf Kinetic.Transition.prototype
         */
        stop: function() {
            for(var n = 0; n < this.tweens.length; n++) {
                this.tweens[n].stop();
            }
        },
        /**
         * resume transition
         * @name resume
         * @methodOf Kinetic.Transition.prototype
         */
        resume: function() {
            for(var n = 0; n < this.tweens.length; n++) {
                this.tweens[n].resume();
            }
        },
        _onEnterFrame: function() {
            for(var n = 0; n < this.tweens.length; n++) {
                this.tweens[n].onEnterFrame();
            }
        },
        _add: function(tween) {
            this.tweens.push(tween);
        },
        _getTween: function(attrs, prop, val, obj, rootObj) {
            var config = this.config;
            var node = this.node;
            var easing = config.easing;
            if(easing === undefined) {
                easing = 'linear';
            }

            var tween = new Kinetic.Tween(node, function(i) {
                obj[prop] = i;
                node.setAttrs(rootObj);
            }, Kinetic.Tweens[easing], attrs[prop], val, config.duration);

            return tween;
        }
    };

    /**
     * transition node to another state.  Any property that can accept a real
     *  number can be transitioned, including x, y, rotation, opacity, strokeWidth,
     *  radius, scale.x, scale.y, offset.x, offset.y, etc.
     * @name transitionTo
     * @methodOf Kinetic.Node.prototype
     * @param {Object} config
     * @config {Number} duration duration that the transition runs in seconds
     * @config {String} [easing] easing function.  can be linear, ease-in, ease-out, ease-in-out,
     *  back-ease-in, back-ease-out, back-ease-in-out, elastic-ease-in, elastic-ease-out,
     *  elastic-ease-in-out, bounce-ease-out, bounce-ease-in, bounce-ease-in-out,
     *  strong-ease-in, strong-ease-out, or strong-ease-in-out
     *  linear is the default
     * @config {Function} [callback] callback function to be executed when
     *  transition completes
     */
    Kinetic.Node.prototype.transitionTo = function(config) {
        var that = this, trans = new Kinetic.Transition(this, config);

        if(!this.transAnim) {
            this.transAnim = new Kinetic.Animation();
        }
        this.transAnim.func = function() {
            trans._onEnterFrame();
        };
        this.transAnim.node = this.nodeType === 'Stage' ? this : this.getLayer();

        // auto start
        trans.start();
        this.transAnim.start();
        this.trans = trans;
        return trans;
    };
})();

(function() {
    /**
     * Container constructor.&nbsp; Containers are used to contain nodes or other containers
     * @constructor
     * @augments Kinetic.Node
     * @param {Object} config
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Container = function(config) {
        this._containerInit(config);
    };

    Kinetic.Container.prototype = {
        _containerInit: function(config) {
            this.children = [];
            Kinetic.Node.call(this, config);
        },
        /**
         * get children
         * @name getChildren
         * @methodOf Kinetic.Container.prototype
         */
        getChildren: function() {
            return this.children;
        },
        /**
         * remove all children
         * @name removeChildren
         * @methodOf Kinetic.Container.prototype
         */
        removeChildren: function() {
            while(this.children.length > 0) {
                this.children[0].remove();
            }
        },
        /**
         * add node to container
         * @name add
         * @methodOf Kinetic.Container.prototype
         * @param {Node} child
         */
        add: function(child) {
            var go = Kinetic.Global, children = this.children;
            child.index = children.length;
            child.parent = this;
            children.push(child);

            // chainable
            return this;
        },
        /**
         * return an array of nodes that match the selector.  Use '#' for id selections
         * and '.' for name selections
         * ex:
         * var node = stage.get('#foo'); // selects node with id foo
         * var nodes = layer.get('.bar'); // selects nodes with name bar inside layer
         * @name get
         * @methodOf Kinetic.Container.prototype
         * @param {String} selector
         */
        get: function(selector) {
            var collection = new Kinetic.Collection();
            // ID selector
            if(selector.charAt(0) === '#') {
                var node = this._getNodeById(selector.slice(1));
                if(node) {
                    collection.push(node);
                }
            }
            // name selector
            else if(selector.charAt(0) === '.') {
                var nodeList = this._getNodesByName(selector.slice(1));
                Kinetic.Collection.apply(collection, nodeList);
            }
            // unrecognized selector, pass to children
            else {
                var retArr = [];
                var children = this.getChildren();
                var len = children.length;
                for(var n = 0; n < len; n++) {
                    retArr = retArr.concat(children[n]._get(selector));
                }
                Kinetic.Collection.apply(collection, retArr);
            }
            return collection;
        },
        _getNodeById: function(key) {
            var stage = this.getStage(), go = Kinetic.Global, node = go.ids[key];
            if(node !== undefined && this.isAncestorOf(node)) {
                return node;
            }
            return null;
        },
        _getNodesByName: function(key) {
            var go = Kinetic.Global, arr = go.names[key] || [];
            return this._getDescendants(arr);
        },
        _get: function(selector) {
            var retArr = Kinetic.Node.prototype._get.call(this, selector);
            var children = this.getChildren();
            var len = children.length;
            for(var n = 0; n < len; n++) {
                retArr = retArr.concat(children[n]._get(selector));
            }
            return retArr;
        },
        // extenders
        toObject: function() {
            var obj = Kinetic.Node.prototype.toObject.call(this);

            obj.children = [];

            var children = this.getChildren();
            var len = children.length;
            for(var n = 0; n < len; n++) {
                var child = children[n];
                obj.children.push(child.toObject());
            }

            return obj;
        },
        _getDescendants: function(arr) {
            var retArr = [];
            var len = arr.length;
            for(var n = 0; n < len; n++) {
                var node = arr[n];
                if(this.isAncestorOf(node)) {
                    retArr.push(node);
                }
            }

            return retArr;
        },
        /**
         * determine if node is an ancestor
         * of descendant
         * @name isAncestorOf
         * @methodOf Kinetic.Container.prototype
         * @param {Kinetic.Node} node
         */
        isAncestorOf: function(node) {
            var parent = node.getParent();
            while(parent) {
                if(parent._id === this._id) {
                    return true;
                }
                parent = parent.getParent();
            }

            return false;
        },
        /**
         * clone node
         * @name clone
         * @methodOf Kinetic.Container.prototype
         * @param {Object} attrs override attrs
         */
        clone: function(obj) {
            // call super method
            var node = Kinetic.Node.prototype.clone.call(this, obj)

            // perform deep clone on containers
            for(var key in this.children) {
                node.add(this.children[key].clone());
            }
            return node;
        },
        /**
         * get shapes that intersect a point
         * @name getIntersections
         * @methodOf Kinetic.Container.prototype
         * @param {Object} point
         */
        getIntersections: function() {
            var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
            var arr = [];
            var shapes = this.get('Shape');

            var len = shapes.length;
            for(var n = 0; n < len; n++) {
                var shape = shapes[n];
                if(shape.isVisible() && shape.intersects(pos)) {
                    arr.push(shape);
                }
            }

            return arr;
        },
        /**
         * set children indices
         */
        _setChildrenIndices: function() {
            var children = this.children, len = children.length;
            for(var n = 0; n < len; n++) {
                children[n].index = n;
            }
        },
        /*
         * draw both scene and hit graphs
         */
        draw: function() {
            this.drawScene();
            this.drawHit();
        },
        drawScene: function(canvas) {
            if(this.isVisible()) {
                var children = this.children, len = children.length;
                for(var n = 0; n < len; n++) {
                    children[n].drawScene(canvas);
                }
            }
        },
        drawHit: function() {
            if(this.isVisible() && this.isListening()) {
                var children = this.children, len = children.length;
                for(var n = 0; n < len; n++) {
                    children[n].drawHit();
                }
            }
        }
    };
    Kinetic.Global.extend(Kinetic.Container, Kinetic.Node);
})();

(function() {
    /**
     * Shape constructor.  Shapes are primitive objects such as rectangles,
     *  circles, text, lines, etc.
     * @constructor
     * @augments Kinetic.Node
     * @param {Object} config
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Shape = function(config) {
        this._initShape(config);
    };
    function _fillFunc(context) {
        context.fill();
    }
    function _strokeFunc(context) {
        context.stroke();
    }
    function _fillFuncHit(context) {
        context.fill();
    }
    function _strokeFuncHit(context) {
        context.stroke();
    }

    Kinetic.Shape.prototype = {
        _initShape: function(config) {
            this.setDefaultAttrs({
                fillEnabled: true,
                strokeEnabled: true,
                shadowEnabled: true,
                dashArrayEnabled: true,
                fillPriority: 'color'
            });

            this.nodeType = 'Shape';
            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this._fillFuncHit = _fillFuncHit;
            this._strokeFuncHit = _strokeFuncHit;

            // set colorKey
            var shapes = Kinetic.Global.shapes;
            var key;

            while(true) {
                key = Kinetic.Type._getRandomColorKey();
                if(key && !( key in shapes)) {
                    break;
                }
            }

            this.colorKey = key;
            shapes[key] = this;

            // call super constructor
            Kinetic.Node.call(this, config);
        },
        /**
         * get canvas context tied to the layer
         * @name getContext
         * @methodOf Kinetic.Shape.prototype
         */
        getContext: function() {
            return this.getLayer().getContext();
        },
        /**
         * get canvas renderer tied to the layer.  Note that this returns a canvas renderer, not a canvas element
         * @name getCanvas
         * @methodOf Kinetic.Shape.prototype
         */
        getCanvas: function() {
            return this.getLayer().getCanvas();
        },
        /**
         * returns whether or not a shadow will be rendered
         * @name hasShadow
         * @methodOf Kinetic.Shape.prototype
         */
        hasShadow: function() {
            return !!(this.getShadowColor() || this.getShadowBlur() || this.getShadowOffset());
        },
        /**
         * returns whether or not a fill will be rendered
         * @name hasFill
         * @methodOf Kinetic.Shape.prototype
         */
        hasFill: function() {
            return !!(this.getFill() || this.getFillPatternImage() || this.getFillLinearGradientStartPoint() || this.getFillRadialGradientStartPoint());
        },
        _get: function(selector) {
            return this.nodeType === selector || this.shapeType === selector ? [this] : [];
        },
        /**
         * determines if point is in the shape
         * @name intersects
         * @methodOf Kinetic.Shape.prototype
         * @param {Object} point point can be an object containing
         *  an x and y property, or it can be an array with two elements
         *  in which the first element is the x component and the second
         *  element is the y component
         */
        intersects: function() {
            var pos = Kinetic.Type._getXY(Array.prototype.slice.call(arguments));
            var stage = this.getStage();
            var hitCanvas = stage.hitCanvas;
            hitCanvas.clear();
            this.drawScene(hitCanvas);
            var p = hitCanvas.context.getImageData(Math.round(pos.x), Math.round(pos.y), 1, 1).data;
            return p[3] > 0;
        },
        /**
         * enable fill
         */
        enableFill: function() {
            this.setAttr('fillEnabled', true);
        },
        /**
         * disable fill
         */
        disableFill: function() {
            this.setAttr('fillEnabled', false);
        },
        /**
         * enable stroke
         */
        enableStroke: function() {
            this.setAttr('strokeEnabled', true);
        },
        /**
         * disable stroke
         */
        disableStroke: function() {
            this.setAttr('strokeEnabled', false);
        },
        /**
         * enable shadow
         */
        enableShadow: function() {
            this.setAttr('shadowEnabled', true);
        },
        /**
         * disable shadow
         */
        disableShadow: function() {
            this.setAttr('shadowEnabled', false);
        },
        /**
         * enable dash array
         */
        enableDashArray: function() {
            this.setAttr('dashArrayEnabled', true);
        },
        /**
         * disable dash array
         */
        disableDashArray: function() {
            this.setAttr('dashArrayEnabled', false);
        },
        remove: function() {
            Kinetic.Node.prototype.remove.call(this);
            delete Kinetic.Global.shapes[this.colorKey];
        },
        drawScene: function(canvas) {
            var attrs = this.attrs, drawFunc = attrs.drawFunc, canvas = canvas || this.getLayer().getCanvas(), context = canvas.getContext();

            if(drawFunc && this.isVisible()) {
                context.save();
                canvas._applyOpacity(this);
                canvas._applyLineJoin(this);
                canvas._applyAncestorTransforms(this);

                drawFunc.call(this, canvas);
                context.restore();
            }
        },
        drawHit: function() {
            var attrs = this.attrs, drawFunc = attrs.drawHitFunc || attrs.drawFunc, canvas = this.getLayer().hitCanvas, context = canvas.getContext();

            if(drawFunc && this.isVisible() && this.isListening()) {
                context.save();
                canvas._applyLineJoin(this);
                canvas._applyAncestorTransforms(this);

                drawFunc.call(this, canvas);
                context.restore();
            }
        },
        _setDrawFuncs: function() {
            if(!this.attrs.drawFunc && this.drawFunc) {
                this.setDrawFunc(this.drawFunc);
            }
            if(!this.attrs.drawHitFunc && this.drawHitFunc) {
                this.setDrawHitFunc(this.drawHitFunc);
            }
        }
    };
    Kinetic.Global.extend(Kinetic.Shape, Kinetic.Node);

    // add getters and setters
    Kinetic.Node.addGettersSetters(Kinetic.Shape, ['stroke', 'lineJoin', 'lineCap', 'strokeWidth', 'drawFunc', 'drawHitFunc', 'dashArray', 'shadowColor', 'shadowBlur', 'shadowOpacity', 'fillPatternImage', 'fill', 'fillPatternX', 'fillPatternY', 'fillLinearGradientColorStops', 'fillRadialGradientStartRadius', 'fillRadialGradientEndRadius', 'fillRadialGradientColorStops', 'fillPatternRepeat', 'fillEnabled', 'strokeEnabled', 'shadowEnabled', 'dashArrayEnabled', 'fillPriority']);

    /**
     * set stroke color
     * @name setStroke
     * @methodOf Kinetic.Shape.prototype
     * @param {String} stroke
     */

    /**
     * set line join
     * @name setLineJoin
     * @methodOf Kinetic.Shape.prototype
     * @param {String} lineJoin.  Can be miter, round, or bevel.  The
     *  default is miter
     */

    /**
     * set line cap.  Can be butt, round, or square
     * @name setLineCap
     * @methodOf Kinetic.Shape.prototype
     * @param {String} lineCap
     */

    /**
     * set stroke width
     * @name setStrokeWidth
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} strokeWidth
     */

    /**
     * set draw function
     * @name setDrawFunc
     * @methodOf Kinetic.Shape.prototype
     * @param {Function} drawFunc drawing function
     */

    /**
     * set draw hit function used for hit detection
     * @name setDrawHitFunc
     * @methodOf Kinetic.Shape.prototype
     * @param {Function} drawHitFunc drawing function used for hit detection
     */

    /**
     * set dash array.
     * @name setDashArray
     * @methodOf Kinetic.Shape.prototype
     * @param {Array} dashArray
     *  examples:<br>
     *  [10, 5] dashes are 10px long and 5 pixels apart
     *  [10, 20, 0.001, 20] if using a round lineCap, the line will
     *  be made up of alternating dashed lines that are 10px long
     *  and 20px apart, and dots that have a radius of 5px and are 20px
     *  apart
     */

    /**
     * set shadow color
     * @name setShadowColor
     * @methodOf Kinetic.Shape.prototype
     * @param {String} color
     */

    /**
     * set shadow blur
     * @name setShadowBlur
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} blur
     */

    /**
     * set shadow opacity
     * @name setShadowOpacity
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} opacity must be a value between 0 and 1
     */

    /**
     * set fill pattern image
     * @name setFillPatternImage
     * @methodOf Kinetic.Shape.prototype
     * @param {Image} image object
     */

    /**
     * set fill color
     * @name setFill
     * @methodOf Kinetic.Shape.prototype
     * @param {String} color
     */

    /**
     * set fill pattern x
     * @name setFillPatternX
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} x
     */

    /**
     * set fill pattern y
     * @name setFillPatternY
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} y
     */

    /**
     * set fill linear gradient color stops
     * @name setFillLinearGradientColorStops
     * @methodOf Kinetic.Shape.prototype
     * @param {Array} colorStops
     */

    /**
     * set fill radial gradient start radius
     * @name setFillRadialGradientStartRadius
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} radius
     */

    /**
     * set fill radial gradient end radius
     * @name setFillRadialGradientEndRadius
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} radius
     */

    /**
     * set fill radial gradient color stops
     * @name setFillRadialGradientColorStops
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} colorStops
     */

    /**
     * set fill pattern repeat
     * @name setFillPatternRepeat
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} repeat can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
     */

    /**
     * set fill priority
     * @name setFillPriority
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} priority can be color, pattern, linear-gradient, or radial-gradient
     *  The default is color.
     */

    /**
     * get stroke color
     * @name getStroke
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get line join
     * @name getLineJoin
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get line cap
     * @name getLineCap
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get stroke width
     * @name getStrokeWidth
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get draw function
     * @name getDrawFunc
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get draw hit function
     * @name getDrawHitFunc
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get dash array
     * @name getDashArray
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get shadow color
     * @name getShadowColor
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get shadow blur
     * @name getShadowBlur
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get shadow opacity
     * @name getShadowOpacity
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill pattern image
     * @name getFillPatternImage
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill color
     * @name getFill
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill pattern x
     * @name getFillPatternX
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill pattern y
     * @name getFillPatternY
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill linear gradient color stops
     * @name getFillLinearGradientColorStops
     * @methodOf Kinetic.Shape.prototype
     * @param {Array} colorStops
     */

    /**
     * get fill radial gradient start radius
     * @name getFillRadialGradientStartRadius
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill radial gradient end radius
     * @name getFillRadialGradientEndRadius
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill radial gradient color stops
     * @name getFillRadialGradientColorStops
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill pattern repeat
     * @name getFillPatternRepeat
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill priority
     * @name getFillPriority
     * @methodOf Kinetic.Shape.prototype
     */

    Kinetic.Node.addPointGettersSetters(Kinetic.Shape, ['fillPatternOffset', 'fillPatternScale', 'fillLinearGradientStartPoint', 'fillLinearGradientEndPoint', 'fillRadialGradientStartPoint', 'fillRadialGradientEndPoint', 'shadowOffset']);

    /**
     * set fill pattern offset
     * @name setFillPatternOffset
     * @methodOf Kinetic.Shape.prototype
     * @param {Number|Array|Object} offset
     */

    /**
     * set fill pattern scale
     * @name setFillPatternScale
     * @methodOf Kinetic.Shape.prototype
     * @param {Number|Array|Object} scale
     */

    /**
     * set fill linear gradient start point
     * @name setFillLinearGradientStartPoint
     * @methodOf Kinetic.Shape.prototype
     * @param {Number|Array|Object} startPoint
     */

    /**
     * set fill linear gradient end point
     * @name setFillLinearGradientEndPoint
     * @methodOf Kinetic.Shape.prototype
     * @param {Number|Array|Object} endPoint
     */

    /**
     * set fill radial gradient start point
     * @name setFillRadialGradientStartPoint
     * @methodOf Kinetic.Shape.prototype
     * @param {Number|Array|Object} startPoint
     */

    /**
     * set fill radial gradient end point
     * @name setFillRadialGradientEndPoint
     * @methodOf Kinetic.Shape.prototype
     * @param {Number|Array|Object} endPoint
     */

    /**
     * set shadow offset
     * @name setShadowOffset
     * @methodOf Kinetic.Shape.prototype
     * @param {Number|Array|Object} offset
     */

    /**
     * get fill pattern offset
     * @name getFillPatternOffset
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill pattern scale
     * @name getFillPatternScale
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill linear gradient start point
     * @name getFillLinearGradientStartPoint
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill linear gradient end point
     * @name getFillLinearGradientEndPoint
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill radial gradient start point
     * @name getFillRadialGradientStartPoint
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill radial gradient end point
     * @name getFillRadialGradientEndPoint
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get shadow offset
     * @name getShadowOffset
     * @methodOf Kinetic.Shape.prototype
     */

    Kinetic.Node.addRotationGettersSetters(Kinetic.Shape, ['fillPatternRotation']);

    /**
     * set fill pattern rotation in radians
     * @name setFillPatternRotation
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} rotation
     */

    /**
     * set fill pattern rotation in degrees
     * @name setFillPatternRotationDeg
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} rotationDeg
     */

    /**
     * get fill pattern rotation in radians
     * @name getFillPatternRotation
     * @methodOf Kinetic.Shape.prototype
     */

    /**
     * get fill pattern rotation in degrees
     * @name getFillPatternRotationDeg
     * @methodOf Kinetic.Shape.prototype
     */

})();

(function() {
    /**
     * Stage constructor.  A stage is used to contain multiple layers
     * @constructor
     * @augments Kinetic.Container
     * @param {Object} config
     * @param {String|DomElement} config.container Container id or DOM element
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Stage = function(config) {
        this._initStage(config);
    };

    Kinetic.Stage.prototype = {
        _initStage: function(config) {
            var dd = Kinetic.DD;
            this.setDefaultAttrs({
                width: 400,
                height: 200
            });

            // call super constructor
            Kinetic.Container.call(this, config);

            this._setStageDefaultProperties();
            this._id = Kinetic.Global.idCounter++;
            this._buildDOM();
            this._bindContentEvents();
            Kinetic.Global.stages.push(this);

            if(dd) {
                dd._initDragLayer(this);
            }
        },
        /**
         * set container dom element which contains the stage wrapper div element
         * @name setContainer
         * @methodOf Kinetic.Stage.prototype
         * @param {DomElement} container can pass in a dom element or id string
         */
        setContainer: function(container) {
            /*
             * if container is a string, assume it's an id for
             * a DOM element
             */
            if( typeof container === 'string') {
                container = document.getElementById(container);
            }
            this.setAttr('container', container);
        },
        /**
         * draw layer scene graphs
         * @name draw
         * @methodOf Kinetic.Stage.prototype
         */

        /**
         * draw layer hit graphs
         * @name drawHit
         * @methodOf Kinetic.Stage.prototype
         */

        /**
         * set height
         * @name setHeight
         * @methodOf Kinetic.Stage.prototype
         * @param {Number} height
         */
        setHeight: function(height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            this._resizeDOM();
        },
        /**
         * set width
         * @name setWidth
         * @methodOf Kinetic.Stage.prototype
         * @param {Number} width
         */
        setWidth: function(width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            this._resizeDOM();
        },
        /**
         * clear all layers
         * @name clear
         * @methodOf Kinetic.Stage.prototype
         */
        clear: function() {
            var layers = this.children;
            for(var n = 0; n < layers.length; n++) {
                layers[n].clear();
            }
        },
        /**
         * remove stage
         */
        remove: function() {
            var content = this.content;
            Kinetic.Node.prototype.remove.call(this);

            if(content && Kinetic.Type._isInDocument(content)) {
                this.attrs.container.removeChild(content);
            }
        },
        /**
         * reset stage to default state
         * @name reset
         * @methodOf Kinetic.Stage.prototype
         */
        reset: function() {
            // remove children
            this.removeChildren();

            // defaults
            this._setStageDefaultProperties();
            this.setAttrs(this.defaultNodeAttrs);
        },
        /**
         * get mouse position for desktop apps
         * @name getMousePosition
         * @methodOf Kinetic.Stage.prototype
         */
        getMousePosition: function() {
            return this.mousePos;
        },
        /**
         * get touch position for mobile apps
         * @name getTouchPosition
         * @methodOf Kinetic.Stage.prototype
         */
        getTouchPosition: function() {
            return this.touchPos;
        },
        /**
         * get user position which can be a touc position or mouse position
         * @name getUserPosition
         * @methodOf Kinetic.Stage.prototype
         */
        getUserPosition: function() {
            return this.getTouchPosition() || this.getMousePosition();
        },
        getStage: function() {
            return this;
        },
        /**
         * get stage content div element which has the
         *  the class name "kineticjs-content"
         * @name getContent
         * @methodOf Kinetic.Stage.prototype
         */
        getContent: function() {
            return this.content;
        },
        /**
         * Creates a composite data URL and requires a callback because the composite is generated asynchronously.
         * @name toDataURL
         * @methodOf Kinetic.Stage.prototype
         * @param {Object} config
         * @param {Function} config.callback function executed when the composite has completed
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         */
        toDataURL: function(config) {
            config = config || {};
            var mimeType = config.mimeType || null, quality = config.quality || null, x = config.x || 0, y = config.y || 0, canvas = new Kinetic.SceneCanvas(config.width || this.getWidth(), config.height || this.getHeight()), context = canvas.getContext(), layers = this.children;

            if(x || y) {
                context.translate(-1 * x, -1 * y);
            }

            function drawLayer(n) {
                var layer = layers[n];
                var layerUrl = layer.toDataURL();
                var imageObj = new Image();
                imageObj.onload = function() {
                    context.drawImage(imageObj, 0, 0);

                    if(n < layers.length - 1) {
                        drawLayer(n + 1);
                    }
                    else {
                        config.callback(canvas.toDataURL(mimeType, quality));
                    }
                };
                imageObj.src = layerUrl;
            }
            drawLayer(0);
        },
        /**
         * converts stage into an image.
         * @name toImage
         * @methodOf Kinetic.Stage.prototype
         * @param {Object} config
         * @param {Function} config.callback function executed when the composite has completed
         * @param {String} [config.mimeType] can be "image/png" or "image/jpeg".
         *  "image/png" is the default
         * @param {Number} [config.x] x position of canvas section
         * @param {Number} [config.y] y position of canvas section
         * @param {Number} [config.width] width of canvas section
         * @param {Number} [config.height] height of canvas section
         * @param {Number} [config.quality] jpeg quality.  If using an "image/jpeg" mimeType,
         *  you can specify the quality from 0 to 1, where 0 is very poor quality and 1
         *  is very high quality
         */
        toImage: function(config) {
            var cb = config.callback;

            config.callback = function(dataUrl) {
                Kinetic.Type._getImage(dataUrl, function(img) {
                    cb(img);
                });
            };
            this.toDataURL(config);
        },
        /**
         * get intersection object that contains shape and pixel data
         * @name getIntersection
         * @methodOf Kinetic.Stage.prototype
         * @param {Object} pos point object
         */
        getIntersection: function(pos) {
            var shape;
            var layers = this.getChildren();

            /*
             * traverse through layers from top to bottom and look
             * for hit detection
             */
            for(var n = layers.length - 1; n >= 0; n--) {
                var layer = layers[n];
                if(layer.isVisible() && layer.isListening()) {
                    var p = layer.hitCanvas.context.getImageData(Math.round(pos.x), Math.round(pos.y), 1, 1).data;
                    // this indicates that a hit pixel may have been found
                    if(p[3] === 255) {
                        var colorKey = Kinetic.Type._rgbToHex(p[0], p[1], p[2]);
                        shape = Kinetic.Global.shapes[colorKey];
                        return {
                            shape: shape,
                            pixel: p
                        };
                    }
                    // if no shape mapped to that pixel, return pixel array
                    else if(p[0] > 0 || p[1] > 0 || p[2] > 0 || p[3] > 0) {
                        return {
                            pixel: p
                        };
                    }
                }
            }

            return null;
        },
        _resizeDOM: function() {
            if(this.content) {
                var width = this.attrs.width;
                var height = this.attrs.height;

                // set content dimensions
                this.content.style.width = width + 'px';
                this.content.style.height = height + 'px';

                this.bufferCanvas.setSize(width, height, 1);
                this.hitCanvas.setSize(width, height);
                // set user defined layer dimensions
                var layers = this.children;
                for(var n = 0; n < layers.length; n++) {
                    var layer = layers[n];
                    layer.getCanvas().setSize(width, height);
                    layer.hitCanvas.setSize(width, height);
                    layer.draw();
                }
            }
        },
        /**
         * add layer to stage
         * @param {Kinetic.Layer} layer
         */
        add: function(layer) {
            Kinetic.Container.prototype.add.call(this, layer);
            layer.canvas.setSize(this.attrs.width, this.attrs.height);
            layer.hitCanvas.setSize(this.attrs.width, this.attrs.height);

            // draw layer and append canvas to container
            layer.draw();
            this.content.appendChild(layer.canvas.element);
            
            // chainable
            return this;
        },
        /**
         * get drag and drop layer
         */
        getDragLayer: function() {
            return this.dragLayer;
        },
        _setUserPosition: function(evt) {
            if(!evt) {
                evt = window.event;
            }
            this._setMousePosition(evt);
            this._setTouchPosition(evt);
        },
        /**
         * begin listening for events by adding event handlers
         * to the container
         */
        _bindContentEvents: function() {
            var go = Kinetic.Global;
            var that = this;
            var events = ['mousedown', 'mousemove', 'mouseup', 'mouseout', 'touchstart', 'touchmove', 'touchend'];

            for(var n = 0; n < events.length; n++) {
                var pubEvent = events[n];
                // induce scope
                ( function() {
                    var event = pubEvent;
                    that.content.addEventListener(event, function(evt) {
                        that['_' + event](evt);
                    }, false);
                }());
            }
        },
        _mouseout: function(evt) {
            this._setUserPosition(evt);
            var dd = Kinetic.DD;
            // if there's a current target shape, run mouseout handlers
            var targetShape = this.targetShape;
            if(targetShape && (!dd || !dd.moving)) {
                targetShape._handleEvent('mouseout', evt);
                targetShape._handleEvent('mouseleave', evt);
                this.targetShape = null;
            }
            this.mousePos = undefined;
        },
        _mousemove: function(evt) {
            this._setUserPosition(evt);
            var dd = Kinetic.DD;
            var obj = this.getIntersection(this.getUserPosition());

            if(obj) {
                var shape = obj.shape;
                if(shape) {
                    if((!dd || !dd.moving) && obj.pixel[3] === 255 && (!this.targetShape || this.targetShape._id !== shape._id)) {
                        if(this.targetShape) {
                            this.targetShape._handleEvent('mouseout', evt, shape);
                            this.targetShape._handleEvent('mouseleave', evt, shape);
                        }
                        shape._handleEvent('mouseover', evt, this.targetShape);
                        shape._handleEvent('mouseenter', evt, this.targetShape);
                        this.targetShape = shape;
                    }
                    else {
                        shape._handleEvent('mousemove', evt);
                    }
                }
            }
            /*
             * if no shape was detected, clear target shape and try
             * to run mouseout from previous target shape
             */
            else if(this.targetShape && (!dd || !dd.moving)) {
                this.targetShape._handleEvent('mouseout', evt);
                this.targetShape._handleEvent('mouseleave', evt);
                this.targetShape = null;
            }

            // start drag and drop
            if(dd) {
                dd._drag(evt);
            }
        },
        _mousedown: function(evt) {
            var obj, dd = Kinetic.DD;
            this._setUserPosition(evt);
            obj = this.getIntersection(this.getUserPosition());
            if(obj && obj.shape) {
                var shape = obj.shape;
                this.clickStart = true;
                shape._handleEvent('mousedown', evt);
            }

            //init stage drag and drop
            if(dd && this.attrs.draggable && !dd.node) {
                this._startDrag(evt);
            }
        },
        _mouseup: function(evt) {
            this._setUserPosition(evt);
            var that = this, dd = Kinetic.DD, obj = this.getIntersection(this.getUserPosition());

            if(obj && obj.shape) {
                var shape = obj.shape;
                shape._handleEvent('mouseup', evt);

                // detect if click or double click occurred
                if(this.clickStart) {
                    /*
                     * if dragging and dropping, don't fire click or dbl click
                     * event
                     */
                    if(!dd || !dd.moving || !dd.node) {
                        shape._handleEvent('click', evt);

                        if(this.inDoubleClickWindow) {
                            shape._handleEvent('dblclick', evt);
                        }
                        this.inDoubleClickWindow = true;
                        setTimeout(function() {
                            that.inDoubleClickWindow = false;
                        }, this.dblClickWindow);
                    }
                }
            }
            this.clickStart = false;
        },
        _touchstart: function(evt) {
            var obj, dd = Kinetic.DD;
            
            this._setUserPosition(evt);
            evt.preventDefault();
            obj = this.getIntersection(this.getUserPosition());

            if(obj && obj.shape) {
                var shape = obj.shape;
                this.tapStart = true;
                shape._handleEvent('touchstart', evt);
            }

            // init stage drag and drop
            if(dd && this.attrs.draggable && !dd.node) {
                this._startDrag(evt);
            }
        },
        _touchend: function(evt) {
            this._setUserPosition(evt);
            var that = this, dd = Kinetic.DD, obj = this.getIntersection(this.getUserPosition());

            if(obj && obj.shape) {
                var shape = obj.shape;
                shape._handleEvent('touchend', evt);

                // detect if tap or double tap occurred
                if(this.tapStart) {
                    /*
                     * if dragging and dropping, don't fire tap or dbltap
                     * event
                     */
                    if(!dd || !dd.moving || !dd.node) {
                        shape._handleEvent('tap', evt);

                        if(this.inDoubleClickWindow) {
                            shape._handleEvent('dbltap', evt);
                        }
                        this.inDoubleClickWindow = true;
                        setTimeout(function() {
                            that.inDoubleClickWindow = false;
                        }, this.dblClickWindow);
                    }
                }
            }

            this.tapStart = false;
        },
        _touchmove: function(evt) {
            this._setUserPosition(evt);
            var dd = Kinetic.DD;
            evt.preventDefault();
            var obj = this.getIntersection(this.getUserPosition());
            if(obj && obj.shape) {
                var shape = obj.shape;
                shape._handleEvent('touchmove', evt);
            }

            // start drag and drop
            if(dd) {
                dd._drag(evt);
            }
        },
        /**
         * set mouse positon for desktop apps
         * @param {Event} evt
         */
        _setMousePosition: function(evt) {
            var mouseX = evt.clientX - this._getContentPosition().left;
            var mouseY = evt.clientY - this._getContentPosition().top;
            this.mousePos = {
                x: mouseX,
                y: mouseY
            };
        },
        /**
         * set touch position for mobile apps
         * @param {Event} evt
         */
        _setTouchPosition: function(evt) {
            if(evt.touches !== undefined && evt.touches.length === 1) {
                // one finger
                var touch = evt.touches[0];
                // Get the information for finger #1
                var touchX = touch.clientX - this._getContentPosition().left;
                var touchY = touch.clientY - this._getContentPosition().top;

                this.touchPos = {
                    x: touchX,
                    y: touchY
                };
            }
        },
        /**
         * get container position
         */
        _getContentPosition: function() {
            var rect = this.content.getBoundingClientRect();
            return {
                top: rect.top,
                left: rect.left
            };
        },
        /**
         * build dom
         */
        _buildDOM: function() {
            // content
            this.content = document.createElement('div');
            this.content.style.position = 'relative';
            this.content.style.display = 'inline-block';
            this.content.className = 'kineticjs-content';
            this.attrs.container.appendChild(this.content);

            this.bufferCanvas = new Kinetic.SceneCanvas();
            this.hitCanvas = new Kinetic.HitCanvas();

            this._resizeDOM();
        },
        /**
         * bind event listener to container DOM element
         * @param {String} typesStr
         * @param {function} handler
         */
        _onContent: function(typesStr, handler) {
            var types = typesStr.split(' ');
            for(var n = 0; n < types.length; n++) {
                var baseEvent = types[n];
                this.content.addEventListener(baseEvent, handler, false);
            }
        },
        /**
         * set defaults
         */
        _setStageDefaultProperties: function() {
            this.nodeType = 'Stage';
            this.dblClickWindow = 400;
            this.targetShape = null;
            this.mousePos = undefined;
            this.clickStart = false;
            this.touchPos = undefined;
            this.tapStart = false;
        }
    };
    Kinetic.Global.extend(Kinetic.Stage, Kinetic.Container);

    // add getters and setters
    Kinetic.Node.addGetters(Kinetic.Stage, ['container']);

    /**
     * get container DOM element
     * @name getContainer
     * @methodOf Kinetic.Stage.prototype
     */
})();

(function() {
    /**
     * Layer constructor.  Layers are tied to their own canvas element and are used
     * to contain groups or shapes
     * @constructor
     * @augments Kinetic.Container
     * @param {Object} config
     * @param {Boolean} [config.clearBeforeDraw] set this property to false if you don't want
     * to clear the canvas before each layer draw.  The default value is true.
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Layer = function(config) {
        this._initLayer(config);
    };

    Kinetic.Layer.prototype = {
        _initLayer: function(config) {
            this.setDefaultAttrs({
                clearBeforeDraw: true
            });

            this.nodeType = 'Layer';
            this.beforeDrawFunc = undefined;
            this.afterDrawFunc = undefined;
            this.canvas = new Kinetic.SceneCanvas();
            this.canvas.getElement().style.position = 'absolute';
            this.hitCanvas = new Kinetic.HitCanvas();

            // call super constructor
            Kinetic.Container.call(this, config);
        },
        /**
         * draw children nodes.  this includes any groups
         *  or shapes
         * @name draw
         * @methodOf Kinetic.Layer.prototype
         */
        draw: function() {
            var context = this.getContext();
            
            // before draw  handler
            if(this.beforeDrawFunc !== undefined) {
                this.beforeDrawFunc.call(this);
            }
            
            Kinetic.Container.prototype.draw.call(this);

            // after draw  handler
            if(this.afterDrawFunc !== undefined) {
                this.afterDrawFunc.call(this);
            }
        },
        /**
         * draw children nodes on hit.  this includes any groups
         *  or shapes
         * @name drawHit
         * @methodOf Kinetic.Layer.prototype
         */
        drawHit: function() {
            this.hitCanvas.clear();
            Kinetic.Container.prototype.drawHit.call(this);
        },
        /**
         * draw children nodes on scene.  this includes any groups
         *  or shapes
         * @name drawScene
         * @methodOf Kinetic.Layer.prototype
         * @param {Kinetic.Canvas} [canvas]
         */
        drawScene: function(canvas) {
            canvas = canvas || this.getCanvas();
            if(this.attrs.clearBeforeDraw) {
                canvas.clear();
            }
            Kinetic.Container.prototype.drawScene.call(this, canvas);
        },
        toDataURL: function(config) {
            config = config || {};
            var mimeType = config.mimeType || null, quality = config.quality || null, canvas, context, x = config.x || 0, y = config.y || 0;

            // if dimension or position is defined, use Node toDataURL
            if(config.width || config.height || config.x || config.y) {
                return Kinetic.Node.prototype.toDataURL.call(this, config);
            }
            // otherwise get data url of the currently drawn layer
            else {
                return this.getCanvas().toDataURL(mimeType, quality);
            }
        },
        /**
         * set before draw handler
         * @name beforeDraw
         * @methodOf Kinetic.Layer.prototype
         * @param {Function} handler
         */
        beforeDraw: function(func) {
            this.beforeDrawFunc = func;
        },
        /**
         * set after draw handler
         * @name afterDraw
         * @methodOf Kinetic.Layer.prototype
         * @param {Function} handler
         */
        afterDraw: function(func) {
            this.afterDrawFunc = func;
        },
        /**
         * get layer canvas
         * @name getCanvas
         * @methodOf Kinetic.Layer.prototype
         */
        getCanvas: function() {
            return this.canvas;
        },
        /**
         * get layer canvas context
         * @name getContext
         * @methodOf Kinetic.Layer.prototype
         */
        getContext: function() {
            return this.canvas.context;
        },
        /**
         * clear canvas tied to the layer
         * @name clear
         * @methodOf Kinetic.Layer.prototype
         */
        clear: function() {
            this.getCanvas().clear();
        },
        // extenders
        setVisible: function(visible) {
            Kinetic.Node.prototype.setVisible.call(this, visible);
            if(visible) {
                this.canvas.element.style.display = 'block';
                this.hitCanvas.element.style.display = 'block';
            }
            else {
                this.canvas.element.style.display = 'none';
                this.hitCanvas.element.style.display = 'none';
            }
        },
        setZIndex: function(index) {
            Kinetic.Node.prototype.setZIndex.call(this, index);
            var stage = this.getStage();
            if(stage) {
                stage.content.removeChild(this.canvas.element);

                if(index < stage.getChildren().length - 1) {
                    stage.content.insertBefore(this.canvas.element, stage.getChildren()[index + 1].canvas.element);
                }
                else {
                    stage.content.appendChild(this.canvas.element);
                }
            }
        },
        moveToTop: function() {
            Kinetic.Node.prototype.moveToTop.call(this);
            var stage = this.getStage();
            if(stage) {
                stage.content.removeChild(this.canvas.element);
                stage.content.appendChild(this.canvas.element);
            }
        },
        moveUp: function() {
            if(Kinetic.Node.prototype.moveUp.call(this)) {
                var stage = this.getStage();
                if(stage) {
                    stage.content.removeChild(this.canvas.element);

                    if(this.index < stage.getChildren().length - 1) {
                        stage.content.insertBefore(this.canvas.element, stage.getChildren()[this.index + 1].canvas.element);
                    }
                    else {
                        stage.content.appendChild(this.canvas.element);
                    }
                }
            }
        },
        moveDown: function() {
            if(Kinetic.Node.prototype.moveDown.call(this)) {
                var stage = this.getStage();
                if(stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.canvas.element);
                    stage.content.insertBefore(this.canvas.element, children[this.index + 1].canvas.element);
                }
            }
        },
        moveToBottom: function() {
            if(Kinetic.Node.prototype.moveToBottom.call(this)) {
                var stage = this.getStage();
                if(stage) {
                    var children = stage.getChildren();
                    stage.content.removeChild(this.canvas.element);
                    stage.content.insertBefore(this.canvas.element, children[1].canvas.element);
                }
            }
        },
        getLayer: function() {
            return this;
        },
        /**
         * remove layer from stage
         */
        remove: function() {
            var stage = this.getStage(), canvas = this.canvas, element = canvas.element;
            Kinetic.Node.prototype.remove.call(this);

            if(stage && canvas && Kinetic.Type._isInDocument(element)) {
                stage.content.removeChild(element);
            }
        }
    };
    Kinetic.Global.extend(Kinetic.Layer, Kinetic.Container);

    // add getters and setters
    Kinetic.Node.addGettersSetters(Kinetic.Layer, ['clearBeforeDraw']);

    /**
     * set flag which determines if the layer is cleared or not
     *  before drawing
     * @name setClearBeforeDraw
     * @methodOf Kinetic.Layer.prototype
     * @param {Boolean} clearBeforeDraw
     */

    /**
     * get flag which determines if the layer is cleared or not
     *  before drawing
     * @name getClearBeforeDraw
     * @methodOf Kinetic.Layer.prototype
     */
})();

(function() {
    /**
     * Group constructor.  Groups are used to contain shapes or other groups.
     * @constructor
     * @augments Kinetic.Container
     * @param {Object} config
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Group = function(config) {
        this._initGroup(config);
    };

    Kinetic.Group.prototype = {
        _initGroup: function(config) {
            this.nodeType = 'Group';

            // call super constructor
            Kinetic.Container.call(this, config);
        }
    };
    Kinetic.Global.extend(Kinetic.Group, Kinetic.Container);
})();

(function() {
    /**
     * Rect constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} [config.cornerRadius]
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Rect = function(config) {
        this._initRect(config);
    };
    
    Kinetic.Rect.prototype = {
        _initRect: function(config) {
            this.setDefaultAttrs({
                width: 0,
                height: 0,
                cornerRadius: 0
            });

            Kinetic.Shape.call(this, config);
            this.shapeType = 'Rect';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var context = canvas.getContext();
            context.beginPath();
            var cornerRadius = this.getCornerRadius(), width = this.getWidth(), height = this.getHeight();
            if(cornerRadius === 0) {
                // simple rect - don't bother doing all that complicated maths stuff.
                context.rect(0, 0, width, height);
            }
            else {
                // arcTo would be nicer, but browser support is patchy (Opera)
                context.moveTo(cornerRadius, 0);
                context.lineTo(width - cornerRadius, 0);
                context.arc(width - cornerRadius, cornerRadius, cornerRadius, Math.PI * 3 / 2, 0, false);
                context.lineTo(width, height - cornerRadius);
                context.arc(width - cornerRadius, height - cornerRadius, cornerRadius, 0, Math.PI / 2, false);
                context.lineTo(cornerRadius, height);
                context.arc(cornerRadius, height - cornerRadius, cornerRadius, Math.PI / 2, Math.PI, false);
                context.lineTo(0, cornerRadius);
                context.arc(cornerRadius, cornerRadius, cornerRadius, Math.PI, Math.PI * 3 / 2, false);
            }
            context.closePath();
            canvas.fillStroke(this);
        }
    };

    Kinetic.Global.extend(Kinetic.Rect, Kinetic.Shape);

    Kinetic.Node.addGettersSetters(Kinetic.Rect, ['cornerRadius']);

    /**
     * set corner radius
     * @name setCornerRadius
     * @methodOf Kinetic.Shape.prototype
     * @param {Number} corner radius
     */

    /**
     * get corner radius
     * @name getCornerRadius
     * @methodOf Kinetic.Shape.prototype
     */

})();

(function() {
    /**
     * Circle constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} config.radius
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Circle = function(config) {
        this._initCircle(config);
    };

    Kinetic.Circle.prototype = {
        _initCircle: function(config) {
            this.setDefaultAttrs({
                radius: 0
            });

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'Circle';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var context = canvas.getContext();
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, Math.PI * 2, true);
            context.closePath();
            canvas.fillStroke(this);
        },
        getWidth: function() {
            return this.getRadius() * 2;
        },
        getHeight: function() {
            return this.getRadius() * 2;
        },
        setWidth: function(width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            this.setRadius(width / 2);
        },
        setHeight: function(height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            this.setRadius(height / 2);
        }
    };
    Kinetic.Global.extend(Kinetic.Circle, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGettersSetters(Kinetic.Circle, ['radius']);

    /**
     * set radius
     * @name setRadius
     * @methodOf Kinetic.Circle.prototype
     * @param {Number} radius
     */

    /**
     * get radius
     * @name getRadius
     * @methodOf Kinetic.Circle.prototype
     */
})();

(function() {
    /**
     * Wedge constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} config.angle
     * @param {Number} config.radius
     * @param {Boolean} [config.clockwise]
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Wedge = function(config) {
        this._initWedge(config);
    };

    Kinetic.Wedge.prototype = {
        _initWedge: function(config) {
            this.setDefaultAttrs({
                radius: 0,
                angle: 0,
                clockwise: false
            });

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'Wedge';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var context = canvas.getContext();
            context.beginPath();
            context.arc(0, 0, this.getRadius(), 0, this.getAngle(), this.getClockwise());
            context.lineTo(0, 0);
            context.closePath();
            canvas.fillStroke(this);
        },
        /**
         * set angle in degrees
         * @name setAngleDeg
         * @methodOf Kinetic.Wedge.prototype
         * @param {Number} deg
         */
        setAngleDeg: function(deg) {
            this.setAngle(Kinetic.Type._degToRad(deg));
        },
        /**
         * set angle in degrees
         * @name getAngleDeg
         * @methodOf Kinetic.Wedge.prototype
         */
        getAngleDeg: function() {
            return Kinetic.Type._radToDeg(this.getAngle());
        }
    };
    Kinetic.Global.extend(Kinetic.Wedge, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGettersSetters(Kinetic.Wedge, ['radius', 'angle', 'clockwise']);

    /**
     * set radius
     * @name setRadius
     * @methodOf Kinetic.Wedge.prototype
     * @param {Number} radius
     */

    /**
     * set angle
     * @name setAngle
     * @methodOf Kinetic.Wedge.prototype
     * @param {Number} angle
     */

    /**
     * set clockwise draw direction.  If set to true, the wedge will be drawn clockwise
     *  If set to false, the wedge will be drawn anti-clockwise.  The default is false.
     * @name setClockwise
     * @methodOf Kinetic.Wedge.prototype
     * @param {Boolean} clockwise
     */

    /**
     * get radius
     * @name getRadius
     * @methodOf Kinetic.Wedge.prototype
     */

    /**
     * get angle
     * @name getAngle
     * @methodOf Kinetic.Wedge.prototype
     */

    /**
     * get clockwise
     * @name getClockwise
     * @methodOf Kinetic.Wedge.prototype
     */
})();

(function() {
    /**
     * Ellipse constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number|Array|Object} config.radius defines x and y radius
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Ellipse = function(config) {
        this._initEllipse(config);
    };

    Kinetic.Ellipse.prototype = {
        _initEllipse: function(config) {
            this.setDefaultAttrs({
                radius: {
                    x: 0,
                    y: 0
                }
            });

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'Ellipse';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var context = canvas.getContext(), r = this.getRadius();
            context.beginPath();
            context.save();
            if(r.x !== r.y) {
                context.scale(1, r.y / r.x);
            }
            context.arc(0, 0, r.x, 0, Math.PI * 2, true);
            context.restore();
            context.closePath();
            canvas.fillStroke(this);
        },
        getWidth: function() {
            return this.getRadius().x * 2;
        },
        getHeight: function() {
            return this.getRadius().y * 2;
        },
        setWidth: function(width) {
            Kinetic.Node.prototype.setWidth.call(this, width);
            this.setRadius({
                x: width / 2
            });
        },
        setHeight: function(height) {
            Kinetic.Node.prototype.setHeight.call(this, height);
            this.setRadius({
                y: height / 2
            });
        }
    };
    Kinetic.Global.extend(Kinetic.Ellipse, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addPointGettersSetters(Kinetic.Ellipse, ['radius']);

    /**
     * set radius
     * @name setRadius
     * @methodOf Kinetic.Ellipse.prototype
     * @param {Object|Array} radius
     *  radius can be a number, in which the ellipse becomes a circle,
     *  it can be an object with an x and y component, or it
     *  can be an array in which the first element is the x component
     *  and the second element is the y component.  The x component
     *  defines the horizontal radius and the y component
     *  defines the vertical radius
     */

    /**
     * get radius
     * @name getRadius
     * @methodOf Kinetic.Ellipse.prototype
     */
})();

(function() {
    /**
     * Image constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {ImageObject} config.image
     * @param {Object} [config.crop]
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Image = function(config) {
        this._initImage(config);
    };

    Kinetic.Image.prototype = {
        _initImage: function(config) {
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'Image';
            this._setDrawFuncs();

            var that = this;
            this.on('imageChange', function(evt) {
                that._syncSize();
            });

            this._syncSize();
        },
        drawFunc: function(canvas) {
            var width = this.getWidth(), height = this.getHeight(), params, that = this, context = canvas.getContext();

            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            canvas.fillStroke(this);

            if(this.attrs.image) {
                // if cropping
                if(this.attrs.crop && this.attrs.crop.width && this.attrs.crop.height) {
                    var cropX = this.attrs.crop.x || 0;
                    var cropY = this.attrs.crop.y || 0;
                    var cropWidth = this.attrs.crop.width;
                    var cropHeight = this.attrs.crop.height;
                    params = [this.attrs.image, cropX, cropY, cropWidth, cropHeight, 0, 0, width, height];
                }
                // no cropping
                else {
                    params = [this.attrs.image, 0, 0, width, height];
                }

                if(this.hasShadow()) {
                    canvas.applyShadow(this, function() {
                        that._drawImage(context, params);
                    });
                }
                else {
                    this._drawImage(context, params);
                }

            }

        },
        drawHitFunc: function(canvas) {
            var width = this.getWidth(), height = this.getHeight(), imageHitRegion = this.imageHitRegion, appliedShadow = false, context = canvas.getContext();

            if(imageHitRegion) {
                context.drawImage(imageHitRegion, 0, 0, width, height);
                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                canvas.stroke(this);
            }
            else {
                context.beginPath();
                context.rect(0, 0, width, height);
                context.closePath();
                canvas.fillStroke(this);
            }
        },
        /**
         * apply filter
         * @name applyFilter
         * @methodOf Kinetic.Image.prototype
         * @param {Object} config
         * @param {Function} filter filter function
         * @param {Object} [config] optional config object used to configure filter
         * @param {Function} [callback] callback function to be called once
         *  filter has been applied
         */
        applyFilter: function(filter, config, callback) {
            var canvas = new Kinetic.Canvas(this.attrs.image.width, this.attrs.image.height);
            var context = canvas.getContext();
            context.drawImage(this.attrs.image, 0, 0);
            try {
                var imageData = context.getImageData(0, 0, canvas.getWidth(), canvas.getHeight());
                filter(imageData, config);
                var that = this;
                Kinetic.Type._getImage(imageData, function(imageObj) {
                    that.setImage(imageObj);

                    if(callback) {
                        callback();
                    }
                });
            }
            catch(e) {
                Kinetic.Global.warn('Unable to apply filter. ' + e.message);
            }
        },
        /**
         * set crop
         * @name setCrop
         * @methodOf Kinetic.Image.prototype
         * @param {Object|Array} config
         * @param {Number} config.x
         * @param {Number} config.y
         * @param {Number} config.width
         * @param {Number} config.height
         */
        setCrop: function() {
            var config = [].slice.call(arguments);
            var pos = Kinetic.Type._getXY(config);
            var size = Kinetic.Type._getSize(config);
            var both = Kinetic.Type._merge(pos, size);
            this.setAttr('crop', Kinetic.Type._merge(both, this.getCrop()));
        },
        /**
         * create image hit region which enables more accurate hit detection mapping of the image
         *  by avoiding event detections for transparent pixels
         * @name createImageHitRegion
         * @methodOf Kinetic.Image.prototype
         * @param {Function} [callback] callback function to be called once
         *  the image hit region has been created
         */
        createImageHitRegion: function(callback) {
            var canvas = new Kinetic.Canvas(this.attrs.width, this.attrs.height);
            var context = canvas.getContext();
            context.drawImage(this.attrs.image, 0, 0);
            try {
                var imageData = context.getImageData(0, 0, canvas.getWidth(), canvas.getHeight());
                var data = imageData.data;
                var rgbColorKey = Kinetic.Type._hexToRgb(this.colorKey);
                // replace non transparent pixels with color key
                for(var i = 0, n = data.length; i < n; i += 4) {
                    data[i] = rgbColorKey.r;
                    data[i + 1] = rgbColorKey.g;
                    data[i + 2] = rgbColorKey.b;
                    // i+3 is alpha (the fourth element)
                }

                var that = this;
                Kinetic.Type._getImage(imageData, function(imageObj) {
                    that.imageHitRegion = imageObj;
                    if(callback) {
                        callback();
                    }
                });
            }
            catch(e) {
                Kinetic.Global.warn('Unable to create image hit region. ' + e.message);
            }
        },
        /**
         * clear image hit region
         * @name clearImageHitRegion
         * @methodOf Kinetic.Image.prototype
         */
        clearImageHitRegion: function() {
            delete this.imageHitRegion;
        },
        _syncSize: function() {
            if(this.attrs.image) {
                if(!this.attrs.width) {
                    this.setWidth(this.attrs.image.width);
                }
                if(!this.attrs.height) {
                    this.setHeight(this.attrs.image.height);
                }
            }
        },
        _drawImage: function(context, a) {
            if(a.length === 5) {
                context.drawImage(a[0], a[1], a[2], a[3], a[4]);
            }
            else if(a.length === 9) {
                context.drawImage(a[0], a[1], a[2], a[3], a[4], a[5], a[6], a[7], a[8]);
            }
        }
    };
    Kinetic.Global.extend(Kinetic.Image, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGettersSetters(Kinetic.Image, ['image']);
    Kinetic.Node.addGetters(Kinetic.Image, ['crop']);

    /**
     * set image
     * @name setImage
     * @methodOf Kinetic.Image.prototype
     * @param {ImageObject} image
     */

    /**
     * get crop
     * @name getCrop
     * @methodOf Kinetic.Image.prototype
     */

    /**
     * get image
     * @name getImage
     * @methodOf Kinetic.Image.prototype
     */
})();

(function() {
    /**
     * Polygon constructor.&nbsp; Polygons are defined by an array of points
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Array} config.points can be a flattened array of points, an array of point arrays, or an array of point objects.
     *  e.g. [0,1,2,3], [[0,1],[2,3]] and [{x:0,y:1},{x:2,y:3}] are equivalent
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Polygon = function(config) {
        this._initPolygon(config);
    };

    Kinetic.Polygon.prototype = {
        _initPolygon: function(config) {
            this.setDefaultAttrs({
                points: []
            });

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'Polygon';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var context = canvas.getContext(), points = this.getPoints(), length = points.length;
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);
            for(var n = 1; n < length; n++) {
                context.lineTo(points[n].x, points[n].y);
            }
            context.closePath();
            canvas.fillStroke(this);
        },
        /**
         * set points array
         * @name setPoints
         * @methodOf Kinetic.Polygon.prototype
         * @param {Array} can be an array of point objects or an array
         *  of Numbers.  e.g. [{x:1,y:2},{x:3,y:4}] or [1,2,3,4]
         */
        setPoints: function(val) {
            this.setAttr('points', Kinetic.Type._getPoints(val));
        }
    };
    Kinetic.Global.extend(Kinetic.Polygon, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGetters(Kinetic.Polygon, ['points']);

    /**
     * get points array
     * @name getPoints
     * @methodOf Kinetic.Polygon.prototype
     */
})();

(function() {
    // constants
    var AUTO = 'auto', 
        CALIBRI = 'Calibri',
        CANVAS = 'canvas', 
        CENTER = 'center',
        CHANGE_KINETIC = 'Change.kinetic',
        CONTEXT_2D = '2d',
        DASH = '\n',
        EMPTY_STRING = '', 
        LEFT = 'left',
        NEW_LINE = '\n',
        TEXT = 'text',
        TEXT_UPPER = 'Text', 
        TOP = 'top', 
        MIDDLE = 'middle',
        NORMAL = 'normal',
        PX_SPACE = 'px ',
        SPACE = ' ',
        RIGHT = 'right',
        ATTR_CHANGE_LIST = ['fontFamily', 'fontSize', 'fontStyle', 'padding', 'align', 'lineHeight', 'text', 'width', 'height'],
        
        // cached variables
        attrChangeListLen = ATTR_CHANGE_LIST.length;

    /**
     * Text constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {String} [config.fontFamily] default is Calibri
     * @param {Number} [config.fontSize] in pixels.  Default is 12
     * @param {String} [config.fontStyle] can be normal, bold, or italic.  Default is normal
     * @param {String} config.text
     * @param {String} [config.align] can be left, center, or right
     * @param {Number} [config.padding]
     * @param {Number} [config.width] default is auto
     * @param {Number} [config.height] default is auto
     * @param {Number} [config.lineHeight] default is 1
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Text = function(config) {
        this._initText(config);
    };
    function _fillFunc(context) {
        context.fillText(this.partialText, 0, 0);
    }
    function _strokeFunc(context) {
        context.strokeText(this.partialText, 0, 0);
    }

    Kinetic.Text.prototype = {
        _initText: function(config) {
            var that = this;
            this.setDefaultAttrs({
                fontFamily: CALIBRI,
                text: EMPTY_STRING,
                fontSize: 12,
                align: LEFT,
                verticalAlign: TOP,
                fontStyle: NORMAL,
                padding: 0,
                width: AUTO,
                height: AUTO,
                lineHeight: 1
            });

            this.dummyCanvas = document.createElement(CANVAS);

            // call super constructor
            Kinetic.Shape.call(this, config);

            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;
            this.shapeType = TEXT_UPPER;
            this._setDrawFuncs();

            // update text data for certain attr changes
            for(var n = 0; n < attrChangeListLen; n++) {
                this.on(ATTR_CHANGE_LIST[n] + CHANGE_KINETIC, that._setTextData);
            }

            this._setTextData();
        },
        drawFunc: function(canvas) {
            var context = canvas.getContext(), 
                p = this.getPadding(), 
                fontStyle = this.getFontStyle(),
                fontSize = this.getFontSize(),
                fontFamily = this.getFontFamily(),
                textHeight = this.getTextHeight(),
                lineHeightPx = this.getLineHeight() * textHeight, 
                textArr = this.textArr,
                textArrLen = textArr.length,
                totalWidth = this.getWidth();

            context.font = fontStyle + SPACE + fontSize + PX_SPACE + fontFamily;
            context.textBaseline = MIDDLE;
            context.textAlign = LEFT;
            context.save();
            context.translate(p, 0);
            context.translate(0, p + textHeight / 2);

            // draw text lines
            for(var n = 0; n < textArrLen; n++) {
                var obj = textArr[n],
                    text = obj.text,
                    width = obj.width;

                // horizontal alignment
                context.save();
                if(this.getAlign() === RIGHT) {
                    context.translate(totalWidth - width - p * 2, 0);
                }
                else if(this.getAlign() === CENTER) {
                    context.translate((totalWidth - width - p * 2) / 2, 0);
                }

                this.partialText = text;
                canvas.fillStroke(this);
                context.restore();
                context.translate(0, lineHeightPx);
            }
            context.restore();
        },
        drawHitFunc: function(canvas) {
            var context = canvas.getContext(), 
                width = this.getWidth(), 
                height = this.getHeight();

            context.beginPath();
            context.rect(0, 0, width, height);
            context.closePath();
            canvas.fillStroke(this);
        },
        /**
         * set text
         * @name setText
         * @methodOf Kinetic.Text.prototype
         * @param {String} text
         */
        setText: function(text) {
            var str = Kinetic.Type._isString(text) ? text : text.toString();
            this.setAttr(TEXT, str);
        },
        /**
         * get width
         * @name getWidth
         * @methodOf Kinetic.Text.prototype
         */
        getWidth: function() {
            return this.attrs.width === AUTO ? this.getTextWidth() + this.getPadding() * 2 : this.attrs.width;
        },
        /**
         * get height
         * @name getHeight
         * @methodOf Kinetic.Text.prototype
         */
        getHeight: function() {
            return this.attrs.height === AUTO ? (this.getTextHeight() * this.textArr.length * this.attrs.lineHeight) + this.attrs.padding * 2 : this.attrs.height;
        },
        /**
         * get text width
         * @name getTextWidth
         * @methodOf Kinetic.Text.prototype
         */
        getTextWidth: function() {
            return this.textWidth;
        },
        /**
         * get text height
         * @name getTextHeight
         * @methodOf Kinetic.Text.prototype
         */
        getTextHeight: function() {
            return this.textHeight;
        },
        _getTextSize: function(text) {
            var dummyCanvas = this.dummyCanvas,
                context = dummyCanvas.getContext(CONTEXT_2D),
                fontSize = this.getFontSize(),
                metrics;

            context.save();
            context.font = this.getFontStyle() + SPACE + fontSize + PX_SPACE + this.getFontFamily();
            
            metrics = context.measureText(text);
            context.restore();
            return {
                width: metrics.width,
                height: parseInt(fontSize, 10)
            };
        },
        _expandTextData: function(arr) {
            var len = arr.length;
                n = 0, 
                text = EMPTY_STRING,
                newArr = [];
                
            for (n=0; n<len; n++) {
                text = arr[n];
                newArr.push({
                    text: text,
                    width: this._getTextSize(text).width                    
                });
            }
                
            return newArr;
        },
        /**
         * set text data.  wrap logic and width and height setting occurs
         * here
         */
        _setTextData: function() {
            var charArr = this.getText().split(EMPTY_STRING),
                arr = [],
                row = 0;
                addLine = true,
                lineHeightPx = 0,
                padding = this.getPadding();
                
            this.textWidth = 0;
            this.textHeight = this._getTextSize(this.getText()).height;
            lineHeightPx = this.getLineHeight() * this.textHeight;
            
            while(charArr.length > 0 && addLine && (this.attrs.height === AUTO || lineHeightPx * (row + 1) < this.attrs.height - padding * 2)) {
                var index = 0;
                var line = undefined;
                addLine = false;

                while(index < charArr.length) {
                    if(charArr.indexOf(NEW_LINE) === index) {
                        // remove newline char
                        charArr.splice(index, 1);
                        line = charArr.splice(0, index).join(EMPTY_STRING);
                        break;
                    }

                    // if line exceeds inner box width
                    var lineArr = charArr.slice(0, index);
                    if(this.attrs.width !== AUTO && this._getTextSize(lineArr.join(EMPTY_STRING)).width > this.attrs.width - padding * 2) {
                        /*
                         * if a single character is too large to fit inside
                         * the text box width, then break out of the loop
                         * and stop processing
                         */
                        if(index == 0) {
                            break;
                        }
                        var lastSpace = lineArr.lastIndexOf(SPACE);
                        var lastDash = lineArr.lastIndexOf(DASH);
                        var wrapIndex = Math.max(lastSpace, lastDash);
                        if(wrapIndex >= 0) {
                            line = charArr.splice(0, 1 + wrapIndex).join(EMPTY_STRING);
                            break;
                        }
                        /*
                         * if not able to word wrap based on space or dash,
                         * go ahead and wrap in the middle of a word if needed
                         */
                        line = charArr.splice(0, index).join(EMPTY_STRING);
                        break;
                    }
                    index++;

                    // if the end is reached
                    if(index === charArr.length) {
                        line = charArr.splice(0, index).join(EMPTY_STRING);
                    }
                }
                this.textWidth = Math.max(this.textWidth, this._getTextSize(line).width);
                if(line !== undefined) {
                    arr.push(line);
                    addLine = true;
                }
                row++;
            }
            this.textArr = this._expandTextData(arr);
        }
    };
    Kinetic.Global.extend(Kinetic.Text, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGettersSetters(Kinetic.Text, ['fontFamily', 'fontSize', 'fontStyle', 'padding', 'align', 'lineHeight']);
    Kinetic.Node.addGetters(Kinetic.Text, [TEXT]);
    /**
     * set font family
     * @name setFontFamily
     * @methodOf Kinetic.Text.prototype
     * @param {String} fontFamily
     */

    /**
     * set font size in pixels
     * @name setFontSize
     * @methodOf Kinetic.Text.prototype
     * @param {int} fontSize
     */

    /**
     * set font style.  Can be 'normal', 'italic', or 'bold'.  'normal' is the default.
     * @name setFontStyle
     * @methodOf Kinetic.Text.prototype
     * @param {String} fontStyle
     */

    /**
     * set padding
     * @name setPadding
     * @methodOf Kinetic.Text.prototype
     * @param {int} padding
     */

    /**
     * set horizontal align of text
     * @name setAlign
     * @methodOf Kinetic.Text.prototype
     * @param {String} align align can be 'left', 'center', or 'right'
     */

    /**
     * set line height
     * @name setLineHeight
     * @methodOf Kinetic.Text.prototype
     * @param {Number} lineHeight default is 1
     */

    /**
     * get font family
     * @name getFontFamily
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get font size
     * @name getFontSize
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get font style
     * @name getFontStyle
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get padding
     * @name getPadding
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get horizontal align
     * @name getAlign
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get line height
     * @name getLineHeight
     * @methodOf Kinetic.Text.prototype
     */

    /**
     * get text
     * @name getText
     * @methodOf Kinetic.Text.prototype
     */
})();

(function() {
    /**
     * Line constructor.&nbsp; Lines are defined by an array of points
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Array} config.points can be a flattened array of points, an array of point arrays, or an array of point objects.
     *  e.g. [0,1,2,3], [[0,1],[2,3]] and [{x:0,y:1},{x:2,y:3}] are equivalent
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Line = function(config) {
        this._initLine(config);
    };

    Kinetic.Line.prototype = {
        _initLine: function(config) {
            this.setDefaultAttrs({
                points: [],
                lineCap: 'butt'
            });

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'Line';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var points = this.getPoints(), length = points.length, context = canvas.getContext();
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);

            for(var n = 1; n < length; n++) {
                var point = points[n];
                context.lineTo(point.x, point.y);
            }

            canvas.stroke(this);
        },
        /**
         * set points array
         * @name setPoints
         * @methodOf Kinetic.Line.prototype
         * @param {Array} can be an array of point objects or an array
         *  of Numbers.  e.g. [{x:1,y:2},{x:3,y:4}] or [1,2,3,4]
         */
        setPoints: function(val) {
            this.setAttr('points', Kinetic.Type._getPoints(val));
        }
    };
    Kinetic.Global.extend(Kinetic.Line, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGetters(Kinetic.Line, ['points']);

    /**
     * get points array
     * @name getPoints
     * @methodOf Kinetic.Line.prototype
     */
})();

(function() {
    /**
     * Spline constructor.&nbsp; Splines are defined by an array of points and
     *  a tension
     * @constructor
     * @augments Kinetic.Line
     * @param {Object} config
     * @param {Array} config.points can be a flattened array of points, an array of point arrays, or an array of point objects.
     *  e.g. [0,1,2,3], [[0,1],[2,3]] and [{x:0,y:1},{x:2,y:3}] are equivalent
     * @param {Number} [config.tension] default value is 1.  Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Spline = function(config) {
        this._initSpline(config);
    };
    Kinetic.Spline._getControlPoints = function(p0, p1, p2, t) {
        var x0 = p0.x;
        var y0 = p0.y;
        var x1 = p1.x;
        var y1 = p1.y;
        var x2 = p2.x;
        var y2 = p2.y;
        var d01 = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
        var d12 = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        var fa = t * d01 / (d01 + d12);
        var fb = t * d12 / (d01 + d12);
        var p1x = x1 - fa * (x2 - x0);
        var p1y = y1 - fa * (y2 - y0);
        var p2x = x1 + fb * (x2 - x0);
        var p2y = y1 + fb * (y2 - y0);
        return [{
            x: p1x,
            y: p1y
        }, {
            x: p2x,
            y: p2y
        }];
    };

    Kinetic.Spline.prototype = {
        _initSpline: function(config) {
            this.setDefaultAttrs({
                tension: 1
            });

            // call super constructor
            Kinetic.Line.call(this, config);
            this.shapeType = 'Spline';
        },
        drawFunc: function(canvas) {
            var points = this.getPoints(), length = points.length, context = canvas.getContext(), tension = this.getTension();
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);

            // tension
            if(tension !== 0 && length > 2) {
                var ap = this.allPoints, len = ap.length;
                context.quadraticCurveTo(ap[0].x, ap[0].y, ap[1].x, ap[1].y);

                var n = 2;
                while(n < len - 1) {
                    context.bezierCurveTo(ap[n].x, ap[n++].y, ap[n].x, ap[n++].y, ap[n].x, ap[n++].y);
                }

                context.quadraticCurveTo(ap[len - 1].x, ap[len - 1].y, points[length - 1].x, points[length - 1].y);

            }
            // no tension
            else {
                for(var n = 1; n < length; n++) {
                    var point = points[n];
                    context.lineTo(point.x, point.y);
                }
            }

            canvas.stroke(this);
        },
        setPoints: function(val) {
            Kinetic.Line.prototype.setPoints.call(this, val);
            this._setAllPoints();
        },
        /**
         * set tension
         * @name setTension
         * @methodOf Kinetic.Spline.prototype
         * @param {Number} tension
         */
        setTension: function(tension) {
            this.setAttr('tension', tension);
            this._setAllPoints();
        },
        _setAllPoints: function() {
            var points = this.getPoints(), length = points.length, tension = this.getTension(), allPoints = [];

            for(var n = 1; n < length - 1; n++) {
                var cp = Kinetic.Spline._getControlPoints(points[n - 1], points[n], points[n + 1], tension);
                allPoints.push(cp[0]);
                allPoints.push(points[n]);
                allPoints.push(cp[1]);
            }

            this.allPoints = allPoints;
        }
    };
    Kinetic.Global.extend(Kinetic.Spline, Kinetic.Line);

    // add getters setters
    Kinetic.Node.addGetters(Kinetic.Spline, ['tension']);

    /**
     * get tension
     * @name getTension
     * @methodOf Kinetic.Spline.prototype
     */
})();

(function() {
    /**
     * Blob constructor.&nbsp; Blobs are defined by an array of points and
     *  a tension
     * @constructor
     * @augments Kinetic.Spline
     * @param {Object} config
     * @param {Array} config.points can be a flattened array of points, an array of point arrays, or an array of point objects.
     *  e.g. [0,1,2,3], [[0,1],[2,3]] and [{x:0,y:1},{x:2,y:3}] are equivalent
     * @param {Number} [config.tension] default value is 1.  Higher values will result in a more curvy line.  A value of 0 will result in no interpolation.
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Blob = function(config) {
        this._initBlob(config);
    };

    Kinetic.Blob.prototype = {
        _initBlob: function(config) {
            // call super constructor
            Kinetic.Spline.call(this, config);
            this.shapeType = 'Blob';
        },
        drawFunc: function(canvas) {
            var points = this.getPoints(), length = points.length, context = canvas.getContext(), tension = this.getTension();
            context.beginPath();
            context.moveTo(points[0].x, points[0].y);

            // tension
            if(tension !== 0 && length > 2) {
                var ap = this.allPoints, len = ap.length;
                var n = 0;
                while(n < len-1) {
                    context.bezierCurveTo(ap[n].x, ap[n++].y, ap[n].x, ap[n++].y, ap[n].x, ap[n++].y);
                } 
            }
            // no tension
            else {
                for(var n = 1; n < length; n++) {
                    var point = points[n];
                    context.lineTo(point.x, point.y);
                }
            }

            context.closePath();
            canvas.fillStroke(this);
        },
        _setAllPoints: function() {
            var points = this.getPoints(), length = points.length, tension = this.getTension(), firstControlPoints = Kinetic.Spline._getControlPoints(points[length - 1], points[0], points[1], tension), lastControlPoints = Kinetic.Spline._getControlPoints(points[length - 2], points[length - 1], points[0], tension);

            Kinetic.Spline.prototype._setAllPoints.call(this);

            // prepend control point
            this.allPoints.unshift(firstControlPoints[1]);

            // append cp, point, cp, cp, first point
            this.allPoints.push(lastControlPoints[0]);
            this.allPoints.push(points[length - 1]);
            this.allPoints.push(lastControlPoints[1]);
            this.allPoints.push(firstControlPoints[0]);
            this.allPoints.push(points[0]);
        }
    };

    Kinetic.Global.extend(Kinetic.Blob, Kinetic.Spline);
})();

(function() {
    /**
     * Sprite constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {String} config.animation animation key
     * @param {Object} config.animations animation map
     * @param {Integer} [config.index] animation index
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Sprite = function(config) {
        this._initSprite(config);
    };

    Kinetic.Sprite.prototype = {
        _initSprite: function(config) {
            this.setDefaultAttrs({
                index: 0,
                frameRate: 17
            });
            
            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'Sprite';
            this._setDrawFuncs();

            this.anim = new Kinetic.Animation();
            var that = this;
            this.on('animationChange', function() {
                // reset index when animation changes
                that.setIndex(0);
            });
        },
        drawFunc: function(canvas) {
            var anim = this.attrs.animation, index = this.attrs.index, f = this.attrs.animations[anim][index], context = canvas.getContext(), image = this.attrs.image;

            if(image) {
                context.drawImage(image, f.x, f.y, f.width, f.height, 0, 0, f.width, f.height);
            }
        },
        drawHitFunc: function(canvas) {
            var anim = this.attrs.animation, index = this.attrs.index, f = this.attrs.animations[anim][index], context = canvas.getContext();

            context.beginPath();
            context.rect(0, 0, f.width, f.height);
            context.closePath();
            canvas.fill(this);
        },
        /**
         * start sprite animation
         * @name start
         * @methodOf Kinetic.Sprite.prototype
         */
        start: function() {
            var that = this;
            var layer = this.getLayer();

            /*
             * animation object has no executable function because
             *  the updates are done with a fixed FPS with the setInterval
             *  below.  The anim object only needs the layer reference for
             *  redraw
             */
            this.anim.node = layer;

            this.interval = setInterval(function() {
                var index = that.attrs.index;
                that._updateIndex();
                if(that.afterFrameFunc && index === that.afterFrameIndex) {
                    that.afterFrameFunc();
                    delete that.afterFrameFunc;
                    delete that.afterFrameIndex;
                }
            }, 1000 / this.attrs.frameRate);

            this.anim.start();
        },
        /**
         * stop sprite animation
         * @name stop
         * @methodOf Kinetic.Sprite.prototype
         */
        stop: function() {
            this.anim.stop();
            clearInterval(this.interval);
        },
        /**
         * set after frame event handler
         * @name afterFrame
         * @methodOf Kinetic.Sprite.prototype
         * @param {Integer} index frame index
         * @param {Function} func function to be executed after frame has been drawn
         */
        afterFrame: function(index, func) {
            this.afterFrameIndex = index;
            this.afterFrameFunc = func;
        },
        _updateIndex: function() {
            var i = this.attrs.index;
            var a = this.attrs.animation;
            if(i < this.attrs.animations[a].length - 1) {
                this.attrs.index++;
            }
            else {
                this.attrs.index = 0;
            }
        }
    };
    Kinetic.Global.extend(Kinetic.Sprite, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGettersSetters(Kinetic.Sprite, ['animation', 'animations', 'index']);

    /**
     * set animation key
     * @name setAnimation
     * @methodOf Kinetic.Sprite.prototype
     * @param {String} anim animation key
     */

    /**
     * set animations object
     * @name setAnimations
     * @methodOf Kinetic.Sprite.prototype
     * @param {Object} animations
     */

    /**
     * set animation frame index
     * @name setIndex
     * @methodOf Kinetic.Sprite.prototype
     * @param {Integer} index frame index
     */

    /**
     * get animation key
     * @name getAnimation
     * @methodOf Kinetic.Sprite.prototype
     */

    /**
     * get animations object
     * @name getAnimations
     * @methodOf Kinetic.Sprite.prototype
     */

    /**
     * get animation frame index
     * @name getIndex
     * @methodOf Kinetic.Sprite.prototype
     */
})();

(function() {
    /**
     * Star constructor
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Integer} config.numPoints
     * @param {Number} config.innerRadius
     * @param {Number} config.outerRadius
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Star = function(config) {
        this._initStar(config);
    };

    Kinetic.Star.prototype = {
        _initStar: function(config) {
            this.setDefaultAttrs({
                numPoints: 0,
                innerRadius: 0,
                outerRadius: 0
            });

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'Star';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var context = canvas.getContext(), innerRadius = this.attrs.innerRadius, outerRadius = this.attrs.outerRadius, numPoints = this.attrs.numPoints;

            context.beginPath();
            context.moveTo(0, 0 - this.attrs.outerRadius);

            for(var n = 1; n < numPoints * 2; n++) {
                var radius = n % 2 === 0 ? outerRadius : innerRadius;
                var x = radius * Math.sin(n * Math.PI / numPoints);
                var y = -1 * radius * Math.cos(n * Math.PI / numPoints);
                context.lineTo(x, y);
            }
            context.closePath();

            canvas.fillStroke(this);
        }
    };
    Kinetic.Global.extend(Kinetic.Star, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGettersSetters(Kinetic.Star, ['numPoints', 'innerRadius', 'outerRadius']);

    /**
     * set number of points
     * @name setNumPoints
     * @methodOf Kinetic.Star.prototype
     * @param {Integer} points
     */

    /**
     * set outer radius
     * @name setOuterRadius
     * @methodOf Kinetic.Star.prototype
     * @param {Number} radius
     */

    /**
     * set inner radius
     * @name setInnerRadius
     * @methodOf Kinetic.Star.prototype
     * @param {Number} radius
     */

    /**
     * get number of points
     * @name getNumPoints
     * @methodOf Kinetic.Star.prototype
     */

    /**
     * get outer radius
     * @name getOuterRadius
     * @methodOf Kinetic.Star.prototype
     */

    /**
     * get inner radius
     * @name getInnerRadius
     * @methodOf Kinetic.Star.prototype
     */
})();

(function() {
    /**
     * RegularPolygon constructor.&nbsp; Examples include triangles, squares, pentagons, hexagons, etc.
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {Number} config.sides
     * @param {Number} config.radius
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.RegularPolygon = function(config) {
        this._initRegularPolygon(config);
    };

    Kinetic.RegularPolygon.prototype = {
        _initRegularPolygon: function(config) {
            this.setDefaultAttrs({
                radius: 0,
                sides: 0
            });

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'RegularPolygon';
            this._setDrawFuncs();
        },
        drawFunc: function(canvas) {
            var context = canvas.getContext(), sides = this.attrs.sides, radius = this.attrs.radius;
            context.beginPath();
            context.moveTo(0, 0 - radius);

            for(var n = 1; n < sides; n++) {
                var x = radius * Math.sin(n * 2 * Math.PI / sides);
                var y = -1 * radius * Math.cos(n * 2 * Math.PI / sides);
                context.lineTo(x, y);
            }
            context.closePath();
            canvas.fillStroke(this);
        }
    };
    Kinetic.Global.extend(Kinetic.RegularPolygon, Kinetic.Shape);

    // add getters setters
    Kinetic.Node.addGettersSetters(Kinetic.RegularPolygon, ['radius', 'sides']);

    /**
     * set radius
     * @name setRadius
     * @methodOf Kinetic.RegularPolygon.prototype
     * @param {Number} radius
     */

    /**
     * set number of sides
     * @name setSides
     * @methodOf Kinetic.RegularPolygon.prototype
     * @param {int} sides
     */
    
    /**
     * get radius
     * @name getRadius
     * @methodOf Kinetic.RegularPolygon.prototype
     */

    /**
     * get number of sides
     * @name getSides
     * @methodOf Kinetic.RegularPolygon.prototype
     */
})();

(function() {
    /**
     * Path constructor.
     * @author Jason Follas
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {String} config.data SVG data string
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.Path = function(config) {
        this._initPath(config);
    };

    Kinetic.Path.prototype = {
        _initPath: function(config) {
            this.dataArray = [];
            var that = this;

            // call super constructor
            Kinetic.Shape.call(this, config);
            this.shapeType = 'Path';
            this._setDrawFuncs();

            this.dataArray = Kinetic.Path.parsePathData(this.attrs.data);
            this.on('dataChange', function() {
                that.dataArray = Kinetic.Path.parsePathData(that.attrs.data);
            });
        },
        drawFunc: function(canvas) {
            var ca = this.dataArray, context = canvas.getContext();
            // context position
            context.beginPath();
            for(var n = 0; n < ca.length; n++) {
                var c = ca[n].command;
                var p = ca[n].points;
                switch (c) {
                    case 'L':
                        context.lineTo(p[0], p[1]);
                        break;
                    case 'M':
                        context.moveTo(p[0], p[1]);
                        break;
                    case 'C':
                        context.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
                        break;
                    case 'Q':
                        context.quadraticCurveTo(p[0], p[1], p[2], p[3]);
                        break;
                    case 'A':
                        var cx = p[0], cy = p[1], rx = p[2], ry = p[3], theta = p[4], dTheta = p[5], psi = p[6], fs = p[7];

                        var r = (rx > ry) ? rx : ry;
                        var scaleX = (rx > ry) ? 1 : rx / ry;
                        var scaleY = (rx > ry) ? ry / rx : 1;

                        context.translate(cx, cy);
                        context.rotate(psi);
                        context.scale(scaleX, scaleY);
                        context.arc(0, 0, r, theta, theta + dTheta, 1 - fs);
                        context.scale(1 / scaleX, 1 / scaleY);
                        context.rotate(-psi);
                        context.translate(-cx, -cy);

                        break;
                    case 'z':
                        context.closePath();
                        break;
                }
            }
            canvas.fillStroke(this);
        }
    };
    Kinetic.Global.extend(Kinetic.Path, Kinetic.Shape);

    /*
     * Utility methods written by jfollas to
     * handle length and point measurements
     */
    Kinetic.Path.getLineLength = function(x1, y1, x2, y2) {
        return Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1));
    };
    Kinetic.Path.getPointOnLine = function(dist, P1x, P1y, P2x, P2y, fromX, fromY) {
        if(fromX === undefined) {
            fromX = P1x;
        }
        if(fromY === undefined) {
            fromY = P1y;
        }

        var m = (P2y - P1y) / ((P2x - P1x) + 0.00000001);
        var run = Math.sqrt(dist * dist / (1 + m * m));
        if(P2x < P1x)
            run *= -1;
        var rise = m * run;
        var pt;

        if((fromY - P1y) / ((fromX - P1x) + 0.00000001) === m) {
            pt = {
                x: fromX + run,
                y: fromY + rise
            };
        }
        else {
            var ix, iy;

            var len = this.getLineLength(P1x, P1y, P2x, P2y);
            if(len < 0.00000001) {
                return undefined;
            }
            var u = (((fromX - P1x) * (P2x - P1x)) + ((fromY - P1y) * (P2y - P1y)));
            u = u / (len * len);
            ix = P1x + u * (P2x - P1x);
            iy = P1y + u * (P2y - P1y);

            var pRise = this.getLineLength(fromX, fromY, ix, iy);
            var pRun = Math.sqrt(dist * dist - pRise * pRise);
            run = Math.sqrt(pRun * pRun / (1 + m * m));
            if(P2x < P1x)
                run *= -1;
            rise = m * run;
            pt = {
                x: ix + run,
                y: iy + rise
            };
        }

        return pt;
    };

    Kinetic.Path.getPointOnCubicBezier = function(pct, P1x, P1y, P2x, P2y, P3x, P3y, P4x, P4y) {
        function CB1(t) {
            return t * t * t;
        }
        function CB2(t) {
            return 3 * t * t * (1 - t);
        }
        function CB3(t) {
            return 3 * t * (1 - t) * (1 - t);
        }
        function CB4(t) {
            return (1 - t) * (1 - t) * (1 - t);
        }
        var x = P4x * CB1(pct) + P3x * CB2(pct) + P2x * CB3(pct) + P1x * CB4(pct);
        var y = P4y * CB1(pct) + P3y * CB2(pct) + P2y * CB3(pct) + P1y * CB4(pct);

        return {
            x: x,
            y: y
        };
    };
    Kinetic.Path.getPointOnQuadraticBezier = function(pct, P1x, P1y, P2x, P2y, P3x, P3y) {
        function QB1(t) {
            return t * t;
        }
        function QB2(t) {
            return 2 * t * (1 - t);
        }
        function QB3(t) {
            return (1 - t) * (1 - t);
        }
        var x = P3x * QB1(pct) + P2x * QB2(pct) + P1x * QB3(pct);
        var y = P3y * QB1(pct) + P2y * QB2(pct) + P1y * QB3(pct);

        return {
            x: x,
            y: y
        };
    };
    Kinetic.Path.getPointOnEllipticalArc = function(cx, cy, rx, ry, theta, psi) {
        var cosPsi = Math.cos(psi), sinPsi = Math.sin(psi);
        var pt = {
            x: rx * Math.cos(theta),
            y: ry * Math.sin(theta)
        };
        return {
            x: cx + (pt.x * cosPsi - pt.y * sinPsi),
            y: cy + (pt.x * sinPsi + pt.y * cosPsi)
        };
    };
    /**
     * get parsed data array from the data
     *  string.  V, v, H, h, and l data are converted to
     *  L data for the purpose of high performance Path
     *  rendering
     */
    Kinetic.Path.parsePathData = function(data) {
        // Path Data Segment must begin with a moveTo
        //m (x y)+  Relative moveTo (subsequent points are treated as lineTo)
        //M (x y)+  Absolute moveTo (subsequent points are treated as lineTo)
        //l (x y)+  Relative lineTo
        //L (x y)+  Absolute LineTo
        //h (x)+    Relative horizontal lineTo
        //H (x)+    Absolute horizontal lineTo
        //v (y)+    Relative vertical lineTo
        //V (y)+    Absolute vertical lineTo
        //z (closepath)
        //Z (closepath)
        //c (x1 y1 x2 y2 x y)+ Relative Bezier curve
        //C (x1 y1 x2 y2 x y)+ Absolute Bezier curve
        //q (x1 y1 x y)+       Relative Quadratic Bezier
        //Q (x1 y1 x y)+       Absolute Quadratic Bezier
        //t (x y)+    Shorthand/Smooth Relative Quadratic Bezier
        //T (x y)+    Shorthand/Smooth Absolute Quadratic Bezier
        //s (x2 y2 x y)+       Shorthand/Smooth Relative Bezier curve
        //S (x2 y2 x y)+       Shorthand/Smooth Absolute Bezier curve
        //a (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+     Relative Elliptical Arc
        //A (rx ry x-axis-rotation large-arc-flag sweep-flag x y)+  Absolute Elliptical Arc

        // return early if data is not defined
        if(!data) {
            return [];
        }

        // command string
        var cs = data;

        // command chars
        var cc = ['m', 'M', 'l', 'L', 'v', 'V', 'h', 'H', 'z', 'Z', 'c', 'C', 'q', 'Q', 't', 'T', 's', 'S', 'a', 'A'];
        // convert white spaces to commas
        cs = cs.replace(new RegExp(' ', 'g'), ',');
        // create pipes so that we can split the data
        for(var n = 0; n < cc.length; n++) {
            cs = cs.replace(new RegExp(cc[n], 'g'), '|' + cc[n]);
        }
        // create array
        var arr = cs.split('|');
        var ca = [];
        // init context point
        var cpx = 0;
        var cpy = 0;
        for(var n = 1; n < arr.length; n++) {
            var str = arr[n];
            var c = str.charAt(0);
            str = str.slice(1);
            // remove ,- for consistency
            str = str.replace(new RegExp(',-', 'g'), '-');
            // add commas so that it's easy to split
            str = str.replace(new RegExp('-', 'g'), ',-');
            str = str.replace(new RegExp('e,-', 'g'), 'e-');
            var p = str.split(',');
            if(p.length > 0 && p[0] === '') {
                p.shift();
            }
            // convert strings to floats
            for(var i = 0; i < p.length; i++) {
                p[i] = parseFloat(p[i]);
            }
            while(p.length > 0) {
                if(isNaN(p[0]))// case for a trailing comma before next command
                    break;

                var cmd = null;
                var points = [];
                var startX = cpx, startY = cpy;

                // convert l, H, h, V, and v to L
                switch (c) {

                    // Note: Keep the lineTo's above the moveTo's in this switch
                    case 'l':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'L':
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;

                    // Note: lineTo handlers need to be above this point
                    case 'm':
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'l';
                        // subsequent points are treated as relative lineTo
                        break;
                    case 'M':
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'M';
                        points.push(cpx, cpy);
                        c = 'L';
                        // subsequent points are treated as absolute lineTo
                        break;

                    case 'h':
                        cpx += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'H':
                        cpx = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'v':
                        cpy += p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'V':
                        cpy = p.shift();
                        cmd = 'L';
                        points.push(cpx, cpy);
                        break;
                    case 'C':
                        points.push(p.shift(), p.shift(), p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'c':
                        points.push(cpx + p.shift(), cpy + p.shift(), cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'S':
                        var ctlPtx = cpx, ctlPty = cpy;
                        var prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 's':
                        var ctlPtx = cpx, ctlPty = cpy;
                        var prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'C') {
                            ctlPtx = cpx + (cpx - prevCmd.points[2]);
                            ctlPty = cpy + (cpy - prevCmd.points[3]);
                        }
                        points.push(ctlPtx, ctlPty, cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'C';
                        points.push(cpx, cpy);
                        break;
                    case 'Q':
                        points.push(p.shift(), p.shift());
                        cpx = p.shift();
                        cpy = p.shift();
                        points.push(cpx, cpy);
                        break;
                    case 'q':
                        points.push(cpx + p.shift(), cpy + p.shift());
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(cpx, cpy);
                        break;
                    case 'T':
                        var ctlPtx = cpx, ctlPty = cpy;
                        var prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx = p.shift();
                        cpy = p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 't':
                        var ctlPtx = cpx, ctlPty = cpy;
                        var prevCmd = ca[ca.length - 1];
                        if(prevCmd.command === 'Q') {
                            ctlPtx = cpx + (cpx - prevCmd.points[0]);
                            ctlPty = cpy + (cpy - prevCmd.points[1]);
                        }
                        cpx += p.shift();
                        cpy += p.shift();
                        cmd = 'Q';
                        points.push(ctlPtx, ctlPty, cpx, cpy);
                        break;
                    case 'A':
                        var rx = p.shift(), ry = p.shift(), psi = p.shift(), fa = p.shift(), fs = p.shift();
                        var x1 = cpx, y1 = cpy; cpx = p.shift(), cpy = p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                    case 'a':
                        var rx = p.shift(), ry = p.shift(), psi = p.shift(), fa = p.shift(), fs = p.shift();
                        var x1 = cpx, y1 = cpy; cpx += p.shift(), cpy += p.shift();
                        cmd = 'A';
                        points = this.convertEndpointToCenterParameterization(x1, y1, cpx, cpy, fa, fs, rx, ry, psi);
                        break;
                }

                ca.push({
                    command: cmd || c,
                    points: points,
                    start: {
                        x: startX,
                        y: startY
                    },
                    pathLength: this.calcLength(startX, startY, cmd || c, points)
                });
            }

            if(c === 'z' || c === 'Z') {
                ca.push({
                    command: 'z',
                    points: [],
                    start: undefined,
                    pathLength: 0
                });
            }
        }

        return ca;
    };
    Kinetic.Path.calcLength = function(x, y, cmd, points) {
        var len, p1, p2;
        var path = Kinetic.Path;

        switch (cmd) {
            case 'L':
                return path.getLineLength(x, y, points[0], points[1]);
            case 'C':
                // Approximates by breaking curve into 100 line segments
                len = 0.0;
                p1 = path.getPointOnCubicBezier(0, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                for( t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnCubicBezier(t, x, y, points[0], points[1], points[2], points[3], points[4], points[5]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'Q':
                // Approximates by breaking curve into 100 line segments
                len = 0.0;
                p1 = path.getPointOnQuadraticBezier(0, x, y, points[0], points[1], points[2], points[3]);
                for( t = 0.01; t <= 1; t += 0.01) {
                    p2 = path.getPointOnQuadraticBezier(t, x, y, points[0], points[1], points[2], points[3]);
                    len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                    p1 = p2;
                }
                return len;
            case 'A':
                // Approximates by breaking curve into line segments
                len = 0.0;
                var start = points[4];
                // 4 = theta
                var dTheta = points[5];
                // 5 = dTheta
                var end = points[4] + dTheta;
                var inc = Math.PI / 180.0;
                // 1 degree resolution
                if(Math.abs(start - end) < inc) {
                    inc = Math.abs(start - end);
                }
                // Note: for purpose of calculating arc length, not going to worry about rotating X-axis by angle psi
                p1 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], start, 0);
                if(dTheta < 0) {// clockwise
                    for( t = start - inc; t > end; t -= inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                else {// counter-clockwise
                    for( t = start + inc; t < end; t += inc) {
                        p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], t, 0);
                        len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);
                        p1 = p2;
                    }
                }
                p2 = path.getPointOnEllipticalArc(points[0], points[1], points[2], points[3], end, 0);
                len += path.getLineLength(p1.x, p1.y, p2.x, p2.y);

                return len;
        }

        return 0;
    };
    Kinetic.Path.convertEndpointToCenterParameterization = function(x1, y1, x2, y2, fa, fs, rx, ry, psiDeg) {
        // Derived from: http://www.w3.org/TR/SVG/implnote.html#ArcImplementationNotes
        var psi = psiDeg * (Math.PI / 180.0);
        var xp = Math.cos(psi) * (x1 - x2) / 2.0 + Math.sin(psi) * (y1 - y2) / 2.0;
        var yp = -1 * Math.sin(psi) * (x1 - x2) / 2.0 + Math.cos(psi) * (y1 - y2) / 2.0;

        var lambda = (xp * xp) / (rx * rx) + (yp * yp) / (ry * ry);

        if(lambda > 1) {
            rx *= Math.sqrt(lambda);
            ry *= Math.sqrt(lambda);
        }

        var f = Math.sqrt((((rx * rx) * (ry * ry)) - ((rx * rx) * (yp * yp)) - ((ry * ry) * (xp * xp))) / ((rx * rx) * (yp * yp) + (ry * ry) * (xp * xp)));

        if(fa == fs) {
            f *= -1;
        }
        if(isNaN(f)) {
            f = 0;
        }

        var cxp = f * rx * yp / ry;
        var cyp = f * -ry * xp / rx;

        var cx = (x1 + x2) / 2.0 + Math.cos(psi) * cxp - Math.sin(psi) * cyp;
        var cy = (y1 + y2) / 2.0 + Math.sin(psi) * cxp + Math.cos(psi) * cyp;

        var vMag = function(v) {
            return Math.sqrt(v[0] * v[0] + v[1] * v[1]);
        };
        var vRatio = function(u, v) {
            return (u[0] * v[0] + u[1] * v[1]) / (vMag(u) * vMag(v));
        };
        var vAngle = function(u, v) {
            return (u[0] * v[1] < u[1] * v[0] ? -1 : 1) * Math.acos(vRatio(u, v));
        };
        var theta = vAngle([1, 0], [(xp - cxp) / rx, (yp - cyp) / ry]);
        var u = [(xp - cxp) / rx, (yp - cyp) / ry];
        var v = [(-1 * xp - cxp) / rx, (-1 * yp - cyp) / ry];
        var dTheta = vAngle(u, v);

        if(vRatio(u, v) <= -1) {
            dTheta = Math.PI;
        }
        if(vRatio(u, v) >= 1) {
            dTheta = 0;
        }
        if(fs === 0 && dTheta > 0) {
            dTheta = dTheta - 2 * Math.PI;
        }
        if(fs == 1 && dTheta < 0) {
            dTheta = dTheta + 2 * Math.PI;
        }
        return [cx, cy, rx, ry, theta, dTheta, psi, fs];
    };
    // add getters setters
    Kinetic.Node.addGettersSetters(Kinetic.Path, ['data']);

    /**
     * set SVG path data string.  This method
     *  also automatically parses the data string
     *  into a data array.  Currently supported SVG data:
     *  M, m, L, l, H, h, V, v, Q, q, T, t, C, c, S, s, A, a, Z, z
     * @name setData
     * @methodOf Kinetic.Path.prototype
     * @param {String} SVG path command string
     */

    /**
     * get SVG path data string
     * @name getData
     * @methodOf Kinetic.Path.prototype
     */
})();

(function() {
    /**
     * Path constructor.
     * @author Jason Follas
     * @constructor
     * @augments Kinetic.Shape
     * @param {Object} config
     * @param {String} [config.fontFamily] default is Calibri
     * @param {Number} [config.fontSize] default is 12
     * @param {String} [config.fontStyle] can be normal, bold, or italic.  Default is normal
     * @param {String} config.text
     * @param {String} [config.fill] fill color
     * @param {Image} [config.fillPatternImage] fill pattern image
     * @param {Number} [config.fillPatternX]
     * @param {Number} [config.fillPatternY]
     * @param {Array|Object} [config.fillPatternOffset] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillPatternScale] array with two elements or object with x and y component
     * @param {Number} [config.fillPatternRotation]
     * @param {String} [config.fillPatternRepeat] can be 'repeat', 'repeat-x', 'repeat-y', or 'no-repeat'.  The default is 'no-repeat'
@param {Array|Object} [config.fillLinearGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillLinearGradientEndPoint] array with two elements or object with x and y component
     * @param {Array} [config.fillLinearGradientColorStops] array of color stops
     * @param {Array|Object} [config.fillRadialGradientStartPoint] array with two elements or object with x and y component
     * @param {Array|Object} [config.fillRadialGradientEndPoint] array with two elements or object with x and y component
     * @param {Number} [config.fillRadialGradientStartRadius]
     * @param {Number} [config.fillRadialGradientEndRadius]
     * @param {Array} [config.fillRadialGradientColorStops] array of color stops
     * @param {Boolean} [config.fillEnabled] flag which enables or disables the fill.  The default value is true
     * @param {String} [config.fillPriority] can be color, linear-gradient, radial-graident, or pattern.  The default value is color.  The fillPriority property makes it really easy to toggle between different fill types.  For example, if you want to toggle between a fill color style and a fill pattern style, simply set the fill property and the fillPattern properties, and then use setFillPriority('color') to render the shape with a color fill, or use setFillPriority('pattern') to render the shape with the pattern fill configuration
     * @param {String} [config.stroke] stroke color
     * @param {Number} [config.strokeWidth] stroke width
     * @param {Boolean} [config.strokeEnabled] flag which enables or disables the stroke.  The default value is true
     * @param {String} [config.lineJoin] can be miter, round, or bevel.  The default
     *  is miter
     * @param {String} [config.lineCap] can be butt, round, or sqare.  The default
     *  is butt
     * @param {String} [config.shadowColor]
     * @param {Number} [config.shadowBlur]
     * @param {Obect} [config.shadowOffset]
     * @param {Number} [config.shadowOffset.x]
     * @param {Number} [config.shadowOffset.y]
     * @param {Number} [config.shadowOpacity] shadow opacity.  Can be any real number
     *  between 0 and 1
     * @param {Boolean} [config.shadowEnabled] flag which enables or disables the shadow.  The default value is true
     * @param {Array} [config.dashArray]
     * @param {Boolean} [config.dashArrayEnabled] flag which enables or disables the dashArray.  The default value is true
     * @param {Number} [config.x]
     * @param {Number} [config.y]
     * @param {Number} [config.width]
     * @param {Number} [config.height]
     * @param {Boolean} [config.visible]
     * @param {Boolean} [config.listening] whether or not the node is listening for events
     * @param {String} [config.id] unique id
     * @param {String} [config.name] non-unique name
     * @param {Number} [config.opacity] determines node opacity.  Can be any number between 0 and 1
     * @param {Object} [config.scale]
     * @param {Number} [config.scale.x]
     * @param {Number} [config.scale.y]
     * @param {Number} [config.rotation] rotation in radians
     * @param {Number} [config.rotationDeg] rotation in degrees
     * @param {Object} [config.offset] offset from center point and rotation point
     * @param {Number} [config.offset.x]
     * @param {Number} [config.offset.y]
     * @param {Boolean} [config.draggable]
     * @param {Function} [config.dragBoundFunc]
     */
    Kinetic.TextPath = function(config) {
        this._initTextPath(config);
    };
    
    function _fillFunc(context) {
        context.fillText(this.partialText, 0, 0);
    }
    function _strokeFunc(context) {
        context.strokeText(this.partialText, 0, 0);
    }

    Kinetic.TextPath.prototype = {
        _initTextPath: function(config) {
            this.setDefaultAttrs({
                fontFamily: 'Calibri',
                fontSize: 12,
                fontStyle: 'normal',
                text: ''
            });

            this.dummyCanvas = document.createElement('canvas');
            this.dataArray = [];
            var that = this;

            // call super constructor
            Kinetic.Shape.call(this, config);

            // overrides
            this._fillFunc = _fillFunc;
            this._strokeFunc = _strokeFunc;

            this.shapeType = 'TextPath';
            this._setDrawFuncs();

            this.dataArray = Kinetic.Path.parsePathData(this.attrs.data);
            this.on('dataChange', function() {
                that.dataArray = Kinetic.Path.parsePathData(this.attrs.data);
            });
            // update text data for certain attr changes
            var attrs = ['text', 'textStroke', 'textStrokeWidth'];
            for(var n = 0; n < attrs.length; n++) {
                var attr = attrs[n];
                this.on(attr + 'Change', that._setTextData);
            }
            that._setTextData();
        },
        drawFunc: function(canvas) {
            var charArr = this.charArr, context = canvas.getContext();

            context.font = this.attrs.fontStyle + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
            context.textBaseline = 'middle';
            context.textAlign = 'left';
            context.save();

            var glyphInfo = this.glyphInfo;
            for(var i = 0; i < glyphInfo.length; i++) {
                context.save();

                var p0 = glyphInfo[i].p0;
                var p1 = glyphInfo[i].p1;
                var ht = parseFloat(this.attrs.fontSize);

                context.translate(p0.x, p0.y);
                context.rotate(glyphInfo[i].rotation);
                this.partialText = glyphInfo[i].text;
                canvas.fillStroke(this);
                context.restore();

                //// To assist with debugging visually, uncomment following
                // context.beginPath();
                // if (i % 2)
                // context.strokeStyle = 'cyan';
                // else
                // context.strokeStyle = 'green';

                // context.moveTo(p0.x, p0.y);
                // context.lineTo(p1.x, p1.y);
                // context.stroke();
            }
            context.restore();
        },
        /**
         * get text width in pixels
         * @name getTextWidth
         * @methodOf Kinetic.TextPath.prototype
         */
        getTextWidth: function() {
            return this.textWidth;
        },
        /**
         * get text height in pixels
         * @name getTextHeight
         * @methodOf Kinetic.TextPath.prototype
         */
        getTextHeight: function() {
            return this.textHeight;
        },
        /**
         * set text
         * @name setText
         * @methodOf Kinetic.TextPath.prototype
         * @param {String} text
         */
        setText: function(text) {
            Kinetic.Text.prototype.setText.call(this, text);
        },
        _getTextSize: function(text) {
            var dummyCanvas = this.dummyCanvas;
            var context = dummyCanvas.getContext('2d');

            context.save();

            context.font = this.attrs.fontStyle + ' ' + this.attrs.fontSize + 'pt ' + this.attrs.fontFamily;
            var metrics = context.measureText(text);

            context.restore();

            return {
                width: metrics.width,
                height: parseInt(this.attrs.fontSize, 10)
            };
        },
        /**
         * set text data.
         */
        _setTextData: function() {

            var that = this;
            var size = this._getTextSize(this.attrs.text);
            this.textWidth = size.width;
            this.textHeight = size.height;

            this.glyphInfo = [];

            var charArr = this.attrs.text.split('');

            var p0, p1, pathCmd;

            var pIndex = -1;
            var currentT = 0;

            var getNextPathSegment = function() {
                currentT = 0;
                var pathData = that.dataArray;

                for(var i = pIndex + 1; i < pathData.length; i++) {
                    if(pathData[i].pathLength > 0) {
                        pIndex = i;

                        return pathData[i];
                    }
                    else if(pathData[i].command == 'M') {
                        p0 = {
                            x: pathData[i].points[0],
                            y: pathData[i].points[1]
                        };
                    }
                }

                return {};
            };
            var findSegmentToFitCharacter = function(c, before) {

                var glyphWidth = that._getTextSize(c).width;

                var currLen = 0;
                var attempts = 0;
                var needNextSegment = false;
                p1 = undefined;
                while(Math.abs(glyphWidth - currLen) / glyphWidth > 0.01 && attempts < 25) {
                    attempts++;
                    var cumulativePathLength = currLen;
                    while(pathCmd === undefined) {
                        pathCmd = getNextPathSegment();

                        if(pathCmd && cumulativePathLength + pathCmd.pathLength < glyphWidth) {
                            cumulativePathLength += pathCmd.pathLength;
                            pathCmd = undefined;
                        }
                    }

                    if(pathCmd === {} || p0 === undefined)
                        return undefined;

                    var needNewSegment = false;

                    switch (pathCmd.command) {
                        case 'L':
                            if(Kinetic.Path.getLineLength(p0.x, p0.y, pathCmd.points[0], pathCmd.points[1]) > glyphWidth) {
                                p1 = Kinetic.Path.getPointOnLine(glyphWidth, p0.x, p0.y, pathCmd.points[0], pathCmd.points[1], p0.x, p0.y);
                            }
                            else
                                pathCmd = undefined;
                            break;
                        case 'A':

                            var start = pathCmd.points[4];
                            // 4 = theta
                            var dTheta = pathCmd.points[5];
                            // 5 = dTheta
                            var end = pathCmd.points[4] + dTheta;

                            if(currentT === 0)
                                currentT = start + 0.00000001;
                            // Just in case start is 0
                            else if(glyphWidth > currLen)
                                currentT += (Math.PI / 180.0) * dTheta / Math.abs(dTheta);
                            else
                                currentT -= Math.PI / 360.0 * dTheta / Math.abs(dTheta);

                            if(Math.abs(currentT) > Math.abs(end)) {
                                currentT = end;
                                needNewSegment = true;
                            }
                            p1 = Kinetic.Path.getPointOnEllipticalArc(pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], currentT, pathCmd.points[6]);
                            break;
                        case 'C':
                            if(currentT === 0) {
                                if(glyphWidth > pathCmd.pathLength)
                                    currentT = 0.00000001;
                                else
                                    currentT = glyphWidth / pathCmd.pathLength;
                            }
                            else if(glyphWidth > currLen)
                                currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                            else
                                currentT -= (currLen - glyphWidth) / pathCmd.pathLength;

                            if(currentT > 1.0) {
                                currentT = 1.0;
                                needNewSegment = true;
                            }
                            p1 = Kinetic.Path.getPointOnCubicBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3], pathCmd.points[4], pathCmd.points[5]);
                            break;
                        case 'Q':
                            if(currentT === 0)
                                currentT = glyphWidth / pathCmd.pathLength;
                            else if(glyphWidth > currLen)
                                currentT += (glyphWidth - currLen) / pathCmd.pathLength;
                            else
                                currentT -= (currLen - glyphWidth) / pathCmd.pathLength;

                            if(currentT > 1.0) {
                                currentT = 1.0;
                                needNewSegment = true;
                            }
                            p1 = Kinetic.Path.getPointOnQuadraticBezier(currentT, pathCmd.start.x, pathCmd.start.y, pathCmd.points[0], pathCmd.points[1], pathCmd.points[2], pathCmd.points[3]);
                            break;

                    }

                    if(p1 !== undefined) {
                        currLen = Kinetic.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);
                    }

                    if(needNewSegment) {
                        needNewSegment = false;
                        pathCmd = undefined;
                    }
                }
            };
            for(var i = 0; i < charArr.length; i++) {

                // Find p1 such that line segment between p0 and p1 is approx. width of glyph
                findSegmentToFitCharacter(charArr[i]);

                if(p0 === undefined || p1 === undefined)
                    break;

                var width = Kinetic.Path.getLineLength(p0.x, p0.y, p1.x, p1.y);

                // Note: Since glyphs are rendered one at a time, any kerning pair data built into the font will not be used.
                // Can foresee having a rough pair table built in that the developer can override as needed.

                var kern = 0;
                // placeholder for future implementation

                var midpoint = Kinetic.Path.getPointOnLine(kern + width / 2.0, p0.x, p0.y, p1.x, p1.y);

                var rotation = Math.atan2((p1.y - p0.y), (p1.x - p0.x));
                this.glyphInfo.push({
                    transposeX: midpoint.x,
                    transposeY: midpoint.y,
                    text: charArr[i],
                    rotation: rotation,
                    p0: p0,
                    p1: p1
                });
                p0 = p1;
            }
        }
    };
    Kinetic.Global.extend(Kinetic.TextPath, Kinetic.Shape);

    // add setters and getters
    Kinetic.Node.addGettersSetters(Kinetic.TextPath, ['fontFamily', 'fontSize', 'fontStyle']);
    Kinetic.Node.addGetters(Kinetic.TextPath, ['text']);

    /**
     * set font family
     * @name setFontFamily
     * @methodOf Kinetic.TextPath.prototype
     * @param {String} fontFamily
     */

    /**
     * set font size
     * @name setFontSize
     * @methodOf Kinetic.TextPath.prototype
     * @param {int} fontSize
     */

    /**
     * set font style.  Can be 'normal', 'italic', or 'bold'.  'normal' is the default.
     * @name setFontStyle
     * @methodOf Kinetic.TextPath.prototype
     * @param {String} fontStyle
     */

    /**
     * get font family
     * @name getFontFamily
     * @methodOf Kinetic.TextPath.prototype
     */

    /**
     * get font size
     * @name getFontSize
     * @methodOf Kinetic.TextPath.prototype
     */

    /**
     * get font style
     * @name getFontStyle
     * @methodOf Kinetic.TextPath.prototype
     */

    /**
     * get text
     * @name getText
     * @methodOf Kinetic.TextPath.prototype
     */
})();
PortletStage = Stage.extend({
    
    /**
     * Alias of renderUIComposition()
     * Subclass can override this method to customize the behavior.
     */
    render: function() {
        this.renderUIComposition();
    },
    
    renew: function(model) {
        this.removeAllChildren();
        this.render(model);
    }

}).implement(CompositionRenderInterface);
HighScoreStage = PortletStage.extend({
    setupDomObject: function(config){
        this._super(config);
        this.renderUIComposition();
        this.registerObserver();
        this.stageUpdated();
    },
    stageUpdated: function(){
        this.reload();
        this.main.setStyle('height',(SC.H-51)+'px');
        this.list = new iScroll(this.main.getId());
        this.stage.access().addClass('hide');
        this.stage.setStyle('z-index','-1');
    },
    reload: function(){
        var table = $("#table");
        table.html('<tr>'
            +'<th>Name</th>'
            +'<th>Time</th>'
            +'</tr>');
        $.each(Storage.gameData.Score, function(i,data){
            if(data.round==Storage.gameData.Round){
                table.append(
                    '<tr>'
                    +'<td>'+data.name+'</td>'
                    +'<td>'+extString.toTime(data.time)+'</td>'
                    +'</tr>'
                );              
            }
        });
    },
    onShowHighScore: function(){
        this.reload();
        this.stage.access().addClass('lightOn');
        this.back.access().removeClass('rotate');
        this.stage.setStyle('z-index','99');
        this.stage.access().removeClass('hide');
    },
    onHideHighScore: function(){
        this.stage.access().removeClass('lightOn');
        this.back.access().addClass('rotate');
        this.stage.setStyle('z-index','-1');
        this.stage.access().addClass('hide');
    },
    clear: function(){
        this.unregisterObserver();
    }
}).implement(PortletInterface, RenderInterface, ObserverInterface);
LoadingStage = PortletStage.extend({
    setupDomObject: function(config){
        this._super(config);
        this.renderUIComposition();
        this.stageUpdated();
    },
    stageUpdated: function(){
        this.bg.access().addClass('lightOn');
        var _self = this;
        this.load.addEventListener('webkitTransitionEnd', function(){
            console.log('Ok ');
            JOOUtils.generateEvent('RequestRoute', new Request('Start'));
        });
       var t = setTimeout(function(){
            _self.load.access().addClass('active');
            clearTimeout(t)
        },100);
    }
}).implement(PortletInterface, RenderInterface);
PlayStage = PortletStage.extend({
    setupDomObject: function(config){
        this._super(config);
        this.renderUIComposition();
        this.registerObserver();
        this.dataModel = Storage.gameData.Images[parseInt(this.config.model.id)];
        this.img = new Image();
        this.img.src = Storage.gameData.Images[parseInt(this.config.model.id)].src;
        this.border = new Image();
        this.border.src = './static/images/cut/cut016.png';
        this.matrixRound = parseInt(this.config.model.round);
        this.item = [];
        this.place = [];
        this.fakePlace = [];
        this.moving =false;
        this.bgMusic = new Audio('./static/sound/clock.mp3');
        this.bgMusic.loop = true;
        this.plus = 1;
        this.stageUpdated();
    },
    stageUpdated: function(){
    	var _self = this;
        this.stage = new Kinetic.Stage({
            container: this.canvas.getId(),
            width: 300,
            height: 300
          });
        this.lenOneItem = parseInt(this.stage.getWidth())/this.matrixRound;
        this.layer = new Kinetic.Layer();
        var _self = this;
        if((SC.W>=640)&&(SC.H>=800)){
            this.canvas.access().css({
                'width': '640px',
                'height': '654px'
            });
            this.stage.content.style.margin = "20px auto";
            this.stage.setWidth(600);
            this.stage.setHeight(600);
            this.plus = 2;
        }
        var t=setTimeout(function(){
            _self.bg.access().addClass('lightOn');
            clearTimeout(t);
        },100);
        this.clock = new Time({
            extclasses: 'time',
            time: 0
        });
        this.barRemote.addChild(this.clock);
        this.image = new Sketch({
            extclasses: 'imageHints'
        });
        this.barRemote.addChild(this.image);
        var image = new JOOImage();
        image.setStyle('background-image','url('+this.img.src+')');
        //image.setStyle('background-position',(-this.dataModel.startCX)+'px '+(-this.dataModel.startCY)+'px');
        this.image.addChild(image);
        this.img.onload = function(){
        	var maxCropSize = Math.min(_self.img.height - ((typeof(_self.dataModel.startCY) != 'undefined')?_self.dataModel.startCY:0),_self.img.width - ((typeof(_self.dataModel.startCX) != 'undefined')?_self.dataModel.startCX:0));
        	console.log((typeof(_self.dataModel.startCY) != 'undefined')?_self.dataModel.startCY:0);
        	_self.cropOneItem = parseInt(maxCropSize)/_self.matrixRound;
        	_self.initPlace();
            _self.initCanvas();
            //_self.initHintImage();
            _self.initPlay();
        };
    },
    initHintImage: function(){
    	var _self = this;
        var hintStage = new Kinetic.Stage({
        	container: this.image.id,
        });
        var hintLayer = new Kinetic.Layer();
    	var hintImage = new Kinetic.Image({
        	image: _self.img,
            crop: {
                x: _self.dataModel.startCX || 0,
                y: _self.dataModel.startCY||0,
                width: _self.img.width||0,
                height: _self.img.height||0
            },
            x: 0,
            y: 0,
            width: _self.image.getWidth(),
            height: _self.image.getHeight()
        });
        hintStage.add(hintLayer);
        hintLayer.add(hintImage);
        console.log(hintImage);
    },
    initPlay: function(){
        this.drawCanvas();
        JOOUtils.generateEvent('TimeStart');
        if(Storage.gameData.Sound){
        	try{
        		this.initAudio();
        	}catch(e){
        		console.log(e);
        		this.bgMusic.play();
        	}
        	
        }
    },
    initAudio: function(){
    	var _self = this;
    	var src = window.location.pathname.substring(0,window.location.pathname.indexOf("index.html"))+"static/sound/clock.mp3";
    	this.phonegapAudio = new Media(src, function(){
			console.log("create success");
		},
		function(error){
			console.log("Error on creating audio player, code:" +error.code);
		},
		function(status){
			if(status == 4){
				_self.phonegapAudio.play();
			}
		});
		this.phonegapAudio.play();
		console.log(src);
    },
    initPlace: function(){
        var x, cX = 0;
        var y, cY = 0;
        var startCX = 0;
        var startCY = 0;
        if(typeof(this.dataModel.startCX) != 'undefined'){startCX = this.dataModel.startCX;} 
        if(typeof(this.dataModel.startCY) != 'undefined'){startCY = this.dataModel.startCY;}
        var _flag = 0;
        for(var i=0;i<this.matrixRound; i++){
            y = i*this.lenOneItem;
            cY = i*this.cropOneItem+startCY;
            for(var j=0;j<this.matrixRound; j++){
                _flag ++;
                x = j*this.lenOneItem;
                cX = j*this.cropOneItem+startCX;
                this.place.push({
                	x:x,
                	y:y,
                	cX: cX,
                	cY: cY,
                	place:_flag,
                	child:_flag,
                	empty: true
                });
            }
        }
    },
    onCheckMove: function(item){
        var place = this.checkEmptyPlace(item);
        if(place){
            this.moveItem(item,place);
        }
    },
    checkEmptyPlace: function(item){
        if(this.place[item.fakePlace+this.matrixRound-1]){
            if(this.place[item.fakePlace+this.matrixRound-1].empty){
                return this.place[item.fakePlace+this.matrixRound-1];
            }
        }
        if(this.place[item.fakePlace-this.matrixRound-1]){
            if(this.place[item.fakePlace-this.matrixRound-1].empty){
                return this.place[item.fakePlace-this.matrixRound-1];
            }
        }
        if(this.place[item.fakePlace]){
            if(this.place[item.fakePlace].empty){
                if((item.fakePlace%this.matrixRound)!=0) return this.place[item.fakePlace];
            }
        }
        if(this.place[item.fakePlace-2]){
            if(this.place[item.fakePlace-2].empty){
                if((item.fakePlace%this.matrixRound)!=1) return this.place[item.fakePlace-2];
            }
        }
        return false;
   },
    moveItem: function(item,place){
        if(!this.moving){
            this.moving = true;
            this.place[item.fakePlace-1].empty = true;
            place.empty = false;
            item.fakePlace = place.place;
            place.child = item.place;
            item.hover = false;
            item.move(place.x*this.plus,place.y*this.plus);
        }
    },
    onMoveEnd: function(){
        this.moving = false;
        if(this.checkFinish()) this.onFinish();
    },
    initCanvas: function(){
        this.fakePlace = extMath.fakePlace8Puzzle(this.matrixRound);
        while(!extMath.check8Puzzle(this.fakePlace)){
            this.fakePlace = extMath.fakePlace8Puzzle(this.matrixRound);
        }
        for(i=1; i<this.place.length; i++){
        	console.log(parseInt(this.img.width)/this.matrixRound, '--', parseInt(this.img.height)/this.matrixRound);
            this.item.push(new CutImage({
            	image:this.img,
            	border:this.border,
            	cX:this.place[i].cX,
            	cY:this.place[i].cY,
            	w:this.cropOneItem,
            	h:this.cropOneItem,
            	pX:this.place[this.fakePlace[i-1]].x*this.plus,
            	pY:this.place[this.fakePlace[i-1]].y*this.plus,
            	pW:this.lenOneItem*this.plus,pH:this.lenOneItem*this.plus,
            	place: this.place[i].place,
            	fakePlace: this.place[this.fakePlace[i-1]].place
            }));
            this.place[i].child = this.place[this.fakePlace[i-1]].place;
            this.place[i].empty = false;
        }
        console.log(this.place);
    },
    drawCanvas: function(){
        var _self = this;
        this.layer.clear();
        this.stage.clear();
        console.log('clear vanvas');
        $.each(this.item, function(i,data){
            _self.drawOne(data);
        });
        this.stage.add(this.layer);
        this.dispatchEvent('drawFinish');
    },
    drawOne: function(cutImg){
        this.layer.add(cutImg.layer);
        this.layer.add(cutImg.border);
    },
    backToSelect: function(){
        JOOUtils.generateEvent('RequestRoute', new Request('SelectMenu',null,null));
    },
    checkFinish: function(){
        var _flag = 0;
        $.each(this.place, function(i,data){
            if(data.place==data.child) _flag++;
        });
        if(_flag==(this.place.length-1))    return true;
        return false;
    },
    onFinish: function(){
        console.log('Finish');
        this.item.push(new CutImage({
        	image:this.img,
        	border:this.border,
        	cX:this.place[0].cX,
        	cY:this.place[0].cY,
        	w:this.cropOneItem,
        	h:this.cropOneItem,
        	pX:this.place[0].x*this.plus,
        	pY:this.place[0].y*this.plus,
        	pW:this.lenOneItem*this.plus,pH:this.lenOneItem*this.plus,
        	place: this.place[0].place,
        	fakePlace: this.place[0].place
        }));
        if(Storage.gameData.Vibrate){
        	try{
            	navigator.notification.vibrate(1000);
            }catch(e){
            	console.log(e);
            }
        }
        this.drawCanvas();
        this.place[0].empty = false;
        JOOUtils.generateEvent('ShowFinish',this.clock.getTime());
        try{
        	this.phonegapAudio.pause();
        }catch(e){
	        this.bgMusic.pause();
        }
        JOOUtils.generateEvent('TimeEnd');
    },
    clear: function(){
        this.clock.clear();
        this.place = [];
        this.item = [];
        clearInterval(this.interval);
        try{
        	this.phonegapAudio.pause();
        }catch(e){
        	console.log(e);
	        this.bgMusic.pause();
	        delete this.clock;
	        delete this.bgMusic;
        }
    }
}).implement(PortletInterface, RenderInterface, ObserverInterface);

CutImage = Class.extend({
    init: function(config){
        this.place = config.place||0;
        this.fakePlace = config.fakePlace||0;
        this.layer = new Kinetic.Image({
            image: config.image,
            crop: {
                x:config.cX||0,
                y:config.cY||0,
                width: config.w||0,
                height: config.h||0
            },
            x: config.pX||0,
            y: config.pY||0,
            width: config.pW||0,
            height: config.pH||0
          });
        this.border = new Kinetic.Image({
            image: config.border,
            x: config.pX||0,
            y: config.pY||0,
            width: config.pW||0,
            height: config.pH||0,
        });
        this.hover = false;
        this.eventListener();
    },
    eventListener: function(){
        var _self = this;
        this.border.on('click',function(){
            _self.hover = true;
            JOOUtils.generateEvent('CheckMove', _self);
        });
    },
    move: function(x,y){
        var _self = this;
        this.layer.transitionTo({
            x: x,
            y: y,
            duration: 0.1,
            easing: 'ease-in-out'
          });
        this.border.transitionTo({
            x: x,
            y: y,
            duration: 0.1,
            easing: 'ease-in-out',
            callback: function() {
                JOOUtils.generateEvent('MoveEnd');
              }
          });
    }
});
SelectMenuStage = PortletStage.extend({
    setupDomObject: function(config){
        this._super(config);
        this.renderUIComposition();
        this.stageUpdated();
    },
    stageUpdated: function(){
        var _self = this;
        this.imageContainer.setStyle('width',139*parseInt(SC.W/139)+'px');
        this.main.setStyle('height',(SC.H-51)+'px');
        this.list = new iScroll(this.main.getId());
        var t=setTimeout(function(){
            _self.bg.access().addClass('lightOn');
            clearTimeout(t);
        },100);
    },
    importClose: function(){
    	console.log("close");
    	this["import-prompt"].access().css({
			'-webkit-transform': 'translateY(-120%)',
			'-moz-transform': 'translateY(-120%)',
			'-o-transform': 'translateY(-120%)',
			'-ms-transform': 'translateY(-120%)',
			'transform': 'translateY(-120%)',
	    });
    },
    importOpen: function(){
    	console.log("open");
    	this["import-prompt"].access().css({
    		'-webkit-transform': 'translateY(0%)',
    		'-moz-transform': 'translateY(0%)',
    		'-o-transform': 'translateY(0%)',
    		'-ms-transform': 'translateY(0%)',
    		'transform': 'translateY(0%)',
    	});
    },
    importImage: function(sourceType){
    	var _self = this;
    	var onPhotoDataSuccess = function(imagedata){
    		console.log(imagedata);
    		_self.initCrop(imagedata);
    	};
    	var onFail = function(message){
    		console.log(message);
    	};
    	navigator.camera.getPicture(onPhotoDataSuccess, onFail, {
    		quality : 100,
    		destinationType : Camera.DestinationType.FILE_URI,
    		//destinationType : Camera.DestinationType.DATA_URL,
    		sourceType: sourceType,
    		allowEdit : false, // only on iOS
    		encodingType: Camera.EncodingType.PNG,
    		targetWidth: 300,
    		targetHeight: 300,
    		mediaType: Camera.MediaType.PICTURE,
    		correctOrientation: true, //Rotate the image to correct for the orientation of the device during capture.
    		saveToPhotoAlbum: true,
    		/*popoverOptions: { // only for iOS
    			x: 0,
    			y:  0,
    			width: 300,
    			height: 300,
    			arrowDir: Camera.PopoverArrowDirection.ARROW_ANY
    		},*/
    	});
    },
    cropOk: function(imagedata){
    	console.log(this.cropImg);
    	var tmp = {
	        id: gameData[gameData.length-1].id + 1,
	        src: imagedata,
	        startCX: -this.cropImg.getPosition().x,
	        startCY: -this.cropImg.getPosition().y
		};
		Storage.add(tmp);
		this.reloadStage();
    	this["crop-image"].access().css({
			'-webkit-transform': 'translateY(-120%)',
			'-moz-transform': 'translateY(-120%)',
			'-o-transform': 'translateY(-120%)',
			'-ms-transform': 'translateY(-120%)',
			'transform': 'translateY(-120%)',
	    });
    },
    initCrop: function(imagedata){
    	console.log("initCrop");
    	var _self = this;
	    this["crop-image"].access().css({
    		'-webkit-transform': 'translateY(0%)',
    		'-moz-transform': 'translateY(0%)',
    		'-o-transform': 'translateY(0%)',
    		'-ms-transform': 'translateY(0%)',
    		'transform': 'translateY(0%)',
    	});
    	_self["crop-img-container"].access()[0].innerHTML = '';
    	var imageObj = new Image();
    	imageObj.onload = function(){ 
    		var frameSize = Math.min(_self["crop-img-container"].access()[0].clientWidth, imageObj.width, imageObj.height) - 20;
    		var stage_image = new Kinetic.Stage({
    			container: _self["crop-img-container"].id,
    			width: frameSize,
    			height: frameSize,
    		});
    		var layer_image = new Kinetic.Layer();
    		var resizeImage;
    		_self.cropImg = new Kinetic.Image({
    			image: imageObj,
    			x: 0,
    			y: 0,
    			draggable: true,
    			dragBoundFunc: function(pos){
					var newY = (pos.y > 0 ? 0 : pos.y) && (pos.y < (-(_self.cropImg.getHeight() - stage_image.getHeight())) ? (-(_self.cropImg.getHeight() - stage_image.getHeight())) : pos.y);
					var newX = (pos.x > 0 ? 0: pos.x) && (pos.x < (-(_self.cropImg.getWidth() - stage_image.getWidth())) ? (-(_self.cropImg.getWidth() - stage_image.getWidth())) : pos.x);
					return {
						x: newX,
						y: newY
					};
				}
	        });
	        layer_image.add(_self.cropImg);
	        stage_image.add(layer_image);
    	};
    	imageObj.src = imagedata;
    	this.importClose();
    	this["crop-ok-btn"].addEventListener("click", function(){
    		_self.cropOk(imagedata);
    	});
    },
    saveImage: function(imagedata){
    	var _self = this;
		//var imagedata = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";
	    //imagedata = imagedata.substr(22);
	    //var imagedata = '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDABALDA4MChAODQ4SERATGCgaGBYWGDEjJR0oOjM9PDkzODdASFxOQERXRTc4UG1RV19iZ2hnPk1xeXBkeFxlZ2P/2wBDARESEhgVGC8aGi9jQjhCY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2NjY2P/wAARCAEsAOEDASIAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwDJHFFJS1mWLSim9qUUFXHCnimCnLTC5IKcBTVp4p3FcKKXFGKQXEopcUuKQxKUCgCnYp3EAopRRTFcSmmnUhpDuMNNNONNNIdxKKDRQMO9LTaKYhc0meKM0maYriGmGnGm0gG4op1FAEdFJRSEhaUUmaUUDHCpFpgp6imIkWngcU1KeBTEKKMUoFLikMbijFOxSgUhjQKUCnYpQKaENxRinYoxTENxTTTyOKaRSGiM00080w0ihtFBooASiiimISkNLTTQIQ0lKaSgYmaKOaKQEdFFAoEgFOHWkFOFMBy1ItMWpEFAEi1IBTUFSqKoTAClApQKcFpAMApcVIFpQtICPbRipdtAWmBHijFSFaQimIiIpjCpiKYRSGQmmEVKRTCKkZGRSU49aQ0DG4opaSmDEpKdSEUCGGkp1JQMSijBooC5FS0lLiglAKcKQU4UDHLUyCo1FSoKYiVBUqimIKlUUxDgKeq0KtSqtADAlPCVKqVII6Qyvso2Va8ukKUxFUpTGWrbJUTLTEViKjIqdlqJhSGiEio2FTMKjapGiI02nkU00ihtFLRimhCUmKdikxQAw0lOxSUhjaKWigZDSgUUuKCEApwFIKeBTGOUVMgqJamQU0STJUyCokqZBVCJUFTKKZGKsxoGGKBD4omf7qk/QZq3HYTsP9WR/vcVrwYaJHwMlRk1LQMyl0yQ/eKj9aedMCxk+YdwGeBWlSUAc48ftVd061p3Me2Rh71SkWmIpOtQMKtutV3FIZWYVGRUzCoyKkpERFMqQim1IDMUU7FGOKYxuKTFOptADSKTFONJikMSiiigLkNFLRQSKKcKaKeKYD1qZKiWpkqkImSpkqFKnSmSTpVuGqiVaioA3dPfdBtz901arO058Pt9RWjQMWiiigChep8+fUVnSr1rYu1ygPpWbKtMRnyLVZxV2QVVkFJgVHFQsKsOKhapKIiKYRUhFNIpDGUUuKKAGmm0+mmgBhopTSUigxRR+FFK4EAoopaZAopy00U4Uxki1MlQrUyVSJZMlTJUKVOlMRPHVqKqqVZjNAi/bPsYN6Vsg5GawojWxavugX1HFAyaiiigYyUboyKzJV61q1nTrgkU0JmdKKqSCr0oqnIKTEio4qBhVlxUDVJSITTTT2ppoGMpKcaTFADTTTTzTTSGMNJTjSUhiUUvHpRQO5BRRRTIQopy00U5aEMkSp0qBKnSqRJMlSpUK1KhpklhDU6Gq6GpkNAFyI1q6e/3l9eaxozV+0k2yqe1CGa1LSUtAwqndL8xq5Ve6Hyg0CZlTCqUo61fmHWqUooEU3FQMKsuKrtUlELUw1I1MNAxtJSmkoENpppxppoGhpptONNqRi0UlFA9SKilpKBAKctNpwpgSLUyVCtSpVIlky1KtQrUqmmSTqalQ1ApqVTQBajNW4TVGM1aiPNIZvQtviVvapKq2D5iK+hq1TGFRzjMZ9qkpGGVIoAyJh1qjKOtaMw61QlHWhklJxVd6syVWepKImqM1I1RmgBKaaU0hoAaaaaU000hjTSUpptIYv40UYopDsRmkp9NpiEpwptOFMB61KlRCpENUiSdakU1EtPBpiJVNTIarg1KpoAsoasxNVNDVmM0gNawfEoHqMVpVhwPtII7HNbikMoI6EZpghaSlooGZ10uHNZs3eta+XkGsqbvTJKUlVXq1JVV6goiaozT2phoAaaaaUmkoAaaaaU000hiGm0ppKQwzRRRRYBDTaeabQISlFJSigY5akWoxT1qkImU1IDUKmpAaoklBp6moQaeDSAsIasRtVNWqZGpDNGFq27J99uPVeK52J619Mm+dkPcZqkI06SgEHpTS6jqRQMgvh+6B9Kxpj1rcuhut2H61z8zdaBFaQ9aquankNVnNSMjY0w0rGmE0gENNJpTTc0wCmmlNNNIaENJQaSkMX8KKbRTFccaQ0ppDUjQ2lFFFMY4U8VGKeKaJZItPBqNacDVCJAacDUeaUGkBMpqRGquDT1NAF2N6uW05jkV+uD0rLR6nSSmhHQrqaAfLEcf71I2oIT/AKkf99f/AFqx1l4o833qhGrLqh2FfJXBGPv/AP1qyJnySc8nmh5OKrO9IY2RqgY052qFmqRiE0wmhmphNIYuaTNJmkzQAtNNLmkoBDTRQaSkMKKOaKAsOzSGjNJUjCikopoB1OFNFOFUhMeKcKaKUUyR2aUGm0vNIY4GnA0wA+hpwDehoAlVqkVqhCt/dP5U8Bv7p/KmhE6yUu+oQG/umlw3oaYh7PUTNQc1ExxSuAM1RM1NeUDvULTqO9SVYkJppNQm4SmG6QetAyxmjNVftaeho+2L6GmItZpCaq/ax6Gj7UD0WgdiwTzRmq32rnG2n+ac9KkCbNFQ+b7UUDEWViOTTg59ajVc1IqUCHA09SKRY6lSKgYqY9BU6BfQUiQirMcI9KBDVA9BUgA9BUqQL6VMIF9KZJWH0pc1aEC+lL5C+lIZUyaNxq15C+lJ5K+lIZW3GjefWrHlL6UnlL6UAV95ppY1Z8segpjIPSqRJVZjVeU1cdB6VVuCEXPFDY0UZDVd6neVT6VCzj2pXGQtmmEGpiwphYetFwIuaMGpAR60uR607gRYNLUmRSZFFwGgc1OPug1H2zT0OVNK4Ds0UYooHcmUU5euKcF4pyrgUhIcgqdKiUVKlAyeOrEdVkNTI1CEW0NSg1WVqeHpiLGaN1Q76TfSGTbqQsKh30hekBKWFNLVEXppegCQtTGamF6o3ep29tkM4Z/7oqhFt2rOvnXgE9aoSavJNnBEY9utUZ5i5OXY+5p2bGi8Qn979aYQn979ayGlYdDn8ai85s9aOULmyxjX+KojJH2zWcs4H31z+NTxyWz9cg+5otYLltXj75qQeWehqusULdMn8acLeL3/ADpaAT7U9f1o2J61B5Efv+dHkR+/50hkx2hDg0+AZQk+tVRBGAW5yPerVt/ql96EBNtFFLiimItbaXFSfL6ikOPUUgGgU9TTeKUUDJVNSq1V8003CRHDnmmhF4PTw9UBew/3v0p4vIf74oAu76N9U/tUX98fnS/aYv8Anov50mBa3+9NL1XE8Z/jH50een94fnSGT7qa0gUEk4AqLzU/vCsbWdR4MER/3jTWoDdT1hpC0VuxVehYdTWMzgnnNRsxJpma1SsTcl83H3eKQuWH3qiyKTdTEKT702jNJQAUobFJRQBMkhBypxVqO6I4bk1RXB65p7LtGc5H5Um';
	    var filename = new Date().getTime()+'.png';
	    window.plugins.base64ToPNG.saveImage(imagedata, {filename: filename, folder: '/com.windjs.puzzlegame', overwrite: true},
	    	function(result){
	    		console.log(result);
				var tmp = {
			        id: gameData[gameData.length-1].id + 1,
			        src: result
				};
				Storage.add(tmp);
				_self.reloadStage();
	       }, function(error) {
	          console.log("failed");
	    });
    },
    removeImage: function(idx){
    	Storage.remove(idx);
    	this.reloadStage();
    },
    reloadStage: function(){
    	this.removeAllChildren();
    	this.renderUIComposition();
    	this.stageUpdated();
    },
    backToStart: function(){
        JOOUtils.generateEvent('RequestRoute', new Request('Start',null,null));
    },
    toPlay: function(i){
    	var _self  = this;
        JOOUtils.generateEvent('RequestRoute', new Request('Play',null,{id:i,round:Storage.gameData.Round}));
    },
    clear: function(){
    	
    }
}).implement(PortletInterface, RenderInterface);
SettingsStage = PortletStage.extend({
    setupDomObject: function(config){
        this._super(config);
        this.renderUIComposition();
        this.registerObserver();
        this._flagSound = Storage.gameData.Sound||false;
        this._flagVibrate = Storage.gameData.Vibrate||false;
        this._flagLevel = Storage.gameData.Round||2;
        this.stageUpdated();
    },
    stageUpdated: function(){
        var _self = this;
        this.stage.access().addClass('hide');
        this.stage.setStyle('z-index','-1');
        if(this._flagSound){
            this.sound.access().addClass('active');
        }
        if(this._flagVibrate){
            this.vibrate.access().addClass('active');
        }
        this.level.access().text(this._flagLevel+'x'+this._flagLevel); 
        this.sound.addEventListener('click', function(){
           if(_self._flagSound){
               _self.sound.access().removeClass('active'); 
               _self._flagSound = false;
           }
           else{
               _self.sound.access().addClass('active'); 
               _self._flagSound = true;
           }
           Storage.gameData.Sound = _self._flagSound;
           Storage.setLocal();
        });
        this.vibrate.addEventListener('click', function(){
            if(_self._flagVibrate){
                _self.vibrate.access().removeClass('active'); 
                _self._flagVibrate = false;
            }
            else{
                _self.vibrate.access().addClass('active'); 
                _self._flagVibrate = true;
            }
            Storage.gameData.Vibrate = _self._flagVibrate;
            Storage.setLocal();
        });
        this.level.addEventListener('click', function(){
           if(_self._flagLevel<5){
               _self._flagLevel++;
               _self.level.access().text(_self._flagLevel+'x'+_self._flagLevel); 
           }
           else{
               _self._flagLevel = 2;
               _self.level.access().text(_self._flagLevel+'x'+_self._flagLevel); 
           }
           Storage.gameData.Round = _self._flagLevel;
           Storage.setLocal();
        });
    },
    onShowSettings: function(){
        this.stage.access().addClass('lightOn');
        this.back.access().removeClass('rotate');
        this.stage.setStyle('z-index','99');
        this.stage.access().removeClass('hide');
    },
    onHideSettings: function(){
        this.stage.access().removeClass('lightOn');
        this.back.access().addClass('rotate');
        this.stage.setStyle('z-index','-1');
        this.stage.access().addClass('hide');
    },
    clear: function(){
        this.unregisterObserver();
    }
}).implement(PortletInterface, RenderInterface, ObserverInterface);
StartStage = PortletStage.extend({
    setupDomObject: function(config){
        this._super(config);
        this.renderUIComposition();
        this.stageUpdated();
    },
    stageUpdated: function(){
        var _self = this;
        var t=setTimeout(function(){
            _self.bg.access().addClass('lightOn');
            clearTimeout(t);
        },100);
        //this.showAd();
    },
    newGame: function(){
        JOOUtils.generateEvent('RequestRoute', new Request('SelectMenu',null,null));
    },
    highScore: function(){
        JOOUtils.generateEvent('ShowHighScore');
    },
    settings: function(){
        JOOUtils.generateEvent('ShowSettings');
    },
    showAd: function(){
    	if( window.AdMob ) {
            var adIdiOS = 'INSERT_YOUR_PUBLISHER_ID_HERE';
            var adIdAndroid = 'a1530390171358b';
            var adId = (navigator.userAgent.indexOf('Android') >=0) ? adIdAndroid : adIdiOS;
            
        	var am = window.AdMob;
        	am.createBannerView( 
        		{
        		'publisherId' : adId,
				'adSize' : am.AD_SIZE.BANNER,
				'bannerAtTop' : true
        		}, 
        		function() {
        			am.requestAd({
					'isTesting' : true,
					'extras' : {
						'color_bg' : 'AAAAFF',
						'color_bg_top' : 'FFFFFF',
						'color_border' : 'FFFFFF',
						'color_link' : '000080',
						'color_text' : '808080',
						'color_url' : '008000'
					}}, 
					function() {}, 
					function() {
						console.log('Error requesting Ad');
					});
				}, 
				function() {
					console.log('Error create Ad Banner');
				}
			);
        } else {
        	alert( 'AdMob plugin not loaded.' );
        }
    },
    clear: function(){
    	
    }
}).implement(PortletInterface, RenderInterface);

BuButton = Sketch.extend({
    setupDomObject: function(config){
        this._super(config);
        this.stageUpdated();
    },
    stageUpdated: function(){
        var _self = this;
        this.setStyle('-webkit-transition','100ms ease-in-out');
        this.addEventListener('click',function(){
            _self.click();
        });
    },
    click: function(){
        var _self = this;
        this.access().css('-webkit-transform','scale(1.1,1.1)');
        var t = setTimeout(function(){
            _self.access().css('-webkit-transform','scale(1,1)');
            clearTimeout(t);
        },200);
    },
    clear: function(){
    	
    }
});
FinishStage = PortletStage.extend({
    setupDomObject: function(config){
        this._super(config);
        this.renderUIComposition();
        this.registerObserver();
        this.stageUpdated();
    },
    stageUpdated: function(){
        this.stage.access().addClass('hide');
    },
    onShowFinish: function(time){
        this.varTime = time;
        this.time.access().text(extString.toTime(this.varTime));
        this.stage.access().removeClass('hide');
    },
    onBackToMenu: function(){
        JOOUtils.generateEvent('RequestRoute', new Request('SelectMenu',null,null));
    },
    savePoint: function(){
        var input = this.input.access().val();
        if(input.length>0){
            Storage.gameData.Score.push({name: input, time: this.varTime, round: parseInt(this.config.model.round)});
            Storage.setLocal();
            this.onBackToMenu();
        }
    },
    clear: function(){
        this.unregisterObserver();
    }
}).implement(PortletInterface, RenderInterface, ObserverInterface);
ScreenPropertiesPlugin = Class.extend({
    
    onBegin: function(){
        SC = {
            W: window.innerWidth,
            H: window.innerHeight
        };
    },
    
    onEnd: function() {
        
    }
}).implement(PluginInterface);
LoadingPortlet = RenderPortlet.extend({
    run : function() {
        var _self = this;
        this._super();
        this.requestConfig = this.getRequest().getParams();
        var portletCanvas = this.getPortletPlaceholder().getCanvas();
        this.stage = new LoadingStage({
            id: portletCanvas.getId(),
            model: this.model
        });
    },
    onEnd: function(){
        console.log('End Load');
        clearInterval(this.frogInterval);
        delete this.stage;
    }
}).implement(PortletInterface, RenderInterface);
PlayPortlet = RenderPortlet.extend({
    run : function() {
        var _self = this;
        this._super();
        this.requestConfig = this.getRequest().getParams();
        console.log(this.requestConfig);
        this.model = JOOModel.from({
            round:  this.requestConfig.round||2,
            id: this.requestConfig.id||1
        });
        var portletCanvas = this.getPortletPlaceholder().getCanvas();
        this.stage = new PlayStage({
            id: portletCanvas.getId(),
            model: this.model
        });
        this.finish = new FinishStage({
            id: portletCanvas.getId(),
            model: this.model
        });
    },
    onEnd: function(){
        console.log('End Play');
        clearInterval(this.frogInterval);
        this.stage.clear();
        this.finish.clear();
        delete this.finish;
        delete this.stage;
    }
}).implement(PortletInterface, RenderInterface);
SelectMenuPortlet = RenderPortlet.extend({
    run : function() {
        var _self = this;
        this._super();
        this.requestConfig = this.getRequest().getParams();
        var portletCanvas = this.getPortletPlaceholder().getCanvas();
        this.stage = new SelectMenuStage({
            id: portletCanvas.getId(),
            model: this.model
        });
    },
    onEnd: function(){
        console.log('End Select');
        clearInterval(this.frogInterval);
        delete this.stage;
    }
}).implement(PortletInterface, RenderInterface);
StartPortlet = RenderPortlet.extend({
    run : function() {
        var _self = this;
        this._super();
        this.requestConfig = this.getRequest().getParams();
        var portletCanvas = this.getPortletPlaceholder().getCanvas();
        this.stage = new StartStage({
            id: portletCanvas.getId(),
            model: this.model
        });
        this.score = new HighScoreStage({
            id: portletCanvas.getId()
        });
        this.settings = new SettingsStage({
            id: portletCanvas.getId()
        });
    },
    onEnd: function(){
        console.log('End Start');
        clearInterval(this.frogInterval);
        delete this.stage;
        this.score.clear();
        this.settings.clear();
        delete this.score;
        delete this.settings;
    }
}).implement(PortletInterface, RenderInterface);
ClassMapping = {};
for(var i in window) {
	if (typeof window[i] == 'function' && window[i].prototype && window[i].prototype.currentClass) {
		window[i].prototype.className = i;
		ClassMapping[i.toLowerCase()] = i;
	}
}
/**
 * Entrypoint of JOO Application.
 * Register bootstrap, initialize system properties
 * and bind startup events
 * @param templateFile {String} the application's view
 */
function main(templateFile) {
	//Try to guest the base URL of the application
	var hashIndex = window.location.href.indexOf('#');
	if (hashIndex == -1) {
		ApplicationRoot = window.location.href;
	} else {
	    
		ApplicationRoot = window.location.href.substr(0, hashIndex);
	}
	var htmlIndex = ApplicationRoot.indexOf('.html');
	if (htmlIndex != -1) {
		ApplicationRoot = ApplicationRoot.substr(0, htmlIndex);
		var slashIndex = ApplicationRoot.lastIndexOf("/");
		if (slashIndex != -1)
			ApplicationRoot = ApplicationRoot.substr(0, slashIndex);
	}
	
	//register bootstrap
	var bootstrap = new Bootstrap();
	var app = SingletonFactory.getInstance(Application);
	app.getSystemProperties().set("host.root", ApplicationRoot);
	app.getSystemProperties().set("page.default", "Home");
	app.setBootstrap(bootstrap);
	Request.setProactive(true);

	//bind neccessary events
	$(window).bind("hashchange", function(){
	    if (Request.getProactive != true) {
	        var subject = SingletonFactory.getInstance(Subject);
	        subject.notifyEvent('NeedAssembleRequest');
	    }
	    Request.setProactive(false);
	});
	
	//start the application when the outer document is ready
	$(document).ready(function()	{
		$.get(ApplicationRoot+templateFile, {}, function(ret)	{
			var useragent = navigator.userAgent;
			if (useragent.indexOf('MSIE') != -1)	{
				$('#Application-Main').html(ret);
			} else {
				document.getElementById('Application-Main').innerHTML = ret;
			}
			app.begin();
		});
	});
}

if (typeof window['updateTracker'] != 'undefined')
	updateTracker(1);
