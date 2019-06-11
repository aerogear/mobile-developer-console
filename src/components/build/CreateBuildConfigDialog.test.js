import React from 'react';
import { shallow } from 'enzyme';
import { CreateBuildConfigDialog } from './CreateBuildConfigDialog';

const setup = (propOverrides = {}) => {
  const defaultProps = {
    show: false,
    title: '',
    onSave: jest.fn(),
    onCancel: jest.fn()
  };

  const props = { ...defaultProps, ...propOverrides };

  const wrapper = shallow(<CreateBuildConfigDialog {...props} />);

  return { wrapper, props };
};

describe('CreateBuildConfigDialog', () => {
  describe('components should render', () => {
    const {
      wrapper,
      props: { onCancel, show, title }
    } = setup({
      title: 'Dialog Title',
      show: true
    });

    it('should render', () => {
      expect(wrapper).toHaveLength(1);
      expect(wrapper.state('valid')).toBe(false);
    });

    describe('Modal', () => {
      const Modal = wrapper.find('Modal');

      it('should render with expected props', () => {
        expect(Modal).toHaveLength(1);
        expect(Modal.prop('show')).toBe(show);
      });

      describe('Modal.Header', () => {
        const ModalHeader = wrapper.find('ModalHeader');

        it('should render', () => {
          expect(ModalHeader).toHaveLength(1);
        });

        describe('Modal.CloseButton', () => {
          const ModalCloseButton = ModalHeader.find('ModalCloseButton');

          it('should render with expected props', () => {
            expect(ModalCloseButton).toHaveLength(1);
            expect(ModalCloseButton.prop('onClick')).toBe(onCancel);
          });
        });
        describe('Modal.Title', () => {
          const ModalTitle = ModalHeader.find('ModalTitle');

          it('should render', () => {
            expect(ModalTitle).toHaveLength(1);
            expect(ModalTitle.render().text()).toBe(title);
          });
        });
      });

      describe('Modal.Body', () => {
        const ModalBody = Modal.find('ModalBody');

        it('should render with expected props', () => {
          expect(ModalBody.hasClass('modalBody buildConfigModal')).toBe(true);
        });

        describe('Grid', () => {
          const Grid = ModalBody.find('Grid');

          it('should render with expected props', () => {
            expect(Grid).toHaveLength(1);
            expect(Grid.prop('fluid')).toBe(true);
          });

          describe('Row', () => {
            const Row = Grid.find('Row');

            it('should render', () => {
              expect(Row).toHaveLength(1);
            });

            describe('Col', () => {
              const Col = Row.find('Col');

              it('should render with expected props', () => {
                expect(Col).toHaveLength(1);
                expect(Col.prop('md')).toBe(12);
              });

              it('should render help block', () => {
                const helpBlock = Col.find('div.help-block');
                expect(helpBlock).toHaveLength(1);
              });
            });
          });
        });
      });

      describe('ModalFooter', () => {
        const ModalFooter = Modal.find('ModalFooter');

        it('should render', () => {
          expect(ModalFooter).toHaveLength(1);
        });

        describe('buttons', () => {
          const buttons = ModalFooter.find('Button');

          it('should render 2 buttons', () => {
            expect(buttons).toHaveLength(2);
          });

          describe('Cancel', () => {
            const cancelButton = buttons.at(0);
            it('should render expected props', () => {
              expect(cancelButton.prop('onClick')).toBe(onCancel);
            });
          });

          describe('Save', () => {
            const saveButton = buttons.at(1);

            it('should render expected props', () => {
              expect(saveButton.prop('onClick')).toBeInstanceOf(Function);
              expect(saveButton.prop('disabled')).toBe(!wrapper.state('valid'));
            });
          });
        });
      });
    });
  });

  describe('events', () => {
    let wrapper;
    beforeEach(() => {
      ({ wrapper } = setup({
        title: 'Dialog Title',
        show: true,
        createBuildConfigState: {
          config: {
            name: 'app'
          },
          mandatoryFields: {
            config: {
              fields: ['name']
            }
          }
        }
      }));
    });

    describe('validate()', () => {
      it('should be called in onReceiveProps()', () => {
        const spy = jest.spyOn(wrapper.instance(), 'validate');
        wrapper.setProps({
          createBuildConfigState: {
            prop1: 'hello-jupiter'
          }
        });
        wrapper.instance().forceUpdate();
        expect(spy).toBeCalled();
        expect(wrapper.state('valid')).toBe(true);
      });
    });

    describe('onSaveBuildConfig()', () => {
      it('should be called on save button click', () => {
        const spy = jest.spyOn(wrapper.instance(), 'onSaveBuildConfig');
        wrapper.instance().forceUpdate();
        const saveButton = wrapper.find('Button').at(1);

        saveButton.simulate('click');
        expect(spy).toBeCalled();
      });
    });
  });
});
