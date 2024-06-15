import React, { useState } from "react";
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';

import video from '../../LoginAssets/video.mp4';
import logo from '../../LoginAssets/Logo API.png';

import { FaUserShield } from "react-icons/fa";
import { BsFillShieldLockFill } from "react-icons/bs";
import { AiOutlineSwapRight } from "react-icons/ai";
import axios from "axios"
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {

    const { setToken } = useAuth()
    const navigate = useNavigate()

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const backendUrl = process.env.REACT_APP_BACKEND_URL;
    console.log(backendUrl)


    const handleLogin = async () => {
        const data = {
            email: email,
            password: password
        }
        try {

            
            axios.post(`${backendUrl}/user/login`, data, { withCredentials: true }).then((response) => {
                setToken(response.data.token)
                window.location.href = `${backendUrl}/meeting/authorize`;
            })
        } catch (error) {
            console.error(error)
        }
    }
    return (
        <div className="loginPage flexAlignCenter bg-[#F6F7F7] shadow-lg">
            <div className="container flexAlignCenter shadow-lg" >
                <div className="videoDiv">
                    <video src={video} autoPlay muted loop></video>
                    <div className="textDiv">
                        <h2 className="title">Sistema de Reuniões SIATT</h2>
                        <p>Sistemas Integrados de Alto Teor Tecnológico</p>
                    </div>
                </div>
                <div className="formDiv flexAlignCenter ">
                    <div className="headerDiv">
                        <img src="/logo2.svg" alt="" className="h-20 w-[112px]"></img>
                        <h3 className="text-white">Bem-vindo novamente!</h3>
                    </div>

                    <form action="" className="form grid " >
                        <div className="inputDiv ">
                            <label htmlFor="username">Email</label>
                            <div className="input flexAlignCenter">
                                <FaUserShield className='icon' />
                                <input type="email" id="email" onChange={(e) => setEmail(e.target.value)} placeholder="Entrar com email"></input>
                            </div>
                        </div>

                        <div className="inputDiv">
                            <label htmlFor="password">Senha</label>
                            <div className="input flexAlignCenter">
                                <BsFillShieldLockFill className='icon' />
                                <input type="password" id="password" onChange={(e) => setPassword(e.target.value)} placeholder="Senha"></input>
                            </div>
                        </div>
                        <button type="button" className="btn flexAlignCenter" onClick={handleLogin}>
                            <span>Login</span>
                            <AiOutlineSwapRight className='icon' />
                        </button>
                    </form>
                </div>
            </div>
        </div>

    )
}

export default Login