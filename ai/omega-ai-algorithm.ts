const KEY_SITE_NAMES = {
  GITHUB: "github",
  ATLASSIAN: "atlassian",
  JIRA: "jira",
  PROJECTS: "projects",
  SPACES: "spaces",
  WIKI: "wiki",
  AZURE: "azure",
  GIT: "_git",
  BACKLOG: "backlog"
}

export const constructNuLink = (
  initialTabName: string,
  url: string
): string => {
  const { hostname, pathname } = new URL(url)
  const lowerCasePathName = pathname.toLowerCase()

  if (hostname.includes(KEY_SITE_NAMES.GITHUB)) {
    return `repo-${lowerCasePathName.split("/")[1]}`
  }

  if (hostname.includes(KEY_SITE_NAMES.ATLASSIAN)) {
    const pathPart = lowerCasePathName.split("/")[1]
    if (pathPart.includes(KEY_SITE_NAMES.JIRA)) {
      const projectName = getProjectName(
        lowerCasePathName,
        KEY_SITE_NAMES.PROJECTS
      )

      return `board-${projectName}`
    } else if (pathPart.includes(KEY_SITE_NAMES.WIKI)) {
      const projectName = getProjectName(
        lowerCasePathName,
        KEY_SITE_NAMES.SPACES
      )

      return `conf-${projectName}`
    }
  } else if (hostname.includes(KEY_SITE_NAMES.AZURE)) {
    if (lowerCasePathName.includes(KEY_SITE_NAMES.GIT)) {
      const projectName = getProjectName(lowerCasePathName, KEY_SITE_NAMES.GIT)

      return `repo-${projectName}`
    } else if (lowerCasePathName.includes(KEY_SITE_NAMES.BACKLOG)) {
      const projectName = getProjectName(
        lowerCasePathName,
        KEY_SITE_NAMES.BACKLOG
      )

      return `board-${projectName}`
    }
  }

  // If all else fails use tab name.
  return `${getDomainName(hostname)}-${initialTabName.toLowerCase().split(" ")[0]}`
}

const getProjectName = (pathName: string, siteName: string) => {
  return pathName
    .slice(pathName.lastIndexOf(siteName) + siteName.length)
    .split("/")[1]
}

const getDomainName = (hostname: string) => {
  const domainName = hostname.split(".")
  domainName.reverse()
  return `${domainName[1]}`
}
