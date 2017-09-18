---
layout: tutorial
title: Setting up a development environment
overview: This tutorial shows how to set up and use a development environment that takes advantage of Dojo 2 features.
---

{% section 'first' %}

# Development Environment

## Overview

This tutorial will cover how to set up your tools and environment for the best development experience. You can use demo code from any of the tutorials, but this tutorial will reference finished code from the [Forms tutorial](../005_form_widgets/).

## Prerequisites
You can [download](../assets/10xx_development_environment-initial.zip) a fresh install of the demo code to get started.

You should be familiar with the developer tools in your browser of choice. This tutorial will reference the Chrome developer tools, but the instructions should apply to any browser.

{% section %}

## Command line tools

The [first tutorial](../000_local_installation/) goes into installing the Dojo CLI, and the available commands. Before that point, we assume you have an environment with supported versions of node, npm, and git installed.

While git is not strictly necessary to use Dojo 2, a robust development environment also needs some sort of version control system. All of Dojo 2 uses git as the version control tool and we manage all of our code on GitHub. Several of READMEs and other instructions will assume that git is being used for version control. If it or another version control tool is not already installed, you can follow [these instructions](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git).

{% task 'Initialize a git repository' %}

{% instruction 'Run `git init` within the root `biz-e-corp` directory' %}

This should log `Initialized empty Git repository in /path/to/biz-e-corp/.git/` in your console.

{% instruction 'Create your first commit' %}

Use `git add` to begin tracking files, and `git commit` to create a commit. For more information, refer to [these instructions](https://git-scm.com/book/en/v2/Git-Basics-Recording-Changes-to-the-Repository).

{% section %}

## Configure your editor

{% task 'Get an editor that supports Typescript.' %}

Any code editor will allow you to work on a Dojo 2 project, but an editor that supports TypeScript will give you a richer development experience, as Dojo 2 is built with TypeScript and specifically designed to take advantage of its features. A list of editors with plugins that enable typescript support is [available here](https://github.com/Microsoft/TypeScript/wiki/TypeScript-Editor-Support).

{% instruction 'Install Typescript support' %}

In Atom, for example, this means installing [atom-typescript](https://atom.io/packages/atom-typescript). Visual Studio Code comes with typescript support by default, and for Vim try installing a combination of plugins for [language features](https://github.com/Quramy/tsuquyomi) and [syntax highlighting](https://github.com/leafgarland/typescript-vim).

{% instruction 'Test error highlighting' %}

Within the demo app, open `src/widgets/WorkerContainer.ts`. In it, there should be code to create an instance of the Worker widget on line 21. Add a fake property, e.g.:

```typescript
const workers = workerData.map((worker, i) => w(Worker, {
  key: `worker-${i}`,
  fakeProp: 'foo',
  ...worker
}));
```

Verify that your editor has highlighted `fakeProp` as an error:

<p class="center">![error message in Atom](./resources/atom_ts_error.png)</p>

{% instruction 'Go further: VS Code and tasks' %}

You may skip to the next step if you are not interested in trying out VS Code.

VS Code supports Typescript by default, is written is Typescript, and allows you to [configure tasks](https://code.visualstudio.com/docs/editor/tasks) which are then integrated into the IDE.

To configure tasks:

* Press <kbd>⌘⇧P</kbd>/<kbd>Ctrl⇧P</kbd> to bring up the command list.
* Start typing <kbd>tasks</kbd> and select the command `Tasks: Configure Task Runner`

<p class="center">![gif of opening tasks.json](./resources/task_setup.gif)</p>

The [first tutorial](../000_local_installation/) had you run `dojo build` as the first Dojo CLI command after creating your app, so consider the following code to configure it within `tasks.json`:

```json
{
  "version": "0.1.0",
  "command": "dojo",
  "isShellCommand": true,
  "args": [],
  "showOutput": "always",
  "suppressTaskName": true,
  "tasks": [
    {
      "taskName": "build",
      "args": [ "build" ],
      "isBuildCommand": true,
      "problemMatcher": {
      "owner": "dojo",
      "fileLocation": "relative",
      "pattern": [
        {
          "regexp": "^(\\S+) in (.*)",
          "severity": 1,
          "file": 2
        }, {
          "regexp": "\\((\\d+),(\\d+)\\):(.*)",
          "line": 1,
          "column": 2,
          "message": 3
        }
      ]
      }
    }
  ]
}
```

Other tasks to consider adding could be `test` or `watch`. Once configured, the build command (<kbd>⌘⇧B</kbd>/<kbd>Ctrl⇧B</kbd>) will be configured as well as you will have the other
tasks available in the IDE:

<p class="center">![dropdown of vs code tasks](./resources/run_task.png)</p>

{% section %}

## Debugging

If you are developing a Dojo 2 application in TypeScript, your application code is transpiled from TypeScript to JavaScript. If you are also using dojo build, then your code is also being bundled and minimized. This could make it challenging to debug an application, but we have tried to make Dojo 2 applications integrate well into modern debugging tools.

Source maps are the way on the web we can describe code that has been transformed in some fashion. The dojo build maps the code throughout the process so that both the original TypeScript code and CSS code is available when debugging. This should allow you to set breakpoints and watches on the original code as well as see the original code when there is a run-time error.

{% task 'Debug test app in Chrome Dev Tools' %}

{% instruction 'Create a breakpoint in WorkerContainer' %}

To demonstrate the source mapping between compiled Javascript code and the source TypeScript, you can open the `Sources` tab in dev tools, and browse to `WorkerContainer.ts`. Insert a breakpoint where desired, and upon reloading you should see it pause script execution:

<p class="center">![breakpoint set in chrome dev tools](./resources/breakpoint.png)</p>

{% task 'Install an accessibility inspector' %}

Dojo 2 widgets are designed to be accessible by default, but a full app is much more than the sum of its parts. A good in-browser a11y inspector helps integrate accessibility into the development process. Chrome provides the [Accessibility Developer Tools](ttps://chrome.google.com/webstore/detail/accessibility-developer-t/fpkknkljclfencbdbgkenhalefipecmb), which can be used when inspecting the DOM:

<p class="center">![chrome accessibility inspector](./resources/a11y_inspection.png)</p>

This exposes text and semantics visible to a screen reader, exposing a page model referred to as the [Accessibility Tree](https://developers.google.com/web/fundamentals/accessibility/semantics-builtin/the-accessibility-tree).

Chrome Accessibility Developer Tools does not run an audit against your code, or validate it in any way. For easy in-browser a11y validation, aXe has free open-source extensions for [Chrome](https://chrome.google.com/webstore/detail/axe/lhdoppojpmngadmnindnejefpokejbdd) and [Firefox](https://addons.mozilla.org/en-us/firefox/addon/axe-devtools/).

{% section 'last' %}
