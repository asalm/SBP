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
	this.count=4;
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

 	
	//this.player = new Player(this.game, 2000,2700);
	this.player = new Player(this.game, 2700, 2800);
	this.player.create();
	//testposition//
	//this.player = this.game.add.sprite(120,500,'player');	
	//startposition// this.player = this.game.add.sprite(50,50,'player');
    //bossposition// this.player = this.game.add.sprite(2700,2800,'player');; //Spieler erstellen, Startposition, Name
	
    this.overlay = this.map.createLayer('Overlay');
    this.overlay.enableBody = true;

	//create lostBean
	this.lostBean = this.game.add.group();
    this.lostBean.enableBody = true;
    this.lostBean.createMultiple(100, 'Coffeebean');
    this.lostBean.setAll('outOfBoundsKill', true);
    this.lostBean.setAll('checkWorldBounds', true);
	
	
	//create shootBean
	
	
	this.shootBean = this.game.add.group();
    this.shootBean.setAll('outOfBoundsKill', true);
    this.shootBean.setAll.collideWorldBounds = true;
	this.shootBean=this.game.add.physicsGroup(Phaser.Physics.ARCADE);
	
	this.projectiles = this.game.add.group(this.shootBean);
	this.projectiles.enableBody = true;

		
    //Camera-Movement
    this.game.camera.follow(this.player);
    //this.player.body.collideWorldBounds = true; //Kollision des Spielers
	//this.boss.body.collideWorldBounds = true;

    //  By default the ship will collide with the World bounds,
    //  however because you have changed the size of the world (via layer.resizeWorld) to match the tilemap
    //  you need to rebuild the physics world boundary as well. The following
    //  line does that. The first 4 parameters control if you need a boundary on the left, right, top and bottom of your world.
    //  The final parameter (false) controls if the boundary should use its own collision group or not. In this case we don't require
    //  that, so it's set to false. But if you had custom collision groups set-up then you would need this set to true.

	this.bossPointer = this.game.add.graphics(2579.17,2812);
	

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
	this.beanCounter.anchor.x = -4.2;
	//this.beanCounter.anchor.y = -0.0;
	
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
  	
	this.game.physics.arcade.collide(this.enemy, this.blockedLayer, this.enemyMove); //Kollision mit Layer
	this.game.physics.arcade.overlap(this.shootBean, this.blockedLayer, this.collisionHandler, null, this);
	this.game.physics.arcade.collide(this.shootBean, this.enemy, this.collisionHandlerEnemy);
	this.game.physics.arcade.collide(this.player, this.enemy, this.hitDanger);
	this.game.physics.arcade.overlap(this.player, this.bean, this.collectBean, null, this);
    this.game.physics.arcade.overlap(this.player, this.mahlwerk, this.hitDanger, null, this);
    this.game.physics.arcade.overlap(this.player, this.deadly, this.hitDeadly, null, this);
   	//this.game.physics.arcade.collide(this.fCup, this.player, this.hitCup, null, this);
	//this.game.physics.arcade.collide(this.fCup, this.blockedLayer, this.collisionHandler);
    this.game.physics.arcade.overlap(this.player, this.overlay, this.overlaycollisionHandler, null, this);
	
	if(this.boss){
		this.game.physics.arcade.collide(this.boss, this.blockedLayer);
		this.game.physics.arcade.collide(this.shootBean, this.boss, this.bossbeanCollision, null, this);
		this.game.physics.arcade.collide(this.player, this.boss,this.bodyCheck, null, this);
		this.game.physics.arcade.collide(this.boss.shootCup, this.player, this.hitCup, null, this);
		this.game.physics.arcade.collide(this.boss.shootCup, this.blockedLayer, this.collisionHandler);
		this.projectiles = this.game.add.group(this.shootBean,this.shootCup);
		this.projectiles.enableBody = true;
	}
	//  Reset the players velocity (movement)
    this.player.body.velocity.x = 0; //sorgt dafür das nach Loslassen der Pfeiltasten die Spielfigur stehen bleibt
	var maxSpeed = 250;
	
	if (leftKey.isDown)
    {
        //  Move to the left
        this.player.moveLeft(maxSpeed, this.walk);
    }
    else if (rightKey.isDown)
    {
        //  Move to the right
        this.player.moveRight(maxSpeed, this.walk);
       
    }
	
    else
    {
        //  Stand still
       this.player.animations.play('stay');
    }
		//Sprung
	if (upKey.isDown && this.player.body.onFloor())
	{
		this.player.jump();
		this.jump.play();
	}
	
	if (fireKey.isDown)
	{
		this.fireBean();
	}	

	if(this.game.physics.arcade.distanceBetween(this.player, this.bossPointer) < 10 && !(this.boss)){
		this.boss = new Boss(this.game, 2700,2700);
		this.boss.create(this.player);
	}
	
	
 },

 
  render: function()
 
    { 
        this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");  
		this.game.debug.text(this.count, 595, 40 , "#00000", "36px Impact"); //Bohnenzähler
		//this.game.debug.text(this.text, 20, 230, "#ffffff", "45px Courier");
		this.game.debug.bodyInfo(this.player, 16, 24);
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
			this.fBean = this.shootBean.create(this.player.x+15, this.player.y+15,'Coffeebean',1);
						
			this.count--;

			this.fBean.enableBody = true;
			
			if (this.fBean)
				{
				 //this.fBean.reset(this.player.x+15, this.player.y+15);
				 if(leftKey.isDown)
					this.fBean.body.velocity.x = -400;
				 else
					this.fBean.body.velocity.x = +400;
				
				 this.shoot.play();
				 this.beanTime = this.game.time.now + 200;
				 this.shootBean.setAll('scale.x',.5);
				 this.shootBean.setAll('scale.y',.5);
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
 
 hitCup: function(projectiles) {
	  //Bohne verlieren ohne erschrockenes Wegbouncen
	this.player.body.immovable =true;  
  	this.looseBean();
	projectiles.kill();
 },
 
 bodyCheck: function(){
	 this.looseBean();
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

 collisionHandler: function(projectiles){
	 projectiles.kill();
 },
 
 bossbeanCollision : function(boss, projectiles){
 	projectiles.kill();
	this.bosslife--;

	if(this.bosslife === 0){
		boss.kill();
	}
},
 
 collisionHandlerEnemy: function(projectiles, enemy){
	 
	 //Bohne weg, Gegner weg
	 projectiles.kill();
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


 
 gameOver: function(){
	 this.gameover = this.game.add.image(-78,-80,"gameover");
	 //this.gameover.scale.x = 0.5;
	 //this.gameover.scale.y = 0.5;
	 //this.gameover.anchor.setTo(0.5,0.5)
	 this.gameover.fixedToCamera = true;
	 
	this.reloadbutton = this.game.add.button(300, 275,"reload",this.neustart,this);
	this.reloadbutton.fixedToCamera = true;
	this.reloadbutton.scale.x = 1;
	this.reloadbutton.scale.y = 1;
	 //this.reloadButton.scale.setTo(0.7,0.7);
	 //reloadButton.scale.y = 0.7;*/
	 //this.reloadbutton.anchor.setTo(-0.8,-1);

 },
 neustart: function(){
	
	 this.state.start('Game');
 }

 
};