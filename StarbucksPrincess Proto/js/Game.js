var SBP = SBP || {};
 
SBP.Game = function(){};
 
SBP.Game.prototype = {
 
  preload: function() {
 
      this.game.time.advancedTiming = true;
 
    },
 
  create: function() {
    var map;

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

    //this.map.setCollisionBetween(1, 100000, true, 'blockedLayer');
    //create player
 
    this.player = this.game.add.sprite(100, 300, 'player');
    //physics on player
    this.game.physics.arcade.enable(this.player);
    //player gravity
    this.player.body.gravity.y = 800;
    //Camera-Movement
    this.game.camera.follow(this.player);
    
 
 }, 
 

  update: function() {
  	this.game.physics.arcade.collide(this.player, this.blockedLayer)
  },
 
  render: function()
 
    {
 
        this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");  
 
    }
 
};