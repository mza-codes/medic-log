import { Tooltip } from "@mantine/core";

const Icon = ({ icon, w, h, color, label, size, ...props }) => {
    return (
        <Tooltip
            label={label ?? ""}
            color={color ?? "#000"}
            withArrow
        >
            <div {...props} title={label} style={{ color }}
                className={`opacity-50 hover:opacity-100 cursor-pointer`}>
                <iconify-icon width={w ?? size ?? 24} height={h ?? size ?? 24} icon={icon} />
            </div>
        </Tooltip>
    );
};

export default Icon;