import{useEffect,useState}from"react"
import"./Inventory.css"

function Inventory({onBack}){
    const[products,setProducts]=useState([])
    const[inventory,setInventory]=useState([])
    const[productId,setProductId]=useState("")
    const[quantity,setQuantity]=useState("")
    const[reorderLevel,setReorderLevel]=useState("")
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

    const loadInventory=async()=>{
        try{
            const response=await fetch("http://127.0.0.1:8000/inventory/")
            if(!response.ok){
                throw new Error("Unable to load inventory")
            }
            const data=await response.json()
            setInventory(data)
        }catch(error){
            setError(error.message)
        }
    }

    useEffect(()=>{
        loadProducts()
        loadInventory()
    },[])

    const addInventory=async()=>{
        setLoading(true)
        setMessage("")
        setError("")

        try{
            const response=await fetch("http://127.0.0.1:8000/inventory/",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    product_id:Number(productId),
                    quantity:Number(quantity),
                    reorder_level:Number(reorderLevel)
                })
            })

            if(!response.ok){
                const data=await response.json()
                throw new Error(data.detail||"Unable to add inventory")
            }

            setProductId("")
            setQuantity("")
            setReorderLevel("")
            setMessage("Inventory added successfully")
            await loadInventory()
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
        <div className="inventory-page">
            <div className="inventory-header">
                <button
    className="back-button"
    onClick={onBack}
>
    Back to Dashboard
</button>

                <h2>Inventory Management</h2>
                <p>Manage product stock and reorder levels in the DIPRE database.</p>
            </div>

            <div className="inventory-form">
                <div>
                    <label>Product</label>
                    <select
                        value={productId}
                        onChange={e=>setProductId(e.target.value)}
                    >
                        <option value="">Select product</option>
                        {products.map(product=>(
                            <option key={product.id}value={product.id}>
                                {product.name} (ID: {product.id})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Quantity</label>
                    <input
                        type="number"
                        min="0"
                        value={quantity}
                        onChange={e=>setQuantity(e.target.value)}
                        placeholder="Enter quantity"
                    />
                </div>

                <div>
                    <label>Reorder Level</label>
                    <input
                        type="number"
                        min="0"
                        value={reorderLevel}
                        onChange={e=>setReorderLevel(e.target.value)}
                        placeholder="Enter reorder level"
                    />
                </div>

                <button
                    className="add-inventory-button"
                    onClick={addInventory}
                    disabled={loading}
                >
                    {loading?"Adding...":"Add Inventory"}
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

            <div className="inventory-list">
                <h3>Current Inventory</h3>

                {inventory.length===0?(
                    <p>No inventory records found.</p>
                ):(
                    inventory.map(item=>(
                        <div className="inventory-item"key={item.id}>
                            <div className="inventory-name">
                                {getProductName(item.product_id)}
                            </div>

                            <div className="inventory-detail">
                                Product ID: {item.product_id}
                            </div>

                            <div className="inventory-detail">
                                Quantity: <strong>{item.quantity}</strong>
                            </div>

                            <div className="inventory-detail">
                                Reorder Level: {item.reorder_level}
                            </div>

                            <div className={
                                item.quantity<=item.reorder_level
                                ?"stock-status low-stock"
                                :"stock-status"
                            }>
                                {item.quantity<=item.reorder_level
                                ?"LOW STOCK"
                                :"IN STOCK"}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default Inventory