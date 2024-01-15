import { createContext, useState } from "react"
import Api from "../utils/Api"
import { CartInterface } from "../interfaces/CartInterface"

interface CartContextInterface {
    carts: Array<CartInterface>
    reloadCarts: (cb?: Function) => void
    addToCart: (id: number, successCb: () => void, errCb: () => void) => void
}

export const CartContext = createContext<CartContextInterface>({ carts: [], reloadCarts: (cb?: Function) => { }, addToCart: (id: number, successCb: () => void, errCb: () => void) => { } })


const CartContextProvider = ({ children }: { children: React.ReactNode }) => {
    const [carts, setCarts] = useState<Array<CartInterface>>([])

    const reloadCarts = (cb?: Function) => {
        const storageCarts = localStorage.getItem('carts')
        if (!storageCarts) {
            setCarts([])
            localStorage.setItem('carts', JSON.stringify([]))

            if (cb) {
                cb()
            }
        } else if (!Array.isArray(JSON.parse(storageCarts))) {
            setCarts([])
            localStorage.setItem('carts', JSON.stringify([]))

            if (cb) {
                cb()
            }
        } else {
            const cartsTemp = JSON.parse(storageCarts)
            const fixedCartsTemp: Array<CartInterface> = []

            Promise.all(cartsTemp.map(async (cartTemp: CartInterface) => {
                const resp = await Api.get('/products/' + cartTemp.id)

                if (resp.status == 200) {
                    fixedCartsTemp.push({
                        id: cartTemp.id,
                        qty: cartTemp.qty,
                    })
                }
            })).then(() => {
                localStorage.setItem('carts', JSON.stringify(fixedCartsTemp))
                setCarts(fixedCartsTemp)

                if (cb) {
                    cb()
                }
            })

        }
    }

    const addToCart = (id: number, successCb: () => void, errCb: () => void) => {
        Api.get('/products/' + id)
            .then(() => {
                let cartsClone = [...carts]
                if (cartsClone.findIndex((val) => val.id == id) >= 0) {
                    cartsClone[cartsClone.findIndex((val) => val.id == id)].qty = cartsClone[cartsClone.findIndex((val) => val.id == id)].qty + 1
                } else {
                    cartsClone.push({
                        id: id,
                        qty: 1
                    })
                }

                localStorage.setItem('carts', JSON.stringify(cartsClone))
                reloadCarts()
                successCb()
            }).catch(() => {
                errCb()
            })
    }

    return (
        <CartContext.Provider value={{ carts, reloadCarts, addToCart }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartContextProvider