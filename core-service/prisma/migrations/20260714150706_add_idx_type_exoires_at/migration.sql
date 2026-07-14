-- CreateIndex
CREATE INDEX "idx_verification_tokens_expires_at" ON "verification_tokens"("expires_at");

-- CreateIndex
CREATE INDEX "idx_verification_tokens_user_type" ON "verification_tokens"("user_id", "type");
