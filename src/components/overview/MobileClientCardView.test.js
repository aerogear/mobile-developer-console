import { shallow } from 'enzyme';
import React from 'react';
import MobileClientCardView from './MobileClientCardView';

const setup = (propOverrides = {}) => {
  const defaultProps = {
    mobileClients: [
      {
        metadata: {
          name: 'my-app'
        },
        status: {
          services: []
        },
        spec: {
          name: 'my-app'
        }
      },
      {
        metadata: {
          name: 'your-app'
        },
        status: {
          services: []
        },
        spec: {
          name: 'your-app'
        }
      }
    ],
    mobileServiceInstances: [],
    mobileClientBuilds: [
      {
        status: {
          phase: 'Failed'
        },
        metadata: {
          labels: {
            'mobile-client-id': 'my-app'
          },
          annotations: {
            'openshift.io/build-config.name': 'build-config',
            'openshift.io/build.number': 1
          }
        }
      },
      {
        status: {
          phase: 'Running'
        },
        metadata: {
          labels: {
            'mobile-client-id': 'my-app'
          },
          annotations: {
            'openshift.io/build-config.name': 'build-config',
            'openshift.io/build.number': 1
          }
        }
      }
    ],
    buildTabEnabled: true
  };
  const props = { ...defaultProps, ...propOverrides };
  const wrapper = shallow(<MobileClientCardView {...props} />);

  return {
    props,
    wrapper
  };
};

describe('MobileClientCardView', () => {
  it('renders an empty state when there are no apps', () => {
    const { wrapper } = setup({ mobileClients: [] });

    expect(wrapper.find('EmptyState')).toHaveLength(1);
    expect(
      wrapper
        .find('Title')
        .render()
        .text()
    ).toBe("You don't have any Mobile Apps.");

    expect(
      wrapper
        .find('EmptyStateBody')
        .render()
        .text()
    ).toBe('JavaScript-based mobile apps can be configured for a variety of mobile platforms.');
  });

  it('renders apps', () => {
    const { wrapper } = setup();

    expect(wrapper.find('MobileClientCardViewItem')).toHaveLength(2);
  });

  it('filters apps when the DebounceInput value is changed', () => {
    const { wrapper } = setup();

    wrapper.find('DebounceInput').simulate('change', { target: { value: 'your-' } });
    expect(wrapper.find('MobileClientCardViewItem')).toHaveLength(1);
  });

  describe('filters apps by their name', () => {
    const mobileClients = [
      {
        metadata: {
          name: 'my-app'
        },
        status: {
          services: []
        },
        spec: {
          name: 'my-app'
        }
      },
      {
        metadata: {
          name: 'my-app-2'
        },
        status: {
          services: []
        },
        spec: {
          name: 'my-app-2'
        }
      },
      {
        metadata: {
          name: 'your-app'
        },
        status: {
          services: []
        },
        spec: {
          name: 'your-app'
        }
      }
    ];

    const { wrapper } = setup({ mobileClients });

    it('should show render 2 apps', () => {
      wrapper.setState({ filter: 'my-app' });

      expect(wrapper.find('MobileClientCardViewItem')).toHaveLength(2);
      expect(wrapper.find('FilterItem')).toHaveLength(1);
      expect(wrapper.find('CardGrid')).toHaveLength(1);
    });

    it('should not render any apps', () => {
      wrapper.setState({ filter: 'no-matches' });

      expect(wrapper.find('MobileClientCardViewItem')).toHaveLength(0);
      expect(wrapper.find('FilterItem')).toHaveLength(1);
      expect(
        wrapper
          .find('Title')
          .render()
          .text()
      ).toBe('No mobile apps match the entered filter.');
    });
  });

  describe('events', () => {
    describe('DebounceInput', () => {
      const { wrapper } = setup();

      wrapper.setState({ filter: 'app', currentValue: 'ap' });

      it('onValueKeyPress is called', () => {
        const spy = jest.spyOn(wrapper.instance(), 'onValueKeyPress');

        const keypressEvent = {
          key: 'Enter',
          preventDefault() {},
          stopPropagation() {}
        };

        wrapper.instance().forceUpdate();
        wrapper.find('DebounceInput').simulate('keypress', keypressEvent);

        expect(spy).toBeCalledWith(keypressEvent);
        expect(wrapper.state().currentValue).toBe('');
      });

      it('updateCurrentValue is called', () => {
        const spy = jest.spyOn(wrapper.instance(), 'updateCurrentValue');

        wrapper.instance().forceUpdate();

        const changeEvent = {
          preventDefault() {},
          target: { value: 'myapp' }
        };

        const DebounceInput = wrapper.find('DebounceInput');
        DebounceInput.simulate('change', changeEvent);

        expect(spy).toBeCalled();
        expect(wrapper.state().currentValue).toBe(changeEvent.target.value);
        expect(wrapper.state().filter).toBe(changeEvent.target.value);
      });
    });

    describe('FilterList', () => {
      const { wrapper } = setup();

      wrapper.setState({ filter: 'app' });

      it('removeFilter is called', () => {
        const spy = jest.spyOn(wrapper.instance(), 'removeFilter');

        wrapper.instance().forceUpdate();

        const FilterItem = wrapper.find('FilterItem');
        FilterItem.simulate('remove');

        expect(spy).toBeCalled();
        expect(wrapper.state().filter).toBe('');
        expect(wrapper.state().currentValue).toBe('');
      });
    });
  });
});
