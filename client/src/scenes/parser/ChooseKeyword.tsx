import { Box, Typography, TextField, Button, Alert, CircularProgress, useTheme, ButtonGroup } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

export const ChooseKeyword = () => {
  const { palette } = useTheme();

  return (
    <Box sx={{ backgroundColor: 'white', borderRadius: 2, p: 2, mt: 2 }}>
      <Typography variant="h5">Choose Keyword to parse</Typography>
      <Box
        component="form"
        sx={{
          '& > :not(style)': { m: 1, width: '100$' },
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
        noValidate
        autoComplete="off"
      >
        <TextField id="standard-basic" label="Example: mechanic" variant="standard" sx={{ width: '85%' }} />
        <Button
          type="submit"
          sx={{
            width: '15%',
            ml: 1,
            p: 1,
            backgroundColor: palette.primary.main,
            color: palette.background.paper,
            '&:hover': { backgroundColor: palette.primary.main },
            fontWeight: '900',
          }}
        >
          Add
        </Button>
      </Box>
      <Box>
        <ButtonGroup variant="contained" aria-label="split button" sx={{ marginRight: 2, marginTop: 2 }}>
          <Button>{'Keyword'}</Button>
          <Button
            aria-label="delete"
            // onClick={onDelete}
            sx={{
              backgroundColor: palette.primary.main,
              '&:hover': { backgroundColor: '#d32f2f' },
            }}
          >
            <DeleteIcon />
          </Button>
        </ButtonGroup>

        <ButtonGroup variant="outlined" aria-label="split button" sx={{ marginRight: 2, marginTop: 2 }}>
          <Button>{'Keyword'}</Button>
          <Button
            aria-label="delete"
            // onClick={onDelete}
            sx={{
              backgroundColor: 'white',
              '&:hover': { backgroundColor: '#d32f2f' },
            }}
          >
            <DeleteIcon />
          </Button>
        </ButtonGroup>
      </Box>
    </Box>
  );
};
