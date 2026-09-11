import{useEffect,useState}from"react"
import"./App.css"

function App(){
    const[productCount,setProductCount]=useState(0)
    const[inventoryCount,setInventoryCount]=useState(0)
    useEffect(()=>{
    const loadDashboardData=async()=>{
        try{
            const productResponse=await fetch("http://127.0.0.1:8000/products/count")
            const inventoryResponse=await fetch("http://127.0.0.1:8000/inventory/count")

            const productData=await productResponse.json()
            const inventoryData=await inventoryResponse.json()

            setProductCount(productData.count)
            setInventoryCount(inventoryData.count)
        }catch(error){
            console.error(error)
        }
    }

    loadDashboardData()
},[])
    const[productId,setProductId]=useState(1)
    const[competitorPrice,setCompetitorPrice]=useState(50000)
    const[previousSales,setPreviousSales]=useState(80)
    const[customerRating,setCustomerRating]=useState(4.5)
    const[discount,setDiscount]=useState(10)
    const[seasonality,setSeasonality]=useState(1)
    const[promotion,setPromotion]=useState(1)
    const[dayOfWeek,setDayOfWeek]=useState(5)

    const[loading,setLoading]=useState(false)
    const[result,setResult]=useState(null)
    const[error,setError]=useState("")

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