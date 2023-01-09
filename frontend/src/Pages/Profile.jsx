import { useLayoutEffect } from "react";
import useAuthService from "../Services/AuthService";
import BGPage from "./BGPage";
import ProfileForm from "./ProfileSection/ProfileForm";

const Profile = () => {

    const user = useAuthService(s => s.user);

    useLayoutEffect(() => {
        console.log("useLayout mount");
        return () => console.log("useLayout UNMOUNT");
    }, []);

    return (
        <BGPage center={1} image={1}>
            <section>
                <h2 className="text-center text-3xl font-semibold py-3">Edit User Profile</h2>
                <ProfileForm user={user} />
            </section>
            
        </BGPage>
    );
};

export default Profile;