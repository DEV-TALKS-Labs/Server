// mock prisma

import { beforeEach } from "vitest";
import { mockDeep, mockReset } from "vitest-mock-extended";


beforeEach(() => {
  mockReset(prisma);
});


const prisma = mockDeep();
module.exports = prisma;
