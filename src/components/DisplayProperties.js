import React from 'react';
import styled from 'styled-components';
import { Window, WindowHeader, WindowContent, Button, Select } from 'react95';
import Draggable from 'react-draggable';
import { wallpapers } from '../assets/wallpapers';

const PreviewBox = styled.div`
  width: 200px;
  height: 150px;
  border: 2px inset white;
  margin: 10px 0;
  background-size: cover;
  background-position: center;
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

const StyledSelect = styled(Select)`
  width: 270px !important;
  margin-top: 4px !important;
  height: 21px !important;
`;

export function DisplayProperties({ onClose, currentWallpaper, onWallpaperChange }) {
  const [selected, setSelected] = React.useState('teal');

  console.log('Available wallpapers:', wallpapers); // Debug log

  const handleChange = (e) => {
    const newValue = e.target.value;
    console.log('Selected value:', newValue); // Debug log
    setSelected(newValue);
    
    if (wallpapers[newValue]) {
      const newWallpaper = wallpapers[newValue].color || wallpapers[newValue].url;
      console.log('Setting wallpaper to:', newWallpaper); // Debug log
      onWallpaperChange(newWallpaper);
    }
  };

  return (
    <Draggable handle=".window-header" bounds="parent">
      <Window style={{ width: 300, position: 'absolute', left: '20%', top: '20%' }}>
        <WindowHeader className="window-header" style={{ display: 'flex', alignItems: 'center' }}>
          Display Properties
          <CloseButton onClick={onClose}>
            <span>×</span>
          </CloseButton>
        </WindowHeader>
        <WindowContent>
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: 'block', marginBottom: '4px' }}>Wallpaper:</label>
            <select
              value={selected}
              onChange={handleChange}
              style={{
                width: '270px',
                height: '21px',
                marginTop: '4px'
              }}
            >
              {Object.keys(wallpapers).map((key) => (
                <option key={key} value={key}>
                  {wallpapers[key].name}
                </option>
              ))}
            </select>
          </div>
          
          <PreviewBox style={
            wallpapers[selected]?.color ? 
              { backgroundColor: wallpapers[selected].color } : 
              { backgroundImage: `url(${wallpapers[selected]?.url})` }
          } />
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 20 }}>
            <Button onClick={onClose} style={{ padding: '6px 20px' }}>
              Close
            </Button>
          </div>
        </WindowContent>
      </Window>
    </Draggable>
  );
}