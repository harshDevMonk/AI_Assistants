import Markdown from 'react-markdown'
import { SiOpenai } from "react-icons/si";
import remarkGfm from "remark-gfm";
import ic_launcher from '../assets/ic_launcher.png'
import { useRecoilValue } from 'recoil';
import { routeTitleState } from '../atoms';

export default function ChatMessage({ message, role }) {

    const assistantName = useRecoilValue(routeTitleState)
    const roleIcon = role === "user"
        ? <div className="rounded-full h-8 w-8 bg-slate-600 flex items-center justify-center font-semibold text-slate-300 shrink-0">Y</div>
        : <div className="rounded-full h-8 w-8 bg-orange-600 flex items-center justify-center font-semibold text-slate-50 shrink-0">
            <img src={ic_launcher} alt={assistantName} className="rounded-full h-8 w-8" />
        </div>

    const roleName = role === "user"
        ? "You"
        : assistantName

    return (
        <div className="flex flex-row mx-2 my-4">
            {roleIcon}
            <div className="p-1 ml-2">
                <div className="flex-col">
                    <p className="font-semibold text-orange-400">{roleName}</p>
                    <Markdown
                        className="text-black-500 markdown"
                        remarkPlugins={[remarkGfm]}
                    >
                        {message}
                    </Markdown>
                </div>
            </div>
        </div>
    )
}