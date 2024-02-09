import { SiOpenai } from "react-icons/si";
import ic_launcher from '../assets/ic_launcher.png'

export default function ChatStatusIndicator({ status }) {

    return (
        <div className="flex justify-center">
            <div className="flex flex-row items-center text-orange-300">
                <div className="m-2 animate-spin">
                    <img src={ic_launcher} alt="Interview Prep Assistant" className="rounded-full h-8 w-8 " />

                </div>
                <div>{status}</div>
            </div>
        </div>
    )
}