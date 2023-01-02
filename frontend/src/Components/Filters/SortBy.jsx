import { useState } from "react";
import Icon from "../Icon";

const SortBy = () => {
    const [asc, setAsc] = useState(false);

    return (
        <>
            <input type="checkbox" id="filter" name="sortBy" hidden onChange={e => setAsc(e.target?.checked)} />
            <label htmlFor="filter">
                <Icon icon={!asc ? `ph:sort-descending-bold` : `ph:sort-ascending-bold`} w={33} h={33}
                    label={!asc ? `Descending` : `Ascending`} />
            </label>
            <span className="uppercase font-semibold">{asc ? "Asc" : "Desc"}</span>
        </>
    );
};

export default SortBy;