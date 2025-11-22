export default function ProductForm({ productName, brand, image, price, handleOnSubmit, handleOnChange, isEditing }) {
    return (
    <div>
        <h2>Product Form</h2>
        <form onSubmit={handleOnSubmit}>
            <input type="text" name="productName" id="productName" value={productName} onChange={handleOnChange} placeholder="Product Name"/>
            <br />
            <input type="text" name="brand" id="brand" value={brand} onChange={handleOnChange} placeholder="Brand"/>
            <br />
            <input type="text" name="image" id="image" value={image} onChange={handleOnChange} placeholder="Image Link"/>
            <br />
            <input type="text" name="price" id="price" value={price} onChange={handleOnChange} placeholder="Price"/>
            <button>{isEditing? "Editing" : "Submit"}</button>
        </form>
    </div>
  );
}