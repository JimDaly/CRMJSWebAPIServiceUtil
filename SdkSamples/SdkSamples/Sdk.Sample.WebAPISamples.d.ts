


declare namespace Sdk.Sample {

    //ADAL Support START
    // This library is not configured to support ADAL
    //ADAL Support END

    interface propertyType {
        readonly name: string;
        readonly type: string;
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
    interface activitypointerProperties {
    readonly activityid: propertyType;
    readonly actualdurationminutes: propertyType;
    readonly description: propertyType;
    readonly scheduledend: propertyType;
    readonly scheduledstart: propertyType;
    readonly subject: propertyType;
}
interface activitypointerLookups {
    readonly regardingobjectid_account: propertyType;
    readonly regardingobjectid_contact: propertyType;
    readonly regardingobjectid_incident: propertyType;
    readonly regardingobjectid_opportunity: propertyType;
}
interface activitypointerCollections {
    readonly activity_pointer_letter: propertyType;
    readonly activity_pointer_opportunity_close: propertyType;
    readonly activity_pointer_task: propertyType;
    readonly ActivityPointer_QueueItem: propertyType;
}
interface contactProperties {
    readonly annualincome: propertyType;
    readonly contactid: propertyType;
    readonly createdon: propertyType;
    readonly description: propertyType;
    readonly firstname: propertyType;
    readonly fullname: propertyType;
    readonly jobtitle: propertyType;
    readonly lastname: propertyType;
    readonly telephone1: propertyType;
}
interface contactLookups {
    readonly masterid: propertyType;
    readonly parentcustomerid_account: propertyType;
    readonly parentcustomerid_contact: propertyType;
}
interface contactCollections {
    readonly account_primary_contact: propertyType;
    readonly Contact_ActivityPointers: propertyType;
    readonly Contact_Annotation: propertyType;
    readonly contact_as_primary_contact: propertyType;
    readonly contact_as_responsible_contact: propertyType;
    readonly contact_customer_contacts: propertyType;
    readonly Contact_Letters: propertyType;
    readonly contact_master_contact: propertyType;
    readonly Contact_Tasks: propertyType;
    readonly incident_customer_contacts: propertyType;
    readonly opportunity_customer_contacts: propertyType;
    readonly opportunity_parent_contact: propertyType;
}
interface accountProperties {
    readonly accountid: propertyType;
    readonly description: propertyType;
    readonly name: propertyType;
    readonly revenue: propertyType;
    readonly telephone1: propertyType;
}
interface accountLookups {
    readonly masterid: propertyType;
    readonly parentaccountid: propertyType;
    readonly primarycontactid: propertyType;
}
interface accountCollections {
    readonly Account_ActivityPointers: propertyType;
    readonly Account_Annotation: propertyType;
    readonly Account_Letters: propertyType;
    readonly account_master_account: propertyType;
    readonly account_parent_account: propertyType;
    readonly Account_Tasks: propertyType;
    readonly contact_customer_accounts: propertyType;
    readonly incident_customer_accounts: propertyType;
    readonly opportunity_customer_accounts: propertyType;
    readonly opportunity_parent_account: propertyType;
}
interface taskProperties {
    readonly activityid: propertyType;
    readonly actualdurationminutes: propertyType;
    readonly description: propertyType;
    readonly scheduledend: propertyType;
    readonly scheduledstart: propertyType;
    readonly subject: propertyType;
}
interface taskLookups {
    readonly activityid_activitypointer: propertyType;
    readonly regardingobjectid_account_task: propertyType;
    readonly regardingobjectid_contact_task: propertyType;
    readonly regardingobjectid_incident_task: propertyType;
    readonly regardingobjectid_opportunity_task: propertyType;
    readonly regardingobjectid_account: propertyType;
    readonly regardingobjectid_contact: propertyType;
    readonly regardingobjectid_incident: propertyType;
    readonly regardingobjectid_opportunity: propertyType;
}
interface taskCollections {
    readonly Task_Annotation: propertyType;
    readonly Task_QueueItem: propertyType;
    readonly activity_pointer_letter: propertyType;
    readonly activity_pointer_opportunity_close: propertyType;
    readonly activity_pointer_task: propertyType;
    readonly ActivityPointer_QueueItem: propertyType;
}
interface competitorProperties {
    readonly competitorid: propertyType;
    readonly name: propertyType;
    readonly strengths: propertyType;
}
interface competitorCollections {
    readonly Competitor_Annotation: propertyType;
    readonly competitor_opportunity_activities: propertyType;
    readonly opportunitycompetitors_association: propertyType;
}
interface opportunityProperties {
    readonly description: propertyType;
    readonly name: propertyType;
    readonly opportunityid: propertyType;
}
interface opportunityLookups {
    readonly customerid_account: propertyType;
    readonly customerid_contact: propertyType;
    readonly parentaccountid: propertyType;
    readonly parentcontactid: propertyType;
}
interface opportunityCollections {
    readonly Opportunity_ActivityPointers: propertyType;
    readonly Opportunity_Annotation: propertyType;
    readonly Opportunity_Letters: propertyType;
    readonly Opportunity_OpportunityClose: propertyType;
    readonly Opportunity_Tasks: propertyType;
    readonly opportunitycompetitors_association: propertyType;
}
interface savedqueryProperties {
    readonly name: propertyType;
    readonly savedqueryid: propertyType;
}
interface userqueryProperties {
    readonly name: propertyType;
    readonly userqueryid: propertyType;
}
interface letterProperties {
    readonly activityid: propertyType;
    readonly actualdurationminutes: propertyType;
    readonly description: propertyType;
    readonly scheduledend: propertyType;
    readonly scheduledstart: propertyType;
    readonly subject: propertyType;
}
interface letterLookups {
    readonly activityid_activitypointer: propertyType;
    readonly regardingobjectid_account_letter: propertyType;
    readonly regardingobjectid_contact_letter: propertyType;
    readonly regardingobjectid_incident_letter: propertyType;
    readonly regardingobjectid_opportunity_letter: propertyType;
    readonly regardingobjectid_account: propertyType;
    readonly regardingobjectid_contact: propertyType;
    readonly regardingobjectid_incident: propertyType;
    readonly regardingobjectid_opportunity: propertyType;
}
interface letterCollections {
    readonly Letter_Annotation: propertyType;
    readonly Letter_QueueItem: propertyType;
    readonly activity_pointer_letter: propertyType;
    readonly activity_pointer_opportunity_close: propertyType;
    readonly activity_pointer_task: propertyType;
    readonly ActivityPointer_QueueItem: propertyType;
}
interface opportunitycloseProperties {
    readonly activityid: propertyType;
    readonly actualdurationminutes: propertyType;
    readonly description: propertyType;
    readonly scheduledend: propertyType;
    readonly scheduledstart: propertyType;
    readonly subject: propertyType;
}
interface opportunitycloseLookups {
    readonly activityid_activitypointer: propertyType;
    readonly competitorid: propertyType;
    readonly opportunityid: propertyType;
    readonly regardingobjectid_account: propertyType;
    readonly regardingobjectid_contact: propertyType;
    readonly regardingobjectid_incident: propertyType;
    readonly regardingobjectid_opportunity: propertyType;
}
interface opportunitycloseCollections {
    readonly OpportunityClose_Annotation: propertyType;
    readonly activity_pointer_letter: propertyType;
    readonly activity_pointer_opportunity_close: propertyType;
    readonly activity_pointer_task: propertyType;
    readonly ActivityPointer_QueueItem: propertyType;
}
interface queueProperties {
    readonly queueid: propertyType;
}
interface queueCollections {
    readonly queue_entries: propertyType;
}
interface queueitemProperties {
    readonly queueitemid: propertyType;
}
interface queueitemLookups {
    readonly objectid_activitypointer: propertyType;
    readonly objectid_incident: propertyType;
    readonly objectid_letter: propertyType;
    readonly objectid_task: propertyType;
    readonly queueid: propertyType;
}
interface annotationProperties {
    readonly annotationid: propertyType;
}
interface annotationLookups {
    readonly objectid_account: propertyType;
    readonly objectid_competitor: propertyType;
    readonly objectid_contact: propertyType;
    readonly objectid_incident: propertyType;
    readonly objectid_letter: propertyType;
    readonly objectid_opportunity: propertyType;
    readonly objectid_opportunityclose: propertyType;
    readonly objectid_task: propertyType;
}
interface incidentProperties {
    readonly incidentid: propertyType;
}
interface incidentLookups {
    readonly customerid_account: propertyType;
    readonly customerid_contact: propertyType;
    readonly existingcase: propertyType;
    readonly masterid: propertyType;
    readonly parentcaseid: propertyType;
    readonly primarycontactid: propertyType;
    readonly responsiblecontactid: propertyType;
}
interface incidentCollections {
    readonly Incident_ActivityPointers: propertyType;
    readonly Incident_Annotation: propertyType;
    readonly incident_existingcase: propertyType;
    readonly Incident_Letters: propertyType;
    readonly incident_master_incident: propertyType;
    readonly incident_parent_incident: propertyType;
    readonly Incident_QueueItem: propertyType;
    readonly Incident_Tasks: propertyType;
}

