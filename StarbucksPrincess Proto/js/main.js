var SBP = SBP || {};
 
SBP.game = new Phaser.Game(800, 600, Phaser.AUTO, 'StarBucksPrincess');
 
SBP.game.state.add('Boot', SBP.Boot);
 
SBP.game.state.add('Preload', SBP.Preload);
 
SBP.game.state.add('Game', SBP.Game);

SBP.game.state.start('Boot');