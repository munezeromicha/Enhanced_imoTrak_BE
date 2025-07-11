
export interface PositionAccess {
    organisation: {
        canViewOrgs: boolean;         
        canEditOrgs: boolean;         
        canDeleteOrgs: boolean;
        canCreateOrgs: boolean;

        canCreateOrgUnits : boolean;
        canViewAllUnits: boolean;
        canViewOrgUnits: boolean;
        canUpdateUnit: boolean;

        canCreatePosition: boolean;
    }
}