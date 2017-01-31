var EndScene = {
    fondoEnd: {}, //Fondo de la escena final

	create: function () {
        
        this.style = {font: "24px Arial", fill: "#ffffff"}; //Estilo del texto

        fondoEnd = this.game.add.sprite (0,0,'endShadow');  //fondo

        //Texto de la escena final del juego
        var goText = this.game.add.text(400, 100, "Dislumbré un destello y creí que eras tú.\n Pronto lograré alcanzarte...", this.style);
        goText.anchor.set(0.5);
        
        //Botón que lleva al menú cuando es presionado.
        var buttonMenu = this.game.add.button(400, 300, 
                                          'button', 
                                          this.actionOnClick, 
                                          this, 2, 1, 0);
        buttonMenu.anchor.set(0.5);
        
        var textoReturn = this.game.add.text(0, 0, "Menu");
        textoReturn.anchor.set(0.5);
        buttonMenu.addChild(textoReturn); //
    },

    actionOnClick: function(){
        this.game.state.start('menu');
        this.game.world.setBounds(0,0,800,600);
    } 
};

module.exports = EndScene;