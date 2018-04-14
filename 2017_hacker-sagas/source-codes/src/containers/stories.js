import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as actions from '../actions';
import NewsList from '../components/news-list';


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

export default connect(mapStateToProps, mapDispatchToProps)(NewsList);
