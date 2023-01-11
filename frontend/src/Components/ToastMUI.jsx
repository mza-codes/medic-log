import Snackbar from '@mui/material/Snackbar';

function ToastMUI() {

    return (
        <Snackbar
            anchorOrigin={{ vertical, horizontal }}
            open={open}
            onClose={handleClose}
            message="I love snacks"
            key={vertical + horizontal}
        />
    );
};

export default ToastMUI;