    //Metadata property interfaces END

    interface crmbaseentity {
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
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
    
/**
Task performed, or to be performed, by a user. An activity is any action for which an entry can be made on a calendar.
*/
    class activitypointer implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param activitypointerReference
         */
        constructor(activitypointerReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: activitypointerProperties;
        readonly lookups: activitypointerLookups;
        readonly collections: activitypointerCollections;
        /**
        Unique identifier of the activity.
        */
        activityid: string;
        /**
        Actual duration of the activity in minutes.
        */
        actualdurationminutes: number;
        /**
        Description of the activity.
        */
        description: string;
        /**
        Scheduled end time of the activity.
        */
        scheduledend: Date;
        /**
        Scheduled start time of the activity.
        */
        scheduledstart: Date;
        /**
        Subject associated with the activity.
        */
        subject: string;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        regardingobjectid_account: account;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        regardingobjectid_contact: contact;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.incident
        */
        regardingobjectid_incident: incident;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.opportunity
        */
        regardingobjectid_opportunity: opportunity;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "regardingobjectid_account@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "regardingobjectid_contact@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.incident.
        */
        "regardingobjectid_incident@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.opportunity.
        */
        "regardingobjectid_opportunity@odata.bind": string;
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        regardingobjectid_accountUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        regardingobjectid_contactUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.incident.
        */
        regardingobjectid_incidentUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.opportunity.
        */
        regardingobjectid_opportunityUri(uri:string);
        /**
        A collection of related Sdk.Sample.letter
        */
        activity_pointer_letter: Array<Sdk.Sample.letter>;
        /**
        A collection of related Sdk.Sample.opportunityclose
        */
        activity_pointer_opportunity_close: Array<Sdk.Sample.opportunityclose>;
        /**
        A collection of related Sdk.Sample.task
        */
        activity_pointer_task: Array<Sdk.Sample.task>;
        /**
        A collection of related Sdk.Sample.queueitem
        */
        ActivityPointer_QueueItem: Array<Sdk.Sample.queueitem>;
    }

/**
Person with whom a business unit has a relationship, such as customer, supplier, and colleague.
*/
    class contact implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param contactReference
         */
        constructor(contactReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: contactProperties;
        readonly lookups: contactLookups;
        readonly collections: contactCollections;
        /**
        Type the contact's annual income for use in profiling and financial analysis.
        */
        annualincome: number;
        /**
        Unique identifier of the contact.
        */
        contactid: string;
        /**
        Shows the date and time when the record was created. The date and time are displayed in the time zone selected in Microsoft Dynamics CRM options.
        */
        readonly createdon: Date;
        /**
        Type additional information to describe the contact, such as an excerpt from the company's website.
        */
        description: string;
        /**
        Type the contact's first name to make sure the contact is addressed correctly in sales calls, email, and marketing campaigns.
        */
        firstname: string;
        /**
        Combines and shows the contact's first and last names so that the full name can be displayed in views and reports.
        */
        readonly fullname: string;
        /**
        Type the job title of the contact to make sure the contact is addressed correctly in sales calls, email, and marketing campaigns.
        */
        jobtitle: string;
        /**
        Type the contact's last name to make sure the contact is addressed correctly in sales calls, email, and marketing campaigns.
        */
        lastname: string;
        /**
        Type the main phone number for this contact.
        */
        telephone1: string;
        /**
        Read only: Unique identifier of the master contact for merge.
        */
        readonly masterid: contact;
        /**
        Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        parentcustomerid_account: account;
        /**
        Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        parentcustomerid_contact: contact;
        /**
        Set Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "parentcustomerid_account@odata.bind": string;
        /**
        Set Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "parentcustomerid_contact@odata.bind": string;
        /**
        Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        parentcustomerid_accountUri(uri:string);
        /**
        Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        parentcustomerid_contactUri(uri:string);
        /**
        A collection of related Sdk.Sample.account
        */
        account_primary_contact: Array<Sdk.Sample.account>;
        /**
        A collection of related Sdk.Sample.activitypointer
        */
        Contact_ActivityPointers: Array<Sdk.Sample.activitypointer>;
        /**
        A collection of related Sdk.Sample.annotation
        */
        Contact_Annotation: Array<Sdk.Sample.annotation>;
        /**
        A collection of related Sdk.Sample.incident
        */
        contact_as_primary_contact: Array<Sdk.Sample.incident>;
        /**
        A collection of related Sdk.Sample.incident
        */
        contact_as_responsible_contact: Array<Sdk.Sample.incident>;
        /**
        A collection of related Sdk.Sample.contact
        */
        contact_customer_contacts: Array<Sdk.Sample.contact>;
        /**
        A collection of related Sdk.Sample.letter
        */
        Contact_Letters: Array<Sdk.Sample.letter>;
        /**
        A collection of related Sdk.Sample.contact
        */
        contact_master_contact: Array<Sdk.Sample.contact>;
        /**
        A collection of related Sdk.Sample.task
        */
        Contact_Tasks: Array<Sdk.Sample.task>;
        /**
        A collection of related Sdk.Sample.incident
        */
        incident_customer_contacts: Array<Sdk.Sample.incident>;
        /**
        A collection of related Sdk.Sample.opportunity
        */
        opportunity_customer_contacts: Array<Sdk.Sample.opportunity>;
        /**
        A collection of related Sdk.Sample.opportunity
        */
        opportunity_parent_contact: Array<Sdk.Sample.opportunity>;
    }

/**
Business that represents a customer or potential customer. The company that is billed in business transactions.
*/
    class account implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param accountReference
         */
        constructor(accountReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: accountProperties;
        readonly lookups: accountLookups;
        readonly collections: accountCollections;
        /**
        Unique identifier of the account.
        */
        accountid: string;
        /**
        Type additional information to describe the account, such as an excerpt from the company's website.
        */
        description: string;
        /**
        Type the company or business name.
        */
        name: string;
        /**
        Type the annual revenue for the account, used as an indicator in financial performance analysis.
        */
        revenue: number;
        /**
        Type the main phone number for this account.
        */
        telephone1: string;
        /**
        Read only: Shows the master account that the account was merged with.
        */
        readonly masterid: account;
        /**
        Choose the parent account associated with this account to show parent and child businesses in reporting and analytics.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        parentaccountid: account;
        /**
        Choose the primary contact for the account to provide quick access to contact details.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        primarycontactid: contact;
        /**
        Set Choose the parent account associated with this account to show parent and child businesses in reporting and analytics.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "parentaccountid@odata.bind": string;
        /**
        Set Choose the primary contact for the account to provide quick access to contact details.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "primarycontactid@odata.bind": string;
        /**
        Choose the parent account associated with this account to show parent and child businesses in reporting and analytics.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        parentaccountidUri(uri:string);
        /**
        Choose the primary contact for the account to provide quick access to contact details.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        primarycontactidUri(uri:string);
        /**
        A collection of related Sdk.Sample.activitypointer
        */
        Account_ActivityPointers: Array<Sdk.Sample.activitypointer>;
        /**
        A collection of related Sdk.Sample.annotation
        */
        Account_Annotation: Array<Sdk.Sample.annotation>;
        /**
        A collection of related Sdk.Sample.letter
        */
        Account_Letters: Array<Sdk.Sample.letter>;
        /**
        A collection of related Sdk.Sample.account
        */
        account_master_account: Array<Sdk.Sample.account>;
        /**
        A collection of related Sdk.Sample.account
        */
        account_parent_account: Array<Sdk.Sample.account>;
        /**
        A collection of related Sdk.Sample.task
        */
        Account_Tasks: Array<Sdk.Sample.task>;
        /**
        A collection of related Sdk.Sample.contact
        */
        contact_customer_accounts: Array<Sdk.Sample.contact>;
        /**
        A collection of related Sdk.Sample.incident
        */
        incident_customer_accounts: Array<Sdk.Sample.incident>;
        /**
        A collection of related Sdk.Sample.opportunity
        */
        opportunity_customer_accounts: Array<Sdk.Sample.opportunity>;
        /**
        A collection of related Sdk.Sample.opportunity
        */
        opportunity_parent_account: Array<Sdk.Sample.opportunity>;
    }

/**
Generic activity representing work needed to be done.
*/
    class task implements activitypointer {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param taskReference
         */
        constructor(taskReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: taskProperties;
        readonly lookups: taskLookups;
        readonly collections: taskCollections;
        /**
        Unique identifier of the task.
        This property can only be set on create to create a new related Sdk.Sample.activitypointer
        */
        activityid_activitypointer: activitypointer;
        /**
        Choose the record that the task relates to.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        regardingobjectid_account_task: account;
        /**
        Choose the record that the task relates to.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        regardingobjectid_contact_task: contact;
        /**
        Choose the record that the task relates to.
        This property can only be set on create to create a new related Sdk.Sample.incident
        */
        regardingobjectid_incident_task: incident;
        /**
        Choose the record that the task relates to.
        This property can only be set on create to create a new related Sdk.Sample.opportunity
        */
        regardingobjectid_opportunity_task: opportunity;
        /**
        Set Unique identifier of the task.
        Value must be a URI to an existing Sdk.Sample.activitypointer.
        */
        "activityid_activitypointer@odata.bind": string;
        /**
        Set Choose the record that the task relates to.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "regardingobjectid_account_task@odata.bind": string;
        /**
        Set Choose the record that the task relates to.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "regardingobjectid_contact_task@odata.bind": string;
        /**
        Set Choose the record that the task relates to.
        Value must be a URI to an existing Sdk.Sample.incident.
        */
        "regardingobjectid_incident_task@odata.bind": string;
        /**
        Set Choose the record that the task relates to.
        Value must be a URI to an existing Sdk.Sample.opportunity.
        */
        "regardingobjectid_opportunity_task@odata.bind": string;
        /**
        Unique identifier of the task.
         * @param uri The uri to an existing Sdk.Sample.activitypointer.
        */
        activityid_activitypointerUri(uri:string);
        /**
        Choose the record that the task relates to.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        regardingobjectid_account_taskUri(uri:string);
        /**
        Choose the record that the task relates to.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        regardingobjectid_contact_taskUri(uri:string);
        /**
        Choose the record that the task relates to.
         * @param uri The uri to an existing Sdk.Sample.incident.
        */
        regardingobjectid_incident_taskUri(uri:string);
        /**
        Choose the record that the task relates to.
         * @param uri The uri to an existing Sdk.Sample.opportunity.
        */
        regardingobjectid_opportunity_taskUri(uri:string);
        /**
        A collection of related Sdk.Sample.annotation
        */
        Task_Annotation: Array<Sdk.Sample.annotation>;
        /**
        A collection of related Sdk.Sample.queueitem
        */
        Task_QueueItem: Array<Sdk.Sample.queueitem>;
        /**
        Unique identifier of the activity.
        */
        activityid: string;
        /**
        Actual duration of the activity in minutes.
        */
        actualdurationminutes: number;
        /**
        Description of the activity.
        */
        description: string;
        /**
        Scheduled end time of the activity.
        */
        scheduledend: Date;
        /**
        Scheduled start time of the activity.
        */
        scheduledstart: Date;
        /**
        Subject associated with the activity.
        */
        subject: string;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        regardingobjectid_account: account;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        regardingobjectid_contact: contact;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.incident
        */
        regardingobjectid_incident: incident;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.opportunity
        */
        regardingobjectid_opportunity: opportunity;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "regardingobjectid_account@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "regardingobjectid_contact@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.incident.
        */
        "regardingobjectid_incident@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.opportunity.
        */
        "regardingobjectid_opportunity@odata.bind": string;
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        regardingobjectid_accountUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        regardingobjectid_contactUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.incident.
        */
        regardingobjectid_incidentUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.opportunity.
        */
        regardingobjectid_opportunityUri(uri:string);
        /**
        A collection of related Sdk.Sample.letter
        */
        activity_pointer_letter: Array<Sdk.Sample.letter>;
        /**
        A collection of related Sdk.Sample.opportunityclose
        */
        activity_pointer_opportunity_close: Array<Sdk.Sample.opportunityclose>;
        /**
        A collection of related Sdk.Sample.task
        */
        activity_pointer_task: Array<Sdk.Sample.task>;
        /**
        A collection of related Sdk.Sample.queueitem
        */
        ActivityPointer_QueueItem: Array<Sdk.Sample.queueitem>;
    }

/**
Business competing for the sale represented by a lead or opportunity.
*/
    class competitor implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param competitorReference
         */
        constructor(competitorReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: competitorProperties;
        readonly lookups: {};
        readonly collections: competitorCollections;
        /**
        Unique identifier of the competitor.
        */
        competitorid: string;
        /**
        Type the company or business name used to identify the competitor in data views and related records.
        */
        name: string;
        /**
        Type notes or other information about the competitor's strengths, such as top-selling products and targeted industries or markets.
        */
        strengths: string;
        /**
        A collection of related Sdk.Sample.annotation
        */
        Competitor_Annotation: Array<Sdk.Sample.annotation>;
        /**
        A collection of related Sdk.Sample.opportunityclose
        */
        competitor_opportunity_activities: Array<Sdk.Sample.opportunityclose>;
        /**
        A collection of related Sdk.Sample.opportunity
        */
        opportunitycompetitors_association: Array<Sdk.Sample.opportunity>;
    }

/**
Potential revenue-generating event, or sale to an account, which needs to be tracked through a sales process to completion.
*/
    class opportunity implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param opportunityReference
         */
        constructor(opportunityReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: opportunityProperties;
        readonly lookups: opportunityLookups;
        readonly collections: opportunityCollections;
        /**
        Type additional information to describe the opportunity, such as possible products to sell or past purchases from the customer.
        */
        description: string;
        /**
        Type a subject or descriptive name, such as the expected order or company name, for the opportunity.
        */
        name: string;
        /**
        Unique identifier of the opportunity.
        */
        opportunityid: string;
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as address, phone number, activities, and orders.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        customerid_account: account;
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as address, phone number, activities, and orders.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        customerid_contact: contact;
        /**
        Choose an account to connect this opportunity to, so that the relationship is visible in reports and analytics, and to provide a quick link to additional details, such as financial information and activities.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        parentaccountid: account;
        /**
        Choose a contact to connect this opportunity to, so that the relationship is visible in reports and analytics.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        parentcontactid: contact;
        /**
        Set Select the customer account or contact to provide a quick link to additional customer details, such as address, phone number, activities, and orders.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "customerid_account@odata.bind": string;
        /**
        Set Select the customer account or contact to provide a quick link to additional customer details, such as address, phone number, activities, and orders.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "customerid_contact@odata.bind": string;
        /**
        Set Choose an account to connect this opportunity to, so that the relationship is visible in reports and analytics, and to provide a quick link to additional details, such as financial information and activities.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "parentaccountid@odata.bind": string;
        /**
        Set Choose a contact to connect this opportunity to, so that the relationship is visible in reports and analytics.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "parentcontactid@odata.bind": string;
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as address, phone number, activities, and orders.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        customerid_accountUri(uri:string);
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as address, phone number, activities, and orders.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        customerid_contactUri(uri:string);
        /**
        Choose an account to connect this opportunity to, so that the relationship is visible in reports and analytics, and to provide a quick link to additional details, such as financial information and activities.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        parentaccountidUri(uri:string);
        /**
        Choose a contact to connect this opportunity to, so that the relationship is visible in reports and analytics.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        parentcontactidUri(uri:string);
        /**
        A collection of related Sdk.Sample.activitypointer
        */
        Opportunity_ActivityPointers: Array<Sdk.Sample.activitypointer>;
        /**
        A collection of related Sdk.Sample.annotation
        */
        Opportunity_Annotation: Array<Sdk.Sample.annotation>;
        /**
        A collection of related Sdk.Sample.letter
        */
        Opportunity_Letters: Array<Sdk.Sample.letter>;
        /**
        A collection of related Sdk.Sample.opportunityclose
        */
        Opportunity_OpportunityClose: Array<Sdk.Sample.opportunityclose>;
        /**
        A collection of related Sdk.Sample.task
        */
        Opportunity_Tasks: Array<Sdk.Sample.task>;
        /**
        A collection of related Sdk.Sample.competitor
        */
        opportunitycompetitors_association: Array<Sdk.Sample.competitor>;
    }

/**
Saved query against the database.
*/
    class savedquery implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param savedqueryReference
         */
        constructor(savedqueryReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: savedqueryProperties;
        readonly lookups: {};
        readonly collections: {};
        /**
        Type a name for the view to describe what results the view will contain. This name is visible to users in the View list.
        */
        name: string;
        /**
        Unique identifier of the view.
        */
        savedqueryid: string;
    }

/**
Saved database query that is owned by a user.
*/
    class userquery implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param userqueryReference
         */
        constructor(userqueryReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: userqueryProperties;
        readonly lookups: {};
        readonly collections: {};
        /**
        Type a descriptive name for the saved view.
        */
        name: string;
        /**
        Unique identifier of the saved view.
        */
        userqueryid: string;
    }

/**
Activity that tracks the delivery of a letter. The activity can contain the electronic copy of the letter.
*/
    class letter implements activitypointer {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param letterReference
         */
        constructor(letterReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: letterProperties;
        readonly lookups: letterLookups;
        readonly collections: letterCollections;
        /**
        Unique identifier of the letter activity.
        This property can only be set on create to create a new related Sdk.Sample.activitypointer
        */
        activityid_activitypointer: activitypointer;
        /**
        Choose the record that the letter relates to.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        regardingobjectid_account_letter: account;
        /**
        Choose the record that the letter relates to.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        regardingobjectid_contact_letter: contact;
        /**
        Choose the record that the letter relates to.
        This property can only be set on create to create a new related Sdk.Sample.incident
        */
        regardingobjectid_incident_letter: incident;
        /**
        Choose the record that the letter relates to.
        This property can only be set on create to create a new related Sdk.Sample.opportunity
        */
        regardingobjectid_opportunity_letter: opportunity;
        /**
        Set Unique identifier of the letter activity.
        Value must be a URI to an existing Sdk.Sample.activitypointer.
        */
        "activityid_activitypointer@odata.bind": string;
        /**
        Set Choose the record that the letter relates to.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "regardingobjectid_account_letter@odata.bind": string;
        /**
        Set Choose the record that the letter relates to.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "regardingobjectid_contact_letter@odata.bind": string;
        /**
        Set Choose the record that the letter relates to.
        Value must be a URI to an existing Sdk.Sample.incident.
        */
        "regardingobjectid_incident_letter@odata.bind": string;
        /**
        Set Choose the record that the letter relates to.
        Value must be a URI to an existing Sdk.Sample.opportunity.
        */
        "regardingobjectid_opportunity_letter@odata.bind": string;
        /**
        Unique identifier of the letter activity.
         * @param uri The uri to an existing Sdk.Sample.activitypointer.
        */
        activityid_activitypointerUri(uri:string);
        /**
        Choose the record that the letter relates to.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        regardingobjectid_account_letterUri(uri:string);
        /**
        Choose the record that the letter relates to.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        regardingobjectid_contact_letterUri(uri:string);
        /**
        Choose the record that the letter relates to.
         * @param uri The uri to an existing Sdk.Sample.incident.
        */
        regardingobjectid_incident_letterUri(uri:string);
        /**
        Choose the record that the letter relates to.
         * @param uri The uri to an existing Sdk.Sample.opportunity.
        */
        regardingobjectid_opportunity_letterUri(uri:string);
        /**
        A collection of related Sdk.Sample.annotation
        */
        Letter_Annotation: Array<Sdk.Sample.annotation>;
        /**
        A collection of related Sdk.Sample.queueitem
        */
        Letter_QueueItem: Array<Sdk.Sample.queueitem>;
        /**
        Unique identifier of the activity.
        */
        activityid: string;
        /**
        Actual duration of the activity in minutes.
        */
        actualdurationminutes: number;
        /**
        Description of the activity.
        */
        description: string;
        /**
        Scheduled end time of the activity.
        */
        scheduledend: Date;
        /**
        Scheduled start time of the activity.
        */
        scheduledstart: Date;
        /**
        Subject associated with the activity.
        */
        subject: string;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        regardingobjectid_account: account;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        regardingobjectid_contact: contact;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.incident
        */
        regardingobjectid_incident: incident;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.opportunity
        */
        regardingobjectid_opportunity: opportunity;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "regardingobjectid_account@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "regardingobjectid_contact@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.incident.
        */
        "regardingobjectid_incident@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.opportunity.
        */
        "regardingobjectid_opportunity@odata.bind": string;
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        regardingobjectid_accountUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        regardingobjectid_contactUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.incident.
        */
        regardingobjectid_incidentUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.opportunity.
        */
        regardingobjectid_opportunityUri(uri:string);
        /**
        A collection of related Sdk.Sample.letter
        */
        activity_pointer_letter: Array<Sdk.Sample.letter>;
        /**
        A collection of related Sdk.Sample.opportunityclose
        */
        activity_pointer_opportunity_close: Array<Sdk.Sample.opportunityclose>;
        /**
        A collection of related Sdk.Sample.task
        */
        activity_pointer_task: Array<Sdk.Sample.task>;
        /**
        A collection of related Sdk.Sample.queueitem
        */
        ActivityPointer_QueueItem: Array<Sdk.Sample.queueitem>;
    }

/**
Activity that is created automatically when an opportunity is closed, containing information such as the description of the closing and actual revenue.
*/
    class opportunityclose implements activitypointer {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param opportunitycloseReference
         */
        constructor(opportunitycloseReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: opportunitycloseProperties;
        readonly lookups: opportunitycloseLookups;
        readonly collections: opportunitycloseCollections;
        /**
        Unique identifier of the opportunity close activity.
        This property can only be set on create to create a new related Sdk.Sample.activitypointer
        */
        activityid_activitypointer: activitypointer;
        /**
        Unique identifier of the competitor with which the opportunity close activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.competitor
        */
        competitorid: competitor;
        /**
        Unique identifier of the opportunity closed.
        This property can only be set on create to create a new related Sdk.Sample.opportunity
        */
        opportunityid: opportunity;
        /**
        Set Unique identifier of the opportunity close activity.
        Value must be a URI to an existing Sdk.Sample.activitypointer.
        */
        "activityid_activitypointer@odata.bind": string;
        /**
        Set Unique identifier of the competitor with which the opportunity close activity is associated.
        Value must be a URI to an existing Sdk.Sample.competitor.
        */
        "competitorid@odata.bind": string;
        /**
        Set Unique identifier of the opportunity closed.
        Value must be a URI to an existing Sdk.Sample.opportunity.
        */
        "opportunityid@odata.bind": string;
        /**
        Unique identifier of the opportunity close activity.
         * @param uri The uri to an existing Sdk.Sample.activitypointer.
        */
        activityid_activitypointerUri(uri:string);
        /**
        Unique identifier of the competitor with which the opportunity close activity is associated.
         * @param uri The uri to an existing Sdk.Sample.competitor.
        */
        competitoridUri(uri:string);
        /**
        Unique identifier of the opportunity closed.
         * @param uri The uri to an existing Sdk.Sample.opportunity.
        */
        opportunityidUri(uri:string);
        /**
        A collection of related Sdk.Sample.annotation
        */
        OpportunityClose_Annotation: Array<Sdk.Sample.annotation>;
        /**
        Unique identifier of the activity.
        */
        activityid: string;
        /**
        Actual duration of the activity in minutes.
        */
        actualdurationminutes: number;
        /**
        Description of the activity.
        */
        description: string;
        /**
        Scheduled end time of the activity.
        */
        scheduledend: Date;
        /**
        Scheduled start time of the activity.
        */
        scheduledstart: Date;
        /**
        Subject associated with the activity.
        */
        subject: string;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        regardingobjectid_account: account;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        regardingobjectid_contact: contact;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.incident
        */
        regardingobjectid_incident: incident;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Sdk.Sample.opportunity
        */
        regardingobjectid_opportunity: opportunity;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "regardingobjectid_account@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "regardingobjectid_contact@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.incident.
        */
        "regardingobjectid_incident@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Sdk.Sample.opportunity.
        */
        "regardingobjectid_opportunity@odata.bind": string;
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        regardingobjectid_accountUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        regardingobjectid_contactUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.incident.
        */
        regardingobjectid_incidentUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Sdk.Sample.opportunity.
        */
        regardingobjectid_opportunityUri(uri:string);
        /**
        A collection of related Sdk.Sample.letter
        */
        activity_pointer_letter: Array<Sdk.Sample.letter>;
        /**
        A collection of related Sdk.Sample.opportunityclose
        */
        activity_pointer_opportunity_close: Array<Sdk.Sample.opportunityclose>;
        /**
        A collection of related Sdk.Sample.task
        */
        activity_pointer_task: Array<Sdk.Sample.task>;
        /**
        A collection of related Sdk.Sample.queueitem
        */
        ActivityPointer_QueueItem: Array<Sdk.Sample.queueitem>;
    }

/**
A list of records that require action, such as accounts, activities, and cases.
*/
    class queue implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param queueReference
         */
        constructor(queueReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: queueProperties;
        readonly lookups: {};
        readonly collections: queueCollections;
        /**
        Unique identifier of the queue.
        */
        queueid: string;
        /**
        A collection of related Sdk.Sample.queueitem
        */
        queue_entries: Array<Sdk.Sample.queueitem>;
    }

/**
A specific item in a queue, such as a case record or an activity record.
*/
    class queueitem implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param queueitemReference
         */
        constructor(queueitemReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: queueitemProperties;
        readonly lookups: queueitemLookups;
        readonly collections: {};
        /**
        Unique identifier of the queue item.
        */
        queueitemid: string;
        /**
        Choose the activity, case, or article assigned to the queue.
        This property can only be set on create to create a new related Sdk.Sample.activitypointer
        */
        objectid_activitypointer: activitypointer;
        /**
        Choose the activity, case, or article assigned to the queue.
        This property can only be set on create to create a new related Sdk.Sample.incident
        */
        objectid_incident: incident;
        /**
        Choose the activity, case, or article assigned to the queue.
        This property can only be set on create to create a new related Sdk.Sample.letter
        */
        objectid_letter: letter;
        /**
        Choose the activity, case, or article assigned to the queue.
        This property can only be set on create to create a new related Sdk.Sample.task
        */
        objectid_task: task;
        /**
        Choose the queue that the item is assigned to.
        This property can only be set on create to create a new related Sdk.Sample.queue
        */
        queueid: queue;
        /**
        Set Choose the activity, case, or article assigned to the queue.
        Value must be a URI to an existing Sdk.Sample.activitypointer.
        */
        "objectid_activitypointer@odata.bind": string;
        /**
        Set Choose the activity, case, or article assigned to the queue.
        Value must be a URI to an existing Sdk.Sample.incident.
        */
        "objectid_incident@odata.bind": string;
        /**
        Set Choose the activity, case, or article assigned to the queue.
        Value must be a URI to an existing Sdk.Sample.letter.
        */
        "objectid_letter@odata.bind": string;
        /**
        Set Choose the activity, case, or article assigned to the queue.
        Value must be a URI to an existing Sdk.Sample.task.
        */
        "objectid_task@odata.bind": string;
        /**
        Set Choose the queue that the item is assigned to.
        Value must be a URI to an existing Sdk.Sample.queue.
        */
        "queueid@odata.bind": string;
        /**
        Choose the activity, case, or article assigned to the queue.
         * @param uri The uri to an existing Sdk.Sample.activitypointer.
        */
        objectid_activitypointerUri(uri:string);
        /**
        Choose the activity, case, or article assigned to the queue.
         * @param uri The uri to an existing Sdk.Sample.incident.
        */
        objectid_incidentUri(uri:string);
        /**
        Choose the activity, case, or article assigned to the queue.
         * @param uri The uri to an existing Sdk.Sample.letter.
        */
        objectid_letterUri(uri:string);
        /**
        Choose the activity, case, or article assigned to the queue.
         * @param uri The uri to an existing Sdk.Sample.task.
        */
        objectid_taskUri(uri:string);
        /**
        Choose the queue that the item is assigned to.
         * @param uri The uri to an existing Sdk.Sample.queue.
        */
        queueidUri(uri:string);
    }

/**
Note that is attached to one or more objects, including other notes.
*/
    class annotation implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param annotationReference
         */
        constructor(annotationReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: annotationProperties;
        readonly lookups: annotationLookups;
        readonly collections: {};
        /**
        Unique identifier of the note.
        */
        annotationid: string;
        /**
        Unique identifier of the object with which the note is associated.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        objectid_account: account;
        /**
        Unique identifier of the object with which the note is associated.
        This property can only be set on create to create a new related Sdk.Sample.competitor
        */
        objectid_competitor: competitor;
        /**
        Unique identifier of the object with which the note is associated.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        objectid_contact: contact;
        /**
        Unique identifier of the object with which the note is associated.
        This property can only be set on create to create a new related Sdk.Sample.incident
        */
        objectid_incident: incident;
        /**
        Unique identifier of the object with which the note is associated.
        This property can only be set on create to create a new related Sdk.Sample.letter
        */
        objectid_letter: letter;
        /**
        Unique identifier of the object with which the note is associated.
        This property can only be set on create to create a new related Sdk.Sample.opportunity
        */
        objectid_opportunity: opportunity;
        /**
        Unique identifier of the object with which the note is associated.
        This property can only be set on create to create a new related Sdk.Sample.opportunityclose
        */
        objectid_opportunityclose: opportunityclose;
        /**
        Unique identifier of the object with which the note is associated.
        This property can only be set on create to create a new related Sdk.Sample.task
        */
        objectid_task: task;
        /**
        Set Unique identifier of the object with which the note is associated.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "objectid_account@odata.bind": string;
        /**
        Set Unique identifier of the object with which the note is associated.
        Value must be a URI to an existing Sdk.Sample.competitor.
        */
        "objectid_competitor@odata.bind": string;
        /**
        Set Unique identifier of the object with which the note is associated.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "objectid_contact@odata.bind": string;
        /**
        Set Unique identifier of the object with which the note is associated.
        Value must be a URI to an existing Sdk.Sample.incident.
        */
        "objectid_incident@odata.bind": string;
        /**
        Set Unique identifier of the object with which the note is associated.
        Value must be a URI to an existing Sdk.Sample.letter.
        */
        "objectid_letter@odata.bind": string;
        /**
        Set Unique identifier of the object with which the note is associated.
        Value must be a URI to an existing Sdk.Sample.opportunity.
        */
        "objectid_opportunity@odata.bind": string;
        /**
        Set Unique identifier of the object with which the note is associated.
        Value must be a URI to an existing Sdk.Sample.opportunityclose.
        */
        "objectid_opportunityclose@odata.bind": string;
        /**
        Set Unique identifier of the object with which the note is associated.
        Value must be a URI to an existing Sdk.Sample.task.
        */
        "objectid_task@odata.bind": string;
        /**
        Unique identifier of the object with which the note is associated.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        objectid_accountUri(uri:string);
        /**
        Unique identifier of the object with which the note is associated.
         * @param uri The uri to an existing Sdk.Sample.competitor.
        */
        objectid_competitorUri(uri:string);
        /**
        Unique identifier of the object with which the note is associated.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        objectid_contactUri(uri:string);
        /**
        Unique identifier of the object with which the note is associated.
         * @param uri The uri to an existing Sdk.Sample.incident.
        */
        objectid_incidentUri(uri:string);
        /**
        Unique identifier of the object with which the note is associated.
         * @param uri The uri to an existing Sdk.Sample.letter.
        */
        objectid_letterUri(uri:string);
        /**
        Unique identifier of the object with which the note is associated.
         * @param uri The uri to an existing Sdk.Sample.opportunity.
        */
        objectid_opportunityUri(uri:string);
        /**
        Unique identifier of the object with which the note is associated.
         * @param uri The uri to an existing Sdk.Sample.opportunityclose.
        */
        objectid_opportunitycloseUri(uri:string);
        /**
        Unique identifier of the object with which the note is associated.
         * @param uri The uri to an existing Sdk.Sample.task.
        */
        objectid_taskUri(uri:string);
    }

/**
Service request case associated with a contract.
*/
    class incident implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param incidentReference
         */
        constructor(incidentReference?: string | Object)
        readonly isEntityClass: boolean;
        // crmbaseentity implementation START
        readonly type: string;
        readonly primaryKey: string;
        readonly entitySetName: string;
        
