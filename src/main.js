import Phaser, { DOWN } from "phaser";
import sprite from '/FinnSprite.png'
import map from '../public/map.json'
import terrain from '../public/Terrain.png'
import pig from '../public/pig.png'
import coins from '../public/coins.png'
import gravity from '../public/gravity.png'
import decorations from '../public/Decorations.png'
import box from '../public/Fall (32x32).png'
import tresure from '../public/tresure.png'
import flag from '../public/flag.png'
import door from '../public/door.png'
import smallmap from '../public/smallmap.png'
import coinSound from '../public/coin01.mp3'
import bigCoinSound from '../public/bigcoin.wav'
import doorSound from '../public/door.wav'
import tpSound from '../public/tp.mp3'
import bgm from '../public/bgm.mp3'
import success from '../public/success.mp3'
import { gsap } from "gsap";
import PreloadScene from "./preloadScene";

const startScene={
    key: 'start',
	preload: function () {
		
	},
	create: function () {
        
        const key = this.add.text(config.width / 2, 100, 
        `操作方法 : ⬅ ⬆ ➡  `, {
            color: '#fff',
            fontFamily: 'Tahoma',
            fontSize: 40,
            resolution: 2
        }).setOrigin(0.5, 0.5)

        const description = this.add.text(config.width / 2, 200, 
        `目標 : 尋找地圖與寶廂 `, {
            color: '#fff',
            fontFamily: 'Tahoma',
            fontSize: 40,
            resolution: 2
        }).setOrigin(0.5, 0.5)

        const space = this.add.text(config.width / 2, 500, 
        `按下空白鍵進入`, {
            color: '#fff',
            fontFamily: 'Tahoma',
            fontSize: 40,
            resolution: 2
        }).setOrigin(0.5, 0.5)

        this.cursors = this.input.keyboard.createCursorKeys();
        
        
  
        
	},
    update:function(){
        if (this.cursors.space.isDown) {
           
            this.scene.start('main')
        }
    }
	
}
const scene = {
    key:'main',
    preload: function () {
        this.load.spritesheet('player', sprite, {
            frameWidth: 32,
            frameHeight: 32,
        })
        this.load.image('terrain', terrain)
        this.load.image('box', box)
        this.load.image('decorations', decorations)
        this.load.tilemapTiledJSON('map', map)
        this.load.spritesheet('pig', pig, {
            frameWidth: 38,
            frameHeight: 28
        })
        this.load.spritesheet('coins', coins, {
            frameWidth: 18,
            frameHeight: 14
        })
        this.load.spritesheet('gravity', gravity, {
            frameWidth: 96,
            frameHeight: 80
        })
        this.load.spritesheet('tresure', tresure, {
            frameWidth: 64,
            frameHeight: 35
        })
        this.load.spritesheet('flag', flag, {
            frameWidth: 34,
            frameHeight: 93
        })
        this.load.spritesheet('door', door, {
            frameWidth: 46,
            frameHeight: 56
        })
        this.load.spritesheet('smallmap', smallmap, {
            frameWidth: 30,
            frameHeight: 32
        })
        this.load.audio('coinSound', coinSound)
        this.load.audio('bigCoinSound', bigCoinSound)
        this.load.audio('doorSound', doorSound)
        this.load.audio('tpSound', tpSound)
        this.load.audio('bgm',bgm)
        this.load.audio('success',success)
    },
    create: function () {
        //map
        const map = this.make.tilemap({ key: 'map' })
        const terrianTiles = map.addTilesetImage('Terrain (32x32)', 'terrain', 32, 32)
        const decorations = map.addTilesetImage('Decorations (32x32)', 'decorations', 32, 32)
        const box = map.addTilesetImage('Fall (32x32)', 'box', 32, 32)
        const bgLayer = map.createLayer('bg', terrianTiles)
        const colliderLayer = map.createLayer('collider', [terrianTiles, decorations, box])
        colliderLayer.setCollisionFromCollisionGroup(true, false)

        //tresure
        this.tresure = this.add.sprite(960, 772, 'tresure', 0)

        // player
        this.player = this.add.sprite(270, 800, 'player', 1)

        //攻擊區域
        this.attackZone = this.add.zone(320, 180, 16, 10)

        //pig
        this.pig = this.add.sprite(500, 200, 'pig', 1)

        //flag
        this.flag = this.add.sprite(914, 820, 'flag', 1)

        //map
        this.map = this.add.sprite(312, 798, 'smallmap', 4)

        //傳送門

        this.gravity = this.add.sprite(969, 300, 'gravity', 0)

        //door
        this.door = this.add.sprite(766, 835, 'door', 0)

        //記分板
        const app = document.getElementById('app')
        let score = 0
        const scoreText = document.createElement('div')
        scoreText.id = 'scoreText'
        scoreText.innerText = `score:${score}`
        app.appendChild(scoreText)

        //coin-audio
        this.coinSound = this.sound.add("coinSound", { loop: false, delay: 0 });
        this.bigCoinSound = this.sound.add("bigCoinSound", { loop: false, delay: 0 });

        //door-audio
        this.doorSound= this.sound.add("doorSound", { loop: false, delay: 0 });

        //tp-audio
        this.tpSound= this.sound.add("tpSound", { loop: false, delay: 0 });

        //bgm
        this.bgm= this.sound.add("bgm", { loop: true, delay: 0 });
        this.bgm.play()

        //success
        this.success=this.sound.add("success", { loop: false, delay: 0 });
        //player animate
        this.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player', { start: 8, end: 15 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 7 }),
            frameRate: 6,
            repeat: -1
        })
        this.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('player', { start: 23, end: 27 }),
            frameRate: 10,
            repeat: 0
        })
        //如果攻擊動畫結束
        this.player.on('animationcomplete', (animate) => {
            if (animate.key === 'attack') {
                this.isAttack = false
            }
        })
        //如果寶相打開動畫結束
        this.tresure.on('animationcomplete', (animate) => {
            if (animate.key === 'tresure-open') {

            }
        })

        //pig-animate
        this.anims.create({
            key: 'pig-idle',
            frames: this.anims.generateFrameNumbers('pig', { start: 0, end: 10 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'pig-dead',
            frames: this.anims.generateFrameNumbers('pig', { start: 13, end: 15 }),
            frameRate: 10,
            repeat: -1
        })
        //gravity-animate
        this.anims.create({
            key: 'gravity',
            frames: this.anims.generateFrameNumbers('gravity', { start: 0, end: 19 }),
            frameRate: 20,
            repeat: -1
        })
        this.gravity.anims.play('gravity', true)
        //tresure-animate
        this.anims.create({
            key: 'tresure-open',
            frames: this.anims.generateFrameNumbers('tresure', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0
        })
        this.anims.create({
            key: 'tresure-idle',
            frames: this.anims.generateFrameNumbers('tresure', { start: 8, end: 12 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'tresure-close',
            frames: this.anims.generateFrameNumbers('tresure', { start: 13, end: 19 }),
            frameRate: 10,
            repeat: 0
        })
        //flag-animate
        this.anims.create({
            key: 'flag-idle',
            frames: this.anims.generateFrameNumbers('flag', { start: 0, end: 8 }),
            frameRate: 10,
            repeat: -1
        })
        this.flag.anims.play('flag-idle', true)

        //map-animate
        this.anims.create({
            key: 'map-idle',
            frames: this.anims.generateFrameNumbers('smallmap', { start: 4, end: 15 }),
            frameRate: 10,
            repeat: -1
        })
        this.map.anims.play('map-idle', true)

        //door-animate
        this.anims.create({
            key: 'door-open',
            frames: this.anims.generateFrameNumbers('door', { start: 0, end: 4 }),
            frameRate: 5,
            repeat: 0
        })

        //coins-animate
        this.anims.create({
            key: 'coins-idle',
            frames: this.anims.generateFrameNumbers('coins', { start: 0, end: 9 }),
            frameRate: 10,
            repeat: -1
        })
        this.anims.create({
            key: 'coins-disappear',
            frames: this.anims.generateFrameNumbers('coins', { start: 10, end: 11 }),
            frameRate: 10,
            repeat: 0,
            // hideOnComplete: true //動畫完成後隱藏
        })

        //coins
        this.coins = this.physics.add.group({
            key: 'coins',
            repeat: 2,
            setXY: { x: 350, y: 400, stepX: 120 }
        })
        this.physics.add.collider(this.coins, colliderLayer)
        this.coins.children.iterate(function (child) {
            child.anims.play('coins-idle', true)
        })

        // big-coins
        this.bigCoins = this.physics.add.group({
            key: 'coins',
            repeat: 1,
            setXY: { x: 740, y: 200 }
        })
        this.physics.add.collider(this.bigCoins, colliderLayer)
        this.bigCoins.children.iterate((child) => {
            child.anims.play('coins-idle', true)
            child.setScale(5)
            //粒子
            this.emitter = this.add.particles(child.x, child.y, "coins", {
                speed: {
                    min: 0,
                    max: 700
                },
                quantity: 100,
                lifespan: 3000,
                scale: {
                    min: 0.25,
                    max: 1
                },
                rotate: {
                    start: 0,
                    end: 360,
                    random: true
                },
                gravityY: 200,
                on: false
            });

            this.emitter.stop()
        })






        //物理
        this.physics.add.existing(this.player)//加入物理世界
        this.physics.add.existing(this.pig)
        this.physics.add.existing(this.attackZone)
        this.physics.add.existing(this.gravity)
        this.physics.add.existing(this.bigCoins)
        this.physics.add.existing(this.tresure)
        this.physics.add.existing(this.door)
        this.physics.add.existing(this.map)


        this.attackZone.body.allowGravity = false
        this.gravity.body.allowGravity = false
        this.door.body.allowGravity = false
        this.map.body.allowGravity = false
        this.physics.add.collider(this.tresure, colliderLayer)
        this.physics.add.collider(this.player, colliderLayer) //添加碰撞




        this.physics.add.collider(this.pig, colliderLayer)
        ////添加豬跟腳色重疊
        this.physics.add.overlap(this.attackZone, this.pig, () => {
            if (this.isAttack) {
                this.pig.anims.play('pig-dead', true)
                // this.add.text(this.player.x + 10, this.player.y - 10, 'Hello World', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif' });
            }
        })
        //添加鑽石跟腳色重疊
        this.physics.add.overlap(this.player, this.coins, (player, coin) => {

            coin.anims.play('coins-disappear', true)
            this.coinSound.play();
            //如果攻擊動畫結束
            coin.on('animationcomplete', (animate) => {
                if (animate.key === 'coins-disappear') {
                    coin.disableBody(true, true)
                    score += 1
                    scoreText.innerText = `score: ${Math.ceil(score / 16)}`
                }
            })

        })
        //添加大鑽石跟腳色重疊
        this.physics.add.overlap(this.player, this.bigCoins, (player, coin) => {
            this.emitter.start(0, 1)
            this.bigCoinSound.play();
            coin.anims.play('coins-disappear', true)

            coin.on('animationcomplete', (animate) => {
                if (animate.key === 'coins-disappear') {
                    coin.disableBody(true, true)
                    score += 9999
                    scoreText.innerText = `score: ${Math.ceil(score / 24)}`
                }
            })//如果攻擊動畫結束

        })
        //添加傳送門跟腳色重疊
        this.physics.add.overlap(this.player, this.gravity, (player, gravity) => {
            this.tpSound.play()
            player.x = 860
            player.y = 800

        })
        ////添加地圖跟腳色重疊
        const close2 = document.createElement('button')
        close2.setAttribute('class','close')
        this.resume = document.createElement('div')
        
        this.resume.setAttribute('class', 'workcontainer')
        this.isResume = false
        this.resume.innerHTML = `
        <button class="close"></button>
        <div class="block">
        <embed src="./public/我的新履歷.pdf" type="application/pdf" width="100%" height="100%">
        </div> `
        this.resume.appendChild(close2)
        this.physics.add.overlap(this.player, this.map, (player, map) => {
            let text
            if (Math.ceil(score / 16) < 4) {
                text = this.add.text(312, 760, '收集4顆鑽石解鎖', { fontSize: "14px", color: "#333333", lineSpacing: '5px' })


            } else {
                // text.setStyle({ fontSize: "0px" });
                if (!this.isResume) {
                    this.success.play()
                    document.body.appendChild(this.resume)
                    this.resume.style.display = 'block'
                    this.closeanimate2=gsap.to(this.resume, {
                        duration: 2,
                        ease: "elastic.out(3,0.25)",
                        y: 100,
                        yoyo: true
                    }).restart()
                    this.isResume=true
                }

               
            }
        })
        close2.addEventListener('click', () => {
            this.resume.style.display = 'none'
            this.closeanimate2.reverse()
            setTimeout(() => {
                this.isResume = false
            }, 2000)
        })

        //添加門跟腳色重疊
        this.physics.add.overlap(this.player, this.door, (player, gravity) => {
            this.door.anims.play('door-open', true)
            player.x = 683
            player.y = 800
            this.doorSound.play();
        })

        //添加寶廂跟腳色重疊
        const close = document.createElement('button')
        close.setAttribute('class','close')
        this.work = document.createElement('div')
        this.work.innerHTML =
            `<button class="close"></button>
            <div class="block">
        <a target="_blank" href="https://tsaicharlie.github.io/dist/"><img src="./public/military.png" alt=""></a>
        <p>
          
幫班長寫的招募網站
2024/2~2024/2
【獨立專案】

  -使用技術： VueJS / ThreeJS / GSAP / Blender
        <br/>
  -專案簡述：使用Blender建置3D模型，並利用ThreeJS與GSAP實現模型的動畫與互動功能
  <br/>

        </p>
      </div>
      <div class="block">
        <a target="_blank" href="https://tsaicharlie.github.io/backside/dist/#/"><img src="./public/後台.png" alt=""></a>
        <p>
        後臺管理系統
        2024/3~2024/3
        【獨立專案】
        <br/>
        - 使用技術： VueJS / Mock / ECHARTS / Pinia / Vue-Router / Element Plus
        <br/>
        - 專案簡述 :   使用Vue與Element Plus組件庫刻出畫面，並藉由Vue-Router實現切換頁面效果，應用Pinia狀態管理，利用Mock模擬後端數據並使用ECHARTS將數據展現成圖表
        </p>
      </div>
      `
        this.work.appendChild(close)
        this.work.setAttribute('class', 'workcontainer')

        this.isWork = false
        this.physics.add.overlap(this.player, this.tresure, (player, tresure) => {
            tresure.anims.play('tresure-open', true)
            this.success.play()
            if (!this.isWork) {

                document.body.appendChild(this.work)
                this.work.style.display = 'block'
                this.closeanimate = gsap.to(this.work, {
                    duration: 2,
                    ease: "elastic.out(3,0.25)",
                    y: 100,
                    yoyo: true
                }).restart()
                this.isWork = true
            }
        })

        close.addEventListener('click', () => {
            this.work.style.display = 'none'
            this.closeanimate.reverse()
            setTimeout(() => {
                this.isWork = false
            }, 1000)
        })

        this.tresure.anims.play('tresure-idle', true)

        this.player.body.setSize(20, 20) //必須加入物理才能用
        this.pig.body.setSize(20, 26)
        this.tresure.setScale(1.5)


        //相機
        this.cameras.main.setZoom(2)
        this.cameras.main.startFollow(this.player)//鏡頭跟隨


        this.cursors = this.input.keyboard.createCursorKeys();

        this.isAttack = false
        
            
      

    },
    update: function (time, delta) {
        if (this.player.flipX) {
            this.attackZone.x = this.player.x - 10
            this.attackZone.y = this.player.y
        } else {
            this.attackZone.x = this.player.x + 10
            this.attackZone.y = this.player.y
        }

        if (!this.isAttack) {
            if (this.cursors.left.isDown) {
                this.player.body.setVelocityX(-160);
                this.player.setFlipX(true)
                this.player.anims.play('run', true)

            }

            if (this.cursors.right.isDown) {
                this.player.body.setVelocityX(160);
                this.player.setFlipX(false)
                this.player.anims.play('run', true)

            }
            if (this.cursors.up.isDown && this.player.body.onFloor()) {
                this.player.body.setVelocityY(-500);
            }
            if (this.cursors.left.isUp && this.cursors.right.isUp && !this.isAttack) {
                this.player.body.setVelocityX(0);
                this.player.anims.play('idle', true)
                this.pig.anims.play('pig-idle', true)
            }
        }

        if (this.cursors.space.isDown) {
            this.player.anims.play('attack', true)
            this.isAttack = true
        }
        this.overlap = Phaser.Geom.Intersects.RectangleToRectangle(this.player.getBounds(), this.tresure.getBounds())

        if (!this.overlap) {
            this.tresure.anims.play('tresure-idle', true)

        }


    },
}
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene:[startScene,scene],
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 1000 },
            debug: false
        }
    },
    parent: 'app',
    dom: {
        createContainer: true
    }

};

const game = new Phaser.Game(config);