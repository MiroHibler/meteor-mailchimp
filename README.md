# miro:mailchimp

A Meteor wrapper for the MailChimp API.

See also these wrappers:

 * [MailChimp Lists](https://github.com/MiroHibler/meteor-mailchimp-lists)
 * [MailChimp Campaigns](https://github.com/MiroHibler/meteor-mailchimp-campaigns)


## Dependencies

 * [node-mailchimp](https://github.com/gomfunkel/node-mailchimp) - A node.js
wrapper for the MailChimp API


## TL;DR;

_miro:mailchimp_ provides [MailChimp API v2.0](http://apidocs.mailchimp.com/api/2.0)
(**v3.0 not ready yet!**) features to your Meteor application.


## Installation

Install using Meteor:

```sh
meteor add miro:mailchimp
```

## Quick Start

> **NOTE:** starting with v1.1.0 the template `MailChimpListSubscribe` is NOT
> included in the package anymore BUT the template helpers and event handlers ARE!
> In other words, you can copy the old template from the example folder within
> the package or copy it from here,...

```html
<!-- Bootstrap example -->
<template name="MailChimpListSubscribe">
	<form class="form-inline">
	{{#if message}}
		<p class="mailchimp-message">{{{message}}}</p>
	{{/if}}
		<div class="form-group">
			<input class="mailchimp-email form-control" type="email" placeholder="email@example.com"/>
			<input type="submit" value="Subscribe" class="mailchimp-subscribe btn btn-success" />
		</div>
	</form>
</template>
```

> ...include it in your code and customize it as you wish; it will be
> inherently functional as long as its name remains `MailChimpListSubscribe` and
> it contains all template expressions and CSS classes (apart from bootstrap ones,
> of course) as the original example has.

Include it in some other template as needed:

```html
<div id="subscribeForm">
	{{> MailChimpListSubscribe}}
</div>
```

Finally, put in your server's settings.json:

```javascript
{
	"private": {
		"MailChimp": {
			"apiKey": "<Your MailChimp API Key>",
			"listId": "<ID of your default mailing list>"
		}
	}
}
```

and start your server with:

```sh
meteor --settings=settings.json
```

## API

_MailChimp_ takes two arguments. The first argument is your API key, which you
can find in your MailChimp Account. The second argument is an options object
which can contain the following option:

 * `version` The API version to use. Defaults to 2.0.

All of the API categories and methods described in the [MailChimp API v2.0
Documentation](http://apidocs.mailchimp.com/api/2.0) are available in this
wrapper **both server- and client-side**.

To use them, the method `call` is used which takes four parameters:

 * `section` The section of the API method to call (e.g. 'campaigns').
 * `method` The method to call in the given section.
 * `params` Parameters to pass to the API method.
 * `callback` (_optional server-side, required client-side_) Callback function for
returned data or errors with two parameters. The first one being an error object
which is null when no error occured, the second one an object with all
information retrieved as long as no error occured.

> **_NOTE:_** If `callback` is ommited server-side, the method runs
"[synchronously](https://www.discovermeteor.com/blog/wrapping-npm-packages/)" via `Meteor.wrapAsync` method.


## Examples

### Callback, server-side/client-side

```javascript
// You can as well pass different parameters on each call
var mailChimp = new MailChimp( /* apiKey, { version: '2.0' } */ );

mailChimp.call( 'campaigns', 'list', {
		start: 0,
		limit: 25
	},
	// Callback beauty in action
	function ( error, result ) {
		if ( error ) {
			console.error( '[MailChimp][Campaigns][List] Error: %o', error );
		} else {
			// Do something with your data!
			console.info( '[MailChimp][Campaigns][List]: %o', result );
		}
	}
);
```

### wrapAsync, server-side ONLY

```javascript
// You can as well pass different parameters on each call
var mailChimp = new MailChimp( /* apiKey, { version: '2.0' } */ );

var result = mailChimp.call( 'campaigns', 'list', {
	start: 0,
	limit: 25
});

// Do something with your data!
console.info( '[MailChimp][Campaigns][List]: %o', result );
```

## Changelog

### v1.1.0
 * Removed subscribe template (moved to example folder) so it can be customized
 * Some bug fixes

### v1.0.4
 * Reinstated server-side callback in case someone still wants to use it instead
of `Meteor.wrapAsync` method (#19)
 * Updated documentation (README.md)

### v1.0.3
 * Fixed bug with `Meteor.wrapAsync` not returning real error (#16)
 * Fixed bug with `audit-argument-checks` package throwing 'Did not check()' error (#15)

### v1.0.2
 * Bumped version number

### v1.0.1
 * README.md fix

### v1.0.0
 * Update to Meteor v1.0
 * Bug fixes
 * Cleanup

### v0.4.2
 * Fixed typo in README.md

### v0.4.1
 * Updated README.md to reflect changes in v0.4.0

### v0.4.0
 * Introduce settings.json for MailChimpOptions
 * If already subscribed show different message then success message

### v0.3.0
 * Enable submit with return key

### v0.2.0
 * On client, MailChimp.call() now reads API Key from session variable 'MailChimpOptions.apiKey' as well

### v0.1.0
 * Initial release

## Copyright and license

Copyright © 2014-1015 [Miroslav Hibler](http://miro.hibler.me)

_miro:mailchimp_ is licensed under the [**MIT**](http://miro.mit-license.org) license.
