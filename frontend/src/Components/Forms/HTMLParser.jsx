import { useAtom } from 'jotai';
import { RTFDoc } from '../RTF';
import parse from 'html-react-parser';
import { docAtom } from '../../App';

const HTMLParser = () => {
    const data = useAtom(docAtom)[0];

    console.count("Rendered HTML viewer");
    return (
        <RTFDoc className='min-w-[90vw] lg:min-w-[800px] '>
            {parse(data.doc)}
        </RTFDoc>
    );
};

export default HTMLParser;