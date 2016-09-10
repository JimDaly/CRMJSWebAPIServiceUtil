//Don't overwrite native promise
if (!window.Promise) {
    /*!
     * @overview es6-promise - a tiny implementation of Promises/A+.
     * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
     * @license   Licensed under MIT license
     *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
     * @version   3.0.2
     */

    (function () { "use strict"; function lib$es6$promise$utils$$objectOrFunction(x) { return typeof x === "function" || typeof x === "object" && x !== null } function lib$es6$promise$utils$$isFunction(x) { return typeof x === "function" } function lib$es6$promise$utils$$isMaybeThenable(x) { return typeof x === "object" && x !== null } var lib$es6$promise$utils$$_isArray; if (!Array.isArray) { lib$es6$promise$utils$$_isArray = function (x) { return Object.prototype.toString.call(x) === "[object Array]" } } else { lib$es6$promise$utils$$_isArray = Array.isArray } var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray; var lib$es6$promise$asap$$len = 0; var lib$es6$promise$asap$$toString = {}.toString; var lib$es6$promise$asap$$vertxNext; var lib$es6$promise$asap$$customSchedulerFn; var lib$es6$promise$asap$$asap = function asap(callback, arg) { lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback; lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg; lib$es6$promise$asap$$len += 2; if (lib$es6$promise$asap$$len === 2) { if (lib$es6$promise$asap$$customSchedulerFn) { lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush) } else { lib$es6$promise$asap$$scheduleFlush() } } }; function lib$es6$promise$asap$$setScheduler(scheduleFn) { lib$es6$promise$asap$$customSchedulerFn = scheduleFn } function lib$es6$promise$asap$$setAsap(asapFn) { lib$es6$promise$asap$$asap = asapFn } var lib$es6$promise$asap$$browserWindow = typeof window !== "undefined" ? window : undefined; var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {}; var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver; var lib$es6$promise$asap$$isNode = typeof process !== "undefined" && {}.toString.call(process) === "[object process]"; var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== "undefined" && typeof importScripts !== "undefined" && typeof MessageChannel !== "undefined"; function lib$es6$promise$asap$$useNextTick() { return function () { process.nextTick(lib$es6$promise$asap$$flush) } } function lib$es6$promise$asap$$useVertxTimer() { return function () { lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush) } } function lib$es6$promise$asap$$useMutationObserver() { var iterations = 0; var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush); var node = document.createTextNode(""); observer.observe(node, { characterData: true }); return function () { node.data = iterations = ++iterations % 2 } } function lib$es6$promise$asap$$useMessageChannel() { var channel = new MessageChannel; channel.port1.onmessage = lib$es6$promise$asap$$flush; return function () { channel.port2.postMessage(0) } } function lib$es6$promise$asap$$useSetTimeout() { return function () { setTimeout(lib$es6$promise$asap$$flush, 1) } } var lib$es6$promise$asap$$queue = new Array(1e3); function lib$es6$promise$asap$$flush() { for (var i = 0; i < lib$es6$promise$asap$$len; i += 2) { var callback = lib$es6$promise$asap$$queue[i]; var arg = lib$es6$promise$asap$$queue[i + 1]; callback(arg); lib$es6$promise$asap$$queue[i] = undefined; lib$es6$promise$asap$$queue[i + 1] = undefined } lib$es6$promise$asap$$len = 0 } function lib$es6$promise$asap$$attemptVertx() { try { var r = require; var vertx = r("vertx"); lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext; return lib$es6$promise$asap$$useVertxTimer() } catch (e) { return lib$es6$promise$asap$$useSetTimeout() } } var lib$es6$promise$asap$$scheduleFlush; if (lib$es6$promise$asap$$isNode) { lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick() } else if (lib$es6$promise$asap$$BrowserMutationObserver) { lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver() } else if (lib$es6$promise$asap$$isWorker) { lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel() } else if (lib$es6$promise$asap$$browserWindow === undefined && typeof require === "function") { lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx() } else { lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout() } function lib$es6$promise$$internal$$noop() { } var lib$es6$promise$$internal$$PENDING = void 0; var lib$es6$promise$$internal$$FULFILLED = 1; var lib$es6$promise$$internal$$REJECTED = 2; var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject; function lib$es6$promise$$internal$$selfFulfillment() { return new TypeError("You cannot resolve a promise with itself") } function lib$es6$promise$$internal$$cannotReturnOwn() { return new TypeError("A promises callback cannot return that same promise.") } function lib$es6$promise$$internal$$getThen(promise) { try { return promise.then } catch (error) { lib$es6$promise$$internal$$GET_THEN_ERROR.error = error; return lib$es6$promise$$internal$$GET_THEN_ERROR } } function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) { try { then.call(value, fulfillmentHandler, rejectionHandler) } catch (e) { return e } } function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) { lib$es6$promise$asap$$asap(function (promise) { var sealed = false; var error = lib$es6$promise$$internal$$tryThen(then, thenable, function (value) { if (sealed) { return } sealed = true; if (thenable !== value) { lib$es6$promise$$internal$$resolve(promise, value) } else { lib$es6$promise$$internal$$fulfill(promise, value) } }, function (reason) { if (sealed) { return } sealed = true; lib$es6$promise$$internal$$reject(promise, reason) }, "Settle: " + (promise._label || " unknown promise")); if (!sealed && error) { sealed = true; lib$es6$promise$$internal$$reject(promise, error) } }, promise) } function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) { if (thenable._state === lib$es6$promise$$internal$$FULFILLED) { lib$es6$promise$$internal$$fulfill(promise, thenable._result) } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) { lib$es6$promise$$internal$$reject(promise, thenable._result) } else { lib$es6$promise$$internal$$subscribe(thenable, undefined, function (value) { lib$es6$promise$$internal$$resolve(promise, value) }, function (reason) { lib$es6$promise$$internal$$reject(promise, reason) }) } } function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) { if (maybeThenable.constructor === promise.constructor) { lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable) } else { var then = lib$es6$promise$$internal$$getThen(maybeThenable); if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) { lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error) } else if (then === undefined) { lib$es6$promise$$internal$$fulfill(promise, maybeThenable) } else if (lib$es6$promise$utils$$isFunction(then)) { lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then) } else { lib$es6$promise$$internal$$fulfill(promise, maybeThenable) } } } function lib$es6$promise$$internal$$resolve(promise, value) { if (promise === value) { lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment()) } else if (lib$es6$promise$utils$$objectOrFunction(value)) { lib$es6$promise$$internal$$handleMaybeThenable(promise, value) } else { lib$es6$promise$$internal$$fulfill(promise, value) } } function lib$es6$promise$$internal$$publishRejection(promise) { if (promise._onerror) { promise._onerror(promise._result) } lib$es6$promise$$internal$$publish(promise) } function lib$es6$promise$$internal$$fulfill(promise, value) { if (promise._state !== lib$es6$promise$$internal$$PENDING) { return } promise._result = value; promise._state = lib$es6$promise$$internal$$FULFILLED; if (promise._subscribers.length !== 0) { lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise) } } function lib$es6$promise$$internal$$reject(promise, reason) { if (promise._state !== lib$es6$promise$$internal$$PENDING) { return } promise._state = lib$es6$promise$$internal$$REJECTED; promise._result = reason; lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise) } function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) { var subscribers = parent._subscribers; var length = subscribers.length; parent._onerror = null; subscribers[length] = child; subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment; subscribers[length + lib$es6$promise$$internal$$REJECTED] = onRejection; if (length === 0 && parent._state) { lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent) } } function lib$es6$promise$$internal$$publish(promise) { var subscribers = promise._subscribers; var settled = promise._state; if (subscribers.length === 0) { return } var child, callback, detail = promise._result; for (var i = 0; i < subscribers.length; i += 3) { child = subscribers[i]; callback = subscribers[i + settled]; if (child) { lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail) } else { callback(detail) } } promise._subscribers.length = 0 } function lib$es6$promise$$internal$$ErrorObject() { this.error = null } var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject; function lib$es6$promise$$internal$$tryCatch(callback, detail) { try { return callback(detail) } catch (e) { lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e; return lib$es6$promise$$internal$$TRY_CATCH_ERROR } } function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) { var hasCallback = lib$es6$promise$utils$$isFunction(callback), value, error, succeeded, failed; if (hasCallback) { value = lib$es6$promise$$internal$$tryCatch(callback, detail); if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) { failed = true; error = value.error; value = null } else { succeeded = true } if (promise === value) { lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn()); return } } else { value = detail; succeeded = true } if (promise._state !== lib$es6$promise$$internal$$PENDING) { } else if (hasCallback && succeeded) { lib$es6$promise$$internal$$resolve(promise, value) } else if (failed) { lib$es6$promise$$internal$$reject(promise, error) } else if (settled === lib$es6$promise$$internal$$FULFILLED) { lib$es6$promise$$internal$$fulfill(promise, value) } else if (settled === lib$es6$promise$$internal$$REJECTED) { lib$es6$promise$$internal$$reject(promise, value) } } function lib$es6$promise$$internal$$initializePromise(promise, resolver) { try { resolver(function resolvePromise(value) { lib$es6$promise$$internal$$resolve(promise, value) }, function rejectPromise(reason) { lib$es6$promise$$internal$$reject(promise, reason) }) } catch (e) { lib$es6$promise$$internal$$reject(promise, e) } } function lib$es6$promise$enumerator$$Enumerator(Constructor, input) { var enumerator = this; enumerator._instanceConstructor = Constructor; enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop); if (enumerator._validateInput(input)) { enumerator._input = input; enumerator.length = input.length; enumerator._remaining = input.length; enumerator._init(); if (enumerator.length === 0) { lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result) } else { enumerator.length = enumerator.length || 0; enumerator._enumerate(); if (enumerator._remaining === 0) { lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result) } } } else { lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError()) } } lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function (input) { return lib$es6$promise$utils$$isArray(input) }; lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function () { return new Error("Array Methods must be provided an Array") }; lib$es6$promise$enumerator$$Enumerator.prototype._init = function () { this._result = new Array(this.length) }; var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator; lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function () { var enumerator = this; var length = enumerator.length; var promise = enumerator.promise; var input = enumerator._input; for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) { enumerator._eachEntry(input[i], i) } }; lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function (entry, i) { var enumerator = this; var c = enumerator._instanceConstructor; if (lib$es6$promise$utils$$isMaybeThenable(entry)) { if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) { entry._onerror = null; enumerator._settledAt(entry._state, i, entry._result) } else { enumerator._willSettleAt(c.resolve(entry), i) } } else { enumerator._remaining--; enumerator._result[i] = entry } }; lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function (state, i, value) { var enumerator = this; var promise = enumerator.promise; if (promise._state === lib$es6$promise$$internal$$PENDING) { enumerator._remaining--; if (state === lib$es6$promise$$internal$$REJECTED) { lib$es6$promise$$internal$$reject(promise, value) } else { enumerator._result[i] = value } } if (enumerator._remaining === 0) { lib$es6$promise$$internal$$fulfill(promise, enumerator._result) } }; lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function (promise, i) { var enumerator = this; lib$es6$promise$$internal$$subscribe(promise, undefined, function (value) { enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value) }, function (reason) { enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason) }) }; function lib$es6$promise$promise$all$$all(entries) { return new lib$es6$promise$enumerator$$default(this, entries).promise } var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all; function lib$es6$promise$promise$race$$race(entries) { var Constructor = this; var promise = new Constructor(lib$es6$promise$$internal$$noop); if (!lib$es6$promise$utils$$isArray(entries)) { lib$es6$promise$$internal$$reject(promise, new TypeError("You must pass an array to race.")); return promise } var length = entries.length; function onFulfillment(value) { lib$es6$promise$$internal$$resolve(promise, value) } function onRejection(reason) { lib$es6$promise$$internal$$reject(promise, reason) } for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) { lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection) } return promise } var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race; function lib$es6$promise$promise$resolve$$resolve(object) { var Constructor = this; if (object && typeof object === "object" && object.constructor === Constructor) { return object } var promise = new Constructor(lib$es6$promise$$internal$$noop); lib$es6$promise$$internal$$resolve(promise, object); return promise } var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve; function lib$es6$promise$promise$reject$$reject(reason) { var Constructor = this; var promise = new Constructor(lib$es6$promise$$internal$$noop); lib$es6$promise$$internal$$reject(promise, reason); return promise } var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject; var lib$es6$promise$promise$$counter = 0; function lib$es6$promise$promise$$needsResolver() { throw new TypeError("You must pass a resolver function as the first argument to the promise constructor") } function lib$es6$promise$promise$$needsNew() { throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.") } var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise; function lib$es6$promise$promise$$Promise(resolver) { this._id = lib$es6$promise$promise$$counter++; this._state = undefined; this._result = undefined; this._subscribers = []; if (lib$es6$promise$$internal$$noop !== resolver) { if (!lib$es6$promise$utils$$isFunction(resolver)) { lib$es6$promise$promise$$needsResolver() } if (!(this instanceof lib$es6$promise$promise$$Promise)) { lib$es6$promise$promise$$needsNew() } lib$es6$promise$$internal$$initializePromise(this, resolver) } } lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default; lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default; lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default; lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default; lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler; lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap; lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap; lib$es6$promise$promise$$Promise.prototype = { constructor: lib$es6$promise$promise$$Promise, then: function (onFulfillment, onRejection) { var parent = this; var state = parent._state; if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) { return this } var child = new this.constructor(lib$es6$promise$$internal$$noop); var result = parent._result; if (state) { var callback = arguments[state - 1]; lib$es6$promise$asap$$asap(function () { lib$es6$promise$$internal$$invokeCallback(state, child, callback, result) }) } else { lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) } return child }, "catch": function (onRejection) { return this.then(null, onRejection) } }; function lib$es6$promise$polyfill$$polyfill() { var local; if (typeof global !== "undefined") { local = global } else if (typeof self !== "undefined") { local = self } else { try { local = Function("return this")() } catch (e) { throw new Error("polyfill failed because global object is unavailable in this environment") } } var P = local.Promise; if (P && Object.prototype.toString.call(P.resolve()) === "[object Promise]" && !P.cast) { return } local.Promise = lib$es6$promise$promise$$default } var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill; var lib$es6$promise$umd$$ES6Promise = { Promise: lib$es6$promise$promise$$default, polyfill: lib$es6$promise$polyfill$$default }; if (typeof define === "function" && define["amd"]) { define(function () { return lib$es6$promise$umd$$ES6Promise }) } else if (typeof module !== "undefined" && module["exports"]) { module["exports"] = lib$es6$promise$umd$$ES6Promise } else if (typeof this !== "undefined") { this["ES6Promise"] = lib$es6$promise$umd$$ES6Promise } lib$es6$promise$polyfill$$default() }).call(this);
}
/*
The MIT License (MIT)

Copyright (c) 2016 Jim Daly

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

"use strict";
var Sdk = window.Sdk || {};
Sdk.Sample = Sdk.Sample || {};
(function () {
    var _clientUrl;
    var _webAPIVersion = "8.1";



    var NS = "Sdk.Sample";

    /**
    @abstract {Object} Sdk.Sample.crmbaseentity
    @description The abstract base classe from which all entity classes inherit.
    @private {Object} internal Dictionary object containing values of the object
    @private {Array} changedProperties Contains the names of properties that have been set since the object was instantiated.
    @readonly {String} type  The name of the type without the namespace
    @readonly {String} primaryKey The name of the primary key of the entity
    @readonly {String} entitySetName The name of the entity set
    @readonly {Object} properties internal Dictionary object containing the names of the entity properties included for this entity in this library.
    @readonly {Object} lookups internal Dictionary object containing the names of the single-valued navigation properties included for this entity in this library.
    @readonly {Object} collections internal Dictionary object containing the names of the collection-valued navigation properties included for this entity in this library.
    */
    this.crmbaseentity = function (entityReference) {
        var _changedProperties = [];
        var _internal = {};

        Object.defineProperties(this, {
            "internal": {
                get: function () { return _internal; },
                set: function (value) {
                    _internal = value;
                },
                enumerable: false
            },
            "changedProperties": {
                get: function () { return _changedProperties; },
                set: function (value) {
                    if (isStringArray(value)) {
                        _changedProperties = value;
                    }
                    else {
                        throw new Error(NS + ".crmbaseentity changedProperties property must be an array of strings.");
                    }

                },
                enumerable: false

            }
        });
    }
    /**
    @function toJSON Internal use only. Ensures that only changed values are sent to the server when JSON.stringify is used to serialize the object
    @returns {Object}
    */
    this.crmbaseentity.prototype.toJSON = function () {
        var retVal = {};
        retVal["@odata.type"] = this["@odata.type"];
        //Always include the primary key value if it is set;
        if (!isNullOrUndefined(this[this.primaryKey])) {
            retVal[this.primaryKey] = this[this.primaryKey];
        }
        var self = this;
        this.changedProperties.forEach(function (p) {
            if (p.charAt(0) != "_" && p.charAt(0) != "@" && p.indexOf("@OData.Community") == -1) {
                if (self.properties[p]) {
                    retVal[p] = self[p];
                }
                else {
                    retVal[p] = self.get(p.replace("@odata.bind", "Uri"));
                }
            }
        });
        return retVal;
    }
    /**
    @function addChangedProperty Internal use only. Called by setters when property values are changed.
    @param {String} propertyName The name of the changed property
    */
    this.crmbaseentity.prototype.addChangedProperty = function (propertyName) {

        if (this.changedProperties.indexOf(propertyName) < 0) {
            this.changedProperties.push(propertyName);
        }
    }
    /**
    @function resetChangeTracking Removes any tracked changes to entity properties
    */
    this.crmbaseentity.prototype.resetChangeTracking = function () {
        this.changedProperties = [];
    }
    /**
    @function getUri Returns the URI for an object that has been saved.
    @returns {string} The URI for an object that has been saved.
    */
    this.crmbaseentity.prototype.getUri = function () {
        var primaryKeyName = this.primaryKey;
        var entitySetName = this.entitySetName;
        if (this[primaryKeyName]) {
            return Sdk.Sample.getWebAPIPath() + entitySetName + "(" + this[primaryKeyName] + ")";
        }
        else {
            throw new Error("Uri cannot be generated because the entity instance does not have the unique identifier value set.");
        }

    }
    /**
    @function getId Returns the value of primary key for an object that has been saved.
    @returns {String} The value of primary key for an object that has been saved.
    */
    this.crmbaseentity.prototype.getId = function () {
        return this[this.primaryKey];
    }

    /**
    @function setIdFromUri Sets the primary key property value based on the URI of an entity
    @param {String} uri The Uri of an entity that has been saved;
    */
    this.crmbaseentity.prototype.setIdFromUri = function (uri) {
        this[this.primaryKey] = getIdFromUri(Sdk.Sample[this.type], uri);
        this.resetChangeTracking(); //Any changes made before use are not tracked;
    }


    /**
    @function getRef Returns a reference to the entity
    @returns {Object} An object that refers to a specific entity
    */
    this.crmbaseentity.prototype.getRef = function () {
        return { "@odata.id": this.entitySetName + "(" + this.getId() + ")" };
    }

    /**
    @function getVersion Returns the ETag value of a retrieved entity
    @returns {string} The ETag value representing the version number of the entity instance.
    */
    this.crmbaseentity.prototype.getVersion = function () {
        var etag = this.internal["@odata.etag"];
        return isUndefined(etag) ? null : etag;
    }

    /**
    @function getFormattedValue Returns the formatted value of a property retrieved from the server.
    @param {String} propertyName The name of the property with a formatted value.
    @param {String} whenNullText The value to return when the property is null.
    @returns {String} The formatted value of the property
    */
    this.crmbaseentity.prototype.getFormattedValue = function (propertyName, whenNullText) {
        if (!isString(propertyName)) {
            throw new Error(NS + ".crmbaseentity getFormattedValue propertyName parameter must be a string.");
        }
        if (!isOptionalString(whenNullText)) {
            throw new Error(NS + ".crmbaseentity getFormattedValue whenNullText parameter must be a string, undefined, or null.");
        }

        var formattedValue = this.internal[propertyName + "@OData.Community.Display.V1.FormattedValue"];
        if (whenNullText) {
            if (!formattedValue) {
                return whenNullText;
            }
        }
        return formattedValue;
    }

    /**
    @function getColumnSet Returns an array of the property names available for the entity
    @returns {Array} The property names available for the entity
    */
    this.crmbaseentity.prototype.getColumnSet = function () {
        var propertyNames = [];
        for (var i in this.properties) {
            propertyNames.push(i);
        }
        return propertyNames;
    }

    /**
    @function get Returns the value of a property not defined in the library.
    @param {String} propertyName The name of the property.
    @returns {Object} The value of the property if defined, or null
    */
    this.crmbaseentity.prototype.get = function (propertyName) {
        try {
            return this.internal[propertyName];
        } catch (e) {
            return null;
        }
    }

    /**
    @function set Sets the value of a property not defined in the library.
     @param {String} propertyName The name of the property.
     @param {Object} value The value of the property.
    */
    this.crmbaseentity.prototype.set = function (propertyname, value) {
        //Don't change it if it exists and the value is the same.
        if (this.internal[propertyname]) {
            if (this.internal[propertyname] != value) {
                this.addChangedProperty(propertyname);
                this.internal[propertyname] = value;
            }
        }
        else {
            //If it doesn't exist, add it.
            this.addChangedProperty(propertyname);
            this.internal[propertyname] = value;
        }

    }

    /**
    @typeref {Object} Sdk.Sample.entityCollection
    @description A class containing a collection of entities
    @param {Object} The JSON results of a collection of entities
    @readonly {Array} value  The JSON results of the collection
    @readonly {String} nextLink A URL to the next page of results
    @readonly {Number} count The number of entities that match the query (up to 5000)
    */
    this.entityCollection = function (collection) {
        var _value = null;
        var _nextLink = null;
        var _count = null;

        if (collection["@odata.nextLink"]) {
            _nextLink = collection["@odata.nextLink"];
        }
        if (collection["@odata.count"]) {
            _count = parseInt(collection["@odata.count"]);
        }

        Object.defineProperties(this, {
            "value": {
                get: function () { return _value; },
                enumerable: false
            },
            "nextLink": {
                get: function () { return _nextLink; },
                enumerable: false
            },
            "count": {
                get: function () { return _count; },
                enumerable: false

            }
        });

        if (isNumber(collection)) {
            _value = [];
            _count = collection;
        }
        else {
            if (collection.value && Array.isArray(collection.value)) {
                _value = collection.value;
            }
            else {

                throw new Error(NS + ".entityCollection collection parameter must have a value property that is an Array.");
            }
            if (collection["@odata.nextLink"]) {
                _nextLink = collection["@odata.nextLink"];
            }
            if (collection["@odata.count"]) {
                _count = parseInt(collection["@odata.count"]);
            }
        }

    }


    /**
    @typeref {object} Sdk.Sample.activitypointer
    @extends Sdk.Sample.crmbaseentity
    @description Task performed, or to be performed, by a user. An activity is any action for which an entry can be made on a calendar.
    @param {String|Object}[activitypointerReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.activitypointer = function (activitypointerReference) {
        if (!(isInstanceOf(Sdk.Sample.activitypointer, this))) {
            return new Sdk.Sample.activitypointer(activitypointerReference);
        }
        Sdk.Sample.crmbaseentity.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true,
                configurable: true
            },
            //Properties,
            "activityid": {
                get: function () { return this.internal.activityid; },
                set: function (value) { setGuidOrNullProperty(this, "activityid", value) },
                enumerable: true
            },
            "actualdurationminutes": {
                get: function () { return this.internal.actualdurationminutes; },
                set: function (value) { setNumberOrNullProperty(this, "actualdurationminutes", value) },
                enumerable: true
            },
            "description": {
                get: function () { return this.internal.description; },
                set: function (value) { setStringOrNullProperty(this, "description", value) },
                enumerable: true
            },
            "scheduledend": {
                get: function () { return this.internal.scheduledend; },
                set: function (value) { setDateTimeOffsetProperty(this, "scheduledend", value) },
                enumerable: true
            },
            "scheduledstart": {
                get: function () { return this.internal.scheduledstart; },
                set: function (value) { setDateTimeOffsetProperty(this, "scheduledstart", value) },
                enumerable: true
            },
            "subject": {
                get: function () { return this.internal.subject; },
                set: function (value) { setStringOrNullProperty(this, "subject", value) },
                enumerable: true
            },
            //Single-valued Navigation Properties,
            "regardingobjectid_account": {
                get: function () { return this.internal.regardingobjectid_account; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.account, "account", this, "regardingobjectid_account", value) },
                enumerable: true
            },
            "regardingobjectid_account@odata.bind": {
                get: function () { return this.internal.regardingobjectid_accountUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.account, "account", this, "regardingobjectid_account", value) },
                enumerable: true
            },
            "regardingobjectid_contact": {
                get: function () { return this.internal.regardingobjectid_contact; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.contact, "contact", this, "regardingobjectid_contact", value) },
                enumerable: true
            },
            "regardingobjectid_contact@odata.bind": {
                get: function () { return this.internal.regardingobjectid_contactUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.contact, "contact", this, "regardingobjectid_contact", value) },
                enumerable: true
            },
            "regardingobjectid_incident": {
                get: function () { return this.internal.regardingobjectid_incident; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.incident, "incident", this, "regardingobjectid_incident", value) },
                enumerable: true
            },
            "regardingobjectid_incident@odata.bind": {
                get: function () { return this.internal.regardingobjectid_incidentUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.incident, "incident", this, "regardingobjectid_incident", value) },
                enumerable: true
            },
            "regardingobjectid_opportunity": {
                get: function () { return this.internal.regardingobjectid_opportunity; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.opportunity, "opportunity", this, "regardingobjectid_opportunity", value) },
                enumerable: true
            },
            "regardingobjectid_opportunity@odata.bind": {
                get: function () { return this.internal.regardingobjectid_opportunityUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.opportunity, "opportunity", this, "regardingobjectid_opportunity", value) },
                enumerable: true
            },
            //Collection-Valued Navigation Properties,
            "activity_pointer_letter": {
                get: function () { return this.internal.activity_pointer_letter; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.letter, "letter", this, "activity_pointer_letter", value) },
                enumerable: true,
            },
            "activity_pointer_opportunity_close": {
                get: function () { return this.internal.activity_pointer_opportunity_close; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.opportunityclose, "opportunityclose", this, "activity_pointer_opportunity_close", value) },
                enumerable: true,
            },
            "activity_pointer_task": {
                get: function () { return this.internal.activity_pointer_task; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.task, "task", this, "activity_pointer_task", value) },
                enumerable: true,
            },
            "ActivityPointer_QueueItem": {
                get: function () { return this.internal.ActivityPointer_QueueItem; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.queueitem, "queueitem", this, "ActivityPointer_QueueItem", value) },
                enumerable: true,
            }
        });

        if (activitypointerReference) {
            init(this.internal, activitypointerReference, this.primaryKey, this.type, this.changedProperties);
        }
        return this;
    }
    this.activitypointer.prototype = Object.create(this.crmbaseentity.prototype);
    this.activitypointer.isEntityClass = true;
    this.activitypointer.prototype.type = "activitypointer";
    this.activitypointer.prototype.primaryKey = "activityid";
    this.activitypointer.prototype.entitySetName = "activitypointers";
    this.activitypointer.prototype.properties = Object.freeze({
        activityid: { name: "activityid", type: "Guid" },
        actualdurationminutes: { name: "actualdurationminutes", type: "Number" },
        description: { name: "description", type: "String" },
        scheduledend: { name: "scheduledend", type: "Date" },
        scheduledstart: { name: "scheduledstart", type: "Date" },
        subject: { name: "subject", type: "String" }
    });
    this.activitypointer.prototype.lookups = Object.freeze({
        regardingobjectid_account: { name: "regardingobjectid_account", type: Sdk.Sample.account },
        regardingobjectid_contact: { name: "regardingobjectid_contact", type: Sdk.Sample.contact },
        regardingobjectid_incident: { name: "regardingobjectid_incident", type: Sdk.Sample.incident },
        regardingobjectid_opportunity: { name: "regardingobjectid_opportunity", type: Sdk.Sample.opportunity }
    });
    this.activitypointer.prototype.collections = Object.freeze({
        activity_pointer_letter: { name: "activity_pointer_letter", type: Sdk.Sample.letter },
        activity_pointer_opportunity_close: { name: "activity_pointer_opportunity_close", type: Sdk.Sample.opportunityclose },
        activity_pointer_task: { name: "activity_pointer_task", type: Sdk.Sample.task },
        ActivityPointer_QueueItem: { name: "ActivityPointer_QueueItem", type: Sdk.Sample.queueitem }
    });

    /**
    @method regardingobjectid_accountUri
    @memberof Sdk.Sample.activitypointer
    @description  Unique identifier of the object with which the activity is associated.
    @param {String} uri A URI to an existing Sdk.Sample.account.
    */
    this.activitypointer.prototype.regardingobjectid_accountUri = function (uri) {
        this["regardingobjectid_account@odata.bind"] = uri;
    }

    /**
    @method regardingobjectid_contactUri
    @memberof Sdk.Sample.activitypointer
    @description  Unique identifier of the object with which the activity is associated.
    @param {String} uri A URI to an existing Sdk.Sample.contact.
    */
    this.activitypointer.prototype.regardingobjectid_contactUri = function (uri) {
        this["regardingobjectid_contact@odata.bind"] = uri;
    }

    /**
    @method regardingobjectid_incidentUri
    @memberof Sdk.Sample.activitypointer
    @description  Unique identifier of the object with which the activity is associated.
    @param {String} uri A URI to an existing Sdk.Sample.incident.
    */
    this.activitypointer.prototype.regardingobjectid_incidentUri = function (uri) {
        this["regardingobjectid_incident@odata.bind"] = uri;
    }

    /**
    @method regardingobjectid_opportunityUri
    @memberof Sdk.Sample.activitypointer
    @description  Unique identifier of the object with which the activity is associated.
    @param {String} uri A URI to an existing Sdk.Sample.opportunity.
    */
    this.activitypointer.prototype.regardingobjectid_opportunityUri = function (uri) {
        this["regardingobjectid_opportunity@odata.bind"] = uri;
    }

    /**
    @typeref {object} Sdk.Sample.contact
    @extends Sdk.Sample.crmbaseentity
    @description Person with whom a business unit has a relationship, such as customer, supplier, and colleague.
    @param {String|Object}[contactReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.contact = function (contactReference) {
        if (!(isInstanceOf(Sdk.Sample.contact, this))) {
            return new Sdk.Sample.contact(contactReference);
        }
        Sdk.Sample.crmbaseentity.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            "annualincome": {
                get: function () { return this.internal.annualincome; },
                set: function (value) { setNumberOrNullProperty(this, "annualincome", value) },
                enumerable: true
            },
            "contactid": {
                get: function () { return this.internal.contactid; },
                set: function (value) { setGuidOrNullProperty(this, "contactid", value) },
                enumerable: true
            },
            "createdon": {
                get: function () { return this.internal.createdon; },
                enumerable: true
            },
            "description": {
                get: function () { return this.internal.description; },
                set: function (value) { setStringOrNullProperty(this, "description", value) },
                enumerable: true
            },
            "firstname": {
                get: function () { return this.internal.firstname; },
                set: function (value) { setStringOrNullProperty(this, "firstname", value) },
                enumerable: true
            },
            "fullname": {
                get: function () { return this.internal.fullname; },
                enumerable: true
            },
            "jobtitle": {
                get: function () { return this.internal.jobtitle; },
                set: function (value) { setStringOrNullProperty(this, "jobtitle", value) },
                enumerable: true
            },
            "lastname": {
                get: function () { return this.internal.lastname; },
                set: function (value) { setStringOrNullProperty(this, "lastname", value) },
                enumerable: true
            },
            "telephone1": {
                get: function () { return this.internal.telephone1; },
                set: function (value) { setStringOrNullProperty(this, "telephone1", value) },
                enumerable: true
            },
            //Single-valued Navigation Properties,
            "masterid": {
                get: function () { return this.internal.masterid; },
                enumerable: true
            },
            "parentcustomerid_account": {
                get: function () { return this.internal.parentcustomerid_account; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.account, "account", this, "parentcustomerid_account", value) },
                enumerable: true
            },
            "parentcustomerid_account@odata.bind": {
                get: function () { return this.internal.parentcustomerid_accountUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.account, "account", this, "parentcustomerid_account", value) },
                enumerable: true
            },
            "parentcustomerid_contact": {
                get: function () { return this.internal.parentcustomerid_contact; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.contact, "contact", this, "parentcustomerid_contact", value) },
                enumerable: true
            },
            "parentcustomerid_contact@odata.bind": {
                get: function () { return this.internal.parentcustomerid_contactUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.contact, "contact", this, "parentcustomerid_contact", value) },
                enumerable: true
            },
            //Collection-Valued Navigation Properties,
            "account_primary_contact": {
                get: function () { return this.internal.account_primary_contact; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.account, "account", this, "account_primary_contact", value) },
                enumerable: true,
            },
            "Contact_ActivityPointers": {
                get: function () { return this.internal.Contact_ActivityPointers; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.activitypointer, "activitypointer", this, "Contact_ActivityPointers", value) },
                enumerable: true,
            },
            "Contact_Annotation": {
                get: function () { return this.internal.Contact_Annotation; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.annotation, "annotation", this, "Contact_Annotation", value) },
                enumerable: true,
            },
            "contact_as_primary_contact": {
                get: function () { return this.internal.contact_as_primary_contact; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.incident, "incident", this, "contact_as_primary_contact", value) },
                enumerable: true,
            },
            "contact_as_responsible_contact": {
                get: function () { return this.internal.contact_as_responsible_contact; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.incident, "incident", this, "contact_as_responsible_contact", value) },
                enumerable: true,
            },
            "contact_customer_contacts": {
                get: function () { return this.internal.contact_customer_contacts; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.contact, "contact", this, "contact_customer_contacts", value) },
                enumerable: true,
            },
            "Contact_Letters": {
                get: function () { return this.internal.Contact_Letters; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.letter, "letter", this, "Contact_Letters", value) },
                enumerable: true,
            },
            "contact_master_contact": {
                get: function () { return this.internal.contact_master_contact; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.contact, "contact", this, "contact_master_contact", value) },
                enumerable: true,
            },
            "Contact_Tasks": {
                get: function () { return this.internal.Contact_Tasks; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.task, "task", this, "Contact_Tasks", value) },
                enumerable: true,
            },
            "incident_customer_contacts": {
                get: function () { return this.internal.incident_customer_contacts; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.incident, "incident", this, "incident_customer_contacts", value) },
                enumerable: true,
            },
            "opportunity_customer_contacts": {
                get: function () { return this.internal.opportunity_customer_contacts; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.opportunity, "opportunity", this, "opportunity_customer_contacts", value) },
                enumerable: true,
            },
            "opportunity_parent_contact": {
                get: function () { return this.internal.opportunity_parent_contact; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.opportunity, "opportunity", this, "opportunity_parent_contact", value) },
                enumerable: true,
            }
        });

        if (contactReference) {
            init(this.internal, contactReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.contact.prototype = Object.create(this.crmbaseentity.prototype);
    this.contact.isEntityClass = true;
    this.contact.prototype.type = "contact";
    this.contact.prototype.primaryKey = "contactid";
    this.contact.prototype.entitySetName = "contacts";
    this.contact.prototype.properties = Object.freeze({
        annualincome: { name: "annualincome", type: "Number" },
        contactid: { name: "contactid", type: "Guid" },
        createdon: { name: "createdon", type: "Date" },
        description: { name: "description", type: "String" },
        firstname: { name: "firstname", type: "String" },
        fullname: { name: "fullname", type: "String" },
        jobtitle: { name: "jobtitle", type: "String" },
        lastname: { name: "lastname", type: "String" },
        telephone1: { name: "telephone1", type: "String" }
    });
    this.contact.prototype.lookups = Object.freeze({
        masterid: { name: "masterid", type: Sdk.Sample.contact },
        parentcustomerid_account: { name: "parentcustomerid_account", type: Sdk.Sample.account },
        parentcustomerid_contact: { name: "parentcustomerid_contact", type: Sdk.Sample.contact }
    });
    this.contact.prototype.collections = Object.freeze({
        account_primary_contact: { name: "account_primary_contact", type: Sdk.Sample.account },
        Contact_ActivityPointers: { name: "Contact_ActivityPointers", type: Sdk.Sample.activitypointer },
        Contact_Annotation: { name: "Contact_Annotation", type: Sdk.Sample.annotation },
        contact_as_primary_contact: { name: "contact_as_primary_contact", type: Sdk.Sample.incident },
        contact_as_responsible_contact: { name: "contact_as_responsible_contact", type: Sdk.Sample.incident },
        contact_customer_contacts: { name: "contact_customer_contacts", type: Sdk.Sample.contact },
        Contact_Letters: { name: "Contact_Letters", type: Sdk.Sample.letter },
        contact_master_contact: { name: "contact_master_contact", type: Sdk.Sample.contact },
        Contact_Tasks: { name: "Contact_Tasks", type: Sdk.Sample.task },
        incident_customer_contacts: { name: "incident_customer_contacts", type: Sdk.Sample.incident },
        opportunity_customer_contacts: { name: "opportunity_customer_contacts", type: Sdk.Sample.opportunity },
        opportunity_parent_contact: { name: "opportunity_parent_contact", type: Sdk.Sample.opportunity }
    });

    /**
    @method parentcustomerid_accountUri
    @memberof Sdk.Sample.contact
    @description  Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
    @param {String} uri A URI to an existing Sdk.Sample.account.
    */
    this.contact.prototype.parentcustomerid_accountUri = function (uri) {
        this["parentcustomerid_account@odata.bind"] = uri;
    }

    /**
    @method parentcustomerid_contactUri
    @memberof Sdk.Sample.contact
    @description  Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
    @param {String} uri A URI to an existing Sdk.Sample.contact.
    */
    this.contact.prototype.parentcustomerid_contactUri = function (uri) {
        this["parentcustomerid_contact@odata.bind"] = uri;
    }

    /**
    @typeref {object} Sdk.Sample.account
    @extends Sdk.Sample.crmbaseentity
    @description Business that represents a customer or potential customer. The company that is billed in business transactions.
    @param {String|Object}[accountReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.account = function (accountReference) {
        if (!(isInstanceOf(Sdk.Sample.account, this))) {
            return new Sdk.Sample.account(accountReference);
        }
        Sdk.Sample.crmbaseentity.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            "accountid": {
                get: function () { return this.internal.accountid; },
                set: function (value) { setGuidOrNullProperty(this, "accountid", value) },
                enumerable: true
            },
            "description": {
                get: function () { return this.internal.description; },
                set: function (value) { setStringOrNullProperty(this, "description", value) },
                enumerable: true
            },
            "name": {
                get: function () { return this.internal.name; },
                set: function (value) { setStringOrNullProperty(this, "name", value) },
                enumerable: true
            },
            "revenue": {
                get: function () { return this.internal.revenue; },
                set: function (value) { setNumberOrNullProperty(this, "revenue", value) },
                enumerable: true
            },
            "telephone1": {
                get: function () { return this.internal.telephone1; },
                set: function (value) { setStringOrNullProperty(this, "telephone1", value) },
                enumerable: true
            },
            //Single-valued Navigation Properties,
            "masterid": {
                get: function () { return this.internal.masterid; },
                enumerable: true
            },
            "parentaccountid": {
                get: function () { return this.internal.parentaccountid; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.account, "account", this, "parentaccountid", value) },
                enumerable: true
            },
            "parentaccountid@odata.bind": {
                get: function () { return this.internal.parentaccountidUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.account, "account", this, "parentaccountid", value) },
                enumerable: true
            },
            "primarycontactid": {
                get: function () { return this.internal.primarycontactid; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.contact, "contact", this, "primarycontactid", value) },
                enumerable: true
            },
            "primarycontactid@odata.bind": {
                get: function () { return this.internal.primarycontactidUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.contact, "contact", this, "primarycontactid", value) },
                enumerable: true
            },
            //Collection-Valued Navigation Properties,
            "Account_ActivityPointers": {
                get: function () { return this.internal.Account_ActivityPointers; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.activitypointer, "activitypointer", this, "Account_ActivityPointers", value) },
                enumerable: true,
            },
            "Account_Annotation": {
                get: function () { return this.internal.Account_Annotation; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.annotation, "annotation", this, "Account_Annotation", value) },
                enumerable: true,
            },
            "Account_Letters": {
                get: function () { return this.internal.Account_Letters; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.letter, "letter", this, "Account_Letters", value) },
                enumerable: true,
            },
            "account_master_account": {
                get: function () { return this.internal.account_master_account; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.account, "account", this, "account_master_account", value) },
                enumerable: true,
            },
            "account_parent_account": {
                get: function () { return this.internal.account_parent_account; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.account, "account", this, "account_parent_account", value) },
                enumerable: true,
            },
            "Account_Tasks": {
                get: function () { return this.internal.Account_Tasks; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.task, "task", this, "Account_Tasks", value) },
                enumerable: true,
            },
            "contact_customer_accounts": {
                get: function () { return this.internal.contact_customer_accounts; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.contact, "contact", this, "contact_customer_accounts", value) },
                enumerable: true,
            },
            "incident_customer_accounts": {
                get: function () { return this.internal.incident_customer_accounts; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.incident, "incident", this, "incident_customer_accounts", value) },
                enumerable: true,
            },
            "opportunity_customer_accounts": {
                get: function () { return this.internal.opportunity_customer_accounts; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.opportunity, "opportunity", this, "opportunity_customer_accounts", value) },
                enumerable: true,
            },
            "opportunity_parent_account": {
                get: function () { return this.internal.opportunity_parent_account; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.opportunity, "opportunity", this, "opportunity_parent_account", value) },
                enumerable: true,
            }
        });

        if (accountReference) {
            init(this.internal, accountReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.account.prototype = Object.create(this.crmbaseentity.prototype);
    this.account.isEntityClass = true;
    this.account.prototype.type = "account";
    this.account.prototype.primaryKey = "accountid";
    this.account.prototype.entitySetName = "accounts";
    this.account.prototype.properties = Object.freeze({
        accountid: { name: "accountid", type: "Guid" },
        description: { name: "description", type: "String" },
        name: { name: "name", type: "String" },
        revenue: { name: "revenue", type: "Number" },
        telephone1: { name: "telephone1", type: "String" }
    });
    this.account.prototype.lookups = Object.freeze({
        masterid: { name: "masterid", type: Sdk.Sample.account },
        parentaccountid: { name: "parentaccountid", type: Sdk.Sample.account },
        primarycontactid: { name: "primarycontactid", type: Sdk.Sample.contact }
    });
    this.account.prototype.collections = Object.freeze({
        Account_ActivityPointers: { name: "Account_ActivityPointers", type: Sdk.Sample.activitypointer },
        Account_Annotation: { name: "Account_Annotation", type: Sdk.Sample.annotation },
        Account_Letters: { name: "Account_Letters", type: Sdk.Sample.letter },
        account_master_account: { name: "account_master_account", type: Sdk.Sample.account },
        account_parent_account: { name: "account_parent_account", type: Sdk.Sample.account },
        Account_Tasks: { name: "Account_Tasks", type: Sdk.Sample.task },
        contact_customer_accounts: { name: "contact_customer_accounts", type: Sdk.Sample.contact },
        incident_customer_accounts: { name: "incident_customer_accounts", type: Sdk.Sample.incident },
        opportunity_customer_accounts: { name: "opportunity_customer_accounts", type: Sdk.Sample.opportunity },
        opportunity_parent_account: { name: "opportunity_parent_account", type: Sdk.Sample.opportunity }
    });

    /**
    @method parentaccountidUri
    @memberof Sdk.Sample.account
    @description  Choose the parent account associated with this account to show parent and child businesses in reporting and analytics.
    @param {String} uri A URI to an existing Sdk.Sample.account.
    */
    this.account.prototype.parentaccountidUri = function (uri) {
        this["parentaccountid@odata.bind"] = uri;
    }

    /**
    @method primarycontactidUri
    @memberof Sdk.Sample.account
    @description  Choose the primary contact for the account to provide quick access to contact details.
    @param {String} uri A URI to an existing Sdk.Sample.contact.
    */
    this.account.prototype.primarycontactidUri = function (uri) {
        this["primarycontactid@odata.bind"] = uri;
    }

    /**
    @typeref {object} Sdk.Sample.task
    @extends Sdk.Sample.activitypointer
    @description Generic activity representing work needed to be done.
    @param {String|Object}[taskReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.task = function (taskReference) {
        if (!(isInstanceOf(Sdk.Sample.task, this))) {
            return new Sdk.Sample.task(taskReference);
        }
        Sdk.Sample.activitypointer.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            //Single-valued Navigation Properties,
            "activityid_activitypointer": {
                get: function () { return this.internal.activityid_activitypointer; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.activitypointer, "activitypointer", this, "activityid_activitypointer", value) },
                enumerable: true
            },
            "activityid_activitypointer@odata.bind": {
                get: function () { return this.internal.activityid_activitypointerUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.activitypointer, "activitypointer", this, "activityid_activitypointer", value) },
                enumerable: true
            },
            "regardingobjectid_account_task": {
                get: function () { return this.internal.regardingobjectid_account_task; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.account, "account", this, "regardingobjectid_account_task", value) },
                enumerable: true
            },
            "regardingobjectid_account_task@odata.bind": {
                get: function () { return this.internal.regardingobjectid_account_taskUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.account, "account", this, "regardingobjectid_account_task", value) },
                enumerable: true
            },
            "regardingobjectid_contact_task": {
                get: function () { return this.internal.regardingobjectid_contact_task; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.contact, "contact", this, "regardingobjectid_contact_task", value) },
                enumerable: true
            },
            "regardingobjectid_contact_task@odata.bind": {
                get: function () { return this.internal.regardingobjectid_contact_taskUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.contact, "contact", this, "regardingobjectid_contact_task", value) },
                enumerable: true
            },
            "regardingobjectid_incident_task": {
                get: function () { return this.internal.regardingobjectid_incident_task; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.incident, "incident", this, "regardingobjectid_incident_task", value) },
                enumerable: true
            },
            "regardingobjectid_incident_task@odata.bind": {
                get: function () { return this.internal.regardingobjectid_incident_taskUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.incident, "incident", this, "regardingobjectid_incident_task", value) },
                enumerable: true
            },
            "regardingobjectid_opportunity_task": {
                get: function () { return this.internal.regardingobjectid_opportunity_task; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.opportunity, "opportunity", this, "regardingobjectid_opportunity_task", value) },
                enumerable: true
            },
            "regardingobjectid_opportunity_task@odata.bind": {
                get: function () { return this.internal.regardingobjectid_opportunity_taskUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.opportunity, "opportunity", this, "regardingobjectid_opportunity_task", value) },
                enumerable: true
            },
            //Collection-Valued Navigation Properties,
            "Task_Annotation": {
                get: function () { return this.internal.Task_Annotation; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.annotation, "annotation", this, "Task_Annotation", value) },
                enumerable: true,
            },
            "Task_QueueItem": {
                get: function () { return this.internal.Task_QueueItem; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.queueitem, "queueitem", this, "Task_QueueItem", value) },
                enumerable: true,
            }
        });

        if (taskReference) {
            init(this.internal, taskReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.task.prototype = Object.create(this.activitypointer.prototype);
    this.task.isEntityClass = true;
    this.task.prototype.type = "task";
    this.task.prototype.primaryKey = "activityid";
    this.task.prototype.entitySetName = "tasks";
    this.task.prototype.properties = Object.freeze({
        activityid: { name: "activityid", type: "Guid" },
        actualdurationminutes: { name: "actualdurationminutes", type: "Number" },
        description: { name: "description", type: "String" },
        scheduledend: { name: "scheduledend", type: "Date" },
        scheduledstart: { name: "scheduledstart", type: "Date" },
        subject: { name: "subject", type: "String" }
    });
    this.task.prototype.lookups = Object.freeze({
        regardingobjectid_account: { name: "regardingobjectid_account", type: Sdk.Sample.account },
        regardingobjectid_contact: { name: "regardingobjectid_contact", type: Sdk.Sample.contact },
        regardingobjectid_incident: { name: "regardingobjectid_incident", type: Sdk.Sample.incident },
        regardingobjectid_opportunity: { name: "regardingobjectid_opportunity", type: Sdk.Sample.opportunity },
        activityid_activitypointer: { name: "activityid_activitypointer", type: Sdk.Sample.activitypointer },
        regardingobjectid_account_task: { name: "regardingobjectid_account_task", type: Sdk.Sample.account },
        regardingobjectid_contact_task: { name: "regardingobjectid_contact_task", type: Sdk.Sample.contact },
        regardingobjectid_incident_task: { name: "regardingobjectid_incident_task", type: Sdk.Sample.incident },
        regardingobjectid_opportunity_task: { name: "regardingobjectid_opportunity_task", type: Sdk.Sample.opportunity }
    });
    this.task.prototype.collections = Object.freeze({
        activity_pointer_letter: { name: "activity_pointer_letter", type: Sdk.Sample.letter },
        activity_pointer_opportunity_close: { name: "activity_pointer_opportunity_close", type: Sdk.Sample.opportunityclose },
        activity_pointer_task: { name: "activity_pointer_task", type: Sdk.Sample.task },
        ActivityPointer_QueueItem: { name: "ActivityPointer_QueueItem", type: Sdk.Sample.queueitem },
        Task_Annotation: { name: "Task_Annotation", type: Sdk.Sample.annotation },
        Task_QueueItem: { name: "Task_QueueItem", type: Sdk.Sample.queueitem }
    });

    /**
    @method activityid_activitypointerUri
    @memberof Sdk.Sample.task
    @description  Unique identifier of the task.
    @param {String} uri A URI to an existing Sdk.Sample.activitypointer.
    */
    this.task.prototype.activityid_activitypointerUri = function (uri) {
        this["activityid_activitypointer@odata.bind"] = uri;
    }

    /**
    @method regardingobjectid_account_taskUri
    @memberof Sdk.Sample.task
    @description  Choose the record that the task relates to.
    @param {String} uri A URI to an existing Sdk.Sample.account.
    */
    this.task.prototype.regardingobjectid_account_taskUri = function (uri) {
        this["regardingobjectid_account_task@odata.bind"] = uri;
    }

    /**
    @method regardingobjectid_contact_taskUri
    @memberof Sdk.Sample.task
    @description  Choose the record that the task relates to.
    @param {String} uri A URI to an existing Sdk.Sample.contact.
    */
    this.task.prototype.regardingobjectid_contact_taskUri = function (uri) {
        this["regardingobjectid_contact_task@odata.bind"] = uri;
    }

    /**
    @method regardingobjectid_incident_taskUri
    @memberof Sdk.Sample.task
    @description  Choose the record that the task relates to.
    @param {String} uri A URI to an existing Sdk.Sample.incident.
    */
    this.task.prototype.regardingobjectid_incident_taskUri = function (uri) {
        this["regardingobjectid_incident_task@odata.bind"] = uri;
    }

    /**
    @method regardingobjectid_opportunity_taskUri
    @memberof Sdk.Sample.task
    @description  Choose the record that the task relates to.
    @param {String} uri A URI to an existing Sdk.Sample.opportunity.
    */
    this.task.prototype.regardingobjectid_opportunity_taskUri = function (uri) {
        this["regardingobjectid_opportunity_task@odata.bind"] = uri;
    }

    /**
    @typeref {object} Sdk.Sample.competitor
    @extends Sdk.Sample.crmbaseentity
    @description Business competing for the sale represented by a lead or opportunity.
    @param {String|Object}[competitorReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.competitor = function (competitorReference) {
        if (!(isInstanceOf(Sdk.Sample.competitor, this))) {
            return new Sdk.Sample.competitor(competitorReference);
        }
        Sdk.Sample.crmbaseentity.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            "competitorid": {
                get: function () { return this.internal.competitorid; },
                set: function (value) { setGuidOrNullProperty(this, "competitorid", value) },
                enumerable: true
            },
            "name": {
                get: function () { return this.internal.name; },
                set: function (value) { setStringOrNullProperty(this, "name", value) },
                enumerable: true
            },
            "strengths": {
                get: function () { return this.internal.strengths; },
                set: function (value) { setStringOrNullProperty(this, "strengths", value) },
                enumerable: true
            },
            //Single-valued Navigation Properties,
            //Collection-Valued Navigation Properties,
            "Competitor_Annotation": {
                get: function () { return this.internal.Competitor_Annotation; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.annotation, "annotation", this, "Competitor_Annotation", value) },
                enumerable: true,
            },
            "competitor_opportunity_activities": {
                get: function () { return this.internal.competitor_opportunity_activities; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.opportunityclose, "opportunityclose", this, "competitor_opportunity_activities", value) },
                enumerable: true,
            },
            "opportunitycompetitors_association": {
                get: function () { return this.internal.opportunitycompetitors_association; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.opportunity, "opportunity", this, "opportunitycompetitors_association", value) },
                enumerable: true,
            }
        });

        if (competitorReference) {
            init(this.internal, competitorReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.competitor.prototype = Object.create(this.crmbaseentity.prototype);
    this.competitor.isEntityClass = true;
    this.competitor.prototype.type = "competitor";
    this.competitor.prototype.primaryKey = "competitorid";
    this.competitor.prototype.entitySetName = "competitors";
    this.competitor.prototype.properties = Object.freeze({
        competitorid: { name: "competitorid", type: "Guid" },
        name: { name: "name", type: "String" },
        strengths: { name: "strengths", type: "String" }
    });
    this.competitor.prototype.lookups = Object.freeze({});
    this.competitor.prototype.collections = Object.freeze({
        Competitor_Annotation: { name: "Competitor_Annotation", type: Sdk.Sample.annotation },
        competitor_opportunity_activities: { name: "competitor_opportunity_activities", type: Sdk.Sample.opportunityclose },
        opportunitycompetitors_association: { name: "opportunitycompetitors_association", type: Sdk.Sample.opportunity }
    });

    /**
    @typeref {object} Sdk.Sample.opportunity
    @extends Sdk.Sample.crmbaseentity
    @description Potential revenue-generating event, or sale to an account, which needs to be tracked through a sales process to completion.
    @param {String|Object}[opportunityReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.opportunity = function (opportunityReference) {
        if (!(isInstanceOf(Sdk.Sample.opportunity, this))) {
            return new Sdk.Sample.opportunity(opportunityReference);
        }
        Sdk.Sample.crmbaseentity.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            "description": {
                get: function () { return this.internal.description; },
                set: function (value) { setStringOrNullProperty(this, "description", value) },
                enumerable: true
            },
            "name": {
                get: function () { return this.internal.name; },
                set: function (value) { setStringOrNullProperty(this, "name", value) },
                enumerable: true
            },
            "opportunityid": {
                get: function () { return this.internal.opportunityid; },
                set: function (value) { setGuidOrNullProperty(this, "opportunityid", value) },
                enumerable: true
            },
            //Single-valued Navigation Properties,
            "customerid_account": {
                get: function () { return this.internal.customerid_account; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.account, "account", this, "customerid_account", value) },
                enumerable: true
            },
            "customerid_account@odata.bind": {
                get: function () { return this.internal.customerid_accountUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.account, "account", this, "customerid_account", value) },
                enumerable: true
            },
            "customerid_contact": {
                get: function () { return this.internal.customerid_contact; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.contact, "contact", this, "customerid_contact", value) },
                enumerable: true
            },
            "customerid_contact@odata.bind": {
                get: function () { return this.internal.customerid_contactUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.contact, "contact", this, "customerid_contact", value) },
                enumerable: true
            },
            "parentaccountid": {
                get: function () { return this.internal.parentaccountid; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.account, "account", this, "parentaccountid", value) },
                enumerable: true
            },
            "parentaccountid@odata.bind": {
                get: function () { return this.internal.parentaccountidUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.account, "account", this, "parentaccountid", value) },
                enumerable: true
            },
            "parentcontactid": {
                get: function () { return this.internal.parentcontactid; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.contact, "contact", this, "parentcontactid", value) },
                enumerable: true
            },
            "parentcontactid@odata.bind": {
                get: function () { return this.internal.parentcontactidUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.contact, "contact", this, "parentcontactid", value) },
                enumerable: true
            },
            //Collection-Valued Navigation Properties,
            "Opportunity_ActivityPointers": {
                get: function () { return this.internal.Opportunity_ActivityPointers; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.activitypointer, "activitypointer", this, "Opportunity_ActivityPointers", value) },
                enumerable: true,
            },
            "Opportunity_Annotation": {
                get: function () { return this.internal.Opportunity_Annotation; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.annotation, "annotation", this, "Opportunity_Annotation", value) },
                enumerable: true,
            },
            "Opportunity_Letters": {
                get: function () { return this.internal.Opportunity_Letters; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.letter, "letter", this, "Opportunity_Letters", value) },
                enumerable: true,
            },
            "Opportunity_OpportunityClose": {
                get: function () { return this.internal.Opportunity_OpportunityClose; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.opportunityclose, "opportunityclose", this, "Opportunity_OpportunityClose", value) },
                enumerable: true,
            },
            "Opportunity_Tasks": {
                get: function () { return this.internal.Opportunity_Tasks; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.task, "task", this, "Opportunity_Tasks", value) },
                enumerable: true,
            },
            "opportunitycompetitors_association": {
                get: function () { return this.internal.opportunitycompetitors_association; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.competitor, "competitor", this, "opportunitycompetitors_association", value) },
                enumerable: true,
            }
        });

        if (opportunityReference) {
            init(this.internal, opportunityReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.opportunity.prototype = Object.create(this.crmbaseentity.prototype);
    this.opportunity.isEntityClass = true;
    this.opportunity.prototype.type = "opportunity";
    this.opportunity.prototype.primaryKey = "opportunityid";
    this.opportunity.prototype.entitySetName = "opportunities";
    this.opportunity.prototype.properties = Object.freeze({
        description: { name: "description", type: "String" },
        name: { name: "name", type: "String" },
        opportunityid: { name: "opportunityid", type: "Guid" }
    });
    this.opportunity.prototype.lookups = Object.freeze({
        customerid_account: { name: "customerid_account", type: Sdk.Sample.account },
        customerid_contact: { name: "customerid_contact", type: Sdk.Sample.contact },
        parentaccountid: { name: "parentaccountid", type: Sdk.Sample.account },
        parentcontactid: { name: "parentcontactid", type: Sdk.Sample.contact }
    });
    this.opportunity.prototype.collections = Object.freeze({
        Opportunity_ActivityPointers: { name: "Opportunity_ActivityPointers", type: Sdk.Sample.activitypointer },
        Opportunity_Annotation: { name: "Opportunity_Annotation", type: Sdk.Sample.annotation },
        Opportunity_Letters: { name: "Opportunity_Letters", type: Sdk.Sample.letter },
        Opportunity_OpportunityClose: { name: "Opportunity_OpportunityClose", type: Sdk.Sample.opportunityclose },
        Opportunity_Tasks: { name: "Opportunity_Tasks", type: Sdk.Sample.task },
        opportunitycompetitors_association: { name: "opportunitycompetitors_association", type: Sdk.Sample.competitor }
    });

    /**
    @method customerid_accountUri
    @memberof Sdk.Sample.opportunity
    @description  Select the customer account or contact to provide a quick link to additional customer details, such as address, phone number, activities, and orders.
    @param {String} uri A URI to an existing Sdk.Sample.account.
    */
    this.opportunity.prototype.customerid_accountUri = function (uri) {
        this["customerid_account@odata.bind"] = uri;
    }

    /**
    @method customerid_contactUri
    @memberof Sdk.Sample.opportunity
    @description  Select the customer account or contact to provide a quick link to additional customer details, such as address, phone number, activities, and orders.
    @param {String} uri A URI to an existing Sdk.Sample.contact.
    */
    this.opportunity.prototype.customerid_contactUri = function (uri) {
        this["customerid_contact@odata.bind"] = uri;
    }

    /**
    @method parentaccountidUri
    @memberof Sdk.Sample.opportunity
    @description  Choose an account to connect this opportunity to, so that the relationship is visible in reports and analytics, and to provide a quick link to additional details, such as financial information and activities.
    @param {String} uri A URI to an existing Sdk.Sample.account.
    */
    this.opportunity.prototype.parentaccountidUri = function (uri) {
        this["parentaccountid@odata.bind"] = uri;
    }

    /**
    @method parentcontactidUri
    @memberof Sdk.Sample.opportunity
    @description  Choose a contact to connect this opportunity to, so that the relationship is visible in reports and analytics.
    @param {String} uri A URI to an existing Sdk.Sample.contact.
    */
    this.opportunity.prototype.parentcontactidUri = function (uri) {
        this["parentcontactid@odata.bind"] = uri;
    }

    /**
    @typeref {object} Sdk.Sample.savedquery
    @extends Sdk.Sample.crmbaseentity
    @description Saved query against the database.
    @param {String|Object}[savedqueryReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.savedquery = function (savedqueryReference) {
        if (!(isInstanceOf(Sdk.Sample.savedquery, this))) {
            return new Sdk.Sample.savedquery(savedqueryReference);
        }
        Sdk.Sample.crmbaseentity.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            "name": {
                get: function () { return this.internal.name; },
                set: function (value) { setStringOrNullProperty(this, "name", value) },
                enumerable: true
            },
            "savedqueryid": {
                get: function () { return this.internal.savedqueryid; },
                set: function (value) { setGuidOrNullProperty(this, "savedqueryid", value) },
                enumerable: true
            },
            //Single-valued Navigation Properties,
            //Collection-Valued Navigation Properties
        });

        if (savedqueryReference) {
            init(this.internal, savedqueryReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.savedquery.prototype = Object.create(this.crmbaseentity.prototype);
    this.savedquery.isEntityClass = true;
    this.savedquery.prototype.type = "savedquery";
    this.savedquery.prototype.primaryKey = "savedqueryid";
    this.savedquery.prototype.entitySetName = "savedqueries";
    this.savedquery.prototype.properties = Object.freeze({
        name: { name: "name", type: "String" },
        savedqueryid: { name: "savedqueryid", type: "Guid" }
    });
    this.savedquery.prototype.lookups = Object.freeze({});
    this.savedquery.prototype.collections = Object.freeze({});

    /**
    @typeref {object} Sdk.Sample.userquery
    @extends Sdk.Sample.crmbaseentity
    @description Saved database query that is owned by a user.
    @param {String|Object}[userqueryReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.userquery = function (userqueryReference) {
        if (!(isInstanceOf(Sdk.Sample.userquery, this))) {
            return new Sdk.Sample.userquery(userqueryReference);
        }
        Sdk.Sample.crmbaseentity.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            "name": {
                get: function () { return this.internal.name; },
                set: function (value) { setStringOrNullProperty(this, "name", value) },
                enumerable: true
            },
            "userqueryid": {
                get: function () { return this.internal.userqueryid; },
                set: function (value) { setGuidOrNullProperty(this, "userqueryid", value) },
                enumerable: true
            },
            //Single-valued Navigation Properties,
            //Collection-Valued Navigation Properties
        });

        if (userqueryReference) {
            init(this.internal, userqueryReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.userquery.prototype = Object.create(this.crmbaseentity.prototype);
    this.userquery.isEntityClass = true;
    this.userquery.prototype.type = "userquery";
    this.userquery.prototype.primaryKey = "userqueryid";
    this.userquery.prototype.entitySetName = "userqueries";
    this.userquery.prototype.properties = Object.freeze({
        name: { name: "name", type: "String" },
        userqueryid: { name: "userqueryid", type: "Guid" }
    });
    this.userquery.prototype.lookups = Object.freeze({});
    this.userquery.prototype.collections = Object.freeze({});

    /**
    @typeref {object} Sdk.Sample.letter
    @extends Sdk.Sample.activitypointer
    @description Activity that tracks the delivery of a letter. The activity can contain the electronic copy of the letter.
    @param {String|Object}[letterReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.letter = function (letterReference) {
        if (!(isInstanceOf(Sdk.Sample.letter, this))) {
            return new Sdk.Sample.letter(letterReference);
        }
        Sdk.Sample.activitypointer.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            //Single-valued Navigation Properties,
            "activityid_activitypointer": {
                get: function () { return this.internal.activityid_activitypointer; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.activitypointer, "activitypointer", this, "activityid_activitypointer", value) },
                enumerable: true
            },
            "activityid_activitypointer@odata.bind": {
                get: function () { return this.internal.activityid_activitypointerUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.activitypointer, "activitypointer", this, "activityid_activitypointer", value) },
                enumerable: true
            },
            "regardingobjectid_account_letter": {
                get: function () { return this.internal.regardingobjectid_account_letter; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.account, "account", this, "regardingobjectid_account_letter", value) },
                enumerable: true
            },
            "regardingobjectid_account_letter@odata.bind": {
                get: function () { return this.internal.regardingobjectid_account_letterUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.account, "account", this, "regardingobjectid_account_letter", value) },
                enumerable: true
            },
            "regardingobjectid_contact_letter": {
                get: function () { return this.internal.regardingobjectid_contact_letter; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.contact, "contact", this, "regardingobjectid_contact_letter", value) },
                enumerable: true
            },
            "regardingobjectid_contact_letter@odata.bind": {
                get: function () { return this.internal.regardingobjectid_contact_letterUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.contact, "contact", this, "regardingobjectid_contact_letter", value) },
                enumerable: true
            },
            "regardingobjectid_incident_letter": {
                get: function () { return this.internal.regardingobjectid_incident_letter; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.incident, "incident", this, "regardingobjectid_incident_letter", value) },
                enumerable: true
            },
            "regardingobjectid_incident_letter@odata.bind": {
                get: function () { return this.internal.regardingobjectid_incident_letterUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.incident, "incident", this, "regardingobjectid_incident_letter", value) },
                enumerable: true
            },
            "regardingobjectid_opportunity_letter": {
                get: function () { return this.internal.regardingobjectid_opportunity_letter; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.opportunity, "opportunity", this, "regardingobjectid_opportunity_letter", value) },
                enumerable: true
            },
            "regardingobjectid_opportunity_letter@odata.bind": {
                get: function () { return this.internal.regardingobjectid_opportunity_letterUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.opportunity, "opportunity", this, "regardingobjectid_opportunity_letter", value) },
                enumerable: true
            },
            //Collection-Valued Navigation Properties,
            "Letter_Annotation": {
                get: function () { return this.internal.Letter_Annotation; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.annotation, "annotation", this, "Letter_Annotation", value) },
                enumerable: true,
            },
            "Letter_QueueItem": {
                get: function () { return this.internal.Letter_QueueItem; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.queueitem, "queueitem", this, "Letter_QueueItem", value) },
                enumerable: true,
            }
        });

        if (letterReference) {
            init(this.internal, letterReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.letter.prototype = Object.create(this.activitypointer.prototype);
    this.letter.isEntityClass = true;
    this.letter.prototype.type = "letter";
    this.letter.prototype.primaryKey = "activityid";
    this.letter.prototype.entitySetName = "letters";
    this.letter.prototype.properties = Object.freeze({
        activityid: { name: "activityid", type: "Guid" },
        actualdurationminutes: { name: "actualdurationminutes", type: "Number" },
        description: { name: "description", type: "String" },
        scheduledend: { name: "scheduledend", type: "Date" },
        scheduledstart: { name: "scheduledstart", type: "Date" },
        subject: { name: "subject", type: "String" }
    });
    this.letter.prototype.lookups = Object.freeze({
        regardingobjectid_account: { name: "regardingobjectid_account", type: Sdk.Sample.account },
        regardingobjectid_contact: { name: "regardingobjectid_contact", type: Sdk.Sample.contact },
        regardingobjectid_incident: { name: "regardingobjectid_incident", type: Sdk.Sample.incident },
        regardingobjectid_opportunity: { name: "regardingobjectid_opportunity", type: Sdk.Sample.opportunity },
        activityid_activitypointer: { name: "activityid_activitypointer", type: Sdk.Sample.activitypointer },
        regardingobjectid_account_letter: { name: "regardingobjectid_account_letter", type: Sdk.Sample.account },
        regardingobjectid_contact_letter: { name: "regardingobjectid_contact_letter", type: Sdk.Sample.contact },
        regardingobjectid_incident_letter: { name: "regardingobjectid_incident_letter", type: Sdk.Sample.incident },
        regardingobjectid_opportunity_letter: { name: "regardingobjectid_opportunity_letter", type: Sdk.Sample.opportunity }
    });
    this.letter.prototype.collections = Object.freeze({
        activity_pointer_letter: { name: "activity_pointer_letter", type: Sdk.Sample.letter },
        activity_pointer_opportunity_close: { name: "activity_pointer_opportunity_close", type: Sdk.Sample.opportunityclose },
        activity_pointer_task: { name: "activity_pointer_task", type: Sdk.Sample.task },
        ActivityPointer_QueueItem: { name: "ActivityPointer_QueueItem", type: Sdk.Sample.queueitem },
        Letter_Annotation: { name: "Letter_Annotation", type: Sdk.Sample.annotation },
        Letter_QueueItem: { name: "Letter_QueueItem", type: Sdk.Sample.queueitem }
    });

    /**
    @method activityid_activitypointerUri
    @memberof Sdk.Sample.letter
    @description  Unique identifier of the letter activity.
    @param {String} uri A URI to an existing Sdk.Sample.activitypointer.
    */
    this.letter.prototype.activityid_activitypointerUri = function (uri) {
        this["activityid_activitypointer@odata.bind"] = uri;
    }

    /**
    @method regardingobjectid_account_letterUri
    @memberof Sdk.Sample.letter
    @description  Choose the record that the letter relates to.
    @param {String} uri A URI to an existing Sdk.Sample.account.
    */
    this.letter.prototype.regardingobjectid_account_letterUri = function (uri) {
        this["regardingobjectid_account_letter@odata.bind"] = uri;
    }

    /**
    @method regardingobjectid_contact_letterUri
    @memberof Sdk.Sample.letter
    @description  Choose the record that the letter relates to.
    @param {String} uri A URI to an existing Sdk.Sample.contact.
    */
    this.letter.prototype.regardingobjectid_contact_letterUri = function (uri) {
        this["regardingobjectid_contact_letter@odata.bind"] = uri;
    }

    /**
    @method regardingobjectid_incident_letterUri
    @memberof Sdk.Sample.letter
    @description  Choose the record that the letter relates to.
    @param {String} uri A URI to an existing Sdk.Sample.incident.
    */
    this.letter.prototype.regardingobjectid_incident_letterUri = function (uri) {
        this["regardingobjectid_incident_letter@odata.bind"] = uri;
    }

    /**
    @method regardingobjectid_opportunity_letterUri
    @memberof Sdk.Sample.letter
    @description  Choose the record that the letter relates to.
    @param {String} uri A URI to an existing Sdk.Sample.opportunity.
    */
    this.letter.prototype.regardingobjectid_opportunity_letterUri = function (uri) {
        this["regardingobjectid_opportunity_letter@odata.bind"] = uri;
    }

    /**
    @typeref {object} Sdk.Sample.opportunityclose
    @extends Sdk.Sample.activitypointer
    @description Activity that is created automatically when an opportunity is closed, containing information such as the description of the closing and actual revenue.
    @param {String|Object}[opportunitycloseReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.opportunityclose = function (opportunitycloseReference) {
        if (!(isInstanceOf(Sdk.Sample.opportunityclose, this))) {
            return new Sdk.Sample.opportunityclose(opportunitycloseReference);
        }
        Sdk.Sample.activitypointer.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            //Single-valued Navigation Properties,
            "activityid_activitypointer": {
                get: function () { return this.internal.activityid_activitypointer; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.activitypointer, "activitypointer", this, "activityid_activitypointer", value) },
                enumerable: true
            },
            "activityid_activitypointer@odata.bind": {
                get: function () { return this.internal.activityid_activitypointerUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.activitypointer, "activitypointer", this, "activityid_activitypointer", value) },
                enumerable: true
            },
            "competitorid": {
                get: function () { return this.internal.competitorid; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.competitor, "competitor", this, "competitorid", value) },
                enumerable: true
            },
            "competitorid@odata.bind": {
                get: function () { return this.internal.competitoridUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.competitor, "competitor", this, "competitorid", value) },
                enumerable: true
            },
            "opportunityid": {
                get: function () { return this.internal.opportunityid; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.opportunity, "opportunity", this, "opportunityid", value) },
                enumerable: true
            },
            "opportunityid@odata.bind": {
                get: function () { return this.internal.opportunityidUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.opportunity, "opportunity", this, "opportunityid", value) },
                enumerable: true
            },
            //Collection-Valued Navigation Properties,
            "OpportunityClose_Annotation": {
                get: function () { return this.internal.OpportunityClose_Annotation; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.annotation, "annotation", this, "OpportunityClose_Annotation", value) },
                enumerable: true,
            }
        });

        if (opportunitycloseReference) {
            init(this.internal, opportunitycloseReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.opportunityclose.prototype = Object.create(this.activitypointer.prototype);
    this.opportunityclose.isEntityClass = true;
    this.opportunityclose.prototype.type = "opportunityclose";
    this.opportunityclose.prototype.primaryKey = "activityid";
    this.opportunityclose.prototype.entitySetName = "opportunitycloses";
    this.opportunityclose.prototype.properties = Object.freeze({
        activityid: { name: "activityid", type: "Guid" },
        actualdurationminutes: { name: "actualdurationminutes", type: "Number" },
        description: { name: "description", type: "String" },
        scheduledend: { name: "scheduledend", type: "Date" },
        scheduledstart: { name: "scheduledstart", type: "Date" },
        subject: { name: "subject", type: "String" }
    });
    this.opportunityclose.prototype.lookups = Object.freeze({
        regardingobjectid_account: { name: "regardingobjectid_account", type: Sdk.Sample.account },
        regardingobjectid_contact: { name: "regardingobjectid_contact", type: Sdk.Sample.contact },
        regardingobjectid_incident: { name: "regardingobjectid_incident", type: Sdk.Sample.incident },
        regardingobjectid_opportunity: { name: "regardingobjectid_opportunity", type: Sdk.Sample.opportunity },
        activityid_activitypointer: { name: "activityid_activitypointer", type: Sdk.Sample.activitypointer },
        competitorid: { name: "competitorid", type: Sdk.Sample.competitor },
        opportunityid: { name: "opportunityid", type: Sdk.Sample.opportunity }
    });
    this.opportunityclose.prototype.collections = Object.freeze({
        activity_pointer_letter: { name: "activity_pointer_letter", type: Sdk.Sample.letter },
        activity_pointer_opportunity_close: { name: "activity_pointer_opportunity_close", type: Sdk.Sample.opportunityclose },
        activity_pointer_task: { name: "activity_pointer_task", type: Sdk.Sample.task },
        ActivityPointer_QueueItem: { name: "ActivityPointer_QueueItem", type: Sdk.Sample.queueitem },
        OpportunityClose_Annotation: { name: "OpportunityClose_Annotation", type: Sdk.Sample.annotation }
    });

    /**
    @method activityid_activitypointerUri
    @memberof Sdk.Sample.opportunityclose
    @description  Unique identifier of the opportunity close activity.
    @param {String} uri A URI to an existing Sdk.Sample.activitypointer.
    */
    this.opportunityclose.prototype.activityid_activitypointerUri = function (uri) {
        this["activityid_activitypointer@odata.bind"] = uri;
    }

    /**
    @method competitoridUri
    @memberof Sdk.Sample.opportunityclose
    @description  Unique identifier of the competitor with which the opportunity close activity is associated.
    @param {String} uri A URI to an existing Sdk.Sample.competitor.
    */
    this.opportunityclose.prototype.competitoridUri = function (uri) {
        this["competitorid@odata.bind"] = uri;
    }

    /**
    @method opportunityidUri
    @memberof Sdk.Sample.opportunityclose
    @description  Unique identifier of the opportunity closed.
    @param {String} uri A URI to an existing Sdk.Sample.opportunity.
    */
    this.opportunityclose.prototype.opportunityidUri = function (uri) {
        this["opportunityid@odata.bind"] = uri;
    }

    /**
    @typeref {object} Sdk.Sample.queue
    @extends Sdk.Sample.crmbaseentity
    @description A list of records that require action, such as accounts, activities, and cases.
    @param {String|Object}[queueReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.queue = function (queueReference) {
        if (!(isInstanceOf(Sdk.Sample.queue, this))) {
            return new Sdk.Sample.queue(queueReference);
        }
        Sdk.Sample.crmbaseentity.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            "queueid": {
                get: function () { return this.internal.queueid; },
                set: function (value) { setGuidOrNullProperty(this, "queueid", value) },
                enumerable: true
            },
            //Single-valued Navigation Properties,
            //Collection-Valued Navigation Properties,
            "queue_entries": {
                get: function () { return this.internal.queue_entries; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.queueitem, "queueitem", this, "queue_entries", value) },
                enumerable: true,
            }
        });

        if (queueReference) {
            init(this.internal, queueReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.queue.prototype = Object.create(this.crmbaseentity.prototype);
    this.queue.isEntityClass = true;
    this.queue.prototype.type = "queue";
    this.queue.prototype.primaryKey = "queueid";
    this.queue.prototype.entitySetName = "queues";
    this.queue.prototype.properties = Object.freeze({ queueid: { name: "queueid", type: "Guid" } });
    this.queue.prototype.lookups = Object.freeze({});
    this.queue.prototype.collections = Object.freeze({ queue_entries: { name: "queue_entries", type: Sdk.Sample.queueitem } });

    /**
    @typeref {object} Sdk.Sample.queueitem
    @extends Sdk.Sample.crmbaseentity
    @description A specific item in a queue, such as a case record or an activity record.
    @param {String|Object}[queueitemReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.queueitem = function (queueitemReference) {
        if (!(isInstanceOf(Sdk.Sample.queueitem, this))) {
            return new Sdk.Sample.queueitem(queueitemReference);
        }
        Sdk.Sample.crmbaseentity.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            "queueitemid": {
                get: function () { return this.internal.queueitemid; },
                set: function (value) { setGuidOrNullProperty(this, "queueitemid", value) },
                enumerable: true
            },
            //Single-valued Navigation Properties,
            "objectid_activitypointer": {
                get: function () { return this.internal.objectid_activitypointer; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.activitypointer, "activitypointer", this, "objectid_activitypointer", value) },
                enumerable: true
            },
            "objectid_activitypointer@odata.bind": {
                get: function () { return this.internal.objectid_activitypointerUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.activitypointer, "activitypointer", this, "objectid_activitypointer", value) },
                enumerable: true
            },
            "objectid_incident": {
                get: function () { return this.internal.objectid_incident; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.incident, "incident", this, "objectid_incident", value) },
                enumerable: true
            },
            "objectid_incident@odata.bind": {
                get: function () { return this.internal.objectid_incidentUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.incident, "incident", this, "objectid_incident", value) },
                enumerable: true
            },
            "objectid_letter": {
                get: function () { return this.internal.objectid_letter; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.letter, "letter", this, "objectid_letter", value) },
                enumerable: true
            },
            "objectid_letter@odata.bind": {
                get: function () { return this.internal.objectid_letterUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.letter, "letter", this, "objectid_letter", value) },
                enumerable: true
            },
            "objectid_task": {
                get: function () { return this.internal.objectid_task; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.task, "task", this, "objectid_task", value) },
                enumerable: true
            },
            "objectid_task@odata.bind": {
                get: function () { return this.internal.objectid_taskUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.task, "task", this, "objectid_task", value) },
                enumerable: true
            },
            "queueid": {
                get: function () { return this.internal.queueid; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.queue, "queue", this, "queueid", value) },
                enumerable: true
            },
            "queueid@odata.bind": {
                get: function () { return this.internal.queueidUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.queue, "queue", this, "queueid", value) },
                enumerable: true
            },
            //Collection-Valued Navigation Properties
        });

        if (queueitemReference) {
            init(this.internal, queueitemReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.queueitem.prototype = Object.create(this.crmbaseentity.prototype);
    this.queueitem.isEntityClass = true;
    this.queueitem.prototype.type = "queueitem";
    this.queueitem.prototype.primaryKey = "queueitemid";
    this.queueitem.prototype.entitySetName = "queueitems";
    this.queueitem.prototype.properties = Object.freeze({ queueitemid: { name: "queueitemid", type: "Guid" } });
    this.queueitem.prototype.lookups = Object.freeze({
        objectid_activitypointer: { name: "objectid_activitypointer", type: Sdk.Sample.activitypointer },
        objectid_incident: { name: "objectid_incident", type: Sdk.Sample.incident },
        objectid_letter: { name: "objectid_letter", type: Sdk.Sample.letter },
        objectid_task: { name: "objectid_task", type: Sdk.Sample.task },
        queueid: { name: "queueid", type: Sdk.Sample.queue }
    });
    this.queueitem.prototype.collections = Object.freeze({});

    /**
    @method objectid_activitypointerUri
    @memberof Sdk.Sample.queueitem
    @description  Choose the activity, case, or article assigned to the queue.
    @param {String} uri A URI to an existing Sdk.Sample.activitypointer.
    */
    this.queueitem.prototype.objectid_activitypointerUri = function (uri) {
        this["objectid_activitypointer@odata.bind"] = uri;
    }

    /**
    @method objectid_incidentUri
    @memberof Sdk.Sample.queueitem
    @description  Choose the activity, case, or article assigned to the queue.
    @param {String} uri A URI to an existing Sdk.Sample.incident.
    */
    this.queueitem.prototype.objectid_incidentUri = function (uri) {
        this["objectid_incident@odata.bind"] = uri;
    }

    /**
    @method objectid_letterUri
    @memberof Sdk.Sample.queueitem
    @description  Choose the activity, case, or article assigned to the queue.
    @param {String} uri A URI to an existing Sdk.Sample.letter.
    */
    this.queueitem.prototype.objectid_letterUri = function (uri) {
        this["objectid_letter@odata.bind"] = uri;
    }

    /**
    @method objectid_taskUri
    @memberof Sdk.Sample.queueitem
    @description  Choose the activity, case, or article assigned to the queue.
    @param {String} uri A URI to an existing Sdk.Sample.task.
    */
    this.queueitem.prototype.objectid_taskUri = function (uri) {
        this["objectid_task@odata.bind"] = uri;
    }

    /**
    @method queueidUri
    @memberof Sdk.Sample.queueitem
    @description  Choose the queue that the item is assigned to.
    @param {String} uri A URI to an existing Sdk.Sample.queue.
    */
    this.queueitem.prototype.queueidUri = function (uri) {
        this["queueid@odata.bind"] = uri;
    }

    /**
    @typeref {object} Sdk.Sample.annotation
    @extends Sdk.Sample.crmbaseentity
    @description Note that is attached to one or more objects, including other notes.
    @param {String|Object}[annotationReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.annotation = function (annotationReference) {
        if (!(isInstanceOf(Sdk.Sample.annotation, this))) {
            return new Sdk.Sample.annotation(annotationReference);
        }
        Sdk.Sample.crmbaseentity.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            "annotationid": {
                get: function () { return this.internal.annotationid; },
                set: function (value) { setGuidOrNullProperty(this, "annotationid", value) },
                enumerable: true
            },
            //Single-valued Navigation Properties,
            "objectid_account": {
                get: function () { return this.internal.objectid_account; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.account, "account", this, "objectid_account", value) },
                enumerable: true
            },
            "objectid_account@odata.bind": {
                get: function () { return this.internal.objectid_accountUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.account, "account", this, "objectid_account", value) },
                enumerable: true
            },
            "objectid_competitor": {
                get: function () { return this.internal.objectid_competitor; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.competitor, "competitor", this, "objectid_competitor", value) },
                enumerable: true
            },
            "objectid_competitor@odata.bind": {
                get: function () { return this.internal.objectid_competitorUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.competitor, "competitor", this, "objectid_competitor", value) },
                enumerable: true
            },
            "objectid_contact": {
                get: function () { return this.internal.objectid_contact; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.contact, "contact", this, "objectid_contact", value) },
                enumerable: true
            },
            "objectid_contact@odata.bind": {
                get: function () { return this.internal.objectid_contactUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.contact, "contact", this, "objectid_contact", value) },
                enumerable: true
            },
            "objectid_incident": {
                get: function () { return this.internal.objectid_incident; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.incident, "incident", this, "objectid_incident", value) },
                enumerable: true
            },
            "objectid_incident@odata.bind": {
                get: function () { return this.internal.objectid_incidentUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.incident, "incident", this, "objectid_incident", value) },
                enumerable: true
            },
            "objectid_letter": {
                get: function () { return this.internal.objectid_letter; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.letter, "letter", this, "objectid_letter", value) },
                enumerable: true
            },
            "objectid_letter@odata.bind": {
                get: function () { return this.internal.objectid_letterUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.letter, "letter", this, "objectid_letter", value) },
                enumerable: true
            },
            "objectid_opportunity": {
                get: function () { return this.internal.objectid_opportunity; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.opportunity, "opportunity", this, "objectid_opportunity", value) },
                enumerable: true
            },
            "objectid_opportunity@odata.bind": {
                get: function () { return this.internal.objectid_opportunityUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.opportunity, "opportunity", this, "objectid_opportunity", value) },
                enumerable: true
            },
            "objectid_opportunityclose": {
                get: function () { return this.internal.objectid_opportunityclose; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.opportunityclose, "opportunityclose", this, "objectid_opportunityclose", value) },
                enumerable: true
            },
            "objectid_opportunityclose@odata.bind": {
                get: function () { return this.internal.objectid_opportunitycloseUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.opportunityclose, "opportunityclose", this, "objectid_opportunityclose", value) },
                enumerable: true
            },
            "objectid_task": {
                get: function () { return this.internal.objectid_task; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.task, "task", this, "objectid_task", value) },
                enumerable: true
            },
            "objectid_task@odata.bind": {
                get: function () { return this.internal.objectid_taskUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.task, "task", this, "objectid_task", value) },
                enumerable: true
            },
            //Collection-Valued Navigation Properties
        });

        if (annotationReference) {
            init(this.internal, annotationReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.annotation.prototype = Object.create(this.crmbaseentity.prototype);
    this.annotation.isEntityClass = true;
    this.annotation.prototype.type = "annotation";
    this.annotation.prototype.primaryKey = "annotationid";
    this.annotation.prototype.entitySetName = "annotations";
    this.annotation.prototype.properties = Object.freeze({ annotationid: { name: "annotationid", type: "Guid" } });
    this.annotation.prototype.lookups = Object.freeze({
        objectid_account: { name: "objectid_account", type: Sdk.Sample.account },
        objectid_competitor: { name: "objectid_competitor", type: Sdk.Sample.competitor },
        objectid_contact: { name: "objectid_contact", type: Sdk.Sample.contact },
        objectid_incident: { name: "objectid_incident", type: Sdk.Sample.incident },
        objectid_letter: { name: "objectid_letter", type: Sdk.Sample.letter },
        objectid_opportunity: { name: "objectid_opportunity", type: Sdk.Sample.opportunity },
        objectid_opportunityclose: { name: "objectid_opportunityclose", type: Sdk.Sample.opportunityclose },
        objectid_task: { name: "objectid_task", type: Sdk.Sample.task }
    });
    this.annotation.prototype.collections = Object.freeze({});

    /**
    @method objectid_accountUri
    @memberof Sdk.Sample.annotation
    @description  Unique identifier of the object with which the note is associated.
    @param {String} uri A URI to an existing Sdk.Sample.account.
    */
    this.annotation.prototype.objectid_accountUri = function (uri) {
        this["objectid_account@odata.bind"] = uri;
    }

    /**
    @method objectid_competitorUri
    @memberof Sdk.Sample.annotation
    @description  Unique identifier of the object with which the note is associated.
    @param {String} uri A URI to an existing Sdk.Sample.competitor.
    */
    this.annotation.prototype.objectid_competitorUri = function (uri) {
        this["objectid_competitor@odata.bind"] = uri;
    }

    /**
    @method objectid_contactUri
    @memberof Sdk.Sample.annotation
    @description  Unique identifier of the object with which the note is associated.
    @param {String} uri A URI to an existing Sdk.Sample.contact.
    */
    this.annotation.prototype.objectid_contactUri = function (uri) {
        this["objectid_contact@odata.bind"] = uri;
    }

    /**
    @method objectid_incidentUri
    @memberof Sdk.Sample.annotation
    @description  Unique identifier of the object with which the note is associated.
    @param {String} uri A URI to an existing Sdk.Sample.incident.
    */
    this.annotation.prototype.objectid_incidentUri = function (uri) {
        this["objectid_incident@odata.bind"] = uri;
    }

    /**
    @method objectid_letterUri
    @memberof Sdk.Sample.annotation
    @description  Unique identifier of the object with which the note is associated.
    @param {String} uri A URI to an existing Sdk.Sample.letter.
    */
    this.annotation.prototype.objectid_letterUri = function (uri) {
        this["objectid_letter@odata.bind"] = uri;
    }

    /**
    @method objectid_opportunityUri
    @memberof Sdk.Sample.annotation
    @description  Unique identifier of the object with which the note is associated.
    @param {String} uri A URI to an existing Sdk.Sample.opportunity.
    */
    this.annotation.prototype.objectid_opportunityUri = function (uri) {
        this["objectid_opportunity@odata.bind"] = uri;
    }

    /**
    @method objectid_opportunitycloseUri
    @memberof Sdk.Sample.annotation
    @description  Unique identifier of the object with which the note is associated.
    @param {String} uri A URI to an existing Sdk.Sample.opportunityclose.
    */
    this.annotation.prototype.objectid_opportunitycloseUri = function (uri) {
        this["objectid_opportunityclose@odata.bind"] = uri;
    }

    /**
    @method objectid_taskUri
    @memberof Sdk.Sample.annotation
    @description  Unique identifier of the object with which the note is associated.
    @param {String} uri A URI to an existing Sdk.Sample.task.
    */
    this.annotation.prototype.objectid_taskUri = function (uri) {
        this["objectid_task@odata.bind"] = uri;
    }

    /**
    @typeref {object} Sdk.Sample.incident
    @extends Sdk.Sample.crmbaseentity
    @description Service request case associated with a contract.
    @param {String|Object}[incidentReference] A GUID, a URI, or a JSON object to set retrieved values.
    */
    this.incident = function (incidentReference) {
        if (!(isInstanceOf(Sdk.Sample.incident, this))) {
            return new Sdk.Sample.incident(incidentReference);
        }
        Sdk.Sample.crmbaseentity.call(this);
        Object.defineProperties(this,
        {
            "@odata.type": {
                get: function () { return "Microsoft.Dynamics.CRM." + this.type; },
                enumerable: true
            },
            //Properties,
            "incidentid": {
                get: function () { return this.internal.incidentid; },
                set: function (value) { setGuidOrNullProperty(this, "incidentid", value) },
                enumerable: true
            },
            //Single-valued Navigation Properties,
            "customerid_account": {
                get: function () { return this.internal.customerid_account; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.account, "account", this, "customerid_account", value) },
                enumerable: true
            },
            "customerid_account@odata.bind": {
                get: function () { return this.internal.customerid_accountUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.account, "account", this, "customerid_account", value) },
                enumerable: true
            },
            "customerid_contact": {
                get: function () { return this.internal.customerid_contact; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.contact, "contact", this, "customerid_contact", value) },
                enumerable: true
            },
            "customerid_contact@odata.bind": {
                get: function () { return this.internal.customerid_contactUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.contact, "contact", this, "customerid_contact", value) },
                enumerable: true
            },
            "existingcase": {
                get: function () { return this.internal.existingcase; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.incident, "incident", this, "existingcase", value) },
                enumerable: true
            },
            "existingcase@odata.bind": {
                get: function () { return this.internal.existingcaseUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.incident, "incident", this, "existingcase", value) },
                enumerable: true
            },
            "masterid": {
                get: function () { return this.internal.masterid; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.incident, "incident", this, "masterid", value) },
                enumerable: true
            },
            "masterid@odata.bind": {
                get: function () { return this.internal.masteridUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.incident, "incident", this, "masterid", value) },
                enumerable: true
            },
            "parentcaseid": {
                get: function () { return this.internal.parentcaseid; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.incident, "incident", this, "parentcaseid", value) },
                enumerable: true
            },
            "parentcaseid@odata.bind": {
                get: function () { return this.internal.parentcaseidUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.incident, "incident", this, "parentcaseid", value) },
                enumerable: true
            },
            "primarycontactid": {
                get: function () { return this.internal.primarycontactid; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.contact, "contact", this, "primarycontactid", value) },
                enumerable: true
            },
            "primarycontactid@odata.bind": {
                get: function () { return this.internal.primarycontactidUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.contact, "contact", this, "primarycontactid", value) },
                enumerable: true
            },
            "responsiblecontactid": {
                get: function () { return this.internal.responsiblecontactid; },
                set: function (value) { lookupPropertySetter(Sdk.Sample.contact, "contact", this, "responsiblecontactid", value) },
                enumerable: true
            },
            "responsiblecontactid@odata.bind": {
                get: function () { return this.internal.responsiblecontactidUri; },
                set: function (value) { lookupPropertyBinder(Sdk.Sample.contact, "contact", this, "responsiblecontactid", value) },
                enumerable: true
            },
            //Collection-Valued Navigation Properties,
            "Incident_ActivityPointers": {
                get: function () { return this.internal.Incident_ActivityPointers; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.activitypointer, "activitypointer", this, "Incident_ActivityPointers", value) },
                enumerable: true,
            },
            "Incident_Annotation": {
                get: function () { return this.internal.Incident_Annotation; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.annotation, "annotation", this, "Incident_Annotation", value) },
                enumerable: true,
            },
            "incident_existingcase": {
                get: function () { return this.internal.incident_existingcase; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.incident, "incident", this, "incident_existingcase", value) },
                enumerable: true,
            },
            "Incident_Letters": {
                get: function () { return this.internal.Incident_Letters; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.letter, "letter", this, "Incident_Letters", value) },
                enumerable: true,
            },
            "incident_master_incident": {
                get: function () { return this.internal.incident_master_incident; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.incident, "incident", this, "incident_master_incident", value) },
                enumerable: true,
            },
            "incident_parent_incident": {
                get: function () { return this.internal.incident_parent_incident; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.incident, "incident", this, "incident_parent_incident", value) },
                enumerable: true,
            },
            "Incident_QueueItem": {
                get: function () { return this.internal.Incident_QueueItem; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.queueitem, "queueitem", this, "Incident_QueueItem", value) },
                enumerable: true,
            },
            "Incident_Tasks": {
                get: function () { return this.internal.Incident_Tasks; },
                set: function (value) { collectionPropertySetter(Sdk.Sample.task, "task", this, "Incident_Tasks", value) },
                enumerable: true,
            }
        });

        if (incidentReference) {
            init(this.internal, incidentReference, this.primaryKey, this.type, this.changedProperties);
        }
        return Object.seal(this);
    }
    this.incident.prototype = Object.create(this.crmbaseentity.prototype);
    this.incident.isEntityClass = true;
    this.incident.prototype.type = "incident";
    this.incident.prototype.primaryKey = "incidentid";
    this.incident.prototype.entitySetName = "incidents";
    this.incident.prototype.properties = Object.freeze({ incidentid: { name: "incidentid", type: "Guid" } });
    this.incident.prototype.lookups = Object.freeze({
        customerid_account: { name: "customerid_account", type: Sdk.Sample.account },
        customerid_contact: { name: "customerid_contact", type: Sdk.Sample.contact },
        existingcase: { name: "existingcase", type: Sdk.Sample.incident },
        masterid: { name: "masterid", type: Sdk.Sample.incident },
        parentcaseid: { name: "parentcaseid", type: Sdk.Sample.incident },
        primarycontactid: { name: "primarycontactid", type: Sdk.Sample.contact },
        responsiblecontactid: { name: "responsiblecontactid", type: Sdk.Sample.contact }
    });
    this.incident.prototype.collections = Object.freeze({
        Incident_ActivityPointers: { name: "Incident_ActivityPointers", type: Sdk.Sample.activitypointer },
        Incident_Annotation: { name: "Incident_Annotation", type: Sdk.Sample.annotation },
        incident_existingcase: { name: "incident_existingcase", type: Sdk.Sample.incident },
        Incident_Letters: { name: "Incident_Letters", type: Sdk.Sample.letter },
        incident_master_incident: { name: "incident_master_incident", type: Sdk.Sample.incident },
        incident_parent_incident: { name: "incident_parent_incident", type: Sdk.Sample.incident },
        Incident_QueueItem: { name: "Incident_QueueItem", type: Sdk.Sample.queueitem },
        Incident_Tasks: { name: "Incident_Tasks", type: Sdk.Sample.task }
    });

    /**
    @method customerid_accountUri
    @memberof Sdk.Sample.incident
    @description  Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
    @param {String} uri A URI to an existing Sdk.Sample.account.
    */
    this.incident.prototype.customerid_accountUri = function (uri) {
        this["customerid_account@odata.bind"] = uri;
    }

    /**
    @method customerid_contactUri
    @memberof Sdk.Sample.incident
    @description  Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
    @param {String} uri A URI to an existing Sdk.Sample.contact.
    */
    this.incident.prototype.customerid_contactUri = function (uri) {
        this["customerid_contact@odata.bind"] = uri;
    }

    /**
    @method existingcaseUri
    @memberof Sdk.Sample.incident
    @description  Select an existing case for the customer that has been populated. For internal use only.
    @param {String} uri A URI to an existing Sdk.Sample.incident.
    */
    this.incident.prototype.existingcaseUri = function (uri) {
        this["existingcase@odata.bind"] = uri;
    }

    /**
    @method masteridUri
    @memberof Sdk.Sample.incident
    @description  Choose the primary case the current case was merged into.
    @param {String} uri A URI to an existing Sdk.Sample.incident.
    */
    this.incident.prototype.masteridUri = function (uri) {
        this["masterid@odata.bind"] = uri;
    }

    /**
    @method parentcaseidUri
    @memberof Sdk.Sample.incident
    @description  Choose the parent case for a case.
    @param {String} uri A URI to an existing Sdk.Sample.incident.
    */
    this.incident.prototype.parentcaseidUri = function (uri) {
        this["parentcaseid@odata.bind"] = uri;
    }

    /**
    @method primarycontactidUri
    @memberof Sdk.Sample.incident
    @description  Select a primary contact for this case.
    @param {String} uri A URI to an existing Sdk.Sample.contact.
    */
    this.incident.prototype.primarycontactidUri = function (uri) {
        this["primarycontactid@odata.bind"] = uri;
    }

    /**
    @method responsiblecontactidUri
    @memberof Sdk.Sample.incident
    @description  Choose an additional customer contact who can also help resolve the case.
    @param {String} uri A URI to an existing Sdk.Sample.contact.
    */
    this.incident.prototype.responsiblecontactidUri = function (uri) {
        this["responsiblecontactid@odata.bind"] = uri;
    }

    /**
    * @function Sdk.Sample.CalculateTotalTimeIncident
    * @memberOf Sdk.Sample
    * @description Calculates the total time, in minutes, that you used while you worked on an incident (case).
    * @param {String} uri A url for a incident to apply the function to.
    * @param {String} [callerId] A string representation of the GUID value for the user to impersonate.
    * @returns {Promise} A Sdk.Sample.CalculateTotalTimeIncidentResponse instance when resolved or an Error if rejected. 
    */
    this.CalculateTotalTimeIncident = function (
        uri,
        callerId
        ) {
        if (!isString(uri)) {
            throw new Error(NS + ".CalculateTotalTimeIncident uri parameter must be a string.");
        }
        if (!isOptionalGuid(callerId)) {
            throw new Error(NS + ".CalculateTotalTimeIncident callerId parameter must be a string representation of a GUID value, null or undefined.");
        }
        return invokeFunction("CalculateTotalTimeIncident", null, uri, null, null, callerId, Sdk.Sample.CalculateTotalTimeIncidentResponse);
    }
    /**
    * @function Sdk.Sample.GetTimeZoneCodeByLocalizedName
    * @memberOf Sdk.Sample
    * @description Retrieves the time zone code for the specified localized time zone name.
    * @param {String} localizedStandardName The localized name to search for.
    * @param {Number} localeId The locale ID.
    * @param {String} [callerId] A string representation of the GUID value for the user to impersonate.
    * @returns {Promise} A Sdk.Sample.GetTimeZoneCodeByLocalizedNameResponse instance when resolved or an Error if rejected. 
    */
    this.GetTimeZoneCodeByLocalizedName = function (
        localizedStandardName,
        localeId,
        callerId
        ) {
        if (!isString(localizedStandardName)) {
            throw new Error(NS + ".GetTimeZoneCodeByLocalizedName localizedStandardName parameter must be a String value.");
        }
        if (!isNumber(localeId)) {
            throw new Error(NS + ".GetTimeZoneCodeByLocalizedName localeId parameter must be a Number value.");
        }
        if (!isOptionalGuid(callerId)) {
            throw new Error(NS + ".GetTimeZoneCodeByLocalizedName callerId parameter must be a string representation of a GUID value, null or undefined.");
        }
        var parameters = [];
        if (localizedStandardName) {
            parameters.push({ "LocalizedStandardName": localizedStandardName });
        }
        if (localeId) {
            parameters.push({ "LocaleId": localeId });
        }
        return invokeFunction("GetTimeZoneCodeByLocalizedName", parameters, null, null, null, callerId, Sdk.Sample.GetTimeZoneCodeByLocalizedNameResponse);
    }
    /**
    * @function Sdk.Sample.WhoAmI
    * @memberOf Sdk.Sample
    * @description Retrieves system information for the currently logged on user.
    * @returns {Promise} A Sdk.Sample.WhoAmIResponse instance when resolved or an Error if rejected. 
    */
    this.WhoAmI = function () {
        return invokeFunction("WhoAmI", null, null, null, null, null, Sdk.Sample.WhoAmIResponse);
    }

    /**
    * @function Sdk.Sample.AddToQueue
    * @memberOf Sdk.Sample
    * @description Moves an entity record from a source queue to a destination queue.
    * @param {String} uri A url for a queue to apply the action to.
    * @param {Sdk.Sample.crmbaseentity} target The destination queue.
    * @param {Sdk.Sample.queue} [sourceQueue] The source queue.
    * @param {Sdk.Sample.queueitem} [queueItemProperties] Properties required to create a queue item in the destination queue.
    * @param {String} [callerId] A string representation of the GUID value for the user to impersonate.
    * @returns {Promise} A Sdk.Sample.AddToQueueResponse instance when resolved or an Error if rejected. 
    */
    this.AddToQueue = function (
        uri,
        target,
        sourceQueue,
        queueItemProperties,
        callerId
        ) {
        if (!isString(uri)) {
            throw new Error(NS + ".AddToQueue uri parameter must be a string.");
        }
        if (!isInstanceOf(Sdk.Sample.crmbaseentity, target)) {
            throw new Error(NS + ".AddToQueue target parameter must be a Sdk.Sample.crmbaseentity value.");
        }
        if (!isOptionalInstanceOfOrNull(Sdk.Sample.queue, sourceQueue)) {
            throw new Error(NS + ".AddToQueue sourceQueue parameter must be a Sdk.Sample.queue value or null.");
        }
        if (!isOptionalInstanceOfOrNull(Sdk.Sample.queueitem, queueItemProperties)) {
            throw new Error(NS + ".AddToQueue queueItemProperties parameter must be a Sdk.Sample.queueitem value or null.");
        }
        if (!isOptionalGuid(callerId)) {
            throw new Error(NS + ".AddToQueue callerId parameter must be a string representation of a GUID value, null or undefined.");
        }
        var parameterObj = {};
        parameterObj.Target = target;
        (!isNullOrUndefined(sourceQueue) ? parameterObj.SourceQueue = sourceQueue : null);
        (!isNullOrUndefined(queueItemProperties) ? parameterObj.QueueItemProperties = queueItemProperties : null);
        return invokeAction("AddToQueue", parameterObj, uri, callerId, Sdk.Sample.AddToQueueResponse);
    }
    /**
    * @function Sdk.Sample.sample_AddNoteToContact
    * @memberOf Sdk.Sample
    * @description 
    * @param {String} uri A url for a contact to apply the action to.
    * @param {String} noteTitle 
    * @param {String} noteText 
    * @param {String} [callerId] A string representation of the GUID value for the user to impersonate.
    * @returns {Promise} A Sdk.Sample.annotation instance when resolved or an Error if rejected. 
    */
    this.sample_AddNoteToContact = function (
        uri,
        noteTitle,
        noteText,
        callerId
        ) {
        if (!isString(uri)) {
            throw new Error(NS + ".sample_AddNoteToContact uri parameter must be a string.");
        }
        if (!isString(noteTitle)) {
            throw new Error(NS + ".sample_AddNoteToContact noteTitle parameter must be a String value.");
        }
        if (!isString(noteText)) {
            throw new Error(NS + ".sample_AddNoteToContact noteText parameter must be a String value.");
        }
        if (!isOptionalGuid(callerId)) {
            throw new Error(NS + ".sample_AddNoteToContact callerId parameter must be a string representation of a GUID value, null or undefined.");
        }
        var parameterObj = {};
        parameterObj.NoteTitle = noteTitle;
        parameterObj.NoteText = noteText;
        return invokeAction("sample_AddNoteToContact", parameterObj, uri, callerId, Sdk.Sample.annotation);
    }
    /**
    * @function Sdk.Sample.sample_CreateCustomer
    * @memberOf Sdk.Sample
    * @description 
    * @param {String} customerType 
    * @param {String} [accountName] 
    * @param {String} [contactFirstName] 
    * @param {String} [contactLastName] 
    * @param {String} [callerId] A string representation of the GUID value for the user to impersonate.
    * @returns {Promise} null when resolved or an Error if rejected.
    */
    this.sample_CreateCustomer = function (
        customerType,
        accountName,
        contactFirstName,
        contactLastName,
        callerId
        ) {
        if (!isString(customerType)) {
            throw new Error(NS + ".sample_CreateCustomer customerType parameter must be a String value.");
        }
        if (!isOptionalString(accountName)) {
            throw new Error(NS + ".sample_CreateCustomer accountName parameter must be a String value or null.");
        }
        if (!isOptionalString(contactFirstName)) {
            throw new Error(NS + ".sample_CreateCustomer contactFirstName parameter must be a String value or null.");
        }
        if (!isOptionalString(contactLastName)) {
            throw new Error(NS + ".sample_CreateCustomer contactLastName parameter must be a String value or null.");
        }
        if (!isOptionalGuid(callerId)) {
            throw new Error(NS + ".sample_CreateCustomer callerId parameter must be a string representation of a GUID value, null or undefined.");
        }
        var parameterObj = {};
        parameterObj.CustomerType = customerType;
        (!isNullOrUndefined(accountName) ? parameterObj.AccountName = accountName : null);
        (!isNullOrUndefined(contactFirstName) ? parameterObj.ContactFirstName = contactFirstName : null);
        (!isNullOrUndefined(contactLastName) ? parameterObj.ContactLastName = contactLastName : null);
        return invokeAction("sample_CreateCustomer", parameterObj, null, callerId);
    }
    /**
    * @function Sdk.Sample.WinOpportunity
    * @memberOf Sdk.Sample
    * @description Sets the state of an opportunity to Won.
    * @param {Sdk.Sample.opportunityclose} opportunityClose The opportunity close activity associated with this state change.
    * @param {Number} status Status of the opportunity.
    * @param {String} [callerId] A string representation of the GUID value for the user to impersonate.
    * @returns {Promise} null when resolved or an Error if rejected.
    */
    this.WinOpportunity = function (
        opportunityClose,
        status,
        callerId
        ) {
        if (!isInstanceOf(Sdk.Sample.opportunityclose, opportunityClose)) {
            throw new Error(NS + ".WinOpportunity opportunityClose parameter must be a Sdk.Sample.opportunityclose value.");
        }
        if (!isNumber(status)) {
            throw new Error(NS + ".WinOpportunity status parameter must be a Number value.");
        }
        if (!isOptionalGuid(callerId)) {
            throw new Error(NS + ".WinOpportunity callerId parameter must be a string representation of a GUID value, null or undefined.");
        }
        var parameterObj = {};
        parameterObj.OpportunityClose = opportunityClose;
        parameterObj.Status = status;
        return invokeAction("WinOpportunity", parameterObj, null, callerId);
    }

    /**
    @typeref {object} Sdk.Sample.AddToQueueResponse
    @memberOf Sdk.Sample
    @description Contains the response from the AddToQueue action.
    @property {Guid} QueueItemId The ID of the queue item that is created in the destination queue.
    */
    this.AddToQueueResponse = function (JSONData) {
        if (!isInstanceOf(Sdk.Sample.AddToQueueResponse, this)) {
            return new Sdk.Sample.AddToQueueResponse(JSONData);
        }
        var data = {};
        if (JSONData) {
            data = JSONData;
        }
        Object.defineProperties(this,
    {
        "QueueItemId": {
            get: function () { return data.QueueItemId; },
            set: function (value) {
                if (!isGuid(value)) {
                    throw new Error(NS + ".QueueItemId must be a Guid.")
                }
                data["QueueItemId"] = value;
            },
            enumerable: true
        }
    });
    }
    /**
    @typeref {object} Sdk.Sample.BooleanManagedProperty
    @memberOf Sdk.Sample
    @description Defines a managed property that stores a Boolean value.
    @property {Boolean} Value The value of the managed property.
    @property {Boolean} CanBeChanged Whether the managed property value can be changed.
    @property {String} ManagedPropertyLogicalName The logical name for the managed property.
    */
    this.BooleanManagedProperty = function (JSONData) {
        if (!isInstanceOf(Sdk.Sample.BooleanManagedProperty, this)) {
            return new Sdk.Sample.BooleanManagedProperty(JSONData);
        }
        var data = {};
        if (JSONData) {
            data = JSONData;
        }
        Object.defineProperties(this,
    {
        "Value": {
            get: function () { return data.Value; },
            set: function (value) {
                if (!isBoolean(value)) {
                    throw new Error(NS + ".Value must be a Boolean.")
                }
                data["Value"] = value;
            },
            enumerable: true
        },
        "CanBeChanged": {
            get: function () { return data.CanBeChanged; },
            set: function (value) {
                if (!isBoolean(value)) {
                    throw new Error(NS + ".CanBeChanged must be a Boolean.")
                }
                data["CanBeChanged"] = value;
            },
            enumerable: true
        },
        "ManagedPropertyLogicalName": {
            get: function () { return data.ManagedPropertyLogicalName; },
            set: function (value) {
                if (!isStringOrNull(value)) {
                    throw new Error(NS + ".ManagedPropertyLogicalName must be a String or null.")
                }
                data["ManagedPropertyLogicalName"] = value;
            },
            enumerable: true
        }
    });
    }
    /**
    @typeref {object} Sdk.Sample.CalculateTotalTimeIncidentResponse
    @memberOf Sdk.Sample
    @description Contains the response from the CalculateTotalTimeIncident function.
    @property {Number} TotalTime The total time in minutes that it takes to work on an incident (case).
    */
    this.CalculateTotalTimeIncidentResponse = function (JSONData) {
        if (!isInstanceOf(Sdk.Sample.CalculateTotalTimeIncidentResponse, this)) {
            return new Sdk.Sample.CalculateTotalTimeIncidentResponse(JSONData);
        }
        var data = {};
        if (JSONData) {
            data = JSONData;
        }
        Object.defineProperties(this,
    {
        "TotalTime": {
            get: function () { return data.TotalTime; },
            set: function (value) {
                if (!isNumber(value)) {
                    throw new Error(NS + ".TotalTime must be a Number.")
                }
                data["TotalTime"] = value;
            },
            enumerable: true
        }
    });
    }
    /**
    @typeref {object} Sdk.Sample.GetTimeZoneCodeByLocalizedNameResponse
    @memberOf Sdk.Sample
    @description Contains the response from the GetTimeZoneCodeByLocalizedName function.
    @property {Number} TimeZoneCode The time zone code that has the requested localized name.
    */
    this.GetTimeZoneCodeByLocalizedNameResponse = function (JSONData) {
        if (!isInstanceOf(Sdk.Sample.GetTimeZoneCodeByLocalizedNameResponse, this)) {
            return new Sdk.Sample.GetTimeZoneCodeByLocalizedNameResponse(JSONData);
        }
        var data = {};
        if (JSONData) {
            data = JSONData;
        }
        Object.defineProperties(this,
    {
        "TimeZoneCode": {
            get: function () { return data.TimeZoneCode; },
            set: function (value) {
                if (!isNumber(value)) {
                    throw new Error(NS + ".TimeZoneCode must be a Number.")
                }
                data["TimeZoneCode"] = value;
            },
            enumerable: true
        }
    });
    }
    /**
    @typeref {object} Sdk.Sample.WhoAmIResponse
    @memberOf Sdk.Sample
    @description Contains the response from WhoAmI function.
    @property {Guid} BusinessUnitId ID of the business to which the logged on user belongs.
    @property {Guid} UserId ID of the user who is logged on.
    @property {Guid} OrganizationId ID of the organization that the user belongs to.
    */
    this.WhoAmIResponse = function (JSONData) {
        if (!isInstanceOf(Sdk.Sample.WhoAmIResponse, this)) {
            return new Sdk.Sample.WhoAmIResponse(JSONData);
        }
        var data = {};
        if (JSONData) {
            data = JSONData;
        }
        Object.defineProperties(this,
    {
        "BusinessUnitId": {
            get: function () { return data.BusinessUnitId; },
            set: function (value) {
                if (!isGuid(value)) {
                    throw new Error(NS + ".BusinessUnitId must be a Guid.")
                }
                data["BusinessUnitId"] = value;
            },
            enumerable: true
        },
        "UserId": {
            get: function () { return data.UserId; },
            set: function (value) {
                if (!isGuid(value)) {
                    throw new Error(NS + ".UserId must be a Guid.")
                }
                data["UserId"] = value;
            },
            enumerable: true
        },
        "OrganizationId": {
            get: function () { return data.OrganizationId; },
            set: function (value) {
                if (!isGuid(value)) {
                    throw new Error(NS + ".OrganizationId must be a Guid.")
                }
                data["OrganizationId"] = value;
            },
            enumerable: true
        }
    });
    }



    //#region Core functions  
    //Property Setters

    function setBooleanManagedProperty(entity, propertyName, value) {
        propertySetter(isBooleanManagedProperty, NS + ".BooleanManagedProperty value or null", entity, propertyName, value);
    }

    function setGuidOrNullProperty(entity, propertyName, value) {
        propertySetter(isGuidOrNull, "String representation of a GUID value or null", entity, propertyName, value);
    }

    function setDateTimeOffsetOrNullProperty(entity, propertyName, value) {
        propertySetter(isDateOrNull, "Date value or null", entity, propertyName, value);
    }

    function setBooleanProperty(entity, propertyName, value) {
        propertySetter(isBoolean, "Boolean value", entity, propertyName, value);
    }

    function setNumberOrNullProperty(entity, propertyName, value) {
        propertySetter(isNumberOrNull, "Number value or null", entity, propertyName, value);
    }

    function setStringOrNullProperty(entity, propertyName, value) {
        propertySetter(isStringOrNull, "String value or null", entity, propertyName, value);
    }

    function propertySetter(validationFunction, requirement, entity, propertyName, value) {
        if (!validationFunction(value)) {
            throw new Error(NS + "." + entity.type + " " + propertyName + " property must be a " + requirement + ".");
        }
        if (entity.internal[propertyName] != value) {
            entity.addChangedProperty(propertyName);
            entity.internal[propertyName] = value;
        }
    }

    //Special because it requires convertToEdmDateString to be called on the value.
    function setDateOnlyProperty(entity, propertyName, value) {
        if (!isDateOrNull(value)) {
            throw new Error(NS + "." + entity.type + " " + propertyName + " property must be a Date value or null.");
        }
        if (entity.internal[propertyName] != convertToEdmDateString(value)) {
            entity.addChangedProperty(propertyName);
            entity.internal[propertyName] = convertToEdmDateString(value);
        }
    }

    //Lookup Property Setter
    function lookupPropertySetter(type, typeName, entity, propertyName, value) {
        if (!isInstanceOf(type, value)) {
            throw new Error(NS + "." + entity.type + " " + propertyName + " property must be a " + NS + "." + typeName + " value.");
        }
        if (entity.internal[propertyName] != value) {
            entity.addChangedProperty(propertyName);
            entity.internal[propertyName] = value;
        }
    }

    //Lookup Property Binder
    function lookupPropertyBinder(type, typeName, entity, propertyName, value) {
        if (!isTypedUri(type, value)) {
            throw new Error(NS + "." + entity.type + " " + propertyName + "@odata.bind must be a URI for an " + NS + "." + typeName + ".");
        }
        if (entity.internal[propertyName + "Uri"] != value) {
            entity.addChangedProperty(propertyName + "@odata.bind");
            entity.internal[propertyName + "Uri"] = value;
        }
    }

    //Collection Property Setter
    function collectionPropertySetter(type, typeName, entity, propertyName, value) {
        if (!isArrayOf(type, value)) {
            throw new Error(NS + "." + entity.type + " " + propertyName + " property must be an Array of " + NS + "." + typeName + ".");
        }
        if (entity.internal[propertyName] != value) {
            entity.addChangedProperty(propertyName);
            entity.internal[propertyName] = value;
        }
    }

    //Internal Helper functions

    //Used in constructors to set initial property values
    function init(internal, entityReference, primarykey, type, changedProperties) {
        if (isGuid(entityReference)) {
            internal[primarykey] = entityReference;
        }
        else {

            if (isString(entityReference)) {
                try {
                    internal[primarykey] = getIdFromUri(Sdk.Sample[type], entityReference);
                } catch (e) {
                    throw e;
                }

            }
            else {
                if (entityReference["@odata.id"]) {
                    try {
                        internal[primarykey] = getIdFromUri(Sdk.Sample[type], entityReference["@odata.id"]);
                    } catch (e) {
                        throw e;
                    }
                }
                else {
                    for (var property in entityReference) {
                        internal[property.replace("@odata.bind", "Uri")] = entityReference[property];
                        changedProperties.push(property);
                    }
                }
            }
        }
    }
    //Used to convert JavaScript Dates to strings that match Edm.Date properties
    function convertToEdmDateString(date) {
        if (isDate(date)) {
            var month = date.getUTCMonth() + 1;
            month = (month <= 9) ? "0" + month : month;
            var dateValue = date.getUTCDate();
            dateValue = (dateValue <= 9) ? "0" + dateValue : dateValue;

            return date.getUTCFullYear() + "-" + month + "-" + dateValue;
        }
        else {
            throw new Error(NS + ".js error: convertToEdmDateString requires date object");
        }
    }
    //Used to convert JavaScript Dates to strings that match Edm.DateTimeOffset properties
    function convertToEdmDateTimeOffSetString(date) {

        if (isDate(date)) {
            var month = date.getUTCMonth() + 1;
            month = (month <= 9) ? "0" + month : month;
            var dateValue = date.getUTCDate();
            dateValue = (dateValue <= 9) ? "0" + dateValue : dateValue;
            var hours = date.getUTCHours();
            hours = (hours <= 9) ? "0" + hours : hours;
            var minutes = date.getUTCMinutes();
            minutes = (minutes <= 9) ? "0" + minutes : minutes;
            var seconds = date.getUTCSeconds();
            seconds = (seconds <= 9) ? "0" + seconds : seconds;

            return date.getUTCFullYear() + "-" + month + "-" + dateValue + "T" + hours + ":" + minutes + "." + seconds + "Z";
        }
        else {
            throw new Error(NS + ".js error: convertToEdmDateTimeOffSetString requires date object");
        }

    }
    //Used with JSON.parse to covert JSON date strings to JavaScript Date objects
    function dateReviver(key, value) {
        var a;
        if (typeof value === 'string') {
            a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d *)?)Z$/.exec(value);
            if (a) {
                return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
            }
        }
        return value;
    };
    //Gets the client URL from internal variable if defined or from page context if not
    function getClientUrl() {
        if (isString(_clientUrl))
            return _clientUrl;
        //Get the organization URL
        if (typeof GetGlobalContext == "function" &&
            typeof GetGlobalContext().getClientUrl == "function") {
            _clientUrl = GetGlobalContext().getClientUrl();
            return _clientUrl;
        }
        else {
            //If GetGlobalContext is not defined check for Xrm.Page.context;
            if (typeof Xrm != "undefined" &&
                typeof Xrm.Page != "undefined" &&
                typeof Xrm.Page.context != "undefined" &&
                typeof Xrm.Page.context.getClientUrl == "function") {
                try {
                    _clientUrl = Xrm.Page.context.getClientUrl();
                    return _clientUrl;
                }
                catch (e) {
                    throw new Error("Xrm.Page.context.getClientUrl is not available.");
                }
            }
            else { throw new Error("Context is not available."); }
        }
    }
    //Parses a URI to get the unique identifier for a specific type of entity
    function getIdFromUri(type, uri) {
        var searchString = type().entitySetName + "(";
        var startPosition = uri.indexOf(searchString);
        if (startPosition >= 0) {
            try {
                var value = uri.substr(startPosition + searchString.length, 36);
                if (isGuid(value)) {
                    return value;
                }
            }
            catch (e) {
                throw new Error("Invalid URI");
            }
        }
        throw new Error("Invalid URI");
    }
    //Gets the base web API path
    function getWebAPIPath() {
        return getClientUrl() + "/api/data/v" + _webAPIVersion + "/";
    }
    //Used by Actions defined in the generated library
    function invokeAction(actionName, parameterObj, uri, callerId, returnType) {
        return new Promise(function (resolve, reject) {
            if (!isString(actionName)) {
                throw new Error(NS + ".invokeAction actionName parameter must be a string.");
            }
            if (isUndefined(parameterObj)) {
                throw new Error(NS + ".invokeAction parameterObj parameter must not be undefined.");
            }
            if (!isOptionalString(uri)) {
                throw new Error(NS + ".invokeAction uri parameter must be a string, null, or undefined.");
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".invokeAction callerId parameter must be a string representation of a GUID value, null, or undefined.");
            }
            if (!isOptionalFunction(returnType)) {
                throw new Error(NS + ".invokeAction returnType parameter must be a function, null, or undefined.");
            }



            var req = new XMLHttpRequest();

            if (uri) {
                req.open("POST", encodeURI(uri + "/Microsoft.Dynamics.CRM." + actionName), true);
            }
            else {
                req.open("POST", encodeURI(getWebAPIPath() + actionName), true);
            }

            setStandardHeaders(req, callerId);



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 200 || this.status == 201 || this.status == 204) {
                        switch (this.status) {
                            case 200:
                                //When the Action returns a specific type of value
                                if (returnType) {
                                    resolve(new returnType(JSON.parse(req.response, dateReviver)))
                                }
                                else {
                                    resolve(JSON.parse(req.response, dateReviver));
                                }
                                break;
                            case 201:
                            case 204:
                                //When the Action does not return a value
                                resolve();
                                break;
                            default:
                                //Should not happen
                                break;
                        }

                    }
                    else {
                        reject(Sdk.Sample.errorHandler(this.response));
                    }
                }
            };
            if (parameterObj) {
                req.send(JSON.stringify(parameterObj));
            }
            else {
                req.send();
            }



        });
    }

    //Used by Functions defined in the generated library
    function invokeFunction(functionName, parameters, uri, query, includeFormattedValues, callerId, returnType) {
        return new Promise(function (resolve, reject) {
            var UriPath;
            if (uri)
                UriPath = uri + "/Microsoft.Dynamics.CRM." + functionName;
            else {
                UriPath = getWebAPIPath() + functionName;
            }
            var parameterNames = [];
            var parameterAliasValues = [];
            var parameterNumber = 1;
            if (parameters) {
                parameters.forEach(function (param) {
                    var name = Object.keys(param)[0];
                    var value = param[name];
                    var isEnum = param["isEnum"];
                    if (isString(value) && !isEnum) {
                        value = "'" + value + "'";
                    }
                    parameterNames.push(name + "=" + "@p" + parameterNumber.toString());
                    if (param["isComplexType"]) {
                        parameterAliasValues.push("@p" + parameterNumber.toString() + "=" + JSON.stringify(value))
                    }
                    else {
                        if (param["isEntity"]) {
                            parameterAliasValues.push("@p" + parameterNumber.toString() + "=" + JSON.stringify(value.getRef()))
                        }
                        else {
                            if (param["isDate"]) {
                                parameterAliasValues.push("@p" + parameterNumber.toString() + "=" + convertToEdmDateTimeOffSetString(value))

                            }
                            else {
                                parameterAliasValues.push("@p" + parameterNumber.toString() + "=" + value)
                            }

                        }
                    }
                    parameterNumber++;
                });
                UriPath = UriPath + "(" + parameterNames.join(",") + ")?" + parameterAliasValues.join("&");
            }
            else {
                UriPath = UriPath + "()";
            }
            if (query) {
                UriPath = UriPath + "?" + query
            }



            var req = new XMLHttpRequest();
            req.open("GET", encodeURI(UriPath), true);
            setStandardHeaders(req, callerId);

            if (includeFormattedValues) {
                req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
            }



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 200) {
                        if (returnType) {
                            resolve(new returnType(JSON.parse(req.response, dateReviver)))
                        }
                        else {
                            var returnObj = JSON.parse(req.response, dateReviver);
                            if (returnObj.value && Array.isArray(returnObj.value)) {
                                resolve(returnObj.value);
                            }
                            else {
                                resolve(returnObj);
                            }
                        }

                    }
                    else {
                        reject(TS.TEST.errorHandler(req.response));
                    }
                }
            };
            req.send();



        });
    }

    //Whether an array only contains items of a specific type
    function isArrayOf(type, value) {
        if (Array.isArray(value)) {
            value.forEach(function (item) {
                if (!(item instanceof type)) {
                    return false;
                }
            })
            return true;
        }
        return false;
    }
    function isArrayOfOrNull(type, value) {
        return (isNull(value) || isArrayOf(type, value));
    }
    function isOptionalArrayOfOrNull(type, value) {
        return (isNullOrUndefined(value) || isArrayOf(type, value));
    }
    //Whether a member of an Enum
    function isEnumMember(enumType, value) {
        for (var i in enumType) {
            if (value === enumType[i]) {
                return true;
            }
        }
        return false;
    }
    function isEnumMemberOrNull(enumType, value) {
        return (isNull(value) || isEnumMember(enumType, value));
    }
    function isOptionalEnumMemberOrNull(enumType, value) {
        return (isNullOrUndefined(value) || isEnumMember(enumType, value));
    }
    function isArrayOfEnumMember(enumType, value) {
        if (Array.isArray(value)) {
            value.forEach(function (item) {
                if (!(isEnumMember(enumType, item))) {
                    return false;
                }
            })
            return true;
        }
        return false;
    }
    function isArrayOfEnumMemberOrNull(enumType, value) {
        return (isNull(value) || isArrayOfEnumMember(enumType, value));
    }
    function isOptionalArrayOfEnumMemberOrNull(enumType, value) {
        return (isNullOrUndefined(value) || isArrayOfEnumMember(enumType, value));
    }
    //Whether an instance of a type
    function isInstanceOf(type, value) {
        if (typeof type === "function") {
            return value instanceof type;
        }
        return false;
    }
    function isInstanceOfOrNull(type, value) {
        return (isNull(value) || isInstanceOf(type, value));
    }
    function isOptionalInstanceOfOrNull(type, value) {
        return (isNullOrUndefined(value) || isInstanceOf(type, value));
    }
    //Whether an object is an array, null, or undefined
    function isOptionalArray(obj) {
        return (isNullOrUndefined(obj) || Array.isArray(obj))
    }
    //Whether an object is an instance of a class that inherits from Sdk.Sample.crmbaseentity
    function isCrmBaseEntity(obj) {
        return (obj instanceof Sdk.Sample.crmbaseentity)
    }
    //Boolean validation
    function isBoolean(obj) {
        return (typeof obj === "boolean");
    }
    function isBooleanArray(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(function (item) {
                if (!isBoolean(item)) {
                    return false;
                }
            })
            return true;
        }
        return false;
    }
    function isBooleanArrayOrNull(obj) {
        return (isNull(obj) || isBooleanArray(obj));
    }
    function isOptionalBooleanArrayOrNull(obj) {
        return (isNullOrUndefined(obj) || isBooleanArray(obj));
    }
    function isOptionalBoolean(obj) {
        return (isUndefined(obj) || isNull(obj) || isBoolean(obj));
    }
    //Date validation
    function isDate(value) {
        return value instanceof Date;
    }
    function isDateOrNull(value) {
        return (isNull(value) || isDate(value));
    }
    function isOptionalDate(value) {
        return (isNullOrUndefined(value) || isDate(value));
    }
    function isDateArray(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(function (item) {
                if (!isDate(item)) {
                    return false;
                }
            })
            return true;
        }
        return false;
    }
    function isDateArrayOrNull(obj) {
        return (isNull(obj) || isDateArray(obj));
    }
    function isOptionalDateArrayOrNull(obj) {
        return (isNullOrUndefined(obj) || isDateArray(obj));
    }
    //Function validation
    function isFunction(obj) {
        return (typeof obj === "function");
    }
    function isFunctionOrNull(obj) {
        return (isNull(obj) || isFunction(obj));
    }
    function isOptionalFunction(obj) {
        return (isUndefined(obj) || isFunctionOrNull(obj));
    }
    //'Guid' validation
    function isGuid(obj) {
        if (isString(obj)) {
            if (/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(obj)) {
                return true;
            }
        }
        return false;
    }
    function isGuidOrNull(obj) {
        return (isNull(obj) || isGuid(obj));
    }
    function isGuidArray(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(function (item) {
                if (!isGuid(item)) {
                    return false;
                }
            })
            return true;
        }
        return false;
    }
    function isGuidArrayOrNull(obj) {
        return (isNull(obj) || isGuidArray(obj));
    }
    function isOptionalGuidArrayOrNull(obj) {
        return (isNullOrUndefined(obj) || isGuidArray(obj));
    }
    function isOptionalGuid(obj) {
        return (isNullOrUndefined(obj) || isGuid(obj));
    }
    //Number validation
    function isNumber(obj) {
        return (typeof (obj) === "number");
    }
    function isNumberOrNull(obj) {
        return (isNull(obj) || isNumber(obj))
    }
    function isNumberArray(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(function (item) {
                if (!isNumber(item)) {
                    return false;
                }
            })
            return true;
        }
        return false;
    }
    function isNumberArrayOrNull(obj) {
        return (isNull(obj) || isNumberArray(obj));
    }
    function isOptionalNumberArrayOrNull(obj) {
        return (isNullOrUndefined(obj) || isNumberArray(obj));
    }
    function isOptionalNumber(obj) {
        return (isUndefined(obj) || isNumberOrNull(obj))
    }
    function isOptionalNumberArray(obj) {
        return (isUndefined(obj) || isNumberArrayOrNull(obj))
    }
    //String validation
    function isString(obj) {
        return (typeof obj === "string");
    }
    function isStringOrNull(obj) {
        return (isNull(obj) || isString(obj));
    }
    function isStringArray(obj) {
        if (Array.isArray(obj)) {
            obj.forEach(function (item) {
                if (!isString(item)) {
                    return false;
                }
            })
            return true;
        }

        return false;
    }
    function isStringArrayOrNull(obj) {
        return (isNull(obj) || (isStringArray(obj)));
    }
    function isOptionalStringArrayOrNull(obj) {
        return (isNullOrUndefined(obj) || (isStringArray(obj)));
    }
    function isOptionalString(obj) {
        return (isUndefined(obj) || isStringOrNull(obj));
    }
    function isOptionalStringArray(obj) {
        return (isUndefined(obj) || isStringArrayOrNull(obj));
    }
    function isBooleanManagedProperty(obj) {
        return isInstanceOf(Sdk.Sample.BooleanManagedProperty, obj);
    }

    function isTypedUri(type, uri) {
        if (type && uri) {
            var entitySetName;
            try {
                entitySetName = new type().entitySetName;
            } catch (e) {
                throw new Error("isTypedUri type parameter must be a " + NS + " entity type.")
            }
            if (!isString(uri)) {
                throw new Error("isTypedUri uri parameter must be a string.")
            }
            else {
                var testString = "/" + entitySetName + "(";
                if (uri.indexOf(testString) > 0) {
                    return true;
                }
                return false;
            }
        }
        else {
            throw new Error("isTypedUri requires both type and uri parameter values.")
        }
        return false
    }

    //Called for entity property types that are not implemented
    function isNotImplemented(value) {
        throw new Error("Validation for this type is not implemented.");
    }
    //Whether an object is null
    function isNull(obj) {
        return (obj === null);
    }
    //Whether and object is null or undefined
    function isNullOrUndefined(obj) {
        return (isNull(obj) || isUndefined(obj));
    }
    //Whether an object is undefined
    function isUndefined(obj) {
        return (typeof obj === "undefined");
    }

    //Applys standard OData headers to an XMLHTTPRequest object
    function setStandardHeaders(req, callerId) {
        req.setRequestHeader("Accept", "application/json");
        req.setRequestHeader("Content-Type", "application/json; charset=utf-8");
        req.setRequestHeader("OData-MaxVersion", "4.0");
        req.setRequestHeader("OData-Version", "4.0");
        if (callerId) {
            req.setRequestHeader("MSCRMCallerID", callerId);
        }

    }
    //Returns the appropriate 'class' function for entities defined in the library.
    function getTypeFromUri(uri) {
        for (var property in Sdk.Sample) {
            if (Sdk.Sample.hasOwnProperty(property)) {
                if (typeof Sdk.Sample[property] == "function") {
                    if (Sdk.Sample[property].isEntityClass) {
                        if (isTypedUri(Sdk.Sample[property], uri)) {
                            return Sdk.Sample[property];
                        }
                    }
                }
            }
        }
        throw new Error("Type not defined in library.");
    }

    //Public functions
    /** 
     * @function Sdk.Sample.create
     * @memberOf! Sdk.Sample
     * @description Create a new entity
     * @param {Sdk.Sample.crmbaseentity} entity An Sdk.Sample.crmbaseentity with the properties for the entity you want to create.
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns the URI to the created record if resolved or an Error if rejected
     */
    this.create = function (entity, callerId) {
        return new Promise(function (resolve, reject) {
            if (!isCrmBaseEntity(entity)) {
                throw new Error(NS + ".create entity parameter must inherit from Sdk.Sample.crmbaseentity.");
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".create callerId parameter must be a string representation of a GUID value, null or undefined.");
            }



            var req = new XMLHttpRequest();
            req.open("POST", encodeURI(getWebAPIPath() + entity.entitySetName), true);
            setStandardHeaders(req, callerId);



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 204) {
                        resolve(this.getResponseHeader("OData-EntityId"));
                    }
                    else {
                        reject(Sdk.Sample.errorHandler(this.response));
                    }
                }
            };
            req.send(JSON.stringify(entity));



        });

    };

    /** 
     * @function Sdk.Sample.createAndRetrieve
     * @memberOf! Sdk.Sample
     * @description Create a new entity and retrieve it
     * @param {Sdk.Sample.crmbaseentity} entity An Sdk.Sample.crmbaseentity with the properties for the entity you want to create.
     * @param {Array} [properties] The properties of the entity to return using $select
     * @param {Array} [navProperties] An array of expressions for the navigation properties you want return using $expand
     * @param {Boolean} [includeFormattedValues] Whether you want to return formatted values
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns the URI to the created record if resolved or an Error if rejected
     */
    this.createAndRetrieve = function (entity, properties, navProperties, includeFormattedValues, callerId) {
        return new Promise(function (resolve, reject) {
            Sdk.Sample.create(entity, callerId)
            .then(function (uri) {
                return Sdk.Sample.retrieve(uri, properties, navProperties, includeFormattedValues, callerId)
            })
            .then(function (entity) {
                resolve(entity);
            })
            .catch(function (err) { reject(err) });
        });
    }

    /** 
     * @function Sdk.Sample.createAndRetrieveTypedEntity
     * @memberOf! Sdk.Sample
     * @description Create a new entity and retrieve a typed entity
     * @param {Sdk.Sample.crmbaseentity} entity An Sdk.Sample.crmbaseentity with the properties for the entity you want to create.
     * @param {Array} [properties] The properties of the entity to return using $select
     * @param {Array} [navProperties] An array of expressions for the navigation properties you want return using $expand
     * @param {Boolean} [includeFormattedValues] Whether you want to return formatted values
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns the URI to the created record if resolved or an Error if rejected
     */
    this.createAndRetrieveTypedEntity = function (entity, properties, navProperties, includeFormattedValues, callerId) {
        return new Promise(function (resolve, reject) {
            Sdk.Sample.create(entity, callerId)
            .then(function (uri) {
                return Sdk.Sample.retrieveTypedEntity(uri, properties, navProperties, includeFormattedValues, callerId)
            })
            .then(function (entity) {
                resolve(entity);
            })
            .catch(function (err) { reject(err) });
        });
    }

    /** 
     * @function Sdk.Sample.retrieve
     * @memberOf! Sdk.Sample
     * @description Retrieve an entity
     * @param {String} uri The URI to the entity you want to retrieve
     * @param {Array} [properties] The properties of the entity to return using $select
     * @param {Array} [navProperties] An array of expressions for the navigation properties you want return using $expand
     * @param {Boolean} [includeFormattedValues] Whether you want to return formatted values
     * @param {string} [version] The version of the current record. Do not return values when the data has not changed since last retrieval
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns the JSON entity record if resolved or an Error if rejected
     */
    this.retrieve = function (uri, properties, navProperties, includeFormattedValues, version, callerId) {
        return new Promise(function (resolve, reject) {
            if (!isString(uri)) {
                throw new Error(NS + ".retrieve uri parameter must be a string.");
            }
            if (!isOptionalStringArray(properties)) {
                throw new Error(NS + ".retrieve properties parameter must be an array of strings, null, or undefined.");
            }
            if (!isOptionalStringArray(navProperties)) {
                throw new Error(NS + ".retrieve navProperties parameter must be an array of strings, null, or undefined.");
            }
            if (!isOptionalBoolean(includeFormattedValues)) {
                throw new Error(NS + ".retrieve includeFormattedValues parameter must be boolean, null, or undefined.");
            }
            if (!isOptionalString(version)) {
                throw new Error(NS + ".retrieve version parameter must be a string, null or undefined.");
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".retrieve callerId parameter must be a string representation of a GUID value, null or undefined.");
            }
            if (properties || navProperties) {
                uri += "?";
            }
            if (properties) {
                uri += "$select=" + properties.join();
            }
            if (navProperties) {
                if (properties) {
                    uri += "&$expand=" + navProperties.join();
                }
                else {
                    uri += "$expand=" + navProperties.join();
                }
            }



            var req = new XMLHttpRequest();
            if (uri.charAt(0) === "/") {
                uri = getWebAPIPath() + uri.substring(1);
            }
            req.open("GET", encodeURI(uri), true);
            setStandardHeaders(req, callerId);

            if (includeFormattedValues) {
                req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
            }
            if (version) {
                req.setRequestHeader("If-None-Match", version);
            }



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    switch (this.status) {
                        case 200:
                            resolve(JSON.parse(this.response, dateReviver));
                            break;
                        case 304: //Not modified
                            resolve(null);
                            break;
                        default:
                            reject(Sdk.Sample.errorHandler(this.response));
                            break;
                    }
                }
            };
            req.send();



        });
    }

    /** 
     * @function Sdk.Sample.retrieveTypedEntity
     * @memberOf! Sdk.Sample
     * @description Retrieve a typed entity
     * @param {String} uri The URI to the entity you want to retrieve
     * @param {Array} [properties] The properties of the entity to return using $select
     * @param {Array} [navProperties] An array of expressions for the navigation properties you want return using $expand
     * @param {Boolean} [includeFormattedValues] Whether you want to return formatted values
     * @param {string} [version] The version of the current record. Do not return values when the data has not changed since last retrieval
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns the JSON entity record if resolved or an Error if rejected
     */
    this.retrieveTypedEntity = function (uri, properties, navProperties, includeFormattedValues, version, callerId) {
        return new Promise(function (resolve, reject) {
            var type;
            if (isString(uri)) {
                if (uri.charAt(0) === "/") {
                    uri = getWebAPIPath() + uri.substring(1);
                }
            }
            else {
                reject(new Error(NS + ".retrieveTypedEntity uri parameter must be a string."));
            }
            try {
                type = getTypeFromUri(uri);
            } catch (e) {
                reject(e);
            }

            Sdk.Sample.retrieve(uri, properties, navProperties, includeFormattedValues, version, callerId)
            .then(function (entity) {
                if (entity) {
                    var typedEntity = new type(entity);
                    typedEntity.resetChangeTracking();
                    resolve(typedEntity);
                }
                else {
                    resolve(null);
                }
            })
            .catch(function (error) { reject(error) })
        });
    }

    /** 
     * @function Sdk.Sample.retrieveProperty
     * @memberOf! Sdk.Sample
     * @description Retrieve the value of a single entity property
     * @param {String} uri The URI to the entity with the property you want to retrieve
     * @param {String} propertyName The name of the property.
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns the value of the entity property if resolved or an Error if rejected
     */
    this.retrieveProperty = function (uri, propertyName, callerId) {
        /// <summary>Retrieve the value of an entity property</summary>
        /// <param name="uri" type="String">The Uri for the entity with the property you want to retrieve</param>
        /// <param name="propertyName" type="String">A string representing the entity property you want to retrieve.</param>
        /// <param name="callerId" type="String" optional="true">The systemuserid value of the user to impersonate</param>
        return new Promise(function (resolve, reject) {
            if (!isString(uri)) {
                throw new Error(NS + ".retrieveProperty uri parameter must be a string.");
            }
            if (!isString(propertyName)) {
                throw new Error(NS + ".retrieveProperty propertyName parameter must be a string.");
            }

            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".retrieveProperty callerId parameter must be a string representation of a GUID value, null or undefined.");
            }



            var req = new XMLHttpRequest();
            if (uri.charAt(0) === "/") {
                uri = getWebAPIPath() + uri.substring(1);
            }
            req.open("GET", encodeURI(uri + "/" + propertyName), true);
            setStandardHeaders(req, callerId);



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    switch (this.status) {
                        case 200:
                            var obj = JSON.parse(this.response, dateReviver);
                            if (obj) {
                                if (obj.value) {
                                    resolve(obj.value);
                                }
                                else {
                                    resolve(obj);
                                }
                            }
                            else {
                                resolve(null);
                            }
                            break;
                        case 204:
                            resolve(null);
                            break;
                        default:
                            reject(Sdk.Sample.errorHandler(this.response));
                            break;
                    }
                }
            };
            req.send();



        });
    }

    /** 
     * @function Sdk.Sample.update
     * @memberOf! Sdk.Sample
     * @description Update an existing entity
     * @param {Sdk.Sample.crmbaseentity} entity A Sdk.Sample.crmbaseentity that contains only the properties of the entity you want to update
     * @param {Boolean} [cancelWhenOlder] Whether to cancel update when the server version is newer. Default is false;
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns nothing if resolved or an Error if rejected
     */
    this.update = function (entity, cancelWhenOlder, callerId) {
        return new Promise(function (resolve, reject) {
            if (!entity instanceof Sdk.Sample.crmbaseentity) {
                throw new Error(NS + ".update entity parameter must inherit from Sdk.Sample.crmbaseentity.");
            }
            if (!isOptionalBoolean(cancelWhenOlder)) {
                throw new Error(NS + ".update cancelWhenOlder parameter must be a boolean value, null or undefined.");
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".update callerId parameter must be a string representation of a GUID value, null or undefined.");
            }

            //Don't send the request if there is nothing to save;
            if (entity.changedProperties.length == 0) {
                console.log("Update request not sent because no changes applied.")
                resolve();
            }
            else {



                var req = new XMLHttpRequest();
                req.open("PATCH", encodeURI(entity.getUri()), true);
                setStandardHeaders(req, callerId);
                if (cancelWhenOlder) {
                    req.setRequestHeader("If-Match", entity.getVersion()); //Will not update record if server version is newer
                }
                else {
                    req.setRequestHeader("If-Match", "*"); //Will not create new record if record was deleted 
                }
                req.entity = entity; //Attaching the entity to the request so it will be in scope for the onreadystatechange event handler



                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        this.onreadystatechange = null;
                        if (this.status == 204) {
                            //Clear the changed properties collection in case the same object is updated again.
                            this.entity.changedProperties.length = 0;
                            resolve();
                        }
                        else {
                            reject(Sdk.Sample.errorHandler(this.response));
                        }
                    }
                };
                req.send(JSON.stringify(entity));


            }
        });
    }

    /** 
     * @function Sdk.Sample.upsert
     * @memberOf! Sdk.Sample
     * @description Create an entity if it doesn't exist, otherwise update existing entity
     * @param {Sdk.Sample.crmbaseentity} entity A Sdk.Sample.crmbaseentity that contains the properties of the entity you want to upsert
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @param {Boolean} [preventUpdate] Whether to allow the upsert operation to update existing records. Default is false
     * @returns {Promise} A promise that returns nothing if resolved or an Error if rejected
     */
    this.upsert = function (entity, preventUpdate, callerId) {
        return new Promise(function (resolve, reject) {
            if (!entity instanceof Sdk.Sample.crmbaseentity) {
                throw new Error(NS + ".upsert entity parameter must inherit from Sdk.Sample.crmbaseentity.");
            }
            if (!isOptionalBoolean(preventUpdate)) {
                throw new Error(NS + ".upsert preventUpdate parameter must be a boolean value, null or undefined.");
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".upsert callerId parameter must be a string representation of a GUID value, null or undefined.");
            }



            var req = new XMLHttpRequest();
            req.open("PATCH", encodeURI(entity.getUri()), true);
            setStandardHeaders(req, callerId);
            if (preventUpdate) {
                req.setRequestHeader("If-None-Match", "*");
            }



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 204) {
                        resolve();
                    }
                    else {
                        reject(Sdk.Sample.errorHandler(this.response));
                    }
                }
            };
            req.send(JSON.stringify(entity));



        });
    }



    /** 
     * @function Sdk.Sample.delete
     * @memberOf! Sdk.Sample
     * @description Delete an entity
     * @param {String} uri The URI for the entity to delete
     * @param {string} [version] The version of the entity to delete. Delete cancelled if server version is different.
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns nothing when resolved or an Error if rejected
     */
    this.delete = function (uri, version, callerId) {
        return new Promise(function (resolve, reject) {
            if (!isString(uri)) {
                throw new Error(NS + ".delete uri parameter must be a string.");
            }
            if (!isOptionalString(version)) {
                throw new Error(NS + ".delete version parameter must be a string, null or undefined.");
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".delete callerId parameter must be a string representation of a GUID value, null or undefined.");
            }



            var req = new XMLHttpRequest();
            if (uri.charAt(0) === "/") {
                uri = getWebAPIPath() + uri.substring(1);
            }
            req.open("DELETE", encodeURI(uri), true);
            setStandardHeaders(req, callerId);
            if (version) {
                req.setRequestHeader("If-Match", version);
            }



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 204) {
                        resolve();
                    }
                    else {
                        reject(Sdk.Sample.errorHandler(this.response));
                    }
                }
            };
            req.send();



        });
    }

    //Note: deleteEntity provided b/c TypeScript Type defininitions won't support use of 'delete' keyword as a method name.

    /** 
     * @function Sdk.Sample.deleteEntity
     * @memberOf! Sdk.Sample
     * @description Delete an entity
     * @param {String} uri The URI for the entity to delete
     * @param {string} [version] The version of the entity to delete. Delete cancelled if server version is different.
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns nothing when resolved or an Error if rejected
     */
    this.deleteEntity = this.delete;


    /** 
     * @function Sdk.Sample.addToCollection
     * @memberOf! Sdk.Sample
     * @description Adds an entity to an entity collection
     * @param {String} uri1 A URI for an entity that has the collection-valued navigation property named by the collectionName parameter.
     * @param {String} collectionName The name of the collection-valued navigation property to use
     * @param {String} uri2 A URI for an entity to add to the collection
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns nothing if resolved or an Error if rejected
     */
    this.addToCollection = function (uri1, collectionName, uri2, callerId) {
        return new Promise(function (resolve, reject) {
            if (!isString(uri1)) {
                throw new Error(NS + ".addToCollection uri1 parameter must be a string.");
            }
            else {
                if (uri1.charAt(0) === "/") {
                    uri1 = getWebAPIPath() + uri1.substring(1);
                }
            }
            if (!isString(collectionName)) {
                throw new Error(NS + ".addToCollection collectionName parameter must be a string.");
            }
            if (!isString(uri2)) {
                throw new Error(NS + ".addToCollection uri2 parameter must be a string.");
            }
            else {
                if (uri2.charAt(0) === "/") {
                    uri2 = getWebAPIPath() + uri2.substring(1);
                }
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".addToCollection callerId parameter must be a string representation of a GUID value, null or undefined.");
            }



            var req = new XMLHttpRequest();
            req.open("POST", encodeURI(uri1 + "/" + collectionName + "/$ref"), true);
            setStandardHeaders(req, callerId);



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 204) {
                        resolve();
                    }
                    else {
                        reject(Sdk.Sample.errorHandler(this.response));
                    }
                }
            };
            req.send(JSON.stringify({ "@odata.id": uri2 }));



        });
    }
    /** 
      * @function Sdk.Sample.disassociate
      * @memberOf! Sdk.Sample
      * @description Disassociate entities with a specific relationship
      * @param {String} uri1 A URI for an entity that has a navigation property with a name that matches the relationshipName parameter
      * @param {String} relationshipName The name of the navigation property that identifies the relationship to use
      * @param {String} [uri2] A URI for an entity to disassociate with the entity represented by the uri1 parameter. 
      * uri2 parameter is optional when the relationshipName represents a single-valued navigation property.
      * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
      * @returns {Promise} A promise that returns nothing if resolved or an Error if rejected
      */
    this.disassociate = function (uri1, relationshipName, uri2, callerId) {
        return new Promise(function (resolve, reject) {
            if (!isString(uri1)) {
                throw new Error(NS + ".disassociate uri1 parameter must be a string.");
            }
            else {
                if (uri1.charAt(0) === "/") {
                    uri1 = getWebAPIPath() + uri1.substring(1);
                }
            }
            if (!isString(relationshipName)) {
                throw new Error(NS + ".disassociate relationshipName parameter must be a string.");
            }
            if (!isOptionalString(uri2)) {
                throw new Error(NS + ".disassociate uri2 parameter must be a string value, null, or undefined.");
            }
            else {
                if (isString(uri2) && uri2.charAt(0) === "/") {
                    uri2 = getWebAPIPath() + uri2.substring(1);
                }
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".disassociate callerId parameter must be a string representation of a GUID value, null or undefined.");
            }
            var uri = uri1 + "/" + relationshipName;
            if (uri2) {
                uri = uri + "/$ref?$id=" + uri2;
            }
            else {
                uri = uri + "/$ref";
            }



            var req = new XMLHttpRequest();
            req.open("DELETE", encodeURI(uri), true);
            setStandardHeaders(req, callerId);



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 204) {
                        resolve();
                    }
                    else {
                        reject(Sdk.Sample.errorHandler(this.response));
                    }
                }
            };
            req.send();



        });
    }

    /** 
    * @function Sdk.Sample.query
    * @memberOf! Sdk.Sample
    * @description Retrieve multiple entities matching the criteria you define
    * @param {String} entitySetName The entity Set name for the type of entity you want to retrieve.
    * @param {String} [query] The system query parameters you want to apply.
    * @param {Boolean} [includeFormattedValues] Whether you want to have formatted values included in the results
    * @param {Number} [maxPageSize] A number that limits the number of entities to be retrieved in the query and allows for paging
    * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
    * @returns {Promise} A promise that returns the entities when resolved or an Error if rejected
    */
    this.query = function (entitySetName, query, includeFormattedValues, maxPageSize, callerId) {
        return new Promise(function (resolve, reject) {
            if (!isString(entitySetName)) {
                throw new Error(NS + ".query entitySetName parameter must be a string.");
            }
            if (!isOptionalString(query)) {
                throw new Error(NS + ".query query parameter must be a string or null.");
            }
            if (!isOptionalBoolean(includeFormattedValues)) {
                throw new Error(NS + ".query includeFormattedValues parameter must be a boolean or null.");
            }
            if (!isOptionalNumber(maxPageSize)) {
                throw new Error(NS + ".query maxPageSize parameter must be a number or null.");
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".query callerId parameter must be a string representation of a GUID value, null or undefined.");
            }
            var url = getWebAPIPath() + entitySetName;
            if (!isNullOrUndefined(query)) {
                url = url + "?" + query;
            }



            var req = new XMLHttpRequest();
            req.open("GET", encodeURI(url), true);
            setStandardHeaders(req, callerId);

            if (includeFormattedValues && maxPageSize) {
                req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\",odata.maxpagesize=" + maxPageSize);
            }
            else {
                if (includeFormattedValues) {
                    req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
                }

                if (maxPageSize) {
                    req.setRequestHeader("Prefer", "odata.maxpagesize=" + maxPageSize);
                }
            }



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 200) {
                        var results = JSON.parse(this.response, dateReviver);
                        try {
                            resolve(new Sdk.Sample.entityCollection(results));
                        }
                        catch (e) {
                            //a $count option can return only a number
                            resolve(results);
                        }
                    }
                    else {
                        reject(Sdk.Sample.errorHandler(this.response));
                    }
                }
            };
            req.send();



        });

    }

    /** 
    * @function Sdk.Sample.getNextPage
    * @memberOf! Sdk.Sample
    * @description Return the next page from the results of an Sdk.Sample.query when there are more pages
    * @param {String} nextLink The value of the @odata.nextLink property for the results of a query query when there are more pages.
    * @param {Boolean} [includeFormattedValues] Whether you want to have formatted values included in the results
    * @param {Number} [maxPageSize] A number that limits the number of entities to be retrieved in the query and allows for paging
    * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
    * @returns {Promise} A promise that returns the entities when resolved or an Error if rejected
    */
    this.getNextPage = function (nextLink, includeFormattedValues, maxPageSize, callerId) {
        return new Promise(function (resolve, reject) {
            if (!isString(nextLink)) {
                throw new Error(NS + ".getNextPage nextLink parameter must be a string.");
            }
            if (!isOptionalBoolean(includeFormattedValues)) {
                throw new Error(NS + ".getNextPage includeFormattedValues parameter must be a boolean or null.");
            }
            if (!isOptionalNumber(maxPageSize)) {
                throw new Error(NS + ".getNextPage maxPageSize parameter must be a number or null.");
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".getNextPage callerId parameter must be a string representation of a GUID value, null or undefined.");
            }



            var req = new XMLHttpRequest();
            //Not encoding the nextLink because it came from the system
            req.open("GET", nextLink, true);
            setStandardHeaders(req, callerId);

            if (includeFormattedValues && maxPageSize) {
                req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\",odata.maxpagesize=" + maxPageSize);
            }
            else {
                if (includeFormattedValues) {
                    req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
                }

                if (maxPageSize) {
                    req.setRequestHeader("Prefer", "odata.maxpagesize=" + maxPageSize);
                }
            }



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 200) {
                        var results = JSON.parse(this.response, dateReviver);
                        try {
                            resolve(new Sdk.Sample.entityCollection(results));
                        }
                        catch (e) {
                            //a $count option can return only a number
                            resolve(results);
                        }
                    }
                    else {
                        reject(Sdk.Sample.errorHandler(this.response));
                    }
                }
            };
            req.send();



        });
    }

    /** 
    * @function Sdk.Sample.executeFetch
    * @memberOf! Sdk.Sample
    * @description Return the results of a FetchXML query
    * @param {String} entitySetName The entity set name for the type of entity indicated in the FetchXml entity element name attribute.
    * @param {String} fetchXml The FetchXML. You do not need to URLEncode this string.
    * @param {Boolean} [includeFormattedValues] Whether you want to have formatted values included in the results
    * @param {Number} [maxPageSize] A number that limits the number of entities to be retrieved in the query and allows for paging
    * @param {Number} [pageNumber] A number that indicates which page to return when maxPageSize is applied.
    * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
    * @returns {Promise} A promise that returns the results when resolved or an Error if rejected
    */
    this.executeFetch = function (entitySetName, fetchXml, includeFormattedValues, maxPageSize, pageNumber, callerId) {
        return new Promise(function (resolve, reject) {
            if (!isString(entitySetName)) {
                throw new Error(NS + ".executeFetch entitySetName parameter must be a string.");
            }
            if (!isString(fetchXml)) {
                throw new Error(NS + ".executeFetch fetchXml parameter must be a string.");
            }
            if (!isOptionalBoolean(includeFormattedValues)) {
                throw new Error(NS + ".executeFetch includeFormattedValues parameter must be a boolean or null.");
            }
            if (!isOptionalNumber(maxPageSize)) {
                throw new Error(NS + ".executeFetch maxPageSize parameter must be a number or null.");
            }
            if (!isOptionalNumber(pageNumber)) {
                throw new Error(NS + ".executeFetch maxPageSize parameter must be a number or null.");
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".executeFetch callerId parameter must be a string representation of a GUID value, null or undefined.");
            }
            if (maxPageSize) {
                var xml;
                try {
                    xml = (new DOMParser).parseFromString(fetchXml, "application/xml");
                } catch (e) {
                    throw e;
                }
                if (pageNumber) {
                    xml.documentElement.setAttribute("page", pageNumber.toString());
                }
                else {
                    xml.documentElement.setAttribute("page", "1");
                }
                xml.documentElement.setAttribute("count", maxPageSize.toString());
                fetchXml = (new XMLSerializer).serializeToString(xml);
            }



            var req = new XMLHttpRequest();
            req.open("GET", encodeURI(getWebAPIPath() + entitySetName + "?fetchXml=" + encodeURIComponent(fetchXml)), true);
            setStandardHeaders(req, callerId);
            if (includeFormattedValues) {
                req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
            }



            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 200) {
                        var results = JSON.parse(this.response, dateReviver);
                        try {
                            resolve(new Sdk.Sample.entityCollection(results));
                        }
                        catch (e) {
                            //a $count option can return only a number
                            resolve(results);
                        }
                    }
                    else {
                        reject(Sdk.Sample.errorHandler(this.response));
                    }
                }
            };
            req.send();



        });
    }

    /** 
    * @function Sdk.Sample.formatted
    * @memberOf! Sdk.Sample
    * @description Returns the formatted value of a property
    * @param {Object} JSONentity The retrieved JSON entity that is not an instance of Sdk.Sample.crmbaseentity
    * @param {String} propertyName The name of the property
    * @param {String} [whenNullText] Text to return if the formatted value is null or undefined
    * @returns {String} The formatted value
    */
    this.formatted = function (JSONentity, propertyName, whenNullText) {
        if (!isString(propertyName)) {
            throw new Error(NS + ".formatted propertyName parameter must be a string.");
        }
        if (!isOptionalString(whenNullText)) {
            throw new Error(NS + ".formatted whenNullText parameter must be a string, null, or undefined.");
        }
        if (!(JSONentity[propertyName] || JSONentity[propertyName] == null)) {
            throw new Error(NS + ".formatted entity parameter does not have a " + propertyName + " property.");
        }
        var formattedValue = JSONentity[propertyName + "@OData.Community.Display.V1.FormattedValue"];
        return (formattedValue) ? formattedValue : ((whenNullText) ? whenNullText : "");
    }
    /** 
   * @function Sdk.Sample.getWebAPIPath
   * @memberOf! Sdk.Sample
   * @description Returns the base URI for the WebAPI{
   * @returns {String} the base URI for the WebAPI
   */
    this.getWebAPIPath = function () {
        return getWebAPIPath();
    }

    /** 
    * @function Sdk.Sample.setClientUrl
    * @memberOf! Sdk.Sample
    * @description Sets the base client URI rather than deriving it from web resource context
    * @param {String} uri The base client URI referring to the Organization (Not the Web API!)
    */
    this.setClientUrl = function (uri) {
        if (!isString(uri)) {
            throw new Error(NS + ".setClientUrl uri parameter must be a string.")
        }
        _clientUrl = uri;
    }
    /** 
    * @function Sdk.Sample.errorHandler
    * @private
    * @description For Internal Use Only. Called when an error callback parses the JSON response within the XMLHttpRequest onreadystatechange event handler
    * @param {XMLHttpRequest.response} resp The error response
    * @returns {String} The JSON data with details of the error.
    */
    this.errorHandler = function (resp) {
        try {
            return JSON.parse(resp).error;
        } catch (e) {
            return new Error("Unexpected Error")
        }
    }


    //#endregion
}).call(Sdk.Sample);
