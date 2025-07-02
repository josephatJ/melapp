

import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

const HRHPreset = definePreset(Aura, {
    //Your customizations, see the following sections for examples
    semantic: {
        primary: {
            50: '#3F51B5',
            100: '#3F51B5',
            200: '#3F51B5',
            300: '#3F51B5',
            400: '#3F51B5',
            500: '#3F51B5',
            600: '#3F51B5',
            700: '{indigo.700}',
            800: '{indigo.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        },
        secondary: {
            50: '#3F51B5',
            100: '#3F51B5',
            200: '#3F51B5',
            300: '#3F51B5',
            400: '#3F51B5',
            500: '#3F51B5',
            600: '#3F51B5',
            700: '{indigo.700}',
            800: '{indigo.800}',
            900: '{indigo.900}',
            950: '{indigo.950}'
        },
         focusRing: {
            width: '2px',
            style: 'dashed',
            color: '{primary.color}',
            offset: '1px'
        }
    }
});

export default HRHPreset;