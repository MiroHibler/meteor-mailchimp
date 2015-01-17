Package.describe({
	name    : 'miro:mailchimp',
	version : '1.0.4',
	summary : 'A Meteor wrapper for MailChimp API',
	homepage: "http://mailchimp.meteor.com",
	author  : "Miroslav Hibler (http://miro.hibler.me)",
	git     : 'https://github.com/MiroHibler/meteor-mailchimp.git'
});

Package.onUse( function ( api, where ) {

	api.versionsFrom('METEOR@0.9.2');

	api.use( ['templating'], 'client' );

	api.addFiles( 'lib/server/mailchimp.js', 'server' );

	api.addFiles([
		'lib/client/views/subscribe/subscribe.html',
		'lib/client/views/subscribe/subscribe.js',
		'lib/client/mailchimp.js'
	], 'client' );

	if ( api.export ) {
		api.export( 'MailChimp', ['server', 'client'] );
	}
});

Npm.depends({ 'mailchimp': '1.1.0' });
