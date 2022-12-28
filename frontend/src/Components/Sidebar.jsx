import { forwardRef } from "react";
import Icon from "./Icon";

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
                    <h5 className="block text-center w-full underline font-bold text-xl">Filters</h5>
                </div>
                <section className="actions ml-4 flex flex-col p-2 items-start font-semibold">
                    <div>
                        <input type="checkbox" />
                        &nbsp;
                        <span >Sort By</span>
                    </div>
                </section>
            </div>

        </main>
    );
});

export default Sidebar;