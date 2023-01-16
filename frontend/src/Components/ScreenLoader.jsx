import { Loader } from "@mantine/core";
import Backdrop from "@mui/material/Backdrop/Backdrop";
import { useEffect, useState } from "react";

const ScreenLoader = ({ close }) => {

    const [open, setOpen] = useState(true);

    useEffect(() => {
        const closer = setTimeout(() => {
            close && setOpen(false);
        }, close);

        return () => clearTimeout(closer);
    }, [close]);

    return (
        <Backdrop open={open} sx={{ zIndex: 1500 }}>
            <div className="flex flex-col gap-2">
                <Loader color={"#e1fff8"} variant="bars" size={100} />
            </div>
        </Backdrop>
    );
};

export default ScreenLoader;

