import { Button } from "antd";
import { useNavigate } from "react-router";


const EscrowCard = ({ escrowId, receiver, amount, conditionFlow, isPast }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-md border border-gray-300 shadow-lg overflow-hidden mx-2 my-4 md:w-1/3 lg:w-1/4">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg py-4 px-6">
        {escrowId}
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-gray-800 mb-2">Receiver: {receiver}</div>
        <div className="flex items-center justify-between">
          <div className="text-gray-700 mr-2">{ parseInt(amount)/1000000} XRP</div>
        </div>
        <div className="flex items-center justify-between">
        <div className="text-gray-700">{conditionFlow}</div>
        {!isPast && ( <Button type="primary" onClick={()=>{
          navigate(`/view_Condition/${escrowId}`)
        }} >View</Button>)}
        </div>
      </div>
    </div>
  );
};

export default EscrowCard;
