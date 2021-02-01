import React from 'react';

class LogIn extends React.Component {
    render() {
        return (
            <div className="log__in">
                <div
                    className="fb-login-button"
                    data-width="300px" data-size="large"
                    data-button-type="login_with"
                    data-layout="rounded"
                    data-auto-logout-link="false"
                    data-use-continue-as="true"
                    data-onlogin="FB.getLoginStatus(response => {
                        if(response.status === 'connected') { 
                            window.location.replace('/');
                        }
                    })"
                    scope="public_profile,email">
                </div>
            </div>
        )
    }
}

export default LogIn;