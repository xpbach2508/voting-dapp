const { useEffect, useState } = require("react")

const Proposal = ({index, votingContract, address, web3}) => {
    const [proposalInfo, setInfo] = useState(null);
    const [resultProposal, setResult] = useState(null);
    useEffect(()=>{
        async function fetchData(){
            const proposal = await votingContract.methods.proposals(index).call();
            setInfo(proposal);
            const result = await votingContract.methods.resultProposal(index).call();
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

    return (
        <div>
          {proposalInfo && (
            <div>
              <p>
                {id + 1} === {proposalInfo.description}
              </p>
              <div>
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
                      {Number(
                        Number(web3.utils.fromWei(proposalInfo.noCount, "ether"))
                      )}
                    </button>
                  </div>
                ) : (
                  <>
                    <button disabled={resultProposal!=0 ? true : false} onClick={handleFinalize} className=" button is-primary">
                      Finallize
                    </button>
                    <p className=" mt-3">{Number(resultProposal)==1 ? "Proposal accepted" : Number(resultProposal)==2 ?"Proposal denied":"" }</p>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      );
}
export default Proposal;