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
using CrmWebAPIModel;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;

namespace CRMWebAPIJavaScriptWriter
{
    class TypeScriptDefinitionWriter
    {

        public Model model { get; set; }
        public string RootNameSpace { get; set; }
        public string SubNamespace { get; set; }
        public string libraryName { get; set; }
        public bool enableOAuth { get; set; }

        //It doesn't make sense to include callerId parameter on these functions
        private static List<String> excludeCallerId = new List<string>(new string[] { "WhoAmI", "RetrieveUserPrivileges", "RetrieveVersion" });

        private string getTSFileString()
        {

            StringBuilder sb = new StringBuilder();

            AddCoreLibrary(sb, ModelDefinitions(), MetadataInterfaces());

            return sb.ToString();

        }

        private string MetadataInterfaces()
        {
            StringBuilder sb = new StringBuilder();
            foreach (Entity e in model.Entities)
            {

                Entity baseEntity = null;

                if (e.BaseEntity != null)
                {
                    baseEntity = getEntityByName(e.BaseEntity);
                }

                if (baseEntity == null)
                {
                    //Simple entity
                    if (e.Properties.Count > 0)
                    {

                        sb.AppendLine(string.Format("interface {0}Properties {{", getEntityName(e)));
                        foreach (Property p in e.Properties)
                        {
                            sb.AppendLine(string.Format("     {0}: propertyType;", p.Name));
                        }


                        sb.AppendLine("}");
                    }

                    if (e.Lookups.Count > 0)
                    {

                        sb.AppendLine(string.Format("interface {0}Lookups {{", getEntityName(e)));
                        foreach (Property l in e.Lookups)
                        {
                            sb.AppendLine(string.Format("     {0}: navigationPropertyType;", l.Name));
                        }
                        sb.AppendLine("}");
                    }

                    if (e.Collections.Count > 0)
                    {

                        sb.AppendLine(string.Format("interface {0}Collections {{", getEntityName(e)));
                        foreach (Property c in e.Collections)
                        {
                            sb.AppendLine(string.Format("     {0}: navigationPropertyType;", c.Name));
                        }
                        sb.AppendLine("}");
                    }

                }
                else
                {
                    //derived entity must implment same properties
                    if (e.Properties.Count > 0 || baseEntity.Properties.Count > 0)
                    {

                        sb.AppendLine(string.Format("interface {0}Properties {{", getEntityName(e)));
                        foreach (Property p in e.Properties.Union(baseEntity.Properties))
                        {
                            sb.AppendLine(string.Format("     {0}: propertyType;", p.Name));
                        }

                        sb.AppendLine("}");
                    }

                    if (e.Lookups.Count > 0 || baseEntity.Lookups.Count > 0)
                    {

                        sb.AppendLine(string.Format("interface {0}Lookups {{", getEntityName(e)));
                        foreach (Property l in e.Lookups.Union(baseEntity.Lookups))
                        {
                            sb.AppendLine(string.Format("     {0}: navigationPropertyType;", l.Name));
                        }
                        sb.AppendLine("}");
                    }

                    if (e.Collections.Count > 0 || baseEntity.Collections.Count > 0)
                    {

                        sb.AppendLine(string.Format("interface {0}Collections {{", getEntityName(e)));
                        foreach (Property c in e.Collections.Union(baseEntity.Collections))
                        {
                            sb.AppendLine(string.Format("     {0}: navigationPropertyType;", c.Name));
                        }
                        sb.AppendLine("}");
                    }
                }


            }

            return sb.ToString();
        }

        private string ModelDefinitions()
        {

            StringBuilder sb = new StringBuilder();
            sb.Append(writeEntities());
            sb.AppendLine("");
            sb.Append(writeFunctions());
            sb.AppendLine("");
               sb.Append(writeActions());
            sb.AppendLine("");
            sb.Append(writeComplexTypes());
            sb.AppendLine("");
            sb.Append(writeEnumTypes());

            return sb.ToString();
        }


        private string writeEntities()
        {
            StringBuilder sb = new StringBuilder();
            foreach (Entity entity in model.Entities)
            {
                if (entity.Name != "crmbaseentity")
                {

                    sb.Append(writeEntityComments(entity));
                    sb.Append(writeEntityDefinition(entity));
                }

            }

            return sb.ToString();
        }

