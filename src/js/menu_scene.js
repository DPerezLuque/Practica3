var MenuScene = {


    logo: {},
    button: {},
    buttonStart: {},

    menuMusic: {},
    click: {},

    create: function () {

          click = this.game.add.audio('click');
           menuMusic = this.game.add.audio('start');
            menuMusic.play();

        logo = this.game.add.sprite(this.game.world.centerX, 
                                        this.game.world.centerY, 
                                        'logo');
        logo.anchor.setTo(0.5, 0.5);
        
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
        
        menuMusic.destroy(); //
       
        click.volume = 1.5;
        click.play();
         
         logo.destroy();
         textStart.destroy();
         buttonStart.destroy();
        this.game.state.start('preloader');
    } 
};

module.exports = MenuScene;