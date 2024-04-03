export type VSS_Type = {
    IdClient: string;
    Imma: string;
    Trsp: string;
    commentaire: string;
    etat: string;
    latitude: string ;
    longitude: string;
    speed: string;
    Last_online_sur_VSS: string;
    altitude: string;
    date_mzone: string;

}

export type VSS = {
    deviceno: string;
    devicename: string;
    fleetname: string;
    longitude: string ;
    latitude: string ;
    altitude: string ;
    speed: string ;
    dtu: string;
}
export type MZONE_type = {
    __EMPTY_3 : string;
    __EMPTY_8: string
}

export type UpdateData = {
     IdClient: string[],
    Imma: string[],
    Trsp: string[],
    longitude: (string | number)[],
    latitude: (string | number)[],
    altitude: (string | number)[],
    speed: (string | number)[],
    etat: string[],
    Last_online_sur_VSS: string[],
    date_mzone: (string)[], // Modification ici
    commentaire: string[],
}

export type TableProps = {
    data: any
}