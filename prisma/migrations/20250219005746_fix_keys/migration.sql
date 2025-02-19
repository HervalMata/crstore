-- RenameForeignKey
ALTER TABLE "Account" RENAME CONSTRAINT "account_userId_user_id_fk" TO "Account_userId_fkey";

-- RenameForeignKey
ALTER TABLE "Cart" RENAME CONSTRAINT "cart_userid_user_id_fk" TO "Cart_userId_fkey";

-- RenameForeignKey
ALTER TABLE "Order" RENAME CONSTRAINT "order_userId_user_id_fk" TO "Order_userId_fkey";

-- RenameForeignKey
ALTER TABLE "Session" RENAME CONSTRAINT "session_userId_user_id_fk" TO "Session_userId_fkey";
