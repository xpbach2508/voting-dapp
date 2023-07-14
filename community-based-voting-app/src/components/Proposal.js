const { useEffect, useState } = require("react")

const Proposal = ({index, votingContract, web3}) => {
    const [proposalInfo, setInfo] = useState(null);
    const [proposalResult, setResult] = useState(null);
    useEffect(()=>{
        async function fetchData(){
            const proposal = await votingContract.methods.proposals(index).call();
            setInfo(proposal);
            const result = await votingContract.methods.result(index).call();
            setResult(result);
        }
        const interval = setInterval(() => {
            fetchData();
          }, 10000);
      
          return () => clearInterval(interval);
    })

    async function handleVote(value) {
        await votingContract.methods.castVote(index, value).send({
            from:address,
        })
    }

    async function handleFinalize(){
        await votingContract.methods.finalizeProposal(index).send({
            from: address,
        })
    }

    return(
        <div>
            {proposalInfo && (
                <div> 
                     <p>{index}.{proposalInfo.description}</p>
                     {proposalInfo.timestamp > Math.floor(new Date().getTime() / 1000) ? 
                     <div>
                        <button onClick={() => handleVote(true)} className="button is-primary">Agree: {proposalInfo.yesCount}</button>
                        <button onClick={() => handleVote(false)} className="button is-primary">Disagree: {proposalInfo.noCount}</button>
                     </div>:(
                     <button onClick={handleFinalize}className="button is-primary">Finalize</button>
                     )}
                </div>
            )}
        </div>
    )
}