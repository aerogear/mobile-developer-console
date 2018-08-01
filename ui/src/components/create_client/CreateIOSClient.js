import React, { Component } from 'react';
import { Form  } from 'patternfly-react';
import { renderForm } from './CreateClientFormUtils';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateIOSClient extends Component {
    render() {
        const formFields = [
            {
                controlId:'appName',
                label:'* Application Name',
                useFieldLevelHelp: true,
                content:'Enter application name (like <em>myapp</em>)',
                formControl: ({ validationState, ...props }) => (
                    <Form.FormControl type="text" {...props} />
                  )
            },
            {
                controlId:'appIdentifier',
                label:'* Bundle ID',
                useFieldLevelHelp: true,
                content:'Enter bundle ID (like <em>org.aerogear.ios.myapp</em>)',
                formControl: ({ validationState, ...props }) => (
                    <Form.FormControl type="text" {...props} />
                  )
            },
        ] 
                        
        return renderForm("Configure iOS app",formFields);
    }

}

export default CreateIOSClient