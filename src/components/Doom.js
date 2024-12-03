import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Window, WindowHeader, WindowContent, Button } from 'react95';
import Draggable from 'react-draggable';

const DoomWindow = styled(Window)`
  width: 650px;
  height: 440px;
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

export function Doom({ onClose }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const iframe = document.createElement('iframe');
    iframe.src = 'https://archive.org/embed/doom-play';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    
    if (canvasRef.current) {
      canvasRef.current.appendChild(iframe);
    }

    return () => {
      if (canvasRef.current) {
        canvasRef.current.innerHTML = '';
      }
    };
  }, []);

  return (
    <Draggable bounds="parent" handle=".window-header">
      <DoomWindow>
        <WindowHeader className="window-header">
          DOOM.EXE
          <CloseButton onClick={onClose}>
            <span>×</span>
          </CloseButton>
        </WindowHeader>
        <WindowContent style={{ padding: 0, height: 'calc(100% - 33px)', overflow: 'hidden' }}>
          <div ref={canvasRef} style={{ width: '100%', height: '100%' }} />
        </WindowContent>
      </DoomWindow>
    </Draggable>
  );
} 