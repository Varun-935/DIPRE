import{useEffect,useState}from"react"
import"./PricingHistory.css"

function PricingHistory({onBack}){
    const[history,setHistory]=useState([])
    const[loading,setLoading]=useState(true)
    const[error,setError]=useState("")

    useEffect(()=>{
        fetchHistory()
    },[])

    const fetchHistory=async()=>{
        try{
            const response=await fetch("http://127.0.0.1:8000/pricing-recommendations/history")

            if(!response.ok){
                throw new Error("Failed to fetch pricing history")
            }

            const data=await response.json()
            setHistory(data)
        }catch(error){
            setError("Unable to load pricing history")
        }finally{
            setLoading(false)
        }
    }

    const formatDate=(date)=>{
        return new Date(date).toLocaleString("en-IN",{
            day:"2-digit",
            month:"short",
            year:"numeric",
            hour:"2-digit",
            minute:"2-digit"
        })
    }

    return(
        <div className="pricing-history-page">
            <div className="pricing-history-header">
                <div>
                    <h1>Pricing History</h1>
                    <p>Previous dynamic pricing recommendations</p>
                </div>

                <button className="back-button" onClick={onBack}>
                    ← Back to Dashboard
                </button>
            </div>

            {loading&&(
                <div className="history-message">
                    Loading pricing history...
                </div>
            )}

            {error&&(
                <div className="history-error">
                    {error}
                </div>
            )}

            {!loading&&!error&&history.length===0&&(
                <div className="history-message">
                    No pricing recommendations found.
                </div>
            )}

            {!loading&&!error&&history.length>0&&(
                <div className="history-table-container">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Product ID</th>
                                <th>Current Price</th>
                                <th>Recommended Price</th>
                                <th>Action</th>
                                <th>Expected Profit</th>
                                <th>Reason</th>
                            </tr>
                        </thead>

                        <tbody>
                            {history.map((item)=>(
                                <tr key={item.id}>
                                    <td>{formatDate(item.created_at)}</td>
                                    <td>#{item.product_id}</td>
                                    <td>₹{item.current_price.toLocaleString("en-IN")}</td>
                                    <td>₹{item.recommended_price.toLocaleString("en-IN")}</td>
                                    <td>
                                        <span className={`action-badge ${item.action.toLowerCase()}`}>
                                            {item.action}
                                        </span>
                                    </td>
                                    <td>₹{item.expected_profit.toLocaleString("en-IN")}</td>
                                    <td>{item.reason}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    )
}

export default PricingHistory