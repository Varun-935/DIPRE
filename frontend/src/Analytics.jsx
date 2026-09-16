import{useEffect,useState}from"react"
import"./Analytics.css"
import{Line,Bar}from"react-chartjs-2"
import{
Chart as ChartJS,
CategoryScale,
LinearScale,
PointElement,
LineElement,
BarElement,
Title,
Tooltip,
Legend
}from"chart.js"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
)

function Analytics({onBack}){
    const[analytics,setAnalytics]=useState([])
    const[inventory,setInventory]=useState([])
    const[products,setProducts]=useState([])
    const[loading,setLoading]=useState(true)
    const[error,setError]=useState("")

    useEffect(()=>{
        const loadAnalytics=async()=>{
            try{
                const response=await fetch("http://127.0.0.1:8000/analytics/daily")

                if(!response.ok){
                    throw new Error("Unable to load analytics")
                }

                const data=await response.json()
                setAnalytics(data)
                const inventoryResponse=await fetch("http://127.0.0.1:8000/inventory/")

if(!inventoryResponse.ok){
    throw new Error("Unable to load inventory")
}

const inventoryData=await inventoryResponse.json()
setInventory(inventoryData)
const productResponse=await fetch("http://127.0.0.1:8000/products/")

if(!productResponse.ok){
    throw new Error("Unable to load products")
}

const productData=await productResponse.json()
setProducts(productData)
            }catch(error){
                setError(error.message)
            }finally{
                setLoading(false)
            }
        }

        loadAnalytics()
    },[])

const revenueData={
    labels:analytics.map(item=>item.date),
    datasets:[
        {
            label:"Revenue",
            data:analytics.map(item=>item.revenue),
            tension:0.3
        }
    ]
}

const profitData={
    labels:analytics.map(item=>item.date),
    datasets:[
        {
            label:"Profit",
            data:analytics.map(item=>item.profit),
            tension:0.3
        }
    ]
}

const salesData={
    labels:analytics.map(item=>item.date),
    datasets:[
        {
            label:"Sales",
            data:analytics.map(item=>item.sales),
            tension:0.3
        }
    ]
}

const inventoryData={
    labels:inventory.map(item=>{
        const product=products.find(product=>product.id===item.product_id)
        return product?product.name:`Product ${item.product_id}`
    }),
    datasets:[
        {
            label:"Current Stock",
            data:inventory.map(item=>item.quantity)
        },
        {
            label:"Reorder Level",
            data:inventory.map(item=>item.reorder_level)
        }
    ]
}

const inventoryOptions={
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
        legend:{
            position:"top"
        },
        title:{
            display:true,
            text:"Inventory Stock vs Reorder Level"
        }
    },
    scales:{
        y:{
            beginAtZero:true
        }
    }
}

const revenueOptions={
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
        legend:{
            position:"top"
        },
        title:{
            display:true,
            text:"Revenue Trend"
        }
    }
}

const profitOptions={
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
        legend:{
            position:"top"
        },
        title:{
            display:true,
            text:"Profit Trend"
        }
    }
}

const salesOptions={
    responsive:true,
    maintainAspectRatio:false,
    plugins:{
        legend:{
            position:"top"
        },
        title:{
            display:true,
            text:"Sales Trend"
        }
    }
}

    if(loading){
        return(
            <div className="analytics-page">
                <button onClick={onBack}>Back to Dashboard</button>
                <h2>Analytics</h2>
                <p>Loading analytics...</p>
            </div>
        )
    }

    if(error){
        return(
            <div className="analytics-page">
                <button onClick={onBack}>Back to Dashboard</button>
                <h2>Analytics</h2>
                <p>{error}</p>
            </div>
        )
    }

    return(
        <div className="analytics-page">
            <button onClick={onBack}>Back to Dashboard</button>

            <div className="analytics-header">
                <h1>Analytics & Visualization</h1>
                <p>Sales, revenue and profit performance</p>
            </div>

            <div className="analytics-summary">
    <div className="analytics-summary-card">
        <span>Total Sales</span>
        <strong>{analytics.reduce((total,item)=>total+item.sales,0)}</strong>
        <small>Units sold</small>
    </div>

    <div className="analytics-summary-card">
        <span>Total Revenue</span>
        <strong>₹{analytics.reduce((total,item)=>total+item.revenue,0).toLocaleString()}</strong>
        <small>Sales revenue</small>
    </div>

    <div className="analytics-summary-card">
        <span>Total Profit</span>
        <strong>₹{analytics.reduce((total,item)=>total+item.profit,0).toLocaleString()}</strong>
        <small>Calculated profit</small>
    </div>
</div>

<div className="chart-card">
    <div className="chart-container">
        <Line data={revenueData} options={revenueOptions}/>
    </div>
</div>

<div className="chart-card">
    <div className="chart-container">
        <Line data={profitData} options={profitOptions}/>
    </div>
</div>

<div className="chart-card">
    <div className="chart-container">
        <Line data={salesData} options={salesOptions}/>
    </div>
</div>

<div className="chart-card">
    <div className="chart-container">
        <Bar data={inventoryData} options={inventoryOptions}/>
    </div>
</div>

            <div className="analytics-table">
                <h2>Daily Performance</h2>

                <table>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Sales</th>
                            <th>Revenue</th>
                            <th>Profit</th>
                        </tr>
                    </thead>

                    <tbody>
                        {analytics.map((item)=>(
                            <tr key={item.date}>
                                <td>{item.date}</td>
                                <td>{item.sales}</td>
                                <td>₹{item.revenue.toLocaleString()}</td>
                                <td>₹{item.profit.toLocaleString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Analytics