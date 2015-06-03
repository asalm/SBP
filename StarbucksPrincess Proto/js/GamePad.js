var SBP = SBP || {};
 
SBP.InputGamePad = function(){};
 
//setting game configuration and loading the assets for the loading screen
 
SBP.InputGamePad.prototype = {
 
  create: function() {
	  
	  console.log("GamePad");
	  //InputParameter
	  this.cursors = this.game.input.keyboard.createCursorKeys(); //Pfeiltasten aktivieren
	  upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
      downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
      leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
      rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	  fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	  
	  console.log("ene");
	  this.playTheGame();
  },
  
  playTheGame: function() {
	  console.log("game");
	this.state.start('Game');
  }
};