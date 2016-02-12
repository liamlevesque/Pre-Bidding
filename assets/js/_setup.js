$(function(){

	//ON LOAD ASSIGN A RANDOM BIDDER NUMBER
	user.bidder = "v" + getRandomInt(7000, 8000);
	user.spent = 0;

	submitLotChange({lot: 0,source: user.bidder});

});

var user = {
		bidder : "v7005",
		limit: 1000000, 
		spent: 0,
		bid: 0,
		message: '',
		audio: true,
		photos: true,
		cart: [],
	},
	headerController = {

		onDismissMSGClick: function(e, model){
			model.user.message = "";
			clearMessage();
		},

		generateMessage: function(msg){
			user.message = msg;
		},

		addToCart: function(lot){
			user.cart.push(lot);
			user.spent += lot.soldPrice;
			user.bid -= lot.bid;

			sortList(user.cart);
		},

		alertWon: function(obj){
			if(obj.length > 0){
				wonItems.listlength = obj.length;
			}	
			else{
				wonItems.wonItem = obj;
			} 
			loadConfirmModal();
		},

		onToggleCartClick: function(){
			$('.js--cart').toggleClass('s-visible');
		}

	};



rivets.bind($('.js--header'),{
	user: user,
	headerController: headerController
});


var confirmModal,
	wonItems = {
		listlength: 0,
		wonItem: {}
	},
	confirmationController = {
		onDismissClick: function(e, model){
			$('.js--header .js-confirm-object').removeClass('s-active');
			confirmationController.destroyConfirmation();
		},

		destroyConfirmation: function(){
			setTimeout(function(){
				confirmModal.unbind();
				$('.js--header .js-confirm-object').remove();
				wonItems.listlength = 0;
				wonItems.wonItem = {};
			},500);
		}
	}


function loadConfirmModal(){
	$('.js-confirm-object').clone().appendTo('.js--header');

	confirmModal = rivets.bind($('.js--header .js-confirm-object'),{
		wonItems: wonItems,
		confirmationController: confirmationController
	});

	setTimeout(function(){
		$('.js--header .js-confirm-object').addClass('s-active');
	},100);

	setTimeout(function(){
		$('.js--header .js-confirm-object').removeClass('s-active');
		confirmationController.destroyConfirmation();
	},2000);
}



/*********************
	FIREBASE
*********************/

var firebaseBids = new Firebase("https://sizzling-inferno-6912.firebaseio.com/bids");


function submitBid(bid){

	if(!bid.highBid) bid.highBid = null;
	console.log('love');

	firebaseBids.update({
		source: bid.source,
		lot: bid.lot,
		price: bid.price,
		bidder: bid.bidder,
		highBid: bid.highBid,
		sold: bid.sold
	})
	
}

var firebaseMsg = new Firebase("https://sizzling-inferno-6912.firebaseio.com/message");

firebaseMsg.on("value", function(snapshot) {

	var message = snapshot.val();
	user.message = message.message;
});

function clearMessage(){
	firebaseMsg.update({
		message : ""
	})
}

var firebaseLot = new Firebase("https://sizzling-inferno-6912.firebaseio.com/lot");

function submitLotChange(newlot){
	firebaseLot.update({
		lot: newlot.lot,
		source: newlot.source
	}) 
}

firebaseLot.on("value", function(snapshot) {

	var lotchange = snapshot.val();
	if(lotchange.source === user.bidder) return;
	initializeLot(lotchange.lot);
});


firebaseBids.on("value", function(snapshot) {

	if(group.isOpenOffers) return;

	var bid = snapshot.val();

	//IF THIS LOT SOLD
	if(bid.sold){
		if(bid.source === user.bidder) return;
		controller.sellItem();
	}


	//OTHERWISE
	else{

		//IF A BID COMES IN, BUT I HAVE A HIGHER PREBID
		if(saleItem.prebid >= bid.price && bid.bidder != user.bidder){ 
			//UPDATE THE ITEM WITH THE HIGH BID SUBMITTED BY THE OTHER BIDDER
			saleItem.highBid = bid.highBid;
			saleItem.price = bid.price;
			
			//THEN PLACE MY COUNTER BID AUTOMATICALLY
			controller.placeBid();
			return;
		}

		//ELSE IF I WAS THE HIGH BIDDER AND THE NEW BIDDER ISN'T ME, SHOW OUTBID NOTIFICATION
		else if(saleItem.bidder === user.bidder && bid.bidder != user.bidder) outBid();

		//IF I'M BIDDING AND I'M IN ANOTHER STATE (WAITING, ETC)
	    if(saleItem.bidstatus != 'disabled' && user.bidder != bid.bidder) saleItem.bidstatus = 'active';
		
		//SET THE BIDDER TO THE NEW BID VALUES
		saleItem.bidder = bid.bidder;
		saleItem.highBid = bid.highBid;
		saleItem.price = bid.price;

		controller.updatePrice();

		//COUNTER BIDDER
		counterbidderData.price = bid.price;
	}

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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}



