import { forwardRef, useRef } from "react";
import styled from "styled-components";
import SortBy from "./Filters/SortBy";
import Icon from "./Icon";
import { SearchBox } from "./TopBar";

const sortValues = ["age", "name", "city", "checkup"];

const StyledSelect = styled.select`
    outline: none;
    border: none;
    appearance: none;
    text-transform: capitalize;
    background: linear-gradient(to right, #a9ffff,#f7b4bf);
    cursor: pointer;
    font-weight: 400;
    
    option{
        text-align: left;
    }
`;

const Sidebar = forwardRef((props, ref) => {

    const formRef = useRef();
    const closeSideBar = () => {
        ref.current.style.visibility = "hidden";
        return;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        let data = {};
        for (const [key, value] of formData) {
            data[key ?? 0] = value;
        };
        console.log("Final", data);
        // actual query to api
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
                <form onSubmit={handleSearch} className="actions ml-4 flex flex-col p-2 items-start gap-3 font-semibold" ref={formRef}>
                    <SearchBox className="w-[98%] font-normal"
                        name="query"
                        placeholder="Search For.."
                        required
                        minLength={2}
                        maxLength={200}
                    />

                    <div className="flex items-center gap-1">
                        <span className={`text-black rounded-md p-2 uppercase text-sm`}>
                            Sort By:
                        </span>
                        <StyledSelect name="sortfield" id="sortField" className="px-3 py-1 rounded-md">
                            {sortValues.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </StyledSelect>
                        &nbsp;
                        <SortBy />
                    </div>

                    <div className="searchBtn flex flex-col justify-center items-center w-full mt-4">
                        <button className="bg-teal-500 hover:bg-emerald-500 rounded-md p-2 text-sm" type="submit">
                            Search
                        </button>
                    </div>
                </form>
            </div>

        </main>
    );
});

export default Sidebar;