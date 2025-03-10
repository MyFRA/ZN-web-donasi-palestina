import { useContext, useEffect, useState } from "react";
import CardComponent from "../../components/shared/CardComponent";
import Switch from "react-switch";
import Api from "../../utils/Api";
import toast, { Toaster } from "react-hot-toast";
import { AxiosError } from "axios";
import "react-tabs/style/react-tabs.css";
import { LoadingContext } from "../../context/LoadingContext";
import { useNavigate } from "react-router-dom";
import ContentLoader from "react-content-loader";
import SettingWebDonationInterface from "../../interfaces/SettingWebDonationInterface";
import VirtualBankAccount from "../../interfaces/VirtualBankAccount";
import { CloseVaObj } from "../../interfaces/CloseVaObj";
import { StringUtil } from "../../utils/StringUtil";
import LoadingComponent from "../../components/shared/LoadingComponent";

type AvailableDonationType = {
    description: string;
    id: number;
    short_description: string;
    title: string;
    value: string;
};

declare global {
    interface Window {
        snap: unknown;
    }
}

export default function DonationIndex() {
    /**
     * Hooks
     *
     */
    const navigate = useNavigate();

    /**
     * Context
     *
     */
    const { setLoadingContext, loading } = useContext(LoadingContext);

    /**
     * Main States
     *
     */
    const [checkedHideName, setCheckedHideName] = useState<boolean>(false);
    const [selectedDonation, setSelectedDonation] = useState<AvailableDonationType | null>(null);
    const [nominalLainnya, setNominalLainnya] = useState<number | string>("");
    const [availableDonations, setAvailableDonations] = useState<Array<AvailableDonationType>>([]);
    const [fullname, setFullname] = useState<string>("");
    const [whatsappNumber, setWhatsappNumber] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [settingWebDonation, setSettingWebDonation] = useState<SettingWebDonationInterface | null>(null);
    const [virtualBankAccounts, setVirtualBankAccounts] = useState<VirtualBankAccount[] | null>(null);
    const [amountPackageDonation] = useState<number>(1);
    const [selectedVirtualAccount, setSelectedVirtualAccount] = useState<VirtualBankAccount | null>(null);
    const [closeVaObj, setCloseVaObj] = useState<CloseVaObj | null>(null);

    const handleChangeHideName = () => {
        setCheckedHideName(!checkedHideName);
    };

    const loadAvailableDonations = () => {
        Api.get("/available-donations").then((res) => {
            setAvailableDonations(res.data.data);
        });
    };

    const loadVirtualBankAccounts = () => {
        Api.get("/virtual-bank-accounts").then((res) => {
            setVirtualBankAccounts(res.data.data);
        });
    };

    const loadSettingWebDonations = () => {
        Api.get("/web-donations").then((res) => {
            setSettingWebDonation(res.data.data);
        });
    };

    useEffect(() => {
        loadAvailableDonations();
        loadSettingWebDonations();
        loadVirtualBankAccounts();
    }, []);

    const doCheckTransactionStatus = () => {
        setLoadingContext(true);
        Api.get(`/payment/status/${closeVaObj?.id}`)
            .then((res) => {
                if (res.data.data.status == "pending") {
                    toast.error("Status transaksi masih pending");
                    return;
                }

                window.location.href = "/success";
            })
            .finally(() => {
                setLoadingContext(false);
            });
    };

    const doDonate = () => {
        setLoadingContext(true);

        Api.post("/donate", {
            donation_id: selectedDonation?.id,
            fullname: fullname,
            is_fullname_hidden: checkedHideName,
            whatsapp_number: whatsappNumber,
            email: email,
            message: message,
            custom_value: nominalLainnya,
            amount_package: amountPackageDonation,
            short_bank_code: selectedVirtualAccount?.bank_short_code,
        })
            .then((res) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                // (window.snap as any).pay(res.data.token, {
                //     onSuccess: function () {
                //         navigate("/success");
                //     },
                // });
                // window.open(res.data.paymentUrl);
                setCloseVaObj(res.data.data);
                doOpenModalVA();
            })
            .catch((error) => {
                const err = error as AxiosError;
                const errResponseMessage: unknown = err.response?.data;

                toast.error(errResponseMessage?.error);
            })
            .finally(() => {
                setLoadingContext(false);
            });
    };

    const doOpenModalVA = () => {
        (document.getElementById("modalVA") as HTMLDialogElement)?.showModal();
    };

    return (
        <div>
            <Toaster toastOptions={{ position: "top-center" }} containerStyle={{ top: "50%" }} />
            <CardComponent>
                <div className="flex items-start gap-x-6">
                    {settingWebDonation?.thumbnails ? (
                        <>{settingWebDonation.thumbnails.length > 0 ? <img src={settingWebDonation?.thumbnails[0].thumbnail} alt="" className="w-4/12 rounded-md shadow-md" /> : <></>}</>
                    ) : (
                        <ContentLoader viewBox="0 0 200 70">
                            <rect x="0" y="0" rx="4" ry="4" width="100" height="50" />
                        </ContentLoader>
                    )}
                    <div>
                        <span className="font-inter text-gray-400 text-xs">Anda akan berdonasi dalam program:</span>
                        <h2 className="font-inter text-[#4A4A4A] mt-1 text-sm font-semibold">{settingWebDonation?.title}</h2>
                    </div>
                </div>
                <hr className="mt-6 mb-4" />

                <div>
                    <div>
                        <p className="font-inter text-[#4A4A4A] mb-5 text-center font-semibold mt-5">Nominal Donasi</p>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {availableDonations.map((availableDonation, i) => (
                                <button
                                    key={i}
                                    onClick={() => {
                                        setSelectedDonation(availableDonation);
                                    }}
                                    className={` rounded-xl cursor-pointer flex flex-col items-center justify-center p-5 ${selectedDonation?.value == availableDonation.value ? "border-[2.5px] border-[#00AEEF]" : ""}`}
                                    style={{ boxShadow: "0 4px 25px 0 rgba(0,0,0,.1)" }}
                                >
                                    <h4 className={`font-inter ${selectedDonation?.value == availableDonation.value ? "text-[#00AEEF] font-semibold" : "text-gray-700"}`}>{availableDonation.title}</h4>
                                </button>
                            ))}
                        </div>
                    </div>
                    {/* <div>
                                {availableDonations.map((availableDonation) => (
                                    <div className="mt-6">
                                        {selectedDonation?.value != "lainnya" && selectedDonation?.value != null ? <h5 className={`font-inter text-sm text-gray-600 font-semibold ${availableDonation.value != selectedDonation?.value ? "hidden" : ""}`}>Deksripsi Paket</h5> : <></>}
                                        <p className={`font-inter text-sm text-gray-500 mt-1 ${availableDonation.value != selectedDonation?.value ? "hidden" : ""}`}>{availableDonation.description}</p>
                                    </div>
                                ))}
                            </div> */}

                    {selectedDonation?.value == "lainnya" ? (
                        <div className="relative">
                            <input
                                type="text"
                                name="custom_price"
                                className="text-right w-full mt-4 border-[0.5px] p-3 rounded focus:outline-[#00AEEF] text-gray-700 text-xl font-semibold placeholder:font-normal placeholder:text-lg placeholder:text-gray-400 font-inter border-gray-300"
                                placeholder="Masukan Nominal"
                                id="custom_price"
                                value={!nominalLainnya ? "" : "Rp " + nominalLainnya.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}
                                onChange={(e) => {
                                    setNominalLainnya(parseInt(e.target.value.replaceAll(".", "").replace("Rp ", "")));
                                }}
                            />
                            <h4 className="absolute top-1/2 translate-y-[-6px] text-lg left-2.5 font-inter text-[#00AEEF] font-semibold">Rp</h4>
                        </div>
                    ) : (
                        <></>
                    )}
                    <hr className="my-4" />
                    {/* 
                            {selectedDonation?.value != "lainnya" && selectedDonation?.value != null ? (
                                <div>
                                    <div className="flex gap-5">
                                        <div>
                                            <label htmlFor="amount_package" className="font-inter text-sm text-gray-600 font-semibold">
                                                Jumlah Paket
                                            </label>
                                            <p className="font-inter text-xs mt-0.5 text-gray-600">Jumlah paket yang akan didonasikan</p>
                                        </div>
                                        <div className="mt-1 flex gap-2">
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setAmountPackageDonation(amountPackageDonation - 1);
                                                    }}
                                                    className="flex items-center justify-center rounded-md text-white font-inter font-semibold bg-[#00AEEF] text-base h-full w-12"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline w-5 icon-tabler-minus">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M5 12l14 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                            <input
                                                type="number"
                                                name="amount_package"
                                                id="amount_package"
                                                className="border-[0.5px] text-center border-gray-300 rounded w-full px-4 text-sm focus:outline-[#00AEEF] font-inter py-3"
                                                placeholder="Jumlah Paket"
                                                value={amountPackageDonation}
                                                onChange={(e) => {
                                                    setAmountPackageDonation(parseInt(e.target.value));
                                                }}
                                            />
                                            <div>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setAmountPackageDonation(amountPackageDonation + 1);
                                                    }}
                                                    className="flex items-center justify-center rounded-md text-white font-inter font-semibold bg-[#00AEEF] text-base h-full w-12"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="icon icon-tabler icons-tabler-outline w-5 icon-tabler-plus">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M12 5l0 14" />
                                                        <path d="M5 12l14 0" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <hr className="my-4" />
                                </div>
                            ) : (
                                <></>
                            )} */}

                    {!checkedHideName ? (
                        <div className="mt-6">
                            <label htmlFor="fullname" className="font-inter text-sm text-gray-600 font-semibold">
                                Nama Lengkap <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                name="fullname"
                                id="fullname"
                                className="border-[0.5px] border-gray-300 rounded w-full px-4 mt-1 text-sm focus:outline-[#00AEEF] font-inter py-3"
                                placeholder="Nama Lengkap"
                                value={fullname}
                                onChange={(e) => {
                                    setFullname(e.target.value);
                                }}
                            />
                        </div>
                    ) : (
                        <></>
                    )}
                    <div className="flex justify-between items-center my-4">
                        <p className="font-inter text-sm text-gray-600">Sembunyikan nama saya (Dermawan)</p>
                        <Switch onChange={handleChangeHideName} uncheckedIcon={false} checkedIcon={false} onColor="#2563EB" checked={checkedHideName} />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="whatsapp_number" className="font-inter text-sm text-gray-600 font-semibold">
                            No Whatsapp atau Handphone (Opsional)
                        </label>
                        <input
                            type="text"
                            name="whatsapp_number"
                            id="whatsapp_number"
                            value={whatsappNumber}
                            onChange={(e) => {
                                setWhatsappNumber(e.target.value);
                            }}
                            className="border-[0.5px] border-gray-300 rounded w-full px-4 mt-1 text-sm focus:outline-[#00AEEF] font-inter py-3"
                            placeholder="No Whatsapp atau Handphone (Opsional)"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="email" className="font-inter text-sm text-gray-600 font-semibold">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            name="email"
                            id="email"
                            value={email}
                            onChange={(e) => {
                                setEmail(e.target.value);
                            }}
                            className="border-[0.5px] border-gray-300 rounded w-full px-4 mt-1 text-sm focus:outline-[#00AEEF] font-inter py-3"
                            placeholder="Email (Opsional)"
                        />
                    </div>
                    <div className="mt-4">
                        <label htmlFor="message" className="font-inter text-sm text-gray-600 font-semibold">
                            Pesan atau Doa (Opsional)
                        </label>
                        <textarea
                            name="message"
                            id="message"
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value);
                            }}
                            className="h-[120px] border-[0.5px] border-gray-300 rounded w-full mt-1 px-4 text-sm focus:outline-[#00AEEF] font-inter py-3"
                            placeholder="Pesan atau Doa (Opsional)"
                        ></textarea>
                    </div>
                    <hr className="my-3" />
                    <div>
                        <h6 className="font-inter text-sm text-gray-600 font-semibold">Pilih Metode Pembayaran</h6>
                        <div className="grid grid-cols-3 gap-3 mt-2">
                            {virtualBankAccounts?.map((virtualBankAccount) => (
                                <button
                                    className={`border-2 rounded-lg aspect-video cursor-pointer ${selectedVirtualAccount == virtualBankAccount ? "border-[#00AEEF] bg-[#00AEEF] bg-opacity-5" : ""}`}
                                    onClick={() => {
                                        setSelectedVirtualAccount(virtualBankAccount);
                                    }}
                                >
                                    <div className="aspect-video items-center flex justify-center">
                                        <img src={virtualBankAccount.image} className="h-full rounded-xl" alt="" />
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-x-2 mt-6">
                        <button type="button" onClick={doDonate} className="flex items-center justify-center py-3 flex-[5] self-stretch rounded-md text-white font-inter font-semibold bg-[#00AEEF] disabled:bg-opacity-40 hover:bg-opacity-90 text-base" disabled={!selectedVirtualAccount}>
                            Donasi {selectedDonation != null ? (selectedDonation?.value != "lainnya" ? "Rp " + (parseInt(selectedDonation?.value) * amountPackageDonation).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") : "Rp " + nominalLainnya.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")) : ""}
                        </button>
                        {closeVaObj ? (
                            <dialog id="modalVA" className="modal">
                                <div className="modal-box">
                                    <LoadingComponent loading={loading} />
                                    <Toaster toastOptions={{ position: "top-center" }} containerStyle={{ top: "50%" }} />

                                    <form method="dialog">
                                        {/* if there is a button in form, it will close the modal */}
                                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                    </form>
                                    <div>
                                        <img src={selectedVirtualAccount?.image} className="w-[40px]" alt="" />
                                        <div className="flex flex-row justify-between items-center mt-5">
                                            <div className="flex flex-col">
                                                <span className="antialiased font-semibold text-sm text-duitk-dark">Nomor Akun Virtual</span>
                                                <span className="text-2xl font-medium tracking-wide text-gray-700">{closeVaObj?.accountNo}</span>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    navigator.clipboard.writeText(`${closeVaObj?.accountNo}`);
                                                    toast.success("Nomor akun virtual telah disalin");
                                                }}
                                                role="button"
                                                className="hover:bg-gray-300 p-2 rounded-lg duration-300 btn"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75"
                                                    />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <hr className="my-2" />
                                    <div>
                                        <ul className="flex flex-col gap-1.5">
                                            <li className="flex justify-between">
                                                <p>Donasi</p>
                                                <p>Rp {StringUtil.formatRupiah(selectedDonation?.value == "lainnya" ? nominalLainnya : selectedDonation?.value)}</p>
                                            </li>
                                            <li className="flex justify-between">
                                                <p>Biaya Admin VA</p>
                                                <p>Rp {StringUtil.formatRupiah(3500)}</p>
                                            </li>
                                            <li className="flex justify-between">
                                                <b className="text-lg">Total</b>
                                                <b className="text-lg">Rp {StringUtil.formatRupiah(((selectedDonation?.value == "lainnya" ? nominalLainnya : selectedDonation?.value) as never) + 3500)}</b>
                                            </li>
                                        </ul>
                                        <hr className="my-4" />
                                        <button type="button" onClick={doCheckTransactionStatus} className="w-full flex items-center justify-center py-2 flex-[5] self-stretch rounded-md text-white font-inter font-semibold bg-[#00AEEF] disabled:bg-opacity-40 hover:bg-opacity-90 text-base">
                                            Cek Status Transaksi
                                        </button>
                                    </div>
                                </div>
                            </dialog>
                        ) : (
                            <></>
                        )}
                    </div>
                </div>
                {/* <TabPanel>
                        <div>
                            <p className="font-inter text-[#4A4A4A] text-center font-semibold mt-5">Donasi Dengan Membeli Produk</p>
                            <p className="text-center font-inter text-gray-500 text-sm mt-2">Setiap hasil dari penjualan langsung didonasikan untuk mendukung kebutuhan mendesak dan membangun masa depan yang lebih baik bagi Palestina. Bersama kita bisa membuat perbedaan</p>
                        </div>
                        <hr className="my-5" />
                        <div>
                            <div className="grid grid-cols-2 gap-4">
                                {products.map((product) => (
                                    <div className="shadow-md rounded-b">
                                        <img src={product.image} className="w-full rounded-t aspect-square object-cover object-center" alt="" />
                                        <div className="font-inter p-2.5">
                                            <h4 className="text-gray-700 text-sm">{product.name}</h4>
                                            <h3 className="text-sm font-semibold text-gray-700 mt-0.5">Rp{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</h3>
                                            <span className="block text-xs text-gray-500 mt-3">{product.sales} terjual</span>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setLoadingContext(true);
                                                    addToCart(
                                                        product.id,
                                                        () => {
                                                            toast.success("Produk berhasil ditambahkan ke keranjang");
                                                            setLoadingContext(false);
                                                        },
                                                        () => {
                                                            toast.error("Produk tidak bisa ditambahkan ke keranjang");
                                                            setLoadingContext(false);
                                                        }
                                                    );
                                                }}
                                                className="bg-[#00AEEF] text-white w-full rounded font-inter font-semibold flex justify-center items-center py-1.5 mt-3 gap-x-1"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-shopping-cart text-white" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                                    <path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" />
                                                    <path d="M17 17h-11v-14h-2" />
                                                    <path d="M6 5l14 1l-1 7h-13" />
                                                </svg>
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </TabPanel> */}
            </CardComponent>
        </div>
    );
}
