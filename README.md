# meteor-mailchimp

A Meteor wrapper for the MailChimp API.


## Dependencies

 * [node-mailchimp](https://github.com/gomfunkel/node-mailchimp) - A node.js wrapper for the MailChimp API


## TL;DR;

_meteor-mailchimp_ exposes the following features of the MailChimp API to your Meteor application:

 * MailChimp API v2.0

Further information on the MailChimp API and its features is available at [https://github.com/gomfunkel/node-mailchimp](https://github.com/gomfunkel/node-mailchimp).


## Templates

_meteor-mailchimp_ also exposes one template you can use out of the box: `MailChimpListSubscribe`, which you can use to enable your visitors to subscribe to your mailing list(s).


## Installation

Install using [Meteorite](https://github.com/oortcloud/meteorite) - Installer & smart package manager for Meteor:

```sh
$ mrt add mailchimp
```

Use in your template:

```html
<div id="subscribeForm">
	{{> MailChimpListSubscribe}}
</div>
```

Put in your server's settings.json:

```javascript
{
	"MailChimpOptions": {
		"apiKey": "<Your MailChimp API Key>",
		"listId": "<ID of your default mailing list>"
	}
}
```

and start your server with:

```sh
meteor --settings settings.json
```
or

```sh
mrt --settings settings.json
```

## Usage

_MailChimp_ takes two arguments. The first argument is your API key, which you can find in your MailChimp Account. The second argument is an options object which can contain the following option:

 * `version` The API version to use. Defaults to 2.0.

All of the API categories and methods described in the MailChimp API v2.0 Documentation ([http://apidocs.mailchimp.com/api/2.0](http://apidocs.mailchimp.com/api/2.0)) are available in this wrapper **both on the server and the client**. To use them the method `call` is used which takes four parameters:

 * `section` The section of the API method to call (e.g. 'campaigns').
 * `method` The method to call in the given section.
 * `params` Parameters to pass to the API method.
 * `callback` Callback function for returned data or errors with two parameters. The first one being an error object which is null when no error occured, the second one an object with all information retrieved as long as no error occured.

Example:

```javascript
try {
	// You can as well pass different parameters on each call
	var mailchimp = new MailChimp( /* apiKey, { version : '2.0' } */ );

	mailchimp.call(
		'campaigns',
		'list',
		{
			start: 0,
			limit: 25
		},
		function ( error, result ) {
			if ( error ) {
				console.log( error.message );
			} else {
				console.log( JSON.stringify( result ) ); // Do something with your data!
			}
		}
	);

	mailchimp.call(
		'campaigns',
		'template-content',
		{
			cid: '/* CAMPAIGN ID */'
		},
		function ( error, result ) {
			if ( error ) {
				console.log( error.message );
			} else {
				console.log( JSON.stringify( result ) ); // Do something with your data!
			}
		}
	);
} catch ( error ) {
	console.log( error.message );
}
```

## Changelog

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

Copyright © 2014 [Miroslav Hibler](http://miro.hibler.me)

_meteor-mailchimp_ is licensed under the [**MIT**](http://miro.mit-license.org) license.

[![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/MiroHibler/meteor-mailchimp/trend.png)](https://bitdeli.com/free "Bitdeli Badge")
