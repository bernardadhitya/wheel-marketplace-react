import { Grid } from '@material-ui/core';
import React from 'react';
import StarIcon from '@material-ui/icons/Star';
import './ConsultantCard.css';
import { useHistory } from 'react-router-dom';
import {} from '../../service';
import { formattedCurrency } from '../../Constants/format';

const ConsultantCard = (props) => {
  const {
    image,
    name,
    rating,
    price,
    verbose=false,
    consultantId
  } = props;

  const history = useHistory();

  const handleClick = async () => {
    history.push(`/consultant/${consultantId}`);
  }

  const renderSimpleConsultantCard = () => {
    return (
      <Grid item xs={3}>
        <div className='consultant-card' onClick={() => handleClick()}>
          <Grid container>
            <Grid xs={1}/>
            <Grid xs={4}>
              <div className='consultant-image'>
                <img
                  src={image || require('../../Assets/images/logo-bw.png')}
                  className={image ? 'image-thumbnail' : 'image-thumbnail-empty'}
                  alt=''
                />
              </div>
            </Grid>
            <Grid xs={6}>
              <div className='consultant-content'>
                <div className='consultant-name'>{name}</div>
                <div className='consultant-rating'>
                  <StarIcon style={{color: '#FFC107'}}/>
                  {`${rating}/5`}
                </div>
              </div>
            </Grid>
            <Grid xs={1}/>
          </Grid>
        </div>
      </Grid>
    )
  }

  const renderVerboseConsultantCard = () => {
    return (
      <Grid item xs={9}>
        <div className='consultant-card' onClick={() => handleClick()}>
          <Grid container>
            <Grid xs={9}>
              <div style={{display: 'flex', marginBottom: '40px', padding: '0 40px'}}>
                <img
                  src={image || require('../../Assets/images/logo-bw.png')}
                  className={image ? 'image-thumbnail' : 'consultant-detail-image-empty'}
                  alt=''
                />
                <div style={{marginLeft: '20px'}}>
                  <div style={{display: 'flex'}}>
                    <h2>{name}</h2>
                    <div className='consultant-rating'>
                      <StarIcon style={{color: '#FFC107'}}/>
                      {`4.9/5`}
                    </div>
                  </div>
                  <div style={{display: 'flex'}}>
                    <div className='consultant-price'>
                      {formattedCurrency(price)}
                    </div>
                    <p style={{color: '#9A9A9A', justifyContent: 'center', marginLeft: '10px'}}>
                      per jam
                    </p>
                  </div>
                </div>
              </div>
            </Grid>
            <Grid xs={3}>
              <div
                className='consultant-redirect-button'
              >
                <h4>Cek Konsultan</h4>
              </div>
            </Grid>
          </Grid>
        </div>
      </Grid>
    )
  }

  return verbose ? renderVerboseConsultantCard() : renderSimpleConsultantCard()
}

export default ConsultantCard;