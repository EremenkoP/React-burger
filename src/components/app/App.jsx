import React from "react";

import AppHeader from "../appHeader/AppHeader";
import BurgerIngredients from "../burgerIngredients/BurgerIngredients";
import IngredientDetails from "../ingredientDetails/IngredientDetails";
import BurgerConstructor from "../burgerConstructor/burgerConstructor";
import Modal from "../modal/Modal";
import OrderDetails from "../orderDetails/OrderDetails";
import {IngredientsContext} from "../../services/allContext"

import style from './App.module.css'

const App = () => {
  const URL = "https://norma.nomoreparties.space/api/";

  const [isIngredientDetailsOpened, setIsIngredientDetailsOpened] = React.useState(false);
  const [isOrderDetailsOpened, setIsOrderDetailsOpened] = React.useState(false);
  const [ingredients, setIngredients] = React.useState([]);
  const [currentIngredient, setCurrentIngredient] = React.useState({});
  const [orderNumber, setOrderNumber] = React.useState(0);

  const closeModals = () => {
    console.log('Work closeModals')
    setIsIngredientDetailsOpened(false);
  };

  const closeModalsOrder = () => {
    setIsOrderDetailsOpened(false);
  };

  const getResponseData = (res) => {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`);
  };

  React.useEffect(() => {
    fetch(`${URL}ingredients`, {
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => getResponseData(res))
      .then((res) => setIngredients(res.data))
      .catch((res) => console.log(res))
  }, []);

  const handleIngredientClick = (ingredient) => {
    setCurrentIngredient(ingredient);
    setIsIngredientDetailsOpened(true);
  };

  const handleOrderClick = () => {
    const ingredientsForOrder = ingredients.map((ingredient) => ingredient._id)
     fetch(`${URL}orders`, {
      method: 'POST',
      headers: { "Content-Type": "application/json"},
       body: JSON.stringify({
        ingredients: ingredientsForOrder,
      })
    })
    .then((res) => getResponseData(res))
    .then((res) => {
      setOrderNumber(res.order.number)
      setIsOrderDetailsOpened(true)
    })
    .catch((res) => console.log(res))
  };

  return (
    <>
      <AppHeader />
      <main className={style.main}>
        <div className={style.content}>
        <IngredientsContext.Provider value = {ingredients} >
          <section>
            <BurgerIngredients
              openIngredientDetails={handleIngredientClick}
            />
          </section>
          <section className={'ml-10 mt-25'}>
            <BurgerConstructor handleOrder={handleOrderClick} />
          </section>
        </IngredientsContext.Provider>
        </div>
      </main>
      {isIngredientDetailsOpened && (
        <Modal onCloseClick={closeModals} modalTitle={"Детали ингредиента"}>
          <IngredientDetails ingredient={currentIngredient} />
        </Modal>
      )}
      {isOrderDetailsOpened && (
        <Modal onCloseClick={closeModalsOrder}>
          <OrderDetails orderNumber={orderNumber}/>
        </Modal>
      )}
    </>
  );
};

export default App;
