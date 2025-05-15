import { DevFlagsType } from "@/wab/shared/devflags";

export function isAdminTeamEmail(
  email: string | undefined | null,
  devflags: DevFlagsType
): boolean {
  return !!email && email.endsWith("@" + devflags.adminUiEnableDomain);
}

export function isGoogleAuthRequiredEmailDomain(
  email: string,
  devflags: DevFlagsType
): boolean {
  return !!devflags.googleAuthRequiredEmailDomains.find((dom) =>
    email.endsWith("@" + dom)
  );
}
