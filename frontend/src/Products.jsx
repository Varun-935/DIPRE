import{useEffect,useState}from"react"
import"./Products.css"

function Products({onBack}){
    const[products,setProducts]=useState([])
    const[name,setName]=useState("")
    const[category,setCategory]=useState("")
    const[brand,setBrand]=useState("")
    const[costPrice,setCostPrice]=useState("")
    const[sellingPrice,setSellingPrice]=useState("")
    const[loading,setLoading]=useState(false)
    const[message,setMessage]=useState("")
    const[error,setError]=useState("")

    const loadProducts=async()=>{
        try{
            const response=await fetch("http://127.0.0.1:8000/products/")
            if(!response.ok){
                throw new Error("Unable to load products")
            }
            const data=await response.json()
            setProducts(data)
        }catch(error){
            setError(error.message)
        }
    }

    useEffect(()=>{
        loadProducts()
    },[])

    const addProduct=async()=>{
        setLoading(true)
        setMessage("")
        setError("")

        try{
            const response=await fetch("http://127.0.0.1:8000/products/",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    name:name,
                    category:category,
                    brand:brand||null,
                    cost_price:Number(costPrice),
                    selling_price:Number(sellingPrice)
                })
            })

            if(!response.ok){
                throw new Error("Unable to add product")
            }

            setName("")
            setCategory("")
            setBrand("")
            setCostPrice("")
            setSellingPrice("")
            setMessage("Product added successfully")
            await loadProducts()
        }catch(error){
            setError(error.message)
        }finally{
            setLoading(false)
        }
    }

return(
    <div className="products-page">
        <div className="products-header">
<button
    className="back-button"
    onClick={onBack}
>
    Back to Dashboard
</button>

            <h2>Product Management</h2>
            <p>Add and view products in the DIPRE database.</p>
        </div>

        <div className="product-form">
            <div>
                <label>Product Name</label>
                <input
                    value={name}
                    onChange={e=>setName(e.target.value)}
                    placeholder="Enter product name"
                />
            </div>

            <div>
                <label>Category</label>
                <input
                    value={category}
                    onChange={e=>setCategory(e.target.value)}
                    placeholder="Enter category"
                />
            </div>

            <div>
                <label>Brand</label>
                <input
                    value={brand}
                    onChange={e=>setBrand(e.target.value)}
                    placeholder="Enter brand"
                />
            </div>

            <div>
                <label>Cost Price</label>
                <input
                    type="number"
                    value={costPrice}
                    onChange={e=>setCostPrice(e.target.value)}
                    placeholder="Enter cost price"
                />
            </div>

            <div>
                <label>Selling Price</label>
                <input
                    type="number"
                    value={sellingPrice}
                    onChange={e=>setSellingPrice(e.target.value)}
                    placeholder="Enter selling price"
                />
            </div>

            <button
                className="add-product-button"
                onClick={addProduct}
                disabled={loading}
            >
                {loading?"Adding...":"Add Product"}
            </button>
        </div>

        {message&&(
            <div className="message">
                {message}
            </div>
        )}

        {error&&(
            <div className="error-message">
                {error}
            </div>
        )}

        <div className="product-list">
            <h3>Products</h3>

            {products.length===0?(
                <p>No products found.</p>
            ):(
                products.map(product=>(
                    <div className="product-item"key={product.id}>
                        <div className="product-name">
                            {product.name}
                        </div>

                        <div className="product-detail">
                            ID: {product.id}
                        </div>

                        <div className="product-detail">
                            Category: {product.category}
                        </div>

                        <div className="product-detail">
                            Brand: {product.brand||"N/A"}
                        </div>

                        <div className="product-detail">
                            Cost: ₹{Number(product.cost_price).toLocaleString()}
                        </div>

                        <div className="product-detail">
                            Price: ₹{Number(product.selling_price).toLocaleString()}
                        </div>
                    </div>
                ))
            )}
        </div>
    </div>
)
}

export default Products