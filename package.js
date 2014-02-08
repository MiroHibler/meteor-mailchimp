Package.describe({
	summary: 'A Meteor wrapper for MailChimp API'
});

Package.on_use(function ( api, where ) {

	api.use( ['templating'], 'client' );

	api.add_files( 'lib/server/mailchimp.js', 'server' );

	api.add_files( 'lib/client/views/subscribe/subscribe.html', 'client' );
	api.add_files( 'lib/client/views/subscribe/subscribe.js', 'client' );

	api.add_files( 'lib/client/mailchimp.js', 'client' );

	if ( api.export ) {
		api.export( 'MailChimpAPI', 'server' );
		api.export( 'MailChimp', ['server', 'client'] );
		api.export( 'MailChimpOptions', 'server' );
	}
});

Npm.depends({ 'mailchimp': '1.1.0' });
