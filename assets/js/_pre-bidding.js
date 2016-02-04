$(function(){

	$(document).on('mouseup','.js--prebid-click',function(e){
		createPrebidPopup($(e.currentTarget));
		console.log('hat');
	});

});

function createPrebidPopup(el){
	var index = $(el).data('lot');

	$(el).parent().addClass('s-active-prebid');

	$(el).tooltipster({
		content: $($('.js--prebid-toggle--content').html()),
		theme: 'ritchie-tooltips-footed',
		interactive: true,
		trigger: "click",
		position: 'top',
		functionBefore: function(origin, continueTooltip){
			continueTooltip();
			loadPreBidTooltip(index);
			//$(origin.tooltipster('elementTooltip')).find('input').focus();
		},
		functionAfter: function(origin){
			origin.tooltipster('destroy');
			prebidModal.unbind();
			$('.s-active-prebid').removeClass('s-active-prebid');
		}
	});
	
}

function killPrebidModal(){
	$('.s-active-prebid').removeClass('s-active-prebid').find('.tooltipstered').tooltipster('destroy');
}

var prebidModal,

	prebid = {
		lot: {},
		bid: 0,
		index: 0,
		bidActive: false,
		conversionActive: false,
		conversion: 0
	},

	prebidController = {
		bid: function(e, model){
			
			//IF WE'RE NOT ALREADY BIDDING ON THIS ITEM
			if(!model.prebid.bidActive){
				//ADD THIS ITEM TO THE BIDDING TABLE
				lotTable.biddingList.push(lotTable.lotList[model.prebid.index]);
				sortList(lotTable.biddingList);

				//UPDATE THE COUNT AFTERWARDS
				lotTable.biddingCount = lotTable.biddingList.length;
			}

			lotTable.lotList[model.prebid.index].bid = model.prebid.bid;
			model.prebid.bidActive = (model.prebid.bid > 0) ? true : false;
			
			killPrebidModal();
		},

		delete: function(e, model){
			model.prebid.bid = 0;
			lotTable.lotList[model.prebid.index].bid = 0;
			model.prebid.bidActive = false;
			
			//REMOVE THIS ITEM FROM THE BIDDING LIST
			lotTable.biddingList.splice(findLot(lotTable.biddingList, model.prebid.index + 1),1);
			//for(var i = 0; i < lotTable.biddingList.length; i++) if(lotTable.biddingList[i].lot === model.prebid.index + 1) lotTable.biddingList.splice(i,1);

			//UPDATE THE COUNT AFTERWARDS
			lotTable.biddingCount = lotTable.biddingList.length;

			killPrebidModal();
		},

		onFocus: function(e, model){
			$(e.currentTarget)
				.one('mouseup', function () {
            		$(this).select();
            		return false;
        		})
        		.select();
		},

		onKeyPress: function(e, model){
			switch(e.which) {
		    	case 9://tab
		    		$(e.currentTarget).next().focus();
			        e.preventDefault();
			        return true;
			        break;

		    	case 13: // enter
			        prebidController.bid(e,model);
			        e.preventDefault();
			        return true;
			        break;

		        default: 

		        	if(e.which != 46 && e.which != 190 && e.which > 31 && (e.which < 48 || e.which > 57)) return false;
		        	else return true; // exit this handler for other keys
		    }
		    e.preventDefault();
		}
	};

rivets.formatters.convertedPrebid = function(value){
	var tempVal = parseFloat(value),
		convertedVal = tempVal * ccyconversion.rate;
	
	return "<span class='" + ccyconversion.currentCCY + "'><span class='convertCCY'>" + ccyconversion.currentCCY + "</span> <span class='dollars'>" + formatprice(convertedVal.toFixed(0)) + "</span></span>";
}

function loadPreBidTooltip(index){
	prebidModal = rivets.bind($('.js--pre-bid-object'),{
		prebid: prebid,
		prebidController : prebidController
	});

	prebid.lot = lotTable.lotList[findLot(lotTable.lotList, index)];
	prebid.conversionActive = ccyconversion.active;
	prebid.conversion = ccyconversion.rate;
	prebid.index = index - 1;
	prebid.bid = lotTable.lotList[index-1].bid;
	prebid.bidActive = (prebid.bid > 0)? true : false;

}