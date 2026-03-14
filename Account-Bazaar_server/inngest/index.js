// import  prisma  from "../configs/prisma.js";
// import { Inngest } from "inngest";

// // Create a client to send and receive events
// export const inngest = new Inngest({ id: "account-marketplace" });

// //  inngest function: to save user data to a database
// const syncUserCreation = inngest.createFunction(
//   { id: "sync-user-from-clerk" },
//   { event: "clerk/user.created" },
//   async ({ event }) => {
//     const  {data} = event

//     // check if user already exist in db
//     const  user = await prisma.user.findFirst({
//         where: {id: data.id}
//     })
//     if(user){
//         // update user data if it exists
//         await prisma.user.update({
//             where:{id: data.id},
//             data: {
//                 email: data?.email_addresses[0]?.email_address,
//                 name:  data?.first_name + " " + data.last_name,
//                 image: data?.image_url,
//             }
//         })
//         return;
//     }
//     await  prisma.user.create({
//         data : {
//               id:data.id,
//               email: data?.email_addresses[0]?.email_address,
//               name:  data?.first_name + " " + data.last_name,
//               image: data?.image_url,
//         }
//     })
//   },
// );

// // inngest fxn to delete user from database
// const syncUserDeletion = inngest.createFunction(
//   { id: "delete-user-from-clerk" },
//   { event: "clerk/user.deleted" },
//   async ({ event }) => {
//     const  {data} = event
    
//     const listings = await prisma.listing.findMany({
//         where: {owenerId: data.id}
//     })
//      const chats = await prisma.listing.findMany({
//         where: {OR: [{ownerUserId: data.id}, {chatUserId: data.id}]}
//     })
//      const transactions = await prisma.listing.findMany({
//         where: {userId: data.id}
//     })
//     if(listings.length === 0 && chats.length === 0 && transactions.length === 0){
//          await prisma.user.delete({where : {id : data.id}})
//     }else{
//         await prisma.user.delete({
//             where : {id : data.id},
//             data: {status: "inactive"}
//         })
//     }
//   },
// );

// //  inngest function: to update user data to a database
// const syncUserUpdation = inngest.createFunction(
//   { id: "update-user-from-clerk" },
//   { event: "clerk/user.updated" },
//   async ({ event }) => {
//     const  {data} = event

//     await prisma.user.update({
//         where : {id: data.id},
//         data : {
//               email: data?.email_addresses[0]?.email_address,
//               name:  data?.first_name + " " + data.last_name,
//               image: data?.image_url,
//         }
//     })
//   },
// );


// // Create an empty array where we'll export future Inngest functions
// export const functions = [
//     syncUserCreation,
//     syncUserDeletion,
//     syncUserUpdation
// ];

// import { prisma } from "../configs/prisma.js";
// import { Inngest } from "inngest";

// export const inngest = new Inngest({ id: "account-marketplace" });

// const syncUserCreation = inngest.createFunction(
//   { id: "sync-user-from-clerk" },
//   { event: "clerk/user.created" },
//   async ({ event }) => {

//     const { data } = event;

//     const user = await prisma.user.findFirst({
//       where: { id: data.id }
//     });

//     if (user) {
//       await prisma.user.update({
//         where: { id: data.id },
//         data: {
//           email: data?.email_addresses[0]?.email_address,
//           name: `${data?.first_name} ${data?.last_name}`,
//           image: data?.image_url,
//         }
//       });
//       return;
//     }

//     await prisma.user.create({
//       data: {
//         id: data.id,
//         email: data?.email_addresses[0]?.email_address,
//         name: `${data?.first_name} ${data?.last_name}`,
//         image: data?.image_url,
//       }
//     });

//   }
// );


// const syncUserDeletion = inngest.createFunction(
//   { id: "delete-user-from-clerk" },
//   { event: "clerk/user.deleted" },
//   async ({ event }) => {

//     const { data } = event;

//     const listings = await prisma.listing.findMany({
//       where: { ownerId: data.id }
//     });

//     const chats = await prisma.chat.findMany({
//       where: {
//         OR: [
//           { ownerUserId: data.id },
//           { chatUserId: data.id }
//         ]
//       }
//     });

