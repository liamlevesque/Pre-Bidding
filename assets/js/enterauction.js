var dataObject = {
		tsandCsVisible: false,
	},

	controller = {
		toggleTsandCsVisible: function(e) {
			dataObject.tsandCsVisible = !dataObject.tsandCsVisible;
		},
		stopPropagation: function(e){
			e.stopPropagation();
		},
		agreeToTerms: function(e){
			window.location = 'http://liamlevesque.github.io/Pre-Bidding/lot-preview-2.html'
		},
	};

rivets.bind($('.js--body'),{
	dataObject: dataObject,
	controller: controller
}); 