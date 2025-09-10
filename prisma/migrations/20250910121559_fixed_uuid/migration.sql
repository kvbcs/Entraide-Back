-- CreateTable
CREATE TABLE "public"."news" (
    "id_news" SERIAL NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "image_url" VARCHAR(255),
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT '2025-09-10 13:38:34.027214'::timestamp without time zone,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT '2025-09-10 13:38:34.027214'::timestamp without time zone,

    CONSTRAINT "news_pkey" PRIMARY KEY ("id_news")
);

-- CreateTable
CREATE TABLE "public"."refresh_tokens" (
    "id_refresh" UUID NOT NULL,
    "user_id" UUID NOT NULL,
    "refresh_token" VARCHAR(1024) NOT NULL,
    "expires_at" TIMESTAMP(6) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT '2025-09-10 13:38:34.027214'::timestamp without time zone,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT '2025-09-10 13:38:34.027214'::timestamp without time zone,

    CONSTRAINT "refresh_tokens_pkey" PRIMARY KEY ("id_refresh")
);

-- CreateTable
CREATE TABLE "public"."roles" (
    "id_role" UUID NOT NULL,
    "role_name" VARCHAR(20) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT '2025-09-10 13:38:34.027214'::timestamp without time zone,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT '2025-09-10 13:38:34.027214'::timestamp without time zone,

    CONSTRAINT "roles_pkey" PRIMARY KEY ("id_role")
);

-- CreateTable
CREATE TABLE "public"."users" (
    "id_user" UUID NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "hashed_password" CHAR(128) NOT NULL,
    "is_verified" SMALLINT NOT NULL DEFAULT 0,
    "is_active" SMALLINT NOT NULL DEFAULT 0,
    "activation_token" VARCHAR(512),
    "role_id" UUID NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT '2025-09-10 13:38:34.027214'::timestamp without time zone,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT '2025-09-10 13:38:34.027214'::timestamp without time zone,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id_user")
);

-- CreateTable
CREATE TABLE "public"."volunteers" (
    "id_volunteer" SERIAL NOT NULL,
    "first_name" VARCHAR(50) NOT NULL,
    "last_name" VARCHAR(50) NOT NULL,
    "is_absent" SMALLINT NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(6),
    "end_date" TIMESTAMP(6),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT '2025-09-10 13:38:34.027214'::timestamp without time zone,
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT '2025-09-10 13:38:34.027214'::timestamp without time zone,

    CONSTRAINT "volunteers_pkey" PRIMARY KEY ("id_volunteer")
);

-- CreateIndex
CREATE UNIQUE INDEX "refresh_tokens_refresh_token_idx" ON "public"."refresh_tokens"("refresh_token");

-- CreateIndex
CREATE INDEX "refresh_tokens_user_id_idx" ON "public"."refresh_tokens"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- AddForeignKey
ALTER TABLE "public"."refresh_tokens" ADD CONSTRAINT "refresh_tokens_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id_user") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "public"."users" ADD CONSTRAINT "users_role_id_fkey" FOREIGN KEY ("role_id") REFERENCES "public"."roles"("id_role") ON DELETE NO ACTION ON UPDATE NO ACTION;
