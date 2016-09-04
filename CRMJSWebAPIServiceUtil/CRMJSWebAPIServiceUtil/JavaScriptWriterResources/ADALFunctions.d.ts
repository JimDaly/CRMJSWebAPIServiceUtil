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

//ADAL Functions START

interface ADALUserProfile {
    amr: Array<string>;
    aud: string;
    exp: number;
    family_name: string;
    given_name: string;
    iat: number;
    ipaddr: string;
    iss: string;
    name: string;
    nbf: number;
    nonce: string;
    oid: string;
    sub: string;
    tid: string;
    unique_name: string;
    upn: string;
    ver: string
}

interface ADALUser {
    username: string;
    profile: ADALUserProfile;
}

/**
 * Initializes ADAL for a Single Page Application
 * @param tenant The name of the Azure AD organization you use, i.e. '[organization name].onmicrosoft.com'
 * @param clientId The ClientId you got when you registered the application
 * @param clientUrl The URL to connect to CRM, i.e. 'https://[organization name].crm.dynamics.com'
 */

function ADALInit(
    tenant: string,
    clientId: string,
    clientUrl: string
)

/**
 * Directs the user to the sign-in page to enter their credentials
 */

function ADALlogin()

/**
 * Logs out the user
 */
function ADALlogout()
/**
 * Returns whether the user is authenticated or not
 * @returns Whether the user is authenticated or not
 */
function ADALIsAuthenticated(): boolean

/**
 * Returns the ADAL user object
 * @returns The ADAL user object
 */
function ADALGetUser(): ADALUser;

    //ADAL Functions END
