# Guideline for writing Dojo 2 cookbook recipes

## Purpose

This guideline describes how to create a Dojo 2 cookbook recipe.

Recipes are intended to help consumers find easily consumable solutions to challenges that they are addressing in their projects. Recipes are focused on providing clear, concise steps showing how to accomplish a specific, narrowly defined task. They are almost completely focused on _what_ to do instead of _why_ to do something. If additional explanation is required, links should be provided to relevant documentation for consumers that wish to learn more about a specific topic.

## Summary

The following rules should be followed when creating a cookbook recipe. See the [discussion](#discussion) section for more information about each point.

- [ ] [Contains proper front matter](#contains-proper-front-matter)
- [ ] [Contains a title heading](#contains-a-title-heading)
- [ ] [Contains brief Objective section](#contains-brief-objective-section)
- [ ] [Properly formatted Procedure section](#properly-formatted-procedure-section)
- [ ] [Contains list of additional resources](#contains-list-of-additional-resources)
- [ ] [No boilerplate steps](#no-boilerplate-steps)
- [ ] [Proper casing for titles](#proper-casing-for-titles)
- [ ] [Proper voice and tone use (brief, concise and to the point)](#proper-voice-and-tone-use)
- [ ] [No unnecessary contractions or slang](#no-unnecessary-contractions-or-slang)
- [ ] [No pronouns or, if used, have an obvious meaning to non-native English speakers](#no-pronouns-or-if-used-have-an-obvious-meaning-to-non-native-english-speakers)
- [ ] [No abbreviations](#no-abbreviations)
- [ ] [Acronyms are expanded on first use](#acronyms-are-expanded-on-first-use)
- [ ] [Spell-checked against US-English dictionary](#spell-checked-against-us-english-dictionary)
- [ ] [Use platform agnostic terms](#use-platform-agnostic-terms)

## Discussion

### Contains proper front matter

All front matter needs to be included so that the page can be properly generated. The front matter is the content at the top of the file and delimited at the start and end by three dashes (---). When creating a new cookbook recipe, copy the front-matter from an existing recipe and update the recipe-specific fields (e.g. title, overview, etc).

### Contains a title heading

Every recipe should begin with an H1 header (# in markdown) with the title. The title should match the title attribute in the front matter.

### Contains brief Objective section

This section should contain a brief (one or two sentence) description about what the recipe produces. It should be direct and to the point with a minimum of expository content. If a large amount of explanation is required, consider breaking this recipe into multiple recipes or rewriting the recipe as a tutorial or reference guide article.

### Properly formatted Procedure section

The Procedure section should consist of a ordered list of steps for the consumer to follow. These steps should be provided in the order that they should be executed with larger steps being broken down into sub lists when necessary. Each step should be concisely presented with complete sentences that focus on what the consumer needs to do, not why they need to do it. Whenever possible, commands and code snippets should be provided that can easily be copied and pasted into the consumer's application.

### Contains list of additional resources

After the procedure section, include a list of additional resources that the consumer might need to be aware of. This could include links to other tools that are expected to be present (e.g. Node.js when using the @dojo/cli tool) or tutorials and reference guides that expand on one or more concepts that are mentioned in the recipe.

### No boilerplate steps

Recipes should be as targeted and focused as possible. Content that discusses mundane work such as importing modules or installing tools should be left out or presented as tersely as possible. For example, if a new widget is being created, it makes sense to include a step directing the consumer to import the `WidgetBase` module with the complete path since its location might not be intuitive. However, if they need to import a module that the consumer has created, a simple directive to import that module is sufficient.

### Proper casing for titles

All titles should be written in sentence case. Only the first letter and proper nouns should be capitalized.

### Proper voice and tone use

Recipes should focus on being clear and concise. They should adopt a very declarative tone with a minimum of discussion. Avoid decorating the recipe with adjectives and long paragraphs. Instead, short, imperative statements (e.g. "Run {command} in the terminal.") should be used to communicate what the consumer needs to do with as few words as possible.

Note: this tone will probably lead to recipes that feel cold or distant. This is acceptable since the goal is to solve a problem quickly, not teach about the underlying concepts in a manner that the consumer can easily retain.

### No unnecessary contractions or slang

Contractions and slang expression (expressions that are specific to a culture or region) can be confusing to learners that come from other cultures. Since Dojo 2 has been developed to serve a global audience, contractions and slang should be avoided whenever possible. There are, however, some contractions that are acceptable because the contracted words are almost never used separately ("let's" versus "let us"). These uses of contractions are acceptable.

### No pronouns or, if used, have an obvious meaning to non-native English speakers

Many potential users of Dojo 2 are not native speakers of the English language. A common point of confusion with non-native English speakers is determining what noun a pronoun (he, she, it, etc.) is referring. In order to make Dojo 2's tutorials as clear as possible, pronouns should be avoided unless the referenced noun is unambiguous and obvious.

### No abbreviations

Abbreviations are another source of potential confusion for both native and non-native English speakers. As a result, most uses of abbreviations should be avoided. The only acceptable abbreviation is the shortening of "et cetera" to "etc." since the abbreviated form is more common and, therefore, more likely to be recognized by learners.

### Acronyms are expanded on first use

Acronyms are acceptable for use in tutorials, but they should almost always be expanded on first use. For example, if a tutorial mentions the "DOM", then it should be written as "DOM (Document Object Model)" the first time it is used. After the first instance, acronyms should be written on their own. This rule also applies to shortened forms of long terms such as internationalization. This word can be written as "i18n (internationalization)" when first introduced and then simply as "i18n" thereafter.

The only exceptions to this rule are the acronyms HTML and CSS. These terms do not need to be expanded.

### Spell-checked against US-English dictionary

Dojo 2 is being created and maintained by a multi-cultural community and, as a result, there are several versions of "English" that are represented. All tutorials should be spell checked against a standard US English dictionary.

### Use platform agnostic terms

Avoid the use of words and phrases that are typically assigned to a platform or operating environment. For example, the term "folder" is often associated with the Windows platform, whereas "directory" is more widely used. Similarly, the word "resource" should be used as a more platform agnostic term for a "file".
