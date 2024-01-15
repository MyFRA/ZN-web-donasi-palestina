import { useContext, useEffect, useState } from "react"
import { CartContext } from "../../context/CartContext"
import { ProductInterface } from "../../interfaces/ProductInterface"
import Api from "../../utils/Api"
import CardComponent from "../../components/shared/CardComponent"
import Select from 'react-select'
import { ReactSelectOptionInterface } from "../../interfaces/ReactSelectOptionInterface"

export default function CheckoutIndex() {

    /**
    * Contexts
    * 
    */
    const { carts } = useContext(CartContext)

    /**
     * States
     * 
     */
    const [cartProducts, setCartProducts] = useState<Array<ProductInterface>>([])
    const [modalShareOpen, setModalShareOpen] = useState<boolean>(false)
    const [provinces, setProvinces] = useState<Array<ReactSelectOptionInterface>>([])
    const [selectedProvince, setSelectedProvince] = useState<ReactSelectOptionInterface | null>(null)
    const [cities, setCities] = useState<Array<ReactSelectOptionInterface>>([])
    const [selectedCity, setSelectedCity] = useState<ReactSelectOptionInterface | null>(null)
    const [district, setDistrict] = useState<string>('')
    const [village, setVillage] = useState<string>('')
    const [address, setAddress] = useState<string>('')
    const [note, setNote] = useState<string>('')
    const [fullname, setFullname] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [whatsappNumber, setWhatsappNumber] = useState<string>('')
    const [couriers, setCouriers] = useState<Array<ReactSelectOptionInterface>>([])
    const [selectedCourier, setSelectedCourier] = useState<ReactSelectOptionInterface | null>(null)
    const [selectedCost, setSelectedCost] = useState<ReactSelectOptionInterface | null>(null)
    const [costs, setCosts] = useState<Array<ReactSelectOptionInterface>>([])

    /**
     * Func
     * 
     */
    const loadCartProducts = () => {
        const tempCartProducts: Array<ProductInterface> = []

        Promise.all(carts.map(async (cart) => {
            const resp = await Api.get('/products/' + cart.id)

            if (resp.status == 200) {
                const data = resp.data.data
                data.qty = cart.qty

                tempCartProducts.push(data)
            }
        })).then(() => {
            setCartProducts(tempCartProducts)
        })
    }

    const loadProvinces = () => {
        Api.get('/shipping/provinces')
            .then((res) => {
                setProvinces(res.data.data.map((e: any) => ({
                    value: e.province_id,
                    label: e.province,
                })))
            })
    }

    const loadCouriers = () => {
        Api.get('/shipping/courier')
            .then((res) => {
                setCouriers(res.data.data.map((e: string) => ({
                    value: e,
                    label: e.toUpperCase()
                })))
            })
    }

    const loadCosts = () => {
        Api.post('/shipping/costs', {
            destination: selectedCity?.value,
            courier: selectedCourier?.value,
            weight: cartProducts.reduce((prev: number, cur: ProductInterface) => prev = prev + (cur.weight * (cur.qty ? cur.qty : 0)), 0)
        }).then((res) => {
            setCosts(res.data.data.map((e: any) => ({
                value: e.service + ' | ' + 'Rp' + e.cost[0].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' | ' + e.cost[0].etd,
                label: e.service + ' | ' + 'Rp' + e.cost[0].value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' | ' + e.cost[0].etd,
            })))
        })
    }

    const doCheckout = () => {

    }

    useEffect(() => {
        if (selectedCourier && selectedCity) {
            loadCosts()
        }
    }, [selectedCourier, selectedCity])

    useEffect(() => {
        loadCartProducts()
    }, [carts])

    useEffect(() => {
        loadProvinces()
        loadCouriers()
    }, [])

    useEffect(() => {
        if (selectedProvince) {
            Api.get('/shipping/cities?province_id=' + selectedProvince.value)
                .then((res) => {
                    setCities(res.data.data.map((e: any) => ({
                        value: e.city_id,
                        label: e.city_name,
                    })))
                })
        }
    }, [selectedProvince])

    return (
        <div>
            {/* Modal Ongkir */}
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
            {/* End of Modal Ongkir */}

            <CardComponent>
                <div>
                    <h2 className="font-semibold font-inter text-gray-700 text-lg">Keranjang</h2>
                    <hr className="my-3" />
                    {
                        cartProducts.map((cartProduct) => (
                            <div>
                                <div className="flex gap-x-2">
                                    <img src={cartProduct.image} className="w-20 aspect-square h-full object-cover object-center rounded" alt="" />
                                    <div className="px-2 font-inter flex justify-between w-full">
                                        <div>
                                            <h4 className="text-gray-600 text-sm">{cartProduct.name}</h4>
                                            <h5 className="font-semibold text-base mt-1 text-gray-700">{cartProduct.qty} x Rp{cartProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</h5>
                                        </div>
                                        <div>
                                            <h4 className="text-gray-600 text-sm">Total</h4>
                                            <h5 className="font-semibold text-base mt-1 text-gray-700">Rp{(cartProduct.price * (cartProduct.qty ? cartProduct.qty : 0)).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</h5>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-4" />
                            </div>
                        ))
                    }
                </div>
                <div>
                    <div className="mb-3">
                        <label htmlFor="province" className="font-inter text-sm text-gray-800">Provinsi</label>
                        <Select
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: '#C4C4C4',
                                    borderWidth: '1px',
                                    boxShadow: 'none',
                                    backgroundColor: state.isDisabled ? 'transparent' : 'transparent',
                                    '&:hover': {
                                        borderColor: '#C4C4C4',
                                    }
                                }),
                                container: (baseStyles, state) => ({
                                    ...baseStyles,
                                    width: '100%',
                                }),
                                input: (baseStyles, state) => ({
                                    ...baseStyles,
                                    color: '#545454',
                                    fontSize: '12px',
                                    fontWeight: '300',
                                    fontFamily: "'Inter', sans-serif"
                                }),
                                option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    backgroundColor: state.isDisabled ? 'transparent' : 'transparent',
                                    color: '#000',
                                    fontSize: '12px',
                                    fontWeight: state.isDisabled ? '700' : '400',
                                    fontFamily: "'Inter', sans-serif",
                                    borderBottom: state.isDisabled ? '1px solid #C4C4C4;' : '0px',
                                    "&:hover": {
                                        backgroundColor: state.isDisabled ? '#FFF' : "#3B82F6",
                                        color: state.isDisabled ? '#000' : '#FFF'
                                    }
                                }),
                            }}
                            name='province'
                            placeholder='Provinsi'
                            value={selectedProvince}
                            onChange={(val) => { setSelectedProvince(val) }}
                            options={provinces} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="city">Kabupaten</label>
                        <Select
                            styles={{
                                control: (baseStyles, state) => ({
                                    ...baseStyles,
                                    borderColor: '#C4C4C4',
                                    borderWidth: '1px',
                                    boxShadow: 'none',
                                    backgroundColor: state.isDisabled ? 'transparent' : 'transparent',
                                    '&:hover': {
                                        borderColor: '#C4C4C4',
                                    }
                                }),
                                container: (baseStyles, state) => ({
                                    ...baseStyles,
                                    width: '100%',
                                }),
                                input: (baseStyles, state) => ({
                                    ...baseStyles,
                                    color: '#545454',
                                    fontSize: '12px',
                                    fontWeight: '300',
                                    fontFamily: "'Inter', sans-serif"
                                }),
                                option: (baseStyles, state) => ({
                                    ...baseStyles,
                                    backgroundColor: state.isDisabled ? 'transparent' : 'transparent',
                                    color: '#000',
                                    fontSize: '12px',
                                    fontWeight: state.isDisabled ? '700' : '400',
                                    fontFamily: "'Inter', sans-serif",
                                    borderBottom: state.isDisabled ? '1px solid #C4C4C4;' : '0px',
                                    "&:hover": {
                                        backgroundColor: state.isDisabled ? '#FFF' : "#3B82F6",
                                        color: state.isDisabled ? '#000' : '#FFF'
                                    }
                                }),
                            }}
                            name='city'
                            placeholder='Kota / Kabupaten'
                            value={selectedCity}
                            onChange={(val) => { setSelectedCity(val) }}
                            options={cities} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="district">Kecamatan</label>
                        <div>
                            <input type="text" name="district" id="district" value={district} onChange={(e) => {
                                setDistrict(e.target.value)
                            }} className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="Kecamatan" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="village">Desa</label>
                        <div>
                            <input type="text" name="village" id="village" value={village} onChange={(e) => {
                                setVillage(e.target.value)
                            }} className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="Desa" />
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="address">Alamat Lengkap</label>
                        <div>
                            <textarea style={{ height: '120px' }} name="address" id="address" value={address} onChange={(e) => {
                                setAddress(e.target.value)
                            }} className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="Alamat Lengkap"></textarea>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="note">Catatan Pengiriman</label>
                        <div>
                            <textarea style={{ height: '120px' }} name="note" id="note" value={note} onChange={(e) => {
                                setNote(e.target.value)
                            }} className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="Catatan Pengiriman"></textarea>
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
                                borderColor: '#C4C4C4',
                                borderWidth: '1px',
                                boxShadow: 'none',
                                backgroundColor: state.isDisabled ? 'transparent' : 'transparent',
                                '&:hover': {
                                    borderColor: '#C4C4C4',
                                }
                            }),
                            container: (baseStyles, state) => ({
                                ...baseStyles,
                                width: '100%',
                            }),
                            input: (baseStyles, state) => ({
                                ...baseStyles,
                                color: '#545454',
                                fontSize: '12px',
                                fontWeight: '300',
                                fontFamily: "'Inter', sans-serif"
                            }),
                            option: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: state.isDisabled ? 'transparent' : 'transparent',
                                color: '#000',
                                fontSize: '12px',
                                fontWeight: state.isDisabled ? '700' : '400',
                                fontFamily: "'Inter', sans-serif",
                                borderBottom: state.isDisabled ? '1px solid #C4C4C4;' : '0px',
                                "&:hover": {
                                    backgroundColor: state.isDisabled ? '#FFF' : "#3B82F6",
                                    color: state.isDisabled ? '#000' : '#FFF'
                                }
                            }),
                        }}
                        name='courier'
                        placeholder='Kurir'
                        value={selectedCourier}
                        onChange={(val) => { setSelectedCourier(val) }}
                        options={couriers} />
                </div>
                <div className="mb-3">
                    <label htmlFor="cost">Layanan Pengiriman</label>
                    <Select
                        styles={{
                            control: (baseStyles, state) => ({
                                ...baseStyles,
                                borderColor: '#C4C4C4',
                                borderWidth: '1px',
                                boxShadow: 'none',
                                backgroundColor: state.isDisabled ? 'transparent' : 'transparent',
                                '&:hover': {
                                    borderColor: '#C4C4C4',
                                }
                            }),
                            container: (baseStyles, state) => ({
                                ...baseStyles,
                                width: '100%',
                            }),
                            input: (baseStyles, state) => ({
                                ...baseStyles,
                                color: '#545454',
                                fontSize: '12px',
                                fontWeight: '300',
                                fontFamily: "'Inter', sans-serif"
                            }),
                            option: (baseStyles, state) => ({
                                ...baseStyles,
                                backgroundColor: state.isDisabled ? 'transparent' : 'transparent',
                                color: '#000',
                                fontSize: '12px',
                                fontWeight: state.isDisabled ? '700' : '400',
                                fontFamily: "'Inter', sans-serif",
                                borderBottom: state.isDisabled ? '1px solid #C4C4C4;' : '0px',
                                "&:hover": {
                                    backgroundColor: state.isDisabled ? '#FFF' : "#3B82F6",
                                    color: state.isDisabled ? '#000' : '#FFF'
                                }
                            }),
                        }}
                        name='cost'
                        placeholder='Layanan Pengiriman'
                        value={selectedCost}
                        onChange={(val) => { setSelectedCost(val) }}
                        options={costs} />
                </div>
                <hr className="my-3" />
                <div>
                    <div className="mb-3">
                        <label htmlFor="fullname">Nama Lengkap</label>
                        <input type="text" name="fullname" id="fullname" className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="Nama Lengkap" value={fullname} onChange={(e) => {
                            setFullname(e.target.value)
                        }} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="whatsapp_number">No Whatsapp atau Handphone</label>
                        <input type="text" name="whatsapp_number" id="whatsapp_number" value={whatsappNumber} onChange={(e) => {
                            setWhatsappNumber(e.target.value)
                        }} className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="No Whatsapp atau Handphone" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email">Email</label>
                        <input type="text" name="email" id="email" value={email} onChange={(e) => {
                            setEmail(e.target.value)
                        }} className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="Email" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="message">Pesan / Doa</label>
                        <div>
                            <textarea style={{ height: '120px' }} name="message" id="message" value={message} onChange={(e) => {
                                setMessage(e.target.value)
                            }} className="border-[0.5px] border-gray-300 rounded w-full px-4 text-sm focus:outline-blue-400 font-inter py-3" placeholder="Pesan / Doa (Opsional)"></textarea>
                        </div>
                    </div>
                </div>
                <hr className="my-3" />
                <div>
                    <div className="flex items-center mb-1 justify-between font-inter">
                        <h3 className="text-gray-800">Sub Total</h3>
                        <h3 className="font-semibold text-gray-800">Rp{cartProducts.reduce((prev: number, cur: ProductInterface) => prev = prev + (cur.price * (cur.qty ? cur.qty : 0)), 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</h3>
                    </div>
                    <div className="flex items-center mb-1 justify-between font-inter">
                        <h3 className="text-gray-800">Ongkos Kirim</h3>
                        <h3 className="font-semibold text-gray-800">
                            {
                                selectedCost ?
                                    selectedCost.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : '-'
                            }
                        </h3>
                    </div>
                    <div className="flex items-center mb-1 justify-between font-inter">
                        <h3 className="text-gray-800 text-lg font-semibold">Total</h3>
                        <h3 className="font-semibold text-lg text-gray-800">Rp{(cartProducts.reduce((prev: number, cur: ProductInterface) => prev = prev + (cur.price * (cur.qty ? cur.qty : 0)), 0) +
                            (
                                parseInt(selectedCost ? selectedCost.value.toString() : '0')
                            )).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</h3>
                    </div>
                </div>
                <hr className="my-5" />
                <div>
                    <button type="button" onClick={doCheckout} className="flex w-full items-center justify-center py-3 flex-[5] self-stretch rounded-md text-white font-inter font-semibold bg-blue-600 text-base">
                        Beli Rp{(cartProducts.reduce((prev: number, cur: ProductInterface) => prev = prev + (cur.price * (cur.qty ? cur.qty : 0)), 0) +
                            (
                                parseInt(selectedCost ? selectedCost.value.toString() : '0')
                            )).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    </button>
                </div>
            </CardComponent>
        </div>
    )
}