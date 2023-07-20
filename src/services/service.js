import TokenContract from '../abi/TokenContract.json'
import VotingContract from '../abi/VotingContract.json'

export const tokenContractInstance = (web3) => {
    return new web3.eth.Contract(
        TokenContract.abi,
        "0x4ffE419835e6e17E6695dea6Ca8557E78FF6E0c4"
    )
}
export const votingContractInstance = (web3) => {
    return new web3.eth.Contract(
        VotingContract.abi,
        "0x6cCf864161ba59f9bF72554EFf83ca1DbB6d937F"
    )
}