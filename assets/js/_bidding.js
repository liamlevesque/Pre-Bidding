$(function(){

});

function bounceActivateButton(){
	$('.js--activate-container').addClass('s-bounce');
	setTimeout(function(){
		$('.js--activate-container').removeClass('s-bounce');
	},400);
}

function outBid(){
	if(saleItem.bidder === user.bidder){
		saleItem.bidstatus = 'active';
		notifyOutbid();
	}

	saleItem.prebid = 0;

	controller.updatePrice();
}

function notifyOutbid(){
	$('.js--outbid').addClass('s-visible');
	setTimeout(function(){
		$('.js--outbid').removeClass('s-visible');
	},5000);
}

var saleItem = {
		"price" : 25500,
		"highBid" : 25000,
		"bidder" : '10005',
		"prebid" : 0,
		"financeRate" : 5,
		"financePeriod" : 48,
		"payment" : 100,
		"bidactive" : false,
		"bidstatus" : 'disabled',
	},

	controller = {
		initSaleItem: function(){
			var currentItem = lotTable.lotList[lotTable.currentLot-1];
			
			saleItem.price = currentItem.openPrice;
			saleItem.highBid = null;
			saleItem.bidder = null;
			saleItem.bidactive = false;
			saleItem.bidstatus = 'disabled';
			saleItem.prebid = 0;
			
			//IF YOU'VE PLACED A PREBID ON THIS, THEN DON'T ALLOW TO BID UNTIL AMT PASSED
			if(currentItem.bid > 0 && currentItem.bid > currentItem.openPrice){
				saleItem.prebid = currentItem.bid;
				saleItem.bidactive = true;
				saleItem.bidstatus = 'active';
				saleItem.bidder = user.bidder;
				saleItem.highBid = saleItem.price;
				saleItem.price += 500;

				controller.emitBid();
			}

			//console.log(saleItem.price);
		},

		onActivateClick: function(e, model) {
			model.saleItem.bidactive = !model.saleItem.bidactive;
			if(model.saleItem.bidactive) model.saleItem.bidstatus = "active";
			else model.saleItem.bidstatus = "disabled";

	    },

	    onBidClick: function(e, model){
	    	if(!model.saleItem.bidactive){ 
	    		//IF BIDDING ISN'T ACTIVATED, MAKE IT OBVIOUS YOU NEED TO CLICK TO ACTIVATE
	    		bounceActivateButton();
	    		return;
	    	}

	    	switch (model.saleItem.bidstatus){
	    		case 'active':
					model.saleItem.bidstatus = 'waiting';

					setTimeout(function(){
						model.saleItem.bidstatus = 'accepted';
						controller.placeBid();
					},1000);

					break;

				case 'waiting':
					model.saleItem.bidstatus = 'accepted';
					break;

				case 'accepted':
					model.saleItem.bidstatus = 'soldYou';
					break;

				case 'soldYou':
					model.saleItem.bidstatus = 'soldOther';
					break;

				case 'soldOther':
					model.saleItem.bidstatus = 'active';

				default:
					model.saleItem.bidstatus = 'active';
					break;
	    	}

	    },

	    placeBid: function(){
	    	saleItem.bidder = user.bidder;
			saleItem.highBid = saleItem.price;
			saleItem.price += 500;

			controller.emitBid();

			controller.updatePrice();

			//console.log(saleItem.price);
	    },

	    emitBid: function(){
	    	console.log(saleItem.price);

	    	intercom.emit('newbid', {
				price: saleItem.price,
				bidder: saleItem.bidder,
				highBid: saleItem.highBid
			});
	    },

	    onOutBid: function(e, model){
	    	outBid();
	    },

	    updatePrice: function(){
	    	ccyconversion.conversion = saleItem.price * ccyconversion.rate;
	    	finance.payment = financingCalculation();
	    },

	    onSellClick: function(){
	    	intercom.emit('sold', {});
	    	//IF YOU WON THE LOT, SHOW THE RIGHT MESSAGE
	    	controller.sellItem();
	    },

	    sellItem: function(){
	    	saleItem.bidstatus = (saleItem.bidder === user.bidder)? 'soldYou': 'soldOther';

			lotTable.lotList[lotTable.currentLot-1].soldPrice = saleItem.price;

			setTimeout(function(){
				//MOVE ON TO THE NEXT LOT AFTER 2 SECONDS
				initializeLot(lotTable.currentLot++);
			},2000);
	    }

	};

rivets.binders.bidstate = function(el, value) {
	$(el).removeClass().addClass('bidding--bid-button');

	switch (value){
		case 'disabled':
			$(el).addClass('s-disabled');
			break;	

		case 'waiting':
			$(el).addClass('s-waiting');
			break;

		case 'accepted':
			$(el).addClass('s-accepted');
			break;			

		case 'soldYou':
			$(el).addClass('s-sold-won');
			break;

		case 'soldOther':
			$(el).addClass('s-sold-lost');
			break;

		default:
			$(el).addClass('s-active');
			break;
	}
}

rivets.bind($('.js--bidding-area'),{
	saleItem: saleItem,
	controller: controller
});





