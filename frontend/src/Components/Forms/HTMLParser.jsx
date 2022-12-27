import { RTFDoc } from '../RTFStyles';
import parse from 'html-react-parser';
import { useEffect } from 'react';
import useApiService from '../../Services/APIService';

const HTMLParser = ({ record }) => {
    const setData = useApiService(s => s.setDocument);
    const data = useApiService(s => s.data.document);

    useEffect(() => {
        if (record) setData(record);
    }, []);

    console.count("Rendered HTML viewer");
    return (
        <RTFDoc className='min-w-[90vw] lg:min-w-[800px]'>
            {parse(data)}
        </RTFDoc>
    );
};

export default HTMLParser;