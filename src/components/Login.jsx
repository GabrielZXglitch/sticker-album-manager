import { signInWithRedirect } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const Login = () => {
  const handleLogin = async () => {
    try {
      await signInWithRedirect(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-container-padding">
      <div className="text-display text-primary mb-8 tracking-tight">StickerAlbum</div>
      <div className="bg-surface border border-outline-variant rounded-xl p-8 shadow-sm max-w-sm w-full text-center">
        <h1 className="text-headline-md text-on-surface mb-4">Welcome back!</h1>
        <p className="text-body-md text-on-surface-variant mb-8">
          Sign in to manage your collection and trade stickers.
        </p>
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-primary text-on-primary font-label-lg px-6 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm"
        >
          <span className="material-symbols-outlined">account_circle</span>
          Sign in with Google
        </button>
      </div>
    </div>
  );
};

export default Login;
