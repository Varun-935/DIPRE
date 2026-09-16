import{useEffect,useState}from"react"
import"./App.css"
import Products from"./Products"
import Inventory from"./Inventory"
import Sales from"./Sales"
import Analytics from"./Analytics"
import PricingHistory from"./PricingHistory"

function App(){
    const[productCount,setProductCount]=useState(0)
    const[inventoryCount,setInventoryCount]=useState(0)
    const[totalSales,setTotalSales]=useState(0)
    const[totalRevenue,setTotalRevenue]=useState(0)
    const[totalProfit,setTotalProfit]=useState(0)
    const[lowStockProducts,setLowStockProducts]=useState(0)
    const[inventoryAlerts,setInventoryAlerts]=useState([])

    const[productId,setProductId]=useState(1)
    const[competitorPrice,setCompetitorPrice]=useState(50000)
    const[previousSales,setPreviousSales]=useState(80)
    const[customerRating,setCustomerRating]=useState(4.5)
    const[discount,setDiscount]=useState(10)
    const[seasonality,setSeasonality]=useState(1)
    const[promotion,setPromotion]=useState(1)
    const[dayOfWeek,setDayOfWeek]=useState(5)

    const[page,setPage]=useState("dashboard")

    const[loading,setLoading]=useState(false)
    const[result,setResult]=useState(null)
    const[error,setError]=useState("")

const loadDashboardData=async()=>{
    try{
        const productResponse=await fetch("http://127.0.0.1:8000/products/count")

        if(!productResponse.ok){
            throw new Error("Unable to load product count")
        }

        const productData=await productResponse.json()
        setProductCount(productData.count)

        const inventoryResponse=await fetch("http://127.0.0.1:8000/inventory/")

        if(!inventoryResponse.ok){
            throw new Error("Unable to load inventory")
        }

        const inventoryData=await inventoryResponse.json()

        const totalInventory=inventoryData.reduce(
            (total,item)=>total+item.quantity,
            0
        )

        setInventoryCount(totalInventory)

        const analyticsResponse=await fetch("http://127.0.0.1:8000/analytics/summary")

        if(!analyticsResponse.ok){
            throw new Error("Unable to load analytics")
        }

        const analyticsData=await analyticsResponse.json()

        setTotalSales(analyticsData.total_sales)
        setTotalRevenue(analyticsData.total_revenue)
        setTotalProfit(analyticsData.total_profit)

        const alertsResponse=await fetch("http://127.0.0.1:8000/inventory-intelligence/alerts")

        if(!alertsResponse.ok){
            throw new Error("Unable to load inventory alerts")
        }

const alertsData=await alertsResponse.json()

setLowStockProducts(alertsData.total_alerts)
setInventoryAlerts(alertsData.alerts)

    }catch(error){
        console.error(error)
    }
}

useEffect(()=>{
    if(page==="dashboard"){
        loadDashboardData()
    }
},[page])

    const generateRecommendation=async()=>{
        setLoading(true)
        setError("")
        setResult(null)

        try{
            const response=await fetch("http://127.0.0.1:8000/ml/pricing-recommendation",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    product_id:Number(productId),
                    competitor_price:Number(competitorPrice),
                    previous_sales:Number(previousSales),
                    customer_rating:Number(customerRating),
                    discount:Number(discount),
                    seasonality:Number(seasonality),
                    promotion:Number(promotion),
                    day_of_week:Number(dayOfWeek)
                })
            })

            if(!response.ok){
                throw new Error("Unable to generate recommendation")
            }

            const data=await response.json()
            setResult(data)
        }catch(error){
            setError(error.message)
        }finally{
            setLoading(false)
        }
    }


if(page==="products"){
    return(
        <div className="app">
            <Products onBack={()=>setPage("dashboard")}/>
        </div>
    )
}
if(page==="inventory"){
    return(
        <div className="app">
            <Inventory onBack={()=>setPage("dashboard")}/>
        </div>
    )
}

if(page==="pricing-history"){
    return(
        <div className="app">
            <PricingHistory onBack={()=>setPage("dashboard")}/>
        </div>
    )
}

if(page==="sales"){
    return(
        <div className="app">
            <Sales onBack={()=>setPage("dashboard")}/>
        </div>
    )
}

