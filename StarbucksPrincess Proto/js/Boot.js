var SBP = SBP || {};
 
SBP.Boot = function(){};
 
//setting game configuration and loading the assets for the loading screen
 
SBP.Boot.prototype = {
   preload: function() {
	   if (this.game.device.desktop)
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
        }
        else
        {
            this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            this.scale.setMinMax(480, 260, 1024, 768);
            this.scale.pageAlignHorizontally = true;
            this.scale.pageAlignVertically = true;
            this.scale.forceOrientation(true, false);
            this.scale.setResizeCallback(this.gameResized, this);
            this.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            this.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }
	   
    //assets we'll use in the loading screen
    this.load.image('preloadbar', 'assets/images/preloader-bar.png');
  },
  create: function() {
 
    //loading screen will have a white background
 
    this.game.stage.backgroundColor = '#fff';
 
    //scaling options
 
    this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
 
    //have the game centered horizontally
 
    this.scale.pageAlignHorizontally = true;
 
    this.scale.pageAlignVertically = true;
 
    //screen size will be set automatically
 
    this.scale.setScreenSize(true);
 
    //physics system
 
    this.game.physics.startSystem(Phaser.Physics.ARCADE);
 
    this.state.start('Preload');
 
  }
 
};