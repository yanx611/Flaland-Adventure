var allShapes=[];

var level;
var score;
var mainCharacter;
var timeSinceLastShape;
var health;
var moveState;
var rotState;
var maxShapes;
var maxRadius;
var minRadius;
var maxSides;
var minSides;
var startSpeed;
var maxRot;
var minRot;
var angleTolerance;
var maxX;
var minX=maxRadius;
var ctx;
var c;
var gameOverState;

var inverted=false;

var maxSidesA=[12,12,12,11,10,9,7,6,5,4,3,2];
var minSidesA=[12,11,9,8,7,6,5,4,3,2,2,2];
var shapesOnScreen=[6,6,6,5,5,5,4,4,4,3,2,2]


var paused=false;
					//character, background, color 1,   color 2,   color 3,   color 4,   color 5
var defaultColor	=["#000000", "#F2F5E9", "#FFC200", "#FF5B00", "#B80028", "#84002E", "#4AC0F2"];
var colorPreset1	=["#000000", "#F2F5E9", "#00FF66", "#0C0CEA", "#7C0AD3", "#0099FF", "#91F22F"];
var colorPreset2	=["#000000", "#F2F5E9", "#000000", "#000000", "#000000", "#000000", "#000000"];
var colorPreset3	=["#000000", "#F2F5E9", "#28be9b", "#92dce0", "#609194", "#ef9950", "#d79c8c"];
var colorPreset4	=["#000000", "#F2F5E9", "#f17d80", "#737495", "#68a8ad", "#c4d4af", "#6c8672"];
var colorPreset5	=["#000000", "#F2F5E9", "#fe9601", "#cc0063", "#86269b", "#00d2f1", "#00b796"];

var colorSet=[defaultColor, colorPreset1,colorPreset2,colorPreset3,colorPreset4,colorPreset5];
var colors=defaultColor;
var colorMax=6;
var colorMin=2;

$(document).ready(function() {
	setThe();
	checkinvert();
});

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

		ctx.strokeStyle=(inverted)? colorInverter(colors[0]):colors[0];
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
		if(gameOverState)
		{
			this.color=colorInverter(this.color);
			ctx.fillStyle=this.color;
		}
		else
		{
			ctx.fillStyle = (inverted)? colorInverter(this.color):this.color;
		}
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

	line(centerX,centerY,rot)
	{
		if(gameOverState)
		{
			this.color=colorInverter(this.color);
			ctx.fillStyle=this.color;
		}
		else
		{
			ctx.fillStyle = (inverted)? colorInverter(this.color):this.color;
		}
		var p1=new point(centerX+this.radius*Math.cos(rot*Math.PI/180),centerY+this.radius*Math.sin(rot*Math.PI/180));
		var p2=new point(centerX-this.radius*Math.cos(rot*Math.PI/180),centerY-this.radius*Math.sin(rot*Math.PI/180));
		ctx.beginPath();
		ctx.moveTo(p1.x,p1.y);
		ctx.lineTo(p2.x,p2.y);
		ctx.stroke();
		return [p1,p2];
	}

	redraw()
	{
		if (this.sides>2)
			var vertex=this.regularPolygon(this.Xpos,this.Ypos,this.rotation);
		else
			var vertex=this.line(this.Xpos,this.Ypos,this.rotation);
		this.rotation=this.rotation+this.rotSpeed;
		this.Ypos+=this.fallSpeed;
		if(this.rotation>=360)
			this.rotation-360;
		if(this.Ypos>c.height+this.radius)
		{
			this.remove(1,0,true);
		}
		return vertex;
	}

	constructor(sides, radius, startX, rotSpeed, fallSpeed, color)
	{
		this.sides=sides;
		this.radius=radius;
		this.Xpos=startX;
		this.Ypos=-radius;
		this.rotSpeed=rotSpeed;
		this.rotation=0;
		this.X=0;
		this.Y=1;
		this.color=color;
		this.fallSpeed=fallSpeed;
		addToRedraw(this);
	}

	remove(colCount,angle, offScreen)
	{
		allShapes.splice(allShapes.indexOf(this),1);
		if((colCount!=0||angle>90+angleTolerance||angle<90-angleTolerance)&&!offScreen)
			badShapeRemoval(this.radius,this.sides);
		else if(!offScreen)
			goodShapeRemoval(this.radius,this.sides);
		else
			neutralRemoval();
	}
}

