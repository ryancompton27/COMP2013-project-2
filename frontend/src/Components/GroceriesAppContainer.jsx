import { useState, useEffect } from "react";
import axios from "axios";
import CartContainer from "./CartContainer";
import ProductsContainer from "./ProductsContainer";
import NavBar from "./NavBar";
import ProductForm from "./ProductForm";

export default function GroceriesAppContainer() {
  //states
  const [productsData, setProductsData] = useState([]);
  const [productQuantity, setProductQuantity] = useState([]);
  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    image: "",
    price: ""
  });

  const [postResponse, setPostResponse] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  /*
  const [productQuantity, setProductQuantity] = useState(
    productsData.map((product) => ({ id: product.id, quantity: 0 }))
  );
 console.log(productQuantity)
 */

  //useEffect
  useEffect(() => {
    handleProductsDB();
  }, [postResponse]);

  
  

  //handlers

  //get data from db handler
  const handleProductsDB = async () => {
    try{
      const response = await axios.get("http://localhost:3000/products");
      setProductsData(response.data);
      setProductQuantity(
        response.data.map((product) => ({id: product.id, quantity: 0})),
      );
      // was getting quantity undefined error, tried many things to figure it out and fix it, it seemed like my products data array was
      // not being updated correctly and then resulted in the productQuantity not being initialized


    }catch(error) {
      console.log(error.message);
    }
  }
  
  //handle to reset the form
  const handleResetForm = () => {
    setFormData({
            productName: "",
            brand: "",
            image: "",
            price: "",
          })
  }

  // handle the submission of data
  const handleOnSubmit = async (e) => {
    e.preventDefault();
    try{
      if(isEditing){
        handleOnUpdate(formData.id);
        handleResetForm();
        setIsEditing(false);
      } else {
        const initialProductId = Date.now().toString();
        await axios
        .post("http://localhost:3000/products", {...formData, id: initialProductId})
        .then((response) => {setPostResponse(response.data.message);
        setProductQuantity(prev => [ ...prev, { id: initialProductId, quantity: 0 }]);
        }) // had my brother help me with this as I was getting an error with the newly submitted product missing a key
        .then(() => 
          handleResetForm()
        );
      }
      
    } catch(error) {
        console.log(error.message);
    }
  };
  
  //handle the onChange event for the form
  const handleOnChange = (e) => {
    setFormData((prevData) => {
      return {...prevData, [e.target.name]: e.target.value}
    })
  };

  //handle to delete one product by id
  const handleOnDelete = async(id) => {
    try {
      const response = await axios.delete(`http://localhost:3000/products/${id}`);
      setPostResponse(response.data.message);
    } catch (error) {
      console.log(error.message);
    }
  }

  // handle the edition of one product by its id
  const handleOnEdit = async (id) => {
    try {
      const productToEdit = await axios.get(`http://localhost:3000/products/${id}`);
      setFormData({
        id: productToEdit.data.id,
        productName: productToEdit.data.productName,
        brand: productToEdit.data.brand,
        image: productToEdit.data.image,
        price: productToEdit.data.price,
      });
      setIsEditing(true);
    } catch (error) {
      console.log(error);
    }
  }

  //handle updating the api patch route
  const handleOnUpdate = async (id) => {
    try{
      const result = await axios.patch(`http://localhost:3000/products/${id}`, formData);
      setPostResponse(result.data.message);
    } catch (error) {
      console.log(error);
    }
  }

 /*
  useEffect(() => {
    console.log(productsData);
      //console.log(productsData);
      setProductQuantity(
        productsData.map((product) => ({id: product.id, quantity: 0})),
      );
  }, [productsData]);
  */
  //console.log(productQuantity);

  console.log(productsData);
  

  const [cartList, setCartList] = useState([]);

  const handleAddQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleRemoveQuantity = (productId, mode) => {
    if (mode === "cart") {
      const newCartList = cartList.map((product) => {
        if (product.id === productId && product.quantity > 1) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setCartList(newCartList);
      return;
    } else if (mode === "product") {
      const newProductQuantity = productQuantity.map((product) => {
        if (product.id === productId && product.quantity > 0) {
          return { ...product, quantity: product.quantity - 1 };
        }
        return product;
      });
      setProductQuantity(newProductQuantity);
      return;
    }
  };

  const handleAddToCart = (productId) => {
    const product = productsData.find((product) => product.id === productId);
    // changed products to productsData
    const pQuantity = productQuantity.find(
      (product) => product.id === productId
    );
    const newCartList = [...cartList];
    const productInCart = newCartList.find(
      (product) => product.id === productId
    );
    if (productInCart) {
      productInCart.quantity += pQuantity.quantity;
    } else if (pQuantity.quantity === 0) {
      alert(`Please select quantity for ${product.productName}`);
    } else {
      newCartList.push({ ...product, quantity: pQuantity.quantity });
    }
    setCartList(newCartList);
  };

  const handleRemoveFromCart = (productId) => {
    const newCartList = cartList.filter((product) => product.id !== productId);
    setCartList(newCartList);
  };

  const handleClearCart = () => {
    setCartList([]);
  };

  return (
    <div>
      <NavBar quantity={cartList.length} />
      <div className="GroceriesApp-Container">
        <div className="productForm">
        <ProductForm 
          productName={formData.productName} 
          brand={formData.brand} 
          image={formData.image} 
          price={formData.price} 
          handleOnSubmit={handleOnSubmit} 
          handleOnChange={handleOnChange}
          isEditing={isEditing}
        />
        <p className="productFormMsg">{postResponse}</p>
        </div>
        
        <ProductsContainer
          products={productsData}
          // changed products to productsData
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleAddToCart={handleAddToCart}
          productQuantity={productQuantity}
          handleOnDelete={handleOnDelete}
          handleOnEdit={handleOnEdit}
        />
        <CartContainer
          cartList={cartList}
          handleRemoveFromCart={handleRemoveFromCart}
          handleAddQuantity={handleAddQuantity}
          handleRemoveQuantity={handleRemoveQuantity}
          handleClearCart={handleClearCart}
        />
      </div>
    </div>
  );
}
