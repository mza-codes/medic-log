// import { useParams } from "react-router-dom";
import AddDataForm from "../Components/Forms/AddData";
import AvatarSection from "../Components/Forms/AvatarSection";
import HTMLParser from "../Components/Forms/HTMLParser";
import RTF from "../Components/Forms/RichTextEditor";
import useLocalState from "../Services/LocalState";
import BGPage from "./BGPage";

const EditRecord = () => {
    const editData = useLocalState(s => s.editData);

    console.count("Rendered EditRecord.jsx");
    return (
        <BGPage image={0}>
            <section className="w-full py-4 bg-black bg-opacity-5 min-h-[94vh]">
                <div className="max-w-[100vw] p-2 flex flex-col items-center justify-center">
                    <h1 className="text-4xl text-black text-center py-3">Edit Record</h1>

                    <AddDataForm data={editData} update={1} />
                    <RTF record={editData?.document} />

                    <h1 className="text-3xl my-4 text-center">View Patient Log</h1>
                    <section className="relative">
                        <HTMLParser record={editData?.document} />
                        <AvatarSection />
                    </section>

                </div>
            </section>
        </BGPage>
    );
};

export default EditRecord;