function redrawAll()
{
	if(!paused&&!gameOverState)
	{
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.fillStyle= (inverted)? colorInverter(colors[1]):colors[1];
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

		if(((allShapes.length-1)<maxShapes)&&(timeSinceLastShape>=800))
		{
			newShape();
			timeSinceLastShape=0;
		}
		else
			timeSinceLastShape+=10;
	}
	else if (gameOverState)
	{
		ctx.clearRect(0, 0, c.width, c.height);
		ctx.fillStyle= (inverted)? colorInverter(colors[1]):colors[1];
		ctx.fillRect(0,0,c.width,c.height);
		for(var i=0; i<allShapes.length;i++)
		{
			var vertex=allShapes[i].redraw();
		}
		ctx.font = "30px Arial";
		ctx.fillStyle = "red";
		ctx.textAlign = "center";
		ctx.strokeText("Game Over",c.width/2,c.height/2);
		if(((allShapes.length-1)<maxShapes)&&(timeSinceLastShape>=250))
		{
			newShape();
			timeSinceLastShape=0;
		}
		else
			timeSinceLastShape+=10;
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
	if(e.keyCode==27&&KeyState)
		pause(!paused);


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
		break;
		case 38: //up
		case 40: //down
		default:
		{
			break;
		}
	}
}

function gameStart()
{
	level=0;
	score=0;
	timeSinceLastShape=0;
	health=100;
	moveState=0;
	rotState=0;
	maxRadius=45;
	minRadius=25;
	maxRot=1.25;
	minRot=-1.25;
	angleTolerance=45;
	minX=maxRadius;
	document.getElementById("health").style.width =100+'%';
	maxX=c.width-maxRadius;
	allShapes=[]
	mainCharacter= new mainChar();
	levelUp();
	pause(true);
	newShape();
	var intervalID= setInterval(redrawAll, 10);
}

function onloadHandler(){
	c=document.getElementById("myCanvas");
	ctx=c.getContext("2d");
	gameStart();

}

function levelUp()
{
	if(level!=-1)
	{
		level++;
		if(level<=12)
		{
			maxSides=maxSidesA[level-1];
			minSides=minSidesA[level-1];
			maxShapes=shapesOnScreen[level-1];
		}

		startSpeed = 0.1*level+1;
		document.getElementById("level").innerHTML="Level<br>"+level;

	}
	else
	{
		maxSides=12;
		minSides=2;
		maxShapes=7;
		startSpeed=4;
	}
}

function collisionHandler(collisions)
{
	var lastColId=collisions[0].id;
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
			{
				allShapes[lastColId].remove(colCount,collisions[i-1].angle,false);
			}
			else
			{
				allShapes[lastColId].remove(colCount,collisions[0].angle,false);

			}
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
	return angle;
}

function newShape()
{
		var shape_line = Math.floor(Math.random() * (maxSides-minSides)) + minSides;
		var radius = Math.random() * (maxRadius - minRadius) + minRadius;
		var rotspeeds = Math.random() * (maxRot-minRot) + minRot;
		var fallspeeds = startSpeed;
		var xstartPos = Math.floor(Math.random() * (maxX-minX))+minX;
		var color= colors[Math.floor(Math.random()*(colorMax-colorMin))+colorMin];
		new fallingShape(shape_line, radius, xstartPos, rotspeeds, fallspeeds, color);
}

function setThe() {
	$("input[name='theme']").on("click", function() {
		var themenum = parseInt($(this).val());
		setTheme(themenum);
	});
}

function setTheme(theme)
{
	var colorVal=theme;
	colorVal= (colorVal>5)? 5:colorVal;
	colorVal= (colorVal<0)? 0:colorVal;
	colors=colorSet[colorVal];
}

function pause(pauseVal)
{
	paused=pauseVal;
}


function badShapeRemoval(rad,sides)
{
	health=Math.floor(health-(13-sides)*rad*0.025);
	health=(health<0)? 0:health;
	document.getElementById("health").style.width =health+'%';
	(health<=0)? gameOver():0;
	if (health >= 0) $("#healthval").text(Math.floor(health));
	else $("#healthval").text(Math.floor(0));
}
function goodShapeRemoval(rad,sides)
{
	score+=Math.floor(level*12+(12-sides)*10+(maxRadius-rad)*5);
	if(score>=level*2500)
		levelUp();
	document.getElementById("score").innerHTML="Score<br>"+score;
	document.getElementById("progress").style.width=Math.floor(100*(score-(level-1)*2500)/(2500))+"%";
	if (score >= 0) $("#progressval").text(Math.floor(100*(score-(level-1)*2500)/(2500)));
	else $("#progressval").text(0);

}

function neutralRemoval()
{}


function gameOver()
{
	if(!gameOverState)
	{
		gameOverState=true;
		allShapes=[];
		level=-1;
		levelUp();
		console.log("GameOver")
	}
}

function colorInverter(color)
{
	var returnVal=((255-parseInt(color.substr(1,2),16))<<16)+((255-parseInt(color.substr(3,2),16))<<8)+(255-parseInt(color.substr(5,2),16));
	returnVal=returnVal.toString(16)
	while(returnVal.length<6)
		returnVal="0"+returnVal;

	return "#"+returnVal;
}

function invertColors(invert)
{
	inverted=invert;
}

function checkinvert() {
	$("input[name='invt']").on("click", function() {
		if($("#inv").is(':checked')) invertColors(true);
		else invertColors(false);
	});
}
