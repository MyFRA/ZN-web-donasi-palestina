import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import HomeIndex from './pages/home/HomeIndex';
import 'remixicon/fonts/remixicon.css'
import DonationIndex from './pages/donation/DonationIndex';
import AppLayout from './layouts/AppLayout';
import CartContextProvider from './context/CartContext';
import LoadingContextProvider from './context/LoadingContext';
import CartsIndex from './pages/carts/CartsIndex';
import CheckoutIndex from './pages/checkout/CheckoutIndex';
import SuccessIndex from './pages/success/SuccessIndex';

const router = createBrowserRouter([
    {
        path: '/',
        element: <AppLayout />,
        children: [
            {
                path: '/',
                element: <HomeIndex />
            },
            {
                path: '/donate',
                element: <DonationIndex />,
            },
            {
                path: '/carts',
                element: <CartsIndex />,
            },
            {
                path: '/checkout',
                element: <CheckoutIndex />,
            },
            {
                path: '/success',
                element: <SuccessIndex />,
            },
        ]
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <CartContextProvider>
            <LoadingContextProvider>
                <RouterProvider router={router} />
            </LoadingContextProvider>
        </CartContextProvider>
    </React.StrictMode>,
)
