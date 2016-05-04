$(function(){

	$(document).on('mouseup','.js--max-bid-tooltip',function(e){
		loadMaxBidTooltip($(e.currentTarget));
	});

	$('.js-tooltip-ooo').tooltipster({
		content: $('<p>Sold Out Of Order</p>'),
		theme: 'ritchie-tooltips_small',
		delay: tooltipDelay,
		position: 'bottom'
	});

	$('.js--ppl-tooltip').tooltipster({
		content: $($('.js--tooltip-ppl').html()),
		theme: 'ritchie-tooltips_small',
		delay: tooltipDelay,
		touchDevices: false,
		position: 'bottom'
	});

	$('.js--audio-tooltip').tooltipster({
		content: $($('.js--tooltip-audio').html()),
		theme: 'ritchie-tooltips_small',
		delay: tooltipDelay,
		touchDevices: false,
		position: 'bottom'
	});

	$('.js--photo-tooltip').tooltipster({
		content: $($('.js--tooltip-photos').html()),
		theme: 'ritchie-tooltips_small',
		delay: tooltipDelay,
		touchDevices: false,
		position: 'bottom'
	});

	$('.js--cart-tooltip').tooltipster({
		content: $($('.js--tooltip-cart').html()),
		theme: 'ritchie-tooltips_small',
		delay: tooltipDelay,
		touchDevices: false,
		position: 'bottom'
	});

	$('.js--auctioneer-msg-button').click(function(){
		user.message = auctioneerMessages[Math.floor(Math.random() * auctioneerMessages.length)];
	});

	$('.js--goToOpenOffers').click(function(){
		bidObject.openOffer = !bidObject.openOffer;
	});

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
		]


function loadMaxBidTooltip(target){
	var parent = $(target).parents('.lot');
	parent.addClass('s-selected');
	
	//FINANCE CALCULATOR CONTROLS
	$(target).tooltipster({
		content: $($('.js--max-bid-content').html()),
		theme: 'ritchie-tooltips_full',
		interactive: true,
		trigger: "click",
		position: 'top-right',
		functionBefore: function(origin, continueTooltip){
			continueTooltip();
			
			maxbidObject.lotNumber = parent.find('.col-0').text();
			maxbidObject.lotName = parent.find('.col-2a').text();
			maxbidObject.lotSerial = parent.find('.col-2b').text();
			maxbidObject.lotMeter = parent.find('.col-2c').text();

			maxbidObject.totalMaxBids = user.bid;
			maxbidObject.hasMaxBid = (target.data('bid') > 0) ? true : false;
			maxbidObject.initialBid = (target.data('bid') > 0) ? target.data('bid') : 0;
			maxbidObject.maxbidAmount = (target.data('bid') > 0) ? target.data('bid') : '';
			
			financeModal = rivets.bind($('.js--max-bid-object'),{
				maxbidObject: maxbidObject,
				maxbidController : maxbidController
			});

			$('.js--max-bid-field').inputmask("numeric", {
			    radixPoint: ".",
			    groupSeparator: ",",
			    digits: 2,
			    autoGroup: true,
			    prefix: '', //Space after $, this will not truncate the first character.
			    rightAlign: false,
			    oncleared: function () { self.Value(''); }
			});

			//console.log(maxbidObject.initialBid);

			$('.js--max-bid-field').focus().removeClass('s-error');
		},
		functionAfter: function(origin){
			unloadMaxBidTooltip(target);
		}
	});
}

function unloadMaxBidTooltip(target){
	$(target).parents('.lot').removeClass('s-selected');
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

	    clearWarningClick: function(e,model){
			maxbidObject.maxbidAmount = '';
	    	$('.js--max-bid-field').focus();
	    },

	    onMaxBidInput: function(e, model){
	    	
		},

		onMaxBidChange: function(e,model){
			$(e.currentTarget).removeClass('s-error');

	    	maxbidObject.offIncrement = false; //HIDE INCREMENT WARNING WHEN YOU START TO TYPE AGAIN

			maxbidObject.maxbidAmount = parseInt($('.js--max-bid-field').inputmask('unmaskedvalue'));

			switch(e.which){
				case 13://ENTER
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

	    	$('.js--max-bid-tooltip.tooltipstered').data('bid',maxbidObject.maxbidAmount).html("<span class='dollars'>"+formatprice(maxbidObject.maxbidAmount)+"</span>");
	    	maxbidController.updateBids();
	    	maxbidController.killtooltip();
	    },

	    updateBids: function(){
	    	user.bid = 0;
	    	var i = 0;

	    	$('.js--max-bid-tooltip').each(function(){
	    		var tempbid = parseInt($(this).data('bid'));
	    		if(tempbid > 0){
	    			user.bid += tempbid; 
	    			i++;
	    		}
	    	})

	    	user.bidcount = i;
	    },

	    cancelMaxBid: function(amt){
	    	$('.js--max-bid-tooltip.tooltipstered').data('bid',0).text('');
	    	maxbidController.updateBids();
	    	maxbidController.killtooltip();
	    },

	    killtooltip: function(){
	    	$('.js--max-bid-tooltip.tooltipstered').tooltipster('destroy');
	    	unloadMaxBidTooltip();
	    }

	};

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
		"askPrice" : 10000,
		"bidPrice" : 7500,
		"openOffer" : false
	},
	bidController = {

		activate: function(e, model){
			
			var target = $(e.currentTarget).parent().parent().data('lotnumber');
			
			if(bidObject.lotSelected == target){
				//console.log(bidObject.lotSelected, target);
				bidObject.lotSelected = 0;
			}
			else bidObject.lotSelected = target;

		},

		onBidClick: function(e, model){
			
			switch(bidObject.bidStatus){
				case "disabled":
					bidObject.bidStatus = 'active';
					break;

				case "active":
					bidObject.bidStatus = 'waiting';
					break;

				case "waiting":
					bidObject.bidStatus = 'accepted';
					bidController.outbid();
					break;
				
				case "accepted":
					bidObject.bidStatus = 'soldYou';
					break;

				case "soldYou":
					bidObject.bidStatus = 'soldOther';
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

		outbid: function(){
			$('.js--outbid').addClass('s-active');
			setTimeout(function(){
				$('.js--outbid').removeClass('s-active');
			},3000);
		},

		onSelectAllClick: function(e, model){
			console.log('select all');
		}

	};

	rivets.binders.lotactive = function(el, value){
		
		if(value == $(el).data('lotnumber')) $(el).addClass('s-active-lot');
		else $(el).removeClass('s-active-lot');

	}

	rivets.binders.isopenoffers = function(el, value){
		
		if(value) $(el).addClass('s-open-offers');
		else $(el).removeClass('s-open-offers');

	}

	rivets.binders.lotbidstate = function(el, value) {
		$(el).removeClass().addClass('bidding--bid-button');
		console.log(value);
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

	bidArea = rivets.bind($('.js--bid-area'),{
		bidObject: bidObject,
		bidController : bidController
	});



