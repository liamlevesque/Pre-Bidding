$(function(){

	$('.js-tooltip-ooo').tooltipster({
		content: $('<p>Sold Out Of Order</p>'),
		theme: 'ritchie-tooltips_small',
		delay: tooltipDelay,
		side: 'bottom'
	});

	$('.js-tooltip-auctioneer').tooltipster({
		content: $('<p>Current Auctioneer</p>'),
		theme: 'ritchie-tooltips_small',
		delay: tooltipDelay,
		side: 'bottom'
	});

	$('.js--ppl-tooltip').tooltipster({
		content: $('.js--tooltip-ppl').detach(),
		theme: 'ritchie-tooltips_small',
		delay: tooltipDelay,
		trigger: 'custom',
	    triggerOpen: {
	        mouseenter: true
	    },
	    triggerClose: {
	        click: true,
	        scroll: true,
	        mouseleave: true
	    },
		side: 'bottom',

	});

	$('.js--audio-tooltip').tooltipster({
		content: $('.js--tooltip-audio').detach(),
		theme: 'ritchie-tooltips_small',
		delay: tooltipDelay,
		trigger: 'custom',
		interactive: true,
		contentAsHTML: true,
	    triggerOpen: {
	        mouseenter: true,
	        click: true, 
	    },
	    triggerClose: {
	        click: true,
	        scroll: true,
	        mouseleave: true
	    },
		side: 'bottom'
	});

	$('.js--photo-tooltip').tooltipster({
		content: $('.js--tooltip-photos').detach(),
		theme: 'ritchie-tooltips_small',
		delay: tooltipDelay,
		trigger: 'custom',
	    triggerOpen: {
	        mouseenter: true
	    },
	    triggerClose: {
	        click: true,
	        scroll: true,
	        mouseleave: true
	    },
		side: 'bottom'
	});

	$('.js--cart-tooltip').tooltipster({
		content: $('.js--tooltip-cart').detach(),
		theme: 'ritchie-tooltips_small',
		delay: tooltipDelay,
		trigger: 'custom',
	    triggerOpen: {
	        mouseenter: true
	    },
	    triggerClose: {
	        click: true,
	        scroll: true,
	        mouseleave: true
	    },
		side: 'bottom'
	});

	$('.js--total-max-bids-tooltip').tooltipster({
		content: $('.js--tooltip-max-bid').detach(),
		theme: 'ritchie-tooltips_error',
		trigger: 'custom',
		delay: tooltipDelay,
		triggerOpen: {
	        mouseenter: true,
	        click: true
	    },
	    triggerClose: {
	        click: true,
	        scroll: true,
	        mouseleave: true
	    },
	    functionBefore: function(instance,helper){
			if(!$(helper.origin).hasClass('s-error'))return false;
		},
		side: 'bottom',

	});

	$('.js--viewer-toggle').click(function(){
		$('body').toggleClass('s-viewer-mode');
	})

	$('.js--toggle-auctioneer').click(function(){
		switch(user.auctioneer){
			case "Pat Hicks":
				user.auctioneer = "Trev Moravec";
				break;
			case "Trev Moravec":
				user.auctioneer = null;
				break;
			default:
				user.auctioneer = "Pat Hicks";
				break;
		}
	})

	$('.js--auctioneer-msg-button').click(function(){
		user.message = auctioneerMessages[Math.floor(Math.random() * auctioneerMessages.length)];
	});

	$('.js--logo-swap').click(function(){
		var $next = $('.js--logo .s-active').attr('class','').next('svg');
		if ($next.length) $next.attr('class','s-active'); 
		else $(".js--logo svg:first").attr('class','s-active'); 

	});

	$('.js--toggleMultiAttend').click(function(){
		$('.js--multi-attend').toggleClass('s-hidden');
		$('body').toggleClass('s-multi-attend');
		$('.js--lot-table-area').toggleClass('s-multi-attend');
	});

	$('.js--goToOpenOffers').click(function(){
		bidObject.openOffer = !bidObject.openOffer;
		bidModeIndex = (bidModeIndex + 1 < bidMode.length)? bidModeIndex + 1 : 0;
		bidObject.bidMode = bidMode[bidModeIndex];
	});

	$('.js--kickMeOut').click(function(){
		$('.js--kickedOut').toggleClass('s-visible');
		$('.other-ring.s-active').toggleClass('s-ended');
	});

	$('.js--disconnect').click(function(){
		$('.js--disconnected').toggleClass('s-visible');
	});

	$('.js--flashError').click(function(){
		$('.js--audio-tooltip').toggleClass('s-error');
		$('.js--audio-tooltip .toggle_input').prop('disabled',true).prop('checked',false); 
		$('.js--audio-tooltip').tooltipster('content','You have no audio because of a problem with Flash Player. Please <a href="https://helpx.adobe.com/flash-player.html" target="_blank">enable or update/install Flash</a> in your browser to listen to the auction');
	});
	
	

	//SHOW/HIDE THE PREVIEW IMAGE IN THE LOT TABLE
	$('.js--lot-preview-hover').mouseover(function(e){
		var offset = $(e.currentTarget).offset();
		$('.js--preview-photo').addClass('s-visible').css({"top":(offset.top + 8) + "px", "left": (offset.left - 220) +"px"}); 
	}).mouseout(function(e){
		$('.js--preview-photo').removeClass('s-visible');
	});


	$('.js-expander-toggle').click(function(e){
		$(e.currentTarget).parent().toggleClass('s-expanded');
	});

	//FINANCE CALCULATOR FORMATTING ON INIT
	//INIT THE CORRECT PAYMENT PRICE
	finance2.payment = financingCalculation2();

	//INIT CLEAN INTEREST RATE INPUT DISPLAY
	cleanupInterestInput2();


	$('.js--open-ccyconverter').click(function(){
		$('.js--calc-modal').addClass('s-shown');
		$('.js--ccy-converter').addClass('s-expanded');
		ccyconversion2.editing = true;
	});

	$('.js--open-financecalc').click(function(){
		$('.js--calc-modal').addClass('s-shown');
		$('.js--finance-calc').addClass('s-expanded');
	});

	$('.js--close-calc').click(function(){
		$('.js--calc-modal').removeClass('s-shown');
		$('.js--finance-calc, .js--ccy-converter').removeClass('s-expanded');
	});

	//GET TODAY'S EXCHANGE RATES
	$.ajax({
		url: "http://api.fixer.io/latest?base="+ccyconversion2.auctionCCY,
		success: function (ccydata) {
			ccys = ccydata.rates;
		}
	})
	

	// window.onbeforeunload = function(){
 //    	location.assign('http://www.google.com');
 //    	return "Woah! You've won 6 lots.\n\nTo see a summary of your purchases, stay on this page and click on the shopping cart.";
 //    } 

});

