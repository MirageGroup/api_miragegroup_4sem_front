import axios from 'axios'
import { useEffect, useState } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { AiFillEdit } from "react-icons/ai";

export default function UserList() {
    const [data, setData] = useState([])
    

    useEffect(() => {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        axios.get(`${backendUrl}/user/fetchall`).then((response) => {
            setData(response.data)
        })
    }, [])

    const renderTable = () => {
        return data.map((user, index) => {
            const color = index % 2 === 0 ? 'bg-slate-500 text-white' : 'bg-yellow-300 text-black'
            return (
                <tr key={user.id} className={`${color}`}>
                    <td className='px-2 py-2 md:px-4 md:py-2'>{user.id}</td>
                    <td className='px-2 py-2 md:px-4 md:py-2'>{user.name}</td>
                    <td className='px-2 py-2 md:px-4 md:py-2  md:table-cell'>{user.email}</td>
                    <td className='px-2 py-2 md:px-4 md:py-2  md:table-cell'>{user.role}</td>
                    <td className='px-2 py-2 md:px-4 md:py-2  lg:table-cell'>{user.access_level}</td>
                    <td className='px-2 py-2 md:px-4 md:py-2'>
                        <a className='w-full h-11 flex justify-center hover:bg-[#F6A700] hover:cursor-pointer' href={`/editUser/${user.id}`}>
                            <AiFillEdit  className='w-6 h-6'/>
                        </a>
                    </td>
                </tr>
            )
        })
    }

    const navigate = useNavigate()
    const registerUser = () => {
        navigate("/addUser")
    }

    return (
        <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="font-bold text-2xl md:text-4xl">Usuários</h1>
                <button className='py-2 px-4 bg-gray-700 text-white rounded hover:bg-gray-900 text-sm md:text-base' onClick={registerUser}>Criar novo usuário</button>
            </div>

            <div className="overflow-x-auto">
                <table className="table-auto border-collapse w-full rounded-lg">
                    <thead>
                        <tr className='bg-gray-800 text-white'>
                            <th className='px-2 py-2 md:px-4 md:py-2'>ID</th>
                            <th className='px-2 py-2 md:px-4 md:py-2'>Nome</th>
                            <th className='px-2 py-2 md:px-4 md:py-2  md:table-cell'>Email</th>
                            <th className='px-2 py-2 md:px-4 md:py-2  md:table-cell'>Diretoria</th>
                            <th className='px-2 py-2 md:px-4 md:py-2  lg:table-cell'>Nível de acesso</th>
                            <th className='px-2 py-2 md:px-4 md:py-2'>Editar</th>
                        </tr>
                    </thead>
                    <tbody>{renderTable()}</tbody>
                </table>
            </div>
        </div>
    )
}