import useAuthService from "../Services/AuthService";

function CancelButton() {

    const cancelReq = useAuthService(state => state.cancelReq);
    const isLoading = useAuthService(state => state.isLoading);

    if (!isLoading) return null;
    return (
        <button type='button' onClick={cancelReq}
            className='fixed right-1 bottom-2 hover:bg-red-700 text-white rounded-sm p-1 bg-teal-700'>
            Cancel
        </button>
    );
};

export default CancelButton;