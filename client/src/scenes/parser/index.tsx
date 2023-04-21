import { Box } from '@mui/material';

import { ChooseWebsite } from './ChooseParser';
import { ChooseKeyword } from './ChooseKeyword';
import { ChooseCity } from './ChooseCity';
import { StartParser } from './StartParser';

const Parser = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <ChooseWebsite />
      <ChooseKeyword />
      <ChooseCity />
      <StartParser />
    </Box>
  );
};

export default Parser;

// Choose parser website +

// Choose keywords +

// Choose city

// Run parser + parsing status

// Download results + marketing flow
