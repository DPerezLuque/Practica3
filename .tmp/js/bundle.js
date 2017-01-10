(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var GameOver = {
    create: function () {
        console.log("Game Over");
        var button = this.game.add.button(400, 300, 
                                          'button', 
                                          this.actionOnClick1, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        var goText = this.game.add.text(400, 100, "GameOver");
        var text = this.game.add.text(0, 0, "Reset Game");
        text.anchor.set(0.5);
        goText.anchor.set(0.5);
        button.addChild(text);
        
        //TODO 8 crear un boton con el texto 'Return Main Menu' que nos devuelva al menu del juego.
        var buttonMenu = this.game.add.button(400, 450, 
                                          'button', 
                                          this.actionOnClick2, 
                                          this, 2, 1, 0);
        buttonMenu.anchor.set(0.5);
        
        var textoReturn = this.game.add.text(0, 0, "Menu");
        textoReturn.anchor.set(0.5);
        buttonMenu.addChild(textoReturn);
    },
    
    //TODO 7 declarar el callback del boton.

    actionOnClick1: function(){
        this.game.state.start('preloader');

    }, 

    actionOnClick2: function(){
        this.game.state.start('menu');
        this.game.world.setBounds(0,0,800,600);
    } 
};

module.exports = GameOver;
},{}],2:[function(require,module,exports){
'use strict';

//TODO 1.1 Require de las escenas, play_scene, gameover_scene y menu_scene.
var PlayScene = require('./play_scene.js');
var GameOver = require('./gameover_scene.js');
var MenuScene = require('./menu_scene.js');

//  The Google WebFont Loader will look for this object, so create it before loading the script.




var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.spritesheet('button', 'images/buttons.png', 168, 70);
    this.game.load.image('logo', 'images/phaser.png');
  },

  create: function () {
    //this.game.state.start('preloader');
      this.game.state.start('menu');
      
  }
};


