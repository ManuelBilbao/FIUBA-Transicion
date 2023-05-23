import { Dialog, DialogContent, DialogTitle, Link, TextField } from "@mui/material";

function ShareDialog(props) {
  const { codigo, open, onClose } = props;
  const WEB_URL = process.env.REACT_APP_WEB_URL;
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Compartir</DialogTitle>
      <DialogContent>
        <TextField fullWidth variant="outlined" label="Código" value={codigo.toUpperCase()} sx={{ marginY: "1em" }} />
        <Link href={`${WEB_URL}?code=${codigo.toUpperCase()}`} target="_blank">{`${WEB_URL}?code=${codigo.toUpperCase()}`}</Link>
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;