
var relativeSpeed;
var Pcoor;
var Pspeed;
var colours;

var a;
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

function approx(A,B,n){
	if (A-n<B && A+n>B){
		return true;
	}
	return false;
}

function setup() {
  W = window.innerWidth;
	H = window.innerHeight;
  canvas = createCanvas(W, H);
  relativeSpeed = 2;

  Pcoor = [W/2,H/2];
  Pspeed = [];

  colours = [color(136, 164, 184),color(250,252,253),color(211, 228, 240)];

  a = 135;
  s = 10;

  grabbed = false;

  PLAY = false;
  once = true;

  hoverWhat = [];

  xtraM = [3*W/8,W/8,5*W/8,W/8];

  mirrorCoors = [
    [{X1:0.2*W,Y1:0.4*H,X2:0.6*W,Y2:0.3*H},0,0,0,0],
    [{X1:0.6*W,Y1:0.3*H,X2:0.8*W,Y2:0.5*H},0,0,0,0],
    [{X1:0.8*W,Y1:0.5*H,X2:0.6*W,Y2:0.8*H},0,0,0,0],
    [{X1:0.6*W,Y1:0.8*H,X2:0.1*W,Y2:0.7*H},0,0,0,0],
    [{X1:0.1*W,Y1:0.7*H,X2:0.2*W,Y2:0.4*H},0,0,0,0],
	];
  mirrors = initMirrors(mirrorCoors);
  oldDi = [W,H];
}

function draw() {
	cursor("default");
  hoverNode();
  background(colours[1]);
  createMirrorScene();
  pause();
  addMirror();
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
	    if (prevBounce!==i+1 && Pcoor[0]>c2.X1-s/2 && Pcoor[0]<c2.X2+s/2 && Pcoor[1]>c2.Y1-s/2 && Pcoor[1]<c2.Y2+s/2){
	      if (c.X1 !== c.X2 && c.Y1 !== c.Y2){
	          var xShift = (s/2)*cos(atan(-1/M));
	          var yShift = (s/2)*sin(atan(-1/M));
	          var con1 = Pcoor[1] < (M*Pcoor[0])+C+(yShift-M*xShift);
	          var con2 = Pcoor[1] > (M*Pcoor[0])+C-(yShift-M*xShift);
	          if (((con1 && con2 && M<=0)||(!con1 && !con2 && M>0))) {
	              a = (2*A)-a;
	              prevBounce = i+1;
	          }
	      }
	      if (c.X1 === c.X2 && Pcoor[0]>c.X1-s/2 && Pcoor[0]<c.X1+s/2){
	          a = 180-a;
	          prevBounce = i+1;
	      }
	      if (c.Y1 === c.Y2 && Pcoor[1]>c.Y1-s/2 && Pcoor[1]<c.Y1+s/2){
	          a = -a;
	          prevBounce = i+1
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
        Pcoor = [W/2,H/2];
        a = random(0,360);
        prevBounce = false;
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
        cursor("pointer");
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
        cursor("pointer");
    }
}
function createMirrorScene(){
    noStroke();
    fill(150,150,150,20);
    ellipse(W/2,H/2,20,20);
    
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
            cursor("grab");
            if (mouseIsPressed){
                grabbed = true;
                hoverWhat = [i,1];
            }
        }
        if (!grabbed && dist(mouseX,mouseY,mirrorCoors[i][0].X2,mirrorCoors[i][0].Y2)<7){
            cursor("grab");
            if (mouseIsPressed){
                grabbed = true;
                hoverWhat = [i,2];
            }
        }
    }
    if (grabbed){
        PLAY = false;
        cursor("grabbing");
        if (hoverWhat[1]===1){
            mirrorCoors[hoverWhat[0]][0].X1 = mouseX;
            mirrorCoors[hoverWhat[0]][0].Y1 = mouseY;
        } else if (hoverWhat[1]===2){
            mirrorCoors[hoverWhat[0]][0].X2 = mouseX;
            mirrorCoors[hoverWhat[0]][0].Y2 = mouseY;
        }
    }
    if (!mouseIsPressed){
        grabbed = false;
        mirrors = initMirrors(mirrorCoors);
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
}

