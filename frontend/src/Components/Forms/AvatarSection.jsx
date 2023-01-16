import { useRef } from "react";
import { defaultAvatar } from "../../Assets";

const SUPPORTED_FORMATS = [
    "image/jpg",
    "image/jpeg",
    "image/bmp",
    "image/png",
    "image/webp",
    "image/svg",
];
const MAX_FILE_SIZE = 3001200; // approximately 3mb

const AvatarSection = () => {

    const imgRef = useRef();
    const errRef = useRef();

    const handleChange = (e) => {
        const image = e?.target?.files[0];
        if (!image) return errRef.current.innerText = "Invalid Image!";

        const status = SUPPORTED_FORMATS.includes(image?.type);
        const tooBig = image.size <= MAX_FILE_SIZE;
        if (!status) return errRef.current.innerText = "Unsupported Type!";
        if (!tooBig) return errRef.current.innerText = "Image Too Big!";

        imgRef.current.src = URL.createObjectURL(image);
        // setData(image); // image is a blob
        return errRef.current.innerText = "";
    };

    console.count("Rendered AvatarSec");
    return (
        <div className='absolute top-2 right-2'>
            <div className="relative border-gray-900 border-2">
                <img ref={imgRef} src={defaultAvatar} alt="_person_photo" className='max-w-[100px] max-h-[140px] 
                    md:max-w-[140px] md:max-h-[200px] aspect-square object-cover' />
                <input type="file" accept='image/*' hidden id='avatar' onChange={handleChange} />
                <label htmlFor="avatar" className='absolute right-1 top-1 text-green-900 hover:text-green-800 cursor-pointer
                    bg-teal-50 '>
                    <iconify-icon icon="material-symbols:add-photo-alternate-outline-rounded" width={34} height={34} />
                </label>
            </div>
            <center ref={errRef} className="text-red-500 font-semibold"></center>
        </div>
    );
};

export default AvatarSection;

export const AvatarView = ({url}) => (
    <div className='absolute top-2 right-2'>
        <div className="relative border-gray-900 border-2">
            <img src={url ?? defaultAvatar} alt="_person_photo" className='max-w-[100px] max-h-[140px] 
                    md:max-w-[140px] md:max-h-[200px] aspect-square object-cover' />
        </div>
    </div>
);
