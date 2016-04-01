$(function(){

	$(document).on('mouseup','.js--max-bid-tooltip',function(e){
		loadMaxBidTooltip($(e.currentTarget));
	});

});


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

			maxbidObject.maxbidAmount = (target.data('bid') > 0) ? target.data('bid') : '';

			financeModal = rivets.bind($('.js--max-bid-object'),{
				maxbidObject: maxbidObject,
				maxbidController : maxbidController
			});

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
		"conversion" : 1.53
	},
	maxbidModal,
	maxbidController = {

		onCloseClick: function(e, model){
			maxbidController.killtooltip();
	    },

	    onSetClick: function(e,model){
	    	maxbidController.createMaxBid();
	    },

	    onMaxBidInput: function(e, model){
	    	$(e.currentTarget).removeClass('s-error');

	    	switch(e.which) {
		    	case 9:
		    		$('.js--set-maxbid').focus();
		    		e.preventDefault();
		    		return true;
		    		break;
		    	case 13: // enter
		    		maxbidController.createMaxBid();
		    		e.preventDefault();
			        return true;
			        break;

		        case 38: // up
		        	maxbidController.incrementMaxBid(1000);
		        	e.preventDefault();
			       	return true;
			        break;

		        case 40: // down
		        	maxbidController.incrementMaxBid(-1000);
		        	e.preventDefault();
			       	return true;
			       	break;

		        default: 

		        	if(e.which != 46 && e.which > 31 && (e.which < 48 || e.which > 57)) return false;
		        	else return true; // exit this handler for other keys
		    }
		    e.preventDefault();
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

	    	$('.js--max-bid-tooltip.tooltipstered').data('bid',maxbidObject.maxbidAmount).html("<span class='dollars'>"+formatprice(maxbidObject.maxbidAmount)+"</span>");
	    	maxbidController.updateBids();
	    	maxbidController.killtooltip();
	    },

	    updateBids: function(){
	    	user.bid = 0;
	    	$('.js--max-bid-tooltip').each(function(){
	    		user.bid += parseInt($(this).data('bid'));
	    	})
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







