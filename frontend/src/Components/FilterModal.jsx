import { Backdrop } from '@mui/material';
import { atom, useAtom } from 'jotai';
import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import useApiService from '../Services/APIService';
import SortBy from './Filters/SortBy';
import Icon from './Icon';
import { SearchBox } from './TopBar';

export const filterAtom = atom(false);
const sortValues = ["age", "name", "city", "document", "lastCheckup"];

const StyledSelect = styled.select`
    outline: none;
    border: none;
    appearance: none;
    text-transform: capitalize;
    background: linear-gradient(to right, #a9ffff,#8bf0d2);
    cursor: pointer;
    font-weight: 400;
    
    option{
        text-align: left;
    }
`;

const FilterModal = () => {
    const [openFilter, setOpenFilter] = useAtom(filterAtom);
    const formRef = useRef();
    const searchV2 = useApiService(s => s.searchRecordsV2);
    const isLoading = useApiService(s => s.isLoading);
    const bgRef = useRef();

    function closeSideBar() {
        setOpenFilter(false);
        return;
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (isLoading) return false;
        const formData = new FormData(e.target);
        let data = {};
        for (const [key, value] of formData) {
            data[key ?? 0] = value;
        };
        const res = await searchV2(data, e.target);
        console.log("outcome", res);
        if (res === true) closeSideBar();
        return;
    };

    useEffect(() => {
        const bg = bgRef?.current;
        bg?.addEventListener('click', (event) => {
            const self = event.target.closest('.filtersec');
            if (!self) closeSideBar();
            else return;
        });
        return () => bg?.removeEventListener("click", closeSideBar);
    }, []);

    console.count("Rendered FilterModal.jsx");

    return (
        <Backdrop open={openFilter} sx={{ zIndex: 1500 }} ref={bgRef} >
            <div className="rounded-l-lgx mt-2x bg-gradient-to-br from-teal-200 to-teal-600 filtersec
                min-h-screen top-0 w-60 min-[350px]:w-80 absolute right-0">
                <div className="relative p-1 flex items-center justify-center">
                    <Icon icon={"mingcute:close-circle-fill"} size="36" onClick={closeSideBar} label={"Close Sidebar"} />
                    <h5 className="block text-center w-full uppercase nderline font-bold text-xl">Filters</h5>
                </div>
                <hr className="my-1 h-px opacity-60 bg-gray-600 border-0 " />
                <form onSubmit={handleSearch} className="actions min-[350px]:ml-4 ml-2 flex flex-col p-2 items-start gap-3 font-semibold"
                    ref={formRef}>
                    <SearchBox className="w-[98%] font-normal"
                        name="query"
                        placeholder="Search For.."
                        required
                        minLength={2}
                        maxLength={200}
                    />

                    <div className="flex items-center gap-1">
                        <span className={`text-black rounded-md min-[350px]:p-2 p-1 uppercase min-[350px]:text-sm text-xs`}>
                            Search In:
                        </span>
                        <StyledSelect name="sortfield" id="sortField" className="px-3 py-1 rounded-md">
                            {sortValues.map((value) => (
                                <option key={value} value={value}>{value}</option>
                            ))}
                        </StyledSelect>
                    </div>
                    <div className="flex items-center gap-1">
                        <span className={`text-black rounded-md p-2 uppercase text-sm`}>
                            Sort By:
                        </span>
                        <SortBy />
                    </div>

                    <div className="searchBtn flex flex-col justify-center items-center w-full mt-4">
                        <button className="bg-teal-500 hover:bg-emerald-500 rounded-md p-2 text-sm disabled:bg-gray-400"
                            type="submit" disabled={isLoading}>
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </Backdrop>
    );
};

export default FilterModal;