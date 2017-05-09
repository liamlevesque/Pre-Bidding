var dataObject = {
		tsandCsVisible: false,
		flashErrorVisible: false,
		auctionStarted: true,
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
			dataObject.flashErrorVisible = !dataObject.flashErrorVisible;
		},

		toggleActiveSale: function(e){
			dataObject.auctionStarted = !dataObject.auctionStarted;
		},
	}; 

rivets.bind($('.js--body'),{
	dataObject: dataObject,
	controller: controller
}); 