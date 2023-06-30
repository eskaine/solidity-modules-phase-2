# Build charts with data retrieved with Ethereum Client

## Setup Frontend

1. npm install
2. add a .env file with "ALCHEMY_API_KEY"
3. run "npm run dev"
4. Go to your browser at http://localhost:3000

## Deliverables

Use a lookback of 10 blocks for all three charts so the chart isn’t empty when the page loads.

- The first chart is to monitor the logs of an arbitrary ERC20 token address you provide. For each block that passes, plot the total volume of the transfers (if any). Test this on more popular ERC20 tokens.
- The second chart is the BASEFEE of each block. So the X-axis is the block number, and the Y-axis is the BASEFEE. If you aren’t sure what that is, watch the Gas Savings EIP 1559 video.
- The third chart is the ratio of gasUsed over gasLimit (plot this as a percentage). What do you notice about the relationship between this ratio and the BASEFEE?
