import { ChangeEvent, useEffect, useRef, useState } from "react"
import * as XLSX from 'xlsx';
import { Tables } from "../table/table";
import { MZONE_type, UpdateData, VSS_Type } from "../../@types/updateData";
import { VitogazTable } from "../table/vssTable";
import { Button, Typography } from "@mui/material";

export const Excel = () => {
    const [vss, setVss] = useState<VSS_Type[] >([])
    const [mzone, setMzone] = useState<MZONE_type[] | null >(null)
    const [error, setError] = useState(false)
    const [errorLengthFile, setErrorLengthFile] = useState<boolean>(false)
    const [data, setData] = useState<UpdateData>({
      IdClient: [],
      Imma: [],
      Trsp: [],
      longitude: [],
      latitude: [],
    	altitude: [],
      speed: [],
      etat: [],
      Last_online_sur_VSS: [],
      date_mzone: [],
      commentaire: []
    })
    const fileInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
      newData()

      console.log('vss length ', vss.length)
    }, [vss, mzone])

    const handleButtonClick = () => {
      if(fileInputRef.current !== null) fileInputRef.current.click();
    }

    const newData = () => {
      let updatedData: UpdateData = {
        IdClient: [],
        Imma: [],
        Trsp: [],
        longitude: [],
        latitude: [],
        altitude: [],
        speed: [],
        etat: [],
        Last_online_sur_VSS: [],
        date_mzone: [],
        commentaire: []
      };
      
      vss?.forEach((vs: VSS_Type) => {
        mzone?.forEach((mz: MZONE_type) => {
          if (mz['__EMPTY_3'] === vs['Imma']) {
            Object.keys(updatedData).forEach((key) => {
              if (updatedData.hasOwnProperty(key)) {
                if (key === 'Last_online_sur_VSS') {
                  updatedData[key].push(vs['Last_online_sur_VSS']);
                } else if (key === 'date_mzone') {
                  updatedData[key].push(mz['__EMPTY_8']);
                } else {
                  updatedData[key as keyof UpdateData].push(vs[key as keyof VSS_Type]);
                }
              }
            });
          }
        })
      })
      setData(updatedData)
    }

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files 
        
        if (!files || files.length !== 2) {
            setErrorLengthFile(true)
            return
        }
        if (files.length === 2) {
          if (files[0].name !== 'dernier_pos.xlsx'  || !files[1].name.includes('VehicleCommunication')) {
            setError(true)
          } else {
            setError(false)
          }
        }
        if (files[0].name === 'dernier_pos.xlsx') {
          const data1 = await files[0].arrayBuffer()
          const workbook = XLSX.read(data1)
          const worksheet = workbook.Sheets[workbook.SheetNames[0]]
          const jsonData1: VSS_Type[] = XLSX.utils.sheet_to_json(worksheet)
          setVss(jsonData1)
        } 
        if (files[1].name.includes('VehicleCommunication')) {
          const data2 = await files[1].arrayBuffer()
          const workbook2 = XLSX.read(data2)
          const wks = workbook2.Sheets[workbook2.SheetNames[0]]
          const jsonData2: MZONE_type[] = XLSX.utils.sheet_to_json(wks)
          console.log('json ', jsonData2)
          setMzone(jsonData2)
        }
        setErrorLengthFile(false)

        console.log(data.IdClient.length)

    }

     
  

  return (
    <>
      <Button variant="outlined" onClick={handleButtonClick} sx={{mt: 2, ml: 2}}>
        Import file
        <input
          type="file"
          accept=".xlsx, .xls"
          multiple
          onChange={(e) => handleFileUpload(e)}
          ref={fileInputRef}
          style={{display: 'none'}}
          />
      </Button>

      {
        vss.length > 0 && <VitogazTable data={vss} />
      }

      {
        data.IdClient.length > 0 && <Tables  data={data}/>
      }
      
      {
        error && <Typography variant="h1" component="h2" color='error'>
                  Error file uploaded
                </Typography>
      }
       {
        errorLengthFile && <Typography variant="h1" component="h2" color='error'>
                  Please select 2 excel files
                </Typography>
      }


    </>
  )
}
