import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Window, WindowHeader, Button } from 'react95';
import Draggable from 'react-draggable';

import frameImg from '../assets/minesweeper/frame.png';
import mineBlockImg from '../assets/minesweeper/mineBlock.png';
import aliveFaceImg from '../assets/minesweeper/aliveFace.png';
import deadFaceImg from '../assets/minesweeper/deadFace.png';
import mine1Img from '../assets/minesweeper/mine1.png';
import mine2Img from '../assets/minesweeper/mine2.png';
import flagImg from '../assets/minesweeper/flag.png';
import emptyCellImg from '../assets/minesweeper/emptyCell.png';

const GameWindow = styled(Window)`
  width: 176px;  // Increased from 156px
  user-select: none;
`;

const GameFrame = styled.div`
  background-image: url(${frameImg});
  background-repeat: no-repeat;
  width: 196px;  // Increased from 156px
  height: 206px;  // Increased from 182px
  position: relative;
`;

const Face = styled.div`
  position: absolute;
  top: 15px;
  left: 71px;
  width: 26px;
  height: 26px;
  background-image: url(${props => props.dead ? deadFaceImg : aliveFaceImg});
  cursor: pointer;
`;

const Grid = styled.div`
  position: absolute;
  top: 55px;
  left: 12px;
  display: grid;
  grid-template-columns: repeat(9, 16px);
  grid-template-rows: repeat(9, 16px);
  gap: 0px;
`;

const Cell = styled.div`
  width: 16px;
  height: 16px;
  background-image: url(${props => props.image});
  background-size: cover;
  background-repeat: no-repeat;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Arial';
  font-weight: bold;
  font-size: 12px;
  color: ${props => {
    switch(props.number) {
      case 1: return '#0000FF';  // blue
      case 2: return '#008000';  // green
      case 3: return '#FF0000';  // red
      case 4: return '#000080';  // navy
      case 5: return '#800000';  // maroon
      case 6: return '#008080';  // teal
      case 7: return '#000000';  // black
      case 8: return '#808080';  // gray
      default: return 'transparent';
    }
  }};
`;

const Counter = styled.div`
  position: absolute;
  width: 39px;
  height: 23px;
  color: red;
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: 'Digital';
  font-size: 20px;
  
  &.timer {
    top: 16px;
    left: 17px;
  }
  
  &.score {
    top: 16px;
    left: 110px;
  }
`;

const CloseButton = styled(Button)`
  position: absolute !important;
  right: 10px !important;
  top: 12px !important;
  width: 22px !important;
  height: 22px !important;
  padding: 0 !important;
  display: flex !important;
  align-items: center;
  justify-content: center;
  
  span {
    font-size: 18px;
    transform: translateY(-1px);
  }
`;

