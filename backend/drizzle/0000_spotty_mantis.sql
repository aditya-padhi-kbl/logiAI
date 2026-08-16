CREATE TYPE "public"."party_type" AS ENUM('INDIVIDUAL', 'BUSINESS');--> statement-breakpoint
CREATE TYPE "public"."warehouse_status" AS ENUM('OPERATIONAL', 'CONGESTED', 'CLOSED');--> statement-breakpoint
CREATE TYPE "public"."route_status" AS ENUM('ACTIVE', 'DISRUPTED', 'SUSPENDED');--> statement-breakpoint
CREATE TYPE "public"."shipment_status" AS ENUM('CREATED', 'PICKED_UP', 'IN_TRANSIT', 'DELAYED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED');--> statement-breakpoint
CREATE TYPE "public"."shipment_event_type" AS ENUM('CREATED', 'PICKED_UP', 'ARRIVED_AT_WAREHOUSE', 'DEPARTED_WAREHOUSE', 'IN_TRANSIT', 'DELAYED', 'OUT_FOR_DELIVERY', 'DELIVERED');--> statement-breakpoint
CREATE TABLE "parties" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(255) NOT NULL,
	"type" "party_type" NOT NULL,
	"email" varchar(255),
	"phone" varchar(255),
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "carriers" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(50) NOT NULL,
	"on_time_rate" numeric(5, 2) NOT NULL,
	"average_delay_hours" numeric(6, 2) NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "carriers_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "warehouses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"name" varchar(255) NOT NULL,
	"city" varchar(100) NOT NULL,
	"country" varchar(100) NOT NULL,
	"capacity" integer NOT NULL,
	"current_load" integer NOT NULL,
	"status" "warehouse_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "warehouses_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "routes" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"code" varchar(50) NOT NULL,
	"origin" jsonb NOT NULL,
	"destination" jsonb NOT NULL,
	"distance_km" numeric(10, 2) NOT NULL,
	"estimated_duration_hours" numeric(6, 2) NOT NULL,
	"historical_delay_hours" numeric(6, 2) NOT NULL,
	"status" "route_status" NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "routes_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "route_stops" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"route_id" uuid NOT NULL,
	"warehouse_id" uuid NOT NULL,
	"sequence" integer NOT NULL,
	"planned_arrival_at" timestamp with time zone,
	"planned_departure_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "shipments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"tracking_number" varchar(100) NOT NULL,
	"order_number" varchar(100),
	"sender_id" uuid NOT NULL,
	"receiver_id" uuid NOT NULL,
	"carrier_id" uuid NOT NULL,
	"route_id" uuid NOT NULL,
	"origin" jsonb NOT NULL,
	"destination" jsonb NOT NULL,
	"current_location" jsonb,
	"status" "shipment_status" NOT NULL,
	"expected_delivery_at" timestamp with time zone NOT NULL,
	"actual_delivery_at" timestamp with time zone,
	"risk_score" numeric(5, 4) DEFAULT '0' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "shipments_tracking_number_unique" UNIQUE("tracking_number")
);
--> statement-breakpoint
CREATE TABLE "shipment_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shipment_id" uuid NOT NULL,
	"type" "shipment_event_type" NOT NULL,
	"timestamp" timestamp with time zone NOT NULL,
	"location" jsonb,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "route_stops" ADD CONSTRAINT "route_stops_warehouse_id_warehouses_id_fk" FOREIGN KEY ("warehouse_id") REFERENCES "public"."warehouses"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_sender_id_parties_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_receiver_id_parties_id_fk" FOREIGN KEY ("receiver_id") REFERENCES "public"."parties"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_carrier_id_carriers_id_fk" FOREIGN KEY ("carrier_id") REFERENCES "public"."carriers"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipments" ADD CONSTRAINT "shipments_route_id_routes_id_fk" FOREIGN KEY ("route_id") REFERENCES "public"."routes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "shipment_events" ADD CONSTRAINT "shipment_events_shipment_id_shipments_id_fk" FOREIGN KEY ("shipment_id") REFERENCES "public"."shipments"("id") ON DELETE cascade ON UPDATE no action;