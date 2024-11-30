import React from 'react';
import styled from 'styled-components';
import ethbuxIcon from '../assets/ETHBUX.png';
import notepadIcon from '../assets/Notepad.png';
import displayIcon from '../assets/Display.png';
import mypcIcon from '../assets/MyPC.png';
import mineIcon from '../assets/minesweeper/mineIcon.png';
import internetIcon from '../assets/internet.png';
import doomIcon from '../assets/doom.png';
import pinballIcon from '../assets/pinball.png';

const DesktopWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 28px;
  overflow: hidden;
`;

const Icon = styled.div`
  width: 75px;
  margin: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  
  &:hover span {
    background: #000080;
    color: white;
  }
  
  img {
    width: 32px;
    height: 32px;
    margin-bottom: 4px;
  }
  
  span {
    color: white;
    text-align: center;
    padding: 2px 4px;
    font-size: 11px;
    text-shadow: 1px 1px 1px black;
  }
`;

const icons = [
  {
    name: 'ETHBUX',
    icon: ethbuxIcon,
    window: 'ethbux'
  },
  {
    name: 'My Computer',
    icon: mypcIcon,
    window: 'computer'
  },
  {
    name: 'Notepad',
    icon: notepadIcon,
    window: 'notepad'
  },
  {
    name: 'Display',
    icon: displayIcon,
    window: 'display'
  },
  {
    name: 'Minesweeper',
    icon: mineIcon,
    window: 'minesweeper'
  },
  {
    name: 'Internet',
    icon: internetIcon,
    window: 'internet'
  },
  {
    name: 'DOOM',
    icon: doomIcon,
    window: 'doom'
  },
  {
    name: 'Pinball',
    icon: pinballIcon,
    window: 'pinball'
  }
];

export function Desktop({ onOpenWindow }) {
  return (
    <DesktopWrapper>
      {icons.map((icon) => (
        <Icon key={icon.name} onDoubleClick={() => onOpenWindow(icon.window)}>
          <img src={icon.icon} alt={icon.name} />
          <span>{icon.name}</span>
        </Icon>
      ))}
    </DesktopWrapper>
  );
} 