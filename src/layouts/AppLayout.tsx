import { Outlet } from "react-router-dom";
import NavbarComponent from "../components/shared/NavbarComponent";
import LoadingComponent from "../components/shared/LoadingComponent";
import { useContext } from "react";
import { LoadingContext } from "../context/LoadingContext";

export default function AppLayout() {
    const { loading } = useContext(LoadingContext);

    return (
        <div className="bg-[#EDF0F5] min-h-screen py-4">
            <LoadingComponent loading={loading} />
            <div className="mx-auto md:w-[525px] bg-white">
                <NavbarComponent />
                <div className="pt-16 px-2 lg:px-0">
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