        /**
        * Returns the URI for an object that has been saved.
        */
        getUri(): string;
        /**
         * Returns URI for an object that has been saved.
         */
        getId(): string;

        /**
         * setIdFromUri Sets the primary key property value based on the URI of an entity
         * @param uri The Uri of an entity that has been saved;
         */
        setIdFromUri(uri:string);

        /**
         * Returns a reference to an object that has been saved.
         */
        getRef(): entityReference;

        /**
         * Returns the ETag value of a retrieved entity
         */
        getVersion(): string;

        /**
         * Returns the formatted value of a property retrieved from the server.
         * @param propertyName The name of the property with a formatted value.
         * @param whenNullText The value to return when the property is null.
         */
        getFormattedValue(propertyName: string, whenNullText?: string): string;

        /**
         * Returns an array of the property names available for the entity in the library Test.Test.Properties.js library.
         */
        getColumnSet(): Array<string>;

        /**
         * Returns the value of a property not defined in the library.
         */
        get(propertyName: string): any;

        /**
         * Sets the value of a property not defined in the library.
         */
         set(propertyName:string,value:any);

        /**
        * Removes any tracked changes to entity properties
        */
        resetChangeTracking();

        // crmbaseentity implementation END
        readonly properties: incidentProperties;
        readonly lookups: incidentLookups;
        readonly collections: incidentCollections;
        /**
        Unique identifier of the case.
        */
        incidentid: string;
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
        This property can only be set on create to create a new related Sdk.Sample.account
        */
        customerid_account: account;
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        customerid_contact: contact;
        /**
        Select an existing case for the customer that has been populated. For internal use only.
        This property can only be set on create to create a new related Sdk.Sample.incident
        */
        existingcase: incident;
        /**
        Choose the primary case the current case was merged into.
        This property can only be set on create to create a new related Sdk.Sample.incident
        */
        masterid: incident;
        /**
        Choose the parent case for a case.
        This property can only be set on create to create a new related Sdk.Sample.incident
        */
        parentcaseid: incident;
        /**
        Select a primary contact for this case.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        primarycontactid: contact;
        /**
        Choose an additional customer contact who can also help resolve the case.
        This property can only be set on create to create a new related Sdk.Sample.contact
        */
        responsiblecontactid: contact;
        /**
        Set Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
        Value must be a URI to an existing Sdk.Sample.account.
        */
        "customerid_account@odata.bind": string;
        /**
        Set Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "customerid_contact@odata.bind": string;
        /**
        Set Select an existing case for the customer that has been populated. For internal use only.
        Value must be a URI to an existing Sdk.Sample.incident.
        */
        "existingcase@odata.bind": string;
        /**
        Set Choose the primary case the current case was merged into.
        Value must be a URI to an existing Sdk.Sample.incident.
        */
        "masterid@odata.bind": string;
        /**
        Set Choose the parent case for a case.
        Value must be a URI to an existing Sdk.Sample.incident.
        */
        "parentcaseid@odata.bind": string;
        /**
        Set Select a primary contact for this case.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "primarycontactid@odata.bind": string;
        /**
        Set Choose an additional customer contact who can also help resolve the case.
        Value must be a URI to an existing Sdk.Sample.contact.
        */
        "responsiblecontactid@odata.bind": string;
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
         * @param uri The uri to an existing Sdk.Sample.account.
        */
        customerid_accountUri(uri:string);
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        customerid_contactUri(uri:string);
        /**
        Select an existing case for the customer that has been populated. For internal use only.
         * @param uri The uri to an existing Sdk.Sample.incident.
        */
        existingcaseUri(uri:string);
        /**
        Choose the primary case the current case was merged into.
         * @param uri The uri to an existing Sdk.Sample.incident.
        */
        masteridUri(uri:string);
        /**
        Choose the parent case for a case.
         * @param uri The uri to an existing Sdk.Sample.incident.
        */
        parentcaseidUri(uri:string);
        /**
        Select a primary contact for this case.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        primarycontactidUri(uri:string);
        /**
        Choose an additional customer contact who can also help resolve the case.
         * @param uri The uri to an existing Sdk.Sample.contact.
        */
        responsiblecontactidUri(uri:string);
        /**
        A collection of related Sdk.Sample.activitypointer
        */
        Incident_ActivityPointers: Array<Sdk.Sample.activitypointer>;
        /**
        A collection of related Sdk.Sample.annotation
        */
        Incident_Annotation: Array<Sdk.Sample.annotation>;
        /**
        A collection of related Sdk.Sample.incident
        */
        incident_existingcase: Array<Sdk.Sample.incident>;
        /**
        A collection of related Sdk.Sample.letter
        */
        Incident_Letters: Array<Sdk.Sample.letter>;
        /**
        A collection of related Sdk.Sample.incident
        */
        incident_master_incident: Array<Sdk.Sample.incident>;
        /**
        A collection of related Sdk.Sample.incident
        */
        incident_parent_incident: Array<Sdk.Sample.incident>;
        /**
        A collection of related Sdk.Sample.queueitem
        */
        Incident_QueueItem: Array<Sdk.Sample.queueitem>;
        /**
        A collection of related Sdk.Sample.task
        */
        Incident_Tasks: Array<Sdk.Sample.task>;
    }

