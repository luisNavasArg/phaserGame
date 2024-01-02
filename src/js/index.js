const funtions={
    init:function () {
        // Agregamos la propiedad scaleMode para que se ajuste al viewport
        juego.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
        //alineamos el juego en elcentro
        juego.scale.pageAlignHorizontally=true;
        juego.scale.pageAlignVertically=true;
    },
    preload:function () {
        // agregamos la imagen de fondo usando la propiedad load y el método image
        // que recibe dos parámetros un alias, y el path donde está la imagen
        juego.load.image('background','src/assets/images/background.png')
        //cargamos nuestro personaje 
        // pasamos 5 parámetros, alias,path,ancho,alto,cantidad de inagenes
        juego.load.spritesheet("im", "src/assets/images/horse.png",84,156,2)
    },
    create:function () {
        // Mostramos la imagen pasandole tres parámetros coordenada (x , y) y el alias 
        juego.add.sprite(0,0, 'background');
        // agregando el personaje
        this.horse =juego.add.sprite(0,0, 'im');
        // accediendo a los frames
        this.horse.frame=1;
        // centrando el personaje
        this.horse.x=juego.width/2;
        this.horse.y = juego.height/2;
        // centrando el pivot de la imagen
        this.horse.anchor.setTo(0.5,0.5)
        //el anchor es importante ya que cuando rotamos la imagen lo hace a partir del anchor o pivot
        // this.horse.angle=90; si lo hacemos dentro del update va a ir rotando dependiendo del valor que vayamos sumando
        this.horse.scale.setTo(2)//Podemos escalar asignando un solo valo o valor para el ancho y el alto por separado
        this.horse.alpha=0.5;
    },
    // es llamado frame a frame
    update:function () {
        this.horse.angle+=1;
        
    }
};
let juego = new Phaser.Game(1136,647,Phaser.CANVAS,funtions);
// agregamos un estado y le colocamos un nombre de instancia y le asignamos un objeto que contiene los métodos para poder usar en el juego
juego.state.add("gamePlay",funtions);
// agregamos el estado start para que inicie
juego.state.start("gamePlay")