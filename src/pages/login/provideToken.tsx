import { useEffect, useState } from "react"
import axios from "axios"
import { Box, Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material"
import './style.scss'
import { useNavigate } from "react-router-dom"
import { useLoadingContext } from "../context/dataContext"
import * as xlsx from 'xlsx';

export const ProvideToken = () => {
    const [token, setToken] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const [data, setData] = useState({})
    const navigate = useNavigate()
    const { loading, setLoading, apiData, setApiData } = useLoadingContext();

    useEffect(() => {
        console.log('data ', data)
        if (Object.keys(data).length > 0) {
            const obj: any = {};
            apiData?.forEach(element => {
                const { deviceno, devicename, fleetname, longitude, latitude, altitude, speed, dtu } = element;
                if (fleetname in obj) {
                    obj[fleetname] = [...obj[fleetname], { 'IdClient': deviceno, 'Imma': devicename, 'Trsp': fleetname, longitude, latitude, altitude, speed, 'etat': '', 'Last_online_sur_VSS': dtu, 'commentaire': '' }];
                } else {
                    obj[fleetname] = [{ 'IdClient': deviceno, 'Imma': devicename, 'Trsp': fleetname, longitude, latitude, altitude, speed, 'etat': '', 'Last_online_sur_VSS': dtu, 'commentaire': '' }];
                }
            });

            const headers = Object.keys(obj);
            const wb = xlsx.utils.book_new();
            const ws = xlsx.utils.json_to_sheet([]);
            let Heading: any = [];
            let arr:any = [];

            headers.forEach((elem: any) => {
                Heading = Array(Object.keys(obj[elem][0]));
                arr.push(...obj[elem]);
            })

            xlsx.utils.sheet_add_aoa(ws, Heading);
            xlsx.utils.sheet_add_json(ws, arr, { origin: 'A2', skipHeader: true, });
            xlsx.utils.book_append_sheet(wb, ws, 'data');
            xlsx.writeFile(wb, 'dernier_pos.xlsx');

                navigate('/lastPosition')

        }
    }, [data])

    const handleChange = (e: any) => {
        setToken(e.target.value)
        console.log(token);
        
    }

    const handleSubmit = async () => {
        setLoading(true)
        try {
            const response = await axios.post('https://node-vss.vercel.app/data', { token });
            if (response.data.status === 10023) {
                console.log('mis error');
                setError(response.data.msg)
                setLoading(false)
            }
            if (response.data.status === 10000) {
                let obj: any = {}
                console.log(' obke ', obj)
                // return obj;
                console.log('fer ', response.data.data.dataList)
                setData(response.data.data.dataList)
                setApiData(response.data.data.dataList)
                setError(null)
                setLoading(false)
            }
            console.log(response)
        } catch (error: any) {
            setError(error.message + ' the server not responding')
            setLoading(false)
            console.error('Erreur lors de la récupération des données:', error.message);
        }
    }
  return (
    <Box className="container"> 
    
        <Card className="cardContent">
            <CardContent className="content">
                <Typography variant="h5" className="title" textAlign='center' m={4}>
                    VSS LAST POSITION
                </Typography>
                <TextField
                    sx={{width: "35vw"}}
                    hiddenLabel
                    id="filled-hidden-label-normal"
                    variant="filled"
                    onChange={handleChange}
                    value={token}
                    placeholder="Enter the token"
                />
                {
                    error && <Typography variant="h5" color='error'  textAlign='center' m={2}>
                            {error}
                         </Typography>
                }
            </CardContent>
            <CardActions sx={{display: 'flex', justifyContent: 'center'}}>
                {
                    loading ?  <div>loading...</div> : <Button variant="contained" size="large" onClick={handleSubmit}>Submit</Button> 
                }
                
            </CardActions>        
        </Card>
    </Box>
  )
}
