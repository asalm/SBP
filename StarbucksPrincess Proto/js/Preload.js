var SBP = SBP || {};
 
//loading the game assets
 
SBP.Preload = function(){};
 
SBP.Preload.prototype = {
 
  preload: function() {
 
    //load game assets
 
    this.load.tilemap('level1', 'assets/tileset/map01.json', null, Phaser.Tilemap.TILED_JSON);
 
    this.load.image('gameTiles', 'assets/tileset/tilemap.png');
 	//Bohne sprite
    this.load.image('Coffeebean', 'assets/images/bohne.png');
    this.load.spritesheet('player', 'assets/slime.png', 160, 160);
  
  },
 
  create: function() {
 
    this.state.start('Game');
 
  }
 
};