import { Loader } from "@mantine/core";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { bg } from "../Assets";
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

let contactMsg = `Uh'uh, Looks like the site is down! We Recommend you to contact Vendor, or check back later!`;
const msgClasses = `capitalize text-gray-800 font-semibold max-w-[500px] lg:max-w-[80vw] px-2`;

const LandingPage = () => {
    const route = useNavigate();
    const userActive = useAuthService(state => state.active);
    const isLoading = useAuthService(state => state.isLoading);
    const serverConnected = useAuthService(state => state.serverConnected);
    const logoIcon = document.querySelector("#_logo");

    useEffect(() => {
        if (!serverConnected && !isLoading) {
            logoIcon.style.color = "red";
        };
        if (!userActive && !isLoading && serverConnected) route("/login");
        if (userActive && !isLoading && serverConnected) route(`${window.location.pathname}`);
    }, [userActive, isLoading, serverConnected, route]);

    return (
        <Page className="min-h-[94vh]">
            <section className="wrapper flex flex-col items-center justify-center text-center p-2 pb-[20vh]">
                <Logo id="_logo" />

                {isLoading && <div className="py-8">
                    <Loader color={"#006446"} variant="bars" size={100} />
                </div>}

                {(!serverConnected && !isLoading) && <div className="text-[#ff3d3d]">
                    <iconify-icon icon="iconoir:voice-error" width={150} height={150} />
                </div>}

                {(!serverConnected && !isLoading) && <div className="text-[#ff3d3d]">
                    <h2 className="text-4xl font-semibold my-4">Server Error</h2>
                </div>}

                <h1 className={msgClasses}>{isLoading && "Testing Server Connection, Please Wait.."}</h1>
                {(!serverConnected && !isLoading) && <p id="errRef"
                    className="text-[#ff4242] font-medium capitalize max-w-[480px] px-3">{contactMsg}</p>}

            </section>
        </Page>
    );
};

export default LandingPage;