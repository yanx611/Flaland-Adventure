function displayContent(selector){
	v = $(selector).val();
	if(v =="+"){
		$(".nav").show();
		$(".subnav").hide();
		$(":button").val("-");
	} else if (v =="-"){
		$(".nav").hide();
		$(":button").val("+");
	} else{
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
    $(":button").click(function(){
    	displayContent(":button");
    });
    $("#about").click(function(){
    	displayContent("#about");
    });
    $("#setting").click(function(){
    	displayContent("#setting");
    });
});