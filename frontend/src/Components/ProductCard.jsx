import QuantityCounter from "./QuantityCounter";

export default function ProductCard({
  productName,
  brand,
  image,
  price,
  productQuantity,
  handleAddQuantity,
  handleRemoveQuantity,
  handleAddToCart,
  handleOnDelete,
  handleOnEdit,
  id,
}) {
  return (
    <div className="ProductCard">
      <h3>{productName}</h3>
      {image?(<img src={image} alt="" />) : null}
      <h4>{brand}</h4>
      {/* <div className="ProductQuantityDiv">
        <div onClick={() => handleRemoveQuantity(id)} className="QuantityBtn">
          <p>➖</p>
        </div>

        <p>{productQuantity}</p>
        <div onClick={() => handleAddQuantity(id)} className="QuantityBtn">
          <p>➕</p>
        </div>
      </div> */}
      <QuantityCounter
        handleAddQuantity={handleAddQuantity}
        productQuantity={productQuantity}
        handleRemoveQuantity={handleRemoveQuantity}
        id={id}
        mode="product"
      />
      <h3>{price}</h3>
      <button onClick={() => handleAddToCart(id)}>Add to Cart</button>
      <button onClick={() => handleOnDelete(id)}>Delete</button>
      <button onClick={() => handleOnEdit(id)}>Edit</button>
    </div>
  );
}
