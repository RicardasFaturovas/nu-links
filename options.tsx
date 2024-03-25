import "./style.css"

import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import { FILE_IMPORT_ERROR, type Rule, type RuleWithId } from "./common"
import { AddNuLink } from "./components/add-nu-link"
import { NuLinkList } from "./components/nu-link-list"

function OptionsIndex() {
  const [localRedirectList, setRedirectList] = useStorage("redirectList", [])

  const [importError, setImportError] = useState(undefined)
  const [addNuLink, setAddNuLink] = useState({
    show: false,
    rule: undefined
  })

  const redirectList = localRedirectList.sort((a: Rule, b: Rule) =>
    a.from.localeCompare(b.from)
  )

  const handleDelete = (linkId: number) => {
    const updatedList = localRedirectList.filter(
      (el: RuleWithId) => el.id !== linkId
    )

    setRedirectList(updatedList)
  }

  const handleEdit = (rule: RuleWithId) => {
    setAddNuLink({
      show: true,
      rule
    })
  }

  const handleFileUpload = (target: HTMLInputElement) => {
    setImportError(undefined)
    if (target && target.files) {
      const reader = new FileReader()
      reader.readAsText(target.files[0])
      reader.onload = (e) => {
        if (e.target?.result) {
          try {
            const importedRedirects: Rule[] = JSON.parse(
              e.target?.result.toString()
            )
            const redirectsWithId = importedRedirects.map((el, i) => ({
              id: i + 1,
              ...el
            }))

            setRedirectList(redirectsWithId)
          } catch (e) {
            setImportError(FILE_IMPORT_ERROR)
          }
        }
      }
    }
  }

  const backFromAdd = () => {
    setAddNuLink({ show: false, rule: undefined })
  }

  return (
    <div
      data-theme="dark"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
      <h1 style={{ margin: "10px" }} className="title">
        NU Links
      </h1>
      {addNuLink.show ? (
        <AddNuLink
          link={addNuLink.rule.from}
          url={addNuLink.rule.to}
          linkId={addNuLink.rule.id}
          label={addNuLink.rule.label}
          onBackClick={backFromAdd}
        />
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center"
          }}>
          <div
            style={{
              width: "500px",
              maxHeight: "500px",
              overflow: "auto",
              margin: "10px"
            }}
            className="card">
            <div className="card-content">
              <div className="content">
                <NuLinkList
                  redirectList={redirectList}
                  showButtons={true}
                  onDelete={handleDelete}
                  onEdit={handleEdit}
                />
              </div>
            </div>
          </div>
          <div className="file is-info">
            <label className="file-label">
              <input
                className="file-input"
                onChange={(e) => handleFileUpload(e.target)}
                type="file"
              />
              <span className="file-cta">
                <span className="file-label">Import links...</span>
              </span>
            </label>

            {!!importError && (
              <div
                style={{ padding: "5px 5px 5px 10px" }}
                className="notification is-danger">
                {importError}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default OptionsIndex
