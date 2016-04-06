$(function(){

	$(document).on('mouseup','.js--max-bid-tooltip',function(e){
		loadMaxBidTooltip($(e.currentTarget));
	});

	$('.js--ppl-tooltip').tooltipster({
		content: $($('.js--tooltip-ppl').html()),
		theme: 'ritchie-tooltips',
		delay: tooltipDelay,
		touchDevices: false,
		position: 'bottom-right'
	});

	$('.js--ppl-tooltip').tooltipster({
		content: $($('.js--tooltip-ppl').html()),
		theme: 'ritchie-tooltips',
		delay: tooltipDelay,
		touchDevices: false,
		position: 'bottom-right'
	});

	$('.js--audio-tooltip').tooltipster({
		content: $($('.js--tooltip-audio').html()),
		theme: 'ritchie-tooltips',
		delay: tooltipDelay,
		touchDevices: false,
		position: 'bottom-right'
	});

	$('.js--photo-tooltip').tooltipster({
		content: $($('.js--tooltip-photos').html()),
		theme: 'ritchie-tooltips',
		delay: tooltipDelay,
		touchDevices: false,
		position: 'bottom-right'
	});

	$('.js--cart-tooltip').tooltipster({
		content: $($('.js--tooltip-cart').html()),
		theme: 'ritchie-tooltips',
		delay: tooltipDelay,
		touchDevices: false,
		position: 'bottom-right'
	});

});

var tooltipDelay = 500;


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





