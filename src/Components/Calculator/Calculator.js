import { Grid, TextField } from '@material-ui/core';
import React, { useState } from 'react';
import { tireWidthConverter } from '../../Constants/format';
import { useHistory } from 'react-router-dom';

import './Calculator.css';

const Calculator = () => {
  const history = useHistory();

  const [width, setWidth] = useState(0);
  const [diameter, setDiameter] = useState(0);
  const [offset, setOffset] = useState(0);

  const [minimumTireWidth, setMinimumTireWidth] = useState(0);
  const [idealTireWidth, setIdealTireWidth] = useState(0);
  const [maximumTireWidth, setMaximumTireWidth] = useState(0);

  const [showResult, setShowResult] = useState(false);

  const handleGenerateResult = () => {
    if (width < 5 || width > 14) return;

    const result = tireWidthConverter(width);
    console.log(result);

    const {minimum, ideal, maximum} = result;

    setMinimumTireWidth(minimum);
    setIdealTireWidth(ideal);
    setMaximumTireWidth(maximum);

    setShowResult(true);
  }

  const handleSearch = (searchString) => {
    history.push({
      search: `?query=${searchString.replace('&', '%26')}`,
      pathname: '/product/'
    });
  }

  const generateWheelName = () => `${diameter}x${width}" ET-${offset}`

  const generateResultPane = () => {
    const wheelName = generateWheelName();

    return showResult ? <>
      <p>Your ideal tire width is around <b>{idealTireWidth[0]} - {idealTireWidth[1]}mm</b></p>
      <p>Minimum tire width is <b>{minimumTireWidth}mm</b>, and maximum tire width at <b>{maximumTireWidth}mm</b></p>
      <p>For a detailed method of measuring wheel offset, please refer to</p>
      <a href="https://www.moderntiredealer.com/articles/15884-wheel-offset-basics">
        this article
      </a>
      <img
        src={require("../../Assets/images/wheel-offset-guideline.jpg")}
        alt="offset"
        style={{"width": "100%"}}
      />
      <p>We recommend <b>{wheelName}</b> wheels</p>
      <div
        className={'calculator-submit-button'}
        onClick={() => handleSearch(wheelName)}
      >
        <h4>Search for {wheelName} wheels</h4>
      </div>
      <h4 style={{"textAlign": "center"}}>or</h4>
    </> : <></>
  }

  return (
    <Grid container>
      <Grid item xs={6}>
        <div className='calculator-card-wrapper'>
          <Grid container spacing={1}>
            <Grid item xs={2}>
              <img src={require("../../Assets/images/icon-wheel.png")} alt="wheel.png" />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Diameter"
                variant="outlined"
                onChange={e => {setDiameter(e.target.value)}}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Wheel Width"
                variant="outlined"
                onChange={e => {setWidth(e.target.value)}}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                label="Offset"
                variant="outlined"
                onChange={e => {setOffset(e.target.value)}}
              />
            </Grid>
          </Grid>
        </div>
      </Grid>
      <Grid item xs={6}>
        <div className='calculator-card-wrapper'>
          <h3>Your Result</h3>
          { generateResultPane() }
          <div
            className={showResult ? 'calculator-submit-button-no-highlight' : 'calculator-submit-button'}
            onClick={() => handleGenerateResult()}
          >
            <h4>Calculate Result</h4>
          </div>
        </div>
      </Grid>
    </Grid>
  )
}

export default Calculator;