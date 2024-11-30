import React, { useState } from 'react';
import styled from 'styled-components';
import { 
  Window, 
  WindowHeader, 
  WindowContent, 
  Button, 
  MenuList,
  MenuListItem,
  Separator,
  TextInput
} from 'react95';
import Draggable from 'react-draggable';

const NotepadWindow = styled(Window)`
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

const TextArea = styled.textarea`
  width: 100%;
  min-height: 250px;
  padding: 2px;
  background: white;
  border: none;
  border-left: 1px solid gray;
  border-top: 1px solid gray;
  border-right: 1px solid white;
  border-bottom: 1px solid white;
  font-family: 'ms_sans_serif';
  font-size: 14px;
  resize: none;
  &:focus {
    outline: none;
  }
`;

const MenuBar = styled.div`
  padding: 2px;
  display: flex;
  gap: 4px;
`;

const MenuButton = styled(Button)`
  padding: 2px 6px;
  &:focus {
    outline: none;
  }
`;

const Menu = styled.div`
  position: relative;
`;

const MenuContent = styled.div`
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 100;
`;

export function Notepad({ onClose }) {
  const [text, setText] = useState('');
  const [activeMenu, setActiveMenu] = useState(null);
  
  const handleMenuClick = (menu) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const handleSave = () => {
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Untitled.txt';
    a.click();
    URL.revokeObjectURL(url);
    setActiveMenu(null);
  };

  return (
    <Draggable handle=".window-header" bounds="parent">
      <NotepadWindow style={{ position: 'absolute', left: '30%', top: '15%' }}>
        <WindowHeader className="window-header">
          Untitled - Notepad
          <CloseButton onClick={onClose}>
            <span>×</span>
          </CloseButton>
        </WindowHeader>
        
        <MenuBar>
          <Menu>
            <MenuButton 
              onClick={() => handleMenuClick('file')}
              active={activeMenu === 'file'}
            >
              File
            </MenuButton>
            {activeMenu === 'file' && (
              <MenuContent>
                <MenuList>
                  <MenuListItem onClick={() => {setText(''); setActiveMenu(null);}}>New</MenuListItem>
                  <MenuListItem onClick={handleSave}>Save</MenuListItem>
                  <Separator />
                  <MenuListItem onClick={onClose}>Exit</MenuListItem>
                </MenuList>
              </MenuContent>
            )}
          </Menu>
        </MenuBar>

        <WindowContent>
          <TextArea 
            value={text}
            onChange={(e) => setText(e.target.value)}
            onClick={() => setActiveMenu(null)}
          />
        </WindowContent>
      </NotepadWindow>
    </Draggable>
  );
} 