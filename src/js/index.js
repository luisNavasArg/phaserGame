const AMOUNT_DIAMONDS=30;
const AMOUNT_BOOBLES=30;
const funtions={
    init:function () {
        juego.scale.scaleMode=Phaser.ScaleManager.SHOW_ALL;
        juego.scale.pageAlignHorizontally=true;
        juego.scale.pageAlignVertically=true;
        this.flagFirstMouseDown=false;
        this.amountDiamondsCaught=0;
        this.endGame=false;
        this.countSmile=-1;
    },
    preload:function () {
        juego.load.image('background','src/assets/images/background.png')
        juego.load.spritesheet("im", "src/assets/images/horse.png",84,156,2)
        juego.load.spritesheet('diamonds',"src/assets/images/diamonds.png",81,84,4);
        juego.load.image('explosion',"src/assets/images/explosion.png");
        juego.load.image('shark',"src/assets/images/shark.png");
        juego.load.image('fishes',"src/assets/images/fishes.png");
        juego.load.image('mollusk',"src/assets/images/mollusk.png");
        juego.load.image('booble1',"src/assets/images/booble1.png");
        juego.load.image('booble2',"src/assets/images/booble2.png");
    },
    create:function () {
        
        juego.add.sprite(0,0, 'background');
        this.boobleArray=[];
        for (let i = 0; i < AMOUNT_BOOBLES; i++) {
            let xBooble=juego.rnd.integerInRange(1,1140);
            let yBooble=juego.rnd.integerInRange(600,950);
            let booble = juego.add.sprite(xBooble,yBooble,'booble'+juego.rnd.integerInRange(1,2));
            booble.vel=0.2+juego.rnd.frac()*2;
            booble.alpha=0.9;
            booble.scale.setTo(0.2+juego.rnd.frac());
            this.boobleArray[i]=booble;
        }
        this.mollusk=juego.add.sprite(500,150,'mollusk');
        this.shark=juego.add.sprite(500,20,'shark');
        this.fishes=juego.add.sprite(100,550,'fishes');
        

        this.horse =juego.add.sprite(0,0, 'im');
        this.horse.frame=1;
        this.horse.x=juego.width/2;
        this.horse.y = juego.height/2;
        this.horse.anchor.setTo(0.5,0.5)
        juego.input.onDown.add(this.onTap,this);
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
        this.explosion.kill();
       } 
       this.currentscore=0;
       let style={
        font:'bold 30pt Arial',
        fill:'#fff',
        aling:'center'
       };   
       this.scoreText=juego.add.text(juego.width/2,40,'0',style); 
       this.scoreText.anchor.setTo(0.5); 
       this.totalTime=30;
       this.timerText=juego.add.text(1000,40,`Tiempo: ${this.totalTime}`,style); 
       this.timerText.anchor.setTo(0.5); 
       this.timerGameOver=juego.time.events.loop(Phaser.Timer.SECOND,function () {
        if (this.flagFirstMouseDown) {
            
            this.totalTime--;
            this.timerText.text=`Tiempo: ${this.totalTime}`;
            if (this.totalTime<=0) {
                juego.time.events.remove(this.timerGameOver);
                this.endGame=true;
                this.showFinalMessage("Game over");
            }
        }
       },this)
       
    },
    increaseScore:function () {
        this.countSmile=0;
        this.horse.frame=1;
        this.currentscore+=100;
        this.scoreText.text=this.currentscore;
        this.amountDiamondsCaught+=1;
        if (this.amountDiamondsCaught>=AMOUNT_DIAMONDS) {
            this.endGame=true;
            this.showFinalMessage("¡felicidades ganaste!");
            juego.time.events.remove(this.timerGameOver);
        }
    },
    showFinalMessage:function (msg) {
        this.tweenMollusk.stop();
        let bgAlpha=juego.add.bitmapData(juego.width,juego.height);
        bgAlpha.ctx.fillStyle='#000';
        bgAlpha.ctx.fillRect(0,0,juego.width,juego.height);
        let bg = juego.add.sprite(0,0,bgAlpha);
        bg.alpha=0.5;
        let style={
            font:'bold 60pt Arial',
        fill:'#fff',
        aling:'center'
        };
        console.log(juego.width);
        this.textFinalMessage = juego.add.text(juego.width/2,juego.height/2,msg,style);
        this.textFinalMessage.anchor.setTo(0.5);
    },
    onTap:function () {
        if (!this.flagFirstMouseDown) {
            this.tweenMollusk= juego.add.tween(this.mollusk.position).to({
                y:-0.001
            },
            5822,
            Phaser.Easing.Cubic.InOut,true,0,100,
            true).loop(true);
        }
        this.flagFirstMouseDown=true;
    },
    getBoundsDiamonds:function (currentDiamond) {
        return new Phaser.Rectangle(currentDiamond.left,currentDiamond.top,
            currentDiamond.width,currentDiamond.height);
    },
    isRentangleOverLapping:function (rect1,rect2) {
        if (rect1.x>rect2.x+rect2.width || rect2.x>rect1.x+rect1.width) {
            return false;
        }   
        if (rect1.y>rect2.y+rect2.height || rect2.y>rect1.y+rect1.height){
            return false;
        } 
        return true;
    },
    isOverLappingDiamond:function (index,rect2) {
        for (let i = 0; i < index; i++) {
            let rect1=this.getBoundsDiamonds(this.diamonds[i]);
            if (this.isRentangleOverLapping(rect1,rect2)) {
                return true
                
            }
            
        }
        return false;
    },
    getBoundsHorse:function () {
       
        let x0=this.horse.x - Math.abs(this.horse.width)/4;
        let width=Math.abs(this.horse.width)/2;
        let y0=this.horse.y - this.horse.width/2;
        let height=this.horse.height;
        return new Phaser.Rectangle(x0,y0,width,height);
    },
    update:function () {
    

    let pointerX=juego.input.x;
    let pointerY=juego.input.y;

    if (this.flagFirstMouseDown && !this.endGame) {
        for (let a = 0; a < AMOUNT_BOOBLES; a++) {
            let booble=this.boobleArray[a];
            booble.y-= booble.vel;
            if (booble.y<-50) {
                booble.y=700;
                booble.x=juego.rnd.integerInRange(1,1140);
            }
            
        }
        if (this.countSmile>=0) {
            this.countSmile++;
            if (this.countSmile>50) {
                this.countSmile=-1;
                this.horse.frame=0;
            }
        }
        this.shark.x--;
        this.fishes.x++;
        if (this.shark.x<-300) {
            this.shark.x=1300;
        }
        if (this.fishes.x>1300) {
            this.fishes.x=-300;
        }

    let distX=pointerX-this.horse.x;
    let distY=pointerY-this.horse.y;
    if(distX>0){
        this.horse.scale.setTo(1,1);
    }else{
        this.horse.scale.setTo(-1,1);
    }
  
    this.horse.x+=distX*0.02;
    this.horse.y+=distY*0.02;
        
    }
    for (let i = 0; i < AMOUNT_DIAMONDS; i++) {
        let rectHorse=this.getBoundsHorse();
        let rectDiamond=this.getBoundsDiamonds(this.diamonds[i]);
        if (this.diamonds[i].visible && this.isRentangleOverLapping(rectHorse,rectDiamond)) {
            this.diamonds[i].visible=false;
            this.increaseScore();
            let explosionInt = this.explosionGroup.getFirstDead();
            if (explosionInt!=null) {
                explosionInt.reset(this.diamonds[i].x,this.diamonds[i].y);
                explosionInt.tweenScale.start();
                explosionInt.tweenAlpha.start();
                explosionInt.tweenAlpha.onComplete.add(function (currentTarget,currentTween) {
                    currentTarget.kill();
                    
                },this);
            }
        }
    } 
    }
};
let juego = new Phaser.Game(1136,647,Phaser.CANVAS,funtions);
juego.state.add("gamePlay",funtions);
juego.state.start("gamePlay")