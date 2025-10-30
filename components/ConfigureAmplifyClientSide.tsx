"use client";

import { Amplify } from "aws-amplify";
import { cognitoUserPoolsTokenProvider } from "aws-amplify/auth/cognito";
import { CookieStorage } from "aws-amplify/utils";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs, { ssr: true });

cognitoUserPoolsTokenProvider.setKeyValueStorage(new CookieStorage());

export default function ConfigureAmplifyClientSide() {
  return null;
}