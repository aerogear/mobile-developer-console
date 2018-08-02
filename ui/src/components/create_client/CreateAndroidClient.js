import React, { Component } from 'react';
import { Form } from 'patternfly-react';
import { renderForm, validateId, validateAppName } from './CreateClientFormUtils';

/**
 * Component for the Android specific create mobile client form.
 */
class CreateAndroidClient extends Component {

    state={}

    formChanged = (id, change) => {
        let state = {}
        state[id] = change
        this.setState(state)
        this.configureClient && this.configureClient(state)
    }

    render() {
        const formFields = [
            {
                controlId: 'appName',
                label: '* Application Name',
                useFieldLevelHelp: true,
                content: 'Enter application name (like <em>myapp</em>)',
                formControl: ({ validationState, ...props }) => (
                    <Form.FormControl type="text" {...props} />
                ),
                formGroupProps: {
                    validationState: validateId(this.state ? this.state.appName : "")
                },
                onChange: (e) => this.formChanged('appName', e.target.value)
            },
            {
                controlId: 'appIdentifier',
                label: '* Package Name',
                useFieldLevelHelp: true,
                content: 'Enter package name (like <em>org.aerogear.android.myapp</em>)',
                formControl: ({ validationState, ...props }) => (
                    <Form.FormControl type="text" {...props} />
                ),
                formGroupProps: {
                    validationState: validateAppName(this.state ? this.state.appIdentifier : "")
                },
                onChange: (e) => this.formChanged('appIdentifier', e.target.value)
            },
        ]

        return renderForm("Configure Android App", formFields);
    }

}

export default CreateAndroidClient