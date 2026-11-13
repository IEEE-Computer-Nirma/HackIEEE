import { createFlagsDiscoveryEndpoint, getProviderData } from "flags/next";
import {
  authNavMode,
  showKiroCollaboration,
  showKiroInHero,
  showKiroInAbout,
  showKiroInNav,
} from "@/app/flags";

export const GET = createFlagsDiscoveryEndpoint(async () => {
  return getProviderData({
    authNavMode,
    showKiroCollaboration,
    showKiroInHero,
    showKiroInAbout,
    showKiroInNav,
  });
});