    /**
    * Calculates the total time, in minutes, that you used while you worked on an incident (case).
    * @param uri A url for a incident to apply the function to.
    * @param callerId A string representation of the GUID value for the user to impersonate
    */
    function CalculateTotalTimeIncident(
        uri: string,
        callerId?: string
): Promise<CalculateTotalTimeIncidentResponse>;
    /**
    * Retrieves the time zone code for the specified localized time zone name.
    * @param localizedStandardName The localized name to search for.
    * @param localeId The locale ID.
    * @param callerId A string representation of the GUID value for the user to impersonate
    */
    function GetTimeZoneCodeByLocalizedName(
        localizedStandardName: string,
        localeId: number,
        callerId?: string
): Promise<GetTimeZoneCodeByLocalizedNameResponse>;
    /**
    * Retrieves system information for the currently logged on user.
    */
    function WhoAmI(): Promise<WhoAmIResponse>;

    /**
    * Moves an entity record from a source queue to a destination queue.
    * @param uri A url for a queue to apply the action to.
    * @param target The destination queue. (Required)
    * @param sourceQueue The source queue. (Required parameter can be null)
    * @param queueItemProperties Properties required to create a queue item in the destination queue. (Required parameter can be null)
    * @param [callerId] A string representation of the GUID value for the user to impersonate
    */
    function AddToQueue(
        uri: string,
        target: crmbaseentity,
        sourceQueue: queue,
        queueItemProperties: queueitem,
        callerId?: string
    ): Promise<AddToQueueResponse>;
    /**
    * 
    * @param uri A url for a contact to apply the action to.
    * @param noteTitle  (Required)
    * @param noteText  (Required)
    * @param [callerId] A string representation of the GUID value for the user to impersonate
    */
    function sample_AddNoteToContact(
        uri: string,
        noteTitle: string,
        noteText: string,
        callerId?: string
    ): Promise<annotation>;
    /**
    * 
    * @param customerType  (Required)
    * @param accountName  (Required parameter can be null)
    * @param contactFirstName  (Required parameter can be null)
    * @param contactLastName  (Required parameter can be null)
    * @param [callerId] A string representation of the GUID value for the user to impersonate
    */
    function sample_CreateCustomer(
        customerType: string,
        accountName: string,
        contactFirstName: string,
        contactLastName: string,
        callerId?: string
    ): Promise<void>;
    /**
    * Sets the state of an opportunity to Won.
    * @param opportunityClose The opportunity close activity associated with this state change. (Required)
    * @param status Status of the opportunity. (Required)
    * @param [callerId] A string representation of the GUID value for the user to impersonate
    */
    function WinOpportunity(
        opportunityClose: opportunityclose,
        status: number,
        callerId?: string
    ): Promise<void>;

