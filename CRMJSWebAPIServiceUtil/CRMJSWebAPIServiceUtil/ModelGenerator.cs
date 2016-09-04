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
using System;
using System.Collections.Generic;
using System.Xml.Linq;
using CrmWebAPIModel;
using System.Linq;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Net.Http;
using System.Net;
using CRMWebAPILoginControl;
using Microsoft.Crm.Sdk.Samples.HelperCode;
using System.Net.Http.Headers;

namespace CRMJSWebAPIServiceUtil
{
    class ModelGenerator
    {

        public ModelGenerator(ObservableConfiguration config, Authentication auth) {
            this.config = config;
            this.auth = auth;
        }
        private ObservableConfiguration config;
        private Authentication auth = null;

        private XNamespace edmx = "http://docs.oasis-open.org/odata/ns/edmx";
        private XNamespace mscrm = "http://docs.oasis-open.org/odata/ns/edm";

        public XDocument serviceDocument { get; set; }
        public List<string> entityNames { get; set; }

        public List<EntityProperties> entityProperties { get; set; }

        public List<string> actionNames { get; set; }

        public List<string> functionNames { get; set; }

        private List<string> complexTypeNames { get; set; }

        private List<string> enumTypeNames { get; set; }

        public XDocument actionDescriptions { get; set; }
        public XDocument functionDescriptions { get; set; }
        public XDocument complexTypeDescriptions { get; set; }
        public XDocument enumTypeDescriptions { get; set; }

        public string webAPIVersion { get; set; }

        public Model getModel() {
            complexTypeNames = new List<string>();
            enumTypeNames = new List<string>();
            addActionDependencies();
            addFunctionDependencies();
            addComplexTypeDependencies();
            addBaseEntities();

            Model model = new Model();
            model.Actions = getActions();
            model.ComplexTypes = getComplexTypes();
            model.Entities = getEntities();
            model.EnumTypes = getEnumTypes();
            model.Functions = getFunctions();
            model.webAPIVersion = webAPIVersion;
            return model;
        }

