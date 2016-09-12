document.addEventListener("DOMContentLoaded", function (event) {
 

    startQueryDataSample();

});

var entitiesToDelete = [];              // Entity URIs to be deleted later 
// (if user chooses to delete sample data).
var deleteData = true;                  // Controls whether sample data are deleted at the end of sample run.


function startQueryDataSample() {
    var ns = Sdk.Sample;
    var contact = new ns.contact();
    var account = new ns.account({
        "name": "Contoso, Ltd. (sample)",
        "primarycontactid": {
            "firstname": "Yvonne", "lastname": "McKay (sample)", "jobtitle": "Coffee Master",
            "annualincome": 45000, "Contact_Tasks": [
                { "subject": "Task 1", "description": "Task 1 description" },
                { "subject": "Task 2", "description": "Task 2 description" },
                { "subject": "Task 3", "description": "Task 3 description" }
            ]
        }, "Account_Tasks": [
            { "subject": "Task 1", "description": "Task 1 description" },
            { "subject": "Task 2", "description": "Task 2 description" },
            { "subject": "Task 3", "description": "Task 3 description" }
        ],
        "contact_customer_accounts": [
            {
                "firstname": "Susanna", "lastname": "Stubberod (sample)", "jobtitle": "Senior Purchaser",
                "annualincome": 52000, "Contact_Tasks": [
                    { "subject": "Task 1", "description": "Task 1 description" },
                    { "subject": "Task 2", "description": "Task 2 description" },
                    { "subject": "Task 3", "description": "Task 3 description" }
                ]
            },
            {
                "firstname": "Nancy", "lastname": "Anderson (sample)", "jobtitle": "Activities Manager",
                "annualincome": 55500, "Contact_Tasks": [
                    { "subject": "Task 1", "description": "Task 1 description" },
                    { "subject": "Task 2", "description": "Task 2 description" },
                    { "subject": "Task 3", "description": "Task 3 description" }
                ]
            },
            {
                "firstname": "Maria", "lastname": "Cambell (sample)", "jobtitle": "Accounts Manager",
                "annualincome": 31000, "Contact_Tasks": [
                    { "subject": "Task 1", "description": "Task 1 description" },
                    { "subject": "Task 2", "description": "Task 2 description" },
                    { "subject": "Task 3", "description": "Task 3 description" }
                ]
            },
            {
                "firstname": "Nancy", "lastname": "Anderson (sample)", "jobtitle": "Logistics Specialist",
                "annualincome": 63500, "Contact_Tasks": [
                    { "subject": "Task 1", "description": "Task 1 description" },
                    { "subject": "Task 2", "description": "Task 2 description" },
                    { "subject": "Task 3", "description": "Task 3 description" }
                ]
            },
            {
                "firstname": "Scott", "lastname": "Konersmann (sample)", "jobtitle": "Accounts Manager",
                "annualincome": 38000, "Contact_Tasks": [
                    { "subject": "Task 1", "description": "Task 1 description" },
                    { "subject": "Task 2", "description": "Task 2 description" },
                    { "subject": "Task 3", "description": "Task 3 description" }
                ]
            },
            {
                "firstname": "Robert", "lastname": "Lyon (sample)", "jobtitle": "Senior Technician",
                "annualincome": 78000, "Contact_Tasks": [
                    { "subject": "Task 1", "description": "Task 1 description" },
                    { "subject": "Task 2", "description": "Task 2 description" },
                    { "subject": "Task 3", "description": "Task 3 description" }
                ]
            },
            {
                "firstname": "Paul", "lastname": "Cannon (sample)", "jobtitle": "Ski Instructor",
                "annualincome": 68500, "Contact_Tasks": [
                    { "subject": "Task 1", "description": "Task 1 description" },
                    { "subject": "Task 2", "description": "Task 2 description" },
                    { "subject": "Task 3", "description": "Task 3 description" }
                ]
            },
            {
                "firstname": "Rene", "lastname": "Valdes (sample)", "jobtitle": "Data Analyst III",
                "annualincome": 86000, "Contact_Tasks": [
                    { "subject": "Task 1", "description": "Task 1 description" },
                    { "subject": "Task 2", "description": "Task 2 description" },
                    { "subject": "Task 3", "description": "Task 3 description" }
                ]
            },
            {
                "firstname": "Jim", "lastname": "Glynn (sample)", "jobtitle": "Senior International Sales Manager",
                "annualincome": 81400, "Contact_Tasks": [
                    { "subject": "Task 1", "description": "Task 1 description" },
                    { "subject": "Task 2", "description": "Task 2 description" },
                    { "subject": "Task 3", "description": "Task 3 description" }
                ]
            }
        ]
    });
    var contactProperties = ["fullname", "jobtitle", "annualincome", "createdon"];
    var accountProperties = ["name"];
    var taskProperties = ["subject", "description"];

    ns.create(account)
        .then(function (uri) {
            account.setIdFromUri(uri);
            entitiesToDelete.push(account.getUri());
            console.log("Account '%s' created with 1 primary contact and 9 associated contacts.", account.name);

            return ns.retrieve(
                account.getUri(),
                null,
                ["primarycontactid($select=" + contact.getColumnSet() + ")"],
                true
            );
        })
        .then(function (entity) {
            contact = new ns.contact(new ns.account(entity).primarycontactid);
            entitiesToDelete.unshift(contact.getUri()); // Contact must be deleted before account

            console.log("Has primary contact '%s' with URI: %s\n", contact.fullname, contact.getUri());

            console.log("-- Basic Query --");
            return ns.retrieve(
                contact.getUri(),
                contact.getColumnSet(),
                null,
                true
            );
        })
        .then(function (entity) {
            var contact = new ns.contact(entity);
            console.log("Contact basic info:\n\tFullname: '%s'\n\tJob Title: '%s'\n\tAnnual Income: '%s' (unformatted)",
                contact.fullname, contact.jobtitle, contact.annualincome);
            console.log("\tAnnualincome: %s (formatted)\n",
                contact.getFormattedValue("annualincome"));

            // Filter criteria:
            // Applying filters to get targeted data.
            // 1) Using standard query functions (e.g.: contains, endswith, startswith)
            // 2) Using CRM query functions (e.g.: LastXhours, Last7Days, Today, Between, In, ...)
            // 3) Using filter operators and logical operators (e.g.: eq, ne, gt, and, or, etc…)
            // 4) Set precedence using parenthesis (e.g.: ((criteria1) and (criteria2)) or (criteria3)
            // For more info, see: https://msdn.microsoft.com/en-us/library/gg334767.aspx#bkmk_filter
            console.log("-- Filter Criteria --");

            let filter = "&$filter=contains(fullname,'(sample)')";
            return ns.query(
                contact.entitySetName,
                "$select=" + contactProperties.join() + filter,
                true);

        })
        .then(function (results) {
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Contacts filtered by fullname containing '(sample)':",
                contactProperties
            );

            let filter = "&$filter=Microsoft.Dynamics.CRM.LastXHours(PropertyName='createdon',PropertyValue='1')";
            return ns.query(contact.entitySetName,
                "$select=" + contactProperties.join() + filter,
                true
            );
        })
        .then(function (results) {
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Contacts that were created within the last 1hr:",
                contactProperties
            );

            let filter = "&$filter=contains(fullname,'(sample)') and annualincome gt 55000";
            return ns.query(contact.entitySetName,
                "$select=" + contactProperties.join() + filter,
                true
            );

        })
        .then(function (results) {
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Contacts filtered by fullname and annualincome (<$55,000):",
                contactProperties
            );

            let filter = "&$filter=contains(fullname,'(sample)') " +
                "and (contains(jobtitle,'senior') or contains(jobtitle,'specialist')) and annualincome gt 55000";
            return ns.query(contact.entitySetName,
                "$select=" + contactProperties.join() + filter,
                true
            );

        })
        .then(function (results) {
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Contacts filtered by fullname, annualincome and jobtitle (Senior or Specialist):",
                contactProperties
            );

            console.log("\n-- Order Results --")
            let filter = "&$filter=contains(fullname,'(sample)') " +
                "&$orderby=jobtitle asc, annualincome desc";
            return ns.query(contact.entitySetName,
                "$select=" + contactProperties.join() + filter,
                true
            );

        })
        .then(function (results) {
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Contacts ordered by job title (Ascending) and annual income (Descending)",
                contactProperties
            );

            console.log("\n-- Parameterized Aliases --")
            let filter = "&$filter=contains(@p1,'(sample)') " +
                "&$orderby=@p2 asc, @p3 desc&@p1=fullname&@p2=jobtitle&@p3=annualincome";
            return ns.query(contact.entitySetName,
                "$select=" + contactProperties.join() + filter,
                true
            );

        })
        .then(function (results) {
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Contacts list using parameterized aliases:",
                contactProperties
            );

            console.log("\n-- Top Results --")
            let filter = "&$filter=contains(fullname,'(sample)')&$top=5";
            return ns.query(contact.entitySetName,
                "$select=" + contactProperties.join() + filter,
                true
            );

        })
        .then(function (results) {
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Contacts top 5 results:",
                contactProperties
            );

            console.log("\n-- Result Count --")

            return ns.query(contact.entitySetName + "/$count");

        })
        .then(function (results) {
            console.log("The contacts collection has %s contacts.", results.count);

            let filter = "&$filter=contains(jobtitle,'senior') or contains(jobtitle, 'manager')&$count=true";
            return ns.query(contact.entitySetName,
                "$select=" + contactProperties.join() + filter,
                true
            );

        })
        .then(function (results) {
            console.log("%s contacts have either 'Manager' or 'Senior' designation in their jobtitle.", results.count);
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Manager or Senior:",
                contactProperties
            );

            console.log("\n-- Pagination --");
            let filter = "&$filter=contains(fullname,'(sample)')&$count=true";
            return ns.query(contact.entitySetName,
                "$select=" + contactProperties.join() + filter,
                true,
                4
            );

        })
        .then(function (results) {
            let count = results.count;
            let maxPages = Math.ceil(count / 4);
            console.log(
                "Contacts total: %s \tContacts per page: %s.\tOutputting first 2 pages.",
                count,
                4
            );
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Page 1 of " + maxPages + ":",
                contactProperties
            );

            return ns.getNextPage(results.nextLink, true, 4);

        })
        .then(function (results) {
            let count = results.count;
            let maxPages = Math.ceil(count / 4);
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Page 2 of " + maxPages + ":",
                contactProperties
            );

            console.log("\n-- Expanding Results --");

            return ns.retrieve(
                account.getUri(),
                accountProperties,
                ["primarycontactid($select=" + contactProperties.join() + ")"],
                true
            );
        })
        .then(function (entity) {
            account = new ns.account(entity);
            contact = new ns.contact(account.primarycontactid);
            var str = "Account '%s' has the following primary contact person:\n\t" +
                "Fullname: '%s' \n\tJobtitle: '%s' \n\tAnnualincome: '%s'";
            console.log(str, account.name,
                contact.fullname,
                contact.jobtitle,
                contact.getFormattedValue("annualincome")
            );


            return ns.retrieve(
                contact.getUri(),
                contactProperties,
                ["account_primary_contact($select=" + accountProperties.join() + ")"],
                true
            );
        })
        .then(function (entity) {
            var contact = new ns.contact(entity);
            var label = "Contact '" + contact.fullname + "' is the primary contact for the following accounts:";
            output(
                contact.account_primary_contact.map(function (x) { return new ns.account(x) }),
                label,
                accountProperties
            );

            return ns.retrieve(
                account.getUri(),
                accountProperties,
                ["contact_customer_accounts($select=" + contactProperties + ")"],
                true
            );
        })
        .then(function (entity) {
            var account = new ns.account(entity);
            var label = "Account '" + account.name + "' has the following contact customers:";
            output(
                account.contact_customer_accounts.map(function (x) { return new ns.contact(x) }),
                label,
                contactProperties
            );

            console.log("\n-- Expanding multiple property types in one request -- ");
            var expansions = [
                "primarycontactid($select=" + contactProperties.join() + ")",
                "contact_customer_accounts($select=" + contactProperties.join() + ")",
                "Account_Tasks($select=" + taskProperties.join() + ")"
            ]
            return ns.retrieve(
                account.getUri(),
                accountProperties,
                expansions,
                true
            );
        })
        .then(function (entity) {
            var account = new ns.account(entity);

            var label = "Account '%s' has the following primary contact person:\n\t" +
                "Fullname: '%s' \n\tJobtitle: '%s' \n\tAnnualincome: '%s'";
            console.log(label, account.name,
                account.primarycontactid.fullname,
                account.primarycontactid.jobtitle,
                account.primarycontactid.annualincome);

            // Handling each collection separately.
            label = "Account '" + account.name + "' has the following related contacts:";
            var contactCollection = account.contact_customer_accounts.map(function (x) { return new ns.contact(x) });
            output(contactCollection, label, contactProperties);

            label = "Account '" + account.name + "' has the following tasks:";
            var taskCollection = account.Account_Tasks.map(function (x) { return new ns.task(x) });
            output(taskCollection, label, taskProperties);

            console.log("\n-- FetchXML -- ");
            var fetchXML = "<fetch mapping=\"logical\"> \
  <entity name=\"contact\"> \
    <attribute name=\"fullname\" /> \
    <attribute name=\"jobtitle\" /> \
    <attribute name=\"annualincome\" /> \
    <order descending=\"true\" attribute=\"fullname\" /> \
    <filter type=\"and\"> \
      <condition value=\"%(sample)%\" attribute=\"fullname\" operator=\"like\" /> \
    </filter> \
  </entity> \
</fetch> ";

            return ns.executeFetch(contact.entitySetName, fetchXML, true);
        })
        .then(function (results) {
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Contacts Fetched by fullname containing '(sample)':",
                contactProperties
            );

            let page = 3;
            let count = 4;
            var fetchXML = "<fetch mapping=\"logical\" page=\"" + page +"\" count=\""+count+"\"> \
  <entity name=\"contact\"> \
    <attribute name=\"fullname\" /> \
    <attribute name=\"jobtitle\" /> \
    <attribute name=\"annualincome\" /> \
    <order descending=\"true\" attribute=\"fullname\" /> \
    <filter type=\"and\"> \
      <condition value=\"%(sample)%\" attribute=\"fullname\" operator=\"like\" /> \
    </filter> \
  </entity> \
</fetch> ";

            return ns.executeFetch(
                contact.entitySetName,
                fetchXML,
                true);
        })
        .then(function (results) {
            output(
                results.value.map(function (x) { return new ns.contact(x) }),
                "Contacts Fetched by fullname containing '(sample)' - page 3:",
                contactProperties
            );

            console.log("\n-- Saved Query -- ");
            var filter = "&$filter=name eq 'Active Accounts'";
            var query = "$select=name,savedqueryid" + filter;
            return ns.query("savedqueries", query);
        })
        .then(function (results) {
            if (results.value.length > 0) {
                var savedQuery = new ns.savedquery(results.value[0]);

                return ns.query(account.entitySetName, "savedQuery=" + savedQuery.savedqueryid, true)
            }
            else {
                throw new Error("Active Accounts query not found");
            }           
        })
        .then(function (results) {
            output(
                results.value.map(function (x) { return new ns.account(x) }),
                "Saved Query (Active Accounts):",
                ["accountid", "name", "_primarycontactid_value"]);


            console.log("\n-- User Query -- ");
            var userQuery = new ns.userquery();
            userQuery.name = "My User query";
            //These userquery properties are not in the library
            userQuery.set("description", "User query to display contact info.");
            userQuery.set("querytype", 0);
            userQuery.set("returnedtypecode", "contact");
            let fetchXml = "<fetch mapping=\"logical\" output-format=\"xml-platform\" version=\"1.0\" distinct=\"false\"> \
  <entity name=\"contact\"> \
    <attribute name=\"fullname\" /> \
    <attribute name=\"contactid\" /> \
    <attribute name=\"jobtitle\" /> \
    <attribute name=\"annualincome\" /> \
    <attribute name=\"createdon\" /> \
    <order descending=\"false\" attribute=\"fullname\" /> \
    <filter type=\"and\"> \
      <condition value=\"%(sample)%\" attribute=\"fullname\" operator=\"like\" /> \
      <condition value=\"%Manager%\" attribute=\"jobtitle\" operator=\"like\" /> \
      <condition value=\"55000\" attribute=\"annualincome\" operator=\"gt\" /> \
    </filter> \
  </entity> \
</fetch>";
            userQuery.set("fetchxml", fetchXml);

            return ns.create(userQuery)

        })
        .then(function (uri) {
            entitiesToDelete.push(uri);
            let userquery = new ns.userquery(uri);

            return ns.query(
                contact.entitySetName,
                "userQuery=" +
                userquery.getId(),
                true);           
        })
        .then(function (results) {

            output(results.value.map(function (x) { return new ns.contact(x) }),
                "Saved User Query:",
                contactProperties);
        })
        .catch(function (err) {
            console.log("ERROR: " + err.message);
        })
        //Always do this
        .then(function () {

            if (deleteData) {
                console.log("\n-- Deleting created entities -- ");
                entitiesToDelete.forEach(function (uri, i) {

                    //Spacing out the deletion operations by 200 ms to avoid Generic SQL error
                    setTimeout(function (uri) {
                        ns.deleteEntity(uri)
                            .then(function () {
                                console.log("entity deleted at: %s", uri);
                            })
                            .catch(function (err) {
                                console.log("Error deleting entity at: %s \n\t Reason: %s", uri, err.message);
                            })
                    }, i * 200, uri);

                });
            }
            else {
                console.log("Sample data not deleted.");
            }


        })
}

/**
 * @function output
 * @description Generic helper function to output data to console.
 * @param  collection - Array of entities.
 * @param {string} label - Text label for what the collection contains.
 * @param {array} properties - Array of properties appropriate for the collection.
 */
function output(collection: Array<Sdk.Sample.crmbaseentity>, label: string, properties: Array<string>) {
    console.log(label);
    console.log("	   " + properties.join("  | "));
    collection.forEach(function (entity, i) {
        var prop = [];
        properties.forEach(function (p) {
            prop.push((entity.getFormattedValue(p) ? entity.getFormattedValue(p) : entity[p])); // Get formatted value if one exists for this property.
        })
        console.log("\t%s) %s", i + 1, prop.join(", "));
    });
}