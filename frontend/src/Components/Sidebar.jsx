import { forwardRef, useRef } from "react";
import styled from "styled-components";
import Dropdown from "./Dropdown";
import Icon from "./Icon";
import { SearchBox } from "./TopBar";

const sortBy = ["age", "name", "city", "checkup"];

const RadioButtons = styled.input`
    accent-color: red;
    width: 1rem;
    height: 1rem;
    font-size: 2rem;
    cursor: pointer;
`;

const Sidebar = forwardRef((props, ref) => {

    const sortByRef = useRef();
    const closeSideBar = () => {
        ref.current.style.visibility = "hidden";
        return;
    };

    console.count("Rendered Sidebar.jsx");
    return (
        <main ref={ref} {...props} className="w-full min-h-[100%] absolute right-0 bg-black bg-opacity-40 z-50 hidden sm:block invisible">
            <div className="rounded-l-lg mt-2 bg-gradient-to-br from-teal-200 to-teal-600 h-[98%] top-0 w-72 absolute right-0 ">
                <div className="relative p-1 flex items-center justify-center">
                    <Icon icon={"mingcute:close-circle-fill"} w="36" h="36" onClick={closeSideBar} label={"Close Sidebar"} />
                    <h5 className="block text-center w-full uppercase nderline font-bold text-xl">Filters</h5>
                </div>
                <hr className="my-1 h-px opacity-60 bg-gray-600 border-0 " />
                <section className="actions ml-4 flex flex-col p-2 items-start gap-3 font-semibold">
                    <SearchBox className="w-[98%] font-normal" name="query" placeholder="Search For.." />
                    <div className="flex items-center gap-1">
                        <span className={`text-black rounded-md p-2 uppercase text-sm`}>
                            Sort By:
                        </span>
                        <Dropdown options={sortBy} selection={ref} />
                        &nbsp;
                        <input ref={sortByRef} type="checkbox" id="filter" hidden onChange={e=>console.log(e.target.checked)} />
                        <label htmlFor="filter">
                            <Icon icon={sortByRef?.current?.checked ? `ph:sort-ascending-bold` : `ph:sort-descending-bold`} w={28} h={28} />
                        </label>
                    </div>
                    {/* <div className="selections flex gap-1 items-center">
                        <RadioButtons type="radio" name="filter" id="asc" value="asc" checked />
                        <label htmlFor="asc">Ascending</label>
                        &nbsp;
                        <RadioButtons type="radio" name="filter" id="desc" value="desc" />
                        <label htmlFor="desc">Descending</label>
                    </div> */}
                    <div className="searchBtn flex justify-center w-full mt-4">
                        <button className="bg-teal-500 hover:bg-emerald-500 rounded-md p-2 text-sm">
                            Search
                        </button>
                    </div>
                </section>
            </div>

        </main>
    );
});

export default Sidebar;