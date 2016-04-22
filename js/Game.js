var allShapes=[];

var mainCharacter;

var moveState=0;
var rotState=0;

var maxRadius=50;
var minRadius=25;

var maxSides=10;
var minSides=3;

var maxSpeed=3.5;
var minSpeed=1;

var maxRot=3.5;
var minRot=-3.5;

var maxX;
var minX=maxRadius;
var ctx;
var c;

var paused=false;
					//character, background, color 1,   color 2,   color 3,   color 4,   color 5
var defaultColor	=["#000000", "#FFFFFF", "#FFC200", "#FF5B00", "#B80028", "#84002E", "#4AC0F2"];
var colorPreset1	=["#FFFFFF", "#000000", "#FF0099", "#F3F315", "#83f52C", "#FF6600", "#6E0DD0"];
var colors=colorPreset1;
var colorMax=6;
var colorMin=2;

class point
{
	constructor(x,y)
	{
		this.x=x;
		this.y=y;
	}
}
class collision
{
	constructor(id,angle,type)
	{
	this.id=id;
	this.angle=angle;
	this.type=type;		//collision with good part of char 0 bad part of char 1
	}
}

function onSegment(p, q, r)
{
    if (q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) &&
        q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y))
       return true;
	   
    return false;
}

function orientation(p, q, r)
{
    // See http://www.geeksforgeeks.org/orientation-3-ordered-points/
    // for details of below formula.
    var val = (q.y - p.y) * (r.x - q.x) -
              (q.x - p.x) * (r.y - q.y);

    if (val == 0) return 0;  // colinear

    return (val > 0)? 1: 2; // clock or counterclock wise
}

function testIntersect(p1, q1, p2, q2)
{
    // Find the four orientations needed for general and
    // special cases
    var o1 = orientation(p1, q1, p2);
    var o2 = orientation(p1, q1, q2);
    var o3 = orientation(p2, q2, p1);
    var o4 = orientation(p2, q2, q1);

    // General case
    if (o1 != o2 && o3 != o4)
        return true;

    // Special Cases
    // p1, q1 and p2 are colinear and p2 lies on segment p1q1
    if (o1 == 0 && onSegment(p1, p2, q1)) return true;

    // p1, q1 and p2 are colinear and q2 lies on segment p1q1
    if (o2 == 0 && onSegment(p1, q2, q1)) return true;

    // p2, q2 and p1 are colinear and p1 lies on segment p2q2
    if (o3 == 0 && onSegment(p2, p1, q2)) return true;

     // p2, q2 and q1 are colinear and q1 lies on segment p2q2
    if (o4 == 0 && onSegment(p2, q1, q2)) return true;

    return false; // Doesn't fall in any of the above cases
}

class mainChar
{
	redraw()
	{
		this.rotSpeed=rotState*this.rotBaseSpeed;
		this.moveSpeed=moveState*this.moveBaseSpeed;
		this.rot=this.rot+this.rotSpeed;
		this.Xpos=this.Xpos+this.moveSpeed;
		if(this.rot>360)
			this.rot-=360;
		if(this.Xpos<-this.length)
			this.Xpos=c.width+this.length;
		if(this.Xpos>c.width+this.length)
			this.Xpos=-this.length;
		
		var p1=new point(this.Xpos-this.length*Math.cos(this.rot*Math.PI/180),this.Ypos-this.length*Math.sin(this.rot*Math.PI/180));
		var p2=new point(this.Xpos-(this.length-this.colisionlength)*Math.cos(this.rot*Math.PI/180),this.Ypos-(this.length-this.colisionlength)*Math.sin(this.rot*Math.PI/180));
		var p3=new point(this.Xpos+(this.length-this.colisionlength)*Math.cos(this.rot*Math.PI/180),this.Ypos+(this.length-this.colisionlength)*Math.sin(this.rot*Math.PI/180));
		var p4=new point(this.Xpos+this.length*Math.cos(this.rot*Math.PI/180),this.Ypos+this.length*Math.sin(this.rot*Math.PI/180));
		
		ctx.strokeStyle=colors[0];
		ctx.beginPath();
		ctx.moveTo(p1.x,p1.y);
		ctx.lineTo(p4.x,p4.y);
		ctx.stroke();
		return [p1,p2,p3,p4];
		/*
		p1	one end
		p2	10 percent in from one end
		p3	10 percent in from other end
		p4  other end
		*/
	}
	constructor()
	{
		
		this.Xpos=c.width/2;
		this.Ypos=c.height-100;
		this.length=50;
		this.colisionlength=10;
		this.rot=0;
		this.rotSpeed=5;
		this.moveSpeed=5;
		this.rotBaseSpeed=3;
		this.moveBaseSpeed=3;
		this.rotSpeed=0;
		this.moveSpeed=0;
		this.moveFlag=0;
		this.rotFlag=0;
		addToRedraw(this);
	}
	updateMoveVal(positionSign, keyFlag)
	{
		this.moveSpeed=this.moveBaseSpeed*positionSign*keyFlag;
	}
	updateRotVal(rotationSign, keyFlag)
	{
		this.rotSpeed=this.rotBaseSpeed*rotationSign*keyFlag;

	}
}

