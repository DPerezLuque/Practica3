
'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}

//Scena de juego.
var PlayScene = {
    _shadow: {}, //player

   //enemigos
    _glow: {}, _glow2: {}, _glow3: {}, _glow4: {}, _glow5: {},
    
    //sombras
    _dark: {}, _dark2: {}, _dark3: {}, _dark4: {}, _dark5: {},

    _light: {},

    _speed: 300, //velocidad del player
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 100, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _avance: -1, _avance2: -1, _avance3: -1, _avance4: -1,

    aux: 0,

    paused: false,

    button: {},
    buttonMenu: {},
    textContinue: {},
    pauseText: {},
    textoReturn: {},

    keyP: {},
    keyE: {},

    //Método constructor...
  create: function () {

      this.game.world.setBounds(0, 0, 800, 900);

       this.keyE = this.game.input.keyboard.addKey(Phaser.Keyboard.E);

       this.game.input.keyboard.addKeyCapture([ Phaser.Keyboard.LEFT, Phaser.Keyboard.RIGHT, Phaser.Keyboard.SPACEBAR ]);


      this.map = this.game.add.tilemap('tilemap');
      this.map.addTilesetImage('mylevel1_tiles','tiles');  

      //Creacion de las layers
      this.backgroundLayer = this.map.createLayer('Fondo');//capa de fondo


       //----SOMBRAS EN LAS QUE OCULTARTE----
      this._dark = new Phaser.Sprite(this.game, 435, 770, 'sombras');
      this.game.world.addChild(this._dark);
      this._dark.scale.setTo(0.1,0.2);

      this._dark2 = new Phaser.Sprite(this.game, 90, 450, 'sombras');
      this.game.world.addChild(this._dark2);
      this._dark2.scale.setTo(0.1,0.2);

      this._dark3 = new Phaser.Sprite(this.game, 380, 290, 'sombras');
      this.game.world.addChild(this._dark3);
      this._dark3.scale.setTo(0.1,0.2);

      this._dark4 = new Phaser.Sprite(this.game, 320, 25, 'sombras');
      this.game.world.addChild(this._dark4);
      this._dark4.scale.setTo(0.1,0.2);

      //Capas del mapa
      this.groundLayer = this.map.createLayer('Plataformas'); //capa de groundlayer
      this.limites = this.map.createLayer('Limites'); //capa de los límites para los glows
      this.limitesJugador = this.map.createLayer('LimitePersonaje'); //capa de los límites para los glows
      this.death = this.map.createLayer('Muerte');//capa de muerte

      //Colisiones con el plano de muerte y con el plano de muerte y con suelo.
      this.map.setCollisionBetween(1, 5000, true, 'Limites');
      this.map.setCollisionBetween(1, 5000, true, 'Muerte');
      this.map.setCollisionBetween(1, 5000, true, 'Plataformas');
      this.map.setCollisionBetween(1, 5000, true, 'LimitePersonaje');
    
      this.death.visible = false;
      this.limites.visible = false;
      this.limitesJugador.visible = false;

      //----PERSONAJE----
      this._shadow = new Phaser.Sprite(this.game, 50, 800, 'rush_idle01');
      this.game.world.addChild(this._shadow);

      this.game.camera.follow(this._shadow);

      //----ENEMIGOS----
      this._glow = new Phaser.Sprite(this.game, 500, 780, 'glow');
      this.game.world.addChild(this._glow);

      this._glow2 = new Phaser.Sprite(this.game, 200, 470, 'glow');
      this.game.world.addChild(this._glow2);

      this._glow3 = new Phaser.Sprite(this.game, 500, 310, 'glow');
      this.game.world.addChild(this._glow3);

      this._glow4 = new Phaser.Sprite(this.game, 150, 45, 'glow');
      this.game.world.addChild(this._glow4);

      //----LIGHT----
      this._light = new Phaser.Sprite(this.game, 5, 0, 'light');
      this.game.world.addChild(this._light);
      this._light.scale.setTo(0.7,0.7);

      //Los detalles se general al final para que los monolitos que dan sombra 
      //se vean delante del jugador y creen un falso 3D
      this.detalles = this.map.createLayer('Detalles');
      
      //Cambia la escala a x2
      this.groundLayer.setScale(2,2);
      this.backgroundLayer.setScale(2,2);
      this.death.setScale(2.,2);
      this.limites.setScale(2,2);
      this.limitesJugador.setScale(2,2);
      this.detalles.setScale(2,2);

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

        /*//Trigger de sombras
        var triggerSombras = this.game.physics.arcade.collide(this._shadow, this._dark);
        var triggerSombras2 = this.game.physics.arcade.collide(this._shadow, this._dark2);
        var triggerSombras3 = this.game.physics.arcade.collide(this._shadow, this._dark3);
        var triggerSombras4 = this.game.physics.arcade.collide(this._shadow, this._dark4);*/
        
        //Colisiones de los enemigos
        var collisionWithLimits = this.game.physics.arcade.collide(this.limites, this._glow);
        var collisionWithLimits2 = this.game.physics.arcade.collide(this.limites, this._glow2);
        var collisionWithLimits3 = this.game.physics.arcade.collide(this.limites, this._glow3);
        var collisionWithLimits4 = this.game.physics.arcade.collide(this.limites, this._glow4);
        
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
        this.checkPlayerWin();
        
        //--COLISION CON EL ENEMIGO--
        //Solo si el personaje es visible, revisa si colisiona con el enemigo
        if (this._shadow.visible) { 
          
          if (this.game.physics.arcade.collide(this._shadow, this._glow)) this.onPlayerFell();
          else if (this.game.physics.arcade.collide(this._shadow, this._glow2)) this.onPlayerFell();
          else if (this.game.physics.arcade.collide(this._shadow, this._glow3)) this.onPlayerFell();
          else if (this.game.physics.arcade.collide(this._shadow, this._glow4)) this.onPlayerFell();
          
        }

        //--COLISION DE LOS ENEMIGOS CON LOS LIMITES--
        //glow
        if (!collisionWithLimits) this._glow.body.velocity.x = this._avance*80;
        
        else {
          if (this._avance === -1) this._avance = 1;
          else if (this._avance === 1) this._avance = -1;
        }
        //glow2
        if (!collisionWithLimits2) this._glow2.body.velocity.x = this._avance2*80;
        
        else {
          if (this._avance2 === -1) this._avance2 = 1;
          else if (this._avance2 === 1) this._avance2 = -1;
        }
        //glow3
        if (!collisionWithLimits3) this._glow3.body.velocity.x = this._avance3*80;
        
        else {
          if (this._avance3 === -1) this._avance3 = 1;
          else if (this._avance3 === 1) this._avance3 = -1;
        }
        //glow4
        if (!collisionWithLimits4) this._glow4.body.velocity.x = this._avance4*80;
          
        else {
          if (this._avance4 === -1) this._avance4 = 1;
          else if (this._avance4 === 1) this._avance4 = -1;
        }
        
        //--COLISION CON LA SOMBRA--
    
        if ((this.checkOverlap(this._shadow, this._dark) || this.checkOverlap(this._shadow, this._dark2) 
              || this.checkOverlap(this._shadow, this._dark3) || this.checkOverlap(this._shadow, this._dark4))
                  && collisionWithTilemap && this.keyE.isDown  && this._shadow.body.velocity.y === 0){

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
        this.paused = false;
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

    onPlayerWin: function(){
        this.game.state.start('endScene');
    },

    checkPlayerWin: function(){
        if(this.game.physics.arcade.collide(this._shadow, this._light))
            this.onPlayerWin();
        
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
        
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.stage.backgroundColor = '#a9f0ff';
        this.game.physics.arcade.enable(this._shadow);

        //Fisicas de los enemigos
        this.game.physics.arcade.enable(this._glow);
        this.game.physics.arcade.enable(this._glow2);
        this.game.physics.arcade.enable(this._glow3);
        this.game.physics.arcade.enable(this._glow4);

        //Físicas de light
        this.game.physics.arcade.enable(this._light);

        this._shadow.body.bounce.y = 0.2;
        this._shadow.body.gravity.y = 20000;
        this._shadow.body.gravity.x = 0;
        this._shadow.body.velocity.x = 0;
        //this.game.camera.follow(this._shadow);
    },

    //move the player
    movement: function(point, xMin, xMax){
        this._shadow.body.velocity = point;
        
        if((this._shadow.x < xMin && point.x < 0)|| (this._shadow.x > xMax && point.x > 0))
            this._shadow.body.velocity.x = 0;

    }
    
};

module.exports = PlayScene;