import { pgTable, text, serial, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const airports = pgTable("airports", {
  id: serial("id").primaryKey(),
  code: text("code").notNull().unique(),
  name: text("name").notNull(),
  city: text("city").notNull(),
  country: text("country").notNull(),
  latitude: text("latitude").notNull(),
  longitude: text("longitude").notNull(),
});

export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  flightNumber: text("flight_number").notNull(),
  originId: integer("origin_id").notNull(),
  destinationId: integer("destination_id").notNull(),
  departureTime: timestamp("departure_time").notNull(),
  arrivalTime: timestamp("arrival_time").notNull(),
  price: integer("price").notNull(),
  seatsAvailable: integer("seats_available").notNull(),
  aircraft: text("aircraft").notNull(),
});

export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  flightId: integer("flight_id").notNull(),
  passengerName: text("passenger_name").notNull(),
  email: text("email").notNull(),
  seatNumber: text("seat_number").notNull(),
  checkedIn: boolean("checked_in").notNull().default(false),
});

export const insertAirportSchema = createInsertSchema(airports);
export const insertFlightSchema = createInsertSchema(flights);
export const insertBookingSchema = createInsertSchema(bookings);

export type Airport = typeof airports.$inferSelect;
export type Flight = typeof flights.$inferSelect;
export type Booking = typeof bookings.$inferSelect;

export type InsertAirport = z.infer<typeof insertAirportSchema>;
export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type InsertBooking = z.infer<typeof insertBookingSchema>;

export const flightSearchSchema = z.object({
  origin: z.string(),
  destination: z.string(),
  departureDate: z.string(),
  returnDate: z.string().optional(),
  passengers: z.number().min(1).max(9),
  tripType: z.enum(["roundtrip", "oneway"]),
  cabinClass: z.enum(["economy", "premium_economy", "business", "first"]),
});

export type FlightSearch = z.infer<typeof flightSearchSchema>;
