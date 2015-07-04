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
  this.load.image("choose","assets/images/chooseyourweapon.png");
  this.load.image("logo","assets/images/logo.png");
  this.load.image("chars","assets/images/titlechars.png");
    this.load.image("background", "assets/images/Background.jpg");  
	this.load.image("keyboard", "assets/images/pfeiltasten.png");  
	this.load.image("touch", "assets/images/touch.png");  
	this.load.image("gamepad", "assets/images/gamepad.png");  
	this.load.image("reload", "assets/images/reload.png");
  this.load.image("gameover","assets/images/gameover.png");
  this.load.image("beanCounter", "assets/images/_bohne.png");
  this.load.spritesheet("boss", "assets/images/endboss.png",113,125);
  //Map
    this.load.tilemap('level1', 'assets/tileset/map01.json', null, Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level2', 'assets/tileset/map02.json',null,Phaser.Tilemap.TILED_JSON);
    this.load.tilemap('level3', 'assets/tileset/map03.json', null,Phaser.Tilemap.TILED_JSON);
  //Tileset
    this.load.image('gameTiles', 'assets/tileset/tilemap.png');
  //Bohne sprite
    this.load.spritesheet('Coffeebean', 'assets/images/bohne.png', 24, 24);
  //Becher sprite
  	this.load.spritesheet('Becher','assets/images/cup.png', 24, 24);
  //Mahlwerk sprite
    this.load.image('Mahlwerk', 'assets/images/Mahlwerk.png');
  //Deadly sprite
    this.load.image('poisen', 'assets/images/poisen.png');  
  //Player sprite
	this.game.load.script('Player', 'js/scr/Player.js');
    this.load.spritesheet('player', 'assets/char/nSlime_32x36_sheet.png', 32, 36);
    this.load.spritesheet('dude', 'assets/dude.png', 32,48);
  
	this.game.load.script('Boss', 'js/scr/Boss.js');
	this.game.load.script('TiledGedingse', 'js/scr/TiledGedingse.js');
	//this.game.load.script('level2', 'js/level2.js');
  //Sounds
  this.load.audio('walk', 'assets/sounds/walk.mp3');
  this.load.audio('shoot', 'assets/sounds/shoot.mp3');
  this.load.audio('death', 'assets/sounds/death.mp3');
  this.load.audio('hit', 'assets/sounds/hit.mp3');
  this.load.audio('jump', 'assets/sounds/jump.mp3');
  this.load.audio('bgm', 'assets/sounds/BGM.mp3');
  
  },
 
  create: function() {
 
    this.game.state.start('Menu');
 
  }
 
};