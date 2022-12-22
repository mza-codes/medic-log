
const Icon = ({ icon, w, h, color, label, ...props }) => {
    return (
        <div {...props} title={label} style={{color}}
            className={`opacity-50 hover:opacity-100 cursor-pointer`}>
            <iconify-icon width={w ?? 24} height={h ?? 24} icon={icon} />
        </div>
    );
};

export default Icon;