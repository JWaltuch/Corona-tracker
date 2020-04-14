/* eslint-disable react/jsx-props-no-spreading */

import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useSpring, animated } from 'react-spring';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useDrag } from 'react-use-gesture';
import actions from '../redux/actions/actions';
import noSelectCss from '../css/noSelect';
import DeletionDialog from './DeletionDialog';

const useStyles = makeStyles({
  ...noSelectCss,
  item: {
    backgroundColor: '#ffffff',
    position: 'relative',
    height: '90px',
    pointerEvents: 'auto',
    transformOrigin: '50% 50% 0px',
    boxSizing: 'border-box',
    display: 'grid',
    alignItems: 'center',
    textAlign: 'center',
  },
  fg: {
    cursor: '-webkit-grab',
    backgroundColor: '#6795fc',
    color: '#ffffff',
    position: 'absolute',
    height: '100%',
    width: '100%',
    display: 'grid',
    alignItems: 'center',
    textAlign: 'center',
    boxShadow: '-10px 0 10px 0 #aaaaaa',
    fontsize: '3em',
    fontWeight: '600',
    transition: 'box-shadow 0.75s',
    '&:active': {
      cursor: '-webkit-grabbing',
    },
    ' > *': {
      pointerEvents: 'none',
    },
  },
});

const WeeklyTracker = props => {
  const { children, setToggleValue, setDetailData } = props;
  const classes = useStyles();
  let swipedRight = false;
  const [swipedLeft, setSwipedLeft] = useState(false);

  const [{ x }, set] = useSpring(() => ({
    x: 0,
    onRest: () => {
      if (swipedRight) {
        // After swipe animation finishes, show survey details
        setDetailData([children.props.dayData]);
        setToggleValue('myHealthLog');
      }
    },
  }));

  const bind = useDrag(
    ({ down, movement: [mx], swipe: [swipeX] }) => {
      if (swipeX === 1) {
        // User swiped right
        set({ x: window.innerWidth });
        swipedRight = true;
        return;
      }

      if (swipeX === -1) {
        // User swiped left
        set({ x: window.innerWidth });
        setSwipedLeft(true);
        return;
      }

      // Don't allow user to drag off the left side of the screen
      // if (mx < 0) {
      //   return;
      // }

      set({ x: down ? mx : 0, immediate: down });
    },
    { axis: 'x' }
  );

  return (
    <div className={classes.noSelect}>
      {swipedLeft && <DeletionDialog setSwipedLeft={setSwipedLeft} observation={children.props.dayData} />}
      <animated.div className={classes.item}>
        <animated.div {...bind()} className={classes.fg} style={{ x }}>
          {children}
        </animated.div>
      </animated.div>
    </div>
  );
};

WeeklyTracker.propTypes = {
  children: PropTypes.node,
  setToggleValue: PropTypes.func.isRequired,
  setDetailData: PropTypes.func.isRequired,
};

WeeklyTracker.defaultProps = {
  children: '',
};

const mapDispatchToProps = dispatch => {
  return {
    setToggleValue: toggleValue => dispatch(actions.setToggleValue(toggleValue)),
    setDetailData: detailData => dispatch(actions.setDetailData(detailData)),
  };
};

export default connect(null, mapDispatchToProps)(WeeklyTracker);
