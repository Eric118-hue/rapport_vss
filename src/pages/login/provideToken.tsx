import { useState } from "react"
import axios from "axios"

export const ProvideToken = () => {
    const [token, setToken] = useState<string>('')

    const handleChange = (e: any) => {
        setToken(e.target.value)
    }
    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:3000/data', { token });
            console.log(response)
        } catch (error) {
            console.error('Erreur lors de la récupération des données:', error);
        }
    }
  return (
    <> 
    <br />
        <input type="text" onChange={handleChange} value={token}/> <br />
        <button onClick={handleSubmit}>send</button>

        <br /><br />
    </>
  )
}
