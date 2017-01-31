var MenuScene = {


    logo: {}, //Logo del juego
    buttonStart: {}, //Botón de inicio del juego

    menuMusic: {}, //Música del menú
    fondoMenu: {}, //fondo del menú
    click: {}, //Sonido del botón

    create: function () {

          //Creamos los sonidos y la música.
           click = this.game.add.audio('click');
           menuMusic = this.game.add.audio('start');
           menuMusic.play();
           menuMusic.loop= true; 

           //Creamos el fondo del juego
        fondoMenu = this.game.add.sprite (0,0,'fondoMenu');
        
        //Logo del juego
        logo = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);
        
        //Creamos el botón de start
        buttonStart = this.game.add.button(this.game.world.centerX, 
                                               500, 
                                               'button', 
                                               this.actionOnClick, 
                                               this, 2, 1, 0);
        buttonStart.anchor.set(0.5);
        textStart = this.game.add.text(0, 0, "Start");
        textStart.font = 'Sniglet';
        textStart.anchor.set(0.5);
        buttonStart.addChild(textStart);

      
    },
    
    actionOnClick: function(){
        
        menuMusic.destroy(); //paramos la música
       
        click.volume = 1.5;
        click.play();
         
         logo.destroy();
         textStart.destroy();
         buttonStart.destroy();
        this.game.state.start('preloader');
    } 
};

module.exports = MenuScene;