---
layout: false
title: TypeScript and Dojo 2
overview: The TypeScript language provides a strong foundation that Dojo 2 has built upon to meet its goals. This article highlights Dojo 2's objectives and describes how TypeScript has helped those objectives become a reality.
---
# TypeScript and Dojo 2

## What is TypeScript?

According to [TypeScript's website](http://www.typescriptlang.org/index.html), three of TypeScript's major strengths are:

- It starts and ends with JavaScript - TypeScript has not tried to re-implement the JavaScript language. Rather, it has been been built on top of existing standards so that all valid JavaScript is also valid TypeScript. Additionally, when a TypeScript project is compiled, it is converted into clean, simple JavaScript that will run in almost any JavaScript environment.
- It has strong tools for large apps - TypeScript, as the name implies, adds an optional type-system on top of the JavaScript language. Types allow tools to be created that provide many advantages that other strongly typed language enjoy such as refactoring support, autocompletion functionality, and static code analysis.
- It supports state of the art JavaScript - TypeScript code is converted to JavaScript by a compiler before it is run. In addition to simply converting the code the compiler is also able to allow advanced JavaScript features to be used, such as [asynchronous functions](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) and [decorators](http://www.typescriptlang.org/docs/handbook/decorators.html).

The Dojo 2 project has taken advantage of each of these to achieve its goals.

## Dojo 2's goals

Every framework makes design decisions based on the project's goals. The best framework for a given project is often the one whose design goals most closely match the needs of the project.

Dojo 2 was designed to address the needs of large-scale, enterprise applications. To meet this single, overarching target, several smaller goals need to be achieved.

- Dojo 2 needs to ensure that applications can be developed quickly, scaled smoothly, and maintained easily.
- It must simplify the creation of data-centric applications that are prevalent among many enterprises suites of internal applications.
- It must provide out-of-the-box support for features that are important to enterprises such as [accessibility (a11y)](https://en.wikipedia.org/wiki/Computer_accessibility), [internationalization (i18n)](https://en.wikipedia.org/wiki/Internationalization_and_localization), and security.

## How TypeScript is helping Dojo 2 achieve its goals

TypeScript offers many features that have enabled Dojo 2 to realize its objectives. Three of the primary features are: the type system, interfaces, and the compiler.

### The type system

On its own, JavaScript is a [dynamic](https://en.wikipedia.org/wiki/Dynamic_programming_language), [untyped](https://en.wikipedia.org/wiki/Programming_language#Type_system) language. While these features make JavaScript very easy to start working with, they can quickly become points of concern. Developers often spend a great deal of time reviewing existing code to be sure that they are using it properly. This can slow down the development process since spending time reading existing code takes away from the time available for writing new features.

TypeScript includes an optional type system that addresses these issues. By taking advantage of type information, tools can increase a developer's productivity by letting them know what data types are expected within the application. Features like code completion, refactoring support, and static analysis help to ensure that the developer is using the existing aspects of the application correctly, allowing the developer to spend more time writing code and less time reading. Additionally, since the type system provides design-time warnings about incompatible types, type assertion tests can be eliminated from the application's test suite.

One of the concerns that many developers have about adding types to a language is the additional code that must be written "just to keep the compiler happy". This can reduce developer efficiency since time spent writing code like this cannot be devoted to writing new features. To address this, TypeScript uses [type inference](https://www.typescriptlang.org/docs/handbook/type-inference.html) to limit the amount of code that has to be written to define the data types.

A final advantage that the type system brings is the ability to identify aspects of an application that are not required. By identifying code that is unreachable, variables that are unused, and imported modules that are not accessed, it is easier to locate and remove stale code from a TypeScript application. This makes applications easier to maintain by allowing old code to be pruned out, leaving only the code that supports current features.

### Interfaces

Many enterprise-level applications are too large to be developed by a single developer or even a single team. To manage these projects, enterprises seek to divide large projects among multiple teams. Doing this, however, creates challenges as each team must often be able to share [APIs](https://en.wikipedia.org/wiki/Application_programming_interface) and data with other teams. TypeScript's type system supports the concept of an [interface](https://www.typescriptlang.org/docs/handbook/interfaces.html) that can simplify these coordination efforts. In TypeScript, an interface can be used to describe the methods that a class must support or the shape of a data structure. By setting up interfaces between development teams, each team can be confident that their code will be compatible the code from other teams.

In addition to supporting team-coordination, the ability to describe a data-structure's expected *shape* clarifies the expected fields within [object literals](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Grammar_and_types#Object_literals). This is especially important when creating applications that interact with a server to load, manipulate, and save large amounts of data. Since most communication between Dojo 2 applications and servers is done using the [JSON protocol](http://www.json.org/), the ability to define interfaces for the messages flowing back and forth greatly simplifies the processing of that data.

### The compiler

Due to the complicated suite of applications within many enterprises, technology upgrades are often adopted slowly. This is necessary due to the large amount of testing that is required to ensure that the new technology does not break existing applications. This has historically hindered enterprise developers from accessing the latest features for the languages that they work in. TypeScript takes advantage of the fact that it must be compiled into JavaScript to bridge this technology gap. TypeScript is continually updated to include the latest features that are coming to the JavaScript language. The compiler then emits JavaScript that converts those features into language structures that are compatible with existing versions of the JavaScript specification, often back to ECMAScript 3. This brings the best of both worlds to the enterprise - they are able to maintain a carefully planned upgrade path for their web browsers and other technology while allowing their developers to take advantage of the latest features of the language.

## Summary

TypeScript's type system has allowed powerful development aids to be created such as refactoring tools and autocompletion support. This enables enterprise developers to focus on writing clean, efficient code without constantly having to lookup information on how to use existing APIs.

Supporting multi-team projects has always been challenging in JavaScript due to its dynamic, untyped nature. By utilizing TypeScript interfaces, Dojo 2 projects can be divided in discrete domains that are bounded by mutually understood interfaces that define the behaviors and data structures. Within each domain, a team can write the code that they need without having to be concerned that they might be causing another break another team's code.

Finally, balancing the need to allow developers to use the latest language features with the conflicting need to ensure that technology upgrades don't break existing applications has always been a challenge in enterprise software development. By using its compiler to enable cutting edge language features to be used and then compiling them in a way that works with older JavaScript standards, TypeScript allows Dojo 2 applications to satisfy both demands.

Dojo 2 has been designed to continue the legacy of Dojo 1 - support the development of robust, maintainable, data-rich enterprise applications. By leveraging TypeScript's type system, interfaces, and the compiler's ability to use cutting edge features in backward compatible ways, it forms the firm foundation that Dojo 2 is using to enable the next generation of applications to be built with world-class levels of performance, maintainability, and reliability.
