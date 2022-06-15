import { Grid, IconButton } from '@material-ui/core';
import { Delete } from '@material-ui/icons';
import React, { useEffect, useState } from 'react';
import { formattedCurrency } from '../../Constants/format';
import './ItemCard.css';
import { getImageByItemId, getUserById } from '../../service';

const ItemCard = (props) => {
  const {
    productId,
    title,
    price,
    details,
    onDelete,
  } = props;

  const [sellerPhone, setSellerPhone] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const { seller_id } = details;
      const fetchedSeller = await getUserById(seller_id);
      const fetchedImageUrl = await getImageByItemId(productId);

      setSellerPhone(fetchedSeller.phone);
      setImageUrl(fetchedImageUrl);
    }
    fetchData();
  }, [details, productId]);

  const handleClick = async () => {
    if (!!!onDelete) {
      window.open(`https://wa.me/${sellerPhone}`);
    }
  }

  const getFullProductName = () => {
    const { diameter, offset, width } = details;
    return `${title} ${diameter}x${width}" ET-${offset}`;
  }

  const renderActionIcons = () => {
    return !!onDelete ? <>
      <IconButton aria-label="delete" onClick={() => onDelete(productId, title)}>
        <Delete color="error"/>
      </IconButton>
    </> : <>
      <img
        src={require('../../Assets/images/icon-whatsapp.png')}
        style={{height: '30px', cursor: 'pointer'}}
        alt=''
      />
    </>
  }

  return (
    <Grid item xs={3}>
      <div className='item-card' onClick={() => handleClick()}>
        <div className='item-image'>
          <img
            src={imageUrl || require('../../Assets/images/logo-bw.png')}
            className={imageUrl ? 'image-thumbnail' : 'image-thumbnail-empty'}
            alt=''
          />
        </div>
        <div className='item-content'>
          <div className='item-title'>{getFullProductName()}</div>
          <Grid container>
            <Grid xs={9}>
              <div className='item-price'>{formattedCurrency(price)}</div>
            </Grid>
            <Grid xs={3}>
              {renderActionIcons()}
            </Grid>
          </Grid>
          
        </div>
      </div>
    </Grid>
  )
}

export default ItemCard;