$(function(){

	$.ajax({
		method: "GET",
		url: "https://www.rbauction.com/rba-api/journal-content?articleId=INSPECTION_8699598",
		dataType: "json"
	})
	.done(function( content ) {
		console.log("success");
		console.log( content );
	})
	.fail(function( jqXHR, textStatus ) {
		console.log(jqXHR.responseText);
		console.log("Request failed: " + textStatus);
	}); 

});