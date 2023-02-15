/*
 *
 The code represents a React component called LoginWidget, which is used for authentication and user login. 
 It uses the Okta authentication service and contains two other components: OktaSignInWidget and SpinnerLoading.

 The LoginWidget component receives a config object as a prop, which is not used in the code snippet provided.

 The useOktaAuth hook from @okta/okta-react package is used to initialize the oktaAuth and authState variables. 
 The oktaAuth variable contains the authentication state and authState contains the user's authorization status.

 The onSuccess function is used to handle a successful login attempt. 
 It takes in a tokens parameter and redirects the user to the application's main page using the oktaAuth.handleLoginRedirect method.

 The onError function is called if there is an error during the sign-in process. 
 It logs the error to the console.

 If the user is not authenticated, the SpinnerLoading component is rendered. 
 If the user is authenticated, a Redirect component is used to redirect the user to the main page of the application.
 *  
 */

import { Redirect } from "react-router-dom";
import { useOktaAuth } from "@okta/okta-react";
import { SpinnerLoading } from "../layouts/Utils/SpinnerLoading";
import OktaSignInWidget from "./OktaSignInWidget";

const LoginWidget = ({ config }) => {
    const { oktaAuth, authState } = useOktaAuth();
    const onSuccess = (tokens) => {
        oktaAuth.handleLoginRedirect(tokens);
    };

    const onError = (err) => {
        console.log('Sign in error: ', err);
    }

    if (!authState) {
        return (<SpinnerLoading />);
    }

    return authState.isAuthenticated ?
        <Redirect to={{ pathname: '/' }} />
        :
        <OktaSignInWidget config={config} onSuccess={onSuccess} onError={onError} />;
};

export default LoginWidget;