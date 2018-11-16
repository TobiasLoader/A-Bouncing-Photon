
var relativeSpeed;
var Pcoor;
var Pspeed;
var colours;

var a;
var s_from_slider;
var s;

var grabbed;
var PLAY;
var hoverWhat;
var xtraM;
var mirrorCoors;
var mirrors;
var store;
var oldDi;

var prevBounce;
var bounceCount;
var bounceStats;

var sliderYConst;
var hold;
var holding;

var cursorType;
var FPS;

function setup() {
	textFont("Arial");
	angleMode(DEGREES);
  W = window.innerWidth;
	H = window.innerHeight;
  canvas = createCanvas(W, H);
  relativeSpeed = 5;

  Pcoor = [W/2,H/2];
  Pspeed = [];

  colours = [color(136, 164, 184),color(250,252,253),color(211, 228, 240)];

  a = 135;
  s_from_slider = 5;
  s = s_from_slider+10;

  grabbed = false;

  PLAY = false;
  once = true;

  hoverWhat = [];

  xtraM = [3*W/8,W/8,5*W/8,W/8];

  mirrorCoors = [
    [{X1:0.2*W,Y1:0.4*H,X2:0.6*W,Y2:0.31*H},0,0,0,0],
    [{X1:0.62*W,Y1:0.3*H,X2:0.81*W,Y2:0.47*H},0,0,0,0],
    [{X1:0.81*W,Y1:0.5*H,X2:0.62*W,Y2:0.81*H},0,0,0,0],
    [{X1:0.6*W,Y1:0.8*H,X2:0.1*W,Y2:0.73*H},0,0,0,0],
    [{X1:0.1*W,Y1:0.7*H,X2:0.19*W,Y2:0.43*H},0,0,0,0],
	];
  mirrors = initMirrors(mirrorCoors);
  oldDi = [W,H];
  
	bounceCount = 0;
	bounceStats = [0,0,0,0,1000000,0]; // [totalNum of tries, num of tries since last edit, total num bounces, num bounces since last edit, min, max]
  
  sliderYConst = H-20;
  hold = false;
  holding = false;
  cursorType = "default";
  FPS = 60;
 }

function draw() {
	frameRate(FPS);
	textAlign(CENTER,CENTER);
	textSize(17);
	cursorType = "default";
  hoverNode();
  background(colours[1]);
  createMirrorScene();
  pause();
  addMirror();
	relativeSpeed = slider(relativeSpeed,30,0,"Vel");
	s_from_slider = slider(s_from_slider,75,1,"Size");
	s = s_from_slider+10;
	bounceCountDisplay();
	cursor(cursorType);
}

function initMirrors(Mi){
    var o = Mi;
    for (var m=0; m<Mi.length; m+=1){
        store = {X1:0,Y1:0,X2:0,Y2:0};
        if (Mi[m][0].X1<Mi[m][0].X2){
            store.X1 = Mi[m][0].X1-s;
            store.X2 = Mi[m][0].X2+s;
        } else {
            store.X1 = Mi[m][0].X2-s;
            store.X2 = Mi[m][0].X1+s;
        }
        
        if (Mi[m][0].Y1<Mi[m][0].Y2){
            store.Y1 = Mi[m][0].Y1-s;
            store.Y2 = Mi[m][0].Y2+s;
        } else {
            store.Y1 = Mi[m][0].Y2-s;
            store.Y2 = Mi[m][0].Y1+s;
        }
        o[m][1] = store;
        o[m][2] =(Mi[m][0].Y2-Mi[m][0].Y1)/(Mi[m][0].X2-Mi[m][0].X1);
        o[m][3] = atan(Mi[m][2]);
        o[m][4] = (Mi[m][0].Y1) - (Mi[m][0].X1*Mi[m][2]);
    }
    
    return o;
}
function mirror(c,c2,M,A,C,i){
/*
	  if ((approx(Pcoor[0],c.X1,s/2) && approx(Pcoor[1],c.Y1,s/2)) || (approx(Pcoor[0],c.X2,s/2) && approx(Pcoor[1],c.Y2,s/2))){
		  a = a+180;
		} else {
*/
	    if (prevBounce!==i+1 && Pcoor[0]>c2.X1 && Pcoor[0]<c2.X2 && Pcoor[1]>c2.Y1 && Pcoor[1]<c2.Y2){
	      if (c.X1 !== c.X2 && c.Y1 !== c.Y2){
	          var xShift = (s/2)*cos(atan(-1/M));
	          var yShift = (s/2)*sin(atan(-1/M));
	          var con1 = Pcoor[1] < (M*Pcoor[0])+C+(yShift-M*xShift);
	          var con2 = Pcoor[1] > (M*Pcoor[0])+C-(yShift-M*xShift);
	          if (((con1 && con2 && M<=0)||(!con1 && !con2 && M>0))) {
	              a = (2*A)-a;
	              prevBounce = i+1;
	              bounceCount += 1;
	          }
	      }
	      if (c.X1 === c.X2 && Pcoor[0]>c.X1-s/2 && Pcoor[0]<c.X1+s/2){
	          a = 180-a;
	          prevBounce = i+1;
	          bounceCount += 1;
	      }
	      if (c.Y1 === c.Y2 && Pcoor[1]>c.Y1-s/2 && Pcoor[1]<c.Y1+s/2){
	          a = -a;
	          prevBounce = i+1
	          bounceCount += 1;
	      }
	    }
// 		}
    fill(colours[1]);
    line(c.X1,c.Y1,c.X2,c.Y2);
    fill(colours[1]);
    ellipse(c.X1,c.Y1,s/2,s/2);
    ellipse(c.X2,c.Y2,s/2,s/2);
}
function ball(X,Y){
    fill(colours[2]);
    strokeWeight(1);
    stroke(colours[0]);
    ellipse(X,Y,s,s);
    
    if (Pcoor[0]<0 || Pcoor[0]>width || Pcoor[1]<0 || Pcoor[1]>height){
      ballOut(true);
    } else {
	    FPS = 60;
    }
}

