var SBP = SBP || {};
 
//SBP.game = new Phaser.Game(1200, 800, Phaser.Canvas, 'StarBucksPrincess');  
// In richtiger Auflösung!? Leider nicht mehr spielbar auf meinem Rechner dann
// 
SBP.game = new Phaser.Game(640, 480, Phaser.Canvas, 'StarBucksPrincess');

 
SBP.game.state.add('Boot', SBP.Boot);

SBP.game.state.add('Preload', SBP.Preload);
 
SBP.game.state.add('Menu', SBP.Menu);

SBP.game.state.add('Game', SBP.Game);

SBP.game.state.start('Boot');