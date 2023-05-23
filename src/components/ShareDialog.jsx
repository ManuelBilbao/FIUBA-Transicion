import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";

function ShareDialog(props) {
  const { codigo, open, onClose } = props;
  
  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Compartir</DialogTitle>
      <DialogContent>
        <TextField fullWidth variant="outlined" label="Código" value={codigo.toUpperCase()} sx={{ marginTop: "1em" }} />
      </DialogContent>
    </Dialog>
  );
}

export default ShareDialog;