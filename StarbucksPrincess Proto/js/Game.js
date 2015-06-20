var SBP = SBP || {};
 
SBP.Game = function(){};
 
SBP.Game.prototype = {
 
  preload: function() {
 
      this.game.time.advancedTiming = true;

      this.map = this.game.add.tilemap('level1');

 
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
	this.bg = this.game.add.tileSprite(0, 0,640,480, 'background');
	this.bg.fixedToCamera = true;
	//this.background.tileScale(200,200);
    this.map.addTilesetImage('World', 'gameTiles');
 
    //create layers
 	this.underlay = this.map.createLayer('Underlay');
    this.walk = this.map.createLayer('Walk');
   
    this.blockedLayer = this.map.createLayer('BlockedLayer');



 
    //resizes the game world to match the layer dimensions
    this.blockedLayer.resizeWorld();

    //collision on blockedLayer
	this.map.setCollisionBetween(1, 1000);

	  this.game.physics.arcade.setBoundsToWorld(true, true, true, true, false);
    },
 
  create: function() {

	var map;
	var cursors;
	this.bosslife = 10;
	var text;
	this.text = "";
	var beanTime;
	this.beanTime = 0;
	this.count=25;
	this.game.stage.backgroundColor = '#787878';

	// Background Image

	this.beanCounter = this.game.add.image(this.game.stage.centerX, this.game.stage.centerY,"beanCounter");
	this.beanCounter.fixedToCamera = true;
	this.beanCounter.bringToTop();
	this.beanCounter.scale.x = 2;
	this.beanCounter.scale.y = 2;
	this.beanCounter.anchor.setTo(-8.8,-0.1);
		


    //Erstellt für jedes Object aus der Tiled-Map im ObjectLayer in Objekt im Game
    this.createBeans();
    this.createObstacle();
	this.createEnemys();
	this.createDeadly();
 

	//create sounds
	this.walk = this.game.add.audio('walk');
	this.hit = this.game.add.audio('hit');
	this.death = this.game.add.audio('death');
	this.shoot = this.game.add.audio('shoot');
	this.jump = this.game.add.audio('jump');
	
	//this.game.sound.setDecodedCallback([ this.walk, this.hit, this.death, this.shoot ], start, this);
    //create player

 	//this.player = this.game.add.sprite(2700,2800,'player');
	//testposition//
	this.player = this.game.add.sprite(120,500,'player');	
	//startposition// this.player = this.game.add.sprite(50,50,'player');
    //bossposition// this.player = this.game.add.sprite(2700,2800,'player');; //Spieler erstellen, Startposition, Name

	
	this.boss = this.game.add.sprite(700,2200, 'boss');
	this.boss.animations.add('walk', [0,1,2,3], 5, true);

	
    this.overlay = this.map.createLayer('Overlay');
    this.overlay.enableBody = true;

	//physics on player
    
    //Beschäftigt den Hauptthreat, damit der Nebenthreat solange das Spritesheet laden kann und der Spieler
    //nicht durch die Welt fällt!
 //   var wait, t;
 //   for(wait=0;wait<10000000;wait++) t=2*3*4;

    this.game.physics.arcade.enable(this.player);
    this.game.physics.arcade.enable(this.boss);
    this.boss.enableBody = true;
    //player gravity
    this.boss.body.bounce.y = 0.2;
    this.boss.body.bounce.x = 0.2;
    this.boss.body.gravity.y = 400;
	this.player.body.bounce.y = 0.2; //bei Aufprall zurückbouncen ... ist ja nen Blob!
	this.player.body.bounce.x = 0.2;
    this.player.body.gravity.y = 700;

	//create lostBean
	this.lostBean = this.game.add.group();
    this.lostBean.enableBody = true;
    this.lostBean.createMultiple(500, 'Coffeebean');
    this.lostBean.setAll('outOfBoundsKill', true);
    this.lostBean.setAll('checkWorldBounds', true);
	
	
	//create shootBean
	this.shootBean = this.game.add.group();
    this.shootBean.enableBody = true;
    this.shootBean.createMultiple(5, 'Coffeebean');
	this.shootBean.setAll('scale.x',.5);
	this.shootBean.setAll('scale.y',.5);
	this.shootBean.setAll('body.tilePadding.x', 16);
	this.shootBean.setAll('body.tilePadding.y', 16);
    this.shootBean.setAll('outOfBoundsKill', true);
    this.shootBean.setAll.collideWorldBounds = true;
	
    //Camera-Movement
    this.game.camera.follow(this.player);
    this.player.body.collideWorldBounds = true; //Kollision des Spielers
	//this.boss.body.collideWorldBounds = true;

    //  By default the ship will collide with the World bounds,
    //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
    //  you need to rebuild the physics world boundary as well. The following
    //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
    //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
    //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.


    //Animationen
	  this.player.animations.add('left', [0,1,2,3,4], 5, true); // Lauf-Animation
	  this.player.animations.add('right', [5,6,7,8,9], 5, true);
	  this.player.animations.add('stay', [10,11,12,13], 5, true);
	  this.player.animations.add('eat',[15,16,17,18,19,18,17,16,15], 5, false);




    //InputParameter
	  this.cursors = this.game.input.keyboard.createCursorKeys(); //Pfeiltasten aktivieren
	  upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
      downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	  fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	  
	// Background Image
	this.beanCounter = this.game.add.image(this.game.stage.centerX, this.game.stage.centerY,"beanCounter");
	this.beanCounter.fixedToCamera = true;
	this.beanCounter.bringToTop();
	this.beanCounter.scale.x = 1;
	this.beanCounter.scale.y = 1;
	this.beanCounter.anchor.x = -8.8;
	this.beanCounter.anchor.y = -0.0;
	
 }, 
  
  findObjectsByType: function(type, map, layerName) {
 
    var result = new Array();
 
    map.objects[layerName].forEach(function(element){
 
      if(element.properties.type === type) {
 
        //Phaser uses top left, Tiled bottom left so we have to adjust
 
        //also keep in mind that some images could be of different size as the tile size
 
        //so they might not be placed in the exact position as in Tiled
 
        element.y -= map.tileHeight;
 
        result.push(element);
 
      }     
 
    });
 
    return result;
 
  },
   createBeans: function() {

     	this.bean = this.game.add.group();
     	this.bean.enableBody = true;
     	var result = this.findObjectsByType('bohne', this.map, 'Bean');
     	result.forEach(function(element){
       	this.createFromTiledObject(element, this.bean);
			}, this);
     	this.game.physics.arcade.enable(this.bean);
       	this.bean.callAll('animations.add', 'animations','rotate', [0,1,2,3,4,5,6,7,8,7,6,5,4,3,2,1], 5, true);
	    this.bean.callAll('play', null, 'rotate');

  	},
	createDeadly: function() {
		this.deadly = this.game.add.group();
		this.deadly.enableBody = true;
		var result = this.findObjectsByType('deadly',this.map,'Deadly');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.deadly);
		}, this);
		
	 },
    createObstacle: function (){
      this.mahlwerk = this.game.add.group();
      this.mahlwerk.enableBody = true;
      var result = this.findObjectsByType('grind', this.map, 'Danger');
        result.forEach(function(element){
          this.createFromTiledObject(element, this.mahlwerk);
        }, this);

    },
	
	createEnemys: function (){
      this.enemy = this.game.add.group();
      this.enemy.enableBody = true;
	  this.enemy.physicsBodyType = Phaser.Physics.ARCADE;
      var result = this.findObjectsByType('enemy', this.map, 'Gegner');
        result.forEach(function(element){
          this.createFromTiledObject(element, this.enemy);
        }, this);
		this.game.physics.arcade.enable(this.enemy);
		var dir;
	  this.dir = +50;
	  this.enemy.setAll('body.gravity.y', 700);
	  this.enemy.callAll('animations.add', 'animations','left', [0,1,2,3], 10, true);
	  this.enemy.callAll('animations.add', 'animations','right', [5,6,7,8], 10, true);
	  this.enemy.callAll('animations.add', 'animations','stay', [4], 10, true);
	  this.enemy.callAll('play', null, 'right');
	  this.enemy.setAll('body.velocity.x', -50);
	  this.enemy.setAll('outOfBoundsKill', true);
	  
	  
    },
	
	
	
    createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
              console.log("Gefahr erstellt");
      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },

  update: function() {
	this.game.physics.arcade.TILE_BIAS = 600;
  	this.game.physics.arcade.collide(this.player, this.blockedLayer); //Kollision mit Layer
  	this.game.physics.arcade.overlap(this.player, this.blockedLayer); //Kollision mit Layer
  	this.game.physics.arcade.collide(this.player, this.boss);
	this.game.physics.arcade.collide(this.enemy, this.blockedLayer, this.enemyMove); //Kollision mit Layer
	this.game.physics.arcade.overlap(this.fBean, this.blockedLayer, this.collisionHandler, null, this);
	this.game.physics.arcade.collide(this.fBean, this.enemy, this.collisionHandlerEnemy);
	this.game.physics.arcade.overlap(this.player, this.enemy, this.hitDanger, null, this);
	this.game.physics.arcade.overlap(this.player, this.bean, this.collectBean, null, this);
    this.game.physics.arcade.overlap(this.player, this.mahlwerk, this.hitDanger, null, this);
    this.game.physics.arcade.overlap(this.player, this.deadly, this.hitDeadly, null, this);
    this.game.physics.arcade.collide(this.boss, this.blockedLayer);
    this.game.physics.arcade.collide(this.fBean, this.boss, this.bossbeanCollision, null, this);
    this.game.physics.arcade.overlap(this.player, this.overlay, this.overlaycollisionHandler, null, this);
	
	//  Reset the players velocity (movement)
    this.player.body.velocity.x = 0; //sorgt dafür das nach Loslassen der Pfeiltasten die Spielfigur stehen bleibt
	var maxSpeed = 250;
	
	if (leftKey.isDown)
    {
        //  Move to the left
        this.player.body.velocity.x =-maxSpeed;
        this.player.animations.play('left');
		if(!this.walk.isPlaying && this.player.body.onFloor())
			this.walk.play();
    }
    else if (rightKey.isDown)
    {
        //  Move to the right
        this.player.body.velocity.x = +maxSpeed;
        this.player.animations.play('right');
		if(!this.walk.isPlaying && this.player.body.onFloor())
			this.walk.play();
    }
	
    else
    {
        //  Stand still
        this.player.animations.play('stay');
    }
		//Sprung
	if (upKey.isDown && this.player.body.onFloor())
	{
		this.player.body.velocity.y = -400;
		this.jump.play();
	}
	
	if (fireKey.isDown)
	{
		this.fireBean();
	}
	/*if(this.boss.body.blocked.left){
	  this.boss.body.velocity.x = +60;
	}
	if(this.boss.body.blocked.right){
	 this.boss.body.velocity.x = -60;
	}
	if(this.boss.body.onFloor()){
		this.boss.body.gravity.y = -800;
	}
	if(this.boss.body.blocked.top){
		this.boss.body.gravity.y = +1200;
	}*/
	
	this.bossFight();
	
 },

 
  render: function()
 
    { 
        this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");  
		this.game.debug.text(this.count, 573, 42 , "#ffffff", "36px Courier"); //Bohnenzähler
		this.game.debug.text(this.text, 20, 230, "#ffffff", "45px Courier");
		//this.game.debug.bodyInfo(this.player, 16, 24);
		this.game.debug.text(this.game.time.now, 20, 250, "#00ff00", "48px Courier");
		this.game.debug.text(this.bosslife,20,280,"#00ff00","24px Courier");
		
    },

	collectBean: function (player, bean) {
    // Entfernt die Bohne aus der Map und Bohnenzähler hochsetzen
    player.animations.play('eat');

    console.log("Animation läuft!");
    bean.kill();
	this.count++;	
    
  	},
  
    
  fireBean: function(){
	
     if (this.game.time.now > this.beanTime){   
		if(this.count > 0){
			this.fBean = this.shootBean.getFirstExists(false);
						
			this.count--;

			this.fBean.enableBody = true;

			if (this.fBean)
				{
				 this.fBean.reset(this.player.x+15, this.player.y+15);
				 if(leftKey.isDown)
					this.fBean.body.velocity.x = -400;
				 else
					this.fBean.body.velocity.x = +400;
				
				 this.shoot.play();
				 this.beanTime = this.game.time.now + 200;
				 this.shootBean.createMultiple(5, 'Coffeebean');
				 this.shootBean.setAll('scale.x',.5);
				 this.shootBean.setAll('scale.y',.5);
				 this.shootBean.setAll('angle', +45);
				}
		}
	}
  },
  
  hitDeadly: function(player) {
  	this.player.kill();
  	this.counter = 0;
  	this.gameOver();
  	this.death.play();
  },

  hitDanger: function(player, danger) {
	  //Bohne verlieren und erschrockenes Wegbouncen
  	this.looseBean();
    this.player.body.velocity.y =-250;
	
 },
 
 looseBean: function(){
	
     if (this.game.time.now > this.beanTime)
    {   
		if(this.count > 0){
			this.lBean = this.lostBean.getFirstExists(false);
			this.count--;
			if (this.lBean)
				{
				 this.lBean.reset(this.player.x, this.player.y);
				 this.lBean.body.velocity.y = +400;
				 this.hit.play();
				 this.beanTime = this.game.time.now + 200;
				}
		}else{
			this.player.kill();
			this.gameOver();
			this.death.play();
		}
	}
  },
 
 overlaycollisionHandler: function(player, overlay){//overlay, player){
 	Console.log("Overlay transparent Junge!")
 	overlay.alpha = 0.3;
 	overlay.dirty = true;

 	return false;
 },

 collisionHandler: function(fBean){
	 fBean.kill();
 },
 bossbeanCollision : function(fBean){
 	fBean.kill();
	this.bosslife--;

	if(this.bosslife <= 0){
		this.boss.kill();
	}
},
 
 collisionHandlerEnemy: function(fBean, enemy){
	 //Bohne weg, Gegner weg
	 fBean.kill();
	 enemy.animations.play('stay');
	 enemy.body.checkCollision.down=false; //verhindert Kollisionserkennung in jede Richtung
	 enemy.body.checkCollision.up=false;
	 enemy.body.checkCollision.left=false;
	 enemy.body.checkCollision.right=false;
	 	 
	},

