# Guideline for writing Dojo 2 cookbook recipes

## Purpose

This guideline describes how to create a Dojo 2 cookbook recipe.

## Summary

The following rules should be followed when creating a cookbook recipe. See the [discussion](#discussion) section for more information about each point.

- [ ] [Contains proper front matter](#contains-proper-front-matter)
- [ ] [Contains a title heading](#contains-a-title-heading)
- [ ] [Contains brief Objective section](#contains-brief-objective-section)
- [ ] [Properly formatted Procedure section](#properly-formatted-procedure-section)
- [ ] [Contains list of additional resources](#contains-list-of-additional-resources)
- [ ] [No boiler plate steps](#no-boiler-plate-steps)
- [ ] [Proper casing for titles](#proper-casing-for-titles)
- [ ] [Proper voice and tone use (brief, concise and to the point)](#proper-voice-and-tone-used)
- [ ] [No unnecessary contractions or slang](#no-unnecessary-contractions-or-slang)
- [ ] [No pronouns or, if used, have an obvious meaning to non-native English speakers](#no-pronouns-or-if-used-have-an-obvious-meaning-to-non-native-english-speakers)
- [ ] [No abbreviations](#no-abbreviations)
- [ ] [Acronyms are expanded on first use](#acronyms-are-expanded-on-first-use)
- [ ] [Spell-checked against US-English dictionary](#spell-checked-against-us-english-dictionary)

## Discussion

### Contains proper front matter

All front matter needs to be included so that the page can be properly generated. The front matter is the content at the top of the file and delimited at the start and end by three dashes (---). When creating a new cookbook recipe, copy the front-matter from an existing recipe and update the recipe-specific fields (e.g. title, overview, etc).

### Contains a title heading

Every recipe should begin with an H1 header (<pre>#</pre> in markdown) with the title. The title should match the title attribute in the front matter.

### Contains brief Objective section

This section should contain a brief (one or two sentence) description about what the recipe produces. It should be direct and to the point with a minimum of expository content. If a large amount of explanation is required, consider breaking this recipe into multiple recipes or rewriting it as a tutorial or reference guide article.

### Properly formatted Procedure section

The Procedure section should consist of a bulleted list of steps for the consumer to follow. These steps should be provided in the order that they should be executed with larger steps being broken down into sub lists when necessary. Each step should be concisely presented with complete sentences that focus on what the consumer needs to do, not why they need to do it. Whenever possible, commands and code snippets should be provided that can easily be copied and pasted into the consumer's application.

### Contains list of additional resources

After the procedure section, include a list of additional resources that the consumer might need to be aware of. This could include links to other tools that are expected to be present (e.g. Node.JS when using the @dojo/cli tool) or tutorials and reference guides that expand on one or more concepts that are touched on in the recipe.

### No boiler plate steps

Recipes should be as targeted and focused as possible. Content that discusses mundane work such as importing modules or installing tools should be left out or presented in a minimum possible fashion. For example, if a new widget is being created, it makes sense to include a step directing the consumer to import the `WidgetBase` module since its location might not be intuitive. However, if they need to import a module that they have created, a simple directive to import that module is sufficient.

### Proper casing for titles

All titles

### Proper voice and tone use (brief, concise and to the point)

### No unnecessary contractions or slang

### No pronouns or, if used, have an obvious meaning to non-native English speakers

### No abbreviations

### Acronyms are expanded on first use

### Spell-checked against US-English dictionary
