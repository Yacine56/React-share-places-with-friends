import React,{useReducer, useEffect} from 'react'
import {validate} from '../validators'

import './Input.css'

const inputReducer = (state, action) => {
    switch (action.type) {
      case 'CHANGE':
        return {
          ...state,
          value: action.val,
          isValid: validate(action.val,action.validators)
        };
        case 'TOUCH': {
            return {
              ...state,
              isTouched: true
            }
          }
          default:
            return state;
    }
  };

const Input=props=>{
   const [inputState, dispatch] = useReducer(inputReducer, {
    value: props.value ||'',
    isValid: props.valid || false,
    isTouched:false
  });
      const {id,onInput}=props
      const {value,isValid}=inputState
  useEffect(()=>{
       onInput(id,value,isValid)       
  },[id,value,onInput,isValid])

  const changeHandler = event => {
    dispatch({ type: 'CHANGE',
     val: event.target.value 
    ,validators:props.validators});
  };

  const touchHandler=event=>[
      dispatch({type:'TOUCH'})
  ]

  const element =
    props.element === 'input' ? (
      <input
        id={props.id}
        type={props.type}
        placeholder={props.placeholder}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
      />
    ) : (
      <textarea
        id={props.id}
        rows={props.rows || 3}
        onChange={changeHandler}
        value={inputState.value}
        onBlur={touchHandler}
      />
    );

  return (
    <div
      className={`form-control ${!inputState.isValid && inputState.isTouched &&
        'form-control--invalid'}`}
    >
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );

}

export default Input