var tooltipDelay = 500,
	auctioneerMessages = [
			"This is the auctioneer's message",
			"Avast! As in Avast ye mateys! What the hell does Avast mean and where did it come from?",
			"Arrg. What does Arrg mean and why did so many pirates say that?",
			"How much wood would a wood chuck chuck if a wood chuck could chuck wood?",
			"She sells sea shells by the sea shore",
			"My Mum tries to be cool by saying that she likes all the same things that I do.",
			"If the Easter Bunny and the Tooth Fairy had babies would they take your teeth and leave chocolate for you?",
			"Wednesday is hump day, but has anyone asked the camel if he's happy about it?"
		],
	bidMode = [ 'normal', 'open-offer', 'runner-up', 'winners-choice' ],
	bidModeIndex = 0,
	tooltipInstance;


function buildMaxBidTooltip(instance, helper){

	var target = $(helper.origin),
		parent = target.parents('.lot'),
		targetLot = lotObject2.lotList[target.data('lot') - 1];
	parent.addClass('s-selected');

	maxbidObject.lotNumber = targetLot.lot;
	maxbidObject.lotName = targetLot.name;
	maxbidObject.lotSerial = targetLot.serial;
	maxbidObject.lotMeter = targetLot.meter;
	maxbidObject.quantity = targetLot.quantity;
	maxbidObject.quantityUnit = targetLot.quantityUnit;
	maxbidObject.totalMaxBids = user.bid;
	maxbidObject.showConfirmation = false;
	maxbidObject.hasMaxBid = (targetLot.bid > 0) ? true : false;
	maxbidObject.initialBid = (targetLot.bid > 0) ? targetLot.bid : 0;
	maxbidObject.maxbidAmount = (targetLot.bid > 0) ? targetLot.bid : '';

	financeModal = rivets.bind($(instance.elementTooltip()).find('.js--max-bid-object'),{
		maxbidObject: maxbidObject,
		maxbidController : maxbidController
	});
	
	$(instance.elementTooltip()).find('.js--max-bid-field').val(maxbidObject.maxbidAmount).autoNumeric('init',{
		aSep: ',', 
		aDec: '.',
		mDec: 2
	}).focus().removeClass('s-error');

	tooltipInstance = instance;
	
}
	
	var maxbidObject = {
		"lotNumber" : '0',
		"lotName" : '0',
		"lotSerial" : '0',
		"lotMeter" : '0',
		"totalMaxBids" : user.bid,
		"remainingCredit" : user.limit,
		"maxbidAmount" :0,
		"hasMaxBid": false,
		"initialBid" : 0,
		"conversion" : 1.53,
		"offIncrement" : false,
		"offIncrement_high": 0,
		"offIncrement_low": 0,
		"showConfirmation":false,
		"isValid": true
	},
	maxbidModal,
	maxbidController = {

		onCloseClick: function(e, model){
			maxbidController.killtooltip();
	    },

	    onSetClick: function(e,model){
	    	maxbidController.createMaxBid();
	    },

	    onSetLowClick: function(e,model){
	    	maxbidObject.maxbidAmount = maxbidObject.offIncrement_low;
	    	maxbidController.createMaxBid();
	    },

	    onSetHighClick: function(e,model){
	    	maxbidObject.maxbidAmount = maxbidObject.offIncrement_high;
	    	maxbidController.createMaxBid();
	    },

	    onHideConfirm: function(e,model){
	    	maxbidObject.showConfirmation = false;
	    	$('.js--max-bid-field').focus().select();
	    },

	    showTutorial: function(e,model){
	    	tutorialObject.active = true;
	    	maxbidController.killtooltip();
	    },

	    clearWarningClick: function(e,model){
			maxbidObject.maxbidAmount = '';
			$('.js--max-bid-field').autoNumeric('set', 0).focus().select();
	    },

	    onMaxBidInput: function(e, model){
	    	
		},

		onMaxBidChange: function(e,model){
			
			$(e.currentTarget).removeClass('s-error');

	    	maxbidObject.offIncrement = false; //HIDE INCREMENT WARNING WHEN YOU START TO TYPE AGAIN
	    	
			maxbidObject.maxbidAmount = parseFloat($(e.currentTarget).val().split(',').join(''));

			switch(e.which){
				case 13://ENTER
					if(maxbidObject.maxbidAmount === 0) return;
					maxbidController.createMaxBid();
					break;
				case 9://TAB
					$('.js--set-maxbid').focus();
					break;
			}
		},

	    onMaxBidBlur: function(e,model){

	    },

	    incrementMaxBid: function(amt){
	    	var intAmt =  (maxbidObject.maxbidAmount === '') ? 0 : parseInt(maxbidObject.maxbidAmount);
	    	//console.log(intAmt);
	    	maxbidObject.maxbidAmount = (intAmt + amt < 0)? 0: intAmt + amt;
	    },

	    createMaxBid: function(){
	    	if(maxbidObject.maxbidAmount > user.limit){
	    		$('.js--max-bid-field').addClass('s-error').focus().select();
	    		return;
	    	}

	    	//IF THIS IS OFF INCREMENT POLICY
	    	if(maxbidObject.maxbidAmount % 1000 != 0){
	    		$('.js--max-bid-field').addClass('s-error').focus().select();
	    		maxbidObject.offIncrement = true;
	    		maxbidObject.offIncrement_low = Math.floor(maxbidObject.maxbidAmount/1000)*1000;
	    		maxbidObject.offIncrement_high = Math.ceil(maxbidObject.maxbidAmount/1000)*1000;
	    		return;
	    	}

	    	maxbidObject.offIncrement = false;
	    	
	    	//GIVE THE LOT OBJECT THE CORRECT MAX BID
	    	lotObject2.lotList[($(tooltipInstance.elementOrigin()).data('lot')) - 1].bid = maxbidObject.maxbidAmount;

	    	maxbidObject.showConfirmation = true;
	    	
	    	//HACK TO FORCE CHECKMARK GIF TO REPLAY
	    	$('.js--success-checkmark').prop('src',function(){return this.src;});
	    	
	    	maxbidObject.hasMaxBid = true;

	    	maxbidController.updateBids();
	    	//maxbidController.killtooltip();
	    },

	    updateBids: function(){
	    	user.bid = 0;
	    	
	    	//SUM UP ALL OF THE LOTS WITH MAX-BIDS ON THEM
	    	user.bid = lotObject2.lotList.reduce(function(a,b){ return {bid: a.bid + b.bid}; }).bid;

	    	//COUNT THE NUMBER OF LOTS WITH MAX BIDS ON THEM
	    	user.bidcount = lotObject2.lotList.filter(function(val){ return val.bid > 0; }).length;
	    },

	    cancelMaxBid: function(amt){
	    	lotObject2.lotList[$(tooltipInstance.elementOrigin()).data('lot')-1].bid = 0;
	    	
	    	maxbidController.updateBids();
	    	maxbidController.killtooltip();
	    },

	    killtooltip: function(){
	    	$('.lot.s-selected').removeClass('s-selected');
	    	tooltipInstance.close();
	    	
	    }

	};

