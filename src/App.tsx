import { useState, useEffect } from 'react';
import { WelcomeScreen } from './components/WelcomeScreen';
import { Gallery } from './pages/Gallery';
import { LoadingScreen } from './components/LoadingScreen';
import { ToastContainer } from './components/Toast';
import { useUserStore } from './store/userStore';
import { getCookie, GUEST_COOKIE_KEY } from './utils/cookies';
import { UserService } from './services/userService';

function App() {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated, user, setUser } = useUserStore();

  useEffect(() => {
    let isMounted = true;

    const bootstrapFromCookie = async () => {
      if (user) return;
      const cookieId = getCookie(GUEST_COOKIE_KEY);
      if (!cookieId) return;

      try {
        const cookieUser = await UserService.getUser(cookieId);
        if (cookieUser && isMounted) {
          setUser(cookieUser);
        }
      } catch {
        // ignore cookie failures silently
      }
    };

    bootstrapFromCookie();

    const timer = setTimeout(() => {
      if (isMounted) {
        setLoading(false);
      }
    }, 1000);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [user, setUser]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      {!isAuthenticated || !user ? (
        <WelcomeScreen onComplete={() => { }} />
      ) : (
        <Gallery />
      )}
      <ToastContainer />
    </>
  );
}

export default App;
