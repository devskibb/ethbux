import React, { useState } from 'react';
import styled from 'styled-components';
import { Window, WindowHeader, WindowContent, Button } from 'react95';
import Draggable from 'react-draggable';
import folderIcon from '../assets/folder.png';
import fileIcon from '../assets/file.png';
import openFolderIcon from '../assets/openFolder.png';
import blankFileIcon from '../assets/blankfile.png';

const ComputerWindow = styled(Window)`
  width: 400px;
  min-height: 300px;
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

const FileGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, 80px);
  gap: 20px;
  padding: 20px;
`;

const FileIcon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  cursor: pointer;
  padding: 5px;
  
  &:hover {
    background: #000080;
    color: white;
  }
  
  img {
    width: 32px;
    height: 32px;
    margin-bottom: 5px;
  }
  
  span {
    font-size: 11px;
    word-wrap: break-word;
    width: 100%;
  }
`;

const ErrorWindow = styled(Window)`
  width: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const PasswordWindow = styled(Window)`
  width: 300px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

export function MyComputer({ onClose }) {
  const [currentPath, setCurrentPath] = useState('/');
  const [showError, setShowError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  
  const handleFileClick = () => {
    setShowError(true);
  };

  const handleFolderClick = (folder) => {
    if (folder === 'super secret') {
      setShowPassword(true);
      return;
    }
    setCurrentPath(folder);
  };

  const handlePasswordSubmit = () => {
    setPasswordError('Incorrect password. Access denied!');
    setPassword('');
  };

  const renderContents = () => {
    if (currentPath === '/') {
      return (
        <FileGrid>
          <FileIcon onClick={() => handleFolderClick('super secret')}>
            <img src={folderIcon} alt="Folder" />
            <span>super secret</span>
          </FileIcon>
          <FileIcon onClick={handleFileClick}>
            <img src={fileIcon} alt="File" />
            <span>2012wallet.dat</span>
          </FileIcon>
          <FileIcon onClick={() => handleFolderClick('p0rn')}>
            <img src={openFolderIcon} alt="Open Folder" />
            <span>p0rn</span>
          </FileIcon>
        </FileGrid>
      );
    }
    
    if (currentPath === 'p0rn') {
      return (
        <FileGrid>
          <FileIcon onClick={() => setCurrentPath('/')}>
            <img src={folderIcon} alt="Back" />
            <span>..</span>
          </FileIcon>
          <FileIcon onClick={handleFileClick}>
            <img src={blankFileIcon} alt="File" />
            <span>tiffanyFong.jpg</span>
          </FileIcon>
          <FileIcon onClick={handleFileClick}>
            <img src={blankFileIcon} alt="File" />
            <span>cobieledger.jpg</span>
          </FileIcon>
          <FileIcon onClick={handleFileClick}>
            <img src={blankFileIcon} alt="File" />
            <span>zachFaceDoxx.jpg</span>
          </FileIcon>
        </FileGrid>
      );
    }
  };

  return (
    <>
      <Draggable handle=".window-header" bounds="parent">
        <ComputerWindow>
          <WindowHeader className="window-header">
            My Computer - {currentPath === '/' ? 'C:' : `C:/${currentPath}`}
            <CloseButton onClick={onClose}>
              <span>×</span>
            </CloseButton>
          </WindowHeader>
          <WindowContent>
            {renderContents()}
          </WindowContent>
        </ComputerWindow>
      </Draggable>

      {showError && (
        <Draggable handle=".window-header" bounds="parent">
          <ErrorWindow>
            <WindowHeader className="window-header">
              Error
              <CloseButton onClick={() => setShowError(false)}>
                <span>×</span>
              </CloseButton>
            </WindowHeader>
            <WindowContent>
              <p>File corrupted! Cannot open!</p>
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
                <Button onClick={() => setShowError(false)}>OK</Button>
              </div>
            </WindowContent>
          </ErrorWindow>
        </Draggable>
      )}

      {showPassword && (
        <Draggable handle=".window-header" bounds="parent">
          <PasswordWindow>
            <WindowHeader className="window-header">
              Password Required
              <CloseButton onClick={() => {
                setShowPassword(false);
                setPassword('');
                setPasswordError('');
              }}>
                <span>×</span>
              </CloseButton>
            </WindowHeader>
            <WindowContent>
              <p>This folder is password protected.</p>
              <p>Please enter password:</p>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError('');
                }}
                style={{ 
                  width: '100%', 
                  marginTop: 10, 
                  marginBottom: 10,
                  padding: '2px 4px'
                }}
              />
              {passwordError && (
                <p style={{ 
                  color: 'red', 
                  margin: '10px 0', 
                  fontSize: '11px'
                }}>
                  {passwordError}
                </p>
              )}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 10, marginTop: 20 }}>
                <Button onClick={handlePasswordSubmit}>OK</Button>
                <Button onClick={() => {
                  setShowPassword(false);
                  setPassword('');
                  setPasswordError('');
                }}>
                  Cancel
                </Button>
              </div>
            </WindowContent>
          </PasswordWindow>
        </Draggable>
      )}
    </>
  );
} 