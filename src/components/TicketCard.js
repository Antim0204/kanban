





import React from 'react';


const TicketCard = ({ ticket }) => {
   
  
    return (
      <div className="ticket-card">
        <h4>{ticket.title}</h4>
        <p>Status: {ticket.status}</p>
        <p>Assigned to: {ticket.assigned_user}</p>
        <p className={`priority ${priorityClasses[ticket.priority]}`}>
          <img 
            src={priorityIcons[ticket.priority]} 
            alt={`Priority: ${['No Priority', 'Low', 'Medium', 'High', 'Urgent'][ticket.priority]}`} 
          />
          Priority: {['No Priority', 'Low', 'Medium', 'High', 'Urgent'][ticket.priority]}
        </p>
      </div>
    );
  };
  
  export default TicketCard;
  