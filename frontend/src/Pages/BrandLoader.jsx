import { Loader } from "@mantine/core";
import { Backdrop } from "@mui/material";
import Logo from "../Components/Logo";

const BrandLoader = () => (
    <Backdrop open={true} sx={{ zIndex: 1500 }}>
        <div className="flex flex-col gap-2 items-center justify-center text-center">
            <Logo style={{ color: "#fff", border: "none" }} />
            <Loader color={"#fff"} variant="bars" size={100} />
            <span className="text-3xl py-2 font-normal font-abel text-white">Loading</span>
        </div>
    </Backdrop>
);

export default BrandLoader;