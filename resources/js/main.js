import 'bootstrap';
import '../sass/app.scss';
import VueContainer from './Framework/VueContainer';
import Gatekeeper from './Framework/Gatekeeper';
new Gatekeeper()
.guard()
.then(() => {
    new VueContainer();
});
