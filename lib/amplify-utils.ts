import { createServerRunner } from '@aws-amplify/adapter-nextjs';
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/api';
import { fetchAuthSession,getCurrentUser } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';

import { type Schema } from '@/amplify/data/resource';
import outputs from '@/amplify_outputs.json';

export const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});



export async function AuthGetCurrentUserServer() {
  console.log('AuthGetCurrentUserServer: 認証情報取得を開始...');

  try {
    console.log('cookies オブジェクトの確認:', cookies() ? '存在します' : '存在しません');

    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => {
        console.log('contextSpec を使用して getCurrentUser を呼び出し中...');
        try {
          const user = await getCurrentUser(contextSpec);
          console.log('ユーザー情報取得成功:', user.username);
          console.log('ユーザー情報取得成功 all information:', user);
          return user;
        } catch (innerError) {
          console.error('getCurrentUser 内部エラー:', innerError);
          throw innerError; // 上位のcatchブロックで処理するために再スロー
        }
      },
    });

    console.log('認証情報取得完了:', currentUser.username);
    return {
      success: true,
      user: currentUser
    };
  } catch (error) {
    console.error('認証情報取得失敗:', error);

    // エラーの種類に基づいた詳細情報
    let errorMessage = '認証情報の取得に失敗しました';
    let errorType = 'UNKNOWN_ERROR';

    if (error instanceof Error) {
      errorMessage = error.message;

      // エラーメッセージに基づいたエラータイプの特定
      if (error.message.includes('No current user')) {
        errorType = 'NO_CURRENT_USER';
      } else if (error.message.includes('Token expired')) {
        errorType = 'TOKEN_EXPIRED';
      }
    }

    return {
      success: false,
      error: errorMessage,
      errorType: errorType
    };
  }
};
export const isAuthenticated = async () =>
  await runWithAmplifyServerContext({
    nextServerContext: { cookies },
    async operation(contextSpec) {
      try {
        const user = await getCurrentUser(contextSpec);
        return Boolean(user);
      } catch (error) {
        console.error(error);
        return false;
      }
    }
  });


export const cookiesClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies,
});

// 非推奨: 代わりに getAuthInfo() を使用してください
// export async function isAdminServer(): Promise<boolean>
// export async function isReadOnlyServer(): Promise<boolean>
// export async function canWriteServer(): Promise<boolean>

// 認証情報を一度に取得して重複呼び出しを回避
async function getAuthInfo(): Promise<{
  user: { userId: string } | null;
  isAdmin: boolean;
  canWrite: boolean;
  isReadOnly: boolean;
}> {
  try {
    const [user, session] = await Promise.all([
      runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: (contextSpec) => getCurrentUser(contextSpec),
      }),
      runWithAmplifyServerContext({
        nextServerContext: { cookies },
        operation: (contextSpec) => fetchAuthSession(contextSpec),
      })
    ]);

    const groups: string[] =
      session.tokens?.accessToken.payload['cognito:groups'] as string[] ?? [];

    const isAdmin = groups.includes('ADMIN');
    const canWrite = isAdmin || groups.includes('STAFF');
    const isReadOnly = groups.includes('READONLY');

    return {
      user,
      isAdmin,
      canWrite,
      isReadOnly
    };
  } catch (error) {
    console.error('getAuthInfo error:', error);
    return {
      user: null,
      isAdmin: false,
      canWrite: false,
      isReadOnly: false
    };
  }
}