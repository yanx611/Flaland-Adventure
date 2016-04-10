var allShapes=[];
var mainCharacter;


class mainChar
{
	redraw(canvas)
	{
		this.ctx.strokeStyle="#000000";
		this.ctx.beginPath();
		this.ctx.moveTo(this.Xpos-this.length*Math.cos(this.rot*Math.PI/180),this.Ypos-this.length*Math.sin(this.rot*Math.PI/180));
		this.ctx.lineTo(this.Xpos+this.length*Math.cos(this.rot*Math.PI/180),this.Ypos+this.length*Math.sin(this.rot*Math.PI/180));
		this.ctx.stroke();
	}
	constructor(canvas, context)
	{
		this.canvas=canvas;
		this.ctx=context;
		this.Xpos=this.canvas.width/2;
		this.Ypos=this.canvas.height-100;
		this.length=50;
		this.rot=0;
		this.rotSpeed=5;
		this.moveSpeed=5;
		addToRedraw(this);
	}

	updateVals(rotationSign, positionSign)
	{
		this.rot+=this.rotSpeed*rotationSign;
		this.Xpos+=this.moveSpeed*positionSign;
		if(this.rot>360)
			this.rot-=360;
	}
}

class fallingShape
{
	regularPolygon(centerX, centerY, rot)
	{
		var angle=360/this.sides;
		this.ctx.fillStyle = this.color;
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

	redraw(canvas)
	{
		this.regularPolygon(this.Xpos,this.Ypos,this.rotation);
		this.rotation=this.rotation+this.rotSpeed;
		this.Ypos+=this.fallSpeed;
		if(this.rotation>=360)
			this.rotation-360;
		if(this.Ypos>canvas.height+this.radius)
			this.Ypos=-this.radius;

	}

	constructor(sides, ctx, radius, startX, startY, rotSpeed, fallSpeed, color)
	{
		this.sides=sides;
		this.ctx=ctx;
		this.radius=radius;
		this.Xpos=startX;
		this.Ypos=startY;
		this.rotSpeed=rotSpeed;
		this.rotation=0;
		this.X=0;
		this.Y=1;
		this.color=color;
		this.fallSpeed=fallSpeed;
		addToRedraw(this);
	}
}

function redrawAll(canvas,ctx)
{
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	for(var i=0; i<allShapes.length;i++)
	{
		allShapes[i].redraw(canvas);
	}
}
function addToRedraw(Shape)
{
	allShapes.push(Shape);
}


function keyPress()
{
	var e=e||event;
	switch(e.keyCode)
	{
		case 37: //left
		{	//roation sign, position sign
			mainCharacter.updateVals(-1,0);
			break;
		}
		case 39: //right
		{
			mainCharacter.updateVals(1,0);
			break;
		}
		case 65:
		{
			mainCharacter.updateVals(0,-1);
			break;
		}
		case 68:
		{
			mainCharacter.updateVals(0,1);
			break;
		}
		case 38: //up
		case 40: //down
		default:
		{
			break;
		}
	}
}


function onloadHandler(){
	var c=document.getElementById("myCanvas");
	var ctx=c.getContext("2d");
	//by create random number
	var shape_line = [0,0,0,0,0];
	var radius = [0,0,0,0,0];
	var rotspeeds = [0, 0, 0, 0, 0];
	var fallspeeds = [0, 0, 0, 0, 0];
	var i = 0;
	for (i = 0; i < 5; ++i ) {
		shape_line[i] = Math.floor(Math.random() * (10)) + 1;
		radius[i] = Math.floor(Math.random() * (50 - 25 + 1)) + 25;
		rotspeeds[i] = Math.floor(Math.random() * (4)) + 1;
		fallspeeds[i] = Math.floor(Math.random() * (4)) + 1;
	}
	new fallingShape(shape_line[0], ctx, radius[0], 60, 0, rotspeeds[0], fallspeeds[0], "#FFC200");
	new fallingShape(shape_line[1], ctx, radius[1], 180, 0, rotspeeds[1], fallspeeds[1], "#FF5B00");
	new fallingShape(shape_line[2], ctx, radius[2], 300, 0, rotspeeds[2], fallspeeds[2], "#B80028");
	new fallingShape(shape_line[3], ctx, radius[3], 420, 0, rotspeeds[3], fallspeeds[3], "#84002E");
	new fallingShape(shape_line[4], ctx, radius[4], 540, 0, rotspeeds[4], fallspeeds[4], "#4AC0F2");
/*
	new fallingShape(5, ctx, 50, 60, 30, 1, 1, "#FFC200");
	new fallingShape(4, ctx, 25, 200, 75, 2, 2, "#FF5B00");
	new fallingShape(3, ctx, 25, 260, 25, 3, 3, "#B80028");
	new fallingShape(6, ctx, 25, 320, 25, 4, 4, "#84002E");
	new fallingShape(12, ctx, 25, 400, 75, 5, 5, "#4AC0F2");
*/
	var intervalID= setInterval(redrawAll, 10,c,ctx);
	mainCharacter= new mainChar(c,ctx);

}
