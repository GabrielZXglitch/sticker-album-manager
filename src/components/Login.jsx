import { useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signInWithRedirect 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'Email inválido.';
      case 'auth/user-disabled':
        return 'Usuário desativado.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Email ou senha incorretos.';
      case 'auth/email-already-in-use':
        return 'Este email já está cadastrado.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      case 'auth/too-many-requests':
        return 'Muitas tentativas. Tente novamente mais tarde.';
      case 'auth/popup-blocked':
        return 'Popup bloqueado. Tentando redirecionamento...';
      default:
        return `Erro: ${code}`;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
      }
    } catch (err) {
      console.error("Auth error:", err.code, err.message);
      setError(getErrorMessage(err.code));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (err) {
      console.error("Popup error:", err.code, err.message);
      if (err.code === 'auth/popup-blocked') {
        try {
          await signInWithRedirect(auth, googleProvider);
        } catch (redirectErr) {
          console.error("Redirect error:", redirectErr.code, redirectErr.message);
          setError(getErrorMessage(redirectErr.code));
        }
      } else {
        setError(getErrorMessage(err.code));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background p-container-padding">
      <div className="text-display text-primary mb-8 tracking-tight">StickerAlbum</div>
      <div className="bg-surface border border-outline-variant rounded-xl p-8 shadow-sm max-w-sm w-full">
        <h1 className="text-headline-md text-on-surface mb-4 text-center">
          {isLogin ? 'Entrar' : 'Criar Conta'}
        </h1>
        <p className="text-body-md text-on-surface-variant mb-8 text-center">
          {isLogin 
            ? 'Acesse sua coleção de figurinhas.' 
            : 'Comece a gerenciar seu álbum agora.'}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-label-lg text-on-surface-variant uppercase font-bold">E-mail</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-surface-container px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary text-body-lg"
              placeholder="seu@email.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-label-lg text-on-surface-variant uppercase font-bold">Senha</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-surface-container px-4 py-3 rounded-lg border border-outline-variant outline-none focus:ring-2 focus:ring-primary text-body-lg"
              placeholder="••••••"
            />
          </div>

          {error && (
            <div className="text-error text-label-lg bg-error-container/20 p-3 rounded-lg border border-error/20 font-bold">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-primary text-on-primary font-bold px-6 py-4 rounded-xl hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <div className="relative my-8 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-outline-variant"></div>
          </div>
          <span className="relative bg-surface px-4 text-label-sm text-on-surface-variant uppercase">ou</span>
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full flex items-center justify-center gap-3 bg-surface border border-outline-variant text-on-surface font-bold px-6 py-4 rounded-xl hover:bg-surface-container transition-colors shadow-sm disabled:opacity-50"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          Entrar com Google
        </button>

        <div className="mt-8 pt-6 border-t border-outline-variant text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre aqui'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