rivets.binders.showhideanimate = function(el, value){
	if(value){
		//$(el).css({"display":"initial"});
		$(el).addClass('s-visible');	
	} 
	else {
		$(el).removeClass('s-visible');
		// setTimeout(function(){
		// 	$(el).css({"display":"none"});
		// },1000);
	}

}

rivets.formatters.validateBid = function(value,offIncrement,bids,credit){
	if(parseInt(bids) > credit || offIncrement){
		return true;	
	} 
	else return false;
}



//SIMPLE BIDDING PROTOTYPE
	
	var bidObject = {
		"lotSelected": 0,
		"bidStatus": 'disabled',
		"bidder" : 'v10005',
		"location" : 'TX, USA',
		"askPrice" : 1.25,
		"bidPrice" : 1.20,
		"lotQuantity" : 45,
		"lotQuantityUnit" : 'ft',
		"bidMode" : 'normal',
		"openOffer" : false,
		"selectAll" : false,
		"previewLot" : 11,
		"disabledClickCount" : 0,
		"disabledLotClickCount": 0,
		"showLotDeselect": true,
	}, 
	bidController = {

		activate: function(e, model){
			
			var target = $(e.currentTarget).parent().parent().data('lotnumber');
			
			if(bidObject.lotSelected == target){
				//console.log(bidObject.lotSelected, target);
				bidObject.lotSelected = 0;
				bidObject.bidStatus = 'disabled';
				return;
			}
			else bidObject.lotSelected = target;
			bidObject.bidStatus = 'active'; 

			if(lotTable.lotList[bidObject.lotSelected - 1].quantity){
				
				bidObject.lotQuantity = lotTable.lotList[bidObject.lotSelected - 1].quantity;
				bidObject.lotQuantityUnit = lotTable.lotList[bidObject.lotSelected - 1].quantityUnit;
			}

			//RESET WARNING TO SELECT A LOT BEFORE BIDDING
			bidObject.disabledClickCount = 0;
		},

		changePreview: function(e, model){
			if(bidObject.lotSelected != 0){
				bidObject.disabledLotClickCount++;
				if(bidObject.disabledLotClickCount >= 2) {
					bidController.flashLotDeselectWarning();
					bidObject.disabledLotClickCount = 0;
				};
				return;
			}

			bidObject.disabledLotClickCount = 0;
			$('.js--lotWarning').removeClass('s-shown');
			
			var targetLot = ($(e.currentTarget).data('lotnumber')) - 1;
			if(targetLot === lotObject.lot) return;

			lotObject.lot = bidObject.previewLot = targetLot;
		},

		flashLotDeselectWarning: function(){
			$('.js--lotWarning').addClass('s-shown');
			setTimeout(function(){
				$('.js--lotWarning').removeClass('s-shown');
			},10000);
		},

		onBidClick: function(e, model){
			//IF NO LOT SELECTED, DON'T DO NOTHING
			if(bidObject.lotSelected === 0){
				bidObject.disabledClickCount ++;
				setTimeout(function(){bidObject.disabledClickCount = 0;},1000);
				return;
			}

			switch(bidObject.bidStatus){
				case "disabled":
					bidObject.bidStatus = 'active';
					break;

				case "active":
					bidObject.bidStatus = 'waiting';
					break;

				case "waiting":
					bidObject.bidStatus = 'accepted';
					break;

				case "accepted":
					bidObject.bidStatus = 'outbid';
					break;

				case "outbid":
					bidObject.bidStatus = 'soldYou';
					break;

				case "soldYou":
					bidObject.bidStatus = 'tooLate';
					break;

				case "tooLate":
					bidObject.bidStatus = 'limitExceeded';
					break;

				case "limitExceeded":
					bidObject.bidStatus = 'backedUp';
					break;

				case "backedUp":
					bidObject.bidStatus = 'inactive';
					break;

				case "inactive":
					bidObject.bidStatus = 'notInCatalog';
					$('.js--not-in-catalog').addClass('s-visible');
					break;

				case "notInCatalog":
					bidObject.bidStatus = 'maxBidding';
					$('.js--not-in-catalog').removeClass('s-visible');
					break;

				case "maxBidding":
					bidObject.bidStatus = 'disabled';
					break;

				case "soldOther":
					bidObject.bidStatus = 'open-offer';
					break;

				case "open-offer":
					bidObject.bidStatus = 'disabled';
					break;
				
				default:
					bidObject.bidStatus = 'disabled';
			}
		},

		bidSubmitted: function(){
			setTimeout(function(){
				bidController.outbid();
			},3000);
		},

		outbid: function(){
			$('.js--outbid').addClass('s-active');
			setTimeout(function(){
				$('.js--outbid').removeClass('s-active');
			},3000);
		},

		onSelectAllClick: function(e, model){
			bidObject.selectAll = !bidObject.selectAll;
			if(bidObject.selectAll){ 
				$('.js--group-lot:not(.s-out):not(.s-sold)').addClass('s-active-lot').find('input').prop("checked", "checked");
				bidObject.lotSelected = 99;
				bidObject.bidStatus = 'active';
			}
			else {
				$('.js--group-lot').removeClass('s-active-lot').find('input').prop("checked", "");
				bidObject.lotSelected = 0;
				bidObject.bidStatus = 'disabled';
			} 
		}

	};

	rivets.formatters.equals = function(value, arg){
		return value === arg;
	}

	rivets.binders.lotactive = function(el, value){
		if(value === 99) return;
		if(value == $(el).data('lotnumber')) $(el).addClass('s-active-lot');
		else $(el).removeClass('s-active-lot');

	}

	rivets.binders.lotpreview = function(el, value){
		if(value === 99) return;
		if(value == $(el).data('lotnumber') - 1) $(el).addClass('s-preview');
		else $(el).removeClass('s-preview');
	}

	rivets.binders.isopenoffers = function(el, value){
		
		if(value) $(el).addClass('s-open-offers');
		else $(el).removeClass('s-open-offers');

	}

	rivets.binders.activatewarning = function(el, value) {
		if(value > 0) $(el).addClass('s-flash');
		else $(el).removeClass('s-flash');
	}

	rivets.binders.biddingmode = function(el, value) {
		$(el).removeClass('s-normal s-open-offers s-runnerup s-winner');

		switch (value){
			case 'normal':
				$(el).addClass('s-normal');
				break;

			case 'open-offer':
				$(el).addClass('s-open-offers');
				break;

			case 'runner-up':
				$(el).addClass('s-runnerup');
				break;

			case 'winners-choice':
				$(el).addClass('s-winner');
				break;

			default:
				$(el).addClass('s-normal');
				break;
		}
	}

	rivets.binders.lotbidstate = function(el, value) {
		$(el).removeClass().addClass('bidding--bid-button');
		
		switch (value){
			case 'disabled':
			case 'waiting':
			case 'accepted':
			case 'soldYou':
			case 'limitExceeded':
			case 'inactive':
			case 'maxBidding':
			case 'notInCatalog':
				$(el).addClass('s-disabled');
				break;

			case 'outbid':
			case 'backedUp':
				$(el).addClass('s-active');
				break;

			default:
				$(el).addClass('s-active');
				break;
		}

	},

	bidArea = rivets.bind($('.js--bid-area'),{
		bidObject: bidObject,
		bidController : bidController
	});


 
 	var lotObject = {
			lot: bidObject.previewLot,
		},
		lotArea;


	rivets.binders.lotpreviews = function(el,value){
		$(el).html('');

		var newLotData = lotTable.lotList[value];
		var template3 = $('#currentlot').html();
		var newLot = Mustache.render(template3, newLotData);
		$(el).html(newLot);

		//Init image scrolling on the preview image
		buildSwiper();
	}

	function buildLotPreview(){
		lotArea = rivets.bind($('.js--lot-info'),{
			lotObject: lotObject
		});
	}

	function buildSwiper(){
		var mySwiper = new Swiper ('.swiper-container', {
			direction: 'horizontal',
			loop: true,
			pagination: '.swiper-pagination',
			paginationClickable: 'true',
			nextButton: '.swiper-button-next',
			prevButton: '.swiper-button-prev',
			autoHeight: true,
			onSlideChangeEnd: function(mySwiper){
				$('.js--swiper-active').text($('.swiper-slide-active').data('swiper-slide-index')+1);

			}
		})
	}



