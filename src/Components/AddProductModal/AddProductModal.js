import { Grid, makeStyles, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import './AddProductModal.css';

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const AddProductModal = (props) => {
  const {
    handleAddNewProduct,
    handleCloseModal,
  } = props;
  const classes = useStyles();

  const [title, setTitle] = useState("");
  const [diameter, setDiameter] = useState(null);
  const [width, setWidth] = useState(null);
  const [offset, setOffset] = useState(null);
  const [price, setPrice] = useState(null);
  const [image, setImage] = useState("");

  const handleImageAsFile = (e) => {
    setImage(e.target.files[0]);
  }

  const handleSubmitItem = () => {
    handleAddNewProduct(title,diameter,width,offset,price,image);
    handleCloseModal();
  }

  return (
    <div className={classes.paper}>
      <h2 style={{textAlign: 'center'}}>Add new product</h2>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <h4>Title</h4>
        </Grid>
        <Grid item xs={12}>
          <TextField
            label="Title"
            variant="outlined"
            fullWidth
            onChange={e => {setTitle(e.target.value)}}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <h4>Wheel Diameter</h4>
        </Grid>
        <Grid item xs={3}>
          <h4>Wheel Width</h4>
        </Grid>
        <Grid item xs={3}>
          <h4>Offset</h4>
        </Grid>
        <Grid item xs={3}>
          <h4>Price</h4>
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="diameter"
            variant="outlined"
            fullWidth
            onChange={e => {setDiameter(e.target.value)}}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="width"
            variant="outlined"
            fullWidth
            onChange={e => {setWidth(e.target.value)}}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="Offset"
            variant="outlined"
            fullWidth
            onChange={e => {setOffset(e.target.value)}}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="Price"
            variant="outlined"
            fullWidth
            onChange={e => {setPrice(e.target.value)}}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={3}>
          <h4>Tire Diameter</h4>
        </Grid>
        <Grid item xs={3}>
          <h4>Tire Width</h4>
        </Grid>
        <Grid item xs={3}>
          <h4>Tire Profile</h4>
        </Grid>
        <Grid item xs={3}>
          
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="tire diameter"
            variant="outlined"
            fullWidth
            // onChange={e => {setDiameter(e.target.value)}}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="tire width"
            variant="outlined"
            fullWidth
            // onChange={e => {setWidth(e.target.value)}}
          />
        </Grid>
        <Grid item xs={3}>
          <TextField
            type="number"
            label="tire profile"
            variant="outlined"
            fullWidth
            // onChange={e => {setOffset(e.target.value)}}
          />
        </Grid>
        <Grid item xs={3}>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <h4>Description</h4>
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <TextField
            label="Description"
            variant="outlined"
            multiline
            rows={4}
            fullWidth
            // onChange={e => {setOffset(e.target.value)}}
          />
        </Grid>
      </Grid>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <h4>Image</h4>
        </Grid>
        <Grid item xs={12}>
          <input
            accept="image/*"
            id="contained-button-file"
            multiple
            type="file"
            onChange={(e) => handleImageAsFile(e)}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={12}>
          <div
            className='calculator-submit-button'
            onClick={() => handleSubmitItem()}
          >
            <h4>+ Add New Product</h4>
          </div>
        </Grid>
      </Grid>
    </div>
  )
}

export default AddProductModal;