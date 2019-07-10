import { shallow } from 'enzyme';
import React from 'react';

import Duration from './Duration';

describe('Duration component static values', () => {
  it('duartion has ran for some seconds', () => {
    const duration = 10000;
    const inProgress = true;

    const wrapper = shallow(<Duration duration={duration} inProgress={inProgress} />);

    expect(wrapper.text()).toEqual('10s');
  });

  it('duartion has ran for some minutes and seconds', () => {
    const duration = 100000;
    const inProgress = true;

    const wrapper = shallow(<Duration duration={duration} inProgress={inProgress} />);

    expect(wrapper.text()).toEqual('1m 40s');
  });

  it('duartion has ran for some hours, minutes and seconds', () => {
    const duration = 10000000;
    const inProgress = true;

    const wrapper = shallow(<Duration duration={duration} inProgress={inProgress} />);

    expect(wrapper.text()).toEqual('2h 46m 40s');
  });

  it('duartion has ran for no time', () => {
    const duration = null;
    const inProgress = true;

    const wrapper = shallow(<Duration duration={duration} inProgress={inProgress} />);

    expect(wrapper.text()).toEqual('0s');
  });
});

describe('duration mounting function', () => {
  const duration = null;
  const inProgress = true;

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('componentDidMount', () => {
    const componentDidMountSpy = jest.spyOn(Duration.prototype, 'componentDidMount');
    const wrapper = shallow(<Duration duration={duration} inProgress={inProgress} />);

    expect(wrapper.text()).toEqual('0s'); // tested to pass eslint
    expect(componentDidMountSpy).toHaveBeenCalledTimes(1);
  });

  it('componentWillUnmount', () => {
    const componentWillUnmountSpy = jest.spyOn(Duration.prototype, 'componentWillUnmount');

    const wrapper = shallow(<Duration duration={duration} inProgress={inProgress} />);

    Duration.prototype.componentWillUnmount();
    expect(wrapper.text()).toEqual('0s'); // tested to pass eslint
    expect(componentWillUnmountSpy).toHaveBeenCalled();
  });
});

describe('duration tick function', () => {
  const duration = null;
  const inProgress = true;
  it('tick rolls to three', () => {
    const wrapper = shallow(<Duration duration={duration} inProgress={inProgress} />);
    expect(wrapper.instance().state.timeSinceLastUpdate).toEqual(0);

    wrapper.instance().tick();
    expect(wrapper.instance().state.timeSinceLastUpdate).toEqual(1);

    wrapper.instance().tick();
    expect(wrapper.instance().state.timeSinceLastUpdate).toEqual(2);

    wrapper.instance().tick();
    expect(wrapper.instance().state.timeSinceLastUpdate).toEqual(3);
  });
});
