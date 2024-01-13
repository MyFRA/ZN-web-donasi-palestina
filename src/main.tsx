import React from 'react'
import ReactDOM from 'react-dom/client'
import {
    createBrowserRouter,
    RouterProvider,
} from "react-router-dom";
import './index.css'
import HomeIndex from './pages/home/HomeIndex';
import 'remixicon/fonts/remixicon.css'

const router = createBrowserRouter([
    {
        path: "/",
        element: <HomeIndex />,
    },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>,
)
