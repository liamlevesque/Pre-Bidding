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

/********************************
	SWITCH WHICH LOT IS ACTIVE
*********************************/

function initializeLot(index){
	lotTable.currentLot = index + 1;
    
    lotInfo.currentLot = index; 

    saleItem.currentLot = index;

    controller.initSaleItem();
}



var saleItem = {
		"price" : null,
		"highBid" : null,
		"bidder" : '10005',
		"prebid" : 0,
		"financeRate" : 5,
		"financePeriod" : 48,
		"payment" : 100,
		"bidactive" : false,
		"bidstatus" : 'disabled',
		"currentLot" : null,
		"isgroup":false,
		"openOffersList": []
	},

	controller = {
		initSaleItem: function(){
			var currentItem = lotTable.lotList[lotTable.currentLot-1],
				currentGroup = currentItem.group;
			
			saleItem.currentLot = lotTable.currentLot;
			saleItem.price = currentItem.openPrice;
			saleItem.highBid = null;
			saleItem.bidder = null;
			saleItem.bidactive = false;
			saleItem.bidstatus = 'disabled';
			saleItem.prebid = 0;

			var newBid = {
				source: user.bidder,
				lot: saleItem.currentLot,
				price: saleItem.price,
				bidder: saleItem.bidder,
				highBid: saleItem.highBid,
				sold: false
			};

			submitBid(newBid);

			//IF THIS IS PART OF A BIDDING GROUP AND WE'VE NOT INITIALIZED THIS GROUP, INITALIZE THAT
			if(currentGroup > 0 && group.groupnumber != currentGroup){
				
				groupController.initializeGroup(currentGroup);
				saleItem.isgroup = true;

			}
			else if(currentGroup === 0){ 
				saleItem.isgroup = false;
				groupController.destroyGroup();
			}
			
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
		},

		onActivateClick: function(e, model) {
			controller.activateBidding(model.saleItem.currentLot, model.saleItem.bidactive);
	    },

	    activateBidding: function(targetLot, status){
	    	saleItem.currentLot = targetLot;
	    	saleItem.bidactive = status;
			saleItem.bidstatus = (status)? "active" : "disabled";
	    },

	    onBidClick: function(e, model){
	    	if(!model.saleItem.bidactive){ 
	    		//IF BIDDING ISN'T ACTIVATED, MAKE IT OBVIOUS YOU NEED TO CLICK TO ACTIVATE
	    		bounceActivateButton();
	    		return;
	    	}

	    	switch (model.saleItem.bidstatus){
	    		case 'open-offer':
	    			model.saleItem.bidstatus = 'waiting';

					setTimeout(function(){
						model.saleItem.bidstatus = 'soldYou';
						controller.sellItem();
					},1000);
	    			break;

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
	    },

	    emitBid: function(){
	    	//intercom.emit('newbid', {
			
			var newBid = {
				source: user.bidder,
				lot: saleItem.currentLot,
				price: saleItem.price,
				bidder: saleItem.bidder,
				highBid: saleItem.highBid,
				sold: false
			};
			//});

			submitBid(newBid);
	    },

	    onOutBid: function(e, model){
	    	outBid();
	    },

	    updatePrice: function(){
	    	ccyconversion.conversion = saleItem.price * ccyconversion.rate;
	    	finance.payment = financingCalculation();
	    },

	    onSellClick: function(){
	    	//intercom.emit('sold', {});
	    	var newBid = {
	    		source: user.bidder,
	    		lot: saleItem.currentLot,
				price: saleItem.price,
				bidder: saleItem.bidder,
				highBid: saleItem.highBid,
				sold: true
			};
			
			submitBid(newBid);
	    	//IF YOU WON THE LOT, SHOW THE RIGHT MESSAGE
	    	controller.sellItem();
	    },

	    sellItem: function(){
	    	var youwin = (saleItem.bidder === user.bidder)? true : false;

	    	saleItem.bidstatus = (youwin)? 'soldYou': 'soldOther';

	    	//IF WE WERE IN OPEN OFFERS
			if(saleItem.isgroup && saleItem.openOffersList.length > 0){
	    		var allSold = true;

	    		//SET SOLD PRICE FOR LOTS PURCHASED AND ADD TO CART
	    		for(var i =0; i < saleItem.openOffersList.length; i++){ 
	    			var soldLot = findLot(lotTable.lotList,saleItem.openOffersList[i]);
	    			
	    			lotTable.lotList[soldLot].soldPrice = saleItem.highBid;
	    			headerController.addToCart(lotTable.lotList[soldLot]);
	    		}

	    		headerController.alertWon(saleItem.openOffersList);
				
				//SET ALL LOTS IN GROUP TO INACTIVE
				for(var j = 0; j < group.lotList.length; j++){ 
					group.lotList[j].isActive = false;
					if(group.lotList[j].soldPrice === 0) allSold = false;
				}
	    		
	    		//RESET THE OPEN OFFERS LIST
	    		saleItem.openOffersList = [];

	    		//MOVE ON TO THE NEXT LOT AFTER 2 SECONDS
	    		if(allSold){
		    		setTimeout(function(){
						initializeLot(group.lotList[group.lotList.length-1].lot);
						$('.js--open-offer').removeClass('s-visible');
					},5000);
				}
				//OR RESUME OPEN OFFER IF NOT ALL SOLD
				else{
					setTimeout(function(){
						groupController.activateOpenOffers();

					},2000);
				}

	    	}
 
	    	//IF THIS LOT WAS PART OF A GROUP
		    else if(saleItem.isgroup){

	    		group.lotList[findLot(group.lotList,saleItem.currentLot)].soldPrice = saleItem.highBid;

	    		if(youwin){
		    		headerController.addToCart(lotTable.lotList[saleItem.currentLot - 1]);
					headerController.alertWon(lotTable.lotList[saleItem.currentLot - 1]);
				}

	    		setTimeout(function(){
					//MOVE ON TO THE NEXT LOT AFTER 2 SECONDS
					groupController.activateOpenOffers();
				},2000);
				
			}

			//NON GROUP LOTS
			else{
				lotTable.lotList[lotTable.currentLot-1].soldPrice = saleItem.highBid;
				lotTable.lotList[lotTable.currentLot-1].bidder = saleItem.bidder;

				if(youwin){
					headerController.addToCart(lotTable.lotList[lotTable.currentLot-1]);
					headerController.alertWon(lotTable.lotList[lotTable.currentLot-1]);
				}

				setTimeout(function(){
					//MOVE ON TO THE NEXT LOT AFTER 2 SECONDS
					initializeLot(lotTable.currentLot);
				},5000);
			}
			
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

		case 'open-offer':
			$(el).addClass('s-open-offer');
			break;

		case 'open-offer_disabled':
			$(el).addClass('s-open-offer_disabled');
			break;

		default:
			$(el).addClass('s-active');
			break;
	}
}

rivets.binders.isgroupbidding = function(el, value){
	if(value > 0) $(el).addClass('s-group-active');
	else $(el).removeClass('s-group-active');
}

rivets.binders.oogroupsize = function(el, value){
	if(value.length === 0) $(el).html(" ");
	else if(value.length === 1) $(el).html("1 lot");
	else $(el).html(value.length + " lots");
}

rivets.bind($('.js--bidding-area'),{
	saleItem: saleItem,
	controller: controller
});





