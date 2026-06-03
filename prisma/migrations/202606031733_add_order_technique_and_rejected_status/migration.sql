-- Add rejected order status for lessor refusal.
ALTER TYPE "StatusOrder" ADD VALUE IF NOT EXISTS 'REJECTED';

-- Keep nullable so existing orders remain valid.
ALTER TABLE "Order" ADD COLUMN "techniqueId" TEXT;

ALTER TABLE "Order" ADD CONSTRAINT "Order_techniqueId_fkey"
FOREIGN KEY ("techniqueId") REFERENCES "Technique"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
