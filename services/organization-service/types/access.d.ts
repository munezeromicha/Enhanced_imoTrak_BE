
export interface PositionAccess {
    organisation: {
        canView: boolean;         
        canEdit: boolean;         
        canDelete: boolean;       
        canAssignTasks: boolean;  
        canManagePermissions: boolean;
        canManageTeam: boolean;   
        canApproveRequests: boolean; 
        canCreateReports: boolean;  
        canViewSalary: boolean;    
        canEditSalary: boolean;    
        [key: string]: boolean;   
    }
}