const { useEffect, useState } = require("react")

const Proposal = ({index, votingContract, web3}) => {
    const [proposalInfo, setInfo] = useState(null);
    useEffect(()=>{
        async function fetchData(){
            const proposal = await votingContract.methods.proposals(index).call();
            setInfo(proposal);
        }
    })
    return(
        <div>
            {proposalInfo && (
                <div> 
                     <p>{index}.{proposalInfo.description}</p>
                     {proposalInfo.timestamp > Math.floor(new Date().getTime() / 1000)} ? 
                     <div>
                        <button className="button is-primary">Agree</button>
                        <button className="button is-primary">Disagree</button>
                     </div>:<button className="button is-primary">Finalize</button>
                </div>
            )}
        </div>
    )
}