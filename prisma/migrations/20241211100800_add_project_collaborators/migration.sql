-- CreateTable
CREATE TABLE "_ProjectCollaborators" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProjectCollaborators_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_ProjectCollaborators_B_index" ON "_ProjectCollaborators"("B");

-- AddForeignKey
ALTER TABLE "_ProjectCollaborators" ADD CONSTRAINT "_ProjectCollaborators_A_fkey" FOREIGN KEY ("A") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProjectCollaborators" ADD CONSTRAINT "_ProjectCollaborators_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
