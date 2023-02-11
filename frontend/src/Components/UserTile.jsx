import Icon from "./Icon";
import useAuthService from "../Services/AuthService";

export default function UserTile({ userdoc }) {
    // const route = useNavigate();
    const user = useAuthService(s => s.user);
    const isAuthorized = user?.superAdmin === true;

    const editData = (data) => {

    };

    const handleDelete = () => {

    };

    return (
        <div className="bg-white bg-opacity-40 text-gray-800 hover:bg-opacity-100 flex flex-col gap-2 overflow-hidden
             text-start relative p-4 font-medium min-w-[280px] max-w-[90vw] rounded-lg text-lg" key={userdoc?._id}>

            <b className="truncate"> {userdoc?.name}</b>
            <b className="truncate"> {userdoc?.email}</b>

            <p className="text-lg truncate"><b>{new Date(userdoc?.updatedAt).toLocaleDateString()}</b></p>

            <div className="absolute right-2 bottom-2 flex flex-row-reverse flex-wrap gap-2">
                {isAuthorized &&
                    <>
                        <Icon w={36} h={36} color="#006d5b" label="Edit Document" onClick={editData()}
                            icon="material-symbols:edit-document-rounded" />

                        <Icon w={36} h={36} color="#e40800" label="Delete Document" icon="mdi:file-document-delete"
                            onClick={handleDelete()}
                        />
                    </>
                }
            </div>
        </div>
    );
};