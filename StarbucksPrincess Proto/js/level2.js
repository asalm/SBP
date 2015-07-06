var SBP = SBP || {};
 
SBP.level2 = function(){};
 
SBP.level2.prototype = {
		
	init: function(controls, count){
		this.controls = controls;
		this.count = count;
	},
 
  preload: function() {
 
    this.game.time.advancedTiming = true;
	this.map = this.game.add.tilemap('level2');
 
    //the first parameter is the tileset name as specified in Tiled, the second is the key to the asset
	this.bg = this.game.add.tileSprite(0, 0,640,480, 'background');
	this.bg.fixedToCamera = true;
	//this.background.tileScale(200,200);
    this.map.addTilesetImage('World', 'gameTiles');
    //create layers
 	this.underlay = this.map.createLayer('Underlay');
    this.walk = this.map.createLayer('Walk');
    this.blockedLayer = this.map.createLayer('BlockedLayer');
    //resizes the game world to match the layer dimensions
    this.blockedLayer.resizeWorld();
    //collision on blockedLayer
	this.map.setCollisionBetween(1, 1000);
	this.game.physics.arcade.setBoundsToWorld(true, true, true, true, false);
	if(this.controls === 'touch')
		this.load.atlas('dpad', 'assets/joystick/dpad.png', 'assets/joystick/dpad.json');
    },
 
  create: function() {
	var map;
	var cursors;
	var text;
	this.text = "";
	var beanTime;
	this.beanTime = 0;
	this.game.stage.backgroundColor = '#787878';
	
	//Erstellt für jedes Object aus der Tiled-Map im ObjectLayer in Objekt im Game
	this.TiledGedingse = new TiledGedingse(this.game, this.map);
	this.TiledGedingse.create();

  	//create sounds
	this.walk = this.game.add.audio('walk');
	this.hit = this.game.add.audio('hit');
	this.death = this.game.add.audio('death');
	this.shoot = this.game.add.audio('shoot');
	this.jump = this.game.add.audio('jump');
	this.bgm = this.game.add.audio('bgm');
	this.sound.play('bgm');
	this.bgm.loopFull();
	
	
    //create player
	this.player = new Player(this.game, 3136, 280, this.count);
	this.player.create();
	
    this.overlay = this.map.createLayer('Overlay');
    this.overlay.enableBody = true;
		
    //Camera-Movement
    this.game.camera.follow(this.player);
   	this.levelPointer = this.game.add.graphics(3136,924);

    //InputParameter
	if(this.controls === 'keyB'){
		this.cursors = this.game.input.keyboard.createCursorKeys(); //Pfeiltasten aktivieren
		upKey = this.game.input.keyboard.addKey(Phaser.Keyboard.UP);
		downKey = this.game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
		leftKey = this.game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
		rightKey = this.game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
		fireKey = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
	}
	else if(this.controls === 'touch'){
		this.pad = this.game.plugins.add(Phaser.VirtualJoystick);
		this.stick = this.pad.addDPad(100, 390, 200, 'dpad');
		this.buttonA = this.pad.addButton(470, 430, 'dpad', 'button1-up', 'button1-down');
		this.buttonB = this.pad.addButton(580, 380, 'dpad', 'button2-up', 'button2-down');
	}
	  
	// Background Image
	this.beanCounter = this.game.add.image(this.game.stage.centerX, this.game.stage.centerY,"beanCounter");
	this.beanCounter.fixedToCamera = true;
	this.beanCounter.bringToTop();
	this.beanCounter.scale.x = 1;
	this.beanCounter.scale.y = 1;
	this.beanCounter.anchor.x = -4.2;
}, 
  
 

  update: function() {
	this.game.physics.arcade.TILE_BIAS = 600;
  	this.game.physics.arcade.collide(this.player, this.blockedLayer); //Kollision mit Layer
  	this.game.physics.arcade.collide(this.TiledGedingse.enemy, this.blockedLayer, this.enemyMove); //Kollision mit Layer
	this.game.physics.arcade.overlap(this.player.shootBean, this.blockedLayer, this.collisionHandler, null, this);
	this.game.physics.arcade.collide(this.player.shootBean, this.TiledGedingse.enemy, this.collisionHandlerEnemy);
	this.game.physics.arcade.collide(this.player, this.TiledGedingse.enemy, this.hitDanger, null, this);
	this.game.physics.arcade.overlap(this.player, this.TiledGedingse.bean, this.collectBean, null, this);
    this.game.physics.arcade.overlap(this.player, this.TiledGedingse.mahlwerk, this.hitDanger, null, this);
    this.game.physics.arcade.overlap(this.player, this.TiledGedingse.deadly, this.hitDeadly, null, this);
   	this.game.physics.arcade.overlap(this.player, this.overlay, this.overlaycollisionHandler, null, this);
		
	
    this.player.body.velocity.x = 0; //sorgt dafür das nach Loslassen der Pfeiltasten die Spielfigur stehen bleibt
	this.player.animations.play('stay');
	var maxSpeed = 250;
	
	if(this.game.physics.arcade.distanceBetween(this.player, this.levelPointer) < 10){
		this.levelWechsel();
	}

	if(this.controls === 'keyB'){
		if (leftKey.isDown){
			this.player.moveLeft(maxSpeed, this.walk);
		}
		else if (rightKey.isDown){
			this.player.moveRight(maxSpeed, this.walk);
		}
		else{
		   this.player.animations.play('stay');
		}
		if (upKey.isDown && this.player.body.onFloor()){
			this.player.jump(this.jump);
		}
		if (fireKey.isDown){
			this.player.fireBeanKey(this.shoot);
		}	
	}


	else if(this.controls === 'touch'){
		if (this.stick.isDown){
			this.player.body.velocity.set = 0;
			
			if (this.stick.direction === Phaser.LEFT){
				this.player.moveLeft(maxSpeed, this.walk);
			}
			else if (this.stick.direction === Phaser.RIGHT){
				this.player.moveRight(maxSpeed, this.walk);
			}
		}else{
			this.player.animations.play('stay');
			this.player.body.velocity.x = 0; //sorgt dafür das nach Loslassen der Pfeiltasten die Spielfigur stehen bleibt
		}
		if(this.buttonA.isDown && this.player.body.onFloor()){
			this.player.jump(this.jump);
		}
		if(this.buttonB.isDown){
			this.player.fireBeanTouch(this.stick.direction,this.shoot);
		}
			
		}
		
	else if(this.controls === 'pad'){
		
		var gamepads;
		var gamepad;
		if (navigator.getGamepads) {
			gamepads = navigator.getGamepads();
			if(gamepads) {
				gamepad = gamepads[0];
			}
		}
		if (gamepad) {
			if (gamepad.buttons[15].pressed) {//rechts
			  this.player.moveRight(maxSpeed, this.walk);
			}
			if (gamepad.buttons[14].pressed) {//links
			  this.player.moveLeft(maxSpeed, this.walk);
			}
			if (gamepad.buttons[1].pressed) {
			  this.player.fireBeanPad(this.shoot,gamepad.buttons[14].pressed);
			}
			if (gamepad.buttons[0].pressed && this.player.body.onFloor()) {
				this.player.jump(this.jump);
			}
	    }	
	}
 },

 
	render: function(){ 
		//this.game.debug.text(this.game.time.fps || '--', 20, 70, "#00ff00", "40px Courier");  
		this.game.debug.text(this.player.getCount(), 595, 40 , "#00000", "36px Impact"); //Bohnenzähler
		//this.game.debug.text(this.text, 20, 230, "#ffffff", "45px Courier");
		//this.game.debug.bodyInfo(this.player, 16, 24);
		//this.game.debug.text(this.game.time.now, 20, 250, "#00ff00", "48px Courier");
		//this.game.debug.text(this.bosslife,20,280,"#00ff00","24px Courier");
	},

	collectBean: function (player, bean) {
		// Entfernt die Bohne aus der Map und Bohnenzähler hochsetzen
		player.animations.play('eat');
		bean.kill();
		this.player.setCount();	
  	},

	hitDeadly: function(player) {
		this.player.kill();
		this.counter = 0;
		this.gameOver();
		this.death.play();
	},

	hitDanger: function(player, danger) {
		//Bohne verlieren und erschrockenes Wegbouncen
		this.looseBean();
		this.player.body.velocity.y =-250;
	},
 
	hitCup: function(projectiles) {
		//Bohne verlieren ohne erschrockenes Wegbouncen
		this.player.body.immovable =true;  
		this.looseBean();
		projectiles.kill();
	},
 
	bodyCheck: function(){
		this.looseBean(); 
	},
 
	looseBean: function(){
		if (this.game.time.now > this.beanTime){   
			if(this.player.getCount() > 0){
				this.lBean = this.player.lostBean.getFirstExists(false);
				this.player.looseBean();
				if (this.lBean)
					{
					 this.lBean.reset(this.player.x, this.player.y);
					 this.lBean.body.velocity.y = +400;
					 this.hit.play();
					 this.beanTime = this.game.time.now + 200;
					}
			}else{
				this.player.kill();
				this.gameOver();
				this.death.play();
			}
		}
	},
 
	overlaycollisionHandler: function(player, overlay){
		overlay.alpha = 0.3;
		overlay.dirty = true;
		return false;
	},

	collisionHandler: function(projectiles){
		projectiles.kill();
	},
 
 
	collisionHandlerEnemy: function(projectiles, enemy){
		//Bohne weg, Gegner weg
		projectiles.kill();
		enemy.animations.play('stay');
		enemy.body.checkCollision.down=false; //verhindert Kollisionserkennung in jede Richtung
		enemy.body.checkCollision.up=false;
		enemy.body.checkCollision.left=false;
		enemy.body.checkCollision.right=false;
	},

	enemyMove: function(enemy){
		//lässt enemy wenden und in die entgegen gesetzte Richtung laufen, wenn Wand im Weg
		if(enemy.body.blocked.left){
		  enemy.animations.play('right');
		  enemy.body.velocity.x = +50;
		}
		if(enemy.body.blocked.right){
		  enemy.animations.play('left');
		  enemy.body.velocity.x = -50;
		}
	},

	gameOver: function(){
		this.gameover = this.game.add.image(-78,-80,"gameover");
		this.gameover.fixedToCamera = true;
		this.reloadbutton = this.game.add.button(300, 275,"reload",this.neustart,this);
		this.reloadbutton.fixedToCamera = true;
		this.reloadbutton.scale.x = 1;
		this.reloadbutton.scale.y = 1;
	},
	 
	levelWechsel: function(){
		this.bgm.destroy();
		this.state.start('level3',true,false,this.controls, this.player.getCount());
	},
	
	neustart: function(){
		this.bgm.destroy();
		this.state.start('level2',true,false,this.controls, 5);
	}

};