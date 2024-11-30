import React, { useState } from 'react';
import styled from 'styled-components';
import { Button } from 'react95';
import startIcon from '../assets/start.png';

const TaskBarWrapper = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 28px;
  background: #c0c0c0;
  border-top: 1px solid white;
  display: flex;
  align-items: center;
  padding: 0 2px;
  z-index: 9999;
`;

const StartMenu = styled.div`
  position: absolute;
  bottom: 28px;
  left: 0;
  width: 200px;
  background: #c0c0c0;
  border: 1px solid black;
  padding: 2px;
`;

const MenuItem = styled.div`
  padding: 4px 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  
  &:hover {
    background: #000080;
    color: white;
  }

  img {
    width: 16px;
    height: 16px;
  }
`;

const Clock = styled.div`
  margin-left: auto;
  padding: 0 8px;
  border-left: 1px solid gray;
`;

export function TaskBar({ openWindows, onWindowClick }) {
  const [startOpen, setStartOpen] = useState(false);
  const [time, setTime] = useState(new Date().toLocaleTimeString());
  
  // Update clock every minute
  React.useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  return (
    <TaskBarWrapper>
      <Button 
        onClick={() => setStartOpen(!startOpen)} 
        active={startOpen}
        style={{ 
          padding: 0,
          width: '54px',
          height: '22px'
        }}
      >
        <img 
          src={startIcon} 
          alt="Start" 
          style={{ 
            width: '100%',
            height: '100%'
          }} 
        />
      </Button>

      {startOpen && (
        <StartMenu>
          <MenuItem onClick={() => {
            onWindowClick('ethbux');
            setStartOpen(false);
          }}>
            <img src="/icons/ethbux.png" alt="" />
            ETHBUX
          </MenuItem>
          <MenuItem onClick={() => {
            onWindowClick('minesweeper');
            setStartOpen(false);
          }}>
            <img src="/icons/minesweeper.png" alt="" />
            Minesweeper
          </MenuItem>
          <MenuItem onClick={() => {
            onWindowClick('display');
            setStartOpen(false);
          }}>
            <img src="/icons/display.png" alt="" />
            Display Properties
          </MenuItem>
          <MenuItem onClick={() => {
            onWindowClick('notepad');
            setStartOpen(false);
          }}>
            <img src="/icons/notepad.png" alt="" />
            Notepad
          </MenuItem>
          <MenuItem onClick={() => {
            onWindowClick('internet');
            setStartOpen(false);
          }}>
            <img src="/icons/internet.png" alt="" />
            Internet
          </MenuItem>
          <MenuItem onClick={() => {
            onWindowClick('doom');
            setStartOpen(false);
          }}>
            <img src="/icons/doom.png" alt="" />
            DOOM
          </MenuItem>
          <MenuItem onClick={() => window.location.reload()}>
            <img src="/icons/shutdown.png" alt="" />
            Shut Down...
          </MenuItem>
        </StartMenu>
      )}

      {/* Window buttons */}
      {Object.entries(openWindows).map(([name, isOpen]) => (
        isOpen && (
          <Button 
            key={name}
            onClick={() => onWindowClick(name)}
            active={true}
            style={{ marginLeft: 2 }}
          >
            {name.toUpperCase()}.EXE
          </Button>
        )
      ))}

      <Clock>{time}</Clock>
    </TaskBarWrapper>
  );
} 