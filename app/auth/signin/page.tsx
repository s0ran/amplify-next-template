// app/auth/signin/page.tsx
"use client";

import { useState, useEffect } from 'react';
import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/navigation';
import { getCurrentUser } from 'aws-amplify/auth';
import Link from 'next/link';

export default function SignIn() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const router = useRouter();

  // 既に認証されているかチェック
  useEffect(() => {
    async function checkAuth() {
      try {
        await getCurrentUser();
        // 認証済みの場合はメインページにリダイレクト
        router.push('/');
      } catch (error) {
        // 未認証の場合は何もしない
      } finally {
        setIsCheckingAuth(false);
      }
    }

    checkAuth();
  }, [router]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await signIn({ username, password });
      router.push('/');
    } catch (error) {
      console.error('サインインエラー:', error);
      setError('ユーザー名またはパスワードが正しくありません');
    } finally {
      setIsLoading(false);
    }
  }

  if (isCheckingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>読み込み中...</p>
      </div>
    );
  }
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        width: '100%',
        maxWidth: '400px',
        padding: '20px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px', fontSize: '24px', fontWeight: 'bold' }}>
          サインイン
        </h1>

        {error && (
          <div style={{
            padding: '10px',
            marginBottom: '20px',
            backgroundColor: '#ffebee',
            color: '#c62828',
            borderRadius: '4px'
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              ユーザー名 / メールアドレス
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500' }}>
              パスワード
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '10px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                fontSize: '16px'
              }}
              required
            />
            <div style={{ textAlign: 'right', marginTop: '8px' }}>
              <Link href="/auth/forgot-password" style={{ color: '#2196f3', textDecoration: 'none', fontSize: '14px' }}>
                パスワードをお忘れですか？
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#2196f3',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              opacity: isLoading ? 0.7 : 1
            }}
          >
            {isLoading ? 'サインイン中...' : 'サインイン'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', color: '#666' }}>
            アカウントをお持ちでないですか？{' '}
            <Link href="/auth/signup" style={{ color: '#2196f3', textDecoration: 'none' }}>
              新規登録
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
