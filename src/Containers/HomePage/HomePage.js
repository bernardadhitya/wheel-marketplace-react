import { Grid } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import ItemCard from '../../Components/ItemCard/ItemCard';
import Calculator from '../../Components/Calculator/Calculator';
import { getAllProducts } from '../../service';
import './HomePage.css';
import { useHistory } from 'react-router-dom';

const HomePage = () => {
  const history = useHistory();

  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedProducts = await getAllProducts();
      setProducts(fetchedProducts.slice(0,4));
    }
    fetchData();
  }, []);

  const renderRecommendedItemCards = () => {
    if (products.length === 0) return;
    return products.map(item => {
      const { title, price, rating=4.8, item_id: id, ...details} = item;
      return (
        <ItemCard
          title={title}
          price={price}
          rating={rating}
          productId={id}
          details={details}
        />
      )
    })
  }
  
  return (
    <div className='home-page-wrapper'>
      <div className='home-banner-wrapper'>
        <p style={{color: 'black', fontFamily: 'Avenir-Next', fontSize: '24px', marginLeft: '40px'}}>
          Welcome to
        </p>
        <div style={{color: '#FF9900', fontFamily: 'Avenir-Next', fontSize: '64px', marginLeft: '40px'}}>
          WheelFit
        </div>
        <p style={{color: 'black', fontSize: '18px', marginLeft: '40px'}}>
          One-stop solution for buying best-fitted <br/> tires for your car
        </p>
      </div>
      <div style={{margin: '40px'}}>
        <h3>Getting Started</h3>
        <p style={{'maxWidth': '60%'}}>
          Let's get your current tire measurements. We'll recommend the perfect tires based on your measurements.
        </p>
        <Calculator />
      </div>
      <div className='home-section-wrapper' style={{margin: '40px'}}>
        <h1>Daily Picks</h1>
        <p>Have a look at some of the most recent items sold here. Who knows, it might be a good pick for you!</p>
        <div
          className="product-manager-redirect-button"
          onClick={() => history.push("/product")}
        >
          <h4>Explore More</h4>
        </div>
      </div>
      <div style={{margin: '40px'}}>
        <Grid container>
          {renderRecommendedItemCards()}
        </Grid>
      </div>
    </div>
  )
}

export default HomePage;