var SBP = SBP || {};
 
SBP.Menu = function(){};
 
SBP.Menu.prototype = {
 

  create: function() {
	  
	var gameTitle;
	var playButton;
	this.bg = this.game.add.image(0,0,"background");
	this.titlechars = this.game.add.image(this.game.world.centerX, this.game.world.centerY-225,"chars");
	this.gameTitle = this.game.add.image(this.game.world.centerX, this.game.world.centerY-150, "logo");
	this.titlechars.anchor.setTo(0.5,0.5);
	this.titlechars.scale.x = 0.7;
	this.titlechars.scale.y = 0.7;
	this.titlechars.smoothed = false;
	this.choose = this.game.add.image(this.game.world.centerX, this.game.world.centerY+100, "choose");
	this.choose.scale.x = 0.7;
	this.choose.scale.y = 0.7;
	this.tween = this.game.add.tween(this.choose).to( { alpha: 0 }, 1000, "Linear", true, 0, -1);
    this.tween.yoyo(true, 500);

	this.gameTitle.anchor.set(0.5);

	this.game.add.tween(this.gameTitle).from( { y: -200 }, 1000, Phaser.Easing.Bounce.Out, true);
	this.playButton1 = this.game.add.button(this.game.world.centerX-200,this.game.world.centerY+165,"keyboard",this.keyB,this);
	this.playButton1.scale.x = 0.7;
	this.playButton1.scale.y = 0.7;
    
	this.playButton2 = this.game.add.button(this.game.world.centerX,this.game.world.centerY+165,"gamepad",this.gamePad,this);
	this.playButton2.scale.x = 1;
	this.playButton2.scale.y = 1;

	this.playButton3 = this.game.add.button(this.game.world.centerX+200,this.game.world.centerY+165,"touch",this.touch,this);
	this.playButton3.scale.x = 0.1;
	this.playButton3.scale.y = 0.1;

	this.playButton1.anchor.setTo(0.5,0.5);
	this.playButton2.anchor.setTo(0.5,0.5);
	this.playButton3.anchor.setTo(0.5,0.5);
	this.choose.anchor.setTo(0.5,0.5);

	this.playButton2.scale.set(0.55);
	this.playButton3.scale.set(0.3); 
  },
  
  	
  keyB: function() {
    this.state.start('Game',false,false,'keyB');
 },
  
  gamePad: function() {
    this.state.start('Game',false,false,'pad');
 },
  
  touch: function() {
    this.state.start('Game',false,false,'touch');
}
  
 };