import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import CardComponent from "../../components/shared/CardComponent";
import Api from "../../utils/Api";
import { StringUtil } from "../../utils/StringUtil";
import { SettingCompanyInterface } from "../../interfaces/SettingCompanyInterface";

export default function HomeIndex() {

    const [selectedTabs, setSelectedTabs] = useState<number>(0)
    const [tab1Expand, setTab1Expand] = useState<boolean>(false)
    const [openedNews, setOpenedNews] = useState<Array<number>>([])
    const [modalShareOpen, setModalShareOpen] = useState<boolean>(false)
    const [offsetY, setOffsetY] = useState<number>(0)
    const [showDonationComponentBottom, setShowDonationComponentBottom] = useState(false)
    const [amountDonation, setAmountDonation] = useState(0)
    const [amountDonatur, setAmountDonatur] = useState(0)
    const [settingCompany, setSettingCompany] = useState<SettingCompanyInterface | null>(null)

    const loadSettingCompany = () => {
        Api.get('/setting-company')
            .then((res) => {
                setSettingCompany(res.data.data)
            })
    }

    const toggleOpenedNews = (numParram: number) => {
        const copyArr = [...openedNews]

        if (openedNews.indexOf(numParram) >= 0) {
            setOpenedNews(copyArr.filter((num) => num != numParram))
        } else {
            copyArr.push(numParram)
            setOpenedNews(copyArr)
        }
    }

    const onScroll = () => setOffsetY(window.scrollY);

    const loadDonationCollected = () => {
        Api.get('/recap-donation/donation-collected')
            .then((res) => {
                setAmountDonation(res.data.data.amount_donation)
                setAmountDonatur(res.data.data.amount_donatur)
            })
    }

    useEffect(() => {
        window.removeEventListener('scroll', onScroll);
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    useEffect(() => {
        loadDonationCollected()
        loadSettingCompany()
    }, [])

    useEffect(() => {
        if (offsetY >= 528) {
            setShowDonationComponentBottom(true)
        } else {
            setShowDonationComponentBottom(false)
        }
    }, [scrollY])

    return (

        <div>
            {/* Modal Share */}
            <main className={`antialiased bg-[rgba(0, 0, 0, 0.4)] text-gray-900 font-sans overflow-x-hidden fixed w-full top-0 z-50 ${modalShareOpen ? '' : 'hidden'}`}>
                <div className="relative px-4 min-h-screen md:flex md:items-center md:justify-center flex justify-center">
                    <div className="bg-black opacity-25 w-full h-full fixed z-10 inset-0"></div>
                    <div className="bg-white rounded-lg w-3/12 p-5 fixed inset-x-0 bottom-0 z-50 mb-4 mx-4 top-[50%] left-[49%] -translate-x-2/4 -translate-y-1/2 h-fit">
                        <div className="md:flex items-center">
                            <div className="mt-4 md:mt-0 text-center md:text-left">
                                <p className="font-bold">Share</p>
                                <div className="flex items-center gap-x-2 mt-1">
                                    <button className="flex bg-gray-100 hover:bg-gray-300 rounded-md py-1.5 gap-x-1 px-3 font-inter text-sm items-center">
                                        <span className="text-xl">
                                            <i className="ri-file-copy-line"></i>
                                        </span>
                                        <span className="text-gray-600 translate-y-[-2px] mt-1">Salin Link</span>
                                    </button>
                                    <button className="flex bg-gray-100 hover:bg-green-500 hover:text-white text-gray-600 rounded-md py-1.5 gap-x-1 px-3 font-inter text-sm items-center">
                                        <span className="text-xl">
                                            <i className="ri-whatsapp-line"></i>
                                        </span>
                                        <span className="translate-y-[-2px] mt-1">Whatsapp</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="text-center md:text-right mt-4 md:flex md:justify-end">
                            <button type="button" onClick={() => {
                                setModalShareOpen(false)
                            }} className="block w-full md:inline-block md:w-auto px-4 py-3 md:py-2 bg-gray-200 rounded-lg font-semibold text-sm mt-4
          md:mt-0 md:order-1">Tutup</button>
                        </div>
                    </div>
                </div>
            </main>
            {/* End of Modal Share */}

            <img src="https://donasipalestina.id/wp-content/uploads/2021/05/Banner-Bantu-Gaza-Kembali-Bangkit-11.jpg" className="w-full rounded-t-md" alt="" />
            <div className="p-5 bg-white rounded-b-md shadow-lg">
                <h1 className="font-inter text-gray-800 text-xl font-semibold">BANTU PALESTINA BANGKIT</h1>
                <span className="flex items-center mt-3 gap-x-1.5">
                    <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-300 icon icon-tabler icon-tabler-map-pin" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" /></svg>
                    <span className="text-gray-400 text-xs font-inter">Gaza, Palestina</span>
                </span>
                <div className="mt-3">
                    <span className="flex items-center gap-x-1.5">
                        <h3 className="font-inter text-gray-600 text-lg font-semibold">Rp {StringUtil.formatRupiah(amountDonation)}</h3>
                        <p className="font-inter text-gray-600 text-xs">dan masih terus dikumpulkan</p>
                    </span>
                    <div className="mt-1.5">
                        <div className="bg-gray-300 rounded-md h-3">
                            <div className="bg-gradient-to-r rounded-md from-green-600 to-green-200 w-[5%] h-full"></div>
                        </div>
                        <div className="mt-2.5">
                            <span className="flex items-center gap-x-1 font-inter text-gray-600">
                                <b className="text-xs">{StringUtil.formatRupiah(amountDonatur)}</b> <span className="text-xs">Donatur</span>
                            </span>
                        </div>
                    </div>
                </div>
                <div className="mt-6">
                    <Link to={'/donate'} className="block bg-blue-600 shadow-md w-full rounded-md text-center text-white font-inter font-semibold py-2">Donasi Sekarang!</Link>
                </div>
            </div>
            <br />
            <CardComponent>
                <h3 className="font-inter text-lg font-semibold text-gray-800">Penggalang Dana</h3>
                <Link to={'/'} className="mt-4 flex items-center gap-x-6">
                    <img className="w-16 rounded-full" src={settingCompany?.company_logo_url} alt="" />
                    <div>
                        <h4 className="font-inter text-blue-400 text-lg">{settingCompany?.company_name}</h4>
                        <div className="flex items-center gap-x-2 mt-1">
                            <img className="w-10" src="https://donasipalestina.id/wp-content/plugins/donasiaja/assets/images/check-org2.png" alt="" />
                            <span className="font-inter italic text-gray-400 text-xs">Verified Organization</span>
                        </div>
                    </div>
                </Link>
            </CardComponent>
            <CardComponent>
                <Tabs onSelect={(index) => setSelectedTabs(index)}>
                    <TabList>
                        <Tab><span className={`px-2 py-3 font-inter text-sm text-blue-500 ${selectedTabs == 0 ? 'text-gray-500 font-semibold' : ''}`}>Keterangan</span></Tab>
                        <Tab><span className={`px-2 py-3 font-inter text-sm text-blue-500 ${selectedTabs == 1 ? 'text-gray-500 font-semibold' : ''}`}>Kabar Terbaru</span></Tab>
                        <Tab><span className={`px-2 py-3 font-inter text-sm text-blue-500 ${selectedTabs == 2 ? 'text-gray-500 font-semibold' : ''}`}>Donatur</span></Tab>
                    </TabList>

                    <TabPanel>
                        <div className="font-inter">
                            <h2 className="font-semibold text-gray-700 mt-4 mb-4">75 Tahun Hidup Di Bawah Penjajahan, Palestina Semakin Dekat dengan Kemenangan</h2>
                            <div className="font-inter text-sm text-gray-700">
                                <div className={`${tab1Expand ? '' : 'max-h-16 overflow-hidden'}`}>
                                    <p className="mb-3">Seolah ditutup dari fakta yang ada, kekejaman yang dialami oleh saudara-saudara kita di Palestina jauh lebih parah dari yang terpampang di media.</p>
                                    <p className="mb-3">Rumah, bangunan dan tempat ibadah di hancurkan, anak-anak sekolah diserang, bahkan Masjid Al Aqsa, masjid suci umat muslim pun turut serta dinodai!</p>
                                    <img className="mb-4 rounded-md" src="https://donasipalestina.id/wp-content/uploads/2022/02/photo_2022-02-16_11-51-13.jpg" alt="" />
                                    <p className="mb-3">Tidak hanya fisik bangunan saja, namun juga manusia di dalamnya. Berbeda dengan bangunan yang dapat disusun ulang kembali, <b>mereka yang terluka dan kehilangan bagian tubuhnya hanya dapat berharap beradaptasi dengan cepat</b> sehingga dapat melanjutkan kehidupannya lebih baik.</p>
                                    <p className="mb-3">Perang antara Palestina dan Israel terjadi sejak hari Sabtu (07/10). Hingga hari senin setidaknya lebih dari 400 korban meninggal dan 2000 orang luka-luka.</p>
                                    <img className="mb-4 rounded-md" src="https://donasipalestina.id/wp-content/uploads/2021/05/photo_2021-05-22_19-36-58.jpg" alt="" />
                                    <p className="mb-3">Aman Palestin berkomitmen untuk membantu Gaza kembali bangkit melalui program-program seperti sewa rumah sementara untuk keluarga yang terdampak, perabotan, renovasi, alat kebersihan, bahan pangan, makanan hangat, pakaian, selimut hingga bantuan medis.</p>
                                    <p className="mb-3">Sobat Palestina sekalian, mari langitkan doa serta tunjukan kepedulian kita untuk sesama saudara nun jauh di sana dengan bersedekah. Semoga Allah karuniakan kemenangan dan ganjaran besar untuk kita sekalian dengan wasilah membantu negeri yang penuh berkah, <b>Palestina!</b></p>
                                </div>
                                <button onClick={() => {
                                    setTab1Expand(!tab1Expand)
                                }} className="bg-blue-50 mt-4 text-blue-600 py-2 hover:bg-blue-100 rounded-md text-center font-inter text-xs w-full flex items-center justify-center gap-x-1">
                                    {tab1Expand ? 'Baca dengan ringkas ' : 'Baca Selengkapnya '}
                                    <span className={`text-lg ${tab1Expand ? '-translate-y-2' : 'translate-y-2'}`} dangerouslySetInnerHTML={{ __html: tab1Expand ? '&#129169' : '&#129171;' }}></span>
                                </button>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="flex flex-col gap-y-2 w-full">
                            {[0].map((num: number) => (
                                <div className="flex items-start justify-between h-full">
                                    <div className="flex-[1] flex flex-col items-start gap-y-2 relative self-stretch">
                                        <div>
                                            <div className="bg-blue-500 border-4 border-white shadow w-[17px] h-[17px] rounded-full"></div>
                                        </div>
                                        <div className="w-0.5 bg-gray-200 h-full translate-x-[6px]"></div>
                                    </div>
                                    <div className="flex-[7] pr-8">
                                        <div className="cursor-pointer font-inter">
                                            <span className="text-xs text-gray-400">October, 27 2023</span>
                                            <div className="flex items-start justify-between mt-1 hover:underline" onClick={() => {
                                                toggleOpenedNews(num)
                                            }}>
                                                <h3 className="text-sm font-semibold text-gray-800">PERANG BADAI AL-AQSA || Penyaluran Tahap 2</h3>
                                                <span className="pl-6 text-lg text-gray-400" dangerouslySetInnerHTML={{ __html: openedNews.indexOf(0) >= 0 ? '&#129171' : '&#129170' }}></span>
                                            </div>
                                        </div>
                                        <div className={`font-inter transition duration-200 ease-in-out ${openedNews.indexOf(0) >= 0 ? 'h-full' : 'h-0 invisible'}`}>
                                            <h4 className="text-sm font-semibold text-gray-700 mb-2">Gaza, 10 & 11 Oktober 2023</h4>
                                            <p className="text-sm text-gray-600 mb-2">Alhamdulillah, Aman Palestin sudah mengirimkan bantuan untuk kondisi genting yang tengah dialami di Gaza. Bantuan sebesar $ 100.000 (Rp 1.500.000.000) sudah dikirim ke kantor perwakilan kami di Gaza dan akan di salurkan untuk para korban serangan dan agresi zionis secara bertahap.</p>
                                            <img className="w-full mb-4 rounded-md" src="https://donasipalestina.id/wp-content/uploads/2023/10/photo_2023-10-25_22-13-13.jpg" alt="" />
                                            <p className="text-sm text-gray-600 mb-2">Jazakumullah Khayran Katsiiran pada dermawan yang senantiasa berdiri tegak di barisan pembebas Palestina!
                                                Semoga menjadi Allah menerima sebagai amal ibadah dan Allah berikan balasan berlipat, Aamiin ya Rabbal'alamiin</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div className="flex flex-col gap-y-3 px-3 py-4">
                            {[0, 1, 2, 3].map((i) => (
                                <div className="font-inter bg-blue-50 rounded-md p-4">
                                    <div className="flex justify-between items-start">
                                        <h4 className="text-sm font-semibold text-gray-700">Dermawan</h4>
                                        <span className="text-xs text-gray-600">2 jam yang lalu</span>
                                    </div>
                                    <p className="text-sm text-gray-700 mt-1">Berdonasi sebesar <b className="text-gray-700">Rp 20.292</b></p>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <button className="cursor-pointer py-3 px-6 font-inter bg-gray-800 text-white text-xs rounded-md mt-2 shadow-md">Load More</button>
                        </div>
                    </TabPanel>
                </Tabs>
            </CardComponent>
            <CardComponent>
                <h2 className="font-inter font-semibold text-gray-700">Doa-doa orang baik (1028)</h2>
                <div className="flex flex-col gap-y-3 bg-blue-50 p-5 rounded-md mt-5">
                    {[0, 1, 2, 3].map((i) => (
                        <div className="font-inter bg-white border-[1px] border-gray-200 rounded-md p-4">
                            <div className="flex justify-between items-start">
                                <h4 className="text-md font-semibold text-gray-700">Dermawan</h4>
                                <span className="text-xs text-gray-600">2 jam yang lalu</span>
                            </div>
                            <p className="text-sm leading-relaxed text-gray-700 mt-3">
                                nothing i wish more than the freedom of Palestine. nothing makes me more sad than hearing all the news about Palestine all of me gon be always in Palestine side
                            </p>
                        </div>
                    ))}
                    <div className="flex justify-center">
                        <button className="cursor-pointer py-3 px-6 font-inter bg-gray-800 text-white text-xs rounded-md mt-2 shadow-md">Load More</button>
                    </div>
                </div>
            </CardComponent>
            <div className={`fixed w-[525px] bottom-0 ${!showDonationComponentBottom ? 'hidden' : ''}`}>
                <CardComponent>
                    <div className="flex items-center gap-x-2">
                        <button type="button" onClick={() => {
                            setModalShareOpen(true)
                        }} className="flex-[2.9] flex items-center justify-center gap-x-2 border-[3px] border-blue-600 py-1 rounded-md">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-share-3 text-blue-600" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M13 4v4c-6.575 1.028 -9.02 6.788 -10 12c-.037 .206 5.384 -5.962 10 -6v4l8 -7l-8 -7z" /></svg>
                            <div className="font-inter flex flex-col text-blue-600 items-start">
                                <b className="text-sm font-semibold">Share</b>
                                <span className="text-[10px]">Bagikan</span>
                            </div>
                        </button>
                        <Link to={'/donate'} className="flex items-center justify-center flex-[5] self-stretch rounded-md text-white font-inter font-semibold bg-blue-600 text-base">
                            Donasi Sekarang
                        </Link>
                    </div>
                </CardComponent>
            </div>
            <br />
            <br />
            <br />
            <br />
        </div>
    )
}