//CCY CONVERTER

var ccys = {
		"CAD":"1",
		"USD":"0.7731",
		"EUR":"0.6",
		"GBP":"0.5",
		"CNY":"4.5",
		"SGD":"0.9",
		"NZD":"1.1",
		"AUD":"1",
		"MXN":"12.5",
		"PLN":"2.8",
		"JPY":"79.5",
		"INR":"46.5",
		"AED":"2.5",
		"ZAR":"11.5"
	},
	
	ccyconversion2 = {
		'active' : false,
		'currentCCY' : 'CAD',
		'rate' : 1,
		'conversion' : bidObject.askPrice,
		'price': bidObject.askPrice,
		'editing': false,
		'auctionCCY': 'CAD'
	},
	
	ccycontroller2 = { 
		
		onCCYChange: function(e, model) {			
			ccyconversion2.currentCCY = $(e.currentTarget).val();
			ccycontroller2.update();
			ccyconversion2.active = true;
			ccyconversion2.editing = false;
	    },

	    ccyChange: function(e,model){
	    	ccyconversion2.currentCCY = $(e.currentTarget).data('ccy');
			ccycontroller2.update();
			ccyconversion2.active = true;
			ccyconversion2.editing = false;
	    },

		onToggleClick: function(e, model){
	    	console.log('test');
	    	ccyconversion2.editing = !ccyconversion2.editing;
	    },
	    
	    update: function() {
	    	
	    	ccyconversion2.rate = (ccyconversion2.currentCCY === ccyconversion2.auctionCCY) ? 1 : ccys[ccyconversion2.currentCCY];
			ccyconversion2.conversion = ccyconversion2.rate * bidObject.askPrice;
			
			ccyconversion2.active = true;
			finance2.ccy = ccyconversion2.currentCCY;
			finance2.payment = 0; //force refresh of the CCY in the finance calculator
			finance2.payment = financingCalculation2();

	    },

	    onCloseClick: function(e, model){
	    	$('.js--convert-ccy').tooltipster('hide');
	    	unloadCCYConverter();
	    }
	};

