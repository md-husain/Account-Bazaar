// import { PrismaClient } from "@prisma/client";
// import { PrismaNeon } from "@prisma/adapter-neon";
// import { neonConfig } from "@neondatabase/serverless";
// import ws from "ws";
// import "dotenv/config";

// neonConfig.webSocketConstructor = ws;
// neonConfig.poolQueryViaFetch = true;

// const connectionString = process.env.DATABASE_URL;

// const adapter = new PrismaNeon({ connectionString });

// const globalForPrisma = globalThis;

// const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     adapter
//   });

// if (process.env.NODE_ENV !== "production") {
//   globalForPrisma.prisma = prisma;
// }


// export default prisma;

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import { Pool } from "@neondatabase/serverless";
import { neonConfig } from "@neondatabase/serverless";
import ws from "ws";
import "dotenv/config";

neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({
  connectionString
});

const adapter = new PrismaNeon(pool);

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}