import"./MLInsights.css"
import{Bar}from"react-chartjs-2"
import{
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
}from"chart.js"

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

function MLInsights({onBack}){
    const models=[
        {
            name:"Linear Regression",
            mae:67.43,
            rmse:100.94,
            r2:0.3429
        },
        {
            name:"Decision Tree",
            mae:29.97,
            rmse:72.87,
            r2:0.6576
        },
        {
            name:"Random Forest",
            mae:20.04,
            rmse:63.44,
            r2:0.7405
        },
        {
            name:"Gradient Boosting",
            mae:13.95,
            rmse:35.79,
            r2:0.9174
        },
        {
            name:"XGBoost",
            mae:20.08,
            rmse:46.25,
            r2:0.8621
        }
    ]

    const chartData={
        labels:models.map(model=>model.name),
        datasets:[
            {
                label:"R² Score",
                data:models.map(model=>model.r2)
            }
        ]
    }

    const chartOptions={
        responsive:true,
        maintainAspectRatio:false,
        scales:{
            y:{
                beginAtZero:true,
                max:1
            }
        }
    }

    return(
        <div className="ml-insights-page">
            <div className="ml-insights-header">
                <div>
                    <h1>ML Model Insights</h1>
                    <p>Demand prediction model comparison</p>
                </div>

                <button className="back-button" onClick={onBack}>
                    ← Back to Dashboard
                </button>
            </div>

            <div className="prototype-note">
                <strong>Prototype Evaluation</strong>
                <p>
                    These results were obtained during evaluation of the DIPRE
                    prototype using the synthetic dataset.
                </p>
            </div>

            <section className="model-summary">
                <div className="model-card">
                    <span>Models Compared</span>
                    <strong>5</strong>
                    <small>Regression models</small>
                </div>

                <div className="model-card">
                    <span>Best R²</span>
                    <strong>0.9174</strong>
                    <small>Gradient Boosting</small>
                </div>

                <div className="model-card">
                    <span>Best MAE</span>
                    <strong>13.95</strong>
                    <small>Gradient Boosting</small>
                </div>

                <div className="model-card">
                    <span>Best RMSE</span>
                    <strong>35.79</strong>
                    <small>Gradient Boosting</small>
                </div>
            </section>

            <section className="chart-panel">
                <h2>R² Score Comparison</h2>

                <div className="chart-wrapper">
                    <Bar data={chartData} options={chartOptions}/>
                </div>
            </section>

            <section className="table-panel">
                <h2>Model Performance</h2>

                <div className="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Model</th>
                                <th>MAE</th>
                                <th>RMSE</th>
                                <th>R²</th>
                            </tr>
                        </thead>

                        <tbody>
                            {models.map((model)=>(
                                <tr key={model.name}>
                                    <td>{model.name}</td>
                                    <td>{model.mae}</td>
                                    <td>{model.rmse}</td>
                                    <td>{model.r2}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default MLInsights
