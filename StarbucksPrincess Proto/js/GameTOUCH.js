var SBP = SBP || {};
 
SBP.GameTOUCH = function(){};
 
SBP.GameTOUCH.prototype = {
 
  preload: function() {
 
      this.game.time.advancedTiming = true;

      this.map = this.game.add.tilemap('level1');
 
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
	this.game.add.tileSprite(0, 0,1200,800, 'background');
	//this.background.tileScale(200,200);
    this.map.addTilesetImage('World', 'gameTiles');
 
    //create layers
 
    this.walk = this.map.createLayer('Walk');
    this.blockedLayer = this.map.createLayer('BlockedLayer');
 
 
    //resizes the game world to match the layer dimensions
    this.blockedLayer.resizeWorld();

    //collision on blockedLayer
	this.map.setCollisionBetween(1, 25);

	  this.game.physics.arcade.setBoundsToWorld(true, true, true, true, false);
	 //this.game.load.script('dpad', 'js/phaser-virtual-joystick.min.js');
	 this.load.atlas('dpad', 'assets/joystick/dpad.png', 'assets/joystick/dpad.json');
    },
 
  create: function() {

	var map;
	var cursors;
	var text;
	this.text = "";
	var count;
	var beanTime;
	this.beanTime = 0;
	this.count=500;
	this.game.stage.backgroundColor = '#787878';
	this.game.stage.smoothed = false;
	// Background Image


    //Erstellt für jedes Object aus der Tiled-Map im ObjectLayer in Objekt im Game
    this.createBeans();
    this.createObstacle();
	this.createEnemys();
 

	//create sounds
	this.walk = this.game.add.audio('walk');
	this.hit = this.game.add.audio('hit');
	this.death = this.game.add.audio('death');
	this.shoot = this.game.add.audio('shoot');
	this.jump = this.game.add.audio('jump');
	
	//this.game.sound.setDecodedCallback([ this.walk, this.hit, this.death, this.shoot ], start, this);

    //create player
 
    this.player = this.game.add.sprite(30, 30, 'player'); //Spieler erstellen, Startposition, Name
	
	//physics on player
    
    //Beschäftigt den Hauptthreat, damit der Nebenthreat solange das Spritesheet laden kann und der Spieler
    //nicht durch die Welt fällt!
    var wait, t;
    for(wait=0;wait<10000000;wait++) t=2*3*4;

    this.game.physics.arcade.enable(this.player);

    //player gravity
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
    //this.shootBean.physicsBodyType = Phaser.Physics.ARCADE;
    this.shootBean.createMultiple(1, 'Coffeebean');
	//this.shootBean.setAll('angle', +45); // or .angle = 45;
	//this.shootBean.setAll('cacheAsBitmap',true); 
	this.shootBean.setAll('scale.x',.5);
	this.shootBean.setAll('scale.y',.5);
	this.shootBean.setAll('body.tilePadding.x', 16);
	this.shootBean.setAll('body.tilePadding.y', 16);
    this.shootBean.setAll('outOfBoundsKill', true);
    this.shootBean.setAll.collideWorldBounds = true;
	
	//create deadEnemy
	this.deadE = this.game.add.group();
    this.deadE.enableBody = true;
    this.deadE.createMultiple(1, 'dude');
    //this.deadE.setAll('anchor.x', 0.5);
    this.deadE.setAll('anchor.y', 0.5);
    this.deadE.setAll('outOfBoundsKill', true);
   	this.deadE.setAll.collideWorldBounds = true;

    //Camera-Movement
    this.game.camera.follow(this.player);
    this.player.body.collideWorldBounds = true; //Kollision des Spielers
	

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

    //InputParameter
	   
	  this.pad = this.game.plugins.add(Phaser.VirtualJoystick);
	  this.stick = this.pad.addDPad(100, 500, 200, 'dpad');
	  this.buttonA = this.pad.addButton(610, 530, 'dpad', 'button1-up', 'button1-down');
      this.buttonB = this.pad.addButton(745, 460, 'dpad', 'button2-up', 'button2-down');
	
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
	this.game.physics.arcade.TILE_BIAS = 50;
  	this.game.physics.arcade.collide(this.player, this.blockedLayer); //Kollision mit Layer
  	this.game.physics.arcade.overlap(this.player, this.blockedLayer); //Kollision mit Layer
	this.game.physics.arcade.collide(this.enemy, this.blockedLayer, this.enemyMove); //Kollision mit Layer
	this.game.physics.arcade.overlap(this.fBean, this.blockedLayer, this.collisionHandler, null, this);
	this.game.physics.arcade.collide(this.fBean, this.enemy, this.collisionHandlerEnemy);
	this.game.physics.arcade.overlap(this.player, this.enemy, this.hitDanger, null, this);
	this.game.physics.arcade.overlap(this.player, this.bean, this.collectBean, null, this);
    this.game.physics.arcade.overlap(this.player, this.mahlwerk, this.hitDanger, null, this);
	
	var maxSpeed = 250;
	
	if (this.stick.isDown){
		this.player.body.velocity.set = 0;
		
		if (this.stick.direction === Phaser.LEFT){
			//  Move to the left
			this.player.body.velocity.x = -maxSpeed;
			this.player.animations.play('left');
			if(!this.walk.isPlaying && this.player.body.onFloor())
				this.walk.play();
		}
		else if (this.stick.direction === Phaser.RIGHT)
		{
			//  Move to the right
			this.player.body.velocity.x = +maxSpeed;
			this.player.animations.play('right');
			if(!this.walk.isPlaying && this.player.body.onFloor())
				this.walk.play();
		}
	
	}
	else
	{
		this.player.animations.play('stay');
		this.player.body.velocity.x = 0; //sorgt dafür das nach Loslassen der Pfeiltasten die Spielfigur stehen bleibt
	}
	
	if(this.buttonA.isDown && this.player.body.onFloor()){
		this.player.body.velocity.y = -400;
		this.jump.play();
	}
	
	if(this.buttonB.isDown){
		this.fireBean()
	}
	
 },


  render: function()
 
    { 
        this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");  
		this.game.debug.text("collected beans: " + this.count, 150, 70, "#00ff00", "40px Courier"); //Bohnenzähler
		this.game.debug.text(this.text, 20, 250, "#00ff00", "48px Courier");
		//this.game.debug.bodyInfo(this.player, 16, 24);
    },
	
	collectBean: function (player, bean) {
    // Entfernt die Bohne aus der Map und Bohnenzähler hochsetzen
    bean.kill();
	this.count++;
  },
  
    
  fireBean: function(){
	
     if (this.game.time.now > this.beanTime){   
		if(this.count > 0){
			this.fBean = this.shootBean.getFirstExists(false);
						
			this.count--;
			if (this.fBean)
				{
				 this.fBean.reset(this.player.x+15, this.player.y+15);
				 if(this.stick.direction === Phaser.LEFT)
					this.fBean.body.velocity.x = -400;
				 else
					this.fBean.body.velocity.x = +400;
				
				 this.shoot.play();
				 this.beanTime = this.game.time.now + 200;
				 this.shootBean.createMultiple(1, 'Coffeebean');
				 this.shootBean.setAll('scale.x',.5);
				 this.shootBean.setAll('scale.y',.5);
				 this.shootBean.setAll('angle', +45);
				}
		}
	}
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
 
 collisionHandler: function(fBean){
	 fBean.kill();
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
	

 
 gameOver: function(){
	 this.text="Du bist total kaputt!!!";
	 
 }
 

 

 
};