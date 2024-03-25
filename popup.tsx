import { useStorage } from "@plasmohq/storage/hook"

import { PREFIX, type Rule } from "./common"

import "./style.css"

import { useState } from "react"

import { constructNuLink } from "./ai/omega-ai-algorithm"
import { AddNuLink } from "./components/add-nu-link"
import { NuLinkList } from "./components/nu-link-list"

function IndexPopup() {
  const [localRedirectList] = useStorage("redirectList", [])
  const [addNuLink, setAddNuLink] = useState({ show: false, link: "", url: "" })

  const redirectList = localRedirectList.sort((a: Rule, b: Rule) =>
    a.from.localeCompare(b.from)
  )

  const handleAddNuLinkClick = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const name = tabs[0].title
      const url = tabs[0].url
      const link = `${PREFIX}${constructNuLink(name, url)}/`
      setAddNuLink({ show: true, link, url })
    })
  }

  const saveFile = async (blob: Blob) => {
    const a = document.createElement("a")
    a.download = "exported-links.json"
    a.href = URL.createObjectURL(blob)
    a.click()
    document.body.removeChild(a)
  }

  const handleExportLinks = async () => {
    const trimmedList = localRedirectList.map(({ id, ...rest }) => rest)
    const blob = new Blob([JSON.stringify(trimmedList, null, 2)], {
      type: "application/json"
    })

    await saveFile(blob)
  }

  const backFromAdd = () => {
    setAddNuLink({ show: false, link: "", url: "" })
  }

  return (
    <div>
      <div className="content">
        {addNuLink.show ? (
          <AddNuLink
            link={addNuLink.link}
            url={addNuLink.url}
            onBackClick={backFromAdd}
          />
        ) : (
          <div>
            <div
              style={{
                padding: "5px",
                overflow: "auto",
                maxHeight: "300px",
                width: "400px"
              }}>
              <NuLinkList redirectList={redirectList} showButtons={false} />
            </div>

            <div
              style={{ justifyContent: "space-around", padding: "10px" }}
              className="buttons">
              <button className="button is-info" onClick={handleAddNuLinkClick}>
                Add NU Link
              </button>

              <button className="button is-info" onClick={handleExportLinks}>
                Export current links
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default IndexPopup
