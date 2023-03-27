import { Button } from "antd";
import { useNavigate } from "react-router";

const ConditionCard = ({ name, gData}) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between bg-white rounded-md border border-gray-300 shadow-lg overflow-hidden mx-2 my-4 md:w-1/3 lg:w-1/4">
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg py-4 px-6 rounded-r-xl">
        {name} 
      </div>
      <div className="flex items-center pr-2 ">
        <Button onClick={()=>{
          navigate('/view_condition', { state: { gData } })
        }} type="primary">View</Button>
      </div>
    </div>
  );
};

export default ConditionCard;
