/*
 *
  If the user is not authenticated, the OktaSignInWidget component is used to show a sign-in form. 
  The OktaSignInWidget component receives two props: onSuccess and onError. 
  These are callback functions that are passed to the OktaSignInWidget component and are called when the user signs in or if there is an error. 
  The OktaSignInWidget component also imports the OktaSignIn module and the OktaConfig object from the ../lib/OktaConfig file. 
  It initializes a widgetRef with the useRef hook and renders a div with a widgetRef reference.

  When the useEffect hook is called, it initializes a new instance of the OktaSignIn module and calls the showSignInToGetTokens method, 
  which takes in the widgetRef as a parameter. If the sign-in is successful, the onSuccess function is called, and if there is an error, 
  the onError function is called. The useEffect hook returns a function that removes the widget when it is unmounted.
 *
 */ 

import { useEffect, useRef } from "react";
import OktaSignIn from '@okta/okta-signin-widget';
import '@okta/okta-signin-widget/dist/css/okta-sign-in.min.css';
import { OktaConfig } from '../lib/OktaConfig';

const OktaSignInWidget = ({ onSuccess, onError }) => {
    const widgetRef = useRef();

    useEffect(() => {
        if(!widgetRef.current){
            return false;
        }

        const widget = new OktaSignIn(OktaConfig);

        widget.showSignInToGetTokens({
            el:widgetRef.current,
        }).then(onSuccess).catch(onError);

        return () => widget.remove();
    }, [onSuccess, onError]);

    return (
        <div className="container mt-5 mb-5">
            <div ref={widgetRef}></div>
        </div>
    );
}

export default OktaSignInWidget