import Phaser from "phaser";
class PreloadScene extends Phaser.Scene {

	constructor() {
		super({key : 'preloadScene'});
	}

	preload() {

	}
    create() {
        const gameover = this.add.text(config.width / 2, 100, `GAME OVER`, {
            color: '#ff0',
            fontFamily: 'Tahoma',
            fontSize: 40,
            resolution: 2
        }).setOrigin(0.5, 0.5)
        
        this.restart = this.add.text(config.width / 2, 400, 'restart', {
            color: '#fff',
            fontFamily: 'Tahoma',
            fontSize: 40,
            resolution: 2
        }).setOrigin(0.5, 0.5).setInteractive({useHandCursor: true})
            .on('pointerup',() => {
            })
            .on('pointerover', () => {
                this.restart.alpha  = 0.5
            })
            .on('pointerout', () => {
                this.restart.alpha  = 1
            })
        
        this.add.text(config.width / 2, 200, `SCORE: ${score}`, {
            color: '#fff',
            fontFamily: 'Tahoma',
            fontSize: 40,
            resolution: 2
        }).setOrigin(0.5, 0.5)
        
        this.tweens.add({
            targets: gameover,
            y: { from: 0, to: 100 },
            ease: 'Bounce.easeOut',
            duration: 1000,
            repeat: 0,
            yoyo: false
        })
	}
}

export default PreloadScene;