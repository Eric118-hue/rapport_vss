import { ChangeEvent, useEffect, useState } from 'react'
import { TableProps, UpdateData, VSS_Type } from '../../@types/updateData'
import { Box, Button, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from '@mui/material'
import * as XLSX from 'xlsx'

export const Tables = ({data}: TableProps) => {
    const  [datas, setDatas] = useState(data)
    const [page, setPage] = useState(0)
    const [rowsPerPage, setRowsPerPage] = useState(5)

    useEffect(() => {
        if (data) {
            const newData: UpdateData = { ...data, commentaire: [], etat: [] };
            const dateToday = new Date();
            dateToday.setHours(0, 0, 0, 0);

            data['date_mzone'].forEach((mz: string, index: number) => {
                const dMZ = new Date(mz);
                dMZ.setHours(0, 0, 0, 0);
                const vs = data['Last_online_sur_VSS'][index];
                const dVS = new Date(vs);
                dVS.setHours(0, 0, 0, 0);

                let commentaire = '';
                let etat = ''

                if (dVS instanceof Date && dMZ instanceof Date) {
                    if (dVS.getTime() === dateToday.getTime()) {
                        etat = 'ON'
                    }
                    if (dVS > dMZ) {
                        const diffDays =  Math.abs(Math.round((dMZ.getTime() - dVS.getTime()) / (1000 * 60 * 60 * 24)));
                        commentaire = `OBC ncp (${diffDays})`;
                    } else if (dVS < dMZ) {
                        const diffDays = Math.abs(Math.round((dMZ.getTime() - dVS.getTime()) / (1000 * 60 * 60 * 24)));
                        commentaire = `MA ncp (${diffDays})`;
                    } else {
                        commentaire = '';
                    }
                } else {
                    console.log('no Date');
                }

                newData.etat.push(etat)
                newData.commentaire.push(commentaire);
            });

            setDatas(newData);
            console.log('cmt ', datas)
        }
        console.log('atep ' ,data)

    }, [data])

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage:number) => {
        /* event in params is required to avoid the error in pagination */
        setPage(newPage);
    };
    
    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleExport = () => {
        const formattedData = datas.IdClient.map((id: string, index: number) => ({
            IdClient: id,
            Imma: datas.Imma[index],
            Trsp: datas.Trsp[index],
            longitude: datas.longitude[index],
            latitude: datas.latitude[index],
            altitude: datas.altitude[index],
            speed: datas.speed[index],
            etat: datas.etat[index],
            Last_online_sur_VSS: datas.Last_online_sur_VSS[index],
            commentaire: datas.commentaire[index]
        }));
      
        const ws = XLSX.utils.json_to_sheet(formattedData);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
        XLSX.writeFile(wb, "data.xlsx");
        
    }
  return (
    <>
        <Box sx={{display: 'flex', justifyContent: 'end'}}>
            <Button sx={{mb: 2, mr: 4, mt:2 }} color='success' variant='contained' onClick={handleExport}>Export LPSA</Button>
        </Box>
        <TableContainer>
            <Table>
                <TableHead >
                    <TableRow>
                        {Object.keys(datas).map((key) => (
                            <TableCell key={key} >{key}</TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {(rowsPerPage > 0
                        ? datas.IdClient.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        : datas.IdClient
                    ).map((_: VSS_Type, index: number) => (
                        <TableRow key={index}>
                            {Object.keys(datas).map((key) => (
                                <TableCell key={key} >
                                    {key === 'Last_online_sur_VSS' ? datas[key][index + page * rowsPerPage] : 
                                    key === 'date_mzone' ? datas[key][index + page * rowsPerPage] :
                                    datas[key][index + page * rowsPerPage]}
                                </TableCell>
                            ))}
                        </TableRow>
                ))}
                </TableBody>
            </Table>
        </TableContainer> 
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={datas.IdClient.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    </>
  )
}
