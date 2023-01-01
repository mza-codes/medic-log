
const Loader = ({ inline, color, tailwindBg }) => (
    <main className={`flex flex-col items-center justify-center text-center ${inline ? 'loaderSm' : 'loaderLg'}`}>
        <div className="lds-ellipsis">
            <div style={{ background: color }} className={tailwindBg ?? "bg-teal-800"} />
            <div style={{ background: color }} className={tailwindBg ?? "bg-teal-800"} />
            <div style={{ background: color }} className={tailwindBg ?? "bg-teal-800"} />
            <div style={{ background: color }} className={tailwindBg ?? "bg-teal-800"} />
        </div>
    </main>
);

export default Loader;