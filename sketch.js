var canzone;
var immagineStelle;
var analyzer;
var volume;
var posizioneStelle=0;
var velocitaAsteroidi=0;
var volumeNormalizzato;
var spriteNavicella;
var spriteAsteroide;
var navicella;
var asteroidi=[];
var raggioNavicella=20;
var raggioAsteroide=25;
var timerAsteroide=0;
var intervalloAsteroide=50;
var perso=false;
var arrayScie=[];
var arrayEsplosione=[];
var myLerp=0;

var posXNavicella,posYNavicella=400;

function preload()
{
  immagineStelle=loadImage("./assets/Starryx3.png");
  spriteNavicella=loadImage("./assets/Navicella.png");
  spriteAsteroide=loadImage("./assets/Asteroide.png");
  canzone=loadSound("./assets/Deep_Sky_Blue.mp3");
  
}

function setup() {
  
  createCanvas(500,500);
  frameRate(60);
  analyzer=new p5.Amplitude();
  analyzer.setInput(canzone);

  canzone.play();
  angleMode(DEGREES);
  navicella=new Navicella();
  noStroke();
  
}

function draw() {
  background(0);
  volume=analyzer.getLevel();
  volumeNormalizzato=volume*2;
 
  posizioneStelle+=5*(1+volumeNormalizzato*2);
  velocitaAsteroidi=8*(1+volumeNormalizzato);


  push();
  if(posizioneStelle>0)
  posizioneStelle=-500;
  if(volume>0)
  translate(0, posizioneStelle);
  image(immagineStelle,0,0,width,height*3);
  pop();

  if(!perso)
  {
  navicella.display();
  //Troppo pesante performance?
  //navicella.scia();  
  }
else
{
  for(var i=0;i<arrayEsplosione.length;i++)
  {
    arrayEsplosione[i].display();
  }
}
  
  
  if(volume>0.15)
  if(timerAsteroide<intervalloAsteroide)
  {
    timerAsteroide+=(volumeNormalizzato*10);
  }
  else
  {
    spawnaAsteroide();
    timerAsteroide=0;
  }

    for(var i=0;i<asteroidi.length;i++)
    {
    asteroidi[i].display();
    }

  fill(255,255,255,(volumeNormalizzato)*50);
  rect(0,0,width,height);
  

  if(perso)
  {
    if(myLerp<=1)
    myLerp+=0.01;

    if(myLerp>1)
    myLerp=1;

    velocitaAsteroidi=0;
    canzone.rate(1-myLerp);
    fill(0,0,0,myLerp*255);
    rect(0,0,width,height);

    if(myLerp==1)
    {fill(255);
      textSize(32);
      textAlign(CENTER);
      text("GAME OVER", width/2, height/2);
      textSize(20);
      text("Refresh to replay", width/2, height/2+50);
    }

  }
  




}

function spawnaAsteroide()
{

  var xSpawn=random(raggioAsteroide,500-raggioAsteroide);
  var asteroide=new Asteroide(xSpawn);
  asteroidi.push(asteroide);


}

function Asteroide(_x)
{
  this.x=_x;
  this.y=-50;
  this.rotazioneIniziale=random(0, 360);
  

  this.display=function()
  {
    push();
    this.y+=velocitaAsteroidi;
   translate(_x,this.y-raggioAsteroide);
   rotate(this.rotazioneIniziale+frameCount*.35);

    image(spriteAsteroide,-raggioAsteroide,0,raggioAsteroide*2,raggioAsteroide*2);
   
    //Collisione
    if(!perso)
    if(((_x>posXNavicella-raggioNavicella) && (_x<posXNavicella+raggioNavicella))&& ((this.y<posYNavicella+raggioAsteroide)&&(this.y>posYNavicella-raggioNavicella)))
    {
      console.log("collisione");
      console.log("asteroide: "+_x+"   "+this.y+" navicella  "+posXNavicella+"     "+posYNavicella);
      esplodi();
    }
    

    pop();
  }
}



function Navicella()
{
  
  this.display=function()
  {
    posXNavicella=mouseX-raggioNavicella;
    if(posXNavicella>500-raggioNavicella*2)
    posXNavicella=500-raggioNavicella*2;
    if(posXNavicella<raggioNavicella*2)
    posXNavicella=raggioNavicella*2;
    image(spriteNavicella,posXNavicella,posYNavicella,raggioNavicella*2,raggioNavicella*2);
  }

  this.scia=function()
  {
    if(frameCount%10==0)
    {
    var nuovaScia=new SciaNavicella(posXNavicella,posYNavicella+raggioNavicella);
    arrayScie.push(nuovaScia);
    }
    for(var i=0;i<arrayScie.length;i++)
    arrayScie[i].move();
    
   
  }

  


}

function SciaNavicella(_x,_y)
{
  this.timer=0;
  this.velocitaScie=5;
 

  this.move=function()
  {
    push();
    this.timer+=this.velocitaScie;
    fill(255,255,0);
    rect(_x,_y+this.timer,5,10,5);
    pop();
  }
  
}

function esplodi()
{
  perso=true;

  for(var i=0;i<8;i++)
  {
    arrayEsplosione.push(new SciaEsplosione(posXNavicella,posYNavicella,(i*360)/8));
  }

  
}



function SciaEsplosione(_x,_y,rotazione)
{
  this.velocita=0;
  this.display=function()
  {
    
    push();
    
    this.velocita+=.5;
    fill(255,255,0,255-this.velocita*10);
    translate(_x,_y);
    scale(this.velocita,this.velocita);
    rotate(rotazione);
    rect(-1,3,2,10,5);
    pop();
  }
}