rivets.formatters.priceWithCCYs = function(value){
	var val = bidObject.askPrice * ccyconversion2.rate;
	return "<span class='" + ccyconversion2.currentCCY + "'><span class='dollars'>" + formatprice(val.toFixed(0)) + '</span><span class="CCY"></span><span class="auction-ccy-flag"></span></span>';
}

rivets.binders.activeccy = function(el, value){
	$(el).children('.s-active').removeClass('s-active');
	$(el).find('.'+value).addClass('s-active');
}

rivets.binders.activetoggle = function(el, value){
	if(value) $(el).addClass('s-active');
	else $(el).removeClass('s-active');
}

rivets.bind($('.js--converter-outputz'),{
	ccyconversion2: ccyconversion2,
	ccycontroller2: ccycontroller2
});



// FINANCE CALCULATOR

var	finance2 = {
		"active" : false,
		"financeRate" : 5.00,
		"financePeriod" : 24,
		"maxFinanceRate" : 15,
		"payment" : 100,
		"ccy": ccyconversion2.currentCCY,
		"price": bidObject.askPrice,
		"editing": false
	},
	calccontroller2 = {
		
		onInterestInput: function(e, model){
			switch(e.which) {
		    	case 9:
		    	case 13: // enter
			        cleanupInterestInput2();
			        $('.js--finance-period').focus();
			        e.preventDefault();
			        return true;
			        break;

		        case 38: // up
		        	incrementInterest2(0.5);
		        	cleanupInterestInput2();
			       	e.preventDefault();
			       	return true;
			        break;

		        case 40: // down
		        	incrementInterest2(-0.5);
		        	cleanupInterestInput2();
		        	e.preventDefault();
			       	return true;
			       	break;

		        default: 

		        	if(e.which != 46 && e.which != 190 && e.which != 188 && e.which > 31 && (e.which < 48 || e.which > 57)) return false;
		        	else return true; // exit this handler for other keys
		    }
		    e.preventDefault();
		},

		onInterestBlur: function(e, model){
			var val = parseFloat($(e.currentTarget).val());
			updateInterest2(val);
			cleanupInterestInput2();
			finance2.active = true;
		},

		onInterestIncrement: function(e, model){
			incrementInterest2($(e.currentTarget).data('increment'));
			cleanupInterestInput2();
			finance2.active = true;
		},

		onPeriodUpdate: function(e, model){
			finance2.financePeriod = $(e.currentTarget).val();
			finance2.payment = financingCalculation2();
			finance2.active = true;
		},
		
		onToggleClick: function(e, model){
	    	finance2.editing = !finance2.editing;
	    },

	    showCCYConverter: function(e,model){
	    	$('.js--ccy-converter').addClass('s-expanded');
			ccyconversion2.editing = true;
	    }

	};

	

