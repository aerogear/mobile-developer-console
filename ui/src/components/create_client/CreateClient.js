import React, { Component } from 'react';
import { Grid, Wizard, Button } from 'patternfly-react';
import PlatformItem from './PlatformItem'
import CreateAndroidClient from './CreateAndroidClient'
import CreateCordovaClient from './CreateCordovaClient'
import CreateIOSClient from './CreateIOSClient'
import CreateXamarinClient from './CreateXamarinClient'
import { ResultsLine } from './ResultsLine';

/**
 *  Component for the mobile client creation.
 */
class CreateClient extends Component {

    constructor(props) {
        super(props)
        this.baseState=this.state;
    }


    steps = ()=> [
        {
            title: 'Select mobile client platform',
            render: () => <div>
                <h2>Select mobile client platform</h2>
                <Grid bsClass="platform-items">
                    <Grid.Row>
                        <Grid.Col sm={6} md={2} >
                            <PlatformItem title="Android App" id="platform-android" inclass="fa fa-android" itemSelected={this.selectPlatform}/>
                        </Grid.Col>
                        <Grid.Col sm={6} md={2}>
                            <PlatformItem title="Cordova App" id="platform-cordova" itemSelected={this.selectPlatform}>
                                <span><img src="../../img/cordova.png" alt="Cordova" /></span>
                            </PlatformItem>
                        </Grid.Col>
                        <Grid.Col sm={6} md={2} >
                            <PlatformItem title="iOS App" id="platform-ios" inclass="fa fa-apple" itemSelected={this.selectPlatform} />
                        </Grid.Col>
                        <Grid.Col sm={6} md={2}>
                            <PlatformItem title="Xamarin App" id="platform-xamarin" itemSelected={this.selectPlatform}>
                                <span><img src="../../img/xamarin.svg" alt="Xamarin" /></span>
                            </PlatformItem>
                        </Grid.Col>
                    </Grid.Row>
                </Grid>
            </div>,
        }, {
            title: 'Mobile client parameters',
            render: this.renderClientSpecificForm                
        }, {
            title: 'Result',
            render: () => <div>
                <ResultsLine iconClass="fa fa-clock-o" text="App is being provisioned."/>                
            </div>
        }
    
    ]
    

    state = {
        showModal: false,
        loading: false,
        activeStepIndex: 0
    }

    selectPlatform = (state)=> {
        this.setState({activeStepIndex:1,platform:state.id})        
    }

    close = () => {
        this.setState({ showModal: false, loading: false });
    }

    open = () => {
        this.setState(this.baseState)
        this.setState({ showModal: true, loading: false })
    };

    configureClient = (state) => {
        this.setState({clientConfiguration:state.clientConfiguration})
    }

    renderClientSpecificForm= () => { 
        switch (this.state.platform) {
            case 'platform-android':
                return <CreateAndroidClient configureClient={this.configureClient}/>     
            case 'platform-cordova':
                return <CreateCordovaClient configureClient={this.configureClient}/>
            case 'platform-ios':
                return <CreateIOSClient configureClient={this.configureClient}/>
            case 'platform-xamarin':
                return <CreateXamarinClient configureClient={this.configureClient}/>
            default:
                break;
        }
    }

    
    nextStep = () => {
        if (this.state.activeStepIndex<this.steps().length -1 )
        this.setState({activeStepIndex:this.state.activeStepIndex+1})        
    }
    
    backStep = () => {
        if (this.state.activeStepIndex>0 )  {
            this.setState({activeStepIndex:this.state.activeStepIndex-1})        
        }
    }
    
    stepChanged = (step) => {

    }

    render() {
        return (
            <div>
                <Button bsStyle="primary" bsSize="large" onClick={this.open}>
                    Launch Stateless Wizard
                </Button>
                <Wizard.Pattern
                    show={this.state.showModal}
                    onHide={this.close}
                    onExited={this.close}
                    title="Create mobile client"
                    shouldDisableNextStep={activeStepIndex => false}
                    steps={this.steps()}
                    loadingTitle="Creating mobile client..."
                    loadingMessage="This may take a minute."
                    loading={this.state.loading}
                    stepButtonsDisabled={true}
                    nextStepDisabled={this.state.activeStepIndex==0 && this.state.platform===undefined}
                    prevStepDisabled={this.state.activeStepIndex>1}
                    onStepChanged={this.stepChanged}
                    nextText={this.state.activeStepIndex==1?"Create":"Next"}
                    onNext={this.nextStep}
                    onBack={this.backStep}
                    activeStepIndex={this.state.activeStepIndex}                    
                />

            </div>
        )
    }
}

export default CreateClient;
