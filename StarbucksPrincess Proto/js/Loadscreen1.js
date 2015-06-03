var SBP = SBP || {};
 
SBP.Loadscreen1 = function(){};
 
SBP.Loadscreen1.prototype = {
 
  create: function() {
	  
  console.log("blabla");
  var gameTitle;
  var playButton;
  this.gameTitle = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "TEST");
		this.gameTitle.anchor.setTo(0.5,0.5);
		this.playButton = this.game.add.button(160,320,"Keyboard",this.keyB,this);
		this.playButton = this.game.add.button(160,320,"Gamepad",this.gamePad,this);
		this.playButton.anchor.setTo(0.5,0.5);
  
  },
  
  keyB: function() {
 
    this.state.start('Game');
 
  },
  
  gamePad: function() {
 
    this.state.start('GameMitPad');
 
  }
  
 };