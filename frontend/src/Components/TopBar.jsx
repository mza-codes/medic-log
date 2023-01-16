import { Tooltip } from '@mantine/core';
import { useAtom } from 'jotai';
import { useRef } from 'react';
import styled from 'styled-components';
import { sortAtom } from '../Atoms';
import useApiService from '../Services/APIService';
import { hook } from '../Utils';
import { filterAtom } from './FilterModal';
import Icon from './Icon';

export const SearchBox = styled.input`
    padding: 10px 1rem;
    padding-right: 2.3rem;
    outline: none;
    border: 1px solid #999;
    border-radius: 6px;
    overflow: hidden;
    max-width: 380px;
`;

const IconButton = styled.button`
    :disabled {
        color: #727272;
    };

    color: #004b4b;
`;

const TopBar = () => {
    let controller;
    const setOpenFilter = useAtom(filterAtom)[1];
    const searchRef = useRef();
    const sortBy = useAtom(sortAtom)[0];
    const searchRecords = useApiService(s => s.searchRecords);
    const error = hook("error", useApiService);
    const getRecords = hook("getRecords", useApiService);
    const isLoading = hook("isLoading", useApiService);

    const fetchAllRecords = () => {
        controller = new AbortController();
        return getRecords(controller.signal);
    };

    function openFilter() {
        setOpenFilter(true);
    };

    const handleSearch = async () => {
        const query = searchRef?.current?.value;
        if (query.length <= 0) return;
        await searchRecords(query, sortBy);
        return controller?.abort();
    };

    console.count("Rendered Topbar.jsx");
    return (
        <>
            <div className="controls flex flex-wrap gap-2 justify-between items-center w-[90%] ">
                <section className='flex gap-2 items-center'>
                    <div className="searchBox relative flexx gap-2x">
                        <SearchBox ref={searchRef} placeholder="Search.."
                            onKeyPress={e => {
                                if (e.key === "Enter") return handleSearch();
                            }} />
                        <IconButton className="absolute right-1 top-2 cursor-pointer"
                            onClick={handleSearch}
                            disabled={isLoading}>
                            <Icon icon="material-symbols:manage-search-rounded" size={29} label="Search" color="rgb(17 94 89)" />
                        </IconButton>
                    </div>
                    <IconButton className=""
                        onClick={fetchAllRecords}
                        disabled={isLoading}>
                        <Icon icon="ic:sharp-cloud-sync" size={36} label="Synchronize" color="#005215" />
                    </IconButton>
                </section>
                <Tooltip
                    label={"Filter Search"}
                    color={"rgb(15 118 110)"}
                    withArrow
                >
                    <button title='Filter Search' type='button' onClick={openFilter}
                        className='p-2 font-semibold rounded-lg bg-teal-800 hover:bg-teal-700 text-gray-100'>
                        Filter
                    </button>
                </Tooltip>
            </div>

            <div className="err flex items-center justify-center p-2 text-center w-[90%]">
                {error?.active && <p className="text-red-500 text-center max-w-[600px]">{error?.message || error?.code}</p>}
            </div>
        </>
    );
};

export default TopBar;