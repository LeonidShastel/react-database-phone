import React, {useEffect, useState} from 'react';
import {
    Box,
    Stack,
    Typography,
    Paper,
    Tooltip,
    IconButton,
    Accordion,
    AccordionDetails,
    AccordionSummary,
    TextField,
    Button,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Select,
    CircularProgress,
    Backdrop, MenuItem
} from "@mui/material";
import axios from "axios";
import AlertPopup from "../AlertPopup";
import {ListItem} from "@material-ui/core";
import {
    ClearAllOutlined,
    ClearOutlined,
    ClearSharp,
    DeleteOutlined,
    EditOutlined,
    ExpandLessOutlined,
} from "@material-ui/icons";
import styles from './AdminPanel.module.css';

const AdminPanel = () => {
    const [cities, setCities] = useState([]);
    const [users, setUsers] = useState([]);
    const [newUser,setNewUser] = useState({privileges: 'user'});
    const [logs, setLogs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [alertVision, setAlertVision] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMessage, setAlertMessage] = useState('');

    const setAlert = (type, message, vision = true) => {
        setAlertType(type);
        setAlertMessage(message);
        setAlertVision(vision);
    }

    const clearUsedTable = async (title) => {
        if(!window.confirm("Вы действительно ходитет очистить таблицу?")){
            return false;
        }
        setLoading(true);
        return await axios.get(`http://thelax67.beget.tech/options.php?option=table_clearUsed&table=${title}`)
            .then(response=>{
                setAlert('success', 'Таблицы очищена')
            })
            .catch(error=>{
                setAlert('error', 'Произошла ошибка');
            })
            .finally(()=>setLoading(false))
    }
    const clearTable = async (title) =>{
        if(!window.confirm("Вы действительно ходитет очистить таблицу?")){
            return false;
        }
        setLoading(true)
        return await axios.get(`http://thelax67.beget.tech/options.php?option=table_clear&table=${title}`)
            .then(response=>{
                setAlert('success', 'Таблицы очищена')
            })
            .catch(error=>{
                setAlert('error', 'Произошла ошибка');
            })
            .finally(()=>setLoading(false));
    }
    const removeTable = async (title) =>{
        if(!window.confirm("Вы действительно ходитет удалить таблицу?")){
            return false;
        }
        setLoading(true);
        return await axios.get(`http://thelax67.beget.tech/options.php?option=table_remove&table=${title}`)
            .then(response=>{
                setAlert('success', 'Таблицы удалена')
            })
            .catch(error=>{
                setAlert('error', 'Произошла ошибка');
            })
            .finally(()=>setLoading(false))
    }

    const getCities = async () => {
        setCities([]);
        return await axios.get(`http://thelax67.beget.tech/options.php?option=cities`)
            .then(response => {
                setCities(response.data);
            })
            .catch(error => {
                setAlert('error', error.message, true);
            })
    }

    const getUsers = async () => {
        setUsers([]);
        return await axios.get(`http://thelax67.beget.tech/options.php?option=users`)
            .then(response => {
                setUsers(response.data);
            })
            .catch(error => {
                setAlert('error', error.message)
            })
    }
    const updateStateUsers = (index, field, e) => {
        const newArray = [...users];
        newArray[index] = {...newArray[index], [field]: e.target.value}
        setUsers(newArray);
    }
    const updateAccessCities = (city, indexUser,value) => {
        const prevUsers = [...users];
        const access = JSON.parse(prevUsers[indexUser].accessCities);
        let find = false;
        for(let i = 0; i<access.length; i++){
            if(access[i].city===city){
                access[i].count=value;
                find=true;
                break;
            }
        }
        if(!find){
            access.push({
                city: city,
                count: value
            })
        }
        prevUsers[indexUser].accessCities = JSON.stringify(access);
        setUsers(prevUsers);
    }
    const searchValueCities =(indexUser, city)=>{
        const access = JSON.parse(users[indexUser].accessCities, city);
        for(let i = 0;i<access.length;i++){
            if(access[i].city===city){
                return access[i].count;
            }
        }
        return 0;
    }
    const deleteUser = async (email)=>{
        setLoading(true)
        return await axios.get(`http://thelax67.beget.tech/options.php?option=delete_user&email=${email}`)
            .then(response=>{
                setAlert('success', 'Пользователь удален')
            })
            .catch(error=>{
                setAlert('error', 'Произошла ошибка');
            })
            .finally(()=>setLoading(false))
    }
    const addUser = async ()=>{
        setLoading(true);
        return await axios.get(`http://thelax67.beget.tech/options.php?option=add_user&email=${newUser.email}&password=${newUser.password}&privileges=${newUser.privileges}`)
            .then(response=>{
                setAlert('success', 'Пользователь добавлен')
            })
            .catch(error=>{
                setAlert('error', 'Произошла ошибка');
            })
            .finally(()=>setLoading(false));
    }
    const saveUser = async (index) => {
        setLoading(true);
        const user = users[index];
        const body = {
            id: user.id,
            email: user.email,
            password: user.password,
            privileges: user.privileges,
            accessCities: user.accessCities,
        }
        return await axios.post(`http://thelax67.beget.tech/options.php`,{
            option: 'save_user',
            body: body,
        })
            .then(response=>{
                setAlert('success', 'Пользователь сохранен')
            })
            .catch(error=>{
                setAlert('error', 'Произошла ошибка');
            })
            .finally(()=>setLoading(false))
    }

    const getLogs = async () =>{
        return await axios.get(`http://thelax67.beget.tech/options.php?option=logs`)
            .then(response=>{
                setLogs(response.data);
            })
    }

    const callAPI = async () =>{
        await getCities();
        await getUsers();
        await getLogs();
        await getCities();
    }

    useEffect(() => {
        callAPI()
            .then(response=>setLoading(false));
    }, []);

    const generateDate = (date)  => {
        if(date.length>0){
            const newDate = date.split(' ');
            newDate[0] = newDate[0].split('-').reverse().join(' ');
            return  (newDate.join(' '));
        }

    }


    return (
        <Box>
            <Box >
                <Typography variant={"h5"} sx={{color: '#1976D2', marginBottom: 5}}>Админ панель</Typography>
            </Box>
            <Box sx={{marginBottom: 2}}>
                <Typography variant={"h6"} sx={{color: '#1976D2', marginBottom: 2}}>Базы данных</Typography>
                {cities.length !== 0 ? <Stack>
                    {cities.map((el, index) => (
                        <ListItem key={index} sx={{display: 'flex'}}>
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandLessOutlined/>}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography>{el.title.split('_').join(' ').split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ')}</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Typography>
                                        {`В базе: ${el.numberPhones}`}<br/>{`Доступно для выгрузки: ${el.numberAvailablePhones}`}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                            <Tooltip title={'Очистить выгруженные'}>
                                <IconButton onClick={()=>clearUsedTable(el.title)}>
                                    <ClearOutlined/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={'Очистить всю базу'}>
                                <IconButton onClick={()=>clearTable(el.title)}>
                                    <ClearAllOutlined/>
                                </IconButton>
                            </Tooltip>
                            <Tooltip title={'Удалить'} onClick={()=>removeTable(el.title)}>
                                <IconButton>
                                    <DeleteOutlined/>
                                </IconButton>
                            </Tooltip>
                        </ListItem>
                    ))}
                </Stack> : <Box>Баз данных нет</Box>}
            </Box>
            <Box sx={{marginBottom: 2}}>
                <Typography variant={"h6"} sx={{color: '#1976D2', marginBottom: 2}}>Пользователи</Typography>
                <Stack spacing={2}>
                    {users.length !== 0 ?
                        users.map((el, indexUser) => (
                            <ListItem>
                                <Accordion>
                                    <AccordionSummary expandIcon={<ExpandLessOutlined/>}>
                                        <Typography>{indexUser + 1 + '. ' + el.email}</Typography>
                                    </AccordionSummary>
                                    <AccordionDetails sx={{display: 'flex', flexDirection: 'column'}}
                                                      className={styles.full_info} id={'full_info'}>
                                        <TextField margin="dense" label='E-mail' value={el.email}
                                                   onChange={e => updateStateUsers(indexUser, 'email', e)}/>
                                        <TextField margin="dense" label='Пароль' value={el.password}
                                                   onChange={e => updateStateUsers(indexUser, 'password', e)}/>
                                        {cities.length !== 0 ?
                                            cities.map((el,indexCity) => (
                                                <TextField key={indexCity} margin="dense" label={el.title.split('_').join(' ').split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ')} value={searchValueCities(indexUser, el.title)} onChange={e=>updateAccessCities(el.title, indexUser, e.target.value)}/>
                                            ))
                                            : <Typography>Базы отсутствуют</Typography>}
                                        <Button sx={{marginTop: 2}} variant={'outlined'} onClick={()=>saveUser(indexUser)}>Сохранить</Button>
                                        <Button sx={{marginTop: 1}} variant={'outlined'} onClick={()=>deleteUser(el.email)}>Удалить пользователя</Button>
                                    </AccordionDetails>
                                </Accordion>
                            </ListItem>
                        )) : <ListItem><Typography>Пользователи отсутствуют</Typography></ListItem>}
                    <ListItem>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandLessOutlined/>}>
                                <Typography>Добавить пользователя</Typography>
                            </AccordionSummary>
                            <AccordionDetails sx={{display: 'flex', flexDirection: 'column'}}
                                              className={styles.full_info} id={'full_info'}>
                                <TextField margin="dense" label='E-mail' value={newUser.email}
                                           onChange={e => setNewUser({...newUser, email:e.target.value})}/>
                                <TextField margin="dense" label='Пароль' value={newUser.password}
                                           onChange={e => setNewUser({...newUser, password:e.target.value})}/>
                                <Select value={newUser.privileges} onChange={e => setNewUser({...newUser, privileges:e.target.value})} margin={"dense"}>
                                    <MenuItem value={'user'}>Пользователь</MenuItem>
                                    <MenuItem value={'admin'}>Администратор</MenuItem>
                                </Select>
                                <Button sx={{marginTop: 2}} variant={'outlined'} onClick={addUser}>Сохранить</Button>
                            </AccordionDetails>
                        </Accordion>
                    </ListItem>
                </Stack>
            </Box>
            <Box>
                <Typography variant={"h6"} sx={{color: '#1976D2', marginBottom: 2}}>Логи (последние 25)</Typography>
                {logs.length!==0 ?
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 400 }} aria-label="simple table">
                            <TableHead>
                                <TableRow>
                                    <TableCell>Email</TableCell>
                                    <TableCell align="right">Количество номеров</TableCell>
                                    <TableCell align="right">Город</TableCell>
                                    <TableCell align="right">Дата выгрузки</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {logs.map((log) => (
                                    <TableRow
                                        key={log.id}
                                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                    >
                                        <TableCell component="th" scope="row">
                                            {log.email}
                                        </TableCell>
                                        <TableCell align="right">{log.count}</TableCell>
                                        <TableCell align="right">{log.tableOut.split('_').join(' ').split(/\s+/).map(word => word[0].toUpperCase() + word.substring(1)).join(' ')}</TableCell>
                                        <TableCell align="right">{generateDate(log.dateDump)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                :   <Typography>Логи отсутствуют</Typography>
                }
            </Box>
            <AlertPopup vision={alertVision} setVision={setAlertVision} type={alertType} message={alertMessage}/>
            <Backdrop open={loading} sx={{color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1}}>
                <CircularProgress color={"inherit"}/>
            </Backdrop>
        </Box>
    );
};

export default AdminPanel;