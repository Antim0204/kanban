
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles.css';

const App = () => {
  const [tickets, setTickets] = useState([]);
  const [grouping, setGrouping] = useState('status');
  const [sortOrder, setSortOrder] = useState('priority');

  // API call to fetch data
  useEffect(() => {
    axios.get('https://api.quicksell.co/v1/internal/frontend-assignment')
      .then(response => {
        console.log('API Response:', response.data.tickets); // Debugging the API data
        setTickets(response.data.tickets); // Extract the "tickets" array
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  // Restore the user's saved grouping and sorting from localStorage
  useEffect(() => {
    const savedGrouping = localStorage.getItem('grouping');
    const savedSortOrder = localStorage.getItem('sortOrder');

    if (savedGrouping) setGrouping(savedGrouping);
    if (savedSortOrder) setSortOrder(savedSortOrder);
  }, []);

  // Save the grouping preference whenever it changes
  useEffect(() => {
    localStorage.setItem('grouping', grouping);
  }, [grouping]);

  // Save the sortOrder preference whenever it changes
  useEffect(() => {
    localStorage.setItem('sortOrder', sortOrder);
  }, [sortOrder]);

  // Group tickets by status

  const countTickets = (tickets, key) => {
    return tickets.reduce((acc, ticket) => {
      const value = ticket[key];
      acc[value] = (acc[value] || 0) + 1;
      return acc;
    }, {});
  };





  const groupByStatus = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const status = ticket.status;
      if (!acc[status]) acc[status] = [];
      acc[status].push(ticket);
      return acc;
    }, {});
  };

  // Group tickets by assigned user
  const groupByUser = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const user = ticket.userId;
      if (!acc[user]) acc[user] = [];
      acc[user].push(ticket);
      return acc;
    }, {});
  };

  // Group tickets by priority
  const groupByPriority = (tickets) => {
    return tickets.reduce((acc, ticket) => {
      const priority = ticket.priority;
      if (!acc[priority]) acc[priority] = [];
      acc[priority].push(ticket);
      return acc;
    }, {});
  };

  // Choose grouping method based on the selected option
  const groupedTickets = () => {
    let groupedData;
    switch (grouping) {
      case 'status':
        groupedData = groupByStatus(tickets);
        break;
      case 'user':
        groupedData = groupByUser(tickets);
        break;
      case 'priority':
        groupedData = groupByPriority(tickets);
        break;
      default:
        groupedData = tickets;
    }

    return groupedData;
  };

  const sortedTickets = (ticketGroup) => {
    if (sortOrder === 'priority') {
      return ticketGroup.sort((a, b) => b.priority - a.priority);
    } else if (sortOrder === 'title') {
      return ticketGroup.sort((a, b) => a.title.localeCompare(b.title));
    }
    return ticketGroup;
  };


  const renderCounts = (group) => {
    if (grouping === 'status') {
      const counts = countTickets(tickets, 'status');
      return `(${counts[group] || 0})`;
    } else if (grouping === 'priority') {
      const counts = countTickets(tickets, 'priority');
      return `(${counts[group] || 0})`;
    }
    return '';
  };
  


  

