import React from 'react';
import NavbarComponent from "./navbar/navbar.component";

import classes from './main.module.scss'
import {Route, Routes} from "react-router-dom";
import CartComponent from "./cart/cart.component";
import CategoriesComponent from "./categories/categories.component";
import HomePageComponent from "./homePage/homePage.component";
import ProductsComponent from "./categories/products/products.component";
import DeliveryComponent from "./delivery/delivery.component";
import ContactsComponent from "./contacts/contacts.component";
import ForWholesalersComponent from "./forWholesalers/forWholesalers.component";
import ProductComponent from "./product/product.component";

function MainComponent() {
    return (
        <div>
            <NavbarComponent/>
            <div className={classes.mainWrapper}>
                <Routes>
                    <Route path={"/"} element={<HomePageComponent/>} />
                    <Route path={"/categories"} element={<CategoriesComponent/>}/>
                    <Route path={"/categories/:id"} element={<ProductsComponent/>}/>
                    <Route path={"/product/:id"} element={<ProductComponent/>}/>
                    <Route path={"/cart"} element={<CartComponent/>}/>
                    <Route path={"/delivery"} element={<DeliveryComponent/>}/>
                    <Route path={"/contacts"} element={<ContactsComponent/>}/>
                    <Route path={"/for-wholesalers"} element={<ForWholesalersComponent/>}/>
                </Routes>
            </div>
        </div>
    );
}

export default MainComponent;