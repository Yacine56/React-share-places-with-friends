import React from "react";
import UserItem from "./userItem";
import './userList.css'
import Card from '../../Shared/UIelements/Card'

const userList = (props) => {
  if (props.userList.length === 0) {
    return <Card className="user-item__content">
     <div className="center">No users Found</div>
     </Card>
  }

  return (
   
   <ul className='users-list'>
      
      {props.userList.map((user) => {
        return (
          <UserItem
            key={user.id}
            id={user.id}
            name={user.name}
            image={user.image}
            placeCount={user.places.length}
          />
        );
      })}
    </ul>
  );
};

export default userList;
