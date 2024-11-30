import clouds from './clouds.jpg';
import bsod from './bsod.jpg';

export const wallpapers = {
  teal: {
    name: 'Teal',
    url: 'teal', // We'll handle this specially
    color: '#008080' // The default teal color
  },
  clouds: {
    name: 'Clouds',
    url: clouds,
    color: null
  },
  bsod: {
    name: 'Blue Screen',
    url: bsod,
    color: null
  }
};

export default wallpapers; 