import { useEffect, useState } from "react";

const Proposal = ({ id, votingContract, address, web3 }) => {
  const [proposalInfo, setProposalInfo] = useState(null);
  const [resultProposal, setResult] = useState(0);
  const [votingState, setState] = useState(0);

  useEffect(() => {
    async function fetchData() {
      console.log("🚀 ~ file: Proposal.js:9 ~ fetchData ~ id", id)
      const proposal = await votingContract.methods.proposals(id).call();
      setProposalInfo(proposal);

      const voteState = await votingContract.methods.hasVotedForProposal(address, id).call();
      setState(voteState);

      const result = await votingContract.methods.resultProposal(id).call();
      setResult(result);
    }

    const interval = setInterval(() => {
      fetchData();
    }, 3000);

    return () => clearInterval(interval);
  });

  async function handleVote(value) {
    await votingContract.methods.castVote(id, value).send({
        from:address,
    })
}

  async function handleFinalize() {
    await votingContract.methods.finalizeProposal(id).send({
      from: address,
    });
  }

  function isEnded() {
    return proposalInfo.timestamp < Math.floor(new Date().getTime() / 1000);
  }

  function getDate() {
    return new Date(Number(proposalInfo.timestamp)*1000).toLocaleString();
  }

  return (
    <>
      {proposalInfo && (
        <div className="column is-3">
          <div className="card ">
            <header className="card-header has-background-light">
              <p className="card-header-title">[#{id + 1}] {getDate()}</p>
            </header>
            <div className="card-content">
              <div className="content is-flex is-flex-direction-column">
                <p>{proposalInfo.description}</p>
                <hr/>
                <div className="is-align-self-center">
                {!isEnded() ? (
                <>
                {votingState ? (
                <>
                <button disabled = {true} className="button is-success mx-1">
                    Agreed: {Number(web3.utils.fromWei(proposalInfo.yesCount, "ether"))}
                  </button>
                  <button disabled={true} className="button is-danger mx-1">
                    Disagreed: {Number(web3.utils.fromWei(proposalInfo.noCount, "ether"))}
                  </button>
                </>) :
                (
                  <>
                  <button onClick={() => handleVote(true)} className="button is-success mx-1">
                    Agreed: {Number(web3.utils.fromWei(proposalInfo.yesCount, "ether"))}
                  </button>
                  <button onClick={() => handleVote(false)} className="button is-danger mx-1">
                    Disagreed: {Number(web3.utils.fromWei(proposalInfo.noCount, "ether"))}
                  </button>
                  </>
                )}
                </>

                ) : (
                  <button onClick={handleFinalize} className="button is-info" disabled={resultProposal != 0}>
                    Finalize
                  </button>
                )}
                </div>
              </div>
            </div>
            {isEnded() ? (
              resultProposal == 0 ? (
                <footer className="card-footer has-background-warning-light">
                  <p className="card-footer-item"> In progressing </p>
                </footer>
              ) : resultProposal == 1 ? (
                <footer className="card-footer has-background-success-light">
                  <p className="card-footer-item has-text-success"> Proposal accepted </p>
                </footer>
              ) : (
                <footer className="card-footer has-background-danger-light">
                  <p className="card-footer-item has-text-danger"> Proposal denied </p>
                </footer>
              )
            ) : (
              <footer className="card-footer has-background-warning-light">
                <p className="card-footer-item"> In progressing </p>
              </footer>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Proposal;