return (
  <div className="app-container">
    <header>
      <h1>Kanban Board</h1>
      <div className="display-options">
        <label>Group By:</label>
        <select value={grouping} onChange={(e) => setGrouping(e.target.value)}>
          <option value="status">Status</option>
          <option value="user">User</option>
          <option value="priority">Priority</option>
        </select>
        <label>Sort By:</label>
        <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
      </div>
    </header>

    <div className="kanban-board">
      {Object.keys(groupedTickets()).map((group, idx) => {
        let groupLabel = group;

        if (grouping === 'priority') {
          const priorityLevels = ['No Priority', 'Low', 'Medium', 'High', 'Urgent'];
          groupLabel = priorityLevels[group] || group; // Map priority number to label
        }
       

        // Hardcoded SVGs for each priority level
        const renderIcon = () => {
          switch (groupLabel) {
            case 'No Priority':
              return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6.5C3.39782 6.5 3.77936 6.65804 4.06066 6.93934C4.34196 7.22064 4.5 7.60218 4.5 8C4.5 8.39782 4.34196 8.77936 4.06066 9.06066C3.77936 9.34196 3.39782 9.5 3 9.5C2.60218 9.5 2.22064 9.34196 1.93934 9.06066C1.65804 8.77936 1.5 8.39782 1.5 8C1.5 7.60218 1.65804 7.22064 1.93934 6.93934C2.22064 6.65804 2.60218 6.5 3 6.5ZM8 6.5C8.39782 6.5 8.77936 6.65804 9.06066 6.93934C9.34196 7.22064 9.5 7.60218 9.5 8C9.5 8.39782 9.34196 8.77936 9.06066 9.06066C8.77936 9.34196 8.39782 9.5 8 9.5C7.60218 9.5 7.22064 9.34196 6.93934 9.06066C6.65804 8.77936 6.5 8.39782 6.5 8C6.5 7.60218 6.65804 7.22064 6.93934 6.93934C7.22064 6.65804 7.60218 6.5 8 6.5ZM13 6.5C13.3978 6.5 13.7794 6.65804 14.0607 6.93934C14.342 7.22064 14.5 7.60218 14.5 8C14.5 8.39782 14.342 8.77936 14.0607 9.06066C13.7794 9.34196 13.3978 9.5 13 9.5C12.6022 9.5 12.2206 9.34196 11.9393 9.06066C11.658 8.77936 11.5 8.39782 11.5 8C11.5 7.60218 11.658 7.22064 11.9393 6.93934C12.2206 6.65804 12.6022 6.5 13 6.5Z" fill="#5C5C5E"/>
                </svg>
                
              );
            case 'Low':
              return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 8H2.5C1.94772 8 1.5 8.44772 1.5 9V13C1.5 13.5523 1.94772 14 2.5 14H3.5C4.05228 14 4.5 13.5523 4.5 13V9C4.5 8.44772 4.05228 8 3.5 8Z" fill="#5C5C5E"/>
                <path d="M8.5 5H7.5C6.94772 5 6.5 5.44772 6.5 6V13C6.5 13.5523 6.94772 14 7.5 14H8.5C9.05228 14 9.5 13.5523 9.5 13V6C9.5 5.44772 9.05228 5 8.5 5Z" fill="#5C5C5E" fill-opacity="0.4"/>
                <path d="M13.5 2H12.5C11.9477 2 11.5 2.44772 11.5 3V13C11.5 13.5523 11.9477 14 12.5 14H13.5C14.0523 14 14.5 13.5523 14.5 13V3C14.5 2.44772 14.0523 2 13.5 2Z" fill="#5C5C5E" fill-opacity="0.4"/>
                </svg>
              );
            case 'Medium':
              return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 8H2.5C1.94772 8 1.5 8.44772 1.5 9V13C1.5 13.5523 1.94772 14 2.5 14H3.5C4.05228 14 4.5 13.5523 4.5 13V9C4.5 8.44772 4.05228 8 3.5 8Z" fill="#5C5C5E"/>
                <path d="M8.5 5H7.5C6.94772 5 6.5 5.44772 6.5 6V13C6.5 13.5523 6.94772 14 7.5 14H8.5C9.05228 14 9.5 13.5523 9.5 13V6C9.5 5.44772 9.05228 5 8.5 5Z" fill="#5C5C5E"/>
                <path d="M13.5 2H12.5C11.9477 2 11.5 2.44772 11.5 3V13C11.5 13.5523 11.9477 14 12.5 14H13.5C14.0523 14 14.5 13.5523 14.5 13V3C14.5 2.44772 14.0523 2 13.5 2Z" fill="#5C5C5E" fill-opacity="0.4"/>
                </svg>
                
              );
            case 'High':
              return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3.5 8H2.5C1.94772 8 1.5 8.44772 1.5 9V13C1.5 13.5523 1.94772 14 2.5 14H3.5C4.05228 14 4.5 13.5523 4.5 13V9C4.5 8.44772 4.05228 8 3.5 8Z" fill="#5C5C5E"/>
                <path d="M8.5 5H7.5C6.94772 5 6.5 5.44772 6.5 6V13C6.5 13.5523 6.94772 14 7.5 14H8.5C9.05228 14 9.5 13.5523 9.5 13V6C9.5 5.44772 9.05228 5 8.5 5Z" fill="#5C5C5E"/>
                <path d="M13.5 2H12.5C11.9477 2 11.5 2.44772 11.5 3V13C11.5 13.5523 11.9477 14 12.5 14H13.5C14.0523 14 14.5 13.5523 14.5 13V3C14.5 2.44772 14.0523 2 13.5 2Z" fill="#5C5C5E"/>
                </svg>
                
              );
            case 'Urgent':
              return (
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 1C1.91067 1 1 1.91067 1 3V13C1 14.0893 1.91067 15 3 15H13C14.0893 15 15 14.0893 15 13V3C15 1.91067 14.0893 1 13 1H3ZM7 4H9L8.75391 8.99836H7.25L7 4ZM9 11C9 11.5523 8.55228 12 8 12C7.44772 12 7 11.5523 7 11C7 10.4477 7.44772 10 8 10C8.55228 10 9 10.4477 9 11Z" fill="#FB773F"/>
                </svg>
                
              );
            default:
              return null;
          }
        };



        const renderStatusIcon = () => {
          switch (groupLabel) {
              case 'Todo':
                  return (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="#B8B8B8" stroke-width="2"/>
                    </svg>
                    
                  );
              case 'In progress':
                  return (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" fill="white" stroke="#F2BE00" stroke-width="2"/>
                    <path d="M9 7C9 5.89543 8.10457 5 7 5C5.89543 5 5 5.89543 5 7C5 8.10457 5.89543 9 7 9C8.10457 9 9 8.10457 9 7Z" stroke="#F2BE00" stroke-width="4"/>
                    </svg>
                    
                  );
              case 'Backlog':
                  return (
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" stroke="#95999F" stroke-width="2" stroke-dasharray="1.4 1.74"/>
                    </svg>
                    
                  );
              case 'Done':
                    return (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M7 13C10.3137 13 13 10.3137 13 7C13 3.68629 10.3137 1 7 1C3.68629 1 1 3.68629 1 7C1 10.3137 3.68629 13 7 13Z" fill="#5E6AD2" stroke="#5E6AD2" stroke-width="2"/>
                    <path d="M10 7C10 5.34315 8.65685 4 7 4C5.34315 4 4 5.34315 4 7C4 8.65685 5.34315 10 7 10C8.65685 10 10 8.65685 10 7Z" stroke="#5E6AD2" stroke-width="6" stroke-dasharray="18.85 100"/>
                    <path d="M10.951 4.24896C11.283 4.58091 11.283 5.11909 10.951 5.45104L5.95104 10.451C5.61909 10.783 5.0809 10.783 4.74896 10.451L2.74896 8.45104C2.41701 8.11909 2.41701 7.5809 2.74896 7.24896C3.0809 6.91701 3.61909 6.91701 3.95104 7.24896L5.35 8.64792L9.74896 4.24896C10.0809 3.91701 10.6191 3.91701 10.951 4.24896Z" fill="#FBFBFB"/>
                </svg>

                      
                    );

                
              default:
                  return null; // No icon for unrecognized status
          }
      };
      // const renderPlus = () => {
      //   return (
      //     <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      //     <svg
      //       width="20"
      //       height="20"
      //       viewBox="0 0 16 16"
      //       fill="none"
      //       xmlns="http://www.w3.org/2000/svg"
      //       style={{ marginLeft: 'auto', marginRight: '30px', cursor: 'pointer' }}
      //     >
      //       <path
      //         d="M8 1V8H1V9H8V16H9V9H16V8H9V1H8Z"
      //         fill="#5C5C5E"
      //         stroke="#5C5C5E"
      //         strokeWidth="2"
      //       />
      //     </svg>
      //     </div>
      //   );
      // };
      const renderPlusAndDots = () => {
        return  (
          <div 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end',
              position: 'relative',
              top: '-20px' // This will move the whole container upward
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ cursor: 'pointer', marginRight: '8px' }}
            >
              <path
                d="M8 1V8H1V9H8V16H9V9H16V8H9V1H8Z"
                fill="#5C5C5E"
                stroke="#5C5C5E"
                strokeWidth="2"
              />
            </svg>
      
            {/* Three Dots Icon */}
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ cursor: 'pointer' }}
            >
              <circle cx="2" cy="8" r="1.5" fill="#5C5C5E" />
              <circle cx="8" cy="8" r="1.5" fill="#5C5C5E" />
              <circle cx="14" cy="8" r="1.5" fill="#5C5C5E" />
            </svg>
          </div>
        );
      };
      
      
























        return (
          <div key={idx} className="kanban-column">
            <h2>
              {/* {renderIcon()} Render the icon */}
           
                {renderIcon()}
              
             
                {renderStatusIcon()}
              
              {groupLabel} {renderCounts(group)}
              {renderPlusAndDots()}
            </h2>
            <div className="ticket-list">
              {sortedTickets(groupedTickets()[group]).map(ticket => (
                <TicketCard key={ticket.id} ticket={ticket} />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
};

// TicketCard component for displaying individual tickets
const TicketCard = ({ ticket }) => {
const priorityLevels = ['No Priority', 'Low', 'Medium', 'High', 'Urgent'];

return (
  <div className="ticket-card">
    <div className="ticket-id">{ticket.id}</div>
    <div className="ticket-title">{ticket.title}</div>
    <div className="ticket-priority">Priority: {priorityLevels[ticket.priority]}</div>
    <div className="ticket-assigned">Assigned to: {ticket.userId}</div>
  </div>
);
};

// Export the main component
export default App;