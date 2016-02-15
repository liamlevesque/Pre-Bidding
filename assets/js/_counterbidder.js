var counterbidderData = {
	    currentLot: 1,
	    price: saleItem.price,
	    highBid: saleItem.highBid
	},
	counterbidder = {
		onBidClick: function(e, model){
			if(!saleItem.highBid) saleItem.highBid = 9500;

			var newBid = {
				source: '10005',
				lot: saleItem.currentLot,
				price: saleItem.price + 500,
				bidder: '10005',
				highBid: saleItem.highBid + 500,
				sold: false
			};

			dataController.submitCounterBid(newBid);
		},

		onLotClick: function(e, model){
			var newlot = {
				lot: $(e.currentTarget).data('lot'),
				source: user.bidder
			}

			counterbidderData.currentLot = newlot.lot + 1;

			dataController.submitLotChange(newlot);
		},

		onSellClick: function(e, model){
			var newBid = {
				source: '10005',
				lot: saleItem.currentLot,
				price: saleItem.price,
				bidder: saleItem.bidder,
				highBid: saleItem.highBid,
				sold: true
			};

			counterbidderData.currentLot = newBid.lot + 1;

			dataController.submitCounterBid(newBid);
		},

		onMessageClick: function(e, model){
			firebaseMsg.update({
				message : "This is the auctioneer's message - how do you like me now"
			})
		}

	}

rivets.bind($('.js--counter-bidder'),{
  counterbidderData: counterbidderData,
  counterbidder: counterbidder
});  