rivets.formatters.convertedPrice2 = function(value){
	var tempVal = parseFloat(value),
		convertedVal = tempVal * ccyconversion2.rate;

	if(ccyconversion2.active) return "<span class='"+ ccyconversion2.currentCCY +"'><span class='dollars'>" + formatprice(convertedVal.toFixed(2)) + "</span><span class='CCY'></span><span class='h-t-s'>per month</span></span>";
	else return "<span class='dollars'>" + formatprice(tempVal.toFixed(2)) + "</span><span class='CCY'></span><span class='h-t-s'>per month</span>";
}

rivets.bind($('.js-financing-object2'),{
	finance2: finance2,
	calccontroller2 : calccontroller2
});


//HANDLE INTEREST RATE INCREMENTS (+/- Button presses)
function incrementInterest2(val){
	var tempValue = parseFloat(finance2.financeRate),
		increment = parseFloat(val);
	
	updateInterest2(tempValue + increment);
}

//ADJUST INTEREST RATE
function updateInterest2(val){
	
	if(val < 0) finance2.financeRate = 0;
	
	else if(val >= finance2.maxFinanceRate) finance2.financeRate = finance2.maxFinanceRate;
	
	else finance2.financeRate = val;

	finance2.payment = financingCalculation2();
}

//TIDY UP DISPLAY OF INTEREST RATE
function cleanupInterestInput2(){
	var val = parseFloat($('.js--finance-interest').val());
	$('.js--finance-interest').val(val.toFixed(2) + "%");
}


