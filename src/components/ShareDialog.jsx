import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogTitle, Link, Button, DialogActions } from "@mui/material";
import FileCopyIcon from '@mui/icons-material/FileCopy';

const WEB_URL = process.env.REACT_APP_WEB_URL;

function ShareDialog({ open, onClose, codigo }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${WEB_URL}?code=${codigo.toUpperCase()}`);
      setCopied(true);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  useEffect(() => {
    setCopied(false);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Compartir</DialogTitle>
      <DialogContent>
        <Link href={`${WEB_URL}?code=${codigo.toUpperCase()}`} target="_blank">{`${WEB_URL}?code=${codigo.toUpperCase()}`}</Link>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCopy} color="primary" startIcon={<FileCopyIcon />}>
          {copied ? 'Copiado!' : ''}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShareDialog;