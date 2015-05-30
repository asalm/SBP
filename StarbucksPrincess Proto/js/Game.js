var SBP = SBP || {};
 
SBP.Game = function(){};
 
SBP.Game.prototype = {
 
  preload: function() {
 
      this.game.time.advancedTiming = true;

      this.map = this.game.add.tilemap('level1');
 
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
 
    this.map.addTilesetImage('World', 'gameTiles');
 
    //create layers
 
    this.walk = this.map.createLayer('Walk');
    this.blockedLayer = this.map.createLayer('BlockedLayer');
 
 
    //resizes the game world to match the layer dimensions
    this.blockedLayer.resizeWorld();

    //collision on blockedLayer

    this.map.setCollisionBetween(1, 12);

	  this.game.physics.arcade.setBoundsToWorld(true, true, true, true, false);
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
 	  // create map
 	
    //  Convert the tilemap layer into bodies. Only tiles that collide (see above) are created.
    //  This call returns an array of body objects which you can perform addition actions on if
    //  required. There is also a parameter to control optimising the map build.
    //this.game.physics.arcade.convertTilemap(this.map, this.blockedLayer);
    //klingt zu schön, klappt aber nicht :(( würde mit p2js-Physic vllt funktionieren?

    //Erstellt für jedes Object aus der Tiled-Map im ObjectLayer in Objekt im Game
    this.createBeans();
    this.createObstacle();
	this.createEnemys();
 

    //create player
 
    this.player = this.game.add.sprite(100, 700, 'player'); //Spieler erstellen, Startposition
	
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
	
	/*var enemy1;
	this.enemy1 = this.game.add.sprite(600, 900, 'dude');
	this.game.physics.arcade.enable(this.enemy1);
	this.enemy1.body.gravity.y = 700;
	this.enemy1.body.collideWorldBounds = true;
	this.enemy1.animations.add('left', [0,1,2,3], 10, true); // Lauf-Animation
	this.enemy1.animations.add('right', [5,6,7,8], 10, true);*/

	//create lostBean
	this.lostBean = this.game.add.group();
    this.lostBean.enableBody = true;
    this.lostBean.createMultiple(500, 'Coffeebean');
    this.lostBean.setAll('outOfBoundsKill', true);
    this.lostBean.setAll('checkWorldBounds', true);
	
	
	//create shootBean
	this.shootBean = this.game.add.group();
    this.shootBean.enableBody = true;
    this.shootBean.physicsBodyType = Phaser.Physics.ARCADE;
    this.shootBean.createMultiple(500, 'Coffeebean');
    this.shootBean.setAll('anchor.x', 0.5);
    this.shootBean.setAll('anchor.y', 0.5);
    this.shootBean.setAll('outOfBoundsKill', true);
    //this.shootBean.setAll('collideWorldBounds', true);
	this.shootBean.setAll.collideWorldBounds = true;

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
	  this.player.animations.add('left', [0,1,2,3,4], 10, true); // Lauf-Animation
	  this.player.animations.add('right', [6,7,8,9,10], 10, true);
	  this.player.animations.add('stay', [12,13,14,15], 10, true);

    //InputParameter
	  this.cursors = this.game.input.keyboard.createCursorKeys(); //Pfeiltasten aktivieren
	  upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
      downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	  fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	  
	  
	
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
	  this.enemy.setAll('body.gravity.y', 700);
	  this.enemy.callAll('animations.add', 'animations','right', [5,6,7,8], 10, true);
	  this.enemy.callAll('play', null, 'right');
	  this.enemy.setAll('body.velocity.x', +50);
	  this.enemy.setAll('outOfBoundsKill', true);
      this.enemy.setAll('checkWorldBounds', true);

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
  	this.game.physics.arcade.collide(this.player, this.blockedLayer); //Kollision mit Layer
	this.game.physics.arcade.collide(this.enemy, this.blockedLayer); //Kollision mit Layer
	this.game.physics.arcade.collide(this.fBean, this.blockedLayer, this.collisionHandler);
	this.game.physics.arcade.collide(this.fBean, this.enemy, this.collisionHandlerEnemy);
	//this.game.physics.arcade.overlap(this.player, this.enemy, this.hitDanger);
	this.game.physics.arcade.overlap(this.player, this.bean, this.collectBean, null, this);
    this.game.physics.arcade.overlap(this.player, this.mahlwerk, this.hitDanger, null, this);
	
	//  Reset the players velocity (movement)
    this.player.body.velocity.x = 0; //sorgt dafür das nach Loslassen der Pfeiltasten die Spielfigur stehen bleibt
	
	if (leftKey.isDown)
    {
        //  Move to the left
        this.player.body.velocity.x =-150;
        this.player.animations.play('left');
		
    }
    else if (rightKey.isDown)
    {
        //  Move to the right
        this.player.body.velocity.x = +450;
        this.player.animations.play('right');
    }
	
    else
    {
        //  Stand still
        this.player.animations.play('stay');
    }
		//Sprung
	if (upKey.isDown && this.player.body.onFloor())
	{
		this.player.body.velocity.y = -450;
	}
	
	if (fireKey.isDown)
	{
		this.fireBean();
	}
	
  },

  render: function()
 
    { 
        this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");  
		this.game.debug.text("collected beans: " + this.count, 150, 70, "#00ff00", "40px Courier"); //Bohnenzähler
		this.game.debug.text(this.text, 20, 250, "#00ff00", "48px Courier");
    },
	
	collectBean: function (player, bean) {
    // Entfernt die Bohne aus der Map und Bohnenzähler hochsetzen
    bean.kill();
	this.count++;
  },
  
  looseBean: function(){
	
     if (this.game.time.now > this.beanTime)
    {   
		if(this.count > 0){
			this.lBean = this.lostBean.getFirstExists(false);
			this.count--;
			if (this.lBean)
				{
				 this.lBean.reset(this.player.x+50, this.player.y+80);
				 this.lBean.body.velocity.y = +400;
				 this.beanTime = this.game.time.now + 200;
				}
		}else{
			this.player.kill();
			this.gameOver();
		}
	}
  },
  
  fireBean: function(){
	
     if (this.game.time.now > this.beanTime){   
		if(this.count > 0){
			this.fBean = this.shootBean.getFirstExists(false);
			this.count--;
			if (this.fBean)
				{
				 this.fBean.reset(this.player.x+50, this.player.y+80);
				 if(leftKey.isDown)
					this.fBean.body.velocity.x = -400;
				 else
					this.fBean.body.velocity.x = +400;
				 this.beanTime = this.game.time.now + 200;
				}
		}
	}
  },
  
  hitDanger: function(player, danger) {
	  //Bohne verlieren und erschrockenes Wegbouncen
  	this.looseBean();
    this.player.body.velocity.y =-250;
	
 },
 
 collisionHandler: function(fBean, blockedLayer){
	 fBean.kill();
 },
 
 collisionHandlerEnemy: function(fBean, enemy){
	 //Bohne weg, Gegner weg
	 fBean.kill();
	 enemy.reset(enemy.x+20, enemy.y+20);
	 /*var deadE;
	 this.deadE = this.game.add.sprite(0,0, 'dude');
	 this.deadE.reset(enemy.body.x, enemy.body.y)
	 this.deadE.enableBody = false;
	 this.deadE.checkWorldBounds = false;
	 this.deadE.collideWorldBounds =false;
	 this.deadE.reset(deadE.x+20, enemy.y+20);*/
	 
 },
 
 gameOver: function(){
	 this.text="Du bist total kaputt!!!";
	 
 }
 

 

 
};