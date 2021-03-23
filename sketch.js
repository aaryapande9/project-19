var PLAY = 1;
var END = 0;
var gameState = PLAY;
var player,playerImg,ground, invisibleGround;
var LifeGroup, LifeImage;
var alienGroup,alien,alienImage;
var gameOverImg,restartImg;
var score=0;
var gameOver, restart;

function preload(){
  playerImg = loadImage("uni.png")
  LifeImage = loadImage("OIP.png");
  alienImage = loadImage("alien.png");
  gameOverImg = loadImage("go.png");
  restartImg = loadImage("re.png");  
}

function setup() {
  createCanvas(600, 200);
  player = createSprite(50,180,20,50);
  player.addImage(playerImg);
  player.scale = 0.05;
  
  ground = createSprite(0,190,1200,10);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.5;

  gameOver.visible = false;
  restart.visible = false;
  
  LifeGroup = new Group();
  alienGroup = new Group();
  
  score = 0;
}

function draw() {
  background("pink");
  textSize(20);
  fill(255);
  text("Score: "+ score, 500,40);
  drawSprites();
  if (gameState===PLAY){
   if(player.isTouching(LifeGroup)){
      LifeGroup[0].destroy()
     score=score+1
   }
    if(score >= 0){
      ground.velocityX = -6;
    }else{
      ground.velocityX = -(6 + 3*score/100);
    }
  
    if(keyDown("space") && player.y >= 139) {
      player.velocityY = -12;
    }
  
    player.velocityY = player.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
  
    player.collide(ground);
    
    spawnLife();
    spawnAlien();
  
   if(alienGroup.isTouching(player)){
      
   gameState=END
    
    } 
  }
  
  else if (gameState === END ) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    player.velocityY = 0;
    alienGroup.setVelocityXEach(0);
    LifeGroup.setVelocityXEach(0);  
    //set lifetime of the game objects so that they are never destroyed
    alienGroup.setLifetimeEach(-1);
    LifeGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
}

function spawnLife() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var Life = createSprite(600,120,40,10);
    Life.y = Math.round(random(80,120));
    Life.addImage(LifeImage);
    Life.scale = 0.09;
    Life.velocityX = -3;
    
     //assign lifetime to the variable
    Life.lifetime = 200;
    
    //adjust the depth
    Life.depth = player.depth;
    player.depth = player.depth + 1;
    
    //add each cloud to the group
    LifeGroup.add(Life);
  }
  
}

function spawnObstacles() {
  if(frameCount % 70 === 0) {
    var alien = createSprite(600,165,10,40);    
    alien.addImage(alienImage);
    alien.scale=0.05
    alien.velocityX = -(6 + 3*score/100);
    alien.lifetime = 300;
    alienGroup.add(alien);
    }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  LifeGroup.destroyEach();
  alienGroup.destroyEach();
  
  
  if(localStorage["HighestScore"]<score){
    localStorage["HighestScore"] = score;
  }
  
  score =0;
  
}