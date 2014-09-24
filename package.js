Package.describe({
	name: 'meteor-mailchimp',
	version: '0.4.3',
	summary: 'A Meteor wrapper for MailChimp API'
});

Package.onUse(function ( api, where ) {

	api.use( ['templating'], 'client' );

	api.addFiles( 'lib/server/mailchimp.js', 'server' );

	api.addFiles([
		'lib/client/views/subscribe/subscribe.html',
		'lib/client/views/subscribe/subscribe.js',
		'lib/client/mailchimp.js'
	], 'client' );

	if ( api.export ) {
		api.export( 'MailChimpAPI', 'server' );
		api.export( 'MailChimp', ['server', 'client'] );
		api.export( 'MailChimpOptions', 'server' );
	}
});

Npm.depends({ 'mailchimp': '1.1.0' });