class fallingShape
{
	regularPolygon(centerX, centerY, rot)
	{
		var angle=360/this.sides;
		ctx.fillStyle = this.color;
		var vertex= []; 
		for(var i=0; i<this.sides;i++)
		{
			vertex[i]=new point(centerX+this.radius*Math.cos((Math.PI/180)*(angle*i+rot)),centerY+this.radius*Math.sin((Math.PI/180)*(angle*i+rot)));
		}
		
		ctx.beginPath();
		ctx.moveTo(vertex[0].x,vertex[0].y);
		for(var i=1; i< this.sides; i++)
		{
			ctx.lineTo(vertex[i].x,vertex[i].y);
		}
		ctx.lineTo(vertex[0].x,vertex[0].y);
		ctx.closePath();
		ctx.fill();
		return vertex;
	}
	
	redraw()
	{
		var vertex=this.regularPolygon(this.Xpos,this.Ypos,this.rotation);
		this.rotation=this.rotation+this.rotSpeed;
		this.Ypos+=this.fallSpeed;
		if(this.rotation>=360)
			this.rotation-360;
		if(this.Ypos>c.height+this.radius)
		{
			this.remove(1,0);
		}
		return vertex;
	}
	
	constructor(sides, radius, startX, startY, rotSpeed, fallSpeed, color)
	{
		this.sides=sides;
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
	
	remove(colCount,angle)
	{
		allShapes.splice(allShapes.indexOf(this),1);
		if(colCount!=0||angle>135||angle<45)
			console.log("Bad. Angle: "+angle);
		else
			console.log("Good. Angle: "+angle);
		newShape();
	}
}

function redrawAll()
{
	if(!paused)
	{
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.fillStyle=colors[1];
		ctx.fillRect(0,0,c.width,c.height);
		var charLocation;
		var pushed=false;
		var collisionArray=[];
		for(var i=0; i<allShapes.length;i++)
		{
			pushed=false;
			if(i!=0)
			{
				var vertex=allShapes[i].redraw();
				for(var j=0; j<vertex.length; j++)
				{
					if(testIntersect(vertex[j],vertex[(j+1)%vertex.length], charLocation[0],charLocation[1])||
					testIntersect(vertex[j],vertex[(j+1)%vertex.length], charLocation[2],charLocation[3]))
					{
						if(!pushed)
							collisionArray.push(new collision(i, angleBetweenPoints(vertex[j],vertex[(j+1)%vertex.length], charLocation[0],charLocation[3]),0));
						pushed=true;
					}
					else if(testIntersect(vertex[j],vertex[(j+1)%vertex.length], charLocation[1],charLocation[2]))
					{
						if(!pushed)
							collisionArray.push(collisionArray.push(new collision(i,0,1)));
						pushed=true;
					}
				}
			}
			else
			{
				charLocation=allShapes[0].redraw();
			}
		}
		if(collisionArray.length!=0)
			collisionHandler(collisionArray);
	}
}
function addToRedraw(Shape)
{
	allShapes.push(Shape);
}

function keyPress(KeyState)
{
	var e=e||event;
	
	if(e.keyCode==37)
		rotState= -1*KeyState;
	if(e.keyCode==39)
		rotState= 1*KeyState;
	if(e.keyCode==65||e.keyCode==97)
		moveState= -1*KeyState;
	if(e.keyCode==68||e.keyCode==100)
		moveState=1*KeyState;
}

function keyPress1(KeyState)
{
	var e=e||event;
	switch(e.keyCode)
	{
		case 37: //left
		{	//roation sign, position sign
			mainCharacter.updateRotVal(-1,KeyState);
			break;
		}
		case 39: //right
		{
			mainCharacter.updateRotVal(1,KeyState);
			break;
		}
		case 65://A
		case 97:
		{
			mainCharacter.updateMoveVal(-1,KeyState);
			break;
		}
		case 68://D
		case 100:
		{
			mainCharacter.updateMoveVal(1,KeyState);
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

function gameStart()
{}

function onloadHandler(){
	c=document.getElementById("myCanvas");
	ctx=c.getContext("2d");
	maxX=c.width-maxRadius;
	mainCharacter= new mainChar();
	//by create random number
	var shape_line = [0,0,0,0,0];
	var radius = [0,0,0,0,0];
	var rotspeeds = [0, 0, 0, 0, 0];
	var fallspeeds = [0, 0, 0, 0, 0];
	var i = 0;
	for (i = 0; i < 5; ++i ) {
		shape_line[i] = Math.floor(Math.random() * (7)) + 3;
		radius[i] = Math.floor(Math.random() * (50 - 25 + 1)) + 25;
		rotspeeds[i] = Math.floor(Math.random() * (4)) + 1;
		fallspeeds[i] = Math.floor(Math.random() * (4)) + 1;
	}

	new fallingShape(shape_line[0], radius[0], 60 , 0, rotspeeds[0], fallspeeds[0], "#FFC200");
/*	new fallingShape(shape_line[1], radius[1], 180, 0, rotspeeds[1], fallspeeds[1], "#FF5B00");
	new fallingShape(shape_line[2], radius[2], 300, 0, rotspeeds[2], fallspeeds[2], "#B80028");
	new fallingShape(shape_line[3], radius[3], 420, 0, rotspeeds[3], fallspeeds[3], "#84002E");
	new fallingShape(shape_line[4], radius[4], 540, 0, rotspeeds[4], fallspeeds[4], "#4AC0F2");
/*
	new fallingShape(5, 50, 60, 30, 1, 1, "#FFC200");
	new fallingShape(4, 25, 200, 75, 2, 2, "#FF5B00");
	new fallingShape(3, 25, 260, 25, 3, 3, "#B80028");
	new fallingShape(6, 25, 320, 25, 4, 4, "#84002E");
	new fallingShape(12, 25, 400, 75, 5, 5, "#4AC0F2");
*/
	
	var intervalID= setInterval(redrawAll, 10);
}

function collisionHandler(collisions)
{
	var lastColId=1;
	var colCount=0;
	for(var i=0; i<collisions.length;i++)
	{
		if(lastColId==collisions[i].id&&i+1!=collisions.length)
		{
			colCount+=collisions[i].type;
		}
		else
		{
			if(i-1>=0)
				allShapes[lastColId].remove(colCount,collisions[i-1].angle);
			else
				allShapes[lastColId].remove(colCount,collisions[0].angle);
			colCount=0;
		}
		lastColId=collisions[i].id;
	}
}

function angleBetweenPoints(p1,q1,p2,q2)
{
	var V1= new point(p1.x-q1.x, p1.y-q1.y);
	var V2= new point(p2.x-q2.x, p2.y-q2.y);
	var v1M=Math.sqrt(Math.pow(V1.x,2)+Math.pow(V1.y,2))
	var v2M=Math.sqrt(Math.pow(V2.x,2)+Math.pow(V2.y,2))
	var angle=(Math.acos((V1.x*V2.x+V1.y*V2.y)/(v1M*v2M))*180/Math.PI);
	//console.log(angle);
	return angle;
}

function newShape()
{
		var shape_line = Math.floor(Math.random() * (maxSides-minSides)) + minSides;
		var radius = Math.floor(Math.random() * (maxRadius - minRadius)) + minRadius;
		var rotspeeds = Math.floor(Math.random() * (maxRot-minRot)) + minRot;
		var fallspeeds = Math.floor(Math.random() * (maxSpeed-minSpeed)) + minSpeed;
		var xstartPos = Math.floor(Math.random() * (maxX-minX))+minX;
		var color= colors[Math.floor(Math.random()*(colorMax-colorMin))+colorMin];
		new fallingShape(shape_line, radius, xstartPos, 0, rotspeeds, fallspeeds, color);
}

