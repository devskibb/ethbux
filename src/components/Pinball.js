import React from 'react';
import styled from 'styled-components';
import { Window, WindowHeader, WindowContent, Button } from 'react95';
import Draggable from 'react-draggable';

const PinballWindow = styled(Window)`
  width: 800px;
  height: 600px;
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

const PinballFrame = styled.iframe`
  width: 100%;
  height: 100%;
  border: none;
  margin: 0;
  padding: 0;
  display: block;
`;

export function Pinball({ onClose }) {
  return (
    <Draggable bounds="parent" handle=".window-header">
      <PinballWindow>
        <WindowHeader className="window-header">
          PINBALL.EXE
          <CloseButton onClick={onClose}>
            <span>×</span>
          </CloseButton>
        </WindowHeader>
        <WindowContent style={{ padding: 0, height: 'calc(100% - 33px)', overflow: 'hidden' }}>
          <PinballFrame 
            src="https://98.js.org/programs/pinball/space-cadet.html"
            title="3D Pinball Space Cadet"
            allow="autoplay; fullscreen"
            allowFullScreen
            scrolling="no"
          />
        </WindowContent>
      </PinballWindow>
    </Draggable>
  );
} 