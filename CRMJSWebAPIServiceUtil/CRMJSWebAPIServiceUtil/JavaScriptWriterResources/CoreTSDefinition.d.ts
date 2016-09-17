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


declare namespace ROOTNAMESPACE.SUBNAMESPACE {

    //ADAL Support START
    //ADALFUNCTIONS
    //ADAL Support END

    interface propertyType {
         name: string;
         type: string;
    }

    interface navigationPropertyType {
         name: string;
         type: Function;
    }

    interface entityCollection {
        value: Array<crmbaseentity>;
        nextLink?: string;
        count?: number;
    }

    interface entityReference {
        "@odata.id": string;
    }

    //Metadata property interfaces START
    //METADATAPROPERTYINTERFACES
    //Metadata property interfaces END

    interface crmbaseentity {
         type: string;
         primaryKey: string;
         entitySetName: string;
        getFormattedValue(propertyName: string, whenNullText?: string): string;
        getUri(): string;
        getId(): string;
        setIdFromUri(uri: string);
        getRef(): entityReference;
        getColumnSet(): Array<string>;
        get(propertyName: string): any;
        set(propertyName: string, value: any);
        resetChangeTracking();
    }
    // MODELDEFINITIONS START
    //MODELDEFINITIONS
    // MODELDEFINITIONS END


    /**
     * Create a new entity
     * @param entity A ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity with the properties for the entity you want to create.
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise with the uri for the entity created.
     */
    function create(
        entity: crmbaseentity,
        callerId?: string): Promise<string>;

    /**
     * Create a new entity and retrieve it
     * @param entity A ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity with the properties for the entity you want to create.
     * @param properties The properties of the entity to return using $select
     * @param navProperties An array of expressions for the navigation properties you want return using $expand
     * @param includeFormattedValues Whether you want to return formatted values
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise with the object from the parsed JSON returned.
     */
    function createAndRetrieve(
        entity: crmbaseentity,
        properties?: Array<string>,
        navProperties?: Array<string>,
        includeFormattedValues?: boolean,
        callerId?: string): Promise<Object>;

    /**
     * Create a new entity and retrieve a typed entity
     * @param entity A ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity with the properties for the entity you want to create.
     * @param properties The properties of the entity to return using $select
     * @param navProperties An array of expressions for the navigation properties you want return using $expand
     * @param includeFormattedValues Whether you want to return formatted values
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise with the typed object
     */
    function createAndRetrieveTypedEntity(
        entity: crmbaseentity,
        properties?: Array<string>,
        navProperties?: Array<string>,
        includeFormattedValues?: boolean,
        callerId?: string): Promise<crmbaseentity>;

    /**
     * Retrieve an entity
     * @param uri The URI to the entity you want to retrieve
     * @param properties The properties of the entity to return using $select
     * @param navProperties An array of expressions for the navigation properties you want return using $expand
     * @param includeFormattedValues Whether you want to return formatted values
     * @param version The version of the current record. Do not return values when the data has not changed since last retrieval
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise with the object from the parsed JSON returned.
     */
    function retrieve(uri: string,
        properties?: Array<string>,
        navProperties?: Array<string>,
        includeFormattedValues?: boolean,
        version?: string,
        callerId?: string): Promise<Object>

    /**
     * Retrieve a typed entity
     * @param uri The URI to the entity you want to retrieve
     * @param properties The properties of the entity to return using $select
     * @param navProperties An array of expressions for the navigation properties you want return using $expand
     * @param includeFormattedValues Whether you want to return formatted values
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise with the typed object
     */
    function retrieveTypedEntity(uri: string,
        properties?: Array<string>,
        navProperties?: Array<string>,
        includeFormattedValues?: boolean,
        callerId?: string): Promise<crmbaseentity>

    /**
     * Retrieve the value of a single entity property
     * @param uri The URI to the entity with the property you want to retrieve
     * @param propertyName The name of the property
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise with the value of the property requested.
     */
    function retrieveProperty(uri: string,
        propertyName: string,
        callerId?: string): Promise<Object>

    /**
     * Update an existing entity
     * @param entity A ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity that you want to update
     * @param cancelWhenOlder Whether to cancel update when the server version is newer. Default is false;
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise that is resolved when successful or rejected with an error;
     */
    function update(entity: crmbaseentity, cancelWhenOlder?: boolean,  callerId?: string): Promise<void>

