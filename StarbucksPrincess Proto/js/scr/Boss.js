
	Boss = function (game, x,y){
		Phaser.Sprite.call(this, game, x,y, 'boss');
		game.add.existing(this);
	}
	
	Boss.prototype = Object.create(Phaser.Sprite.prototype);
	Boss.prototype.constructor = Boss;

	Boss.prototype.create = function(player, shootCup){
		SBP.game.physics.enable(this, Phaser.Physics.ARCADE);
		body=true;
		this.animations.add('walk', [0,1,2,3], 5, true);
		this.body.collideWorldBounds = true;
		//create shootCup
		this.shootCup = this.game.add.group();
		this.shootCup.setAll('outOfBoundsKill', true);
		this.shootCup.setAll.collideWorldBounds = true;
		this.shootCup=this.game.add.physicsGroup(Phaser.Physics.ARCADE);
		
		this.bosslife = true;
		this.bossFight(player);
	}

	Boss.prototype.bossFight = function(player){
		this.animations.play('walk');
	
			
		//nach links oben 
		this.game.time.events.add(Phaser.Timer.SECOND * 1, function start(){
			this.game.physics.arcade.moveToXY(this,2500,2600,200,700);
			}
			, this);
		
		//kurve nach unten
		this.game.time.events.add(Phaser.Timer.SECOND * 2, function part1(){
			this.tween1 = this.game.add.tween(this).to({
				x: [2500, 2600, 2700, 2800, 2900, 3000, 3050],
				y: [2600, 2650, 2760, 2790, 2700, 2650, 2550],
			}, 2000,Phaser.Easing.Quadratic.Out, true).interpolation(function(v, k){
				return Phaser.Math.bezierInterpolation(v, k);
				});
		}, this);
			
		//nach links oben
		this.game.time.events.add(Phaser.Timer.SECOND * 4, function part2(){
			this.game.physics.arcade.moveToXY(this,2500,2550,200,600);		
			}, this);
			
		//body attack
		this.game.time.events.add(Phaser.Timer.SECOND * 5, function part2(){
			this.game.physics.arcade.moveToXY(this,player.x,player.y,600);
			}, this);
			
		//stoppen, danach nach links oben
		this.game.time.events.add(Phaser.Timer.SECOND * 6, function part2(){
			this.body.velocity.setTo(0,0);
			this.game.physics.arcade.moveToXY(this,2500,2600,200,600);		
			}, this);

		//kurve
		this.game.time.events.add(Phaser.Timer.SECOND * 7, function part1(){
			this.tween1 = this.game.add.tween(this).to({
				x: [2500, 2600, 2700, 2800, 2900, 3000, 3050],
				y: [2600, 2650, 2760, 2790, 2700, 2650, 2550],
			}, 2000,Phaser.Easing.Quadratic.Out, true).interpolation(function(v, k){
				return Phaser.Math.bezierInterpolation(v, k);
				});
		}, this);
		
		//in die mitte
		this.game.time.events.add(Phaser.Timer.SECOND * 9, function part2(){
			this.game.physics.arcade.moveToXY(this,2700,2600,200,500);		
			}, this);
			
		//stoppen, schießen
		this.game.time.events.add(Phaser.Timer.SECOND * 9.5, function part2(){
			this.body.velocity.setTo(0,0);
			//hier schießfunktion einfügen
			this.fireCup(player.x,player.y);
			}, this);
			
		//body attack
		this.game.time.events.add(Phaser.Timer.SECOND * 11, function part2(){
			this.game.physics.arcade.moveToXY(this,player.x,player.y,600);
			}, this);
			
		//stoppen, danach mitte
		this.game.time.events.add(Phaser.Timer.SECOND * 12, function part2(){
			this.body.velocity.setTo(0,0);
			this.game.physics.arcade.moveToXY(this,2700,2500,200,500);	
			}, this);
			
		//stoppen, schießen
		this.game.time.events.add(Phaser.Timer.SECOND * 12.5, function part2(){
			this.body.velocity.setTo(0,0);
			var dirX = 2700;
			var dirY = 2900;
				this.fireCup(dirX,dirY);
				this.fireCup(dirX-50,dirY-50);
				this.fireCup(dirX-100,dirY-75);
				this.fireCup(dirX-150,dirY-150);
				this.fireCup(dirX,dirY-400);
				this.fireCup(dirX+150,dirY-150);
				this.fireCup(dirX+200,dirY-75);
				this.fireCup(dirX+250,dirY-150);
				
			}, this);
			
		this.game.time.events.add(Phaser.Timer.SECOND * 13, function part2(){
			this.bossFight(player);
		}, this);
	}
	
	Boss.prototype.fireCup = function(x,y,shootCup){
		this.fCup = this.shootCup.create(this.x+50, this.y+20,'Becher',1); 

			if (this.fCup)
				{
				 this.game.physics.arcade.moveToXY(this.fCup,x,y,600);
				}  
	}