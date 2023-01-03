const SVG = ({ icon, w, h, color, label, ...props }) => {
    return (
        <div {...props} title={label} style={{ color: color }}>
            <iconify-icon className="bg-red-400" width={w ?? 124} height={h ?? 124} icon={icon} />
        </div>
    );
};

export default SVG;