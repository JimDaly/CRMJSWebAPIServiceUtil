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


declare namespace Demo.Tour {

    //ADAL Support START
    // This library is not configured to support ADAL
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
    interface activitypointerProperties {
     activityid: propertyType;
     actualdurationminutes: propertyType;
     actualend: propertyType;
     actualstart: propertyType;
     community: propertyType;
     createdon: propertyType;
     deliverylastattemptedon: propertyType;
     deliveryprioritycode: propertyType;
     description: propertyType;
     exchangerate: propertyType;
     isbilled: propertyType;
     ismapiprivate: propertyType;
     isregularactivity: propertyType;
     isworkflowcreated: propertyType;
     lastonholdtime: propertyType;
     leftvoicemail: propertyType;
     modifiedon: propertyType;
     onholdtime: propertyType;
     postponeactivityprocessinguntil: propertyType;
     prioritycode: propertyType;
     processid: propertyType;
     scheduleddurationminutes: propertyType;
     scheduledend: propertyType;
     scheduledstart: propertyType;
     statecode: propertyType;
     statuscode: propertyType;
     subject: propertyType;
}
interface activitypointerLookups {
     regardingobjectid_account: navigationPropertyType;
     regardingobjectid_contact: navigationPropertyType;
     regardingobjectid_incident: navigationPropertyType;
}
interface activitypointerCollections {
     activity_pointer_incident_resolution: navigationPropertyType;
     activity_pointer_phonecall: navigationPropertyType;
     activity_pointer_task: navigationPropertyType;
}
interface accountProperties {
     accountcategorycode: propertyType;
     accountid: propertyType;
     accountnumber: propertyType;
     address1_addresstypecode: propertyType;
     address1_city: propertyType;
     address1_composite: propertyType;
     address1_country: propertyType;
     address1_freighttermscode: propertyType;
     address1_line1: propertyType;
     address1_line2: propertyType;
     address1_line3: propertyType;
     address1_name: propertyType;
     address1_postalcode: propertyType;
     address1_shippingmethodcode: propertyType;
     address1_stateorprovince: propertyType;
     address1_telephone1: propertyType;
     creditlimit: propertyType;
     creditonhold: propertyType;
     customertypecode: propertyType;
     description: propertyType;
     donotbulkemail: propertyType;
     donotemail: propertyType;
     donotfax: propertyType;
     donotphone: propertyType;
     donotpostalmail: propertyType;
     donotsendmm: propertyType;
     emailaddress1: propertyType;
     fax: propertyType;
     industrycode: propertyType;
     lastusedincampaign: propertyType;
     name: propertyType;
     numberofemployees: propertyType;
     opendeals: propertyType;
     openrevenue: propertyType;
     ownershipcode: propertyType;
     paymenttermscode: propertyType;
     preferredappointmentdaycode: propertyType;
     preferredappointmenttimecode: propertyType;
     preferredcontactmethodcode: propertyType;
     revenue: propertyType;
     sic: propertyType;
     statecode: propertyType;
     telephone1: propertyType;
     telephone2: propertyType;
     tickersymbol: propertyType;
     websiteurl: propertyType;
}
interface accountLookups {
     masterid: navigationPropertyType;
     parentaccountid: navigationPropertyType;
     primarycontactid: navigationPropertyType;
}
interface accountCollections {
     Account_ActivityPointers: navigationPropertyType;
     account_master_account: navigationPropertyType;
     account_parent_account: navigationPropertyType;
     Account_Phonecalls: navigationPropertyType;
     Account_Tasks: navigationPropertyType;
     contact_customer_accounts: navigationPropertyType;
     incident_customer_accounts: navigationPropertyType;
}
interface contactProperties {
     accountrolecode: propertyType;
     address1_addresstypecode: propertyType;
     address1_city: propertyType;
     address1_composite: propertyType;
     address1_country: propertyType;
     address1_freighttermscode: propertyType;
     address1_line1: propertyType;
     address1_line2: propertyType;
     address1_line3: propertyType;
     address1_name: propertyType;
     address1_postalcode: propertyType;
     address1_shippingmethodcode: propertyType;
     address1_stateorprovince: propertyType;
     address1_telephone1: propertyType;
     anniversary: propertyType;
     assistantname: propertyType;
     assistantphone: propertyType;
     birthdate: propertyType;
     contactid: propertyType;
     creditlimit: propertyType;
     creditonhold: propertyType;
     department: propertyType;
     description: propertyType;
     donotbulkemail: propertyType;
     donotemail: propertyType;
     donotfax: propertyType;
     donotphone: propertyType;
     donotpostalmail: propertyType;
     donotsendmm: propertyType;
     emailaddress1: propertyType;
     familystatuscode: propertyType;
     fax: propertyType;
     firstname: propertyType;
     fullname: propertyType;
     gendercode: propertyType;
     jobtitle: propertyType;
     lastname: propertyType;
     lastusedincampaign: propertyType;
     managername: propertyType;
     managerphone: propertyType;
     middlename: propertyType;
     mobilephone: propertyType;
     paymenttermscode: propertyType;
     preferredappointmentdaycode: propertyType;
     preferredappointmenttimecode: propertyType;
     preferredcontactmethodcode: propertyType;
     salutation: propertyType;
     spousesname: propertyType;
     statecode: propertyType;
     telephone1: propertyType;
     telephone2: propertyType;
     websiteurl: propertyType;
}
interface contactLookups {
     masterid: navigationPropertyType;
     parentcustomerid_account: navigationPropertyType;
     parentcustomerid_contact: navigationPropertyType;
}
interface contactCollections {
     account_primary_contact: navigationPropertyType;
     Contact_ActivityPointers: navigationPropertyType;
     contact_as_primary_contact: navigationPropertyType;
     contact_as_responsible_contact: navigationPropertyType;
     contact_customer_contacts: navigationPropertyType;
     contact_master_contact: navigationPropertyType;
     Contact_Phonecalls: navigationPropertyType;
     Contact_Tasks: navigationPropertyType;
     incident_customer_contacts: navigationPropertyType;
}
interface taskProperties {
     category: propertyType;
     percentcomplete: propertyType;
     subcategory: propertyType;
     activityid: propertyType;
     actualdurationminutes: propertyType;
     actualend: propertyType;
     actualstart: propertyType;
     community: propertyType;
     createdon: propertyType;
     deliverylastattemptedon: propertyType;
     deliveryprioritycode: propertyType;
     description: propertyType;
     exchangerate: propertyType;
     isbilled: propertyType;
     ismapiprivate: propertyType;
     isregularactivity: propertyType;
     isworkflowcreated: propertyType;
     lastonholdtime: propertyType;
     leftvoicemail: propertyType;
     modifiedon: propertyType;
     onholdtime: propertyType;
     postponeactivityprocessinguntil: propertyType;
     prioritycode: propertyType;
     processid: propertyType;
     scheduleddurationminutes: propertyType;
     scheduledend: propertyType;
     scheduledstart: propertyType;
     statecode: propertyType;
     statuscode: propertyType;
     subject: propertyType;
}
interface taskLookups {
     activityid_activitypointer: navigationPropertyType;
     regardingobjectid_account_task: navigationPropertyType;
     regardingobjectid_contact_task: navigationPropertyType;
     regardingobjectid_incident_task: navigationPropertyType;
     regardingobjectid_account: navigationPropertyType;
     regardingobjectid_contact: navigationPropertyType;
     regardingobjectid_incident: navigationPropertyType;
}
interface taskCollections {
     activity_pointer_incident_resolution: navigationPropertyType;
     activity_pointer_phonecall: navigationPropertyType;
     activity_pointer_task: navigationPropertyType;
}
interface incidentProperties {
     blockedprofile: propertyType;
     caseorigincode: propertyType;
     casetypecode: propertyType;
     contractservicelevelcode: propertyType;
     createdon: propertyType;
     customersatisfactioncode: propertyType;
     description: propertyType;
     escalatedon: propertyType;
     firstresponsesent: propertyType;
     followupby: propertyType;
     incidentid: propertyType;
     influencescore: propertyType;
     isescalated: propertyType;
     messagetypecode: propertyType;
     prioritycode: propertyType;
     productserialnumber: propertyType;
     resolveby: propertyType;
     responseby: propertyType;
     sentimentvalue: propertyType;
     statecode: propertyType;
     statuscode: propertyType;
     ticketnumber: propertyType;
     title: propertyType;
}
interface incidentLookups {
     customerid_account: navigationPropertyType;
     customerid_contact: navigationPropertyType;
     existingcase: navigationPropertyType;
     masterid: navigationPropertyType;
     parentcaseid: navigationPropertyType;
     primarycontactid: navigationPropertyType;
     responsiblecontactid: navigationPropertyType;
}
interface incidentCollections {
     Incident_ActivityPointers: navigationPropertyType;
     incident_existingcase: navigationPropertyType;
     Incident_IncidentResolutions: navigationPropertyType;
     incident_master_incident: navigationPropertyType;
     incident_parent_incident: navigationPropertyType;
     Incident_Phonecalls: navigationPropertyType;
     Incident_Tasks: navigationPropertyType;
}
interface incidentresolutionProperties {
     category: propertyType;
     subcategory: propertyType;
     timespent: propertyType;
     activityid: propertyType;
     actualdurationminutes: propertyType;
     actualend: propertyType;
     actualstart: propertyType;
     community: propertyType;
     createdon: propertyType;
     deliverylastattemptedon: propertyType;
     deliveryprioritycode: propertyType;
     description: propertyType;
     exchangerate: propertyType;
     isbilled: propertyType;
     ismapiprivate: propertyType;
     isregularactivity: propertyType;
     isworkflowcreated: propertyType;
     lastonholdtime: propertyType;
     leftvoicemail: propertyType;
     modifiedon: propertyType;
     onholdtime: propertyType;
     postponeactivityprocessinguntil: propertyType;
     prioritycode: propertyType;
     processid: propertyType;
     scheduleddurationminutes: propertyType;
     scheduledend: propertyType;
     scheduledstart: propertyType;
     statecode: propertyType;
     statuscode: propertyType;
     subject: propertyType;
}
interface incidentresolutionLookups {
     activityid_activitypointer: navigationPropertyType;
     incidentid: navigationPropertyType;
     regardingobjectid_account: navigationPropertyType;
     regardingobjectid_contact: navigationPropertyType;
     regardingobjectid_incident: navigationPropertyType;
}
interface incidentresolutionCollections {
     activity_pointer_incident_resolution: navigationPropertyType;
     activity_pointer_phonecall: navigationPropertyType;
     activity_pointer_task: navigationPropertyType;
}
interface phonecallProperties {
     category: propertyType;
     directioncode: propertyType;
     phonenumber: propertyType;
     subcategory: propertyType;
     activityid: propertyType;
     actualdurationminutes: propertyType;
     actualend: propertyType;
     actualstart: propertyType;
     community: propertyType;
     createdon: propertyType;
     deliverylastattemptedon: propertyType;
     deliveryprioritycode: propertyType;
     description: propertyType;
     exchangerate: propertyType;
     isbilled: propertyType;
     ismapiprivate: propertyType;
     isregularactivity: propertyType;
     isworkflowcreated: propertyType;
     lastonholdtime: propertyType;
     leftvoicemail: propertyType;
     modifiedon: propertyType;
     onholdtime: propertyType;
     postponeactivityprocessinguntil: propertyType;
     prioritycode: propertyType;
     processid: propertyType;
     scheduleddurationminutes: propertyType;
     scheduledend: propertyType;
     scheduledstart: propertyType;
     statecode: propertyType;
     statuscode: propertyType;
     subject: propertyType;
}
interface phonecallLookups {
     activityid_activitypointer: navigationPropertyType;
     regardingobjectid_account_phonecall: navigationPropertyType;
     regardingobjectid_contact_phonecall: navigationPropertyType;
     regardingobjectid_incident_phonecall: navigationPropertyType;
     regardingobjectid_account: navigationPropertyType;
     regardingobjectid_contact: navigationPropertyType;
     regardingobjectid_incident: navigationPropertyType;
}
interface phonecallCollections {
     activity_pointer_incident_resolution: navigationPropertyType;
     activity_pointer_phonecall: navigationPropertyType;
     activity_pointer_task: navigationPropertyType;
}

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
    
/**
Task performed, or to be performed, by a user. An activity is any action for which an entry can be made on a calendar.
*/
    class activitypointer implements crmbaseentity {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param activitypointerReference
         */
        constructor(activitypointerReference?: string | Object)
         isEntityClass: boolean;
        // crmbaseentity implementation START
        /**
        Name of the the activitypointer entity.
        */
         type: string;
        /**
        Primary key for the activitypointer entity: 'activityid'
        */
         primaryKey: string;
        /**
        Web API entity set name for the activitypointer entity: 'activitypointers'
        */
         entitySetName: string;
        
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
         properties: activitypointerProperties;
         lookups: activitypointerLookups;
         collections: activitypointerCollections;
        /**
        Unique identifier of the activity.
        */
        activityid: string;
        /**
        Actual duration of the activity in minutes.
        */
        actualdurationminutes: number;
        /**
        Actual end time of the activity.
        */
        actualend: Date;
        /**
        Actual start time of the activity.
        */
        actualstart: Date;
        /**
        Shows how contact about the social activity originated, such as from Twitter or Facebook. This field is read-only.
        Valid values are:
        1 : Facebook
        2 : Twitter
        0 : Other
        */
        community: number;
        /**
        Date and time when the activity was created.
        */
         createdon: Date;
        /**
        Date and time when the delivery of the activity was last attempted.
        */
         deliverylastattemptedon: Date;
        /**
        Priority of delivery of the activity to the email server.
        Valid values are:
        0 : Low
        1 : Normal
        2 : High
        */
        deliveryprioritycode: number;
        /**
        Description of the activity.
        */
        description: string;
        /**
        Exchange rate for the currency associated with the activitypointer with respect to the base currency.
        */
         exchangerate: number;
        /**
        Information regarding whether the activity was billed as part of resolving a case.
        Valid values are:
        1 : Yes
        0 : No
        */
        isbilled: boolean;
        /**
        For internal use only.
        Valid values are:
        1 : Yes
        0 : No
        */
        ismapiprivate: boolean;
        /**
        Information regarding whether the activity is a regular activity type or event type.
        Valid values are:
        1 : Yes
        0 : No
        */
         isregularactivity: boolean;
        /**
        Information regarding whether the activity was created from a workflow rule.
        Valid values are:
        1 : Yes
        0 : No
        */
        isworkflowcreated: boolean;
        /**
        Contains the date and time stamp of the last on hold time.
        */
        lastonholdtime: Date;
        /**
        Left the voice mail
        Valid values are:
        1 : Yes
        0 : No
        */
        leftvoicemail: boolean;
        /**
        Date and time when activity was last modified.
        */
         modifiedon: Date;
        /**
        Shows how long, in minutes, that the record was on hold.
        */
         onholdtime: number;
        /**
        For internal use only.
        */
         postponeactivityprocessinguntil: Date;
        /**
        Priority of the activity.
        Valid values are:
        0 : Low
        1 : Normal
        2 : High
        */
        prioritycode: number;
        /**
        Unique identifier of the Process.
        */
        processid: string;
        /**
        Scheduled duration of the activity, specified in minutes.
        */
        scheduleddurationminutes: number;
        /**
        Scheduled end time of the activity.
        */
        scheduledend: Date;
        /**
        Scheduled start time of the activity.
        */
        scheduledstart: Date;
        /**
        Status of the activity.
        Valid values are:
        0 : Open
        1 : Completed
        2 : Canceled
        3 : Scheduled
        */
        statecode: number;
        /**
        Reason for the status of the activity.
        Valid values are:
        1 : Open
        2 : Completed
        3 : Canceled
        4 : Scheduled
        */
        statuscode: number;
        /**
        Subject associated with the activity.
        */
        subject: string;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.account
        */
        regardingobjectid_account: account;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.contact
        */
        regardingobjectid_contact: contact;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.incident
        */
        regardingobjectid_incident: incident;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.account.
        */
        "regardingobjectid_account@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.contact.
        */
        "regardingobjectid_contact@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.incident.
        */
        "regardingobjectid_incident@odata.bind": string;
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.account.
        */
        regardingobjectid_accountUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.contact.
        */
        regardingobjectid_contactUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.incident.
        */
        regardingobjectid_incidentUri(uri:string);
        /**
        A collection of related Demo.Tour.incidentresolution
        */
        activity_pointer_incident_resolution: Array<Demo.Tour.incidentresolution>;
        /**
        A collection of related Demo.Tour.phonecall
        */
        activity_pointer_phonecall: Array<Demo.Tour.phonecall>;
        /**
        A collection of related Demo.Tour.task
        */
        activity_pointer_task: Array<Demo.Tour.task>;
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
         isEntityClass: boolean;
        // crmbaseentity implementation START
        /**
        Name of the the account entity.
        */
         type: string;
        /**
        Primary key for the account entity: 'accountid'
        */
         primaryKey: string;
        /**
        Web API entity set name for the account entity: 'accounts'
        */
         entitySetName: string;
        
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
         properties: accountProperties;
         lookups: accountLookups;
         collections: accountCollections;
        /**
        Select a category to indicate whether the customer account is standard or preferred.
        Valid values are:
        1 : Preferred Customer
        2 : Standard
        */
        accountcategorycode: number;
        /**
        Unique identifier of the account.
        */
        accountid: string;
        /**
        Type an ID number or code for the account to quickly search and identify the account in system views.
        */
        accountnumber: string;
        /**
        Select the primary address type.
        Valid values are:
        1 : Bill To
        2 : Ship To
        3 : Primary
        4 : Other
        */
        address1_addresstypecode: number;
        /**
        Type the city for the primary address.
        */
        address1_city: string;
        /**
        Shows the complete primary address.
        */
         address1_composite: string;
        /**
        Type the country or region for the primary address.
        */
        address1_country: string;
        /**
        Select the freight terms for the primary address to make sure shipping orders are processed correctly.
        Valid values are:
        1 : FOB
        2 : No Charge
        */
        address1_freighttermscode: number;
        /**
        Type the first line of the primary address.
        */
        address1_line1: string;
        /**
        Type the second line of the primary address.
        */
        address1_line2: string;
        /**
        Type the third line of the primary address.
        */
        address1_line3: string;
        /**
        Type a descriptive name for the primary address, such as Corporate Headquarters.
        */
        address1_name: string;
        /**
        Type the ZIP Code or postal code for the primary address.
        */
        address1_postalcode: string;
        /**
        Select a shipping method for deliveries sent to this address.
        Valid values are:
        1 : Airborne
        2 : DHL
        3 : FedEx
        4 : UPS
        5 : Postal Mail
        6 : Full Load
        7 : Will Call
        */
        address1_shippingmethodcode: number;
        /**
        Type the state or province of the primary address.
        */
        address1_stateorprovince: string;
        /**
        Type the main phone number associated with the primary address.
        */
        address1_telephone1: string;
        /**
        Type the credit limit of the account. This is a useful reference when you address invoice and accounting issues with the customer.
        */
        creditlimit: number;
        /**
        Select whether the credit for the account is on hold. This is a useful reference while addressing the invoice and accounting issues with the customer.
        Valid values are:
        1 : Yes
        0 : No
        */
        creditonhold: boolean;
        /**
        Select the category that best describes the relationship between the account and your organization.
        Valid values are:
        1 : Competitor
        2 : Consultant
        3 : Customer
        4 : Investor
        5 : Partner
        6 : Influencer
        7 : Press
        8 : Prospect
        9 : Reseller
        10 : Supplier
        11 : Vendor
        12 : Other
        */
        customertypecode: number;
        /**
        Type additional information to describe the account, such as an excerpt from the company's website.
        */
        description: string;
        /**
        Select whether the account allows bulk email sent through campaigns. If Do Not Allow is selected, the account can be added to marketing lists, but is excluded from email.
        Valid values are:
        1 : Do Not Allow
        0 : Allow
        */
        donotbulkemail: boolean;
        /**
        Select whether the account allows direct email sent from Microsoft Dynamics CRM.
        Valid values are:
        1 : Do Not Allow
        0 : Allow
        */
        donotemail: boolean;
        /**
        Select whether the account allows faxes. If Do Not Allow is selected, the account will be excluded from fax activities distributed in marketing campaigns.
        Valid values are:
        1 : Do Not Allow
        0 : Allow
        */
        donotfax: boolean;
        /**
        Select whether the account allows phone calls. If Do Not Allow is selected, the account will be excluded from phone call activities distributed in marketing campaigns.
        Valid values are:
        1 : Do Not Allow
        0 : Allow
        */
        donotphone: boolean;
        /**
        Select whether the account allows direct mail. If Do Not Allow is selected, the account will be excluded from letter activities distributed in marketing campaigns.
        Valid values are:
        1 : Do Not Allow
        0 : Allow
        */
        donotpostalmail: boolean;
        /**
        Select whether the account accepts marketing materials, such as brochures or catalogs.
        Valid values are:
        1 : Do Not Send
        0 : Send
        */
        donotsendmm: boolean;
        /**
        Type the primary email address for the account.
        */
        emailaddress1: string;
        /**
        Type the fax number for the account.
        */
        fax: string;
        /**
        Select the account's primary industry for use in marketing segmentation and demographic analysis.
        Valid values are:
        1 : Accounting
        2 : Agriculture and Non-petrol Natural Resource Extraction
        3 : Broadcasting Printing and Publishing
        4 : Brokers
        5 : Building Supply Retail
        6 : Business Services
        7 : Consulting
        8 : Consumer Services
        9 : Design, Direction and Creative Management
        10 : Distributors, Dispatchers and Processors
        11 : Doctor's Offices and Clinics
        12 : Durable Manufacturing
        13 : Eating and Drinking Places
        14 : Entertainment Retail
        15 : Equipment Rental and Leasing
        16 : Financial
        17 : Food and Tobacco Processing
        18 : Inbound Capital Intensive Processing
        19 : Inbound Repair and Services
        20 : Insurance
        21 : Legal Services
        22 : Non-Durable Merchandise Retail
        23 : Outbound Consumer Service
        24 : Petrochemical Extraction and Distribution
        25 : Service Retail
        26 : SIG Affiliations
        27 : Social Services
        28 : Special Outbound Trade Contractors
        29 : Specialty Realty
        30 : Transportation
        31 : Utility Creation and Distribution
        32 : Vehicle Retail
        33 : Wholesale
        */
        industrycode: number;
        /**
        Shows the date when the account was last included in a marketing campaign or quick campaign.
        */
        lastusedincampaign: Date;
        /**
        Type the company or business name.
        */
        name: string;
        /**
        Type the number of employees that work at the account for use in marketing segmentation and demographic analysis.
        */
        numberofemployees: number;
        /**
        Number of open opportunities against an account and its child accounts.
        */
         opendeals: number;
        /**
        Sum of open revenue against an account and its child accounts.
        */
         openrevenue: number;
        /**
        Select the account's ownership structure, such as public or private.
        Valid values are:
        1 : Public
        2 : Private
        3 : Subsidiary
        4 : Other
        */
        ownershipcode: number;
        /**
        Select the payment terms to indicate when the customer needs to pay the total amount.
        Valid values are:
        1 : Net 30
        2 : 2% 10, Net 30
        3 : Net 45
        4 : Net 60
        */
        paymenttermscode: number;
        /**
        Select the preferred day of the week for service appointments.
        Valid values are:
        0 : Sunday
        1 : Monday
        2 : Tuesday
        3 : Wednesday
        4 : Thursday
        5 : Friday
        6 : Saturday
        */
        preferredappointmentdaycode: number;
        /**
        Select the preferred time of day for service appointments.
        Valid values are:
        1 : Morning
        2 : Afternoon
        3 : Evening
        */
        preferredappointmenttimecode: number;
        /**
        Select the preferred method of contact.
        Valid values are:
        1 : Any
        2 : Email
        3 : Phone
        4 : Fax
        5 : Mail
        */
        preferredcontactmethodcode: number;
        /**
        Type the annual revenue for the account, used as an indicator in financial performance analysis.
        */
        revenue: number;
        /**
        Type the Standard Industrial Classification (SIC) code that indicates the account's primary industry of business, for use in marketing segmentation and demographic analysis.
        */
        sic: string;
        /**
        Shows whether the account is active or inactive. Inactive accounts are read-only and can't be edited unless they are reactivated.
        Valid values are:
        0 : Active
        1 : Inactive
        */
        statecode: number;
        /**
        Type the main phone number for this account.
        */
        telephone1: string;
        /**
        Type a second phone number for this account.
        */
        telephone2: string;
        /**
        Type the stock exchange symbol for the account to track financial performance of the company. You can click the code entered in this field to access the latest trading information from MSN Money.
        */
        tickersymbol: string;
        /**
        Type the account's website URL to get quick details about the company profile.
        */
        websiteurl: string;
        /**
        Read only: Shows the master account that the account was merged with.
        */
         masterid: account;
        /**
        Choose the parent account associated with this account to show parent and child businesses in reporting and analytics.
        This property can only be set on create to create a new related Demo.Tour.account
        */
        parentaccountid: account;
        /**
        Choose the primary contact for the account to provide quick access to contact details.
        This property can only be set on create to create a new related Demo.Tour.contact
        */
        primarycontactid: contact;
        /**
        Set Choose the parent account associated with this account to show parent and child businesses in reporting and analytics.
        Value must be a URI to an existing Demo.Tour.account.
        */
        "parentaccountid@odata.bind": string;
        /**
        Set Choose the primary contact for the account to provide quick access to contact details.
        Value must be a URI to an existing Demo.Tour.contact.
        */
        "primarycontactid@odata.bind": string;
        /**
        Choose the parent account associated with this account to show parent and child businesses in reporting and analytics.
         * @param uri The uri to an existing Demo.Tour.account.
        */
        parentaccountidUri(uri:string);
        /**
        Choose the primary contact for the account to provide quick access to contact details.
         * @param uri The uri to an existing Demo.Tour.contact.
        */
        primarycontactidUri(uri:string);
        /**
        A collection of related Demo.Tour.activitypointer
        */
        Account_ActivityPointers: Array<Demo.Tour.activitypointer>;
        /**
        A collection of related Demo.Tour.account
        */
        account_master_account: Array<Demo.Tour.account>;
        /**
        A collection of related Demo.Tour.account
        */
        account_parent_account: Array<Demo.Tour.account>;
        /**
        A collection of related Demo.Tour.phonecall
        */
        Account_Phonecalls: Array<Demo.Tour.phonecall>;
        /**
        A collection of related Demo.Tour.task
        */
        Account_Tasks: Array<Demo.Tour.task>;
        /**
        A collection of related Demo.Tour.contact
        */
        contact_customer_accounts: Array<Demo.Tour.contact>;
        /**
        A collection of related Demo.Tour.incident
        */
        incident_customer_accounts: Array<Demo.Tour.incident>;
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
         isEntityClass: boolean;
        // crmbaseentity implementation START
        /**
        Name of the the contact entity.
        */
         type: string;
        /**
        Primary key for the contact entity: 'contactid'
        */
         primaryKey: string;
        /**
        Web API entity set name for the contact entity: 'contacts'
        */
         entitySetName: string;
        
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
         properties: contactProperties;
         lookups: contactLookups;
         collections: contactCollections;
        /**
        Select the contact's role within the company or sales process, such as decision maker, employee, or influencer.
        Valid values are:
        1 : Decision Maker
        2 : Employee
        3 : Influencer
        */
        accountrolecode: number;
        /**
        Select the primary address type.
        Valid values are:
        1 : Bill To
        2 : Ship To
        3 : Primary
        4 : Other
        */
        address1_addresstypecode: number;
        /**
        Type the city for the primary address.
        */
        address1_city: string;
        /**
        Shows the complete primary address.
        */
         address1_composite: string;
        /**
        Type the country or region for the primary address.
        */
        address1_country: string;
        /**
        Select the freight terms for the primary address to make sure shipping orders are processed correctly.
        Valid values are:
        1 : FOB
        2 : No Charge
        */
        address1_freighttermscode: number;
        /**
        Type the first line of the primary address.
        */
        address1_line1: string;
        /**
        Type the second line of the primary address.
        */
        address1_line2: string;
        /**
        Type the third line of the primary address.
        */
        address1_line3: string;
        /**
        Type a descriptive name for the primary address, such as Corporate Headquarters.
        */
        address1_name: string;
        /**
        Type the ZIP Code or postal code for the primary address.
        */
        address1_postalcode: string;
        /**
        Select a shipping method for deliveries sent to this address.
        Valid values are:
        1 : Airborne
        2 : DHL
        3 : FedEx
        4 : UPS
        5 : Postal Mail
        6 : Full Load
        7 : Will Call
        */
        address1_shippingmethodcode: number;
        /**
        Type the state or province of the primary address.
        */
        address1_stateorprovince: string;
        /**
        Type the main phone number associated with the primary address.
        */
        address1_telephone1: string;
        /**
        Enter the date of the contact's wedding or service anniversary for use in customer gift programs or other communications.
        */
        anniversary: Date;
        /**
        Type the name of the contact's assistant.
        */
        assistantname: string;
        /**
        Type the phone number for the contact's assistant.
        */
        assistantphone: string;
        /**
        Enter the contact's birthday for use in customer gift programs or other communications.
        */
        birthdate: Date;
        /**
        Unique identifier of the contact.
        */
        contactid: string;
        /**
        Type the credit limit of the contact for reference when you address invoice and accounting issues with the customer.
        */
        creditlimit: number;
        /**
        Select whether the contact is on a credit hold, for reference when addressing invoice and accounting issues.
        Valid values are:
        1 : Yes
        0 : No
        */
        creditonhold: boolean;
        /**
        Type the department or business unit where the contact works in the parent company or business.
        */
        department: string;
        /**
        Type additional information to describe the contact, such as an excerpt from the company's website.
        */
        description: string;
        /**
        Select whether the contact accepts bulk email sent through marketing campaigns or quick campaigns. If Do Not Allow is selected, the contact can be added to marketing lists, but will be excluded from the email.
        Valid values are:
        1 : Do Not Allow
        0 : Allow
        */
        donotbulkemail: boolean;
        /**
        Select whether the contact allows direct email sent from Microsoft Dynamics CRM. If Do Not Allow is selected, Microsoft Dynamics CRM will not send the email.
        Valid values are:
        1 : Do Not Allow
        0 : Allow
        */
        donotemail: boolean;
        /**
        Select whether the contact allows faxes. If Do Not Allow is selected, the contact will be excluded from any fax activities distributed in marketing campaigns.
        Valid values are:
        1 : Do Not Allow
        0 : Allow
        */
        donotfax: boolean;
        /**
        Select whether the contact accepts phone calls. If Do Not Allow is selected, the contact will be excluded from any phone call activities distributed in marketing campaigns.
        Valid values are:
        1 : Do Not Allow
        0 : Allow
        */
        donotphone: boolean;
        /**
        Select whether the contact allows direct mail. If Do Not Allow is selected, the contact will be excluded from letter activities distributed in marketing campaigns.
        Valid values are:
        1 : Do Not Allow
        0 : Allow
        */
        donotpostalmail: boolean;
        /**
        Select whether the contact accepts marketing materials, such as brochures or catalogs. Contacts that opt out can be excluded from marketing initiatives.
        Valid values are:
        1 : Do Not Send
        0 : Send
        */
        donotsendmm: boolean;
        /**
        Type the primary email address for the contact.
        */
        emailaddress1: string;
        /**
        Select the marital status of the contact for reference in follow-up phone calls and other communications.
        Valid values are:
        1 : Single
        2 : Married
        3 : Divorced
        4 : Widowed
        */
        familystatuscode: number;
        /**
        Type the fax number for the contact.
        */
        fax: string;
        /**
        Type the contact's first name to make sure the contact is addressed correctly in sales calls, email, and marketing campaigns.
        */
        firstname: string;
        /**
        Combines and shows the contact's first and last names so that the full name can be displayed in views and reports.
        */
         fullname: string;
        /**
        Select the contact's gender to make sure the contact is addressed correctly in sales calls, email, and marketing campaigns.
        Valid values are:
        1 : Male
        2 : Female
        */
        gendercode: number;
        /**
        Type the job title of the contact to make sure the contact is addressed correctly in sales calls, email, and marketing campaigns.
        */
        jobtitle: string;
        /**
        Type the contact's last name to make sure the contact is addressed correctly in sales calls, email, and marketing campaigns.
        */
        lastname: string;
        /**
        Shows the date when the contact was last included in a marketing campaign or quick campaign.
        */
        lastusedincampaign: Date;
        /**
        Type the name of the contact's manager for use in escalating issues or other follow-up communications with the contact.
        */
        managername: string;
        /**
        Type the phone number for the contact's manager.
        */
        managerphone: string;
        /**
        Type the contact's middle name or initial to make sure the contact is addressed correctly.
        */
        middlename: string;
        /**
        Type the mobile phone number for the contact.
        */
        mobilephone: string;
        /**
        Select the payment terms to indicate when the customer needs to pay the total amount.
        Valid values are:
        1 : Net 30
        2 : 2% 10, Net 30
        3 : Net 45
        4 : Net 60
        */
        paymenttermscode: number;
        /**
        Select the preferred day of the week for service appointments.
        Valid values are:
        0 : Sunday
        1 : Monday
        2 : Tuesday
        3 : Wednesday
        4 : Thursday
        5 : Friday
        6 : Saturday
        */
        preferredappointmentdaycode: number;
        /**
        Select the preferred time of day for service appointments.
        Valid values are:
        1 : Morning
        2 : Afternoon
        3 : Evening
        */
        preferredappointmenttimecode: number;
        /**
        Select the preferred method of contact.
        Valid values are:
        1 : Any
        2 : Email
        3 : Phone
        4 : Fax
        5 : Mail
        */
        preferredcontactmethodcode: number;
        /**
        Type the salutation of the contact to make sure the contact is addressed correctly in sales calls, email messages, and marketing campaigns.
        */
        salutation: string;
        /**
        Type the name of the contact's spouse or partner for reference during calls, events, or other communications with the contact.
        */
        spousesname: string;
        /**
        Shows whether the contact is active or inactive. Inactive contacts are read-only and can't be edited unless they are reactivated.
        Valid values are:
        0 : Active
        1 : Inactive
        */
        statecode: number;
        /**
        Type the main phone number for this contact.
        */
        telephone1: string;
        /**
        Type a second phone number for this contact.
        */
        telephone2: string;
        /**
        Type the contact's professional or personal website or blog URL.
        */
        websiteurl: string;
        /**
        Read only: Unique identifier of the master contact for merge.
        */
         masterid: contact;
        /**
        Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
        This property can only be set on create to create a new related Demo.Tour.account
        */
        parentcustomerid_account: account;
        /**
        Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
        This property can only be set on create to create a new related Demo.Tour.contact
        */
        parentcustomerid_contact: contact;
        /**
        Set Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
        Value must be a URI to an existing Demo.Tour.account.
        */
        "parentcustomerid_account@odata.bind": string;
        /**
        Set Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
        Value must be a URI to an existing Demo.Tour.contact.
        */
        "parentcustomerid_contact@odata.bind": string;
        /**
        Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
         * @param uri The uri to an existing Demo.Tour.account.
        */
        parentcustomerid_accountUri(uri:string);
        /**
        Select the parent account or parent contact for the contact to provide a quick link to additional details, such as financial information, activities, and opportunities.
         * @param uri The uri to an existing Demo.Tour.contact.
        */
        parentcustomerid_contactUri(uri:string);
        /**
        A collection of related Demo.Tour.account
        */
        account_primary_contact: Array<Demo.Tour.account>;
        /**
        A collection of related Demo.Tour.activitypointer
        */
        Contact_ActivityPointers: Array<Demo.Tour.activitypointer>;
        /**
        A collection of related Demo.Tour.incident
        */
        contact_as_primary_contact: Array<Demo.Tour.incident>;
        /**
        A collection of related Demo.Tour.incident
        */
        contact_as_responsible_contact: Array<Demo.Tour.incident>;
        /**
        A collection of related Demo.Tour.contact
        */
        contact_customer_contacts: Array<Demo.Tour.contact>;
        /**
        A collection of related Demo.Tour.contact
        */
        contact_master_contact: Array<Demo.Tour.contact>;
        /**
        A collection of related Demo.Tour.phonecall
        */
        Contact_Phonecalls: Array<Demo.Tour.phonecall>;
        /**
        A collection of related Demo.Tour.task
        */
        Contact_Tasks: Array<Demo.Tour.task>;
        /**
        A collection of related Demo.Tour.incident
        */
        incident_customer_contacts: Array<Demo.Tour.incident>;
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
         isEntityClass: boolean;
        // crmbaseentity implementation START
        /**
        Name of the the task entity.
        */
         type: string;
        /**
        Primary key for the task entity: 'activityid'
        */
         primaryKey: string;
        /**
        Web API entity set name for the task entity: 'tasks'
        */
         entitySetName: string;
        
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
         properties: taskProperties;
         lookups: taskLookups;
         collections: taskCollections;
        /**
        Type a category to identify the task type, such as lead gathering or customer follow up, to tie the task to a business group or function.
        */
        category: string;
        /**
        Type the percentage complete value for the task to track tasks to completion.
        */
        percentcomplete: number;
        /**
        Type a subcategory to identify the task type and relate the activity to a specific product, sales region, business group, or other function.
        */
        subcategory: string;
        /**
        Unique identifier of the task.
        This property can only be set on create to create a new related Demo.Tour.activitypointer
        */
        activityid_activitypointer: activitypointer;
        /**
        Choose the record that the task relates to.
        This property can only be set on create to create a new related Demo.Tour.account
        */
        regardingobjectid_account_task: account;
        /**
        Choose the record that the task relates to.
        This property can only be set on create to create a new related Demo.Tour.contact
        */
        regardingobjectid_contact_task: contact;
        /**
        Choose the record that the task relates to.
        This property can only be set on create to create a new related Demo.Tour.incident
        */
        regardingobjectid_incident_task: incident;
        /**
        Set Unique identifier of the task.
        Value must be a URI to an existing Demo.Tour.activitypointer.
        */
        "activityid_activitypointer@odata.bind": string;
        /**
        Set Choose the record that the task relates to.
        Value must be a URI to an existing Demo.Tour.account.
        */
        "regardingobjectid_account_task@odata.bind": string;
        /**
        Set Choose the record that the task relates to.
        Value must be a URI to an existing Demo.Tour.contact.
        */
        "regardingobjectid_contact_task@odata.bind": string;
        /**
        Set Choose the record that the task relates to.
        Value must be a URI to an existing Demo.Tour.incident.
        */
        "regardingobjectid_incident_task@odata.bind": string;
        /**
        Unique identifier of the task.
         * @param uri The uri to an existing Demo.Tour.activitypointer.
        */
        activityid_activitypointerUri(uri:string);
        /**
        Choose the record that the task relates to.
         * @param uri The uri to an existing Demo.Tour.account.
        */
        regardingobjectid_account_taskUri(uri:string);
        /**
        Choose the record that the task relates to.
         * @param uri The uri to an existing Demo.Tour.contact.
        */
        regardingobjectid_contact_taskUri(uri:string);
        /**
        Choose the record that the task relates to.
         * @param uri The uri to an existing Demo.Tour.incident.
        */
        regardingobjectid_incident_taskUri(uri:string);
        /**
        Unique identifier of the activity.
        */
        activityid: string;
        /**
        Actual duration of the activity in minutes.
        */
        actualdurationminutes: number;
        /**
        Actual end time of the activity.
        */
        actualend: Date;
        /**
        Actual start time of the activity.
        */
        actualstart: Date;
        /**
        Shows how contact about the social activity originated, such as from Twitter or Facebook. This field is read-only.
        Valid values are:
        1 : Facebook
        2 : Twitter
        0 : Other
        */
        community: number;
        /**
        Date and time when the activity was created.
        */
         createdon: Date;
        /**
        Date and time when the delivery of the activity was last attempted.
        */
         deliverylastattemptedon: Date;
        /**
        Priority of delivery of the activity to the email server.
        Valid values are:
        0 : Low
        1 : Normal
        2 : High
        */
        deliveryprioritycode: number;
        /**
        Description of the activity.
        */
        description: string;
        /**
        Exchange rate for the currency associated with the activitypointer with respect to the base currency.
        */
         exchangerate: number;
        /**
        Information regarding whether the activity was billed as part of resolving a case.
        Valid values are:
        1 : Yes
        0 : No
        */
        isbilled: boolean;
        /**
        For internal use only.
        Valid values are:
        1 : Yes
        0 : No
        */
        ismapiprivate: boolean;
        /**
        Information regarding whether the activity is a regular activity type or event type.
        Valid values are:
        1 : Yes
        0 : No
        */
         isregularactivity: boolean;
        /**
        Information regarding whether the activity was created from a workflow rule.
        Valid values are:
        1 : Yes
        0 : No
        */
        isworkflowcreated: boolean;
        /**
        Contains the date and time stamp of the last on hold time.
        */
        lastonholdtime: Date;
        /**
        Left the voice mail
        Valid values are:
        1 : Yes
        0 : No
        */
        leftvoicemail: boolean;
        /**
        Date and time when activity was last modified.
        */
         modifiedon: Date;
        /**
        Shows how long, in minutes, that the record was on hold.
        */
         onholdtime: number;
        /**
        For internal use only.
        */
         postponeactivityprocessinguntil: Date;
        /**
        Priority of the activity.
        Valid values are:
        0 : Low
        1 : Normal
        2 : High
        */
        prioritycode: number;
        /**
        Unique identifier of the Process.
        */
        processid: string;
        /**
        Scheduled duration of the activity, specified in minutes.
        */
        scheduleddurationminutes: number;
        /**
        Scheduled end time of the activity.
        */
        scheduledend: Date;
        /**
        Scheduled start time of the activity.
        */
        scheduledstart: Date;
        /**
        Status of the activity.
        Valid values are:
        0 : Open
        1 : Completed
        2 : Canceled
        3 : Scheduled
        */
        statecode: number;
        /**
        Reason for the status of the activity.
        Valid values are:
        1 : Open
        2 : Completed
        3 : Canceled
        4 : Scheduled
        */
        statuscode: number;
        /**
        Subject associated with the activity.
        */
        subject: string;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.account
        */
        regardingobjectid_account: account;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.contact
        */
        regardingobjectid_contact: contact;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.incident
        */
        regardingobjectid_incident: incident;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.account.
        */
        "regardingobjectid_account@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.contact.
        */
        "regardingobjectid_contact@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.incident.
        */
        "regardingobjectid_incident@odata.bind": string;
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.account.
        */
        regardingobjectid_accountUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.contact.
        */
        regardingobjectid_contactUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.incident.
        */
        regardingobjectid_incidentUri(uri:string);
        /**
        A collection of related Demo.Tour.incidentresolution
        */
        activity_pointer_incident_resolution: Array<Demo.Tour.incidentresolution>;
        /**
        A collection of related Demo.Tour.phonecall
        */
        activity_pointer_phonecall: Array<Demo.Tour.phonecall>;
        /**
        A collection of related Demo.Tour.task
        */
        activity_pointer_task: Array<Demo.Tour.task>;
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
         isEntityClass: boolean;
        // crmbaseentity implementation START
        /**
        Name of the the incident entity.
        */
         type: string;
        /**
        Primary key for the incident entity: 'incidentid'
        */
         primaryKey: string;
        /**
        Web API entity set name for the incident entity: 'incidents'
        */
         entitySetName: string;
        
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
         properties: incidentProperties;
         lookups: incidentLookups;
         collections: incidentCollections;
        /**
        Details whether the profile is blocked or not.
        Valid values are:
        1 : Yes
        0 : No
        */
        blockedprofile: boolean;
        /**
        Select how contact about the case was originated, such as email, phone, or web, for use in reporting and analysis.
        Valid values are:
        1 : Phone
        2 : Email
        3 : Web
        2483 : Facebook
        3986 : Twitter
        */
        caseorigincode: number;
        /**
        Select the type of case to identify the incident for use in case routing and analysis.
        Valid values are:
        1 : Question
        2 : Problem
        3 : Request
        */
        casetypecode: number;
        /**
        Select the service level for the case to make sure the case is handled correctly.
        Valid values are:
        1 : Gold
        2 : Silver
        3 : Bronze
        */
        contractservicelevelcode: number;
        /**
        Shows the date and time when the record was created. The date and time are displayed in the time zone selected in Microsoft Dynamics CRM options.
        */
         createdon: Date;
        /**
        Select the customer's level of satisfaction with the handling and resolution of the case.
        Valid values are:
        5 : Very Satisfied
        4 : Satisfied
        3 : Neutral
        2 : Dissatisfied
        1 : Very Dissatisfied
        */
        customersatisfactioncode: number;
        /**
        Type additional information to describe the case to assist the service team in reaching a resolution.
        */
        description: string;
        /**
        Indicates the date and time when the case was escalated.
        */
         escalatedon: Date;
        /**
        Indicates if the first response has been sent.
        Valid values are:
        1 : Yes
        0 : No
        */
        firstresponsesent: boolean;
        /**
        Enter the date by which a customer service representative has to follow up with the customer on this case.
        */
        followupby: Date;
        /**
        Unique identifier of the case.
        */
        incidentid: string;
        /**
        Will contain the Influencer score coming from NetBreeze.
        */
        influencescore: number;
        /**
        Indicates if the case has been escalated.
        Valid values are:
        1 : Yes
        0 : No
        */
        isescalated: boolean;
        /**
        Shows whether the post originated as a public or private message.
        Valid values are:
        0 : Public Message
        1 : Private Message
        */
        messagetypecode: number;
        /**
        Select the priority so that preferred customers or critical issues are handled quickly.
        Valid values are:
        1 : High
        2 : Normal
        3 : Low
        */
        prioritycode: number;
        /**
        Type the serial number of the product that is associated with this case, so that the number of cases per product can be reported.
        */
        productserialnumber: string;
        /**
        Enter the date by when the case must be resolved.
        */
        resolveby: Date;
        /**
        For internal use only.
        */
        responseby: Date;
        /**
        Value derived after assessing words commonly associated with a negative, neutral, or positive sentiment that occurs in a social post. Sentiment information can also be reported as numeric values.
        */
        sentimentvalue: number;
        /**
        Shows whether the case is active, resolved, or canceled. Resolved and canceled cases are read-only and can't be edited unless they are reactivated.
        Valid values are:
        0 : Active
        1 : Resolved
        2 : Canceled
        */
        statecode: number;
        /**
        Select the case's status.
        Valid values are:
        5 : Problem Solved
        1000 : Information Provided
        6 : Canceled
        2000 : Merged
        1 : In Progress
        2 : On Hold
        3 : Waiting for Details
        4 : Researching
        */
        statuscode: number;
        /**
        Shows the case number for customer reference and searching capabilities. This cannot be modified.
        */
        ticketnumber: string;
        /**
        Type a subject or descriptive name, such as the request, issue, or company name, to identify the case in Microsoft Dynamics CRM views.
        */
        title: string;
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
        This property can only be set on create to create a new related Demo.Tour.account
        */
        customerid_account: account;
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
        This property can only be set on create to create a new related Demo.Tour.contact
        */
        customerid_contact: contact;
        /**
        Select an existing case for the customer that has been populated. For internal use only.
        This property can only be set on create to create a new related Demo.Tour.incident
        */
        existingcase: incident;
        /**
        Choose the primary case the current case was merged into.
        This property can only be set on create to create a new related Demo.Tour.incident
        */
        masterid: incident;
        /**
        Choose the parent case for a case.
        This property can only be set on create to create a new related Demo.Tour.incident
        */
        parentcaseid: incident;
        /**
        Select a primary contact for this case.
        This property can only be set on create to create a new related Demo.Tour.contact
        */
        primarycontactid: contact;
        /**
        Choose an additional customer contact who can also help resolve the case.
        This property can only be set on create to create a new related Demo.Tour.contact
        */
        responsiblecontactid: contact;
        /**
        Set Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
        Value must be a URI to an existing Demo.Tour.account.
        */
        "customerid_account@odata.bind": string;
        /**
        Set Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
        Value must be a URI to an existing Demo.Tour.contact.
        */
        "customerid_contact@odata.bind": string;
        /**
        Set Select an existing case for the customer that has been populated. For internal use only.
        Value must be a URI to an existing Demo.Tour.incident.
        */
        "existingcase@odata.bind": string;
        /**
        Set Choose the primary case the current case was merged into.
        Value must be a URI to an existing Demo.Tour.incident.
        */
        "masterid@odata.bind": string;
        /**
        Set Choose the parent case for a case.
        Value must be a URI to an existing Demo.Tour.incident.
        */
        "parentcaseid@odata.bind": string;
        /**
        Set Select a primary contact for this case.
        Value must be a URI to an existing Demo.Tour.contact.
        */
        "primarycontactid@odata.bind": string;
        /**
        Set Choose an additional customer contact who can also help resolve the case.
        Value must be a URI to an existing Demo.Tour.contact.
        */
        "responsiblecontactid@odata.bind": string;
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
         * @param uri The uri to an existing Demo.Tour.account.
        */
        customerid_accountUri(uri:string);
        /**
        Select the customer account or contact to provide a quick link to additional customer details, such as account information, activities, and opportunities.
         * @param uri The uri to an existing Demo.Tour.contact.
        */
        customerid_contactUri(uri:string);
        /**
        Select an existing case for the customer that has been populated. For internal use only.
         * @param uri The uri to an existing Demo.Tour.incident.
        */
        existingcaseUri(uri:string);
        /**
        Choose the primary case the current case was merged into.
         * @param uri The uri to an existing Demo.Tour.incident.
        */
        masteridUri(uri:string);
        /**
        Choose the parent case for a case.
         * @param uri The uri to an existing Demo.Tour.incident.
        */
        parentcaseidUri(uri:string);
        /**
        Select a primary contact for this case.
         * @param uri The uri to an existing Demo.Tour.contact.
        */
        primarycontactidUri(uri:string);
        /**
        Choose an additional customer contact who can also help resolve the case.
         * @param uri The uri to an existing Demo.Tour.contact.
        */
        responsiblecontactidUri(uri:string);
        /**
        A collection of related Demo.Tour.activitypointer
        */
        Incident_ActivityPointers: Array<Demo.Tour.activitypointer>;
        /**
        A collection of related Demo.Tour.incident
        */
        incident_existingcase: Array<Demo.Tour.incident>;
        /**
        A collection of related Demo.Tour.incidentresolution
        */
        Incident_IncidentResolutions: Array<Demo.Tour.incidentresolution>;
        /**
        A collection of related Demo.Tour.incident
        */
        incident_master_incident: Array<Demo.Tour.incident>;
        /**
        A collection of related Demo.Tour.incident
        */
        incident_parent_incident: Array<Demo.Tour.incident>;
        /**
        A collection of related Demo.Tour.phonecall
        */
        Incident_Phonecalls: Array<Demo.Tour.phonecall>;
        /**
        A collection of related Demo.Tour.task
        */
        Incident_Tasks: Array<Demo.Tour.task>;
    }

/**
Special type of activity that includes description of the resolution, billing status, and the duration of the case.
*/
    class incidentresolution implements activitypointer {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param incidentresolutionReference
         */
        constructor(incidentresolutionReference?: string | Object)
         isEntityClass: boolean;
        // crmbaseentity implementation START
        /**
        Name of the the incidentresolution entity.
        */
         type: string;
        /**
        Primary key for the incidentresolution entity: 'activityid'
        */
         primaryKey: string;
        /**
        Web API entity set name for the incidentresolution entity: 'incidentresolutions'
        */
         entitySetName: string;
        
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
         properties: incidentresolutionProperties;
         lookups: incidentresolutionLookups;
         collections: incidentresolutionCollections;
        /**
        Category for the case resolution activity.
        */
        category: string;
        /**
        Subcategory of the case resolution activity.
        */
        subcategory: string;
        /**
        Time spent on the case resolution activity.
        */
        timespent: number;
        /**
        Unique identifier of the case resolution activity.
        This property can only be set on create to create a new related Demo.Tour.activitypointer
        */
        activityid_activitypointer: activitypointer;
        /**
        Unique identifier of the case.
        This property can only be set on create to create a new related Demo.Tour.incident
        */
        incidentid: incident;
        /**
        Set Unique identifier of the case resolution activity.
        Value must be a URI to an existing Demo.Tour.activitypointer.
        */
        "activityid_activitypointer@odata.bind": string;
        /**
        Set Unique identifier of the case.
        Value must be a URI to an existing Demo.Tour.incident.
        */
        "incidentid@odata.bind": string;
        /**
        Unique identifier of the case resolution activity.
         * @param uri The uri to an existing Demo.Tour.activitypointer.
        */
        activityid_activitypointerUri(uri:string);
        /**
        Unique identifier of the case.
         * @param uri The uri to an existing Demo.Tour.incident.
        */
        incidentidUri(uri:string);
        /**
        Unique identifier of the activity.
        */
        activityid: string;
        /**
        Actual duration of the activity in minutes.
        */
        actualdurationminutes: number;
        /**
        Actual end time of the activity.
        */
        actualend: Date;
        /**
        Actual start time of the activity.
        */
        actualstart: Date;
        /**
        Shows how contact about the social activity originated, such as from Twitter or Facebook. This field is read-only.
        Valid values are:
        1 : Facebook
        2 : Twitter
        0 : Other
        */
        community: number;
        /**
        Date and time when the activity was created.
        */
         createdon: Date;
        /**
        Date and time when the delivery of the activity was last attempted.
        */
         deliverylastattemptedon: Date;
        /**
        Priority of delivery of the activity to the email server.
        Valid values are:
        0 : Low
        1 : Normal
        2 : High
        */
        deliveryprioritycode: number;
        /**
        Description of the activity.
        */
        description: string;
        /**
        Exchange rate for the currency associated with the activitypointer with respect to the base currency.
        */
         exchangerate: number;
        /**
        Information regarding whether the activity was billed as part of resolving a case.
        Valid values are:
        1 : Yes
        0 : No
        */
        isbilled: boolean;
        /**
        For internal use only.
        Valid values are:
        1 : Yes
        0 : No
        */
        ismapiprivate: boolean;
        /**
        Information regarding whether the activity is a regular activity type or event type.
        Valid values are:
        1 : Yes
        0 : No
        */
         isregularactivity: boolean;
        /**
        Information regarding whether the activity was created from a workflow rule.
        Valid values are:
        1 : Yes
        0 : No
        */
        isworkflowcreated: boolean;
        /**
        Contains the date and time stamp of the last on hold time.
        */
        lastonholdtime: Date;
        /**
        Left the voice mail
        Valid values are:
        1 : Yes
        0 : No
        */
        leftvoicemail: boolean;
        /**
        Date and time when activity was last modified.
        */
         modifiedon: Date;
        /**
        Shows how long, in minutes, that the record was on hold.
        */
         onholdtime: number;
        /**
        For internal use only.
        */
         postponeactivityprocessinguntil: Date;
        /**
        Priority of the activity.
        Valid values are:
        0 : Low
        1 : Normal
        2 : High
        */
        prioritycode: number;
        /**
        Unique identifier of the Process.
        */
        processid: string;
        /**
        Scheduled duration of the activity, specified in minutes.
        */
        scheduleddurationminutes: number;
        /**
        Scheduled end time of the activity.
        */
        scheduledend: Date;
        /**
        Scheduled start time of the activity.
        */
        scheduledstart: Date;
        /**
        Status of the activity.
        Valid values are:
        0 : Open
        1 : Completed
        2 : Canceled
        3 : Scheduled
        */
        statecode: number;
        /**
        Reason for the status of the activity.
        Valid values are:
        1 : Open
        2 : Completed
        3 : Canceled
        4 : Scheduled
        */
        statuscode: number;
        /**
        Subject associated with the activity.
        */
        subject: string;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.account
        */
        regardingobjectid_account: account;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.contact
        */
        regardingobjectid_contact: contact;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.incident
        */
        regardingobjectid_incident: incident;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.account.
        */
        "regardingobjectid_account@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.contact.
        */
        "regardingobjectid_contact@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.incident.
        */
        "regardingobjectid_incident@odata.bind": string;
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.account.
        */
        regardingobjectid_accountUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.contact.
        */
        regardingobjectid_contactUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.incident.
        */
        regardingobjectid_incidentUri(uri:string);
        /**
        A collection of related Demo.Tour.incidentresolution
        */
        activity_pointer_incident_resolution: Array<Demo.Tour.incidentresolution>;
        /**
        A collection of related Demo.Tour.phonecall
        */
        activity_pointer_phonecall: Array<Demo.Tour.phonecall>;
        /**
        A collection of related Demo.Tour.task
        */
        activity_pointer_task: Array<Demo.Tour.task>;
    }

/**
Activity to track a telephone call.
*/
    class phonecall implements activitypointer {
        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param phonecallReference
         */
        constructor(phonecallReference?: string | Object)
         isEntityClass: boolean;
        // crmbaseentity implementation START
        /**
        Name of the the phonecall entity.
        */
         type: string;
        /**
        Primary key for the phonecall entity: 'activityid'
        */
         primaryKey: string;
        /**
        Web API entity set name for the phonecall entity: 'phonecalls'
        */
         entitySetName: string;
        
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
         properties: phonecallProperties;
         lookups: phonecallLookups;
         collections: phonecallCollections;
        /**
        Type a category to identify the phone call type, such as lead gathering or customer follow-up, to tie the phone call to a business group or function.
        */
        category: string;
        /**
        Select the direction of the phone call as incoming or outbound.
        Valid values are:
        1 : Outgoing
        0 : Incoming
        */
        directioncode: boolean;
        /**
        Type the phone number.
        */
        phonenumber: string;
        /**
        Type a subcategory to identify the phone call type and relate the activity to a specific product, sales region, business group, or other function.
        */
        subcategory: string;
        /**
        Unique identifier of the phone call activity.
        This property can only be set on create to create a new related Demo.Tour.activitypointer
        */
        activityid_activitypointer: activitypointer;
        /**
        Choose the record that the phone call relates to.
        This property can only be set on create to create a new related Demo.Tour.account
        */
        regardingobjectid_account_phonecall: account;
        /**
        Choose the record that the phone call relates to.
        This property can only be set on create to create a new related Demo.Tour.contact
        */
        regardingobjectid_contact_phonecall: contact;
        /**
        Choose the record that the phone call relates to.
        This property can only be set on create to create a new related Demo.Tour.incident
        */
        regardingobjectid_incident_phonecall: incident;
        /**
        Set Unique identifier of the phone call activity.
        Value must be a URI to an existing Demo.Tour.activitypointer.
        */
        "activityid_activitypointer@odata.bind": string;
        /**
        Set Choose the record that the phone call relates to.
        Value must be a URI to an existing Demo.Tour.account.
        */
        "regardingobjectid_account_phonecall@odata.bind": string;
        /**
        Set Choose the record that the phone call relates to.
        Value must be a URI to an existing Demo.Tour.contact.
        */
        "regardingobjectid_contact_phonecall@odata.bind": string;
        /**
        Set Choose the record that the phone call relates to.
        Value must be a URI to an existing Demo.Tour.incident.
        */
        "regardingobjectid_incident_phonecall@odata.bind": string;
        /**
        Unique identifier of the phone call activity.
         * @param uri The uri to an existing Demo.Tour.activitypointer.
        */
        activityid_activitypointerUri(uri:string);
        /**
        Choose the record that the phone call relates to.
         * @param uri The uri to an existing Demo.Tour.account.
        */
        regardingobjectid_account_phonecallUri(uri:string);
        /**
        Choose the record that the phone call relates to.
         * @param uri The uri to an existing Demo.Tour.contact.
        */
        regardingobjectid_contact_phonecallUri(uri:string);
        /**
        Choose the record that the phone call relates to.
         * @param uri The uri to an existing Demo.Tour.incident.
        */
        regardingobjectid_incident_phonecallUri(uri:string);
        /**
        Unique identifier of the activity.
        */
        activityid: string;
        /**
        Actual duration of the activity in minutes.
        */
        actualdurationminutes: number;
        /**
        Actual end time of the activity.
        */
        actualend: Date;
        /**
        Actual start time of the activity.
        */
        actualstart: Date;
        /**
        Shows how contact about the social activity originated, such as from Twitter or Facebook. This field is read-only.
        Valid values are:
        1 : Facebook
        2 : Twitter
        0 : Other
        */
        community: number;
        /**
        Date and time when the activity was created.
        */
         createdon: Date;
        /**
        Date and time when the delivery of the activity was last attempted.
        */
         deliverylastattemptedon: Date;
        /**
        Priority of delivery of the activity to the email server.
        Valid values are:
        0 : Low
        1 : Normal
        2 : High
        */
        deliveryprioritycode: number;
        /**
        Description of the activity.
        */
        description: string;
        /**
        Exchange rate for the currency associated with the activitypointer with respect to the base currency.
        */
         exchangerate: number;
        /**
        Information regarding whether the activity was billed as part of resolving a case.
        Valid values are:
        1 : Yes
        0 : No
        */
        isbilled: boolean;
        /**
        For internal use only.
        Valid values are:
        1 : Yes
        0 : No
        */
        ismapiprivate: boolean;
        /**
        Information regarding whether the activity is a regular activity type or event type.
        Valid values are:
        1 : Yes
        0 : No
        */
         isregularactivity: boolean;
        /**
        Information regarding whether the activity was created from a workflow rule.
        Valid values are:
        1 : Yes
        0 : No
        */
        isworkflowcreated: boolean;
        /**
        Contains the date and time stamp of the last on hold time.
        */
        lastonholdtime: Date;
        /**
        Left the voice mail
        Valid values are:
        1 : Yes
        0 : No
        */
        leftvoicemail: boolean;
        /**
        Date and time when activity was last modified.
        */
         modifiedon: Date;
        /**
        Shows how long, in minutes, that the record was on hold.
        */
         onholdtime: number;
        /**
        For internal use only.
        */
         postponeactivityprocessinguntil: Date;
        /**
        Priority of the activity.
        Valid values are:
        0 : Low
        1 : Normal
        2 : High
        */
        prioritycode: number;
        /**
        Unique identifier of the Process.
        */
        processid: string;
        /**
        Scheduled duration of the activity, specified in minutes.
        */
        scheduleddurationminutes: number;
        /**
        Scheduled end time of the activity.
        */
        scheduledend: Date;
        /**
        Scheduled start time of the activity.
        */
        scheduledstart: Date;
        /**
        Status of the activity.
        Valid values are:
        0 : Open
        1 : Completed
        2 : Canceled
        3 : Scheduled
        */
        statecode: number;
        /**
        Reason for the status of the activity.
        Valid values are:
        1 : Open
        2 : Completed
        3 : Canceled
        4 : Scheduled
        */
        statuscode: number;
        /**
        Subject associated with the activity.
        */
        subject: string;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.account
        */
        regardingobjectid_account: account;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.contact
        */
        regardingobjectid_contact: contact;
        /**
        Unique identifier of the object with which the activity is associated.
        This property can only be set on create to create a new related Demo.Tour.incident
        */
        regardingobjectid_incident: incident;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.account.
        */
        "regardingobjectid_account@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.contact.
        */
        "regardingobjectid_contact@odata.bind": string;
        /**
        Set Unique identifier of the object with which the activity is associated.
        Value must be a URI to an existing Demo.Tour.incident.
        */
        "regardingobjectid_incident@odata.bind": string;
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.account.
        */
        regardingobjectid_accountUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.contact.
        */
        regardingobjectid_contactUri(uri:string);
        /**
        Unique identifier of the object with which the activity is associated.
         * @param uri The uri to an existing Demo.Tour.incident.
        */
        regardingobjectid_incidentUri(uri:string);
        /**
        A collection of related Demo.Tour.incidentresolution
        */
        activity_pointer_incident_resolution: Array<Demo.Tour.incidentresolution>;
        /**
        A collection of related Demo.Tour.phonecall
        */
        activity_pointer_phonecall: Array<Demo.Tour.phonecall>;
        /**
        A collection of related Demo.Tour.task
        */
        activity_pointer_task: Array<Demo.Tour.task>;
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
    * Initializes a Written record from an existing record.
    * @param entityMoniker The record that is the source for initializing.
    * @param targetEntityName The logical name of the target entity.
    * @param targetFieldType Attributes that are to be initialized in the initialized instance.
    * @param callerId A string representation of the GUID value for the user to impersonate
    */
    function InitializeFrom(
        entityMoniker: crmbaseentity,
        targetEntityName: string,
        targetFieldType: TargetFieldType,
        callerId?: string
): Promise<crmbaseentity>;
    /**
    * Retrieves system information for the currently logged on user.
    */
    function WhoAmI(): Promise<WhoAmIResponse>;

