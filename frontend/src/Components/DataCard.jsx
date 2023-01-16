
const DataCard = ({ data }) => (

    <div className='bg-black bg-opacity-60 text-white flex flex-col gap-2 text-start text-2xl rounded-lg
            pl-4 p-4 min-w-[300px] max-w-[480px]'>

        <h2 className="text-lg">Name: {data?.name} </h2>
        <h4 className="text-base">City: {data?.city} </h4>
        <h3 className="text-sm">Age: {data?.age} </h3>

        <h4 className="text-xs">LastCheckup: {new Date(data?.lastCheckup?.[0]).toLocaleDateString()} </h4>
    </div>
);

export default DataCard;