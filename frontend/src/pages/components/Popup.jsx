import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import gsap, { TweenMax } from 'gsap';
import PropTypes from 'prop-types';

import { ReactComponent as Cross } from '../../assets/cross.svg';
import { ReactComponent as Tick } from '../../assets/tick.svg';

import '../../css/components/popup.scss';

const Popup = ({ popup }) => {
  const cont = useRef();
  const line = useRef();

  gsap.config({
    nullTargetWarn: false,
  });

  useEffect(() => {
    TweenMax.fromTo(
      line.current,
      3.5,
      { width: '0%' },
      { width: '100%', ease: 'linear' },
    );
    TweenMax.fromTo(
      cont.current,
      0.2,
      { opacity: 1, marginTop: '0.1rem' },
      { opacity: 0, marginTop: '-2rem', delay: 3.6 },
    );
  });

  return (
    popup !== null &&
    popup.length > 0 && (
      <div className='popup-wrapper'>
        {popup.map(({ id, msg, type = 'success' }) => {
          return (
            <div className='popup' key={id} ref={cont}>
              {type === 'err' ? <Cross /> : <Tick />}
              {msg}
              <div className='popup-line' ref={line} />
            </div>
          );
        })}
      </div>
    )
  );
};

Popup.propTypes = {
  popup: PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  popup: state.popup,
});

export default connect(mapStateToProps, null)(Popup);
