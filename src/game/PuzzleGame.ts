import Phaser from 'phaser';

export interface GameSettings {
  gridSize: number;
  imageKey: string;
}

export class PuzzleGame extends Phaser.Scene {
  private gridSize: number = 3;
  private tileSize: number = 0;
  private tiles: Phaser.GameObjects.Sprite[] = [];
  private emptyPos: { x: number; y: number } = { x: 2, y: 2 };
  private solvable: boolean = false;
  private moves: number = 0;
  private onComplete: (moves: number, time: number) => void;
  private startTime: number = 0;
  private isGameOver: boolean = false;

  constructor(onComplete: (moves: number, time: number) => void) {
    super('PuzzleGame');
    this.onComplete = onComplete;
  }

  init(data: { gridSize: number }) {
    this.gridSize = data.gridSize || 3;
    this.emptyPos = { x: this.gridSize - 1, y: this.gridSize - 1 };
  }

  preload() {
    const imgId = this.gridSize === 3 ? 1011 : this.gridSize === 4 ? 1012 : 1013;
    this.load.image('vault_art', `https://picsum.photos/id/${imgId}/600/600`);
  }

  create() {
    const { width, height } = this.scale;
    this.tileSize = Math.min(width, height) / (this.gridSize + 1);
    const startX = (width - this.tileSize * this.gridSize) / 2 + this.tileSize / 2;
    const startY = (height - this.tileSize * this.gridSize) / 2 + this.tileSize / 2;

    this.tiles = [];
    this.moves = 0;
    this.isGameOver = false;
    this.startTime = this.time.now;

    // Create tiles
    for (let y = 0; y < this.gridSize; y++) {
      for (let x = 0; x < this.gridSize; x++) {
        if (x === this.emptyPos.x && y === this.emptyPos.y) continue;

        const tx = startX + x * this.tileSize;
        const ty = startY + y * this.tileSize;

        const tile = this.add.sprite(tx, ty, 'vault_art');
        tile.setDisplaySize(this.tileSize - 6, this.tileSize - 6);
        
        // Add a graphics object for each tile's border/glow
        const glow = this.add.graphics({ x: tx, y: ty });
        (tile as any).glow = glow;

        // Crop tile
        const frameWidth = 600 / this.gridSize;
        const frameHeight = 600 / this.gridSize;
        tile.setCrop(x * frameWidth, y * frameHeight, frameWidth, frameHeight);
        
        (tile as any).gridX = x;
        (tile as any).gridY = y;
        (tile as any).correctX = x;
        (tile as any).correctY = y;

        tile.setInteractive();
        tile.on('pointerdown', () => this.moveTile(tile));
        
        this.tiles.push(tile);
      }
    }
    
    this.updateGlows();
    this.shuffle();
  }

  updateGlows() {
    this.tiles.forEach(tile => {
      const isCorrect = (tile as any).gridX === (tile as any).correctX && (tile as any).gridY === (tile as any).correctY;
      const glow = (tile as any).glow as Phaser.GameObjects.Graphics;
      glow.clear();
      
      const size = this.tileSize - 6;
      const offset = -size / 2;
      
      if (isCorrect) {
        glow.lineStyle(3, 0xeab308, 1);
        glow.fillStyle(0xeab308, 0.15);
        glow.fillRect(offset, offset, size, size);
        // Outer glow simulation
        glow.lineStyle(1, 0xeab308, 0.4);
        glow.strokeRect(offset - 2, offset - 2, size + 4, size + 4);
      } else {
        glow.lineStyle(1, 0xeab308, 0.2);
      }
      glow.strokeRect(offset, offset, size, size);
    });
  }

  shuffle() {
    // Simple shuffle by making random moves
    for (let i = 0; i < 200; i++) {
      const neighbors = this.getNeighbors(this.emptyPos.x, this.emptyPos.y);
      const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
      this.swapWithEmpty(randomNeighbor, true);
    }
  }

  getNeighbors(x: number, y: number) {
    const n = [];
    if (x > 0) n.push({ x: x - 1, y });
    if (x < this.gridSize - 1) n.push({ x: x + 1, y });
    if (y > 0) n.push({ x, y: y - 1 });
    if (y < this.gridSize - 1) n.push({ x, y: y + 1 });
    return n;
  }

  moveTile(tile: Phaser.GameObjects.Sprite) {
    if (this.isGameOver) return;

    const tx = (tile as any).gridX;
    const ty = (tile as any).gridY;

    if (Math.abs(tx - this.emptyPos.x) + Math.abs(ty - this.emptyPos.y) === 1) {
      this.swapWithEmpty({ x: tx, y: ty });
      this.moves++;
      this.checkWin();
    }
  }

  swapWithEmpty(pos: { x: number; y: number }, instant: boolean = false) {
    const tile = this.tiles.find(t => (t as any).gridX === pos.x && (t as any).gridY === pos.y);
    if (tile) {
      const { width, height } = this.scale;
      const startX = (width - this.tileSize * this.gridSize) / 2 + this.tileSize / 2;
      const startY = (height - this.tileSize * this.gridSize) / 2 + this.tileSize / 2;

      const newX = startX + this.emptyPos.x * this.tileSize;
      const newY = startY + this.emptyPos.y * this.tileSize;

      if (instant) {
        tile.setPosition(newX, newY);
        if ((tile as any).glow) (tile as any).glow.setPosition(newX, newY);
      } else {
        this.tweens.add({
          targets: [tile, (tile as any).glow],
          x: newX,
          y: newY,
          duration: 100,
          ease: 'Power2',
          onComplete: () => this.updateGlows()
        });
      }

      const tempX = this.emptyPos.x;
      const tempY = this.emptyPos.y;
      this.emptyPos.x = (tile as any).gridX;
      this.emptyPos.y = (tile as any).gridY;
      (tile as any).gridX = tempX;
      (tile as any).gridY = tempY;
    }
  }

  checkWin() {
    const isWin = this.tiles.every(t => (t as any).gridX === (t as any).correctX && (t as any).gridY === (t as any).correctY);
    if (isWin) {
      this.isGameOver = true;
      
      // Success effect
      this.tiles.forEach(tile => {
        this.tweens.add({
          targets: tile,
          alpha: 0.8,
          scale: (this.tileSize - 2) / 100, // Slightly expand
          duration: 500,
          yoyo: true,
          repeat: -1
        });
      });

      const timeTaken = (this.time.now - this.startTime) / 1000;
      
      this.add.text(this.scale.width / 2, this.scale.height / 2, 'VAULT STABILIZED', {
        fontSize: '48px',
        color: '#eab308',
        fontStyle: 'bold',
        stroke: '#000',
        strokeThickness: 6
      }).setOrigin(0.5).setDepth(100);

      this.onComplete(this.moves, timeTaken);
    }
  }
}
