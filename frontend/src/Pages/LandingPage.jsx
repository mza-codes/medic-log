import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { bg } from "../Assets";
import Loader from "../Components/Loader/Loader";
import Logo from "../Components/Logo";
import useAuthService from "../Services/AuthService";

const Page = styled.main`
    background-color: #d1fff7e1;
    background-image: url(${bg});
    background-size: cover;
    background-repeat: no-repeat;
    section {
        width: inherit;
        min-height: inherit;
    }
`;

let contactMsg = `If You can see a message saying unable to establish connection with server,
    the site will be probably down! \n We Recommend you to contact Vendor, or check back later!`;
const msgClasses = `capitalize text-gray-800 font-semibold max-w-[500px] lg:max-w-[80vw] px-2`;

const LandingPage = () => {
    const route = useNavigate();
    const userActive = useAuthService(state => state.active);
    const isLoading = useAuthService(state => state.isLoading);
    const serverConnected = useAuthService(state => state.serverConnected);
    const errRef = document.querySelector("#errRef");
    const logoIcon = document.querySelector("#_logo");

    useEffect(() => {
        console.log("Router.js >", userActive, isLoading);

        if (!serverConnected && !isLoading) {
            errRef.innerText = contactMsg;
            logoIcon.style.color = "red";
        };
        if (userActive && !isLoading && serverConnected) route('/dashboard');
        if (!userActive && !isLoading && serverConnected) route("/login");
    }, [userActive, isLoading, serverConnected]);

    return (
        <Page className="min-h-[94vh]">
            <section className="wrapper flex flex-col items-center justify-center text-center p-2 pb-[20vh]">
                <Logo id="_logo" />

                {isLoading && <Loader inline={1} />}

                {(!serverConnected && !isLoading) && <div className="text-[#ff3d3d]">
                    <iconify-icon icon="iconoir:voice-error" width={150} height={150} />
                </div>}

                <h1 className={msgClasses}>{isLoading && "Testing Server Connection, Please Wait.."}</h1>
                <p id="errRef" className="text-[#ff4242] font-medium capitalize"></p>

            </section>
        </Page>
    );
};

export default LandingPage;