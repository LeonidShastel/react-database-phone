import React, {useState} from 'react';
import styles from './Login.module.css';
import {Button, TextField, Snackbar, Alert, Box} from "@mui/material";
import { useHistory } from "react-router-dom";
import {useCookies} from "react-cookie";
import axios from "axios";


const Login = ({setIsAuth, setPrivileges}) => {
    const [cookies, setCookie] = useCookies();
    const [email,setEmail] = useState('');
    const [password,setPassword] = useState('');
    const [openSnackBar, setOpenSnackBar] = useState(false);
    const [validateKey, setValidateKey] = useState(true);

    const checkKey = () => {
        return axios.get(`http://thelax67.beget.tech/auth.php?email=${email}&password=${password}`)
            .then(response=>{
                if(response.data!=='denied'){
                    console.log(true)
                    setCookie('email',email,{maxAge: 36000});
                    setCookie('password',password, {maxAge: 36000});
                    setIsAuth(true)
                    setPrivileges(response.data)
                }else{
                    console.log(false)
                    setValidateKey(false);
                    setOpenSnackBar(true);
                }
            })
            .catch(error=>{
                console.log(error)
                setValidateKey(false);
                setOpenSnackBar(true);
            })
    }

    return (
        <div className={styles.main}>
            <div className={styles.main__block}>
                <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 2}}>
                    <TextField id="outlined-basic" label="E-mail" variant="outlined" margin={"normal"} size={"normal"} value={email} onChange={e=>setEmail(e.target.value)} error={!validateKey}/>
                    <TextField id="outlined-basic" label="Password" variant="outlined" size={"normal"} value={password} onChange={e=>setPassword(e.target.value)} error={!validateKey}/>
                </Box>
                <Button variant="outlined" size={"large"} onClick={checkKey}>Войти</Button>
            </div>
            <Snackbar open={openSnackBar} onClose={()=>setOpenSnackBar(false)}>
                {validateKey ? <Alert onClose={()=>setOpenSnackBar(false)} severity="success" sx={{ width: '100%' }}>
                    Вход выполнен
                </Alert> : <Alert severity="error" onClose={()=>setOpenSnackBar(false)} sx={{ width: '100%' }}>Неверный логин или пароль</Alert>}
            </Snackbar>
        </div>
    );
};

export default Login;