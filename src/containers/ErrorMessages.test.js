// import { mount } from 'enzyme';
// import React from 'react';
import { errorMessage, mobileClientError, MOBILECLIENT, ALREADYEXISTS } from './ErrorMessages';

describe('ErrorMessages', () => {
  it('test render', () => {
    // const errors = [{ message: 'error1' }, { message: 'error2' }];
    // const history = {
    //   listen: () => {}
    // };
    // const wrapper = mount(<ErrorMessages errors={errors} history={history} />);
    // expect(wrapper.find('.alert.toast-pf')).toHaveLength(2);
    // expect(
    //   wrapper
    //     .find('div.mdc-alert-group')
    //     .childAt(0)
    //     .text()
    // ).toEqual('error1');
    //   expect(
    //     wrapper
    //       .find('div.mdc-alert-group')
    //       .childAt(1)
    //       .text()
    //   ).toEqual('error2');
  });
});

const ERRORMESSAGE = 'error message';
const APPNAME = 'myapp';

describe('mobileClientError() returns correct value', () => {
  it('return alreadyesixts Switch Case error message', () => {
    const expected = `An app named "${APPNAME}" already exists`;
    const error = {
      message: ERRORMESSAGE,
      response: { data: { details: { name: APPNAME }, reason: ALREADYEXISTS } }
    };
    expect(mobileClientError(error)).toEqual(expected);
  });

  it('Default case for response.data.reason error message returned', () => {
    const expected = ERRORMESSAGE;
    const error = { message: ERRORMESSAGE, response: { data: { reason: 'unknown' } } };
    expect(mobileClientError(error)).toEqual(expected);
  });

  it('value response.data.reason does not exist', () => {
    const expected = ERRORMESSAGE;
    const error = { message: ERRORMESSAGE };
    expect(mobileClientError(error)).toEqual(expected);
  });

  it('value response.data.details.name does not exist', () => {
    const expected = `An app named "undefined" already exists`;
    const error = {
      message: ERRORMESSAGE,
      response: { data: { reason: ALREADYEXISTS } }
    };
    expect(mobileClientError(error)).toEqual(expected);
  });
});

describe('errorMessage() returns correct value', () => {
  it('error message for a mobileClient CR Switch Case', () => {
    const expected = { displayMessage: `An app named "${APPNAME}" already exists`, message: ERRORMESSAGE };
    const error = {
      message: ERRORMESSAGE,
      response: { data: { details: { kind: MOBILECLIENT, name: APPNAME }, reason: ALREADYEXISTS } }
    };
    expect(errorMessage(error)).toEqual(expected);
  });

  it('No Switch Case for CR found, Default return', () => {
    const expected = { message: ERRORMESSAGE };
    const error = {
      message: ERRORMESSAGE,
      response: { data: { details: { kind: 'fake CR' }, reason: ALREADYEXISTS } }
    };
    expect(errorMessage(error)).toEqual(expected);
  });

  it('value response.data.details.kind does not exist', () => {
    const expected = { message: ERRORMESSAGE };
    const error = { message: ERRORMESSAGE };
    expect(errorMessage(error)).toEqual(expected);
  });
});
