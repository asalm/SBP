var SBP = SBP || {};
 
SBP.Menu = function(){};
 
SBP.Menu.prototype = {
 
  create: function() {
	  
  var gameTitle;
  var playButton;
  this.gameTitle = this.game.add.text(this.game.world.centerX, this.game.world.centerY, "Startscreen");
		this.gameTitle.anchor.setTo(0.5,0.5);
		this.playButton1 = this.game.add.button(150,100,"keyboard",this.keyB,this);
    /*
		this.playButton2 = this.game.add.button(170,370,"gamepad",this.gamePad,this);
		this.playButton3 = this.game.add.button(400,370,"touch",this.touch,this);
    */
		this.playButton1.anchor.setTo(0.5,0.5);
		//this.playButton2.scale.set(0.5);
		//this.playButton3.scale.set(0.3);
  
  },
  
  keyB: function() {
 
    this.state.start('Game');
 
  }
  /*
  gamePad: function() {
 
    this.state.start('GameMitPad');
 
  },
  
  touch: function() {
 
    this.state.start('GameTOUCH');
 
  }
  */
 };