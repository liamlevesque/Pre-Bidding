$(function(){

	$.ajax({
		method: "GET",
		url: "assets/js/data/lotdata.json",
		dataType: "json", 
		success: function(data){
			buildLotsTable( data );
			buildLotPreview();
		},
		error: function(jqXHR, textStatus){
			console.log(jqXHR.responseText);
			console.log("Request failed: " + textStatus);
		}
	});

	$(document).on('mouseup','.js--watch',function(e){
		e.stopPropagation();
		var index = $(e.currentTarget).data('lot');
		tablecontroller.watchItem(index);
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
		currentLot: null,
		followCurrentLot: true
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

		onLotClick: function(e, model){
			// if($('body').hasClass('s-prebid-open')) return;
			// createPrebidPopup($(e.currentTarget));
		},

		onWatchClick: function(e, model){
			//var index = $(e.currentTarget).data('lot');
			//watchItem(index);
		},

		watchItem: function(index){
			lotTable.lotList[index-1].watching = !lotTable.lotList[index-1].watching;

			//IF WE JUST STARTED WATCHING, ADD TO WATCHING TABLE
			if(lotTable.lotList[index-1].watching){
				lotTable.watchingList.push(lotTable.lotList[index-1]);
				//SORT THE LIST
				sortList(lotTable.watchingList);
			}
			
			//ELSE REMOVE FROM WATCHING TABLE
			else{
				lotTable.watchingList.splice(findLot(lotTable.watchingList, index),1); 
			}

			//UPDATE THE COUNT AFTERWARDS
			lotTable.watchingCount = lotTable.watchingList.length;

		}
	};

//WHEN WE CHANGE CURRENT LOT, CHECK THE STATUS OF ALL OF THE LOTS AND MAKE SURE THEY'RE RIGHT (SOLD,CURRENT...)
rivets.binders.lotstatus = function(el, value) {
	if($(el).data('bidder') === user.bidder) $(el).addClass('s-youwon');
	if( value > $(el).data('lot') ) $(el).addClass('s-sold').removeClass('s-currentLot');
	else if( value == $(el).data('lot') ) $(el).addClass('s-currentLot').removeClass('s-sold');
	else $(el).removeClass().addClass('lot js--prebid-click');
	return;
}


rivets.bind($('.js-lot-tables'),{
	lotTable: lotTable,
	tablecontroller: tablecontroller
});

function findLot(searchList, index){
	for(var i = 0; i < searchList.length; i++){
		if(searchList[i].lot === index) return i;
	}
}

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

    controller.initSaleItem(0);
	
}

function sortList(data){
	data.sort(function(a,b) {return a.lot - b.lot});
}









