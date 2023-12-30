const funtions={
    init:function () {
        console.log("init");
    },
    preload:function () {
        console.log("preload");

    },
    create:function () {
        console.log("create");
        
        
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