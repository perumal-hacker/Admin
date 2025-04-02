import { GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { useState } from 'react';
import createMeeting from './googleCalendar';
import '../styles/meet.css';

const LoginButton = () => {
  const [meetLink, setMeetLink] = useState(null);

  const login = useGoogleLogin({
    scope: 'https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email',
    flow: 'auth-code',
    prompt: 'consent',
    onSuccess: async (codeResponse) => {
      console.log('Authorization Code Response:', codeResponse);
      const code = codeResponse.code;

      try {
        const response = await fetch('http://localhost:8080/exchange-code', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error('Failed to exchange code: ' + response.statusText);
        }

        const { accessToken } = await response.json();
        console.log('Received Access Token:', accessToken);
        localStorage.setItem('google_token', accessToken);

        const meetLink = await createMeeting(accessToken);
        console.log('Meeting Link Created:', meetLink);
        setMeetLink(meetLink);
      } catch (error) {
        console.error('Error exchanging code or creating meeting:', error);
      }
    },
    onError: (error) => console.error('Login Failed:', error),
  });

  return (
    <div className="login-container">
      <button className="google-signin-btn" onClick={() => login()}>
        Sign in with Google
      </button>
      {meetLink && (
        <div className="meeting-link">
          <h2 className="meeting-title">Your Meeting is Ready!</h2>
          <a className="join-link" href={meetLink} target="_blank" rel="noopener noreferrer">
            Join Google Meet
          </a>
        </div>
      )}
    </div>
  );
};

function GoogleMeet() {
  // Log the client ID from the environment
  console.log('Client ID from env:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
  
  // Use the environment variable with a fallback
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-default-client-id-here';

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <div className="app-container">
        <h1 className="app-title">Google Meet Integration</h1>
        <p className="app-subtitle">Sign in to create a meeting</p>
        <LoginButton />
      </div>
    </GoogleOAuthProvider>
  );
}

export default GoogleMeet;