        private string writeEntityComments(Entity entity)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(@"
/**");
            sb.AppendLine(entity.Description);
            sb.AppendLine("*/");

            return sb.ToString();
        }
        private string writeEntityDefinition(Entity entity)
        {
            StringBuilder sb = new StringBuilder();



            sb.AppendLine(string.Format("    class {0} implements {1} {{", getEntityName(entity), entity.BaseEntity));

            sb.AppendFormat(@"        /**
         * A GUID, a URI, or a JSON object to set retrieved values.
         * @param {0}Reference
         */
        constructor({0}Reference?: string | Object)
         isEntityClass: boolean;
        // crmbaseentity implementation START
         type: string;
         primaryKey: string;
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
", getEntityName(entity));

            Entity baseEntity = getEntityByName(entity.BaseEntity);

            if (baseEntity == null)
            {
                if (entity.Properties.Count > 0)
                {
                    sb.AppendLine(string.Format("         properties: {0}Properties;", getEntityName(entity)));
                }
                else
                {
                    sb.AppendLine("         properties: {};");
                }
                if (entity.Lookups.Count > 0)
                {
                    sb.AppendLine(string.Format("         lookups: {0}Lookups;", getEntityName(entity)));
                }
                else
                {
                    sb.AppendLine("         lookups: {};");
                }
                if (entity.Collections.Count > 0)
                {
                    sb.AppendLine(string.Format("         collections: {0}Collections;", getEntityName(entity)));
                }
                else
                {
                    sb.AppendLine("         collections: {};");
                }
            }
            else
            {

                if (entity.Properties.Count > 0 || baseEntity.Properties.Count > 0)
                {
                    sb.AppendLine(string.Format("         properties: {0}Properties;", getEntityName(entity)));
                }
                else
                {
                    sb.AppendLine("         properties: {};");
                }
                if (entity.Lookups.Count > 0 || baseEntity.Lookups.Count > 0)
                {
                    sb.AppendLine(string.Format("         lookups: {0}Lookups;", getEntityName(entity)));
                }
                else
                {
                    sb.AppendLine("         lookups: {};");
                }
                if (entity.Collections.Count > 0 || baseEntity.Collections.Count > 0)
                {
                    sb.AppendLine(string.Format("         collections: {0}Collections;", getEntityName(entity)));
                }
                else
                {
                    sb.AppendLine("         collections: {};");
                }

            }



            sb.Append(writeProperties(entity));

            if (baseEntity != null)
            {

                sb.Append(writeProperties(baseEntity));
            }


            sb.AppendLine("    }");
            return sb.ToString();

        }

        private string writeProperties(Entity entity)
        {
            StringBuilder sb = new StringBuilder();


            foreach (EntityProperty p in entity.Properties)
            {
                sb.AppendLine("        /**");
                if (p is OptionSetProperty)
                {
                    sb.AppendLine("        " + p.Description);
                    sb.AppendLine("        Valid values are:");
                    foreach (Option o in ((OptionSetProperty)p).Options)
                    {
                        sb.AppendLine(string.Format("        {0} : {1}", o.Value, o.Label));
                    }
                }
                else
                {
                    sb.AppendLine("        " + p.Description);
                }
                sb.AppendLine("        */");

                if (p.IsReadOnly)
                {
                    sb.AppendLine(string.Format("         {0}: {1};", p.Name, getJSType(p.Type)));
                }
                else
                {
                    sb.AppendLine(string.Format("        {0}: {1};", p.Name, getJSType(p.Type)));
                }
            }

            foreach (LookupProperty l in entity.Lookups)
            {

                if (l.IsReadOnly)
                {
                    sb.AppendLine("        /**");
                    sb.AppendLine("        Read only: " + l.Description);
                    sb.AppendLine("        */");
                    sb.AppendLine(string.Format("         {0}: {1};", l.Name, (l.Type == "import") ? "Import" : l.Type));
                }
                else
                {
                    sb.AppendLine("        /**");
                    sb.AppendLine("        " + l.Description);
                    sb.AppendLine("        This property can only be set on create to create a new related " + getJSType(l.Type));
                    sb.AppendLine("        */");
                    sb.AppendLine(string.Format("        {0}: {1};", l.Name, (l.Type == "import")? "Import":l.Type));
                }
            }

            foreach (LookupProperty l in entity.Lookups)
            {

                if (!l.IsReadOnly)
                {
                    sb.AppendLine("        /**");
                    sb.AppendLine("        Set " + l.Description);
                    sb.AppendLine(string.Format("        Value must be a URI to an existing {0}.", getJSType(l.Type)));
                    sb.AppendLine("        */");
                    sb.AppendLine(string.Format("        \"{0}@odata.bind\": string;", l.Name));
                }

            }

            foreach (LookupProperty l in entity.Lookups)
            {

                if (!l.IsReadOnly)
                {
                    sb.AppendLine("        /**");
                    sb.AppendLine("        " + l.Description);
                    sb.AppendLine(string.Format("         * @param uri The uri to an existing {0}.", getJSType(l.Type)));
                    sb.AppendLine("        */");
                    sb.AppendLine(string.Format("        {0}Uri(uri:string);", l.Name));
                }
            }

            foreach (CollectionProperty c in entity.Collections)
            {
                sb.AppendLine("        /**");
                sb.AppendLine("        A collection of related " + getJSType(c.Type));
                sb.AppendLine("        */");
                sb.AppendLine(string.Format("        {0}: Array<{1}>;", c.Name, getJSType(c.Type)));
            }



            return sb.ToString();
        }

        private string writeFunctions()
        {
            StringBuilder sb = new StringBuilder();

            foreach (Function ft in model.Functions)
            {
                List<string> parameters = new List<string>();



                sb.AppendLine("    /**");
                sb.AppendLine(string.Format("    * {0}", ft.Description));
                bool isBound = ft.BoundTypes.Count > 0;


                if (isBound)
                {
                    List<string> boundToTypes = new List<string>();
                    BindingType bindingtype = ft.BoundTypes.FirstOrDefault().BoundTo;

                    foreach (Binding b in ft.BoundTypes)
                    {
                        boundToTypes.Add(b.Type);
                    }

                    parameters.Add("uri: string");
                    if (bindingtype == BindingType.Collection)
                    {
                        sb.AppendLine(string.Format("    * @param uri A url for a collection of {0} to apply the function to.", string.Join(",", boundToTypes.ToArray())));
                    }
                    else
                    {
                        sb.AppendLine(string.Format("    * @param uri A url for a {0} to apply the function to.", string.Join(",", boundToTypes.ToArray())));
                    }



                }
                foreach (Parameter p in ft.Parameters)
                {
                    sb.AppendLine(string.Format("    * @param {0} {1}", lowerCaseFirstLetter(p.Name), p.Description));
                    string typeName = trimNameSpace(getJSType(p.Type), RootNameSpace, SubNamespace);
                    parameters.Add(string.Format("{0}: {1}", lowerCaseFirstLetter(p.Name), typeName));
                }
                if (ft.IsComposable)
                {
                    parameters.Add("query?: string");
                    parameters.Add("includeFormattedValues?: boolean");
                }
                if (!excludeCallerId.Contains(ft.Name))
                {
                    parameters.Add("callerId?: string");
                    sb.AppendLine(string.Format("    * @param {0} {1}", "callerId", "A string representation of the GUID value for the user to impersonate"));
                }

                sb.AppendLine("    */");
                sb.Append(string.Format("    function {0}(", ft.Name));
                if (parameters.Count > 0)
                {
                    sb.AppendLine();
                    sb.Append("        ");
                    sb.Append(string.Format("{0}", string.Join(","+Environment.NewLine+ "        ", parameters.ToArray())));
                    sb.AppendLine();
                }
                
                string returnTypeName = trimNameSpace(getJSType(ft.ReturnType), RootNameSpace, SubNamespace);
                sb.Append(string.Format("): Promise<{0}>;", returnTypeName));
                sb.AppendLine();
            }

            return sb.ToString();
        }

        private string writeActions()
        {
            StringBuilder sb = new StringBuilder();

            foreach (CrmWebAPIModel.Action at in model.Actions)
            {
                List<string> parameters = new List<string>();



                sb.AppendLine("    /**");
                sb.AppendLine(string.Format("    * {0}", at.Description));
                bool isBound = at.BoundTypes.Count > 0;


                if (isBound)
                {
                    List<string> boundToTypes = new List<string>();
                    BindingType bindingtype = at.BoundTypes.FirstOrDefault().BoundTo;

                    foreach (Binding b in at.BoundTypes)
                    {
                        boundToTypes.Add(b.Type);
                    }

                    parameters.Add("uri: string");
                    if (bindingtype == BindingType.Collection)
                    {
                        sb.AppendLine(string.Format("    * @param uri A url for a collection of {0} to apply the action to.", string.Join(",", boundToTypes.ToArray())));
                    }
                    else
                    {
                        sb.AppendLine(string.Format("    * @param uri A url for a {0} to apply the action to.", string.Join(",", boundToTypes.ToArray())));
                    }



                }
                foreach (Parameter p in at.Parameters)
                {
                    sb.AppendLine(string.Format("    * @param {0} {1} {2}", lowerCaseFirstLetter(p.Name), p.Description, (p.Nullable)? "(Required parameter can be null)" : "(Required)"));
                    string typeName = trimNameSpace(getJSType(p.Type), RootNameSpace, SubNamespace);
                    parameters.Add(string.Format("{0}: {1}", lowerCaseFirstLetter(p.Name), typeName));
                }

                    parameters.Add("callerId?: string");
                    sb.AppendLine(string.Format("    * @param {0} {1}", "[callerId]", "A string representation of the GUID value for the user to impersonate"));
               

                sb.AppendLine("    */");
                sb.Append(string.Format("    function {0}(", at.Name));
                if (parameters.Count > 0)
                {
                    sb.Append(Environment.NewLine + "        ");
                    sb.Append(string.Format("{0}", string.Join("," + Environment.NewLine + "        ", parameters.ToArray())));
                    sb.Append(Environment.NewLine + "    ");
                }
                

                if (at.ReturnType != null)
                {
                    string returnTypeName = trimNameSpace(getJSType(at.ReturnType), RootNameSpace, SubNamespace);
                    sb.Append(string.Format("): Promise<{0}>;", returnTypeName));
                }
                else
                {
                   
                    sb.Append("): Promise<void>;");
                }
                
                sb.AppendLine();
            }

            return sb.ToString();
        }

        private string writeComplexTypes()
        {
            StringBuilder sb = new StringBuilder();

            foreach (ComplexType ct in model.ComplexTypes)
            {

                sb.AppendLine("    /**");
                sb.AppendLine(string.Format("    * {0}", ct.Description));
                sb.AppendLine("    */");
                sb.AppendLine(string.Format("    class {0} {{", ct.Name));
                foreach (ComplexTypeProperty p in ct.Properties)
                {
                    sb.AppendLine("    /**");
                    sb.AppendLine(string.Format("    * {0}", p.Description));
                    sb.AppendLine("    */");
                    string typeName = trimNameSpace(getJSType(p.Type), RootNameSpace, SubNamespace);
                    sb.AppendLine(string.Format("        {0}: {1};", p.Name, typeName));

                }
                sb.AppendLine("    }");

            }

            return sb.ToString();
        }

        private string writeEnumTypes()
        {
            StringBuilder sb = new StringBuilder();

            foreach (EnumType et in model.EnumTypes)
            {
                List<string> names = new List<string>();
                sb.AppendLine("    /**");
                sb.AppendLine(string.Format("    * {0}", et.Description));
                foreach (Member m in et.Members)
                {
                    sb.AppendLine(string.Format("    * @member {0} {1}", m.Name, m.Description));
                    names.Add(string.Format("\"{0}\"", m.Name));
                }
                sb.AppendLine("    */");
                sb.Append(string.Format("    type {0} = ", et.Name));
                sb.Append(string.Format("{0};", string.Join("|", names.ToArray())));
                sb.AppendLine();
            }

            return sb.ToString();
        }

        private void AddCoreLibrary(StringBuilder sb, string modelDefinitions, string metadataInterfaces)
        {
            string filePath = @"JavaScriptWriterResources\CoreTSDefinition.d.ts";

            if (File.Exists(filePath))
            {
                string fileContent = File.ReadAllText(filePath);
                fileContent = fileContent.Replace("ROOTNAMESPACE", RootNameSpace);
                fileContent = fileContent.Replace("SUBNAMESPACE", SubNamespace);
                fileContent = fileContent.Replace("//METADATAPROPERTYINTERFACES", metadataInterfaces);
                fileContent = fileContent.Replace("//MODELDEFINITIONS", modelDefinitions);

                if (enableOAuth)
                {
                    string adalFunctions = File.ReadAllText(@"JavaScriptWriterResources\ADALFunctions.d.ts");
                    fileContent = fileContent.Replace("//ADALFUNCTIONS", adalFunctions);
                }
                else
                {
                    fileContent = fileContent.Replace("//ADALFUNCTIONS", "// This library is not configured to support ADAL");
                }

                sb.Append(fileContent);
            }
            else
            {
                throw new Exception(String.Format("CoreTSDefinition.d.ts file not found at {0}", filePath));
            }


        }

        internal void WriteTSFile(string outputFolderValue)
        {
            if (RootNameSpace == null || RootNameSpace == string.Empty)
            { throw new Exception("RootNameSpace property must be set"); }
            if (SubNamespace == null || SubNamespace == string.Empty)
            { throw new Exception("SubNamespace property must be set"); }
            if (libraryName == null || libraryName == string.Empty)
            { throw new Exception("libraryName property must be set"); }

            if (outputFolderValue == null || outputFolderValue == string.Empty)
            { throw new Exception("outputFolderValue parameter is required"); }


            string fileString = getTSFileString();

            File.WriteAllText(string.Format(@"{0}\{1}.{2}.{3}.d.ts", outputFolderValue, RootNameSpace, SubNamespace, libraryName), fileString);
        }

        private string getJSType(string type)
        {
            string JSType;

            if (type.StartsWith("Collection("))
            {
                JSType = string.Format("Array<{0}>", getJSCollectionType(type));
            }
            else
            {
                switch (type)
                {
                    case "Edm.Decimal":
                    case "Edm.Double":
                    case "Edm.Int32":
                    case "Edm.Int64":
                        JSType = "number";
                        break;
                    case "Edm.Boolean":
                        JSType = "boolean";
                        break;
                    case "Edm.Date":
                    case "Edm.DateTimeOffset":
                        JSType = "Date";
                        break;
                    case "Edm.Guid":
                    case "Edm.String":
                    case "Edm.Binary":
                        JSType = "string";
                        break;
                    case "mscrm.BooleanManagedProperty":
                        JSType = string.Format("{0}.{1}.BooleanManagedProperty", RootNameSpace, SubNamespace);
                        break;
                    case "import":
                        JSType = JSType = string.Format("{0}.{1}.{2}", RootNameSpace, SubNamespace, "Import");
                        break;
                    default:
                        JSType = JSType = string.Format("{0}.{1}.{2}", RootNameSpace, SubNamespace, type);
                        break;

                }
            }

            return JSType;
        }

        private string getJSCollectionType(string type)
        {

            if (!type.StartsWith("Collection(") & type.EndsWith(")"))
            {
                throw new Exception("Invalid value passed to getJSCollectionType");
            }
            string collectionType = type.Substring("Collection(".Length).Replace(")", string.Empty);

            return getJSType(collectionType);
        }

        private Entity getEntityByName(string name)
        {
            foreach (Entity e in model.Entities)
            {
                if (e.Name.Equals(name))
                {
                    return e;
                }
            }
            return null;
        }

        private string lowerCaseFirstLetter(string value)
        {
            return Char.ToLowerInvariant(value[0]) + value.Substring(1);
        }

        private string trimNameSpace(string typeName, string rns, string bns)
        {

            string ns = string.Format("{0}.{1}.", rns, bns);

            return typeName.Replace(ns, string.Empty);

        }

        /// <summary>
        /// Converts 'import' to 'Import' to avoid TypeScript conflict
        /// Only use this in place of entity.Name when writing to a file
        /// </summary>
        /// <param name="entity"></param>
        /// <returns></returns>
        private string getEntityName(Entity entity)
        {
            if (entity.Name == "import")
            {
                return "Import";
            }
            return entity.Name;
        }
    }
}
