import { FaTimes } from "react-icons/fa";

function formatDateTime(dateStr) {
  return new Date(dateStr).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function VolunteerDetailsModal({ volunteer, onClose }) {
  if (!volunteer) return null;

  const fields = [
    { label: "Full Name", value: volunteer.fullName },
    { label: "Email", value: volunteer.email },
    { label: "Phone", value: volunteer.phone },
    { label: "College", value: volunteer.college },
    { label: "Skills", value: volunteer.skills },
    { label: "Preferred Domain", value: volunteer.preferredDomain },
    { label: "Availability", value: volunteer.availability },
    { label: "Registered On", value: formatDateTime(volunteer.createdAt) },
  ];

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div
        className="admin-modal glass-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="admin-modal-header">
          <h3>Volunteer Details</h3>
          <button
            type="button"
            className="admin-modal-close"
            onClick={onClose}
            aria-label="Close"
          >
            <FaTimes />
          </button>
        </div>

        <div className="admin-modal-body">
          {fields.map((field) => (
            <div key={field.label} className="admin-detail-row">
              <span className="admin-detail-label">{field.label}</span>
              <span className="admin-detail-value">{field.value}</span>
            </div>
          ))}
        </div>

        <div className="admin-modal-footer">
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default VolunteerDetailsModal;
