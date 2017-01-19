'use strict';

var PlayScene = require('./play_scene.js');
var GameOver = require('./gameover_scene.js');
var MenuScene = require('./menu_scene.js');
var EndScene = require('./end_scene.js')

//  The Google WebFont Loader will look for this object, so create it before loading the script.

var BootScene = {
  preload: function () {
    // load here assets required for the loading screen
    var style = { font: "65px Arial", fill: "#ffffff", align: "center" }
    var text = this.game.add.text(400, 100, "Lost Shadow", style);
    text.anchor.set(0.6);

    this.game.load.image('preloader_bar', 'images/preloader_bar.png');
    this.game.load.spritesheet('button', 'images/buttons.png', 168, 70);
    this.game.load.image('logo', 'images/phaser.png');
  },

  create: function () {
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
  
      this.game.load.tilemap('tilemap', 'images/map.json', null, Phaser.Tilemap.TILED_JSON);
      this.game.load.image('tiles', 'images/mylevel1_tiles.png');
      this.game.load.atlasJSONHash('rush_idle01','images/rush_spritesheet.png', 'images/rush_spritesheet.json', Phaser.Loader.TEXTURE_ATLAS_JSON_HASH);
      this.game.load.image('glow', 'images/glowy2.png');
      this.game.load.image('sombras', 'images/sombras.png');
      this.game.load.image('light', 'images/light.png');

      this.game.load.onLoadComplete.add(this.loadComplete, this);
  },

  loadStart: function () {
    console.log("Game Assets Loading ...");
  },
    
    
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
 
window.onload = function () {

  WebFont.load(wfconfig); //carga la fuente definida en el objeto anterior.
  
};

window.init = function () {
  var game = new Phaser.Game(800, 600, Phaser.AUTO, 'game');

  game.state.add('boot', BootScene);
  game.state.add('menu', MenuScene);
  game.state.add('preloader', PreloaderScene);
  game.state.add('play', PlayScene);
  game.state.add('gameOver', GameOver);
  game.state.add('endScene', EndScene);
  game.state.start('boot');
    
};
