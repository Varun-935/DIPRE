import{useEffect,useState}from"react"
import"./Sales.css"

function Sales({onBack}){
    const[products,setProducts]=useState([])
    const[sales,setSales]=useState([])
    const[productId,setProductId]=useState("")
    const[quantity,setQuantity]=useState("")
    const[salePrice,setSalePrice]=useState("")
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

    const loadSales=async()=>{
        try{
            const response=await fetch("http://127.0.0.1:8000/sales/")

            if(!response.ok){
                throw new Error("Unable to load sales")
            }

            const data=await response.json()
            setSales(data)
        }catch(error){
            setError(error.message)
        }
    }

    useEffect(()=>{
        loadProducts()
        loadSales()
    },[])

    const addSale=async()=>{
        setLoading(true)
        setMessage("")
        setError("")

        try{
            const response=await fetch("http://127.0.0.1:8000/sales/",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    product_id:Number(productId),
                    quantity:Number(quantity),
                    sale_price:Number(salePrice)
                })
            })

            if(!response.ok){
                const data=await response.json()
                throw new Error(data.detail||"Unable to record sale")
            }

            setProductId("")
            setQuantity("")
            setSalePrice("")
            setMessage("Sale recorded successfully")

            await loadSales()
        }catch(error){
            setError(error.message)
        }finally{
            setLoading(false)
        }
    }

    const getProductName=(id)=>{
        const product=products.find(item=>item.id===id)
        return product?product.name:"Unknown Product"
    }

    return(
        <div className="sales-page">
            <div className="sales-header">
                <button
                    className="back-button"
                    onClick={onBack}
                >
                    Back to Dashboard
                </button>

                <h2>Sales Management</h2>
                <p>Record and view sales transactions in the DIPRE database.</p>
            </div>

            <div className="sales-form">
                <div>
                    <label>Product</label>

                    <select
                        value={productId}
                        onChange={e=>setProductId(e.target.value)}
                    >
                        <option value="">Select product</option>

                        {products.map(product=>(
                            <option
                                key={product.id}
                                value={product.id}
                            >
                                {product.name} (ID: {product.id})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Quantity Sold</label>

                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={e=>setQuantity(e.target.value)}
                        placeholder="Enter quantity"
                    />
                </div>

                <div>
                    <label>Sale Price</label>

                    <input
                        type="number"
                        min="0"
                        value={salePrice}
                        onChange={e=>setSalePrice(e.target.value)}
                        placeholder="Enter sale price"
                    />
                </div>

                <button
                    className="add-sale-button"
                    onClick={addSale}
                    disabled={loading}
                >
                    {loading?"Recording...":"Record Sale"}
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

            <div className="sales-list">
                <h3>Sales History</h3>

                {sales.length===0?(
                    <p>No sales records found.</p>
                ):(
                    sales.map(sale=>(
                        <div
                            className="sale-item"
                            key={sale.id}
                        >
                            <div className="sale-name">
                                {getProductName(sale.product_id)}
                            </div>

                            <div className="sale-detail">
                                Sale ID: {sale.id}
                            </div>

                            <div className="sale-detail">
                                Quantity: <strong>{sale.quantity}</strong>
                            </div>

                            <div className="sale-detail">
                                Price: ₹{Number(sale.sale_price).toLocaleString()}
                            </div>

                            <div className="sale-detail">
                                {new Date(sale.sale_date).toLocaleString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Sales