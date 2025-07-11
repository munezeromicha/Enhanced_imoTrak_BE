
export interface PositionAccess {
    organisation: {
        canView: boolean;         
        canEdit: boolean;         
        canDelete: boolean; 
        canCreate: boolean;  
        [key: string]: boolean; 
    },
    unit: {
        canView: boolean;
        canCreate: boolean;
        canEdit: boolean;
        canDelete: boolean;
        canUPdate: boolean;
    }
}
