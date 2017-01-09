
'use strict';

//Enumerados: PlayerState son los estado por los que pasa el player. Directions son las direcciones a las que se puede
//mover el player.
var PlayerState = {'JUMP':0, 'RUN':1, 'FALLING':2, 'STOP':3}
var Direction = {'LEFT':0, 'RIGHT':1, 'NONE':3}

//Scena de juego.
var PlayScene = {
    _rush: {}, //player
    _glow: {}, //enemigo
    _speed: 300, //velocidad del player
    _jumpSpeed: 600, //velocidad de salto
    _jumpHight: 100, //altura máxima del salto.
    _playerState: PlayerState.STOP, //estado del player
    _direction: Direction.NONE,  //dirección inicial del player. NONE es ninguna dirección.
    _enemies: {},
    _avance: -1,

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
      //Creamos al player con un sprite por defecto.
      //TODO 5 Creamos a rush 'rush'  con el sprite por defecto en el 10, 10 con la animación por defecto 'rush_idle01'
       this._enemies = this.game.add.group(),
       this.keyE = this.game.input.keyboard.addKey(Phaser.Keyboard.E);


      //TODO 4: Cargar el tilemap 'tilemap' y asignarle al tileset 'patrones' la imagen de sprites 'tiles'

      this.map = this.game.add.tilemap('tilemap');
      this.map.addTilesetImage('patrones','tiles');  //y asignarle al tileset 'patrones' la imagen de sprites 'tiles'

      //Creacion de las layers
      this.backgroundLayer = this.map.createLayer('Fondo');
      this.backgroundLayer2 = this.map.createLayer('Fondo2');
      this.groundLayer = this.map.createLayer('Plataformas');
      this.shadow = this.map.createLayer('Sombras');
      
      this.limites = this.map.createLayer('Limite');
      //plano de muerte
      this.death = this.map.createLayer('Muerte');

      //Colisiones con el plano de muerte y con el plano de muerte y con suelo.
      this.map.setCollisionBetween(1, 5000, true, 'Limite');
      this.map.setCollisionBetween(1, 5000, true, 'Muerte');
      this.map.setCollisionBetween(1, 5000, true, 'Plataformas');
      //this.map.setCollisionBetween(1, 5000, true, 'Sombras');
      this.death.visible = false;
      this.limites.visible = false;

      //Cambia la escala a x3.
      this.groundLayer.setScale(2.75,2.75);
      this.backgroundLayer.setScale(2.75,2.75);
      this.backgroundLayer2.setScale(2.75,2.75);
      this.death.setScale(2.75,2.75);
      this.shadow.setScale(2.75,2.75);
      this.limites.setScale(2.75,2.75);

      this._rush = new Phaser.Sprite(this.game, 10, 10, 'rush_idle01');
      this.game.world.addChild(this._rush);

      this._glow = new Phaser.Sprite(this.game, 820, 240, 'glow');
      this.game.world.addChild(this._glow);
      //this._enemies.add(this._glow);

      this.detalles = this.map.createLayer('Detalles');
      this.detalles.setScale(2.75,2.75);

      //this.groundLayer.resizeWorld(); //resize world and adjust to the screen
      

      //nombre de la animación, frames, framerate, isloop
      this._rush.animations.add('run',
                    Phaser.Animation.generateFrameNames('rush_run',1,5,'',2),10,true);
      this._rush.animations.add('stop',
                    Phaser.Animation.generateFrameNames('rush_idle',1,1,'',2),0,false);
      this._rush.animations.add('jump',
                     Phaser.Animation.generateFrameNames('rush_jump',2,2,'',2),0,false);
      this.configure();
  },
    
    //IS called one per frame.
    update: function () {

        if (this.game.input.keyboard.isDown(Phaser.Keyboard.P)){ 
            console.log('Pause');
            //game.paused = true;
            //this.onPause();
        }

        this.keyP = this.game.input.keyboard.addKey(Phaser.Keyboard.P);
        this.keyP.onDown.add(this.onPause, this);

        //this.game.input.onDown.add(this.onPause, self);

        var moveDirection = new Phaser.Point(0, 0);
        var collisionWithTilemap = this.game.physics.arcade.collide(this._rush, this.groundLayer);
        var enimiesCollision = this.game.physics.arcade.collide(this._glow, this.groundLayer);
        
        var collisionWithLimits = this.game.physics.arcade.collide(this.limites, this._glow);
        var collisionShadow = this.game.physics.arcade.collide(this._rush, this.shadow);
        var movement = this.GetMovement();
        //transitions
        switch(this._playerState)
        {
            case PlayerState.STOP:
            case PlayerState.RUN:
                if(this.isJumping(collisionWithTilemap)){
                    this._playerState = PlayerState.JUMP;
                    this._initialJumpHeight = this._rush.y;
                    this._rush.animations.play('jump');
                }
                else{
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._rush.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._rush.animations.play('stop');
                    }
                }    
                break;
                
            case PlayerState.JUMP:
                
                var currentJumpHeight = this._rush.y - this._initialJumpHeight;
                this.aux = currentJumpHeight;
                this._playerState = (currentJumpHeight*currentJumpHeight < this._jumpHight*this._jumpHight)
                    ? PlayerState.JUMP : PlayerState.FALLING;
                break;
                
            case PlayerState.FALLING:
                if(this.isStanding()){
                    if(movement !== Direction.NONE){
                        this._playerState = PlayerState.RUN;
                        this._rush.animations.play('run');
                    }
                    else{
                        this._playerState = PlayerState.STOP;
                        this._rush.animations.play('stop');
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
                    if(this._rush.scale.x < 0)
                        this._rush.scale.x *= -1;
                }
                else if(movement === Direction.LEFT){
                    moveDirection.x = -this._speed;
                    if(this._rush.scale.x > 0)
                        this._rush.scale.x *= -1;
                }
                else{
                    moveDirection.x = 0;
                    /*if(this._rush.scale.x > 0)
                        this._rush.scale.x *= -1;*/ 
                }
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
        if (this._rush.visible) { 
          
          if (this.game.physics.arcade.collide(this._rush, this._glow)){

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
        //console.log(this._rush.y);
    
        if (/*collisionShadow &&*/ this.keyE.isDown  && this._rush.body.velocity.y === 0 && collisionWithTilemap){
          this._rush.visible = false;
          this._rush.body.velocity.x = this._rush.body.velocity.y = 0;
        }

        else if (!this._rush.visible)
         this._rush.visible = true; 
    },

    onPause: function(event){
        
        //if (game.paused){
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

            this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;
        //}
    },
    actionOnClickContinue: function(){
        this.button.destroy();
        this.buttonMenu.destroy();
        this.pauseText.destroy();
        //game.paused = false;
        this.game.physics.arcade.isPaused = (this.game.physics.arcade.isPaused) ? false : true;
    }, 

    actionOnClickMenu: function(){
        this.game.state.start('menu');
        this.game.world.setBounds(0,0,800,600);
    }, 
    

    canJump: function(collisionWithTilemap){
        return this.isStanding() && collisionWithTilemap || this._jamping;
    },
    
    onPlayerFell: function(){
        //TODO 6 Carga de 'gameOver';
        this.game.state.start('gameOver');
    },
    
    checkPlayerFell: function(){
        if(this.game.physics.arcade.collide(this._rush, this.death))
            this.onPlayerFell();
        
    },
        
    isStanding: function(){
        return this._rush.body.blocked.down || this._rush.body.touching.down
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
        this.game.physics.arcade.enable(this._rush);
        this.game.physics.arcade.enable(this._glow);

        this._rush.body.bounce.y = 0.2;
        this._rush.body.gravity.y = 20000;
        this._rush.body.gravity.x = 0;
        this._rush.body.velocity.x = 0;
        this.game.camera.follow(this._rush);
    },
    //move the player
    movement: function(point, xMin, xMax){
        this._rush.body.velocity = point;// * this.game.time.elapseTime;
        
        if((this._rush.x < xMin && point.x < 0)|| (this._rush.x > xMax && point.x > 0))
            this._rush.body.velocity.x = 0;

    }
    
    //TODO 9 destruir los recursos tilemap, tiles y logo.
     //cache.removeImage(tilemap);
     //cache.removeImage(tiles);
};

module.exports = PlayScene;
