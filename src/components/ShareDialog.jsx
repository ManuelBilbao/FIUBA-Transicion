import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, Link, Button, DialogActions } from "@mui/material";
import FileCopyIcon from '@mui/icons-material/FileCopy';

const WEB_URL = process.env.REACT_APP_WEB_URL;

function ShareDialog({ open, onClose, codigo }) {
  const [copied, setCopied] = useState(false);
  const url = `${WEB_URL}?code=${codigo.toUpperCase()}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy text: ', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} sx={{ width: "auto" }}>
      <DialogTitle>Compartir</DialogTitle>
      <DialogContent sx={{ paddingY: 0 }}>
        <Link href={url}>{url}</Link>
      </DialogContent>
      <DialogActions sx={{ paddingX: "1.5em", paddingY: "1em" }}>
        <Button
          onClick={handleCopy}
          color={copied ? "success" : "primary"}
          variant="outlined"
          startIcon={<FileCopyIcon />}
          sx={{ cursor: copied ? "default" : "pointer" }}
        >
          {copied ? 'Copiado!' : 'Copiar'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ShareDialog;