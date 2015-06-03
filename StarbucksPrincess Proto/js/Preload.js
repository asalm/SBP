var SBP = SBP || {};
 
//loading the game assets
 
SBP.Preload = function(){};
 
SBP.Preload.prototype = {
 
  preload: function() {
    //show loading screen
    
    this.preloadBar = this.add.sprite(this.game.world.centerX, this.game.world.centerY, 'preloadbar');
    this.preloadBar.anchor.setTo(0.5);
    this.preloadBar.scale.setTo(0.5);

    this.load.setPreloadSprite(this.preloadBar);
    

  //load game assets
  
  //Preload Bar
    
  //Background Image
    this.load.image("background", "assets/images/Background.jpg");  
  //Map
    this.load.tilemap('level1', 'assets/tileset/map01.json', null, Phaser.Tilemap.TILED_JSON);
  //Tileset
    this.load.image('gameTiles', 'assets/tileset/tilemap.png');
  //Bohne sprite
    this.load.image('Coffeebean', 'assets/images/bohne.png');
  //Mahlwerk sprite
    this.load.image('Mahlwerk', 'assets/images/Mahlwerk.png');
  //Player sprite

    this.load.spritesheet('player', 'assets/char/nSlime_32x36_sheet.png', 32, 36);
    this.load.spritesheet('dude', 'assets/dude.png', 32,48);
  
  //Sounds
  this.load.audio('walk', 'assets/sounds/walk.mp3');
  this.load.audio('shoot', 'assets/sounds/shoot.mp3');
  this.load.audio('death', 'assets/sounds/death.mp3');
  this.load.audio('hit', 'assets/sounds/hit.mp3');
  this.load.audio('jump', 'assets/sounds/jump.mp3');
  
  },
 
  create: function() {
 
    this.state.start('Loadscreen1');
 
  }
 
};