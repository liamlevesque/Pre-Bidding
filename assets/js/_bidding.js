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

	controller.updatePrice(saleItem);
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
		"financeRate" : 5,
		"financePeriod" : 48,
		"payment" : 100,
		"bidactive" : false,
		"bidstatus" : 'disabled'
	},

	controller = {

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
					model.saleItem.bidder = user.bidder;
					model.saleItem.highBid = model.saleItem.price;
					model.saleItem.price += 500;

					intercom.emit('newbid', {
						price: model.saleItem.price,
						bidder: model.saleItem.bidder,
						highBid: model.saleItem.highBid
					});
					
					setTimeout(function(){
						model.saleItem.bidstatus = 'accepted';
					},1000);

					controller.updatePrice(model.saleItem);

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

	    onOutBid: function(e, model){
	    	outBid();
	    },

	    updatePrice: function(){
	    	ccyconversion.conversion = saleItem.price * ccyconversion.rate;
	    	finance.payment = financingCalculation();
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





