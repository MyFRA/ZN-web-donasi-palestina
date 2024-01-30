import { Link } from "react-router-dom";
import CardComponent from "./CardComponent";
import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { SettingCompanyInterface } from "../../interfaces/SettingCompanyInterface";
import Api from "../../utils/Api";
import ContentLoader from "react-content-loader";

export default function NavbarComponent() {
    const { carts, reloadCarts } = useContext(CartContext);
    const [settingCompany, setSettingCompany] = useState<SettingCompanyInterface | null>(null);

    const loadSettingCompany = () => {
        Api.get("/setting-company").then((res) => {
            setSettingCompany(res.data.data);
        });
    };

    useEffect(() => {
        reloadCarts();
        loadSettingCompany();
    }, []);

    return (
        <div className="fixed md:w-[525px] left-2 md:left-[unset] right-2 md:right-[unset] top-0 z-20">
            <CardComponent>
                <div className="flex justify-between items-center">
                    <Link to={"/"} className="flex items-center gap-x-6">
                        {settingCompany?.company_logo_url ? (
                            <img className="w-10 rounded-full" src={settingCompany?.company_logo_url} alt="" />
                        ) : (
                            <ContentLoader viewBox="0 0 380 70">
                                <circle cx="30" cy="30" r="30" />
                            </ContentLoader>
                        )}
                        <div>
                            <h4 className="font-inter text-blue-400 text-lg">{settingCompany?.company_name}</h4>
                            <div className="flex items-center gap-x-2 mt-1">
                                <img className="w-10" src="https://donasipalestina.id/wp-content/plugins/donasiaja/assets/images/check-org2.png" alt="" />
                                <span className="font-inter italic text-gray-400 text-xs">Verified Organization</span>
                            </div>
                        </div>
                    </Link>
                    <Link className="relative" to={"/carts"}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-shopping-cart text-gray-600" width="36" height="36" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                            <path d="M17 17h-11v-14h-2" />
                            <path d="M6 5l14 1l-1 7h-13" />
                        </svg>
                        {carts.length > 0 ? <span className="font-inter text-xs absolute top-0 left-full translate-y-full -translate-x-full bg-blue-500 text-white w-5 h-5 rounded-full flex items-center justify-center">{carts.length}</span> : <></>}
                    </Link>
                </div>
            </CardComponent>
        </div>
    );
}
