var SBP = SBP || {};
 
SBP.Game = function(){};
 
SBP.Game.prototype = {
 
  preload: function() {
 
      this.game.time.advancedTiming = true;
	  
    },
 
  create: function() {
    var map;
	var cursors;
	var text;
	var count;
	this.count=0;
	this.game.stage.backgroundColor = '#787878';
 	  // create map
 	this.map = this.game.add.tilemap('level1');
 
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
 
    this.map.addTilesetImage('World', 'gameTiles');
 
    //create layers
 
    this.walk = this.map.createLayer('Walk');
    this.blockedLayer = this.map.createLayer('BlockedLayer');
 
    //collision on blockedLayer
 
    this.map.setCollisionBetween(1, 5000, true, 'BlockedLayer');
 
    //resizes the game world to match the layer dimensions
 
    this.blockedLayer.resizeWorld();

    //Erstellt für jedes Object aus der Tiled-Map im ObjectLayer in Objekt im Game
    this.createBeans();
 

    //create player
 
    this.player = this.game.add.sprite(100, 700, 'player'); //Spieler erstellen, Startposition
    //physics on player
    this.game.physics.arcade.enable(this.player);
    //player gravity
	this.player.body.bounce.y = 0.2; //bei Aufprall zurückbouncen ... ist ja nen Blob!
	this.player.body.bounce.x = 0.2;
    this.player.body.gravity.y = 700;
	
    //Camera-Movement
    this.game.camera.follow(this.player);
    this.player.body.collideWorldBounds = true; //Kollision des Spielers
	
	this.player.animations.add('left', [0,1,2,3,4], 10, true); // Lauf-Animation
	this.player.animations.add('right', [6,7,8,9,10], 10, true);
	this.player.animations.add('stay', [12,13,14,15], 10, true);
	this.cursors = this.game.input.keyboard.createCursorKeys(); //Pfeiltasten aktivieren
	upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
    downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	jumpKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	
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
   createBeans: function	() {
 
    	this.bean = this.game.add.group();
 
    	this.bean.enableBody = true;
 
    	var result = this.findObjectsByType('bohne', this.map, 'Bean');
 
    	result.forEach(function(element){
 
      	this.createFromTiledObject(element, this.bean);
    }, this);
 
  	},
    createFromTiledObject: function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);

      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
  },

  update: function() {
  	this.game.physics.arcade.collide(this.player, this.blockedLayer) //Kollision mit Layer
	this.game.physics.arcade.overlap(this.player, this.bean, this.collectBean, null, this);
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
        this.player.body.velocity.x = +150;
        this.player.animations.play('right');
    }
	
    else
    {
        //  Stand still
        this.player.animations.play('stay');
    }
		//Sprung
	if (jumpKey.isDown && this.player.body.onFloor())
	{
		this.player.body.velocity.y = -450;
	}
	
  },

  render: function()
 
    { 
        this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");  
		this.game.debug.text("collected beans: " + this.count, 150, 70, "#00ff00", "40px Courier"); //Bohnenzähler
    },
	
	collectBean: function (player, bean) {
    // Entfernt die Bohne aus der Map und Bohnenzähler hochsetzen
    bean.kill();
	this.count++;
}
 

 
};