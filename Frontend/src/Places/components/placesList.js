import React from "react";
import PlaceItem from "./placeItem";
import './placesList.css'
import Card from '../../Shared/UIelements/Card'
import Button from '../../Shared/UIelements/Button'

const PlacesList = (props) => {


  let list=null
  if (props.placesList.length === 0) {
    list =(
    <div className="places-list center">
    <Card >
       <h2>No places found. Maybe create one?</h2>
       <Button  to="/places/new">Share Place</Button>
     </Card>
     </div>
     )
  } else
  {  list=(props.placesList.map((place) => {
      return (
        <PlaceItem
     
        key={place.id}
        id={place.id}
        image={place.image}
        title={place.title}
        description={place.description}
        address={place.address}
        creator={place.creator}
        coordinates={place.location}
        ondelete={props.ondelete}
        />
      );
    }))}

  return (
    <ul className='place-list'>
      {list}
    </ul>
  );
};

export default PlacesList;