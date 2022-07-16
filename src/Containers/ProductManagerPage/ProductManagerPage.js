import { Grid, makeStyles, Modal, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import AddProductModal from '../../Components/AddProductModal/AddProductModal';
import ItemCard from '../../Components/ItemCard/ItemCard';
import { createProduct, deleteProductById, fetchCurrentUser, getProductsByUserId } from '../../service';
import './ProductManagerPage.css';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const ProductManagerPage = () => {
  const classes = useStyles();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarType, setSnackbarType] = useState('success');

  useEffect(() => {
    const showModal = async () => {
      try {
        if (location.state.filterModalOpen === true){
          setOpenModal(true);
        }
      } catch (error) {
        return;
      }
    }
    showModal();
  }, [location]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCurrentUser = await fetchCurrentUser();
      
      if (fetchedCurrentUser){
        const fetchedProducts = await getProductsByUserId(fetchedCurrentUser.userId);
        setProducts(fetchedProducts);
      } else {
        setRefresh(refresh+1);
      }
    }
    fetchData();
  }, [refresh]);

  const renderSellerItemCards = () => {
    return products.length > 0 ? <Grid container>
      {
        products.map(item => {
          const { title, price, rating=4.8, item_id: id, ...details} = item;
          return (
            <ItemCard
              title={title}
              price={price}
              rating={rating}
              productId={id}
              details={details}
              onDelete={handleDeleteProduct}
            />
          )
        })
      }
    </Grid> : <div style={{"width": "100%", "marginTop": "80px"}}>
      <h3 style={{"textAlign": "center"}}>No products yet. Add new products now!</h3>
    </div>
  }

  const handleAddNewProduct = async (title,diameter,width,offset,price,image,carType) => {
    const fetchedCurrentUser = await fetchCurrentUser();
    const itemData = {
      seller_id: fetchedCurrentUser.userId,
      title,
      diameter,
      width,
      offset,
      price,
      filePath: image !== '' ? image.name : '',
      carType
    }
    await createProduct(itemData, image);
  }

  const handleDeleteProduct = async (productId, title) => {
    if(window.confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteProductById(productId);

      setSnackbarType("error");
      setOpenSnackbar(true);
      setRefresh(refresh + 1);
    }
  }

  const handleCloseModal = () => {
    setOpenModal(false);
    setSnackbarType("success");
    setOpenSnackbar(true);
    setRefresh(refresh + 1);
  }

  return (
    <div className='product-manager-page-wrapper'>
      <div className='product-manager-banner-wrapper'>
        <h1 style={{marginLeft: '40px'}}>Welcome!</h1>
        <p style={{marginLeft: '40px'}}>Here are all the products you advertise. <br/>Add new products, and they will <br/>show up when searched by others!</p>
        <div
          className="product-manager-redirect-button"
          style={{marginLeft: '40px'}}
          onClick={() => setOpenModal(true)}
        >
          <h4>+ Add Product</h4>
        </div>
      </div>
      <div style={{margin: '40px'}}>
        <Grid container>
          {renderSellerItemCards()}
        </Grid>
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        className={classes.modal}
      >
        <AddProductModal
          handleAddNewProduct={handleAddNewProduct}
          handleCloseModal={handleCloseModal}
        />
      </Modal>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
      >
        <Alert onClose={() => setOpenSnackbar(false)} severity={snackbarType}>
          {snackbarType === 'success' ? 
            'Product has successfully created!'
            : 'Product has been deleted'
          }
        </Alert>
      </Snackbar>
    </div>
  )
}

export default ProductManagerPage;