function ballOut(t){
	Pcoor = [W/2,H/2];
  a = random(0,360);
  prevBounce = false;
  bounceStats[0] += 1;
  bounceStats[1] += 1;
  bounceStats[2] += bounceCount;
  bounceStats[3] += bounceCount;
  if (bounceStats[4] > bounceCount){
	  bounceStats[4] = bounceCount;
  }
  if (bounceStats[5] < bounceCount){
	  bounceStats[5] = bounceCount;
  }
  bounceCount = 0;
  if (t){
  	FPS = 1;
  }
}

function pause(){
    stroke(red(colours[0]),green(colours[0]),blue(colours[0]),200);
    fill(colours[2]);
    rect(-3,-3,63,63,2);
    fill(colours[1]);
    if (PLAY){
        rect(16,15,8,30);
        rect(35,15,8,30);
    } else {
        triangle(20,15,20,45,45,30);
    }
    
    if (mouseX<60 && mouseY<60){
        cursorType = "pointer";
    }
}
function addMirror(){
    stroke(red(colours[0]),green(colours[0]),blue(colours[0]),200);
    fill(colours[2]);
    rect(W-60,-3,63,63,2);
    fill(colours[1]);
//     noStroke();
    beginShape();
    vertex(W-32.5,15);
    vertex(W-27.5,15);
    vertex(W-27.5,27.5);
    vertex(W-15,27.5);
    vertex(W-15,32.5);
    vertex(W-27.5,32.5);
    vertex(W-27.5,45);
    vertex(W-32.5,45);
    vertex(W-32.5,32.5);
    vertex(W-45,32.5);
    vertex(W-45,27.5);
    vertex(W-32.5,27.5);
    vertex(W-32.5,15);
    endShape();
    if (mouseX>W-60 && mouseY<60){
        cursorType = "pointer";
    }
}
function createMirrorScene(){
    noStroke();
    fill(150,150,150,20);
    ellipse(W/2,H/2,20,20);
    if (dist(mouseX,mouseY,W/2,H/2)<10){
				cursorType = "pointer";
		}
    if (PLAY){
        Pspeed = [relativeSpeed*cos(a),relativeSpeed*sin(a)];
        Pcoor[0] += Pspeed[0];
        Pcoor[1] += Pspeed[1];
    }    
    ball(Pcoor[0],Pcoor[1]);
    for (var m=0; m<mirrors.length; m+=1){
        mirror(mirrors[m][0],mirrors[m][1],mirrors[m][2],mirrors[m][3],mirrors[m][4],m);    
    }
    if (false){
        println(mirrors[0][2]);    
    }
}
function hoverNode(){
    for (var i=0; i<mirrors.length; i+=1){
        if (!grabbed && dist(mouseX,mouseY,mirrorCoors[i][0].X1,mirrorCoors[i][0].Y1)<7){
            cursorType = "grab";
            if (mouseIsPressed){
                grabbed = true;
                hoverWhat = [i,1];
            }
        }
        if (!grabbed && dist(mouseX,mouseY,mirrorCoors[i][0].X2,mirrorCoors[i][0].Y2)<7){
            cursorType = "grab";
            if (mouseIsPressed){
                grabbed = true;
                hoverWhat = [i,2];
            }
        }
    }
    if (grabbed){
        PLAY = false;
        bounceStats[1] = 0;
	      bounceStats[3] = 0;
        cursorType = "grabbing";
        if (hoverWhat[1]===1){
            mirrorCoors[hoverWhat[0]][0].X1 = mouseX;
            mirrorCoors[hoverWhat[0]][0].Y1 = mouseY;
        } else if (hoverWhat[1]===2){
            mirrorCoors[hoverWhat[0]][0].X2 = mouseX;
            mirrorCoors[hoverWhat[0]][0].Y2 = mouseY;
        }
        if (!mouseIsPressed){
        	grabbed = false;
        	mirrors = initMirrors(mirrorCoors);
				}
    }
}
function slider(v,x,i,TXT){
	var Ypos = -6*v+sliderYConst;
	stroke(colours[0]);
	fill(colours[2]);
	triangle(x,sliderYConst-60,x-10,Ypos,x+10,Ypos);
	triangle(x,sliderYConst,x-10,Ypos,x+10,Ypos);
	fill(colours[1]);
	ellipse(x,Ypos,20,20);
	arc(x,Ypos,10,10,0,80);
	
	if (!holding){
		if (dist(mouseX,mouseY,x,-6*v+sliderYConst)<10 && mouseY>sliderYConst-60 && mouseY<sliderYConst){
			cursorType = "ns-resize";
			if (mouseIsPressed){
				hold = true;
				holding = i+1;
			}
		} else if (dist(mouseX,mouseY,x,-6*v+sliderYConst)<10 && !hold[i]) {
			cursorType = "ns-resize";
		}
	}
	if (TXT){
		fill(colours[0]);
		noStroke();
		text(TXT,x,sliderYConst-80);
	}
	if (!mouseIsPressed){
		hold = false;
		holding = false;
	}
	if (hold && holding === i+1){
		cursorType = "ns-resize";
		if (mouseY<sliderYConst-60){
			return 10;
		}
		else if (mouseY>sliderYConst){
			return 0;
		}
		return sliderYConst/6-mouseY/6;
	}
	return v;
}
function bounceCountDisplay(){
	stroke(red(colours[0]),green(colours[0]),blue(colours[0]),200);
  fill(colours[2]);
  rect(W-60,H-60,63,63,2);
  fill(colours[1]);
  textSize(30);
  text(bounceCount,W-30,H-30);
  if (mouseX>W-60 && mouseY>H-60 && bounceStats[0]){
      cursorType = "pointer";
  }
}

