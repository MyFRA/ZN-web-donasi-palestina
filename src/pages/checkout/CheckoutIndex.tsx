import { useContext, useEffect, useState } from "react";
import { CartContext } from "../../context/CartContext";
import { ProductInterface } from "../../interfaces/ProductInterface";
import Api from "../../utils/Api";
import CardComponent from "../../components/shared/CardComponent";
import Select from "react-select";
import { ReactSelectOptionInterface } from "../../interfaces/ReactSelectOptionInterface";
import toast, { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";
import { LoadingContext } from "../../context/LoadingContext";
import { useNavigate } from "react-router-dom";

export default function CheckoutIndex() {
    /**
     * Hooks
     *
     */
    const navigate = useNavigate();

    /**
     * Contexts
     *
     */
    const { carts } = useContext(CartContext);
    const { setLoadingContext } = useContext(LoadingContext);

    /**
     * States
     *
     */
    const [cartProducts, setCartProducts] = useState<Array<ProductInterface>>([]);
    const [provinces, setProvinces] = useState<Array<ReactSelectOptionInterface>>([]);
    const [selectedProvince, setSelectedProvince] = useState<ReactSelectOptionInterface | null>(null);
    const [cities, setCities] = useState<Array<ReactSelectOptionInterface>>([]);
    const [selectedCity, setSelectedCity] = useState<ReactSelectOptionInterface | null>(null);
    const [district, setDistrict] = useState<string>("");
    const [village, setVillage] = useState<string>("");
    const [homeOfficeAddress, setHomeOfficeAddress] = useState<string>("");
    const [note, setNote] = useState<string>("");
    const [fullname, setFullname] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [whatsappNumber, setWhatsappNumber] = useState<string>("");
    const [couriers, setCouriers] = useState<Array<ReactSelectOptionInterface>>([]);
    const [selectedCourier, setSelectedCourier] = useState<ReactSelectOptionInterface | null>(null);
    const [selectedCost, setSelectedCost] = useState<ReactSelectOptionInterface | null>(null);
    const [costs, setCosts] = useState<Array<ReactSelectOptionInterface>>([]);
    const [postalCode, setPostalCode] = useState<string>("");

    /**
     * Func
     *
     */
    const loadCartProducts = () => {
        const tempCartProducts: Array<ProductInterface> = [];
        setLoadingContext(true);

        Promise.all(
            carts.map(async (cart) => {
                const resp = await Api.get("/products/" + cart.id);

                if (resp.status == 200) {
                    const data = resp.data.data;
                    data.qty = cart.qty;

                    tempCartProducts.push(data);
                }
            })
        )
            .then(() => {
                setCartProducts(tempCartProducts);
            })
            .finally(() => {
                setLoadingContext(false);
            });
    };

    const loadProvinces = () => {
        setLoadingContext(true);

        Api.get("/shipping/provinces")
            .then((res) => {
                setProvinces(
                    res.data.data.map((e: any) => ({
                        value: e.province_id,
                        label: e.province,
                    }))
                );
            })
            .finally(() => {
                setLoadingContext(false);
            });
    };

    const loadCouriers = () => {
        setLoadingContext(true);

        Api.get("/shipping/courier")
            .then((res) => {
                setCouriers(
                    res.data.data.map((e: string) => ({
                        value: e,
                        label: e.toUpperCase(),
                    }))
                );
            })
            .finally(() => {
                setLoadingContext(false);
            });
    };

    const loadCosts = () => {
        setLoadingContext(true);

        Api.post("/shipping/costs", {
            destination: selectedCity?.value,
            courier: selectedCourier?.value,
            weight: cartProducts.reduce((prev: number, cur: ProductInterface) => (prev = prev + cur.weight * (cur.qty ? cur.qty : 0)), 0),
        })
            .then((res) => {
                setCosts(
                    res.data.data.map((e: any) => ({
                        value: e.cost[0].value,
                        label: e.service + " | " + "Rp" + e.cost[0].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " | " + e.cost[0].etd,
                    }))
                );
            })
            .finally(() => {
                setLoadingContext(false);
            });
    };

    const doCheckout = () => {
        setLoadingContext(true);

        const explodedSelectedCost = selectedCost?.label.split("|");
        console.log(explodedSelectedCost);

        Api.post("checkouts", {
            products: cartProducts.map((cartProduct) => ({
                id: cartProduct.id,
                qty: cartProduct.qty,
            })),
            destination_province: selectedProvince?.label,
            destination_province_id: selectedProvince?.value,
            destination_city: selectedCity?.label,
            destination_city_id: selectedCity?.value,
            destination_district: district,
            destination_village: village,
            home_office_address: homeOfficeAddress,
            postal_code: postalCode,
            shipping_note: note,
            courier: selectedCourier?.value,
            courier_cost_service: explodedSelectedCost ? explodedSelectedCost[0] : null,
            courier_cost_value: selectedCost?.value,
            courier_cost_etd: explodedSelectedCost ? explodedSelectedCost[2] : null,
            full_name: fullname,
            whatsapp_number: whatsappNumber,
            email: email,
            message: message,
        })
            .then((res) => {
                setLoadingContext(false);

                window.snap.pay(res.data.token, {
                    onSuccess: function (result: any) {
                        navigate("/success");
                    },
                });
            })
            .catch((error) => {
                setLoadingContext(false);
                const err = error as AxiosError;
                const errResponseMessage: any = err.response?.data;

                toast.error(errResponseMessage.error, { position: "top-right" });
            });
    };

    useEffect(() => {
        if (selectedCourier && selectedCity) {
            loadCosts();
        }
    }, [selectedCourier, selectedCity]);

    useEffect(() => {
        loadCartProducts();
    }, [carts]);

    useEffect(() => {
        loadProvinces();
        loadCouriers();
    }, []);

    useEffect(() => {
        if (selectedProvince) {
            Api.get("/shipping/cities?province_id=" + selectedProvince.value).then((res) => {
                setCities(
                    res.data.data.map((e: any) => ({
                        value: e.city_id,
                        label: e.type + " " + e.city_name,
                    }))
                );
            });
        }
    }, [selectedProvince]);

    return (
        <div>
            <Toaster />

            <CardComponent>
                <div>
                    <h2 className="font-semibold font-inter text-gray-700 text-lg">Keranjang</h2>
                    <hr className="my-3" />
                    {cartProducts.map((cartProduct) => (
                        <div>
                            <div className="flex gap-x-2">
                                <img src={cartProduct.image} className="w-20 aspect-square h-full object-cover object-center rounded" alt="" />
                                <div className="px-2 font-inter flex justify-between w-full">
                                    <div>
                                        <h4 className="text-gray-600 text-sm">{cartProduct.name}</h4>
                                        <h5 className="font-semibold text-base mt-1 text-gray-700">
                                            {cartProduct.qty} x Rp{cartProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                        </h5>
                                    </div>
                                    <div>
                                        <h4 className="text-gray-600 text-sm">Total</h4>
                                        <h5 className="font-semibold text-base mt-1 text-gray-700">Rp{(cartProduct.price * (cartProduct.qty ? cartProduct.qty : 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h5>
                                    </div>
                                </div>
                            </div>
                            <hr className="my-4" />
                        </div>
                    ))}
                </div>
                <div>
                    <div className="mb-3">
                        <label htmlFor="province" className="font-inter text-sm text-[#4A4A4A]">
                            Provinsi
                        </label>
                        <Select
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: "#C4C4C4",
                                    borderWidth: "1px",
                                    boxShadow: "none",
                                    backgroundColor: state.isDisabled ? "transparent" : "transparent",
                                    "&:hover": {
                                        borderColor: "#C4C4C4",
                                    },
                                }),
                                container: (baseStyles, state) => ({
                                    ...baseStyles,
                                    width: "100%",
                                }),
                                input: (baseStyles, state) => ({
                                    ...baseStyles,
                                    color: "#545454",
                                    fontSize: "12px",
                                    fontWeight: "300",
                                    fontFamily: "'Inter', sans-serif",
                                }),
                                option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    backgroundColor: state.isDisabled ? "transparent" : "transparent",
                                    color: "#000",
                                    fontSize: "12px",
                                    fontWeight: state.isDisabled ? "700" : "400",
                                    fontFamily: "'Inter', sans-serif",
                                    borderBottom: state.isDisabled ? "1px solid #C4C4C4;" : "0px",
                                    "&:hover": {
                                        backgroundColor: state.isDisabled ? "#FFF" : "#3B82F6",
                                        color: state.isDisabled ? "#000" : "#FFF",
                                    },
                                }),
                            }}
                            name="province"
                            placeholder="Provinsi"
                            value={selectedProvince}
                            onChange={(val) => {
                                setSelectedProvince(val);
                            }}
                            options={provinces}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="city">Kabupaten</label>
                        <Select
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: "#C4C4C4",
                                    borderWidth: "1px",
                                    boxShadow: "none",
                                    backgroundColor: state.isDisabled ? "transparent" : "transparent",
                                    "&:hover": {
                                        borderColor: "#C4C4C4",
                                    },
                                }),
                                container: (baseStyles, state) => ({
                                    ...baseStyles,
                                    width: "100%",
                                }),
                                input: (baseStyles, state) => ({
                                    ...baseStyles,
                                    color: "#545454",
                                    fontSize: "12px",
                                    fontWeight: "300",
                                    fontFamily: "'Inter', sans-serif",
                                }),
                                option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    backgroundColor: state.isDisabled ? "transparent" : "transparent",
                                    color: "#000",
                                    fontSize: "12px",
                                    fontWeight: state.isDisabled ? "700" : "400",
                                    fontFamily: "'Inter', sans-serif",
                                    borderBottom: state.isDisabled ? "1px solid #C4C4C4;" : "0px",
                                    "&:hover": {
                                        backgroundColor: state.isDisabled ? "#FFF" : "#3B82F6",
                                        color: state.isDisabled ? "#000" : "#FFF",
                                    },
                                }),
                            }}
                            name="city"
                            placeholder="Kota / Kabupaten"
                            value={selectedCity}
                            onChange={(val) => {
                                setSelectedCity(val);
                            }}
                            options={cities}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="district">Kecamatan</label>
                        <div>
                            <input
                                type="text"
                                name="district"
                                id="district"
                                value={district}
                                onChange={(e) => {
                                    setDistrict(e.target.value);
                                }}
                                className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-[#00AEEF] font-inter py-3"
                                placeholder="Kecamatan"
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="village">Desa</label>
                        <div>
                            <input
                                type="text"
                                name="village"
                                id="village"
                                value={village}
                                onChange={(e) => {
                                    setVillage(e.target.value);
                                }}
                                className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-[#00AEEF] font-inter py-3"
                                placeholder="Desa"
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="home_office_address">Alamat Rumah / Kantor</label>
                        <div>
                            <textarea
                                style={{ height: "120px" }}
                                name="home_office_address"
                                id="home_office_address"
                                value={homeOfficeAddress}
                                onChange={(e) => {
                                    setHomeOfficeAddress(e.target.value);
                                }}
                                className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-[#00AEEF] font-inter py-3"
                                placeholder="Alamat Rumah / Kantor"
                            ></textarea>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="postal_code">Kode Pos</label>
                        <div>
                            <input
                                type="number"
                                name="postal_code"
                                id="postal_code"
                                value={postalCode}
                                onChange={(e) => {
                                    setPostalCode(e.target.value);
                                }}
                                className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-[#00AEEF] font-inter py-3"
                                placeholder="Kode Pos"
                            />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="note">Catatan Pengiriman (Opsional)</label>
                        <div>
                            <textarea
                                style={{ height: "120px" }}
                                name="note"
                                id="note"
                                value={note}
                                onChange={(e) => {
                                    setNote(e.target.value);
                                }}
                                className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-[#00AEEF] font-inter py-3"
                                placeholder="Catatan Pengiriman (Opsional)"
                            ></textarea>
                        </div>
                    </div>
                </div>
                <hr className="my-3" />
                <div className="mb-3">
                    <label htmlFor="courier">Kurir</label>
                    <Select
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: "#C4C4C4",
                                borderWidth: "1px",
                                boxShadow: "none",
                                backgroundColor: state.isDisabled ? "transparent" : "transparent",
                                "&:hover": {
                                    borderColor: "#C4C4C4",
                                },
                            }),
                            container: (baseStyles, state) => ({
                                ...baseStyles,
                                width: "100%",
                            }),
                            input: (baseStyles, state) => ({
                                ...baseStyles,
                                color: "#545454",
                                fontSize: "12px",
                                fontWeight: "300",
                                fontFamily: "'Inter', sans-serif",
                            }),
                            option: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: state.isDisabled ? "transparent" : "transparent",
                                color: "#000",
                                fontSize: "12px",
                                fontWeight: state.isDisabled ? "700" : "400",
                                fontFamily: "'Inter', sans-serif",
                                borderBottom: state.isDisabled ? "1px solid #C4C4C4;" : "0px",
                                "&:hover": {
                                    backgroundColor: state.isDisabled ? "#FFF" : "#3B82F6",
                                    color: state.isDisabled ? "#000" : "#FFF",
                                },
                            }),
                        }}
                        name="courier"
                        placeholder="Kurir"
                        value={selectedCourier}
                        onChange={(val) => {
                            setSelectedCourier(val);
                        }}
                        options={couriers}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="cost">Layanan Pengiriman</label>
                    <Select
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: "#C4C4C4",
                                borderWidth: "1px",
                                boxShadow: "none",
                                backgroundColor: state.isDisabled ? "transparent" : "transparent",
                                "&:hover": {
                                    borderColor: "#C4C4C4",
                                },
                            }),
                            container: (baseStyles, state) => ({
                                ...baseStyles,
                                width: "100%",
                            }),
                            input: (baseStyles, state) => ({
                                ...baseStyles,
                                color: "#545454",
                                fontSize: "12px",
                                fontWeight: "300",
                                fontFamily: "'Inter', sans-serif",
                            }),
                            option: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: state.isDisabled ? "transparent" : "transparent",
                                color: "#000",
                                fontSize: "12px",
                                fontWeight: state.isDisabled ? "700" : "400",
                                fontFamily: "'Inter', sans-serif",
                                borderBottom: state.isDisabled ? "1px solid #C4C4C4;" : "0px",
                                "&:hover": {
                                    backgroundColor: state.isDisabled ? "#FFF" : "#3B82F6",
                                    color: state.isDisabled ? "#000" : "#FFF",
                                },
                            }),
                        }}
                        name="cost"
                        placeholder="Layanan Pengiriman"
                        value={selectedCost}
                        onChange={(val) => {
                            setSelectedCost(val);
                        }}
                        options={costs}
                    />
                </div>
                <hr className="my-3" />
                <div>
                    <div className="mb-3">
                        <label htmlFor="fullname">Nama Lengkap</label>
                        <input
                            type="text"
                            name="fullname"
                            id="fullname"
                            className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-[#00AEEF] font-inter py-3"
                            placeholder="Nama Lengkap"
                            value={fullname}
                            onChange={(e) => {
                                setFullname(e.target.value);
                            }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="whatsapp_number">No Whatsapp atau Handphone</label>
                        <input
                            type="text"
                            name="whatsapp_number"
                            id="whatsapp_number"
                            value={whatsappNumber}
                            onChange={(e) => {
                                setWhatsappNumber(e.target.value);
                            }}
                            className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-[#00AEEF] font-inter py-3"
                            placeholder="No Whatsapp atau Handphone"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-[#00AEEF] font-inter py-3"
                            placeholder="Email"
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="message">Pesan / Doa</label>
                        <div>
                            <textarea
                                style={{ height: "120px" }}
                                name="message"
                                id="message"
                                value={message}
                                onChange={(e) => {
                                    setMessage(e.target.value);
                                }}
                                className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-[#00AEEF] font-inter py-3"
                                placeholder="Pesan / Doa (Opsional)"
                            ></textarea>
                        </div>
                    </div>
                </div>
                <hr className="my-3" />
                <div>
                    <div className="flex items-center mb-1 justify-between font-inter">
                        <h3 className="text-[#4A4A4A]">Sub Total</h3>
                        <h3 className="font-semibold text-[#4A4A4A]">
                            Rp
                            {cartProducts
                                .reduce((prev: number, cur: ProductInterface) => (prev = prev + cur.price * (cur.qty ? cur.qty : 0)), 0)
                                .toString()
                                .replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                        </h3>
                    </div>
                    <div className="flex items-center mb-1 justify-between font-inter">
                        <h3 className="text-[#4A4A4A]">Ongkos Kirim</h3>
                        <h3 className="font-semibold text-[#4A4A4A]">{selectedCost ? selectedCost.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "-"}</h3>
                    </div>
                    <div className="flex items-center mb-1 justify-between font-inter">
                        <h3 className="text-[#4A4A4A] text-lg font-semibold">Total</h3>
                        <h3 className="font-semibold text-lg text-[#4A4A4A]">Rp{(cartProducts.reduce((prev: number, cur: ProductInterface) => (prev = prev + cur.price * (cur.qty ? cur.qty : 0)), 0) + parseInt(selectedCost ? selectedCost.value.toString() : "0")).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h3>
                    </div>
                </div>
                <hr className="my-5" />
                <div>
                    <button type="button" onClick={doCheckout} className="flex w-full items-center justify-center py-3 flex-[5] self-stretch rounded-md text-white font-inter font-semibold bg-[#00AEEF] text-base">
                        Beli Rp{(cartProducts.reduce((prev: number, cur: ProductInterface) => (prev = prev + cur.price * (cur.qty ? cur.qty : 0)), 0) + parseInt(selectedCost ? selectedCost.value.toString() : "0")).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                    </button>
                </div>
            </CardComponent>
        </div>
    );
}
