import { bg } from "../Assets";

const BGPage = ({ children, image, center }) => {
    return (
        <main
            style={{ backgroundImage: image && `url(${bg})` }}
            className={`w-full min-h-[calc(100vh-60px)] 
                bg-cover bg-gradient-to-r from-teal-50 via-emerald-100 to-teal-100 
                ${center ? "flex flex-col items-center justify-center" : ""}`}
        >
            {children}
        </main>
    );
};

export default BGPage;
