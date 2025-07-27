import { GoogleOAuthProvider } from '@react-oauth/google'

const GoogleAuthProvider = ({ children }) => {
  // You'll need to replace this with your actual Google OAuth Client ID
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"
  
  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  )
}

export default GoogleAuthProvider
