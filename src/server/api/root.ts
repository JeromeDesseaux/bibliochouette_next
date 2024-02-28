import { createTRPCRouter } from "~/server/api/trpc";
import { classroomRouter } from "./routers/classrooms";
import { stripeRouter } from "./routers/stripe";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  classrooms: classroomRouter,
  stripe: stripeRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
