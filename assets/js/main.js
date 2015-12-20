$(function(){


	$.ajax({
		method: "GET",
		url: "assets/js/data/lotdata.json",
		dataType: "json", 
		success: function(data){
			buildLotTable( data );
			buildCurrentLot(data);
		},
		error: function(jqXHR, textStatus){
			console.log(jqXHR.responseText);
			console.log("Request failed: " + textStatus);
		}
	});

});


function buildCurrentLot(data){
	var currentLot = data[0].lots[$('.js--lot-info').data('lot')],
		template2 = $('#currentlot').html();

	var rendered = Mustache.render(template2, currentLot);
	$('.js--lot-info').html(rendered);	

}


function buildLotTable(data){

	var lots = data[0].lots,
		template = $('#lot').html();
		
	Mustache.parse(template);   // optional, speeds up future uses
	
	for (var i = 0; i < lots.length; i++) {
        var rendered = Mustache.render(template, lots[i]);
		$('.js--lots-all').append(rendered);			
    }
	
}