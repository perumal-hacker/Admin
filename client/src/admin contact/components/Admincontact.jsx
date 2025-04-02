// src/components/Admincontact.jsx
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Chat from "./Chat";
import '../styles/AdminPage.css';

const Admincontact = () => {
  const [callRequests, setCallRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [notes, setNotes] = useState({});
  const [actionTaken, setActionTaken] = useState({});
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    fetchCallRequests();
  }, []);

  const fetchCallRequests = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/call-requests');
      setCallRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching call requests:', error.response?.data || error.message);
      setLoading(false);
    }
  };

  const updateRequestStatus = async (requestId, newStatus, notes = '') => {
    try {
      await axios.put(`http://localhost:8080/api/call-request/${requestId}`, {
        status: newStatus,
        notes
      });
      fetchCallRequests();
    } catch (error) {
      console.error('Error updating status:', error.response?.data || error.message);
    }
  };

  const handleSolveClick = (requestId) => {
    updateRequestStatus(requestId, 'in-progress', 'Moved to in-progress');
  };

  const handleAction = (requestId, actionType) => {
    const request = callRequests.find(req => req._id === requestId);
    const currentNotes = notes[requestId] || request?.notes || '';
    let newNotes = currentNotes;

    switch(actionType) {
      case 'call':
        console.log(`Initiating phone call for request ${requestId}`);
        newNotes = `${currentNotes} | Started phone call`;
        break;
      case 'whatsapp-call':
        console.log(`Initiating WhatsApp call for request ${requestId}`);
        newNotes = `${currentNotes} | Started WhatsApp call`;
        break;
      case 'whatsapp-msg':
        console.log(`Sending WhatsApp message for request ${requestId}`);
        newNotes = `${currentNotes} | Sent WhatsApp message`;
        break;
      case 'chat-now':
        console.log(`Initiating chat for request ${requestId}`);
        newNotes = `${currentNotes} | Started chat`;
        handleChatOpen(requestId);
        break;
      case 'complete':
        newNotes = `${currentNotes} | Issue resolved`;
        break;
      default:
        break;
    }

    updateRequestStatus(requestId, actionType === 'complete' ? 'completed' : 'in-progress', newNotes);
    if (actionType === 'call' || actionType === 'whatsapp-call') {
      setActionTaken(prev => ({ ...prev, [requestId]: true }));
    }
  };

  const handleNotesChange = (requestId, value) => {
    setNotes(prev => ({ ...prev, [requestId]: value }));
  };

  const handleChatOpen = (requestId) => {
    const request = callRequests.find(req => req._id === requestId);
    setSelectedRequest(request);
    setIsChatOpen(true);
  };

  const handleChatClose = () => {
    setIsChatOpen(false);
    setSelectedRequest(null);
  };

  const filteredRequests = callRequests.filter(request => {
    const matchesSearch = request.userId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || request.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const pendingRequests = filteredRequests.filter(r => r.status === 'pending');
  const inProgressRequests = filteredRequests.filter(r => r.status === 'in-progress');
  const completedRequests = filteredRequests.filter(r => r.status === 'completed');

  if (loading) return <div className="loading">Loading...</div>;

  const renderTable = (requests, title, isPending = false, isInProgress = false) => (
    <div className="status-section">
      <h3>{title} ({requests.length})</h3>
      {requests.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Request Date</th>
              <th>Received By</th>
              <th>Status</th>
              <th>Actions</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((request) => (
              <tr key={request._id}>
                <td>{request.userId}</td>
                <td>{new Date(request.requestDate).toLocaleString()}</td>
                <td>{request.requestMethod === 'call' ? 'Call' : 'Message'}</td>
                <td>{request.status}</td>
                <td>
                  {isPending && (
                    <div className="action-buttons">
                      <button className="solve-btn" onClick={() => handleSolveClick(request._id)}>
                        🔧 Solve
                      </button>
                    </div>
                  )}
                  {isInProgress && (
                    <div className="action-buttons">
                      <button className="action-btn call" onClick={() => handleAction(request._id, 'call')}>
                        📞 Call
                      </button>
                      <button className="action-btn whatsapp-call" onClick={() => handleAction(request._id, 'whatsapp-call')}>
                        📱 WhatsApp Call
                      </button>
                      {actionTaken[request._id] && (
                        <button className="action-btn whatsapp-msg" onClick={() => handleAction(request._id, 'whatsapp-msg')}>
                          💬 WhatsApp Msg
                        </button>
                      )}
                      {request.requestMethod === 'message' && (
                        <button className="action-btn chat-now" onClick={() => handleAction(request._id, 'chat-now')}>
                          💬 Chat Now
                        </button>
                      )}
                      <button className="complete-btn" onClick={() => handleAction(request._id, 'complete')}>
                        ✓ Complete
                      </button>
                    </div>
                  )}
                </td>
                <td>
                  {isInProgress ? (
                    <textarea
                      value={notes[request._id] || request.notes || ''}
                      onChange={(e) => handleNotesChange(request._id, e.target.value)}
                      placeholder="Add notes..."
                      className="notes-input"
                    />
                  ) : (
                    request.notes || '-'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No {title.toLowerCase()} requests</p>
      )}
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h2>Admin - Call Request Management</h2>
        <div className="controls">
          <input
            type="text"
            placeholder="Search by User ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="status-filter"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <button className="refresh-btn" onClick={fetchCallRequests}>
            🔄 Refresh
          </button>
        </div>
      </div>
      <div className="requests-container">
        {renderTable(pendingRequests, 'Pending Requests', true, false)}
        {renderTable(inProgressRequests, 'In Progress Requests', false, true)}
        {renderTable(completedRequests, 'Completed Requests', false, false)}
      </div>
      {isChatOpen && selectedRequest && (
        <div className="chat-modal">
          <div className="chat-modal-content">
            <Chat onClose={handleChatClose} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Admincontact;