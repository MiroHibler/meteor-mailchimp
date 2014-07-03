var mailchimp = Npm.require( 'mailchimp' );
var Future = Npm.require( 'fibers/future' );

MailChimpOptions = {
	'apiKey'	: '',		// Set this in
	'listId'	: '',		// settings.json file!
	'options'	: {
		'version': '2.0'	// Living on The Edge ;)
	}
}

if ( Meteor.settings && Meteor.settings.MailChimpOptions !== undefined &&
	Meteor.settings.MailChimpOptions.apiKey !== undefined &&
	Meteor.settings.MailChimpOptions.listId !== undefined ) {

	MailChimpOptions.apiKey = Meteor.settings.MailChimpOptions.apiKey;
	MailChimpOptions.listId = Meteor.settings.MailChimpOptions.listId;
} else {
	console.log( '[MailChimp] Error: MailChimp Options have not been set in your settings.json file.' );
}

MailChimp = function( apiKey, options ) {
	this.asyncAPI = mailchimp.MailChimpAPI(
		( apiKey )	? apiKey	: MailChimpOptions.apiKey,
		( options )	? options	: MailChimpOptions.options
	);
}

MailChimp.prototype.call = function( section, method, options, callback ) {
	this.asyncAPI.call( section, method, options, function( error, result ) {
		if ( error ) {
			console.log( '[MailChimp] Error: ' + error.code + ' - ' + error.message );
		}
		callback( error, result );
	});
}

Meteor.methods({
	'MailChimp': function ( clientOptions, section, method, options ) {
		switch ( section ) {
			case 'lists':
				if ( !options.id || options.id === "" ) {
					options.id = MailChimpOptions.listId;
				}
				break;
			default:
		}

		try {
			var mailChimp = new MailChimp( clientOptions.apiKey, clientOptions.options );
		} catch ( error ) {
			throw new Meteor.Error( error.error, error.reason, error.details );
		}

		var future = new Future();
		mailChimp.call( section, method, options, function ( error, result ) {
			if ( error ) {
				// Pass the original MailChimpAPI Error to the client
				future.throw( new Meteor.Error( error.code, error.message ) );
			} else {
				future.return( result );
			}
		});
		return future.wait();
	}
});
