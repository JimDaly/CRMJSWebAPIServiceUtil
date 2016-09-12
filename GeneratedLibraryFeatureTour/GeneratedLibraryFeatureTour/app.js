/*
Added es6-promise.TypeScript.DefinitelyTyped NuGet package so that the Promise object is recognized
*/
document.addEventListener("DOMContentLoaded", function (event) {
    /*
     Tip: If you have a CRM on-premise deployment you can test and debug these scripts in Visual Studio and IE11.
          This is a huge productivity improvement because you don't need to upload and publish scripts in CRM.
     How?
         In IE 11 go to Internet Options > Security tab.
         Select Trusted Sites and click Sites.
         Add http://localhost to the sites in your Trusted sites zone.
         Set a Custom level... for the Trusted sites zone:
             In the Security Settings dialog, find the Miscellaneous category,
             Enable the Access data sources accross domains setting.
             Then add the line below to use the setClientUrl function to the URL for your on-premises CRM organization.
         Make IE 11 your default browser for debugging. This way you can use F5 to debug...
         But personally, I just right click the index.html page in the Solution Explorer and choose Browse With... Internet Explorer.
         You will probably be prompted for credentials when the page opens. Enter them and keep the browser window open while
         you edit and test your code.
 
         This cannot be made to work with CRM Online or other browsers.
         Be sure to upload and publish files as web resources in CRM and test with other browsers.
     IMPORTANT: Be sure to remove the setClientUrl call below before you upload script as web resource.

    If you have a workaround that works with CRM Online, please share!
     */
    Demo.Tour.setClientUrl("http://yourServer/yourOrg");
    featureTour();
});
function featureTour() {
    /*
    Including trackPropertyChanges first because it demonstrates
    one of the more unique capabilities of this library.
    */
    trackPropertyChanges()
        .then(function () {
        return usingEntities();
    })
        .catch(function (err) {
        console.log(err.message);
    });
}
/*
  One of the benefits of this library which you can't see just by looking at the sample
  code is the way that it manages which property values have been changed.

Why is this important?
    If you retrieve an object from CRM and simply update a property value on that JSON
    and then perform an update passing that updated JSON - you are updating every property
    that is included in that JSON, even if that value didn't change.

    This will mess up any auditing data that you capture if you have auditing enabled
    for that entity and attribute. This can come  as an unpleasant surprise to people
    months after the fact when they see that their auditing data is not good.

    The correct way to do an update without this library is to create a new JSON object
    and add only the properties and values which you want to update. You can do this
    with this library too, but it does include some capabilities to track this automatically.

What you should be aware of:
    This change tracking is achieved with a custom toJSON method which is called by
    JSON.stringify when the object is serialized to be sent to the server.
    See: https://msdn.microsoft.com/library/cc836459(v=vs.94).aspx#Anchor_4
    In the unlikely event your code uses toJSON directly on these objects you
    will see this custom behavior.

  */
