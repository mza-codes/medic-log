import { bg } from "../Assets";
import AddData from "../Components/Forms/AddData";


const AddRecord = () => {
    return (
        <main style={{ backgroundImage: `url(${bg})` }} className='w-full min-h-[94vh] bg-cover relative'>
            <section className="w-full py-4 bg-black bg-opacity-5 min-h-[94vh]">
                <h2 className="text-3xl font-semibold text-center my-3">Add Person Data</h2>
                <AddData />
            </section>
        </main>
    );
};

export default AddRecord;