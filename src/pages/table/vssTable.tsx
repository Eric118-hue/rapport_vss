import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { TableProps, VSS, VSS_Type } from '../../@types/updateData';
import { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import * as XLSX from 'xlsx'

export const VitogazTable = ({data}: TableProps) => {
  const [columns, setColumns] = useState<GridColDef[]>([
    {field: 'IdClient', headerName: 'IdClient', sortable: false},
    {field: 'Imma', headerName: 'Imma', sortable: false},
    {field: 'Trsp', headerName: 'Trsp', sortable: false},
    {field: 'longitude', headerName: 'longitude', sortable: false},
    {field: 'altitude', headerName: 'altitude', sortable: false},
    {field: 'speed', headerName: 'speed', sortable: false},
    {field: 'Etat', headerName: 'Etat', sortable: false},
    {field: 'Last_online_sur_VSS', headerName: 'Last_online_sur_VSS', sortable: false},
    {field: 'commentaire', headerName: 'commentaire', sortable: false},
  ])

  const [rows, setRows] = useState(data?.filter((car: VSS) => car.deviceno.includes('Vit')))

  useEffect(() => {
    let vit= data?.filter((car: VSS_Type) => car.IdClient.includes('Vit'))
    setRows(vit)
    const dateToday = new Date()
    dateToday.setHours(0, 0, 0, 0);
    
    const update = vit.map((row: VSS_Type) => {
      const lastOnlineVss = new Date(row.Last_online_sur_VSS);
      lastOnlineVss.setHours(0, 0, 0, 0);
      if (lastOnlineVss.getTime() === dateToday.getTime()) {
        return { ...row, etat: 'ON' };
      }
      return row;
    });

    setRows(update)
  }, [data])

  const handleExport = () => {
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(workbook, worksheet, 'vitogaz')
    XLSX.writeFile(workbook, 'Vitogaz.xlsx')
  }

  return (
  <Box sx={{mt: 2}}>
    <Box sx={{display: 'flex', justifyContent: 'end'}}>
      <Button sx={{mb: 2, mr: 4}} color='success' variant='contained' onClick={handleExport}>Export Vitogaz</Button>
    </Box>
    <DataGrid
      getRowId={(row) => row.Imma}
      rows={rows}
      columns={columns}
      initialState={{
        pagination: {
          paginationModel: { page: 0, pageSize: 5 },
        },
      }}
      pageSizeOptions={[5, 10]}
    />
  </Box>  
  )
}
