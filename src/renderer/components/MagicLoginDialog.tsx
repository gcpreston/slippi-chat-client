import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, Link, Stack, TextField, Button } from '@mui/material';
import { QRCode } from 'react-qrcode-logo';

import { baseHTTP } from '../../utils';

type MagicLoginDialogProps = {
  open: boolean;
  magicToken: string | undefined;
  handleClose: () => void;
  handleSubmit: (verificationCode: string) => void;
};

const magicUrl = (token) => `${baseHTTP}/magic_log_in?t=${token}`;

const MagicLoginDialog = ({ open, magicToken, handleClose, handleSubmit }: MagicLoginDialogProps) => {
  const [code, setCode] = useState('');

  return (
    <Dialog open={open && Boolean(magicToken)} onClose={handleClose}>
      <DialogTitle>Magic Login</DialogTitle>
      <DialogContent>
          <ol className='list-decimal'>
            <li>
              <div>Scan the QR code, or nagivate to <Link href={magicUrl(magicToken)} target="_blank" underline='hover'>this link</Link></div>
              <div className="flex justify-center my-4">
                <QRCode value={magicUrl(magicToken)} />
              </div>
            </li>
            <li>
              <div className='mb-4'>Enter the code found at the link.</div>
              <form onSubmit={(event) => {
                event.preventDefault();
                handleSubmit(code)
              }}>
                <Stack spacing={2} direction='row'>
                    <TextField variant='outlined' type='number' value={code} onChange={(event) => setCode(event.target.value)} />
                    <Button type='submit' variant='contained'>Submit</Button>
                </Stack>
              </form>
            </li>
          </ol>
      </DialogContent>
    </Dialog>
  );
};

export default MagicLoginDialog;
