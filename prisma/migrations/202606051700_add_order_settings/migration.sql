-- Order settings selected by the customer before renting equipment.
CREATE TYPE "PaymentMode" AS ENUM ('SHIFT_7_PLUS_1', 'HOURLY');

ALTER TABLE "Order"
ADD COLUMN "objectAddress" TEXT,
ADD COLUMN "arrivalAt" TIMESTAMP(3),
ADD COLUMN "paymentMode" "PaymentMode";
