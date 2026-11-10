CREATE TABLE "pokemon" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "height" DOUBLE PRECISION NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL,
    "image_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "pokemon_pkey" PRIMARY KEY ("id")
);
CREATE TABLE "types" ("id" SERIAL NOT NULL, "name" VARCHAR(50) NOT NULL, CONSTRAINT "types_pkey" PRIMARY KEY ("id"));
CREATE TABLE "pokemon_types" (
    "pokemon_id" INTEGER NOT NULL,
    "type_id" INTEGER NOT NULL,
    CONSTRAINT "pokemon_types_pkey" PRIMARY KEY ("pokemon_id","type_id")
);
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX "pokemon_name_key" ON "pokemon"("name");
CREATE INDEX "pokemon_name_idx" ON "pokemon"("name");
CREATE UNIQUE INDEX "types_name_key" ON "types"("name");
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
ALTER TABLE "pokemon_types" ADD CONSTRAINT "pokemon_types_pokemon_id_fkey" FOREIGN KEY ("pokemon_id") REFERENCES "pokemon"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "pokemon_types" ADD CONSTRAINT "pokemon_types_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
