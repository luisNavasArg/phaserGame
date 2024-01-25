// creamos la contante para el grupo de diamantes
const AMOUNT_DIAMONDS=30;
const funtions={
    init:function () {
        // Agregamos la propiedad scaleMode para que se ajuste al viewport
        juego.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
        //alineamos el juego en elcentro
        juego.scale.pageAlignHorizontally=true;
        juego.scale.pageAlignVertically=true;
        // creamos un flag para el inicio 
        this.flagFirstMouseDown=false;
    },
    preload:function () {
        // agregamos la imagen de fondo usando la propiedad load y el método image
        // que recibe dos parámetros un alias, y el path donde está la imagen
        juego.load.image('background','src/assets/images/background.png')
        //cargamos nuestro personaje 
        // pasamos 5 parámetros, alias,path,ancho,alto,cantidad de inagenes
        juego.load.spritesheet("im", "src/assets/images/horse.png",84,156,2)
        // Cargando los diamantes
        juego.load.spritesheet('diamonds',"src/assets/images/diamonds.png",81,84,4);
        //cargando la explosión para la animación
        juego.load.image('explosion',"src/assets/images/explosion.png");
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
        // capturamos el primer click en pantalla
        juego.input.onDown.add(this.onTap,this);

        // array para los diamantes
        this.diamonds=[];
        for (let i = 0; i < AMOUNT_DIAMONDS; i++) {
            let diamond = juego.add.sprite(100,100,'diamonds');
            diamond.frame = juego.rnd.integerInRange(0,3);
            diamond.scale.setTo(0.30+juego.rnd.frac());
            diamond.anchor.setTo(0.5);
            diamond.x=juego.rnd.integerInRange(50,1050);
            diamond.y=juego.rnd.integerInRange(50,600);
            this.diamonds[i]=diamond;
            let rectCurrentDiamond=this.getBoundsDiamonds(diamond);
            let rectHorse=this.getBoundsDiamonds(this.horse);
            while (this.isOverLappingDiamond(i,rectCurrentDiamond) ||
            this.isRentangleOverLapping(rectHorse,rectCurrentDiamond)) {
                diamond.x=juego.rnd.integerInRange(50,1050);
                diamond.y=juego.rnd.integerInRange(50,600);
                rectCurrentDiamond = this.getBoundsDiamonds(diamond);
            }
        }

        this.explosionGroup = juego.add.group();
       for (let i = 0; i < 10; i++) {
        this.explosion=this.explosionGroup.create(100,100,'explosion');
        this.explosion.tweenScale= juego.add.tween(this.explosion.scale).to(
            {x:[0.4,0.8,0.4], y:[0.4,0.8,0.4]},600, Phaser.Easing.Exponential.Out,
             false,0,0,false
        );
        this.explosion.tweenAlpha= juego.add.tween(this.explosion).to(
            {alpha:[1,0.6,0]},600, Phaser.Easing.Exponential.Out,
            false,0,0,false
        );
        this.explosion.anchor.setTo(0.5,0.5);
        //kill lo hace invisible y lo deja disponible
        this.explosion.kill();
        
       } 
       
       
        
    },
    // creamos la función para el flag
    onTap:function () {
        this.flagFirstMouseDown=true;
    },
    //función para devolver rectangulo de los diamantes
    getBoundsDiamonds:function (currentDiamond) {
        return new Phaser.Rectangle(currentDiamond.left,currentDiamond.top,
            currentDiamond.width,currentDiamond.height);
    },
    //funcion para saber si están en la misma coordenada
    isRentangleOverLapping:function (rect1,rect2) {
        if (rect1.x>rect2.x+rect2.width || rect2.x>rect1.x+rect1.width) {
            return false;
        }   
        if (rect1.y>rect2.y+rect2.height || rect2.y>rect1.y+rect1.height){
            return false;
        } 
        return true;
    },
    // 5.comparar el rectangulo con el anterior para ver si colisionan
    isOverLappingDiamond:function (index,rect2) {
        for (let i = 0; i < index; i++) {
            let rect1=this.getBoundsDiamonds(this.diamonds[i]);
            if (this.isRentangleOverLapping(rect1,rect2)) {
                return true
                
            }
            
        }
        return false;
    },
    //1.función para dtectar los bordes del personaje
    getBoundsHorse:function () {
        //inicial
        // let x0=this.horse.x - Math.abs(this.horse.width)/2;
        // let width=Math.abs(this.horse.width);
        //mejorando la colisión visual
        let x0=this.horse.x - Math.abs(this.horse.width)/4;
        let width=Math.abs(this.horse.width)/2;
        let y0=this.horse.y - this.horse.width/2;
        let height=this.horse.height;
        return new Phaser.Rectangle(x0,y0,width,height);
    },
    //para ver el rectangulo de la imagen
    render:function () {
        // juego.debug.spriteBounds(this.horse);
        for (let i = 0; i < AMOUNT_DIAMONDS; i++) {
            // juego.debug.spriteBounds(this.diamonds[i]);
      
            
        }
    },
    // es llamado frame a frame
    update:function () {
        // this.horse.angle+=1;
        //capturamos el puntero dentro del juego
    let pointerX=juego.input.x;
    let pointerY=juego.input.y;

    // console.log(pointerX);
    // console.log(pointerY);
    if (this.flagFirstMouseDown) {
          //calculamos la distancia entre el cursor y el personaje
    let distX=pointerX-this.horse.x;
    let distY=pointerY-this.horse.y;
    if(distX>0){
        this.horse.scale.setTo(1,1);
    }else{
        this.horse.scale.setTo(-1,1);
    }
    // hacemos que se mueva en dirección del cursor
    this.horse.x+=distX*0.02;
    this.horse.y+=distY*0.02;
        
    }
    for (let i = 0; i < AMOUNT_DIAMONDS; i++) {
        let rectHorse=this.getBoundsHorse();
        let rectDiamond=this.getBoundsDiamonds(this.diamonds[i]);
        if (this.diamonds[i].visible && this.isRentangleOverLapping(rectHorse,rectDiamond)) {
            this.diamonds[i].visible=false;
            let explosionInt = this.explosionGroup.getFirstDead();
            if (explosionInt!=null) {
                explosionInt.reset(this.diamonds[i].x,this.diamonds[i].y);
                explosionInt.tweenScale.start();
                explosionInt.tweenAlpha.start();
                //para poder usar de nuevo los tweens 
                explosionInt.tweenAlpha.onComplete.add(function (currentTarget,currentTween) {
                    currentTarget.kill();
                },this);
            }
            

        }
        
    }
        
    }
};
let juego = new Phaser.Game(1136,647,Phaser.CANVAS,funtions);
// agregamos un estado y le colocamos un nombre de instancia y le asignamos un objeto que contiene los métodos para poder usar en el juego
juego.state.add("gamePlay",funtions);
// agregamos el estado start para que inicie
juego.state.start("gamePlay")