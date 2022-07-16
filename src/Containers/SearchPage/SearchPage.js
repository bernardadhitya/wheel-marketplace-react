import {
  Grid, MenuItem, Select
} from '@material-ui/core';
import React, {useState, useEffect} from 'react';
import { useHistory, useLocation } from 'react-router';
import { getAllProductsPaginated, getProductsByTitlePaginated } from '../../service';
import qs from 'query-string';
import './SearchPage.css';
import Pagination from '@material-ui/lab/Pagination';
import ItemCard from '../../Components/ItemCard/ItemCard';
import SearchBar from '../../Components/SearchBar/SearchBar';

var _ = require('lodash');

const SearchPage = () => {
  const history = useHistory();
  const location = useLocation();

  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [carType, setCarType] = useState("None");

  const queries = qs.parse(location.search);

  const searchQuery = queries.query;

  useEffect(() => {
    const fetchData = async () => {
      const fetchedItems = _.isEmpty(queries) ? 
        await getAllProductsPaginated(carType) : await getProductsByTitlePaginated(queries.query, carType);
      setItems(fetchedItems);
    }
    fetchData();
  }, [queries]);

  const renderItemCards = () => {
    return items.length > 0 ? (
      <Grid container>
        { items[page-1].map(item => {
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
        })}
      </Grid>
    ) : (
      <div style={{margin: '40px 0 0 40px'}}>
        <h3>No product found. Try searching for something else</h3>
      </div>
    )
  }

  const handleSearch = (searchString) => {
    history.push({
      search: `?query=${searchString.replace('&', '%26')}`,
      pathname: '/product/'
    });
  }

  return (
    <div>
      <div style={{padding: '40px 100px'}}>
        <Grid container>
          <Grid item xs={6}>
            <div style={{marginBottom: '40px'}}>
              <SearchBar handleSearch={(value) => handleSearch(value)}/>
            </div>
          </Grid>
          <Grid item xs={3}></Grid>
          <Grid item xs={3}>
            <p>Filter by:</p>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={carType}
              label="Age"
              fullWidth
              variant="outlined"
              onChange={e => {setCarType(e.target.value)}}
            >
              <MenuItem value="None">None</MenuItem>
              <MenuItem value="City Car">City Car</MenuItem>
              <MenuItem value="Sedan">Sedan</MenuItem>
              <MenuItem value="SUV">SUV</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={8}>
            {
              !!searchQuery &&
              <p style={{margin: '60px 0 0 20px'}}>
                Showing result for <span style={{color: '#FF9900'}}>{`"${searchQuery}"`}</span>
              </p>
            }
          </Grid>
        </Grid>
        {renderItemCards()}
        <div className='pagination-container'>
          <Pagination
            count={Math.ceil(items.length)}
            shape="rounded"
            page={page}
            onChange={(event, value) => setPage(value)}
          />
        </div>
      </div>
    </div>
  )
}

export default SearchPage;