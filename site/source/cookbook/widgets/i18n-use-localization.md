---
layout: docs
category: widgets
title: Handle string localization within a widget
overview: Use a localized message within a widget
---

## Objective

This recipe demonstrates how to set up internationalization within your Dojo 2 app.

## Procedure

1. Your localized strings must be part of your app bundle. To achieve this, first add the following configuration to the file `.dojorc`:

```json
{
    "build-webpack": {
        "locale": "en",
        "supportedLocales": [ "FR", "ES" ],
        "messageBundles": [ "src/nls/common" ]
    }
}
```

The `supportedLocales` property value must be an array of all supported languages.

2. The bundles directory (`messageBundles`) you specified in step one must be created.

* Create folder: `src/nls`
* Create folder: `src/nls/FR`
* Create folder: `src/nls/ES`

3. Create a single main language file here: `src/nls/common.ts`

```js
const bundlePath = 'src/nls/common';
const locales = [ 'en-PR', 'en-FR' ];

const messages = {
    greeting: 'Default message'
};

export default { bundlePath, locales, messages };
```

4. Create a `src/nls/FR/common.ts` file with these contents:

```ts
const messages = {
    greeting: 'Bonjour à tous'
};

export default messages;
```

5. Create a `src/nls/ES/common.ts` file with these contents:

```ts
const messages = {
    greeting: 'Hola a todos'
};

export default messages;
```

6. Create a widget which uses localised messages, for example in `src/widgets/MyLocalisedWidget.ts`:

```ts
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { I18nMixin } from '@dojo/widget-core/mixins/I18n';
import appBundle from '../nls/common';

const MyLocalisedWidgetInternationalized = I18nMixin(WidgetBase);

class MyLocalisedWidget extends MyLocalisedWidgetInternationalized {
    protected render() {
        const messages = this.localizeBundle(appBundle);

        return v('div', {}, [
            'Message: ' + messages.greeting
        ]);
    }
}

export default MyLocalisedWidget;
```

7. Create your main widget, which renders `MyLocalisedWidget`:

```ts
import { w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import MyLocalisedWidget from './MyLocalisedWidget';
import { switchLocale } from '@dojo/i18n/i18n';

export class HelloWorld extends WidgetBase {
    private locales = ['en', 'FR', 'ES'];
    private localesIndex = 0;

    constructor() {
        super();

        setInterval(() => {
            this.toggleLocale();
            this.invalidate();
        }, 500);
    }

    protected toggleLocale() {
        const locale = this.locales[ this.localesIndex++ % this.locales.length ];
        switchLocale(locale);
    }

    protected render() {
        return w(MyLocalisedWidget, {});
    }
}

export default HelloWorld;
```

8. After restarting the `dojo build -w` command, observe the text on the webpage frequently changes language.

## Further reading

[Dojo internationalization guide](https://dojo.io/docs/fundamentals/internationalization/index.html)