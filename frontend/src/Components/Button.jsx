
const SubmitBtn = ({ label, ...props }) => {
    return (
        <button {...props}
            className="bg-teal-800 text-white p-2 hover:bg-teal-600 disabled:bg-slate-400 disabled:text-gray-50"
        >
            {label}
        </button>
    );
};

export default SubmitBtn;