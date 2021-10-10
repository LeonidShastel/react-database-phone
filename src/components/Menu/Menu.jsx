import React, {useState} from 'react';
import Box from '@mui/material/Box';
import {Tabs, Tab, Typography, Button} from "@mui/material";
import UploadingToDB from "../UploadingToDB";
import GetDump from "../GetDump";
import Options from "../Options/Options";
import AdminPanel from "../AdminPanel/AdminPanel";
import {useCookies} from "react-cookie";

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

const Menu = ({privileges}) => {

    const [tabNumber, setTabNumber] = useState(0);
    const [,,removeCookie] = useCookies();

    const changeTab = (e, value) =>{
        setTabNumber(value);
    }

    const goOut = () =>{
        removeCookie('email');
        removeCookie('password');
        window.location.reload();
    }

    return (
        <Box sx={{width: '100%'}}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabNumber} onChange={changeTab} aria-label="basic tabs example">
                    {privileges==='admin'?<Tab label={"Загрузка в БД"} {...a11yProps(0)}/> : null}
                    <Tab label="Выгрузка из БД" {...a11yProps(1)} />
                    {privileges==='admin'?<Tab label={"Админ панель"} {...a11yProps(2)}/> : null}
                    <Tab label="Выйти" onClick={goOut} {...a11yProps(3)}/>
                </Tabs>
            </Box>
            <TabPanel value={tabNumber} index={0}>
                <UploadingToDB/>
            </TabPanel>
            <TabPanel value={tabNumber} index={1}>
                <GetDump privileges={privileges}/>
            </TabPanel>
            <TabPanel value={tabNumber} index={2}>
                <AdminPanel/>
            </TabPanel>
            <TabPanel value={tabNumber} index={3}>
                {null}
            </TabPanel>
        </Box>
    );
};

export default Menu;