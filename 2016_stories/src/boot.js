// following imports are polyfils
import 'corejs';
import 'fetch';

// 3rd party libraries go next.
// But as long as there is a requirement
// not to use other libraries, including helper libraries such as templating ones
// there is only one import in this section which is anyway absolutely optional
// and may be removed without any impact on user experience (and with no code changes)
import debug from 'debug';

// import core application functionality
import Application from './core/app';
import DateFormatter from './utils/date-formatter';
import Paranja from './ui/paranja';
import Spinner from './ui/spinner';
import Turbolink from './ui/turbolink';

// finally import pages and their deps
import HomePage from './pages/home';
import SearchPage from './pages/search';
import StoryPage from './pages/story';
import NotFoundPage from './pages/not-found';
import Storage from './components/storage';
import IndexedStorage from './components/indexed-storage';


const app = new Application({
    name: 'News Store',
    logger: debug,
    /* serviceWorker: {
        url: '/sw.js',
        scope: '/'
    }, */
    routes: {
        '@404': {
            handler: NotFoundPage
        },

        '/search': {
            handler: SearchPage,
            source: IndexedStorage
        },
        '/stories/:id': {
            handler: StoryPage,
            DateFormatter
        },
        '/stories/': {  // redirect to /
            handler: router => router.setUrl('..', { replace: true })
        },
        '/': {
            handler: HomePage
        },
    }
});

app.inject(Paranja, Spinner, Storage, Turbolink);
app.capture(document.getElementById('app'));
