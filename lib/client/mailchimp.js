MailChimp = function ( apiKey, options ) {
	this._options = {
		apiKey : ( apiKey ) ? apiKey : Session.get( 'MailChimp.apiKey' ),
		options: options
	};
};

MailChimp.prototype.call = function ( section, method, options, callback ) {
	var mailChimpOptions = _.defaults( {}, options );

	switch ( section ) {
		case 'lists':
			if ( !mailChimpOptions.id || mailChimpOptions.id === '' ) {
				mailChimpOptions.id = Session.get( 'MailChimp.lists.listId' );
			}

			break;
		default:
	}

	Meteor.call( 'MailChimp',
		this._options,
		section,
		method,
		mailChimpOptions,
		callback
	);
};
