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
using System.Collections.Generic;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;

namespace CrmWebAPIModel
{
    public class Model
    {
        public List<Action> Actions { get; set; }
        public List<ComplexType> ComplexTypes { get; set; }
        public List<Entity> Entities { get; set; }
        public List<EnumType> EnumTypes { get; set; }
        public List<Function> Functions { get; set; }
        public string webAPIVersion { get; set; }

    }

    public class Entity
    {
        public string Name { get; set; }
        public string LogicalCollectionName { get; set; }
        public string SchemaCollectionName { get; set; }
        public string EntitySetName { get; set; }
        public string SchemaName { get; set; }
        public string DisplayName { get; set; }
        public List<Key> AlternateKeys { get; set; }
        public string PrimaryKey { get; set; }
        public string NameProperty { get; set; }
        public string Description { get; set; }
        public string BaseEntity { get; set; }
        public bool IsBaseEntity { get; set; }
        public List<EntityProperty> Properties { get; set; }
        public List<LookupProperty> Lookups { get; set; }
        public List<CollectionProperty> Collections { get; set; }

    }

    public class Key
    {
        public List<string> Properties { get; set; }
    }

    public class Property
    {
        [JsonProperty(Order = -2)] //Ensures that this property is first when the object is serialized as JSON. For readability only.
        public string Name { get; set; }

        public string Type { get; set; }



    }

    public class ComplexTypeProperty : Property
    {


        public string Description { get; set; }
        public bool Nullable { get; set; }
        public bool Unicode { get; set; }
    }

    public class EntityProperty : Property
    {

        public string SchemaName { get; set; }
        public bool ValidForCreate { get; set; }
        public bool ValidForRead { get; set; }
        public bool ValidForUpdate { get; set; }
        public bool IsReadOnly { get; set; }
        public bool IsComputed { get; set; } //Is this necessary?
        public string Description { get; set; }
    }

    public class OptionSetProperty : EntityProperty
    {
        public List<Option> Options { get; set; }
    }

    public class LookupProperty : EntityProperty
    {
        public bool Nullable { get; set; }
        public string Partner { get; set; }
        public string ReferencedProperty { get; set; }
    }

    public class CollectionProperty : Property
    {
        public string Partner { get; set; }
    }

    public class Option
    {
        public int Value { get; set; }
        public string Label { get; set; }
    }

    public abstract class Operation {

        public string Name { get; set; }
        public string Description { get; set; }
        public List<Binding> BoundTypes { get; set; }
        public List<Parameter> Parameters { get; set; }
        public string ReturnType { get; set; }
    }

    public class Function : Operation
    {
        public bool IsComposable { get; set; }
    }
    public class Action : Operation
    {

    }

    public class ComplexType
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public List<ComplexTypeProperty> Properties { get; set; }
    }

    public class EnumType
    {
        public string Name { get; set; }
        public List<Member> Members { get; set; }
        public string Description { get; set; }
    }

    public class Parameter
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Type { get; set; }
        public bool Nullable { get; set; }
        public bool Unicode { get; set; }
    }

    public class Member
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Value { get; set; }
    }

    public class Binding
    {
        public string Type { get; set; }

        [JsonConverter(typeof(StringEnumConverter))]
        public BindingType BoundTo { get; set; }
    }

    public enum BindingType
    {
        Entity,
        Collection
    }

}
