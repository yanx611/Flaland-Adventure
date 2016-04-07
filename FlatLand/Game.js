
class fallingShape
{
	regularPolygon(centerX, centerY, rot)
	{
		var angle=360/this.sides;
		this.ctx.fillStyle = "#00FF00";
		var vertex= [[]]; 	//1st spot is which vertex, second is x or y

		for(var i=0; i<this.sides;i++)
		{
			if (!vertex[i]) 
			{
				vertex[i] = [];
			}
			vertex[i][this.X]=centerX+this.radius*Math.cos((Math.PI/180)*(angle*i+rot));
			vertex[i][this.Y]=centerY+this.radius*Math.sin((Math.PI/180)*(angle*i+rot));
		}
		
		this.ctx.beginPath();
		this.ctx.moveTo(vertex[0][this.X],vertex[0][this.Y]);
		for(var i=1; i< this.sides; i++)
		{
			this.ctx.lineTo(vertex[i][this.X],vertex[i][this.Y]);
		}
		this.ctx.lineTo(vertex[0][this.X],vertex[0][this.Y]);
		this.ctx.closePath();
		this.ctx.fill();
	}
	
	redraw(local)
	{
		local.ctx.clearRect(0, 0, 300/*this.canvas.width*/, 150/*this.canvas.height*/);
		local.regularPolygon(30,30,local.rotation);
		local.rotation=local.rotation+5;
	}
	
	constructor(sides, canvas, ctx, radius, startX, startY)
	{
		this.sides=sides;
		this.canvas=canvas
		this.ctx=ctx;
		this.radius=radius;
		this.startX=startX;
		this.startY=startY;
		this.rotation=0;
		this.X=0;
		this.Y=1;
		var intervalID= setInterval(this.redraw, 20,this);
		//var intervalID = setInterval(function(){alert("Interval reached");}, 5000);
	}

}


function onloadHandler(){
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	new fallingShape(5, c, ctx, 25, 30, 30);
}
