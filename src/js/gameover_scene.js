var GameOver = {
  fondoGO: {}, //Fondo de la pantalla de game over

    create: function () {

        fondoGO = this.game.add.sprite (0,0,'GameOverBackG'); //fondo

           //Texto de game Over
        var goText = this.game.add.text(400, 100, "GameOver");

        //Creamos el botón de reset del juego, que envia al jugador de nuevo al nivel
        var button = this.game.add.button(400, 300, 
                                          'button', 
                                          this.actionOnClick1, 
                                          this, 2, 1, 0);
        button.anchor.set(0.5);
        //Texto del botón
        var text = this.game.add.text(0, 0, "Reset Game");
        text.anchor.set(0.5);
        goText.anchor.set(0.5);
        button.addChild(text);
        
        //Creamos el botón que, de ser pulsado, lleva al jugador al menú
        var buttonMenu = this.game.add.button(400, 450, 
                                          'button', 
                                          this.actionOnClick2, 
                                          this, 2, 1, 0);
        buttonMenu.anchor.set(0.5);
        //Texto del botón
        var textoReturn = this.game.add.text(0, 0, "Menu");
        textoReturn.anchor.set(0.5);
        buttonMenu.addChild(textoReturn);
    },

    actionOnClick1: function(){
      var sound = this.game.add.audio('click');
        sound.play();

        this.game.state.start('preloader');

    }, 

    actionOnClick2: function(){
      var sound = this.game.add.audio('click');
        sound.play();

        this.game.state.start('menu');
        this.game.world.setBounds(0,0,800,600);
    } 
};

module.exports = GameOver;