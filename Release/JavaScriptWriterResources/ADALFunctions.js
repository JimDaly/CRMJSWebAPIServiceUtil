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

//#region ADAL functions  
var _authContext;
var _user;

/**
* @function ROOTNAMESPACE.SUBNAMESPACE.ADALInit
* @memberOf ROOTNAMESPACE.SUBNAMESPACE
* @description Initializes ADAL for a Single Page Application
* @param {string} tenant The name of the Azure AD organization you use, i.e. '[organization name].onmicrosoft.com'
* @param {string} clientId The ClientId you got when you registered the application
* @param {string} clientUrl The URL to connect to CRM, i.e. 'https://[organization name].crm.dynamics.com'
*/
this.ADALInit = function (tenant, clientId, clientUrl) {
    _clientUrl = clientUrl;
    _authContext = new AuthenticationContext({
        tenant: tenant,
        clientId: clientId,
        postLogoutRedirectUri: window.location.href,
        endpoints: { orgUri: _clientUrl },
        cacheLocation: 'localStorage'
    });

    // Check For & Handle Redirect From AAD After Login
    var isCallback = _authContext.isCallback(window.location.hash);
    if (isCallback) {
        _authContext.handleWindowCallback();
    }
    var loginError = _authContext.getLoginError();

    if (isCallback && !loginError) {
        window.location = _authContext._getItem(_authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
    }
    else {
        try {
            throw new Error(loginError);
        } catch (e) {
            console.log(e.message);
        }
    }
    _user = _authContext.getCachedUser();

}

/**
* @function ROOTNAMESPACE.SUBNAMESPACE.ADALlogin
* @memberOf ROOTNAMESPACE.SUBNAMESPACE
* @description Directs the user to the sign-in page to enter their credentials
*/
this.ADALlogin = function () {
    _authContext.login();
}
/**
* @function ROOTNAMESPACE.SUBNAMESPACE.ADALlogout
* @memberOf ROOTNAMESPACE.SUBNAMESPACE
* @description Logs out the user
*/
this.ADALlogout = function () {
    _authContext.logOut();
}
/**
* @function ROOTNAMESPACE.SUBNAMESPACE.ADALIsAuthenticated
* @memberOf ROOTNAMESPACE.SUBNAMESPACE
* @description Returns whether the user is authenticated or not
* @returns {Boolean} Whether the user is authenticated or not
*/
this.ADALIsAuthenticated = function () {
    return (_user != null);
}
/**
* @function ROOTNAMESPACE.SUBNAMESPACE.ADALGetUser
* @memberOf ROOTNAMESPACE.SUBNAMESPACE
* @description Returns the ADAL user object
* @returns {Object} The ADAL user object
*/
this.ADALGetUser = function () {
    return _user;
}

//#endregion ADAL functions