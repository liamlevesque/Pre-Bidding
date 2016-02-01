$(function(){

	//ON LOAD ASSIGN A RANDOM BIDDER NUMBER
	user.bidder = "v" + getRandomInt(7000, 8000);
	user.spent = 0;



});

var user = {
		bidder : "v7005",
		limit: 1000000, 
		spent: 0,
		bid: 48500,
		message: '',
		audio: true,
		photos: true,
		cart: [],
	},
	headerController = {

		onDismissMSGClick: function(e, model){
			model.user.message = "";
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
	},5000);
}



/*********************
	FIREBASE
*********************/

var firebaseBids = new Firebase("https://sizzling-inferno-6912.firebaseio.com/bids");

function submitBid(bid){

	firebaseBids.update({
		lot: bid.lot,
		price: bid.price,
		bidder: bid.bidder,
		highBid: bid.highBid,
		sold: bid.sold
	})
	
}


firebaseBids.on("value", function(snapshot) {

	var bid = snapshot.val();

	//IF THIS LOT SOLD
	if(bid.sold){
		
		if(saleItem.bidder === user.bidder) return;
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



/********************************
	SWITCH WHICH LOT IS ACTIVE
*********************************/

function initializeLot(index){
	lotTable.currentLot = index + 1;
    
    lotInfo.currentLot = index; 

    saleItem.currentLot = index;

    controller.initSaleItem();
}

