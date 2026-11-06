import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";
import { authNavMode, showKiroCollaboration } from "@/app/flags";

export const GET = createFlagsDiscoveryEndpoint(async () => {
  return getProviderData({ authNavMode, showKiroCollaboration });
});
