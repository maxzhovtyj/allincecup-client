import {useContext, useEffect, useState} from 'react';
import {useDispatch, useSelector} from "react-redux";
import {AuthContext} from "../../../context/AuthContext";

import {fetchUserCart} from "../../../redux/userCartRedux/fetchUserCart";

import CartItem from "../cart/cartItem";
import SimpleSnackbar from "../../../UI/snackbar";

import cartClasses from "../cart/cart.module.scss";
import orderClasses from "./order.module.scss"

import {ThemeProvider} from "@mui/material";
import Button from "@mui/material/Button";

import {muiTextBtnTheme} from "../../../UI/styles";

import {useSnackbar} from "../../../hooks/useSnackbar";

import {useNavigate} from "react-router-dom";
import {ShoppingService} from "../../../service/ShoppingService";
import {NovaPoshtaService} from "../../../service/NovaPoshtaService";
import OrderInfo from "./orderInfo";
import {OrderService} from "../../../service/OrderService";

export const NovaOption = "Нова Пошта"
export const inTownOption = "Доставка AllianceCup по м. Рівне"

function OrderComponent() {
    const navigate = useNavigate()

    const {isAuth} = useContext(AuthContext)

    const {open, message, handleClose, setMessage, handleClick} = useSnackbar()

    const dispatch = useDispatch()
    const cartProducts = useSelector(state => state.cartPage)

    const [isNovaPoshta, setIsNovaPoshta] = useState(false)
    const [isInTown, setIsInTown] = useState(false)

    const [deliveryTypes, setDeliveryTypes] = useState([])
    const [paymentTypes, setPaymentTypes] = useState([])

    const [cities, setCities] = useState([])
    const [departments, setDepartments] = useState([])

    const [city, setCity] = useState(null)
    const [department, setDepartment] = useState(null)

    const [address, setAddress] = useState(null)

    const [orderInfo, setOrderInfo] = useState({
        lastName: "",
        firstName: "",
        middleName: "",
        phone: "",
        email: "",
        comment: "",
        deliveryTypeTitle: "",
        paymentTypeTitle: "",
    })

    const [errors, setErrors] = useState({
        lastName: false,
        firstName: false,
        middleName: false,
        phone: false,
        email: false,
        deliveryTypeTitle: false,
        paymentTypeTitle: false,
        novaPoshtaCity: false,
        novaPoshtaDepartment: false,
        deliveryAddress: false
    })

    const [disabled, setDisabled] = useState(false)

    const handleOrderInfo = (e) => {
        if (e.target.value === NovaOption) {
            setIsInTown(false)
            setIsNovaPoshta(true)
        } else if (e.target.value === inTownOption) {
            setIsNovaPoshta(false)
            setIsInTown(true)
        } else if (e.target.name === "deliveryTypeTitle") {
            setIsNovaPoshta(false)
            setIsInTown(false)
        }

        setOrderInfo({...orderInfo, [e.target.name]: e.target.value})
    }

    function makeNewOrder() {
        if (!OrderService.validate(orderInfo, isNovaPoshta, city, department, isInTown, address, setErrors)) {
            handleClick()
            setMessage("Ви не заповнили потрібні поля")
            return;
        }

        const makeOrderForm = {
            order: {
                user_lastname: orderInfo.lastName,
                user_firstname: orderInfo.firstName,
                user_middle_name: orderInfo.middleName,
                user_phone_number: orderInfo.phone,
                user_email: orderInfo.email,
                order_sum_price: cartProducts.sum,
                delivery_type_title: orderInfo.deliveryTypeTitle,
                payment_type_title: orderInfo.paymentTypeTitle
            }
        }

        if (isNovaPoshta) {
            if (city === "" || department === "") {
                handleClick()
                setMessage("Ви не заповнили усі поля")
                return
            }
            makeOrderForm.delivery = [
                {delivery_title: "Місто", delivery_description: city.Description},
                {delivery_title: "Відділення", delivery_description: department.Description},
            ]
        }
        if (isInTown) {
            if (address === "") {
                handleClick()
                setMessage("Ви не заповнили усі поля")
                return
            }
            makeOrderForm.delivery = [
                {delivery_description: "Адрес", delivery_title: address},
            ]
        }

        makeOrderForm.products = cartProducts.cart

        ShoppingService.newOrder(makeOrderForm, setMessage, handleClick)
            .then(() => {
                setMessage("Ваше замовлення надіслано")
                handleClick()
                setDisabled(true)
                navigate("/")
            })
    }

    useEffect(() => {
        dispatch(fetchUserCart(isAuth))
    }, [dispatch, isAuth])

    useEffect(() => {
        ShoppingService.fetchDeliveryTypes().then((res) => {
            setDeliveryTypes(res.deliveryTypes)
            setPaymentTypes(res.paymentTypes)
        })
    }, [])

    const handleCities = (event) => {
        NovaPoshtaService.getCities(event.target.value).then(res => setCities(res))
    }
    const handleDepartments = (cityValueRef) => {
        NovaPoshtaService.getDepartments(cityValueRef).then(res => setDepartments(res))
    }

    const handleSetCityValue = (event, newValue) => {
        setDepartment(null)
        setDepartments([])
        setCity(newValue)

        handleDepartments(newValue?.Ref)
    }

    const handleSetDepartmentValue = (event, newValue) => {
        setDepartment(newValue)
    }

    return (
        <div className={orderClasses.orderPage}>
            <div>
                <OrderInfo orderInfo={orderInfo}
                           handleOrderInfo={handleOrderInfo}
                           errors={errors}
                           deliveryTypes={deliveryTypes}
                           paymentTypes={paymentTypes}
                           isNovaPoshta={isNovaPoshta}
                           isInTown={isInTown}
                           setAddress={setAddress}
                           selectCities={{cities, handleCities, city, handleSetCityValue}}
                           selectDepartments={{departments, department, handleSetDepartmentValue}}
                />
                <ThemeProvider theme={muiTextBtnTheme}>
                    <Button disabled={disabled}
                            sx={{marginTop: "1rem"}}
                            color={"alliance"}
                            variant={"outlined"}
                            onClick={makeNewOrder}
                    >
                        Зробити замовлення
                    </Button>
                </ThemeProvider>
            </div>
            <div className={cartClasses.productsList}>
                {
                    cartProducts?.cart?.map(item => <CartItem product={item} key={item.product_id} order={true}/>)
                }
                <p className={cartClasses.orderSum}>Сума замовлення: {cartProducts.sum}</p>
            </div>

            <SimpleSnackbar open={open} message={message} handleClose={handleClose}/>
        </div>
    );
}

export default OrderComponent