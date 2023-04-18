import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, Box, Divider } from '@mui/material';
import { User } from '../../types/User';
import { useDispatch, useSelector } from 'react-redux';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SimpleDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;
  const user = useSelector((state: { user: User }) => state.user);

  const handleClose = () => {
    onClose();
  };

  const deleteUser = async (onSubmitProps: any) => {
    const deleteResponse = await fetch(`http://localhost:3001/api/v1/user${user.email}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
  };

  const handleDelete = () => {
    console.log('deleting...');
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ textAlign: 'center' }}>Settings</DialogTitle>
      <Divider />
      <Box
        sx={{
          minWidth: '200px',
          p: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ p: 1 }}>{user.email}</Box>
        <Box>
          <Button variant="outlined" color="error" onClick={handleDelete}>
            Delete account
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
