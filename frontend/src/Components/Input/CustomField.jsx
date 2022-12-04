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
                <input className={`sm:w-[320px] ${meta.error && meta.touched ?
                    'error' : !meta.error && meta.touched ? 'success' : 'normal'}`}
                    {...field} {...props} type={showPassword ? "text" : type} />
                {label?.toLowerCase() === "password" &&
                    <span onClick={e => setShowPassword(prev => !prev)}
                        className="text-teal-800 absolute right-2 bottom-1 cursor-pointer hover:text-opacity-100 text-opacity-50">
                        <iconify-icon icon="bxs:show" width={33} height={33} />
                    </span>
                }
            </div>
            <p className="errMsg">{meta.error && meta.touched ? '*' + meta.error : ''}</p>
        </div>
    )
};