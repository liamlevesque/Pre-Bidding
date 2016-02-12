/*********************
	FIREBASE
*********************/

var firebase = new Firebase("https://sizzling-inferno-6912.firebaseio.com/"),

	dataController = {
		submitBid: function(isSold){

			var bid = {
				source: user.bidder,
				lot: saleItem.currentLot,
				price: saleItem.price,
				bidder: saleItem.bidder,
				highBid: saleItem.highBid,
				sold: isSold
			};

			dataController.sendBid(bid);
			
		},

		submitCounterBid: function(bid){
			dataController.sendBid(bid);
		},

		sendBid: function(bid){
			if(!bid.highBid) bid.highBid = null;

			firebase.child("bids").update({
				source: bid.source,
				lot: bid.lot,
				price: bid.price,
				bidder: bid.bidder,
				highBid: bid.highBid,
				sold: bid.sold
			})
		},

		clearMessage: function(){
			firebase.child("message").update({
				message : ""
			})
		},

		submitLotChange: function(newlot){
			firebase.child("lot").update({
				lot: newlot.lot,
				source: newlot.source
			}) 
		}
	}

/*************************
	HANDLE BIDS
*************************/

firebase.child("bids").on("value", function(snapshot) {

	controller.incomingBid(snapshot);

});


/****************************************
	HANDLE SENDING AUCITONEER'S MESSAGE
****************************************/

firebase.child("message").on("value", function(snapshot) {

	var message = snapshot.val();
	user.message = message.message;
	
});




/*************************
	HANDLE LOT CHANGES
*************************/

firebase.child("lot").on("value", function(snapshot) {
	var lotchange = snapshot.val();

	//MAKE SURE YOU DIDN'T INITIATE THE LOT CHANGE
	if(lotchange.source === user.bidder) return;
	
	controller.initSaleItem(lotchange.lot);
});





/*********************
	INTERCOM
*********************/
// var intercom = Intercom.getInstance();

// intercom.on('newbid', function(data) {
	
// 	//IF A BID COMES IN, BUT I HAVE A HIGHER PREBID
// 	if(saleItem.prebid >= data.price && data.bidder != user.bidder){ 
// 		//UPDATE THE ITEM WITH THE HIGH BID SUBMITTED BY THE OTHER BIDDER
// 		saleItem.highBid = data.highBid;
// 		saleItem.price = data.price;
		
// 		//THEN PLACE MY COUNTER BID AUTOMATICALLY
// 		controller.placeBid();
// 		return;
// 	}

// 	//ELSE IF I WAS THE HIGH BIDDER AND THE NEW BIDDER ISN'T ME, SHOW OUTBID NOTIFICATION
// 	else if(saleItem.bidder === user.bidder && data.bidder != user.bidder) outBid();
	
//     //IF I'M BIDDING AND I'M IN ANOTHER STATE (WAITING, ETC)
//     if(saleItem.bidstatus != 'disabled' && user.bidder != data.bidder) saleItem.bidstatus = 'active';
	
// 	//SET THE BIDDER TO THE NEW BID VALUES
// 	saleItem.bidder = data.bidder;
// 	saleItem.highBid = data.highBid;
// 	saleItem.price = data.price;

// 	controller.updatePrice();
// });

// intercom.on('sold',function(data){
// 	if(saleItem.bidder === user.bidder) return;
	
// 	controller.sellItem();
// });








