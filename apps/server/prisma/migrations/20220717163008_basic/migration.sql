-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "username" VARCHAR(16) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Todo" (
    "id" SERIAL NOT NULL,
    "description" VARCHAR(256) NOT NULL,
    "color" VARCHAR(7) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "createdById" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Todo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Todo" ADD CONSTRAINT "Todo_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Add test user
INSERT INTO public."User" (id, username, email, password, "createdAt") VALUES (1, 'test', 'test@email.com', '$2a$10$GRnDF48FFiob7kpT2duswOaqUJXURiTbX6DAEiP11tAJ.Vt821YFu', '2022-07-17 16:30:56.264');

-- Add basic todo
INSERT INTO public."Todo" (id, description, color, completed, "createdById", "createdAt", "updatedAt") VALUES (1, 'My first todo!', '#2461b5', false, 1, '2022-07-17 16:31:04.955', '2022-07-17 16:31:04.955');
