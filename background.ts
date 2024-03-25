import { Storage } from "@plasmohq/storage"

import { applySessionRules } from "./common"

const storage = new Storage()
const onRedirectListChange = (c: chrome.storage.StorageChange) =>
  applySessionRules(c.oldValue, c.newValue)

storage.watch({
  redirectList: onRedirectListChange
})