if(page==="analytics"){
    return(
        <div className="app">
            <Analytics onBack={()=>setPage("dashboard")}/>
        </div>
    )
}

    return(
        <div className="app">
         
            <header className="header">
                <div>
                    <h1>DIPRE</h1>
                    <p>Dynamic Inventory and Pricing Recommender Engine</p>
                </div>
                <div className="status">
                    <span></span>
                    System Online
                </div>
                <button onClick={()=>setPage("products")}>
    Product Management
</button>
<button onClick={()=>setPage("inventory")}>
    Inventory Management
</button>
<button onClick={()=>setPage("sales")}>
    Sales Management
</button>
<button onClick={()=>setPage("analytics")}>
    Analytics
</button>
<button onClick={()=>setPage("pricing-history")}>
    Pricing History
</button>
            </header>

            <main className="container">
                <section className="hero">
                    <h2>Dynamic Pricing Dashboard</h2>
                    <p>AI-powered demand prediction and pricing recommendations</p>
                </section>

                <section className="summary">
    <div className="summary-card">
        <span>Total Products</span>
        <strong>{productCount}</strong>
        <small>Products in catalog</small>
    </div>

    <div className="summary-card">
        <span>Current Inventory</span>
        <strong>{inventoryCount}</strong>
        <small>Units available</small>
    </div>

    <div className="summary-card">
        <span>Predicted Demand</span>
        <strong>{result?result.predicted_demand:"--"}</strong>
        <small>AI forecast</small>
    </div>

    <div className="summary-card">
        <span>Pricing Action</span>
        <strong>{result?result.action:"--"}</strong>
        <small>AI recommendation</small>
    </div>

    <div className="summary-card">
    <span>Total Sales</span>
    <strong>{totalSales}</strong>
    <small>Units sold</small>
</div>

<div className="summary-card">
    <span>Total Revenue</span>
    <strong>₹{totalRevenue.toLocaleString()}</strong>
    <small>Sales revenue</small>
</div>

<div className="summary-card">
    <span>Total Profit</span>
    <strong>₹{totalProfit.toLocaleString()}</strong>
    <small>Estimated profit</small>
</div>

<div className="summary-card">
    <span>Low Stock</span>
    <strong>{lowStockProducts}</strong>
    <small>Products requiring attention</small>
</div>
</section>

<section className="inventory-intelligence">
    <div className="section-header">
        <h2>Inventory Intelligence</h2>
        <span>{inventoryAlerts.length} Alerts</span>
    </div>

    {inventoryAlerts.length===0?(
        <div className="no-alerts">
            <h3>Inventory is healthy</h3>
            <p>No products currently require reordering.</p>
        </div>
    ):(
        <div className="alert-list">
            {inventoryAlerts.map((alert)=>(
                <div className="inventory-alert" key={alert.product_id}>
                    <div className="alert-info">
                        <h3>{alert.product_name}</h3>
                        <p>Product ID: {alert.product_id}</p>
                    </div>

                    <div className="alert-stat">
                        <span>Current Stock</span>
                        <strong>{alert.current_stock}</strong>
                    </div>

                    <div className="alert-stat">
                        <span>Reorder Level</span>
                        <strong>{alert.reorder_level}</strong>
                    </div>

                    <div className="alert-stat">
                        <span>Recommended Reorder</span>
                        <strong>{alert.recommended_reorder}</strong>
                    </div>

                    <div className="alert-status">
                        {alert.status}
                    </div>
                </div>
            ))}
        </div>
    )}
</section>

                <section className="panel">
                    <h3>Market and Product Inputs</h3>

                    <div className="form-grid">
                        <div className="field">
                            <label>Product ID</label>
                            <input
                                type="number"
                                value={productId}
                                onChange={e=>setProductId(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label>Competitor Price</label>
                            <input
                                type="number"
                                value={competitorPrice}
                                onChange={e=>setCompetitorPrice(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label>Previous Sales</label>
                            <input
                                type="number"
                                value={previousSales}
                                onChange={e=>setPreviousSales(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label>Customer Rating</label>
                            <input
                                type="number"
                                min="0"
                                max="5"
                                step="0.1"
                                value={customerRating}
                                onChange={e=>setCustomerRating(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label>Discount %</label>
                            <input
                                type="number"
                                min="0"
                                max="100"
                                value={discount}
                                onChange={e=>setDiscount(e.target.value)}
                            />
                        </div>

                        <div className="field">
                            <label>Seasonality</label>
                            <select
                                value={seasonality}
                                onChange={e=>setSeasonality(e.target.value)}
                            >
                                <option value="0">Low</option>
                                <option value="1">High</option>
                            </select>
                        </div>

                        <div className="field">
                            <label>Promotion</label>
                            <select
                                value={promotion}
                                onChange={e=>setPromotion(e.target.value)}
                            >
                                <option value="0">No</option>
                                <option value="1">Yes</option>
                            </select>
                        </div>

                        <div className="field">
                            <label>Day of Week</label>
                            <select
                                value={dayOfWeek}
                                onChange={e=>setDayOfWeek(e.target.value)}
                            >
                                <option value="0">Sunday</option>
                                <option value="1">Monday</option>
                                <option value="2">Tuesday</option>
                                <option value="3">Wednesday</option>
                                <option value="4">Thursday</option>
                                <option value="5">Friday</option>
                                <option value="6">Saturday</option>
                            </select>
                        </div>
                    </div>

                    <button onClick={generateRecommendation}disabled={loading}>
                        {loading?"Generating...":"Generate Recommendation"}
                    </button>

                    {error&&(
                        <div className="error">
                            {error}
                        </div>
                    )}
                </section>

                {result&&(
                    <section className="results">
                        <h3>DIPRE Recommendation</h3>

                        <div className="cards">
                            <div className="card">
                                <span>Predicted Demand</span>
                                <strong>{result.predicted_demand}</strong>
                                <small>units</small>
                            </div>

                            <div className="card">
                                <span>Current Price</span>
                                <strong>₹{result.current_price.toLocaleString()}</strong>
                            </div>

                            <div className="card">
                                <span>Recommended Price</span>
                                <strong>₹{result.recommended_price.toLocaleString()}</strong>
                            </div>

                            <div className="card">
                                <span>Expected Profit</span>
                                <strong>₹{result.expected_profit.toLocaleString()}</strong>
                            </div>
                        </div>

                        <div className="recommendation">
                            <div>
                                <span>Pricing Action</span>
                                <h2>{result.action}</h2>
                            </div>

                            <div>
                                <span>Reason</span>
                                <p>{result.reason}</p>
                            </div>
                        </div>
                    </section>
                )}
            </main>
        </div>
    )
}

export default App