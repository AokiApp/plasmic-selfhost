import { User } from "@/wab/server/entities/Entities";
import { makeUserTraits } from "@/wab/server/routes/util";
import { disconnectUserSockets } from "@/wab/server/socket-util";
import { ForbiddenError } from "@/wab/shared/ApiErrors/errors";
import { TeamWhiteLabelInfo } from "@/wab/shared/ApiSchema";
import { spawn } from "@/wab/shared/common";
import { Request } from "express-serve-static-core";

export function doLogin(
  request: Request,
  user: User,
  done: (err: any) => void
) {
  spawn(
    disconnectUserSockets(request).then(() => {
      request.logIn(user, done);
      request.analytics.identify(user.id, makeUserTraits(user));
    })
  );
}

export async function doLogout(request: Request) {
  await disconnectUserSockets(request);
  return new Promise((resolve) => {
    // Requests forwarded to socket server do not set up passport
    if (typeof request.logout === "function") {
      request.logout(resolve);
    } else {
      resolve(true);
    }
  });
}
