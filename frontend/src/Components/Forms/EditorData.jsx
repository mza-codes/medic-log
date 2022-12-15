import { useAtom } from "jotai";
import { docAtom } from "../../App";


const EditorData = () => {
    const [data] = useAtom(docAtom);
    console.count(`"Rendered Editor Data": ${data}`);

    return (
        <div className="max-w-[100vw] p-2 flex flex-col items-center justify-center">
            <h1 className="text-4xl my-2 text-center">Patient Log</h1>
            <div className="bg-white bg-opacity-80 text-gray-800 p-2">
                {/* {data?.slice(0,data?.length)} */}
                <pre>
                    <code>{data}</code>
                </pre>
            </div>
        </div>
    );
};

export default EditorData;