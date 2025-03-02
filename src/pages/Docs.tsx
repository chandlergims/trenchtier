import '../styles/Docs.css'

function Docs() {
  return (
    <div className="docs-page">
      <div className="container">
        <div className="docs-content">
          <section className="docs-section">
            <div className="section-header">
              <h2>Leaderboard</h2>
              <div className="section-line"></div>
            </div>
            <div className="content-block">
              <div className="block-header">
                <h3>Overview</h3>
                <div className="header-accent"></div>
              </div>
              <p>
                The leaderboard showcases the top traders in our community, specifically those who hold our token. 
                It tracks trading performance across different time periods and automatically rewards the best performers.
              </p>

              <div className="block-header">
                <h3>PnL Tracking</h3>
                <div className="header-accent"></div>
              </div>
              <p>
                We integrate with GMGN's API to accurately track trading performance:
              </p>
              <ul>
                <li>
                  <strong>24-Hour Performance:</strong> Real-time PnL tracking for the most recent trading activity
                </li>
                <li>
                  <strong>7-Day Performance:</strong> Weekly performance metrics combining daily trading data
                </li>
                <li>
                  <strong>30-Day Performance:</strong> Monthly performance tracking for long-term consistency
                </li>
              </ul>

              <div className="block-header">
                <h3>Wallet Connection & Payouts</h3>
                <div className="header-accent"></div>
              </div>
              <p>
                Our platform is designed for simplicity and security:
              </p>
              <ul>
                <li><strong>No Phantom Wallet Connection Required:</strong> You don't need to connect your Phantom wallet to participate</li>
                <li><strong>Simple Registration:</strong> Just provide your wallet address during team registration</li>
                <li><strong>Automatic Payouts:</strong> Prizes are paid out automatically from the leaderboard to your registered address</li>
                <li><strong>Your Best Interest:</strong> It's in your best interest to provide your correct wallet address if you want to receive payouts</li>
              </ul>

              <div className="block-header">
                <h3>Token Holder Verification</h3>
                <div className="header-accent"></div>
              </div>
              <p>
                Before including a trader's performance in the leaderboard:
              </p>
              <ul>
                <li>We verify token holdings through real-time blockchain queries</li>
                <li>Monitor wallet balances to ensure continuous token holding during the competition period</li>
                <li>Cross-reference GMGN trading activity with token holding status</li>
                <li>Only wallets holding our token are eligible for leaderboard inclusion and rewards</li>
              </ul>

              <div className="block-header">
                <h3>Prize Distribution</h3>
                <div className="header-accent"></div>
              </div>
              <p>
                The top 15 traders on the leaderboard receive automatic rewards at the end of each period. 
                Prize pools vary by time period:
              </p>
              <ul>
                <li><strong>24-Hour Pool:</strong> $2,000 total prize pool</li>
                <li><strong>7-Day Pool:</strong> $5,000 total prize pool</li>
                <li><strong>30-Day Pool:</strong> $10,000 total prize pool</li>
              </ul>

              <div className="block-header">
                <h3>Reward Distribution</h3>
                <div className="header-accent"></div>
              </div>
              <p>
                Prizes are distributed among the top 15 positions as follows:
              </p>
              <ul>
                <li>1st Place: 25% of prize pool</li>
                <li>2nd Place: 15% of prize pool</li>
                <li>3rd Place: 12% of prize pool</li>
                <li>4th Place: 9% of prize pool</li>
                <li>5th Place: 8% of prize pool</li>
                <li>6th Place: 6% of prize pool</li>
                <li>7th Place: 5% of prize pool</li>
                <li>8th Place: 4% of prize pool</li>
                <li>9th-10th Place: 3% each</li>
                <li>11th-12th Place: 2.5% each</li>
                <li>13th-15th Place: 2% each</li>
              </ul>
              <div className="block-header">
                <h3>Reward Distribution Process</h3>
                <div className="header-accent"></div>
              </div>
              <p>
                At the end of each period, the following process occurs:
              </p>
              <ul>
                <li>A snapshot of the final leaderboard standings is taken</li>
                <li>Token holdings are verified for each winner</li>
                <li>Only users holding our tokens at the time of snapshot are eligible for rewards</li>
                <li>Rewards are automatically sent to eligible winners' wallets</li>
              </ul>
              <p>
                Only the top 15 positions receive rewards, incentivizing competitive trading and rewarding 
                consistent performance.
              </p>
            </div>
          </section>

          {/* Tournament section removed as requested */}
        </div>
      </div>
    </div>
  )
}

export default Docs
