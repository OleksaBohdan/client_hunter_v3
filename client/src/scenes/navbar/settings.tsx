import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLogout } from '../../state';
import { Box, Button, Dialog, DialogTitle, Divider } from '@mui/material';
import { User } from '../../types/User';

import { serverUrl } from '../../api/clientApi';

export interface SimpleDialogProps {
  open: boolean;
  onClose: () => void;
}

export function SettingsDialog(props: SimpleDialogProps) {
  const { onClose, open } = props;
  const user = useSelector((state: { user: User }) => state.user);
  const token = useSelector((state: any) => state.token);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const dispatch = useDispatch();

  const handleClose = () => {
    onClose();
    setTimeout(() => {
      setShowConfirmation(false);
    }, 300);
  };

  const handleDelete = async () => {
    setShowConfirmation(true);
  };

  const handleConfirmDelete = async () => {
    await deleteUser();
    setShowConfirmation(false);
  };

  const deleteUser = async () => {
    const deleteResponse = await fetch(`${serverUrl}/api/v1/user`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (deleteResponse.status) {
      dispatch(setLogout());
    }
  };

  return (
    <Dialog onClose={handleClose} open={open}>
      <DialogTitle sx={{ textAlign: 'center' }}>Settings</DialogTitle>
      <Divider />
      <Box
        sx={{
          minWidth: '200px',
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ p: 2 }}>{user.email}</Box>
        <Box>
          {!showConfirmation && (
            <Button variant="outlined" color="error" onClick={handleDelete}>
              Delete account
            </Button>
          )}
        </Box>
      </Box>
      {showConfirmation && (
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
          <Box>Are you sure you want to delete your account?</Box>
          <Box>All your data will be permanently deleted</Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Button sx={{ m: 1 }} variant="outlined" onClick={() => setShowConfirmation(false)}>
              Cancel
            </Button>
            <Button sx={{ m: 1 }} variant="outlined" color="error" onClick={handleConfirmDelete}>
              Delete
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}
