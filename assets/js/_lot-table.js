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
				model.lotTable.watchingList.splice(findLot(model.lotTable.watchingList, index),1); 
			}

			//UPDATE THE COUNT AFTERWARDS
			lotTable.watchingCount = model.lotTable.watchingList.length;

		}
	};

//WHEN WE CHANGE CURRENT LOT, CHECK THE STATUS OF ALL OF THE LOTS AND MAKE SURE THEY'RE RIGHT (SOLD,CURRENT...)
rivets.binders.lotstatus = function(el, value) {
	if( value > $(el).data('lot') ) $(el).addClass('s-sold').removeClass('s-currentLot');
	else if( value == $(el).data('lot') ) $(el).addClass('s-currentLot').removeClass('s-sold');
	else $(el).removeClass().addClass('lot');
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

    initializeLot(0);
	
}

function sortList(data){
	data.sort(function(a,b) {return a.lot - b.lot});
}









