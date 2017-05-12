# Guideline for writing Dojo 2 tutorials

## Purpose

This guideline describes how to create a Dojo 2 tutorial.

## Summary

The following rules should be followed when creating a tutorial. See the [discussion](#discussion) section for more information about each point.

- [ ] [Tutorial is demo-driven](#tutorial-is-demo-driven)
- [ ] [Order allows user to see impact of changes in a browser](#order-tutorial-to-allow-user-to-see-impact-of-changes-in-a-browser)
- [ ] [Links provided when referring to other topics](#links-provided-when-referring-to-other-topics)
  - links to other tutorials end with a trailing slash (/)
- [ ] [Initial and finished demos are available](#initial-and-finished-demos-are-available)
- [ ] [Tutorial takes learner from the 'initial' demo and ends with the 'finished' one](#tutorial-takes-learner-from-the-initial-demo-and-ends-with-the-finished-one)
  - content flows naturally - all changes are described with no logical leaps
- [ ] [Written with the target audience in mind](#written-with-the-target-audience-in-mind)
- [ ] [Story-arc in place](#story-arc-in-place)
  - beginning - Introduces the initial demo and how to get it setup. Also describes goal of tutorial.
  - middle - Takes the learner on a journey from the initial demo to the finished one, repeatedly setting up "problems" and "solving" them as demo builds toward finished state.
  - ending - Wraps up the story and reminds them of what they learned. Also links them to finished demo assets.
- [ ] [Proper voice and tone used (friendly, but not patronizing; use the inclusive "we")](#proper-voice-and-tone-used)
- [ ] [No unnecessary contractions or slang](#no-unnecessary-contractions-or-slang)
- [ ] [No pronouns or, if used, have an obvious meaning to non-native English speakers](#no-pronouns-or-if-used-have-an-obvious-meaning-to-non-native-english-speakers)
- [ ] [No abbreviations](#no-abbreviations)
- [ ] [Acronyms are expanded on first use](#acronyms-are-expanded-on-first-use)
- [ ] [Spell-checked against US-English dictionary](#spell-checked-against-us-english-dictionary)
- [ ] ['aside' tags used for short, supporting script](#aside-tags-used-for-short-supporting-script)
- [ ] ['include_codefile' tags used for code-snippets, where possible](#include_codefile-tags-used-for-code-snippets-where-possible)
- [ ] ['solution' tag used when possible](#solution-tag-used-when-possible)

## Discussion

### Tutorial is demo-driven

All tutorials should guide the learner through the topic by showing how to apply the concepts to a real-world project. To do this, the tutorial should be backed by a demonstration project that is designed to highlight all of the points that need to be communicated. For example, if the tutorial's goal is to show how to create a new project, then it should not just explain the commands that are needed. Instead, a scenario should be presented to the user, such as the need to create an application that will manage a user's TODO list. The tutorial would then guide the learner through the relevant commands and APIs that are available to complete the scenario's goal.

### Order tutorial to allow user to see impact of changes in a browser

The tutorial should be organized to allow the learner to see the impact of their changes as often as possible. This allows the learner to associate an action (writing code) with an effect (something in the browser changes). For example, if the tutorial involves the creation of a new widget, then it is generally better to create the widget's skeleton and have the application render it before filling out the widget's details. This will show the learner how the code that they are adding is changing the application. It is also useful to refer to this often; assume that the learner is following along and mention visual updates as a part of the tutorial to reinforce the impact of the change.

### Links provided when referring to other topics

If a person is going through a tutorial, it is reasonable to assume that they are unfamiliar with the topic that is being discussed. It is also likely that they will run into new concepts throughout the tutorial. Whenever possible, include hyperlinks to resources that they can use to get more information about these related topics, whether referring to other resources within dojo.io or external resources. Take a widget's `render` method as an example. It is almost impossible to introduce the `render` method without talking about the virtual DOM. When the virtual DOM is introduced, the tutorial should include a sentence or two giving an overview of the concept and then link out to a reliable resource (e.g. Wikipedia, Mozilla Developer Network, ...) to allow them to investigate the topic more deeply, if necessary.

When linking to other tutorials, make sure to include a trailing slash (/) in the URL so that relative URLs behave consistently.

If a topic is discussed that does not have an article on dojo.io, but eventually will, then link to the "comingsoon" page. This page can be found at `/tutorials/comingsoon.html` or `../comingsoon.html` if linking from within a tutorial.

### Initial and finished demos are available

Both the initial and finished versions of the demo project should be available for download from within the tutorial. The demos should be located in a directory called "demo" that is a child of the tutorial itself. Within each folder, create a directory called "initial" for the initial demo code and "finished" for the finished version. When the site is built, a zip file will be created in `/tutorials/assets` for each of the demos. The name of this file is `{tutorial title}_{initial | finished}`. For example, the initial demo for a tutorial called "001\_static\_content" would be accessible via the URL `/tutorials/assets/001_static_content_initial.zip`. This can be accessed via a relative link within a tutorial as `../assets/001_static_content_initial.zip`.

### Tutorial takes learner from the 'initial' demo and ends with the 'finished' one

Each tutorial should be written as a journey, taking the learner from the initial demo to the finished one. Each step of the tutorial should be preceded with a challenge, or issue, that the demo contains at that point in the tutorial while continually heading toward the finished version of the demo. The learner should then be shown how to address that issue by using best-practices. After the solution has been presented, consider including additional discussion about *why* the problem was solved in that way. Try to imagine the questions that a learner might have and address the most common ones. This will help the learner understand and internalize the solution rather than just accepting it at face value.

### Written with the target audience in mind

Consider the knowledge level of the learner and make sure that the tutorial is written so that they can easily understand what is being taught.

- **Do not** patronize the learner by explaining concepts that it is reasonable to assume that they know. For example, it is reasonable to expect that a visitor to dojo.io knows what HTML is and what it is used for. There is no need to explain it to them.
- **Do** take the time to explain concepts that might be new to them. Many Dojo 2 developers have been working with the concept of the virtual DOM and reactive programming for years, but the average front end developer probably does not have significant experience with these techniques. Taking a few sentences (and linking to resources) to explain these concepts will help keep the learner from feeling overwhelmed.

### Story-arc in place

Consider separating the tutorial into three major sections.

- The beginning of the tutorial should contain some brief remarks about the concepts that will be discussed and how to get started with the demo project. When introducing the demo project, briefly describe what it already does as well as what features will be added or deficiencies will be addressed in the tutorial. If there is anything that the learner should know before starting the tutorial, those prerequisites should also be listed in this section.
- The middle of the tutorial should take the learner on the journey through the content of the tutorial. It should be divided into sub-sections, each taking one step toward the ultimate solution. If possible, these subsections should setup the next problem to be solved, walk the learner through the solution, and then briefly recap what was done and why.
- The ending section of the tutorial should provide a summary of what was discussed during the tutorial and revisit critical things for them to remember. It should also contain links to download the finished demo project as well as links to any tutorials that would be good next steps for the learner to take.

### Proper voice and tone used

When writing the tutorial, imagine that you are sitting beside the learner and teaching them in person. When asking them to make changes to the demo project, use words like "we" and "let's" to include yourself with them as you work towards solving the problem:

> First, **we** need to create a Dojo 2 project.

When asking learner to do something, however, avoid pronouns and just tell them what to do:

> Run the following command in the directory that will host the new application:

If the tutorial is discussing benefits, feel free to use the 2nd person ("you") to emphasize the benefit.

> Now it is time to see what **our** application can do! First, **we** are going to leverage another `@dojo/cli` command. **You** do not have to install this one, it was added when **you** installed the other dependencies. In the terminal, enter the command:

### No unnecessary contractions or slang

Contractions and slang expression (expressions that are specific to a culture or region) can be confusing to learners that come from other cultures. Since Dojo 2 has been developed to serve a global audience, contractions and slang should be avoided whenever possible. There are, however, some contractions that are acceptable because the contracted words are almost never used separately ("let's" versus "let us"). These uses of contractions are acceptable.

### No pronouns or, if used, have an obvious meaning to non-native English speakers

Many potential users of Dojo 2 are not native speakers of the English language. A common point of confusion with non-native English speakers is determining what noun a pronoun (he, she, it, etc.) is referring. In order to make Dojo 2's tutorials as clear as possible, pronouns should be avoided unless it is extremely obvious what noun is being referred to.

### No abbreviations

Abbreviations are another source of potential confusion for both native and non-native English speakers. As a result, most uses of abbreviations should be avoided. The only acceptable abbreviation is the shortening of "et cetera" to "etc." since the abbreviated form is more common and, therefore, more likely to be recognized by learners.

### Acronyms are expanded on first use

Acronyms are acceptable for use in tutorials, but they should almost always be expanded on first use. For example, if a tutorial mentions the "DOM", then it should be written as "DOM (Document Object Model)" the first time it is used. After the first instance, acronyms should be written on their own. This rule also applies to shortened forms of long terms such as internationalization. This word can be written as "i18n (internationalization)" when first introduced and then simply as "i18n" thereafter.

### Spell-checked against US-English dictionary

Dojo 2 is being created and maintained by a multi-cultural community and, as a result, there are several versions of "English" that are represented. All tutorials should be spell checked against a standard US English dictionary.

### 'aside' tags used for short, supporting script

In the course of teaching a concept, there are often points that are useful for the learner to be made aware of but do not fit within the tutorial itself. In these situations, consider using the `aside` tag to allow the desired content to be added without disrupting the overall flow of the tutorial. In general, asides should be fairly short (one or two sentences) and placed as close to the relevant content.

Example:

```markdown
{% aside "The aside's title" %}
  Put the aside's content here. No more than a sentence or two, please!
{% endaside %}

```

Note: The `aside` tag can render markdown for hyperlinks as well as inline code samples, but the results should always be checked before publication.

### 'include_codefile' tags used for code-snippets, where possible

Since Dojo 2 tutorials are demo-driven, they tend to contain a lot of code snippets. Keeping the code in the demo projects synchronized with the tutorials can be simplified by using the `include_codefile` tag in the text. There are several ways to configure the `include_codefile` tag to point include a code snippet.

- The simplest form is to simply provide a relative path from the current file to the file that should be included:

 ```markdown

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/HelloWorld.ts' %}

```

This will replace the tag with the file's contents and apply syntax highlighting to it with the assumption that the contents are JavaScript code.

- If the file does not contain JavaScript, then the `lang` parameter can be added to change the syntax highlighting rules:

 ```markdown

{% include_codefile 'demo/finished/biz-e-corp/src/styles/helloWorld.css' lang:css %}

```

**NOTE:** The syntax highlighting for TypeScript does not currently work with this tag

- If the code file is part of an exercise solution (see below), then provide the solution ID:

 ```markdown

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/HelloWorld.ts' solution:showsolution1 %}

```

- If a single line is needed, then provide the "line" argument:

 ```markdown

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/HelloWorld.ts' line:4 %}

```

- If multiple lines are needed, then a comma delimited list of line sets (separated by dashes) can be used:

 ```markdown

{% include_codefile 'demo/finished/biz-e-corp/src/widgets/HelloWorld.ts' lines:1-2,5,9-12 %}

```

### 'solution' tag used when possible

When possible, allow the learner to apply what they have learned to achieve a goal on their own. To do that, use the `solution` tag to add a hidden code snippet that the user can reveal by clicking a button.

Example:

```markdown

{% solution showsolution1 %}
export default class HelloWorld extends WidgetBase<WidgetProperties> {
  render(): DNode {
    return v('h1', [ 'Biz-E Bodies' ]);
  }
}
{% endsolution %}

```

**NOTE:** The parameter passed to the `solution` tag must be unique on the page since it is used to set the ID of the hidden code snippet.

**NOTE:** if the solution code can be imported from a file, use the `include_codefile` tag with a `solution` argument

