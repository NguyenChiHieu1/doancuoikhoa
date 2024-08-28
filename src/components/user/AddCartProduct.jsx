import {useEffect, useState} from 'react';
import { addItem } from '../../store/reducer/cartReducer';
import {useDispatch} from 'react-redux';

const AddCartProduct = async ({product})=> {
    const dispatch = useDispatch();
    dispatch(addItem(product));
}
export default AddCartProduct;