    /**
     * Create an entity if it doesn't exist, otherwise update existing entity
     * @param entity A ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity that you want to upsert
     * @param [preventUpdate] Whether to allow the upsert operation to update existing records. Default is false
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise that is resolved when successful or rejected with an error;
     */
    function upsert(entity: crmbaseentity, preventUpdate?: boolean, callerId?: string): Promise<void>

    /**
     * Delete an entity
     * @param uri The URI for the entity to delete
     * @param version The version of the entity to delete. Delete cancelled if server version is different.
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise that is resolved when successful or rejected with an error;
     */
    function deleteEntity(uri: string, version?: string, callerId?: string): Promise<void>

    /**
     * Adds an entity to an entity collection
     * @param uri1 A URI for an entity that has the collection-valued navigation property named by the collectionName parameter.
     * @param collectionName The name of the collection-valued navigation property to use
     * @param uri2 A URI for an entity to add to the collection
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise that is resolved when successful or rejected with an error;
     */
    function addToCollection(
        uri1: string,
        collectionName: string,
        uri2: string,
        callerId?: string): Promise<void>

    /**
     * Disassociate entities with a specific relationship
     * @param uri1 A URI for an entity that has a navigation property with a name that matches the relationshipName parameter
     * @param relationshipName The name of the navigation property that identifies the relationship to use
     * @param uri2 A URI for an entity to disassociate with the entity represented by the uri1 parameter
     *  uri2 parameter is optional when the relationshipName represents a single-valued navigation property.
     * @param callerId  A string representation of the GUID value for the user to impersonate.
     * @returns A Promise that is resolved when successful or rejected with an error;
     */
    function disassociate(
        uri1: string,
        relationshipName: string,
        uri2?: string,
        callerId?: string): Promise<void>

    /**
     * Retrieve multiple entities matching the criteria you define
     * @param entitySetName The entity Set name for the type of entity you want to retrieve.
     * @param query The system query parameters you want to apply.
     * @param includeFormattedValues Whether you want to have formatted values included in the results
     * @param maxPageSize A number that limits the number of entities to be retrieved in the query and allows for paging
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise resolved with the results of the query when successful or rejected with an error
     */
    function query(
        entitySetName: string,
        query?: string,
        includeFormattedValues?: boolean,
        maxPageSize?: number,
        callerId?: string): Promise<entityCollection>

    /**
     * Return the next page from the results of an ROOTNAMESPACE.SUBNAMESPACE.query when there are more pages
     * @param nextLink The value of the @odata.nextLink property for the results of a query query when there are more pages.
     * @param includeFormattedValues Whether you want to have formatted values included in the results
     * @param maxPageSize A number that limits the number of entities to be retrieved in the query and allows for paging
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise resolved with the results of the query when successful or rejected with an error
     */

    function getNextPage(
        nextLink: string,
        includeFormattedValues?: boolean,
        maxPageSize?: number,
        callerId?: string): Promise<entityCollection>

    /** 
    Return the results of a FetchXML query
    * @param entitySetName The entity set name for the type of entity indicated in the FetchXml entity element name attribute.
    * @param fetchXml The FetchXML. You do not need to URLEncode this string.
    * @param includeFormattedValues Whether you want to have formatted values included in the results
    * @param maxPageSize A number that limits the number of entities to be retrieved in the query and allows for paging
    * @param pageNumber A number that indicates which page to return when maxPageSize is applied.
    * @param callerId A string representation of the GUID value for the user to impersonate.
    * @returns A promise that returns the results when resolved or an Error if rejected
    */
    function executeFetch(
        entitySetName: string,
        fetchXml: string,
        includeFormattedValues?: boolean,
        maxPageSize?: number,
        pageNumber?: number,
        callerId?: string
    ): Promise<entityCollection>

    /**
     * Returns the formatted value of a property
     * @param JSONentity The retrieved JSON entity that is not an instance of ROOTNAMESPACE.SUBNAMESPACE.crmbaseentity
     * @param propertyName The name of the property
     * @param whenNullText Text to return if the formatted value is null or undefined
     */

    function formatted(
        JSONentity: Object,
        propertyName: string,
        whenNullText?: string): string

    /**
     * Returns the base URI for the WebAPI
     */

    function getWebAPIPath(): string

    /**
     * Sets the base client URI rather than deriving it from web resource context
     * @param uri The base client URI referring to the Organization (Not the Web API!)
     */

    function setClientUrl(uri: string)


}