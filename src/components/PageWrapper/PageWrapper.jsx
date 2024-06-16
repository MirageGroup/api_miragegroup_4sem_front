import Sidebar from "../Sidebar";

export default function PageWrapper({ children }) {
    return (
        <div className='flex_start lg:flex-row w-full flex-col'>
            <Sidebar></Sidebar>
            <div className='w-full lg:w-[85%] p-4 lg:p-4 '>
                {children}
            </div>
        </div>
    )
}