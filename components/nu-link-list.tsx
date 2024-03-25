import type { Rule, RuleWithId } from "../common"

export function NuLinkList({
  redirectList,
  showButtons,
  onDelete,
  onEdit
}: {
  redirectList: Rule[]
  showButtons: boolean
  onDelete?: (linkId: number) => void
  onEdit?: (rule: RuleWithId) => void
}) {
  const redirectLinksElements = redirectList.map(
    (el: RuleWithId, i: number) => (
      <div key={i} style={{ marginBottom: "10px" }} className="card">
        <div style={{ padding: 0 }} className="card-content">
          <div className="content">
            <div className="notification is-info">
              <div>
                <strong>Name</strong>: {el.label}
              </div>
              <div>
                <strong>NU link</strong>: {el.from}
              </div>
            </div>
          </div>
        </div>
        {showButtons && (
          <footer className="card-footer">
            <a href="#" onClick={() => onEdit(el)} className="card-footer-item">
              Edit
            </a>
            <a
              href="#"
              onClick={() => onDelete(el.id)}
              className="card-footer-item">
              Delete
            </a>
          </footer>
        )}
      </div>
    )
  )

  return <div>{redirectLinksElements}</div>
}
