import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Window, WindowHeader, WindowContent, Button, ProgressBar } from 'react95';
import Draggable from 'react-draggable';
import dialUpSound from '../assets/dialUp.mp3';

const ConnectionWindow = styled(Window)`
  width: 380px;
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

const messages = [
  "Click Connect!",
  "Dialing...",
  "Establishing connection...",
  "Verifying username and password...",
  "Connecting to network...",
  "Synchronizing...",
  "Negotiating network protocols...",
  "Establishing PPP link...",
  "Requesting IP address...",
  "Could not establish a connection"
];

export function Internet({ onClose }) {
  const [connecting, setConnecting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const audioRef = useRef(new Audio(dialUpSound));

  const startConnection = () => {
    setConnecting(true);
    setProgress(0);
    setMessageIndex(1);
    audioRef.current.currentTime = 0;
    audioRef.current.play();
  };

  const resetConnection = () => {
    setConnecting(false);
    setProgress(0);
    setMessageIndex(0);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  useEffect(() => {
    if (connecting && messageIndex < messages.length - 1) {
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 1;
          // Update message every ~25% progress
          if (newProgress % 25 === 0) {
            setMessageIndex(prev => Math.min(prev + 1, messages.length - 1));
          }
          return newProgress;
        });
      }, 280); // 28 seconds / 100 steps = 280ms per step

      return () => clearInterval(interval);
    }
  }, [connecting, messageIndex]);

  useEffect(() => {
    if (progress >= 100) {
      setMessageIndex(messages.length - 1);
      setConnecting(false);
    }
  }, [progress]);

  useEffect(() => {
    return () => {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    };
  }, []);

  return (
    <Draggable handle=".window-header" bounds="parent">
      <ConnectionWindow>
        <WindowHeader className="window-header">
          Dial-Up Networking
          <CloseButton onClick={() => {
            resetConnection();
            onClose();
          }}>
            <span>×</span>
          </CloseButton>
        </WindowHeader>
        <WindowContent>
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ marginBottom: '1rem' }}>{messages[messageIndex]}</p>
            <ProgressBar
              value={progress}
              variant="tile"
              style={{ marginBottom: '1rem' }}
            />
          </div>
          {!connecting && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <Button onClick={startConnection}>
                {messageIndex === messages.length - 1 ? 'Retry' : 'Connect'}
              </Button>
              <Button onClick={onClose}>Cancel</Button>
            </div>
          )}
        </WindowContent>
      </ConnectionWindow>
    </Draggable>
  );
} 