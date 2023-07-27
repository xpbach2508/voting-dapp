const { useEffect, useState } = require("react")

const Proposal = ({id, votingContract, address, web3}) => {
    const [proposalInfo, setInfo] = useState(null);
    const [resultProposal, setResult] = useState(null);
    const [hasVoted, setVoteState] = useState(null);

    useEffect(()=>{
        async function fetchData(){
            const proposal = await votingContract.methods.proposals(id).call();
            setInfo(proposal);
            const result = await votingContract.methods.resultProposal(id).call();
            setResult(result);
            const votingState = await votingContract.methods.hasVotedForProposal(address, id).call();
            setVoteState(votingState);
        }
        const interval = setInterval(() => {
            fetchData();
          }, 10000);
      
          return () => clearInterval(interval);
    })

    
    async function handleVote(value) {
        await votingContract.methods.castVote(id, value).send({
            from:address,
        })
    }

    async function handleFinalize(){
        await votingContract.methods.finalizeProposal(id).send({
            from: address,
        })
    }

    return (
        <div>
          {proposalInfo && (
            <div>
              <p>
                {id + 1} === {proposalInfo.description}
              </p>
              <div>
                {hasVoted ? (<p>Already voted</p>) : (<p>Hasn't voted yet</p>)}
                {proposalInfo.timestamp >
                Math.floor(new Date().getTime() / 1000) ? (
                  <div>
                    <button
                      onClick={() => handleVote(true)}
                      className=" button is-primary mt-3 mr-5"
                    >
                      Agree :{" "}
                      {Number(web3.utils.fromWei(proposalInfo.yesCount, "ether"))}
                    </button>
                    <button
                      onClick={() => handleVote(false)}
                      className=" button is-primary mt-3"
                    >
                      {" "}
                      Disagree :
                      {Number(web3.utils.fromWei(proposalInfo.noCount, "ether"))}
                    </button>
                  </div>
                ) : (
                  <>
                    <button disabled={resultProposal!=0 ? true : false} onClick={handleFinalize} className=" button is-primary">
                      Finallize
                    </button>
                    <p className=" mt-3">{resultProposal==true ? "Proposal accepted" : resultProposal==false ?"Proposal denied":"" }</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      );
}
export default Proposal;