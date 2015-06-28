 function TiledGedingse(game, map){
		this.game = game;
		this.map = map;
	}
	
	//TiledGedingse.prototype = Object.create(Phaser.Sprite.prototype);
	//TiledGedingse.prototype.constructor = TiledGedingse;

	TiledGedingse.prototype.create = function(){

		this.createBeans(this.game, this.map);
		this.createObstacle();
		this.createEnemys();
		this.createDeadly();
		
	}
	
	 TiledGedingse.prototype.createBeans = function(game, map) {

     	this.bean = this.game.add.group();
     	this.bean.enableBody = true;
     	var result = this.findObjectsByType('bohne', this.map, 'Bean');
     	result.forEach(function(element){
       	this.createFromTiledObject(element, this.bean);
			}, this);
		this.game.physics.arcade.enable(this.bean);
       	this.bean.callAll('animations.add', 'animations','rotate', [0,1,2,3,4,5,6,7,8,7,6,5,4,3,2,1], 5, true);
	    this.bean.callAll('play', null, 'rotate');

  	}
	
	TiledGedingse.prototype.createDeadly = function() {
		this.deadly = this.game.add.group();
		this.deadly.enableBody = true;
		var result = this.findObjectsByType('deadly',this.map,'Deadly');
		result.forEach(function(element){
			this.createFromTiledObject(element, this.deadly);
		}, this);
		
	 }
	 
    TiledGedingse.prototype.createObstacle = function (){
      this.mahlwerk = this.game.add.group();
      this.mahlwerk.enableBody = true;
      var result = this.findObjectsByType('grind', this.map, 'Danger');
        result.forEach(function(element){
          this.createFromTiledObject(element, this.mahlwerk);
        }, this);

    }
	
	TiledGedingse.prototype.createEnemys = function (){
      this.enemy = this.game.add.group();
      this.enemy.enableBody = true;
	  this.enemy.physicsBodyType = Phaser.Physics.ARCADE;
      var result = this.findObjectsByType('enemy', this.map, 'Gegner');
        result.forEach(function(element){
          this.createFromTiledObject(element, this.enemy);
        }, this);
		this.game.physics.arcade.enable(this.enemy);
		var dir;
	  this.dir = +50;
	  this.enemy.setAll('body.gravity.y', 700);
	  this.enemy.callAll('animations.add', 'animations','left', [0,1,2,3], 10, true);
	  this.enemy.callAll('animations.add', 'animations','right', [5,6,7,8], 10, true);
	  this.enemy.callAll('animations.add', 'animations','stay', [4], 10, true);
	  this.enemy.callAll('play', null, 'right');
	  this.enemy.setAll('body.velocity.x', -50);
	  this.enemy.setAll('outOfBoundsKill', true);
	  
	  
    }
	
	
    TiledGedingse.prototype.createFromTiledObject = function(element, group) {
    var sprite = group.create(element.x, element.y, element.properties.sprite);
              console.log("Gefahr erstellt");
      //copy all properties to the sprite
      Object.keys(element.properties).forEach(function(key){
        sprite[key] = element.properties[key];
      });
	}
	  
	TiledGedingse.prototype.findObjectsByType = function(type, map, layerName) {
 
    var result = new Array();
 
    map.objects[layerName].forEach(function(element){
 
      if(element.properties.type === type) {
 
        //Phaser uses top left, Tiled bottom left so we have to adjust
 
        //also keep in mind that some images could be of different size as the tile size
 
        //so they might not be placed in the exact position as in Tiled
 
        element.y -= map.tileHeight;
 
        result.push(element);
 
      }     
 
    });
 
    return result;
 
  }
	