import React, { useState } from 'react';
import { Button, Dialog, DialogTitle, DialogContent } from '@mui/material';
// import SampleApplication from './Singpass'; // Import the SampleApplication component

function App() {
    const [open, setOpen] = useState(false); // State to manage dialog visibility

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="outlined" onClick={handleOpen}>
                Open Sample Application
            </Button>
            <Dialog open={open} onClose={handleClose} aria-labelledby="sample-application-dialog-title">
                <DialogTitle id="sample-application-dialog-title">Sample Application</DialogTitle>
                <DialogContent>
                    <SampleApplication />
                </DialogContent>
            </Dialog>
        </div>
    );
}

export default App;