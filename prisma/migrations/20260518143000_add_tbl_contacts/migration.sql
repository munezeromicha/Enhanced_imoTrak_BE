-- Contact form submissions (public POST + admin inbox).
CREATE TABLE IF NOT EXISTS "public"."tbl_contacts" (
    "contact_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "is_read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tbl_contacts_pkey" PRIMARY KEY ("contact_id")
);

CREATE INDEX IF NOT EXISTS "tbl_contacts_created_at_idx" ON "public"."tbl_contacts"("created_at");
CREATE INDEX IF NOT EXISTS "tbl_contacts_is_read_idx" ON "public"."tbl_contacts"("is_read");
