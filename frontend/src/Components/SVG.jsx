
const SVG = ({ icon, w, h, size, color, label, ...props }) => (
    <div {...props} title={label} style={{ color: color }}>
        <iconify-icon className="bg-red-400" width={w ?? size ?? 124} height={h ?? size ?? 124} icon={icon} />
    </div>
);


export default SVG;