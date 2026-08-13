-- Link local accounts to University of Rwanda (Inuma) SSO subjects.
ALTER TABLE "tbl_auth" ADD COLUMN "sso_sub" TEXT;

CREATE UNIQUE INDEX "tbl_auth_sso_sub_key" ON "tbl_auth"("sso_sub");
