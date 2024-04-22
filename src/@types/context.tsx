export type Data = {
    deviceno: string;
    devicename: string;
    fleetname: string;
    // sim: string | number;
    // devicetype: string;
    // createtime: string | Date; 
    // modifytime: string | Date;
    // imei: string | number;
    longitude: string;
    latitude: string;
    altitude: string;
    speed: string;
    dtu: string 
}

export interface LoadingContextType {
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
    apiData: Data[] | null; // Adapter le type selon le format de vos données API
    setApiData: React.Dispatch<React.SetStateAction<Data[] | null>>;
}
  