export function Minesweeper({ onClose }) {
  const [grid, setGrid] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [flags, setFlags] = useState(10);
  const [time, setTime] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [firstClick, setFirstClick] = useState(true);

  // Initialize grid
  useEffect(() => {
    initializeGrid();
  }, []);

  // Timer
  useEffect(() => {
    let interval;
    if (gameStarted && !gameOver) {
      interval = setInterval(() => {
        setTime(t => Math.min(999, t + 1));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [gameStarted, gameOver]);

  const initializeGrid = () => {
    const newGrid = Array(9).fill().map(() => 
      Array(9).fill().map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
    setGrid(newGrid);
    setGameOver(false);
    setFlags(10);
    setTime(0);
    setGameStarted(false);
    setFirstClick(true);
  };

  const placeMines = (firstClickRow, firstClickCol) => {
    const newGrid = [...grid];
    let minesPlaced = 0;
    
    while (minesPlaced < 10) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      // Don't place mine on first click or where there's already a mine
      if (!newGrid[row][col].isMine && 
          !(row === firstClickRow && col === firstClickCol) &&
          !(Math.abs(row - firstClickRow) <= 1 && Math.abs(col - firstClickCol) <= 1)) {
        newGrid[row][col].isMine = true;
        minesPlaced++;
      }
    }

    // Calculate neighbor mines
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!newGrid[row][col].isMine) {
          let count = 0;
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              if (row + i >= 0 && row + i < 9 && col + j >= 0 && col + j < 9) {
                if (newGrid[row + i][col + j].isMine) count++;
              }
            }
          }
          newGrid[row][col].neighborMines = count;
        }
      }
    }
    
    setGrid(newGrid);
  };

  const revealCell = (row, col) => {
    if (!grid[row][col] || grid[row][col].isFlagged || grid[row][col].isRevealed) return;

    if (firstClick) {
      setFirstClick(false);
      setGameStarted(true);
      placeMines(row, col);
      const newGrid = [...grid];
      newGrid[row][col].isRevealed = true;
      setGrid(newGrid);
      return;
    }

    const newGrid = [...grid];
    newGrid[row][col].isRevealed = true;

    if (newGrid[row][col].isMine) {
      newGrid[row][col].isExploded = true;
      revealAllMines();
      setGameOver(true);
      return;
    }

    // If empty cell, reveal neighbors
    if (newGrid[row][col].neighborMines === 0) {
      const stack = [[row, col]];
      
      while (stack.length > 0) {
        const [currentRow, currentCol] = stack.pop();
        
        // Check all adjacent cells
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            const newRow = currentRow + i;
            const newCol = currentCol + j;
            
            if (
              newRow >= 0 && newRow < 9 && 
              newCol >= 0 && newCol < 9 && 
              !newGrid[newRow][newCol].isRevealed && 
              !newGrid[newRow][newCol].isFlagged && 
              !newGrid[newRow][newCol].isMine
            ) {
              newGrid[newRow][newCol].isRevealed = true;
              if (newGrid[newRow][newCol].neighborMines === 0) {
                stack.push([newRow, newCol]);
              }
            }
          }
        }
      }
    }

    setGrid(newGrid);
    checkWin();
  };

  const toggleFlag = (e, row, col) => {
    e.preventDefault();
    if (gameOver || grid[row][col].isRevealed) return;

    const newGrid = [...grid];
    if (!newGrid[row][col].isFlagged && flags > 0) {
      newGrid[row][col].isFlagged = true;
      setFlags(flags - 1);
    } else if (newGrid[row][col].isFlagged) {
      newGrid[row][col].isFlagged = false;
      setFlags(flags + 1);
    }
    setGrid(newGrid);
  };

  const revealAllMines = () => {
    const newGrid = [...grid];
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (newGrid[row][col].isMine) {
          newGrid[row][col].isRevealed = true;
        }
      }
    }
    setGrid(newGrid);
  };

  const checkWin = () => {
    let unrevealedSafeCells = 0;
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (!grid[row][col].isMine && !grid[row][col].isRevealed) {
          unrevealedSafeCells++;
        }
      }
    }
    if (unrevealedSafeCells === 0) {
      setGameOver(true);
      // Flag all mines
      const newGrid = [...grid];
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (newGrid[row][col].isMine) {
            newGrid[row][col].isFlagged = true;
          }
        }
      }
      setGrid(newGrid);
      setFlags(0);
    }
  };

  return (
    <Draggable handle=".window-header" bounds="parent">
      <GameWindow>
        <WindowHeader className="window-header">
          Minesweeper
          <CloseButton onClick={onClose}>
            <span>×</span>
          </CloseButton>
        </WindowHeader>
        <GameFrame>
          <Counter className="timer">{String(time).padStart(3, '0')}</Counter>
          <Counter className="score">{String(flags).padStart(3, '0')}</Counter>
          <Face 
            dead={gameOver} 
            onClick={initializeGrid}
          />
          <Grid>
            {grid.map((row, rowIndex) => 
              row.map((cell, colIndex) => (
                <Cell
                  key={`${rowIndex}-${colIndex}`}
                  onClick={() => !gameOver && revealCell(rowIndex, colIndex)}
                  onContextMenu={(e) => !gameOver && toggleFlag(e, rowIndex, colIndex)}
                  image={
                    cell.isRevealed
                      ? cell.isMine
                        ? cell.isExploded
                          ? mine2Img
                          : mine1Img
                        : emptyCellImg
                      : cell.isFlagged
                      ? flagImg
                      : mineBlockImg
                  }
                  number={cell.isRevealed && !cell.isMine ? cell.neighborMines : 0}
                >
                  {cell.isRevealed && !cell.isMine && cell.neighborMines > 0 && cell.neighborMines}
                </Cell>
              ))
            )}
          </Grid>
        </GameFrame>
      </GameWindow>
    </Draggable>
  );
} 