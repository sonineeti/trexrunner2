var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score=0;

var gameOver, restart;

var bgcolor=180;

var jumpSound, dieSound, checkPointSound;

function preload(){
  trex_running =   loadAnimation("images/trex1.png","images/trex2.png","images/trex3.png");
  trex_collided = loadAnimation("images/trex_collided.png");
  
  groundImage = loadImage("images/ground.png");
  
  cloudImage = loadImage("images/cloud.png");
  
  obstacle1 = loadImage("images/obstacle1.png");
  obstacle2 = loadImage("images/obstacle2.png");
  obstacle3 = loadImage("images/obstacle3.png");
  obstacle4 = loadImage("images/obstacle4.png");
  obstacle5 = loadImage("images/obstacle5.png");
  obstacle6 = loadImage("images/obstacle6.png");
  
  gameOverImg = loadImage("images/gameOver.png");
  restartImg = loadImage("images/restart.png");
  
  jumpSound = loadSound("sounds/jump.mp3");
  dieSound = loadSound("sounds/die.mp3");
  checkPointSound = loadSound("sounds/checkPoint.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  
  trex = createSprite(80,height-45,20,50);
  
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.8;
  
  ground = createSprite(width/2,height-40,width,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  ground.velocityX = -(6 + 3*score/100);
  
  gameOver = createSprite(width/2,height/2-50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.9;
  restart.scale = 0.9;

  gameOver.visible = false;
  restart.visible = false;
  
  invisibleGround = createSprite(width/2,height-30,width,10);
  invisibleGround.visible = false;
  
  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
  pixelDensity(1);
}

function draw() {
  background(bgcolor);
  textSize(30);
  textStyle(BOLD);
  text("Score: "+ score, width-200,50);
  
  if (gameState===PLAY){
	  
    score = score + Math.round(getFrameRate()/60);
    ground.velocityX = -(6 + 3*score/100);
  
	if(score > 0 && score%100===0){
		checkPointSound.play();
	}
  
    if(keyDown("space") && trex.y >= ground.y-40) {
      trex.velocityY = -14;
	  jumpSound.play();
    }
	
    trex.velocityY = trex.velocityY + 0.8
  
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //night mode
    if(score%200===0){
      bgcolor=50;
    }
    
    //day mode
    if(score%500===0){
      bgcolor=180;
    }
    
    trex.collide(invisibleGround);
    spawnClouds();
    spawnObstacles();
  
    if(obstaclesGroup.isTouching(trex)){
        dieSound.play();
		gameState = END;
    }
  }
  else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    
    //set velcity of each game object to 0
    ground.velocityX = 0;
    trex.velocityY = 0;
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    
    //change the trex animation
    trex.changeAnimation("collided",trex_collided);
    
    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    
    if(mousePressedOver(restart)) {
      reset();
    }
  }
  
  
  drawSprites();
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 150 === 0) {
    var cloud = createSprite(width,120,40,10);
    cloud.y = Math.round(random(50,height-200));
    cloud.addImage(cloudImage);
    cloud.scale = 0.7;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 1000;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function spawnObstacles() {
  if(frameCount % 100 === 0) {
    var obstacle = createSprite(width,height-65,10,40);
    //obstacle.debug = true;
    obstacle.velocityX = -(6 + 3*score/100);
    
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
    
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.8;
    obstacle.lifetime = 1000;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function reset(){
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  
  trex.changeAnimation("running",trex_running);
  
  score = 0;
  
}