var PreloaderScene = {
  preload: function () {
    this.loadingBar = this.game.add.sprite(100,300, 'preloader_bar');
    this.loadingBar.anchor.setTo(0, 0.5); 
    this.game.load.setPreloadSprite(this.loadingBar);
    this.game.stage.backgroundColor = "#000000";
    
    
    
    this.load.onLoadStart.add(this.loadStart, this);
    //TODO 2.1 Cargar el tilemap images/map.json con el nombre de la cache 'tilemap'.
      //la imagen 'images/simples_pimples.png' con el nombre de la cache 'tiles' y
      // el atlasJSONHash con 'images/rush_spritesheet.png' como imagen y 'images/rush_spritesheet.json'
      //como descriptor de la animación.
      this.game.load.tilemap('tilemap', 'images/map.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.image('tiles', 'images/mylevel1_tiles.png');
      this.game.load.atlasJSONHash('rush_idle01','images/rush_spritesheet.png', 'images/rush_spritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      this.game.load.image('glow', 'images/glowy2.png');
      this.game.load.image('sombras', 'images/sombras.png');

      //TODO 2.2a Escuchar el evento onLoadComplete con el método loadComplete que el state 'play'
      this.game.load.onLoadComplete.add(this.loadComplete, this);
  },

  loadStart: function () {
    //this.game.state.start('play');
    console.log("Game Assets Loading ...");
  },
    
    
     //TODO 2.2b function loadComplete()
     loadComplete: function(){
      this.game.state.start('play');
        console.log ("Load completed");
     },
    
    update: function(){
        this._loadingBar
    }
};


var wfconfig = {
 
    active: function() { 
        console.log("font loaded");
        init();
    },
 
    google: {
        families: ['Sniglet']
    }
 
};
 
//TODO 3.2 Cargar Google font cuando la página esté cargada con wfconfig.
window.onload = function () {

  WebFont.load(wfconfig); //carga la fuente definida en el objeto anterior.
  
};
//TODO 3.3 La creación del juego y la asignación de los states se hará en el método init().

window.init = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

//TODO 1.2 Añadir los states 'boot' BootScene, 'menu' MenuScene, 'preloader' PreloaderScene, 'play' PlayScene, 'gameOver' GameOver.
  game.state.add('boot', BootScene);
  game.state.add('menu', MenuScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);
  game.state.add('gameOver', GameOver);

//TODO 1.3 iniciar el state 'boot'. 
game.state.start('boot');
    
};

},{"./gameover_scene.js":1,"./menu_scene.js":3,"./play_scene.js":4}],3:[function(require,module,exports){
var MenuScene = {
    create: function () {
        
        var logo = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);
        var buttonStart = this.game.add.button(this.game.world.centerX, 
                                               this.game.world.centerY, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        buttonStart.anchor.set(0.5);
        var textStart = this.game.add.text(0, 0, "Start");
        textStart.font = 'Sniglet';
        textStart.anchor.set(0.5);
        buttonStart.addChild(textStart);
    },
    
    actionOnClick: function(){
        this.game.state.start('preloader');
    } 
};

module.exports = MenuScene;
},{}],4:[function(require,module,exports){

'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}

//Scena de juego.
var PlayScene = {
    _shadow: {}, //player
    _glow: {}, //enemigo
    _speed: 300, //velocidad del player
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 100, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _enemies: {},
    _darkness: {},
    _avance: -1,
    _dark: {},
    paused: false,

    aux: 0,

    button: {},
    buttonMenu: {},
    textContinue: {},
    pauseText: {},
    textoReturn: {},
    keyP: {},
    keyE: {},

    //Método constructor...
  create: function () {
      
       this._enemies = this.game.add.group();
       this._darkness = this.game.add.group();

       this.keyE = this.game.input.keyboard.addKey(Phaser.Keyboard.E);


      this.map = this.game.add.tilemap('tilemap');
      this.map.addTilesetImage('patrones','tiles');  

      //Creacion de las layers
      this.backgroundLayer = this.map.createLayer('Fondo');
      this.groundLayer = this.map.createLayer('Plataformas'); //capa de groundlayer
      this.limites = this.map.createLayer('Limites'); //capa de los límites para los glows
      this.limitesJugador = this.map.createLayer('LimiteJugador'); //capa de los límites para los glows
      this.death = this.map.createLayer('Muerte');//capa de muerte


      //Colisiones con el plano de muerte y con el plano de muerte y con suelo.
      this.map.setCollisionBetween(1, 5000, true, 'Limite');
      this.map.setCollisionBetween(1, 5000, true, 'Muerte');
      this.map.setCollisionBetween(1, 5000, true, 'Plataformas');
    
      this.death.visible = false;
      this.limites.visible = false;

      //Cambia la escala a x2.75.
      this.groundLayer.setScale(2.75,2.75);
      this.backgroundLayer.setScale(2.75,2.75);
      this.death.setScale(2.75,2.75);
      this.limites.setScale(2.75,2.75);
      this.limitesJugador.setScale(2.75,2.75);

       //Sombras en las que ocultarte
      this._dark = new Phaser.Sprite(this.game, 735, 170, 'sombras');
      this.game.world.addChild(this._dark);
      this._dark.scale.setTo(0.13,0.27);
      //this._darkness.add(this._dark);

      this._shadow = new Phaser.Sprite(this.game, 10, 10, 'rush_idle01');
      this.game.world.addChild(this._shadow);

      this._glow = new Phaser.Sprite(this.game, 820, 240, 'glow');
      this.game.world.addChild(this._glow);
      //this._enemies.add(this._glow);

      this.detalles = this.map.createLayer('Detalles');
      this.detalles.setScale(2.75,2.75);
      

      //nombre de la animación, frames, framerate, isloop
      this._shadow.animations.add('run',
                    Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
      this._shadow.animations.add('stop',
                    Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
      this._shadow.animations.add('jump',
                     Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);
      this.configure();
  },
    
    //IS called one per frame.
    update: function () {

        this.keyP = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        
        if (!this.paused){

          if (this.keyP.isDown){
            this.paused = true;
            this.onPause();
            
          }
        }

        var moveDirection = new Phaser.Point(0, 0);

        var collisionWithTilemap = this.game.physics.arcade.collide(this._shadow, this.groundLayer);
        var playerLimits = this.game.physics.arcade.collide(this._shadow, this.limitesJugador);
        var triggerSombras = this.game.physics.arcade.collide(this._shadow, this._dark);
        var collisionWithLimits = this.game.physics.arcade.collide(this.limites, this._glow);
        
        var movement = this.GetMovement();

        //transitions
        switch(this._playerState)
        {
            case PlayerState.STOP:
            case PlayerState.RUN:
                if(this.isJumping(collisionWithTilemap)){
                    this._playerState = PlayerState.JUMP;
                    this._initialJumpHeight = this._shadow.y;
                    this._shadow.animations.play('jump');
                }
                else{
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._shadow.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._shadow.animations.play('stop');
                    }
                }    
                break;
                
            case PlayerState.JUMP:
                
                var currentJumpHeight = this._shadow.y - this._initialJumpHeight;
                this.aux = currentJumpHeight;
                this._playerState = (currentJumpHeight*currentJumpHeight < this._jumpHight*this._jumpHight)
                    ? PlayerState.JUMP : PlayerState.FALLING;
                break;
                
            case PlayerState.FALLING:
                if(this.isStanding()){
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._shadow.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._shadow.animations.play('stop');
                    }
                }
                break;     
        }
        //States
        switch(this._playerState){
                
            case PlayerState.STOP:
                moveDirection.x = 0;
                break;
            case PlayerState.JUMP:
            case PlayerState.RUN:
            case PlayerState.FALLING:
                if(movement === Direction.RIGHT){
                    moveDirection.x = this._speed;
                    if(this._shadow.scale.x < 0)
                        this._shadow.scale.x *= -1;
                }
                else if(movement === Direction.LEFT){
                    moveDirection.x = -this._speed;
                    if(this._shadow.scale.x > 0)
                        this._shadow.scale.x *= -1;
                }
                else moveDirection.x = 0;
      
                if(this._playerState === PlayerState.JUMP)
                    moveDirection.y = -this._jumpSpeed;
                if(this._playerState === PlayerState.FALLING)
                    moveDirection.y = 0;
                break;    
        }
        //movement
        this.movement(moveDirection,5,
                      this.backgroundLayer.layer.widthInPixels*this.backgroundLayer.scale.x - 10);
        this.checkPlayerFell();
        
        //--COLISION CON EL ENEMIGO--
        //Solo si el personaje es visible, revisa si colisiona con el enemigo
        if (this._shadow.visible) { 
          
          if (this.game.physics.arcade.collide(this._shadow, this._glow)){

            this.onPlayerFell();
          }
        }

        //--COLISION DEL ENEMIGO CON LOS LIMITES--
        
        if (!collisionWithLimits){ 
          this._glow.body.velocity.x = this._avance*80;
          
        }
        else {
          if (this._avance === -1) this._avance = 1;
          else if (this._avance === 1) this._avance = -1;
        }

        /*this._enemies.forEach(function(item) {
        item.x --;
        console.log(item.x);
        });*/

        
        //--COLISION CON LA SOMBRA--
    
        if (this.checkOverlap(this._shadow, this._dark) &&collisionWithTilemap && this.keyE.isDown  && this._shadow.body.velocity.y === 0){
          this._shadow.visible = false;
          this._shadow.body.velocity.x = this._shadow.body.velocity.y = 0;
        }

        else if (!this._shadow.visible)
         this._shadow.visible = true; 
    },

    checkOverlap: function (spriteA, spriteB){
      var boundsA = spriteA.getBounds();
      var boundsB = spriteB.getBounds();

      return Phaser.Rectangle.intersects(boundsA, boundsB); 
    },

    onPause: function(event){
        
        if (this.paused){
            this.button = this.game.add.button(400, 300, 
                                          'button', 
                                          this.actionOnClickContinue, 
                                          this, 2, 1, 0);
            this.button.fixedToCamera = true;
            this.pauseText = this.game.add.text(400, 100, "     Pause");
            this.textContinue = this.game.add.text(0, 0, "Continue");
            this.textContinue.anchor.set(-0.25);
            this.pauseText.fixedToCamera = true;
            this.button.addChild(this.textContinue);

            this.buttonMenu = this.game.add.button(400, 450, 
                                          'button', 
                                          this.actionOnClickMenu, 
                                          this, 2, 1, 0);
            this.buttonMenu.fixedToCamera = true;
            this.textoReturn = this.game.add.text(0, 0, "Menu");
            this.textoReturn.anchor.set(-0.65);
            this.buttonMenu.addChild(this.textoReturn);

            this.game.physics.arcade.isPaused = true;

        }
    },

    actionOnClickContinue: function(){
        this.button.destroy();
        this.buttonMenu.destroy();
        this.pauseText.destroy();
        this.game.physics.arcade.isPaused = false;
        this.paused = false;
    }, 

    actionOnClickMenu: function(){
        this.game.state.start('menu');
        this.game.world.setBounds(0,0,800,600);
    }, 
    

    canJump: function(collisionWithTilemap){
        return this.isStanding() && collisionWithTilemap || this._jamping;
    },
    
    onPlayerFell: function(){
        this.game.state.start('gameOver');
    },
    
    checkPlayerFell: function(){
        if(this.game.physics.arcade.collide(this._shadow, this.death))
            this.onPlayerFell();
        
    },
        
    isStanding: function(){
        return this._shadow.body.blocked.down || this._shadow.body.touching.down
    },
        
    isJumping: function(collisionWithTilemap){
        return this.canJump(collisionWithTilemap) && 
            this.game.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR);
    },
        
    GetMovement: function(){
        var movement = Direction.NONE
        
        //Move Right
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.RIGHT)){
            movement = Direction.RIGHT;
        }

        //Move Left
        if(this.game.input.keyboard.isDown(Phaser.Keyboard.LEFT)){
            movement = Direction.LEFT;
        }
        return movement;
    },

    //configure the scene
    configure: function(){
        //Start the Arcade Physics systems
        this.game.world.setBounds(0, 0, 2400, 160);
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#a9f0ff';
        this.game.physics.arcade.enable(this._shadow);
        this.game.physics.arcade.enable(this._glow);

        this._shadow.body.bounce.y = 0.2;
        this._shadow.body.gravity.y = 20000;
        this._shadow.body.gravity.x = 0;
        this._shadow.body.velocity.x = 0;
        this.game.camera.follow(this._shadow);
    },

    //move the player
    movement: function(point, xMin, xMax){
        this._shadow.body.velocity = point;
        
        if((this._shadow.x < xMin && point.x < 0)|| (this._shadow.x > xMax && point.x > 0))
            this._shadow.body.velocity.x = 0;

    }
    
    //TODO 9 destruir los recursos tilemap, tiles y logo.
     //cache.removeImage(tilemap);
     //cache.removeImage(tiles);
};

module.exports = PlayScene;
},{}]},{},[2]);
