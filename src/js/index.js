const funtions={
    init:function () {
        // Agregamos la propiedad scaleMode para que se ajuste al viewport
        juego.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
    },
    preload:function () {
        // agregamos la imagen de fondo usando la propiedad load y el método image
        // que recibe dos parámetros un alias, y el path donde está la imagen
        juego.load.image('background','src/assets/images/background.png')
    },
    create:function () {
        // Mostramos la imagen pasandole tres parámetros coordenada (x , y) y el alias 
        juego.add.sprite(0,0, 'background');
        
    },
    // es llamado frame a frame
    update:function () {
        console.log("update");
        
    }
};
let juego = new Phaser.Game(1136,647,Phaser.CANVAS,funtions);
// agregamos un estado y le colocamos un nombre de instancia y le asignamos un objeto que contiene los métodos para poder usar en el juego
juego.state.add("gamePlay",funtions);
// agregamos el estado start para que inicie
juego.state.start("gamePlay")