function mouseReleased(){
    if (grabbed){
        mirrors = initMirrors(mirrorCoors);
        grabbed = false; 
    }
}
function mouseClicked(){
  if (mouseX<60 && mouseY<60){
      if (PLAY){
          PLAY = false;
      } else {
          PLAY = true;
      }
  }
  if (mouseX>W-60 && mouseY<60){
      mirrorCoors.push([{X1:xtraM[0],Y1:xtraM[1],X2:xtraM[2],Y2:xtraM[3]},0,0,0,0]);
      // println(mirrorCoors[5]);
      mirrors = initMirrors(mirrorCoors);
  }
  if (dist(mouseX,mouseY,W/2,H/2)<10){
	  if (PLAY){
	  	ballOut(true);
	  }
	  if (!PLAY) {
		  ballOut();
	    PLAY = true;
    }
  }
  if (mouseX>W-60 && mouseY>H-60 && bounceStats[0]){
	  alert("Current bounce count: " + str(bounceCount) +
	  			"\nTotal Average since page load: " + str(round(100*bounceStats[2]/bounceStats[0])/100) + 
	  			"\nAverage since last edit: " + str(round(100*bounceStats[3]/bounceStats[1])/100) +
	  			"\nMinimum bounce number: " + str(bounceStats[4]) +
	  			"\nMaximum bounce number: " + str(bounceStats[5]));
 	}
}

window.onresize = function() {
  resizeCanvas(windowWidth, windowHeight);
  W = windowWidth;
  H = windowHeight
  mirrorCoors = [
    [{X1:0.2*W,Y1:0.4*H,X2:0.6*W,Y2:0.3*H},0,0,0,0],
    [{X1:0.6*W,Y1:0.3*H,X2:0.8*W,Y2:0.5*H},0,0,0,0],
    [{X1:0.8*W,Y1:0.5*H,X2:0.6*W,Y2:0.8*H},0,0,0,0],
    [{X1:0.6*W,Y1:0.8*H,X2:0.1*W,Y2:0.7*H},0,0,0,0],
    [{X1:0.1*W,Y1:0.7*H,X2:0.2*W,Y2:0.4*H},0,0,0,0],
	];
  mirrors = initMirrors(mirrorCoors);
  Pcoor[0] = W*(Pcoor[0]/oldDi[0]);
  Pcoor[1] = H*(Pcoor[1]/oldDi[1]);
	oldDi = [W,H];
	sliderYConst = H-20;
}

