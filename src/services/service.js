import TokenContract from '../abi/TokenContract.json'
import VotingContract from '../abi/VotingContract.json'

export const tokenContractInstance = (web3) => {
    return new web3.eth.Contract(
        TokenContract.abi,
        "0x590e5Fe63d037dd37ebe7b5e6F63579A38F451aE"
    )
}
export const votingContractInstance = (web3) => {
    return new web3.eth.Contract(
        VotingContract.abi,
        "0x4b98bb722785faD57818F0B5214681c813D34b19"
    )
}