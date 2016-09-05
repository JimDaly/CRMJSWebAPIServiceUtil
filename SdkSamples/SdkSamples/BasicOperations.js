document.addEventListener("DOMContentLoaded", function (event) {
    basicOperationsSample();
});
var entitiesToDelete = []; // Entity URIs to be deleted later 
// (if user chooses to delete sample data).
var deleteData = true; // Controls whether sample data are deleted at the end of sample run.
function basicOperationsSample() {
    var ns = Sdk.Sample;
    entitiesToDelete = []; // Reset the array.
    var contact1 = new ns.contact(); //Peter Cambel
    var contact2 = new ns.contact(); //Susie Curtis
    var account1 = new ns.account(); //Contoso, Ltd.
    var account2 = new ns.account(); //Fourth Coffee
    var opportunity = new ns.opportunity(); //River rafting adventure
    var competitor = new ns.competitor(); //Adventure Works
    console.log("--Section 1 started--");
    contact1.firstname = "Peter";
    contact1.lastname = "Cambel";
    ns.create(contact1)
        .then(function (uri) {
        entitiesToDelete.push(uri);
        console.log("Contact 'Peter Cambel' created with URI: %s", uri);
        contact1 = new ns.contact(uri); //URI to constructor
        contact1.annualincome = 80000.00;
        contact1.jobtitle = "Junior Developer";
        return ns.update(contact1);
    })
        .then(function () {
        console.log("Contact 'Peter Cambel' updated with job title and annual income.");
        return ns.retrieve(contact1.getUri(), contact1.getColumnSet(), null, true);
    })
        .then(function (response) {
        contact1 = new ns.contact(response); //JSON to constructor
        console.log("Contact '%s' retrieved:\n"
            + "\tAnnual income: %s \n"
            + "\tJob title: %s \n"
            + "\tDescription: %s", contact1.fullname, // This property is read-only. Calculated from firstname and lastname.
        contact1.getFormattedValue("annualincome"), contact1.jobtitle, contact1.description // Description will be "null" because it has not been set yet.
        );
        contact1.resetChangeTracking(); //Necessary since contact1 constructor was JSON.
        contact1.jobtitle = "Senior Developer";
        contact1.annualincome = 95000.00;
        contact1.description = "Assignment to-be-determined. ";
        return ns.update(contact1);
    })
        .then(function () {
        return ns.retrieveTypedEntity(contact1.getUri(), contact1.getColumnSet(), null, true);
    })
        .then(function (response) {
        contact1 = response; //Need to tell TypeScript that this is a specific type.
        console.log("Contact '%s' updated:\n"
            + "\tJob title: %s \n"
            + "\tAnnual income: %s \n"
            + "\tDescription: %s", contact1.fullname, contact1.jobtitle, contact1.getFormattedValue("annualincome"), contact1.description);
        //No need to use contact1.resetChangeTracking b/c that was done by retrieveTypedEntity
        contact1.telephone1 = "555-0105"; //No update property method
        return ns.update(contact1);
    })
        .then(function () {
        return ns.retrieveProperty(contact1.getUri(), "telephone1");
    })
        .then(function (value) {
        console.log("Contact's phone number is: %s", value);
        console.log("\n--Section 2 started--");
        account1 = new ns.account();
        account1.name = "Contoso, Ltd.";
        account1.telephone1 = "555-5555";
        account1.primarycontactidUri(contact1.getUri()); //Associate to existing contact
        return ns.createAndRetrieveTypedEntity(account1, account1.getColumnSet());
    })
        .then(function (entity) {
        account1 = entity;
        entitiesToDelete.push(account1.getUri());
        console.log("Account %s created.", account1.name);
        return ns.retrieve(account1.getUri(), ["name", "telephone1"], ["primarycontactid($select=" + contact1.getColumnSet() + ")"], true);
    })
        .then(function (entity) {
        account1 = new ns.account(entity);
        contact1 = new ns.contact(account1.primarycontactid);
        console.log("Account '%s' has primary contact '%s':  \n"
            + "\tJob title:  %s \n"
            + "\tAnnual income:  %s ", account1.name, contact1.fullname, contact1.jobtitle, contact1.getFormattedValue(contact1.properties.annualincome.name) //Could also just use "annualincome"
        );
        console.log("\n--Section 3 started--");
        account2.name = "Fourth Coffee";
        account2.primarycontactid = contact2;
        contact2.firstname = "Susie";
        contact2.lastname = "Curtis";
        contact2.jobtitle = "Coffee Master";
        contact2.annualincome = 48000.00;
        contact2.Contact_Tasks = [
            new ns.task({
                subject: "Sign invoice",
                description: "Invoice #12321",
                scheduledend: new Date("April 19th, 2017")
            }),
            new ns.task({
                subject: "Setup new display",
                description: "Theme is - Spring is in the air",
                scheduledstart: new Date("4/21/2017")
            }),
            new ns.task({
                subject: "Conduct training",
                description: "Train team on making our new blended coffee",
                scheduledstart: new Date("6/1/2017")
            })
        ];
        return ns.createAndRetrieveTypedEntity(account2, account2.getColumnSet(), ["primarycontactid($select=" + contact2.getColumnSet() + ")"], true);
    })
        .then(function (entity) {
        account2 = entity;
        entitiesToDelete.push(account2.getUri());
        contact2 = new ns.contact(account2.primarycontactid);
        entitiesToDelete.push(contact2.getUri());
        console.log("Account '%s' has primary contact '%s':\n"
            + "\tJob title:  %s \n"
            + "\tAnnual income:  %s", account2.name, contact2.fullname, contact2.jobtitle, contact2.getFormattedValue("annualincome"));
        return ns.retrieve(contact2.getUri(), contact2.getColumnSet(), ["Contact_Tasks($select=" + new ns.task().getColumnSet() + ")"], true);
    })
        .then(function (entity) {
        contact2 = new ns.contact(entity);
        console.log("Contact '%s' has the following assigned tasks:", contact2.fullname);
        contact2.Contact_Tasks.forEach(function (t) {
            var task = new ns.task(t);
            console.log("Subject: %s \n"
                + "\tDescription: %s \n"
                + "\tStart: %s \n"
                + "\tEnd: %s \n", task.subject, task.description, task.getFormattedValue("scheduledstart"), //Bug: These 'formatted' values are the same as the raw values
            task.getFormattedValue("scheduledend"));
        });
        console.log("\n--Section 4 started--");
        // Associate Peter Cambel to Fourth Coffee using the account.contact_customer_accounts relationship
        // This is the same as associating Fourth Coffee to Peter Cambel using the contact.parentcustomerid_account relationship
        return ns.addToCollection(account2.getUri(), //Fourth Coffee
        account2.collections.contact_customer_accounts.name, contact1.getUri()); //Peter Cambel
    })
        .then(function () {
        console.log("Contact '%s' associated to account '%s'.", contact1.fullname, account2.name);
        //Get collection of contacts related to account2
        return ns.retrieve(account2.getUri(), ["name"], ["contact_customer_accounts($select=" + contact2.getColumnSet().join() + ")"], true);
    })
        .then(function (results) {
        account2 = new ns.account(results);
        console.log("Contact list for account '%s': ", account2.name);
        account2.contact_customer_accounts.forEach(function (c) {
            var contact = new ns.contact(c);
            console.log("\tName: %s, "
                + "Job title: %s ", contact.fullname, contact.jobtitle);
        });
        return ns.disassociate(account2.getUri(), "contact_customer_accounts", contact1.getUri());
    })
        .then(function () {
        console.log("Contact '%s' disassociated from account '%s'.", contact1.fullname, account2.name);
        competitor.name = "Adventure Works";
        competitor.strengths = "Strong promoter of private tours for multi-day outdoor adventures.";
        return ns.create(competitor);
    })
        .then(function (uri) {
        competitor.setIdFromUri(uri);
        entitiesToDelete.push(competitor.getUri());
        console.log("Competitor '%s' created.", competitor.name);
        opportunity.name = "River rafting adventure";
        opportunity.description = "Sales team on a river-rafting offsite and team building.";
        return ns.create(opportunity);
    })
        .then(function (uri) {
        opportunity.setIdFromUri(uri);
        entitiesToDelete.push(opportunity.getUri());
        console.log("Opportunity  '%s' created.", opportunity.name);
        return ns.addToCollection(opportunity.getUri(), "opportunitycompetitors_association", competitor.getUri());
    })
        .then(function () {
        console.log("Opportunity '%s' associated with competitor '%s'.", opportunity.name, competitor.name);
        return ns.retrieve(competitor.getUri(), competitor.getColumnSet(), ["opportunitycompetitors_association($select=" + opportunity.getColumnSet() + ")"], true);
    })
        .then(function (entity) {
        competitor = new ns.competitor(entity);
        console.log("Competitor '%s' has the following opportunities:", competitor.name);
        competitor.opportunitycompetitors_association.forEach(function (o) {
            var opp = new ns.opportunity(o);
            console.log("\tName: %s, \n"
                + "\tDescription: %s", opp.name, opp.description);
        });
        return ns.disassociate(opportunity.getUri(), opportunity.collections.opportunitycompetitors_association.name, competitor.getUri());
    })
        .then(function () {
        console.log("Opportunity '%s' disassociated with competitor '%s'", opportunity.name, competitor.name);
    })
        .catch(function (err) {
        console.log("ERROR: " + err.message);
    })
        .then(function () {
        //always do this
        console.log("\n--Section 5 started--");
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
                    });
                }, i * 100, uri);
            });
        }
    });
}
//# sourceMappingURL=BasicOperations.js.map