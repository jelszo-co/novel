import React, { useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import gsap, { TweenMax } from 'gsap';

import '../../css/components/popup.scss';

import { ReactComponent as Cross } from '../../assets/cross.svg';
import { ReactComponent as Tick } from '../../assets/tick.svg';

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
      { opacity: 1, marginTop: '0rem' },
      { opacity: 0, marginTop: '-2.3rem', delay: 3.6 },
    );
  });

  return (
    <div className='popup'>
      {popup !== null &&
        popup.length > 0 &&
        popup.map(({ id, msg, type = 'success' }) => (
          <div className='popup-card' key={id} ref={cont}>
            <p>
              {type === 'err' ? <Cross /> : <Tick />}
              {msg}
              <span className='popup-line' ref={line} />
            </p>
          </div>
        ))}
    </div>
  );
};

const mapStateToProps = state => ({
  popup: state.popup,
});

export default connect(mapStateToProps, null)(Popup);
