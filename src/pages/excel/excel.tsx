import { ChangeEvent, useEffect, useState } from "react"
import * as XLSX from 'xlsx';
import { Table } from "../table/table";
import { MZONE_type, UpdateData, VSS_Type } from "../../@types/updateData";

export const Excel = () => {
    const [vss, setVss] = useState<VSS_Type[] | null>(null)
    const [mzone, setMzone] = useState<MZONE_type[] | null >(null)

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

    useEffect(() => {
      newData()
    }, [vss, mzone])

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
            alert('Please select 2 excel files')
            return
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


    }
  

  return (
    <>
     <input
      type="file"
      accept=".xlsx, .xls"
      multiple
      onChange={(e) => handleFileUpload(e)}
      />

      <Table  data={data}/>
    </>
  )
}
