$(function(){

	$.ajax({
		method: "GET",
		url: "assets/js/data/lotdata.json",
		dataType: "json", 
		success: function(data){
			buildLotsTable( data );
		},
		error: function(jqXHR, textStatus){
			console.log(jqXHR.responseText);
			console.log("Request failed: " + textStatus);
		}
	});

	$(document).on('mouseup','.js--prebid-click',function(e){
		createPrebidPopup($(e.currentTarget));
	});

});

var lotTable = {
		allActive: true,
		allCount: 21,
		biddingActive: false,
		biddingCount: 0,
		watchingActive: false,
		watchingCount: 0,
		lotList : {},
		biddingList: {},
		watchingList: {},
		currentLot: null
	},

	tablecontroller = {
		changeTab: function(e, model){
			model.lotTable.allActive = model.lotTable.biddingActive = model.lotTable.watchingActive = false;

			switch ($(e.currentTarget).data('tab')) {
				case 'all':
					model.lotTable.allActive = true;
					break;

				case 'bidding':
					model.lotTable.biddingActive = true;
					break;

				case 'watching':
					model.lotTable.watchingActive = true;
					break;
			}

		},

		onWatchClick: function(e, model){
			var index = $(e.currentTarget).data('lot');
			model.lotTable.lotList[index-1].watching = !model.lotTable.lotList[index-1].watching;

			//IF WE JUST STOPPED WATCHING, ADD TO WATCHING TABLE
			if(model.lotTable.lotList[index-1].watching){
				model.lotTable.watchingList.push(model.lotTable.lotList[index-1]);
				//SORT THE LIST
				sortList(model.lotTable.watchingList);
			}
			
			//ELSE REMOVE FROM WATCHING TABLE
			else{
				for(var i = 0; i < model.lotTable.watchingList.length; i++){
					if(model.lotTable.watchingList[i].lot === index) model.lotTable.watchingList.splice(i,1);
				} 
			}

			//UPDATE THE COUNT AFTERWARDS
			lotTable.watchingCount = model.lotTable.watchingList.length;

		}
	};

rivets.formatters.lotPhotoDirectory = function(value){

	return 'assets/js/data/'+value;

} 

rivets.binders.lotstatus = function(el, value) {
	if( value > $(el).data('lot') ) $(el).addClass('s-sold').removeClass('s-currentLot');
	else if( value == $(el).data('lot') ) $(el).addClass('s-currentLot').removeClass('s-sold');
	else $(el).removeClass().addClass('lot');
	return;
}

rivets.formatters.zeroToFalse = function(value){
	if(value > 0) return false;
	else return true;
}

rivets.bind($('.js-lot-tables'),{
	lotTable: lotTable,
	tablecontroller: tablecontroller
});

function buildLotsTable(data){
	
	var lots = data[0].lots,
		bids = [],
		watching = [];

	for (var i = 0; i < lots.length; i++){
		if(lots[i].bid > 0){
			bids.push(lots[i]);
		}
		if(lots[i].watching){
			watching.push(lots[i]);
		}
	}

	//POPULATE ALL OF THE TABLES 
	lotTable.lotList = lots;
	lotTable.biddingList = bids;
	lotTable.watchingList = watching;
	
    //SET THE LOT TABLE COUNT CIRCLE (IN THE LOT TABLE HEADER)
    lotTable.allCount = lots.length;
    lotTable.biddingCount = bids.length;
    lotTable.watchingCount = watching.length;

    initializeLot(0);
	
}

function sortList(data){
	data.sort(function(a,b) {return a.lot - b.lot});
}


/***************************
	PRE-BID POPUP CONTROLS
***************************/
function createPrebidPopup(el){
	var index = $(el).data('lot');

	$(el).tooltipster({
		content: $($('.js--prebid-toggle--content').html()),
		theme: 'ritchie-tooltips',
		interactive: true,
		trigger: "click",
		position: 'top',
		functionBefore: function(origin, continueTooltip){
			continueTooltip();
			loadPreBidTooltip(index);
			$(origin.tooltipster('elementTooltip')).find('input').focus();
		},
		functionAfter: function(origin){
			origin.tooltipster('destroy');
			prebidModal.unbind();
		}
	});
	
}

var prebidModal,

	prebid = {
		bid: 0,
		index: 0,
		bidActive: false
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
			
		},

		delete: function(e, model){
			model.prebid.bid = 0;
			lotTable.lotList[model.prebid.index].bid = 0;
			model.prebid.bidActive = false;
			
			//REMOVE THIS ITEM FROM THE BIDDING LIST
			for(var i = 0; i < lotTable.biddingList.length; i++) if(lotTable.biddingList[i].lot === model.prebid.index + 1) lotTable.biddingList.splice(i,1);

			//UPDATE THE COUNT AFTERWARDS
			lotTable.biddingCount = lotTable.biddingList.length;
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

function loadPreBidTooltip(index){
	prebidModal = rivets.bind($('.js--pre-bid-object'),{
		prebid: prebid,
		prebidController : prebidController
	});

	prebid.index = index - 1;
	prebid.bid = lotTable.lotList[index-1].bid;
	prebid.bidActive = (prebid.bid > 0)? true : false;
}







