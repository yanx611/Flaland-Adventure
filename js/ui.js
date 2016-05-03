function displayContent(selector){
	v = $(selector).children();
	if(v.hasClass("fa-pause")){
		v.removeClass("fa-pause");
		v.addClass("fa-play");
		$(".nav").show();
		$(".subnav").hide();
	} else if(v.hasClass("fa-play")){
		$(".nav").hide();
		$(".subnav").hide();
		v.removeClass("fa-play");
		v.addClass("fa-pause");
		$(selector).attr("onclick",pause(false));
	} else {
		if (selector =="#about"){
			$(".subnav").hide();
			$("#instruction").show();
		}else if (selector =="#setting"){
			$(".subnav").hide();
			$("#setchange").show();
		}
	}
}


$(document).ready(function(){
    $(".nav").hide();
    $("#button").click(function(){
    	displayContent("#button");
    });
    $("#about").click(function(){
    	displayContent("#about");
    });
    $("#setting").click(function(){
    	displayContent("#setting");
    });
});