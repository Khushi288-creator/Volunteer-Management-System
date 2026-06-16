import { FaSearch } from "react-icons/fa";

function SearchBar({ value, onChange, onClear }) {
  return (
    <div className="admin-search">
      <FaSearch className="admin-search-icon" />
      <input
        type="text"
        placeholder="Search by name, email, college, domain..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      {value && (
        <button type="button" className="admin-search-clear" onClick={onClear}>
          Clear
        </button>
      )}
    </div>
  );
}

export default SearchBar;
