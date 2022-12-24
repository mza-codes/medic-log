import { useRef } from 'react';
import styled from 'styled-components';
import Icon from './Icon';

const SearchBox = styled.input`
    padding: 10px 1rem;
    outline: none;
    border: 1px solid #999;
    border-radius: 6px;
`;

const TopBar = () => {
    const searchRef = useRef();

    const handleChange = () => {
        let query = searchRef?.current?.value;
        console.warn("Searching For", query);
    };

    console.count("Rendered TopBar.jsx");
    return (
        <div className="controls flex flex-wrap gap-2 justify-between items-center w-[90%] ">
            <div className="searchBox relative">
                <SearchBox ref={searchRef} placeholder="Search.." onChange={handleChange} />
                <div className="absolute right-1 top-2">
                    <Icon icon="material-symbols:manage-search-rounded" w={29} h={29} label="Search" color="#003a35" />
                </div>
            </div>
            <button title='Under Progress'
                className='p-2 font-semibold rounded-lg bg-teal-800 hover:bg-teal-700 text-gray-100'>
                Filter
            </button>
        </div>
    );
};

export default TopBar;