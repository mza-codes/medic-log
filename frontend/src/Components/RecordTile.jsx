import { useNavigate } from "react-router-dom";
import useLocalState from "../Services/LocalState";
import Icon from "./Icon";
import parse from "html-react-parser";
import useAuthService from "../Services/AuthService";


function RecordTile({ record }) {
    const route = useNavigate();
    const setEditData = useLocalState(s => s.setEditData);
    const user = useAuthService(s => s.user);

    const editData = (data) => {
        setEditData(data);
        route('/edit-record');
        return;
    };

    const handleDelete = ({ _id }) => {
        route(`/delete-record/${_id}`);
        return;
    };

    return (
        <div className="bg-white bg-opacity-40 text-gray-800 hover:bg-opacity-100 flex flex-col gap-2 min-h-[250px]
                            sm:min-h-[200px] relative p-4 font-medium min-w-[90vw] rounded-lg" key={record._id}>
            <p className="text-3xl capitalize font-semibold">{record?.name}</p>
            {record?.age && <p className="text-xl">Age: {record?.age}</p>}
            <p className="text-xl capitalize">{record?.city}</p>
            <p className="text-lg">{new Date(record?.lastCheckup?.[0]).toLocaleDateString()}</p>
            <div className="absolute left-1/3 top-3 overflow-hidden max-h-[180px] hidden md:block">
                {parse(record?.document)}
            </div>
            {/* AvatarSection */}
            <div className="absolute right-2 bottom-2 flex flex-row-reverse flex-wrap gap-2">
                {record?.owner === user?._id &&
                    <Icon w={36} h={36} color="#006d5b" label="Edit Record" onClick={() => editData(record)}
                        icon="material-symbols:edit-document-rounded" />}
                <Icon w={36} h={36} color="#008080" onClick={() => route(`/view-record/${record._id}`)}
                    label="Expand View" icon="mdi:arrow-expand-all" />
                {record?.owner === user?._id &&
                    <Icon w={36} h={36} color="#e40800" label="Delete Document" icon="mdi:file-document-delete"
                        onClick={() => { handleDelete(record); }}
                    />}
            </div>
        </div>
    );
};

export default RecordTile;