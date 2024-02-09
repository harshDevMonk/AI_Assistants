import { useRecoilValue } from "recoil"
import { routeTitleState } from "../atoms"

export default function Header({ onNewChat }) {
    const assistantName = useRecoilValue(routeTitleState)
    return (
        <div className="flex flex-row p-4 bg-slate-500 rounded-xl my-4 m-2">
            <p className="text-3xl text-slate-200 font-semibold grow">{assistantName}</p>
            <button
                className="bg-orange-400 text-white font-bold py-2 px-4 rounded"
                onClick={onNewChat}
            >New chat</button>
        </div>
    )
}