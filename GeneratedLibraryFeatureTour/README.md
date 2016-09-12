## Generated Library Tour

This project will walk you through specific features included in the generated library.
I will add to it over time.

This is a Visual Studio TypeScript project where I've just added the following:

1. **es6-promise.TypeScript.DefinitelyTyped** NuGet package so that promises are recognized when the TypeScript
  ECMAScript version is ECMAScript 5.
2. The two generated files:
  * **Demo.Tour.TourOfGeneratedLibrary.js**
  * **Demo.Tour.TourOfGeneratedLibrary.d.ts**
  
3. **Demo.Tour.TourOfGeneratedLibrary_Definition.json**
  * This is the definition of the library. It only contains OOTB entities functions and actions.
    It isn't used directly by the project, but you should be able to edit the **fileFolder** and
    **libraryDefinitionFolder** properties and then load and use it.

The **app.ts** file contains two functions called from the **featureTour** function:
  * **trackPropertyChanges**: This function highlights key features of the generated library
    to track changes to properties. These may not be immediately obvious, but can be very important
    if you want to preserve auditing data for your entities. It can also improve performance by sending
    less data over the wire.

  * **usingEntities**: This function covers using the entity classes: the different methods and constructor
  arguments.

The **app.ts** file contains *a lot* of comments in the code to explain what is going on.

Please feel free to open issues if you have any questions.
