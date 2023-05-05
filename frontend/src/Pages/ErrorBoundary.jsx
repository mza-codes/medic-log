import { Component } from "react";
import BGPage from "./BGPage";
import SVG from "../Components/SVG";

export default class ErrorBoundary extends Component {
    state = { error: false };

    static getDerivedStateFromError(error) {
        return { error: true };
    }

    componentDidCatch(error, info) {
        console.log("ErrorBounday", { error, info });
    }

    render() {
        if (this.state.error)
            return (
                <BGPage center={1} image={1} style={{ minHeight: "100dvh" }}>
                    <h2 className={`${"text-2xl font-semibold text-red-700 text-center"}`}>
                        An Error With the Server Occured!
                    </h2>
                    <SVG
                        icon={"material-symbols:wifi-tethering-error-rounded"}
                        color="#cb0303"
                        w={296}
                        h={296}
                        label="Not Found Logo"
                    />
                    <h2 className={`${"text-2xl font-semibold text-red-700 text-center"}`}>
                        The site may be down, Please come back later !
                    </h2>
                </BGPage>
            );
        return this.props.children;
    }
}

/** @constant { fallback: React.ReactNode } */
