import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../actions';
import NewsContainer from '../components/news-container';


function mapStateToProps (state, props) {
    return {
        isFetching: state.isFetching,
        storiesToShow: state.storiesToShow
    };
}

function mapDispatchToProps (dispatch) {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsContainer);
