import { Link } from "react-router-dom";
import CardComponent from "../../components/shared/CardComponent";
import CheckIcon from './../../assets/icons/check.svg'

export default function SuccessIndex() {
    return (
        <div>
            <CardComponent>
                <h1 className="text-center text-2xl font-inter font-semibold text-gray-700">Pembayaran Diverifikasi</h1>
                <img src={CheckIcon} className="mt-4 rounded-full w-1/6 mx-auto" alt="" />
                <p className="text-center font-inter mt-4 text-gray-600">Terima Kasih telah melakukan donasi, semoga donasi anda bisa berkah dan bermanfaat bagi anak anak di Palestina</p>
                <br />
                <br />
                <Link to={'/'} className="py-2 flex items-center justify-center flex-[5] self-stretch rounded-md text-white font-inter font-semibold bg-blue-600 text-base">
                    Kembali ke Beranda
                </Link>
            </CardComponent>
        </div>
    )
}