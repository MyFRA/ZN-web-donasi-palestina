import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
// import { CartContext } from "../../context/CartContext";
import { SettingCompanyInterface } from "../../interfaces/SettingCompanyInterface";
import Api from "../../utils/Api";
import ContentLoader from "react-content-loader";

export default function NavbarComponent() {
    // const { carts, reloadCarts } = useContext(CartContext);
    const [settingCompany, setSettingCompany] = useState<SettingCompanyInterface | null>(null);

    const loadSettingCompany = () => {
        Api.get("/setting-company").then((res) => {
            setSettingCompany(res.data.data);
        });
    };

    useEffect(() => {
        // reloadCarts();
        loadSettingCompany();
    }, []);

    return (
        <div className="fixed md:w-[525px] left-2 md:left-[unset] right-2 md:right-[unset] top-0 z-20">
            <div className="bg-white">
                <div className="px-5 py-3 rounded-md bg-white">
                    <div className="flex justify-between items-center">
                        <Link to={"/"} className="flex items-center gap-x-4 hover:opacity-80">
                            {settingCompany?.company_logo_url ? (
                                <img className="w-12 rounded-full" src={settingCompany?.company_logo_url} alt="" />
                            ) : (
                                <ContentLoader viewBox="0 0 380 70">
                                    <circle cx="30" cy="30" r="30" />
                                </ContentLoader>
                            )}
                            <div>
                                <h4 className="font-inter text-[#00AEEF] text-base font-semibold">{settingCompany?.company_name}</h4>
                                <div className="flex items-center gap-x-2 mt-1">
                                    <img className="w-10" src="https://donasipalestina.id/wp-content/plugins/donasiaja/assets/images/check-org2.png" alt="" />
                                    <span className="font-inter italic text-gray-400 text-xs">Verified Organization</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
