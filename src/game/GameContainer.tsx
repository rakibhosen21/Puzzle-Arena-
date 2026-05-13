import React, { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import { PuzzleGame } from './PuzzleGame';

interface GameContainerProps {
  difficulty: number;
  onComplete: (moves: number, time: number) => void;
}

const GameContainer: React.FC<GameContainerProps> = ({ difficulty, onComplete }) => {
  const gameRef = useRef<HTMLDivElement>(null);
  const phaserRef = useRef<Phaser.Game | null>(null);

  useEffect(() => {
    if (!gameRef.current) return;

    const config: Phaser.Types.Core.GameConfig = {
      type: Phaser.AUTO,
      width: '100%',
      height: '100%',
      parent: gameRef.current,
      backgroundColor: '#0a0a0a',
      scene: [new PuzzleGame(onComplete)],
      scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
      },
    };

    phaserRef.current = new Phaser.Game(config);

    return () => {
      phaserRef.current?.destroy(true);
      phaserRef.current = null;
    };
  }, [onComplete]);

  // Handle difficulty changes by restarting scene
  useEffect(() => {
    if (phaserRef.current) {
      phaserRef.current.scene.start('PuzzleGame', { gridSize: difficulty });
    }
  }, [difficulty]);

  return (
    <div 
      ref={gameRef} 
      className="w-full h-full min-h-[400px] rounded-2xl overflow-hidden border border-yellow-500/30 shadow-[0_0_30px_rgba(234,179,8,0.2)] bg-black/60 backdrop-blur-md"
    />
  );
};

export default GameContainer;
