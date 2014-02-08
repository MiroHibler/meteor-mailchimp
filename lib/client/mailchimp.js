MailChimp = function( apiKey, options ) {
	this._options = {
		apiKey: apiKey,
		options: options
	};
}

MailChimp.prototype.call = function( section, method, options, callback ) {
	Meteor.call( 'MailChimp', this._options, section, method, options, function ( error, result ) {
		callback( error, result );
	});
}
