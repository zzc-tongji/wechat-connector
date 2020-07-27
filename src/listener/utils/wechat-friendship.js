import { Friendship } from 'wechaty';

import { global } from '../../utils/global';
import * as cache from '../../utils/cache';

const friendship = (f) => {
  // (f: Friendship)
  global.requestor.id().then((id) => {
    cache.set(id, { friendship: f, contact: f.contact() });
    global.requestor.log({
      id,
      instance: global.setting.wechaty.name,
      level: 'INFO',
      category: 'wechat-worker.listener.wechat.friendship',
      timestampMs: Date.now(),
      content: JSON.stringify({
        friendshipType: Friendship.Type[f.type()],
        friendshipMessage: f.hello(),
        friendshipContactName: f.contact().name(),
      }),
    });
  });
};

export { friendship };
