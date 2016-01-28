$(function(){

	//ON LOAD ASSIGN A RANDOM BIDDER NUMBER
	user.bidder = "v" + getRandomInt(7000, 8000);


});

var user = {
		bidder : "v7005",
		limit: 1000000, 
		spent: 65000,
		bid: 48500,
		message: '',
	},
	headerController = {

		onDismissMSGClick: function(e, model){
			model.user.message = "";
		},

		generateMessage: function(msg){
			user.message = msg;
		}

	};




rivets.bind($('.js--header'),{
	user: user,
	headerController: headerController
});


/*********************
	INTERCOM
*********************/
var intercom = Intercom.getInstance();

intercom.on('newbid', function(data) {
	
	//IF A BID COMES IN, BUT I HAVE A HIGHER PREBID
	if(saleItem.prebid >= data.price && data.bidder != user.bidder){ 
		//UPDATE THE ITEM WITH THE HIGH BID SUBMITTED BY THE OTHER BIDDER
		saleItem.highBid = data.highBid;
		saleItem.price = data.price;
		
		//THEN PLACE MY COUNTER BID AUTOMATICALLY
		controller.placeBid();
		return;
	}

	//ELSE IF I WAS THE HIGH BIDDER AND THE NEW BIDDER ISN'T ME, SHOW OUTBID NOTIFICATION
	else if(saleItem.bidder === user.bidder && data.bidder != user.bidder) outBid();
	
    //IF I'M BIDDING AND I'M IN ANOTHER STATE (WAITING, ETC)
    if(saleItem.bidstatus != 'disabled' && user.bidder != data.bidder) saleItem.bidstatus = 'active';
	
	//SET THE BIDDER TO THE NEW BID VALUES
	saleItem.bidder = data.bidder;
	saleItem.highBid = data.highBid;
	saleItem.price = data.price;

	controller.updatePrice();
});

intercom.on('sold',function(data){
	if(saleItem.bidder === user.bidder) return;
	
	controller.sellItem();
});

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

