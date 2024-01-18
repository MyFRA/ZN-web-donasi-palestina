import { useContext, useEffect, useState } from "react";
import CardComponent from "../../components/shared/CardComponent";
import Switch from "react-switch";
import Api from "../../utils/Api";
import toast, { Toaster } from 'react-hot-toast';
import { AxiosError } from "axios";
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import { CartContext } from "../../context/CartContext";
import { LoadingContext } from "../../context/LoadingContext";
import { ProductInterface } from "../../interfaces/ProductInterface";
import { useNavigate } from "react-router-dom";

type AvailableDonationType = {
    description: string,
    id: number,
    short_description: string,
    title: string,
    value: string
}

declare global {
    interface Window {
        snap: any;
    }
}

export default function DonationIndex() {

    /**
     * Hooks
     * 
     */
    const navigate = useNavigate()

    /**
     * Context
     * 
     */
    const { addToCart } = useContext(CartContext)
    const { loading, setLoadingContext } = useContext(LoadingContext)

    /**
     * Main States
     * 
     */
    const [selectedTabs, setSelectedTabs] = useState<number>(0)
    const [checkedHideName, setCheckedHideName] = useState<boolean>(false)
    const [selectedDonation, setSelectedDonation] = useState<AvailableDonationType | null>(null)
    const [nominalLainnya, setNominalLainnya] = useState<number | string>('')
    const [availableDonations, setAvailableDonations] = useState<Array<AvailableDonationType>>([])
    const [fullname, setFullname] = useState<string>('')
    const [whatsappNumber, setWhatsappNumber] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [products, setProducts] = useState<Array<ProductInterface>>([])
    const [settingWebDonation, setSettingWebDonation] = useState<SettingWebDonationInterface | null>(null)

    const handleChangeHideName = () => {
        setCheckedHideName(!checkedHideName)
    }

    const loadAvailableDonations = () => {
        Api.get('/available-donations')
            .then((res) => {
                setAvailableDonations(res.data.data)
            })
    }

    const loadProducts = () => {
        Api.get('/products')
            .then((res) => {
                setProducts(res.data.data)
            })
    }

    const loadSettingWebDonations = () => {
        Api.get('/web-donations')
            .then((res) => {
                setSettingWebDonation(res.data.data)
            })
    }

    useEffect(() => {
        loadAvailableDonations()
        loadProducts()
        loadSettingWebDonations()
    }, [])

    const doDonate = () => {
        Api.post('/donate', {
            donation_id: selectedDonation?.id,
            fullname: fullname,
            is_fullname_hidden: checkedHideName,
            whatsapp_number: whatsappNumber,
            email: email,
            message: message,
            custom_value: nominalLainnya
        }).then((res) => {
            window.snap.pay(res.data.token, {
                onSuccess: function (result: any) {
                    navigate('/success')
                }
            });
        }).catch((error) => {
            const err = error as AxiosError
            const errResponseMessage: any = err.response?.data

            toast.error(errResponseMessage.error, { position: 'top-right' })
        })
    }

    return (
        <div>
            <Toaster />
            <CardComponent>
                <div className="flex items-start gap-x-6">
                    <img src={settingWebDonation?.thumbnail} alt="" className="w-4/12 rounded-md shadow-md" />
                    <div>
                        <span className="font-inter text-gray-400 text-xs">Anda akan berdonasi dalam program:</span>
                        <h2 className="font-inter text-gray-800 mt-1 text-sm font-semibold">{settingWebDonation?.title}</h2>
                    </div>
                </div>
                <hr className="mt-6 mb-4" />
                <Tabs onSelect={(index) => setSelectedTabs(index)}>
                    <TabList className={'flex justify-between border-b-[1px] border-gray-400'}>
                        <Tab><span className={`px-2 py-1 block font-inter text-sm text-blue-500 ${selectedTabs == 0 ? 'text-gray-500 font-semibold' : ''}`}>Donasi Paket Bantuan</span></Tab>
                        <Tab><span className={`px-2 py-1 block font-inter text-sm text-blue-500 ${selectedTabs == 1 ? 'text-gray-500 font-semibold' : ''}`}>Donasi Dengan Membeli Produk</span></Tab>
                    </TabList>

                    <TabPanel>
                        <div>
                            <div>
                                <p className="font-inter text-gray-800 mb-5 text-center font-semibold mt-5">Donasi Paket Bantuan</p>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {
                                        availableDonations.map((availableDonation, i) => (
                                            <button key={i} onClick={() => {
                                                setSelectedDonation(availableDonation)
                                            }} className={` rounded-xl cursor-pointer flex flex-col items-center justify-center p-5 ${selectedDonation?.value == availableDonation.value ? 'border-[2.5px] border-blue-600' : ''}`} style={{ boxShadow: '0 4px 25px 0 rgba(0,0,0,.1)' }}>
                                                <h4 className={`font-inter ${selectedDonation?.value == availableDonation.value ? 'text-blue-600 font-semibold' : 'text-gray-700'}`}>{availableDonation.title}</h4>
                                                <span className="text-xs font-inter mt-1 text-gray-500 text-center">{availableDonation.short_description}</span>
                                            </button>
                                        ))
                                    }
                                </div>
                            </div>
                            <div>
                                {
                                    availableDonations.map((availableDonation) => (
                                        <p className={`font-inter text-sm text-gray-500 py-4 ${availableDonation.value != selectedDonation?.value ? 'hidden' : ''}`}>{availableDonation.description}</p>
                                    ))
                                }
                            </div>

                            {
                                selectedDonation?.value == 'lainnya' ?
                                    <div className="relative">
                                        <input type="text" name="custom_price" className="text-right w-full mt-4 border-[0.5px] p-3 rounded focus:outline-blue-400 text-gray-700 text-xl font-semibold placeholder:font-normal placeholder:text-lg placeholder:text-gray-400 font-inter border-gray-300" placeholder="Masukan Nominal" id="custom_price" value={!nominalLainnya ? '' : 'Rp ' + nominalLainnya.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')} onChange={(e) => {
                                            setNominalLainnya(parseInt(e.target.value.replaceAll('.', '').replace('Rp ', '')))
                                        }} />
                                        <h4 className="absolute top-1/2 translate-y-[-6px] text-lg left-2.5 font-inter text-blue-300 font-semibold">Rp</h4>
                                    </div> : <></>
                            }
                            <hr className="my-4" />
                            {/* <div className="mt-6 bg-blue-50 p-5 flex justify-between items-center">
                    <div className="flex gap-x-4 items-center">
                        <img className="w-20 border-[1px] border-blue-600 rounded" src="https://donasipalestina.id/wp-content/plugins/donasiaja/assets/images/bank/bank.png" alt="" />
                        <p className="font-inter text-sm text-gray-800">Metode Pembayaran</p>
                    </div>
                    <div>
                        <button className="bg-white rounded font-inter text-sm text-blue-500 border-[1px] border-blue-600 py-1.5 px-6 flex justify-center gap-x-0.5 items-center">
                            Pilih
                            <i className="ri-arrow-down-s-fill"></i>
                        </button>
                    </div>
                </div> */}
                            {
                                !checkedHideName ?
                                    <div className="mt-6">
                                        <input type="text" name="fullname" id="fullname" className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="Nama Lengkap" value={fullname} onChange={(e) => {
                                            setFullname(e.target.value)
                                        }} />
                                    </div> : <></>
                            }
                            <div className="flex justify-between items-center my-4">
                                <p className="font-inter text-sm text-gray-600">Sembunyikan nama saya (Dermawan)</p>
                                <Switch onChange={handleChangeHideName} uncheckedIcon={false} checkedIcon={false} onColor="#2563EB" checked={checkedHideName} />
                            </div>
                            <div className="mt-4">
                                <input type="text" name="whatsapp_number" id="whatsapp_number" value={whatsappNumber} onChange={(e) => {
                                    setWhatsappNumber(e.target.value)
                                }} className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="No Whatsapp atau Handphone (Opsional)" />
                            </div>
                            <div className="mt-4">
                                <input type="text" name="email" id="email" value={email} onChange={(e) => {
                                    setEmail(e.target.value)
                                }} className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="Email (Opsional)" />
                            </div>
                            <div className="mt-4">
                                <textarea name="message" id="message" value={message} onChange={(e) => {
                                    setMessage(e.target.value)
                                }} className="h-[120px] border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="Pesan atau Doa (Opsional)"></textarea>
                            </div>
                            <hr className="my-3" />
                            <div className="flex items-center gap-x-2">
                                <button type="button" onClick={doDonate} className="flex items-center justify-center py-3 flex-[5] self-stretch rounded-md text-white font-inter font-semibold bg-blue-600 text-base">
                                    Donasi {selectedDonation != null ? selectedDonation?.value != 'lainnya' ? 'Rp ' + selectedDonation?.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : 'Rp ' + nominalLainnya.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''}
                                </button>
                            </div>
                        </div>
                    </TabPanel>
                    <TabPanel>
                        <div>
                            <p className="font-inter text-gray-800 text-center font-semibold mt-5">Donasi Dengan Membeli Produk</p>
                            <p className="text-center font-inter text-gray-500 text-sm mt-2">Setiap hasil dari penjualan langsung didonasikan untuk mendukung kebutuhan mendesak dan membangun masa depan yang lebih baik bagi Palestina. Bersama kita bisa membuat perbedaan</p>
                        </div>
                        <hr className="my-5" />
                        <div>
                            <div className="grid grid-cols-2 gap-4">
                                {
                                    products.map((product) => (
                                        <div className="shadow-md rounded-b">
                                            <img src={product.image} className="w-full rounded-t aspect-square object-cover object-center" alt="" />
                                            <div className="font-inter p-2.5">
                                                <h4 className="text-gray-700 text-sm">{product.name}</h4>
                                                <h3 className="text-sm font-semibold text-gray-700 mt-0.5">Rp{product.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</h3>
                                                {/* <span className="block text-xs text-gray-500 mt-3">{product.sales} terjual</span> */}

                                                <button type="button" onClick={() => {
                                                    setLoadingContext(true)
                                                    addToCart(product.id, () => {
                                                        toast.success('Produk berhasil ditambahkan ke keranjang')
                                                        setLoadingContext(false)
                                                    }, () => {
                                                        toast.error('Produk tidak bisa ditambahkan ke keranjang')
                                                        setLoadingContext(false)
                                                    })
                                                }} className="bg-blue-500 text-white w-full rounded font-inter font-semibold flex justify-center items-center py-1.5 mt-3 gap-x-1">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-shopping-cart text-white" width="20" height="20" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M6 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 19m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0" /><path d="M17 17h-11v-14h-2" /><path d="M6 5l14 1l-1 7h-13" /></svg>
                                                    Add to cart
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                    </TabPanel>
                </Tabs>

            </CardComponent>
        </div>
    )
}