enemyMove: function(enemy){
	//lässt enemy wenden und in die entgegen gesetzte Richtung laufen, wenn Wand im Weg
	if(enemy.body.blocked.left){
	  enemy.animations.play('right');
	  enemy.body.velocity.x = +50;
	}
	if(enemy.body.blocked.right){
	  enemy.animations.play('left');
	  enemy.body.velocity.x = -50;
	}
	
},

bossFight: function(){
	//part1, part 2, part3
	//part1: doofes rumtanzen
	//part2 body attack auf spieler
	//part1
	//part3 gezieltes schießen
	//part1
	//part4 body attack
	//part5 sternschuss 10?
	//loop while boss isAlive
	this.boss.animations.play('walk');
	
	var bosslife = 10;
	// 
	// 
	
	 //this.game.add.tween(this.boss).to({ y: 300 }, 2000, Phaser.Easing.Quadratic.InOut, true, 0, 1000, true);
	  this.fightTimer = this.game.time.now;
	 while((200 + this.fightTimer) < this.game.time.now){
	 this.boss.body.velocity.x = +600;
	  //this.boss.body.velocity.x = -60;
	 }
	  
	 //this.game.physics.arcade.moveToObject(this.boss,this.player,120);
	  
},
	

 
 gameOver: function(){
	 this.text="Du bist total kaputt!!!";
	 
	this.reloadbutton = this.game.add.button(this.game.stage.centerX, this.game.stage.centerY,"reload",this.neustart,this);
	 this.reloadbutton.fixedToCamera = true;
	 //this.reloadButton.scale.setTo(0.7,0.7);
	 //reloadButton.scale.y = 0.7;*/
	 this.reloadbutton.anchor.setTo(-0.8,-1);

 },
 neustart: function(){
	
	 this.state.start('Game');
 }

 
};