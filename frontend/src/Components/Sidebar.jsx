import { forwardRef } from "react";
import Dropdown from "./Dropdown";
import Icon from "./Icon";

const sortBy = ["age", "title", "place", "checkup"];

const Sidebar = forwardRef((props, ref) => {

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
                <section className="actions ml-4 flex flex-col p-2 items-start gap-2 font-semibold">
                    <div className="flex items-center gap-1">
                        <span className={`bg-blak bg-opacity-60 hover:bg-opacity-80 text-black rounded-md p-2 uppercase text-sm`}>
                            Sort By:
                        </span>
                        <Dropdown options={sortBy} selection={ref} />
                    </div>
                </section>
            </div>

        </main>
    );
});

export default Sidebar;