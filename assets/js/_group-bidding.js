var group = {
		groupnumber: 0,
		length: 0,
		currentLot: 0,
		previewLot: 0,
		isOpenOffers: false,
		lotList: {}
	},
	groupController = {

		initializeGroup: function(currentGroup){

			group.groupnumber = 0;
			group.currentLot = 0;
			group.previewLot = 0;
			group.lotList = [];
			group.isOpenOffers = false;

			var groupLots = [];

			for(var i=lotTable.currentLot-1; i<lotTable.lotList.length; i++){
				if(lotTable.lotList[i].group === currentGroup) groupLots.push(lotTable.lotList[i]);
			}
			group.groupnumber = currentGroup;
			group.lotList = groupLots;
			group.length = groupLots.length;
			group.previewLot = saleItem.currentLot;

		},

		destroyGroup: function(){
			group.groupnumber = 0;
		},
		
		/******************************
		  FOR CLICKING THE CHECKMARK
		*******************************/
		// onActivateClick: function(e, model){
		// 	var currentLot = $(e.currentTarget).data('lot'),
		// 		checked = $(e.currentTarget).is(':checked'); 

		// 	if(!group.isOpenOffers){
				
		// 		if(!checked) group.currentLot = 0;
		// 		else{ 
		// 			group.currentLot = currentLot;
		// 			groupController.updatePreview(currentLot);
		// 		}

		// 		//ACTIVATE BIDDING
		// 		controller.activateBidding(currentLot, checked);
		// 	}
			
		// 	//IF WE'RE IN OPEN OFFERS
		// 	else{
		// 		if(checked) saleItem.openOffersList.push(currentLot);
		// 		else for(var i=0; i<saleItem.openOffersList.length; i++) if(saleItem.openOffersList[i] === currentLot) saleItem.openOffersList.splice(i,1);
		// 	}

		// 	e.stopPropagation();

		// },

		/******************************
		  FOR CLICKING THE WHOLE TILE
		*******************************/
		onActivateClick: function(e, model){
			var currentLot = $(e.currentTarget).data('lot'),
				clickedLot = findLot(group.lotList,currentLot);
			
			//IF WE'RE IN OPEN OFFERS
			if(group.isOpenOffers){
				if( !group.lotList[clickedLot].isActive ){ 
					groupController.updatePreview(currentLot);
					saleItem.openOffersList.push(currentLot);
					group.lotList[clickedLot].isActive = true; 
				}
				else{
					group.lotList[clickedLot].isActive = false; 
					saleItem.openOffersList.splice(findLot(saleItem.openOffersList, currentLot),1);
				}

				saleItem.bidstatus = (saleItem.openOffersList.length > 0)? 'open-offer' : 'open-offer_disabled';
			}

			//IF THIS IS JUST REGULAR BIDDING ON GROUP LOTS
			else{
				if(group.currentLot != 0 && currentLot != group.currentLot){
					e.stopPropagation();
					return;
				} 
				else if(currentLot === group.currentLot){
					group.currentLot = 0;
					group.lotList[clickedLot].isActive = false;
				}
				else{ 
					group.currentLot = currentLot;
					groupController.updatePreview(currentLot);
					group.lotList[clickedLot].isActive = true;
				}

				//ACTIVATE BIDDING
				controller.activateBidding(currentLot, group.lotList[clickedLot].isActive);
			}
			
			e.stopPropagation();

		},

		onPreviewClick: function(e, model){
			var targetLot = $(e.currentTarget).data('lot');
			groupController.updatePreview(targetLot);

			e.stopPropagation();
			
		},

		updatePreview: function(target){
			//DON'T REBUILD THE LOT INFO IF YOU CLICK ON THE SAME ONE AGAIN
			if( target != group.previewLot) buildCurrentLot(target - 1);

			group.previewLot = target; 
		},

		activateOpenOffers: function(){
			notifyOpenOffers();
			group.isOpenOffers = true;
			saleItem.bidstatus = 'open-offer_disabled';
		},

		onSelectAllClick: function(){
			
			saleItem.openOffersList = [];

			for(var i=0; i < group.lotList.length; i++)
				if(group.lotList[i].soldPrice === 0){ 
					saleItem.openOffersList.push( group.lotList[i].lot);
					group.lotList[i].isActive = true; 
				}

			saleItem.bidstatus = 'open-offer';
		}

	};

rivets.binders.itemsold = function(el, value){
	if(value > 0) $(el).addClass('s-sold');
	else $(el).removeClass('s-sold');

	group.currentLot = 0;
}

rivets.binders.itempreview = function(el,value){
	if($(el).data('lot') === value) $(el).addClass('s-preview');
	else $(el).removeClass('s-preview');
}

rivets.binders.itemactive = function(el, value){
	if(value) $(el).addClass('s-active-lot');
	else $(el).removeClass('s-active-lot');
}

rivets.binders.disableothers = function(el, value){
	if(value != 0) $(el).addClass('s-lot-selected');
	else $(el).removeClass('s-lot-selected');
}

rivets.binders.isopenoffers = function(el, value){
	if(value) $(el).addClass('s-open-offers');
	else $(el).removeClass('s-open-offers');
}

rivets.bind($('.js--group-area'),{
	group: group,
	groupController: groupController
});


function notifyOpenOffers(){
	$('.js--open-offer').addClass('s-visible');
	// setTimeout(function(){
	// 	$('.js--open-offer').removeClass('s-visible');
	// },5000);
}