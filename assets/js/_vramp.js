var allConversions = [
		{
			"currency": "USD",
			"rate": 1.5
		},
		{
			"currency": "JPY",
			"rate": 120
		}
	],
	allOtherRings = [
		{
			"number": "TAL",
			"status": "In Progress",
			"lot": "5000",
			"TAL":true,
			"startTime" : "09:00",
			"displayOrder" : 99
		},
		{
			"number": "2",
			"status": "In Progress",
			"lot": "945",
			"TAL":false,
			"startTime" : "09:00",
			"displayOrder" : 1
		},
		{
			"number": "3",
			"status": null,
			"lot": "945",
			"TAL":false,
			"startTime" : "09:00",
			"displayOrder" : 2
		}
		

	],
	allLots,
	sampleAuctioneerMessage = "Title In transit. Item must remain in yard until received.";


var vrampObject = {
		"auctionCCY": "CAD",
		"currentLot": 0,
		"lotDetail":{},
		"conversions": [],
		"price" : 10000000,
		"highBid" : 'Internet, SK, CAN',
		"bidder" : '10005',
		"auctioneerMessage": null,
		"choiceSize":0,
		"choiceGroup": null,
		"activeChoiceLot": 0,
		"otherRings": [],
		"openOffers" : false,
		"auctionStatus" : "active"
	},

	vrampController = {

		toggleConversions: function(e,model){
			
			if(vrampObject.conversions.length == allConversions.length){
				vrampObject.conversions = [];
				return;
			}
			
			vrampObject.conversions.push(allConversions[vrampObject.conversions.length]);
			
		},

		showMessage: function(e,model){

			vrampObject.auctioneerMessage = vrampObject.auctioneerMessage ? null : sampleAuctioneerMessage;
		},

		toggleOpenOffer: function(e,model){
			console.log(vrampObject.openOffers);
			vrampObject.openOffers = !vrampObject.openOffers;

		},

		toggleOtherRings: function(e,model){
			if(vrampObject.otherRings.length == allOtherRings.length){
				vrampObject.otherRings = [];
				$(".js--vramp-bidding").removeClass('s-other-rings_all s-other-rings_single');
				return;
			}
			
			vrampObject.otherRings.push(allOtherRings[vrampObject.otherRings.length]);
			vrampObject.otherRings.sort(function (a, b) {
			  if (a.displayOrder > b.displayOrder) return 1;
			  if (a.displayOrder < b.displayOrder) return -1;
			  return 0;
			});

			//TOGGLE WHICH BIT OF THE OTHER RINGS AREA IS VISIBLE
			if(vrampObject.otherRings.length === 1) $(".js--vramp-bidding").addClass('s-other-rings_single');
			else $(".js--vramp-bidding").addClass('s-other-rings_all');
		},

		togglePause: function(e,model){
			
			vrampObject.auctionStatus = (vrampObject.auctionStatus === "active" ) ? "paused" : "active";
		
		},

		nextLot: function(e,model){
			navigateLot(1);
		},

		prevLot: function(e,model){
			navigateLot(-1);
		},

		sellLot: function(e,model){
			vrampObject.lotDetail.status = "sold";
			if(isChoiceGroup()) updateChoiceGroup();
		}

	};


rivets.formatters.convertedVrampPrice = function(value, rate, ccy){
	var tempVal = parseFloat(value),
		tempRate = parseFloat(rate),
		convertedVal = tempVal * tempRate;
		convertedVal = convertedVal || 0;
	return formatprice(convertedVal.toFixed(0));
}

rivets.formatters.length = function (value) {
  return value? value.length : 0;
};

rivets.formatters.issold = function (value) {
  return value === "sold";
};

rivets.formatters.isout = function (value) {
  return value === "out";
};

rivets.binders.auctionstatus = function (el, value) {
	if(value === "active") $(el).addClass('s-auction-active').removeClass('s-auction-paused');
	else if(value === "paused") $(el).addClass('s-auction-paused').removeClass('s-auction-active');
}

rivets.binders.soldoroutclass = function (el, value) {
  if(value === "sold") $(el).addClass("s-sold").removeClass('s-out');
  else if(value === "out") $(el).addClass("s-out").removeClass('s-sold');
  else $(el).removeClass("s-out s-sold");
};

rivets.binders.addccyclass = function(el, value){
	$(el).addClass(value);
}

rivets.bind($('.js--vramp-bidding'),{
	vrampObject: vrampObject,
	vrampController: vrampController
});



//LOAD LOT DATA

	$.ajax({
		method: "GET",
		url: "assets/js/vramplots/data.json",
		dataType: "json", 
		success: function(data){
			buildVrampTable( data );
		},
		error: function(jqXHR, textStatus){
			console.log(jqXHR.responseText);
			console.log("Request failed: " + textStatus);
		}
	});


	function buildVrampTable(data){
		
		allLots = data[0].allOtherLots;
		
		navigateLot(0);
 
	}

	function navigateLot(increment){

		vrampObject.currentLot += increment;

		//CHECK IF THIS IS A CHOICE GROUP AND BUILD IF SO
		if(isChoiceGroup()){
			vrampObject.choiceGroup = allLots[vrampObject.currentLot];
			updateChoiceGroup();
		}

		else{
			vrampObject.choiceGroup = null;
			vrampObject.lotDetail = allLots[vrampObject.currentLot];
		}

	}

	function activateFirstAvailableChoiceLot(){
		for(var i = 0; i < vrampObject.choiceGroup.length ; i++){
			if(vrampObject.choiceGroup[i].status != "sold" && vrampObject.choiceGroup[i].status != "out" ){
				vrampObject.choiceGroup[i].active = true;
				return i;
			}else{
				vrampObject.choiceGroup[i].active = false;
			}
		}
		//IF ALL ARE SOLD, STAY ON THE LAST ONE
		return vrampObject.choiceGroup.length - 1;
	} 

	function isChoiceGroup(){
		return Array.isArray(allLots[vrampObject.currentLot]);
	}

	function updateChoiceGroup(){
		vrampObject.activeChoiceLot = activateFirstAvailableChoiceLot();
		vrampObject.lotDetail = vrampObject.choiceGroup[vrampObject.activeChoiceLot];
	}






