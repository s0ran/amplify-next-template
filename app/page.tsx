import { cookiesClient } from '@/lib/server-client';
import { AuthGetCurrentUserServer } from '@/lib/amplify-utils';
// import { getBreadcrumbData } from '@/lib/breadcrumb';
// import ReloadButton from './ReloadButton';
// import { getCurrentUser } from 'aws-amplify/auth/server';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

import { Amplify } from "aws-amplify";
import { parseAmplifyConfig } from "aws-amplify/utils";
import outputs from "@/amplify_outputs.json";
import { generateClient } from 'aws-amplify/api/server';
import { type Schema } from '@/amplify/data/resource';
import { createServerRunner } from '@aws-amplify/adapter-nextjs';

const { runWithAmplifyServerContext } = createServerRunner({
  config: outputs,
});


const amplifyConfig = parseAmplifyConfig(outputs);
const client = generateClient<Schema>({ config: amplifyConfig });

export default async function Page() {

  // 認証チェック
  try {
    const user = await AuthGetCurrentUserServer();
    console.log('認証済みユーザー:', user);
  } catch (error) {
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

//   let space
//   runWithAmplifyServerContext({
//     nextServerContext: { cookies },
//     operation: async (contextSpec) => {
//       // the for loop is running within the same context
//     //   for (let i: number = 0; i < 60; i++){
//     //       space = await client.models.Space.get(contextSpec, { id: spaceId });
//     //       console.log("space get called");
//     //   }
//     }
//   })

  console.log('Space.get completed');

  return (
      <div style={{ padding: '20px' }}>
        <h1>Faithful Reproduction Test</h1>
      </div>
  );
}