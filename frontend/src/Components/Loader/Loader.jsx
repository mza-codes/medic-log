import { Loader as MantineLoader } from "@mantine/core";

const Loader = ({ inline, color, tailwindBg, native }) => {

    if (!native) {
        return (
            <main className={`flex flex-col items-center justify-center text-center ${inline ? 'loaderSm' : 'loaderLg'}`}>
                <div className="lds-ellipsis">
                    <div style={{ background: color }} className={tailwindBg ?? "bg-teal-800"} />
                    <div style={{ background: color }} className={tailwindBg ?? "bg-teal-800"} />
                    <div style={{ background: color }} className={tailwindBg ?? "bg-teal-800"} />
                    <div style={{ background: color }} className={tailwindBg ?? "bg-teal-800"} />
                </div>
            </main>
        );
    } else {
        return (
            <main className={`flex flex-col items-center justify-center text-center w-auto h-auto ${inline ? 'py-1' : 'py-7'}`}>
                <MantineLoader color={color ?? "teal"} size={80} variant="dots" />
            </main>
        );
    };
};

export default Loader;