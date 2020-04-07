import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import { TweenMax } from 'gsap';

import '../../css/all/popup.scss';

import { ReactComponent as Cross } from '../../assets/cross.svg';
import { ReactComponent as Tick } from '../../assets/tick.svg';

const Popup = ({ popup }) => {
  const cont = useRef();
  const line = useRef();

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
      { opacity: 1, top: '1%' },
      { opacity: 0, top: '-1%', delay: 3.6 },
    );
  });

  return (
    popup !== null &&
    popup.length > 0 &&
    popup.map(({ id, msg, type = 'success' }) => (
      <div className='popup' key={id} ref={cont}>
        {type === 'err' ? <Cross /> : <Tick />}
        {msg}
        <div className='popup-line' ref={line}></div>
      </div>
    ))
  );
};

const mapStateToProps = state => ({
  popup: state.popup,
});

export default connect(mapStateToProps, null)(Popup);
