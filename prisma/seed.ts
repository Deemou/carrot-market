import { PrismaClient } from '@prisma/client';

const client = new PrismaClient();

async function main() {
  // Array.from({ length: 500 }, (_, i) => i).forEach(async (item) => {
  //   await client.stream.create({
  //     data: {
  //       name: String(item),
  //       description: String(item),
  //       price: item,
  //       user: {
  //         connect: {
  //           id: 1
  //         }
  //       },
  //       chat: {
  //         create: {}
  //       }
  //     }
  //   });
  //   console.log(`${item}/500`);
  // });
}

main()
  .catch((e) => console.log(e))
  .finally(() => client.$disconnect());
