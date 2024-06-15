import { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';
import '../addUser/AddUserComponent'
import { Navigate, useNavigate,useParams } from 'react-router-dom'
import PageTitle from '../../pageTitle/PageTitle';


export default function EditUser() {
    // Obter os parâmetros de rota, incluindo o userId
    const navigate = useNavigate();
    const { userId } = useParams();
    const [userData, setUserData] = useState(null);
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('')
    const [access, setAccess] = useState(null)
    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    
    useEffect(() => {

        const fetchData = async () => {

            const data = {
                id: userId
              }
            try {
                const userResponse = await axios.get(`${backendUrl}/user/fetchall`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                },
            });
            const userData = userResponse.data.find((user) => user.id == userId);
           
                setUserData(userData);
                setName(userData.name);
                setPassword(userData.password);
                setEmail(userData.email);
                setRole(userData.role);
                setAccess(userData.access_level);
            } catch (error) {
                console.error('Erro ao obter perfil do usuário:', error);
            }
        };

        fetchData(); 
    }, [userId]); 

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

    const handleAccessChange = (access) => {
        setAccess(access.value)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        const data = {
            id: userId,
            name: name,
            email: email,
            password: password,
            role: role,
            access_level: Number.parseInt(access)
        }

        try{
            await axios.patch(`${backendUrl}/user/update/`,data,{
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token'),
                }
            }).then((response) => {
                toast.success('Usuário atualizado')
            })
        }catch(error){
            if(error.response.status == 409){
                toast.error('Usuário com e-mail já cadastrado')
            }
            console.error(error)
        }
    }

    async function handleUserDelete() { 
        const confirm = window.confirm("Tem certeza que deseja excluir este usuário?")
        if(confirm == true){
            try{
                const data = { id: userId }
                await axios.delete(`${backendUrl}/user/delete`, {
                    data: data,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + localStorage.getItem('token'),
                    }
                }).then((response) => {
                    toast.success('Usuário deletado')
                    navigate('/users')
                })
            }catch(error){
                console.error(error)
            }
        }
    }

    if(userData != null){
        return (
            <div>
                <PageTitle>editar usuario : {userData.name}</PageTitle>
                <div className='w-full flex justify-end'>
                    <button className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded' onClick={() => handleUserDelete()}>Deletar usário</button>
                </div>
                <form className="standardFlex flex-col gap-8 my-1 mt-20 items-center lg:full" onSubmit={handleSubmit}>
                    <div className="standardFlex flex-col w-2/3 text-2xl gap-2 items-center">
                        <label htmlFor="name" className="text-2xl">Nome Completo</label>
                        <input type="text" id="name" name="name" value={name} placeholder="Digite o nome completo" required onChange={(e) => setName(e.target.value)} className="rounded-lg w-full p-2 bg-[#D9D9D9]" />
                    </div>
                    <div className="standardFlex flex-col w-2/3 text-2xl items-center gap-4">
                        <label htmlFor="email">E-mail</label>
                        <input type="email" id="email" name="email" value={email} placeholder="Digite o e-mail" required onChange={(e) => setEmail(e.target.value)} className="rounded-lg p-2 w-full bg-[#D9D9D9]" />
                    </div>
                    <div className="standardFlex flex-col w-2/3 text-2xl items-center gap-4">
                        <label htmlFor="password">Senha</label>
                        <input type="password" id="password" name="password" value={password} placeholder="Digite a senha" required onChange={(e) => setPassword(e.target.value)} className="rounded-lg w-full p-2 bg-[#D9D9D9]" />
                    </div>
                    <div className="flex w-2/3 gap-10">
                        <div className="standardFlex flex-col w-2/3 text-2xl items-center gap-4">
                            <label htmlFor="role">Diretoria</label>
                            <Select
                                options={optionsRole}
                                styles={customStyles}
                                isSearchable={false}
                                id='role'
                                name='role'
                                className='rounded-1g p-1 w-full'
                                placeholder="Escolha a diretoria"
                                onChange={handleRoleChange}
                                defaultValue={{ value: `${role}`, label: `${role}`}}
                            />
                        </div>
                        <div className="standardFlex flex-col w-2/3 text-2xl items-center gap-4">
                            <label htmlFor="access">Nível de Permissão</label>
                            <Select
                                options={optionsAccess}
                                styles={customStyles}
                                isSearchable={false}
                                id='access'
                                name='access'
                                className='rounded-1g p-1 w-full'
                                placeholder="Escolha o nível de permissão"
                                onChange={handleAccessChange}
                                defaultValue={{ value: `${access}`, label: `${access}`}}
                            />
                        </div>
                    </div>
                    <div className="w-full standardFlex justify-center lg:w-2/3 gap-8 ">
                        <button type="button" className="rounded-lg bg-slate-300 lg:w-[20%] w-1/2 mt-8 text-2xl h-12 transition easy-in-out hover:bg-slate-400" onClick={() => navigate('/users')}>Cancelar</button>
                        <button type="submit" className="rounded-lg bg-[#FED353] lg:w-[20%] w-1/2 mt-8 text-2xl h-12 transition easy-in-out hover:bg-[#F6A700]">Cadastrar</button>
                    </div>
                </form>
                <ToastContainer 
                  position='bottom-center'
                  autoClose={2000}
                  hideProgressBar={true}
                  closeOnClick={true}
                  theme='dark'
                />
            </div>
        );
    }
   
}