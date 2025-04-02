const createMeeting = async (token) => {
  const response = await fetch('http://localhost:8080/create-meeting', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  });

  if (!response.ok) {
    throw new Error('Failed to create meeting: ' + response.statusText);
  }

  const data = await response.json();
  return data.meetLink;
};

export default createMeeting;