function financingCalculation2(){
	var amt = bidObject.askPrice,
		adjustedInterest = (finance2.financeRate/100)/12,
		monthly = amt * ((adjustedInterest * Math.pow((1 + adjustedInterest),finance2.financePeriod)) / (Math.pow((1 + adjustedInterest),finance2.financePeriod) - 1));

	if(adjustedInterest === 0) monthly = amt/finance2.financePeriod; //IF 0% FINANCING, JUST DIVIDE PRICE BY TOTAL PERIOD

	return monthly.toFixed(2);
}



/*********************************
	LOT LIST
********************************/

var lotObject2 = {
		lotList : [],
		currentLot: null,
		followCurrentLot: true
	},

	lotObjectController2 = {

	};

rivets.bind($('.js-lot-tables2'),{
	lotObject2: lotObject2
});

$.ajax({
	method: "GET",
	url: "assets/js/data/lotdata.json",
	dataType: "json", 
	success: function(data){
		buildLotTable( data );
	},
	error: function(jqXHR, textStatus){
		console.log(jqXHR.responseText);
		console.log("Request failed: " + textStatus);
	}
});


function buildLotTable(data){
	for(var i = 0; i < data[0].lots.length; i++) lotObject2.lotList.push(data[0].lots[i]);

	lotObject2.currentLot = 4;

	$('.js--max-bid-tooltip').tooltipster({
		content: "Max Bid",
		theme: 'ritchie-tooltips_small',
		side: 'bottom',
		multiple: true,
		trigger: 'custom',
	    triggerOpen: {
	        mouseenter: true
	    },
	    triggerClose: {
	        click: true,
	        scroll: true,
	        mouseleave: true
	    }
	});

	$('.js--max-bid-tooltip').tooltipster({
		content: $('.js--max-bid-content').detach(),
		theme: 'ritchie-tooltips_full',
		interactive: true,
		multiple: true,
		trigger: "click",
		side: 'top',
		contentCloning: true,
		functionReady: function(instance,helper){
			buildMaxBidTooltip(instance, helper);
		},
		functionAfter: function (instance,helper){
			$('.lot.s-selected').removeClass('s-selected');
		}
		
	});
}



/*************************
	MAX BID TUTORIAL
*************************/

var tutorialObject = {
		active: false,
		step: 0,
	},

	tutorialController = {
		onCloseClick: function(e, model){
			tutorialObject.active = false;
		}
	};

rivets.bind($('.js--tutorial-object'),{
	tutorialObject: tutorialObject,
	tutorialController: tutorialController
});




