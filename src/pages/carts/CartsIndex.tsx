import { useContext, useEffect, useState } from "react"
import { ProductInterface } from "../../interfaces/ProductInterface"
import { CartContext } from "../../context/CartContext"
import { CartInterface } from "../../interfaces/CartInterface"
import Api from "../../utils/Api"
import CardComponent from "../../components/shared/CardComponent"

export default function CartsIndex() {

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


    useEffect(() => {
        loadCartProducts()
    }, [])

    return (
        <div>
            <CardComponent>
                <div>
                    <h2 className="font-semibold font-inter text-gray-700 text-lg">Keranjang</h2>
                    <hr className="my-3" />
                    {
                        cartProducts.map((cartProduct) => (
                            <div>
                                <div className="flex gap-x-2">
                                    <img src={cartProduct.image} className="w-20 aspect-square h-full object-cover object-center rounded" alt="" />
                                    <div className="px-2 font-inter">
                                        <h4 className="text-gray-600 text-sm">{cartProduct.name}</h4>
                                        <h5 className="font-semibold text-sm text-gray-700">Rp {cartProduct.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}</h5>
                                        <div className="flex items-center gap-x-1 mt-2">
                                            <div className="flex items-center border rounded py-1 px-1">
                                                <button>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-minus text-blue-500" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M5 12l14 0" /></svg>
                                                </button>
                                                <span className="text-sm font-semibold text-gray-700 px-2.5">{cartProduct.qty}</span>
                                                <button>
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-plus text-blue-500" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M12 5l0 14" /><path d="M5 12l14 0" /></svg>
                                                </button>
                                            </div>
                                            <div>
                                                <button className="bg-red-500 p-1.5 rounded">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-trash text-white" width="18" height="18" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M4 7l16 0" /><path d="M10 11l0 6" /><path d="M14 11l0 6" /><path d="M5 7l1 12a2 2 0 0 0 2 2h8a2 2 0 0 0 2 -2l1 -12" /><path d="M9 7v-3a1 1 0 0 1 1 -1h4a1 1 0 0 1 1 1v3" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <hr className="my-4" />
                            </div>
                        ))
                    }
                </div>
            </CardComponent>
            <CardComponent>
                <div className="font-inter flex justify-between items-center">
                    <div>
                        <span className="text-sm text-gray-600">Total</span>
                        <h4 className="font-semibold text-gray-700">Rp122.500</h4>
                    </div>
                    <button className="bg-blue-500 text-white font-semibold rounded py-1.5 px-3">Checkout</button>
                </div>
            </CardComponent>
        </div>
    )
}