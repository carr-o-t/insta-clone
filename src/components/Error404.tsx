import { ReactComponent as PageNotFound } from '../assets/svgs/error404.svg'

export default function Error404() {
    return (
        <div className="h-[calc(100vh_-_49px)] flex justify-center items-center p-4">
            <div className="flex flex-col gap-20">
                <h2 className="text-center font-mono font-bold text-xl">Page Not Found :(</h2>
                <PageNotFound className="h-60 w-auto" />
            </div>
        </div>
    )
}