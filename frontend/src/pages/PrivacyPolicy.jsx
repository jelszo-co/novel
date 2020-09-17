import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

import '../css/all/privacyPolicy.scss';

const PrivacyPolicy = () => {
  const { t } = useTranslation();
  return (
    <div id='privacy-policy'>
      <Link to='/' className='privpol-back'>
        {t('back')}
      </Link>
      <p>
        Általános felhasználási, adatkezelési és szerződéses feltételek
        <br />
        <br />
        1. A Szolgáltató által kezelt személyes adatok köre, azok tárolásának időtartama és
        továbbításának esetei
        <br />
        <br />
        Látható, hogy a regisztrációnál az e-mail címre van szükség, illetve egy jelszóra. A cím
        addig marad nálam, amíg Te le nem törlöd a fiókodat. Az adataidat nem továbbítom, nem adom
        át vagy el senki másnak. Az adatkezelési elveim összhangban vannak az adatvédelemmel
        kapcsolatos hatályos jogszabályokkal, így különösen a következőkkel: 2011. évi CXII.
        törvény, 1995. évi CXIX. törvény, 2001. évi CVIII. Törvény, a 2013. évi V. törvény a Polgári
        Törvénykönyvről és 2008. évi XLVIII. törvény. A nálam tárolt adataidat úgy tudod megnézni,
        változtatni vagy törölni, hogy rákattintasz a saját fiókodra, ahol törölheted is a
        profilodat.
        <br />
        <br />
        2. A feliratkozók hozzájárulásának megszerzése, a módosítás joga
        <br />
        <br />
        Ha bármelyik, honlapon található panelben megadod az e-mailcímed, vagy írsz nekem,
        kommentelsz, ezzel adatokat közölsz felém, tehát csak akkor tedd meg mindezt, ha
        hozzájárulsz, hogy ezen adataidat lássam.
        <br />
        <br />
        3. A Szolgáltató adatkezelésének szabályai
        <br />
        <br />
        Adataid biztonságban lesznek, harmadik félnek nem adom át, és senki más nem férhet majd
        hozzá.
        <br />
        <br />
        4. Felhasználási feltételek
        <br />
        <br />
        Semmilyen felelősséget nem vállalok, ha a honlapon megjelenő novella valamilyen hatással van
        rád. De bármi más következményért sem.
        <br />
        <br />
        Elvárom, hogy az írásaimat szellemi termékként kezeld, azaz ne lopd se a történetet, se az
        ötleteket, se a címeket. Idézni szabad, ilyenkor azonban add meg az idézet mellett
        közvetlenül a honlapom címét is.
        <br />
        <br />
        Ha úgy érzed, nem fed le valamit a fenti szabályzat, írj nekem és pótlom a hiányt. Köszönöm,
        ha elolvastad, szép napot!
      </p>
    </div>
  );
};

export default PrivacyPolicy;
