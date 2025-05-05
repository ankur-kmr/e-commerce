import Image from "next/image";
import loader from "@/assets/loader.gif";

export default function LoadingPage() {
    return (
        <div className="flex-center h-screen w-screen">
            <Image src={loader} alt="Loading..." width={150} height={150} />
        </div>
    );
}

