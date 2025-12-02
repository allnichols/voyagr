"use client";
import { useSearchParams } from "next/navigation"
export default function TopBar() {
const searchParams = useSearchParams().get('destination');
    
        return (
            <div className="flex p-2 border-b-gray-100">
                {searchParams ? <p className="text-xl font-semibold">Trip to {searchParams}</p> : null}
            </div>
        )

}