//     const transactions = await prisma.transaction.findMany({
//       where: { userId: data.id }
//     });

//     if (listings.length === 0 && chats.length === 0 && transactions.length === 0) {

//       await prisma.user.delete({
//         where: { id: data.id }
//       });

//     } else {

//       await prisma.user.update({
//         where: { id: data.id },
//         data: { status: "inactive" }
//       });

//     }

//   }
// );


// const syncUserUpdation = inngest.createFunction(
//   { id: "update-user-from-clerk" },
//   { event: "clerk/user.updated" },
//   async ({ event }) => {

//     const { data } = event;

//     await prisma.user.update({
//       where: { id: data.id },
//       data: {
//         email: data?.email_addresses[0]?.email_address,
//         name: `${data?.first_name} ${data?.last_name}`,
//         image: data?.image_url
//       }
//     });

//   }
// );

// export const functions = [
//   syncUserCreation,
//   syncUserDeletion,
//   syncUserUpdation
// ];

import { prisma } from "../configs/prisma.js";
import { Inngest } from "inngest";

// Create inngest client
export const inngest = new Inngest({
  id: "account-marketplace",
});


/* -------------------------------------------------------------------------- */
/*                             USER CREATION EVENT                             */
/* -------------------------------------------------------------------------- */

const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {

      const { data } = event;

      console.log("User created event:", data.id);

      const email = data?.email_addresses?.[0]?.email_address || null;
      const name = `${data?.first_name || ""} ${data?.last_name || ""}`.trim();

      await prisma.user.upsert({
        where: { id: data.id },
        update: {
          email,
          name,
          image: data?.image_url
        },
        create: {
          id: data.id,
          email,
          name,
          image: data?.image_url
        }
      });

    } catch (error) {

      console.error("syncUserCreation error:", error);
      throw error;

    }
  }
);



/* -------------------------------------------------------------------------- */
/*                              USER UPDATE EVENT                              */
/* -------------------------------------------------------------------------- */

const syncUserUpdation = inngest.createFunction(
  { id: "update-user-from-clerk" },
  { event: "clerk/user.updated" },
  async ({ event }) => {

    try {

      const { data } = event;

      console.log("User updated event:", data.id);

      const email = data?.email_addresses?.[0]?.email_address || null;
      const name = `${data?.first_name || ""} ${data?.last_name || ""}`.trim();

      await prisma.user.upsert({
        where: { id: data.id },
        update: {
          email,
          name,
          image: data?.image_url
        },
        create: {
          id: data.id,
          email,
          name,
          image: data?.image_url
        }
      });

    } catch (error) {

      console.error("syncUserUpdation error:", error);
      throw error;

    }

  }
);



/* -------------------------------------------------------------------------- */
/*                             USER DELETION EVENT                             */
/* -------------------------------------------------------------------------- */

const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-from-clerk" },
  { event: "clerk/user.deleted" },
  async ({ event }) => {

    try {

      const { data } = event;

      console.log("User deleted event:", data.id);

      const listings = await prisma.listing.findMany({
        where: { ownerId: data.id }
      });

      const chats = await prisma.chat.findMany({
        where: {
          OR: [
            { ownerUserId: data.id },
            { chatUserId: data.id }
          ]
        }
      });

      const transactions = await prisma.transaction.findMany({
        where: { userId: data.id }
      });


      if (!listings.length && !chats.length && !transactions.length) {

        // No related data → delete user
        await prisma.user.delete({
          where: { id: data.id }
        });

      } else {

        // Related data exists → deactivate user
        await prisma.user.update({
          where: { id: data.id },
          data: { status: "inactive" }
        });

      }

    } catch (error) {

      console.error("syncUserDeletion error:", error);
      throw error;

    }

  }
);



/* -------------------------------------------------------------------------- */
/*                         EXPORT ALL INNGEST FUNCTIONS                        */
/* -------------------------------------------------------------------------- */

export const functions = [
  syncUserCreation,
  syncUserUpdation,
  syncUserDeletion
];