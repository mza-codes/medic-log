import { useField } from 'formik';
import { useState } from 'react';
import './CustomField.scss';

export default function CustomField({ label, type, ...props }) {

    const [showPassword, setShowPassword] = useState(false);
    const [field, meta] = useField(props);

    return (
        <div className='customField'>
            <span htmlFor={props.label} className='label'>{label}</span>
            <div className="relative">
                <input
                    className={`sm:w-[320px] ${meta.error && meta.touched ? 'error'
                        : !meta.error && meta.touched ? 'success'
                            : 'normal'}`}
                    {...field} {...props}
                    type={showPassword ? "text" : type} />

                {(label?.toLowerCase() === "password" || label?.toLowerCase() === "confirm password") &&
                    <span onClick={e => setShowPassword(prev => !prev)}
                        className="text-teal-800 absolute right-2 bottom-2.5 cursor-pointer hover:text-opacity-100 text-opacity-50">
                        {/* <iconify-icon icon="bxs:show" width={33} height={33} /> */}
                        {!showPassword ? showPwd : hidePwd}
                    </span>
                }
            </div>
            <p className="errMsg">{meta.error && meta.touched ? meta.error : ''}</p>
        </div>
    );
};

var hidePwd = <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M8.073 12.194L4.212 8.333c-1.52 1.657-2.096 3.317-2.106 3.351L2 12l.105.316C2.127 12.383 4.421 19 12.054 19c.929 0 1.775-.102 2.552-.273l-2.746-2.746a3.987 3.987 0 0 1-3.787-3.787zM12.054 5c-1.855 0-3.375.404-4.642.998L3.707 2.293L2.293 3.707l18 18l1.414-1.414l-3.298-3.298c2.638-1.953 3.579-4.637 3.593-4.679l.105-.316l-.105-.316C21.98 11.617 19.687 5 12.054 5zm1.906 7.546c.187-.677.028-1.439-.492-1.96s-1.283-.679-1.96-.492L10 8.586A3.955 3.955 0 0 1 12.054 8c2.206 0 4 1.794 4 4a3.94 3.94 0 0 1-.587 2.053l-1.507-1.507z" /></svg>
var showPwd = <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24"><path fill="currentColor" d="M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316l-.105-.316C21.927 11.617 19.633 5 12 5zm0 11c-2.206 0-4-1.794-4-4s1.794-4 4-4s4 1.794 4 4s-1.794 4-4 4z" /><path fill="currentColor" d="M12 10c-1.084 0-2 .916-2 2s.916 2 2 2s2-.916 2-2s-.916-2-2-2z" /></svg>