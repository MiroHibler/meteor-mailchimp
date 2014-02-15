var mailchimp = Npm.require( 'mailchimp' );
var Future = Npm.require( 'fibers/future' );

MailChimpOptions = {
	'apiKey'	: '',		// Set this in Meteor.startup()!
	'options'	: {
		'version': '2.0'	// Living on The Edge ;)
	}
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
