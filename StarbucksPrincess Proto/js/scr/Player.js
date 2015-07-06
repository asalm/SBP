
	Player = function (game, x,y,count){
		Phaser.Sprite.call(this, game, x,y, 'player');
		game.add.existing(this);
		this.count = count;
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
		this.animations.add('eat',[15,16,17,18,19,18,17,16,15], 3, false);
		this.body.collideWorldBounds = true;
		this.beanTime = 0;
		this.body.tilePadding.x = 0;
		this.body.tilePadding.y = -10;
		
		this.createLostBean();
		this.createShootBean();
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
	
	Player.prototype.jump = function(jump){
		this.body.velocity.y = -400;
		jump.play();
	}
	
	Player.prototype.createLostBean = function(){
		this.lostBean = this.game.add.group();
		this.lostBean.enableBody = true;
		this.lostBean.createMultiple(100, 'Coffeebean');
		this.lostBean.setAll('outOfBoundsKill', true);
		this.lostBean.setAll('checkWorldBounds', true);
	}
	
	Player.prototype.createShootBean = function(){
		this.shootBean = this.game.add.group();
		this.shootBean.setAll('outOfBoundsKill', true);
		this.shootBean.setAll.collideWorldBounds = true;
		this.shootBean=this.game.add.physicsGroup(Phaser.Physics.ARCADE);
	}
	
	Player.prototype.fireBeanTouch = function(direction,shoot){
		 if (this.game.time.now > this.beanTime){   
			if(this.count > 0){
				this.fBean = this.shootBean.create(this.x+15, this.y+15,'Coffeebean',1);
				this.count--;
				this.fBean.enableBody = true;
				if (this.fBean){
						 if(direction === Phaser.LEFT)
							this.fBean.body.velocity.x = -400;
						 else
							this.fBean.body.velocity.x = +400;					
					 shoot.play();
					 this.beanTime = this.game.time.now + 200;
					 this.shootBean.setAll('scale.x',.5);
					 this.shootBean.setAll('scale.y',.5);
					}
			}
		 }
	}
	
	Player.prototype.fireBeanKey = function(shoot){
		 if (this.game.time.now > this.beanTime){   
			if(this.count > 0){
				this.fBean = this.shootBean.create(this.x+15, this.y+15,'Coffeebean',1);
				this.count--;
				this.fBean.enableBody = true;
				if (this.fBean){
					 if(leftKey.isDown)
						this.fBean.body.velocity.x = -400;
					 else
						this.fBean.body.velocity.x = +400;
					 shoot.play();
					 this.beanTime = this.game.time.now + 200;
					 this.shootBean.setAll('scale.x',.5);
					 this.shootBean.setAll('scale.y',.5);
					}
			}
		 }
	}
	
	Player.prototype.fireBeanPad = function(shoot,pressed){
		 if (this.game.time.now > this.beanTime){   
			if(this.count > 0){
				this.fBean = this.shootBean.create(this.x+15, this.y+15,'Coffeebean',1);
				this.count--;
				this.fBean.enableBody = true;
				if (this.fBean){
					 if(pressed)
						this.fBean.body.velocity.x = -400;
					 else
						this.fBean.body.velocity.x = +400;
					 shoot.play();
					 this.beanTime = this.game.time.now + 200;
					 this.shootBean.setAll('scale.x',.5);
					 this.shootBean.setAll('scale.y',.5);
					}
			}
		 }
	}
	
	
	
	Player.prototype.getCount = function(){
		return this.count;
	}
	
	Player.prototype.setCount = function(count){
		this.count++;
	}
	
	Player.prototype.looseBean = function(count){
		this.count--;
	}
	
	