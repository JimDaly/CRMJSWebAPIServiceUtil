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
using CRMWebAPILoginControl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Input;
using System.Diagnostics;
using System.Xml.Linq;
using System.Net;
using System.Net.Http;
using System.Collections.ObjectModel;
using System.Windows.Controls.Primitives;
using Newtonsoft.Json.Linq;
using CrmWebAPIModel;
using CRMWebAPIJavaScriptWriter;
using Microsoft.Win32;
using System.IO;
using Newtonsoft.Json;
using System.Windows.Threading;
using System.Threading.Tasks;
using System.Text.RegularExpressions;
using System.Windows.Data;
using System.Globalization;
using Microsoft.Ajax.Utilities;
using System.Text;
using System.Net.Http.Headers;
using Microsoft.Crm.Sdk.Samples.HelperCode;
using System.Security;
using System.ComponentModel;

namespace CRMJSWebAPIServiceUtil
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private ObservableConfiguration config;
        private Authentication auth = null;

        XDocument serviceDocument;
        string version;
        ObservableCollection<EntityData> unSelectedEntities = new ObservableCollection<EntityData>();
        ObservableCollection<EntityData> selectedEntities = new ObservableCollection<EntityData>();
        ObservableCollection<OperationData> unSelectedFunctions = new ObservableCollection<OperationData>();
        ObservableCollection<OperationData> selectedFunctions = new ObservableCollection<OperationData>();
        ObservableCollection<OperationData> unSelectedActions = new ObservableCollection<OperationData>();
        ObservableCollection<OperationData> selectedActions = new ObservableCollection<OperationData>();
        ObservableCollection<SolutionData> retrievedSolutions = new ObservableCollection<SolutionData>();
        EntityData currentEntity;
        XDocument actionDescriptions = XDocument.Load("Resources//ActionDescriptions.xml");
        XDocument functionDescriptions = XDocument.Load("Resources//FunctionDescriptions.xml");
        XDocument complexTypeDescriptions = XDocument.Load("Resources//ComplexTypeDescriptions.xml");
        XDocument enumTypeDescriptions = XDocument.Load("Resources//EnumTypeDescriptions.xml");
        string baseNamespaceValue = string.Empty;
        string subNamespaceValue = string.Empty;
        string libraryNameValue = string.Empty;
        string outputFolderValue = string.Empty;
        bool enableOAuthValue = false;
        bool writePropertyComments = false;
        //string OAuthAccessToken;
        string selectedSolutionUniqueName;

        //TODO: If you need to connect to a CRM Online instance
        string redirectUri = "https://yourDomain/yourApp";
        string clientId = "########-####-####-####-############";

        //string webApplicationUrl;
        string builtLibrary;
        private XNamespace edmx = "http://docs.oasis-open.org/odata/ns/edmx";
        private XNamespace mscrm = "http://docs.oasis-open.org/odata/ns/edm";
        public MainWindow()
        {
            InitializeComponent();

            config = new ObservableConfiguration();
            config.ClientId = clientId;
            config.RedirectUrl = redirectUri;

            //You can hard-code config values here to pre-populate the dialog during testing.

            //For testing on-premises

            //config.OServiceUrl = "http://yourCRMServer/yourOrg/";
            //config.OUsername = "administrator";
            //SecureString ss = new SecureString();
            //"yourPassword".ToCharArray().ToList().ForEach(p => ss.AppendChar(p));
            //config.ODomain = "~";

            //For testing online

            config.OServiceUrl = "https://yourOrg.crm.dynamics.com/";
            config.OUsername = "you@yourOrg.onmicrosoft.com";
            SecureString ss = new SecureString();
            "yourPassword".ToCharArray().ToList().ForEach(p => ss.AppendChar(p));


            config.Password = ss;

        }

        /// <summary>
        /// Method to get a configured HttpClient using the helper Authentication and Configuration classes
        /// </summary>
        /// <returns></returns>
        public HttpClient getHttpClient()
        {

            HttpClient httpClient = new HttpClient(auth.ClientHandler, false);
            httpClient.BaseAddress = new Uri(config.ServiceUrl + "api/data/");
            httpClient.Timeout = new TimeSpan(0, 2, 0);
            httpClient.DefaultRequestHeaders.Add("OData-MaxVersion", "4.0");
            httpClient.DefaultRequestHeaders.Add("OData-Version", "4.0");
            httpClient.DefaultRequestHeaders.Accept.Add(
                new MediaTypeWithQualityHeaderValue("application/json"));
            return httpClient;
        }

        /// <summary>
        /// Button to login to CRM and create a CrmService Client 
        /// </summary>
        /// <param name="sender"></param>
        /// <param name="e"></param>
        private async void LoginButton_Click(object sender, RoutedEventArgs e)
        {


            Dispatcher.Invoke(DispatcherPriority.Normal,
                              new System.Action(() =>
                              {
                                  loginMessage.Text = "Connecting... ";
                                  ((Button)sender).IsEnabled = false;
                              }
                                  ));


            #region Login Control
            Window loginWindow = new Window
            {

                Title = "Login to CRM",
                Content = new LoginControl(),
                DataContext = config,
                Height = 275,
                Width = 400
            };

            loginWindow.ShowDialog();

            if (loginWindow.DialogResult.HasValue && loginWindow.DialogResult.Value.Equals(true))
            {

                string authority;

                try
                {
                    authority = await Authentication.DiscoverAuthorityAsync(config.ServiceUrl);

                    auth = new Authentication(config, authority);
                    //You are connected..

                    Dispatcher.Invoke(DispatcherPriority.Normal,
                      new System.Action(() =>
                      {
                          loginMessage.Text = "Downloading metadata...";
                      }
                          ));



                    await downloadCSDL();

                    await retrieveSolutions();

                    Dispatcher.Invoke(DispatcherPriority.Normal,
                  new System.Action(() =>
                  {
                      loginMessage.Text = "Use the tabs above to select the items your library will use or press Open to select a previously generated library.";
                      ((Button)sender).IsEnabled = false;

                  }
                      ));

                }
                catch (SystemException ex)
                {

                    Dispatcher.Invoke(DispatcherPriority.Normal,
  new System.Action(() =>
  {
      loginMessage.Text = "Unable to connect to the server. Check your login information.";
      ((Button)sender).IsEnabled = true;
  }
      ));
                }

            }
            else
            {

                Dispatcher.Invoke(DispatcherPriority.Normal,
                                  new System.Action(() =>
                                  {
                                      loginMessage.Text = "Bad Connection";
                                      ((Button)sender).IsEnabled = true;
                                  }
                                      ));
            }




            #endregion




        }

        private async Task retrieveSolutions()
        {
            try
            {
                using (HttpClient client = getHttpClient())
                {
                    string select = "solutions?$select=uniquename,friendlyname&";
                    string filter = "$filter=ismanaged eq false and isvisible eq true&";
                    string expand = "$expand=publisherid($select=customizationprefix)&";
                    string order = "$orderby=friendlyname";
                    HttpResponseMessage resp = await client.GetAsync(string.Format("v{0}/{1}{2}{3}{4}",
                         version, select, filter, expand, order));
                    if (resp.StatusCode != HttpStatusCode.OK)
                    {
                        throw new Exception(String.Format("Error retrieving solutions: {0}", resp.StatusCode));
                    }

                    JObject response = JObject.Parse(await resp.Content.ReadAsStringAsync());

                    JArray solutions = (JArray)response["value"];

                    foreach (JObject solution in solutions)
                    {
                        SolutionData sd = new SolutionData();
                        sd.customizationprefix = (string)solution["publisherid"]["customizationprefix"];
                        sd.friendlyname = (string)solution["friendlyname"];
                        sd.solutionid = (string)solution["solutionid"];
                        sd.uniquename = (string)solution["uniquename"];

                        retrievedSolutions.Add(sd);
                    }
                    solutionsCmbx.ItemsSource = retrievedSolutions;
                    solutionsCmbx.SelectedIndex = 0; //Default solution should always be there
                }
            }
            catch (Exception)
            {

                throw;
            }
        }


        private async Task downloadCSDL()
        {
            //Get version
            try
            {
                using (HttpClient client = getHttpClient())
                {

                    //Using base v8.0 to get the current version number
                    HttpResponseMessage resp = await client.GetAsync("v8.0/RetrieveVersion()");
                    if (resp.StatusCode != HttpStatusCode.OK)
                    {
                        throw new Exception(String.Format("Error retrieving version: {0}", resp.StatusCode));
                    }

                    JObject response = JObject.Parse(await resp.Content.ReadAsStringAsync());

                    string rawVersion = (string)response["Version"];

                    Regex secondDotPattern = new Regex("(.*?\\..*?)(:?\\.)");

                    Match beforeSecondDot = secondDotPattern.Match(rawVersion);

                    version = beforeSecondDot.Groups[1].Value;


                }
            }
            catch (Exception)
            {

                throw;
            }



            string metadataUri = string.Format("v{0}/$metadata", version);


            try
            {
                using (HttpClient client = getHttpClient())
                {

                    client.DefaultRequestHeaders.Accept.Clear();

                    HttpResponseMessage resp = await client.GetAsync(metadataUri);
                    if (resp.StatusCode != HttpStatusCode.OK)
                    {
                        throw new Exception(String.Format("Error retrieving CSDL: {0}", resp.StatusCode));
                    }

                    serviceDocument = XDocument.Parse(await resp.Content.ReadAsStringAsync(), new LoadOptions());

                }
            }
            catch (Exception ex)
            {
                throw ex;
            }

            initialize();
        }

        private void initialize()
        {


            if (serviceDocument != null)
            {
                IEnumerable<XElement> entityElements = from e in serviceDocument
                                                       .Root.Element(edmx + "DataServices")
                                                       .Element(mscrm + "Schema")
                                                       .Elements(mscrm + "EntityType")
                                                       where e.Attribute("Name").Value != null &&
                                                       e.Attribute("Name").Value != "principal" &&
                                                       e.Attribute("Name").Value != "crmbaseentity" &&
                                                       e.Attribute("Name").Value != "crmmodelbaseentity" &&
                                                       e.Attribute("BaseType").Value != null &&
                                                       e.Attribute("BaseType").Value != "mscrm.crmmodelbaseentity" &&
                                                       (e.Attribute("BaseType").Value == "mscrm.crmbaseentity" ||
                                                       e.Attribute("BaseType").Value == "mscrm.principal" ||
                                                       e.Attribute("BaseType").Value == "mscrm.activitypointer")
                                                       select e;

                foreach (XElement ee in entityElements)
                {
                    EntityData ed = new EntityData();
                    ed.LogicalName = ee.Attribute("Name").Value;



                    IEnumerable<XElement> annotation = from e in ee.Elements(mscrm + "Annotation")
                                                       where e.Attribute("Term").Value.Equals("Org.OData.Core.V1.Description")
                                                       select e;

                    ed.Description = (annotation.FirstOrDefault() == null) ? string.Empty : annotation.FirstOrDefault().Attribute("String").Value;

                    unSelectedEntities.Add(ed);
                }

                IEnumerable<string> functionNames = (from e in serviceDocument
                                                     .Root.Element(edmx + "DataServices")
                                                     .Element(mscrm + "Schema")
                                                     .Elements(mscrm + "Function")
                                                     where e.Element(mscrm + "ReturnType")
                                                     .Attribute("Type").Value != "Edm.Boolean" //Keep out query functions                                                         
                                                     orderby e.Attribute("Name").Value
                                                     select e).GroupBy(x => x.Attribute("Name").Value)
                                                     .Select(x => x.First().Attribute("Name").Value);

                foreach (string fn in functionNames)
                {
                    OperationData od = new OperationData();
                    od.Name = fn;
                    od.Description = getOperationDescription("Function", fn);
                    unSelectedFunctions.Add(od);
                }


                IEnumerable<string> actionNames = (from e in serviceDocument
                                                   .Root.Element(edmx + "DataServices")
                                                   .Element(mscrm + "Schema")
                                                   .Elements(mscrm + "Action")
                                                   orderby e.Attribute("Name").Value
                                                   select e).GroupBy(x => x.Attribute("Name").Value)
                                                   .Select(x => x.First().Attribute("Name").Value);

                foreach (string an in actionNames)
                {
                    OperationData od = new OperationData();
                    od.Name = an;
                    od.Description = getOperationDescription("Action", an);
                    unSelectedActions.Add(od);
                }

                entityList.ItemsSource = unSelectedEntities;
                selectedEntityList.ItemsSource = selectedEntities;
                selectedEntityComboBox.ItemsSource = selectedEntities;

                selectFunctionsTab.IsEnabled = true;
                functionList.ItemsSource = unSelectedFunctions;
                selectedFunctionList.ItemsSource = selectedFunctions;

                selectActionsTab.IsEnabled = true;
                actionList.ItemsSource = unSelectedActions;
                selectedActionList.ItemsSource = selectedActions;

                SelectEntitiesTab.IsEnabled = true;
                buildTab.IsEnabled = true;

                openButton.IsEnabled = true;
            }
        }

        /// <summary>
        /// Gets the description for a function or action
        /// </summary>
        /// <param name="type">The type of operation; either 'function' or 'action'.</param>
        /// <param name="name">The name of the operation.</param>
        /// <returns></returns>
        private string getOperationDescription(string type, string name)
        {
            string description = "No description available.";

            IEnumerable<XElement> query;

            switch (type)
            {
                case "Function":

                    query = from e in functionDescriptions
                            .Root.Elements("Function")
                            where e.Attribute("Name")
                            .Value.Equals(name)
                            select e;
                    break;
                default: //Action
                    query = from e in actionDescriptions
                            .Root.Elements("Action")
                            where e.Attribute("Name")
                            .Value.Equals(name)
                            select e;
                    break;
            }
            if (query.FirstOrDefault() != null &&
                query.FirstOrDefault().Element("Description") != null)
            {
                description = query.FirstOrDefault().Element("Description").Value;
            }


            return description;
        }
        /// <summary>
        /// Event handler for the select entity operation
        /// </summary>
        /// <param name="sender">The Selector control for the entity</param>
        /// <param name="e"></param>
        private void selectEntity(object sender, MouseButtonEventArgs e)
        {
            selectEntity((EntityData)((Selector)sender).SelectedItem);
        }

        /// <summary>
        /// Moves an entity from the unselected group to the selected group
        /// </summary>
        /// <param name="entity"></param>
        private void selectEntity(EntityData entity)
        {
            if (entity != null)
            {
                unSelectedEntities.Remove(entity);
                selectedEntities.Add(entity);
                selectPropertiesTab.IsEnabled = (selectedEntities.Count > 0);
                selectedEntityComboBox.SelectedIndex = (selectedEntities.Count > 0) ? 0 : -1;
            }
        }

        private void deSelectEntity(object sender, MouseButtonEventArgs e)
        {
            deSelectEntity((EntityData)((Selector)sender).SelectedItem);
        }

        private void deSelectEntity(EntityData entity)
        {
            if (entity != null)
            {
                selectedEntities.Remove(entity);

                //Put the entity back in the original order
                int i = 0;
                while (i < unSelectedEntities.Count && unSelectedEntities[i].CompareTo(entity.LogicalName) < 0)
                    i++;


                unSelectedEntities.Insert(i, entity);

                selectPropertiesTab.IsEnabled = (this.selectedEntities.Count > 0);
            }
        }

        private void selectedEntityComboBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {


            if (((Selector)sender).SelectedItem == null)
            {
                //Disable  property selector controls
                //Clear bindings
                propertyList.ItemsSource = null;
                this.selectedPropertyList.ItemsSource = null;
            }
            else
            {
                //Disable  property selector controls
                //set bindings to selected entity

                currentEntity = (EntityData)((Selector)sender).SelectedItem;

                if (currentEntity != null)
                {



                    if (currentEntity.selectedProperties.Count == 0 && currentEntity.unSelectedProperties.Count == 0)
                    {
                        //It hasn't been selected before. Fill the unselectedProperties with available properties
                        // and initialize selectedProperties 

                        XElement entityElement = getElementsFromServiceDoc("EntityType", currentEntity.LogicalName).FirstOrDefault();

                        currentEntity.unSelectedProperties = getEntityProperties(entityElement);
                        currentEntity.selectedProperties = new ObservableCollection<PropertyData>();
                    }


                    this.selectedPropertyList.ItemsSource = currentEntity.selectedProperties;

                    this.propertyList.ItemsSource = currentEntity.unSelectedProperties;
                }


            }
        }

        private async void AddUsedProperties_Click(object sender, RoutedEventArgs e)
        {
            List<string> usedPropertyNames = await getUsedPropertyNamesAsync(currentEntity.LogicalName);
            XElement entityElement = getElementsFromServiceDoc("EntityType", currentEntity.LogicalName).FirstOrDefault();

            currentEntity.unSelectedProperties = getUnusedEntityProperties(entityElement, usedPropertyNames);
            currentEntity.selectedProperties = getUsedEntityProperties(entityElement, usedPropertyNames);

            this.selectedPropertyList.ItemsSource = currentEntity.selectedProperties;

            this.propertyList.ItemsSource = currentEntity.unSelectedProperties;
        }

        /// <summary>
        /// Gets element from service document by type and name
        /// </summary>
        /// <param name="Type">Either 'EntityType', 'Function', or 'Action'</param>
        /// <param name="name">The Name of the element</param>
        /// <returns>The matching elements if found</returns>
        private IEnumerable<XElement> getElementsFromServiceDoc(string Type, string name)
        {
            IEnumerable<XElement> foundItems =
            from e in serviceDocument
            .Root.Element(edmx + "DataServices")
            .Element(mscrm + "Schema")
            .Elements(mscrm + Type)
            where e.Attribute("Name")
            .Value.Equals(name)
            select e;

            return foundItems;
        }

        private ObservableCollection<PropertyData> getEntityProperties(XElement entityElement)
        {
            ObservableCollection<PropertyData> properties = new ObservableCollection<PropertyData>();

            IEnumerable<XElement> props = from p in entityElement
                                          .Elements(mscrm + "Property")
                                          where !(p.Attribute("Name")
                                          .Value.StartsWith("_") || p.Attribute("Name").Value.EndsWith("_binary"))//Keep out lookup & binary properties
                                          orderby p.Attribute("Name").Value
                                          select p;

            foreach (XElement prop in props)
            {
                string propName = prop.Attribute("Name").Value;


                PropertyData p = new PropertyData();
                p.LogicalName = prop.Attribute("Name").Value;

                IEnumerable<XElement> descriptionElement = from e in prop.Elements(mscrm + "Annotation")
                                                           where e.Attribute("Term")
                                                           .Value.Equals("Org.OData.Core.V1.Description")
                                                           select e;
                string description = (descriptionElement.FirstOrDefault() == null) ?
                    string.Empty : descriptionElement.FirstOrDefault().Attribute("String").Value;


                p.Description = description;

                properties.Add(p);

            }

            return properties;
        }

        private ObservableCollection<PropertyData> getUnusedEntityProperties(XElement entityElement, List<string> usedPropertyNames)
        {
            ObservableCollection<PropertyData> properties = new ObservableCollection<PropertyData>();

            IEnumerable<XElement> props = from p in entityElement
                                          .Elements(mscrm + "Property")
                                          where !(p.Attribute("Name")
                                          .Value.StartsWith("_") || p.Attribute("Name").Value.EndsWith("_binary"))//Keep out lookup & binary properties
                                          orderby p.Attribute("Name").Value
                                          select p;

            foreach (XElement prop in props)
            {
                string propName = prop.Attribute("Name").Value;

                if (!usedPropertyNames.Contains(propName))
                {
                    PropertyData p = new PropertyData();
                    p.LogicalName = prop.Attribute("Name").Value;

                    IEnumerable<XElement> descriptionElement = from e in prop.Elements(mscrm + "Annotation")
                                                               where e.Attribute("Term")
                                                               .Value.Equals("Org.OData.Core.V1.Description")
                                                               select e;
                    string description = (descriptionElement.FirstOrDefault() == null) ?
                        string.Empty : descriptionElement.FirstOrDefault().Attribute("String").Value;


                    p.Description = description;

                    properties.Add(p);
                }
            }

            return properties;
        }

        private ObservableCollection<PropertyData> getUsedEntityProperties(XElement entityElement, List<string> usedPropertyNames)
        {
            ObservableCollection<PropertyData> properties = new ObservableCollection<PropertyData>();

            IEnumerable<XElement> props = from p in entityElement
                                          .Elements(mscrm + "Property")
                                          where !(p.Attribute("Name")
                                          .Value.StartsWith("_") || p.Attribute("Name").Value.EndsWith("_binary"))//Keep out lookup & binary properties
                                          orderby p.Attribute("Name").Value
                                          select p;

            foreach (XElement prop in props)
            {
                string propName = prop.Attribute("Name").Value;

                if (usedPropertyNames.Contains(propName))
                {
                    PropertyData p = new PropertyData();
                    p.LogicalName = prop.Attribute("Name").Value;

                    IEnumerable<XElement> descriptionElement = from e in prop
                                                               .Elements(mscrm + "Annotation")
                                                               where e.Attribute("Term")
                                                               .Value.Equals("Org.OData.Core.V1.Description")
                                                               select e;
                    string description = (descriptionElement.FirstOrDefault() == null) ?
                        string.Empty : descriptionElement.FirstOrDefault().Attribute("String").Value;


                    p.Description = description;

                    properties.Add(p);
                }
            }

            return properties;
        }

        private void selectProperty(object sender, MouseButtonEventArgs e)
        {
            selectProperty(currentEntity, (PropertyData)((Selector)sender).SelectedItem);
        }
        private void selectProperty(EntityData entity, PropertyData selectedProperty)
        {
            if (selectedProperty != null)
            {
                entity.unSelectedProperties.Remove(selectedProperty);
                entity.selectedProperties.Add(selectedProperty);
            }
        }

        private void deSelectProperty(object sender, MouseButtonEventArgs e)
        {
            deSelectProperty(currentEntity, (PropertyData)((Selector)sender).SelectedItem);
        }

        private void deSelectProperty(EntityData entity, PropertyData property)
        {

            if (property != null)
            {
                entity.selectedProperties.Remove(property);
                //put the property back in the original order
                int i = 0;
                while (i < entity.unSelectedProperties.Count && entity.unSelectedProperties[i].CompareTo(property.LogicalName) < 0)
                    i++;

                entity.unSelectedProperties.Insert(i, property);
            }
        }

        private void selectFunction(object sender, MouseButtonEventArgs e)
        {
            selectFunction((OperationData)((Selector)sender).SelectedItem);
        }

        private void selectFunction(OperationData selectedFunction)
        {
            if (selectedFunction != null)
            {
                unSelectedFunctions.Remove(selectedFunction);
                selectedFunctions.Add(selectedFunction);
            }
        }

        private void deSelectFunction(object sender, MouseButtonEventArgs e)
        {
            deSelectFunction((OperationData)((Selector)sender).SelectedItem);
        }

        private void deSelectFunction(OperationData function)
        {
            if (function != null)
            {
                selectedFunctions.Remove(function);
                //put the function back in the original order
                int i = 0;
                while (i < unSelectedFunctions.Count && unSelectedFunctions[i].CompareTo(function.Name) < 0)
                    i++;
                unSelectedFunctions.Insert(i, function);
            }
        }

        private void selectAction(object sender, MouseButtonEventArgs e)
        {
            selectAction((OperationData)((Selector)sender).SelectedItem);
        }
        private void selectAction(OperationData selectedAction)
        {
            if (selectedAction != null)
            {
                unSelectedActions.Remove(selectedAction);
                selectedActions.Add(selectedAction);
            }
        }

        private void deSelectAction(object sender, MouseButtonEventArgs e)
        {
            deSelectAction((OperationData)((Selector)sender).SelectedItem);
        }

        private void deSelectAction(OperationData action)
        {
            if (action != null)
            {
                selectedActions.Remove(action);
                //put the action back in the original order
                int i = 0;
                while (i < unSelectedActions.Count && unSelectedActions[i].CompareTo(action.Name) < 0)
                    i++;

                unSelectedActions.Insert(i, action);
            }
        }

        private void validateBuildButton()
        {
            this.buildButton.IsEnabled = !(baseNamespaceValue == string.Empty ||
                subNamespaceValue == string.Empty ||
                outputFolderValue == string.Empty ||
                libraryNameValue == string.Empty);
        }

        private void baseNamespace_TextChanged(object sender, TextChangedEventArgs e)
        {
            baseNamespaceValue = ((TextBox)sender).Text;

            validateBuildButton();
        }

        private void subNamespace_TextChanged(object sender, TextChangedEventArgs e)
        {
            subNamespaceValue = ((TextBox)sender).Text;
            validateBuildButton();
        }

        private void fileName_TextChanged(object sender, TextChangedEventArgs e)
        {
            libraryNameValue = ((TextBox)sender).Text;
            validateBuildButton();
        }

        private void fileFolder_TextChanged(object sender, TextChangedEventArgs e)
        {
            outputFolderValue = ((TextBox)sender).Text;
            validateBuildButton();
        }

        private void folderChooser_Click(object sender, RoutedEventArgs e)
        {
            System.Windows.Forms.FolderBrowserDialog dialog = new System.Windows.Forms.FolderBrowserDialog();
            System.Windows.Forms.DialogResult result = dialog.ShowDialog();

            if (result == System.Windows.Forms.DialogResult.OK)
            {
                fileFolder.Text = dialog.SelectedPath;
            }
        }

        private void buildButton_Click(object sender, RoutedEventArgs e)
        {

            if (baseNamespaceValue.ToLower().Equals("xrm") || baseNamespaceValue.ToLower().Equals("mscrm"))
            {
                MessageBox.Show("Base Namespace values of Xrm or Mscrm are not allowed.");
            }
            else
            {
                buildButton.IsEnabled = false;
                buildMessageLabel.Text = "Starting build. Please wait.";

                BackgroundWorker worker = new BackgroundWorker();
                worker.WorkerReportsProgress = true;
                worker.ProgressChanged += Worker_ProgressChanged;
                worker.DoWork += Worker_DoWork;
                worker.RunWorkerCompleted += Worker_RunWorkerCompleted;
                worker.RunWorkerAsync();

            }





        }

        private void Worker_ProgressChanged(object sender, ProgressChangedEventArgs e)
        {
            string message = string.Empty;
            switch (e.ProgressPercentage)
            {
                case 0:
                    message = "Building model...";
                    break;
                case 1:
                    message = "Writing JavaScript library...";
                    break;
                case 2:
                    message = "Writing TypeScript definition file...";
                    break;
                default:
                    break;
            }
            buildMessageLabel.Text = message;
        }

        private void Worker_RunWorkerCompleted(object sender, RunWorkerCompletedEventArgs e)
        {
            buildMessageLabel.Text = string.Format("{0}.{1}.{2}.js saved.", baseNamespaceValue, subNamespaceValue, libraryNameValue);
            openFolderButton.IsEnabled = true;
            saveTab.IsEnabled = true;
            libraryDefinitionFolder.Text = outputFolderValue;

            if (webResourceName.Text.Length == 0)
            {
                webResourceName.Text = string.Format("/{0}.{1}.{2}.js", baseNamespaceValue, subNamespaceValue, libraryNameValue);

            }
            buildButton.IsEnabled = true;
        }

        private void Worker_DoWork(object sender, DoWorkEventArgs e)
        {
            (sender as BackgroundWorker).ReportProgress(0);
            ModelGenerator modelGen = new ModelGenerator(config, auth);
            modelGen.serviceDocument = serviceDocument;
            modelGen.actionNames = selectedActions.ToList().Select(o => o.Name).ToList();
            modelGen.entityNames = selectedEntities.ToList().Select(o => o.LogicalName).ToList();

            List<EntityProperties> entityProperties = new List<EntityProperties>();
            foreach (EntityData entity in selectedEntities)
            {
                EntityProperties ep = new EntityProperties();
                ep.EntityName = entity.LogicalName;

                List<string> propertyNames = new List<string>();

                foreach (PropertyData property in entity.selectedProperties)
                {
                    propertyNames.Add(property.LogicalName);
                }
                ep.Properties = propertyNames;
                entityProperties.Add(ep);
            }

            modelGen.entityProperties = entityProperties;

            modelGen.functionNames = selectedFunctions.ToList().Select(o => o.Name).ToList();
            modelGen.actionDescriptions = actionDescriptions;
            modelGen.complexTypeDescriptions = complexTypeDescriptions;
            modelGen.enumTypeDescriptions = enumTypeDescriptions;
            modelGen.functionDescriptions = functionDescriptions;

            modelGen.webAPIVersion = version;

            Model model = modelGen.getModel();

            (sender as BackgroundWorker).ReportProgress(1);

            JavaScriptWriter writer = new JavaScriptWriter();
            writer.model = model;
            writer.RootNameSpace = baseNamespaceValue;
            writer.SubNamespace = subNamespaceValue;
            writer.libraryName = libraryNameValue;
            writer.enableOAuth = enableOAuthValue;
            writer.writePropertyComments = writePropertyComments;
            try
            {
                builtLibrary = writer.getJavaScriptFileString().Result;
            }
            catch (Exception ex)
            {
                MessageBox.Show(string.Format("Error building library: {0}", ex.Message), "Error");
            }

            writer.WriteJavaScriptFile(outputFolderValue, builtLibrary);

            (sender as BackgroundWorker).ReportProgress(2);

            TypeScriptDefinitionWriter tswriter = new TypeScriptDefinitionWriter()
            {
                enableOAuth = enableOAuthValue,
                libraryName = libraryNameValue,
                model = model,
                RootNameSpace = baseNamespaceValue,
                SubNamespace = subNamespaceValue
            };
            tswriter.WriteTSFile(outputFolderValue);
        }



        private void openFolderButton_Click(object sender, RoutedEventArgs e)
        {
            Process.Start(outputFolderValue);
        }

        private void saveLibraryDefinitionButton_Click(object sender, RoutedEventArgs e)
        {
            JObject def = new JObject();
            def.Add("entities", JToken.FromObject(selectedEntities));
            def.Add("functions", JToken.FromObject(selectedFunctions));
            def.Add("actions", JToken.FromObject(selectedActions));
            def.Add("baseNamespace", JToken.FromObject(baseNamespaceValue));
            def.Add("subNamespace", JToken.FromObject(subNamespaceValue));
            def.Add("libraryName", JToken.FromObject(libraryNameValue));
            def.Add("fileFolder", JToken.FromObject(fileFolder.Text));
            def.Add("enableOAuth", enableOAuthValue);
            def.Add("writePropertyComments", writePropertyComments);
            def.Add("saveWebResource", saveWebResource.IsChecked);
            def.Add("solutionUniqueName", ((SolutionData)solutionsCmbx.SelectedValue).uniquename);
            def.Add("solutionPrefix", solutionPrefix.Text);
            def.Add("webResourceName", webResourceName.Text);
            def.Add("overwriteWebResource", overwriteWebResource.IsChecked);
            def.Add("libraryDefinitionFolder", libraryDefinitionFolder.Text);

            File.WriteAllText(string.Format("{0}\\{1}.{2}.{3}_Definition.json", libraryDefinitionFolder.Text, baseNamespaceValue, subNamespaceValue, libraryNameValue), def.ToString());

            libraryDefinitionSavedMessageLabel.Text = string.Format("{0}.{1}.{2}_Definition.json saved.", baseNamespaceValue, subNamespaceValue, libraryNameValue);
        }

        private void openButton_Click(object sender, RoutedEventArgs e)
        {
            OpenFileDialog opnDlg = new OpenFileDialog();
            opnDlg.Filter = "JSON files (*.json)| *.json";
            if (fileFolder.Text != null)
            {
                opnDlg.InitialDirectory = fileFolder.Text;
            }
            if (opnDlg.ShowDialog() == true)
            {
                string libraryDefinition = File.ReadAllText(opnDlg.FileName);

                JObject libDef = JsonConvert.DeserializeObject<JObject>(libraryDefinition);

                //Verify file
                if (libDef["entities"] != null &&
                    libDef["functions"] != null &&
                    libDef["actions"] != null &&
                    libDef["baseNamespace"] != null &&
                    libDef["subNamespace"] != null &&
                    libDef["libraryName"] != null &&
                    libDef["fileFolder"] != null &&
                    libDef["enableOAuth"] != null &&
                    libDef["writePropertyComments"] != null &&
                    libDef["saveWebResource"] != null &&
                    libDef["solutionUniqueName"] != null &&
                    libDef["solutionPrefix"] != null &&
                    libDef["webResourceName"] != null &&
                    libDef["overwriteWebResource"] != null &&
                    libDef["libraryDefinitionFolder"] != null
                    )
                {

                    //re-initialize
                    foreach (EntityData entity in selectedEntities.ToList())
                    {
                        deSelectEntity(entity);

                        foreach (PropertyData prop in entity.selectedProperties.ToList())
                        {
                            deSelectProperty(entity, prop);
                        }

                    }

                    foreach (OperationData function in selectedFunctions.ToList())
                    {
                        deSelectFunction(function);
                    }

                    foreach (OperationData action in selectedActions.ToList())
                    {
                        deSelectAction(action);
                    }

                    //Verify entities
                    try
                    {
                        foreach (JObject entity in libDef["entities"])
                        {
                            string entityName = (string)entity["LogicalName"];

                            if (!unSelectedEntities
                                .Any(p => p.LogicalName == entityName))
                            {
                                throw new Exception(
                                    string.Format("Entity {0} not available in this organization",
                                    entityName));
                            }


                            XElement entityElement = getElementsFromServiceDoc("EntityType", entityName).FirstOrDefault();
                            List<PropertyData> entityProperties = getUnusedEntityProperties(entityElement, new List<string>()).ToList();


                            //Verify entity properties
                            foreach (JObject property in entity["selectedProperties"])
                            {
                                string propertyname = (string)property["LogicalName"];

                                PropertyData pd = entityProperties
                                    .Where(p => p.LogicalName == propertyname)
                                    .FirstOrDefault();
                                if (pd == null)
                                {
                                    throw new Exception(
                                        string.Format("{0} Entity {1} property not available in this organization",
                                        entityName,
                                        propertyname));
                                }

                            }
                        }

                        //Verify functions

                        foreach (JObject function in libDef["functions"])
                        {
                            string functionName = (string)function["Name"];
                            if (!unSelectedFunctions.Any(f => f.Name == functionName))
                            {
                                throw new Exception(
                                    string.Format("Function {0} not available in this organization",
                                    functionName));
                            }
                        }

                        //Verify actions
                        foreach (JObject action in libDef["actions"])
                        {
                            string actionName = (string)action["Name"];
                            if (!unSelectedActions.Any(f => f.Name == actionName))
                            {
                                throw new Exception(
                                    string.Format("Action {0} not available in this organization",
                                    actionName));
                            }
                        }

                    }
                    catch (Exception ex)
                    {
                        MessageBox.Show(ex.Message);
                        return;
                    }

                    //Set build values

                    foreach (JObject entity in libDef["entities"])
                    {
                        string entityName = (string)entity["LogicalName"];

                        EntityData ed = unSelectedEntities.Where(w => w.LogicalName == entityName).FirstOrDefault();

                        XElement entityElement = getElementsFromServiceDoc("EntityType", entityName).FirstOrDefault();
                        ed.unSelectedProperties = getUnusedEntityProperties(entityElement, new List<string>());

                        foreach (JObject property in entity["selectedProperties"])
                        {
                            string propertyname = (string)property["LogicalName"];
                            PropertyData pd = ed.unSelectedProperties.Where(r => r.LogicalName == propertyname).FirstOrDefault();
                            selectProperty(ed, pd);
                        }

                        selectEntity(ed);
                    }

                    foreach (JObject function in libDef["functions"])
                    {
                        string functionName = (string)function["Name"];

                        OperationData od = unSelectedFunctions.Where(y => y.Name == functionName).FirstOrDefault();

                        selectFunction(od);
                    }

                    foreach (JObject action in libDef["actions"])
                    {
                        string actionName = (string)action["Name"];

                        OperationData od = unSelectedActions.Where(y => y.Name == actionName).FirstOrDefault();

                        selectAction(od);
                    }

                    baseNamespace.Text = (string)libDef["baseNamespace"];


                    subNamespace.Text = (string)libDef["subNamespace"];
                    fileName.Text = (string)libDef["libraryName"];
                    string path = (string)libDef["fileFolder"];
                    if (Directory.Exists(path))
                    {
                        fileFolder.Text = path;
                    }

                    enableOAuth.IsChecked = (bool)libDef["enableOAuth"];

                    includePropertyComments.IsChecked = (bool)libDef["writePropertyComments"];

                    saveWebResource.IsChecked = (bool)libDef["saveWebResource"];

                    string solutionUniqueName = (string)libDef["solutionUniqueName"];

                    foreach (SolutionData solution in solutionsCmbx.ItemsSource)
                    {
                        if (solution.uniquename == solutionUniqueName)
                        {
                            solutionsCmbx.SelectedValue = solution;
                        }
                    }

                    solutionPrefix.Text = (string)libDef["solutionPrefix"];
                    webResourceName.Text = (string)libDef["webResourceName"];

                    overwriteWebResource.IsChecked = (bool)libDef["overwriteWebResource"];
                    libraryDefinitionFolder.Text = (string)libDef["libraryDefinitionFolder"];


                }
                else
                {
                    MessageBox.Show("Not a valid library definition file");
                    return;
                }

            }
        }

        private async Task<List<string>> getUsedPropertyNamesAsync(string entityLogicalName)
        {
            List<string> names = new List<string>();


            try
            {
                using (HttpClient client = getHttpClient())
                {
                    string formQuery = string.Format("v{0}/systemforms?$select=formxml&$filter=objecttypecode%20eq%20'{1}'", version, entityLogicalName);
                    HttpResponseMessage resp = await client.GetAsync(formQuery);
                    if (resp.StatusCode != HttpStatusCode.OK)
                    {
                        throw new Exception(String.Format("Error retrieving form data: {0}", resp.StatusCode));
                    }

                    JObject response = JObject.Parse(await resp.Content.ReadAsStringAsync());
                    JArray results = (JArray)response.GetValue("value");
                    for (int i = 0; i < results.Count; i++)
                    {
                        XDocument form = XDocument.Parse((string)results[i]["formxml"]);

                        foreach (XElement control in form.Descendants("control"))
                        {
                            if (control.Attribute("datafieldname") != null && !names.Contains(control.Attribute("datafieldname").Value))
                            {
                                names.Add(control.Attribute("datafieldname").Value);
                            }
                        }
                    }

                }
            }
            catch (Exception)
            {

                throw;
            }

            return names;
        }


        private void enableOAuth_Checked(object sender, RoutedEventArgs e)
        {
            enableOAuthValue = ((CheckBox)sender).IsChecked.Value;
        }

        private void solutionsCmbx_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            SolutionData selectedSolution = ((SolutionData)(((ComboBox)sender).SelectedValue));

            solutionPrefix.Text = selectedSolution.customizationprefix + "_";

            selectedSolutionUniqueName = selectedSolution.uniquename;
        }

        private async void saveAsWebResourceButton_Click(object sender, RoutedEventArgs e)
        {

            Dispatcher.Invoke(DispatcherPriority.Normal,
                  new System.Action(() =>
                  {
                      ((Button)sender).IsEnabled = false;
                  }
                      ));

            Minifier minifier = new Minifier();
            string minifiedLibrary = minifier.MinifyJavaScript(builtLibrary);
            string name = solutionPrefix.Text + webResourceName.Text;

            try
            {
                using (HttpClient client = getHttpClient())
                {
                    string select = "webresourceset?$select=name&";
                    string filter = string.Format("$filter=name eq '{0}'", name);

                    HttpResponseMessage resp = await client.GetAsync(string.Format("v{0}/{1}{2}",
                         version, select, filter));
                    if (resp.StatusCode != HttpStatusCode.OK)
                    {
                        throw new Exception(String.Format("Error retrieving webresources: {0}", resp.StatusCode));
                    }

                    JObject response = JObject.Parse(await resp.Content.ReadAsStringAsync());

                    JArray webResources = (JArray)response["value"];

                    if (webResources.Count > 0)
                    {
                        string webresourceid = (string)webResources.FirstOrDefault()["webresourceid"];
                        string existingWebResourceUri = string.Format("v{0}/webresourceset({1})", version, webresourceid);

                        if (overwriteWebResource.IsChecked == false)
                        {
                            //STOP and notify user
                            MessageBox.Show(string.Format("A web resource with the name {0} already exists.", name));
                            Dispatcher.Invoke(DispatcherPriority.Normal,
      new System.Action(() =>
      {
          ((Button)sender).IsEnabled = true;
      }
          ));
                            return;
                        }
                        else
                        {
                            //Update web resource
                            updateWebResource(existingWebResourceUri, minifiedLibrary);
                        }
                    }
                    else
                    {
                        //Create web resource
                        createWebResource(name, minifiedLibrary, selectedSolutionUniqueName);
                    }


                }
            }
            catch (Exception ex)
            {

                throw ex;
            }
            saveWebResourceMessage.Text = string.Format("Web Resource {0} saved.", name);

            Dispatcher.Invoke(DispatcherPriority.Normal,
                  new System.Action(() =>
                  {
                      ((Button)sender).IsEnabled = true;
                  }
                      ));
        }

        private async void createWebResource(string name, string content, string solutionUniqueName)
        {

            //Create web resource to default solution, then use AddSolutionComponent Action to associate it with the selected solution

            string webResourceUri;
            string webResourceId;

            try
            {
                using (HttpClient client = getHttpClient())
                {
                    JObject webResource = new JObject();
                    webResource.Add("content", Convert.ToBase64String(Encoding.UTF8.GetBytes(content)));
                    webResource.Add("description", "Web Resource created using WebAPIJavaScriptServiceUtility.");
                    webResource.Add("displayname", name);
                    webResource.Add("name", name);
                    webResource.Add("webresourcetype", 3);

                    HttpRequestMessage webResourceCreateRequest = new HttpRequestMessage(HttpMethod.Post, string.Format("v{0}/webresourceset", version));
                    webResourceCreateRequest.Content = new StringContent(webResource.ToString(), Encoding.UTF8, "application/json");
                    HttpResponseMessage webResourceCreateResponse = await client.SendAsync(webResourceCreateRequest);
                    if (webResourceCreateResponse.StatusCode != HttpStatusCode.NoContent)
                    {
                        throw new Exception(String.Format("Error creating web resource: {0}", webResourceCreateResponse.StatusCode));
                    }
                    else
                    {
                        webResourceUri = webResourceCreateResponse.Headers
                           .GetValues("OData-EntityId").FirstOrDefault();
                    }
                    if (solutionUniqueName != "Default")
                    {
                        //Retrieving webresourceid rather than parsing it from the webResourceUri
                        HttpResponseMessage retrieveWebResourceResponse = await client.GetAsync(webResourceUri + "?$select=webresourceid");
                        if (retrieveWebResourceResponse.StatusCode != HttpStatusCode.OK)
                        {
                            throw new Exception(String.Format("Error retrieving web resource: {0}", retrieveWebResourceResponse.StatusCode));
                        }

                        JObject webResourceResponse = JObject.Parse(await retrieveWebResourceResponse.Content.ReadAsStringAsync());

                        webResourceId = (string)webResourceResponse.GetValue("webresourceid");

                        JObject addSolutionComponentProperties = new JObject();
                        addSolutionComponentProperties.Add("ComponentId", webResourceId);
                        addSolutionComponentProperties.Add("ComponentType", 61);
                        addSolutionComponentProperties.Add("SolutionUniqueName", solutionUniqueName);
                        addSolutionComponentProperties.Add("AddRequiredComponents", false);
                        addSolutionComponentProperties.Add("IncludedComponentSettingsValues", null);

                        HttpRequestMessage addSolutionComponentRequest = new HttpRequestMessage(HttpMethod.Post, string.Format("v{0}/AddSolutionComponent", version));
                        addSolutionComponentRequest.Content = new StringContent(addSolutionComponentProperties.ToString(), Encoding.UTF8, "application/json");
                        HttpResponseMessage addSolutionComponentResponse = await client.SendAsync(addSolutionComponentRequest);
                        if (addSolutionComponentResponse.StatusCode != HttpStatusCode.OK)
                        {
                            throw new Exception(String.Format("Error calling AddSolutionComponent : {0}", addSolutionComponentResponse.StatusCode));
                        }
                        else
                        {
                            //Could get the solution component id value, but don't need it.
                        }

                    }

                }
            }
            catch (Exception ex)
            {

                throw ex;
            }

        }

        private async void updateWebResource(string uri, string content)
        {
            string webResourceId;
            try
            {
                using (HttpClient client = getHttpClient())
                {
                    JObject webResource = new JObject();
                    webResource.Add("content", Convert.ToBase64String(Encoding.UTF8.GetBytes(content)));

                    HttpRequestMessage req = new HttpRequestMessage(new HttpMethod("PATCH"), uri);
                    req.Content = new StringContent(webResource.ToString(), Encoding.UTF8, "application/json");
                    HttpResponseMessage resp = await client.SendAsync(req);
                    if (resp.StatusCode != HttpStatusCode.NoContent)
                    {
                        throw new Exception(String.Format("Error updating web resource: {0}", resp.StatusCode));
                    }
                    else
                    {
                        //Retrieving webresourceid rather than parsing it from the webResourceUri
                        HttpResponseMessage retrieveWebResourceResponse = await client.GetAsync(uri + "?$select=webresourceid");
                        if (retrieveWebResourceResponse.StatusCode != HttpStatusCode.OK)
                        {
                            throw new Exception(String.Format("Error retrieving web resource: {0}", retrieveWebResourceResponse.StatusCode));
                        }

                        JObject webResourceResponse = JObject.Parse(await retrieveWebResourceResponse.Content.ReadAsStringAsync());

                        webResourceId = (string)webResourceResponse.GetValue("webresourceid");


                        string parameterXml = string.Format(@"<importexportxml><webresources><webresource>{{{0}}}</webresource></webresources></importexportxml>", webResourceId);

                        JObject publishXmlParameters = new JObject();
                        publishXmlParameters.Add("ParameterXml", parameterXml);

                        HttpRequestMessage publishWebResourceRequest = new HttpRequestMessage(HttpMethod.Post, string.Format("v{0}/PublishXml", version));
                        publishWebResourceRequest.Content = new StringContent(publishXmlParameters.ToString(), Encoding.UTF8, "application/json");
                        HttpResponseMessage publishWebResourceResponse = await client.SendAsync(publishWebResourceRequest);
                        if (publishWebResourceResponse.StatusCode != HttpStatusCode.NoContent)
                        {
                            throw new Exception(String.Format("Error calling PublishXml  : {0}", publishWebResourceResponse.StatusCode));
                        }
                    }
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        private void includePropertyComments_Checked(object sender, RoutedEventArgs e)
        {
            writePropertyComments = ((CheckBox)sender).IsChecked.Value;
        }
    }

    public class StringLengthToBooleanConverter : IValueConverter
    {
        object IValueConverter.Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            return ((string)value).Length > 0;
        }

        object IValueConverter.ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException("Cannot covert back");
        }
    }

    public class GridRowHeightConverter : IValueConverter
    {
        object IValueConverter.Convert(object value, Type targetType, object parameter, CultureInfo culture)
        {
            bool val = (bool)value;
            int displayHeight = 40;
            int hideHeight = 0;
            return (val) ? hideHeight : displayHeight;
        }

        object IValueConverter.ConvertBack(object value, Type targetType, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException("Cannot covert back");
        }
    }

    public class TwoValueGridRowHeightConverter : IMultiValueConverter
    {
        object IMultiValueConverter.Convert(object[] values, Type targetType, object parameter, CultureInfo culture)
        {


            bool display = ((bool)values[0] == false) && ((bool)values[1] == true);
            int displayHeight = 40;
            int hideHeight = 0;
            return (display) ? new GridLength(displayHeight) : new GridLength(hideHeight);
        }

        object[] IMultiValueConverter.ConvertBack(object value, Type[] targetTypes, object parameter, CultureInfo culture)
        {
            throw new NotImplementedException("Cannot covert back");
        }
    }
}
