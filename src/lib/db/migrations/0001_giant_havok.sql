ALTER TABLE "user" ADD COLUMN "media_id" text;--> statement-breakpoint
ALTER TABLE "media" ADD COLUMN "user_id" varchar(256);--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_media_id_media_id_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
