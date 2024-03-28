import { useState } from "react"
import axios from "axios"
import { Box, Button, Card, CardActions, CardContent, TextField, Typography } from "@mui/material"
import './style.scss'
import { useNavigate } from "react-router-dom"
import { useLoadingContext } from "../context/dataContext"
export const ProvideToken = () => {
    const [token, setToken] = useState<string>('')
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { loading, setLoading, apiData, setApiData } = useLoadingContext();

    const handleChange = (e: any) => {
        setToken(e.target.value)
        console.log(token);
        
    }
    const handleSubmit = async () => {
        setLoading(true)
        try {
            const response = await axios.post('http://localhost:3000/data', { token });
            if (response.data.status === 10023) {
                console.log('mis error');
                setError(response.data.msg)
                setLoading(false)
            }
            if (response.data.status === 10000) {
                console.log('fer ', response.data.data.dataList)
                setApiData(response.data.data.dataList)
                setError(null)
                setLoading(false)
                navigate('/lastPosition')
            }
            console.log(response)
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
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
