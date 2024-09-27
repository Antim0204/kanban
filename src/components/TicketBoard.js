import React from 'react';
import TicketCard from './TicketCard';

const TicketBoard = ({ tickets, grouping, ordering }) => {
  // Helper function to group tickets dynamically
  const groupBy = (tickets, key) => {
    return tickets.reduce((result, ticket) => {
      const group = ticket[key] || 'Unknown';
      if (!result[group]) {
        result[group] = [];
      }
      result[group].push(ticket);
      return result;
    }, {});
  };

  let groupedTickets = {};
  if (grouping === 'Status') {
    groupedTickets = groupBy(tickets, 'status');
  } else if (grouping === 'User') {
    groupedTickets = groupBy(tickets, 'assigned_user');
  } else if (grouping === 'Priority') {
    groupedTickets = groupBy(tickets, 'priority');
  }

  // Sort tickets within each group
  const sortTickets = (group) => {
    return group.sort((a, b) => {
      if (ordering === 'Priority') return b.priority - a.priority;
      if (ordering === 'Title') return a.title.localeCompare(b.title);
      return 0;
    });
  };

  return (
    <div className="ticket-board">
      {Object.keys(groupedTickets).map((group) => (
        <div key={group} className="ticket-column">
          
          <h3>{group}</h3>
          {sortTickets(groupedTickets[group]).map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} />
          ))}
        </div>
      ))}
    </div>
  );
};

export default TicketBoard;





