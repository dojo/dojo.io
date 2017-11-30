---
layout: docs
category: fundamentals
title: Internationalization
overview: It is increasingly rare that applications reach a single audience that lives in a single region and speaks a single language. This article describes the tools Dojo 2 provides to guarantee an application can be adapted to all users, regardless of their language or address.
---

# Internationalization

## Philosophy and approach

Internationalization, or i18n, is the process of decoupling an application from a particular language or culture, and is a major requirement of most enterprise applications. As such, internationalization is one of Dojo 2's core concerns. `@dojo/i18n`, Dojo 2's internationalization ecosystem, provides everything that is needed to internationalize and localize an application, from locale-specific messaging to date, number, and unit formatting. Rather than reinvent the wheel, Dojo 2 delegates to the excellent [Globalize.js](https://github.com/globalizejs/globalize) library wherever possible. In addition to formatters and parsers for working with localized dates, times, numbers, and units, Globalize.js also includes an implementation of the [ICU `MessageFormat`](http://userguide.icu-project.org/formatparse/messages), which makes it possible to format messages based on locale-specific variables like gender and count. While `@dojo/i18n` can be used independently from the rest of Dojo 2, most applications will also rely on `@dojo/widget-core` and `@dojo/cli-build-app` to simplify internationalization.

As we will see below, the general process for internationalizing a Dojo 2 application can be outlined as follows:

1. Set the application locale.
2. Load any [CLDR data](https://github.com/unicode-cldr/) required to correctly format values.
3. Create message translations for all supported locales.
4. Delegate formatting to the appropriate `@dojo/i18n` methods when rendering any value that may need to be localized.
5. Update the application's configuration settings to ensure all required data are included in the build.

## Reading and setting the application's locale

While any widget can have its own dedicated locale (see below), every Dojo 2 application has a single root locale, which can be changed at any point. By default, this root locale is set to that of the user's environment, but can be set to a particular locale at any time. All functionality related to reading and setting the application locale is provided by `@dojo/i18n/i18n`.

The `systemLocale` property represents the environment locale, which is normalized to a valid [BCP-47 language tag](https://tools.ietf.org/html/rfc5646). Note that this differs from the format Node.js uses for `process.env.LANG`, from which this property is derived. `i18n.locale` represents the current application locale. This defaults to the environment locale, but can be changed with the `switchLocale` method.

```typescript
import i18n, { switchLocale, systemLocale } from '@dojo/i18n/i18n';

console.log(i18n.locale === systemLocale); // true
switchLocale('ja');
console.log(i18n.locale); // 'ja'
```

Since Dojo 2 uses a [reactive architecture](../reactive_programming/), an `observeLocale` method is provided to observe changes to the application locale. It accepts an [Observable](https://github.com/tc39/proposal-observable) whose `next` method is passed the new locale.

```typescript
import { observeLocale, switchLocale } from '@dojo/i18n/i18n';

// Create a subscription that updates the <html> tag's "lang" attribute when
// the locale is changed.
const subscription = observeLocale({
	next: (locale: string) => {
		document.documentElement.setAttribute('lang', locale);
	}
});

switchLocale('es');

// destroy the observer when we no longer need to observe locale changes
subscription.unsubscribe();
```

>**Note**: As you may have noticed from the previous example, changing the application locale with `switchLocale` does not change the `<html lang>` attribute. There are two reasons for this: first, DOM updates are beyond the purview of `@dojo/i18n`; second, the application might consist of only a portion of the total rendered DOM.

## Loading CLDR data

Most functionality requires [CLDR data](https://github.com/unicode-cldr/), without which errors will be thrown. However, no CLDR data are included by Dojo 2, both due to the size of the complete CLDR data and to prevent tying applications to a specific version of the CLDR. All CLDR data must be registered with the i18n ecosystem via `@dojo/i18n/cldr/load.default` before the corresponding formatters can be used. This function accepts a JSON object of CLDR data. This same module also exposes an `isLoaded` function that can be used to determine whether specific data have been registered.

The easiest way to obtain the complete CLDR is with the [`cldr-data`](https://www.npmjs.com/package/cldr-data) npm package, which maps the data from the Unicode repository to `main` and `supplemental` directories. The `main` directory houses a directory for each locale, which in turn contains all CLDR data specific to that locale. The `supplemental` directory contains generic data that makes more sense in standalone files, such as pluralization formats or telephone country codes.

```typescript
import request from '@dojo/core/request';
import loadCldrData, { isLoaded } from '@dojo/i18n/cldr/load';

console.log(isLoaded('supplemental', 'likelySubtags')); // false
console.log(isLoaded('supplemental', 'plurals-type-cardinal')); // false

const cldrUrls = [
	'./path/to/cldr/supplemental/likelySubtags.json',
	'./path/to/cldr/supplemental/plurals.json'
];
const cldrRequests = cldrUrls.map(url => {
	return request(url).then(response => response.json());
});

Promise.all(cldrRequests).then(results => {
	results.forEach(json => {
		loadCldrData(json);
	});

	console.log(isLoaded('supplemental', 'likelySubtags')); // true
	// Notice that the check is for the property on the JSON object, not the JSON filename.
	console.log(isLoaded('supplemental', 'plurals-type-cardinal')); // true
});
```

## Message translations

The task most developers associate with internationalization is providing locale-specific message translations. Dojo 2 applications package translations into one or more bundles, each with a set of default translations and any number of locale-specific translations. Message loading and formatting is provided by `@dojo/i18n/i18n`. The default export accepts a bundle (see below) and an optional locale, and returns a promise to the loaded messages. If a locale is not provided, the root locale is assumed.

```typescript
import i18n from '@dojo/i18n/i18n';
import greetings from './nls/greetings/main';

i18n(bundle, 'fr').then((messages) => {
	console.log(messages.hello);
});
```

### Bundle format

Translation bundles in Dojo 2 are separated into two components: a required base module containing default values for all possible messages provided by the bundle, and individual modules for each supported locale. While not required, it is a best practice to place all message bundles under the `src/nls` directory. The base module must expose a `default` export, which must be an object, and which must contain the following:

* An optional `locales` object whose keys are locales and whose values are functions that return either the locale-specific messages or a promise to the messages.
* A `messages` object containing key-value pairs of default messages.

While there are no specific requirements dictating where locale-specific translations should be located, it makes the most sense to place them in directories within the same directory as their default bundle. For example, if the `locales` map exposed by a bundle located at `src/nls/main` includes both `'fr'` and `'fr-CA'`, then the messages for those two locales might be located at `src/nls/fr/main` and `src/nls/fr-CA/main`, respectively. The `default` export from the locale-specific bundle modules must be an object containing the locale-specific messages as key-value pairs. Note that locale-specific bundles need not contain all possible messages; any missing messages will be filled in by the default bundle. For example, if the default bundle contains the messages `{ foo: 'bar', baz: 'bat' }`, but a locale-specific bundle contains only `{ baz: 'xyzzy' }`, then the default value for `foo` ("bar") will be used.

For example, suppose we have a `greetings` bundle with default messages in English, but that also provides Arabic translations. First, we define our default bundle with a supported locales map (which, in this case, includes just Arabic):

```typescript
// Default bundle: "src/nls/greetings.ts"
export default {
	locales: {
		ar: () => import('./ar/greetings')
	},
	messages: {
		hello: 'Hello',
		helloReply: 'Hello',
		goodbye: 'Goodbye'
	}
};
```

Second, we add the Arabic translations:

```typescript
// "src/nls/ar/greetings.ts"
const messages = {
	hello: 'السلام عليكم',
	helloReply: 'و عليكم السام',
	goodbye: 'مع السلامة'
};
export default messages;
```

Finally, we use the `i18n` function to load the messages:

```typescript
import i18n from '@dojo/i18n/i18n';
import greetings from './nls/greetings';

i18n(greetings).then((messages) => {
	console.log(message.hello); // Hello
	console.log(message.helloReply); // Hello
	console.log(message.goodbye); // Goodbye

	return i18n(greetings, 'ar');
}).then((messages) => {
	console.log(messages.hello); // 'السلام عليكم'
	console.log(messages.helloReply); // 'و عليكم السام'
	console.log(messages.goodbye); // 'مع السلامة'
});
```

### Locale resolution

Locales are resolved from most to least specific. Continuing with our previous example, if the user's locale is `ar-JO` (Jordanian Arabic), then the `locales` map provided by the default greetings bundle will be inspected for a locale exactly matching `ar-JO`. Since the greetings bundle does not contain translations specific to Jordanian Arabic, those provided for `ar` are used instead. If, however, the locale does not match any supported by the bundle, then the default messages are used.

```typescript
// "src/nls/ar-JO/greetings.ts"
const messages = {
	hello: 'مرحبا',
	helloReply: 'مرحبتين'
};
export default messages;
```

```typescript
import i18n, { Messages } from '@dojo/i18n/i18n';
import greetings from './nls/greetings';

i18n(greetings, 'ar-JO').then((messages) => {
	console.log(messages.hello); // 'مرحبا'
	console.log(messages.helloReply); // 'مرحبتين'

	// Since src/nls/ar-JO/greetings.ts does not specify a "goodbye" message,
	// the next best-supported value is used. In this case, the value from
	// src/nls/ar/greetings.ts is used.
	console.log(messages.goodbye); // 'مع السلامة'

	return i18n(greetings, 'cz');
}).then((messages) => {
	// Since Czech is not supported by the greetings bundle, fallback to the
	// default messages.
	console.log(messages.hello); // 'Hello'
	console.log(messages.helloReply); // 'Hello'
	console.log(messages.goodbye); // 'Goodbye'
});
```

### Formatting messages

`@dojo/i18n/i18n` exposes two methods used to format messages: `formatMessage`, which can be used to format a message immediately, and `getMessageFormatter`, which returns a function that can be used to format the same message string multiple times with different options. Dojo 2 supports the [ICU `MessageFormat`](http://userguide.icu-project.org/formatparse/messages) (see below), but that requires CLDR data, and may not be required by every application. Therefore, by default, these two methods use simple variable replacement, but switch to the more robust format once the [`likelySubtags`](https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/likelySubtags.json) and [`plurals-type-cardinal`](https://github.com/unicode-cldr/cldr-core/blob/master/supplemental/plurals.json) CLDR data have been loaded.

For example, given the message `"Hello, {name}!"`, the formatter would be passed an object with a `name` string property and replace the `{name}` token in the message template with that passed value:

```typescript
// src/nls/greetings.ts
export default {
	messages: {
		hello: 'Hello, {name}!'
	}
};
```

```typescript
import i18n, { getMessageFormatter, formatMessage } from '@dojo/i18n/i18n';
import greetings from './nls/greetings';

// First, register the bundle with `@dojo/i18n`
i18n(greetings).then(() => {
	const formatted = formatMessage(greetings, 'hello', { name: 'Margaret Mead' });
	console.log(formatted); // "Hello, Margaret Mead!"

	const formatter = getMessageFormatter(greetings, 'hello');
	console.log(formatter({ name: 'Marshall Sahlins' })); // "Hello, Marshall Sahlins!"
});
```

However, if the message needs to adapt to other variables like the number of people being addressed, then the ICU `MessageFormat` can be triggered by loading the `likelySubtags` and `plurals-type-cardinal` CLDR data:

```typescript
// src/nls/greetings.ts
export default {
	messages: {
		hello: `{personCount, plural, offset:1
			=0: {Hello, nobody!},
			=1: {Hello, {name}!},
			other {Hello, everyone!}}`
	}
};
```

```typescript
import loadCldrData from '@dojo/i18n/cldr';
import i18n, { getMessageFormatter } from '@dojo/i18n/i18n';
import greetings from './nls/greetings';

// First, ensure the appropriate CLDR data have been loaded
[ likelySubtagsJson, pluralsJson ].map(json => loadCldrData(json));

// Next, register the bundle with `@dojo/i18n`
i18n(greetings).then(() => {
	const formatter = getMessageFormatter(greetings, 'hello');

	// "Hello, nobody!"
	console.log(formatter({ personCount: 0 }));

	// "Hello, Bill Evans!"
	console.log(formatter({
		name: 'Bill Evans',
		personCount: 1
	}));

	// "Hello, everyone!"
	console.log(formatter({ personCount: Infinity }));
});
```

## Date, number, and unit formatting and parsing

Dojo 2 provides several helpers to facilitate formatting and parsing dates, numbers, and units for the user's locale. As mentioned earlier, Dojo 2 relies on [Globalize.js](https://github.com/globalizejs/globalize) wherever possible. Since the templates for formatting and parsing data are supplied by the CLDR, each formatter and parser requires that specific CLDR data have been loaded. The exact requirements are detailed in the [`@dojo/i18n` README](https://github.com/dojo/i18n#loading-cldr-data).

The available formatting and parsing methods fall into two categories: those methods that accept a value and immediately return the formatted or parsed value based on the provided options, and those that return a method that can be reused to format different values based on the same options. With few exceptions noted below, each method has the same signature: a value to format or parse, an optional configuration object, and optional locale. If no locale is provided, then the root locale is assumed.

```typescript
// In-place formatters:
format<T, U, V>(value: T, options?: U, locale?: string): V;
format<T, V>(value: T, locale?: string): V;

// Formatter factories:
getFormatter<T, U, V>(options?: U, locale?: string): (value: T) => V;
getFormatter<T, V>(locale?: string): (value: T) => V;
```

### Date and time formatting

The `@dojo/i18n/date` module provides several functions for formatting and parsing dates and times. Each method corresponds directly to a `Globalize.js` method, and uses the same options available to the Globalize.js methods.

* `formatDate`: converts a `Date` object to a formatted string, and delegates to [`Globalize.formatDate`](https://github.com/globalizejs/globalize/blob/master/doc/api/date/date-formatter.md).
* `formatRelativeTime`: returns a formatted string representing a relative time value, and delegates to [`Globalize.formatRelativeTime`](https://github.com/globalizejs/globalize/blob/master/doc/api/relative-time/relative-time-formatter.md).
* `getDateFormatter`: returns a function that converts a `Date` object to a formatted string, and delegates to [`Globalize.dateFormatter`](https://github.com/globalizejs/globalize/blob/master/doc/api/date/date-formatter.md).
* `getDateParser`: returns a function that parses a string into a `Date` object, and delegates to [`Globalize.dateParser`](https://github.com/globalizejs/globalize/blob/master/doc/api/date/date-parser.md).
* `getRelativeTimeFormatter`: returns a function that formats a relative time, and delegates to [`Globalize.relativeTimeFormatter`](https://github.com/globalizejs/globalize/blob/master/doc/api/relative-time/relative-time-formatter.md).
* `parseDate`: parses a date string into a `Date` object, and delegates to [`Globalize.parseDate`](https://github.com/globalizejs/globalize/blob/master/doc/api/date/date-parser.md).

Dates are formatted and parsed according to locale-specific patterns described by the CLDR, but a variety of options are provided to control which formatting template is applied. For example, dates can be formatted solely as numerical representations, or with expanded day and month names:

```typescript
import { formatDate, formatRelativeTime } from '@dojo/i18n/date';

const date = new Date(2017, 3, 1); // April 1, 2017

// Format just the date portion
formatDate(date, { date: 'short' }, 'en'); // 4/1/2017
formatDate(date, { date: 'medium' }, 'en'); // Apr 1, 2017
formatDate(date, { date: 'long' }, 'en'); // April 1, 2017
formatDate(date, { date: 'full' }, 'en'); // Saturday, April 1, 2017

// Format just the time portion
formatDate(date, { time: 'short' }, 'en'); // '3:56 AM'
formatDate(date, { time: 'medium' }, 'en'); // '3:56:42 AM'
formatDate(date, { time: 'long' }, 'en'); // '3:56:42 AM GMT-5'
formatDate(date, { time: 'full' }, 'en'); // '3:56:42 AM GMT-05:00'

// Format both the date and time portions
formatDate(date, { datetime: 'full' }, 'en'); // 'Saturday, April 1, 2017 at 3:56:42 AM GMT-05:00'
formatDate(date, { datetime: 'long' }, 'en'); // 'April 1, 2017 at 3:56:42 AM GMT-5'
formatDate(date, { datetime: 'medium' }, 'en'); // 'Apr 1, 2017, 3:56:42 AM'
formatDate(date, { datetime: 'short' }, 'en'); // '4/1/17, 3:56 AM'

// Format as relative time
formatRelativeTime(-1, 'day'); // 'yesterday'
formatRelativeTime(-1, 'week'); // 'last week'
formatRelativeTime(-1, 'week', { form: 'short' }; // 'last wk.'
```

Sometimes it is desirable to format multiple dates using the same options. Instead of using in-place formatters, a factory can be used, saving both energy and computational time. For example, suppose a data grid displays a list of purchases, each with their date and time. Rather than generating the correct format with each entry, the formatter can be created just once and then used as many times as needed:

```typescript
import { getDateFormatter } from '@dojo/i18n/date';

const formatPurchaseDate = getDateFormatter({ datetime: 'medium' }, 'en');

class PurchaseGrid {
	// ...
	renderPurchaseDate(date: Date) {
		return formatPurchaseDate(date);
	}
}
```

Finally, often a date will be represented as a formatted string, but is needed as a date object. For such occasions, `parseDate` and `getDateParser` can be used to read locale-specific date strings:

```typescript
// Assuming all appropriate CLDR data have been loaded for French date formatting...
import { switchLocale } from '@dojo/i18n';
import { parseDate } from '@dojo/i18n/date';

switchLocale('fr');

parseDate('samedi, 1 avril 2017', { date: 'full' }); // Date(2017, 3, 1)
```

### Number and currency formatting

Number and currency formatters and parsers are provided by the `@dojo/i18n/number` module. As with the date and time methods, each method corresponds directly to a `Globalize.js` method, and uses the same options available to those Globalize.js methods.

* `formatCurrency`: formats a number as a currency, and delegates to [`Globalize.formatCurrency`](https://github.com/globalizejs/globalize/blob/master/doc/api/currency/currency-formatter.md).
* `formatNumber`: formats a number according to the specified options, and delegates to [`Globalize.formatNumber`](https://github.com/globalizejs/globalize/blob/master/doc/api/number/number-formatter.md).
* `getCurrencyFormatter`: returns a function that formats a number as a currency, and delegates to [`Globalize.currencyFormatter`](https://github.com/globalizejs/globalize/blob/master/doc/api/currency/currency-formatter.md).
* `getNumberFormatter`: returns a function that formats a number according to specified options, and delegates to [`Globalize.numberFormatter`](https://github.com/globalizejs/globalize/blob/master/doc/api/number/number-formatter.md).
* `getNumberParser`: returns a function that parses a number from a locale string, and delegates to [`Globalize.numberParser`](https://github.com/globalizejs/globalize/blob/master/doc/api/number/number-parser.md).
* `getPluralGenerator`: returns a function that returns the plural group for a specified number: "zero", "one", "two", "few", "many", or "other", and delegates to [`Globalize.pluralGenerator`](https://github.com/globalizejs/globalize/blob/master/doc/api/plural/plural-generator.md).
* `parseNumber`: parses a number from a locale string, and delegates to [`Globalize.parseNumber`](https://github.com/globalizejs/globalize/blob/master/doc/api/number/number-parser.md).
* `pluralize`: returns the plural group for a specified number: "zero", "one", "two", "few", "many", or "other", and delegates to [`Globalize.plural`](https://github.com/globalizejs/globalize/blob/master/doc/api/plural/plural-generator.md).

Numbers can be formatted as currencies, percentages, or plain decimal strings, can be normalized to a specific number of significant digits, and can be rendered with or without group separators:

```typescript
// Assuming all relevant CLDR data have been loaded, and that the root locale is English.
import { formatNumber, parseNumber } from '@dojo/i18n/number';

formatNumber(1234567.89); // '1,234,567.89'
formatNumber(1234567.89, 'hi-IN'); // '12,34,567.89'
formatNumber(1234567.89, 'de'); // '1.234.567,89'
formatNumber(1234567.89, { useGrouping: false }); // '1234567.89'

formatNumber(12.34, { style: 'percent' }); // '12.34%'
formatNumber(0.56, { style: 'percent' }, 'tr-TR'); // '%56'

// "12.3"
formatNumber(12.33, {
	maximumFractionDigits: 1,
	round: 'floor'
});

parseNumber('25 %', { style: 'percent' }); // 0.25
```

Finally, every language has its own rules for how words are pluralized. Some languages, such as Makonde, Igbo, and Lakota, have exactly one format regardless of count, while others have several. For example, English has exactly two formats ("1 thing", "all the things"), while Irish Gaelic uses different forms depending on whether one item, two items, three to six items, seven to ten items, or either zero or greater than ten items are being discussed. To allow the correct form to be determined programmatically, the Unicode CLDR Project has created six different categories to describe how languages handle pluralization: "zero", "one", "two", "few", "many", and "other". Dojo 2 provides the `pluralize` method and its corresponding factory method, `getPluralGenerator`, to determine which category a particular number belongs to for a given locale:

```typescript
// Assuming all relevant CLDR data have been loaded, and that the root locale is English.
import { switchLocale } from '@dojo/i18n/i18n';
import { pluralize } form '@dojo/i18n/pluralize';

pluralize(0); // other
pluralize(1); // one
pluralize(2); // other
pluralize(3); // other
pluralize(8); // other
pluralize(11); // other

// Change the locale to Irish
switchLocale('ga');

pluralize(0); // other
pluralize(1); // one
pluralize(2); // two
pluralize(3); // few
pluralize(8); // many
pluralize(11); // other
```

### Unit formatting

`@dojo/i18n/unit` exposes two methods that provide locale-specific unit formatting:

* `formatUnit`: formats a number for a specific unit, and delegates to [`Globalize.formatUnit`](https://github.com/globalizejs/globalize/blob/master/doc/api/unit/unit-formatter.md).
* `getUnitFormatter`: creates a factory that formats a number for a specific unit, and delegates to [`Globalize.unitFormatter`](https://github.com/globalizejs/globalize/blob/master/doc/api/unit/unit-formatter.md).

The list of possible units can be found in the [CLDR](https://github.com/unicode-cldr/cldr-units-full/blob/master/main/en/units.json).

```typescript
// Assuming all relevant CLDR data have been loaded
import { formatUnit } from '@dojo/i18n/unit';

formatUnit(1, 'speed-mile-per-hour'); // '1 mile per hour'
formatUnit(65, 'speed-mile-per-hour'); // '65 miles per hour'

formatUnit(1, 'foot', { form: 'long' }); // '1 foot'
formatUnit(5280, 'foot', { form: 'long' }); // '5,280 feet'
formatUnit(1, 'foot', { form: 'short' }); // '1 ft'
formatUnit(5280, 'foot', { form: 'short' }); // '5,280 ft'
formatUnit(1, 'foot', { form: 'narrow' }); // '1′'
formatUnit(5280, 'foot', { form: 'narrow' }); // '5,280′'
```

## Internationalization with `@dojo/widget-core`

While `@dojo/i18n` is designed to be an independent package, nearly every Dojo 2 application will have a view component. So [`@dojo/widget-core`](https://github.com/widget-core/) provides a custom mixin (`@dojo/widget-core/mixins/I18n`) to make working with `@dojo/i18n` more friendly. Widgets that have incorporated this mixin can localize message bundles by passing them to the `localizeBundle` method during rendering. If messages for the widget's locale have not been loaded yet, then the default messages are returned, and the widget is invalidated once the locale-specific messages have loaded. The object returned by the `localizeBundle` method contains all the messages, as well as a format method that takes a message key as well as any options. If message formatting is not required, then messages can be directly accessed (e.g., `messages.hello`).

In addition to the `localizeBundle` method, `@dojo/widget-core/mixins/I18n` introduces two properties: a boolean `rtl` property and a string `locale` property. The boolean `rtl` property determines whether the text decoration is right-to-left (`true`) or left-to-right(`false`: the default). The `locale` property specifies the locale used to determine which message translations are rendered. Since each widget can have its own distinct locale, it is possible to use multiple languages in the same application. If no `locale` property is included, widgets assume the root application locale (`i18n.locale`). Note, however, that since [Dojo 2 widgets are controlled](../../../tutorials/003_creating_widgets/), child widgets do not automatically inherit the locale from their parent. Child widgets must receive their locale data directly from their parent widgets or from an [injector](../../../tutorials/1010_containers_and_injecting_state/); otherwise, a child widget will use the application locale while its parent uses a custom locale.

```typescript
import I18nMixin, { I18nProperties } from '@dojo/widget-core/mixins/I18n';
import greetings from './nls/greetings';

export interface GreetingProperties extends I18nProperties {
	name: string;
}

const GreetingBase = I18nMixin(WidgetBase);
export default class Greeting extends GreetingBase<GreetingProperties> {
	render() {
		const messages = this.localizeBundle(greetings);
		const { name } = this.properties;
		const hello = messages.format('hello', { name });

		return v('p', [ hello ]);
	}
}
```

## The build process

Dojo 2 uses [webpack](https://webpack.js.org) to bundle applications. [Dojo 2's build](../../../tutorials/006_deploying_to_production/) is configured via a `.dojorc` at the project's root directory. `.dojorc` is a JSON file containing settings defined under specific namespaces. All build options are specified under the `build-app` namespace, and the following are specific to internationalization:

* `locale`: the default locale for the application
* `supportedLocales`: an optional array of additional locales to include in the build
* `cldrPaths`: an optional array of URLs for CLDR JSON to include in the build

The build ensures that the correct locale is set and all relevant CLDR data are loaded when the application starts. The user's locale will be used if it matches either the default locale or one of the supported locales; otherwise the default locale will be used. For example, if the user's locale is "fr-CA", then that locale will be used if either the default locale or one of the supported locales is either "fr-CA" or "fr".

To demonstrate what is required to set the root locale and bundle all CLDR data, suppose for our application that the default locale is English, but Spanish and French are also supported. Further, suppose that we need to support the ICU `MessageFormat`. All that is needed to guarantee the built application functions correctly are the following configuration settings:

```
// .dojorc
{
	"build-app": {
		"locale": "en",
		"supportedLocales": [ "es", "fr" ],
		"cldrPaths": [
			"cldr-data/supplemental/likelySubtags.json",
			"cldr-data/supplemental/plurals.json"
		]
	}
}
```

With this configuration, the `likelySubtags` and `plurals` JSON will be bundled with the application and passed to the i18n ecosystem at startup, and the application locale will be set to "en", "es", or "fr" depending on the system locale.

Finally, since locale-specific message translations are loaded either directly or lazily with `import()` or `require()` calls that webpack can parse, they will be included in the build with no extra effort. However, since it is not always desirable to include every possible translation in the main bundle, locale-specific messages can be separated into dedicated bundles by adding their paths to the generic `bundles` configuration option. `bundles` is an object whose keys represent bundle names and whose values are arrays of modules to include in a specific bundle. For example, continuing with the previous example, suppose we would prefer to place the Spanish and French translations in their own bundles. This would be accomplished as follows:

```
// .dojorc
{
	"build-app": {
		// ...
		bundles: {
			'es': [ 'src/nls/es/main' ],
			'fr': [ 'src/nls/fr/main' ]
		}
	}
}
```

Now, the Spanish and French translations will be bundled separately from the main application and loaded on demand.

## Conclusion

Internationalizing an application is not a simple task, and requires knowledge that not every developer has. While application developers must take the first step, Dojo 2 removes many of the barriers to creating a properly internationalized application, and therefore the uncertainty that an application may fail some of its users.
