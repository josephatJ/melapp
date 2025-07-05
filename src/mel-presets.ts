import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const MELPreset = definePreset(Aura, {
  //Your customizations, see the following sections for examples
  semantic: {
    primary: {
      50: '#306526',
      100: '#306526',
      200: '#306526',
      300: '#306526',
      400: '#306526',
      500: '#306526',
      600: '#306526',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
    secondary: {
      50: '#306526',
      100: '#306526',
      200: '#306526',
      300: '#306526',
      400: '#306526',
      500: '#306526',
      600: '#306526',
      700: '{indigo.700}',
      800: '{indigo.800}',
      900: '{indigo.900}',
      950: '{indigo.950}',
    },
    focusRing: {
      width: '2px',
      style: 'dashed',
      color: '{primary.color}',
      offset: '1px',
    },
  },
});

export default MELPreset;
