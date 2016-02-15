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
		initSaleItem: function(index){
			$('.js--upper-area').clone().appendTo('.js--middle-section').addClass('s-copy');
			setTimeout(function(){
				$('.js--upper-area.s-copy').addClass('s-hide');
				setTimeout(function(){
					$('.js--upper-area.s-copy').remove();
				},1000);
			},10);

			lotTable.currentLot = index + 1;
    
		    lotInfo.currentLot = index; 

		    saleItem.currentLot = index;

			var currentItem = lotTable.lotList[lotTable.currentLot-1],
				currentGroup = currentItem.group;
			
			saleItem.currentLot = lotTable.currentLot;
			saleItem.price = currentItem.openPrice;
			saleItem.highBid = null;
			saleItem.bidder = null;
			saleItem.bidactive = false;
			saleItem.bidstatus = 'disabled';
			saleItem.prebid = 0;

			dataController.submitBid(false);

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

				dataController.submitBid(false);
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

			dataController.submitBid(false);
			$('.js--outbid').removeClass('s-visible');

			controller.updatePrice();
	    },

	   onOutBid: function(e, model){
	    	outBid();
	    },

	    updatePrice: function(){
	    	ccyconversion.conversion = saleItem.price;
	    	finance.payment = financingCalculation();
	    },

	    onSellClick: function(){
	    	dataController.submitBid(true);
	    	//IF YOU WON THE LOT, SHOW THE RIGHT MESSAGE
	    	controller.sellItem();

	    },

	    incomingBid: function(snapshot){
	    	var bid = snapshot.val();
	    	
	    	//IF YOU'RE INTO OPEN OFFERS RETURN
	    		if(group.isOpenOffers) return;

			//IF THIS LOT SOLD
				if(bid.sold){
					if(bid.source === user.bidder) return;
					controller.sellItem();
					return;
				}

			//IF A BID COMES IN, BUT I HAVE A HIGHER PRE-BID
				if(saleItem.prebid >= bid.price && bid.bidder != user.bidder){ 
					//UPDATE THE ITEM WITH THE HIGH BID SUBMITTED BY THE OTHER BIDDER
					saleItem.highBid = bid.highBid;
					saleItem.price = bid.price;
					
					//THEN PLACE MY COUNTER BID AUTOMATICALLY
					controller.placeBid();
					return;
				}

			//OTHERWISE!!
				//IF I WAS THE HIGH BIDDER AND THE NEW BIDDER ISN'T ME, SHOW OUTBID NOTIFICATION
				if(saleItem.bidder === user.bidder && bid.bidder != user.bidder) outBid();

				//IF I'M BIDDING AND I'M IN ANOTHER STATE (WAITING, ETC), SWITCH TO ACTIVE
			    if(saleItem.bidstatus != 'disabled' && user.bidder != bid.bidder) saleItem.bidstatus = 'active';
				
				//SET THE BIDDER TO THE NEW BID VALUES
				saleItem.bidder = bid.bidder;
				saleItem.highBid = bid.highBid;
				saleItem.price = bid.price;

				controller.updatePrice();

				//COUNTER BIDDER
				counterbidderData.price = bid.price;
				counterbidderData.highBid = bid.highBid;

	    },

	    sellItem: function(){
	    	var youwin = (saleItem.bidder === user.bidder)? true : false;

	    	$('.js--outbid').removeClass('s-visible');

	    	saleItem.bidstatus = (youwin)? 'soldYou': 'soldOther';

	    	//IF WE WERE IN OPEN OFFERS
			if(saleItem.isgroup && saleItem.openOffersList.length > 0){	    		
	    		controller.sellOpenOffers();
	    	}
 
	    	//IF THIS LOT WAS PART OF A GROUP
		    else if(saleItem.isgroup){

	    		group.lotList[findLot(group.lotList,saleItem.currentLot)].soldPrice = saleItem.highBid;

	    		if(youwin){
		    		headerController.addToCart(lotTable.lotList[saleItem.currentLot - 1]);
					headerController.alertWon(lotTable.lotList[saleItem.currentLot - 1]);
				}

	    		setTimeout(function(){
					//MOVE ON TO OPEN OFFERS AFTER 2 SECONDS
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
					controller.initSaleItem(lotTable.currentLot);
				},5000);
			}
			
	    },

	    sellOpenOffers: function(){
	    	var allSold = true;//CHECKING IF ALL ARE SOLD

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
					controller.initSaleItem(group.lotList[group.lotList.length-1].lot);
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





