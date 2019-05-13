import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

window.OPENSHIFT_CONFIG = {
  mdcNamespace: 'test'
};
configure({ adapter: new Adapter() });
