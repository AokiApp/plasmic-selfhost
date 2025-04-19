import { DbMgr, SUPER_USER } from "@/wab/server/db/DbMgr";
import { makeUserTraits } from "@/wab/server/routes/util";
import { createInstance, Identify } from "@amplitude/analytics-node";
import { EntityManager } from "typeorm";
import { appConfig } from "../../nfigure-config";

export async function reIdentifyUsers(em: EntityManager) {
  const dbMgr = new DbMgr(em, SUPER_USER);
  const users = await dbMgr.listAllUsers();

  console.log(`Identifying ${users.length} users...`);
  const amplitude = createInstance();
  amplitude.init(appConfig.amplitudeApiKey!);
  for (const user of users) {
    const identify = new Identify();
    for (const [key, value] of Object.entries(makeUserTraits(user))) {
      identify.set(key, value);
    }
    amplitude.identify(identify, {
      user_id: user.id,
    });
  }

  await amplitude.flush().promise;
}
