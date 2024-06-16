export default function PageTitle({ children }) {
    return (
        <div>
            <h1 className="text-4xl font-normal p-4 text-center lg:text-start"> {children}</h1>
            <hr className="border-1 border-[#D9D9D9] w-[100%]"></hr>
        </div>
    )
}