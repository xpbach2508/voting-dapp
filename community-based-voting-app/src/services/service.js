import TokenContract from '../abi/TokenContract.json'
import VotingContract from '../abi/VotingContract.json'

export const tokenContractInstance = (web3) => {
    return new web3.eth.Contract(
        TokenContract.abi,
        "0xb5C38877Fde2E869355423C2c9933A71686652Bf"
    )
}
export const votingContractInstance = (web3) => {
    return new web3.eth.Contract(
        VotingContract.abi,
        "0xB658A19e05cddc6512b0A6938a66095435865D0c"
    )
}