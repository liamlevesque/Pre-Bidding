$(function(){


});


var dataObject = {
		email: null,
		validEmail: false,
		emailError: false,
		submitSuccess: false,
		cantRemember: false,
		showGlobalContactInfo: false,
	};

var controller = {
		emailInput: function(e){
			dataObject.validEmail = ($(e.currentTarget).val().length > 0) ? true : false;
		},

		send: function(e){
			if(!dataObject.emailError) dataObject.emailError = true;
			else{
				dataObject.submitSuccess = true;
				dataObject.emailError = false;
				dataObject.email = null;
			}
		},

		toggleCantRemember: function(e){
			dataObject.cantRemember = !dataObject.cantRemember;
		},

		toggleGlobalContactInfo: function(e){
			dataObject.showGlobalContactInfo = !dataObject.showGlobalContactInfo;
		},

		hideSuccess: function(e){
			dataObject.submitSuccess = false;
		},

		stopPropagation: function(e){
			e.stopPropagation();
		},
	};


var binding = rivets.bind($('.js--data-area'),{
		dataObject: dataObject,
		controller : controller
	}); 