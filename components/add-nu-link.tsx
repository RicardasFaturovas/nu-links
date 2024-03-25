import { useState } from "react"

import { useStorage } from "@plasmohq/storage/hook"

import type { RuleWithId } from "../common"

const INPUT_ERRORS = {
  REQUIRED_LABEL: "Label is required",
  REQUIRED_NULINK: "NU link is required",
  DUPLICATE_NULINK: "NU link already exists",
  INVALID_URL: "Provided URL is not valid"
}

export function AddNuLink({
  link,
  url,
  onBackClick,
  linkId,
  label
}: {
  link: string
  url: string
  onBackClick: () => void
  linkId?: number
  label?: string
}) {
  const [localRedirectList, setRedirectList] = useStorage("redirectList", [])
  const [inputError, setInputError] = useState(null)

  const [formData, setFormData] = useState({
    url,
    nuLink: link,
    label: label
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setInputError(null)
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const newLink = {
      id: linkId,
      label: formData.label,
      from: formData.nuLink,
      to: formData.url
    }

    if (!validateNewLink(newLink)) {
      return
    }

    linkId ? updateExistingLink(newLink) : addNewLink(newLink)
    onBackClick()
  }

  function validateNewLink(newLink: RuleWithId) {
    if (!newLink.label) {
      setInputError(INPUT_ERRORS.REQUIRED_LABEL)
      return false
    } else if (!newLink.from) {
      setInputError(INPUT_ERRORS.REQUIRED_NULINK)
      return false
    } else if (!isValidUrl(newLink.to)) {
      setInputError(INPUT_ERRORS.INVALID_URL)
      return false
    }

    return true
  }

  function updateExistingLink(newLink: RuleWithId) {
    const newRedirectList = [...localRedirectList]
    const targetIndex = localRedirectList.findIndex((f) => f.id === linkId)
    newRedirectList[targetIndex] = newLink

    setRedirectList(newRedirectList)
  }

  function addNewLink(newLink: RuleWithId) {
    if (localRedirectList.some((el) => el.from === newLink.from)) {
      setInputError(INPUT_ERRORS.DUPLICATE_NULINK)
      return
    }
    newLink.id = localRedirectList.length + 1
    localRedirectList.push(newLink)
    setRedirectList(localRedirectList)
  }

  function isValidUrl(urlString: string) {
    try {
      new URL(urlString)
      return true
    } catch (err) {
      return false
    }
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <label className="label">Name</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="label"
              value={formData.label}
              onChange={handleChange}
              placeholder="My new site"
            />
          </div>
        </div>

        <div className="field">
          <label className="label">NU link</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="nuLink"
              value={formData.nuLink}
              onChange={handleChange}
              placeholder="nu/something/"
            />
          </div>
        </div>

        <div className="field">
          <label className="label">URL</label>
          <div className="control">
            <input
              className="input"
              type="text"
              name="url"
              value={formData.url}
              onChange={handleChange}
              placeholder="https://google.com"
            />
          </div>
        </div>
        {inputError && (
          <div
            style={{ padding: "5px 5px 5px 10px" }}
            className="notification is-danger">
            {inputError}
          </div>
        )}
        <div
          style={{ justifyContent: "space-around", marginBottom: "10px" }}
          className="buttons">
          <button
            style={{ width: "120px" }}
            className="button is-info"
            type="submit">
            Save
          </button>

          <button
            style={{ width: "120px" }}
            className="button is-info"
            onClick={onBackClick}>
            Back
          </button>
        </div>
      </form>
    </div>
  )
}
