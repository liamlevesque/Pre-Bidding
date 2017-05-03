var dataObject = {
		tsandCsVisible: false,
		flashErrorVisible: false,
	},

	controller = {
		toggleTsandCsVisible: function(e) {
			dataObject.tsandCsVisible = !dataObject.tsandCsVisible;
		},
		stopPropagation: function(e){
			e.stopPropagation();
		},
		enterAuction: function(e){
			window.location = 'http://liamlevesque.github.io/Pre-Bidding/lot-preview-2.html'
		},

		toggleFlashErrorVisible: function(e){
			console.log('test');
			dataObject.flashErrorVisible = !dataObject.flashErrorVisible;
		},
	}; 

rivets.bind($('.js--body'),{
	dataObject: dataObject,
	controller: controller
}); 