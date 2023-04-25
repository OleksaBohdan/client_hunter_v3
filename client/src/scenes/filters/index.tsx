import { Box } from '@mui/material';
import { AddBlackIndustry } from './AddBlackIndustry';
import { ChangeStatusList } from './ChangeStatusList';
import { DeleteCompanies } from './DeleteCompanies';

const Filters = () => {
  return (
    <Box sx={{ width: '100%' }}>
      <AddBlackIndustry />
      <ChangeStatusList />
      <DeleteCompanies />
    </Box>
  );
};

export default Filters;
