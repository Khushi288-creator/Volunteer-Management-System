import { FaEye, FaTrash } from "react-icons/fa";

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function VolunteerTable({ volunteers, onView, onDelete, deletingId }) {
  if (!volunteers.length) {
    return (
      <div className="admin-empty-state glass-card">
        <p>No volunteers found.</p>
      </div>
    );
  }

  return (
    <div className="admin-table-wrapper glass-card">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Domain</th>
            <th>Registered</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {volunteers.map((v) => (
            <tr key={v._id}>
              <td data-label="Name">{v.fullName}</td>
              <td data-label="Email">{v.email}</td>
              <td data-label="Domain">
                <span className="admin-domain-badge">{v.preferredDomain}</span>
              </td>
              <td data-label="Registered">{formatDate(v.createdAt)}</td>
              <td data-label="Actions">
                <div className="admin-table-actions">
                  <button
                    type="button"
                    className="admin-btn-icon admin-btn-view"
                    onClick={() => onView(v)}
                    title="View details"
                  >
                    <FaEye />
                  </button>
                  <button
                    type="button"
                    className="admin-btn-icon admin-btn-delete"
                    onClick={() => onDelete(v)}
                    disabled={deletingId === v._id}
                    title="Delete volunteer"
                  >
                    <FaTrash />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default VolunteerTable;
