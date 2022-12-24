import { useRef } from 'react';
import styled from 'styled-components';
import { hooker } from '../Assets';
import useApiService from '../Services/APIService';
import Icon from './Icon';

const SearchBox = styled.input`
    padding: 10px 1rem;
    outline: none;
    border: 1px solid #999;
    border-radius: 6px;
`;

const IconButton = styled.button`
    :disabled {
        color: #727272;
    };

    color: #004b4b;
`;

const TopBar = () => {
    let controller;
    const searchRef = useRef();
    const searchRecords = useApiService(s => s.searchRecords);
    const error = hooker("error", useApiService);
    const getRecords = hooker("getRecords", useApiService);
    const isLoading = hooker("isLoading", useApiService);

    const fetchAllRecords = () => {
        controller = new AbortController();
        return getRecords(controller.signal);
    };

    const handleSearch = async () => {
        const query = searchRef?.current?.value;
        if (query.length < 0) return fetchAllRecords();
        if (query.length < 2) return;

        await searchRecords(query);
        return controller?.abort();
    };

    console.count("Rendered TopBar.jsx");
    return (
        <>
            <div className="controls flex flex-wrap gap-2 justify-between items-center w-[90%] ">
                <div className="searchBox relative">
                    <SearchBox ref={searchRef} placeholder="Search.." />
                    <IconButton className="absolute right-1 top-2 cursor-pointer"
                        onClick={handleSearch}
                        disabled={isLoading}>
                        <Icon icon="material-symbols:manage-search-rounded" w={29} h={29} label="Search" color="inherit" />
                    </IconButton>
                </div>
                <button title='Under Progress' type='button'
                    className='p-2 font-semibold rounded-lg bg-teal-800 hover:bg-teal-700 text-gray-100'>
                    Filter
                </button>
            </div>

            <div className="err flex items-center justify-center p-2 text-center w-[90%]">
                {error?.active && <p className="text-red-500 text-center max-w-[600px]">{error?.message || error?.code}</p>}
            </div>
        </>
    );
};

export default TopBar;