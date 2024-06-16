import { useState } from 'react';
import PageTitle from '../../pageTitle/PageTitle';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import './toastNotification.css'
import { Navigate, useNavigate } from 'react-router-dom'


export function AddUserComponent() {
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    const navigate = useNavigate()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [access, setAccess] = useState('')

    const optionsRole = [
        { value: 'financeira', label: 'Financeira' },
        { value: 'comercial', label: 'Comercial' },
        { value: 'tecnica', label: 'Técnica' }
    ]

    const optionsAccess = [
        { value: '1', label: '1' },
        { value: '2', label: '2' },
        { value: '3', label: '3' }
    ]

    const customStyles = {
        control: (provided) => ({
          ...provided,
          backgroundColor: "#D9D9D9",
        }),
    };

    const handleRoleChange = (role) => {
        setRole(role.value)
    }

    const handleAcessChange = (access) => {
        setAccess(access.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = {
            name: name,
            email: email,
            password: password,
            role: role,
            access_level: Number.parseInt(access)
        }

        try{
            await axios.post(`${backendUrl}/user/create`, data).then((response) => {
                toast.success('Usuário cadastrado')
                setName('')
                setEmail('')
                setPassword('')
                setRole('')
                setAccess('')
            })
        }catch(error){
            if(error.response.status == 409){
                toast.error('Usuário com e-mail já cadastrado')
            }
            console.error(error)
        }
    }

    return (
        <div className="">
            <PageTitle>Cadastrar usuário</PageTitle>
            <form className="standardFlex flex-col gap-8 my-1 mt-20 items-center lg:full" onSubmit={handleSubmit}>
                <div className="standardFlex flex-col w-2/3 text-2xl gap-2 items-center">
                    <label htmlFor="name" className="text-2xl ">Nome Completo</label>
                    <input type="text" id="name" name="name" value={name} placeholder="Digite o nome completo" required onChange={(e) => { setName(e.target.value) }} className=" rounded-lg w-full p-2 bg-[#D9D9D9]  " />
                </div>
                <div className="standardFlex flex-col w-2/3 text-2xl items-center gap-4">
                    <label htmlFor="email">E-mail</label>
                    <input type="email" id="email" name="email" value={email} placeholder="Digite o e-mail" required onChange={(e) => { setEmail(e.target.value) }} className=" rounded-lg  p-2 w-full bg-[#D9D9D9]  "/>
                </div>
                <div className="standardFlex flex-col w-2/3 text-2xl items-center gap-4">
                    <label htmlFor="password">Senha</label>
                    <input type="password" id="password" name="password" value={password} placeholder="Digite a senha" required onChange={(e) => { setPassword(e.target.value) }} className=" rounded-lg w-full p-2 bg-[#D9D9D9]  "/>
                </div>
                <div className="flex w-2/3 gap-10">
                    <div className="standardFlex flex-col w-2/3 text-2xl items-center gap-4">
                        <label htmlFor="diretoria">Diretoria</label>
                        <Select 
                          options={optionsRole}
                          styles={customStyles}
                          isSearchable={false}
                          id='diretoria' 
                          name='diretoria' 
                          className='rounded-1g p-1 w-full' 
                          placeholder="Escolha a diretoria"
                          onChange={handleRoleChange}
                        />
                    </div>
                    <div className="standardFlex flex-col w-2/3 text-2xl items-center gap-4">
                        <label htmlFor="permissao">Nível de Permissão</label>
                        <Select 
                          options={optionsAccess}
                          styles={customStyles} 
                          isSearchable={false}
                          id='diretoria' 
                          name='diretoria' 
                          className='rounded-1g p-1 w-full' 
                          placeholder="Escolha o nível de permissão"
                          onChange={handleAcessChange}
                        />
                    </div>
                </div>
                <div className="w-full standardFlex justify-center  lg:w-2/3 gap-8 ">
                <button type="button" className="rounded-lg bg-slate-300 lg:w-[20%] w-1/2 mt-8 text-2xl h-12 transition easy-in-out hover:bg-slate-400" onClick={() => navigate('/users')}>Cancelar</button>
                    <button type="submit" className="rounded-lg bg-[#FED353] lg:w-[20%] w-1/2 mt-8 text-2xl h-12 transition easy-in-out hover:bg-[#F6A700]">Cadastrar</button>
                    
                </div>
                <ToastContainer 
                  position='bottom-center'
                  autoClose={2000}
                  hideProgressBar={true}
                  closeOnClick={true}
                  theme='dark'
                />
            </form>
        </div>
    );
}