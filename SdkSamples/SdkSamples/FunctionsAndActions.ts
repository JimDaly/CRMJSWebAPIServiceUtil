

document.addEventListener("DOMContentLoaded", function (event) {


    functionsAndActionsSample();

});

var entitiesToDelete = [];              // Entity URIs to be deleted later 
var incidentUri;
var opportunityUri;
var letterUri;
var contactUri;                         // Add a note to this contact.
var CUSTOMERACCOUNTNAME = "Account Customer Created in WebAPIFunctionsAndActions sample"; // For custom action.

// (if user chooses to delete sample data).
var deleteData = true;                  // Controls whether sample data are deleted at the end of sample run.


function functionsAndActionsSample() {
    var ns = Sdk.Sample;

    var incident = new ns.incident(); // Incident created with three closed tasks.
    var opportunity = new ns.opportunity(); // Closed opportunity to re-open before deleting.
    var letter = new ns.letter();// Letter to add to contact's queue.
    var myQueue = new ns.queue();  // The contact's queue uri.
    var contact = new ns.contact();  // Add a note to this contact.
    var annotation = new ns.annotation(); //Note added to contact
    const CUSTOMERACCOUNTNAME = "Account Customer Created in WebAPIFunctionsAndActions sample"; // For custom action.

    console.log("-- Sample started --");
    createRequiredRecords()
        .then(function () {
            console.log("-- Working with functions --");
            // Bound and Unbound functions
            // See https://msdn.microsoft.com/en-us/library/gg309638.aspx#bkmk_boundAndUnboundFunctions
            console.log("Using functions to look up your full name.");
            // Calling a basic unbound function without parameters.
            // Retrieves the user's full name using a series of function requests.
            //  - Call WhoAmI via the getUsersFullName function.
            // For more info on the WhoAmI function, see https://msdn.microsoft.com/en-us/library/mt607925.aspx
            return getUsersFullName();
        })
        .then(function (fullName) {
            console.log("\tYour full name is: %s\n", fullName);

            console.log("Unbound function: GetTimeZoneCodeByLocalizedName");
            // Calling a basic unbound function with no parameters.
            // Retrieves the time zone code for the specified time zone.
            //  - Pass parameters to an unbound function by calling  the GetTimeZoneCodeByLocalizedName Function.
            // For more info, see https://msdn.microsoft.com/library/mt607644.aspx
            return ns.GetTimeZoneCodeByLocalizedName("Pacific Standard Time", 1033)
        })
        .then(function (response: Sdk.Sample.GetTimeZoneCodeByLocalizedNameResponse) {
            console.log("\tFunction returned time zone %s, with code '%s'.", "Pacific Standard Time", response.TimeZoneCode);

            console.log("Bound function: CalculateTotalTimeIncident");
            // Calling a basic bound function that requires parameters.
            // Retrieve the total time, in minutes, spent on all tasks associated with this incident.
            //  - Use CalculateTotalTimeIncident to get the total duration of all closed activities.
            // For more info, see https://msdn.microsoft.com/library/mt593054.aspx
            return ns.CalculateTotalTimeIncident(incidentUri);
        })
        .then(function (response: Sdk.Sample.CalculateTotalTimeIncidentResponse) {
            console.log("\tFunction returned %s minutes - total duration of tasks associated with the incident.\n",
                response.TotalTime);

            console.log("-- Working with Actions --");
            // For more info about Action, see https://msdn.microsoft.com/en-us/library/mt607600.aspx

            console.log("Unbound Action: WinOpportunity");

            var opportunityClose = new ns.opportunityclose();
            opportunityClose.subject = "Won Opportunity";
            opportunityClose.opportunityidUri(opportunityUri);

            return ns.WinOpportunity(opportunityClose, 3);
        })
        .then(function () {
            console.log("\tOpportunity won.");

            console.log("Bound Action: AddToQueue");
            // Calling a bound action that requires parameters.
            // Adds a new letter tracking activity to the current user's queue.
            // The letter was created as part of the createRequiredRecords function.
            //  - Get a reference to the current user.
            //  - Get a reference to the letter activity.
            //  - Add letter to current user's queue via the bound action AddToQueue.
            // For more info on AddToQueue, see https://msdn.microsoft.com/en-us/library/mt607880.aspx
            return ns.WhoAmI()
        })
        .then(function (response: Sdk.Sample.WhoAmIResponse) {
            var myId = response.UserId;

            //Systemuser is not included in the library, so constructing path
            return ns.retrieveProperty("/systemusers(" + myId + ")", "queueid/$ref");
        })
        .then(function (value) {
            myQueue = new ns.queue(value["@odata.id"]);

            var letter = new ns.letter(letterUri)

            return ns.AddToQueue(myQueue.getUri(), letter, null, null);
        })
        .then(function (response: Sdk.Sample.AddToQueueResponse) {
            var queueItemId = response.QueueItemId;
            console.log("\tQueueItemId returned from AddToQueue Action: %s\n", queueItemId);

            console.log("-- Working with custom actions --");
            console.log("Custom action: sample_AddNoteToContact");

            return ns.sample_AddNoteToContact(contactUri, "The Title of the Note", "The text content of the note");
        })
        .then(function (response) {
            annotation = new ns.annotation(response);
            return ns.retrieve(annotation.getUri(), ["subject", "notetext"], ["objectid_contact($select=fullname)"]);
        })
        .then(function (response) {
            annotation = new ns.annotation(response);

            console.log("\tA note with the title '%s' and the content '%s' was created and associated with the contact %s.\n",
                annotation.get("subject"), annotation.get("notetext"), annotation.objectid_contact.fullname);

            console.log("Custom action: sample_CreateCustomer");
            return ns.sample_CreateCustomer("account", CUSTOMERACCOUNTNAME, null, null)
        })
        .then(function () {
            // Retrieve the account we just created
            return ns.query("accounts", "$select=name&$filter=name eq '" + CUSTOMERACCOUNTNAME + "'");
        })
        .then(function (response) {
            var customerAccount = new ns.account(response.value[0]);
            entitiesToDelete.push(customerAccount.getUri());
            console.log("\tAccount customer created with the name '%s'", customerAccount.name);

            return new Promise(function (resolve, reject) {
                ns.sample_CreateCustomer("contact", CUSTOMERACCOUNTNAME, null, null) //This request is expected to fail
                    .then(function () {
                        console.log("Not expected.")
                        reject(new Error("Call to sample_CreateCustomer not expected to succeed."))
                    })
                    .catch(function (err) {
                        //Expected error
                        console.log("\tExpected custom error: " + err.message); // Custom action can return custom error messages.
                        resolve(); // Show the error but resolve the thread so sample can continue.
                    });
            })
        })    
        .catch(function (err) {
            console.log("ERROR: " + err.message);
        })
        //always do this:
        .then(function () {

            if (deleteData) {

                entitiesToDelete.forEach(function (uri, i) {

                    //Spacing out the deletion operations by 100 ms to avoid Generic SQL error
                    setTimeout(function (uri) {
                        ns.deleteEntity(uri)
                            .then(function () {
                                console.log("entity deleted at: %s", uri);
                            })
                            .catch(function (err) {
                                console.log("Error deleting entity at: %s \n\t Reason: %s", uri, err.message);
                            })
                    }, i * 100, uri);

                });
            }
        })
}

