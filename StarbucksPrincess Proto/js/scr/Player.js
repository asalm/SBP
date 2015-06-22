
	Player = function (game, x,y){
		Phaser.Sprite.call(this, game, x,y, 'player');
		game.add.existing(this);
		
	}
	
	Player.prototype = Object.create(Phaser.Sprite.prototype);
	Player.prototype.constructor = Player;

	Player.prototype.create = function(){
		SBP.game.physics.enable(this, Phaser.Physics.ARCADE);
		body=true;
		this.body.gravity.y = 700; 
		this.body.bounce.y = 0.2; //bei Aufprall zurückbouncen ... ist ja nen Blob!
		this.body.bounce.x = 0.2;
		this.animations.add('left', [0,1,2,3,4], 5, true); // Lauf-Animation
		this.animations.add('right', [5,6,7,8,9], 5, true);
		this.animations.add('stay', [10,11,12,13], 5, true);
		this.animations.add('eat',[15,16,17,18,19,18,17,16,15], 5, false);
		this.body.collideWorldBounds = true;
	}

	Player.prototype.moveRight = function(maxSpeed, walk){
		this.body.velocity.x = +maxSpeed;
        this.animations.play('right');
		
		if(!walk.isPlaying && this.body.onFloor())
			walk.play();
	}
	
	Player.prototype.moveLeft = function(maxSpeed, walk){
		this.body.velocity.x = -maxSpeed;
        this.animations.play('left');
		
		if(!walk.isPlaying && this.body.onFloor())
			walk.play();
	}
	
	Player.prototype.jump = function(){
		this.body.velocity.y = -400;
	}
	


/*
 
Player = function(game){
	this.load.spritesheet('player', 'assets/char/nSlime_32x36_sheet.png', 32, 36);
	Phaser.Sprite.call(this, game, 'player');
	//game.add.existing(this);
	game.physics.enable(this, Phaser.Physics.ARCADE);
	
	//this.body=true;
	//this.bounce.y = 0.2; //bei Aufprall zurückbouncen ... ist ja nen Blob!
	//this.body.bounce.x = 0.2;
    //this.body.gravity.y = 700;
	console.log("bla");
}
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

Player.prototype.moveRight = function(maxSpeed, walk){
	this.body.velocity.x = +maxSpeed;
        //this.player.animations.play('right');
		
		if(!this.walk.isPlaying && body.onFloor())
			this.walk.play();
}

*/