    /**
    * Contains the response from the AddToQueue action.
    */
    class AddToQueueResponse {
    /**
    * The ID of the queue item that is created in the destination queue.
    */
        QueueItemId: string;
    }
    /**
    * Defines a managed property that stores a Boolean value.
    */
    class BooleanManagedProperty {
    /**
    * The value of the managed property.
    */
        Value: boolean;
    /**
    * Whether the managed property value can be changed.
    */
        CanBeChanged: boolean;
    /**
    * The logical name for the managed property.
    */
        ManagedPropertyLogicalName: string;
    }
    /**
    * Contains the response from the CalculateTotalTimeIncident function.
    */
    class CalculateTotalTimeIncidentResponse {
    /**
    * The total time in minutes that it takes to work on an incident (case).
    */
        TotalTime: number;
    }
    /**
    * Contains the response from the GetTimeZoneCodeByLocalizedName function.
    */
    class GetTimeZoneCodeByLocalizedNameResponse {
    /**
    * The time zone code that has the requested localized name.
    */
        TimeZoneCode: number;
    }
    /**
    * Contains the response from WhoAmI function.
    */
    class WhoAmIResponse {
    /**
    * ID of the business to which the logged on user belongs.
    */
        BusinessUnitId: string;
    /**
    * ID of the user who is logged on.
    */
        UserId: string;
    /**
    * ID of the organization that the user belongs to.
    */
        OrganizationId: string;
    }


    // MODELDEFINITIONS END


    /**
     * Create a new entity
     * @param entity A Sdk.Sample.crmbaseentity with the properties for the entity you want to create.
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise with the uri for the entity created.
     */
    function create(
        entity: crmbaseentity,
        callerId?: string): Promise<string>;

    /**
     * Create a new entity and retrieve it
     * @param entity A Sdk.Sample.crmbaseentity with the properties for the entity you want to create.
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
     * @param entity A Sdk.Sample.crmbaseentity with the properties for the entity you want to create.
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
     * @param entity A Sdk.Sample.crmbaseentity that you want to update
     * @param cancelWhenOlder Whether to cancel update when the server version is newer. Default is false;
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise that is resolved when successful or rejected with an error;
     */
    function update(entity: crmbaseentity, cancelWhenOlder?: boolean,  callerId?: string): Promise<void>

    /**
     * Create an entity if it doesn't exist, otherwise update existing entity
     * @param entity A Sdk.Sample.crmbaseentity that you want to upsert
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
     * Return the next page from the results of an Sdk.Sample.query when there are more pages
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
     * @param JSONentity The retrieved JSON entity that is not an instance of Sdk.Sample.crmbaseentity
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