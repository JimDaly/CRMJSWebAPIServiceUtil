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
var ROOTNAMESPACE = window.ROOTNAMESPACE || {};
ROOTNAMESPACE.SUBNAMESPACE = ROOTNAMESPACE.SUBNAMESPACE || {};
(function () {
    var _clientUrl;
    var _webAPIVersion = "WEBAPIVERSION";

    ADALFUNCTIONS

    var NS = "ROOTNAMESPACE.SUBNAMESPACE";

    /**
    @abstract {Object} ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity
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
            return ROOTNAMESPACE.SUBNAMESPACE.getWebAPIPath() + entitySetName + "(" + this[primaryKeyName] + ")";
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
        this[this.primaryKey] = getIdFromUri(ROOTNAMESPACE.SUBNAMESPACE[this.type], uri);
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
    @typeref {Object} ROOTNAMESPACE.SUBNAMESPACE.entityCollection
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
        //if /$count is appended to the query only a number will be returned.
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

    MODELDEFINITIONS

    //#region Core functions  
    //Property Setters

    function setBooleanManagedProperty(entity, propertyName, value) {
        propertySetter(isBooleanManagedProperty, NS+".BooleanManagedProperty value or null", entity, propertyName, value);
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
                    internal[primarykey] = getIdFromUri(ROOTNAMESPACE.SUBNAMESPACE[type], entityReference);
                } catch (e) {
                    throw e;
                }

            }
            else {
                if (entityReference["@odata.id"]) {
                    try {
                        internal[primarykey] = getIdFromUri(ROOTNAMESPACE.SUBNAMESPACE[type], entityReference["@odata.id"]);
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

            ADALSUPPORTPART1

            var req = new XMLHttpRequest();

            if (uri) {
                req.open("POST", encodeURI(uri + "/Microsoft.Dynamics.CRM." + actionName), true);
            }
            else {
                req.open("POST", encodeURI(getWebAPIPath() + actionName), true);
            }

            setStandardHeaders(req, callerId);

            ADALSUPPORTPART2

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
                        reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                    }
                }
            };
            if (parameterObj) {
                req.send(JSON.stringify(parameterObj));
            }
            else {
                req.send();
            }

            ADALSUPPORTPART3

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
    //Whether an object is an instance of a class that inherits from ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity
    function isCrmBaseEntity(obj) {
        return (obj instanceof ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity)
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
        return isInstanceOf(ROOTNAMESPACE.SUBNAMESPACE.BooleanManagedProperty, obj);
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
        for (var property in ROOTNAMESPACE.SUBNAMESPACE) {
            if (ROOTNAMESPACE.SUBNAMESPACE.hasOwnProperty(property)) {
                if (typeof ROOTNAMESPACE.SUBNAMESPACE[property] == "function") {
                    if (ROOTNAMESPACE.SUBNAMESPACE[property].isEntityClass) {
                        if (isTypedUri(ROOTNAMESPACE.SUBNAMESPACE[property], uri)) {
                            return ROOTNAMESPACE.SUBNAMESPACE[property];
                        }
                    }
                }
            }
        }
        throw new Error("Type not defined in library.");
    }

    //Public functions
    /** 
     * @function ROOTNAMESPACE.SUBNAMESPACE.create
     * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
     * @description Create a new entity
     * @param {ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity} entity An ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity with the properties for the entity you want to create.
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns the URI to the created record if resolved or an Error if rejected
     */
    this.create = function (entity, callerId) {
        return new Promise(function (resolve, reject) {
            if (!isCrmBaseEntity(entity)) {
                throw new Error(NS + ".create entity parameter must inherit from ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity.");
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".create callerId parameter must be a string representation of a GUID value, null or undefined.");
            }

            ADALSUPPORTPART1

            var req = new XMLHttpRequest();
            req.open("POST", encodeURI(getWebAPIPath() + entity.entitySetName), true);
            setStandardHeaders(req, callerId);

            ADALSUPPORTPART2

            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 204) {
                        resolve(this.getResponseHeader("OData-EntityId"));
                    }
                    else {
                        reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                    }
                }
            };
            req.send(JSON.stringify(entity));

            ADALSUPPORTPART3

        });

    };

    /** 
     * @function ROOTNAMESPACE.SUBNAMESPACE.createAndRetrieve
     * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
     * @description Create a new entity and retrieve it
     * @param {ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity} entity An ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity with the properties for the entity you want to create.
     * @param {Array} [properties] The properties of the entity to return using $select
     * @param {Array} [navProperties] An array of expressions for the navigation properties you want return using $expand
     * @param {Boolean} [includeFormattedValues] Whether you want to return formatted values
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns the URI to the created record if resolved or an Error if rejected
     */
    this.createAndRetrieve = function (entity, properties, navProperties, includeFormattedValues, callerId) {
        return new Promise(function (resolve, reject) {
            ROOTNAMESPACE.SUBNAMESPACE.create(entity, callerId)
            .then(function (uri) {
                return ROOTNAMESPACE.SUBNAMESPACE.retrieve(uri, properties, navProperties, includeFormattedValues, callerId)
            })
            .then(function (entity) {
                resolve(entity);
            })
            .catch(function (err) { reject(err) });
        });
    }

    /** 
     * @function ROOTNAMESPACE.SUBNAMESPACE.createAndRetrieveTypedEntity
     * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
     * @description Create a new entity and retrieve a typed entity
     * @param {ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity} entity An ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity with the properties for the entity you want to create.
     * @param {Array} [properties] The properties of the entity to return using $select
     * @param {Array} [navProperties] An array of expressions for the navigation properties you want return using $expand
     * @param {Boolean} [includeFormattedValues] Whether you want to return formatted values
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns the URI to the created record if resolved or an Error if rejected
     */
    this.createAndRetrieveTypedEntity = function (entity, properties, navProperties, includeFormattedValues, callerId) {
        return new Promise(function (resolve, reject) {
            ROOTNAMESPACE.SUBNAMESPACE.create(entity, callerId)
            .then(function (uri) {
                return ROOTNAMESPACE.SUBNAMESPACE.retrieveTypedEntity(uri, properties, navProperties, includeFormattedValues, callerId)
            })
            .then(function (entity) {
                resolve(entity);
            })
            .catch(function (err) { reject(err) });
        });
    }

    /** 
     * @function ROOTNAMESPACE.SUBNAMESPACE.retrieve
     * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
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

            ADALSUPPORTPART1

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

            ADALSUPPORTPART2

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
                            reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                            break;
                    }
                }
            };
            req.send();

            ADALSUPPORTPART3

        });
    }

    /** 
     * @function ROOTNAMESPACE.SUBNAMESPACE.retrieveTypedEntity
     * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
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

            ROOTNAMESPACE.SUBNAMESPACE.retrieve(uri, properties, navProperties, includeFormattedValues, version, callerId)
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
     * @function ROOTNAMESPACE.SUBNAMESPACE.retrieveProperty
     * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
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

            ADALSUPPORTPART1

            var req = new XMLHttpRequest();
            if (uri.charAt(0) === "/") {
                uri = getWebAPIPath() + uri.substring(1);
            }
            req.open("GET", encodeURI(uri + "/" + propertyName), true);
            setStandardHeaders(req, callerId);

            ADALSUPPORTPART2

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
                            reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                            break;
                    }
                }
            };
            req.send();

            ADALSUPPORTPART3

        });
    }

    /** 
     * @function ROOTNAMESPACE.SUBNAMESPACE.update
     * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
     * @description Update an existing entity
     * @param {ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity} entity A ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity that contains only the properties of the entity you want to update
     * @param {Boolean} [cancelWhenOlder] Whether to cancel update when the server version is newer. Default is false;
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns nothing if resolved or an Error if rejected
     */
    this.update = function (entity, cancelWhenOlder, callerId) {
        return new Promise(function (resolve, reject) {
            if (!entity instanceof ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity) {
                throw new Error(NS + ".update entity parameter must inherit from ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity.");
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

                ADALSUPPORTPART1

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

                ADALSUPPORTPART2

                req.onreadystatechange = function () {
                    if (this.readyState == 4 /* complete */) {
                        this.onreadystatechange = null;
                        if (this.status == 204) {
                            //Clear the changed properties collection in case the same object is updated again.
                            this.entity.changedProperties.length = 0;
                            resolve();
                        }
                        else {
                            reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                        }
                    }
                };
                req.send(JSON.stringify(entity));

                ADALSUPPORTPART3
            }
        });
    }

    /** 
     * @function ROOTNAMESPACE.SUBNAMESPACE.upsert
     * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
     * @description Create an entity if it doesn't exist, otherwise update existing entity
     * @param {ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity} entity A ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity that contains the properties of the entity you want to upsert
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @param {Boolean} [preventUpdate] Whether to allow the upsert operation to update existing records. Default is false
     * @returns {Promise} A promise that returns nothing if resolved or an Error if rejected
     */
    this.upsert = function (entity, preventUpdate, callerId) {
        return new Promise(function (resolve, reject) {
            if (!entity instanceof ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity) {
                throw new Error(NS + ".upsert entity parameter must inherit from ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity.");
            }
            if (!isOptionalBoolean(preventUpdate)) {
                throw new Error(NS + ".upsert preventUpdate parameter must be a boolean value, null or undefined.");
            }
            if (!isOptionalGuid(callerId)) {
                throw new Error(NS + ".upsert callerId parameter must be a string representation of a GUID value, null or undefined.");
            }

            ADALSUPPORTPART1

            var req = new XMLHttpRequest();
            req.open("PATCH", encodeURI(entity.getUri()), true);
            setStandardHeaders(req, callerId);
            if (preventUpdate) {
                req.setRequestHeader("If-None-Match", "*");
            }

            ADALSUPPORTPART2

            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 204) {
                        resolve();
                    }
                    else {
                        reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                    }
                }
            };
            req.send(JSON.stringify(entity));

            ADALSUPPORTPART3

        });
    }



    /** 
     * @function ROOTNAMESPACE.SUBNAMESPACE.delete
     * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
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

            ADALSUPPORTPART1

            var req = new XMLHttpRequest();
            if (uri.charAt(0) === "/") {
                uri = getWebAPIPath() + uri.substring(1);
            }
            req.open("DELETE", encodeURI(uri), true);
            setStandardHeaders(req, callerId);
            if (version) {
                req.setRequestHeader("If-Match", version);
            }

            ADALSUPPORTPART2

            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 204) {
                        resolve();
                    }
                    else {
                        reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                    }
                }
            };
            req.send();

            ADALSUPPORTPART3

        });
    }

    //Note: deleteEntity provided b/c TypeScript Type defininitions won't support use of 'delete' keyword as a method name.

    /** 
     * @function ROOTNAMESPACE.SUBNAMESPACE.deleteEntity
     * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
     * @description Delete an entity
     * @param {String} uri The URI for the entity to delete
     * @param {string} [version] The version of the entity to delete. Delete cancelled if server version is different.
     * @param {GUID} [callerId] A string representation of the GUID value for the user to impersonate.
     * @returns {Promise} A promise that returns nothing when resolved or an Error if rejected
     */
    this.deleteEntity = this.delete;


    /** 
     * @function ROOTNAMESPACE.SUBNAMESPACE.addToCollection
     * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
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

            ADALSUPPORTPART1

            var req = new XMLHttpRequest();
            req.open("POST", encodeURI(uri1 + "/" + collectionName + "/$ref"), true);
            setStandardHeaders(req, callerId);

            ADALSUPPORTPART2

            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 204) {
                        resolve();
                    }
                    else {
                        reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                    }
                }
            };
            req.send(JSON.stringify({ "@odata.id": uri2 }));

            ADALSUPPORTPART3

        });
    }
    /** 
      * @function ROOTNAMESPACE.SUBNAMESPACE.disassociate
      * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
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

            ADALSUPPORTPART1

            var req = new XMLHttpRequest();
            req.open("DELETE", encodeURI(uri), true);
            setStandardHeaders(req, callerId);

            ADALSUPPORTPART2

            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 204) {
                        resolve();
                    }
                    else {
                        reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                    }
                }
            };
            req.send();

            ADALSUPPORTPART3

        });
    }

    /** 
    * @function ROOTNAMESPACE.SUBNAMESPACE.query
    * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
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

            ADALSUPPORTPART1

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

            ADALSUPPORTPART2

            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 200) {
                        var results = JSON.parse(this.response, dateReviver);
                        try {
                            resolve(new ROOTNAMESPACE.SUBNAMESPACE.entityCollection(results));
                        }
                        catch (e) {
                            //a $count option can return only a number
                            resolve(results);
                        }
                    }
                    else {
                        reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                    }
                }
            };
            req.send();

            ADALSUPPORTPART3

        });

    }

    /** 
    * @function ROOTNAMESPACE.SUBNAMESPACE.getNextPage
    * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
    * @description Return the next page from the results of an ROOTNAMESPACE.SUBNAMESPACE.query when there are more pages
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

            ADALSUPPORTPART1

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

            ADALSUPPORTPART2

            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 200) {
                        var results = JSON.parse(this.response, dateReviver);
                        try {
                            resolve(new ROOTNAMESPACE.SUBNAMESPACE.entityCollection(results));
                        }
                        catch (e) {
                            //a $count option can return only a number
                            resolve(results);
                        }
                    }
                    else {
                        reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                    }
                }
            };
            req.send();

            ADALSUPPORTPART3

        });
    }

    /** 
    * @function ROOTNAMESPACE.SUBNAMESPACE.executeFetch
    * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
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

            ADALSUPPORTPART1

            var req = new XMLHttpRequest();
            req.open("GET", encodeURI(getWebAPIPath() + entitySetName + "?fetchXml=" + encodeURIComponent(fetchXml)), true);
            setStandardHeaders(req, callerId);
            if (includeFormattedValues) {
                req.setRequestHeader("Prefer", "odata.include-annotations=\"OData.Community.Display.V1.FormattedValue\"");
            }

            ADALSUPPORTPART2

            req.onreadystatechange = function () {
                if (this.readyState == 4 /* complete */) {
                    this.onreadystatechange = null;
                    if (this.status == 200) {
                        var results = JSON.parse(this.response, dateReviver);
                        try {
                            resolve(new ROOTNAMESPACE.SUBNAMESPACE.entityCollection(results));
                        }
                        catch (e) {
                            //a $count option can return only a number
                            resolve(results);
                        }
                    }
                    else {
                        reject(ROOTNAMESPACE.SUBNAMESPACE.errorHandler(this.response));
                    }
                }
            };
            req.send();

            ADALSUPPORTPART3

        });
    }

    /** 
    * @function ROOTNAMESPACE.SUBNAMESPACE.formatted
    * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
    * @description Returns the formatted value of a property
    * @param {Object} JSONentity The retrieved JSON entity that is not an instance of ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity
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
   * @function ROOTNAMESPACE.SUBNAMESPACE.getWebAPIPath
   * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
   * @description Returns the base URI for the WebAPI{
   * @returns {String} the base URI for the WebAPI
   */
    this.getWebAPIPath = function () {
        return getWebAPIPath();
    }

    /** 
    * @function ROOTNAMESPACE.SUBNAMESPACE.setClientUrl
    * @memberOf! ROOTNAMESPACE.SUBNAMESPACE
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
    * @function ROOTNAMESPACE.SUBNAMESPACE.errorHandler
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
}).call(ROOTNAMESPACE.SUBNAMESPACE);
