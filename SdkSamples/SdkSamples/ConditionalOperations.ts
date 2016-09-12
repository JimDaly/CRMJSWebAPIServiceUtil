
document.addEventListener("DOMContentLoaded", function (event) {


    conditionalOperationsSample();

});



function conditionalOperationsSample() {
    var ns = Sdk.Sample;
    var account = new ns.account();         // e.g.: Contoso Ltd (sample)
    var initialVersion;                 // The initial ETag value of the account created   
    var updatedVersion;                 // The ETag value of the account after it is updated 
    // Entity properties to select in a request.
    var contactProperties = ["fullname", "jobtitle", "annualincome"];
    var accountProperties = ["name", "telephone1", "revenue", "description"];
    var taskProperties = ["subject", "description"];

    console.log("-- Sample started --");

    account.name = "Contoso, Ltd";
    account.telephone1 = "555-0000"; // Phone number value will increment with each update attempt.
    account.revenue = 5000000;
    account.description = "Parent company of Contoso Pharmaceuticals, etc.";

    ns.createAndRetrieve(account, accountProperties, null, true)
        .then(function (entity) {
            account = new ns.account(entity);
            
            //Look at properties of the account data returned
            console.log(JSON.stringify(entity, null, 2));
            initialVersion = account.getVersion();


            // Conditional Get START.
            // Attempt to retrieve using conditional GET with current ETag value.
            // Expecting nothing in the response because entity was not modified.
            console.log("-- Conditional GET section started --");

            return ns.retrieve(
                account.getUri(),
                accountProperties,
                null,
                true,
                initialVersion
            );
        })
        .then(function (results) {
            if (results == null) {
                console.log("Expected results. No data returned because the entity hasn't changed.")
            }
            else {
                console.log("Not expected. No data should be returned.")
            }
            account.telephone1 = "555-0001";
            return ns.update(account)
        })
        .then(function () {
            console.log("Account telephone number updated.");

            // Re-attempt conditional GET with original ETag value.
            return ns.retrieve(
                account.getUri(),
                accountProperties,
                null,
                true,
                initialVersion
            );
        })
        .then(function (results) {
            if (results) {
                console.log("Instance retrieved using ETag: %s", initialVersion);
                //These results are just JSON
                console.log(JSON.stringify(results, null, 2));

            }
            else {
                console.log("Not expected.");
            }

            // Optimistic concurrency on delete and update START.
            console.log("-- Optimistic concurrency section started --");
            console.log("Attempt delete with old version:")
            return ns.deleteEntity(account.getUri(), initialVersion);
        })
        .then(function () {
            //This function should error
            console.log("Not expected.");
        })
        .catch(function (error) {
            //Error expected
            console.log("Expected error: ", error.message);

        })
        .then(function () {
            //account has not be re-initialized with results 
            // from the intial update
            account.telephone1 = "555-0002";
            account.revenue = 600000;
            console.log("Attempt update with old version:")
            return ns.update(account, true)
        })
        .then(function () {
            //This operation should error
            console.log("Not expected.");
        })
        .catch(function (err) {
            //Error expected
            console.log("Expected error: ", err.message);
        })
        .then(function (results) {
            return ns.retrieve(account.getUri(), accountProperties, null, true);
        })
        .then(function (results) {
            account = new ns.account(results);
            // Re-attempt update with new version
            account.telephone1 = "555-0003";
            account.revenue = 600000;
            console.log("Attempt update with new version:")
            return ns.update(account, true)
        })
        .then(function () {
            console.log("Account successfully updated using: %s", account.getVersion());

            return ns.retrieve(account.getUri(), accountProperties, null, true);
        })
        .then(function (results) {
            updatedVersion = results["@odata.etag"];
            console.log(JSON.stringify(results, null, 2));

            console.log("-- Controlling upsert operations section started --");


            account.telephone1 = "555-0004";
            account.revenue = 750000;
            console.log("Attempt upsert with preventUpdate enabled:")
            return ns.upsert(account, true)
        })
        .then(function () {
            //This operation should error
            console.log("Not expected.");
        })
        .catch(function (err) {
            //Error expected
            console.log("Expected error: ", err.message);
        })
        .then(function () {
            account.telephone1 = "555-0005";
            account.revenue = 750000;
            console.log("Attempt upsert with preventUpdate disabled:")
            return ns.upsert(account)
        })
        .then(function () {
            // Expected.
            console.log("Account updated using upsert");

            return ns.retrieve(account.getUri(), accountProperties, null, true);
        })
        .then(function (results) {
            updatedVersion = results["@odata.etag"];
            console.log(JSON.stringify(results, null, 2));

            return ns.deleteEntity(account.getUri(), updatedVersion);
        })
        .then(function () {
            console.log("Account was deleted");

            //attempt to update it
            account.telephone1 = "555-0006";
            account.revenue = 850000;
            console.log("Attempt update of deleted record")
           return ns.update(account)
                
        })
        .then(function () {
            //This operation should error
            console.log("Not expected.");
        })
        .catch(function (err) {
            //Error expected
            console.log("Expected error: ", err.message);
        })
        .catch(function (err) {
            console.log("ERROR: " + err.message);
        })


}

