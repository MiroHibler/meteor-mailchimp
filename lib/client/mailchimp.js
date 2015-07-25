var subscribeMessage			= 'Get on the mailing list:',
	subscribeInvalidEmail		= 'Invalid email address :(',
	subscribeSubscribing		= 'Subscribing...',
	subscribeSuccess			= 'Oh joy! Check your inbox! :)',
	subscribeAlreadySubscribed	= 'Already subscribed! O.o',

	subscribeTitle,
	subscribeEmail,
	subscribeButton,

	showMessage = function ( message ) {
		if ( subscribeTitle ) {
			subscribeTitle.innerHTML = message;
		}
	},

	isValidEmailAddress = function ( emailAddress ) {
		// http://stackoverflow.com/a/46181/11236
		var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

		return re.test( emailAddress );
	},

	validateEmailAddress = function ( updateMessage ) {
		if ( subscribeEmail.value !== '' && isValidEmailAddress( subscribeEmail.value ) ) {
			subscribeButton.disabled = false;

			if ( updateMessage ) {
				showMessage( subscribeMessage );
			}
		} else {
			subscribeButton.disabled = true;

			if ( subscribeEmail.value !== '' ) {
				showMessage( subscribeInvalidEmail );
			} else if ( updateMessage ) {
				showMessage( subscribeMessage );
			}
		}
	},

	mailChimpListSubscribe = function ( email, listId ) {
		var mailChimp = new MailChimp( /* apiKey, options */ );

		mailChimp.call( 'lists', 'subscribe',
			{
				id   : listId,		// null -> defined @ server
				email: {
					email: email
				}
			},

			function ( error, result ) {
				if ( error ) {
					switch ( error.error ) {
						case 232:	// 'Email_NotExists'
							showMessage( subscribeInvalidEmail );
							break;

						case 214:	// 'List_AlreadySubscribed'
							showMessage( subscribeAlreadySubscribed );
							break;

						case 200:	// 'List_DoesNotExist'
							// We shouldn't be here!
							// Oh, well, continue to default...
						default:
							showMessage( 'Error: ' + error.reason );
					}

					console.error( '[MailChimp][Subscribe] Error: %o', error );

				} else {

					console.info( '[MailChimp][Subscribe] Yo, ' + subscribeEmail.value + ', ' + subscribeSuccess );
					console.info( '[MailChimp][Subscribe] Subscriber: %o', result );

					showMessage( subscribeSuccess );
				}

				subscribeEmail.disabled = false;
				validateEmailAddress( false );
			}
		);
	},

	subscribeGo = function ( eventBubbling ) {
		subscribeEmail.disabled  = true;
		subscribeButton.disabled = true;

		showMessage( subscribeSubscribing );

		mailChimpListSubscribe( subscribeEmail.value );

		// Prevent Event Bubbling
		return eventBubbling;
	};

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

Meteor.startup( function () {
	if ( Blaze.isTemplate( Template[ 'MailChimpListSubscribe' ] ) ) {
		Template.MailChimpListSubscribe.rendered = function () {
			subscribeTitle  = this.find( '.mailchimp-message' );
			subscribeEmail  = this.find( '.mailchimp-email' );
			subscribeButton = this.find( '.mailchimp-subscribe' );
			subscribeButton.disabled = ( subscribeEmail.value === '' );
		};

		Template.MailChimpListSubscribe.helpers({
			message: function () {
				subscribeMessage = this.title || subscribeMessage;

				return subscribeMessage;
			}
		});

		Template.MailChimpListSubscribe.events({
			'focus .mailchimp-email, paste .mailchimp-email, cut .mailchimp-email': function ( e ) {
				Meteor.setTimeout( function ( e ) {
					validateEmailAddress( true );
				}, 0 );
			},

			'keyup .mailchimp-email': function ( e ) {
				var key = e.which || e.keyCode || e.charCode;

				if (
					key === 8 ||				// [Backspace]
					key === 46					// [Delete]
				) {
					Meteor.setTimeout( function () {
						validateEmailAddress( true );
					}, 0 );
				}
			},

			'keypress .mailchimp-email': function ( e ) {
				var key = e.which || e.keyCode || e.charCode;

				Meteor.setTimeout( function () {
					validateEmailAddress( true );

					if ( isValidEmailAddress( subscribeEmail.value  ) ) {
						if ( key === 13	) {		// [Return]
							subscribeGo( true );
						}
					}
				}, 0 );
			},

			'click .mailchimp-subscribe': function ( e ) {
				validateEmailAddress( true );

				if ( isValidEmailAddress( subscribeEmail.value  ) ) {
					subscribeGo( false );
				}
			}
		});
	}
});
