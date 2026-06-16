import { FaSearch, FaTimes } from "react-icons/fa";

/**
 * SearchBar — admin volunteer search
 * Props:
 *   value      string   current search text
 *   onChange   fn       called with new string value
 *   onClear    fn       called when clear button clicked
 *   searching  bool     show spinner while debounced fetch is in-flight
 */
function SearchBar({ value, onChange, onClear, searching = false }) {
  return (
    <div className={`admin-search ${searching ? "admin-search--searching" : ""}`}>
      {searching ? (
        <span className="admin-search-spinner" aria-hidden="true" />
      ) : (
        <FaSearch className="admin-search-icon" aria-hidden="true" />
      )}

      <input
        type="text"
        placeholder="Search by name, email, college, skills, domain…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search volunteers"
        autoComplete="off"
        spellCheck={false}
      />

      {value && (
        <button
          type="button"
          className="admin-search-clear"
          onClick={onClear}
          aria-label="Clear search"
          title="Clear search"
        >
          <FaTimes />
        </button>
      )}
    </div>
  );
}

export default SearchBar;
