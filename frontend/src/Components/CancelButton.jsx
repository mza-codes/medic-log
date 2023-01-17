import useAuthService from "../Services/AuthService";

function CancelButton() {

    const cancelReq = useAuthService(state => state.cancelReq);
    const isLoading = useAuthService(state => state.isLoading);

    if (!isLoading) return null;
    return (
        <button type='button' onClick={cancelReq} style={{ zIndex: 1501 }}
            className='fixed right-1 bottom-2 text-sm hover:bg-red-700 text-white rounded-sm py-1 px-3 bg-teal-700'>
            Cancel
        </button>
    );
};

export default CancelButton;