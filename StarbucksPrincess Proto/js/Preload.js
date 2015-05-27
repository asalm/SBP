var SBP = SBP || {};
 
//loading the game assets
 
SBP.Preload = function(){};
 
SBP.Preload.prototype = {
 
  preload: function() {
 
    //load game assets
 
    this.load.tilemap('level1', 'assets/tileset/map01.json', null, Phaser.Tilemap.TILED_JSON);
 
    this.load.image('gameTiles', 'assets/tileset/tilemap.png');
 
    this.load.spritesheet('player', 'assets/dude.png', 32, 48);
  
  },
 
  create: function() {
 
    this.state.start('Game');
 
  }
 
};