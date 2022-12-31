import { useRef } from "react";

const dropdownItem = `dropdown-item max-w-[240px] overflow-hidden capitalize
text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100 cursor-pointer`;

// const dummyData = ["Action", "Another Action", "Main Action", "Usable Action", "fhdshfjfdsgfdhh"];

const Dropdown = ({ options, selection }) => {

    const dropDownRef = useRef();
    const selected = useRef();

    const open = () => dropDownRef.current.classList?.toggle('hidden');
    const handleSelect = (e) => {
        selected.current.innerText = e.target.innerText;
        selection.sortValue = e.target.innerText;
        open();
        return;
    };

    console.log("Rendered popover");
    return (
        <div className="dropdown relative">
            <button onClick={open} ref={selected}
                className=" max-w-[200px] overflow-hidden overflow-ellipsis 
                   dropdown-toggle
                   px-6
                   py-2.5
                   bg-teal-700
                   text-white
                   font-medium
                   text-xs
                   leading-tight
                   uppercase
                   rounded
                   shadow-md
                   hover:bg-amber-700 hover:shadow-lg
                   focus:bg-amber-700 focus:shadow-lg focus:outline-none focus:ring-0
                   active:bg-amber-800 active:shadow-lg active:text-white
                   whitespace-nowrap"
                type="button"
            >
                Select
            </button>
            <ul ref={dropDownRef}
                className="
                        dropdown-menu
                        min-w-max
                        absolute
                        bg-white
                        text-base
                        z-50
                        float-left
                        py-2
                        list-none
                        text-left
                        rounded-lg
                        shadow-lg
                        mt-1
                        hidden
                        m-0
                        bg-clip-padding
                        border-none" >
                {options.map((item, i) => (
                    <li key={i}>
                        <span className={`${dropdownItem} overflow-ellipsis`} onClick={handleSelect}>
                            {item}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;