var getSettingsValueFor = function ( key ) {
		if (
			Meteor.settings &&
			Meteor.settings.private &&
			Meteor.settings.private.MailChimp
		) {
			return Meteor.settings.private.MailChimp[key];
		}
	};

MailChimp = function ( apiKey, options ) {
	var mailChimpOptions = {
			'apiKey' : apiKey || getSettingsValueFor( 'apiKey' ),
			'options': options || {
				'version': '2.0'	// Living on The Edge ;)
			}
		},

		mailChimp;


	if ( !mailChimpOptions.apiKey || mailChimpOptions.apiKey === '' ) {
		console.error( '[MailChimp] Error: No API Key defined!' );

		throw new Meteor.Error(
			'1337',
			'No API Key defined',
			'Define your API Key either in settings.json file or in a method call'
		);
	}

	mailChimp = Npm.require( 'mailchimp' );

	this._asyncAPI = mailChimp.MailChimpAPI(
		mailChimpOptions.apiKey,
		mailChimpOptions.options
	);
};

MailChimp.prototype.call = function ( section, method, options ) {
	var wrapped = Meteor.wrapAsync( this._asyncAPI.call, this._asyncAPI ),
		result;

	try {
		result = wrapped( section, method, options );
	} catch ( error ) {
		// A workaround for:
		// https://github.com/meteor/meteor/issues/2774
		if ( !error.error ) {
			throw new Meteor.Error( error.code, error.message );
		} else {
			throw new Meteor.Error( error );
		}
	}

	return result;
};

Meteor.methods({
	'MailChimp': function ( clientOptions, section, method, options ) {
		check( clientOptions, Object );
		check( section, String );
		check( method, String );
		check( options, Object );

		var mailChimp;

		try {
			mailChimp = new MailChimp( clientOptions.apiKey, clientOptions.options );
		} catch ( error ) {
			throw new Meteor.Error( error.error, error.reason, error.details );
		}

		options = options || {};

		switch ( section ) {
			case 'lists':
				if ( !options.id || options.id === '' ) {
					options.id = getSettingsValueFor( 'listId' );
				}
				break;
			default:
		}

		return mailChimp.call( section, method, options );
	}
});
