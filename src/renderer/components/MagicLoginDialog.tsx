import React from 'react';
import { Dialog, DialogTitle, DialogContent, Link, Stack, TextField, Button } from '@mui/material';
import { QRCode } from 'react-qrcode-logo';

type MagicLoginDialogProps = {
  magicToken: string | undefined;
  handleClose: () => void;
  handleSubmit: () => void;
};

const magicUrl = (token) => `http://localhost:4000/magic_log_in?t=${token}`;

// TODO: Make it so QR doesn't change on close
//   This happens because magicToken is state and gets set to undefined with close
const MagicLoginDialog = ({ magicToken, handleClose, handleSubmit }: MagicLoginDialogProps) => {

  return (
    <Dialog open={Boolean(magicToken)} onClose={handleClose}>
      <DialogTitle>Magic Login</DialogTitle>
      <DialogContent>
          <ol className='list-decimal'>
            <li>
              <div>Scan the QR code, or nagivate to <Link href={magicUrl(magicToken)} target="_blank" underline='hover'>this link</Link></div>
              <div className="flex justify-center">
                <QRCode value={magicUrl(magicToken)} />
              </div>
            </li>
            <li>
              <div>Enter the code found at the link.</div>
              <Stack spacing={2} direction='row'>
                <TextField variant='outlined' type='number' />
                <Button type='submit' variant='contained' onClick={handleSubmit}>Submit</Button>
              </Stack>
            </li>
          </ol>
      </DialogContent>
    </Dialog>
  );
};

export default MagicLoginDialog;
