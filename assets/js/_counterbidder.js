var counterbidderData = {
	    currentLot: null,
	    price: saleItem.price
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
			console.log(newBid);
			submitBid(newBid);
		},

		onLotClick: function(e, model){
			var newlot = {
				lot: $(e.currentTarget).data('lot'),
				source: user.bidder
			}

			submitLotChange(newlot);
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
			//console.log(newBid);
			submitBid(newBid);
		},

		onMessageClick: function(e, model){
			firebaseMsg.update({
				message = "This is the auctioneer's message - how do you like me now";
			})
		}

	}

rivets.bind($('.js--counter-bidder'),{
  counterbidderData: counterbidderData,
  counterbidder: counterbidder
});  