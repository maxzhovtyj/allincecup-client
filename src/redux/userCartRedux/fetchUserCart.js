import $api from "../../http/http";
import {userCartActionCreator} from "./userCartReducer";
import {cartProductsStorage} from "../../components/main/categories/products/productItem.component";

export const fetchUserCart = (isAuth) => {
    return async (dispatch) => {
        if (isAuth) {
            const response = await $api.get('/api/client/user-cart')
            dispatch(userCartActionCreator(response.data))
        } else {
            let cart = JSON.parse(localStorage.getItem(cartProductsStorage))
            dispatch(userCartActionCreator(cart))
        }
    }
}