-- CreateIndex
CREATE INDEX "Article_title_description_idx" ON "Article"("title", "description");

-- CreateIndex
CREATE INDEX "Comment_text_idx" ON "Comment"("text");

-- CreateIndex
CREATE INDEX "User_name_email_idx" ON "User"("name", "email");
