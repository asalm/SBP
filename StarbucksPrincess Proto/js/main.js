var SBP = SBP || {};
 
SBP.game = new Phaser.Game(800, 600, Phaser.AUTO, 'StarBucksPrincess');
 
SBP.game.state.add('Boot', SBP.Boot);
 
SBP.game.state.add('Preload', SBP.Preload);
 
SBP.game.state.add('Menu', SBP.Menu);

SBP.game.state.add('GameMitPad', SBP.GameMitPad);

SBP.game.state.add('GameTOUCH', SBP.GameTOUCH);

SBP.game.state.add('Game', SBP.Game);

SBP.game.state.start('Boot');