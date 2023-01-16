import useApiService from "../Services/APIService";
import useAuthService from "../Services/AuthService";

function LoadBar() {
    const loadingAuth = useAuthService(s => s.isLoading);
    const loadingAPI = useApiService(s => s.isLoading);

    if (loadingAPI || loadingAuth)
        return (
            <div className="horizontal-bar-wrap">
                <div className="bar1 bar"></div>
            </div>
        );
    else return null;
};

export default LoadBar;