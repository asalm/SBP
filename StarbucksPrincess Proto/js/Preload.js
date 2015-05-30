var SBP = SBP || {};
 
//loading the game assets
 
SBP.Preload = function(){};
 
SBP.Preload.prototype = {
 
  preload: function() {
 
    //load game assets
    
  //Map
    this.load.tilemap('level1', 'assets/tileset/map01.json', null, Phaser.Tilemap.TILED_JSON);
  //Tileset
    this.load.image('gameTiles', 'assets/tileset/tilemap.png');
 	//Bohne sprite
    this.load.image('Coffeebean', 'assets/images/bohne.png');
  //Mahlwerk sprite
    this.load.image('Mahlwerk', 'assets/images/Mahlwerk.png');
  //Player sprite
    this.load.spritesheet('player', 'assets/schleim.png', 96, 124);
	this.load.spritesheet('dude', 'assets/dude.png', 32,48);
	
  
  },
 
  create: function() {
 
    this.state.start('Game');
 
  }
 
};