import { Box } from '@mui/material';

import { ChooseWebsite } from './ChooseParser';
import { ChooseKeyword } from './ChooseKeyword';
import { ChooseCity } from './ChooseCity';
import { StartParser } from './StartParser';
import { ParsingResults } from './ParsingResults';

const Parser = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <ChooseWebsite />
      <ChooseKeyword />
      <ChooseCity />
      <StartParser />
      <ParsingResults />
    </Box>
  );
};

export default Parser;