        private void addActionDependencies()
        {
            List<string> actionChildren = new List<string>();

            foreach (string actionName in actionNames)
            {

                IEnumerable<XElement> actionElements = getElementsFromServiceDoc("Action", actionName);
                foreach (XElement actionElement in actionElements)
                {

                    foreach (XElement item in actionElement.Elements())
                    {
                        string type = item.Attribute("Type").Value;

                        if (type.StartsWith("mscrm."))
                        {
                            type = type.Substring(6);
                            if (!actionChildren.Contains(type))
                            {
                                actionChildren.Add(type);
                            }
                        }

                        if (type.StartsWith("Collection(mscrm."))
                        {
                            type = type.Substring("Collection(mscrm.".Length);
                            type = type.Replace(")", String.Empty);
                            if (!actionChildren.Contains(type))
                            {
                                actionChildren.Add(type);
                            }
                        }
                    }
                }
            }

            foreach (string name in actionChildren)
            {
                string type = getType(name);
                switch (type)
                {

                    case "EntityType":
                        if (!entityNames.Contains(name))
                        {
                            entityNames.Add(name);
                        }

                        break;
                    case "ComplexType":
                        if (!complexTypeNames.Contains(name))
                        {
                            complexTypeNames.Add(name);
                        }
                        break;
                    case "EnumType":
                        if (!enumTypeNames.Contains(name))
                        {
                            enumTypeNames.Add(name);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        private void addFunctionDependencies()
        {
            List<string> functionChildren = new List<string>();
            foreach (string functionName in functionNames)
            {
                IEnumerable<XElement> functionElements = getElementsFromServiceDoc("Function", functionName);
                foreach (XElement functionElement in functionElements)
                {

                    foreach (XElement item in functionElement.Elements())
                    {
                        string type = item.Attribute("Type").Value;

                        if (type.StartsWith("mscrm."))
                        {
                            type = type.Substring(6);
                            if (!functionChildren.Contains(type))
                            {
                                functionChildren.Add(type);
                            }
                        }

                        if (type.StartsWith("Collection(mscrm."))
                        {
                            type = type.Substring("Collection(mscrm.".Length);
                            type = type.Replace(")", String.Empty);
                            if (!functionChildren.Contains(type))
                            {
                                functionChildren.Add(type);
                            }
                        }
                    }
                }
            }

            foreach (string name in functionChildren)
            {
                string type = getType(name);
                switch (type)
                {

                    case "EntityType":
                        if (!entityNames.Contains(name))
                        {
                            entityNames.Add(name);
                        }

                        break;
                    case "ComplexType":
                        if (!complexTypeNames.Contains(name))
                        {
                            complexTypeNames.Add(name);
                        }

                        foreach (string complexTypeName in getComplexTypesUsedInComplexTypes(name))
                        {
                            if (!complexTypeNames.Contains(complexTypeName))
                            {
                                complexTypeNames.Add(complexTypeName);
                            }

                            foreach (string enumTypeName in getEnumTypesUsedInComplexTypes(complexTypeName))
                            {
                                if (!enumTypeNames.Contains(enumTypeName))
                                {
                                    enumTypeNames.Add(enumTypeName);
                                }
                            }
                        }
                        break;
                    case "EnumType":
                        if (!enumTypeNames.Contains(name))
                        {
                            enumTypeNames.Add(name);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        private void addComplexTypeDependencies()
        {
            List<string> complexTypeChildren = new List<string>();
            foreach (string complexTypeName in complexTypeNames)
            {
                XElement complexTypeElement = getElementsFromServiceDoc("ComplexType", complexTypeName).FirstOrDefault();

                foreach (XElement item in complexTypeElement.Elements())
                {
                    string type = item.Attribute("Type").Value;

                    if (type.StartsWith("mscrm."))
                    {
                        type = type.Substring(6);
                        if (!complexTypeChildren.Contains(type))
                        {
                            complexTypeChildren.Add(type);
                        }
                    }

                    if (type.StartsWith("Collection(mscrm."))
                    {
                        type = type.Substring("Collection(mscrm.".Length);
                        type = type.Replace(")", String.Empty);
                        if (!complexTypeChildren.Contains(type))
                        {
                            complexTypeChildren.Add(type);
                        }
                    }
                }

            }

            foreach (string name in complexTypeChildren)
            {
                string type = getType(name);
                switch (type)
                {
                    case "ComplexType":
                        if (!complexTypeNames.Contains(name))
                        {
                            complexTypeNames.Add(name);
                            List<string> newComplexTypes = getComplexTypesUsedInComplexTypes(name);

                            complexTypeNames = complexTypeNames.Union(newComplexTypes).ToList();

                            foreach (string enumTypeName in getEnumTypesUsedInComplexTypes(name))
                            {
                                if (!enumTypeNames.Contains(enumTypeName))
                                {
                                    enumTypeNames.Add(enumTypeName);
                                }
                            }

                            foreach (string newName in newComplexTypes)
                            {
                                foreach (string enumTypeName in getEnumTypesUsedInComplexTypes(newName))
                                {
                                    if (!enumTypeNames.Contains(enumTypeName))
                                    {
                                        enumTypeNames.Add(enumTypeName);
                                    }
                                }
                            }

                        }
                        break;
                    case "EnumType":
                        if (!enumTypeNames.Contains(name))
                        {
                            enumTypeNames.Add(name);
                        }
                        break;
                    default:
                        break;
                }
            }
        }

        private void addBaseEntities()
        {
            List<string> entityNamesToAdd = new List<string>();
            foreach (string name in entityNames)
            {
                XElement entityDefinition = getElementsFromServiceDoc("EntityType", name).FirstOrDefault();
                if (!name.Equals("crmbaseentity"))
                {
                    string baseEntity = entityDefinition.Attribute("BaseType").Value;
                    if (baseEntity.Equals("mscrm.crmbaseentity"))
                    {
                        if (!entityNamesToAdd.Contains("crmbaseentity"))
                        {
                            entityNamesToAdd.Add("crmbaseentity");
                        }
                    }

                    if (baseEntity.Equals("mscrm.activitypointer"))
                    {
                        if (!entityNamesToAdd.Contains("activitypointer"))
                        {
                            entityNamesToAdd.Add("activitypointer");
                        }
                    }

                    if (baseEntity.Equals("mscrm.principal"))
                    {
                        if (!entityNamesToAdd.Contains("principal"))
                        {
                            entityNamesToAdd.Add("principal");
                        }
                    }
                }

            }

            entityNames = entityNames.Union(entityNamesToAdd).ToList();
        }

        private IEnumerable<XElement> getElementsFromServiceDoc(string Type, string name)
        {
            IEnumerable<XElement> foundItems =
            from e in serviceDocument.Root.Element(edmx + "DataServices").Element(mscrm + "Schema").Elements(mscrm + Type)
            where e.Attribute("Name").Value.Equals(name)
            select e;

            return foundItems;
        }

        private string getType(string name)
        {

            if (getElementsFromServiceDoc("EntityType", name).Count() > 0)
            {
                return "EntityType";
            }

            if (getElementsFromServiceDoc("Action", name).Count() > 0)
            {
                return "Action";
            }

            if (getElementsFromServiceDoc("Function", name).Count() > 0)
            {
                return "Function";
            }

            if (getElementsFromServiceDoc("ComplexType", name).Count() > 0)
            {
                return "ComplexType";
            }

            if (getElementsFromServiceDoc("EnumType", name).Count() > 0)
            {
                return "EnumType";
            }

            throw new Exception(string.Format("{0} is not a valid type found in the Web API service document", name));

        }

        private List<string> getComplexTypesUsedInComplexTypes(string typeName)
        {
            List<string> ctNames = new List<string>();
            XElement complexTypeElement = getElementsFromServiceDoc("ComplexType", typeName).FirstOrDefault();

            foreach (XElement property in complexTypeElement.Elements(mscrm + "Property"))
            {
                string type = property.Attribute("Type").Value;
                if (type.StartsWith("mscrm."))
                {
                    string name = type.Substring(6);
                    if (getType(name).Equals("ComplexType"))
                    {
                        ctNames.Add(name);
                    }
                }

                if (type.StartsWith("Collection(mscrm."))
                {
                    string name = type.Substring("Collection(mscrm.".Length);
                    name = name.Replace(")", String.Empty);
                    if (getType(name).Equals("ComplexType"))
                    {
                        ctNames.Add(name);
                    }
                }
            }
            List<string> listToCheck = new List<string>(ctNames);

            foreach (string complexTypeName in listToCheck)
            {
                ctNames = ctNames.Union(getComplexTypesUsedInComplexTypes(complexTypeName)).ToList();
            }

            return ctNames;
        }

        private List<string> getEnumTypesUsedInComplexTypes(string typeName)
        {
            List<string> etNames = new List<string>();
            XElement complexTypeElement = getElementsFromServiceDoc("ComplexType", typeName).FirstOrDefault();

            foreach (XElement property in complexTypeElement.Elements(mscrm + "Property"))
            {
                string type = property.Attribute("Type").Value;
                if (type.StartsWith("mscrm."))
                {
                    string name = type.Substring(6);
                    if (getType(name).Equals("EnumType"))
                    {
                        etNames.Add(name);
                    }
                }

                if (type.StartsWith("Collection(mscrm."))
                {
                    string name = type.Substring("Collection(mscrm.".Length);
                    name = name.Replace(")", String.Empty);
                    if (getType(name).Equals("EnumType"))
                    {
                        etNames.Add(name);
                    }
                }
            }

            return etNames;
        }


        #region entities
        private List<Entity> getEntities()
        {
            List<Entity> entities = new List<Entity>();

            foreach (string entityName in entityNames)
            {
                string entityMetadataId = getEntityMetadataId(entityName);

                Tuple<string, string, string, string, string> entityMetadataProperties = getEntityMetadataProperties(entityMetadataId, entityName);

                XElement entityElement = getElementsFromServiceDoc("EntityType", entityName).FirstOrDefault();
                Entity entity = new Entity();
                entity.AlternateKeys = getEntityAlternateKeys(entityElement);
                entity.BaseEntity = (entityElement.Attribute("BaseType") == null) ? null : trimCRMNameSpace(entityElement.Attribute("BaseType").Value);
                entity.LogicalCollectionName = entityMetadataProperties.Item1;
                entity.Collections = getEntityCollections(entityElement);
                entity.Description = getEntityDescription(entityElement);
                entity.DisplayName = entityMetadataProperties.Item3;
                entity.EntitySetName = getEntitySetName(entityName);
                entity.IsBaseEntity = (entityName.Equals("crmbaseentity") || entityName.Equals("activitypointer") || entityName.Equals("principal"));
                entity.Lookups = getEntityLookups(entityElement);
                entity.Name = entityName;
                entity.NameProperty = entityMetadataProperties.Item4;
                entity.PrimaryKey = (entityElement.Element(mscrm + "Key") == null) ? null : entityElement.Element(mscrm + "Key").Element(mscrm + "PropertyRef").Attribute("Name").Value;
                entity.Properties = getEntityProperties(entityElement);
                entity.SchemaCollectionName = entityMetadataProperties.Item2;
                entity.SchemaName = entityMetadataProperties.Item5;
                entities.Add(entity);
            }
            entities.OrderBy(e => e.Name).ToList();

            //Set base entities above other entities

            //principal
            int pindex = entities.FindIndex(e => e.Name.Equals("principal"));
            if (pindex > 0)
            {
                Entity principal = entities[pindex];
                entities.RemoveAt(pindex);
                entities.Insert(0, principal);
            }

            //activitypointer

            int apindex = entities.FindIndex(e => e.Name.Equals("activitypointer"));
            if (apindex > 0)
            {
                Entity activitypointer = entities[apindex];
                entities.RemoveAt(apindex);
                entities.Insert(0, activitypointer);
            }
            //crmbaseentity

            int cbindex = entities.FindIndex(e => e.Name.Equals("crmbaseentity"));
            if (cbindex > 0)
            {
                Entity crmbaseentity = entities[cbindex];
                entities.RemoveAt(cbindex);
                entities.Insert(0, crmbaseentity);
            }

            return entities;
        }

        private string getEntityMetadataId(string entityName)
        {
            if (!(entityName == "principal" || entityName == "crmbaseentity"))
            {

                using (HttpClient httpClient = getHttpClient())
                {
                    HttpResponseMessage EntityResponse = httpClient.GetAsync(String.Format("EntityDefinitions?$select=MetadataId&$filter=LogicalName eq '{0}'", entityName)).Result;

                    if (EntityResponse.StatusCode != HttpStatusCode.OK)
                    {
                        throw new Exception(String.Format("Error retrieving entity: {0}", EntityResponse.StatusCode));
                    }

                    string entityResponseText = EntityResponse.Content.ReadAsStringAsync().Result;

                    JObject entity = (JObject)JsonConvert.DeserializeObject(entityResponseText);

                    return (string)entity["value"].FirstOrDefault()["MetadataId"];
                }
            }
            else
            {
                return string.Empty;
            }

        }

        private Tuple<string, string, string, string, string> getEntityMetadataProperties(string entityMetadataId, string entityName)
        {
            string logicalCollectionName = null;
            string schemaCollectionName = null;
            string displayName = null;
            string nameProperty = null;
            string schemaName = null;

            if (!(entityName == "principal" || entityName == "crmbaseentity"))
            {

                using (HttpClient httpClient = getHttpClient())
                {
                    string[] properties = new string[5] { "LogicalCollectionName", "CollectionSchemaName", "DisplayName", "PrimaryNameAttribute", "SchemaName" };

                    HttpResponseMessage EntityResponse = httpClient.GetAsync(String.Format("EntityDefinitions({0})?$select={1}", entityMetadataId, string.Join(",", properties))).Result;

                    if (EntityResponse.StatusCode != HttpStatusCode.OK)
                    {
                        throw new Exception(String.Format("Error retrieving entity: {0}", EntityResponse.StatusCode));
                    }

                    string entityResponseText = EntityResponse.Content.ReadAsStringAsync().Result;

                    JObject entity = (JObject)JsonConvert.DeserializeObject(entityResponseText);



                    logicalCollectionName = (entity["LogicalCollectionName"] == null) ? null : entity["LogicalCollectionName"].ToString();
                    schemaCollectionName = (entity["CollectionSchemaName"] == null) ? null : entity["CollectionSchemaName"].ToString();
                    if (entity["DisplayName"].HasValues &&
                        entity["DisplayName"]["UserLocalizedLabel"].HasValues &&
                        entity["DisplayName"]["UserLocalizedLabel"]["Label"] != null)
                    {
                        displayName = entity["DisplayName"]["UserLocalizedLabel"]["Label"].ToString();
                    }

                    nameProperty = (entity["PrimaryNameAttribute"] == null) ? null : entity["PrimaryNameAttribute"].ToString();
                    schemaName = (entity["SchemaName"] == null) ? null : entity["SchemaName"].ToString();


                }
            }


            return new Tuple<string, string, string, string, string>(logicalCollectionName, schemaCollectionName, displayName, nameProperty, schemaName);
        }


        private List<Key> getEntityAlternateKeys(XElement entityElement)
        {
            List<Key> keys = new List<Key>();

            IEnumerable<XElement> keydefinitions =
from annotation in entityElement.Elements(mscrm + "Annotation")
from annotationCollection in annotation.Elements(mscrm + "Collection")
from annotationRecord in annotationCollection.Elements(mscrm + "Record")
from propertyValue in annotationRecord.Elements(mscrm + "PropertyValue")
from propertyCollection in propertyValue.Elements(mscrm + "Collection")
where annotation.Attribute("Term").Value.Equals("OData.Community.Keys.V1.AlternateKeys")
select propertyCollection;

            foreach (XElement keydef in keydefinitions)
            {
                Key k = new Key();
                k.Properties = (from propertyRecord in keydef.Elements(mscrm + "Record")
                                from recordPropertyValue in propertyRecord.Elements(mscrm + "PropertyValue")
                                where recordPropertyValue.Attribute("Property").Value.Equals("Name")
                                select recordPropertyValue.Attribute("PropertyPath").Value).ToList();
                keys.Add(k);
            }

            return keys;
        }

        private List<CollectionProperty> getEntityCollections(XElement entityElement)
        {
            List<CollectionProperty> collections = new List<CollectionProperty>();
            //Only those collections related to selected entities will be included.
            IEnumerable<XElement> navProps = from a in entityElement.Elements(mscrm + "NavigationProperty")
                                             where a.Attribute("Type").Value.StartsWith("Collection(mscrm.") &&
                                             entityNames.Contains(a.Attribute("Type").Value.Substring("Collection(mscrm.".Length).Replace(")", string.Empty))
                                             select a;

            foreach (XElement navProp in navProps)
            {
                CollectionProperty collection = new CollectionProperty();
                collection.Name = navProp.Attribute("Name").Value;
                collection.Partner = navProp.Attribute("Partner").Value;
                string rawType = navProp.Attribute("Type").Value;
                string typeOnly = rawType.Substring("Collection(mscrm.".Length).Replace(")", string.Empty);
                collection.Type = typeOnly;

                collections.Add(collection);
            }
            return collections.OrderBy(cp => cp.Name).ToList();
        }

        private string getEntityDescription(XElement entityElement)
        {
            IEnumerable<XElement> description = from e in entityElement.Elements(mscrm + "Annotation")
                                                where e.Attribute("Term").Value.Equals("Org.OData.Core.V1.Description")
                                                select e;
            return (description.FirstOrDefault() == null) ? null : description.FirstOrDefault().Attribute("String").Value;
        }

        private string getEntitySetName(string entityName)
        {
            IEnumerable<XElement> ee =
            from e in serviceDocument.Root.Element(edmx + "DataServices").Element(mscrm + "Schema").Elements(mscrm + "EntityContainer").Elements(mscrm + "EntitySet")
            where e.Attribute("EntityType").Value.Equals("Microsoft.Dynamics.CRM." + entityName)
            select e;

            return (ee.FirstOrDefault() == null) ? null : ee.FirstOrDefault().Attribute("Name").Value;
        }

        private List<LookupProperty> getEntityLookups(XElement entityElement)
        {
            List<LookupProperty> lookups = new List<LookupProperty>();
            string entityLogicalName = entityElement.Attribute("Name").Value;

            //Only those lookups related to selected entities will be included.
            IEnumerable<XElement> lookupProps = from a in entityElement.Elements(mscrm + "NavigationProperty")
                                                where !a.Attribute("Type").Value.StartsWith("Collection(mscrm.") && entityNames.Contains(trimCRMNameSpace(a.Attribute("Type").Value))
                                                select a;

            foreach (XElement lookupProp in lookupProps)
            {

                string lookupName = lookupProp.Attribute("Name").Value;

                LookupProperty lookup = new LookupProperty();
                lookup.Name = lookupName;
                lookup.Partner = lookupProp.Attribute("Partner").Value;
                lookup.Type = trimCRMNameSpace(lookupProp.Attribute("Type").Value);
                lookup.Nullable = !lookupProp.Attribute("Nullable").Value.Equals("false");

                Tuple<string, string, string, bool, bool, bool> metadata = getLookupMetadata(entityLogicalName, lookupName);
                lookup.Description = metadata.Item1;
                lookup.SchemaName = metadata.Item2;
                lookup.ReferencedProperty = metadata.Item3;
                lookup.ValidForCreate = metadata.Item4;
                lookup.ValidForRead = metadata.Item5;
                lookup.ValidForUpdate = metadata.Item6;
                lookup.IsReadOnly = !(lookup.ValidForCreate || lookup.ValidForUpdate);
                lookup.IsComputed = lookup.IsReadOnly;

                lookups.Add(lookup);
            }


            return lookups.OrderBy(lp => lp.Name).ToList();
        }

        private Tuple<string, string, string, bool, bool, bool> getLookupMetadata(string entityLogicalName, string navigationPropertyName)
        {
            string description = null;
            string schemaName = null;
            string referencedAttributeName = null;
            bool validForCreate = false;
            bool validForRead = false;
            bool validForUpdate = false;



            using (HttpClient httpClient = getHttpClient())
            {

                //Get name of referencing attribute and referenced attribute
                string queryPath = "RelationshipDefinitions/Microsoft.Dynamics.CRM.OneToManyRelationshipMetadata?$select=ReferencingAttribute,ReferencedAttribute";
                string queryfilter = string.Format("&$filter=ReferencingEntity eq '{0}' and ReferencingEntityNavigationPropertyName eq '{1}'", entityLogicalName, navigationPropertyName);

                HttpResponseMessage relationshipResponse = httpClient.GetAsync(queryPath + queryfilter).Result;

                if (relationshipResponse.StatusCode != HttpStatusCode.OK)
                {
                    throw new Exception(String.Format("Error retrieving relationship: {0}", relationshipResponse.StatusCode));
                }

                string responseText = relationshipResponse.Content.ReadAsStringAsync().Result;

                JObject relationships = (JObject)JsonConvert.DeserializeObject(responseText);

                string referencingAttributeName = (string)relationships["value"].FirstOrDefault()["ReferencingAttribute"];
                referencedAttributeName = (string)relationships["value"].FirstOrDefault()["ReferencedAttribute"];

                //Get entity metadataid
                HttpResponseMessage entityResponse = httpClient.GetAsync("EntityDefinitions?$select=MetadataId&$filter=LogicalName eq '" + entityLogicalName + "'").Result;

                if (entityResponse.StatusCode != HttpStatusCode.OK)
                {
                    throw new Exception(String.Format("Error retrieving entity: {0}", entityResponse.StatusCode));
                }

                string entityResponseText = entityResponse.Content.ReadAsStringAsync().Result;

                JObject entities = (JObject)JsonConvert.DeserializeObject(entityResponseText);

                String metadataId = (string)entities["value"].FirstOrDefault()["MetadataId"];

                //Get attribute metadata

                HttpResponseMessage attributeResponse = httpClient.GetAsync(String.Format("EntityDefinitions({0})/Attributes?$select=Description,SchemaName,IsValidForCreate,IsValidForRead,IsValidForUpdate&$filter=LogicalName eq '{1}'", metadataId, referencingAttributeName)).Result;

                if (attributeResponse.StatusCode != HttpStatusCode.OK)
                {
                    throw new Exception(String.Format("Error retrieving entity: {0}", attributeResponse.StatusCode));
                }

                string attributeResponseText = attributeResponse.Content.ReadAsStringAsync().Result;

                JObject attributes = (JObject)JsonConvert.DeserializeObject(attributeResponseText);

                JObject attribute = (JObject)attributes["value"].FirstOrDefault();
                if (attribute != null)
                {

                    description = parseLabelValue((JObject)(attribute["Description"]));
                    schemaName = (string)((JValue)(attribute["SchemaName"])).Value;
                    validForCreate = (bool)((JValue)(attribute["IsValidForCreate"])).Value;
                    validForRead = (bool)((JValue)(attribute["IsValidForRead"])).Value;
                    validForUpdate = (bool)((JValue)(attribute["IsValidForUpdate"])).Value;

                }
                else
                {
                    throw new Exception(string.Format("{0} {1} not found", entityLogicalName, referencingAttributeName));
                }

            }

            return new Tuple<string, string, string, bool, bool, bool>(description, schemaName, referencedAttributeName, validForCreate, validForRead, validForUpdate);

        }

        private List<EntityProperty> getEntityProperties(XElement entityElement)
        {
            List<EntityProperty> properties = new List<EntityProperty>();
            List<string> selectedProperties = new List<string>();
            IEnumerable<XElement> props = null;
 

            string entityLogicalName = entityElement.Attribute("Name").Value;

            foreach (EntityProperties ep in entityProperties)
            {
                if (ep.EntityName.Equals(entityLogicalName))
                {
                    selectedProperties = ep.Properties;
                }
            }


                props = from p in entityElement.Elements(mscrm + "Property")
                        where selectedProperties.Contains(p.Attribute("Name").Value) 
                        orderby p.Attribute("Name").Value
                        select p;


            //Make sure every entity has the key property included even if not selected.
            if (entityLogicalName != "crmbaseentity")
            {
                IEnumerable<XElement> keyProp = getKeyPropertyFromEntityElement(entityElement);
                props = props.Union(keyProp);
            }

            foreach (XElement prop in props)
            {
                string propName = prop.Attribute("Name").Value;

                if (entityLogicalName != "principal")
                {
                    Tuple<string, string, bool, bool, bool, List<Option>> metadata = getPropertyMetadata(entityLogicalName, propName);

                    string attributeTypeName = metadata.Item1;

                    if (IsOptionSetType(attributeTypeName))
                    {

                        OptionSetProperty op = new OptionSetProperty();
                        op.Description = getElementDescription(prop);
                        op.IsComputed = getIsComputed(prop);
                        op.Type = prop.Attribute("Type").Value;
                        op.Name = propName;

                        op.SchemaName = metadata.Item2;
                        op.ValidForCreate = metadata.Item3;
                        op.ValidForRead = metadata.Item4;
                        op.ValidForUpdate = metadata.Item5;
                        op.IsReadOnly = !(op.ValidForCreate || op.ValidForUpdate); //Using this rather than the Org.OData.Core.V1.Permissions Annotation value.


                        op.Options = metadata.Item6;



                        properties.Add(op);
                    }
                    else
                    {
                        EntityProperty p = new EntityProperty();
                        p.Description = getElementDescription(prop);
                        p.IsComputed = getIsComputed(prop);
                        p.Type = prop.Attribute("Type").Value;
                        p.Name = propName;

                        p.SchemaName = metadata.Item2;
                        p.ValidForCreate = metadata.Item3;
                        p.ValidForRead = metadata.Item4;
                        p.ValidForUpdate = metadata.Item5;
                        p.IsReadOnly = !(p.ValidForCreate || p.ValidForUpdate); //Using this rather than the Org.OData.Core.V1.Permissions Annotation value.

                        properties.Add(p);
                    }
                }
                else
                {
                    // principal is an abstract entity not found in the metadata.
                    // It has one property 'ownerid' and systemuser & team inherit from it.
                    EntityProperty p = new EntityProperty();
                    p.Description = getElementDescription(prop);
                    p.IsComputed = getIsComputed(prop);
                    p.Type = prop.Attribute("Type").Value;
                    p.Name = propName;
                    //No properties set from metadata
                    //Simulated metadata Properties for the principal.ownerid property could be set here if necessary
                    properties.Add(p);
                }

            }

            return properties.OrderBy(ep => ep.Name).ToList();
        }

        

        private Tuple<string, string, bool, bool, bool, List<Option>> getPropertyMetadata(string entityLogicalName, string propertyName)
        {

            string attributeMetadataId = null;
            string attributeTypeName = null;
            string schemaName = null;
            bool validForCreate = false;
            bool validForRead = false;
            bool validForUpdate = false;
            List<Option> options = new List<Option>();



            using (HttpClient httpClient = getHttpClient())
            {

                //Get entity metadataid
                string metadataQuery = string.Format("EntityDefinitions?$select=MetadataId&$filter=LogicalName eq '{0}'", entityLogicalName);
                HttpResponseMessage entityResponse = httpClient.GetAsync(metadataQuery).Result;

                if (entityResponse.StatusCode != HttpStatusCode.OK)
                {
                    throw new Exception(String.Format("Error retrieving entity: {0}", entityResponse.StatusCode));
                }

                string entityResponseText = entityResponse.Content.ReadAsStringAsync().Result;

                JObject entities = (JObject)JsonConvert.DeserializeObject(entityResponseText);

                string entityMetadataId = (string)entities["value"].FirstOrDefault()["MetadataId"];

                //Get attribute metadata
                string queryPath = string.Format("EntityDefinitions({0})/Attributes?", entityMetadataId);
                string querySelect = "$select=AttributeTypeName,SchemaName,IsValidForCreate,IsValidForRead,IsValidForUpdate&";
                string queryFilter = string.Format("$filter=LogicalName eq '{0}'", propertyName);

                HttpResponseMessage attributeResponse = httpClient.GetAsync(string.Format("{0}{1}{2}", queryPath, querySelect, queryFilter)).Result;

                if (attributeResponse.StatusCode != HttpStatusCode.OK)
                {
                    throw new Exception(string.Format("Error retrieving entity: {0}", attributeResponse.StatusCode));
                }

                string attributeResponseText = attributeResponse.Content.ReadAsStringAsync().Result;

                JObject attributes = (JObject)JsonConvert.DeserializeObject(attributeResponseText);

                JObject attribute = (JObject)attributes["value"].FirstOrDefault();
                if (attribute != null)
                {
                    attributeMetadataId = (string)((JValue)(attribute["MetadataId"])).Value;
                    attributeTypeName = (string)((JValue)(attribute["AttributeTypeName"]["Value"])).Value;
                    schemaName = (string)((JValue)(attribute["SchemaName"])).Value;
                    validForCreate = (bool)((JValue)(attribute["IsValidForCreate"])).Value;
                    validForRead = (bool)((JValue)(attribute["IsValidForRead"])).Value;
                    validForUpdate = (bool)((JValue)(attribute["IsValidForUpdate"])).Value;

                }
                else
                {
                   
                    throw new Exception(string.Format("{0}.{1} property not found", entityLogicalName, propertyName));
                  
                }

                if (IsOptionSetType(attributeTypeName))
                {
                    //Get the valid option values
                    string attributeMetadataType = "Microsoft.Dynamics.CRM.PicklistAttributeMetadata";
                    switch (attributeTypeName)
                    {
                        case "StateType":
                            attributeMetadataType = "Microsoft.Dynamics.CRM.StateAttributeMetadata";
                            break;
                        case "StatusType":
                            attributeMetadataType = "Microsoft.Dynamics.CRM.StatusAttributeMetadata";
                            break;
                        case "BooleanType":
                            attributeMetadataType = "Microsoft.Dynamics.CRM.BooleanAttributeMetadata";
                            break;
                        default:
                            break;
                    }

                    string optionSetPath = string.Format("EntityDefinitions({0})/Attributes({1})/{2}", entityMetadataId, attributeMetadataId, attributeMetadataType);
                    string optionSetSelect = "$select=MetadataId";
                    string optionSetExpand = "$expand=OptionSet,GlobalOptionSet";

                    HttpResponseMessage optionSetResponse = httpClient.GetAsync(string.Format("{0}?{1}&{2}", optionSetPath, optionSetSelect, optionSetExpand)).Result;

                    if (optionSetResponse.StatusCode != HttpStatusCode.OK)
                    {
                        throw new Exception(String.Format("Error retrieving attribute: {0}", optionSetResponse.StatusCode));
                    }

                    string optionSetResponseText = optionSetResponse.Content.ReadAsStringAsync().Result;

                    JObject optionSetAttribute = (JObject)JsonConvert.DeserializeObject(optionSetResponseText);

                    JObject retrievedOptionSet;

                    if (optionSetAttribute["OptionSet"].HasValues)
                    {
                        retrievedOptionSet = (JObject)optionSetAttribute["OptionSet"];
                    }
                    else
                    {
                        retrievedOptionSet = (JObject)optionSetAttribute["GlobalOptionSet"];
                    }

                    JValue optionSetType = (JValue)retrievedOptionSet["OptionSetType"];


                    if (optionSetType.Value.Equals("Boolean"))
                    {
                        Option trueOption = new Option();

                        trueOption.Value = (int)retrievedOptionSet["TrueOption"]["Value"];
                        trueOption.Label = parseLabelValue((JObject)retrievedOptionSet["TrueOption"]["Label"]);

                        options.Add(trueOption);

                        Option falseOption = new Option();

                        falseOption.Value = (int)retrievedOptionSet["FalseOption"]["Value"];
                        falseOption.Label = parseLabelValue((JObject)retrievedOptionSet["FalseOption"]["Label"]);

                        options.Add(falseOption);
                    }
                    else
                    {

                        foreach (var option in retrievedOptionSet["Options"])
                        {
                            Option opt = new Option();
                            opt.Value = (int)option["Value"];
                            opt.Label = parseLabelValue((JObject)option["Label"]);

                            options.Add(opt);
                        }
                    }

                }

            }

            return new Tuple<string, string, bool, bool, bool, List<Option>>(attributeTypeName, schemaName, validForCreate, validForRead, validForUpdate, options);

        }

        #endregion entities

        #region actions
        private List<CrmWebAPIModel.Action> getActions()
        {
            //Could this be published on NuGet or could we maintain a public download?
            XDocument systemActionDescriptions = XDocument.Load("Resources/ActionDescriptions.xml");

            List<CrmWebAPIModel.Action> actions = new List<CrmWebAPIModel.Action>();

            foreach (string actionName in actionNames)
            {
                IEnumerable<XElement> actionElements = getElementsFromServiceDoc("Action", actionName);

                XElement description = getObjectDescription(actionName, systemActionDescriptions, "Action");

                XElement firstElement = actionElements.FirstOrDefault();

                CrmWebAPIModel.Action action = new CrmWebAPIModel.Action();

                if (firstElement.Attribute("IsBound") != null && firstElement.Attribute("IsBound").Value.Equals("true"))
                {
                    action.BoundTypes = getOperationBoundTypes(actionElements);
                    //Skip the first parameter representing the bound entity or collection
                    action.Parameters = getOperationParameters(firstElement.Elements(mscrm + "Parameter").Skip(1), description);
                }
                else
                {
                    action.BoundTypes = new List<Binding>(); //An empty collection rather than a null value
                    action.Parameters = getOperationParameters(firstElement.Elements(mscrm + "Parameter"), description);
                }


                action.Description = (description == null) ? string.Empty :
                    (description.Element("Description") == null) ? string.Empty :
                    description.Element("Description").Value.Trim();

                action.Name = actionName;

                //Assumes that the return type is always the same regardless of the entities the action is bound to
                action.ReturnType = (firstElement.Element(mscrm + "ReturnType") == null) ? null :
                    trimCRMNameSpace(firstElement.Element(mscrm + "ReturnType").Attribute("Type").Value);
                actions.Add(action);

            }

            return actions.OrderBy(a => a.Name).ToList();
        }

        private XElement getActionDescription(string actionName, XDocument systemActionDescriptions)
        {

            XElement description = null;

            IEnumerable<XElement> descriptions = from d in systemActionDescriptions.Root.Elements("Action")
                                                 where d.Attribute("Name").Value.Equals(actionName)
                                                 select d;
            description = descriptions.FirstOrDefault();

            //if (description == null)
            //{
            //    if (customObjectDescriptions != null)
            //    {
            //        IEnumerable<XElement> customDescriptions = from d in customObjectDescriptions.Elements("Action")
            //                                                   where d.Attribute("Name").Value.Equals(actionName)
            //                                                   select d;
            //        description = customDescriptions.FirstOrDefault();
            //    }
            //}


            return description;
        }



        #endregion actions

        #region operations
        private List<Binding> getOperationBoundTypes(IEnumerable<XElement> operationElements)
        {
            List<Binding> boundTypes = new List<Binding>();

            foreach (XElement operationElement in operationElements)
            {
                XElement boundParameter = operationElement.Elements(mscrm + "Parameter").FirstOrDefault();
                Binding b = new Binding();
                string type = boundParameter.Attribute("Type").Value;

                if (type.StartsWith("Collection(mscrm."))
                {
                    b.BoundTo = BindingType.Collection;
                    b.Type = trimCRMNameSpace(type);
                }
                else
                {
                    b.BoundTo = BindingType.Entity;
                    b.Type = trimCRMNameSpace(type);
                }

                boundTypes.Add(b);
            }


            return boundTypes;
        }

        private List<Parameter> getOperationParameters(IEnumerable<XElement> parameterElements, XElement description)
        {
            List<Parameter> parameters = new List<Parameter>();

            foreach (XElement parameterElement in parameterElements)
            {
                Parameter p = new Parameter();
                string parameterName = parameterElement.Attribute("Name").Value;


                p.Name = parameterName;
                p.Nullable = (parameterElement.Attribute("Nullable") == null) ? true :
                    (parameterElement.Attribute("Nullable").Value.Equals("false")) ? false : true;
                p.Type = trimCRMNameSpace(parameterElement.Attribute("Type").Value);
                p.Unicode = (parameterElement.Attribute("Unicode") == null) ? true :
                    (parameterElement.Attribute("Unicode").Value.Equals("false")) ? false : true;

                if (description != null)
                {
                    IEnumerable<XElement> parameterDescriptions = from d in description.Element("Parameters").Elements("Parameter")
                                                                  where d.Attribute("Name").Value.Equals(parameterName)
                                                                  select d;
                    XElement parameterDescription = parameterDescriptions.FirstOrDefault();

                    if (parameterDescription != null)
                    {
                        p.Description = parameterDescription.Value.Trim();
                    }
                    else
                    {
                        p.Description = string.Empty;
                    }

                }
                else
                {
                    p.Description = string.Empty;
                }

                parameters.Add(p);
            }

            return parameters;
        }
        #endregion operations

        #region functions
        private List<Function> getFunctions()
        {
            XDocument functionDescriptions = XDocument.Load("Resources/FunctionDescriptions.xml");

            List<Function> functions = new List<Function>();

            foreach (string functionName in functionNames)
            {
                IEnumerable<XElement> functionElements = getElementsFromServiceDoc("Function", functionName);
                XElement description = getObjectDescription(functionName, functionDescriptions, "Function");

                XElement firstElement = functionElements.FirstOrDefault();

                Function function = new Function();

                if (firstElement.Attribute("IsBound") != null && firstElement.Attribute("IsBound").Value.Equals("true"))
                {
                    function.BoundTypes = getOperationBoundTypes(functionElements);
                    //Skip the first parameter representing the bound entity or collection
                    function.Parameters = getOperationParameters(firstElement.Elements(mscrm + "Parameter").Skip(1), description);
                }
                else
                {
                    function.BoundTypes = new List<Binding>(); //an empty collection rather than a null value;
                    function.Parameters = getOperationParameters(firstElement.Elements(mscrm + "Parameter"), description);
                }


                function.Description = (description == null) ? string.Empty :
                    (description.Element("Description") == null) ? string.Empty :
                    description.Element("Description").Value.Trim();

                function.Name = functionName;

                //Assumes that the return type is always the same regardless of the entities the function is bound to
                function.ReturnType = (firstElement.Element(mscrm + "ReturnType") == null) ? null :
                    trimCRMNameSpace(firstElement.Element(mscrm + "ReturnType").Attribute("Type").Value);

                function.IsComposable = (firstElement.Attribute("IsComposable") == null) ? false :
                    (firstElement.Attribute("IsComposable").Value.Equals("true")) ? true : false;
                functions.Add(function);
            }

            return functions.OrderBy(f => f.Name).ToList();
        }

        private XElement getObjectDescription(string objectName, XDocument objectDescriptions, string type)
        {
            XElement description = null;

            IEnumerable<XElement> descriptions = from d in objectDescriptions.Root.Elements(type)
                                                 where d.Attribute("Name").Value.Equals(objectName)
                                                 select d;
            description = descriptions.FirstOrDefault();


            return description;
        }


        #endregion functions

        #region complexTypes
        private List<ComplexType> getComplexTypes()
        {
            XDocument complexTypeDescriptions = XDocument.Load("Resources/ComplexTypeDescriptions.xml");

            List<ComplexType> complexTypes = new List<ComplexType>();

            /*
            Always include BooleanManagedProperty
              BooleanManagedProperty is one complex type used by certain entities
              Otherwise, entities use only basic Edm types. 
              Because entities aren't otherwise checked for dependencies,
              Including this here will ensure it is always present if needed
            */
            if (!complexTypeNames.Contains("BooleanManagedProperty"))
            {
                complexTypeNames.Add("BooleanManagedProperty");
            }

            foreach (string complexTypeName in complexTypeNames)
            {
                XElement description = getObjectDescription(complexTypeName, complexTypeDescriptions, "ComplexType");

                XElement complexTypeElement = getElementsFromServiceDoc("ComplexType", complexTypeName).FirstOrDefault();
                ComplexType ct = new ComplexType();

                ct.Name = complexTypeName;
                ct.Properties = getComplexTypeProperties(complexTypeElement, description);


                ct.Description = (description == null) ? string.Empty :
                    (description.Element("Description") == null) ? string.Empty :
                    description.Element("Description").Value.Trim();

                complexTypes.Add(ct);
            }
            return complexTypes.OrderBy(ct => ct.Name).ToList();
        }

        private List<ComplexTypeProperty> getComplexTypeProperties(XElement complexTypeElement, XElement description)
        {
            List<ComplexTypeProperty> propList = new List<ComplexTypeProperty>();

            IEnumerable<XElement> properties = from p in complexTypeElement.Elements(mscrm + "Property")
                                               select p;
            foreach (XElement property in properties)
            {
                ComplexTypeProperty p = new ComplexTypeProperty();
                string name = property.Attribute("Name").Value;

                p.Name = name;
                p.Type = trimCRMNameSpace(property.Attribute("Type").Value);

                if (description != null)
                {
                    IEnumerable<XElement> propertyDescriptions = from d in description.Element("Properties").Elements("Property")
                                                                 where d.Attribute("Name").Value.Equals(name)
                                                                 select d;
                    XElement propertyDescription = propertyDescriptions.FirstOrDefault();

                    if (propertyDescription != null)
                    {
                        p.Description = propertyDescription.Value.Trim();
                    }
                    else
                    {
                        p.Description = string.Empty;
                    }

                }
                else
                {
                    p.Description = string.Empty;
                }

                p.Nullable = (property.Attribute("Nullable") == null) ? true : (property.Attribute("Nullable").Value.Equals("false") ? false : true);
                p.Unicode = (property.Attribute("Unicode") == null) ? true : (property.Attribute("Unicode").Value.Equals("false") ? false : true);
                propList.Add(p);
            }

            return propList;
        }



        #endregion complexTypes

        #region enumTypes
        private List<EnumType> getEnumTypes()
        {
            XDocument enumTypeDescriptions = XDocument.Load("Resources/EnumTypeDescriptions.xml");

            List<EnumType> enumTypes = new List<EnumType>();

            foreach (string enumTypeName in enumTypeNames)
            {
                XElement description = getObjectDescription(enumTypeName, enumTypeDescriptions, "EnumType");

                XElement enumTypeElement = getElementsFromServiceDoc("EnumType", enumTypeName).FirstOrDefault();
                EnumType et = new EnumType();
                et.Members = getEnumTypeMembers(enumTypeElement, description);
                et.Name = enumTypeName;
                et.Description = (description == null) ? string.Empty :
                    (description.Element("Description") == null) ? string.Empty :
                    description.Element("Description").Value.Trim();

                enumTypes.Add(et);
            }

            return enumTypes.OrderBy(et => et.Name).ToList();
        }

        private List<Member> getEnumTypeMembers(XElement enumTypeElement, XElement description)
        {
            List<Member> memberList = new List<Member>();

            IEnumerable<XElement> members = from p in enumTypeElement.Elements(mscrm + "Member")
                                            select p;

            foreach (XElement member in members)
            {
                Member m = new Member();
                string name = member.Attribute("Name").Value;

                m.Name = name;
                m.Value = member.Attribute("Value").Value;

                if (description != null)
                {
                    IEnumerable<XElement> memberDescriptions = from d in description.Element("Members").Elements("Member")
                                                               where d.Attribute("Name").Value.Equals(name)
                                                               select d;
                    XElement memberDescription = memberDescriptions.FirstOrDefault();

                    if (memberDescription != null)
                    {
                        m.Description = memberDescription.Value.Trim();
                    }
                    else
                    {
                        m.Description = string.Empty;
                    }

                }
                else
                {
                    m.Description = string.Empty;
                }

                memberList.Add(m);
            }


            return memberList;

        }

        #endregion enumTypes

        #region utility
        private string trimCRMNameSpace(string value)
        {

            if (value.StartsWith("mscrm."))
            {
                return value.Substring("mscrm.".Length);
            }

            if (value.StartsWith("Collection(mscrm."))
            {
                return string.Format("Collection({0}", value.Substring("Collection(mscrm.".Length));
            }

            return value;
        }

        private string parseLabelValue(JObject label)
        {

            return (label == null) ? string.Empty :
                (label["UserLocalizedLabel"].HasValues == false) ? string.Empty :
                (label["UserLocalizedLabel"]["Label"].Value<string>() == null) ? string.Empty :
                label["UserLocalizedLabel"]["Label"].Value<string>();
        }

        private bool IsOptionSetType(string typeName)
        {
            return (
                typeName.Equals("PicklistType") ||
                typeName.Equals("BooleanType") ||
                typeName.Equals("StateType") ||
                typeName.Equals("StatusType") ||
                typeName.Equals("PicklistType"));
        }


        /// <summary>
        /// Method to get a configured HttpClient using the helper Authentication and Configuration classes
        /// </summary>
        /// <returns></returns>
        private HttpClient getHttpClient()
        {

            HttpClient httpClient = new HttpClient(auth.ClientHandler, false);
            httpClient.BaseAddress = new Uri(config.ServiceUrl + string.Format("api/data/v{0}/", webAPIVersion));
            httpClient.Timeout = new TimeSpan(0, 2, 0);
            httpClient.DefaultRequestHeaders.Add("OData-MaxVersion", "4.0");
            httpClient.DefaultRequestHeaders.Add("OData-Version", "4.0");
            httpClient.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            return httpClient;
        }
        

        private IEnumerable<XElement> getKeyPropertyFromEntityElement(XElement entityElement)
        {

            if (entityElement.Attribute("Name").Value.Equals("crmbaseentity"))
            {
                throw new Exception("CRMWebAPIReader.getKeyPropertyFromEntityElement can't be used on the crmbaseentity element.");
            }


            IEnumerable<XElement> keys = from k in entityElement.Element(mscrm + "Key").Elements(mscrm + "PropertyRef")
                                         select k;
            string keyName = keys.FirstOrDefault().Attribute("Name").Value;

            IEnumerable<XElement> keyProperties = from p in entityElement.Elements(mscrm + "Property")
                                                  where p.Attribute("Name").Value.Equals(keyName)
                                                  select p;
            //Entities that inherit their key (activities) will not return anything b/c the property definition will be in the base entity
            return keyProperties;
        }

        private string getElementDescription(XElement element)
        {
            IEnumerable<XElement> annotation = from e in element.Elements(mscrm + "Annotation")
                                               where e.Attribute("Term").Value.Equals("Org.OData.Core.V1.Description")
                                               select e;
            return annotation.FirstOrDefault().Attribute("String").Value;
        }

        private bool getIsComputed(XElement element)
        {
            IEnumerable<XElement> annotation = from e in element.Elements(mscrm + "Annotation")
                                               where e.Attribute("Term").Value.Equals("Org.OData.Core.V1.Computed")
                                               select e;
            return (annotation.FirstOrDefault() == null) ? false : annotation.FirstOrDefault().Attribute("Bool").Value.Equals("true");

        }
        #endregion utility
    }

    class EntityProperties {
        public string EntityName { get; set; }
        public List<string> Properties { get; set; }

    }
}
