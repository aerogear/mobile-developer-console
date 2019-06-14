import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

window.OPENSHIFT_CONFIG = {
  mdcNamespace: 'test',
  masterUri: 'https://mobile-developer-console.com',
  user: {
    accessToken: 'vlseTWA8LXFz6X5kBH2BJO2l33GRZSPZAHA2-FHGC94',
    name: 'mockuser',
    email: 'mockuser@example.com'
  }
};

configure({ adapter: new Adapter() });
