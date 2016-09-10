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
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;



namespace CRMWebAPIJavaScriptWriter
{
    class JavaScriptWriter
    {
        public Model model { get; set; }
        public string RootNameSpace { get; set; }
        public string SubNamespace { get; set; }
        public string libraryName { get; set; }
        public bool enableOAuth { get; set; }

        public bool writePropertyComments { get; set; }

        //It doesn't make sense to include callerId parameter on these functions
        private static List<String> excludeCallerId = new List<string>(new string[] { "WhoAmI", "RetrieveUserPrivileges", "RetrieveVersion" });

        public async Task<string> getJavaScriptFileString()
        {

            StringBuilder sb = new StringBuilder();

            try
            {
                await AddExternalLibrary(sb, "https://cdnjs.cloudflare.com/ajax/libs/es6-promise/3.0.2/es6-promise.min.js");
            }
            catch (Exception)
            {
                throw new Exception("Error downloading es6-promise polyfill library.");
            }



            if (enableOAuth)
            {
                try
                {
                    await AddExternalLibrary(sb, "https://secure.aadcdn.microsoftonline-p.com/lib/1.0.10/js/adal.min.js");
                }
                catch (Exception)
                {

                    throw new Exception("Error downloading adal.min.js library.");
                }

            }

            AddCoreLibrary(sb, ModelDefinitions());

            return sb.ToString();

        }
        public void WriteJavaScriptFile(string path, string fileString)
        {
            if (string.IsNullOrEmpty(RootNameSpace))
            { throw new Exception("RootNameSpace property must be set"); }
            if (string.IsNullOrEmpty(SubNamespace))
            { throw new Exception("SubNamespace property must be set"); }
            if (string.IsNullOrEmpty(libraryName))
            { throw new Exception("libraryName property must be set"); }

            if (string.IsNullOrEmpty(path))
            { throw new Exception("path parameter is required"); }

            if (string.IsNullOrEmpty(fileString))
            { throw new Exception("fileString parameter is required"); }


            File.WriteAllText(string.Format(@"{0}\{1}.{2}.{3}.js", path, RootNameSpace, SubNamespace, libraryName), fileString);

        }

        private async Task AddExternalLibrary(StringBuilder sb, string externalLibraryUrl)
        {
            using (HttpClient client = new HttpClient())
            {

                HttpResponseMessage externalLibraryResponse = await client.GetAsync(externalLibraryUrl);

                if (externalLibraryResponse.StatusCode != HttpStatusCode.OK)
                {
                    throw new Exception(String.Format("Error retrieving external Library: {0}", externalLibraryResponse.StatusCode));
                }

                string externalLibrary = await externalLibraryResponse.Content.ReadAsStringAsync();

                //Promise library *replaces* native promise and can lead to very slow performance in some cases with Edge 
                //when perhaps it doesn't replace it completely. Nested promises taking many minutes to complete.
                sb.AppendLine("//Don't overwrite native promise");
                sb.AppendLine("if(!window.Promise){");
                sb.AppendLine(externalLibrary);
                sb.AppendLine("}");
            }
        }

