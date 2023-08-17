import TokenContract from '../abi/TokenContract.json'
import VotingContract from '../abi/VotingContract.json'

export const tokenContractInstance = (web3) => {
    return new web3.eth.Contract(
        TokenContract.abi,
        "0x94C90f2Ce2E06D93f2874280c0dD6BFDD43748DB"
    )
}
export const votingContractInstance = (web3) => {
    return new web3.eth.Contract(
        VotingContract.abi,
        "0x155cCc5D0df60b6Db62E00A50119a95edA6d65ae"
    )
}