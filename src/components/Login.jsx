import { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const getErrorMessage = (code) => {
    switch (code) {
      case 'auth/invalid-email':
        return 'E-mail inválido.';
      case 'auth/user-disabled':
        return 'Usuário desativado.';
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'E-mail ou senha incorretos.';
      case 'auth/email-already-in-use':
        return 'Este e-mail já está cadastrado.';
      case 'auth/weak-password':
        return 'A senha deve ter pelo menos 6 caracteres.';
      default:
        return 'Ocorreu um erro. Tente novamente.';
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
      setError(getErrorMessage(err.code));
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
            <label className="text-label-lg text-on-surface-variant uppercase">E-mail</label>
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
            <label className="text-label-lg text-on-surface-variant uppercase">Senha</label>
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
            <div className="text-error text-label-lg bg-error-container/20 p-3 rounded-lg border border-error/20">
              {error}
            </div>
          )}

          <button
            disabled={loading}
            type="submit"
            className="w-full flex items-center justify-center gap-3 bg-primary text-on-primary font-label-lg px-6 py-3 rounded-lg hover:bg-primary-container transition-colors shadow-sm disabled:opacity-50"
          >
            {loading ? 'Processando...' : (isLogin ? 'Entrar' : 'Cadastrar')}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-outline-variant text-center">
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-primary font-label-lg hover:underline"
          >
            {isLogin ? 'Não tem uma conta? Cadastre-se' : 'Já tem uma conta? Entre aqui'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
