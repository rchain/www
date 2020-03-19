var express = require('express');
var router = express.Router();
var request = require('request');
var apiCache = require('apicache')

const MAINNET_OBSERVER = "https://observer.services.mainnet.rchain.coop"
// the total supply of the rchain mainnet is fixed
const TOTAL_SUPPLY = 870663574.00
const REV_TO_PHLO = 100000000
const CIRCULATION_CACHE_TIMEOUT = '1 day'
const BALANCE_CACHE_TIMEOUT = '5 minutes'

var cache = apiCache.options({
  statusCodes: {
    exclude: [500, 400]
  }
})

const totalCirculationQuery = `
new return, rl(\`rho:registry:lookup\`), listOpsCh, RevVaultCh in{
  rl!(\`rho:rchain:revVault\`, *RevVaultCh) |
  rl!(\`rho:lang:listOps\`, *listOpsCh) |
  for (@(_, RevVault) <- RevVaultCh;
       @(_, ListOps) <- listOpsCh){
    new checkBalance, coopAddressesCh, balancesCh, sum, coopTotalCh in{
      contract checkBalance(addr, ret) = {
        new vaultCh, balanceCh in {
          @RevVault!("findOrCreate", *addr, *vaultCh) |
          for (@(true, vault) <- vaultCh){
            @vault!("balance", *balanceCh) |
            for (@balance <- balanceCh){
              ret!(balance)
            }
          }
        }
      } |
      contract sum(@a, @b, ret) = {
        ret!(a + b)
      }|
      coopAddressesCh!([
        "11112GNiZeEQkMcSHRFgWbYvRuiKAN4Y44Jd1Ld6taFsGrw5JNHLtX", // coopSaleAddr
        "111126JvMwXfDi6sBQNVwvSSNCMpXapTFTD1poQVzh7mzhN3WWn4kF", // coopTreasuryAddr
        "1111zQqAW8zJxiAbPwtSi48WCHiQem5hBxkh3DLY7fe8V1Z947Uc4", // coopResearchAddr
        "11112We8VJbQw7uvKUqvNc6L8X4EzC2yHHabRVZQC4J7M3vqf1b3yG", // coopReserveAddr
        "11112DnHZWMxhRQH6AdfF1fh3VZbH5NW7wiq8xEsRy2DgczR5Yzsrd", // coopDeploymentAddr
        "1111V2DFLhSTYyDGwukVeYkoB3sHwEo78HviZsF8T8XxxRdLQ5j5P" // POSAddr
      ]) |
      for (@coopAddresses <- coopAddressesCh){
        @ListOps!("parMap", coopAddresses, *checkBalance, *balancesCh)|
        for(@balances <- balancesCh){
          @ListOps!("fold", balances, 0, *sum, *coopTotalCh)|
          for (@coopTotalBalance <- coopTotalCh){
            match (
              100000000000000000, // Original Mint
              12933642600000000  //  Burn
            ){
              (originMint, burned) => {
                return!(originMint - burned - coopTotalBalance)
              }
            }
          }
        }
      }
    }
  }
} 
`

function balanceQuery (address) {
  var query = `
new return, rl(\`rho:registry:lookup\`), RevVaultCh, vaultCh, balanceCh in {
  rl!(\`rho:rchain:revVault\`, *RevVaultCh) |
  for (@(_, RevVault) <- RevVaultCh) {
    @RevVault!("findOrCreate", "$addr", *vaultCh) |
    for (@(true, vault) <- vaultCh) {
      @vault!("balance", *balanceCh) |
      for (@balance <- balanceCh) {
        return!(balance)
      }
    }
  }
}`
  return query.replace("$addr", address)
}

router.get('/total-supply', function (req, res, next) {
  res.json(TOTAL_SUPPLY);
});

router.get('/total-circulation', cache.middleware(CIRCULATION_CACHE_TIMEOUT), function (req, res, next) {
  request.post(MAINNET_OBSERVER + '/api/explore-deploy', { body: totalCirculationQuery }, (err, resp, body) => {
    if (resp.statusCode != 200) {
      res.send(resp.statusCode)
    } else {
      try {
        const result = JSON.parse(body)
        const circulation = result['expr'][0]['ExprInt']['data'] / REV_TO_PHLO
        res.json(circulation)
      }
      catch{
        res.send(500)
      }
    }
  })
});

router.get('/balance/:address', cache.middleware(BALANCE_CACHE_TIMEOUT), function (req, res, next) {
  const query = balanceQuery(req.params.address)
  request.post(MAINNET_OBSERVER + '/api/explore-deploy', { body: query }, (err, resp, body) => {
    if (resp.statusCode != 200) {
      res.send(resp.statusCode)
    } else {
      try {
        const result = JSON.parse(body)
        const balance = result['expr'][0]['ExprInt']['data'] / REV_TO_PHLO
        res.json(balance)
      } catch{
        res.json(0)
      }
    }
  })
});


module.exports = router;