function trackPropertyChanges() {
    return new Promise(function (resolve, reject) {
        //Setting a namespace alias to reduce amount of typing is recommended.
        var ns = Demo.Tour;
        //Create an entity
        var contosoAccount = new ns.account();
        contosoAccount.name = "Contoso";
        contosoAccount.customertypecode = 10;
        /*
          For example, right now when we save this entity only the two properties we set will be included.
          You can verify this by using the JSON.stringify method.
          */
        console.log(JSON.stringify(contosoAccount));
        /* OUTPUT:
           {
            "@odata.type":"Microsoft.Dynamics.CRM.account",
            "name":"Contoso",
            "customertypecode":10
           }
    
        These are the only properties that will be sent when the account is created.
        After you use createAndRetrieveTypedEntity, these properties will not be output:
        */
        //NOTE: Since this is the first asynchronous operation in this function, do not return
        ns.createAndRetrieveTypedEntity(contosoAccount, //The entity to create. This must be a class. Simple JSON will not work.
        contosoAccount.getColumnSet(), //The properties to return in the retrieve. 
        //getColumnSet returns a string array of all properties for this entity in your library.
        //You can also set your own array of string property names.
        null, //navigation properties. This example will not return related records
        true //include formatted values
        )
            .then(function (response) {
            console.log(JSON.stringify(response));
            /* The updated properties are suppressed.
            OUTPUT:
               {
                "@odata.type":"Microsoft.Dynamics.CRM.account",
                "accountid":"00000000-0000-0000-0000-000000000001"
               }

            But the property values are still returned:
            */
            //Tell TypeScript the type and assign the returned value to the existing variable
            contosoAccount = response;
            console.log("%s is a %s", contosoAccount.name, contosoAccount.getFormattedValue("customertypecode"));
            //OUTPUT: Contoso is a Supplier
            // When you set another property value like so:
            contosoAccount.address1_city = "Seattle";
            //Only that changed value will be sent when the entity is updated:
            console.log(JSON.stringify(contosoAccount));
            /* Now address1_city is included:
            OUTPUT:
                {
                "@odata.type":"Microsoft.Dynamics.CRM.account",
                "accountid":"00000000-0000-0000-0000-000000000001",
                "address1_city":"Seattle"
                }
            */
            // **IMPORTANT**: Always return subsequent calls within your .then statement. Easy to forget this!!
            return ns.update(contosoAccount);
        })
            .then(function () {
            //After the update, the entity passed through has the changed properties re-set
            // and only the two basic properties remain.
            console.log(JSON.stringify(contosoAccount));
            /* OUTPUT:
               {
                "@odata.type":"Microsoft.Dynamics.CRM.account",
                "accountid":"00000000-0000-0000-0000-000000000001"
               }

            Yet all the property values are accessible to your code:
            */
            console.log(" %s is a %s in %s.", contosoAccount.name, contosoAccount.getFormattedValue("customertypecode"), contosoAccount.address1_city);
            //Output: Contoso is a Supplier in Seattle.
            /*
            RetrieveTypedEntity works the same way
            */
            // **IMPORTANT**: Always return subsequent calls within your .then statement. Easy to forget this!!
            return ns.retrieveTypedEntity(contosoAccount.getUri(), 
            /*
            Note: Using named properties rather than getColumnSet so that I can
            include modifiedon which is not included in the property definitions of the library
            */
            ["name", "customertypecode", "address1_city", "modifiedon"], null, true);
        })
            .then(function (response) {
            contosoAccount = response;
            //Again, the retrieved property values will not be updated.
            console.log(JSON.stringify(contosoAccount));
            /* OUTPUT:
               {
                "@odata.type":"Microsoft.Dynamics.CRM.account",
                "accountid":"00000000-0000-0000-0000-000000000001"
               }

            Yet all the property values are accessible to your code:
            */
            console.log(" %s is a %s in %s modified on %s.", contosoAccount.name, contosoAccount.getFormattedValue("customertypecode"), contosoAccount.address1_city, contosoAccount.getFormattedValue("modifiedon"));
            //Output: Contoso is a Supplier in Seattle modified on 9/11/2016 12:02 PM.
            contosoAccount.accountnumber = "ABC123";
            // Again, only updated properties will be sent
            console.log(JSON.stringify(contosoAccount));
            /* accountnumber is now included
            OUTPUT:
               {
                "@odata.type":"Microsoft.Dynamics.CRM.account",
                "accountid":"00000000-0000-0000-0000-000000000001"
                "accountnumber":"ABC123"
               }

           
            */
            // **IMPORTANT**: Always return subsequent calls within your .then statement. Easy to forget this!!
            return ns.update(contosoAccount);
        })
            .then(function () {
            /*
            *IMPORTANT*
            If you do not retrieve a typed entity this change tracking
            will not be applied without special handling because the response is just JSON.
            */
            // **IMPORTANT**: Always return subsequent calls within your .then statement. Easy to forget this!!
            return ns.retrieve(contosoAccount.getUri(), ["name", "customertypecode", "address1_city", "modifiedon", "accountnumber"], null, true);
        })
            .then(function (JSONResponse) {
            //Initializing contosoAccount as a new account with the JSON response from Demo.Tour.retrieve
            contosoAccount = new ns.account(JSONResponse);
            console.log(JSON.stringify(contosoAccount));
            /* All properties are treated as changed:
            OUTPUT:
            {
            "@odata.type":"Microsoft.Dynamics.CRM.account",
            "accountid":"00000000-0000-0000-0000-000000000001",
            "name":"Contoso",
            "customertypecode":10,
            "address1_city":"Seattle",
            "modifiedon":"2016-09-11T19:15:50.000Z",
            "accountnumber":"ABC123",
            "address1_composite":"Seattle"
            }

           But you can re-set all of these properties using resetChangeTracking
            */
            contosoAccount.resetChangeTracking();
            console.log(JSON.stringify(contosoAccount));
            /* All properties are treated as unchanged:
            OUTPUT:
            {
            "@odata.type":"Microsoft.Dynamics.CRM.account",
            "accountid":"00000000-0000-0000-0000-000000000001"
            }

            Alternatively, you can instantiate a new account instance
            setting only the primary key property by passing in the URI of
            an existing entity:
            */
            var contosoForUpdate = new ns.account(contosoAccount.getUri());
            contosoForUpdate.address1_country = "USA";
            console.log(JSON.stringify(contosoForUpdate));
            /* Only address1_country would be sent in an update
            OUTPUT:
            {
            "@odata.type":"Microsoft.Dynamics.CRM.account",
            "accountid":"00000000-0000-0000-0000-000000000001",
            "address1_country":"USA"
            }
            */
            return ns.update(contosoForUpdate);
        })
            .then(function () {
            // address1_country was updated
            /*
            If there are no changed properties to update
            calling update won't send the request to the server.
            When debugging, you will see the following logged in the browser developer tools console:
                Update request not sent for account accountid:00000000-0000-0000-0000-000000000001 because no changes applied.
            */
            return ns.update(contosoAccount);
        })
            .then(function () {
            //No request was sent to the server.
        })
            .catch(function (err) {
            reject(new Error("Error in trackPropertyChanges: " + err.message));
        })
            .then(function () {
            //Removing entities created in this example
            ns.deleteEntity(contosoAccount.getUri())
                .then(function () {
                console.log("Contoso Account deleted at %s.", contosoAccount.getUri());
            })
                .catch(function (err) {
                console.log("Error deleteing account in trackPropertyChanges.");
            })
                .then(function () {
                //We are done here
                resolve();
            });
        });
    });
}
function usingEntities() {
    return new Promise(function (resolve, reject) {
        //Setting a namespace alias to reduce amount of typing is recommended.
        var ns = Demo.Tour;
        var parentContactUri;
        //Ordinary simple create scenario with no value passed to the constructor;
        var jackJonesContact = new ns.contact();
        // Property values are as you expect with IntelliSense support for properties defined in the generated library.
        jackJonesContact.firstname = "Jack";
        jackJonesContact.lastname = "Jones";
        /*
        But, if there are properties you want to use which are not defined in the generated library,
        You may want to re-generate the library and add them but...
        You can still set them with the set method:
        */
        jackJonesContact.set("address1_latitude", 47.673988);
        jackJonesContact.set("address1_longitude", -122.121512);
        // And retrieve the values with the get method:
        console.log("lat/long: (%s,%s)", jackJonesContact.get("address1_latitude"), jackJonesContact.get("address1_longitude"));
        //OUTPUT: lat/long: (47.673988,-122.121512)
        /*
        IMPORTANT: You do not get type checking when you use set
            you will get a server error if you use the wrong type.

        The following is what you can expect if you try
        to set an incorrect type or set a read only property

        TypeScript will throw a build error if you try the following
        since fullname is read-only:

            jackJonesContact.fullname = "Jack Jones";
        Error:
            Build:Left-hand side of assignment expression cannot be a constant or a read-only property.

        Plain JavaScript will just ignore it. The setter is not defined.

        TypeScript will throw a build error if you try this:
            jackJonesContact.address1_city = 42;
        Error:
            Build:Type 'number' is not assignable to type 'string'.

        Plain JavaScript will throw a detailed error at run-time:
            Demo.Tour.contact address1_city property must be a String value or null.

        With either plain JavaScript or TypeScript:
        If you by-pass this type checking with set like so:
            jackJonesContact.set("address1_city", 42);
        and attempt to save the entity you will get a server error:
            Cannot convert the literal '42' to the expected type 'Edm.String'.

        ** Creating with Deep insert **
        Only when you create a new entity, you can add new related entities
        that will be created via deep-insert. You cannot do this when updating an entity.

        For collection-valued navigation properties, you can either
        push a named entity instance into the collection like so:
        */
        var task1 = new ns.task();
        task1.subject = "Task 1";
        jackJonesContact.Contact_Tasks = [task1];
        /*
        Or you can pass the JSON representation of the entity
        To the constructor as anonymous functions like so:
        */
        jackJonesContact.Contact_Phonecalls = [
            new ns.phonecall({ subject: "Phone Call 1" }),
            new ns.phonecall({ subject: "Phone Call 2" })
        ];
        //Setting the lookup property to create a new contact:
        var jillJones = new ns.contact();
        jillJones.firstname = "Jill";
        jillJones.lastname = "Jones";
        jackJonesContact.parentcustomerid_contact = jillJones;
        //You cannot set un-typed JSON data. Types are all checked in the JavaScript library.
        ns.create(jackJonesContact)
            .then(function (uri) {
            /*
            If you have an existing entity instance you want
            to keep working with, you can use the setIdFromUri method to set the ID;
            setIdFromUri will also apply resetChangeTracking to mark any property values as unchanged.
            See trackPropertyChanges example for why this is important.
            */
            jackJonesContact.setIdFromUri(uri);
            /*
            Or, you can instantiate a new entity and set the Id using the uri
             but this will not have the firstname and lastname property values.
            */
            var jjContact = new ns.contact(uri);
            /*
            Or, if you just have the Id value you can pass that to the constructor.
            */
            var jackJonesContactId = jackJonesContact.getId();
            //Proving they are the same.
            console.assert(jackJonesContactId == jackJonesContact.contactid, "The values are not the same"); //Should not display.
            jjContact = new ns.contact(jackJonesContactId);
            /*
            When retrieving entities you can leverage the getColumnSet method to
            get the base set of properties defined in the library. You can then
            manipulate this string array, or just use it as-is.
            */
            var contactProperties = jjContact.getColumnSet();
            //add additional:
            contactProperties.push("address1_latitude");
            contactProperties.push("address1_longitude");
            //remove existing:
            contactProperties.splice(contactProperties.indexOf("accountrolecode"), 1);
            contactProperties.splice(contactProperties.indexOf("address1_freighttermscode"), 1);
            /*
            Tip:
            If you aren't sure about the names, and you don't want to look them up, use the entity properties dictionary to look them up.
            With IntelliSense, this dictionary provides easy access to the properties defined
            within the generated library. Each of these properties has a name property that returns
            a string that matches the name. There is also a type property that returns a string telling
            the type. Use case for this type property not clear yet, but I like having this metadata available.

            Example: remove "address1_composite" from the contactProperties array:
            */
            contactProperties
                .splice(contactProperties
                .indexOf(jjContact.properties.address1_composite.name), 1);
            /*
            There is also an entity collections dictionary with all the relationships included in the library.
            Items in this dictionary also have a string name property, but the type property is a reference to
            the class function.
            */
            return ns.retrieve(uri, contactProperties, ["parentcustomerid_contact($select=fullname)",
                jjContact.collections.Contact_Phonecalls.name + "($select=subject)",
                "Contact_Tasks($select=subject)" //Using the plain name rather than the dictionary name is just fine.
            ], true);
        })
            .then(function (response) {
            /*
            When you instantiate the results of a retrieve, only JSON data is returned,
            but you can pass this to the constructor of the class.
            */
            jackJonesContact = new ns.contact(response);
            /*
            But the related objects are still just JSON, so you can't
            call entity functions on them:
            */
            try {
                //Even TypeScript will not prevent this error:
                jackJonesContact.Contact_Phonecalls[0].getUri();
            }
            catch (e) {
                console.log("Expected Error: " + e.message);
            }
            /*
            But you can bulk instantiate these in your code like so:
            */
            jackJonesContact.Contact_Phonecalls = jackJonesContact.Contact_Phonecalls.map(function (x) { return new ns.phonecall(x); });
            jackJonesContact.Contact_Tasks = jackJonesContact.Contact_Tasks.map(function (x) { return new ns.task(x); });
            //Now the code above will not throw an error:
            console.log("The first phone call created is here: %s", jackJonesContact.Contact_Phonecalls[0].getUri());
            /*
            But if you use retrieveTypedEntity the entity is returned as a typed instance
            and all related entities are typed as well:
            */
            return ns.retrieveTypedEntity(jackJonesContact.getUri(), jackJonesContact.getColumnSet(), ["parentcustomerid_contact($select=fullname)",
                "Contact_Phonecalls($select=subject)",
                "Contact_Tasks($select=subject)"
            ], true);
        })
            .then(function (response) {
            jackJonesContact = response;
            //Capturing the URL of the parent contact created so it will be deleted later.
            parentContactUri = jackJonesContact.parentcustomerid_contact.getUri();
            //Now the phone call instances are typed
            console.log("The first phone call created is here: %s", jackJonesContact.Contact_Phonecalls[0].getUri());
            console.log("Parent contact URI: %s", jackJonesContact.parentcustomerid_contact.getUri());
        })
            .catch(function (err) {
            reject(new Error("Error in usingEntities: " + err.message));
        })
            .then(function () {
            //Removing entities created in this example
            ns.deleteEntity(parentContactUri)
                .then(function () {
                return ns.deleteEntity(jackJonesContact.getUri());
            })
                .then(function () {
                console.log("Jack Jones and Jill Jones contacts deleted.");
                return;
            })
                .catch(function (err) {
                console.log("Error deleteing contacts in usingEntities.");
            })
                .then(function () {
                //We are done here..
                resolve();
            });
        });
    });
}
//# sourceMappingURL=app.js.map