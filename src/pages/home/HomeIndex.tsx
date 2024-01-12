export default function HomeIndex() {
    return (
        <div className="bg-[#EDF0F5] h-screen py-4">

            <div className="mx-auto shadow-xl w-[525px]">
                <div>
                    <img src="https://donasipalestina.id/wp-content/uploads/2021/05/Banner-Bantu-Gaza-Kembali-Bangkit-11.jpg" className="w-full" alt="" />
                    <div className="p-4 bg-white rounded-b-md">
                        <h1 className="font-inter text-gray-800 text-xl font-semibold">BANTU PALESTINA BANGKIT</h1>
                        <span className="flex items-center mt-3 gap-x-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" className="text-gray-300 icon icon-tabler icon-tabler-map-pin" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none" /><path d="M9 11a3 3 0 1 0 6 0a3 3 0 0 0 -6 0" /><path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z" /></svg>
                            <span className="text-gray-400 text-sm font-inter">Gaza, Palestina</span>
                        </span>
                        <div>
                            <span>
                                <h3>Rp 215.663.240</h3>
                                <p>dan masih terus dikumpulkan</p>
                            </span>
                            <div>
                                <div className="bg-gray-300 rounded-md h-2">
                                    <div className="bg-green-600 w-[60%] h-full"></div>
                                </div>
                                <div>
                                    <span>
                                        <b>2196</b> donatur
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}