/**
 * @function Sdk.getUsersFullName
 * @description Retrieves the current user's full name.
 * @returns A Promise that returns the full name of the user
 */
function getUsersFullName() {
    var ns = Sdk.Sample;
    return new Promise(function (resolve, reject) {
        ns.WhoAmI()
            .then(function (response: Sdk.Sample.WhoAmIResponse) {
                var myId = response.UserId;
                return ns.retrieveProperty("/systemusers(" + myId+")", "fullname");
            })
            .then(function (value) {
                resolve(value);
            })
            .catch(function (err) {
                reject("Error in getUsersFullName function: " + err.message);
            });
    });
}

function createRequiredRecords() {
    var ns = Sdk.Sample;
    console.log("-- Creating sample data --");
    // Create a parent account, an associated incident with three 
    // associated tasks(required for CalculateTotalTimeIncident).
    return new Promise(function (resolve, reject) {
        createAccountWithIncidentAndThree30MinuteClosedTasks()
            .then(function (iUri) {
                incidentUri = iUri;
                return createAccountWithOpportunityToWin();
            })
            .then(function (oUri) {
                opportunityUri = oUri;

                // Create a letter to use with AddToQueue action.
                var letter = new ns.letter();
                letter.description = "Example letter";
                return ns.create(letter);
            })
            .then(function (lUri) {
                letterUri = lUri;
                entitiesToDelete.push(lUri);

                // Create a contact to use with custom action sample_AddNoteToContact 
                var contact = new ns.contact();
                contact.firstname = "Jon";
                contact.lastname = "Fogg";
                return ns.create(contact);
            })
            .then(function (cUri) {
                contactUri = cUri;
                entitiesToDelete.push(cUri);
                resolve();
            })
            .catch(function (err) {
                reject("Error in createRequiredRecords function: " + err.message);
            });
    });
}

