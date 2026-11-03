/** One mock portal per development server, with every form open. Never used on a deployment (config refuses mock mode there). */
import { MOCK_SECRET } from "./config";
import { createMockPortal } from "./mock-portal";

const g = globalThis as typeof globalThis & { __hebs2027MockPortal?: ReturnType<typeof createMockPortal> };

export function mockPortalFetch() {
  g.__hebs2027MockPortal ??= createMockPortal({
    secret: MOCK_SECRET,
    open: { priority: true, sponsor: true, exhibitor: true, enquiry: true },
  });
  return g.__hebs2027MockPortal.fetch;
}
