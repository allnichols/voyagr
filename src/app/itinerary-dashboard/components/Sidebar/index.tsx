"use client"
import Trips from "./Trips";

export default function Sidebar() {
   
    return (
        <div className="drawer bg-base-100 w-[450px] md:drawer-open shadow-lg">
            <input id="my-drawer-2" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content ">
                {/* Page content here */}
                <label htmlFor="my-drawer-2" className="btn btn-primary drawer-button md:hidden">
                    Open drawer
                </label>
            </div>
            <div className="drawer-side p-6 ">
                <label htmlFor="my-drawer-2" aria-label="close sidebar" className="drawer-overlay"></label>
                <h2 className="text-2xl font-bold mb-4">Voyagr</h2>
                <div className="">

                </div>
                <div className="divider w-[100%]"></div>

                <Trips />

            </div>
        </div>
    )
}