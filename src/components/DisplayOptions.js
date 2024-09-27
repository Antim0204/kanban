import React from 'react';

const DisplayOptions = ({ grouping, ordering, onGroupingChange, onOrderingChange }) => {
  return (
    <div className="display-options">
      <label>
        Group By:
        <select value={grouping} onChange={(e) => onGroupingChange(e.target.value)}>
          <option value="Status">Status</option>
          <option value="User">User</option>
          <option value="Priority">Priority</option>
        </select>
      </label>
      <label>
        Sort By:
        <select value={ordering} onChange={(e) => onOrderingChange(e.target.value)}>
          <option value="Priority">Priority</option>
          <option value="Title">Title</option>
        </select>
      </label>
    </div>
  );
};

export default DisplayOptions;
