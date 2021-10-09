import React, {Component, useEffect, useState} from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Login from "./components/Login/Login";
import Menu from "./components/Menu/Menu"
import {useCookies} from "react-cookie";
import {Alert, Backdrop, CircularProgress, Snackbar} from "@mui/material";
import axios from "axios";


export default function App() {

    const [cookies, setCookie, removeCookie] = useCookies();
    const [privileges, setPrivileges] = useState('');
    const [isAuth, setIsAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const checkAuth = async () => {
        return await axios.get(`http://thelax67.beget.tech/auth.php?email=${cookies.email}&password=${cookies.password}`)
            .then(response => {
                if (response.data!=='denied') {
                    setPrivileges(response.data)
                    setIsAuth(true);
                } else {
                    removeCookie('email');
                    removeCookie('password');
                }
            })
            .catch(error => console.log(error))
            .finally(() => setLoading(false))
    }

    useEffect(() => {
        checkAuth();
    }, [])

    return (
        <Router>
            <div>
                <Switch>
                    {!isAuth ?
                        <Route path={'*'}>
                            <Login setIsAuth={setIsAuth} setPrivileges={setPrivileges}/>
                        </Route>
                        :
                        <Route path={'/'}>
                            <Menu privileges={privileges}/>
                        </Route>
                    }
                </Switch>
            </div>
            <Backdrop open={loading} sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <CircularProgress color={"inherit"}/>
            </Backdrop>
        </Router>
    )
}