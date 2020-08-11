import React, { useState,useContext } from "react";
import Card from "../../Shared/UIelements/Card";
import Button from "../../Shared/UIelements/Button";
import Modal from "../../Shared/UIelements/Modal";
import Map from "../../Shared/UIelements/Map"
import {useHttpClient} from '../../Shared/Hooks/http-hook'
import LoadingSpinner from '../../Shared/UIelements/LoadingSpinner'
import ErrorModal from '../../Shared/UIelements/ErrorModal'
import {AuthContext} from '../../Shared/context/auth-context'

const PlaceItem = (props) => {
  const auth =useContext(AuthContext)
  const [showModal, setShowModal] = useState(false);
  const [showDelete, setShowDelete ]=useState(false)
 const  {isLoading,error,sendRequest,clearError}=useHttpClient()
  const ShowModalHandler = () => {
    setShowModal(true);
  };

  const closeModalHandler = () => {
  
    setShowModal(false);
  };

  const showDeletehandler=()=>{
         setShowDelete(true)
  }
  const closeDeletehandler=()=>{
    setShowDelete(false)
}
 const deleteHandler=async()=>{
   closeDeletehandler()
   try {
     await sendRequest("http://localhost:5000/api/places/"+props.id,"DELETE",{},{authorization:"Bearer "+auth.token})
    props.ondelete(props.id)
   } catch (error) {
     console.log(error)
   }

 }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && <LoadingSpinner /> }
      <Modal
        show={showModal}
        onCancel={closeModalHandler}
        className=""
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button danger onClick={closeModalHandler} >Close</Button>}
      >
        <div className="map-container">
       <Map  center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
      show={showDelete}
      onCancel={closeDeletehandler}
      header='Are You Sure?'
      contentClass='place-item__modal-content'
      footerClass="place-item__modal-actions"
      footer={
      <React.Fragment>
      <Button onClick={closeDeletehandler} >cancel</Button>
      <Button danger onClick={deleteHandler}>Comfirm</Button> 
     </React.Fragment>}
     >

   <p>note that this can't be undone</p>
      </Modal>

      <li className="place-item">
        <Card className="place-item__content">
          <div className="place-item__image">
            <img src={`http://localhost:5000/${props.image}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button inverse onClick={ShowModalHandler} >VIEW ON MAP</Button>
        {auth.userId===props.creator && <Button to={`/places/${props.id}`}>EDIT</Button>}
        {auth.userId===props.creator && <Button danger onClick={showDeletehandler}>DELETE</Button>}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
