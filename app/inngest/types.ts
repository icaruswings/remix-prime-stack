import { EventSchemas } from "inngest";
import { z } from "zod";

const DemoEventSent = z.object({
  name: z.literal("demo/event.sent"),
  data: z.object({
    message: z.string(),
  }),
});

export const schemas = new EventSchemas().fromZod([DemoEventSent]);