        private void AddCoreLibrary(StringBuilder sb, string modelDefinitions)
        {

            string filePath = @"JavaScriptWriterResources\CoreLibrary.js";

            if (File.Exists(filePath))
            {
                string fileContent = File.ReadAllText(filePath);

                fileContent = fileContent.Replace("ROOTNAMESPACE", RootNameSpace);
                fileContent = fileContent.Replace("SUBNAMESPACE", SubNamespace);
                fileContent = fileContent.Replace("MODELDEFINITIONS", modelDefinitions);
                fileContent = fileContent.Replace("WEBAPIVERSION", model.webAPIVersion);
                if (enableOAuth)
                {
                    string adalFunctions = File.ReadAllText(@"JavaScriptWriterResources\ADALFunctions.js");

                    adalFunctions = adalFunctions.Replace("ROOTNAMESPACE", RootNameSpace);
                    adalFunctions = adalFunctions.Replace("SUBNAMESPACE", SubNamespace);

                    string ADALSupportPart1 = @"            //ADAL Support Part 1 Start
            _authContext.acquireToken(_clientUrl, function (error, token) {
                if (error || !token) {
                    reject(new Error('ADAL error occurred: ' + error))
                }
           //ADAL Support Part 1 END";

                    string ADALSupportPart2 = @"                //ADAL Support Part 2 Start
                req.setRequestHeader(""Authorization"", ""Bearer "" + token);
                //ADAL Support Part 2 End";

                    string ADALSupportPart3 = @"            //ADAL Support Part 3 Start
            });
            //ADAL Support Part 3 END";

                    fileContent = fileContent.Replace("ADALFUNCTIONS", adalFunctions);
                    fileContent = fileContent.Replace("ADALSUPPORTPART1", ADALSupportPart1);
                    fileContent = fileContent.Replace("ADALSUPPORTPART2", ADALSupportPart2);
                    fileContent = fileContent.Replace("ADALSUPPORTPART3", ADALSupportPart3);
                }
                else
                {
                    fileContent = fileContent.Replace("ADALFUNCTIONS", string.Empty);
                    fileContent = fileContent.Replace("ADALSUPPORTPART1", string.Empty);
                    fileContent = fileContent.Replace("ADALSUPPORTPART2", string.Empty);
                    fileContent = fileContent.Replace("ADALSUPPORTPART3", string.Empty);
                }

                sb.Append(fileContent);

            }
            else
            {
                throw new Exception(String.Format("Core Library file not found at {0}", filePath));
            }
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

        private string getJSType(string type)
        {
            string JSType;

            if (type.StartsWith("Collection("))
            {
                JSType = "Array";
            }
            else
            {
                switch (type)
                {
                    case "Edm.Decimal":
                    case "Edm.Double":
                    case "Edm.Int32":
                    case "Edm.Int64":
                        JSType = "Number";
                        break;
                    case "Edm.Boolean":
                        JSType = "Boolean";
                        break;
                    case "Edm.Date":
                    case "Edm.DateTimeOffset":
                        JSType = "Date";
                        break;
                    case "Edm.Guid":
                        JSType = "Guid";
                        break;
                    case "Edm.String":
                    case "Edm.Binary":
                        JSType = "String";
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

        #region entities
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
        private string writeEntityComments(Entity entity)
        {

            StringBuilder sb = new StringBuilder();
            sb.AppendLine(@"
/**");
            sb.AppendLine(string.Format("@typeref {{object}} {0}.{1}.{2}", RootNameSpace, SubNamespace, getEntityName(entity)));
            sb.AppendLine(string.Format("@extends {0}.{1}.{2}", RootNameSpace, SubNamespace, entity.BaseEntity));
            sb.AppendLine(string.Format("@description {0}", entity.Description));
            sb.AppendLine(string.Format("@param {{String|Object}}[{0}Reference] A GUID, a URI, or a JSON object to set retrieved values.", getEntityName(entity)));
            if (writePropertyComments)
            {
                sb.Append(writeEntityPropertyComments(entity));
            }


            sb.AppendLine("*/");

            return sb.ToString();
        }

        private string writeEntityPropertyComments(Entity entity)
        {
            StringBuilder sb = new StringBuilder();
            foreach (EntityProperty p in entity.Properties)
            {

                if (p.IsReadOnly)
                { sb.AppendLine(string.Format("@readonly {{{0}}} {1} {2}<br/>", getJSType(p.Type), p.Name, p.Description)); }
                else
                {
                    sb.AppendLine(string.Format("@property {{{0}}} {1} {2}<br/>", getJSType(p.Type), p.Name, p.Description));
                }
                if (p is OptionSetProperty)
                {
                    OptionSetProperty op = (OptionSetProperty)p;
                    sb.AppendLine("Valid values are:<br/>");
                    List<string> options = new List<string>();
                    foreach (Option o in op.Options)
                    {
                        options.Add(string.Format("{0} : {1}", o.Value, o.Label));
                    }
                    sb.Append(string.Join("<br/>" + Environment.NewLine, options));
                    sb.AppendLine(string.Empty);

                }
            }
            foreach (LookupProperty p in entity.Lookups)
            {
                if (p.IsReadOnly)
                { sb.AppendLine(string.Format("@readonly {{{0}.{1}.{2}}} {3} {4}<br/>", RootNameSpace, SubNamespace, p.Type, p.Name, p.Description)); }
                else
                {
                    sb.AppendLine(string.Format("@property {{{0}.{1}.{2}}} {3} {4}<br/>", RootNameSpace, SubNamespace, p.Type, p.Name, p.Description));
                }
            }
            foreach (CollectionProperty p in entity.Collections)
            {
                sb.AppendLine(string.Format("@property {{Array}} {0} A collection of {1}.{2}.{3}<br/>", p.Name, RootNameSpace, SubNamespace, p.Type));
            }

            return sb.ToString();
        }

        private string writeEntityDefinition(Entity entity)
        {


            StringBuilder sb = new StringBuilder();

            sb.AppendLine(string.Format("this.{0} = function ({0}Reference) {{", getEntityName(entity)));
            sb.Append(string.Format(@"if (!(isInstanceOf({0}.{1}.{2}, this))) {{
    return new {0}.{1}.{2}({2}Reference);
}}" + Environment.NewLine, RootNameSpace, SubNamespace, getEntityName(entity)));
            sb.AppendLine(string.Format("{0}.{1}.{2}.call(this);", RootNameSpace, SubNamespace, entity.BaseEntity));


            sb.AppendLine("        Object.defineProperties(this,");
            sb.AppendLine("        {");

            List<string> propertyDefinitions = new List<string>();

            if (entity.IsBaseEntity)
            {
                propertyDefinitions.Add(@"            ""@odata.type"": {
                get: function() { return ""Microsoft.Dynamics.CRM."" + this.type; },
                enumerable: true,
                configurable: true
            }");
            }
            else
            {
                propertyDefinitions.Add(@"            ""@odata.type"": {
                get: function() { return ""Microsoft.Dynamics.CRM."" + this.type; },
                enumerable: true
            }");
            }


            propertyDefinitions.Add("    //Properties");

            foreach (EntityProperty p in entity.Properties)
            {
                propertyDefinitions.Add(getPropertyDefinition(p, getEntityName(entity)));
            }

            propertyDefinitions.Add("    //Single-valued Navigation Properties");
            foreach (LookupProperty lp in entity.Lookups)
            {
                propertyDefinitions.Add(getLookupPropertyDefinition(lp, getEntityName(entity)));
            }
            propertyDefinitions.Add("    //Collection-Valued Navigation Properties");
            foreach (CollectionProperty cp in entity.Collections)
            {

                propertyDefinitions.Add(getCollectionPropertyDefinitions(cp, getEntityName(entity)));
            }

            sb.Append(string.Join("," + Environment.NewLine, propertyDefinitions.ToArray()));


            sb.AppendLine(Environment.NewLine + "        });");
            sb.Append(string.Format(@"
        if ({0}Reference) {{
            init(this.internal, {0}Reference, this.primaryKey, this.type, this.changedProperties);
        }}" + Environment.NewLine, getEntityName(entity)));

            if (entity.IsBaseEntity)
            {
                sb.AppendLine("        return this;");
            }
            else
            {
                sb.AppendLine("        return Object.seal(this);");
            }




            sb.AppendLine("    }");

            sb.AppendLine(string.Format("this.{0}.prototype = Object.create(this.{1}.prototype);", getEntityName(entity), entity.BaseEntity));
            sb.AppendLine(string.Format("this.{0}.isEntityClass = true;", getEntityName(entity)));

            sb.AppendLine(string.Format("this.{0}.prototype.type = \"{0}\";", entity.Name)); //Don't use getEntityName. Type for Import is 'import'.
            sb.AppendLine(string.Format("this.{0}.prototype.primaryKey = \"{1}\";", getEntityName(entity), entity.PrimaryKey));
            if (!(entity.EntitySetName == null))
            {
                sb.AppendLine(string.Format("this.{0}.prototype.entitySetName = \"{1}\";", getEntityName(entity), entity.EntitySetName));
            }

            List<string> propertyNames = new List<string>();
            List<string> lookups = new List<string>();
            List<string> collections = new List<string>();
            if (entity.BaseEntity.Equals("activitypointer"))
            {
                Entity activitypointer = getEntityByName("activitypointer");
                foreach (EntityProperty p in activitypointer.Properties)
                {
                    propertyNames.Add(string.Format("            {0}:{{ name:\"{0}\", type:\"{1}\"}}", p.Name, getJSType(p.Type)));
                }
                foreach (LookupProperty lp in activitypointer.Lookups)
                {
                    lookups.Add(string.Format("            {0}:{{ name:\"{0}\", type:{1}.{2}.{3}}}", lp.Name, RootNameSpace, SubNamespace, lp.Type));
                }
                foreach (CollectionProperty cp in activitypointer.Collections)
                {
                    collections.Add(string.Format("            {0}:{{ name:\"{0}\", type:{1}.{2}.{3}}}", cp.Name, RootNameSpace, SubNamespace, cp.Type));
                }
            }
            foreach (EntityProperty p in entity.Properties)
            {
                propertyNames.Add(string.Format("            {0}:{{ name:\"{0}\", type:\"{1}\"}}", p.Name, getJSType(p.Type)));
            }
            foreach (LookupProperty lp in entity.Lookups)
            {
                lookups.Add(string.Format("            {0}:{{ name:\"{0}\", type:{1}.{2}.{3}}}", lp.Name, RootNameSpace, SubNamespace, lp.Type));
            }
            foreach (CollectionProperty cp in entity.Collections)
            {
                collections.Add(string.Format("            {0}:{{ name:\"{0}\", type:{1}.{2}.{3}}}", cp.Name, RootNameSpace, SubNamespace, cp.Type));
            }

            sb.AppendLine(string.Format("this.{0}.prototype.properties = Object.freeze({{{1}}});", getEntityName(entity), string.Join("," + Environment.NewLine, propertyNames.ToArray())));
            sb.AppendLine(string.Format("this.{0}.prototype.lookups = Object.freeze({{{1}}});", getEntityName(entity), string.Join("," + Environment.NewLine, lookups.ToArray())));
            sb.AppendLine(string.Format("this.{0}.prototype.collections = Object.freeze({{{1}}});", getEntityName(entity), string.Join("," + Environment.NewLine, collections.ToArray())));


            foreach (LookupProperty p in entity.Lookups)
            {
                if (!p.IsReadOnly)
                {

                    sb.Append(string.Format(@"
    /**
    @method {0}Uri
    @memberof {1}.{2}.{3}
    @description  {4}
    @param {{String}} uri A URI to an existing {1}.{2}.{5}.
    */", p.Name, RootNameSpace, SubNamespace, getEntityName(entity), p.Description, p.Type));

                    sb.Append(string.Format(@"
    this.{0}.prototype.{1}Uri = function (uri) {{
        this[""{1}@odata.bind""] = uri;
    }}
                ", getEntityName(entity), p.Name));

                }
            }

            return sb.ToString();
        }

        private string getPropertyDefinition(EntityProperty p, string entityName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(string.Format("            \"{0}\": {{", p.Name));
            sb.AppendLine(string.Format("                get: function () {{ return this.internal.{0}; }},", p.Name));
            string setterFunctionName = "isNotImplemented";
            if (!p.IsReadOnly)
            {
                switch (p.Type)
                {
                    case "Edm.Int64":
                    case "Edm.Int32":
                    case "Edm.Decimal":
                    case "Edm.Double":
                        setterFunctionName = "setNumberOrNullProperty";
                        break;
                    case "Edm.Boolean":
                        setterFunctionName = "setBooleanProperty";
                        break;
                    case "Edm.DateTimeOffset":
                        setterFunctionName = "setDateTimeOffsetProperty";
                        break;
                    case "Edm.Date":
                        setterFunctionName = "setDateOnlyProperty";
                        break;
                    case "Edm.String":
                    case "Edm.Binary":
                        setterFunctionName = "setStringOrNullProperty";
                        break;
                    case "Edm.Guid":
                        setterFunctionName = "setGuidOrNullProperty";
                        break;
                    case "mscrm.BooleanManagedProperty":
                        setterFunctionName = "setBooleanManagedProperty";
                        break;
                    default:
                        throw new Exception("Unexpected property type:" + p.Type);
                }

                sb.AppendLine(string.Format("                set: function (value) {{ {0}(this, \"{1}\", value) }},", setterFunctionName, p.Name));
            }
            sb.AppendLine("                enumerable: true");
            sb.Append("            }");
            return sb.ToString();
        }
        private string getLookupPropertyDefinition(LookupProperty lp, string entityName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(string.Format("            \"{0}\": {{", lp.Name));
            sb.AppendLine(string.Format("                get: function () {{ return this.internal.{0}; }},", lp.Name));
            if (!lp.IsReadOnly)
            {
                sb.AppendLine(string.Format("                set: function (value) {{ lookupPropertySetter({0}.{1}.{2},\"{2}\", this, \"{3}\", value)}},", RootNameSpace, SubNamespace, lp.Type, lp.Name));
            }
            sb.AppendLine("                enumerable: true");

            if (!lp.IsReadOnly)
            {
                sb.AppendLine("            },");

                sb.AppendLine(string.Format("            \"{0}@odata.bind\": {{", lp.Name));
                sb.AppendLine(string.Format("                get: function () {{ return this.internal.{0}Uri; }},", lp.Name));
                sb.AppendLine(string.Format("                set: function (value) {{ lookupPropertyBinder({0}.{1}.{2},\"{2}\", this, \"{3}\", value)}},", RootNameSpace, SubNamespace, lp.Type, lp.Name));
                sb.AppendLine("                enumerable: true");
                sb.Append("            }");
            }
            else
            {
                sb.Append("            }");
            }
            return sb.ToString();
        }
        private string getCollectionPropertyDefinitions(CollectionProperty cp, string entityName)
        {
            StringBuilder sb = new StringBuilder();
            sb.AppendLine(string.Format("            \"{0}\": {{", cp.Name));
            sb.AppendLine(string.Format("                get: function () {{ return this.internal.{0}; }},", cp.Name));
            sb.AppendLine(string.Format("                set: function (value) {{ collectionPropertySetter({0}.{1}.{2},\"{2}\", this, \"{3}\", value)}},", RootNameSpace, SubNamespace, cp.Type, cp.Name));
            sb.AppendLine("                enumerable: true,");
            sb.Append("            }");

            return sb.ToString();
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

        #endregion entities

        #region functions
        private string writeFunctions()
        {
            StringBuilder sb = new StringBuilder();
            foreach (Function function in model.Functions)
            {
                sb.Append(writeFunctionComments(function));
                sb.Append(writeFunctionDefinition(function));
            }

            return sb.ToString();
        }

        private string writeFunctionComments(Function function)
        {

            StringBuilder sb = new StringBuilder();
            sb.AppendLine("    /**");
            sb.AppendLine(string.Format("    * @function {0}.{1}.{2}", RootNameSpace, SubNamespace, function.Name));
            sb.AppendLine(string.Format("    * @memberOf {0}.{1}", RootNameSpace, SubNamespace));
            sb.AppendLine(string.Format("    * @description {0}", function.Description));
            if (function.BoundTypes.Count > 0)
            {
                List<string> boundToTypes = new List<string>();
                BindingType bindingtype = function.BoundTypes.FirstOrDefault().BoundTo;

                foreach (Binding b in function.BoundTypes)
                {
                    boundToTypes.Add(b.Type);
                }

                string description;
                if (bindingtype == BindingType.Collection)
                {
                    description = string.Format("A url for a collection of {0} to apply the function to.", string.Join(",", boundToTypes.ToArray()));
                }
                else
                {
                    description = string.Format("A url for a {0} to apply the function to.", string.Join(",", boundToTypes.ToArray()));
                }

                sb.AppendLine(string.Format("    * @param {{String}} uri {0}", description));
            }
            foreach (Parameter p in function.Parameters)
            {
                string type;
                if (p.Type.StartsWith("Collection("))
                {
                    type = "Array";
                }
                else
                {
                    type = getJSType(p.Type);
                }

                sb.AppendLine(string.Format("    * @param {{{0}}} {1} {2}", type, lowerCaseFirstLetter(p.Name), p.Description));


            }
            if (function.IsComposable)
            {
                sb.AppendLine("    * @param {String} [query] Include an additional $select or $filter system query option to control which columns are returned in the results");
                sb.AppendLine("    * @param {Boolean} [includeFormattedValues] Whether to include formatted values in the results");
            }
            if (!excludeCallerId.Contains(function.Name))
            {
                sb.AppendLine("    * @param {String} [callerId] A string representation of the GUID value for the user to impersonate.");
            }
            if (!function.ReturnType.StartsWith("Collection("))
            {
                sb.AppendLine(string.Format("    * @returns {{Promise}} A {0}.{1}.{2} instance when resolved or an Error if rejected. ", RootNameSpace, SubNamespace, function.ReturnType));
            }
            else
            {
                sb.AppendLine(string.Format("    * @returns {{Promise}} A {0} when resolved or an Error if rejected. ", function.ReturnType));
            }

            sb.AppendLine("    */");

            return sb.ToString();
        }

        private string lowerCaseFirstLetter(string value)
        {
            return Char.ToLowerInvariant(value[0]) + value.Substring(1);
        }
        private string writeFunctionDefinition(Function function)
        {
            StringBuilder sb = new StringBuilder();

            List<string> parameterNames = new List<string>();
            Boolean isBound = function.BoundTypes.Count > 0;

            if (isBound)
            {
                parameterNames.Add("uri");

            }
            foreach (Parameter p in function.Parameters)
            {
                parameterNames.Add(lowerCaseFirstLetter(p.Name));
            }
            if (function.IsComposable)
            {
                parameterNames.Add("query");
                parameterNames.Add("includeFormattedValues");

            }

            if (!excludeCallerId.Contains(function.Name))
            {
                parameterNames.Add("callerId");
            }

            if (parameterNames.Count > 0)
            {
                sb.AppendLine(string.Format("    this.{0} = function (", function.Name));
                sb.Append("        ");
                sb.Append(string.Join("," + Environment.NewLine + "        ", parameterNames.ToArray()));
                sb.AppendLine(Environment.NewLine + "        ) {");
            }
            else
            {
                sb.AppendLine(string.Format("    this.{0} = function (){{", function.Name));
            }




            if (isBound)
            {
                sb.AppendLine(String.Format(@"        if (!isString(uri)) {{
            throw new Error(NS+"".{0} uri parameter must be a string."");
        }}", function.Name));
            }


            foreach (Parameter p in function.Parameters)
            {
                var type = getJSType(p.Type);


                string validationFunction = getValidationFunction(p, type);

                sb.AppendLine(string.Format("        if(!{0}) {{", validationFunction));

                string errorMessage;
                if (p.Nullable)
                {
                    errorMessage = string.Format(".{0} {1} parameter must be a {2} value or null.", function.Name, lowerCaseFirstLetter(p.Name), type);
                }
                else
                {
                    errorMessage = string.Format(".{0} {1} parameter must be a {2} value.", function.Name, lowerCaseFirstLetter(p.Name), type);
                }

                sb.AppendLine(string.Format("            throw new Error(NS + \"{0}\");", errorMessage));
                sb.AppendLine("        }");
            }

            if (function.IsComposable)
            {
                sb.AppendLine(String.Format(@"        if (!isOptionalString(query)) {{
            throw new Error(NS+"".{0} query parameter must be a string value, null or undefined."");
        }}", function.Name));

                sb.AppendLine(String.Format(@"        if (!isOptionalBoolean(includeFormattedValues)) {{
            throw new Error(NS+"".{0} includeFormattedValues parameter must be a Boolean value, null or undefined."");
        }}", function.Name));
            }
            if (!excludeCallerId.Contains(function.Name))
            {
                sb.AppendLine(String.Format(@"        if (!isOptionalGuid(callerId)) {{
            throw new Error(NS+"".{0} callerId parameter must be a string representation of a GUID value, null or undefined."");
        }}", function.Name));
            }


            if (function.Parameters.Count > 0)
            {
                sb.AppendLine("        var parameters = [];");

                foreach (Parameter p in function.Parameters)
                {

                    if (p.Type == "Edm.Boolean")
                    {
                        sb.AppendLine(string.Format("        if (isBoolean({0})) {{", lowerCaseFirstLetter(p.Name)));
                    }
                    else
                    {
                        sb.AppendLine(string.Format("        if ({0}) {{", lowerCaseFirstLetter(p.Name)));
                    }


                    string modelType = getModelTypeByName(p.Type);
                    switch (modelType)
                    {
                        case "EnumType":
                            sb.AppendLine(string.Format(@"        parameters.push({{ ""{0}"": ""Microsoft.Dynamics.CRM.{1}'""+{2}+""'"", isEnum: true  }});", p.Name, p.Type, lowerCaseFirstLetter(p.Name)));
                            break;
                        case "ComplexType":
                            sb.AppendLine(string.Format(@"        parameters.push({{ ""{0}"": {1}, isComplexType: true  }});", p.Name, lowerCaseFirstLetter(p.Name)));
                            break;
                        case "Entity":
                            sb.AppendLine(string.Format(@"        parameters.push({{ ""{0}"": {1}, isEntity: true  }});", p.Name, lowerCaseFirstLetter(p.Name)));
                            break;
                        default:

                            switch (p.Type)
                            {
                                case "Edm.DateTimeOffset":
                                    sb.AppendLine(string.Format(@"        parameters.push({{ ""{0}"": {1}, isDate: true  }});", p.Name, lowerCaseFirstLetter(p.Name)));
                                    break;
                                default:
                                    sb.AppendLine(string.Format(@"        parameters.push({{ ""{0}"": {1} }});", p.Name, lowerCaseFirstLetter(p.Name)));
                                    break;
                            }
                            break;
                    }
                    sb.AppendLine("        }");

                }
            }

            sb.AppendLine(string.Format(@"        return invokeFunction(""{0}"",{1},{2},{3},{4},{5},{6});",
                function.Name,
                (function.Parameters.Count > 0) ? "parameters" : "null",
                (isBound) ? "uri" : "null",
                (function.IsComposable) ? "query" : "null",
                (function.IsComposable) ? "includeFormattedValues" : "null",
                (!excludeCallerId.Contains(function.Name)) ? "callerId" : "null",
                (function.ReturnType.EndsWith("Response")) ? string.Format("{0}.{1}.{2}", RootNameSpace, SubNamespace, function.ReturnType) : "null"));


            sb.AppendLine("    }");

            return sb.ToString();
        }

        private string getModelTypeByName(string name)
        {

            foreach (ComplexType t in model.ComplexTypes)
            {
                if (t.Name.Equals(name))
                {
                    return "ComplexType";
                }
            }

            foreach (EnumType t in model.EnumTypes)
            {
                if (t.Name.Equals(name))
                {
                    return "EnumType";
                }
            }

            foreach (Entity t in model.Entities)
            {
                if (t.Name.Equals(name))
                {
                    return "Entity";
                }
            }

            foreach (Function t in model.Functions)
            {
                if (t.Name.Equals(name))
                {
                    return "Function";
                }
            }

            foreach (CrmWebAPIModel.Action t in model.Actions)
            {
                if (t.Name.Equals(name))
                {
                    return "Action";
                }
            }

            return "NotFound";
        }

        private string getComplexTypePropertyValidationFunction(ComplexTypeProperty p, string type)
        {
            string validationFunction = "isNotImplemented(value)";

            //Is it a CRM type?
            if (type.StartsWith(string.Format("{0}.{1}.", RootNameSpace, SubNamespace)))
            {
                //find out the CRM type
                string CRMType = type.Substring(string.Format("{0}.{1}.", RootNameSpace, SubNamespace).Length);
                string modelType = getModelTypeByName(CRMType);

                switch (modelType)
                {
                    case "EnumType":
                        if (p.Nullable)
                        {
                            validationFunction = string.Format("isEnumMemberOrNull({0}, value)", type);

                        }
                        else
                        {

                            validationFunction = string.Format("isEnumMember({0}, value)", type);
                        }
                        break;
                    case "ComplexType":
                        if (p.Nullable)
                        {
                            validationFunction = string.Format("isInstanceOf({0},value)", type);

                        }
                        else
                        {
                            validationFunction = string.Format("isInstanceOfOrNull({0},value)", type);
                        }
                        break;
                    default:
                        //Entities, Functions and Actions are not used as Complextype properties
                        //  throw new Exception("Unexpected parameter type.");
                        break;

                }

            }
            else
            {
                switch (type)
                {
                    case "Boolean":
                        validationFunction = "isBoolean(value)";
                        break;
                    case "Date":
                        if (p.Nullable)
                        {
                            validationFunction = "isDateOrNull(value)";

                        }
                        else
                        {
                            validationFunction = "isDate(value)";
                        }
                        break;
                    case "Guid":
                        if (p.Nullable)
                        {
                            validationFunction = "isGuidOrNull(value)";

                        }
                        else
                        {
                            validationFunction = "isGuid(value)";
                        }
                        break;
                    case "Number":
                        if (p.Nullable)
                        {
                            validationFunction = "isNumberOrNull(value)";

                        }
                        else
                        {
                            validationFunction = "isNumber(value)";
                        }
                        break;
                    case "String":
                        if (p.Nullable)
                        {
                            validationFunction = "isStringOrNull(value)";

                        }
                        else
                        {
                            validationFunction = "isString(value)";
                        }
                        break;
                    case "Array":
                        string JSCollectionType = getJSCollectionType(p.Type);

                        if (JSCollectionType.StartsWith(string.Format("{0}.{1}", RootNameSpace, SubNamespace)))
                        {
                            string modelType = getModelTypeByName(JSCollectionType.Substring(string.Format("{0}.{1}.", RootNameSpace, SubNamespace).Length));

                            switch (modelType)
                            {
                                case "EnumType":
                                    if (p.Nullable)
                                    {
                                        validationFunction = string.Format("isArrayOfEnumMemberOrNull({0},value)", JSCollectionType);

                                    }
                                    else
                                    {
                                        validationFunction = string.Format("isArrayOfEnumMember({0},value)", JSCollectionType);
                                    }
                                    break;
                                case "ComplexType":
                                    if (p.Nullable)
                                    {
                                        validationFunction = string.Format("isArrayOfOrNull({0},value)", JSCollectionType);

                                    }
                                    else
                                    {
                                        validationFunction = string.Format("isArrayOf({0},value)", JSCollectionType);
                                    }
                                    break;
                                default:
                                    //Entities, Functions and Actions are not used as Complextype properties
                                    throw new Exception("Unexpected parameter array type.");
                                    break;


                            }
                        }
                        else
                        {
                            switch (JSCollectionType)
                            {
                                case "Boolean":

                                    if (p.Nullable)
                                    {
                                        validationFunction = "isBooleanArrayOrNull(value)";

                                    }
                                    else
                                    {
                                        validationFunction = "isBooleanArray(value)";
                                    }

                                    break;
                                case "Date":
                                    if (p.Nullable)
                                    {
                                        validationFunction = "isDateArrayOrNull(value)";

                                    }
                                    else
                                    {
                                        validationFunction = "isDateArray(value)";
                                    }
                                    break;
                                case "Guid":
                                    if (p.Nullable)
                                    {
                                        validationFunction = "isGuidArrayOrNull(value)";

                                    }
                                    else
                                    {
                                        validationFunction = "isGuidArray(value)";
                                    }
                                    break;
                                case "Number":
                                    if (p.Nullable)
                                    {
                                        validationFunction = "isNumberArrayOrNull(value)";

                                    }
                                    else
                                    {
                                        validationFunction = "isNumberArray(value)";
                                    }
                                    break;
                                case "String":
                                    if (p.Nullable)
                                    {
                                        validationFunction = "isStringArrayOrNull(value)";

                                    }
                                    else
                                    {
                                        validationFunction = "isStringArray(value)";
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    default:
                        break;
                }
            }
            return validationFunction;
        }

        private string getValidationFunction(Parameter p, string type)
        {
            string validationFunction = string.Format("isNotImplemented(value)", p.Name);

            //Is it a CRM type?
            if (type.StartsWith(string.Format("{0}.{1}.", RootNameSpace, SubNamespace)))
            {
                //find out the CRM type
                string CRMType = type.Substring(string.Format("{0}.{1}.", RootNameSpace, SubNamespace).Length);
                string modelType = getModelTypeByName(CRMType);

                switch (modelType)
                {
                    case "EnumType":
                        if (p.Nullable)
                        {
                            validationFunction = string.Format("isOptionalEnumMemberOrNull({0},{1})", type, lowerCaseFirstLetter(p.Name));

                        }
                        else
                        {
                            validationFunction = string.Format("isEnumMember({0},{1})", type, lowerCaseFirstLetter(p.Name));
                        }
                        break;
                    case "ComplexType":
                    case "Entity":
                        if (p.Nullable)
                        {
                            validationFunction = string.Format("isOptionalInstanceOfOrNull({0},{1})", type, lowerCaseFirstLetter(p.Name));

                        }
                        else
                        {
                            validationFunction = string.Format("isInstanceOf({0},{1})", type, lowerCaseFirstLetter(p.Name));
                        }
                        break;
                    default:
                        //Functions and Actions are not used as parameters
                        throw new Exception("Unexpected parameter type.");

                }

            }
            else
            {
                switch (type)
                {
                    case "Boolean":

                        if (p.Nullable)
                        {
                            validationFunction = string.Format("isOptionalBoolean({0})", lowerCaseFirstLetter(p.Name));

                        }
                        else
                        {
                            validationFunction = string.Format("isBoolean({0})", lowerCaseFirstLetter(p.Name));
                        }

                        break;
                    case "Date":
                        if (p.Nullable)
                        {
                            validationFunction = string.Format("isOptionalDate({0})", lowerCaseFirstLetter(p.Name));

                        }
                        else
                        {
                            validationFunction = string.Format("isDate({0})", lowerCaseFirstLetter(p.Name));
                        }
                        break;
                    case "Guid":
                        if (p.Nullable)
                        {
                            validationFunction = string.Format("isOptionalGuid({0})", lowerCaseFirstLetter(p.Name));

                        }
                        else
                        {
                            validationFunction = string.Format("isGuid({0})", lowerCaseFirstLetter(p.Name));
                        }
                        break;
                    case "Number":
                        if (p.Nullable)
                        {
                            validationFunction = string.Format("isOptionalNumber({0})", lowerCaseFirstLetter(p.Name));

                        }
                        else
                        {
                            validationFunction = string.Format("isNumber({0})", lowerCaseFirstLetter(p.Name));
                        }
                        break;
                    case "String":
                        if (p.Nullable)
                        {
                            validationFunction = string.Format("isOptionalString({0})", lowerCaseFirstLetter(p.Name));

                        }
                        else
                        {
                            validationFunction = string.Format("isString({0})", lowerCaseFirstLetter(p.Name));
                        }
                        break;
                    case "Array":
                        string JSCollectionType = getJSCollectionType(p.Type);

                        if (JSCollectionType.StartsWith(string.Format("{0}.{1}", RootNameSpace, SubNamespace)))
                        {
                            string modelType = getModelTypeByName(JSCollectionType.Substring(string.Format("{0}.{1}.", RootNameSpace, SubNamespace).Length));

                            switch (modelType)
                            {
                                case "EnumType":
                                    if (p.Nullable)
                                    {
                                        validationFunction = string.Format("isOptionalArrayOfEnumMemberOrNull({0},{1})", JSCollectionType, lowerCaseFirstLetter(p.Name));

                                    }
                                    else
                                    {
                                        validationFunction = string.Format("isArrayOfEnumMember({0},{1})", JSCollectionType, lowerCaseFirstLetter(p.Name));
                                    }
                                    break;
                                case "ComplexType":
                                case "Entity":
                                    if (p.Nullable)
                                    {
                                        validationFunction = string.Format("isOptionalArrayOfOrNull({0},{1})", JSCollectionType, lowerCaseFirstLetter(p.Name));

                                    }
                                    else
                                    {
                                        validationFunction = string.Format("isArrayOf({0},{1})", JSCollectionType, lowerCaseFirstLetter(p.Name));
                                    }
                                    break;
                                default:
                                    //Functions and Actions are not used as parameters
                                    throw new Exception("Unexpected parameter array type.");

                            }
                        }
                        else
                        {
                            switch (JSCollectionType)
                            {
                                case "Boolean":

                                    if (p.Nullable)
                                    {
                                        validationFunction = string.Format("isOptionalBooleanArrayOrNull({0})", lowerCaseFirstLetter(p.Name));

                                    }
                                    else
                                    {
                                        validationFunction = string.Format("isBooleanArray({0})", lowerCaseFirstLetter(p.Name));
                                    }

                                    break;
                                case "Date":
                                    if (p.Nullable)
                                    {
                                        validationFunction = string.Format("isOptionalDateArrayOrNull({0})", lowerCaseFirstLetter(p.Name));

                                    }
                                    else
                                    {
                                        validationFunction = string.Format("isDateArray({0})", lowerCaseFirstLetter(p.Name));
                                    }
                                    break;
                                case "Guid":
                                    if (p.Nullable)
                                    {
                                        validationFunction = string.Format("isOptionalGuidArrayOrNull({0})", lowerCaseFirstLetter(p.Name));

                                    }
                                    else
                                    {
                                        validationFunction = string.Format("isGuidArray({0})", lowerCaseFirstLetter(p.Name));
                                    }
                                    break;
                                case "Number":
                                    if (p.Nullable)
                                    {
                                        validationFunction = string.Format("isOptionalNumberArrayOrNull({0})", lowerCaseFirstLetter(p.Name));

                                    }
                                    else
                                    {
                                        validationFunction = string.Format("isNumberArray({0})", lowerCaseFirstLetter(p.Name));
                                    }
                                    break;
                                case "String":
                                    if (p.Nullable)
                                    {
                                        validationFunction = string.Format("isOptionalStringArrayOrNull({0})", lowerCaseFirstLetter(p.Name));

                                    }
                                    else
                                    {
                                        validationFunction = string.Format("isStringArray({0})", lowerCaseFirstLetter(p.Name));
                                    }
                                    break;
                                default:
                                    break;
                            }
                        }
                        break;
                    default:
                        break;
                }
            }

            return validationFunction;
        }
        #endregion functions

        #region actions
        private string writeActions()
        {
            StringBuilder sb = new StringBuilder();
            try
            {
                foreach (CrmWebAPIModel.Action action in model.Actions)
                {
                    sb.Append(writeActionComments(action));
                    sb.Append(writeActionDefinition(action));
                }
            }
            catch (Exception)
            {

                throw new Exception("Error writing Actions");
            }



            return sb.ToString();
        }

        private string writeActionComments(CrmWebAPIModel.Action action)
        {

            StringBuilder sb = new StringBuilder();

            sb.AppendLine("    /**");
            sb.AppendLine(string.Format("    * @function {0}.{1}.{2}", RootNameSpace, SubNamespace, action.Name));
            sb.AppendLine(string.Format("    * @memberOf {0}.{1}", RootNameSpace, SubNamespace));
            sb.AppendLine(string.Format("    * @description {0}", action.Description));
            if (action.BoundTypes.Count > 0)
            {
                List<string> boundToTypes = new List<string>();
                BindingType bindingtype = action.BoundTypes.FirstOrDefault().BoundTo;

                foreach (Binding b in action.BoundTypes)
                {
                    boundToTypes.Add(b.Type);
                }

                string description;
                if (bindingtype == BindingType.Collection)
                {
                    description = string.Format("A url for a collection of {0} to apply the action to.", string.Join(",", boundToTypes.ToArray()));
                }
                else
                {
                    description = string.Format("A url for a {0} to apply the action to.", string.Join(",", boundToTypes.ToArray()));
                }

                sb.AppendLine(string.Format("    * @param {{String}} uri {0}", description));
            }
            foreach (Parameter p in action.Parameters)
            {
                string type;
                if (p.Type.StartsWith("Collection("))
                {
                    type = "Array";
                }
                else
                {
                    type = getJSType(p.Type);
                }

                if (p.Nullable)
                {
                    sb.AppendLine(string.Format("    * @param {{{0}}} [{1}] {2}", type, lowerCaseFirstLetter(p.Name), p.Description));
                }
                else
                {
                    sb.AppendLine(string.Format("    * @param {{{0}}} {1} {2}", type, lowerCaseFirstLetter(p.Name), p.Description));
                }



            }
            sb.AppendLine("    * @param {String} [callerId] A string representation of the GUID value for the user to impersonate.");

            if ((action.ReturnType != null && !action.ReturnType.StartsWith("Collection(")))
            {
                sb.AppendLine(string.Format("    * @returns {{Promise}} A {0}.{1}.{2} instance when resolved or an Error if rejected. ", RootNameSpace, SubNamespace, action.ReturnType));
            }
            else
            {
                sb.AppendLine(string.Format("    * @returns {{Promise}} {0} when resolved or an Error if rejected.", (action.ReturnType == null) ? "null" : action.ReturnType));
            }

            sb.AppendLine("    */");

            return sb.ToString();
        }

        private string writeActionDefinition(CrmWebAPIModel.Action action)
        {
            Boolean isBound = action.BoundTypes.Count > 0;

            StringBuilder sb = new StringBuilder();

            List<string> parameters = new List<string>();

            if (isBound)
            {
                parameters.Add("uri");

            }

            foreach (Parameter p in action.Parameters)
            {
                parameters.Add(lowerCaseFirstLetter(p.Name));
            }

            parameters.Add("callerId");

            if (parameters.Count > 0)
            {
                sb.AppendLine(string.Format("    this.{0} = function (", action.Name));
                sb.Append("        ");
                sb.AppendLine(string.Join("," + Environment.NewLine + "        ", parameters.ToArray()));
                sb.AppendLine("        ) {");
            }
            else
            {
                sb.AppendLine(string.Format("    this.{0} = function () {{", action.Name));
            }
            //sb.AppendLine(String.Format("    this.{0} = function ({1}) {{", action.Name, string.Join(",", parameters.ToArray())));

            if (isBound)
            {
                sb.AppendLine(String.Format(@"        if (!isString(uri)) {{
            throw new Error(NS+"".{0} uri parameter must be a string."");
        }}", action.Name));
            }

            foreach (Parameter p in action.Parameters)
            {
                var type = getJSType(p.Type);
                string validationFunction = getValidationFunction(p, type);

                sb.AppendLine(string.Format("        if(!{0}) {{", validationFunction));

                string errorMessage;
                if (p.Nullable)
                {
                    errorMessage = string.Format(".{0} {1} parameter must be a {2} value or null.", action.Name, lowerCaseFirstLetter(p.Name), type);
                }
                else
                {
                    errorMessage = string.Format(".{0} {1} parameter must be a {2} value.", action.Name, lowerCaseFirstLetter(p.Name), type);
                }

                sb.AppendLine(string.Format("            throw new Error(NS + \"{0}\");", errorMessage));
                sb.AppendLine("        }");
            }

            sb.AppendLine(String.Format(@"        if (!isOptionalGuid(callerId)) {{
            throw new Error(NS+"".{0} callerId parameter must be a string representation of a GUID value, null or undefined."");
        }}", action.Name));

            sb.AppendLine("        var parameterObj = {};");

            List<string> parametersProperties = new List<string>();

            foreach (Parameter p in action.Parameters)
            {
                //parametersProperties.Add(string.Format("            {0}: {1}", p.Name, lowerCaseFirstLetter(p.Name)));
                if (p.Nullable)
                {
                    sb.AppendLine(string.Format("        (!isNullOrUndefined({0})? parameterObj.{1} = {0} : null);", lowerCaseFirstLetter(p.Name), p.Name));
                }
                else
                {
                    sb.AppendLine(string.Format("        parameterObj.{1} = {0};", lowerCaseFirstLetter(p.Name), p.Name));
                }

            }
            // sb.AppendLine(string.Join("," + Environment.NewLine, parametersProperties.ToArray()));

            //sb.AppendLine("        };");

            List<string> invokeActionParameters = new List<string>();
            invokeActionParameters.Add(string.Format(@"""{0}""", action.Name));
            invokeActionParameters.Add("parameterObj");
            if (isBound)
            {
                invokeActionParameters.Add("uri");
            }
            else
            {
                invokeActionParameters.Add("null");
            }
            invokeActionParameters.Add("callerId");

            if (action.ReturnType != null && ((getModelTypeByName(action.ReturnType) == "Entity") || (getModelTypeByName(action.ReturnType) == "ComplexType")))
            {
                invokeActionParameters.Add(string.Format("{0}.{1}.{2}", RootNameSpace, SubNamespace, action.ReturnType));
            }

            sb.AppendLine(string.Format("        return invokeAction({0});", string.Join(",", invokeActionParameters.ToArray())));

            sb.AppendLine("    }");

            return sb.ToString();
        }
        #endregion actions

        #region complexTypes
        private string writeComplexTypes()
        {
            StringBuilder sb = new StringBuilder();
            foreach (CrmWebAPIModel.ComplexType complexType in model.ComplexTypes)
            {
                sb.Append(writeComplexTypeComments(complexType));
                sb.Append(writeComplexTypeDefinition(complexType));
            }

            return sb.ToString();
        }

        private string writeComplexTypeComments(ComplexType complexType)
        {

            StringBuilder sb = new StringBuilder();

            sb.AppendLine("    /**");
            sb.AppendLine(String.Format("    @typeref {{object}} {0}.{1}.{2}", RootNameSpace, SubNamespace, complexType.Name));
            sb.AppendLine(String.Format("    @memberOf {0}.{1}", RootNameSpace, SubNamespace));
            sb.AppendLine(String.Format("    @description {0}", complexType.Description));

            foreach (ComplexTypeProperty p in complexType.Properties)
            {
                string JSType = getJSType(p.Type);

                if (JSType == "Array")
                {
                    try
                    {
                        string collectionType = string.Format("An Array of {0}.", getJSCollectionType(p.Type));

                        sb.AppendLine(string.Format("    @property {{{0}}} {1} {2} {3}", JSType, p.Name, collectionType, p.Description));
                    }
                    catch (Exception)
                    {

                        sb.AppendLine(string.Format("    @property {{{0}}} {1} {2}", JSType, p.Name, p.Description));
                    }

                }
                else
                {
                    sb.AppendLine(string.Format("    @property {{{0}}} {1} {2}", JSType, p.Name, p.Description));
                }



            }
            sb.AppendLine("    */");

            return sb.ToString();
        }

        private string writeComplexTypeDefinition(ComplexType complexType)
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine(string.Format("    this.{0} = function (JSONData) {{", complexType.Name));
            sb.AppendLine(string.Format("        if (!isInstanceOf({0}.{1}.{2},this)) {{", RootNameSpace, SubNamespace, complexType.Name));
            sb.AppendLine(string.Format("            return new {0}.{1}.{2}(JSONData);", RootNameSpace, SubNamespace, complexType.Name));
            sb.AppendLine("        }");
            sb.AppendLine("        var data = {};");
            sb.AppendLine("        if (JSONData)");
            sb.AppendLine("        {");
            sb.AppendLine("         data = JSONData;");
            sb.AppendLine("        }");
            sb.AppendLine("        Object.defineProperties(this,");
            sb.AppendLine("    {");

            List<string> properties = new List<string>();

            foreach (ComplexTypeProperty p in complexType.Properties)
            {
                StringBuilder pb = new StringBuilder();

                string JSType = getJSType(p.Type);
                string errorMessage = string.Format(".{0} must be a {1}{2}", p.Name, JSType, (p.Nullable) ? " or null." : ".");

                if (JSType == "Boolean")
                {
                    errorMessage = string.Format(".{0} must be a {1}.", p.Name, JSType);
                }

                if (JSType == "Array")
                {
                    try
                    {
                        string collectionType = string.Format("an Array of {0}{1}", getJSCollectionType(p.Type), (p.Nullable) ? " or null." : ".");

                        errorMessage = string.Format(".{0} must be {1}", p.Name, collectionType);
                    }
                    catch (Exception)
                    {
                        Console.WriteLine("Problem finding complex type property type for {0} {1}", p.Name, p.Type);
                    }

                }

                pb.AppendLine(string.Format(@"        ""{0}"": {{", p.Name));
                pb.AppendLine(string.Format(@"            get: function () {{ return data.{0}; }},", p.Name));
                pb.AppendLine("            set: function (value) {");
                pb.AppendLine(string.Format("                if (!{0}) {{", getComplexTypePropertyValidationFunction(p, getJSType(p.Type))));
                pb.AppendLine(string.Format(@"                    throw new Error(NS+""{0}"")", errorMessage));
                pb.AppendLine("                }");
                pb.AppendLine(string.Format(@"                data[""{0}""] = value;", p.Name));
                pb.AppendLine("            },");
                pb.AppendLine("            enumerable: true");
                pb.Append("        }");
                properties.Add(pb.ToString());

            }
            sb.AppendLine(string.Join("," + Environment.NewLine, properties.ToArray()));
            sb.AppendLine("    });");
            sb.AppendLine("    }");


            return sb.ToString();
        }

        #endregion complexTypes

        #region enumTypes
        private string writeEnumTypes()
        {
            StringBuilder sb = new StringBuilder();
            foreach (CrmWebAPIModel.EnumType enumType in model.EnumTypes)
            {
                sb.Append(writeEnumTypeComments(enumType));
                sb.Append(writeEnumTypeDefinition(enumType));
            }

            return sb.ToString();
        }

        private string writeEnumTypeComments(CrmWebAPIModel.EnumType enumType)
        {

            StringBuilder sb = new StringBuilder();

            sb.AppendLine("    /**");
            sb.AppendLine(String.Format("    @enum {0}.{1}.{2}", RootNameSpace, SubNamespace, enumType.Name));
            sb.AppendLine(String.Format("    @memberOf {0}.{1}", RootNameSpace, SubNamespace));
            sb.AppendLine(String.Format("    @description {0}", enumType.Description));

            foreach (Member m in enumType.Members)
            {
                sb.AppendLine(string.Format("    @property {{String}} {0} Read only. {1}", m.Name, m.Description));
            }

            sb.AppendLine("    */");

            return sb.ToString();
        }

        private string writeEnumTypeDefinition(EnumType enumType)
        {
            StringBuilder sb = new StringBuilder();

            sb.AppendLine(string.Format("    this.{0} = Object.freeze({{", enumType.Name));

            List<string> memberDefinitions = new List<string>();
            foreach (Member m in enumType.Members)
            {
                memberDefinitions.Add(string.Format("        {0}: \"{0}\"", m.Name));
            }

            sb.AppendLine(string.Join("," + Environment.NewLine, memberDefinitions.ToArray()));

            sb.AppendLine("    });");

            return sb.ToString();
        }

        #endregion enumTypes


    }
}