    /**
    * Closes an incident (case).
    * @param incidentResolution Incident resolution (case resolution) that is associated with the incident (case) to be closed. (Required)
    * @param status Status of the incident. (Required)
    * @param [callerId] A string representation of the GUID value for the user to impersonate
    */
    function CloseIncident(
        incidentResolution: incidentresolution,
        status: number,
        callerId?: string
    ): Promise<void>;

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

    /**
    * Indicates the attribute type for the target of the InitializeFromRequest message.
    * @member All Initialize all possible attribute values.
    * @member ValidForCreate Initialize the attribute values that are valid for create.
    * @member ValidForUpdate Initialize the attribute values that are valid for update.
    * @member ValidForRead Initialize the attribute values that are valid for read.
    */
    type TargetFieldType = "All"|"ValidForCreate"|"ValidForUpdate"|"ValidForRead";

    // MODELDEFINITIONS END


    /**
     * Create a new entity
     * @param entity A Demo.Tour.crmbaseentity with the properties for the entity you want to create.
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise with the uri for the entity created.
     */
    function create(
        entity: crmbaseentity,
        callerId?: string): Promise<string>;

    /**
     * Create a new entity and retrieve it
     * @param entity A Demo.Tour.crmbaseentity with the properties for the entity you want to create.
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
     * @param entity A Demo.Tour.crmbaseentity with the properties for the entity you want to create.
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
     * @param entity A Demo.Tour.crmbaseentity that you want to update
     * @param cancelWhenOlder Whether to cancel update when the server version is newer. Default is false;
     * @param callerId A string representation of the GUID value for the user to impersonate.
     * @returns A Promise that is resolved when successful or rejected with an error;
     */
    function update(entity: crmbaseentity, cancelWhenOlder?: boolean,  callerId?: string): Promise<void>

    /**
     * Create an entity if it doesn't exist, otherwise update existing entity
     * @param entity A Demo.Tour.crmbaseentity that you want to upsert
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
     * Return the next page from the results of an Demo.Tour.query when there are more pages
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
     * @param JSONentity The retrieved JSON entity that is not an instance of Demo.Tour.crmbaseentity
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