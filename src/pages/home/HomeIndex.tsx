import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import "react-tabs/style/react-tabs.css";
import CardComponent from "../../components/shared/CardComponent";
import Api from "../../utils/Api";
import { StringUtil } from "../../utils/StringUtil";
import { SettingCompanyInterface } from "../../interfaces/SettingCompanyInterface";
import { DonaturInterface } from "../../interfaces/DonaturInterface";
import { BackendPaginationInterface } from "../../interfaces/BackendPaginationInterface";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import copy from "copy-to-clipboard";
import { NewsInterface } from "../../interfaces/NewsInterface";
import ContentLoader from "react-content-loader";
import "@splidejs/react-splide/css";
// @ts-expect-error: JS Package
import { Splide, SplideSlide } from "@splidejs/react-splide";

export default function HomeIndex() {
    /**
     * Hooks
     *
     */
    const btnDonationRef = useRef<HTMLAnchorElement | null>(null);

    /**
     * Main State
     *
     */
    const [tab1Expand, setTab1Expand] = useState<boolean>(true);
    const [modalShareOpen, setModalShareOpen] = useState<boolean>(false);
    const [offsetY, setOffsetY] = useState<number>(0);
    const [showDonationComponentBottom, setShowDonationComponentBottom] = useState(false);
    const [amountDonation, setAmountDonation] = useState(0);
    const [amountDonatur, setAmountDonatur] = useState(0);
    const [settingCompany, setSettingCompany] = useState<SettingCompanyInterface | null>(null);
    const [arrDonatur, setArrDonatur] = useState<Array<DonaturInterface>>([]);
    const [arrDonaturMessages, setArrDonaturMessages] = useState<Array<DonaturInterface>>([]);
    const [donaturPagination, setDonaturPagination] = useState<BackendPaginationInterface | null>(null);
    const [donaturMessagePagination, setDonaturMessagePagination] = useState<BackendPaginationInterface | null>(null);
    const [totalDonatur, setTotalDonatur] = useState<number>(0);
    const [totalMessages, setTotalMessages] = useState<number>(0);
    const [settingWebDonation, setSettingWebDonation] = useState<SettingWebDonationInterface | null>(null);
    const [news, setNews] = useState<Array<NewsInterface>>([]);
    const [newsPagination, setNewsPagination] = useState<BackendPaginationInterface | null>(null);
    const [openedNewsIndex, setOpenedNewsIndex] = useState<Array<number>>([]);

    const loadSettingCompany = () => {
        Api.get("/setting-company").then((res) => {
            setSettingCompany(res.data.data);
        });
    };

    const loadArrDonatur = (url?: string) => {
        if (url) {
            axios.get(url).then((res) => {
                const tempArrDonatur = [...arrDonatur];
                tempArrDonatur.push(...res.data.donatur.data);

                setArrDonatur(tempArrDonatur);
                setTotalDonatur(res.data.total_donaturs);
                setTotalMessages(res.data.total_messages);

                setDonaturPagination({
                    next_page_url: res.data.donatur.next_page_url,
                    prev_page_url: res.data.donatur.prev_page_url,
                });
            });
        } else {
            Api.get("/recap-donation/donatur").then((res) => {
                setArrDonatur(res.data.donatur.data);
                setTotalDonatur(res.data.total_donaturs);
                setTotalMessages(res.data.total_messages);
                setDonaturPagination({
                    next_page_url: res.data.donatur.next_page_url,
                    prev_page_url: res.data.donatur.prev_page_url,
                });
            });
        }
    };

    const loadNews = (url?: string) => {
        if (url) {
            axios.get(url).then((res) => {
                const tempNews = [...news];
                tempNews.push(...res.data.data.data);

                setNews(tempNews);
                setNewsPagination({
                    next_page_url: res.data.data.next_page_url,
                    prev_page_url: res.data.data.prev_page_url,
                });
            });
        } else {
            Api.get("/news").then((res) => {
                setNews(res.data.data.data);
                setNewsPagination({
                    next_page_url: res.data.data.next_page_url,
                    prev_page_url: res.data.data.prev_page_url,
                });
            });
        }
    };

    const loadArrDonaturMessages = (url?: string) => {
        if (url) {
            axios.get(url).then((res) => {
                const tempArrDonaturMessages = [...arrDonaturMessages];
                tempArrDonaturMessages.push(...res.data.messages.data);

                setArrDonaturMessages(tempArrDonaturMessages);
                setTotalDonatur(res.data.total_donaturs);
                setTotalMessages(res.data.total_messages);

                setDonaturMessagePagination({
                    next_page_url: res.data.messages.next_page_url,
                    prev_page_url: res.data.messages.prev_page_url,
                });
            });
        } else {
            Api.get("/recap-donation/donatur").then((res) => {
                setArrDonaturMessages(res.data.messages.data);
                setTotalDonatur(res.data.total_donaturs);
                setTotalMessages(res.data.total_messages);
                setDonaturMessagePagination({
                    next_page_url: res.data.messages.next_page_url,
                    prev_page_url: res.data.messages.prev_page_url,
                });
            });
        }
    };

    const toggleOpenedNewsIndex = (indexParram: number) => {
        const indexInOpenedNewsIndex = openedNewsIndex.findIndex((v) => v == indexParram);
        const tempOpenedNewsIndex = [...openedNewsIndex];

        if (indexInOpenedNewsIndex >= 0) {
            tempOpenedNewsIndex.splice(indexInOpenedNewsIndex, 1);
        } else {
            tempOpenedNewsIndex.push(indexParram);
        }

        setOpenedNewsIndex(tempOpenedNewsIndex);
    };

    const onScroll = () => setOffsetY(window.scrollY);

    const loadDonationCollected = () => {
        Api.get("/recap-donation/donation-collected").then((res) => {
            setAmountDonation(res.data.data.amount_donation);
            setAmountDonatur(res.data.data.amount_donatur);
        });
    };

    const loadSettingWebDonations = () => {
        Api.get("/web-donations").then((res) => {
            setSettingWebDonation(res.data.data);
        });
    };

    useEffect(() => {
        window.removeEventListener("scroll", onScroll);
        window.addEventListener("scroll", onScroll, { passive: true });

        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    useEffect(() => {
        loadDonationCollected();
        loadSettingCompany();
        loadArrDonatur();
        loadArrDonaturMessages();
        loadSettingWebDonations();
        loadNews();
    }, []);

    useEffect(() => {
        if (btnDonationRef.current) {
            if (offsetY >= btnDonationRef.current.offsetTop - 100) {
                setShowDonationComponentBottom(true);
            } else {
                setShowDonationComponentBottom(false);
            }
        }
    }, [scrollY]);

    return (
        <div>
            <Toaster toastOptions={{ position: "top-center" }} containerStyle={{ top: "50%" }} />

            {/* Modal Share */}
            <main className={`antialiased bg-[rgba(0, 0, 0, 0.4)] text-gray-900 font-sans overflow-x-hidden fixed w-full top-0 z-50 ${modalShareOpen ? "" : "hidden"}`}>
                <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center flex justify-center">
                    <div className="bg-black opacity-25 w-full h-full fixed z-10 inset-0"></div>
                    <div className="bg-white rounded-lg md:w-[525px] p-5 fixed inset-x-0 bottom-0 z-50 top-[50%] left-2 md:left-[50%] right-2 md:-translate-x-2/4 -translate-y-1/2 h-fit">
                        <div className="md:flex items-center">
                            <div className="mt-4 md:mt-0 text-center md:text-left">
                                <p className="font-bold">Share</p>
                                <br />
                                <div className="flex items-center gap-x-2 mt-1">
                                    <button
                                        onClick={() => {
                                            copy(window.location.href);
                                            toast.success("Berhasil, URL telah disalin");
                                        }}
                                        className="flex bg-gray-100 hover:bg-gray-300 rounded-md py-1.5 gap-x-1 px-3 font-inter text-sm items-center"
                                    >
                                        <span className="text-xl">
                                            <i className="ri-file-copy-line"></i>
                                        </span>
                                        <span className="text-gray-600 translate-y-[-2px] mt-1">Salin Link</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            window.open("https://api.whatsapp.com/send?&text=BANTU%20PALESTINA%20BANGKIT%0A" + window.location.href, "_blank");
                                        }}
                                        className="flex bg-gray-100 hover:bg-green-500 hover:text-white text-gray-600 rounded-md py-1.5 gap-x-1 px-3 font-inter text-sm items-center"
                                    >
                                        <span className="text-xl">
                                            <i className="ri-whatsapp-line"></i>
                                        </span>
                                        <span className="translate-y-[-2px] mt-1">Whatsapp</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="text-center md:text-right mt-4 md:flex md:justify-end">
                            <button
                                type="button"
                                onClick={() => {
                                    setModalShareOpen(false);
                                }}
                                className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4
          md:mt-0 md:order-1"
                            >
                                Tutup
                            </button>
                        </div>
                    </div>
                </div>
            </main>
            {/* End of Modal Share */}

            {/* Modal Detail Company */}
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <dialog id="modalDetailCompany" className="modal">
                <div className="modal-box">
                    <form method="dialog">
                        {/* if there is a button in form, it will close the modal */}
                        <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>

                    <div className="text-[#00AEEF] mt-3 flex items-center gap-x-4">
                        {settingCompany?.company_logo_url ? (
                            <img className="w-14 rounded-full" src={settingCompany?.company_logo_url} alt="" />
                        ) : (
                            <ContentLoader viewBox="0 0 380 70">
                                <circle cx="30" cy="30" r="30" />
                            </ContentLoader>
                        )}
                        <div>
                            <h4 className="font-inter text-[#00AEEF] text-base font-semibold">{settingCompany?.company_name}</h4>
                            <div className="flex items-center gap-x-1 mt-1.5">
                                <img className="w-10" src="https://donasipalestina.id/wp-content/plugins/donasiaja/assets/images/check-org2.png" alt="" />
                                <span className="font-inter italic text-gray-400 text-xs">Verified Organization</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-sm mt-7 text-gray-600" dangerouslySetInnerHTML={{ __html: `${settingCompany?.company_description}` }}></div>
                    <div className="mt-3">
                        <div className="mb-2">
                            <b className="text-sm font-bold text-gray-800">Email</b>
                            <p className="text-sm text-gray-600">{settingCompany?.company_email}</p>
                        </div>
                        <div className="mb-2">
                            <b className="text-sm font-bold text-gray-800">No Telp</b>
                            <p className="text-sm text-gray-600">{settingCompany?.company_phone_number}</p>
                        </div>
                        <div className="mb-2">
                            <b className="text-sm font-bold text-gray-800">Alamat</b>
                            <p className="text-sm text-gray-600">{settingCompany?.company_address}</p>
                        </div>
                    </div>
                    <hr className="my-5" />
                    <form method="dialog" className="flex justify-end">
                        <button type="submit" className="btn">
                            Tutup
                        </button>
                    </form>
                </div>
            </dialog>
            {/* End of Modal Detail Company */}
            <div className="flex justify-center">
                {settingWebDonation?.thumbnails ? (
                    <Splide options={{ rewind: true, type: "loop", autoplay: true, perPage: 1, gap: 20, width: "95%" }} aria-label="React Splide Example">
                        {settingWebDonation.thumbnails.map((thumbnail) => (
                            <SplideSlide>
                                <img src={thumbnail.thumbnail} style={{ objectFit: "cover", objectPosition: "center", width: "100%" }} className="rounded-xl aspect-video" />
                            </SplideSlide>
                        ))}
                    </Splide>
                ) : (
                    <ContentLoader viewBox="0 0 380 150">
                        {/* Only SVG shapes */}
                        <rect x="0" y="0" rx="5" ry="5" width="100%" height="150" />
                    </ContentLoader>
                )}
            </div>

            <div className="px-4 py-3 bg-white rounded-b-md-lg">
                <h1 className="font-inter text-[#4A4A4A] text-xl font-bold">{settingWebDonation?.title}</h1>
                <span className="flex items-center mt-1 gap-x-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-300 icon icon-tabler icon-tabler-map-pin" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                        <path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" />
                        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" />
                    </svg>
                    <span className="text-gray-400 text-xs font-inter">Gaza, Palestina</span>
                </span>
                <div className="mt-3">
                    <span>
                        <h3 className="font-inter text-[#00AEEF] text-lg font-bold">Rp {StringUtil.formatRupiah(amountDonation)}</h3>
                        <p className="font-inter text-xs mt-0.5 text-gray-600">
                            Terkumpul dari <b className="text-gray-700">Rp {StringUtil.formatRupiah(settingWebDonation?.donation_target ? settingWebDonation?.donation_target : 0)}</b>
                        </p>
                    </span>
                    <div className="mt-3">
                        <div className="bg-gray-300 rounded-md h-1.5">
                            <div className={`bg-gradient-to-r rounded-md bg-[#00AEEF] h-full`} style={{ width: `${(amountDonation / settingWebDonation?.donation_target) * 100}%` }}></div>
                        </div>
                        <div className="mt-2.5">
                            <span className="flex items-center gap-x-1 font-inter text-gray-600">
                                <b className="text-xs">{StringUtil.formatRupiah(amountDonatur)}</b> <span className="text-xs">Donatur</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-3">
                    <Link to={"/donate"} className="block bg-[#00AEEF] w-full rounded-md text-center text-white font-inter font-semibold py-2 hover:bg-opacity-80 duration-300" ref={btnDonationRef}>
                        Donasi Sekarang!
                    </Link>
                </div>
            </div>
            <hr />
            <CardComponent>
                <h3 className="font-inter text-lg font-semibold text-[#4A4A4A]">Penggalang Dana</h3>
                <div
                    className="text-[#00AEEF] mt-3 flex items-center gap-x-4 cursor-pointer"
                    onClick={() => {
                        (document.getElementById("modalDetailCompany") as HTMLDialogElement).showModal();
                    }}
                >
                    {settingCompany?.company_logo_url ? (
                        <img className="w-16 rounded-full" src={settingCompany?.company_logo_url} alt="" />
                    ) : (
                        <ContentLoader viewBox="0 0 380 70">
                            <circle cx="30" cy="30" r="30" />
                        </ContentLoader>
                    )}
                    <div>
                        <h4 className="font-inter text-[#00AEEF] text-base font-semibold hover:opacity-80 duration-300">{settingCompany?.company_name}</h4>
                        <div className="flex items-center gap-x-1 mt-1.5">
                            <img className="w-10" src="https://donasipalestina.id/wp-content/plugins/donasiaja/assets/images/check-org2.png" alt="" />
                            <span className="font-inter italic text-gray-400 text-xs">Verified Organization</span>
                        </div>
                    </div>
                </div>
            </CardComponent>
            <hr />
            <CardComponent>
                <div className="flex flex-col gap-2">
                    <div className="collapse rounded-lg shadow-sm border outline-none focus:outline-none focus:border-none active:border-none active:outline-none collapse-arrow bg-white">
                        <input type="checkbox" className="outline-none" defaultChecked />
                        <div className="collapse-title text-base text-gray-700 font-bold">Keterangan</div>
                        <div className="collapse-content">
                            <hr className="mb-4" />
                            <div className="font-inter">
                                <div className="font-inter text-sm text-gray-700 keterangan">
                                    <div
                                        className={`${tab1Expand ? "" : "max-h-20 overflow-hidden"}`}
                                        dangerouslySetInnerHTML={{
                                            __html: settingWebDonation ? settingWebDonation.description : "",
                                        }}
                                    ></div>
                                    <button
                                        onClick={() => {
                                            setTab1Expand(!tab1Expand);
                                        }}
                                        className="bg-blue-50 mt-4 text-[#00AEEF] py-2 hover:bg-blue-100 rounded-md text-center font-inter text-xs w-full flex items-center justify-center gap-x-1"
                                    >
                                        {tab1Expand ? "Baca dengan ringkas " : "Baca Selengkapnya "}
                                        <span
                                            className={`text-lg ${tab1Expand ? "-translate-y-2" : "translate-y-2"}`}
                                            dangerouslySetInnerHTML={{
                                                __html: tab1Expand ? "&#129169" : "&#129171;",
                                            }}
                                        ></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="collapse rounded-lg shadow-sm border outline-none focus:outline-none focus:border-none active:border-none active:outline-none collapse-arrow bg-white">
                        <input type="checkbox" className="outline-none" />
                        <div className="collapse-title text-base text-gray-700 font-bold">Kabar Terbaru</div>
                        <div className="collapse-content">
                            <hr className="mb-4" />
                            <div className="relative">
                                <div className="flex flex-col gap-y-2 w-full">
                                    {news.map((newsItem, i) => (
                                        <div className="flex items-start justify-between h-full">
                                            <div className="flex-[1] flex flex-col items-start gap-y-2 relative self-stretch">
                                                <div>
                                                    <div className="bg-[#00AEEF] border-4 border-white w-[17px] h-[17px] rounded-full"></div>
                                                </div>
                                                <div className="w-0.5 bg-gray-200 h-full translate-x-[6px]"></div>
                                            </div>
                                            <div className="flex-[7] pr-8">
                                                <div className="cursor-pointer font-inter">
                                                    <span className="text-xs text-gray-400">{newsItem.created_at_for_humans}</span>
                                                    <div
                                                        className="flex items-start justify-between mt-1 hover:underline"
                                                        onClick={() => {
                                                            toggleOpenedNewsIndex(i);
                                                        }}
                                                    >
                                                        <h3 className="text-sm font-semibold text-[#4A4A4A]">{newsItem.title}</h3>
                                                        <span
                                                            className="pl-6 text-lg text-gray-400"
                                                            dangerouslySetInnerHTML={{
                                                                __html: openedNewsIndex.findIndex((v) => v == i) >= 0 ? "&#129171" : "&#129170",
                                                            }}
                                                        ></span>
                                                    </div>
                                                </div>
                                                <div className={`font-inter transition duration-200 ease-in-out ${openedNewsIndex.findIndex((v) => v == i) >= 0 ? "h-full" : "h-0 invisible"}`}>
                                                    <h4 className="text-sm mt-3 text-[#4A4A4A] italic mb-2">{newsItem.subtitle}</h4>
                                                    <div className="mb-2 text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: newsItem.content }}></div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center">
                                    {newsPagination?.next_page_url ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                loadNews(newsPagination.next_page_url?.toString());
                                            }}
                                            className="cursor-pointer py-3 px-6 font-inter bg-gray-800 text-white text-xs rounded-md mt-5"
                                        >
                                            Load More
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="collapse rounded-lg shadow-sm border outline-none focus:outline-none focus:border-none active:border-none active:outline-none collapse-arrow bg-white">
                        <input type="checkbox" className="outline-none" />
                        <div className="collapse-title text-base text-gray-700 font-bold">Donatur ({StringUtil.formatRupiah(totalDonatur)})</div>
                        <div className="collapse-content">
                            <hr className="mb-4" />
                            <div className="relative">
                                <div className="flex flex-col gap-y-3 px-3 py-4">
                                    {arrDonatur.map((donatur) => (
                                        <div className="font-inter bg-blue-50 rounded-md p-4">
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-semibold text-gray-700">{donatur.fullname}</h4>
                                                <span className="text-xs text-gray-600">{donatur.created_at_for_humans}</span>
                                            </div>
                                            <p className="text-sm text-gray-700 mt-1">
                                                Berdonasi sebesar <b className="text-gray-700">Rp {StringUtil.formatRupiah(donatur.amount)}</b>
                                            </p>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex justify-center">
                                    {donaturPagination?.next_page_url ? (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                loadArrDonatur(donaturPagination.next_page_url?.toString());
                                            }}
                                            className="cursor-pointer py-3 px-6 font-inter bg-gray-800 text-white text-xs rounded-md mt-2"
                                        >
                                            Load More
                                        </button>
                                    ) : (
                                        <></>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="collapse rounded-lg shadow-sm border outline-none focus:outline-none focus:border-none active:border-none active:outline-none collapse-arrow bg-white">
                        <input type="checkbox" className="outline-none" />
                        <div className="collapse-title text-base text-gray-700 font-bold">Profil</div>
                        <div className="collapse-content">
                            <hr className="mb-4" />
                            <div className="relative">
                                <div className="text-[#00AEEF] mt-3 flex items-center gap-x-4">
                                    {settingCompany?.company_logo_url ? (
                                        <img className="w-14 rounded-full" src={settingCompany?.company_logo_url} alt="" />
                                    ) : (
                                        <ContentLoader viewBox="0 0 380 70">
                                            <circle cx="30" cy="30" r="30" />
                                        </ContentLoader>
                                    )}
                                    <div>
                                        <h4 className="font-inter text-[#00AEEF] text-base font-semibold">{settingCompany?.company_name}</h4>
                                        <div className="flex items-center gap-x-1 mt-1.5">
                                            <img className="w-10" src="https://donasipalestina.id/wp-content/plugins/donasiaja/assets/images/check-org2.png" alt="" />
                                            <span className="font-inter italic text-gray-400 text-xs">Verified Organization</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="text-sm mt-7 text-gray-600" dangerouslySetInnerHTML={{ __html: `${settingCompany?.company_description}` }}></div>
                                <div className="mt-3">
                                    <div className="mb-2">
                                        <b className="text-sm font-bold text-gray-800">Email</b>
                                        <p className="text-sm text-gray-600">{settingCompany?.company_email}</p>
                                    </div>
                                    <div className="mb-2">
                                        <b className="text-sm font-bold text-gray-800">No Telp</b>
                                        <p className="text-sm text-gray-600">{settingCompany?.company_phone_number}</p>
                                    </div>
                                    <div className="mb-2">
                                        <b className="text-sm font-bold text-gray-800">Alamat</b>
                                        <p className="text-sm text-gray-600">{settingCompany?.company_address}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="collapse rounded-lg shadow-sm border outline-none focus:outline-none focus:border-none active:border-none active:outline-none collapse-arrow bg-white">
                        <input type="checkbox" className="outline-none" />
                        <div className="collapse-title text-base text-gray-700 font-bold">Produk</div>
                        <div className="collapse-content">
                            <hr className="mb-4" />
                            <div className="relative flex flex-col gap-4">
                                <iframe width="560" height="315" src="https://www.youtube.com/embed/Zf7aWv2PkLg?si=Y2rj_P7I68u0IyN9" title="YouTube video player" frameBorder={"0"} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen className="w-full rounded-lg"></iframe>
                                <img src="/static/tenda-1.jpeg" className="rounded" alt="" />
                                <img src="/static/tenda-2.jpeg" className="rounded" alt="" />
                                <img src="/static/tenda-3.jpeg" className="rounded" alt="" />
                                <img src="/static/tenda-4.jpeg" className="rounded" alt="" />
                                <img src="/static/tenda.jpeg" className="rounded" alt="" />
                            </div>
                        </div>
                    </div>
                    <div className="collapse rounded-lg shadow-sm border outline-none focus:outline-none focus:border-none active:border-none active:outline-none collapse-arrow bg-white">
                        <input type="checkbox" className="outline-none" />
                        <div className="collapse-title text-base text-gray-700 font-bold">Legalitas</div>
                        <div className="collapse-content">
                            <div className="flex flex-col gap-4">
                                <div className="relative flex flex-col border-b pb-5">
                                    <img src="/static/AKTA YAYASAN BALI BESTARI MALIK.png" alt="" />
                                    <a className="btn mt-3" href="/static/AKTA YAYASAN BALI BESTARI MALIK.pdf" target="_blank">
                                        Lihat Akta Legalitas
                                    </a>
                                </div>
                                <div className="relative flex flex-col border-b pb-5">
                                    <img src="/static/bnri.png" alt="" />
                                    <a className="btn mt-3" href="/static/bnri.pdf" target="_blank">
                                        Lihat BNRI
                                    </a>
                                </div>
                                <div className="relative flex flex-col border-b pb-5">
                                    <img src="/static/nib.png" alt="" />
                                    <a className="btn mt-3" href="/static/nib.pdf" target="_blank">
                                        Lihat NIB
                                    </a>
                                </div>
                                <div className="relative flex flex-col border-b pb-5">
                                    <img src="/static/sk-humham.png" alt="" />
                                    <a className="btn mt-3" href="/static/sk-humham.pdf" target="_blank">
                                        Lihat SK HUMHAM
                                    </a>
                                </div>
                                <div className="relative flex flex-col border-b pb-5">
                                    <img src="/static/npwp.png" alt="" />
                                    <a className="btn mt-3" href="/static/npwp.pdf" target="_blank">
                                        Lihat NPWP
                                    </a>
                                </div>
                                <div className="relative flex flex-col border-b pb-5">
                                    <img src="/static/legalitas-vendor-pembuat-tenda.png" alt="" />
                                    <a className="btn mt-3" href="/static/legalitas-vendor-pembuat-tenda.pdf" target="_blank">
                                        Lihat Legalitas Vendor Pembuat Tenda
                                    </a>
                                </div>
                                <div className="relative flex flex-col border-b pb-5">
                                    <img src="/static/compro-glamping.id-Bali-2024.png" alt="" />
                                    <a className="btn mt-3" href="/static/compro-glamping.id-Bali-2024.pdf" target="_blank">
                                        Lihat Info Company Profile Vendor Pembuat Tenda
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </CardComponent>
            <hr />
            <CardComponent>
                <h2 className="font-inter font-semibold text-gray-700">Doa & Pesan bagi Palestina ({StringUtil.formatRupiah(totalMessages)})</h2>
                <div className="flex flex-col gap-y-3 bg-blue-50 p-5 rounded-md mt-5">
                    {arrDonaturMessages.map((donaturMessage) => (
                        <div className="font-inter bg-white border-[1px] border-gray-200 rounded-md p-4">
                            <div className="flex justify-between items-start">
                                <h4 className="text-md font-semibold text-gray-700">{donaturMessage.fullname}</h4>
                                <span className="text-xs text-gray-600">{donaturMessage.created_at_for_humans}</span>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-700 mt-3">{donaturMessage.message}</p>
                        </div>
                    ))}
                    {donaturMessagePagination?.next_page_url ? (
                        <div className="flex justify-center">
                            <button
                                type="button"
                                onClick={() => {
                                    loadArrDonaturMessages(donaturMessagePagination.next_page_url?.toString());
                                }}
                                className="cursor-pointer py-3 px-6 font-inter bg-gray-800 text-white text-xs rounded-md mt-2"
                            >
                                Load More
                            </button>
                        </div>
                    ) : (
                        <></>
                    )}
                </div>
            </CardComponent>

            <div className={`fixed left-2 right-2 md:left-[unset] md:right-[unset] md:w-[525px] -bottom-2 ${!showDonationComponentBottom ? "hidden" : ""}`}>
                <hr />
                <CardComponent>
                    <div className="flex items-center gap-x-2">
                        <button
                            type="button"
                            onClick={() => {
                                setModalShareOpen(true);
                            }}
                            className="flex-[2.9] flex items-center justify-center gap-x-2 border shadow border-[#00AEEF] py-2 rounded-md"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-share-3 text-[#00AEEF]" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z" />
                            </svg>
                            <div className="font-inter flex flex-col text-[#00AEEF] items-start">
                                <b className="text-sm font-semibold">Share</b>
                            </div>
                        </button>
                        <Link to={"/donate"} className="flex items-center justify-center flex-[5] self-stretch rounded-md text-white font-inter font-semibold bg-[#00AEEF] text-base hover:bg-opacity-80 duration-300">
                            Donasi Sekarang
                        </Link>
                    </div>
                </CardComponent>
            </div>
            <br />
            <br />
            <br />
        </div>
    );
}