/**
 * @function createAccountwithIncidentAndThree30MinuteClosedTasks
 * @description Create an account and associate three 30 minute tasks. Close the tasks.
 * @returns {Promise} - A Promise that returns the uri of an incident created.
 */
function createAccountWithIncidentAndThree30MinuteClosedTasks() {
    var ns = Sdk.Sample;
    return new Promise(function (resolve, reject) {
        var iUri;
        var account = new ns.account();
        account.name = "Fourth Coffee";
        ns.create(account)
            .then(function (uri) {
                var accountUri = uri;
                entitiesToDelete.push(uri);

                var incident = new ns.incident();
                incident.set("title", "Sample Case");
                incident.customerid_accountUri(accountUri);
                //Constructor can be used to initialize values from JSON
                incident.Incident_Tasks = [
                    new ns.task({
                        subject: "Task 1",
                        actualdurationminutes: 30
                    }),
                    new ns.task({
                        subject: "Task 2",
                        actualdurationminutes: 30
                    }),
                    new ns.task({
                        subject: "Task 3",
                        actualdurationminutes: 30
                    })
                ];

                return ns.create(incident);
            })
            .then(function (uri) {
                iUri = uri;
                return ns.retrieveProperty(iUri, "Incident_Tasks/$ref");
            })
            .then(function (value: Array<Sdk.Sample.entityReference>) {
                var taskReferences = [];
                value.forEach(function (tr) {
                    taskReferences.push(tr["@odata.id"]);
                });

                // An array to hold a set of promises.
                var promises = [];
                // The data to use to update the tasks so that they are closed.

                taskReferences.forEach(function (tr) {
                    var task = new ns.task(tr);
                    //statecode and statuscode are not defined in the library, so using set
                    task.set("statecode", 1);//Completed
                    task.set("statuscode", 5);//Completed
                    promises.push(ns.update(task));
                })
                return Promise.all(promises);
            })
            .then(function () {
                resolve(iUri);
            })
            .catch(function (err) {
                // Differentiate the message for any error returned by this function.
                reject(new Error("ERROR in createAccountwithIncidentAndThree30MinuteClosedTasks function: " + err.message))
            });
    });
}

/**
 * @function createAccountwithOpportunityToWin
 * @description Create an account and an associated opportunity.
 * @returns {Promise} - A Promise that returns the uri of an opportunity.
 */
function createAccountWithOpportunityToWin() {
    var ns = Sdk.Sample;
    return new Promise(function (resolve, reject) {
        var accountUri;
        var account = new ns.account();
        account.name = "Sample Account for WebAPIFunctionsAndActions sample";
        account.opportunity_customer_accounts = [
            new ns.opportunity({
                name: "Opportunity to win"
            })
        ];
        ns.create(account)
            .then(function (uri) {
                entitiesToDelete.push(uri);

                return ns.retrieveProperty(uri, "opportunity_customer_accounts/$ref")
            })
            .then(function (value) {
                resolve(value[0]["@odata.id"]); // Return the opportunity's uri.
            })
            .catch(function (err) {
                reject(new Error("Error in createAccountwithOpportunityToWin: " + err.message));
            });
    });
}