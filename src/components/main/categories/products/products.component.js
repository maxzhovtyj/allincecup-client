import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {
    fetchCategories,
    fetchFiltrationList,
    fetchMoreProducts,
    fetchProducts
} from "../../../../redux/shopRedux/shopFetch";
import {Link, useParams, useSearchParams} from "react-router-dom";

import classes from './products.module.scss'
import AllianceSnackbar from "../../../../UI/snackbar";
import {useSnackbar} from "../../../../hooks/useSnackbar";
import RangeSlider from "../../../../UI/rangeSlider/rangeSlider";
import ProductsListComponent from "./productsList.component";
import FiltrationListComponent from "../filtration/filtrationList.component";

const parentCategory = "category_id"
const parentFiltrationList = "filtration_list_id"

function ProductsComponent() {
    const dispatch = useDispatch()

    const [queryParams, setQueryParams] = useSearchParams()

    const categories = useSelector(state => state.shop.categories)
    const products = useSelector(state => state.shop.products)
    const cannotLoadMore = useSelector(state => state.shop.statusNoMoreProducts)
    const filtrationList = useSelector(state => state.shop.filtrationList)

    let {open, setMessage, handleClick, message, handleClose} = useSnackbar()

    const [parentName, setParentName] = useState(
        queryParams.get("filtrationId") === null
            ? parentCategory
            : parentFiltrationList
    )

    const [filtrationId, setFiltrationId] = useState(
        queryParams.get("filtrationId") === null
            ? queryParams.get("categoryId")
            : queryParams.get("filtrationId")
    )

    const [rangePrice, setRangePrice] = useState([0, 100])
    const [searchParams, setSearchParams] = useState({
        id: queryParams.get("categoryId"),
        price: [0, 100],
        size: "",
        characteristic: queryParams.get("filtration") || "",
        createdAt: "",
        search: "",
    })

    useEffect(() => {
        dispatch(fetchCategories())
    }, [dispatch, queryParams])

    useEffect(() => {
        console.log(parentName, filtrationId)
        dispatch(fetchProducts(searchParams))
        dispatch(fetchFiltrationList(parentName, filtrationId))
    }, [dispatch, filtrationId, parentName, searchParams])

    function loadMore() {
        let lastCreatedAt = products[products.length - 1].createdAt
        dispatch(fetchMoreProducts({
            ...searchParams, createdAt: lastCreatedAt
        }))
    }

    function useSetCategoryId() {
        setSearchParams({...searchParams, id: useParams().id})
    }

    const pushFiltration = (searchKey, searchCharacteristic) => {
        const queryFiltration = queryParams.get("filtration")
        if (!queryFiltration) {
            return `${searchKey}:${searchCharacteristic}`
        } else return queryFiltration + `|${searchKey}:${searchCharacteristic}`
    }

    function handleCharacteristic(searchKey, searchCharacteristic, id) {
        const filtration = pushFiltration(searchKey, searchCharacteristic)
        setQueryParams({
            categoryId: queryParams.get("categoryId"),
            filtration: filtration,
            filtrationId: id,
        })
        setParentName(parentFiltrationList)
        setFiltrationId(id)
        setSearchParams({...searchParams, characteristic: filtration})
    }

    function onRangeCommitted() {
        setSearchParams({...searchParams, price: rangePrice})
    }

    return (
        <>
            <div className={classes.productsPageWrapper}>
                <div className={classes.sidebar}>
                    <div className={classes.sidebarWrapper}>
                        <div className={classes.sidebarContainer}>
                            <div className={classes.priceRange}>
                                <p className={classes.priceRangeTitle}>????????</p>
                                <RangeSlider
                                    value={rangePrice}
                                    setValue={setRangePrice}
                                    onCommitted={onRangeCommitted}
                                />
                                <div className={classes.rangePrices}>
                                    <span>{rangePrice[0]}</span>
                                    <span>{rangePrice[1]}</span>
                                </div>
                            </div>
                            <div className={classes.catalog}>
                                {
                                    categories
                                        .map(item =>
                                            <Link to={`/categories/${item.id}`}
                                                  key={item.id}
                                                  onClick={useSetCategoryId}
                                            >
                                                <p className={classes.catalogItem}>{item.categoryTitle}</p>
                                            </Link>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </div>
                <div className={classes.productsWrapper}>
                    <FiltrationListComponent
                        filtrationList={filtrationList}
                        handleCharacteristic={handleCharacteristic}
                    />
                    <ProductsListComponent
                        products={products}
                        loadMore={loadMore}
                        cannotLoadMore={cannotLoadMore}
                        handleClick={handleClick}
                        setMessage={setMessage}
                    />
                </div>
            </div>
            <AllianceSnackbar open={open} message={message} handleClose={handleClose}/>
        </>
    );
}

export default ProductsComponent;