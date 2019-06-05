import React from 'react';
import { shallow } from 'enzyme';
import BuildPipelineStage from './BuildPipelineStage';

const setup = (propOverrides = {}) => {
  const defaultProps = {
    build: {}
  };

  const props = { ...defaultProps, ...propOverrides };

  const wrapper = shallow(<BuildPipelineStage {...props} />);

  return { props, wrapper };
};

describe('BuildPipelineStage', () => {
  describe('renders expected elements when build data does not exist', () => {
    const { wrapper } = setup();

    it('should render when no stages have started', () => {
      const divNoStages = wrapper.find('div.pipeline-no-stage');

      expect(divNoStages).toHaveLength(1);
      expect(divNoStages.text()).toEqual('No stages have started.');
    });
  });

  describe('renders expected elements when build data exists', () => {
    const { wrapper, props } = setup({
      build: {
        metadata: {
          annotations: {
            'openshift.io/jenkins-status-json': `{
              "stages": [
                {
                  "id": "1b",
                  "name": "stage-1",
                  "status": "SUCCESS",
                  "durationMillis": 1000
                },
                {
                  "id": "2b",
                  "name": "stage-2",
                  "status": "FAILED",
                  "durationMillis": 0
                },
                {
                  "id": "3b",
                  "name": "stage-3",
                  "status": "IN_PROGRESS"
                },
                {
                  "id": "4b",
                  "name": "stage-3",
                  "status": "UNKNOWN_STATUS"
                }
              ]
            }`
          }
        }
      }
    });

    const status = JSON.parse(props.build.metadata.annotations['openshift.io/jenkins-status-json']);
    const { stages } = status;

    it('should render stages', () => {
      expect(wrapper.find('div.pipeline-no-stage')).toHaveLength(0);
      expect(wrapper.find('div.pipeline-stage')).toHaveLength(stages.length);
      expect(wrapper.find('div.pipeline-arrow')).toHaveLength(stages.length);
    });

    stages.forEach((stage, index) => {
      describe(`Stage with ID ${stage.id}`, () => {
        const pipelineStage = wrapper.find('div.pipeline-stage').at(index);
        const statusBar = pipelineStage.find(`.pipeline-status-bar`);
        const circle = statusBar.childAt(1);
        const statusIcon = circle.childAt(1);
        const time = pipelineStage.find('div.pipeline-time');

        it('should render div.pipeline-stage-name', () => {
          expect(pipelineStage.find('.pipeline-stage-name').text()).toBe(stage.name);
        });

        it('should render div.pipeline-status-bar', () => {
          expect(statusBar.props().className).toContain(stage.status);
          expect(
            statusBar
              .children()
              .first()
              .hasClass('pipeline-line')
          ).toBe(true);
        });

        it('should render div.pipeline-circle', () => {
          expect(circle.hasClass('pipeline-circle')).toBe(true);
          expect(circle).toHaveLength(1);
          expect(circle.find('.pipeline-circle-bg')).toHaveLength(1);
        });

        it('should render the associated status icon', () => {
          if (stage.status === 'SUCCESS') {
            expect(statusIcon.hasClass('fa fa-check-circle fa-fw')).toBe(true);
            expect(statusIcon).toHaveLength(1);
            expect(statusIcon.type()).toBe('span');
          } else if (stage.status === 'FAILED') {
            expect(statusIcon.hasClass('fa fa-times-circle fa-fw')).toBe(true);
            expect(statusIcon).toHaveLength(1);
            expect(statusIcon.type()).toBe('span');
          } else if (stage.status === 'IN_PROGRESS') {
            expect(statusIcon.hasClass('fa fa-play-circle fa-fw')).toBe(true);
            expect(statusIcon).toHaveLength(1);
            expect(statusIcon.type()).toBe('span');
          } else {
            expect(statusIcon).toHaveLength(0);
          }
        });

        it('should render div.pipeline-time', () => {
          expect(time).toHaveLength(1);
        });

        it('should render Duration component', () => {
          const Duration = time.find('Duration');
          expect(Duration).toHaveLength(1);
          expect(Duration.prop('duration')).toBe(stage.durationMillis);
          expect(Duration.prop('inProgress')).toBe(stage.status === 'IN_PROGRESS');
        });

        it('should render div.pipeline-arrow', () => {
          const arrow = wrapper.find('div.pipeline-arrow').at(index);
          expect(arrow).toHaveLength(1);

          const arrowIcon = arrow.find('span');

          if (index < stages.length - 1) {
            expect(arrowIcon).toHaveLength(1);
            expect(arrowIcon.hasClass('fa fa-arrow-right fa-fw')).toBe(true);
          } else {
            expect(arrowIcon).toHaveLength(0);
          }
        });
      });
    });
  });
});
