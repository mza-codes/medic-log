import { useState } from "react";
import Icon from "../Icon";

const SortBy = () => {

    const [asc,setAsc] = useState(false);
    console.count("Rendered SortBy.jsx");
    return (
        <>
            <input type="checkbox" id="filter" name="sortBy" hidden onChange={e => setAsc(e.target?.checked)} />
            <label htmlFor="filter">
                <Icon icon={asc ? `ph:sort-ascending-bold` : `ph:sort-descending-bold`} w={33} h={33} />
            </label>
        </>
    );
};

export default SortBy;