import { useAtom } from 'jotai';
import { RTFDoc } from '../RTFStyles';
// import parse from 'html-react-parser';
import { docAtom } from '../../App';
import { useEffect } from 'react';

const HTMLParser = () => {
    const data = useAtom(docAtom)[0];

    useEffect(() => {
        const myDoc = document.getElementById("rtfDoc");
        myDoc.innerHTML = data.doc;
    }, [data]);

    console.count("Rendered HTML viewer");
    return (
        <RTFDoc className='min-w-[90vw] lg:min-w-[800px]' id='rtfDoc'>
            {/* {parse(data.doc)} */}
        </RTFDoc>
    );
};

export default HTMLParser;