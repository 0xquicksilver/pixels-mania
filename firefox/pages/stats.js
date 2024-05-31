
function initStats(player) {
   try {
    var vip = Object.keys(player.memberships).some((key)=> key === 'vip')
    var coins = player.coinInventory.find((coin)=> coin.currencyId === 'cur_coins')?.balance
    var pixel = player.coinInventory.find((coin)=> coin.currencyId === 'cur_pixel')?.balance
    var trustScore = Number(player.trustScore).toFixed(3)
    const stats = document.createElement('div')
    stats.className = nodeNames.pixel_mania_stats.replace('.','')
    stats.innerHTML = `<div><span>username</span><span>${player.username}</span></div><div><span>vip</span><span>${vip ? 'yes': 'no'}</span></div><div><span>coins</span><span>${Number(coins).toLocaleString('en-US')}</span></div><div><span>pixels</span><span>${Number(pixel).toLocaleString('en-US')}</span></div><div><span>trust Score</span><span>${trustScore}</span></div>`
    document.querySelector(nodeNames.pixel_mania_sidebar_content).appendChild(stats)
   } catch (error) {
    console.log(error.message)
   }
}

function removeStats() {
    document.querySelector(nodeNames.pixel_mania_stats)?.remove()
}