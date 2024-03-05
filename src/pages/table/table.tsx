import React, { useEffect, useRef, useState } from 'react'
import { TableProps, UpdateData } from '../../@types/updateData'
import { DownloadTableExcel } from 'react-export-table-to-excel'

export const Table = ({data}: TableProps) => {
    const  [datas, setDatas] = useState(data)
    const tableRef = useRef(null)

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

    
  return (
    <>
        <DownloadTableExcel
            filename="users table"
            sheet="users"
            currentTableRef={tableRef.current}
        >
            <button>EXcel</button>
        </DownloadTableExcel>
        <table ref={tableRef} style={{ borderCollapse: 'collapse', marginTop: '2rem' }}>
            <thead >
                <tr>
                    {Object.keys(datas).map((key) => (
                        <th key={key} style={{border: '1px solid black'}}>{key}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {datas.IdClient.map((_: any, index:any) => (
                    <tr key={index}>
                        {Object.keys(datas).map((key) => (
                            <td key={key} style={{border: '1px solid black'}}>
                                {
                                    key === 'Last_online_sur_VSS' ? datas[key][index] : 
                                    key === 'date_mzone' ? datas[key][index] :
                                    datas[key][index]
                                }
                            </td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table> 
    </>
  )
}
