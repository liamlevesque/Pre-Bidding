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

			financeModal = rivets.bind($('.js--max-bid-object'),{
				maxbidObject: maxbidObject,
				maxbidController : maxbidController
			});
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
		lotNumber:'0',
		lotName:'0',
		lotSerial:'0',
		lotMeter:'0',
		totalMaxBids: 10000,
		remainingCredit: 20000,
		maxbidAmount:0,
		conversion: 1.53
	},
	maxbidModal,
	maxbidController = {

		onCloseClick: function(e, model){
			$('.js--max-bid-tooltip.tooltipstered').tooltipster('destroy');
	    	unloadMaxBidTooltip();
	    },
	    onMaxBidBlur: function(e,model){
	    	console.log(maxbidObject.maxbidAmount);
	    }

	};