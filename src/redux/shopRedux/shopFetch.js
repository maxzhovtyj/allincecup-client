import {
    cannotLoadProductsActionCreator, clearFiltrationListActionCreator,
    getCategoriesActionCreator, getFiltrationListActionCreator,
    getMoreProductsActionCreator,
    getProductsActionCreator, loadProductsActionCreator, setFetchingActionCreator, setNotFetchingActionCreator
} from "./shopReducer";
import $api from "../../http/http";

export const fetchFiltrationList = (name, id) => {
    return async (dispatch) => {
        if (id === null) {
            dispatch(clearFiltrationListActionCreator())
            return
        }
        const response = await $api.get(`/api/filtration?parentName=${name}&id=${id}`)
        dispatch(getFiltrationListActionCreator(JSON.parse(JSON.stringify(response.data))))
    }
}

export const fetchCategories = () => {
    return async (dispatch) => {
        const response = await $api.get('/api/categories')
        if (response.data != null) {
            dispatch(getCategoriesActionCreator(response.data))
        } else {
            dispatch(getCategoriesActionCreator([]))
        }
    }
}

export const fetchProducts = ({id, createdAt, price, size, characteristic, search}) => {
    return async (dispatch) => {
        dispatch(loadProductsActionCreator())
        const response = await $api.get(
            `/api/products?category=${id}&createdAt=${createdAt}&priceRange=${price[0]}:${price[1]}&size=${size}&characteristic=${characteristic}&search=${search}`
        )
        dispatch(getProductsActionCreator(response.data))
    }
}

export const fetchMoreProducts = ({id, createdAt, price, search, size, characteristic}) => {
    return async (dispatch) => {
        dispatch(setFetchingActionCreator())
        const response = await $api.get(
            `/api/products?category=${id}&createdAt=${createdAt}&priceRange=${price[0]}:${price[1]}&size=${size}&characteristic=${characteristic}&search=${search}`
        )
        if (response.data !== null) {
            dispatch(getMoreProductsActionCreator(response.data))
        } else {
            dispatch(cannotLoadProductsActionCreator())
        }
        dispatch(setNotFetchingActionCreator())
    }
}
