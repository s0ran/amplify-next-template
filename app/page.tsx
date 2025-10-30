import { cookiesClient } from '@/lib/server-client';
import { AuthGetCurrentUserServer } from '@/lib/amplify-utils';
// import { getBreadcrumbData } from '@/lib/breadcrumb';
// import ReloadButton from './ReloadButton';
// import { getCurrentUser } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function Page() {

  // 認証チェック
  const authResult = await AuthGetCurrentUserServer();
  console.log('認証済みユーザー:', authResult);
  
  if (!authResult.success) {
    console.log('未認証ユーザー、リダイレクト');
    redirect('/auth/signin');
  }

  console.log('cookies');
  console.log(cookies);
  console.log({cookies});
  console.log('=== Starting test-faithful page ===');

  // 1つのページ表示で複数のGraphQLクエリを実行
  const spaceId = 'test-space-id';

  console.log('Calling Space.get...');
  let space;
  for (let i: number = 0; i < 60; i++){
    space = await cookiesClient.models.Space.get({ id: spaceId });
  }
  console.log('Space.get completed');

  console.log('Calling StorageItem.list...');
  const items = await cookiesClient.models.StorageItem.list();
  console.log('StorageItem.list completed, count:', items.data.length);

  console.log('Calling getBreadcrumbData...');
//   const breadcrumb = await getBreadcrumbData('test-item-id'); // 内部で再帰的にStorageItem.get()を複数回実行
//   console.log('getBreadcrumbData completed, levels:', breadcrumb.length);

  console.log('=== test-faithful page completed ===');

  return (
      <div style={{ padding: '20px' }}>
      <h1>Faithful Reproduction Test</h1>
      <div>
        <h2>Space</h2>
        <pre>{JSON.stringify(space?.data, null, 2)}</pre>
      </div>
      <div>
        <h2>Items (Total: {items.data.length})</h2>
        <pre>{JSON.stringify(items.data, null, 2)}</pre>
      </div>
    </div>
  );
}