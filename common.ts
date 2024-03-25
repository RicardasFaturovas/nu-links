export type RedirectList = Array<Rule>

export type RedirectListWithId = Array<RuleWithId>

export type Rule = {
  label: string
  from: string
  to: string
}

export type RuleWithId = {
  id: number
  label: string
  from: string
  to: string
}

export const FILE_IMPORT_ERROR =
  "Error importing file. Make sure your file is a valid JSON"

export const applySessionRules = (
  oldList: RedirectListWithId,
  newList: RedirectListWithId
) => {
  chrome.declarativeNetRequest.updateSessionRules(formatRules(oldList, newList))
}

const formatRules = (
  oldList: RedirectListWithId,
  newList: RedirectListWithId
): any => {
  const rules = newList.map((redirect) => {
    return {
      id: redirect.id,
      action: {
        type: "redirect",
        redirect: { regexSubstitution: redirect.to }
      },
      condition: {
        resourceTypes: ["main_frame"],
        regexFilter: `(.*)${redirect.from}`
      }
    }
  })

  return { removeRuleIds: oldList.map((r) => r.id), addRules: rules }
}

export const PREFIX = "nu/"
