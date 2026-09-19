import"./DecisionLogic.css"

function DecisionLogic({onBack}){
    return(
        <div className="decision-page">
            <div className="decision-header">
                <div>
                    <h1>ML Decision Logic</h1>
                    <p>How DIPRE generates dynamic pricing recommendations</p>
                </div>

                <button className="back-button" onClick={onBack}>
                    ← Back to Dashboard
                </button>
            </div>

            <section className="decision-intro">
                <h2>Dynamic Pricing Pipeline</h2>
                <p>
                    DIPRE combines machine learning demand prediction with
                    inventory and market signals to generate a pricing action.
                </p>
            </section>

            <section className="pipeline">
                <div className="pipeline-card">
                    <div className="pipeline-number">1</div>
                    <h3>Product & Market Data</h3>
                    <p>
                        Product price, competitor price, previous sales,
                        customer rating, discount, promotion and seasonality.
                    </p>
                </div>

                <div className="pipeline-arrow">↓</div>

                <div className="pipeline-card">
                    <div className="pipeline-number">2</div>
                    <h3>Demand Prediction</h3>
                    <p>
                        The Gradient Boosting model predicts expected product
                        demand from the available features.
                    </p>
                </div>

                <div className="pipeline-arrow">↓</div>

                <div className="pipeline-card">
                    <div className="pipeline-number">3</div>
                    <h3>Inventory Analysis</h3>
                    <p>
                        Predicted demand is compared with current inventory
                        to identify low-stock, balanced and excess-stock
                        situations.
                    </p>
                </div>

                <div className="pipeline-arrow">↓</div>

                <div className="pipeline-card">
                    <div className="pipeline-number">4</div>
                    <h3>Market Analysis</h3>
                    <p>
                        The current price is compared with the competitor
                        price to identify competitive pricing conditions.
                    </p>
                </div>

                <div className="pipeline-arrow">↓</div>

                <div className="pipeline-card">
                    <div className="pipeline-number">5</div>
                    <h3>Pricing Decision</h3>
                    <p>
                        DIPRE applies the pricing decision rules to generate
                        a RAISE, HOLD or LOWER recommendation.
                    </p>
                </div>
            </section>

            <section className="rules-section">
                <h2>Pricing Decision Rules</h2>

                <div className="rule-grid">
                    <div className="rule-card raise">
                        <div className="rule-title">RAISE</div>
                        <p>
                            Applied when predicted demand is high and the
                            current price is below the competitor price.
                        </p>
                    </div>

                    <div className="rule-card lower">
                        <div className="rule-title">LOWER</div>
                        <p>
                            Applied when the current price is above the
                            competitor price with weak demand, or when
                            demand is low or inventory is excessive.
                        </p>
                    </div>

                    <div className="rule-card hold">
                        <div className="rule-title">HOLD</div>
                        <p>
                            Applied when demand, inventory and market
                            conditions are balanced.
                        </p>
                    </div>
                </div>
            </section>

            <section className="profit-section">
                <h2>Expected Profit</h2>

                <div className="formula">
                    Expected Profit =
                    (Recommended Price − Cost Price)
                    × Expected Units Sold
                </div>

                <p>
                    Expected units sold are limited by available inventory
                    and predicted demand.
                </p>
            </section>
        </div>
    )
}

export default DecisionLogic