"use client";

import React, { useEffect } from "react";
import { Amplify } from "aws-amplify";
import {
  Authenticator,
  Heading,
  Radio,
  RadioGroupField,
  useAuthenticator,
  View,
} from "@aws-amplify/ui-react";
import "@aws-amplify/ui-react/styles.css";
import { useRouter, usePathname } from "next/navigation";

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID!,
      userPoolClientId:
        process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_CLIENT_ID!,
    },
  },
});

const components = {
    SignIn: {
        Header() {
            return (
                <View className='mt-4 mb-7'>
                    <Heading level={3} className='!text-2xl !font-bold'>
                        RENT
                        <span className="text-red-500 font-light hover:!text-gray-300">
                            IFUL
                        </span>
                    </Heading>
                    <p className="text-muted-foreground mt-2">
                        <span className="font-bold">Please sign in to continue</span>
                    </p>
                </View>
            )
        },
        Footer() {
            const { toSignUp } = useAuthenticator();
            return (
                <View className='text-center mt-4'>
                    <p className="text-muted-foreground">
                        Don&apos;t have an account?{" "}
                        <button 
                            onClick={toSignUp}
                            className="text-primary hover:underline cursor-pointer bg-transaparent border-none p-0"
                        >
                            Sign up here
                        </button>
                    </p>
                </View>
            )
        }
    },
    SignUp: {
        Header() {
            return (
                <View className='mt-4 mb-7'>
                    <Heading level={3} className='!text-2xl !font-bold'>
                        RENT
                        <span className="text-red-500 font-light hover:!text-gray-300">
                            IFUL
                        </span>
                    </Heading>
                    <p className="text-muted-foreground mt-2">
                        <span className="font-bold">Please sign up to continue</span>
                    </p>
                </View>
            )
        },
        FormFields() {
            const { validationErrors } = useAuthenticator();
            return (
                <>
                    <Authenticator.SignUp.FormFields />
                    <RadioGroupField
                        legend='Role'
                        name='custom:role'
                        errorMessage={validationErrors?.["custom.role"]}
                        hasError={!!validationErrors?.["custom.role"]}
                        isRequired
                    >
                        <Radio value="tenant">Tenant</Radio>
                        <Radio value="manager">Manager</Radio>
                    </RadioGroupField>
                </>
            )
        },
        Footer() {
            const { toSignIn } = useAuthenticator();
            return (
                <View className='text-center mt-4'>
                    <p className="text-muted-foreground">
                        Already have an account?{" "}
                        <button 
                            onClick={toSignIn}
                            className="text-primary hover:underline cursor-pointer bg-transaparent border-none p-0"
                        >
                            Sign in here
                        </button>
                    </p>
                </View>
            )
        },
    },
};

const formFields = {
  signIn: {
    username: {
      placeholder: "Enter your email",
      label: "Email",
      isRequired: true,
    },
    password: {
      placeholder: "Enter your password",
      label: "Password",
      isRequired: true,
    },
  },
  signUp: {
    username: {
      order: 1,
      placeholder: "Choose a username",
      label: "Username",
      isRequired: true,
    },
    email: {
      order: 2,
      placeholder: "Enter your email address",
      label: "Email",
      isRequired: true,
    },
    password: {
      order: 3,
      placeholder: "Create a password",
      label: "Password",
      isRequired: true,
    },
    confirm_password: {
      order: 4,
      placeholder: "Confirm your password",
      label: "Confirm Password",
      isRequired: true,
    },
  },
};

const Auth = ({ children }: { children: React.ReactNode }) => {
    const { user } = useAuthenticator((context) => [context.user]);
    const router = useRouter();
    const pathName = usePathname();

    const isAuthPage = pathName.match(/^\/(signin|signup)$/);
    const isDashboardPage = pathName.startsWith("/manager") || pathName.startsWith("/tenants");

    // redirect authenticated users from the auth pages
    useEffect(() => {
        if(user && isAuthPage) {
            router.push("/");
        }
    }, [user, isAuthPage, router]);

    // allow access to public pages without authentictaion
    if(!isAuthPage && !isDashboardPage) {
        return <>{children}</>;
    }

    return (
    <div className="h-full">
        <Authenticator
            initialState={pathName.includes("signup") ? "signUp" : "signIn"}
            components={components}
            formFields={formFields}
        >
            {() => <>{children}</>}
        </Authenticator>
    </div>
  );
}

export default Auth;